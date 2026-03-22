"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ClientWithBcba } from "@/server/queries/clients";
import type { ClientStatus } from "@/lib/constants";
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
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_VARIANT } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function getClientColumns(opts: {
  onView: (client: ClientWithBcba) => void;
  onArchive?: (client: ClientWithBcba) => void;
}): ColumnDef<ClientWithBcba>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.lastName} ${row.firstName}`,
      header: "Client",
      cell: ({ row }) => {
        const { firstName, lastName, dateOfBirth, diagnosisCode } = row.original;
        return (
          <div>
            <div className="font-medium">
              {firstName} {lastName}
            </div>
            <div className="text-muted-foreground text-[11px]">
              DOB: {formatDate(dateOfBirth)} · {diagnosisCode ?? "F84.0"}
            </div>
          </div>
        );
      },
    },
    {
      id: "age",
      header: "Age",
      cell: ({ row }) => (
        <span className="tabular-nums">{calculateAge(row.original.dateOfBirth)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue<string>() as ClientStatus;
        return (
          <Badge variant={CLIENT_STATUS_VARIANT[status]}>
            {CLIENT_STATUS_LABELS[status] ?? status}
          </Badge>
        );
      },
    },
    {
      id: "bcba",
      header: "BCBA",
      cell: ({ row }) => {
        const { bcbaLastName, bcbaFirstName } = row.original;
        if (!bcbaLastName) return <span className="text-muted-foreground">—</span>;
        return (
          <span>
            {bcbaFirstName} {bcbaLastName}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => opts.onView(row.original)}>View</DropdownMenuItem>
              {opts.onArchive && (
                <DropdownMenuItem
                  onClick={() => opts.onArchive!(row.original)}
                  className="text-destructive focus:text-destructive"
                >
                  Archive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
