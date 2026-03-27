"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import type { SessionNoteListItem } from "@/server/queries/session-notes";
import { cosignSessionNote } from "@/server/actions/session-notes";
import { getReviewQueueColumns } from "./review-queue-columns";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function ReviewQueueTable({ data }: { data: SessionNoteListItem[] }) {
  const router = useRouter();
  const [cosignTarget, setCosignTarget] = useState<SessionNoteListItem | null>(null);

  const { executeAsync } = useAction(cosignSessionNote, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Note co-signed successfully");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to co-sign note");
    },
  });

  const columns = useMemo(
    () =>
      getReviewQueueColumns({
        onView: (note) => router.push(`/sessions/${note.sessionId}/note`),
        onCosign: (note) => setCosignTarget(note),
      }),
    [],
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        onRowClick={(note) => router.push(`/sessions/${note.sessionId}/note`)}
      />
      <ConfirmDialog
        open={!!cosignTarget}
        onOpenChange={(open) => !open && setCosignTarget(null)}
        title="Co-sign Session Note"
        description={
          cosignTarget
            ? `Co-sign the ${cosignTarget.noteType.replace("_", " ")} note for ${cosignTarget.clientLastName}, ${cosignTarget.clientFirstName} (${cosignTarget.sessionDate})? This action is permanent and certifies you have reviewed the note.`
            : ""
        }
        confirmLabel="Co-sign"
        onConfirm={async () => {
          if (cosignTarget) {
            await executeAsync({ id: cosignTarget.id });
          }
        }}
      />
    </>
  );
}
