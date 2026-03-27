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
import { ExpiryBadge, getExpiryLevel } from "@/components/shared/expiry-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { getUtilizationLevel, LEVEL_COLORS } from "@/components/shared/utilization-bar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn, formatDate, daysUntilExpiry } from "@/lib/utils";
import { hasPermission } from "@/lib/permissions";
import { unitsToHours, MS_PER_DAY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Authorization | Clinivise",
};

export default async function AuthorizationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = hasPermission(user.role, "authorizations.write");

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

  // Expiry alert — derived from shared getExpiryLevel thresholds
  const expiryLevel = getExpiryLevel(daysLeft, false);
  const expiryMessage =
    daysLeft < 0
      ? "This authorization has expired."
      : daysLeft === 0
        ? "This authorization expires today. Submit a renewal request."
        : expiryLevel === "critical"
          ? `This authorization expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. Submit a renewal request.`
          : expiryLevel === "warning"
            ? `This authorization expires in ${daysLeft} days. Plan for renewal.`
            : null;

  // Pre-compute metric card values
  const utilizationPct = totalApproved > 0 ? Math.round((totalUsed / totalApproved) * 100) : 0;
  const utilizationLevel = getUtilizationLevel(utilizationPct);
  const now = new Date();
  const weeklyBurn =
    totalApproved > 0
      ? (() => {
          const startMs = new Date(authorization.startDate).getTime();
          const endMs = new Date(authorization.endDate).getTime();
          const weeksElapsed = Math.max(
            1,
            (Math.min(now.getTime(), endMs) - startMs) / (7 * MS_PER_DAY),
          );
          return (unitsToHours(totalUsed) / weeksElapsed).toFixed(1);
        })()
      : "0";

  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/authorizations">Authorizations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {authorization.authorizationNumber ??
                `${authorization.clientLastName}, ${authorization.clientFirstName}`}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Expiry alert banner — only for critical (<=7d) and warning (8-30d) */}
      {expiryMessage && (
        <div
          role="alert"
          className={cn(
            "rounded-lg border px-4 py-3",
            expiryLevel === "critical" || daysLeft < 0
              ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
              : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30",
          )}
        >
          <p
            className={cn(
              "text-xs font-medium",
              expiryLevel === "critical" || daysLeft < 0
                ? "text-red-700 dark:text-red-400"
                : "text-amber-700 dark:text-amber-400",
            )}
          >
            {expiryMessage}
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
              <ExpiryBadge
                endDate={authorization.endDate}
                startDate={authorization.startDate}
                showFullDate
              />
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span>{authorization.payerName}</span>
              {authorization.authorizationNumber && (
                <span>Auth #{authorization.authorizationNumber}</span>
              )}
              <span>
                {formatDate(authorization.startDate)} — {formatDate(authorization.endDate)}
              </span>
              {authorization.diagnosisCode && <span>{authorization.diagnosisCode}</span>}
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
          <div className="border-border mt-4 border-t pt-4">
            <UtilizationBar
              usedUnits={totalUsed}
              approvedUnits={totalApproved}
              label="Overall Utilization"
            />
          </div>
        )}
      </div>

      {/* Metric Cards */}
      {totalApproved > 0 && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <MetricCard
            label="Days Remaining"
            value={daysLeft >= 0 ? String(daysLeft) : "Expired"}
            sub={`Expires ${formatDate(authorization.endDate)}`}
            accent={
              daysLeft <= 7
                ? "text-red-600 dark:text-red-400"
                : daysLeft <= 30
                  ? "text-amber-600 dark:text-amber-400"
                  : undefined
            }
          />
          <MetricCard
            label="Hours Used"
            value={`${unitsToHours(totalUsed).toFixed(1)}h`}
            sub={`${utilizationPct}% utilized`}
            accent={LEVEL_COLORS[utilizationLevel].text}
          />
          <MetricCard
            label="Hours Approved"
            value={`${unitsToHours(totalApproved).toFixed(1)}h`}
            sub={`${authorization.services.length} service line${authorization.services.length !== 1 ? "s" : ""}`}
          />
          <MetricCard label="Weekly Burn" value={`${weeklyBurn}h`} sub="avg per week" />
        </div>
      )}

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
