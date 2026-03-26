import "server-only";

import { db } from "@/server/db";
import { users, providers } from "@/server/db/schema";
import { eq, and, isNull, sql } from "drizzle-orm";

export type TeamMember = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  status: string;
  credentialType: string | null;
  lastActiveAt: Date | null;
  invitedAt: Date | null;
  createdAt: Date;
};

export async function getTeamMembers(orgId: string): Promise<TeamMember[]> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      status: users.status,
      credentialType: providers.credentialType,
      lastActiveAt: users.lastActiveAt,
      invitedAt: users.invitedAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .leftJoin(
      providers,
      and(
        eq(providers.userId, users.id),
        eq(providers.organizationId, users.organizationId),
        isNull(providers.deletedAt),
      ),
    )
    .where(eq(users.organizationId, orgId))
    .orderBy(users.createdAt);

  return rows;
}

export async function getTeamMemberCount(orgId: string): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(and(eq(users.organizationId, orgId), eq(users.status, "active")));

  return result?.count ?? 0;
}
