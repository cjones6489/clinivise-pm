"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
  type Table as TableInstance,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableWithInstanceProps<TData> {
  table: TableInstance<TData>;
  children?: React.ReactNode;
}

interface DataTableWithDataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: React.ReactNode;
}

type DataTableProps<TData, TValue> =
  | DataTableWithInstanceProps<TData>
  | DataTableWithDataProps<TData, TValue>;

function hasTable<TData, TValue>(
  props: DataTableProps<TData, TValue>,
): props is DataTableWithInstanceProps<TData> {
  return "table" in props;
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  if (hasTable(props)) {
    return <DataTableRenderer table={props.table}>{props.children}</DataTableRenderer>;
  }
  return <DataTableInternal {...props} />;
}

function DataTableInternal<TData, TValue>({
  columns,
  data,
  children,
}: DataTableWithDataProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
  });

  return <DataTableRenderer table={table}>{children}</DataTableRenderer>;
}

function DataTableRenderer<TData>({
  table,
  children,
}: {
  table: TableInstance<TData>;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {children}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2 text-xs font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 text-xs">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-xs text-muted-foreground"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export type { ColumnDef } from "@tanstack/react-table";
