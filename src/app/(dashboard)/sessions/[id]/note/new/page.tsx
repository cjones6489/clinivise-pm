import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { requirePermission, hasPermission } from "@/lib/permissions";
import { getSessionById } from "@/server/queries/sessions";
import { sessionHasNote } from "@/server/queries/session-notes";
import { getClientGoals } from "@/server/queries/goals";
import { CPT_TO_NOTE_TYPE } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { SessionNoteForm } from "@/components/sessions/notes/session-note-form";

export const metadata: Metadata = {
  title: "Complete Note | Clinivise",
};

export default async function NewSessionNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  requirePermission(user.role, "notes.write");

  const [session, existingNote] = await Promise.all([
    getSessionById(user.organizationId, id),
    sessionHasNote(user.organizationId, id),
  ]);

  if (!session) {
    notFound();
  }

  // If note already exists, redirect to edit view
  if (existingNote.hasNote) {
    redirect(`/sessions/${id}/note`);
  }

  // Only completed/flagged sessions can have notes
  if (session.status !== "completed" && session.status !== "flagged") {
    notFound();
  }

  const noteType = CPT_TO_NOTE_TYPE[session.cptCode];
  if (!noteType) {
    notFound();
  }

  // Fetch client goals for the goal picker
  const clientGoals = await getClientGoals(user.organizationId, session.clientId);
  const goalOptions = clientGoals
    .filter((g) => g.status === "active")
    .map((g) => ({
      id: g.id,
      title: g.title,
      goalNumber: g.goalNumber != null ? String(g.goalNumber) : null,
    }));

  const canSign = hasPermission(user.role, "notes.sign");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complete Session Note"
        description={`${session.clientLastName}, ${session.clientFirstName} — ${session.sessionDate} — ${session.cptCode}`}
      />
      <SessionNoteForm
        session={{
          id: session.id,
          clientId: session.clientId,
          clientFirstName: session.clientFirstName,
          clientLastName: session.clientLastName,
          sessionDate: session.sessionDate,
          cptCode: session.cptCode,
          providerFirstName: session.providerFirstName,
          providerLastName: session.providerLastName,
          providerCredentialType: session.providerCredentialType,
        }}
        noteType={noteType}
        clientGoals={goalOptions}
        canSign={canSign}
      />
    </div>
  );
}
