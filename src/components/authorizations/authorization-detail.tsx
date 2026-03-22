"use client";

import type { AuthorizationWithServices, ClientOption } from "@/server/queries/authorizations";
import type { ClientInsuranceOption, AuthorizationOption } from "@/server/queries/authorizations";
import type { SessionListItem } from "@/server/queries/sessions";
import { AuthorizationForm } from "./authorization-form";
import { AuthSessionsCard } from "./auth-sessions-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { utilizationPercent } from "@/lib/utils";
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
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-border border-b">
                  <th className="px-3 py-2 text-left font-medium">CPT Code</th>
                  <th className="px-3 py-2 text-left font-medium">Description</th>
                  <th className="px-3 py-2 text-right font-medium">Approved</th>
                  <th className="px-3 py-2 text-right font-medium">Used</th>
                  <th className="px-3 py-2 text-right font-medium">Utilization</th>
                  <th className="px-3 py-2 text-left font-medium">Frequency</th>
                  <th className="px-3 py-2 text-right font-medium">Max/Day</th>
                  <th className="px-3 py-2 text-right font-medium">Max/Week</th>
                </tr>
              </thead>
              <tbody>
                {authorization.services.map((svc) => {
                  const meta = ABA_CPT_CODES[svc.cptCode as CptCode];
                  const pct = utilizationPercent(svc.usedUnits, svc.approvedUnits);
                  return (
                    <tr key={svc.id} className="border-border border-b last:border-0">
                      <td className="px-3 py-2 font-medium tabular-nums">{svc.cptCode}</td>
                      <td className="text-muted-foreground px-3 py-2">
                        {meta?.description ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{svc.approvedUnits}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{svc.usedUnits}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        <span
                          className={pct >= 95 ? "text-red-600" : pct >= 80 ? "text-amber-600" : ""}
                        >
                          {pct}%
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        {svc.frequency
                          ? (SERVICE_FREQUENCY_LABELS[svc.frequency as ServiceFrequency] ??
                            svc.frequency)
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {svc.maxUnitsPerDay ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {svc.maxUnitsPerWeek ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
