import "server-only";

import { db } from "@/server/db";
import {
  authorizations,
  authorizationServices,
  clients,
  clientInsurance,
  payers,
} from "@/server/db/schema";
import { eq, and, isNull, sql, asc } from "drizzle-orm";

// ── Types ────────────────────────────────────────────────────────────────────

export type AuthorizationListItem = {
  id: string;
  organizationId: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  payerId: string;
  payerName: string;
  authorizationNumber: string | null;
  status: string;
  startDate: string;
  endDate: string;
  serviceCount: number;
  totalApproved: number;
  totalUsed: number;
  deletedAt: Date | null;
  createdAt: Date;
};

export type AuthorizationServiceRow = typeof authorizationServices.$inferSelect;

export type AuthorizationWithServices = typeof authorizations.$inferSelect & {
  clientFirstName: string;
  clientLastName: string;
  payerName: string;
  clientInsuranceMemberId: string | null;
  services: AuthorizationServiceRow[];
};

export type ClientOption = {
  id: string;
  firstName: string;
  lastName: string;
};

export type ClientInsuranceOption = {
  id: string;
  payerId: string;
  payerName: string;
  memberId: string;
  priority: number;
};

export type AuthorizationOption = {
  id: string;
  authorizationNumber: string | null;
  startDate: string;
  endDate: string;
  status: string;
};

// ── Scoped WHERE helper ──────────────────────────────────────────────────────

function scopedWhere(orgId: string) {
  return and(eq(authorizations.organizationId, orgId), isNull(authorizations.deletedAt));
}

// ── Queries ──────────────────────────────────────────────────────────────────

const serviceAgg = db
  .select({
    authorizationId: authorizationServices.authorizationId,
    serviceCount: sql<number>`count(*)::int`.as("service_count"),
    totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.as(
      "total_approved",
    ),
    totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.as(
      "total_used",
    ),
  })
  .from(authorizationServices)
  .groupBy(authorizationServices.authorizationId)
  .as("svc_agg");

export async function getAuthorizations(orgId: string): Promise<AuthorizationListItem[]> {
  const rows = await db
    .select({
      id: authorizations.id,
      organizationId: authorizations.organizationId,
      clientId: authorizations.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      payerId: authorizations.payerId,
      payerName: payers.name,
      authorizationNumber: authorizations.authorizationNumber,
      status: authorizations.status,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
      serviceCount: sql<number>`coalesce(${serviceAgg.serviceCount}, 0)`.mapWith(Number),
      totalApproved: sql<number>`coalesce(${serviceAgg.totalApproved}, 0)`.mapWith(Number),
      totalUsed: sql<number>`coalesce(${serviceAgg.totalUsed}, 0)`.mapWith(Number),
      deletedAt: authorizations.deletedAt,
      createdAt: authorizations.createdAt,
    })
    .from(authorizations)
    .innerJoin(clients, eq(authorizations.clientId, clients.id))
    .innerJoin(payers, eq(authorizations.payerId, payers.id))
    .leftJoin(serviceAgg, eq(authorizations.id, serviceAgg.authorizationId))
    .where(scopedWhere(orgId))
    .orderBy(authorizations.endDate);

  return rows;
}

/**
 * Lightweight count of action items for sidebar badge.
 * Counts: expired auths, expiring within 30 days, >=80% utilized.
 */
export async function getAlertCount(orgId: string): Promise<number> {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now);
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const rows = await db
    .select({
      endDate: authorizations.endDate,
      totalApproved:
        sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.mapWith(Number),
      totalUsed:
        sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.mapWith(Number),
    })
    .from(authorizations)
    .leftJoin(authorizationServices, eq(authorizations.id, authorizationServices.authorizationId))
    .where(
      and(
        eq(authorizations.organizationId, orgId),
        isNull(authorizations.deletedAt),
        eq(authorizations.status, "approved"),
      ),
    )
    .groupBy(authorizations.id, authorizations.endDate);

  let count = 0;
  for (const row of rows) {
    const endDate = new Date(row.endDate);
    if (endDate < now) {
      count++; // expired
    } else if (endDate <= thirtyDaysFromNow) {
      count++; // expiring soon
    }
    if (row.totalApproved > 0 && row.totalUsed / row.totalApproved >= 0.8) {
      count++; // high utilization
    }
  }

  return count;
}

