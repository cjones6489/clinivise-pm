import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getAuthorizationWithServices,
  getClientOptions,
  getClientInsuranceOptions,
  getAuthorizationOptions,
} from "@/server/queries/authorizations";
import { PageHeader } from "@/components/layout/page-header";
import { AuthorizationDetail } from "@/components/authorizations/authorization-detail";
import { AuthStatusBadge } from "@/components/authorizations/auth-status-badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authorization | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

export default async function AuthorizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = WRITE_ROLES.includes(user.role);

  const authorization = await getAuthorizationWithServices(user.organizationId, id);
  if (!authorization) {
    notFound();
  }

  const [clientOptions, insuranceOptions, authorizationOptions] = await Promise.all([
    canEdit ? getClientOptions(user.organizationId) : Promise.resolve([]),
    getClientInsuranceOptions(user.organizationId, authorization.clientId),
    getAuthorizationOptions(user.organizationId, authorization.clientId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${authorization.clientLastName}, ${authorization.clientFirstName}`}
        description={
          <div className="flex items-center gap-2">
            <AuthStatusBadge status={authorization.status} />
            <span className="text-muted-foreground text-xs">
              {authorization.payerName}
              {authorization.authorizationNumber && ` — #${authorization.authorizationNumber}`}
            </span>
          </div>
        }
        actions={
          canEdit ? (
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link href={`/authorizations/${id}/edit`}>Edit</Link>
            </Button>
          ) : undefined
        }
      />
      <AuthorizationDetail
        authorization={authorization}
        clientOptions={clientOptions}
        insuranceOptions={insuranceOptions}
        authorizationOptions={authorizationOptions}
        canEdit={canEdit}
      />
    </div>
  );
}
