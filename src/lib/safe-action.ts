import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/auth";

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
  "Authorization not found",
  "Client insurance not found",
  "Cannot remove service lines that have recorded usage",
  "Session not found",
  "Invalid status transition",
  "Cannot reverse more units than are recorded",
  "Provider not active",
  "Authorization service not found",
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

  // Reuse getCurrentUser which handles dev auto-provisioning
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found in this organization");
  }

  return next({
    ctx: {
      userId: user.id,
      organizationId: user.organizationId,
      userRole: user.role,
      clerkUserId: userId,
      clerkOrgId: orgId,
    },
  });
});
