"use client";

import type {
  Client,
  ClientContact,
  CareTeamMember,
  PastCareTeamMember,
  AvailableProvider,
  ClientInsuranceWithPayer,
  PayerOption,
} from "@/server/queries/clients";
import type { GoalWithObjectives, GoalDomain } from "@/server/queries/goals";
import type { AuthorizationListItem, ClientAuthUtilization, ClientAuthWithServices } from "@/server/queries/authorizations";
import type { SessionListItem } from "@/server/queries/sessions";
import type { DocumentListItem } from "@/server/queries/documents";
import { ClientOverview } from "./client-overview";
import { ClientCareTeam } from "./client-care-team";
import { ClientGoals } from "./client-goals";
import { ClientForm } from "./client-form";
import { ClientAuthorizationsCard } from "./client-authorizations-card";
import { ClientSessionsCard } from "./client-sessions-card";
import { ClientDocumentsCard } from "./client-documents-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClientDetail({
  client,
  contacts,
  careTeam,
  pastCareTeam,
  availableProviders,
  goals,
  goalDomains,
  insurance,
  payerOptions,
  authorizations,
  authsWithServices,
  sessions,
  documents,
  canEdit,
  canManagePayers,
  authUtilization,
}: {
  client: Client;
  contacts: ClientContact[];
  careTeam: CareTeamMember[];
  pastCareTeam: PastCareTeamMember[];
  availableProviders: AvailableProvider[];
  goals: GoalWithObjectives[];
  goalDomains: GoalDomain[];
  insurance: ClientInsuranceWithPayer[];
  payerOptions: PayerOption[];
  authorizations: AuthorizationListItem[];
  authsWithServices: ClientAuthWithServices[];
  sessions: SessionListItem[];
  documents: DocumentListItem[];
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
        <TabsTrigger value="authorizations">Authorizations</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
        {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        <ClientOverview
          client={client}
          contacts={contacts}
          insurance={insurance}
          payerOptions={payerOptions}
          authorizations={authorizations}
          sessions={sessions}
          careTeam={careTeam}
          authUtilization={authUtilization}
          canEdit={canEdit}
          canManagePayers={canManagePayers}
        />
      </TabsContent>

      <TabsContent value="care-team" className="pt-4">
        <ClientCareTeam
          clientId={client.id}
          careTeam={careTeam}
          pastCareTeam={pastCareTeam}
          availableProviders={availableProviders}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="goals" className="pt-4">
        <ClientGoals
          clientId={client.id}
          goals={goals}
          goalDomains={goalDomains}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="authorizations" className="pt-4">
        <ClientAuthorizationsCard
          authorizations={authsWithServices}
          clientId={client.id}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="sessions" className="pt-4">
        <ClientSessionsCard sessions={sessions} clientId={client.id} canEdit={canEdit} />
      </TabsContent>

      <TabsContent value="documents" className="pt-4">
        <ClientDocumentsCard documents={documents} clientId={client.id} canEdit={canEdit} />
      </TabsContent>

      {canEdit && (
        <TabsContent value="edit" className="pt-4">
          <ClientForm client={client} />
        </TabsContent>
      )}
    </Tabs>
  );
}
