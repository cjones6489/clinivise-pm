import type { Metadata } from "next";
import { Suspense } from "react";
import { requireAuth } from "@/lib/auth";
import { hasClients } from "@/server/queries/clients";
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

  // Lightweight existence check (SELECT 1 LIMIT 1) — doesn't block streaming
  const showGettingStarted = !(await hasClients(orgId));

  return (
    <div className="space-y-4">
      {/* Header — pure signal, no action buttons (actions live on their pages) */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-xs">
          Here&apos;s what needs attention today.
        </p>
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
