import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getPayers } from "@/server/queries/payers";
import { PageHeader } from "@/components/layout/page-header";
import { PayersSettings } from "@/components/settings/payers-settings";

export const metadata: Metadata = {
  title: "Payers | Clinivise",
};

export default async function PayersPage() {
  const user = await requireRole(["owner", "admin", "billing_staff"]);
  const payers = await getPayers(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payers"
        description={`${payers.length} payer${payers.length !== 1 ? "s" : ""} configured`}
      />
      <PayersSettings data={payers} />
    </div>
  );
}
