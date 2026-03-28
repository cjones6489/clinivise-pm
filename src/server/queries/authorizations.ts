import "server-only";

import { db } from "@/server/db";
import {
  authorizations,
  authorizationServices,
  clients,
  clientInsurance,
  payers,
} from "@/server/db/schema";
import { eq, and, isNull, sql, asc, inArray, type SQL } from "drizzle-orm";
import { AUTH_ALERT_THRESHOLDS } from "@/lib/constants";

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

// ── Auth List Metrics ────────────────────────────────────────────────────────

export type AuthListMetrics = {
  totalCount: number;
  activeCount: number;
  expiring30dCount: number;
  expiredCount: number;
  avgUtilization: number;
};

export async function getAuthListMetrics(orgId: string): Promise<AuthListMetrics> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const thirtyDaysStr = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

  const [result] = await db
    .select({
      totalCount: sql<number>`count(*)::int`,
      activeCount: sql<number>`count(*) filter (
        where ${authorizations.status} = 'approved'
        and ${authorizations.endDate} >= ${todayStr}
      )::int`,
      expiring30dCount: sql<number>`count(*) filter (
        where ${authorizations.status} = 'approved'
        and ${authorizations.endDate} >= ${todayStr}
        and ${authorizations.endDate} <= ${thirtyDaysStr}
      )::int`,
      expiredCount: sql<number>`count(*) filter (
        where ${authorizations.status} = 'expired'
        or (${authorizations.status} = 'approved' and ${authorizations.endDate} < ${todayStr})
      )::int`,
      avgUtilization: sql<number>`coalesce(
        round(
          sum(${serviceAgg.totalUsed}) filter (
            where ${authorizations.status} = 'approved'
            and ${authorizations.endDate} >= ${todayStr}
          )::numeric
          / nullif(sum(${serviceAgg.totalApproved}) filter (
            where ${authorizations.status} = 'approved'
            and ${authorizations.endDate} >= ${todayStr}
          ), 0) * 100
        ), 0
      )::int`,
    })
    .from(authorizations)
    .leftJoin(serviceAgg, eq(authorizations.id, serviceAgg.authorizationId))
    .where(scopedWhere(orgId));

  return {
    totalCount: result?.totalCount ?? 0,
    activeCount: result?.activeCount ?? 0,
    expiring30dCount: result?.expiring30dCount ?? 0,
    expiredCount: result?.expiredCount ?? 0,
    avgUtilization: result?.avgUtilization ?? 0,
  };
}

// ── Auth Filters ────────────────────────────────────────────────────────────

export type AuthFilters = {
  statusCategory?: "active" | "expiring" | "expired" | "pending";
};

function buildAuthFilterConditions(orgId: string, filters?: AuthFilters): SQL[] {
  const conditions: SQL[] = [
    sql`${authorizations.organizationId} = ${orgId}`,
    sql`${authorizations.deletedAt} is null`,
  ];

  if (filters?.statusCategory) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const thirtyDaysStr = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);

    switch (filters.statusCategory) {
      case "active":
        conditions.push(sql`${authorizations.status} = 'approved'`);
        conditions.push(sql`${authorizations.endDate} >= ${todayStr}`);
        break;
      case "expiring":
        conditions.push(sql`${authorizations.status} = 'approved'`);
        conditions.push(sql`${authorizations.endDate} >= ${todayStr}`);
        conditions.push(sql`${authorizations.endDate} <= ${thirtyDaysStr}`);
        break;
      case "expired":
        conditions.push(
          sql`(${authorizations.status} = 'expired' or (${authorizations.status} = 'approved' and ${authorizations.endDate} < ${todayStr}))`,
        );
        break;
      case "pending":
        conditions.push(sql`${authorizations.status} = 'pending'`);
        break;
    }
  }

  return conditions;
}

export async function getAuthorizations(
  orgId: string,
  opts?: { filters?: AuthFilters },
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
    .where(and(...buildAuthFilterConditions(orgId, opts?.filters)))
    .orderBy(authorizations.endDate);

  return rows;
}

/**
 * Lightweight count of action items for sidebar badge.
 * Counts distinct authorizations that have at least one issue:
 * expired, expiring within 30 days, or >=80% utilized.
 * Each auth counts as 1 action item regardless of how many issues it has.
 */
