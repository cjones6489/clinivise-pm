"use client";

import type { AuthorizationWithServices, ClientOption } from "@/server/queries/authorizations";
import type { ClientInsuranceOption, AuthorizationOption } from "@/server/queries/authorizations";
import type { SessionListItem } from "@/server/queries/sessions";
import { AuthorizationForm } from "./authorization-form";
import { AuthSessionsCard } from "./auth-sessions-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import { ExpiryBadge } from "@/components/shared/expiry-badge";
import { AuthStatusBadge } from "./auth-status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { FileValidationIcon } from "@hugeicons/core-free-icons";
import {
  ABA_CPT_CODES,
  type CptCode,
  SERVICE_FREQUENCY_LABELS,
  type ServiceFrequency,
} from "@/lib/constants";

// ── Shared layout components ─────────────────────────────────────────────────

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-border/40 flex items-baseline justify-between border-b py-1.5 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function AuthorizationDetail({
  authorization,
  clientOptions,
  insuranceOptions,
  authorizationOptions,
  sessions,
  canEdit,
}: {
  authorization: AuthorizationWithServices;
  clientOptions: ClientOption[];
  insuranceOptions: ClientInsuranceOption[];
  authorizationOptions: AuthorizationOption[];
  sessions: SessionListItem[];
  canEdit: boolean;
}) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="services">Service Lines</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
      </TabsList>

      {/* Overview — read-only KV display (not a form) */}
      <TabsContent value="overview" className="space-y-4 pt-4">
        <SectionCard title="Authorization Details">
          <KVRow
            label="Client"
            value={`${authorization.clientFirstName} ${authorization.clientLastName}`}
          />
          <KVRow label="Payer" value={authorization.payerName} />
          {authorization.authorizationNumber && (
            <KVRow
              label="Auth #"
              value={
                <span className="font-mono tabular-nums">{authorization.authorizationNumber}</span>
              }
            />
          )}
          <KVRow label="Status" value={<AuthStatusBadge status={authorization.status} />} />
          <KVRow
            label="Period"
            value={`${formatDate(authorization.startDate)} — ${formatDate(authorization.endDate)}`}
          />
          <KVRow
            label="Expiry"
            value={
              <ExpiryBadge
                endDate={authorization.endDate}
                startDate={authorization.startDate}
                showFullDate
              />
            }
          />
          {authorization.diagnosisCode && (
            <KVRow label="Diagnosis" value={authorization.diagnosisCode} />
          )}
          {authorization.clientInsuranceMemberId && (
            <KVRow label="Member ID" value={authorization.clientInsuranceMemberId} />
          )}
          {authorization.notes && (
            <KVRow
              label="Notes"
              value={<span className="max-w-xs text-right">{authorization.notes}</span>}
            />
          )}
        </SectionCard>
      </TabsContent>

      {/* Service Lines — per-CPT utilization bars */}
      <TabsContent value="services" className="pt-4">
        {authorization.services.length === 0 ? (
          <EmptyState
            icon={FileValidationIcon}
            title="No service lines"
            description="Add service lines to track approved units per CPT code."
          />
        ) : (
          <SectionCard title="Service Lines">
            <div className="space-y-5">
              {authorization.services.map((svc) => {
                const meta = ABA_CPT_CODES[svc.cptCode as CptCode];
                return (
                  <div key={svc.id} className="space-y-2">
                    <UtilizationBar
                      usedUnits={svc.usedUnits}
                      approvedUnits={svc.approvedUnits}
                      label={`${svc.cptCode}${meta ? ` — ${meta.description}` : ""}`}
                    />
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-0.5 text-[11px]">
                      {svc.frequency && (
                        <span>
                          Frequency:{" "}
                          {SERVICE_FREQUENCY_LABELS[svc.frequency as ServiceFrequency] ??
                            svc.frequency}
                        </span>
                      )}
                      {svc.maxUnitsPerDay != null && (
                        <span>
                          Max/day: <span className="tabular-nums">{svc.maxUnitsPerDay}</span>
                        </span>
                      )}
                      {svc.maxUnitsPerWeek != null && (
                        <span>
                          Max/week: <span className="tabular-nums">{svc.maxUnitsPerWeek}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        )}
      </TabsContent>

      {/* Sessions */}
      <TabsContent value="sessions" className="pt-4">
        <AuthSessionsCard sessions={sessions} clientId={authorization.clientId} canEdit={canEdit} />
      </TabsContent>

      {/* Documents */}
      <TabsContent value="documents" className="pt-4">
        <EmptyState
          icon={FileValidationIcon}
          title="No documents"
          description="Document management coming in a future update."
        />
      </TabsContent>

      {/* Edit — form (only for authorized roles) */}
      {canEdit && (
        <TabsContent value="edit" className="pt-4">
          <AuthorizationForm
            authorization={authorization}
            clientOptions={clientOptions}
            insuranceOptions={insuranceOptions}
            authorizationOptions={authorizationOptions}
          />
        </TabsContent>
      )}
    </Tabs>
  );
}
