"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { SessionNoteListItem } from "@/server/queries/session-notes";
import { NoteStatusBadge } from "@/components/sessions/note-status-badge";
import { NOTE_TYPE_LABELS, type NoteType } from "@/lib/constants";
import { Button } from "@/components/ui/button";

function formatCredential(type: string): string {
  switch (type) {
    case "bcba":
      return "BCBA";
    case "bcba_d":
      return "BCBA-D";
    case "bcaba":
      return "BCaBA";
    case "rbt":
      return "RBT";
    default:
      return type.toUpperCase();
  }
}

function daysAgo(date: Date | null): string {
  if (!date) return "—";
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}

export function getReviewQueueColumns({
  onView,
  onCosign,
}: {
  onView: (note: SessionNoteListItem) => void;
  onCosign: (note: SessionNoteListItem) => void;
}): ColumnDef<SessionNoteListItem>[] {
  return [
    {
      accessorKey: "clientLastName",
      header: "Client",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.clientLastName}, {row.original.clientFirstName}
        </span>
      ),
    },
    {
      accessorKey: "sessionDate",
      header: "Session Date",
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.sessionDate}</span>
      ),
    },
    {
      accessorKey: "noteType",
      header: "Note Type",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {NOTE_TYPE_LABELS[row.original.noteType as NoteType] ?? row.original.noteType}
        </span>
      ),
    },
    {
      accessorKey: "providerLastName",
      header: "Author",
      cell: ({ row }) => (
        <span>
          {row.original.providerLastName}, {row.original.providerFirstName}
          <span className="text-muted-foreground ml-1 text-[10px]">
            ({formatCredential(row.original.providerCredentialType)})
          </span>
        </span>
      ),
    },
    {
      accessorKey: "signedAt",
      header: "Signed",
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {daysAgo(row.original.signedAt)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <NoteStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onView(row.original);
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onCosign(row.original);
            }}
          >
            Co-sign
          </Button>
        </div>
      ),
    },
  ];
}
