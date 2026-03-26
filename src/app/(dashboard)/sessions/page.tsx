import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getSessions, getSessionListMetrics } from "@/server/queries/sessions";
import type { SessionFilters } from "@/server/queries/sessions";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { SessionTable } from "@/components/sessions/session-table";
import { Button } from "@/components/ui/button";
import { Clock01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sessions | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba", "bcaba", "rbt"];

type FilterTab = "all" | "week" | "flagged";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "week", label: "This Week" },
  { key: "flagged", label: "Flagged" },
];

function getFiltersForTab(tab: FilterTab): SessionFilters | undefined {
  if (tab === "week") {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return { dateFrom: weekStart.toISOString().slice(0, 10) };
  }
  if (tab === "flagged") {
    return { status: "flagged" };
  }
  return undefined;
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filter?: string }>;
}) {
  const { page: pageParam, filter: filterParam } = await searchParams;
  const user = await requireAuth();
  const canCreate = WRITE_ROLES.includes(user.role);
  const page = Math.max(0, parseInt(pageParam ?? "0", 10) || 0);
  const activeTab = (["all", "week", "flagged"].includes(filterParam ?? "") ? filterParam : "all") as FilterTab;
  const filters = getFiltersForTab(activeTab);

  const [{ data: sessions, total, pageSize }, metrics] = await Promise.all([
    getSessions(user.organizationId, { page, filters }),
    getSessionListMetrics(user.organizationId),
  ]);

  const hasAnySessions = metrics.thisMonthCount > 0 || sessions.length > 0 || page > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description={
          hasAnySessions
            ? `${metrics.thisMonthCount} session${metrics.thisMonthCount !== 1 ? "s" : ""} logged this month`
            : "Log and track therapy sessions, unit consumption, and provider activity."
        }
        actions={
          canCreate ? (
            <Button asChild size="sm" className="text-xs">
              <Link href="/sessions/new">Log Session</Link>
            </Button>
          ) : undefined
        }
      />

      {hasAnySessions && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <MetricCard
              label="This Week"
              value={`${Number(metrics.hoursThisWeek).toFixed(1)}h`}
              sub="hours logged"
            />
            <MetricCard
              label="Sessions 7d"
              value={String(metrics.sessions7d)}
              sub="past 7 days"
            />
            <MetricCard
              label="Flagged"
              value={String(metrics.flaggedCount)}
              sub="needs review"
              accent={metrics.flaggedCount > 0 ? "text-red-600 dark:text-red-400" : undefined}
            />
            <MetricCard
              label="Unbilled"
              value="—"
              sub="Phase 2"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-border">
            {FILTER_TABS.map((tab) => (
              <Link
                key={tab.key}
                href={tab.key === "all" ? "/sessions" : `/sessions?filter=${tab.key}`}
                className={cn(
                  "px-3 py-2 text-xs font-medium transition-colors -mb-px",
                  activeTab === tab.key
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.key === "flagged" && metrics.flaggedCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {metrics.flaggedCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}

      {sessions.length > 0 || page > 0 ? (
        <SessionTable data={sessions} canEdit={canCreate} pagination={{ page, pageSize, total }} activeFilter={activeTab} />
      ) : hasAnySessions ? (
        <EmptyState
          icon={Clock01Icon}
          title={
            activeTab === "flagged"
              ? "No flagged sessions"
              : activeTab === "week"
                ? "No sessions this week"
                : "No sessions found"
          }
          description={
            activeTab === "flagged"
              ? "All sessions have valid authorizations. Nice work."
              : activeTab === "week"
                ? "No sessions logged this week yet."
                : "No sessions match the current view."
          }
        />
      ) : (
        <EmptyState
          icon={Clock01Icon}
          title="No sessions yet"
          description="Log your first session to start tracking service delivery and authorization utilization."
          action={
            canCreate ? (
              <Button asChild size="sm" className="text-xs">
                <Link href="/sessions/new">Log Session</Link>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
