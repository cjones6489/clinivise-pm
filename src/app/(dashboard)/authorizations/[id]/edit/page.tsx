import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import {
  getAuthorizationWithServices,
  getClientOptions,
  getClientInsuranceOptions,
  getAuthorizationOptions,
} from "@/server/queries/authorizations";
import { PageHeader } from "@/components/layout/page-header";
import { AuthorizationForm } from "@/components/authorizations/authorization-form";

export const metadata: Metadata = {
  title: "Edit Authorization | Clinivise",
};

export default async function EditAuthorizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole(["owner", "admin", "bcba"]);

  const authorization = await getAuthorizationWithServices(user.organizationId, id);
  if (!authorization) {
    notFound();
  }

  const [clientOptions, insuranceOptions, authorizationOptions] = await Promise.all([
    getClientOptions(user.organizationId),
    getClientInsuranceOptions(user.organizationId, authorization.clientId),
    getAuthorizationOptions(user.organizationId, authorization.clientId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Authorization"
        description={`${authorization.clientLastName}, ${authorization.clientFirstName} — ${authorization.payerName}`}
      />
      <AuthorizationForm
        authorization={authorization}
        clientOptions={clientOptions}
        insuranceOptions={insuranceOptions}
        authorizationOptions={authorizationOptions}
      />
    </div>
  );
}
