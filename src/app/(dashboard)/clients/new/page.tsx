import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { ClientForm } from "@/components/clients/client-form";

export const metadata: Metadata = {
  title: "Add Client | Clinivise",
};

export default async function NewClientPage() {
  await requireRole(["owner", "admin", "bcba"]);

  return (
    <div className="space-y-6">
      <PageHeader title="Add Client" description="Create a new client record for your practice." />
      <ClientForm />
    </div>
  );
}
