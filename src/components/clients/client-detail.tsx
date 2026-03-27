"use client";

import type {
  Client,
  ClientContact,
  CareTeamMember,
  AvailableProvider,
  ClientInsuranceWithPayer,
  PayerOption,
} from "@/server/queries/clients";
import type { GoalWithObjectives } from "@/server/queries/goals";
import type { AuthorizationListItem, ClientAuthUtilization } from "@/server/queries/authorizations";
import type { SessionListItem } from "@/server/queries/sessions";
import { ClientOverview } from "./client-overview";
import { ClientCareTeam } from "./client-care-team";
import { ClientGoals } from "./client-goals";
import { ClientForm } from "./client-form";
import { ClientContactsCard } from "./client-contacts-card";
import { ClientInsuranceCard } from "./client-insurance-card";
import { ClientAuthorizationsCard } from "./client-authorizations-card";
import { ClientSessionsCard } from "./client-sessions-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClientDetail({
  client,
  contacts,
  careTeam,
  availableProviders,
  goals,
  insurance,
  payerOptions,
  authorizations,
  sessions,
  canEdit,
  canManagePayers,
  authUtilization,
}: {
  client: Client;
  contacts: ClientContact[];
  careTeam: CareTeamMember[];
  availableProviders: AvailableProvider[];
  goals: GoalWithObjectives[];
  insurance: ClientInsuranceWithPayer[];
  payerOptions: PayerOption[];
  authorizations: AuthorizationListItem[];
  sessions: SessionListItem[];
  canEdit: boolean;
  canManagePayers: boolean;
  authUtilization: ClientAuthUtilization | null;
}) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="care-team">Care Team</TabsTrigger>
        <TabsTrigger value="goals">Goals</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="authorizations">Authorizations</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        <ClientOverview
          client={client}
          insurance={insurance}
          authorizations={authorizations}
          sessions={sessions}
          careTeam={careTeam}
          authUtilization={authUtilization}
        />
      </TabsContent>

      <TabsContent value="care-team" className="pt-4">
        <ClientCareTeam
          clientId={client.id}
          careTeam={careTeam}
          availableProviders={availableProviders}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="goals" className="pt-4">
        <ClientGoals goals={goals} canEdit={canEdit} />
      </TabsContent>

      <TabsContent value="contacts" className="pt-4">
        <ClientContactsCard contacts={contacts} clientId={client.id} canEdit={canEdit} />
      </TabsContent>

      <TabsContent value="insurance" className="pt-4">
        <ClientInsuranceCard
          insurance={insurance}
          contacts={contacts}
          clientId={client.id}
          payerOptions={payerOptions}
          canEdit={canEdit}
          canManagePayers={canManagePayers}
        />
      </TabsContent>

      <TabsContent value="authorizations" className="pt-4">
        <ClientAuthorizationsCard
          authorizations={authorizations}
          clientId={client.id}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="sessions" className="pt-4">
        <ClientSessionsCard sessions={sessions} clientId={client.id} canEdit={canEdit} />
      </TabsContent>

      {canEdit && (
        <TabsContent value="edit" className="pt-4">
          <ClientForm client={client} />
        </TabsContent>
      )}
    </Tabs>
  );
}
