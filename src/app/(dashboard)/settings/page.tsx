import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getPayers } from "@/server/queries/payers";
import { PageHeader } from "@/components/layout/page-header";
import { PayersSettings } from "@/components/settings/payers-settings";
import type { UserRole } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Settings | Clinivise",
};

const ALLOWED_ROLES: UserRole[] = ["owner", "admin"];

export default async function SettingsPage() {
  const user = await requireAuth();

  if (!ALLOWED_ROLES.includes(user.role as UserRole)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-sm font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          You need admin or owner permissions to access settings.
        </p>
      </div>
    );
  }

  const payers = await getPayers(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage practice-wide configuration" />
      <PayersSettings data={payers} />
    </div>
  );
}
