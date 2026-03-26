import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getProviderById, getSupervisorOptions } from "@/server/queries/providers";
import { PageHeader } from "@/components/layout/page-header";
import { ProviderForm } from "@/components/providers/provider-form";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Edit Provider | Clinivise",
};

export default async function EditProviderPage({ params }: { params: Promise<{ id: string }> }) {
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href="/providers">Providers</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link href={`/providers/${id}`}>{provider.firstName} {provider.lastName}</Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title={`Edit ${provider.firstName} ${provider.lastName}`}
        description="Update provider details and credentials."
      />
      <ProviderForm provider={provider} supervisorOptions={supervisorOptions} />
    </div>
  );
}