export async function getAlertCount(orgId: string): Promise<number> {
  const todayStr = new Date().toISOString().slice(0, 10);
  const thirtyDaysStr = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const warningPct = AUTH_ALERT_THRESHOLDS.UTILIZATION_WARNING_PCT / 100;

  const rows = await db
    .select({
      endDate: authorizations.endDate,
      totalApproved:
        sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.mapWith(Number),
      totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.mapWith(
        Number,
      ),
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
    // Use date-string comparison to avoid timezone edge cases
    const hasExpiryIssue = row.endDate < todayStr || row.endDate <= thirtyDaysStr;
    const hasUtilIssue = row.totalApproved > 0 && row.totalUsed / row.totalApproved >= warningPct;

    // Count each auth once regardless of how many issues it has
    if (hasExpiryIssue || hasUtilIssue) {
      count++;
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
      authType: authorizations.authType,
      requestingProviderId: authorizations.requestingProviderId,
      denialReason: authorizations.denialReason,
      appealDeadline: authorizations.appealDeadline,
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

// ── Client Auth Utilization (for client detail overview) ─────────────────────

export type ClientAuthUtilization = {
  authorizationId: string;
  authorizationNumber: string | null;
  startDate: string;
  endDate: string;
  daysTotal: number;
  daysElapsed: number;
  totalApprovedUnits: number;
  totalUsedUnits: number;
  services: {
    cptCode: string;
    approvedUnits: number;
    usedUnits: number;
  }[];
};

export async function getClientAuthUtilization(
  orgId: string,
  clientId: string,
): Promise<ClientAuthUtilization | null> {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Find the active authorization (approved, started, not expired, not deleted)
  const [activeAuth] = await db
    .select({
      id: authorizations.id,
      authorizationNumber: authorizations.authorizationNumber,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
    })
    .from(authorizations)
    .where(
      and(
        eq(authorizations.organizationId, orgId),
        eq(authorizations.clientId, clientId),
        eq(authorizations.status, "approved"),
        isNull(authorizations.deletedAt),
        sql`${authorizations.startDate} <= ${todayStr}`,
        sql`${authorizations.endDate} >= ${todayStr}`,
      ),
    )
    .orderBy(asc(authorizations.endDate))
    .limit(1);

  if (!activeAuth) return null;

  // Get per-CPT service lines
  const services = await db
    .select({
      cptCode: authorizationServices.cptCode,
      approvedUnits: authorizationServices.approvedUnits,
      usedUnits: authorizationServices.usedUnits,
    })
    .from(authorizationServices)
    .where(
      and(
        eq(authorizationServices.authorizationId, activeAuth.id),
        eq(authorizationServices.organizationId, orgId),
      ),
    )
    .orderBy(asc(authorizationServices.cptCode));

  const totalApprovedUnits = services.reduce((sum, s) => sum + s.approvedUnits, 0);
  const totalUsedUnits = services.reduce((sum, s) => sum + s.usedUnits, 0);

  const startMs = new Date(activeAuth.startDate).getTime();
  const endMs = new Date(activeAuth.endDate).getTime();
  const nowMs = Date.now();
  const daysTotal = Math.max(1, Math.round((endMs - startMs) / 86400000));
  const daysElapsed = Math.min(daysTotal, Math.max(0, Math.round((nowMs - startMs) / 86400000)));

  return {
    authorizationId: activeAuth.id,
    authorizationNumber: activeAuth.authorizationNumber,
    startDate: activeAuth.startDate,
    endDate: activeAuth.endDate,
    daysTotal,
    daysElapsed,
    totalApprovedUnits,
    totalUsedUnits,
    services,
  };
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

// ── Client Authorizations with Service Lines (for auth tab redesign) ────────

export type ClientAuthWithServices = {
  id: string;
  payerName: string;
  authorizationNumber: string | null;
  status: string;
  startDate: string;
  endDate: string;
  totalApproved: number;
  totalUsed: number;
  services: {
    cptCode: string;
    approvedUnits: number;
    usedUnits: number;
  }[];
};

export async function getClientAuthorizationsWithServices(
  orgId: string,
  clientId: string,
): Promise<ClientAuthWithServices[]> {
  // Get all auths for this client
  const authRows = await db
    .select({
      id: authorizations.id,
      payerName: payers.name,
      authorizationNumber: authorizations.authorizationNumber,
      status: authorizations.status,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
    })
    .from(authorizations)
    .innerJoin(payers, eq(authorizations.payerId, payers.id))
    .where(and(scopedWhere(orgId), eq(authorizations.clientId, clientId)))
    .orderBy(authorizations.endDate);

  if (authRows.length === 0) return [];

  // Get all service lines for these auths in one query
  const authIds = authRows.map((a) => a.id);
  const serviceRows = await db
    .select({
      authorizationId: authorizationServices.authorizationId,
      cptCode: authorizationServices.cptCode,
      approvedUnits: authorizationServices.approvedUnits,
      usedUnits: authorizationServices.usedUnits,
    })
    .from(authorizationServices)
    .where(
      and(
        eq(authorizationServices.organizationId, orgId),
        inArray(authorizationServices.authorizationId, authIds),
      ),
    )
    .orderBy(asc(authorizationServices.cptCode));

  // Group services by auth
  const servicesByAuth = new Map<string, ClientAuthWithServices["services"]>();
  for (const svc of serviceRows) {
    const existing = servicesByAuth.get(svc.authorizationId) ?? [];
    existing.push({
      cptCode: svc.cptCode,
      approvedUnits: svc.approvedUnits,
      usedUnits: svc.usedUnits,
    });
    servicesByAuth.set(svc.authorizationId, existing);
  }

  return authRows.map((auth) => {
    const services = servicesByAuth.get(auth.id) ?? [];
    return {
      ...auth,
      totalApproved: services.reduce((sum, s) => sum + s.approvedUnits, 0),
      totalUsed: services.reduce((sum, s) => sum + s.usedUnits, 0),
      services,
    };
  });
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
