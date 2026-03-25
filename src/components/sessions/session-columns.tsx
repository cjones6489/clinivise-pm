"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SessionListItem } from "@/server/queries/sessions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import { SessionStatusBadge } from "./session-status-badge";
import { formatDate } from "@/lib/utils";
import {
  CREDENTIAL_LABELS,
  type CredentialType,
  PLACE_OF_SERVICE_LABELS,
  type PlaceOfServiceCode,
} from "@/lib/constants";

export function getSessionColumns(opts: {
  onView: (session: SessionListItem) => void;
  onCancel?: (session: SessionListItem) => void;
}): ColumnDef<SessionListItem>[] {
  return [
    {
      id: "date",
      accessorKey: "sessionDate",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums">{formatDate(getValue<string>())}</span>
      ),
    },
    {
      id: "client",
      accessorFn: (row) => `${row.clientLastName}, ${row.clientFirstName}`,
      header: "Client",
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      id: "provider",
      header: "Provider",
      cell: ({ row }) => {
        const { providerFirstName, providerLastName, providerCredentialType } = row.original;
        const label =
          CREDENTIAL_LABELS[providerCredentialType as CredentialType] ?? providerCredentialType;
        return (
          <span>
            {providerLastName}, {providerFirstName}{" "}
            <span className="text-muted-foreground">({label})</span>
          </span>
        );
      },
    },
    {
      accessorKey: "cptCode",
      header: "CPT",
      cell: ({ getValue }) => (
        <span className="font-medium tabular-nums">{getValue<string>()}</span>
      ),
    },
    {
      accessorKey: "units",
      header: "Units",
      cell: ({ getValue }) => <span className="tabular-nums">{getValue<number>()}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <SessionStatusBadge status={getValue<string>()} />,
    },
    {
      accessorKey: "placeOfService",
      header: "POS",
      cell: ({ getValue }) => {
        const pos = getValue<string>();
        return (
          <span className="text-muted-foreground">
            {PLACE_OF_SERVICE_LABELS[pos as PlaceOfServiceCode] ?? pos}
          </span>
        );
      },
    },
    {
      id: "auth",
      header: "Auth #",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.authorizationNumber ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const canCancel =
          opts.onCancel &&
          (row.original.status === "scheduled" ||
            row.original.status === "completed" ||
            row.original.status === "flagged");

        return (
          // Stop propagation to prevent row click (detail sheet) from firing
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => opts.onView(row.original)}>View</DropdownMenuItem>
                {canCancel && (
                  <DropdownMenuItem
                    onClick={() => opts.onCancel!(row.original)}
                    className="text-destructive focus:text-destructive"
                  >
                    Cancel
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
