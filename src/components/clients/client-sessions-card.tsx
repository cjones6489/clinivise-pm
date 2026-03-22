"use client";

import Link from "next/link";
import type { SessionListItem } from "@/server/queries/sessions";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import { formatDate } from "@/lib/utils";
import { CREDENTIAL_LABELS, type CredentialType } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
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
            <p className="text-muted-foreground text-xs">
              No sessions yet.
              {canEdit && " Log one to start tracking service delivery."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/sessions/${s.id}`}
                className="border-border hover:bg-muted/50 block space-y-2 rounded-lg border p-4 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums">
                      {formatDate(s.sessionDate)}
                    </span>
                    <span className="text-muted-foreground text-xs">{s.cptCode}</span>
                    <SessionStatusBadge status={s.status} />
                  </div>
                </div>
                <div className="flex gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Provider: </span>
                    <span className="font-medium">
                      {s.providerLastName}, {s.providerFirstName} (
                      {CREDENTIAL_LABELS[s.providerCredentialType as CredentialType] ??
                        s.providerCredentialType}
                      )
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Units: </span>
                    <span className="font-medium tabular-nums">{s.units}</span>
                  </div>
                  {s.authorizationNumber && (
                    <div>
                      <span className="text-muted-foreground">Auth: </span>
                      <span className="font-medium tabular-nums">#{s.authorizationNumber}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
