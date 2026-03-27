import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getProviderById,
  getProviderMetrics,
  getProviderCaseload,
  getAvailableClients,
  getProviderRecentSessions,
  getProviderSupervisees,
  getProviderSessionBreakdown,
  getSupervisorOptions,
} from "@/server/queries/providers";
import type { ProviderSessionBreakdown, ProviderRecentSession } from "@/server/queries/providers";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { ProviderDetailView } from "@/components/providers/provider-detail";
import { CREDENTIAL_LABELS, type CredentialType } from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";
import { formatDate, daysUntilExpiry } from "@/lib/utils";

// ── Mock data for demo (used when provider has no real sessions) ─────────────

const MOCK_SESSION_BREAKDOWN: ProviderSessionBreakdown = {
  totalSessions: 47,
  completedSessions: 38,
  scheduledSessions: 4,
  cancelledSessions: 3,
  noShowSessions: 1,
  flaggedSessions: 1,
  totalHours: 47.5,
  avgSessionMinutes: 75,
  cptDistribution: [
    { cptCode: "97153", count: 24 },
    { cptCode: "97155", count: 9 },
    { cptCode: "97156", count: 4 },
    { cptCode: "97151", count: 3 },
  ],
};

const MOCK_METRICS = {
  activeClients: 8,
  hoursThisWeek: 12.5,
  sessionsThisMonth: 14,
};

function getMockRecentSessions(): ProviderRecentSession[] {
  const today = new Date();
  const day = (daysAgo: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  };
  return [
    {
      id: "mock-1",
      sessionDate: day(0),
      clientFirstName: "Marcus",
      clientLastName: "Rivera",
      cptCode: "97153",
      units: 8,
      status: "scheduled",
    },
    {
      id: "mock-2",
      sessionDate: day(1),
      clientFirstName: "Aiden",
      clientLastName: "Chen",
      cptCode: "97153",
      units: 8,
      status: "completed",
    },
    {
      id: "mock-3",
      sessionDate: day(1),
      clientFirstName: "Sophia",
      clientLastName: "Williams",
      cptCode: "97155",
      units: 4,
      status: "completed",
    },
    {
      id: "mock-4",
      sessionDate: day(2),
      clientFirstName: "Liam",
      clientLastName: "Patel",
      cptCode: "97153",
      units: 6,
      status: "completed",
    },
    {
      id: "mock-5",
      sessionDate: day(2),
      clientFirstName: "Emma",
      clientLastName: "Johnson",
      cptCode: "97156",
      units: 4,
      status: "completed",
    },
    {
      id: "mock-6",
      sessionDate: day(3),
      clientFirstName: "Aiden",
      clientLastName: "Chen",
      cptCode: "97153",
      units: 8,
      status: "completed",
    },
    {
      id: "mock-7",
      sessionDate: day(3),
      clientFirstName: "Olivia",
      clientLastName: "Brooks",
      cptCode: "97153",
      units: 6,
      status: "no_show",
    },
    {
      id: "mock-8",
      sessionDate: day(4),
      clientFirstName: "Noah",
      clientLastName: "Garcia",
      cptCode: "97155",
      units: 4,
      status: "completed",
    },
    {
      id: "mock-9",
      sessionDate: day(5),
      clientFirstName: "Marcus",
      clientLastName: "Rivera",
      cptCode: "97153",
      units: 8,
      status: "completed",
    },
    {
      id: "mock-10",
      sessionDate: day(6),
      clientFirstName: "Sophia",
      clientLastName: "Williams",
      cptCode: "97151",
      units: 12,
      status: "completed",
    },
  ];
}

