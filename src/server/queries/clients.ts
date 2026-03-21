import "server-only";

import { db } from "@/server/db";
import { clients, clientContacts } from "@/server/db/schema";
import { providers } from "@/server/db/schema";
import { eq, and, isNull, ne, inArray } from "drizzle-orm";

export type Client = typeof clients.$inferSelect;
export type ClientContact = typeof clientContacts.$inferSelect;

export type ClientWithBcba = Client & {
  bcbaFirstName: string | null;
  bcbaLastName: string | null;
};

function scopedWhere(orgId: string) {
  return and(eq(clients.organizationId, orgId), isNull(clients.deletedAt));
}

export async function getClients(orgId: string): Promise<ClientWithBcba[]> {
  const rows = await db
    .select({
      id: clients.id,
      organizationId: clients.organizationId,
      firstName: clients.firstName,
      lastName: clients.lastName,
      dateOfBirth: clients.dateOfBirth,
      gender: clients.gender,
      phone: clients.phone,
      email: clients.email,
      addressLine1: clients.addressLine1,
      addressLine2: clients.addressLine2,
      city: clients.city,
      state: clients.state,
      zipCode: clients.zipCode,
      diagnosisCode: clients.diagnosisCode,
      diagnosisDescription: clients.diagnosisDescription,
      assignedBcbaId: clients.assignedBcbaId,
      intakeDate: clients.intakeDate,
      status: clients.status,
      referralSource: clients.referralSource,
      holdReason: clients.holdReason,
      notes: clients.notes,
      deletedAt: clients.deletedAt,
      createdAt: clients.createdAt,
      updatedAt: clients.updatedAt,
      bcbaFirstName: providers.firstName,
      bcbaLastName: providers.lastName,
    })
    .from(clients)
    .leftJoin(providers, eq(clients.assignedBcbaId, providers.id))
    .where(and(scopedWhere(orgId), ne(clients.status, "archived")))
    .orderBy(clients.lastName, clients.firstName);

  return rows;
}

export async function getClientById(
  orgId: string,
  id: string,
): Promise<Client | null> {
  const [client] = await db
    .select()
    .from(clients)
    .where(and(scopedWhere(orgId), eq(clients.id, id)))
    .limit(1);
  return client ?? null;
}

export async function getClientContacts(
  orgId: string,
  clientId: string,
): Promise<ClientContact[]> {
  return db
    .select()
    .from(clientContacts)
    .where(
      and(
        eq(clientContacts.organizationId, orgId),
        eq(clientContacts.clientId, clientId),
      ),
    )
    .orderBy(clientContacts.priority, clientContacts.lastName);
}

export type BcbaOption = {
  id: string;
  firstName: string;
  lastName: string;
};

export async function getBcbaOptions(orgId: string): Promise<BcbaOption[]> {
  return db
    .select({
      id: providers.id,
      firstName: providers.firstName,
      lastName: providers.lastName,
    })
    .from(providers)
    .where(
      and(
        eq(providers.organizationId, orgId),
        isNull(providers.deletedAt),
        inArray(providers.credentialType, ["bcba", "bcba_d"]),
        eq(providers.isActive, true),
      ),
    )
    .orderBy(providers.lastName, providers.firstName);
}
