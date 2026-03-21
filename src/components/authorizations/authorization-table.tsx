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

import type { AuthorizationListItem } from "@/server/queries/authorizations";
import { archiveAuthorization } from "@/server/actions/authorizations";
import { getAuthorizationColumns } from "./authorization-columns";
import { DataTable } from "@/components/shared/data-table";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function AuthorizationTable({
  data,
  canEdit,
}: {
  data: AuthorizationListItem[];
  canEdit: boolean;
}) {
  const router = useRouter();
  const [archiveTarget, setArchiveTarget] = useState<AuthorizationListItem | null>(null);

  const { executeAsync } = useAction(archiveAuthorization, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Authorization archived");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to archive authorization");
    },
  });

  const columns = useMemo(
    () =>
      getAuthorizationColumns({
        onView: (auth) => router.push(`/authorizations/${auth.id}`),
        onArchive: canEdit ? (auth) => setArchiveTarget(auth) : undefined,
      }),
    [router, canEdit],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-3">
      <DataTableToolbar
        table={table}
        searchKey="client"
        searchPlaceholder="Search authorizations..."
      />
      <DataTable table={table} />
      <DataTablePagination table={table} />
      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        title="Archive authorization"
        description={
          archiveTarget
            ? `Are you sure you want to archive authorization ${archiveTarget.authorizationNumber ?? archiveTarget.id}? It will be removed from active lists.`
            : ""
        }
        onConfirm={async () => {
          if (archiveTarget) await executeAsync({ id: archiveTarget.id });
        }}
        variant="destructive"
        confirmLabel="Archive"
      />
    </div>
  );
}
