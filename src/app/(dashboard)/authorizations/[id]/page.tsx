import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getAuthorizationWithServices,
  getClientOptions,
  getClientInsuranceOptions,
  getAuthorizationOptions,
} from "@/server/queries/authorizations";
import { getAuthorizationSessions } from "@/server/queries/sessions";
import { AuthorizationDetail } from "@/components/authorizations/authorization-detail";
import { AuthStatusBadge } from "@/components/authorizations/auth-status-badge";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import { ExpiryBadge } from "@/components/shared/expiry-badge";
import { Button } from "@/components/ui/button";
import { formatDate, daysUntilExpiry } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Authorization | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

export default async function AuthorizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = WRITE_ROLES.includes(user.role);

  const authorization = await getAuthorizationWithServices(user.organizationId, id);
  if (!authorization) {
    notFound();
  }

  const [clientOptions, insuranceOptions, authorizationOptions, sessions] = await Promise.all([
    canEdit ? getClientOptions(user.organizationId) : Promise.resolve([]),
    getClientInsuranceOptions(user.organizationId, authorization.clientId),
    getAuthorizationOptions(user.organizationId, authorization.clientId),
    getAuthorizationSessions(user.organizationId, id),
  ]);

  const totalApproved = authorization.services.reduce((sum, s) => sum + s.approvedUnits, 0);
  const totalUsed = authorization.services.reduce((sum, s) => sum + s.usedUnits, 0);
  const daysLeft = daysUntilExpiry(authorization.endDate);

  // Expiry alert severity
  const expiryAlert =
    daysLeft < 0 ? { severity: "critical" as const, message: "This authorization has expired." }
    : daysLeft <= 7 ? { severity: "critical" as const, message: `This authorization expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Submit a renewal request.` }
    : daysLeft <= 14 ? { severity: "warning" as const, message: `This authorization expires in ${daysLeft} days. Plan for renewal.` }
    : daysLeft <= 30 ? { severity: "info" as const, message: `This authorization expires in ${daysLeft} days.` }
    : null;

  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link
        href="/authorizations"
        className="text-primary inline-flex items-center gap-1 text-xs hover:underline"
      >
        &larr; Back to Authorizations
      </Link>

      {/* Expiry alert banner */}
      {expiryAlert && (
        <div className={`rounded-lg border px-4 py-3 ${
          expiryAlert.severity === "critical"
            ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
            : expiryAlert.severity === "warning"
              ? "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
              : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30"
        }`}>
          <p className={`text-xs font-medium ${
            expiryAlert.severity === "critical"
              ? "text-red-700 dark:text-red-400"
              : expiryAlert.severity === "warning"
                ? "text-amber-700 dark:text-amber-400"
                : "text-blue-700 dark:text-blue-400"
          }`}>
            {expiryAlert.message}
          </p>
        </div>
      )}

      {/* Rich header card */}
      <div className="border-border bg-card rounded-xl border p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">
                {authorization.clientLastName}, {authorization.clientFirstName}
              </h1>
              <AuthStatusBadge status={authorization.status} />
              <ExpiryBadge endDate={authorization.endDate} startDate={authorization.startDate} showFullDate />
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>{authorization.payerName}</span>
              {authorization.authorizationNumber && (
                <span>Auth #{authorization.authorizationNumber}</span>
              )}
              <span>{formatDate(authorization.startDate)} — {formatDate(authorization.endDate)}</span>
              {authorization.diagnosisCode && (
                <span>{authorization.diagnosisCode}</span>
              )}
            </div>
          </div>
          {canEdit && (
            <Button asChild size="sm" variant="outline" className="text-xs">
              <Link href={`/authorizations/${id}/edit`}>Edit</Link>
            </Button>
          )}
        </div>

        {/* Overall utilization bar */}
        {totalApproved > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <UtilizationBar usedUnits={totalUsed} approvedUnits={totalApproved} label="Overall Utilization" />
          </div>
        )}
      </div>

      <AuthorizationDetail
        authorization={authorization}
        clientOptions={clientOptions}
        insuranceOptions={insuranceOptions}
        authorizationOptions={authorizationOptions}
        sessions={sessions}
        canEdit={canEdit}
      />
    </div>
  );
}
