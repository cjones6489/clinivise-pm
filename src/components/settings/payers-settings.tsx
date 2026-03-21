"use client";

import { useMemo, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { toast } from "sonner";

import type { Payer } from "@/server/queries/payers";
import { deletePayer } from "@/server/actions/payers";
import { getPayerColumns } from "./payer-columns";
import { PayerForm } from "./payer-form";
import { DataTable } from "@/components/shared/data-table";
import { DataTableToolbar } from "@/components/shared/data-table-toolbar";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PayersSettings({ data }: { data: Payer[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPayer, setEditingPayer] = useState<Payer | undefined>();
  const [deactivateTarget, setDeactivateTarget] = useState<Payer | null>(null);

  const { executeAsync: executeDeactivate } = useAction(deletePayer, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Payer deactivated");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to deactivate payer");
    },
  });

  const columns = useMemo(
    () =>
      getPayerColumns({
        onEdit: (payer) => {
          setEditingPayer(payer);
          setDialogOpen(true);
        },
        onDeactivate: (payer) => setDeactivateTarget(payer),
      }),
    [],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function openAddDialog() {
    setEditingPayer(undefined);
    setDialogOpen(true);
  }

  function handleSuccess() {
    setDialogOpen(false);
    setEditingPayer(undefined);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payers</CardTitle>
          <CardAction>
            <Button size="sm" className="text-xs" onClick={openAddDialog}>
              Add Payer
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <DataTableToolbar table={table} searchKey="name" searchPlaceholder="Search payers..." />
            <DataTable table={table} />
            <DataTablePagination table={table} />
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPayer ? "Edit Payer" : "Add Payer"}</DialogTitle>
          </DialogHeader>
          <PayerForm
            key={editingPayer?.id ?? "new"}
            payer={editingPayer}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => {
          if (!open) setDeactivateTarget(null);
        }}
        title="Deactivate payer"
        description={
          deactivateTarget
            ? `Are you sure you want to deactivate ${deactivateTarget.name}? It will no longer be available for new insurance policies.`
            : ""
        }
        onConfirm={async () => {
          if (deactivateTarget) {
            await executeDeactivate({ id: deactivateTarget.id });
          }
        }}
        variant="destructive"
        confirmLabel="Deactivate"
      />
    </>
  );
}
