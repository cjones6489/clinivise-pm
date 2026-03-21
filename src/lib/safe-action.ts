import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users, organizations } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong. Please try again.";

/** Error messages safe to surface to the client as-is. */
const USER_FACING_ERRORS = new Set([
  "Unauthorized",
  "Forbidden: insufficient role",
  "Provider not found",
  "Supervisor not found",
  "Client not found",
  "Contact not found",
  "BCBA not found",
  "Insurance policy not found",
  "Payer not found",
  "Cannot delete payer with active insurance policies",
  "Maximum of 3 insurance policies allowed",
  "Cannot verify an expired insurance policy",
  "Organization not found",
  "User not found in this organization",
]);

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (USER_FACING_ERRORS.has(e.message)) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Look up org first so we can scope the user query
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, orgId))
    .limit(1);

  if (!org) {
    throw new Error("Organization not found");
  }

  // Filter user by BOTH clerkUserId AND organizationId to prevent cross-tenant leakage
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, userId), eq(users.organizationId, org.id)))
    .limit(1);

  if (!user) {
    throw new Error("User not found in this organization");
  }

  return next({
    ctx: {
      userId: user.id,
      organizationId: org.id,
      userRole: user.role,
      clerkUserId: userId,
      clerkOrgId: orgId,
    },
  });
});
