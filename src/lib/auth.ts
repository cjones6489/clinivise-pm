import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users, organizations } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { UserRole } from "@/lib/constants";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";

/**
 * Auto-provision org + user from Clerk session on first sign-in.
 * Creates the org and user records if they don't exist yet.
 * First user in an org gets the "owner" role.
 */
async function autoProvision(clerkUserId: string, clerkOrgId: string) {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Upsert organization
  let [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, clerkOrgId))
    .limit(1);

  if (!org) {
    [org] = await db
      .insert(organizations)
      .values({
        clerkOrgId,
        name: "My Practice",
        npi: null,
        taxId: null,
        phone: null,
        email: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        state: null,
        zipCode: null,
        taxonomyCode: null,
        stediApiKey: null,
      })
      .returning();
  }

  if (!org) return null;

  // Check if user already exists (match by email + org for invited users)
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
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

  // Create new user — first user in org gets owner role
  const [existingMembers] = await db
    .select({ count: eq(users.organizationId, org.id) })
    .from(users)
    .where(eq(users.organizationId, org.id))
    .limit(1);

  const isFirstUser = !existingMembers;

  [user] = await db
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
