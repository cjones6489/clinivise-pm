import { getDashboardMetrics } from "@/server/queries/dashboard";
import { MetricCard } from "@/components/shared/metric-card";
import { getUtilizationLevel, LEVEL_COLORS } from "@/components/shared/utilization-bar";

export async function DashboardMetrics({ orgId }: { orgId: string }) {
  const metrics = await getDashboardMetrics(orgId);

  const utilizationLevel = getUtilizationLevel(metrics.avgUtilization);
  const utilizationAccent =
    metrics.avgUtilization > 0 ? LEVEL_COLORS[utilizationLevel].text : undefined;

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      <MetricCard
        label="Active Clients"
        value={String(metrics.activeClients)}
        sub={`${metrics.totalClients} total`}
      />
      <MetricCard
        label="Avg Utilization"
        value={metrics.avgUtilization > 0 ? `${metrics.avgUtilization}%` : "—"}
        sub={metrics.avgUtilization > 0 ? "across active auths" : "No active authorizations"}
        accent={utilizationAccent}
      />
      <MetricCard
        label="Hours This Week"
        value={`${Number(metrics.hoursThisWeek).toFixed(1)}h`}
        sub="completed sessions"
      />
      <MetricCard
        label="Action Items"
        value={String(metrics.actionItemCount)}
        sub={metrics.criticalCount > 0 ? `${metrics.criticalCount} critical` : "All clear"}
        accent={metrics.criticalCount > 0 ? LEVEL_COLORS.critical.text : undefined}
      />
    </div>
  );
}

export function DashboardMetricsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="border-border bg-card animate-pulse rounded-xl border px-4 py-4 shadow-sm"
        >
          <div className="bg-muted h-3 w-20 rounded" />
          <div className="bg-muted mt-3 h-7 w-16 rounded" />
          <div className="bg-muted mt-2 h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  );
}
