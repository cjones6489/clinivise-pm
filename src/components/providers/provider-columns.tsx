"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Provider } from "@/server/queries/providers";
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
import type { CredentialType } from "@/lib/constants";
import { CREDENTIAL_LABELS } from "@/lib/constants";

export function getProviderColumns(opts: {
  onEdit: (provider: Provider) => void;
  onArchive: (provider: Provider) => void;
}): ColumnDef<Provider>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.lastName}, ${row.firstName}`,
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: "credentialType",
      header: "Credential",
      cell: ({ getValue }) => {
        const type = getValue<string>() as CredentialType;
        return <Badge variant="secondary">{CREDENTIAL_LABELS[type] ?? type}</Badge>;
      },
    },
    {
      accessorKey: "npi",
      header: "NPI",
      cell: ({ getValue }) => <span className="tabular-nums">{getValue<string>() ?? "--"}</span>,
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
            <DropdownMenuItem
              onClick={() => opts.onArchive(row.original)}
              className="text-destructive focus:text-destructive"
            >
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
