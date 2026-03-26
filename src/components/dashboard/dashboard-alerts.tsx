import Link from "next/link";
import { getDashboardAlerts } from "@/server/queries/dashboard";
import type { DashboardAlert } from "@/server/queries/dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const MAX_VISIBLE_ALERTS = 5;

function AlertRow({ alert }: { alert: DashboardAlert }) {
  const isCritical = alert.severity === "critical";

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
          className={cn("shrink-0", isCritical ? "text-red-600" : "text-amber-600")}
        />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-semibold">{alert.entityName}</span>
          <span className="text-muted-foreground ml-1.5 text-xs">{alert.description}</span>
        </div>
      </div>
      <Button asChild size="sm" variant="outline" className="h-7 w-full shrink-0 text-xs sm:w-auto">
        <Link href={alert.actionHref}>{alert.actionLabel}</Link>
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
          <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} className="text-emerald-500" />
          <div>
            <p className="text-xs font-medium">All authorizations on track. No action items.</p>
            <p className="text-xs text-muted-foreground">Everything looks good today.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Priority Alerts
        </span>
        {criticalCount > 0 && (
          <Badge className="border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {criticalCount} critical
          </Badge>
        )}
      </div>
      <div>
        {alerts.slice(0, MAX_VISIBLE_ALERTS).map((alert, i) => (
          <AlertRow key={`${alert.type}-${alert.entityId}-${i}`} alert={alert} />
        ))}
        {alerts.length > MAX_VISIBLE_ALERTS && (
          <div className="text-muted-foreground px-4 py-2 text-center text-xs">
            +{alerts.length - MAX_VISIBLE_ALERTS} more alerts
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
          <div key={i} className="flex items-center gap-3 border-b border-border/40 px-4 py-3 last:border-b-0">
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
