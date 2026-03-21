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
      accessorFn: (row) => `${row.lastName}, ${row.firstName}`,
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: "dateOfBirth",
      header: "DOB",
      cell: ({ getValue }) => {
        const dob = getValue<string>();
        return (
          <span className="tabular-nums">
            {formatDate(dob)} ({calculateAge(dob)})
          </span>
        );
      },
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
        return bcbaLastName ? `${bcbaLastName}, ${bcbaFirstName}` : "—";
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
      ),
    },
  ];
}
