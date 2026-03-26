import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { UserGroupIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Team | Clinivise",
};

export default async function TeamPage() {
  await requireRole(["owner", "admin"]);

  return (
    <div className="space-y-6">
      <PageHeader title="Team" description="Manage your practice's team members and roles" />
      <EmptyState
        icon={UserGroupIcon}
        title="Team management coming soon"
        description="Invite members, assign ABA-specific roles (BCBA, RBT, Billing Staff), and manage access permissions."
      />
    </div>
  );
}
