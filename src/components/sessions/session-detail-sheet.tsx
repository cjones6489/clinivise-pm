"use client";

import Link from "next/link";
import type { SessionListItem } from "@/server/queries/sessions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SessionStatusBadge } from "./session-status-badge";
import {
  CREDENTIAL_LABELS,
  PLACE_OF_SERVICE_LABELS,
  ABA_CPT_CODES,
  type CredentialType,
  type PlaceOfServiceCode,
  type CptCode,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { format } from "date-fns";

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <dt className="text-xs font-medium text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-xs text-right">{value}</dd>
    </div>
  );
}

function formatTime(ts: Date | null): string {
  if (!ts) return "—";
  return format(new Date(ts), "h:mm a");
}

export function SessionDetailSheet({
  session,
  open,
  onOpenChange,
  canEdit,
}: {
  session: SessionListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
}) {
  if (!session) return null;

  const cptMeta = ABA_CPT_CODES[session.cptCode as CptCode];
  const credLabel = CREDENTIAL_LABELS[session.providerCredentialType as CredentialType] ?? session.providerCredentialType;
  const posLabel = PLACE_OF_SERVICE_LABELS[session.placeOfService as PlaceOfServiceCode] ?? session.placeOfService;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base">Session Detail</SheetTitle>
            <SessionStatusBadge status={session.status} />
          </div>
          <SheetDescription className="text-xs">
            {formatDate(session.sessionDate)} · {session.cptCode} · {session.units} units
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Client & Provider */}
          <div>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Client & Provider</h4>
            <dl className="divide-y divide-border">
              <DetailRow label="Client" value={<span className="font-medium">{session.clientLastName}, {session.clientFirstName}</span>} />
              <DetailRow label="Provider" value={<>{session.providerLastName}, {session.providerFirstName} <span className="text-muted-foreground">({credLabel})</span></>} />
              {session.supervisorFirstName && (
                <DetailRow label="Supervisor" value={`${session.supervisorLastName}, ${session.supervisorFirstName}`} />
              )}
            </dl>
          </div>

          {/* Session Details */}
          <div>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Session Details</h4>
            <dl className="divide-y divide-border">
              <DetailRow label="Date" value={<span className="tabular-nums">{formatDate(session.sessionDate)}</span>} />
              <DetailRow label="Time" value={<span className="tabular-nums">{formatTime(session.startTime)} – {formatTime(session.endTime)}</span>} />
              <DetailRow label="CPT Code" value={<><span className="font-medium tabular-nums">{session.cptCode}</span>{cptMeta && <span className="text-muted-foreground ml-1">— {cptMeta.description}</span>}</>} />
              <DetailRow label="Units" value={<span className="font-semibold tabular-nums">{session.units}</span>} />
              {session.actualMinutes != null && (
                <DetailRow label="Duration" value={<span className="tabular-nums">{Math.floor(session.actualMinutes / 60)}h {session.actualMinutes % 60}m</span>} />
              )}
              <DetailRow label="Place of Service" value={`${session.placeOfService} — ${posLabel}`} />
              {session.modifierCodes && session.modifierCodes.length > 0 && (
                <DetailRow label="Modifiers" value={session.modifierCodes.join(", ")} />
              )}
            </dl>
          </div>

          {/* Authorization */}
          <div>
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Authorization</h4>
            <dl className="divide-y divide-border">
              <DetailRow label="Auth #" value={session.authorizationNumber ?? <span className="text-muted-foreground">None</span>} />
            </dl>
          </div>

          {/* Notes */}
          {session.notes && (
            <div>
              <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Notes</h4>
              <p className="text-xs whitespace-pre-wrap">{session.notes}</p>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1 text-xs">
            <Link href={`/sessions/${session.id}`}>Open</Link>
          </Button>
          {canEdit && (
            <Button asChild size="sm" className="flex-1 text-xs">
              <Link href={`/sessions/${session.id}/edit`}>Edit</Link>
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
