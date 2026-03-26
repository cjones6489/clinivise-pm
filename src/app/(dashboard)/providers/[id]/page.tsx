import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getProviderById,
  getProviderMetrics,
  getProviderCaseload,
  getProviderRecentSessions,
  getProviderSupervisees,
} from "@/server/queries/providers";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/shared/metric-card";
import { ProviderDetailView } from "@/components/providers/provider-detail";
import { CREDENTIAL_LABELS, type CredentialType } from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";
import { formatDate, daysUntilExpiry } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Provider | Clinivise",
};

export default async function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = hasPermission(user.role, "providers.write");

  const provider = await getProviderById(user.organizationId, id);
  if (!provider) {
    notFound();
  }

  const [metrics, caseload, recentSessions, supervisees, supervisor] = await Promise.all([
    getProviderMetrics(user.organizationId, id),
    getProviderCaseload(user.organizationId, id),
    getProviderRecentSessions(user.organizationId, id),
    getProviderSupervisees(user.organizationId, id),
    provider.supervisorId
      ? getProviderById(user.organizationId, provider.supervisorId)
      : Promise.resolve(null),
  ]);

  const credLabel = CREDENTIAL_LABELS[provider.credentialType as CredentialType] ?? provider.credentialType;
  const credDaysLeft = provider.credentialExpiry ? daysUntilExpiry(provider.credentialExpiry) : null;
  const credExpiryAccent =
    credDaysLeft === null ? undefined
    : credDaysLeft <= 7 ? "text-red-600 dark:text-red-400"
    : credDaysLeft <= 30 ? "text-amber-600 dark:text-amber-400"
    : undefined;

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/providers">Providers</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{provider.firstName} {provider.lastName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Rich header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight">
              {provider.firstName} {provider.lastName}
            </h1>
            <Badge variant="secondary">{credLabel}</Badge>
            {provider.isActive ? (
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                Active
              </Badge>
            ) : (
              <Badge variant="outline">Archived</Badge>
            )}
          </div>
          <div className="text-muted-foreground mt-0.5 text-xs">
            {provider.npi && <>NPI: <span className="font-mono">{provider.npi}</span> &middot; </>}
            {provider.credentialNumber && <>Cert #{provider.credentialNumber} &middot; </>}
            {provider.credentialExpiry && (
              <>Expires {formatDate(provider.credentialExpiry)}</>
            )}
            {!provider.npi && !provider.credentialNumber && !provider.credentialExpiry && (
              <>No credential details on file</>
            )}
          </div>
        </div>
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
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricCard
          label="Active Clients"
          value={String(metrics.activeClients)}
          sub="distinct clients served"
        />
        <MetricCard
          label="Hours This Week"
          value={`${Number(metrics.hoursThisWeek).toFixed(1)}h`}
          sub="completed sessions"
        />
        <MetricCard
          label="Sessions This Month"
          value={String(metrics.sessionsThisMonth)}
          sub="non-cancelled"
        />
        <MetricCard
          label="Credential Expiry"
          value={
            credDaysLeft === null ? "—"
            : credDaysLeft < 0 ? "Expired"
            : `${credDaysLeft}d`
          }
          sub={provider.credentialExpiry ? formatDate(provider.credentialExpiry) : "No expiry date"}
          accent={credExpiryAccent}
        />
      </div>

      <ProviderDetailView
        provider={provider}
        supervisor={supervisor}
        caseload={caseload}
        recentSessions={recentSessions}
        supervisees={supervisees}
      />
    </div>
  );
}
