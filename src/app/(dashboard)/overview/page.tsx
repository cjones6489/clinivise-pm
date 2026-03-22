import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getClients } from "@/server/queries/clients";
import { getAuthorizations } from "@/server/queries/authorizations";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = {
  title: "Overview | Clinivise",
};

export default async function OverviewPage() {
  const user = await requireAuth();

  const [clients, authorizations] = await Promise.all([
    getClients(user.organizationId),
    getAuthorizations(user.organizationId),
  ]);

  return <DashboardView clients={clients} authorizations={authorizations} />;
}
