import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import type { UserRole } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Team | Clinivise",
};

const ALLOWED_ROLES: UserRole[] = ["owner", "admin"];

export default async function TeamPage() {
  const user = await requireAuth();

  if (!ALLOWED_ROLES.includes(user.role as UserRole)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-sm font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          You need admin or owner permissions to manage the team.
        </p>
      </div>
    );
  }

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
