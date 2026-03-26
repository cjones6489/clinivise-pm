"use client";

import type { AuthorizationWithServices, ClientOption } from "@/server/queries/authorizations";
import type { ClientInsuranceOption, AuthorizationOption } from "@/server/queries/authorizations";
import type { SessionListItem } from "@/server/queries/sessions";
import { AuthorizationForm } from "./authorization-form";
import { AuthSessionsCard } from "./auth-sessions-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import {
  ABA_CPT_CODES,
  type CptCode,
  SERVICE_FREQUENCY_LABELS,
  type ServiceFrequency,
} from "@/lib/constants";

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
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        <AuthorizationForm
          authorization={authorization}
          clientOptions={clientOptions}
          insuranceOptions={insuranceOptions}
          authorizationOptions={authorizationOptions}
          disabled={!canEdit}
        />
      </TabsContent>

      <TabsContent value="services" className="pt-4">
        {authorization.services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground text-xs">No service lines.</p>
          </div>
        ) : (
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
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-muted-foreground">
                    {svc.frequency && (
                      <span>
                        Frequency: {SERVICE_FREQUENCY_LABELS[svc.frequency as ServiceFrequency] ?? svc.frequency}
                      </span>
                    )}
                    {svc.maxUnitsPerDay != null && (
                      <span>Max/day: <span className="tabular-nums">{svc.maxUnitsPerDay}</span></span>
                    )}
                    {svc.maxUnitsPerWeek != null && (
                      <span>Max/week: <span className="tabular-nums">{svc.maxUnitsPerWeek}</span></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="sessions" className="pt-4">
        <AuthSessionsCard sessions={sessions} clientId={authorization.clientId} canEdit={canEdit} />
      </TabsContent>

      <TabsContent value="documents" className="pt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-xs">
            Document management coming in a future sprint.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
