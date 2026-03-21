import "server-only";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users, organizations } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { UserRole } from "@/lib/constants";

export async function getCurrentUser() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  // Resolve Clerk orgId to internal organization ID first
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, orgId))
    .limit(1);

  if (!org) return null;

  // Then look up user with the internal org ID
  const [user] = await db
    .select()
    .from(users)
    .where(
      and(eq(users.clerkUserId, userId), eq(users.organizationId, org.id)),
    )
    .limit(1);

  return user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}
