import "server-only";

import { db } from "@/server/db";
import { payers } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export type Payer = typeof payers.$inferSelect;

export async function getPayers(orgId: string): Promise<Payer[]> {
  return db
    .select()
    .from(payers)
    .where(and(eq(payers.organizationId, orgId), eq(payers.isActive, true)))
    .orderBy(payers.name);
}

export async function getPayerById(orgId: string, id: string): Promise<Payer | null> {
  const [payer] = await db
    .select()
    .from(payers)
    .where(and(eq(payers.id, id), eq(payers.organizationId, orgId)))
    .limit(1);
  return payer ?? null;
}
