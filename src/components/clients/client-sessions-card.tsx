"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SessionListItem } from "@/server/queries/sessions";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import { NoteStatusBadge } from "@/components/sessions/note-status-badge";
import { formatDate, formatTimeCompact } from "@/lib/utils";
import { CREDENTIAL_LABELS, type CredentialType, unitsToHours } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon } from "@hugeicons/core-free-icons";

export function ClientSessionsCard({
  sessions,
  clientId,
  canEdit,
}: {
  sessions: SessionListItem[];
  clientId: string;
  canEdit: boolean;
}) {
  const router = useRouter();
  const deliveredSessions = sessions.filter(
    (s) => s.status === "completed" || s.status === "flagged",
  );
  const totalUnits = deliveredSessions.reduce((sum, s) => sum + s.units, 0);
  const totalHours = unitsToHours(totalUnits);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Sessions
          {sessions.length > 0 && (
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              {deliveredSessions.length} delivered · {totalUnits} units · {totalHours.toFixed(1)} hrs
            </span>
          )}
        </CardTitle>
        {canEdit && (
          <CardAction>
            <Button asChild size="sm" className="text-xs">
              <Link href={`/sessions/new?clientId=${clientId}`}>Log Session</Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted mb-3 rounded-lg p-3">
              <HugeiconsIcon icon={Clock01Icon} size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No sessions yet</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Log a session to start tracking service delivery.
            </p>
            {canEdit && (
              <Button asChild size="sm" className="mt-3 text-xs">
                <Link href={`/sessions/new?clientId=${clientId}`}>Log Session</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="-mx-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Time</TableHead>
                  <TableHead className="text-xs">CPT</TableHead>
                  <TableHead className="text-xs">Provider</TableHead>
                  <TableHead className="text-xs text-right">Units</TableHead>
                  <TableHead className="text-xs">Note</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer"
                    tabIndex={0}
                    role="link"
                    onClick={() => router.push(`/sessions/${s.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/sessions/${s.id}`);
                      }
                    }}
                  >
                    <TableCell className="text-xs tabular-nums font-medium">
                      {formatDate(s.sessionDate)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">
                      {s.startTime ? formatTimeCompact(s.startTime) : "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {s.cptCode}
                    </TableCell>
                    <TableCell className="text-xs">
                      {s.providerLastName}, {s.providerFirstName[0]}.{" "}
                      <span className="text-muted-foreground">
                        ({CREDENTIAL_LABELS[s.providerCredentialType as CredentialType] ??
                          s.providerCredentialType})
                      </span>
                    </TableCell>
                    <TableCell className="text-xs tabular-nums text-right font-medium">
                      {s.units}
                    </TableCell>
                    <TableCell>
                      {s.status === "completed" || s.status === "flagged" ? (
                        <NoteStatusBadge status={s.noteStatus} />
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <SessionStatusBadge status={s.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
