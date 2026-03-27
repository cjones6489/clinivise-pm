import "server-only";

import { db } from "@/server/db";
import {
  sessions,
  clients,
  providers,
  authorizations,
  authorizationServices,
} from "@/server/db/schema";
import { eq, and, asc, desc, lte, gte, lt, isNull, sql, type SQL } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

// ── Self-join alias for supervisor ──────────────────────────────────────────

const supervisorAlias = alias(providers, "supervisor");

// ── Types ────────────────────────────────────────────────────────────────────

export type SessionListItem = {
  id: string;
  organizationId: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  providerId: string;
  providerFirstName: string;
  providerLastName: string;
  providerCredentialType: string;
  supervisorFirstName: string | null;
  supervisorLastName: string | null;
  authorizationId: string | null;
  authorizationNumber: string | null;
  authorizationServiceId: string | null;
  sessionDate: string;
  startTime: Date | null;
  endTime: Date | null;
  cptCode: string;
  modifierCodes: string[] | null;
  units: number;
  actualMinutes: number | null;
  placeOfService: string;
  status: string;
  cancellationReason: string | null;
  cancelledBy: string | null;
  serviceAddress: string | null;
  notes: string | null;
  createdAt: Date;
};

export type SessionDetail = SessionListItem & {
  updatedAt: Date;
  supervisorId: string | null;
  unitCalcMethod: string | null;
  authServiceApprovedUnits: number | null;
  authServiceUsedUnits: number | null;
  authStartDate: string | null;
  authEndDate: string | null;
};

export type ProviderOption = {
  id: string;
  firstName: string;
  lastName: string;
  credentialType: string;
  supervisorId: string | null;
};

export type AuthServiceMatch = {
  authServiceId: string;
  authorizationId: string;
  authorizationNumber: string | null;
  cptCode: string;
  approvedUnits: number;
  usedUnits: number;
  remainingUnits: number;
  startDate: string;
  endDate: string;
  maxUnitsPerDay: number | null;
};

// ── Filters ─────────────────────────────────────────────────────────────────

export type SessionFilters = {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  clientId?: string;
  providerId?: string;
};

// ── Queries ──────────────────────────────────────────────────────────────────

export type SessionListMetrics = {
  hoursThisWeek: number;
  sessions7d: number;
  flaggedCount: number;
  thisMonthCount: number;
};

export type SessionsPage = {
  data: SessionListItem[];
  total: number;
  page: number;
  pageSize: number;
};

const SESSION_LIST_COLUMNS = {
  id: sessions.id,
  organizationId: sessions.organizationId,
  clientId: sessions.clientId,
  clientFirstName: clients.firstName,
  clientLastName: clients.lastName,
  providerId: sessions.providerId,
  providerFirstName: providers.firstName,
  providerLastName: providers.lastName,
  providerCredentialType: providers.credentialType,
  supervisorFirstName: supervisorAlias.firstName,
  supervisorLastName: supervisorAlias.lastName,
  authorizationId: sessions.authorizationId,
  authorizationNumber: authorizations.authorizationNumber,
  authorizationServiceId: sessions.authorizationServiceId,
  sessionDate: sessions.sessionDate,
  startTime: sessions.startTime,
  endTime: sessions.endTime,
  cptCode: sessions.cptCode,
  modifierCodes: sessions.modifierCodes,
  units: sessions.units,
  actualMinutes: sessions.actualMinutes,
  placeOfService: sessions.placeOfService,
  status: sessions.status,
  cancellationReason: sessions.cancellationReason,
  cancelledBy: sessions.cancelledBy,
  serviceAddress: sessions.serviceAddress,
  notes: sessions.notes,
  createdAt: sessions.createdAt,
} as const;

function sessionListBase() {
  return db
    .select(SESSION_LIST_COLUMNS)
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .leftJoin(supervisorAlias, eq(sessions.supervisorId, supervisorAlias.id))
    .leftJoin(authorizations, eq(sessions.authorizationId, authorizations.id));
}

export async function getSessionListMetrics(orgId: string): Promise<SessionListMetrics> {
  const now = new Date();
  // Monday of this week (ISO week)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  // First of this month
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  // 7 days ago
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const [result] = await db
    .select({
      hoursThisWeek: sql<number>`coalesce(
        sum(${sessions.units}) filter (
          where ${sessions.sessionDate} >= ${weekStartStr}
          and ${sessions.status} = 'completed'
        ), 0
      )::numeric * 15.0 / 60`,
      sessions7d: sql<number>`count(*) filter (
        where ${sessions.sessionDate} >= ${sevenDaysAgoStr}
        and ${sessions.status} != 'cancelled'
      )::int`,
      flaggedCount: sql<number>`count(*) filter (
        where ${sessions.status} = 'flagged'
      )::int`,
      thisMonthCount: sql<number>`count(*) filter (
        where ${sessions.sessionDate} >= ${monthStartStr}
        and ${sessions.status} != 'cancelled'
      )::int`,
    })
    .from(sessions)
    .where(eq(sessions.organizationId, orgId));

  return {
    hoursThisWeek: Number(result?.hoursThisWeek ?? 0),
    sessions7d: result?.sessions7d ?? 0,
    flaggedCount: result?.flaggedCount ?? 0,
    thisMonthCount: result?.thisMonthCount ?? 0,
  };
}

