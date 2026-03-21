import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getProviderById, getSupervisorOptions } from "@/server/queries/providers";
import { PageHeader } from "@/components/layout/page-header";
import { ProviderForm } from "@/components/providers/provider-form";

export const metadata: Metadata = {
  title: "Edit Provider | Clinivise",
};

export default async function EditProviderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireRole(["owner", "admin"]);

  const [provider, supervisorOptions] = await Promise.all([
    getProviderById(user.organizationId, id),
    getSupervisorOptions(user.organizationId, id),
  ]);

  if (!provider) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${provider.firstName} ${provider.lastName}`}
        description="Edit provider details and credentials."
      />
      <ProviderForm provider={provider} supervisorOptions={supervisorOptions} />
    </div>
  );
}
