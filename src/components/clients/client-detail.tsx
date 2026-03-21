"use client";

import type {
  Client,
  ClientContact,
  BcbaOption,
  ClientInsuranceWithPayer,
  PayerOption,
} from "@/server/queries/clients";
import type { AuthorizationListItem } from "@/server/queries/authorizations";
import { ClientOverview } from "./client-overview";
import { ClientForm } from "./client-form";
import { ClientContactsCard } from "./client-contacts-card";
import { ClientInsuranceCard } from "./client-insurance-card";
import { ClientAuthorizationsCard } from "./client-authorizations-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClientDetail({
  client,
  contacts,
  bcbaOptions,
  insurance,
  payerOptions,
  authorizations,
  canEdit,
  canManagePayers,
  bcbaName,
}: {
  client: Client;
  contacts: ClientContact[];
  bcbaOptions: BcbaOption[];
  insurance: ClientInsuranceWithPayer[];
  payerOptions: PayerOption[];
  authorizations: AuthorizationListItem[];
  canEdit: boolean;
  canManagePayers: boolean;
  bcbaName: string | null;
}) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="authorizations">Authorizations</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
        {canEdit && <TabsTrigger value="edit">Edit</TabsTrigger>}
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        <ClientOverview
          client={client}
          contacts={contacts}
          insurance={insurance}
          bcbaName={bcbaName}
        />
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-xs">Session history coming in Sprint 3A.</p>
        </div>
      </TabsContent>

      {canEdit && (
        <TabsContent value="edit" className="pt-4">
          <ClientForm client={client} bcbaOptions={bcbaOptions} />
        </TabsContent>
      )}
    </Tabs>
  );
}
