import Link from "next/link";

import type { SessionDetail as SessionDetailType } from "@/server/queries/sessions";
import { SessionStatusBadge } from "./session-status-badge";
import { NoteStatusBadge } from "./note-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime, utilizationPercent } from "@/lib/utils";
import { getUtilizationLevel, LEVEL_COLORS } from "@/components/shared/utilization-bar";
import {
  CREDENTIAL_LABELS,
  PLACE_OF_SERVICE_LABELS,
  ABA_CPT_CODES,
  CANCELLATION_REASON_LABELS,
  CANCELLED_BY_LABELS,
  NOTE_TYPE_LABELS,
  type CredentialType,
  type CptCode,
  type PlaceOfServiceCode,
  type CancellationReason,
  type CancelledBy,
  type NoteType,
} from "@/lib/constants";

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-xs font-medium">{children}</dd>
    </div>
  );
}

type NoteInfo = {
  hasNote: boolean;
  noteId: string | null;
  noteStatus: string | null;
  noteType?: string | null;
  signedByName?: string | null;
  signedAt?: string | null;
  cosignedByName?: string | null;
  cosignedAt?: string | null;
};

export function SessionDetailView({
  session,
  noteInfo,
}: {
  session: SessionDetailType;
  noteInfo: NoteInfo;
}) {
  const cptMeta = ABA_CPT_CODES[session.cptCode as CptCode];

  return (
    <div className="space-y-6">
      {/* Session Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            <KV label="Date">{formatDate(session.sessionDate)}</KV>
            <KV label="Status">
              <SessionStatusBadge status={session.status} />
            </KV>
            <KV label="CPT Code">
              <span className="tabular-nums">{session.cptCode}</span>
              {cptMeta && <span className="text-muted-foreground"> — {cptMeta.description}</span>}
            </KV>
            <KV label="Units">
              <span className="tabular-nums">{session.units}</span>
            </KV>
            {session.actualMinutes != null && (
              <KV label="Duration">
                <span className="tabular-nums">{session.actualMinutes} min</span>
              </KV>
            )}
            <KV label="Place of Service">
              {PLACE_OF_SERVICE_LABELS[session.placeOfService as PlaceOfServiceCode] ??
                session.placeOfService}
            </KV>
            {session.startTime && <KV label="Start Time">{formatDateTime(session.startTime)}</KV>}
            {session.endTime && <KV label="End Time">{formatDateTime(session.endTime)}</KV>}
            {session.modifierCodes && session.modifierCodes.length > 0 && (
              <KV label="Modifiers">
                <span className="tabular-nums">{session.modifierCodes.join(", ")}</span>
              </KV>
            )}
            {session.unitCalcMethod && (
              <KV label="Calc Method">{session.unitCalcMethod === "cms" ? "CMS" : "AMA"}</KV>
            )}
            {session.serviceAddress && <KV label="Service Address">{session.serviceAddress}</KV>}
            {(session.status === "cancelled" || session.status === "no_show") &&
              session.cancellationReason && (
                <KV label="Cancellation Reason">
                  {CANCELLATION_REASON_LABELS[session.cancellationReason as CancellationReason] ??
                    session.cancellationReason}
                </KV>
              )}
            {(session.status === "cancelled" || session.status === "no_show") &&
              session.cancelledBy && (
                <KV label="Cancelled By">
                  {CANCELLED_BY_LABELS[session.cancelledBy as CancelledBy] ?? session.cancelledBy}
                </KV>
              )}
          </dl>
        </CardContent>
      </Card>

      {/* Provider Info */}
      <Card>
        <CardHeader>
          <CardTitle>Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
            <KV label="Provider">
              {session.providerLastName}, {session.providerFirstName} (
              {CREDENTIAL_LABELS[session.providerCredentialType as CredentialType] ??
                session.providerCredentialType}
              )
            </KV>
            {session.supervisorFirstName && (
              <KV label="Supervisor">
                {session.supervisorLastName}, {session.supervisorFirstName}
              </KV>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Authorization Utilization */}
      {session.authorizationServiceId && session.authServiceApprovedUnits != null && (
        <Card>
          <CardHeader>
            <CardTitle>Authorization</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <KV label="Auth #">
                {session.authorizationNumber ? (
                  <Link
                    href={`/authorizations/${session.authorizationId}`}
                    className="text-primary hover:underline"
                  >
                    #{session.authorizationNumber}
                  </Link>
                ) : (
                  "—"
                )}
              </KV>
              <KV label="Utilization">
                {(() => {
                  const pct = utilizationPercent(
                    session.authServiceUsedUnits ?? 0,
                    session.authServiceApprovedUnits,
                  );
                  const level = getUtilizationLevel(pct);
                  const colors = LEVEL_COLORS[level];
                  return (
                    <span className="tabular-nums">
                      {session.authServiceUsedUnits}/{session.authServiceApprovedUnits} (
                      <span className={colors.text}>{pct}%</span>)
                    </span>
                  );
                })()}
              </KV>
              {session.authStartDate && session.authEndDate && (
                <KV label="Auth Period">
                  <span className="tabular-nums">
                    {formatDate(session.authStartDate)} — {formatDate(session.authEndDate)}
                  </span>
                </KV>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Session Note Status */}
      {noteInfo.hasNote && (
        <Card>
          <CardHeader>
            <CardTitle>Session Note</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-3">
              <KV label="Status">
                <NoteStatusBadge status={noteInfo.noteStatus ?? "draft"} />
              </KV>
              {noteInfo.noteType && (
                <KV label="Note Type">
                  {NOTE_TYPE_LABELS[noteInfo.noteType as NoteType] ?? noteInfo.noteType}
                </KV>
              )}
              {noteInfo.signedByName && (
                <KV label="Signed By">
                  {noteInfo.signedByName}
                  {noteInfo.signedAt && (
                    <span className="text-muted-foreground"> — {formatDate(noteInfo.signedAt)}</span>
                  )}
                </KV>
              )}
              {noteInfo.cosignedByName && (
                <KV label="Co-signed By">
                  {noteInfo.cosignedByName}
                  {noteInfo.cosignedAt && (
                    <span className="text-muted-foreground"> — {formatDate(noteInfo.cosignedAt)}</span>
                  )}
                </KV>
              )}
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Quick Notes */}
      {session.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs whitespace-pre-wrap">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Cancel action moved to page header via SessionActions */}
    </div>
  );
}
