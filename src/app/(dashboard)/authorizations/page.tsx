import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getAuthorizations, getAuthListMetrics } from "@/server/queries/authorizations";
import type { AuthFilters } from "@/server/queries/authorizations";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import { AuthorizationTable } from "@/components/authorizations/authorization-table";
import { Button } from "@/components/ui/button";
import { FileValidationIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { getUtilizationLevel, LEVEL_COLORS } from "@/components/shared/utilization-bar";

export const metadata: Metadata = {
  title: "Authorizations | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

type FilterTab = "all" | "active" | "expiring" | "expired" | "pending";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "expired", label: "Expired" },
  { key: "pending", label: "Pending" },
];

function getFiltersForTab(tab: FilterTab): AuthFilters | undefined {
  if (tab === "all") return undefined;
  return { statusCategory: tab };
}

export default async function AuthorizationsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: filterParam } = await searchParams;
  const user = await requireAuth();
  const canCreate = WRITE_ROLES.includes(user.role);
  const validKeys = FILTER_TABS.map((t) => t.key);
  const activeTab = validKeys.includes(filterParam as FilterTab) ? (filterParam as FilterTab) : "all";
  const filters = getFiltersForTab(activeTab);

  const [authorizations, metrics] = await Promise.all([
    getAuthorizations(user.organizationId, { filters }),
    getAuthListMetrics(user.organizationId),
  ]);

  // Show metric cards + filter tabs if the practice has any auth data at all (unfiltered)
  const hasAnyAuths = metrics.totalCount > 0;
  const utilizationLevel = getUtilizationLevel(metrics.avgUtilization);
  const utilizationAccent = metrics.avgUtilization > 0 ? LEVEL_COLORS[utilizationLevel].text : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorizations"
        description={
          hasAnyAuths
            ? `${metrics.activeCount} active authorization${metrics.activeCount !== 1 ? "s" : ""}`
            : "Track insurance authorizations, service lines, and utilization."
        }
        actions={
          canCreate ? (
            <Button asChild size="sm" className="text-xs">
              <Link href="/authorizations/new">Upload Auth Letter</Link>
            </Button>
          ) : undefined
        }
      />

      {hasAnyAuths && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <MetricCard
              label="Active"
              value={String(metrics.activeCount)}
              sub="approved & current"
              accent="text-emerald-600 dark:text-emerald-400"
            />
            <MetricCard
              label="Expiring 30d"
              value={String(metrics.expiring30dCount)}
              sub="needs renewal"
              accent={metrics.expiring30dCount > 0 ? "text-amber-600 dark:text-amber-400" : undefined}
            />
            <MetricCard
              label="Expired"
              value={String(metrics.expiredCount)}
              sub="past end date"
              accent={metrics.expiredCount > 0 ? "text-red-600 dark:text-red-400" : undefined}
            />
            <MetricCard
              label="Avg Utilization"
              value={`${metrics.avgUtilization}%`}
              sub="across active auths"
              accent={utilizationAccent}
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-border">
            {FILTER_TABS.map((tab) => (
              <Link
                key={tab.key}
                href={tab.key === "all" ? "/authorizations" : `/authorizations?filter=${tab.key}`}
                className={cn(
                  "px-3 py-2 text-xs font-medium transition-colors -mb-px",
                  activeTab === tab.key
                    ? "border-b-2 border-foreground text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {tab.key === "expiring" && metrics.expiring30dCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    {metrics.expiring30dCount}
                  </span>
                )}
                {tab.key === "expired" && metrics.expiredCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {metrics.expiredCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}

      {authorizations.length > 0 ? (
        <AuthorizationTable data={authorizations} canEdit={canCreate} />
      ) : hasAnyAuths ? (
        <EmptyState
          icon={FileValidationIcon}
          title={
            activeTab === "active" ? "No active authorizations"
            : activeTab === "expiring" ? "No expiring authorizations"
            : activeTab === "expired" ? "No expired authorizations"
            : activeTab === "pending" ? "No pending authorizations"
            : "No authorizations found"
          }
          description="No authorizations match the current filter."
        />
      ) : (
        <EmptyState
          icon={FileValidationIcon}
          title="No authorizations yet"
          description="Add your first authorization to start tracking approved services and utilization."
          action={
            canCreate ? (
              <Button asChild size="sm" className="text-xs">
                <Link href="/authorizations/new">Upload Auth Letter</Link>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
