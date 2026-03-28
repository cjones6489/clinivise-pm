"use client";

import Link from "next/link";
import type {
  Client,
  ClientContact,
  ClientInsuranceWithPayer,
  CareTeamMember,
  PayerOption,
} from "@/server/queries/clients";
import type { AuthorizationListItem, ClientAuthUtilization } from "@/server/queries/authorizations";
import type { SessionListItem } from "@/server/queries/sessions";
import { ClientContactsCard } from "./client-contacts-card";
import { ClientInsuranceCard } from "./client-insurance-card";
import { CARE_TEAM_ROLE_LABELS, type CareTeamRole } from "@/lib/constants";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import { NoteStatusBadge } from "@/components/sessions/note-status-badge";
import {
  CREDENTIAL_LABELS,
  ABA_CPT_CODES,
  AUTH_ALERT_THRESHOLDS,
  unitsToHours,
  type CredentialType,
  type CptCode,
} from "@/lib/constants";
import { formatDate, daysUntilExpiry } from "@/lib/utils";
import { MetricCard } from "@/components/shared/metric-card";
import {
  UtilizationBar,
  getUtilizationLevel,
  LEVEL_COLORS,
} from "@/components/shared/utilization-bar";
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
  payerOptions,
  authorizations,
  sessions,
  careTeam,
  authUtilization,
  canEdit,
  canManagePayers,
}: {
  client: Client;
  contacts: ClientContact[];
  insurance: ClientInsuranceWithPayer[];
  payerOptions: PayerOption[];
  authorizations: AuthorizationListItem[];
  sessions: SessionListItem[];
  careTeam: CareTeamMember[];
  authUtilization: ClientAuthUtilization | null;
  canEdit: boolean;
  canManagePayers: boolean;
}) {
  // Utilization metrics from the new per-CPT query
  const totalApproved = authUtilization?.totalApprovedUnits ?? 0;
  const totalUsed = authUtilization?.totalUsedUnits ?? 0;
  const utilizationPct = totalApproved > 0 ? Math.round((totalUsed / totalApproved) * 100) : 0;
  const daysLeft = authUtilization ? daysUntilExpiry(authUtilization.endDate) : 0;

  const utilizationLevel = getUtilizationLevel(utilizationPct);
  const utilizationAccent = utilizationPct > 0 ? LEVEL_COLORS[utilizationLevel].text : undefined;

  const expiryLevel = getExpiryLevel(daysLeft, false);
  const daysLeftAccent =
    expiryLevel === "critical"
      ? "text-red-600 dark:text-red-400"
      : expiryLevel === "warning"
        ? "text-amber-600 dark:text-amber-400"
        : "text-emerald-600 dark:text-emerald-400";

  // Weekly average: total used hours / weeks elapsed
  const weeksElapsed = authUtilization ? Math.max(1, authUtilization.daysElapsed / 7) : 0;
  const weeklyAvgHours =
    weeksElapsed > 0 ? (unitsToHours(totalUsed) / weeksElapsed).toFixed(1) : "0.0";

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
            {utilizationPct}% of approved hours used with {Math.round(periodPctElapsed)}% of the
            authorization period elapsed. Consider reviewing the treatment schedule.
          </p>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <MetricCard
          label="Total Approved"
          value={authUtilization ? `${unitsToHours(totalApproved).toFixed(0)} hrs` : "—"}
          sub={
            authUtilization
              ? `${authUtilization.services.length} service${authUtilization.services.length !== 1 ? "s" : ""}`
              : "No active authorization"
          }
        />
        <MetricCard
          label="Used"
          value={authUtilization ? `${unitsToHours(totalUsed).toFixed(0)} hrs` : "—"}
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
        {/* Clinical Info */}
        <SectionCard title="Clinical Info">
          {client.diagnosisCode && (
            <KVRow
              label="Diagnosis"
              value={<span className="font-mono">{client.diagnosisCode}</span>}
            />
          )}
          {client.diagnosisDescription && (
            <KVRow label="Description" value={client.diagnosisDescription} />
          )}
          {client.secondaryDiagnosisCodes && client.secondaryDiagnosisCodes.length > 0 && (
            <KVRow
              label="Comorbidities"
              value={<span className="font-mono">{client.secondaryDiagnosisCodes.join(", ")}</span>}
            />
          )}
          {client.primaryLanguage && <KVRow label="Language" value={client.primaryLanguage} />}
          {client.interpreterNeeded && <KVRow label="Interpreter" value="Needed" />}
          {client.referringProviderName && (
            <KVRow
              label="Referring Provider"
              value={
                <span>
                  {client.referringProviderName}
                  {client.referringProviderNpi && (
                    <span className="text-muted-foreground ml-1 font-mono text-[11px]">
                      NPI {client.referringProviderNpi}
                    </span>
                  )}
                </span>
              }
            />
          )}
          {client.medicaidId && (
            <KVRow
              label="Medicaid ID"
              value={<span className="font-mono">{client.medicaidId}</span>}
            />
          )}
          {!client.diagnosisCode && !client.referringProviderName && !client.primaryLanguage && (
            <p className="text-muted-foreground py-2 text-xs">No clinical details on file</p>
          )}
        </SectionCard>

        {/* Insurance (full CRUD component) */}
        <ClientInsuranceCard
          insurance={insurance}
          contacts={contacts}
          clientId={client.id}
          payerOptions={payerOptions}
          canEdit={canEdit}
          canManagePayers={canManagePayers}
        />

        {/* Contacts (full CRUD component) */}
        <ClientContactsCard contacts={contacts} clientId={client.id} canEdit={canEdit} />

        {/* Care Team */}
        <SectionCard title="Care Team">
          {careTeam.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {careTeam.map((member) => {
                const name = `${member.providerFirstName} ${member.providerLastName}`;
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2);
                return (
                  <div key={member.id} className="flex items-center gap-2.5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold ${member.isPrimary ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs font-medium">
                        {name}
                        {member.isPrimary && (
                          <span className="text-primary ml-1.5 text-[11px] font-normal">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground text-[11px]">
                        {CARE_TEAM_ROLE_LABELS[member.role as CareTeamRole] ?? member.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground py-2 text-xs">No team members assigned</p>
          )}
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
        ) : authUtilization ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground text-xs">
              Active authorization has no service lines defined. Add service lines to track
              utilization.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground text-xs">
              {authorizations.length === 0
                ? "No authorizations on file. Add one to start tracking utilization."
                : "No active authorization found for today's date."}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Recent Sessions — last 5 */}
      <SectionCard
        title="Recent Sessions"
        action={
          sessions.length > 5 ? (
            <span className="text-muted-foreground text-[11px]">
              Showing 5 of {sessions.length} · see Sessions tab
            </span>
          ) : undefined
        }
      >
        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">Date</th>
                  <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">CPT</th>
                  <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                    Provider
                  </th>
                  <th className="text-muted-foreground px-2 py-1.5 text-right font-medium">
                    Units
                  </th>
                  <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                    Note
                  </th>
                  <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {sessions.slice(0, 5).map((s) => (
                  <tr key={s.id} className="border-border border-b last:border-0">
                    <td className="px-2 py-1.5 tabular-nums">{formatDate(s.sessionDate)}</td>
                    <td className="px-2 py-1.5 font-medium tabular-nums">{s.cptCode}</td>
                    <td className="text-muted-foreground px-2 py-1.5">
                      {s.providerLastName}, {s.providerFirstName}{" "}
                      <span className="text-[11px]">
                        (
                        {CREDENTIAL_LABELS[s.providerCredentialType as CredentialType] ??
                          s.providerCredentialType}
                        )
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-right tabular-nums">{s.units}</td>
                    <td className="px-2 py-1.5">
                      {s.status === "completed" || s.status === "flagged" ? (
                        <NoteStatusBadge status={s.noteStatus} />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5">
                      <SessionStatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground text-xs">No sessions yet.</p>
            <Link
              href={`/sessions/new?clientId=${client.id}`}
              className="text-primary mt-1 text-xs hover:underline"
            >
              Log your first session &rarr;
            </Link>
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
