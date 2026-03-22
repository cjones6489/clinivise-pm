"use client";

import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { SessionDetail as SessionDetailType } from "@/server/queries/sessions";
import { cancelSession } from "@/server/actions/sessions";
import { SessionStatusBadge } from "./session-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime, utilizationPercent } from "@/lib/utils";
import {
  CREDENTIAL_LABELS,
  PLACE_OF_SERVICE_LABELS,
  ABA_CPT_CODES,
  VALID_SESSION_TRANSITIONS,
  type CredentialType,
  type CptCode,
  type PlaceOfServiceCode,
  type SessionStatus,
} from "@/lib/constants";

function KV({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="text-xs font-medium">{children}</dd>
    </div>
  );
}

export function SessionDetailView({
  session,
  canEdit,
}: {
  session: SessionDetailType;
  canEdit: boolean;
}) {
  const router = useRouter();
  const cptMeta = ABA_CPT_CODES[session.cptCode as CptCode];
  const canCancel =
    canEdit && VALID_SESSION_TRANSITIONS[session.status as SessionStatus]?.includes("cancelled");

  const { executeAsync } = useAction(cancelSession, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Session cancelled");
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to cancel session");
    },
  });

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
                <span className="tabular-nums">
                  {session.authServiceUsedUnits}/{session.authServiceApprovedUnits} (
                  {utilizationPercent(
                    session.authServiceUsedUnits ?? 0,
                    session.authServiceApprovedUnits,
                  )}
                  %)
                </span>
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

      {/* Notes */}
      {session.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs whitespace-pre-wrap">{session.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {canCancel && (
        <div className="flex gap-2">
          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="sm" className="text-xs">
                Cancel Session
              </Button>
            }
            title="Cancel session"
            description={`Are you sure you want to cancel this session? ${session.status === "completed" ? "This will reverse the unit count on the linked authorization." : ""}`}
            onConfirm={async () => {
              await executeAsync({ id: session.id });
            }}
            variant="destructive"
            confirmLabel="Cancel Session"
          />
        </div>
      )}
    </div>
  );
}
