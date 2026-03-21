"use client";

import Link from "next/link";
import type { AuthorizationListItem } from "@/server/queries/authorizations";
import { AuthStatusBadge } from "@/components/authorizations/auth-status-badge";
import { formatDate, utilizationPercent } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { FileValidationIcon } from "@hugeicons/core-free-icons";

export function ClientAuthorizationsCard({
  authorizations,
  clientId,
  canEdit,
}: {
  authorizations: AuthorizationListItem[];
  clientId: string;
  canEdit: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authorizations</CardTitle>
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
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="bg-muted mb-3 rounded-lg p-3">
              <HugeiconsIcon
                icon={FileValidationIcon}
                size={24}
                className="text-muted-foreground"
              />
            </div>
            <p className="text-muted-foreground text-xs">
              No authorizations yet.
              {canEdit && " Add one to start tracking services."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {authorizations.map((auth) => {
              const pct = utilizationPercent(auth.totalUsed, auth.totalApproved);
              return (
                <Link
                  key={auth.id}
                  href={`/authorizations/${auth.id}`}
                  className="border-border hover:bg-muted/50 block space-y-2 rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{auth.payerName}</span>
                      {auth.authorizationNumber && (
                        <span className="text-muted-foreground text-xs">
                          #{auth.authorizationNumber}
                        </span>
                      )}
                      <AuthStatusBadge status={auth.status} />
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground">Period: </span>
                      <span className="font-medium tabular-nums">
                        {formatDate(auth.startDate)} — {formatDate(auth.endDate)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Utilization: </span>
                      <span
                        className={`font-medium tabular-nums ${
                          pct >= 95 ? "text-red-600" : pct >= 80 ? "text-amber-600" : ""
                        }`}
                      >
                        {auth.totalUsed}/{auth.totalApproved} ({pct}%)
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Services: </span>
                      <span className="font-medium tabular-nums">{auth.serviceCount}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
