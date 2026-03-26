import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getClientById,
  getClientContacts,
  getBcbaOptions,
  getClientInsurance,
  getPayerOptions,
} from "@/server/queries/clients";
import { getClientAuthorizations, getClientAuthUtilization } from "@/server/queries/authorizations";
import { getClientSessions } from "@/server/queries/sessions";
import { ExpiryBadge } from "@/components/shared/expiry-badge";
import { Button } from "@/components/ui/button";
import { getProviderById } from "@/server/queries/providers";
import { ClientDetail } from "@/components/clients/client-detail";
import { Badge } from "@/components/ui/badge";
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_VARIANT, type ClientStatus } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { differenceInYears } from "date-fns";

export const metadata: Metadata = {
  title: "Client | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = WRITE_ROLES.includes(user.role);
  const canManagePayers = ["owner", "admin"].includes(user.role);

  const [client, contacts, bcbaOptions, insurance, payerOptions, authorizations, sessions, authUtilization] =
    await Promise.all([
      getClientById(user.organizationId, id),
      getClientContacts(user.organizationId, id),
      canEdit ? getBcbaOptions(user.organizationId) : Promise.resolve([]),
      getClientInsurance(user.organizationId, id),
      canEdit ? getPayerOptions(user.organizationId) : Promise.resolve([]),
      getClientAuthorizations(user.organizationId, id),
      getClientSessions(user.organizationId, id),
      getClientAuthUtilization(user.organizationId, id),
    ]);

  if (!client) {
    notFound();
  }

  const status = client.status as ClientStatus;
  const age = differenceInYears(new Date(), new Date(client.dateOfBirth));
  const guardian = contacts.find((c) => c.isLegalGuardian);

  // Resolve BCBA name (parallel-safe — client is already loaded)
  const bcba = client.assignedBcbaId
    ? await getProviderById(user.organizationId, client.assignedBcbaId)
    : null;
  const bcbaName = bcba ? `${bcba.firstName} ${bcba.lastName}` : null;

  return (
    <div className="space-y-3">
      {/* Back link */}
      <Link
        href="/clients"
        className="text-primary inline-flex items-center gap-1 text-[13px] hover:underline"
      >
        &larr; Back to Clients
      </Link>

      {/* Rich header — matching wireframe */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">
            {client.firstName} {client.lastName}
          </h1>
          <div className="text-muted-foreground mt-0.5 text-[13px]">
            DOB: {formatDate(client.dateOfBirth)} &middot; Age {age}
            {client.diagnosisCode && (
              <>
                {" "}
                &middot; {client.diagnosisCode}: {client.diagnosisDescription}
              </>
            )}
          </div>
          {guardian && (
            <div className="text-muted-foreground text-[13px]">
              Guardian: {guardian.firstName} {guardian.lastName}
              {guardian.phone && <> &middot; {guardian.phone}</>}
              {guardian.email && <> &middot; {guardian.email}</>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant={CLIENT_STATUS_VARIANT[status]}>
            {CLIENT_STATUS_LABELS[status] ?? status}
          </Badge>
          {insurance.length > 0 && (
            <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
              Insured
            </Badge>
          )}
          {authUtilization && (
            <ExpiryBadge endDate={authUtilization.endDate} startDate={authUtilization.startDate} />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button asChild size="sm" className="text-xs">
          <Link href={`/sessions/new?clientId=${id}`}>Log Session</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href={`/authorizations/new?clientId=${id}`}>Add Authorization</Link>
        </Button>
      </div>

      {/* Tabs + content */}
      <ClientDetail
        client={client}
        contacts={contacts}
        bcbaOptions={bcbaOptions}
        insurance={insurance}
        payerOptions={payerOptions}
        authorizations={authorizations}
        sessions={sessions}
        canEdit={canEdit}
        canManagePayers={canManagePayers}
        bcbaName={bcbaName}
        authUtilization={authUtilization}
      />
    </div>
  );
}
