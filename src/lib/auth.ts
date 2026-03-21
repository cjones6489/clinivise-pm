import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { users, organizations } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { UserRole } from "@/lib/constants";

/**
 * Dev-only: auto-provision org + user from Clerk session.
 * In production, the Clerk webhook handles this sync.
 */
async function devAutoProvision(clerkUserId: string, clerkOrgId: string) {
  if (process.env.NODE_ENV !== "development") return null;

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
        name: "Bright Futures ABA",
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

  // Upsert user as owner
  let [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, clerkUserId), eq(users.organizationId, org.id)))
    .limit(1);

  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        clerkUserId,
        organizationId: org.id,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? "dev@clinivise.com",
        firstName: clerkUser.firstName ?? "Dev",
        lastName: clerkUser.lastName ?? "User",
        role: "owner",
      })
      .returning();
  }

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
    // Dev: auto-provision org + user on first sign-in
    return devAutoProvision(userId, orgId);
  }

  // Then look up user with the internal org ID
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, userId), eq(users.organizationId, org.id)))
    .limit(1);

  if (!user) {
    // Dev: auto-provision user for existing org
    return devAutoProvision(userId, orgId);
  }

  return user;
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
