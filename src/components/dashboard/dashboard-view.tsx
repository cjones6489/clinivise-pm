"use client";

import Link from "next/link";
import type { ClientWithBcba } from "@/server/queries/clients";
import type { AuthorizationListItem } from "@/server/queries/authorizations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate, daysUntilExpiry } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

import { MetricCard } from "@/components/shared/metric-card";

// ── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  action,
  noPad,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  noPad?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {title}
        </span>
        {action}
      </div>
      <div className={noPad ? "" : "p-4"}>{children}</div>
    </div>
  );
}

// ── Alert Row ────────────────────────────────────────────────────────────────

function AlertRow({
  severity,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  severity: "critical" | "warning";
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  const bg =
    severity === "critical" ? "bg-red-50 dark:bg-red-950/30" : "bg-amber-50 dark:bg-amber-950/30";
  const border =
    severity === "critical"
      ? "border-red-200 dark:border-red-800"
      : "border-amber-200 dark:border-amber-800";
  const icon = severity === "critical" ? "text-red-600" : "text-amber-600";

  return (
    <div
      className={`flex flex-col gap-2 border-b ${border} ${bg} px-4 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-3`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
        <HugeiconsIcon icon={Alert02Icon} size={16} className={`shrink-0 ${icon}`} />
        <div className="min-w-0 flex-1">
          <span className="text-[13px] font-semibold">{title}</span>
          <span className="text-muted-foreground ml-1.5 text-[12px]">{description}</span>
        </div>
      </div>
      <Button asChild size="sm" variant="outline" className="h-7 w-full shrink-0 text-xs sm:w-auto">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}

// ── Client Row ───────────────────────────────────────────────────────────────

function ClientOverviewRow({
  client,
  auth,
}: {
  client: ClientWithBcba;
  auth?: AuthorizationListItem;
}) {
  const pct =
    auth && auth.totalApproved > 0 ? Math.round((auth.totalUsed / auth.totalApproved) * 100) : 0;
  const daysLeft = auth ? daysUntilExpiry(auth.endDate) : null;
  const hours = (units: number) => ((units * 15) / 60).toFixed(0);
  const barColor = pct >= 95 ? "[&>div]:bg-red-500" : pct >= 80 ? "[&>div]:bg-amber-500" : "";

  return (
    <Link
      href={`/clients/${client.id}`}
      className="border-border/40 hover:bg-muted/30 block border-b px-4 py-2.5 text-[13px] transition-colors last:border-b-0"
    >
      {/* Desktop: grid layout */}
      <div className="hidden items-center gap-2 sm:grid sm:grid-cols-[2fr_1fr_1fr_1.5fr_0.8fr_24px]">
        <div>
          <span className="font-semibold">
            {client.firstName} {client.lastName}
          </span>
          <span className="text-muted-foreground ml-1.5 text-[11px]">
            · {client.diagnosisCode ?? "F84.0"} · Age{" "}
            {new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear()}
          </span>
        </div>
        <div className="text-muted-foreground">
          {client.bcbaLastName ? `${client.bcbaFirstName} ${client.bcbaLastName}` : "—"}
        </div>
        <div>
          {auth ? (
            <Badge
              variant={auth.status === "approved" ? "default" : "outline"}
              className="text-[10px]"
            >
              {auth.status === "approved" ? "Active" : auth.status}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
        <div>
          {auth && auth.totalApproved > 0 ? (
            <div className="space-y-0.5">
              <Progress value={Math.min(pct, 100)} className={`h-1.5 ${barColor}`} />
              <div className="text-muted-foreground text-[11px]">
                {hours(auth.totalUsed)}/{hours(auth.totalApproved)} hrs
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground text-[11px]">—</span>
          )}
        </div>
        <div>
          {daysLeft !== null ? (
            <Badge
              variant="outline"
              className={
                daysLeft <= 0
                  ? "border-red-200 bg-red-50 text-red-700"
                  : daysLeft <= 14
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }
            >
              {daysLeft <= 0 ? "Expired" : `${daysLeft}d`}
            </Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground" />
      </div>

      {/* Mobile: stacked card layout */}
      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold">
              {client.firstName} {client.lastName}
            </span>
            <span className="text-muted-foreground ml-1.5 text-[11px]">
              · {client.diagnosisCode ?? "F84.0"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {auth ? (
              <Badge
                variant={auth.status === "approved" ? "default" : "outline"}
                className="text-[10px]"
              >
                {auth.status === "approved" ? "Active" : auth.status}
              </Badge>
            ) : null}
            {daysLeft !== null ? (
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  daysLeft <= 0
                    ? "border-red-200 bg-red-50 text-red-700"
                    : daysLeft <= 14
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
              >
                {daysLeft <= 0 ? "Expired" : `${daysLeft}d`}
              </Badge>
            ) : null}
          </div>
        </div>
        {auth && auth.totalApproved > 0 ? (
          <div className="space-y-0.5">
            <Progress value={Math.min(pct, 100)} className={`h-1.5 ${barColor}`} />
            <div className="text-muted-foreground text-[11px]">
              {hours(auth.totalUsed)}/{hours(auth.totalApproved)} hrs
              {client.bcbaLastName ? ` · ${client.bcbaFirstName} ${client.bcbaLastName}` : ""}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-[11px]">
            {client.bcbaLastName ? `${client.bcbaFirstName} ${client.bcbaLastName}` : "No auth"}
          </div>
        )}
      </div>
    </Link>
  );
}

// ── Dashboard View ───────────────────────────────────────────────────────────

export function DashboardView({
  clients,
  authorizations,
}: {
  clients: ClientWithBcba[];
  authorizations: AuthorizationListItem[];
}) {
  // Compute metrics
  const activeClients = clients.filter((c) => c.status === "active").length;
  const activeAuths = authorizations.filter(
    (a) => a.status === "approved" && new Date(a.endDate) >= new Date(),
  );
  const totalApproved = activeAuths.reduce((sum, a) => sum + a.totalApproved, 0);
  const totalUsed = activeAuths.reduce((sum, a) => sum + a.totalUsed, 0);
  const avgUtilization = totalApproved > 0 ? Math.round((totalUsed / totalApproved) * 100) : 0;

  // Build alerts
  const alerts: {
    severity: "critical" | "warning";
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  }[] = [];

  // Expired auths
  authorizations
    .filter((a) => a.status === "approved" && new Date(a.endDate) < new Date())
    .forEach((a) => {
      alerts.push({
        severity: "critical",
        title: `${a.clientFirstName} ${a.clientLastName}`,
        description: `Auth expired ${formatDate(a.endDate)} — sessions may be unbillable`,
        actionLabel: "Renew",
        actionHref: `/clients/${a.clientId}`,
      });
    });

  // Expiring auths (within 30 days)
  activeAuths
    .filter((a) => {
      const remaining = daysUntilExpiry(a.endDate);
      return remaining > 0 && remaining <= 30;
    })
    .forEach((a) => {
      const remaining = daysUntilExpiry(a.endDate);
      alerts.push({
        severity: remaining <= 7 ? "critical" : "warning",
        title: `${a.clientFirstName} ${a.clientLastName}`,
        description: `Auth expires in ${remaining} days`,
        actionLabel: "Renew",
        actionHref: `/clients/${a.clientId}`,
      });
    });

  // High utilization (>= 80%)
  activeAuths
    .filter((a) => a.totalApproved > 0 && a.totalUsed / a.totalApproved >= 0.8)
    .forEach((a) => {
      const pct = Math.round((a.totalUsed / a.totalApproved) * 100);
      alerts.push({
        severity: pct >= 95 ? "critical" : "warning",
        title: `${a.clientFirstName} ${a.clientLastName}`,
        description: `${pct}% utilized — ${pct >= 95 ? "almost exhausted" : "nearing limit"}`,
        actionLabel: "Review",
        actionHref: `/clients/${a.clientId}`,
      });
    });

  // Sort: critical first
  alerts.sort(
    (a, b) => (a.severity === "critical" ? -1 : 1) - (b.severity === "critical" ? -1 : 1),
  );
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  // Match each client with their active auth for the overview table
  const clientAuthMap = new Map<string, AuthorizationListItem>();
  for (const auth of activeAuths) {
    if (!clientAuthMap.has(auth.clientId)) {
      clientAuthMap.set(auth.clientId, auth);
    }
  }

  const utilizationColor =
    avgUtilization >= 80
      ? "var(--color-amber-600, #d97706)"
      : avgUtilization > 0
        ? "var(--color-emerald-600, #059669)"
        : undefined;

  // Show Getting Started card when practice is empty
  const showGettingStarted = clients.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-xs">
            Good morning — here&apos;s what needs attention today.
          </p>
        </div>
        <Button asChild size="sm" className="w-full text-xs sm:w-auto">
          <Link href="/clients/new">Add Client</Link>
        </Button>
      </div>

      {/* Getting Started (new practice) */}
      {showGettingStarted && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
          <div className="text-[13px] font-semibold text-blue-700 dark:text-blue-400">
            Welcome to Clinivise! Set up your practice in 3 steps:
          </div>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-blue-600">1.</span>
              <Link href="/settings" className="text-blue-700 underline dark:text-blue-400">
                Add your practice info
              </Link>
              <span className="text-muted-foreground text-[11px]">Settings → Organization</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-blue-600">2.</span>
              <Link href="/providers/new" className="text-blue-700 underline dark:text-blue-400">
                Add your team members
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-blue-600">3.</span>
              <Link href="/clients/new" className="text-blue-700 underline dark:text-blue-400">
                Add your first client
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricCard
          label="Active Clients"
          value={String(activeClients)}
          sub={`${clients.length} total`}
        />
        <MetricCard
          label="Avg Utilization"
          value={activeAuths.length > 0 ? `${avgUtilization}%` : "—"}
          sub={
            activeAuths.length > 0
              ? `across ${activeAuths.length} active auths`
              : "No active authorizations"
          }
          color={utilizationColor}
        />
        <MetricCard
          label="Active Auths"
          value={String(activeAuths.length)}
          sub={`${authorizations.length} total`}
        />
        <MetricCard
          label="Action Items"
          value={String(alerts.length)}
          sub={criticalCount > 0 ? `${criticalCount} critical` : "All clear"}
          color={criticalCount > 0 ? "var(--color-red-600, #dc2626)" : undefined}
        />
      </div>

      {/* Priority Alerts */}
      {alerts.length > 0 && (
        <SectionCard
          title="Priority Alerts"
          action={
            criticalCount > 0 ? (
              <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                {criticalCount} critical
              </Badge>
            ) : undefined
          }
          noPad
        >
          <div>
            {alerts.slice(0, 6).map((alert, i) => (
              <AlertRow key={i} {...alert} />
            ))}
            {alerts.length > 6 && (
              <div className="text-muted-foreground px-4 py-2 text-center text-[11px]">
                +{alerts.length - 6} more alerts
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Client Overview Table */}
      {clients.length > 0 && (
        <SectionCard
          title="Client Overview"
          action={
            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
              <Link href="/clients">View All →</Link>
            </Button>
          }
          noPad
        >
          <div>
            {/* Table header — hidden on mobile where rows use card layout */}
            <div className="border-border bg-muted/50 hidden grid-cols-[2fr_1fr_1fr_1.5fr_0.8fr_24px] gap-2 border-b px-4 py-2 sm:grid">
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                Client
              </span>
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                BCBA
              </span>
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                Auth
              </span>
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                Utilization
              </span>
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                Days
              </span>
              <span />
            </div>
            {/* Rows */}
            {clients.slice(0, 10).map((client) => (
              <ClientOverviewRow
                key={client.id}
                client={client}
                auth={clientAuthMap.get(client.id)}
              />
            ))}
            {clients.length > 10 && (
              <div className="px-4 py-2 text-center">
                <Link href="/clients" className="text-primary text-[11px] hover:underline">
                  View all {clients.length} clients →
                </Link>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
