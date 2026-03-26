import "server-only";

import { db } from "@/server/db";
import { clients, clientContacts, clientInsurance, payers } from "@/server/db/schema";
import { providers } from "@/server/db/schema";
import { eq, and, isNull, ne, inArray, asc, sql } from "drizzle-orm";

export type Client = typeof clients.$inferSelect;
export type ClientContact = typeof clientContacts.$inferSelect;

export type ClientWithBcba = Client & {
  bcbaFirstName: string | null;
  bcbaLastName: string | null;
};

function scopedWhere(orgId: string) {
  return and(eq(clients.organizationId, orgId), isNull(clients.deletedAt));
}

/** Lightweight existence check — avoids fetching all clients just to check emptiness. */
export async function hasClients(orgId: string): Promise<boolean> {
  const [row] = await db
    .select({ exists: sql<number>`1` })
    .from(clients)
    .where(and(eq(clients.organizationId, orgId), isNull(clients.deletedAt)))
    .limit(1);
  return !!row;
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

export async function getClientById(orgId: string, id: string): Promise<Client | null> {
  const [client] = await db
    .select()
    .from(clients)
    .where(and(scopedWhere(orgId), eq(clients.id, id)))
    .limit(1);
  return client ?? null;
}

export async function getClientContacts(orgId: string, clientId: string): Promise<ClientContact[]> {
  return db
    .select()
    .from(clientContacts)
    .where(and(eq(clientContacts.organizationId, orgId), eq(clientContacts.clientId, clientId)))
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

// ── Insurance Queries ───────────────────────────────────────────────────────

export type ClientInsuranceWithPayer = {
  id: string;
  organizationId: string;
  clientId: string;
  payerId: string;
  memberId: string;
  groupNumber: string | null;
  planName: string | null;
  relationshipToSubscriber: string | null;
  subscriberFirstName: string | null;
  subscriberLastName: string | null;
  subscriberDateOfBirth: string | null;
  subscriberGender: string | null;
  subscriberAddressLine1: string | null;
  subscriberCity: string | null;
  subscriberState: string | null;
  subscriberZipCode: string | null;
  priority: number;
  effectiveDate: string | null;
  terminationDate: string | null;
  verificationStatus: string;
  verifiedAt: Date | null;
  cardFrontUrl: string | null;
  cardBackUrl: string | null;
  isActive: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  payerName: string;
  payerType: string | null;
  payerPhone: string | null;
};

export async function getClientInsurance(
  orgId: string,
  clientId: string,
): Promise<ClientInsuranceWithPayer[]> {
  const rows = await db
    .select({
      id: clientInsurance.id,
      organizationId: clientInsurance.organizationId,
      clientId: clientInsurance.clientId,
      payerId: clientInsurance.payerId,
      memberId: clientInsurance.memberId,
      groupNumber: clientInsurance.groupNumber,
      planName: clientInsurance.planName,
      relationshipToSubscriber: clientInsurance.relationshipToSubscriber,
      subscriberFirstName: clientInsurance.subscriberFirstName,
      subscriberLastName: clientInsurance.subscriberLastName,
      subscriberDateOfBirth: clientInsurance.subscriberDateOfBirth,
      subscriberGender: clientInsurance.subscriberGender,
      subscriberAddressLine1: clientInsurance.subscriberAddressLine1,
      subscriberCity: clientInsurance.subscriberCity,
      subscriberState: clientInsurance.subscriberState,
      subscriberZipCode: clientInsurance.subscriberZipCode,
      priority: clientInsurance.priority,
      effectiveDate: clientInsurance.effectiveDate,
      terminationDate: clientInsurance.terminationDate,
      verificationStatus: clientInsurance.verificationStatus,
      verifiedAt: clientInsurance.verifiedAt,
      cardFrontUrl: clientInsurance.cardFrontUrl,
      cardBackUrl: clientInsurance.cardBackUrl,
      isActive: clientInsurance.isActive,
      deletedAt: clientInsurance.deletedAt,
      createdAt: clientInsurance.createdAt,
      updatedAt: clientInsurance.updatedAt,
      payerName: payers.name,
      payerType: payers.payerType,
      payerPhone: payers.phone,
    })
    .from(clientInsurance)
    .innerJoin(payers, eq(clientInsurance.payerId, payers.id))
    .where(
      and(
        eq(clientInsurance.organizationId, orgId),
        eq(clientInsurance.clientId, clientId),
        isNull(clientInsurance.deletedAt),
      ),
    )
    .orderBy(asc(clientInsurance.priority));

  return rows;
}

export type PayerOption = {
  id: string;
  name: string;
  payerType: string | null;
};

export async function getPayerOptions(orgId: string): Promise<PayerOption[]> {
  return db
    .select({
      id: payers.id,
      name: payers.name,
      payerType: payers.payerType,
    })
    .from(payers)
    .where(and(eq(payers.organizationId, orgId), eq(payers.isActive, true)))
    .orderBy(payers.name);
}
