import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { getTeamMembers } from "@/server/queries/team";
import { PageHeader } from "@/components/layout/page-header";
import { TeamTable } from "@/components/team/team-table";
import { InviteMemberDialog } from "@/components/team/invite-member-dialog";

export const metadata: Metadata = {
  title: "Team | Clinivise",
};

const ROLE_DESCRIPTIONS: { role: string; description: string }[] = [
  { role: "Owner", description: "Full access. Manage billing, team, settings, and subscription." },
  { role: "Admin", description: "Full access except subscription management." },
  { role: "BCBA", description: "Clinical access for assigned caseload. Create auths, log sessions, manage treatment plans." },
  { role: "BCaBA", description: "Limited clinical access under BCBA supervision. Cannot create auths or sign off sessions." },
  { role: "RBT", description: "Session logging for assigned clients only. Cannot see billing, insurance, or other clients." },
  { role: "Billing Staff", description: "Insurance, claims, payments, payers. Cannot see clinical notes or treatment data." },
];

export default async function TeamPage() {
  const user = await requireRole(["owner", "admin"]);
  const members = await getTeamMembers(user.organizationId);

  const activeCount = members.filter((m) => m.status === "active").length;
  const canManage = user.role === "owner" || user.role === "admin";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description={`${activeCount} active member${activeCount !== 1 ? "s" : ""}`}
        actions={canManage ? <InviteMemberDialog /> : undefined}
      />

      <TeamTable members={members} currentUserId={user.id} canManage={canManage} />

      {/* Role Descriptions */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border/60 bg-muted/20 px-4 py-2.5">
          <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
            Role Descriptions
          </span>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {ROLE_DESCRIPTIONS.map((rd) => (
              <div key={rd.role} className="flex gap-3">
                <span className="w-20 shrink-0 text-xs font-semibold">{rd.role}</span>
                <span className="text-xs text-muted-foreground">{rd.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
