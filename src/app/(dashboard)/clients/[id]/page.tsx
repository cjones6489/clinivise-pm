import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import {
  getClientById,
  getClientContacts,
  getBcbaOptions,
} from "@/server/queries/clients";
import { PageHeader } from "@/components/layout/page-header";
import { ClientDetail } from "@/components/clients/client-detail";
import { Badge } from "@/components/ui/badge";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_VARIANT,
  type ClientStatus,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "Client | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAuth();
  const canEdit = WRITE_ROLES.includes(user.role);

  const [client, contacts, bcbaOptions] = await Promise.all([
    getClientById(user.organizationId, id),
    getClientContacts(user.organizationId, id),
    canEdit ? getBcbaOptions(user.organizationId) : Promise.resolve([]),
  ]);

  if (!client) {
    notFound();
  }

  const status = client.status as ClientStatus;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        description={
          <Badge variant={CLIENT_STATUS_VARIANT[status]}>
            {CLIENT_STATUS_LABELS[status] ?? status}
          </Badge>
        }
      />
      <ClientDetail
        client={client}
        contacts={contacts}
        bcbaOptions={bcbaOptions}
        canEdit={canEdit}
      />
    </div>
  );
}
