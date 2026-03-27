import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { getSessionById } from "@/server/queries/sessions";
import { sessionHasNote } from "@/server/queries/session-notes";
import { PageHeader } from "@/components/layout/page-header";
import { SessionDetailView } from "@/components/sessions/session-detail";
import { SessionActions } from "@/components/sessions/session-actions";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import { formatDate } from "@/lib/utils";
import {
  CREDENTIAL_LABELS,
  VALID_SESSION_TRANSITIONS,
  type CredentialType,
  type SessionStatus,
} from "@/lib/constants";
import { hasPermission } from "@/lib/permissions";

export const metadata: Metadata = {
  title: "Session | Clinivise",
};

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = hasPermission(user.role, "sessions.write");
  const canReadNotes = hasPermission(user.role, "notes.read");
  const canWriteNotes = hasPermission(user.role, "notes.write");

  const [session, noteState] = await Promise.all([
    getSessionById(user.organizationId, id),
    canReadNotes ? sessionHasNote(user.organizationId, id) : Promise.resolve(null),
  ]);
  if (!session) {
    notFound();
  }

  const credLabel =
    CREDENTIAL_LABELS[session.providerCredentialType as CredentialType] ??
    session.providerCredentialType;
  const canCancel =
    canEdit && VALID_SESSION_TRANSITIONS[session.status as SessionStatus]?.includes("cancelled");

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
          <SessionActions
            sessionId={id}
            sessionStatus={session.status}
            canEdit={canEdit}
            canCancel={!!canCancel}
            canWriteNotes={canWriteNotes}
            noteState={{
              hasNote: noteState?.hasNote ?? false,
              noteId: noteState?.noteId ?? null,
              noteStatus: noteState?.noteStatus ?? null,
            }}
          />
        }
      />
      <SessionDetailView
        session={session}
        noteInfo={{
          hasNote: noteState?.hasNote ?? false,
          noteId: noteState?.noteId ?? null,
          noteStatus: noteState?.noteStatus ?? null,
          noteType: noteState?.noteType ?? null,
          signedByName: noteState?.signedByName ?? null,
          signedAt: noteState?.signedAt?.toISOString() ?? null,
        }}
      />
    </div>
  );
}