/** Build dynamic WHERE conditions from filter params. */
function buildFilterConditions(orgId: string, filters?: SessionFilters): SQL[] {
  const conditions: SQL[] = [sql`${sessions.organizationId} = ${orgId}`];

  if (filters?.status) {
    conditions.push(sql`${sessions.status} = ${filters.status}`);
  }
  if (filters?.dateFrom) {
    conditions.push(sql`${sessions.sessionDate} >= ${filters.dateFrom}`);
  }
  if (filters?.dateTo) {
    conditions.push(sql`${sessions.sessionDate} <= ${filters.dateTo}`);
  }
  if (filters?.clientId) {
    conditions.push(sql`${sessions.clientId} = ${filters.clientId}`);
  }
  if (filters?.providerId) {
    conditions.push(sql`${sessions.providerId} = ${filters.providerId}`);
  }

  return conditions;
}

export async function getSessions(
  orgId: string,
  opts: { page?: number; pageSize?: number; filters?: SessionFilters } = {},
): Promise<SessionsPage> {
  const page = opts.page ?? 0;
  const pageSize = Math.min(opts.pageSize ?? 50, 100);
  const whereConditions = buildFilterConditions(orgId, opts.filters);
  const whereClause = and(...whereConditions);

  const [rows, countResult] = await Promise.all([
    sessionListBase()
      .where(whereClause)
      .orderBy(desc(sessions.sessionDate), desc(sessions.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessions)
      .where(whereClause),
  ]);

  return {
    data: rows,
    total: countResult[0]?.count ?? 0,
    page,
    pageSize,
  };
}

export async function getSessionById(orgId: string, id: string): Promise<SessionDetail | null> {
  const [row] = await db
    .select({
      id: sessions.id,
      organizationId: sessions.organizationId,
      clientId: sessions.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      providerId: sessions.providerId,
      providerFirstName: providers.firstName,
      providerLastName: providers.lastName,
      providerCredentialType: providers.credentialType,
      supervisorFirstName: supervisorAlias.firstName,
      supervisorLastName: supervisorAlias.lastName,
      supervisorId: sessions.supervisorId,
      authorizationId: sessions.authorizationId,
      authorizationNumber: authorizations.authorizationNumber,
      authorizationServiceId: sessions.authorizationServiceId,
      sessionDate: sessions.sessionDate,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      cptCode: sessions.cptCode,
      modifierCodes: sessions.modifierCodes,
      units: sessions.units,
      actualMinutes: sessions.actualMinutes,
      unitCalcMethod: sessions.unitCalcMethod,
      placeOfService: sessions.placeOfService,
      status: sessions.status,
      cancellationReason: sessions.cancellationReason,
      cancelledBy: sessions.cancelledBy,
      serviceAddress: sessions.serviceAddress,
      notes: sessions.notes,
      createdAt: sessions.createdAt,
      updatedAt: sessions.updatedAt,
      authServiceApprovedUnits: authorizationServices.approvedUnits,
      authServiceUsedUnits: authorizationServices.usedUnits,
      authStartDate: authorizations.startDate,
      authEndDate: authorizations.endDate,
    })
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .leftJoin(supervisorAlias, eq(sessions.supervisorId, supervisorAlias.id))
    .leftJoin(authorizations, eq(sessions.authorizationId, authorizations.id))
    .leftJoin(authorizationServices, eq(sessions.authorizationServiceId, authorizationServices.id))
    .where(and(eq(sessions.organizationId, orgId), eq(sessions.id, id)))
    .limit(1);

  return row ?? null;
}

export async function getClientSessions(
  orgId: string,
  clientId: string,
): Promise<SessionListItem[]> {
  return db
    .select({
      id: sessions.id,
      organizationId: sessions.organizationId,
      clientId: sessions.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      providerId: sessions.providerId,
      providerFirstName: providers.firstName,
      providerLastName: providers.lastName,
      providerCredentialType: providers.credentialType,
      supervisorFirstName: supervisorAlias.firstName,
      supervisorLastName: supervisorAlias.lastName,
      authorizationId: sessions.authorizationId,
      authorizationNumber: authorizations.authorizationNumber,
      authorizationServiceId: sessions.authorizationServiceId,
      sessionDate: sessions.sessionDate,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      cptCode: sessions.cptCode,
      modifierCodes: sessions.modifierCodes,
      units: sessions.units,
      actualMinutes: sessions.actualMinutes,
      placeOfService: sessions.placeOfService,
      status: sessions.status,
      cancellationReason: sessions.cancellationReason,
      cancelledBy: sessions.cancelledBy,
      serviceAddress: sessions.serviceAddress,
      notes: sessions.notes,
      createdAt: sessions.createdAt,
    })
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .leftJoin(supervisorAlias, eq(sessions.supervisorId, supervisorAlias.id))
    .leftJoin(authorizations, eq(sessions.authorizationId, authorizations.id))
    .where(and(eq(sessions.organizationId, orgId), eq(sessions.clientId, clientId)))
    .orderBy(desc(sessions.sessionDate), desc(sessions.createdAt));
}

export async function getAuthorizationSessions(
  orgId: string,
  authorizationId: string,
): Promise<SessionListItem[]> {
  return db
    .select({
      id: sessions.id,
      organizationId: sessions.organizationId,
      clientId: sessions.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      providerId: sessions.providerId,
      providerFirstName: providers.firstName,
      providerLastName: providers.lastName,
      providerCredentialType: providers.credentialType,
      supervisorFirstName: supervisorAlias.firstName,
      supervisorLastName: supervisorAlias.lastName,
      authorizationId: sessions.authorizationId,
      authorizationNumber: authorizations.authorizationNumber,
      authorizationServiceId: sessions.authorizationServiceId,
      sessionDate: sessions.sessionDate,
      startTime: sessions.startTime,
      endTime: sessions.endTime,
      cptCode: sessions.cptCode,
      modifierCodes: sessions.modifierCodes,
      units: sessions.units,
      actualMinutes: sessions.actualMinutes,
      placeOfService: sessions.placeOfService,
      status: sessions.status,
      cancellationReason: sessions.cancellationReason,
      cancelledBy: sessions.cancelledBy,
      serviceAddress: sessions.serviceAddress,
      notes: sessions.notes,
      createdAt: sessions.createdAt,
    })
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .leftJoin(supervisorAlias, eq(sessions.supervisorId, supervisorAlias.id))
    .leftJoin(authorizations, eq(sessions.authorizationId, authorizations.id))
    .where(and(eq(sessions.organizationId, orgId), eq(sessions.authorizationId, authorizationId)))
    .orderBy(desc(sessions.sessionDate), desc(sessions.createdAt));
}

export async function getProviderOptions(orgId: string): Promise<ProviderOption[]> {
  return db
    .select({
      id: providers.id,
      firstName: providers.firstName,
      lastName: providers.lastName,
      credentialType: providers.credentialType,
      supervisorId: providers.supervisorId,
    })
    .from(providers)
    .where(
      and(
        eq(providers.organizationId, orgId),
        eq(providers.isActive, true),
        isNull(providers.deletedAt),
      ),
    )
    .orderBy(providers.lastName, providers.firstName);
}

export async function getMatchingAuthorizationServices(
  orgId: string,
  clientId: string,
  cptCode: string,
  sessionDate: string,
): Promise<AuthServiceMatch[]> {
  const rows = await db
    .select({
      authServiceId: authorizationServices.id,
      authorizationId: authorizations.id,
      authorizationNumber: authorizations.authorizationNumber,
      cptCode: authorizationServices.cptCode,
      approvedUnits: authorizationServices.approvedUnits,
      usedUnits: authorizationServices.usedUnits,
      startDate: authorizations.startDate,
      endDate: authorizations.endDate,
      maxUnitsPerDay: authorizationServices.maxUnitsPerDay,
    })
    .from(authorizationServices)
    .innerJoin(authorizations, eq(authorizationServices.authorizationId, authorizations.id))
    .where(
      and(
        eq(authorizations.organizationId, orgId),
        eq(authorizations.clientId, clientId),
        eq(authorizations.status, "approved"),
        isNull(authorizations.deletedAt),
        eq(authorizationServices.cptCode, cptCode),
        lte(authorizations.startDate, sessionDate),
        gte(authorizations.endDate, sessionDate),
        lt(authorizationServices.usedUnits, authorizationServices.approvedUnits),
      ),
    )
    .orderBy(asc(authorizations.endDate));

  return rows.map((r) => ({
    ...r,
    remainingUnits: r.approvedUnits - r.usedUnits,
  }));
}

/** Get the most recent session's CPT + POS for a client (for form pre-fill). */
export async function getClientLastSessionDefaults(
  orgId: string,
  clientId: string,
): Promise<{ cptCode: string; placeOfService: string } | null> {
  const [row] = await db
    .select({
      cptCode: sessions.cptCode,
      placeOfService: sessions.placeOfService,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.organizationId, orgId),
        eq(sessions.clientId, clientId),
        eq(sessions.status, "completed"),
      ),
    )
    .orderBy(desc(sessions.sessionDate), desc(sessions.createdAt))
    .limit(1);

  return row ?? null;
}
