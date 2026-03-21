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

import type { Provider } from "@/server/queries/providers";
import { deleteProvider } from "@/server/actions/providers";
import { getProviderColumns } from "./provider-columns";
import { DataTable } from "@/components/shared/data-table";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

export function ProviderTable({ data }: { data: Provider[] }) {
  const router = useRouter();
  const [archiveTarget, setArchiveTarget] = useState<Provider | null>(null);

  const { executeAsync } = useAction(deleteProvider, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Provider archived");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to archive provider");
    },
  });

  const columns = useMemo(
    () =>
      getProviderColumns({
        onEdit: (provider) => router.push(`/providers/${provider.id}`),
        onArchive: (provider) => setArchiveTarget(provider),
      }),
    [router],
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
      <DataTableToolbar table={table} searchKey="name" searchPlaceholder="Search providers..." />
      <DataTable table={table} />
      <DataTablePagination table={table} />
      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        title="Archive provider"
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
