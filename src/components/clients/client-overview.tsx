"use client";

import type { Client, ClientContact, ClientInsuranceWithPayer } from "@/server/queries/clients";
import type { AuthorizationListItem, ClientAuthUtilization } from "@/server/queries/authorizations";
import {
  CONTACT_RELATIONSHIP_LABELS,
  PAYER_TYPE_LABELS,
  ABA_CPT_CODES,
  AUTH_ALERT_THRESHOLDS,
  type ContactRelationshipType,
  type PayerType,
  type CptCode,
} from "@/lib/constants";
import { formatDate, daysUntilExpiry } from "@/lib/utils";
import { MetricCard } from "@/components/shared/metric-card";
import { UtilizationBar, getUtilizationLevel, LEVEL_COLORS } from "@/components/shared/utilization-bar";
import { getExpiryLevel } from "@/components/shared/expiry-badge";

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-border/40 flex items-baseline justify-between border-b py-1.5 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {title}
        </span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function ClientOverview({
  client,
  contacts,
  insurance,
  authorizations,
  bcbaName,
  authUtilization,
}: {
  client: Client;
  contacts: ClientContact[];
  insurance: ClientInsuranceWithPayer[];
  authorizations: AuthorizationListItem[];
  bcbaName: string | null;
  authUtilization: ClientAuthUtilization | null;
}) {
  const guardian = contacts.find((c) => c.isLegalGuardian);
  const primaryInsurance = insurance.find((i) => i.priority === 1);

  // Utilization metrics from the new per-CPT query
  const totalApproved = authUtilization?.totalApprovedUnits ?? 0;
  const totalUsed = authUtilization?.totalUsedUnits ?? 0;
  const utilizationPct = totalApproved > 0 ? Math.round((totalUsed / totalApproved) * 100) : 0;
  const daysLeft = authUtilization ? daysUntilExpiry(authUtilization.endDate) : 0;

  const utilizationLevel = getUtilizationLevel(utilizationPct);
  const utilizationAccent = utilizationPct > 0 ? LEVEL_COLORS[utilizationLevel].text : undefined;

  const expiryLevel = getExpiryLevel(daysLeft, false);
  const daysLeftAccent =
    expiryLevel === "critical" ? "text-red-600 dark:text-red-400"
    : expiryLevel === "warning" ? "text-amber-600 dark:text-amber-400"
    : "text-emerald-600 dark:text-emerald-400";

  // Weekly average: total used hours / weeks elapsed
  const weeksElapsed = authUtilization ? Math.max(1, authUtilization.daysElapsed / 7) : 0;
  const weeklyAvgHours = weeksElapsed > 0 ? ((totalUsed * 15) / 60 / weeksElapsed).toFixed(1) : "0.0";

  // Under-utilization detection: <50% used with >50% of auth period elapsed
  const periodPctElapsed = authUtilization
    ? (authUtilization.daysElapsed / authUtilization.daysTotal) * 100
    : 0;
  const isUnderUtilized =
    authUtilization &&
    utilizationPct < AUTH_ALERT_THRESHOLDS.UNDER_UTILIZATION_PCT &&
    periodPctElapsed > 50;

  return (
    <div className="space-y-3">
      {/* Under-utilization alert */}
      {isUnderUtilized && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800 dark:bg-amber-950/30">
          <div className="text-xs font-medium text-amber-700 dark:text-amber-400">
            Under-utilization detected
          </div>
          <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400/80">
            {utilizationPct}% of approved hours used with {Math.round(periodPctElapsed)}% of the authorization period elapsed. Consider reviewing the treatment schedule.
          </p>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricCard
          label="Total Approved"
          value={authUtilization ? `${((totalApproved * 15) / 60).toFixed(0)} hrs` : "—"}
          sub={
            authUtilization
              ? `${authUtilization.services.length} service${authUtilization.services.length !== 1 ? "s" : ""}`
              : "No active authorization"
          }
        />
        <MetricCard
          label="Used"
          value={authUtilization ? `${((totalUsed * 15) / 60).toFixed(0)} hrs` : "—"}
          sub={authUtilization ? `${utilizationPct}% utilized` : "No active authorization"}
          accent={utilizationAccent}
        />
        <MetricCard
          label="Weekly Avg"
          value={authUtilization ? `${weeklyAvgHours} hrs` : "—"}
          sub={authUtilization ? "per week" : "No active authorization"}
        />
        <MetricCard
          label="Days Left"
          value={authUtilization ? String(daysLeft) : "—"}
          sub={
            authUtilization
              ? `Auth expires ${formatDate(authUtilization.endDate)}`
              : "No active authorization"
          }
          accent={authUtilization ? daysLeftAccent : undefined}
        />
      </div>

      {/* Two-column info grid */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {/* Insurance */}
        <SectionCard title="Insurance">
          {primaryInsurance ? (
            <>
              <KVRow label="Payer" value={primaryInsurance.payerName} />
              <KVRow label="Member ID" value={primaryInsurance.memberId} />
              {primaryInsurance.groupNumber && (
                <KVRow label="Group" value={primaryInsurance.groupNumber} />
              )}
              {primaryInsurance.payerType && (
                <KVRow
                  label="Type"
                  value={
                    PAYER_TYPE_LABELS[primaryInsurance.payerType as PayerType] ??
                    primaryInsurance.payerType
                  }
                />
              )}
              {primaryInsurance.effectiveDate && (
                <KVRow label="Effective" value={formatDate(primaryInsurance.effectiveDate)} />
              )}
              {primaryInsurance.terminationDate && (
                <KVRow label="Term Date" value={formatDate(primaryInsurance.terminationDate)} />
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-2 text-xs">No insurance on file</p>
          )}
        </SectionCard>

        {/* Care Team */}
        <SectionCard title="Care Team">
          {bcbaName ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold">
                  {bcbaName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-medium">{bcbaName}</div>
                  <div className="text-muted-foreground text-[11px]">Supervising BCBA</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-2 text-xs">No BCBA assigned</p>
          )}
        </SectionCard>

        {/* Guardian */}
        <SectionCard title="Primary Guardian">
          {guardian ? (
            <>
              <KVRow label="Name" value={`${guardian.firstName} ${guardian.lastName}`} />
              <KVRow
                label="Relationship"
                value={
                  CONTACT_RELATIONSHIP_LABELS[guardian.relationship as ContactRelationshipType] ??
                  guardian.relationship
                }
              />
              {guardian.phone && <KVRow label="Phone" value={guardian.phone} />}
              {guardian.email && <KVRow label="Email" value={guardian.email} />}
            </>
          ) : (
            <p className="text-muted-foreground py-2 text-xs">No guardian on file</p>
          )}
        </SectionCard>

        {/* Client Details */}
        <SectionCard title="Details">
          <KVRow
            label="Gender"
            value={
              client.gender === "M"
                ? "Male"
                : client.gender === "F"
                  ? "Female"
                  : client.gender === "U"
                    ? "Unknown"
                    : "—"
            }
          />
          {client.referralSource && <KVRow label="Referral" value={client.referralSource} />}
          {client.addressLine1 && (
            <KVRow
              label="Address"
              value={
                client.city && client.state
                  ? `${client.addressLine1}, ${client.city}, ${client.state} ${client.zipCode ?? ""}`
                  : client.addressLine1
              }
            />
          )}
          {client.phone && <KVRow label="Phone" value={client.phone} />}
          {client.email && <KVRow label="Email" value={client.email} />}
        </SectionCard>
      </div>

      {/* Authorized Services — per-CPT utilization bars */}
      <SectionCard title="Authorized Services">
        {authUtilization && authUtilization.services.length > 0 ? (
          <div className="space-y-4">
            {authUtilization.services.map((svc) => {
              const cptMeta = ABA_CPT_CODES[svc.cptCode as CptCode];
              return (
                <UtilizationBar
                  key={svc.cptCode}
                  usedUnits={svc.usedUnits}
                  approvedUnits={svc.approvedUnits}
                  label={`${svc.cptCode}${cptMeta ? ` — ${cptMeta.description}` : ""}`}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground text-xs">
              {authorizations.length === 0
                ? "No authorizations on file. Add one to start tracking utilization."
                : "No active authorization. All authorizations have expired or are pending."}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Notes */}
      {client.notes && (
        <SectionCard title="Notes">
          <p className="text-muted-foreground text-xs whitespace-pre-wrap">{client.notes}</p>
        </SectionCard>
      )}
    </div>
  );
}
