import "server-only";

import { db } from "@/server/db";
import { clients, clientContacts, clientInsurance, clientProviders, payers, authorizations, authorizationServices, providers } from "@/server/db/schema";
import { eq, and, isNull, ne, asc, desc, sql } from "drizzle-orm";

export type Client = typeof clients.$inferSelect;
export type ClientContact = typeof clientContacts.$inferSelect;

export type CareTeamMember = {
  id: string;
  providerId: string;
  providerFirstName: string;
  providerLastName: string;
  credentialType: string;
  role: string;
  isPrimary: boolean;
  startDate: string;
};

export type ClientListItem = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  diagnosisCode: string | null;
  status: string;
  bcbaFirstName: string | null;
  bcbaLastName: string | null;
  payerName: string | null;
  totalApproved: number;
  totalUsed: number;
  nearestExpiry: string | null;
  maxUtilizationPct: number;
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

export async function getClients(orgId: string): Promise<Client[]> {
  const rows = await db
    .select()
    .from(clients)
    .where(and(scopedWhere(orgId), ne(clients.status, "archived")))
    .orderBy(clients.lastName, clients.firstName);

  return rows;
}

/** Enriched client list with payer, auth utilization, and nearest expiry */
export async function getClientsForList(orgId: string): Promise<ClientListItem[]> {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Subquery: per-client auth utilization for active auths
  // Uses max individual service utilization % (not blended aggregate) to surface worst-case auth
  const authUtil = db
    .select({
      clientId: authorizations.clientId,
      totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.as("total_approved"),
      totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.as("total_used"),
      nearestExpiry: sql<string>`min(${authorizations.endDate})`.as("nearest_expiry"),
      maxUtilizationPct: sql<number>`coalesce(max(
        case when ${authorizationServices.approvedUnits} > 0
          then round(${authorizationServices.usedUnits}::numeric / ${authorizationServices.approvedUnits} * 100)
          else 0
        end
      ), 0)::int`.as("max_utilization_pct"),
    })
    .from(authorizations)
    .leftJoin(authorizationServices, eq(authorizations.id, authorizationServices.authorizationId))
    .where(
      and(
        eq(authorizations.organizationId, orgId),
        eq(authorizations.status, "approved"),
        isNull(authorizations.deletedAt),
        sql`${authorizations.endDate} >= ${todayStr}`,
      ),
    )
    .groupBy(authorizations.clientId)
    .as("auth_util");

  // Subquery: primary insurance payer name
  const primaryIns = db
    .select({
      clientId: clientInsurance.clientId,
      payerName: payers.name,
    })
    .from(clientInsurance)
    .innerJoin(payers, eq(clientInsurance.payerId, payers.id))
    .where(
      and(
        eq(clientInsurance.organizationId, orgId),
        eq(clientInsurance.priority, 1),
        isNull(clientInsurance.deletedAt),
      ),
    )
    .as("primary_ins");

  // Subquery: primary BCBA from client_providers junction table
  const primaryBcba = db
    .select({
      clientId: clientProviders.clientId,
      bcbaFirstName: providers.firstName,
      bcbaLastName: providers.lastName,
    })
    .from(clientProviders)
    .innerJoin(providers, eq(clientProviders.providerId, providers.id))
    .where(
      and(
        eq(clientProviders.organizationId, orgId),
        eq(clientProviders.isPrimary, true),
        isNull(clientProviders.endDate),
      ),
    )
    .as("primary_bcba");

  const rows = await db
    .select({
      id: clients.id,
      firstName: clients.firstName,
      lastName: clients.lastName,
      dateOfBirth: clients.dateOfBirth,
      diagnosisCode: clients.diagnosisCode,
      status: clients.status,
      bcbaFirstName: primaryBcba.bcbaFirstName,
      bcbaLastName: primaryBcba.bcbaLastName,
      payerName: primaryIns.payerName,
      totalApproved: sql<number>`coalesce(${authUtil.totalApproved}, 0)`.mapWith(Number),
      totalUsed: sql<number>`coalesce(${authUtil.totalUsed}, 0)`.mapWith(Number),
      nearestExpiry: authUtil.nearestExpiry,
      maxUtilizationPct: sql<number>`coalesce(${authUtil.maxUtilizationPct}, 0)`.mapWith(Number),
    })
    .from(clients)
    .leftJoin(primaryBcba, eq(clients.id, primaryBcba.clientId))
    .leftJoin(authUtil, eq(clients.id, authUtil.clientId))
    .leftJoin(primaryIns, eq(clients.id, primaryIns.clientId))
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

export async function getCareTeam(orgId: string, clientId: string): Promise<CareTeamMember[]> {
  return db
    .select({
      id: clientProviders.id,
      providerId: clientProviders.providerId,
      providerFirstName: providers.firstName,
      providerLastName: providers.lastName,
      credentialType: providers.credentialType,
      role: clientProviders.role,
      isPrimary: clientProviders.isPrimary,
      startDate: clientProviders.startDate,
    })
    .from(clientProviders)
    .innerJoin(providers, eq(clientProviders.providerId, providers.id))
    .where(
      and(
        eq(clientProviders.organizationId, orgId),
        eq(clientProviders.clientId, clientId),
        isNull(clientProviders.endDate),
        isNull(providers.deletedAt),
      ),
    )
    .orderBy(desc(clientProviders.isPrimary), providers.lastName, providers.firstName);
}

export type AvailableProvider = {
  id: string;
  firstName: string;
  lastName: string;
  credentialType: string;
};

/** Active providers not already on this client's care team */
export async function getAvailableProviders(
  orgId: string,
  clientId: string,
): Promise<AvailableProvider[]> {
  // Get IDs of providers already on this client's active team
  const currentTeamIds = db
    .select({ providerId: clientProviders.providerId })
    .from(clientProviders)
    .where(
      and(
        eq(clientProviders.organizationId, orgId),
        eq(clientProviders.clientId, clientId),
        isNull(clientProviders.endDate),
      ),
    );

  const rows = await db
    .select({
      id: providers.id,
      firstName: providers.firstName,
      lastName: providers.lastName,
      credentialType: providers.credentialType,
    })
    .from(providers)
    .where(
      and(
        eq(providers.organizationId, orgId),
        isNull(providers.deletedAt),
        eq(providers.isActive, true),
        sql`${providers.id} NOT IN (${currentTeamIds})`,
      ),
    )
    .orderBy(providers.lastName, providers.firstName);

  return rows;
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
