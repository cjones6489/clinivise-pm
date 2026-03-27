import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { requirePermission, hasPermission } from "@/lib/permissions";
import { getSessionNoteBySessionId } from "@/server/queries/session-notes";
import { getClientGoals } from "@/server/queries/goals";
import { PageHeader } from "@/components/layout/page-header";
import { SessionNoteForm } from "@/components/sessions/notes/session-note-form";
import { NoteStatusBadge } from "@/components/sessions/note-status-badge";
import type { NoteType } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Session Note | Clinivise",
};

export default async function SessionNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  requirePermission(user.role, "notes.read");

  const note = await getSessionNoteBySessionId(user.organizationId, id);

  // No note exists — redirect to create
  if (!note) {
    if (hasPermission(user.role, "notes.write")) {
      redirect(`/sessions/${id}/note/new`);
    }
    notFound();
  }

  // Fetch client goals for the goal picker (needed for draft editing)
  const clientGoals = await getClientGoals(user.organizationId, note.clientId);
  const goalOptions = clientGoals
    .filter((g) => g.status === "active")
    .map((g) => ({
      id: g.id,
      title: g.title,
      goalNumber: g.goalNumber != null ? String(g.goalNumber) : null,
    }));

  const canSign = hasPermission(user.role, "notes.sign");
  const isDraft = note.status === "draft";

  // If draft but user can't write, they shouldn't be here
  if (isDraft && !hasPermission(user.role, "notes.write")) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isDraft ? "Edit Session Note" : "Session Note"}
        description={
          <div className="flex items-center gap-2">
            <NoteStatusBadge status={note.status} />
            <span className="text-muted-foreground text-xs">
              {note.clientLastName}, {note.clientFirstName} — {note.sessionDate} — {note.cptCode}
            </span>
          </div>
        }
      />
      <SessionNoteForm
        session={{
          id: note.sessionId,
          clientId: note.clientId,
          clientFirstName: note.clientFirstName,
          clientLastName: note.clientLastName,
          sessionDate: note.sessionDate,
          cptCode: note.cptCode,
          providerFirstName: note.providerFirstName,
          providerLastName: note.providerLastName,
          providerCredentialType: note.providerCredentialType,
        }}
        noteType={note.noteType as NoteType}
        existingNote={note}
        clientGoals={goalOptions}
        canSign={canSign}
      />
    </div>
  );
}
