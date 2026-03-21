"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Payer } from "@/server/queries/payers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import {
  PAYER_TYPE_LABELS,
  UNIT_CALC_METHOD_LABELS,
  type PayerType,
  type UnitCalcMethod,
} from "@/lib/constants";

export function getPayerColumns(opts: {
  onEdit: (payer: Payer) => void;
  onDeactivate: (payer: Payer) => void;
}): ColumnDef<Payer>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: "payerType",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue<string>() as PayerType;
        return <Badge variant="secondary">{PAYER_TYPE_LABELS[type] ?? type}</Badge>;
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ getValue }) => <span>{getValue<string>() ?? "--"}</span>,
    },
    {
      accessorKey: "authPhone",
      header: "Auth Phone",
      cell: ({ getValue }) => <span>{getValue<string>() ?? "--"}</span>,
    },
    {
      accessorKey: "timelyFilingDays",
      header: "Filing Days",
      cell: ({ getValue }) => <span className="tabular-nums">{getValue<number>() ?? "--"}</span>,
    },
    {
      accessorKey: "unitCalcMethod",
      header: "Unit Calc",
      cell: ({ getValue }) => {
        const method = getValue<string>() as UnitCalcMethod;
        return <span>{UNIT_CALC_METHOD_LABELS[method] ?? method}</span>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ getValue }) => {
        const active = getValue<boolean>();
        return (
          <Badge variant={active ? "default" : "outline"}>{active ? "Active" : "Inactive"}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => opts.onEdit(row.original)}>Edit</DropdownMenuItem>
            {row.original.isActive && (
              <DropdownMenuItem
                onClick={() => opts.onDeactivate(row.original)}
                className="text-destructive focus:text-destructive"
              >
                Deactivate
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
