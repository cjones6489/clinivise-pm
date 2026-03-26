"use client";

import Link from "next/link";
import type { Provider } from "@/server/queries/providers";
import type {
  ProviderCaseloadItem,
  ProviderRecentSession,
  ProviderSupervisee,
} from "@/server/queries/providers";
import { SessionStatusBadge } from "@/components/sessions/session-status-badge";
import {
  CREDENTIAL_LABELS,
  type CredentialType,
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
}: {
  provider: Provider;
  supervisor: Provider | null;
  caseload: ProviderCaseloadItem[];
  recentSessions: ProviderRecentSession[];
  supervisees: ProviderSupervisee[];
}) {
  const credLabel =
    CREDENTIAL_LABELS[provider.credentialType as CredentialType] ?? provider.credentialType;
  const isSupervisor = provider.credentialType === "bcba" || provider.credentialType === "bcba_d";

  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="caseload">Caseload ({caseload.length})</TabsTrigger>
        <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
        {(isSupervisor || supervisor) && (
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
        )}
      </TabsList>

      {/* ── Overview Tab ──────────────────────────────────────────────── */}
      <TabsContent value="overview" className="pt-4">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {/* Credentials */}
          <SectionCard title="Credentials">
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
    </Tabs>
  );
}
