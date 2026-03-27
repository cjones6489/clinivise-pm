"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AuthorizationListItem } from "@/server/queries/authorizations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import { AuthStatusBadge } from "./auth-status-badge";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import { ExpiryBadge } from "@/components/shared/expiry-badge";
import { formatDate } from "@/lib/utils";

export function getAuthorizationColumns(opts: {
  onView: (auth: AuthorizationListItem) => void;
  onArchive?: (auth: AuthorizationListItem) => void;
}): ColumnDef<AuthorizationListItem>[] {
  return [
    {
      id: "client",
      accessorFn: (row) => `${row.clientLastName}, ${row.clientFirstName}`,
      header: "Client",
      cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
    },
    {
      accessorKey: "authorizationNumber",
      header: "Auth #",
      cell: ({ getValue }) => (
        <span className="tabular-nums">{getValue<string | null>() ?? "—"}</span>
      ),
    },
    {
      accessorKey: "payerName",
      header: "Payer",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <AuthStatusBadge status={getValue<string>()} />,
    },
    {
      id: "period",
      header: "Period",
      cell: ({ row }) => (
        <span className="text-xs tabular-nums">
          {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
        </span>
      ),
    },
    {
      id: "expiry",
      header: "Days Left",
      cell: ({ row }) => (
        <ExpiryBadge endDate={row.original.endDate} startDate={row.original.startDate} />
      ),
    },
    {
      id: "utilization",
      header: "Utilization",
      cell: ({ row }) => {
        const { totalUsed, totalApproved } = row.original;
        if (totalApproved === 0) {
          return <span className="text-muted-foreground text-xs">—</span>;
        }
        return <UtilizationBar usedUnits={totalUsed} approvedUnits={totalApproved} compact />;
      },
    },
    {
      accessorKey: "serviceCount",
      header: "Services",
      cell: ({ getValue }) => <span className="tabular-nums">{getValue<number>()}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        // Stop propagation to prevent row click from firing
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
