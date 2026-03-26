"use client";

import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cancelSession } from "@/server/actions/sessions";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";

export function SessionActions({
  sessionId,
  sessionStatus,
  canEdit,
  canCancel,
}: {
  sessionId: string;
  sessionStatus: string;
  canEdit: boolean;
  canCancel: boolean;
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

  return (
    <div className="flex items-center gap-2">
      {canCancel && (
        <ConfirmDialog
          trigger={
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive text-xs">
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
        <Button asChild size="sm" className="text-xs">
          <Link href={`/sessions/${sessionId}/edit`}>Edit Session</Link>
        </Button>
      )}
    </div>
  );
}
