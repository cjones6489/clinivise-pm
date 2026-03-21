import "server-only";

import { db } from "@/server/db";
import { providers } from "@/server/db/schema";
import { eq, and, isNull, inArray, ne } from "drizzle-orm";

export type Provider = typeof providers.$inferSelect;

function scopedWhere(orgId: string) {
  return and(eq(providers.organizationId, orgId), isNull(providers.deletedAt));
}

export async function getProviders(orgId: string): Promise<Provider[]> {
  return db
    .select()
    .from(providers)
    .where(scopedWhere(orgId))
    .orderBy(providers.lastName, providers.firstName);
}

export async function getProviderById(orgId: string, id: string): Promise<Provider | null> {
  const [provider] = await db
    .select()
    .from(providers)
    .where(and(scopedWhere(orgId), eq(providers.id, id)))
    .limit(1);
  return provider ?? null;
}

export type SupervisorOption = {
  id: string;
  firstName: string;
  lastName: string;
  credentialType: string;
};

export async function getSupervisorOptions(
  orgId: string,
  excludeId?: string,
): Promise<SupervisorOption[]> {
  const conditions = [
    scopedWhere(orgId),
    inArray(providers.credentialType, ["bcba", "bcba_d"]),
    eq(providers.isActive, true),
  ];

  if (excludeId) {
    conditions.push(ne(providers.id, excludeId));
  }

  return db
    .select({
      id: providers.id,
      firstName: providers.firstName,
      lastName: providers.lastName,
      credentialType: providers.credentialType,
    })
    .from(providers)
    .where(and(...conditions))
    .orderBy(providers.lastName, providers.firstName);
}
