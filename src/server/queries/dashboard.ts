import "server-only";

import { db } from "@/server/db";
import {
  clients,
  authorizations,
  authorizationServices,
  sessions,
  providers,
  clientInsurance,
  clientProviders,
  payers,
} from "@/server/db/schema";
import { eq, and, isNull, sql, asc, desc } from "drizzle-orm";
import { AUTH_ALERT_THRESHOLDS } from "@/lib/constants";
import { daysUntilExpiry } from "@/lib/utils";
import { getExpiryLevel } from "@/components/shared/expiry-badge";

// ── Types ────────────────────────────────────────────────────────────────────

export type DashboardMetrics = {
  activeClients: number;
  totalClients: number;
  avgUtilization: number;
  hoursThisWeek: number;
  actionItemCount: number;
  criticalCount: number;
};

export type DashboardAlert = {
  type: "expired" | "expiring" | "high_utilization" | "flagged_session";
  severity: "critical" | "warning";
  entityId: string;
  entityName: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

export type DashboardClientRow = {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  diagnosisCode: string | null;
  dateOfBirth: string;
  bcbaName: string | null;
  payerName: string | null;
  totalApproved: number;
  totalUsed: number;
  nearestExpiry: string | null;
  urgencyScore: number;
};

// ── Metrics Query ────────────────────────────────────────────────────────────

export async function getDashboardMetrics(orgId: string): Promise<DashboardMetrics> {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  // Monday of this week (ISO week)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  // Service aggregation subquery for active auths
  const svcAgg = db
    .select({
      authorizationId: authorizationServices.authorizationId,
      totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.as("total_approved"),
      totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.as("total_used"),
    })
    .from(authorizationServices)
    .groupBy(authorizationServices.authorizationId)
    .as("svc_agg");

  // Alert threshold constants
  const warningPct = AUTH_ALERT_THRESHOLDS.UTILIZATION_WARNING_PCT / 100;
  const criticalPct = AUTH_ALERT_THRESHOLDS.UTILIZATION_CRITICAL_PCT / 100;

  // All 5 queries are independent — run in parallel to minimize latency
  const [
    [clientMetrics],
    [authMetrics],
    [sessionMetrics],
    authAlertRows,
    [flaggedResult],
  ] = await Promise.all([
    // Client count
    db
      .select({
        activeClients: sql<number>`count(*) filter (where ${clients.status} = 'active')::int`,
        totalClients: sql<number>`count(*)::int`,
      })
      .from(clients)
      .where(and(eq(clients.organizationId, orgId), isNull(clients.deletedAt))),

    // Auth utilization across active auths
    db
      .select({
        avgUtilization: sql<number>`coalesce(
          round(
            sum(${svcAgg.totalUsed})::numeric
            / nullif(sum(${svcAgg.totalApproved}), 0) * 100
          ), 0
        )::int`,
      })
      .from(authorizations)
      .leftJoin(svcAgg, eq(authorizations.id, svcAgg.authorizationId))
      .where(
        and(
          eq(authorizations.organizationId, orgId),
          isNull(authorizations.deletedAt),
          eq(authorizations.status, "approved"),
          sql`${authorizations.endDate} >= ${todayStr}`,
        ),
      ),

    // Hours this week from sessions — WHERE limits scan to this week for index usage
    db
      .select({
        hoursThisWeek: sql<number>`coalesce(
          sum(${sessions.units}) filter (
            where ${sessions.status} = 'completed'
          ), 0
        )::numeric * 15.0 / 60`.mapWith(Number),
      })
      .from(sessions)
      .where(and(eq(sessions.organizationId, orgId), sql`${sessions.sessionDate} >= ${weekStartStr}`)),

    // Auth alert rows (for counting)
    db
      .select({
        endDate: authorizations.endDate,
        status: authorizations.status,
        totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.mapWith(Number),
        totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.mapWith(Number),
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
      .groupBy(authorizations.id, authorizations.endDate, authorizations.status),

    // Flagged session count
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessions)
      .where(and(eq(sessions.organizationId, orgId), eq(sessions.status, "flagged"))),
  ]);

  let actionItemCount = 0;
  let criticalCount = 0;

  for (const row of authAlertRows) {
    const daysLeft = daysUntilExpiry(row.endDate);
    const level = getExpiryLevel(daysLeft, false);
    const utilPct = row.totalApproved > 0 ? row.totalUsed / row.totalApproved : 0;

    // Determine worst severity for this auth (expiry vs utilization)
    let hasCritical = false;
    let hasWarning = false;

    if (daysLeft < 0) {
      hasCritical = true; // expired
    } else if (level === "critical") {
      hasCritical = true;
    } else if (level === "warning") {
      hasWarning = true;
    }

    if (utilPct >= criticalPct) {
      hasCritical = true;
    } else if (utilPct >= warningPct) {
      hasWarning = true;
    }

    // Count each auth once regardless of how many issues it has
    if (hasCritical || hasWarning) {
      actionItemCount++;
      if (hasCritical) criticalCount++;
    }
  }

  const flaggedCount = flaggedResult?.count ?? 0;
  actionItemCount += flaggedCount;
  criticalCount += flaggedCount; // flagged sessions are critical

  return {
    activeClients: clientMetrics?.activeClients ?? 0,
    totalClients: clientMetrics?.totalClients ?? 0,
    avgUtilization: authMetrics?.avgUtilization ?? 0,
    hoursThisWeek: sessionMetrics?.hoursThisWeek ?? 0,
    actionItemCount,
    criticalCount,
  };
}

// ── Alerts Query ─────────────────────────────────────────────────────────────

export async function getDashboardAlerts(orgId: string): Promise<DashboardAlert[]> {
  const warningPct = AUTH_ALERT_THRESHOLDS.UTILIZATION_WARNING_PCT / 100;

  // Fetch all approved auths with aggregated utilization
  const authRows = await db
    .select({
      id: authorizations.id,
      clientId: authorizations.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      endDate: authorizations.endDate,
      authorizationNumber: authorizations.authorizationNumber,
      totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.mapWith(Number),
      totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.mapWith(Number),
    })
    .from(authorizations)
    .innerJoin(clients, eq(authorizations.clientId, clients.id))
    .leftJoin(authorizationServices, eq(authorizations.id, authorizationServices.authorizationId))
    .where(
      and(
        eq(authorizations.organizationId, orgId),
        isNull(authorizations.deletedAt),
        eq(authorizations.status, "approved"),
      ),
    )
    .groupBy(
      authorizations.id,
      authorizations.clientId,
      clients.firstName,
      clients.lastName,
      authorizations.endDate,
      authorizations.authorizationNumber,
    )
    .orderBy(asc(authorizations.endDate));

  const alerts: DashboardAlert[] = [];

  for (const row of authRows) {
    const daysLeft = daysUntilExpiry(row.endDate);
    const clientName = `${row.clientFirstName} ${row.clientLastName}`;
    const utilPct = row.totalApproved > 0 ? Math.round((row.totalUsed / row.totalApproved) * 100) : 0;

    // Expired
    if (daysLeft < 0) {
      alerts.push({
        type: "expired",
        severity: "critical",
        entityId: row.id,
        entityName: clientName,
        description: "Authorization expired — sessions may be unbillable",
        actionHref: `/clients/${row.clientId}`,
        actionLabel: "Renew",
      });
    }
    // Expiring within 30 days
    else if (daysLeft <= 30) {
      alerts.push({
        type: "expiring",
        severity: daysLeft <= 7 ? "critical" : "warning",
        entityId: row.id,
        entityName: clientName,
        description: daysLeft === 0
          ? "Authorization expires today"
          : `Authorization expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
        actionHref: `/clients/${row.clientId}`,
        actionLabel: "Renew",
      });
    }

    // High utilization
    if (row.totalApproved > 0 && row.totalUsed / row.totalApproved >= warningPct) {
      alerts.push({
        type: "high_utilization",
        severity: utilPct >= AUTH_ALERT_THRESHOLDS.UTILIZATION_CRITICAL_PCT ? "critical" : "warning",
        entityId: row.id,
        entityName: clientName,
        description: `${utilPct}% utilized — ${utilPct >= AUTH_ALERT_THRESHOLDS.UTILIZATION_CRITICAL_PCT ? "almost exhausted" : "nearing limit"}`,
        actionHref: `/authorizations/${row.id}`,
        actionLabel: "Review",
      });
    }
  }

  // Flagged sessions
  const flaggedSessions = await db
    .select({
      id: sessions.id,
      clientId: sessions.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      sessionDate: sessions.sessionDate,
      cptCode: sessions.cptCode,
    })
    .from(sessions)
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .where(
      and(
        eq(sessions.organizationId, orgId),
        eq(sessions.status, "flagged"),
      ),
    )
    .orderBy(desc(sessions.sessionDate))
    .limit(10);

  for (const s of flaggedSessions) {
    alerts.push({
      type: "flagged_session",
      severity: "critical",
      entityId: s.id,
      entityName: `${s.clientFirstName} ${s.clientLastName}`,
      description: `Flagged session (${s.cptCode}) on ${s.sessionDate}`,
      actionHref: `/sessions/${s.id}`,
      actionLabel: "Review",
    });
  }

  // Sort: critical first, then by type priority
  alerts.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
    const typePriority = { expired: 0, expiring: 1, high_utilization: 2, flagged_session: 3 };
    return typePriority[a.type] - typePriority[b.type];
  });

  return alerts;
}

// ── Client Overview Query ────────────────────────────────────────────────────

export async function getClientOverviewForDashboard(
  orgId: string,
): Promise<DashboardClientRow[]> {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Subquery: per-client auth utilization for active auths
  const authUtil = db
    .select({
      clientId: authorizations.clientId,
      totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`.as("total_approved"),
      totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`.as("total_used"),
      nearestExpiry: sql<string>`min(${authorizations.endDate})`.as("nearest_expiry"),
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

  // Primary insurance subquery
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
        eq(clientInsurance.isActive, true),
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
      status: clients.status,
      diagnosisCode: clients.diagnosisCode,
      dateOfBirth: clients.dateOfBirth,
      bcbaName: sql<string | null>`case when ${primaryBcba.bcbaFirstName} is not null then ${primaryBcba.bcbaFirstName} || ' ' || ${primaryBcba.bcbaLastName} else null end`,
      payerName: primaryIns.payerName,
      totalApproved: sql<number>`coalesce(${authUtil.totalApproved}, 0)`.mapWith(Number),
      totalUsed: sql<number>`coalesce(${authUtil.totalUsed}, 0)`.mapWith(Number),
      nearestExpiry: authUtil.nearestExpiry,
    })
    .from(clients)
    .leftJoin(primaryBcba, eq(clients.id, primaryBcba.clientId))
    .leftJoin(authUtil, eq(clients.id, authUtil.clientId))
    .leftJoin(primaryIns, eq(clients.id, primaryIns.clientId))
    .where(
      and(
        eq(clients.organizationId, orgId),
        isNull(clients.deletedAt),
        sql`${clients.status} != 'archived'`,
      ),
    );

  // Compute urgency score and sort client-side (complex multi-field sort)
  const scored = rows.map((row) => {
    let urgencyScore = 0;
    if (row.nearestExpiry) {
      const daysLeft = daysUntilExpiry(row.nearestExpiry);
      if (daysLeft < 0) urgencyScore = 100; // expired
      else if (daysLeft <= 7) urgencyScore = 90;
      else if (daysLeft <= 30) urgencyScore = 70;
    }
    if (row.totalApproved > 0) {
      const utilPct = row.totalUsed / row.totalApproved;
      if (utilPct >= AUTH_ALERT_THRESHOLDS.UTILIZATION_CRITICAL_PCT / 100) {
        urgencyScore = Math.max(urgencyScore, 85);
      } else if (utilPct >= AUTH_ALERT_THRESHOLDS.UTILIZATION_WARNING_PCT / 100) {
        urgencyScore = Math.max(urgencyScore, 60);
      }
    }
    return { ...row, urgencyScore };
  });

  scored.sort((a, b) => {
    if (a.urgencyScore !== b.urgencyScore) return b.urgencyScore - a.urgencyScore;
    // Tiebreaker: alphabetical by last name
    return a.lastName.localeCompare(b.lastName);
  });

  return scored.slice(0, 10);
}
