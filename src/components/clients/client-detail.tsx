"use client";

import type { Client, ClientContact, BcbaOption } from "@/server/queries/clients";
import { ClientForm } from "./client-form";
import { ClientContactsCard } from "./client-contacts-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ClientDetail({
  client,
  contacts,
  bcbaOptions,
  canEdit,
}: {
  client: Client;
  contacts: ClientContact[];
  bcbaOptions: BcbaOption[];
  canEdit: boolean;
}) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
        <TabsTrigger value="insurance">Insurance</TabsTrigger>
        <TabsTrigger value="authorizations">Authorizations</TabsTrigger>
        <TabsTrigger value="sessions">Sessions</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="pt-4">
        <ClientForm
          client={client}
          bcbaOptions={bcbaOptions}
          disabled={!canEdit}
        />
      </TabsContent>

      <TabsContent value="contacts" className="pt-4">
        <ClientContactsCard
          contacts={contacts}
          clientId={client.id}
          canEdit={canEdit}
        />
      </TabsContent>

      <TabsContent value="insurance" className="pt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-muted-foreground">
            Insurance management coming in Sprint 2C.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="authorizations" className="pt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-muted-foreground">
            Authorization tracking coming in Sprint 2D.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="sessions" className="pt-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-xs text-muted-foreground">
            Session history coming in Sprint 3A.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
