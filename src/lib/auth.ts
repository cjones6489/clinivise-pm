import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users, organizations } from "@/server/db/schema";
import { eq, and, count } from "drizzle-orm";
import type { UserRole } from "@/lib/constants";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

/**
 * Auto-provision user from Clerk session on first sign-in.
 * Links Clerk users to internal DB records.
 * Org must already exist (created via webhook or admin).
 * First user in an org gets the "owner" role.
 */
async function autoProvision(clerkUserId: string, clerkOrgId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Look up organization — must already exist (created via Clerk webhook or admin)
  let [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, clerkOrgId))
    .limit(1);

  // If org doesn't exist yet, create a placeholder (webhook may not have fired yet)
  if (!org) {
    [org] = await db
      .insert(organizations)
      .values({
        clerkOrgId,
        name: "My Practice",
      })
      .returning();
  }

  if (!org) return null;

  // Check if user already exists (match by email + org for invited users)
  // Use primaryEmailAddress (Clerk's designated primary), not emailAddresses[0] (creation order)
  const email = (clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "").toLowerCase();
  let [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.organizationId, org.id)))
    .limit(1);

  if (user) {
    // Link invited user to their Clerk account and activate
    if (!user.clerkUserId || user.status === "invited") {
      await db
        .update(users)
        .set({
          clerkUserId,
          firstName: clerkUser.firstName ?? user.firstName,
          lastName: clerkUser.lastName ?? user.lastName,
          status: "active",
          isActive: true,
        })
        .where(eq(users.id, user.id));
      // Re-fetch to get updated fields
      [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
    }
    return user ?? null;
  }

  // Create new user in a transaction with FOR UPDATE on org to prevent
  // race condition where two simultaneous first-users both get "owner" role
  [user] = await db.transaction(async (tx) => {
    // Lock the org row to serialize concurrent first-user creation
    await tx
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.id, org.id))
      .for("update");

    const [memberCount] = await tx
      .select({ count: count() })
      .from(users)
      .where(eq(users.organizationId, org.id));

    const isFirstUser = (memberCount?.count ?? 0) === 0;

    const [newUser] = await tx
      .insert(users)
      .values({
        clerkUserId,
        organizationId: org.id,
        email,
        firstName: clerkUser.firstName ?? null,
        lastName: clerkUser.lastName ?? null,
        role: isFirstUser ? "owner" : "rbt",
        status: "active",
      })
      .returning();

    return [newUser];
  });

  return user ?? null;
}

export async function getCurrentUser() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  // Resolve Clerk orgId to internal organization ID first
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, orgId))
    .limit(1);

  if (!org) {
    // New org — auto-provision on first sign-in
    return autoProvision(userId, orgId);
  }

  // Look up user by Clerk ID
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, userId), eq(users.organizationId, org.id)))
    .limit(1);

  if (!user) {
    // New user in existing org — auto-provision (handles invited user linking too)
    return autoProvision(userId, orgId);
  }

  // Block deactivated and invited-but-not-yet-active users
  if (user.status !== "active") {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new ForbiddenError();
  }
  return user;
}
