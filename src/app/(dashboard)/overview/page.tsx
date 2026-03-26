import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import { getClients } from "@/server/queries/clients";
import { Button } from "@/components/ui/button";
import { SectionErrorBoundary, SectionError } from "@/components/shared/section-error-boundary";
import { DashboardMetrics, DashboardMetricsSkeleton } from "@/components/dashboard/dashboard-metrics";
import { DashboardAlerts, DashboardAlertsSkeleton } from "@/components/dashboard/dashboard-alerts";
import { DashboardClients, DashboardClientsSkeleton } from "@/components/dashboard/dashboard-clients";
import { GettingStartedCard } from "@/components/dashboard/getting-started-card";

export const metadata: Metadata = {
  title: "Overview | Clinivise",
};

export default async function OverviewPage() {
  const user = await requireAuth();
  const orgId = user.organizationId;

  // Quick check for empty practice (for Getting Started card)
  const clients = await getClients(orgId);
  const showGettingStarted = clients.length === 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-xs">
            Here&apos;s what needs attention today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="text-xs">
            <Link href="/sessions/new">Log Session</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link href="/clients/new">Add Client</Link>
          </Button>
        </div>
      </div>

      {/* Getting Started (new practice) */}
      {showGettingStarted && <GettingStartedCard />}

      {/* Metric Cards — loads first */}
      <SectionErrorBoundary fallback={<SectionError title="Metrics unavailable" />}>
        <Suspense fallback={<DashboardMetricsSkeleton />}>
          <DashboardMetrics orgId={orgId} />
        </Suspense>
      </SectionErrorBoundary>

      {/* Priority Alerts — loads second */}
      <SectionErrorBoundary fallback={<SectionError title="Alerts unavailable" />}>
        <Suspense fallback={<DashboardAlertsSkeleton />}>
          <DashboardAlerts orgId={orgId} />
        </Suspense>
      </SectionErrorBoundary>

      {/* Client Overview — loads last */}
      <SectionErrorBoundary fallback={<SectionError title="Client overview unavailable" />}>
        <Suspense fallback={<DashboardClientsSkeleton />}>
          <DashboardClients orgId={orgId} />
        </Suspense>
      </SectionErrorBoundary>
    </div>
  );
}
