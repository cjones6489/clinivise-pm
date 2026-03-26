import "server-only";

import { db } from "@/server/db";
import { providers, sessions, clients, clientProviders } from "@/server/db/schema";
import { eq, and, isNull, inArray, ne, sql, desc } from "drizzle-orm";
import { SUPERVISOR_CREDENTIAL_TYPES } from "@/lib/constants";

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

/** Find the provider record linked to a user (for session form pre-fill). */
export async function getProviderByUserId(orgId: string, userId: string): Promise<{ id: string } | null> {
  const [provider] = await db
    .select({ id: providers.id })
    .from(providers)
    .where(and(scopedWhere(orgId), eq(providers.userId, userId), eq(providers.isActive, true)))
    .limit(1);
  return provider ?? null;
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
    inArray(providers.credentialType, [...SUPERVISOR_CREDENTIAL_TYPES]),
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

// ── Provider Detail Queries ──────────────────────────────────────────────────

export type ProviderMetrics = {
  activeClients: number;
  hoursThisWeek: number;
  sessionsThisMonth: number;
};

export async function getProviderMetrics(
  orgId: string,
  providerId: string,
): Promise<ProviderMetrics> {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const [result] = await db
    .select({
      activeClients: sql<number>`count(distinct ${sessions.clientId}) filter (
        where ${sessions.status} != 'cancelled'
      )::int`,
      hoursThisWeek: sql<number>`coalesce(
        sum(${sessions.units}) filter (
          where ${sessions.sessionDate} >= ${weekStartStr}
          and ${sessions.status} = 'completed'
        ), 0
      )::numeric * 15.0 / 60`,
      sessionsThisMonth: sql<number>`count(*) filter (
        where ${sessions.sessionDate} >= ${monthStartStr}
        and ${sessions.status} != 'cancelled'
      )::int`,
    })
    .from(sessions)
    .where(
      and(eq(sessions.organizationId, orgId), eq(sessions.providerId, providerId)),
    );

  return {
    activeClients: result?.activeClients ?? 0,
    hoursThisWeek: Number(result?.hoursThisWeek ?? 0),
    sessionsThisMonth: result?.sessionsThisMonth ?? 0,
  };
}

export type ProviderCaseloadItem = {
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  clientStatus: string;
  role: string;
  isPrimary: boolean;
  lastSessionDate: string | null;
  sessionCount: number;
};

/** Active caseload from care team assignments, enriched with session stats */
export async function getProviderCaseload(
  orgId: string,
  providerId: string,
): Promise<ProviderCaseloadItem[]> {
  // Subquery: session stats per client for this provider
  const sessionStats = db
    .select({
      clientId: sessions.clientId,
      lastSessionDate: sql<string | null>`max(${sessions.sessionDate})`.as("last_session_date"),
      sessionCount: sql<number>`count(*)::int`.as("session_count"),
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.organizationId, orgId),
        eq(sessions.providerId, providerId),
        sql`${sessions.status} != 'cancelled'`,
      ),
    )
    .groupBy(sessions.clientId)
    .as("session_stats");

  return db
    .select({
      clientId: clients.id,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      clientStatus: clients.status,
      role: clientProviders.role,
      isPrimary: clientProviders.isPrimary,
      lastSessionDate: sessionStats.lastSessionDate,
      sessionCount: sql<number>`coalesce(${sessionStats.sessionCount}, 0)`.mapWith(Number),
    })
    .from(clientProviders)
    .innerJoin(clients, eq(clientProviders.clientId, clients.id))
    .leftJoin(sessionStats, eq(clients.id, sessionStats.clientId))
    .where(
      and(
        eq(clientProviders.organizationId, orgId),
        eq(clientProviders.providerId, providerId),
        isNull(clientProviders.endDate),
        isNull(clients.deletedAt),
      ),
    )
    .orderBy(clients.lastName, clients.firstName);
}

export type ProviderRecentSession = {
  id: string;
  sessionDate: string;
  clientFirstName: string;
  clientLastName: string;
  cptCode: string;
  units: number;
  status: string;
};

