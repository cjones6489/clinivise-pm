import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getPayers } from "@/server/queries/payers";
import { PageHeader } from "@/components/layout/page-header";
import { PayersSettings } from "@/components/settings/payers-settings";
import type { UserRole } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Payers | Clinivise",
};

const ALLOWED_ROLES: UserRole[] = ["owner", "admin", "billing_staff"];

export default async function PayersPage() {
  const user = await requireAuth();

  if (!ALLOWED_ROLES.includes(user.role as UserRole)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-sm font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          You need admin, owner, or billing staff permissions to manage payers.
        </p>
      </div>
    );
  }

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
