import "server-only";

import { db } from "@/server/db";
import {
  sessions,
  clients,
  providers,
  authorizations,
  authorizationServices,
} from "@/server/db/schema";
import { eq, and, asc, desc, lte, gte, lt, isNull, sql } from "drizzle-orm";
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
  notes: string | null;
  createdAt: Date;
};

export type SessionDetail = SessionListItem & {
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

// ── Queries ──────────────────────────────────────────────────────────────────

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

export async function getSessions(
  orgId: string,
  opts: { page?: number; pageSize?: number } = {},
): Promise<SessionsPage> {
  const page = opts.page ?? 0;
  const pageSize = Math.min(opts.pageSize ?? 50, 100);

  const [rows, countResult] = await Promise.all([
    sessionListBase()
      .where(eq(sessions.organizationId, orgId))
      .orderBy(desc(sessions.sessionDate), desc(sessions.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessions)
      .where(eq(sessions.organizationId, orgId)),
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
      notes: sessions.notes,
      createdAt: sessions.createdAt,
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
