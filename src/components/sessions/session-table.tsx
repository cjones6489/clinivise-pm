"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { toast } from "sonner";

import type { SessionListItem } from "@/server/queries/sessions";
import { cancelSession } from "@/server/actions/sessions";
import { getSessionColumns } from "./session-columns";
import { SessionDetailSheet } from "./session-detail-sheet";
import { DataTable } from "@/components/shared/data-table";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";

export type ServerPagination = {
  page: number;
  pageSize: number;
  total: number;
};

export function SessionTable({
  data,
  canEdit,
  pagination,
}: {
  data: SessionListItem[];
  canEdit: boolean;
  pagination?: ServerPagination;
}) {
  const router = useRouter();
  const [cancelTarget, setCancelTarget] = useState<SessionListItem | null>(null);
  const [detailSession, setDetailSession] = useState<SessionListItem | null>(null);

  const { executeAsync } = useAction(cancelSession, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Session cancelled");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to cancel session");
    },
  });

  const columns = useMemo(
    () =>
      getSessionColumns({
        onView: (session) => setDetailSession(session),
        onCancel: canEdit ? (session) => setCancelTarget(session) : undefined,
      }),
    [canEdit],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Use client-side pagination within the page, server handles page boundaries
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalPages = pagination
    ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
    : 1;
  const currentPage = pagination?.page ?? 0;

  return (
    <div className="space-y-3">
      <DataTableToolbar table={table} searchKey="client" searchPlaceholder="Search sessions..." />
      <DataTable table={table} onRowClick={(session) => setDetailSession(session)} />

      {/* Server-side pagination */}
      {pagination ? (
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div>{pagination.total} session(s) total</div>
          <div className="flex items-center gap-2">
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/sessions?page=${currentPage - 1}`)}
              disabled={currentPage <= 0}
              className="h-7 px-2 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/sessions?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages - 1}
              className="h-7 px-2 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      <SessionDetailSheet
        session={detailSession}
        open={!!detailSession}
        onOpenChange={(open) => {
          if (!open) setDetailSession(null);
        }}
        canEdit={canEdit}
      />

      <ConfirmDialog
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
        title="Cancel session"
        description={
          cancelTarget
            ? `Are you sure you want to cancel this ${cancelTarget.cptCode} session on ${cancelTarget.sessionDate}? ${cancelTarget.status === "completed" ? "This will reverse the unit count on the linked authorization." : ""}`
            : ""
        }
        onConfirm={async () => {
          if (cancelTarget) await executeAsync({ id: cancelTarget.id });
        }}
        variant="destructive"
        confirmLabel="Cancel Session"
      />
    </div>
  );
}
