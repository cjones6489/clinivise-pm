"use client";

import type { Client, ClientContact, ClientInsuranceWithPayer } from "@/server/queries/clients";
import type { AuthorizationListItem } from "@/server/queries/authorizations";
import {
  CONTACT_RELATIONSHIP_LABELS,
  PAYER_TYPE_LABELS,
  type ContactRelationshipType,
  type PayerType,
} from "@/lib/constants";
import { formatDate, daysUntilExpiry } from "@/lib/utils";
import { MetricCard } from "@/components/shared/metric-card";
import { UtilizationBar } from "@/components/shared/utilization-bar";

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
}: {
  client: Client;
  contacts: ClientContact[];
  insurance: ClientInsuranceWithPayer[];
  authorizations: AuthorizationListItem[];
  bcbaName: string | null;
}) {
  const guardian = contacts.find((c) => c.isLegalGuardian);
  const primaryInsurance = insurance.find((i) => i.priority === 1);

  // Find the active authorization (approved + not expired)
  const activeAuth = authorizations.find(
    (a) => a.status === "approved" && daysUntilExpiry(a.endDate) >= 0,
  );

  const totalApproved = activeAuth?.totalApproved ?? 0;
  const totalUsed = activeAuth?.totalUsed ?? 0;
  const utilizationPct = totalApproved > 0 ? Math.round((totalUsed / totalApproved) * 100) : 0;
  const daysLeft = activeAuth ? daysUntilExpiry(activeAuth.endDate) : 0;

  const utilizationColor =
    utilizationPct >= 95
      ? "var(--color-red-600, #dc2626)"
      : utilizationPct >= 80
        ? "var(--color-amber-600, #d97706)"
        : utilizationPct > 0
          ? "var(--color-emerald-600, #059669)"
          : undefined;

  const daysLeftColor =
    daysLeft <= 7
      ? "var(--color-red-600, #dc2626)"
      : daysLeft <= 30
        ? "var(--color-amber-600, #d97706)"
        : "var(--color-emerald-600, #059669)";

  return (
    <div className="space-y-3">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricCard
          label="Total Approved"
          value={activeAuth ? `${((totalApproved * 15) / 60).toFixed(0)} hrs` : "—"}
          sub={
            activeAuth
              ? `${activeAuth.serviceCount} service${activeAuth.serviceCount !== 1 ? "s" : ""}`
              : "No active authorization"
          }
        />
        <MetricCard
          label="Used"
          value={activeAuth ? `${((totalUsed * 15) / 60).toFixed(0)} hrs` : "—"}
          sub={activeAuth ? `${utilizationPct}% utilized` : "No active authorization"}
          color={utilizationColor}
        />
        <MetricCard
          label="Diagnosis"
          value={client.diagnosisCode ?? "—"}
          sub={client.diagnosisDescription ?? "Not specified"}
        />
        <MetricCard
          label="Days Left"
          value={activeAuth ? String(daysLeft) : "—"}
          sub={
            activeAuth
              ? `Auth expires ${formatDate(activeAuth.endDate)}`
              : "No active authorization"
          }
          color={activeAuth ? daysLeftColor : undefined}
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
            <p className="text-muted-foreground py-2 text-[13px]">No insurance on file</p>
          )}
        </SectionCard>

        {/* Care Team */}
        <SectionCard title="Care Team">
          {bcbaName ? (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-semibold">
                  {bcbaName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-[13px] font-medium">{bcbaName}</div>
                  <div className="text-muted-foreground text-[11px]">Supervising BCBA</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground py-2 text-[13px]">No BCBA assigned</p>
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
            <p className="text-muted-foreground py-2 text-[13px]">No guardian on file</p>
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

      {/* Authorized Services — real utilization bars when auth data exists */}
      <SectionCard title="Authorized Services">
        {activeAuth && activeAuth.totalApproved > 0 ? (
          <div className="space-y-4">
            <UtilizationBar
              usedUnits={activeAuth.totalUsed}
              approvedUnits={activeAuth.totalApproved}
              label={activeAuth.authorizationNumber ?? "Authorization"}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground text-[13px]">
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
          <p className="text-muted-foreground text-[13px] whitespace-pre-wrap">{client.notes}</p>
        </SectionCard>
      )}
    </div>
  );
}
