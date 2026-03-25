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
  onRowClick?: (row: TData) => void;
}

interface DataTableWithDataProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  children?: React.ReactNode;
  onRowClick?: (row: TData) => void;
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
    return <DataTableRenderer table={props.table} onRowClick={props.onRowClick}>{props.children}</DataTableRenderer>;
  }
  return <DataTableInternal {...props} />;
}

function DataTableInternal<TData, TValue>({
  columns,
  data,
  children,
  onRowClick,
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

  return <DataTableRenderer table={table} onRowClick={onRowClick}>{children}</DataTableRenderer>;
}

function DataTableRenderer<TData>({
  table,
  children,
  onRowClick,
}: {
  table: TableInstance<TData>;
  children?: React.ReactNode;
  onRowClick?: (row: TData) => void;
}) {
  return (
    <div className="space-y-3">
      {children}
      <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground px-3 py-2.5 text-[11px] font-semibold tracking-wide uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-accent/50 transition-colors ${onRowClick ? "cursor-pointer" : "cursor-default"}`}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2.5 text-xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="text-muted-foreground h-32 text-center text-xs"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </div>
  );
}

export type { ColumnDef } from "@tanstack/react-table";
