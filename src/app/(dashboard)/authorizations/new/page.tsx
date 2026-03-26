import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import {
  getClientOptions,
  getClientInsuranceOptions,
  getAuthorizationOptions,
} from "@/server/queries/authorizations";
import { PageHeader } from "@/components/layout/page-header";
import { AuthorizationForm } from "@/components/authorizations/authorization-form";

export const metadata: Metadata = {
  title: "Add Authorization | Clinivise",
};

export default async function NewAuthorizationPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;
  const user = await requireRole([...PERMISSIONS["authorizations.write"]]);
  const clientOptions = await getClientOptions(user.organizationId);

  // If clientId is pre-selected (from client detail), load their insurance + auth options
  let insuranceOptions;
  let authorizationOptions;
  if (clientId) {
    [insuranceOptions, authorizationOptions] = await Promise.all([
      getClientInsuranceOptions(user.organizationId, clientId),
      getAuthorizationOptions(user.organizationId, clientId),
    ]);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Authorization"
        description="Create a new insurance authorization with service lines."
      />
      <AuthorizationForm
        clientOptions={clientOptions}
        insuranceOptions={insuranceOptions}
        authorizationOptions={authorizationOptions}
        preselectedClientId={clientId}
      />
    </div>
  );
}
