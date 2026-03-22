import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getClients } from "@/server/queries/clients";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ClientTable } from "@/components/clients/client-table";
import { Button } from "@/components/ui/button";
import { UserMultipleIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Clients | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

export default async function ClientsPage() {
  const user = await requireAuth();
  const canCreate = WRITE_ROLES.includes(user.role);
  const clients = await getClients(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description={`${clients.length} client${clients.length !== 1 ? "s" : ""} in your practice`}
        actions={
          canCreate ? (
            <Button asChild size="sm" className="text-xs">
              <Link href="/clients/new">Add Client</Link>
            </Button>
          ) : undefined
        }
      />
      {clients.length > 0 ? (
        <ClientTable data={clients} canEdit={canCreate} />
      ) : (
        <EmptyState
          icon={UserMultipleIcon}
          title="No clients yet"
          description="Add your first client to start managing their care and authorizations."
          action={
            canCreate ? (
              <Button asChild size="sm" className="text-xs">
                <Link href="/clients/new">Add Client</Link>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
