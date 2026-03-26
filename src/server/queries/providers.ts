import "server-only";

import { db } from "@/server/db";
import { providers, sessions, clients } from "@/server/db/schema";
import { eq, and, isNull, inArray, ne, sql, desc } from "drizzle-orm";

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
  lastSessionDate: string;
  sessionCount: number;
};

export async function getProviderCaseload(
  orgId: string,
  providerId: string,
): Promise<ProviderCaseloadItem[]> {
  return db
    .select({
      clientId: clients.id,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      clientStatus: clients.status,
      lastSessionDate: sql<string>`max(${sessions.sessionDate})`,
      sessionCount: sql<number>`count(*)::int`,
    })
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .where(
      and(
        eq(sessions.organizationId, orgId),
        eq(sessions.providerId, providerId),
        isNull(clients.deletedAt),
        sql`${sessions.status} != 'cancelled'`,
      ),
    )
    .groupBy(clients.id, clients.firstName, clients.lastName, clients.status)
    .orderBy(sql`max(${sessions.sessionDate}) desc`);
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
      and(eq(sessions.organizationId, orgId), eq(sessions.providerId, providerId)),
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
