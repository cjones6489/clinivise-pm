import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { getNotesAwaitingCosign, getUnsignedNoteCount } from "@/server/queries/session-notes";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/shared/metric-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ReviewQueueTable } from "@/components/sessions/notes/review-queue-table";
import { NoteEditIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Notes | Clinivise",
};

export default async function NotesPage() {
  const user = await requireAuth();
  requirePermission(user.role, "notes.cosign");

  const [notes, counts] = await Promise.all([
    getNotesAwaitingCosign(user.organizationId),
    getUnsignedNoteCount(user.organizationId),
  ]);

  const hasNotes = notes.length > 0 || counts.draftCount > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes Review"
        description={
          hasNotes
            ? `${notes.length} note${notes.length !== 1 ? "s" : ""} awaiting co-signature`
            : "Review and co-sign session notes submitted by RBTs and BCaBAs."
        }
      />

      {hasNotes && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          <MetricCard
            label="Awaiting Co-sign"
            value={String(notes.length)}
            sub="signed, needs BCBA review"
            accent={notes.length > 0 ? "text-amber-600 dark:text-amber-400" : undefined}
          />
          <MetricCard
            label="Drafts"
            value={String(counts.draftCount)}
            sub="not yet signed by author"
          />
          <MetricCard
            label="Total Pending"
            value={String(notes.length + counts.draftCount)}
            sub="all incomplete notes"
            accent={
              notes.length + counts.draftCount > 0
                ? "text-red-600 dark:text-red-400"
                : undefined
            }
          />
        </div>
      )}

      {notes.length > 0 ? (
        <ReviewQueueTable data={notes} />
      ) : (
        <EmptyState
          icon={NoteEditIcon}
          title="No notes awaiting review"
          description="All signed notes have been co-signed. Notes will appear here when RBTs and BCaBAs submit them for review."
        />
      )}
    </div>
  );
}
