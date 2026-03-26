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

import type { ClientListItem } from "@/server/queries/clients";
import { deleteClient } from "@/server/actions/clients";
import { getClientColumns } from "./client-columns";
import { DataTable } from "@/components/shared/data-table";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function ClientTable({ data, canEdit }: { data: ClientListItem[]; canEdit: boolean }) {
  const router = useRouter();
  const [archiveTarget, setArchiveTarget] = useState<ClientListItem | null>(null);

  const { executeAsync } = useAction(deleteClient, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Client archived");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to archive client");
    },
  });

  const columns = useMemo(
    () =>
      getClientColumns({
        onView: (client) => router.push(`/clients/${client.id}`),
        onArchive: canEdit ? (client) => setArchiveTarget(client) : undefined,
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
      <DataTableToolbar table={table} searchKey="name" searchPlaceholder="Search clients..." />
      <DataTable table={table} onRowClick={(client) => router.push(`/clients/${client.id}`)} />
      <DataTablePagination table={table} />
      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        title="Archive client"
        description={
          archiveTarget
            ? `Are you sure you want to archive ${archiveTarget.firstName} ${archiveTarget.lastName}? They will be removed from all active lists.`
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
