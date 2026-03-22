import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getSessionById, getProviderOptions } from "@/server/queries/sessions";
import { getClientOptions } from "@/server/queries/authorizations";
import { PageHeader } from "@/components/layout/page-header";
import { SessionForm } from "@/components/sessions/session-form";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Edit Session | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba", "bcaba", "rbt"] as const;

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireRole([...WRITE_ROLES]);

  const session = await getSessionById(user.organizationId, id);
  if (!session) {
    notFound();
  }

  const [clientOptions, providerOptions] = await Promise.all([
    getClientOptions(user.organizationId),
    getProviderOptions(user.organizationId),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Session"
        description={`${session.clientLastName}, ${session.clientFirstName} — ${formatDate(session.sessionDate)}`}
      />
      <SessionForm
        session={session}
        clientOptions={clientOptions}
        providerOptions={providerOptions}
      />
    </div>
  );
}
