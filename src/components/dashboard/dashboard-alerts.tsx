import Link from "next/link";
import { getDashboardAlerts } from "@/server/queries/dashboard";
import type { DashboardAlert } from "@/server/queries/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { AUTH_ALERT_THRESHOLDS } from "@/lib/constants";

const MAX_VISIBLE_ROWS = 5;

// ── Alert grouping (anti-fatigue: "3 auths expiring within 14d" instead of 3 rows) ──

type AlertGroup = {
  type: DashboardAlert["type"];
  severity: DashboardAlert["severity"];
  items: DashboardAlert[];
  label: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

function groupAlerts(alerts: DashboardAlert[]): AlertGroup[] {
  // Group by type + severity
  const groups = new Map<string, DashboardAlert[]>();
  for (const alert of alerts) {
    const key = `${alert.type}:${alert.severity}`;
    const existing = groups.get(key) ?? [];
    existing.push(alert);
    groups.set(key, existing);
  }

  const result: AlertGroup[] = [];
  for (const [, items] of groups) {
    const first = items[0]!;
    if (items.length === 1) {
      // Single alert — show as-is
      result.push({
        type: first.type,
        severity: first.severity,
        items,
        label: first.entityName,
        description: first.description,
        actionHref: first.actionHref,
        actionLabel: first.actionLabel,
      });
    } else {
      // Multiple alerts of same type+severity — aggregate
      const typeLabels: Record<DashboardAlert["type"], string> = {
        expired: "expired authorization",
        expiring: "authorization expiring soon",
        high_utilization: "authorization nearing limit",
        flagged_session: "flagged session",
      };
      const noun = typeLabels[first.type];
      result.push({
        type: first.type,
        severity: first.severity,
        items,
        label: `${items.length} ${noun}s`,
        description:
          first.type === "expiring"
            ? `within ${first.severity === "critical" ? "7" : AUTH_ALERT_THRESHOLDS.EXPIRY_WARNING_DAYS} days`
            : first.type === "high_utilization"
              ? `at ≥${first.severity === "critical" ? AUTH_ALERT_THRESHOLDS.UTILIZATION_CRITICAL_PCT : AUTH_ALERT_THRESHOLDS.UTILIZATION_WARNING_PCT}% utilization`
              : "",
        // Link to the relevant list page with filter
        actionHref:
          first.type === "flagged_session"
            ? "/sessions?filter=flagged"
            : first.type === "expired"
              ? "/authorizations?filter=expired"
              : first.type === "expiring"
                ? "/authorizations?filter=expiring"
                : "/authorizations?filter=active",
        actionLabel: "View All",
      });
    }
  }

  // Sort: critical first, then by type priority
  const typePriority = { expired: 0, expiring: 1, high_utilization: 2, flagged_session: 3 };
  result.sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === "critical" ? -1 : 1;
    return typePriority[a.type] - typePriority[b.type];
  });

  return result;
}

// ── Components ───────────────────────────────────────────────────────────────

function AlertRow({ group }: { group: AlertGroup }) {
  const isCritical = group.severity === "critical";

  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b px-4 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-3",
        isCritical
          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
          : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
        <HugeiconsIcon
          icon={Alert02Icon}
          size={16}
          className={cn(
            "shrink-0",
            isCritical ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400",
          )}
        />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold">{group.label}</span>
          {group.description && (
            <span className="text-muted-foreground ml-1.5 text-xs">{group.description}</span>
          )}
        </div>
      </div>
      <Button asChild size="sm" variant="outline" className="h-7 w-full shrink-0 text-xs sm:w-auto">
        <Link href={group.actionHref}>{group.actionLabel}</Link>
      </Button>
    </div>
  );
}

export async function DashboardAlerts({ orgId }: { orgId: string }) {
  const alerts = await getDashboardAlerts(orgId);
  const criticalCount = alerts.filter((a) => a.severity === "critical").length;

  // "Everything is fine" state
  if (alerts.length === 0) {
    return (
      <div className="border-border bg-card rounded-xl border shadow-sm">
        <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Priority Alerts
          </span>
        </div>
        <div className="flex items-center gap-3 px-4 py-6">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={20}
            className="text-emerald-500 dark:text-emerald-400"
          />
          <div>
            <p className="text-xs font-medium">All authorizations on track. No action items.</p>
            <p className="text-muted-foreground text-xs">Everything looks good today.</p>
          </div>
        </div>
      </div>
    );
  }

  // Group similar alerts to reduce fatigue
  const groups = groupAlerts(alerts);

  return (
    <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Priority Alerts
        </span>
        {criticalCount > 0 && (
          <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {criticalCount} critical alert{criticalCount !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>
      <div>
        {groups.slice(0, MAX_VISIBLE_ROWS).map((group, i) => (
          <AlertRow key={`${group.type}-${group.severity}-${i}`} group={group} />
        ))}
        {groups.length > MAX_VISIBLE_ROWS && (
          <div className="text-muted-foreground px-4 py-2 text-center text-xs">
            +{groups.length - MAX_VISIBLE_ROWS} more alert groups
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardAlertsSkeleton() {
  return (
    <div className="border-border bg-card animate-pulse rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 border-b px-4 py-2.5">
        <div className="bg-muted h-3 w-24 rounded" />
      </div>
      <div className="space-y-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border-border/40 flex items-center gap-3 border-b px-4 py-3 last:border-b-0"
          >
            <div className="bg-muted h-4 w-4 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <div className="bg-muted h-3 w-32 rounded" />
              <div className="bg-muted h-3 w-48 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