export async function getProviderRecentSessions(
  orgId: string,
  providerId: string,
): Promise<ProviderRecentSession[]> {
  return db
    .select({
      id: sessions.id,
      sessionDate: sessions.sessionDate,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      cptCode: sessions.cptCode,
      units: sessions.units,
      status: sessions.status,
    })
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .where(
      and(
        eq(sessions.organizationId, orgId),
        eq(sessions.providerId, providerId),
        isNull(clients.deletedAt),
      ),
    )
    .orderBy(desc(sessions.sessionDate), desc(sessions.createdAt))
    .limit(10);
}

export type ProviderSupervisee = {
  id: string;
  firstName: string;
  lastName: string;
  credentialType: string;
  isActive: boolean;
};

// ── Session Breakdown (KPIs) ─────────────────────────────────────────────────

export type ProviderSessionBreakdown = {
  totalSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  flaggedSessions: number;
  scheduledSessions: number;
  totalHours: number;
  avgSessionMinutes: number;
  cptDistribution: { cptCode: string; count: number }[];
};

export async function getProviderSessionBreakdown(
  orgId: string,
  providerId: string,
): Promise<ProviderSessionBreakdown> {
  const [statusResult] = await db
    .select({
      totalSessions: sql<number>`count(*)::int`,
      completedSessions: sql<number>`count(*) filter (where ${sessions.status} = 'completed')::int`,
      cancelledSessions: sql<number>`count(*) filter (where ${sessions.status} = 'cancelled')::int`,
      noShowSessions: sql<number>`count(*) filter (where ${sessions.status} = 'no_show')::int`,
      flaggedSessions: sql<number>`count(*) filter (where ${sessions.status} = 'flagged')::int`,
      scheduledSessions: sql<number>`count(*) filter (where ${sessions.status} = 'scheduled')::int`,
      totalHours: sql<number>`coalesce(sum(${sessions.units}) filter (where ${sessions.status} = 'completed'), 0)::numeric * 15.0 / 60`,
      avgSessionMinutes: sql<number>`coalesce(avg(${sessions.actualMinutes}) filter (where ${sessions.status} = 'completed' and ${sessions.actualMinutes} > 0), 0)::numeric`,
    })
    .from(sessions)
    .where(and(eq(sessions.organizationId, orgId), eq(sessions.providerId, providerId)));

  const cptDistribution = await db
    .select({
      cptCode: sessions.cptCode,
      count: sql<number>`count(*)::int`,
    })
    .from(sessions)
    .where(
      and(
        eq(sessions.organizationId, orgId),
        eq(sessions.providerId, providerId),
        sql`${sessions.status} != 'cancelled'`,
      ),
    )
    .groupBy(sessions.cptCode)
    .orderBy(sql`count(*) desc`);

  return {
    totalSessions: statusResult?.totalSessions ?? 0,
    completedSessions: statusResult?.completedSessions ?? 0,
    cancelledSessions: statusResult?.cancelledSessions ?? 0,
    noShowSessions: statusResult?.noShowSessions ?? 0,
    flaggedSessions: statusResult?.flaggedSessions ?? 0,
    scheduledSessions: statusResult?.scheduledSessions ?? 0,
    totalHours: Number(statusResult?.totalHours ?? 0),
    avgSessionMinutes: Math.round(Number(statusResult?.avgSessionMinutes ?? 0)),
    cptDistribution,
  };
}

export async function getProviderSupervisees(
  orgId: string,
  supervisorId: string,
): Promise<ProviderSupervisee[]> {
  return db
    .select({
      id: providers.id,
      firstName: providers.firstName,
      lastName: providers.lastName,
      credentialType: providers.credentialType,
      isActive: providers.isActive,
    })
    .from(providers)
    .where(
      and(
        scopedWhere(orgId),
        eq(providers.supervisorId, supervisorId),
      ),
    )
    .orderBy(providers.lastName, providers.firstName);
}
