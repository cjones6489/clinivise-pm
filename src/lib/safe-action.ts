import "server-only";

import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/auth";
import { AppError, UnauthorizedError, NotFoundError } from "@/lib/errors";

const DEFAULT_SERVER_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    // All AppError subclasses are user-safe by definition
    if (e instanceof AppError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new UnauthorizedError();
  }

  // Reuse getCurrentUser which handles dev auto-provisioning
  const user = await getCurrentUser();

  if (!user) {
    throw new NotFoundError("User");
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