export const metadata: Metadata = {
  title: "Provider | Clinivise",
};

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = hasPermission(user.role, "providers.write");
  const canManageCaseload = hasPermission(user.role, "clients.write");

  const provider = await getProviderById(user.organizationId, id);
  if (!provider) {
    notFound();
  }

  const [
    metrics,
    caseload,
    availableClients,
    recentSessions,
    supervisees,
    supervisor,
    sessionBreakdown,
    supervisorOptions,
  ] = await Promise.all([
    getProviderMetrics(user.organizationId, id),
    getProviderCaseload(user.organizationId, id),
    canManageCaseload ? getAvailableClients(user.organizationId, id) : Promise.resolve([]),
    getProviderRecentSessions(user.organizationId, id),
    getProviderSupervisees(user.organizationId, id),
    provider.supervisorId
      ? getProviderById(user.organizationId, provider.supervisorId)
      : Promise.resolve(null),
    getProviderSessionBreakdown(user.organizationId, id),
    canEdit ? getSupervisorOptions(user.organizationId, id) : Promise.resolve([]),
  ]);

  // Use mock data when no real sessions exist
  const useMock = sessionBreakdown.totalSessions === 0;
  const displayBreakdown = useMock ? MOCK_SESSION_BREAKDOWN : sessionBreakdown;
  const displayMetrics = useMock ? MOCK_METRICS : metrics;
  const displayRecentSessions =
    useMock && recentSessions.length === 0 ? getMockRecentSessions() : recentSessions;

  const credLabel =
    CREDENTIAL_LABELS[provider.credentialType as CredentialType] ?? provider.credentialType;
  const credDaysLeft = provider.credentialExpiry
    ? daysUntilExpiry(provider.credentialExpiry)
    : null;
  const credExpiryAccent =
    credDaysLeft === null
      ? undefined
      : credDaysLeft <= 7
        ? "text-red-600 dark:text-red-400"
        : credDaysLeft <= 30
          ? "text-amber-600 dark:text-amber-400"
          : undefined;

  return (
    <div className="space-y-3">
      {useMock && (
        <div className="border-border bg-muted/50 flex items-center gap-2 rounded-lg border px-3 py-2">
          <span className="text-muted-foreground text-xs">
            Showing demo data — log sessions to see real metrics
          </span>
        </div>
      )}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/providers">Providers</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {provider.firstName} {provider.lastName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Rich header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {provider.firstName} {provider.lastName}
          </h1>
          <div className="text-muted-foreground mt-0.5 text-xs">
            {provider.npi && (
              <>
                NPI: <span className="font-mono">{provider.npi}</span> &middot;{" "}
              </>
            )}
            {provider.credentialNumber && <>Cert #{provider.credentialNumber} &middot; </>}
            {provider.credentialExpiry && <>Expires {formatDate(provider.credentialExpiry)}</>}
            {!provider.npi && !provider.credentialNumber && !provider.credentialExpiry && (
              <>No credential details on file</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary">{credLabel}</Badge>
          {provider.isActive ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
            >
              Active
            </Badge>
          ) : (
            <Badge variant="outline">Archived</Badge>
          )}
        </div>
      </div>

      {/* Action buttons — permission-gated */}
      <div className="flex items-center gap-2">
        {hasPermission(user.role, "sessions.write") && (
          <Button asChild size="sm" className="text-xs">
            <Link href={`/sessions/new?providerId=${id}`}>Log Session</Link>
          </Button>
        )}
        {canEdit && (
          <Button asChild size="sm" variant="outline" className="text-xs">
            <Link href={`/providers/${id}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricCard
          label="Clients Served"
          value={String(displayMetrics.activeClients)}
          sub="all time"
        />
        <MetricCard
          label="Hours This Week"
          value={`${Number(displayMetrics.hoursThisWeek).toFixed(1)}h`}
          sub="completed sessions"
        />
        <MetricCard
          label="Sessions This Month"
          value={String(displayMetrics.sessionsThisMonth)}
          sub="non-cancelled"
        />
        <MetricCard
          label="Credential Expiry"
          value={credDaysLeft === null ? "—" : credDaysLeft < 0 ? "Expired" : `${credDaysLeft}d`}
          sub={provider.credentialExpiry ? formatDate(provider.credentialExpiry) : "No expiry date"}
          accent={credExpiryAccent}
        />
      </div>

      <ProviderDetailView
        provider={provider}
        supervisor={
          supervisor
            ? {
                id: supervisor.id,
                firstName: supervisor.firstName,
                lastName: supervisor.lastName,
                credentialType: supervisor.credentialType,
              }
            : null
        }
        caseload={caseload}
        availableClients={availableClients}
        recentSessions={displayRecentSessions}
        supervisees={supervisees}
        sessionBreakdown={displayBreakdown}
        canEdit={canEdit}
        canManageCaseload={canManageCaseload}
        supervisorOptions={canEdit ? supervisorOptions : []}
      />
    </div>
  );
}
