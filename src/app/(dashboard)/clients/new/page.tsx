import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getBcbaOptions } from "@/server/queries/clients";
import { PageHeader } from "@/components/layout/page-header";
import { ClientForm } from "@/components/clients/client-form";

export const metadata: Metadata = {
  title: "Add Client | Clinivise",
};

export default async function NewClientPage() {
  const user = await requireRole(["owner", "admin", "bcba"]);
  const bcbaOptions = await getBcbaOptions(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader title="Add Client" description="Create a new client record for your practice." />
      <ClientForm bcbaOptions={bcbaOptions} />
    </div>
  );
}
