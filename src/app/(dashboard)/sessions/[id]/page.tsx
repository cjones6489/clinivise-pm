import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getSessionById } from "@/server/queries/sessions";
import { PageHeader } from "@/components/layout/page-header";
import { SessionDetailView } from "@/components/sessions/session-detail";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CREDENTIAL_LABELS, type CredentialType } from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Session | Clinivise",
};

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = hasPermission(user.role, "sessions.write");

  const session = await getSessionById(user.organizationId, id);
  if (!session) {
    notFound();
  }

  const credLabel =
    CREDENTIAL_LABELS[session.providerCredentialType as CredentialType] ??
    session.providerCredentialType;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${session.clientLastName}, ${session.clientFirstName}`}
        description={
          <div className="flex items-center gap-2">
            <SessionStatusBadge status={session.status} />
            <span className="text-muted-foreground text-xs">
              {formatDate(session.sessionDate)} &middot; {session.cptCode} &middot;{" "}
              {session.providerLastName}, {session.providerFirstName} ({credLabel})
            </span>
          </div>
        }
        actions={
          canEdit ? (
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link href={`/sessions/${id}/edit`}>Edit</Link>
            </Button>
          ) : undefined
        }
      />
      <SessionDetailView session={session} canEdit={canEdit} />
    </div>
  );
}
