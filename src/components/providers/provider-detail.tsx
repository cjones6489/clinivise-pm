"use client";

import Link from "next/link";
import type { Provider } from "@/server/queries/providers";
import type {
  ProviderCaseloadItem,
  ProviderRecentSession,
  ProviderSupervisee,
  ProviderSessionBreakdown,
  SupervisorOption,
} from "@/server/queries/providers";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import { ProviderForm } from "@/components/providers/provider-form";
import {
  ABA_CPT_CODES,
  CREDENTIAL_LABELS,
  SUPERVISOR_CREDENTIAL_TYPES,
  type CredentialType,
  type CptCode,
} from "@/lib/constants";
import { formatDate, daysUntilExpiry } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ── Shared layout helpers (matches client-overview pattern) ──────────────────

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

// ── Main component ──────────────────────────────────────────────────────────

export function ProviderDetailView({
  provider,
  supervisor,
  caseload,
  recentSessions,
  supervisees,
  sessionBreakdown,
  canEdit,
  supervisorOptions,
}: {
  provider: Provider;
  supervisor: SupervisorOption | null;
  caseload: ProviderCaseloadItem[];
  recentSessions: ProviderRecentSession[];
  supervisees: ProviderSupervisee[];
  sessionBreakdown: ProviderSessionBreakdown;
  canEdit: boolean;
  supervisorOptions: SupervisorOption[];
}) {
  const credLabel =
    CREDENTIAL_LABELS[provider.credentialType as CredentialType] ?? provider.credentialType;
  const isSupervisor = SUPERVISOR_CREDENTIAL_TYPES.includes(provider.credentialType as CredentialType);

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="caseload">Caseload ({caseload.length})</TabsTrigger>
        <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
        {(isSupervisor || supervisor) && (
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
        )}
        {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
      </TabsList>

      {/* ── Overview Tab ──────────────────────────────────────────────── */}
      <TabsContent value="overview" className="pt-4">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {/* Credentials */}
          <SectionCard title="Credentials">
            <KVRow
              label="Status"
              value={
                <Badge
                  variant={provider.isActive ? "outline" : "secondary"}
                  className={cn(
                    "text-[10px]",
                    provider.isActive &&
                      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
                  )}
                >
                  {provider.isActive ? "Active" : "Archived"}
                </Badge>
              }
            />
            <KVRow label="Type" value={credLabel} />
            {provider.npi && <KVRow label="NPI" value={<span className="font-mono">{provider.npi}</span>} />}
            {provider.credentialNumber && (
              <KVRow label="Certificate #" value={<span className="font-mono">{provider.credentialNumber}</span>} />
            )}
            {provider.credentialExpiry && (
              <KVRow
                label="Expiry"
                value={
                  <span className={cn(
                    daysUntilExpiry(provider.credentialExpiry) <= 7
                      ? "text-red-600 dark:text-red-400"
                      : daysUntilExpiry(provider.credentialExpiry) <= 30
                        ? "text-amber-600 dark:text-amber-400"
                        : undefined,
                  )}>
                    {formatDate(provider.credentialExpiry)}
                    {" "}
                    <span className="text-muted-foreground text-[11px]">
                      ({daysUntilExpiry(provider.credentialExpiry)}d remaining)
                    </span>
                  </span>
                }
              />
            )}
            {provider.modifierCode && (
              <KVRow label="Modifier Code" value={provider.modifierCode} />
            )}
            {!provider.npi && !provider.credentialNumber && !provider.credentialExpiry && !provider.modifierCode && (
              <p className="text-muted-foreground py-2 text-xs">No credential details on file</p>
            )}
          </SectionCard>

          {/* Supervision */}
          <SectionCard title="Supervision">
            {supervisor ? (
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold">
                  {supervisor.firstName[0]}
                  {supervisor.lastName[0]}
                </div>
                <div>
                  <Link
                    href={`/providers/${supervisor.id}`}
                    className="text-xs font-medium hover:underline"
                  >
                    {supervisor.firstName} {supervisor.lastName}
                  </Link>
                  <div className="text-muted-foreground text-[11px]">
                    Supervisor &middot;{" "}
                    {CREDENTIAL_LABELS[supervisor.credentialType as CredentialType] ??
                      supervisor.credentialType}
                  </div>
                </div>
              </div>
            ) : isSupervisor ? (
              <div>
                <p className="text-muted-foreground py-2 text-xs">
                  {supervisees.length > 0
                    ? `Supervising ${supervisees.length} provider${supervisees.length !== 1 ? "s" : ""} — see Supervision tab`
                    : "No supervisees assigned"}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground py-2 text-xs">No supervisor assigned</p>
            )}
          </SectionCard>
        </div>
      </TabsContent>

      {/* ── Performance Tab ──────────────────────────────────────────── */}
      <TabsContent value="performance" className="pt-4">
        <div className="space-y-2.5">
          {/* Session Status Breakdown */}
          <SectionCard title="Session Breakdown">
            {sessionBreakdown.totalSessions > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 sm:grid-cols-3">
                  <KVRow
                    label="Total Sessions"
                    value={<span className="tabular-nums">{sessionBreakdown.totalSessions}</span>}
                  />
                  <KVRow
                    label="Completed"
                    value={<span className="tabular-nums text-emerald-600 dark:text-emerald-400">{sessionBreakdown.completedSessions}</span>}
                  />
                  <KVRow
                    label="Scheduled"
                    value={<span className="tabular-nums">{sessionBreakdown.scheduledSessions}</span>}
                  />
                  <KVRow
                    label="Cancelled"
                    value={<span className="tabular-nums">{sessionBreakdown.cancelledSessions}</span>}
                  />
                  <KVRow
                    label="No Shows"
                    value={
                      <span className={cn(
                        "tabular-nums",
                        sessionBreakdown.noShowSessions > 0 && "text-red-600 dark:text-red-400",
                      )}>
                        {sessionBreakdown.noShowSessions}
                      </span>
                    }
                  />
                  <KVRow
                    label="Flagged"
                    value={
                      <span className={cn(
                        "tabular-nums",
                        sessionBreakdown.flaggedSessions > 0 && "text-red-600 dark:text-red-400",
                      )}>
                        {sessionBreakdown.flaggedSessions}
                      </span>
                    }
                  />
                </div>

                {/* Rates bar */}
                {sessionBreakdown.totalSessions > 0 && (
                  <div className="border-border/40 space-y-1.5 border-t pt-2">
                    <RateBar
                      label="Completion Rate"
                      value={sessionBreakdown.completedSessions}
                      total={sessionBreakdown.totalSessions}
                      color="bg-emerald-500"
                    />
                    <RateBar
                      label="Cancellation Rate"
                      value={sessionBreakdown.cancelledSessions}
                      total={sessionBreakdown.totalSessions}
                      color="bg-amber-500"
                    />
                    <RateBar
                      label="No-Show Rate"
                      value={sessionBreakdown.noShowSessions}
                      total={sessionBreakdown.totalSessions}
                      color="bg-red-500"
                    />
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground py-2 text-xs">No sessions recorded yet.</p>
            )}
          </SectionCard>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {/* Hours & Duration */}
            <SectionCard title="Hours & Duration">
              <KVRow
                label="Total Hours (Completed)"
                value={<span className="tabular-nums">{sessionBreakdown.totalHours.toFixed(1)}h</span>}
              />
              <KVRow
                label="Avg Session Duration"
                value={
                  <span className="tabular-nums">
                    {sessionBreakdown.avgSessionMinutes > 0
                      ? `${sessionBreakdown.avgSessionMinutes} min`
                      : "—"}
                  </span>
                }
              />
            </SectionCard>

            {/* CPT Code Distribution */}
            <SectionCard title="CPT Code Distribution">
              {sessionBreakdown.cptDistribution.length > 0 ? (
                <div className="space-y-1">
                  {sessionBreakdown.cptDistribution.map((cpt) => {
                    const desc = ABA_CPT_CODES[cpt.cptCode as CptCode]?.description;
                    return (
                      <div key={cpt.cptCode} className="border-border/40 flex items-center justify-between border-b py-1.5 last:border-0">
                        <div>
                          <span className="text-xs font-medium tabular-nums">{cpt.cptCode}</span>
                          {desc && (
                            <span className="text-muted-foreground ml-1.5 text-[11px]">
                              {desc.length > 40 ? `${desc.slice(0, 40)}...` : desc}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-medium tabular-nums">{cpt.count}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground py-2 text-xs">No sessions recorded yet.</p>
              )}
            </SectionCard>
          </div>
        </div>
      </TabsContent>

      {/* ── Caseload Tab ─────────────────────────────────────────────── */}
      <TabsContent value="caseload" className="pt-4">
        <SectionCard
          title="Active Caseload"
          action={
            caseload.length > 0 ? (
              <span className="text-muted-foreground text-[11px]">
                {caseload.length} client{caseload.length !== 1 ? "s" : ""}
              </span>
            ) : undefined
          }
        >
          {caseload.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                      Client
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                      Status
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-right font-medium">
                      Sessions
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-right font-medium">
                      Last Session
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {caseload.map((c) => (
                    <tr key={c.clientId} className="border-border border-b last:border-0">
                      <td className="px-2 py-1.5">
                        <Link
                          href={`/clients/${c.clientId}`}
                          className="font-medium hover:underline"
                        >
                          {c.clientLastName}, {c.clientFirstName}
                        </Link>
                      </td>
                      <td className="px-2 py-1.5">
                        <Badge variant={c.clientStatus === "active" ? "default" : "outline"} className="text-[10px]">
                          {c.clientStatus}
                        </Badge>
                      </td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{c.sessionCount}</td>
                      <td className="text-muted-foreground px-2 py-1.5 text-right tabular-nums">
                        {c.lastSessionDate ? formatDate(c.lastSessionDate) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <p className="text-muted-foreground text-xs">
                No clients on this provider&apos;s caseload yet.
              </p>
            </div>
          )}
        </SectionCard>
      </TabsContent>

      {/* ── Recent Sessions Tab ──────────────────────────────────────── */}
      <TabsContent value="sessions" className="pt-4">
        <SectionCard
          title="Recent Sessions"
          action={
            <span className="text-muted-foreground text-[11px]">Last 10 sessions</span>
          }
        >
          {recentSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-border border-b">
                    <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                      Date
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                      Client
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                      CPT
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-right font-medium">
                      Units
                    </th>
                    <th className="text-muted-foreground px-2 py-1.5 text-left font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentSessions.map((s) => (
                    <tr key={s.id} className="border-border border-b last:border-0">
                      <td className="px-2 py-1.5 tabular-nums">
                        <Link
                          href={`/sessions/${s.id}`}
                          className="hover:underline"
                        >
                          {formatDate(s.sessionDate)}
                        </Link>
                      </td>
                      <td className="px-2 py-1.5">
                        {s.clientLastName}, {s.clientFirstName}
                      </td>
                      <td className="px-2 py-1.5 font-medium tabular-nums">{s.cptCode}</td>
                      <td className="px-2 py-1.5 text-right tabular-nums">{s.units}</td>
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
              <p className="text-muted-foreground text-xs">No sessions logged yet.</p>
              <Link
                href={`/sessions/new?providerId=${provider.id}`}
                className="text-primary mt-1 text-xs hover:underline"
              >
                Log your first session &rarr;
              </Link>
            </div>
          )}
        </SectionCard>
      </TabsContent>

      {/* ── Supervision Tab ──────────────────────────────────────────── */}
      {(isSupervisor || supervisor) && (
        <TabsContent value="supervision" className="pt-4">
          {isSupervisor ? (
            <SectionCard
              title="Supervisees"
              action={
                supervisees.length > 0 ? (
                  <span className="text-muted-foreground text-[11px]">
                    {supervisees.length} provider{supervisees.length !== 1 ? "s" : ""}
                  </span>
                ) : undefined
              }
            >
              {supervisees.length > 0 ? (
                <div className="space-y-2">
                  {supervisees.map((s) => (
                    <div key={s.id} className="flex items-center gap-2.5">
                      <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold">
                        {s.firstName[0]}
                        {s.lastName[0]}
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/providers/${s.id}`}
                          className="text-xs font-medium hover:underline"
                        >
                          {s.firstName} {s.lastName}
                        </Link>
                        <div className="text-muted-foreground text-[11px]">
                          {CREDENTIAL_LABELS[s.credentialType as CredentialType] ??
                            s.credentialType}
                        </div>
                      </div>
                      <Badge
                        variant={s.isActive ? "outline" : "secondary"}
                        className={cn(
                          "text-[10px]",
                          s.isActive &&
                            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400",
                        )}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-2 text-xs">No supervisees assigned</p>
              )}
            </SectionCard>
          ) : supervisor ? (
            <SectionCard title="Supervisor">
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold">
                  {supervisor.firstName[0]}
                  {supervisor.lastName[0]}
                </div>
                <div>
                  <Link
                    href={`/providers/${supervisor.id}`}
                    className="text-xs font-medium hover:underline"
                  >
                    {supervisor.firstName} {supervisor.lastName}
                  </Link>
                  <div className="text-muted-foreground text-[11px]">
                    Supervisor &middot;{" "}
                    {CREDENTIAL_LABELS[supervisor.credentialType as CredentialType] ??
                      supervisor.credentialType}
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}
        </TabsContent>
      )}
      {/* ── Edit Tab ────────────────────────────────────────────────── */}
      {canEdit && (
        <TabsContent value="edit" className="pt-4">
          <ProviderForm provider={provider} supervisorOptions={supervisorOptions} />
        </TabsContent>
      )}
    </Tabs>
  );
}

// ── Rate bar helper ───────────────────────────────────────────────────────────

function RateBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground w-28 shrink-0 text-xs">{label}</span>
      <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-xs font-medium tabular-nums">{pct}%</span>
    </div>
  );
}
