"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ClientListItem } from "@/server/queries/clients";
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
import { differenceInYears } from "date-fns";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import { ExpiryBadge } from "@/components/shared/expiry-badge";

export function getClientColumns(opts: {
  onView: (client: ClientListItem) => void;
  onArchive?: (client: ClientListItem) => void;
}): ColumnDef<ClientListItem>[] {
  return [
    {
      id: "name",
      accessorFn: (row) => `${row.lastName} ${row.firstName}`,
      header: "Client",
      cell: ({ row }) => {
        const { firstName, lastName, dateOfBirth, diagnosisCode } = row.original;
        const age = differenceInYears(new Date(), new Date(dateOfBirth));
        return (
          <div>
            <div className="font-medium">
              {firstName} {lastName}
            </div>
            <div className="text-muted-foreground text-[11px]">
              DOB: {formatDate(dateOfBirth)} · Age {age}
              {diagnosisCode && <> · {diagnosisCode}</>}
            </div>
          </div>
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
      id: "payer",
      accessorFn: (row) => row.payerName ?? "",
      header: "Payer",
      filterFn: (row, _columnId, filterValue) => {
        if (!filterValue) return true;
        return row.getValue<string>("payer") === filterValue;
      },
      cell: ({ row }) => {
        const { payerName } = row.original;
        if (!payerName) return <span className="text-muted-foreground">—</span>;
        return <span className="truncate">{payerName}</span>;
      },
    },
    {
      id: "bcba",
      header: "Supervising BCBA",
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
      id: "utilization",
      header: "Auth Utilization",
      cell: ({ row }) => {
        const { totalApproved, totalUsed, maxUtilizationPct } = row.original;
        if (totalApproved === 0) return <span className="text-muted-foreground">—</span>;
        // Show worst-case service line utilization (not blended aggregate) to surface problems
        return (
          <UtilizationBar
            usedUnits={totalUsed}
            approvedUnits={totalApproved}
            compact
            overridePct={maxUtilizationPct}
          />
        );
      },
    },
    {
      id: "expiry",
      header: "Auth Expiry",
      cell: ({ row }) => {
        const { nearestExpiry } = row.original;
        if (!nearestExpiry) return <span className="text-muted-foreground">—</span>;
        return <ExpiryBadge endDate={nearestExpiry} />;
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        // Stop propagation to prevent row click from firing
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end">
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