export async function getAuthorizationWithServices(
  orgId: string,
  id: string,
): Promise<AuthorizationWithServices | null> {
  const [auth] = await db
    .select({
      id: authorizations.id,
      organizationId: authorizations.organizationId,
      clientId: authorizations.clientId,
      payerId: authorizations.payerId,
      clientInsuranceId: authorizations.clientInsuranceId,
      previousAuthorizationId: authorizations.previousAuthorizationId,
      authorizationNumber: authorizations.authorizationNumber,
      status: authorizations.status,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
      diagnosisCode: authorizations.diagnosisCode,
      notes: authorizations.notes,
      aiParsedData: authorizations.aiParsedData,
      aiConfidenceScore: authorizations.aiConfidenceScore,
      deletedAt: authorizations.deletedAt,
      createdAt: authorizations.createdAt,
      updatedAt: authorizations.updatedAt,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      payerName: payers.name,
      clientInsuranceMemberId: clientInsurance.memberId,
    })
    .from(authorizations)
    .innerJoin(clients, eq(authorizations.clientId, clients.id))
    .innerJoin(payers, eq(authorizations.payerId, payers.id))
    .leftJoin(clientInsurance, eq(authorizations.clientInsuranceId, clientInsurance.id))
    .where(and(scopedWhere(orgId), eq(authorizations.id, id)))
    .limit(1);

  if (!auth) return null;

  const services = await db
    .select()
    .from(authorizationServices)
    .where(
      and(
        eq(authorizationServices.authorizationId, id),
        eq(authorizationServices.organizationId, orgId),
      ),
    )
    .orderBy(asc(authorizationServices.cptCode));

  return { ...auth, services };
}

export async function getClientAuthorizations(
  orgId: string,
  clientId: string,
): Promise<AuthorizationListItem[]> {
  const rows = await db
    .select({
      id: authorizations.id,
      organizationId: authorizations.organizationId,
      clientId: authorizations.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      payerId: authorizations.payerId,
      payerName: payers.name,
      authorizationNumber: authorizations.authorizationNumber,
      status: authorizations.status,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
      serviceCount: sql<number>`coalesce(${serviceAgg.serviceCount}, 0)`.mapWith(Number),
      totalApproved: sql<number>`coalesce(${serviceAgg.totalApproved}, 0)`.mapWith(Number),
      totalUsed: sql<number>`coalesce(${serviceAgg.totalUsed}, 0)`.mapWith(Number),
      deletedAt: authorizations.deletedAt,
      createdAt: authorizations.createdAt,
    })
    .from(authorizations)
    .innerJoin(clients, eq(authorizations.clientId, clients.id))
    .innerJoin(payers, eq(authorizations.payerId, payers.id))
    .leftJoin(serviceAgg, eq(authorizations.id, serviceAgg.authorizationId))
    .where(and(scopedWhere(orgId), eq(authorizations.clientId, clientId)))
    .orderBy(authorizations.endDate);

  return rows;
}

export async function getClientOptions(orgId: string): Promise<ClientOption[]> {
  return db
    .select({
      id: clients.id,
      firstName: clients.firstName,
      lastName: clients.lastName,
    })
    .from(clients)
    .where(and(eq(clients.organizationId, orgId), isNull(clients.deletedAt)))
    .orderBy(clients.lastName, clients.firstName);
}

export async function getClientInsuranceOptions(
  orgId: string,
  clientId: string,
): Promise<ClientInsuranceOption[]> {
  const rows = await db
    .select({
      id: clientInsurance.id,
      payerId: clientInsurance.payerId,
      payerName: payers.name,
      memberId: clientInsurance.memberId,
      priority: clientInsurance.priority,
    })
    .from(clientInsurance)
    .innerJoin(payers, eq(clientInsurance.payerId, payers.id))
    .where(
      and(
        eq(clientInsurance.organizationId, orgId),
        eq(clientInsurance.clientId, clientId),
        isNull(clientInsurance.deletedAt),
        eq(clientInsurance.isActive, true),
      ),
    )
    .orderBy(asc(clientInsurance.priority));

  return rows;
}

export async function getAuthorizationOptions(
  orgId: string,
  clientId: string,
): Promise<AuthorizationOption[]> {
  return db
    .select({
      id: authorizations.id,
      authorizationNumber: authorizations.authorizationNumber,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
      status: authorizations.status,
    })
    .from(authorizations)
    .where(and(scopedWhere(orgId), eq(authorizations.clientId, clientId)))
    .orderBy(authorizations.endDate);
}
