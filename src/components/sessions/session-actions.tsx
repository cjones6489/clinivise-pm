"use client";

import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cancelSession } from "@/server/actions/sessions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Note01Icon, NoteEditIcon } from "@hugeicons/core-free-icons";

type NoteState = {
  hasNote: boolean;
  noteId: string | null;
  noteStatus: string | null;
};

export function SessionActions({
  sessionId,
  sessionStatus,
  canEdit,
  canCancel,
  canWriteNotes,
  noteState,
}: {
  sessionId: string;
  sessionStatus: string;
  canEdit: boolean;
  canCancel: boolean;
  canWriteNotes: boolean;
  noteState: NoteState;
}) {
  const router = useRouter();

  const { executeAsync } = useAction(cancelSession, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Session cancelled");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to cancel session");
    },
  });

  // Determine note button state
  const canHaveNote = sessionStatus === "completed" || sessionStatus === "flagged";
  const noteHref = noteState.hasNote
    ? `/sessions/${sessionId}/note`
    : `/sessions/${sessionId}/note/new`;

  let noteLabel: string;
  let noteIcon: typeof Note01Icon;
  if (!noteState.hasNote) {
    noteLabel = "Complete Note";
    noteIcon = NoteEditIcon;
  } else if (noteState.noteStatus === "draft") {
    noteLabel = "Edit Note";
    noteIcon = NoteEditIcon;
  } else {
    noteLabel = "View Note";
    noteIcon = Note01Icon;
  }

  return (
    <div className="flex items-center gap-2">
      {canCancel && (
        <ConfirmDialog
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive text-xs"
            >
              <HugeiconsIcon icon={Delete01Icon} size={14} className="mr-1.5" />
              Cancel Session
            </Button>
          }
          title="Cancel session"
          description={`Are you sure you want to cancel this session? ${sessionStatus === "completed" ? "This will reverse the unit count on the linked authorization." : ""}`}
          onConfirm={async () => {
            await executeAsync({ id: sessionId });
          }}
          variant="destructive"
          confirmLabel="Cancel Session"
        />
      )}
      {canEdit && (
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href={`/sessions/${sessionId}/edit`}>Edit Session</Link>
        </Button>
      )}
      {canHaveNote && canWriteNotes && (
        <Button asChild size="sm" className="text-xs">
          <Link href={noteHref}>
            <HugeiconsIcon icon={noteIcon} size={14} className="mr-1.5" />
            {noteLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
