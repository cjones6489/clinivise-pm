"use client";

import { useState } from "react";
import Link from "next/link";
import type { ClientAuthWithServices } from "@/server/queries/authorizations";
import { AuthStatusBadge } from "@/components/authorizations/auth-status-badge";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import { ExpiryBadge } from "@/components/shared/expiry-badge";
import { formatDate, utilizationPercent, daysUntilExpiry } from "@/lib/utils";
import { ABA_CPT_CODES, type CptCode, unitsToHours } from "@/lib/constants";
import { startOfDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileValidationIcon,
  ArrowDown01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";

function isActiveAuth(auth: ClientAuthWithServices): boolean {
  if (auth.status === "pending") return true;
  if (auth.status === "approved") {
    return daysUntilExpiry(auth.endDate) >= 0;
  }
  return false;
}

function calcWeeklyAvg(auth: ClientAuthWithServices, now: Date): number {
  const startMs = new Date(auth.startDate).getTime();
  // Future-start auths have no meaningful weekly average
  if (startMs > now.getTime()) return 0;
  const weeksElapsed = Math.max(1, (now.getTime() - startMs) / (7 * 86400000));
  return unitsToHours(auth.totalUsed) / weeksElapsed;
}

function AuthCard({ auth, now }: { auth: ClientAuthWithServices; now: Date }) {
  const pct = utilizationPercent(auth.totalUsed, auth.totalApproved);
  const isActive = isActiveAuth(auth);
  const weeklyAvgHours = isActive ? calcWeeklyAvg(auth, now) : 0;

  return (
    <Link
      href={`/authorizations/${auth.id}`}
      className="border-border hover:bg-muted/30 block rounded-lg border p-4 transition-colors"
    >
      {/* Header: Payer + Auth Number */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold">{auth.payerName}</span>
            {auth.authorizationNumber && (
              <span className="text-muted-foreground shrink-0 text-xs">
                #{auth.authorizationNumber}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <AuthStatusBadge status={auth.status} />
            <span className="text-muted-foreground text-xs tabular-nums">
              {formatDate(auth.startDate)} — {formatDate(auth.endDate)}
            </span>
          </div>
        </div>
        {/* Expiry Badge */}
        <div className="shrink-0">
          <ExpiryBadge endDate={auth.endDate} startDate={auth.startDate} />
        </div>
      </div>

      {/* Per-CPT Utilization Bars */}
      {auth.services.length > 0 && (
        <div className="mt-3 space-y-3">
          {auth.services.map((svc) => {
            const cptMeta = ABA_CPT_CODES[svc.cptCode as CptCode];
            const shortDesc = cptMeta?.description
              ? cptMeta.description.length > 50
                ? cptMeta.description.slice(0, 50) + "..."
                : cptMeta.description
              : "";
            return (
              <div key={svc.cptCode}>
                {shortDesc && (
                  <div className="text-muted-foreground mb-0.5 text-[11px]">
                    {svc.cptCode} — {shortDesc}
                  </div>
                )}
                <UtilizationBar
                  usedUnits={svc.usedUnits}
                  approvedUnits={svc.approvedUnits}
                  label={shortDesc ? undefined : svc.cptCode}
                  showHours
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Aggregate Summary */}
      <div className="border-border/50 mt-3 flex items-center justify-between border-t pt-2 text-xs">
        <span className="text-muted-foreground">
          Aggregate:{" "}
          <span className="text-foreground tabular-nums font-medium">
            {auth.totalUsed}/{auth.totalApproved} units ({pct}%)
          </span>
        </span>
        {isActive && weeklyAvgHours > 0 && (
          <span className="text-muted-foreground">
            Weekly avg:{" "}
            <span className="text-foreground tabular-nums font-medium">
              {weeklyAvgHours.toFixed(1)} hrs
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}

export function ClientAuthorizationsCard({
  authorizations,
  clientId,
  canEdit,
}: {
  authorizations: ClientAuthWithServices[];
  clientId: string;
  canEdit: boolean;
}) {
  const [showHistorical, setShowHistorical] = useState(false);
  const [now] = useState(() => startOfDay(new Date()));

  const activeAuths = authorizations.filter(isActiveAuth);
  const historicalAuths = authorizations.filter((a) => !isActiveAuth(a));

  const hasNoActive = activeAuths.length === 0 && historicalAuths.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Authorizations
          {authorizations.length > 0 && (
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              {activeAuths.length} active{historicalAuths.length > 0 && ` · ${historicalAuths.length} past`}
            </span>
          )}
        </CardTitle>
        {canEdit && (
          <CardAction>
            <Button asChild size="sm" className="text-xs">
              <Link href={`/authorizations/new?clientId=${clientId}`}>Add Authorization</Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {authorizations.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted mb-3 rounded-lg p-3">
              <HugeiconsIcon
                icon={FileValidationIcon}
                size={24}
                className="text-muted-foreground"
              />
            </div>
            <p className="text-sm font-medium">No authorizations yet</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Add an authorization to track utilization and expiry.
            </p>
            {canEdit && (
              <Button asChild size="sm" className="mt-3 text-xs">
                <Link href={`/authorizations/new?clientId=${clientId}`}>Add Authorization</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* No active auth warning */}
            {hasNoActive && (
              <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 dark:bg-amber-950/30">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={16}
                  className="shrink-0 text-amber-600 dark:text-amber-400"
                />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  No active authorization — all authorizations have expired or been exhausted.
                </span>
              </div>
            )}

            {/* Active authorizations */}
            {activeAuths.length > 0 && (
              <div className="space-y-3">
                {activeAuths.map((auth) => (
                  <AuthCard key={auth.id} auth={auth} now={now} />
                ))}
              </div>
            )}

            {/* Historical authorizations (collapsible) */}
            {historicalAuths.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowHistorical(!showHistorical)}
                  className="text-muted-foreground hover:text-foreground flex w-full items-center gap-2 py-2 text-xs font-medium transition-colors"
                >
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={14}
                    className={`transition-transform ${showHistorical ? "rotate-180" : ""}`}
                  />
                  Past ({historicalAuths.length})
                </button>
                {showHistorical && (
                  <div className="space-y-3 opacity-70">
                    {historicalAuths.map((auth) => (
                      <AuthCard key={auth.id} auth={auth} now={now} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
