import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getSupervisorOptions } from "@/server/queries/providers";
import { PageHeader } from "@/components/layout/page-header";
import { ProviderForm } from "@/components/providers/provider-form";

export const metadata: Metadata = {
  title: "Add Provider | Clinivise",
};

export default async function NewProviderPage() {
  const user = await requireRole(["owner", "admin"]);
  const supervisorOptions = await getSupervisorOptions(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Provider"
        description="Create a new provider record for your practice."
      />
      <ProviderForm supervisorOptions={supervisorOptions} />
    </div>
  );
}
