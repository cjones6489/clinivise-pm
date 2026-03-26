import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { getClientOptions } from "@/server/queries/authorizations";
import { getProviderOptions, getClientLastSessionDefaults } from "@/server/queries/sessions";
import { getProviderByUserId } from "@/server/queries/providers";
import { PageHeader } from "@/components/layout/page-header";
import { SessionForm } from "@/components/sessions/session-form";
import { PERMISSIONS } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Log Session | Clinivise",
};

export default async function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; providerId?: string }>;
}) {
  const { clientId, providerId } = await searchParams;
  const user = await requireRole([...PERMISSIONS["sessions.write"]]);

  // Parallel fetch: options + pre-fill data
  const [clientOptions, providerOptions, userProvider, lastSessionDefaults] = await Promise.all([
    getClientOptions(user.organizationId),
    getProviderOptions(user.organizationId),
    // Auto-select current user's provider (if they have one)
    !providerId ? getProviderByUserId(user.organizationId, user.id) : Promise.resolve(null),
    // Pre-fill CPT + POS from client's last session (if client is pre-selected)
    clientId ? getClientLastSessionDefaults(user.organizationId, clientId) : Promise.resolve(null),
  ]);

  const resolvedProviderId = providerId ?? userProvider?.id;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/sessions">Sessions</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Log Session</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PageHeader
        title="Log Session"
        description="Record a therapy session with unit tracking and authorization linking."
      />
      <SessionForm
        clientOptions={clientOptions}
        providerOptions={providerOptions}
        preselectedClientId={clientId}
        preselectedProviderId={resolvedProviderId}
        prefilledCptCode={lastSessionDefaults?.cptCode}
        prefilledPlaceOfService={lastSessionDefaults?.placeOfService}
      />
    </div>
  );
}
