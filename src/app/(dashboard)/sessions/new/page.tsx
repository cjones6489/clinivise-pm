import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getClientOptions } from "@/server/queries/authorizations";
import { getProviderOptions } from "@/server/queries/sessions";
import { PageHeader } from "@/components/layout/page-header";
import { SessionForm } from "@/components/sessions/session-form";

export const metadata: Metadata = {
  title: "Log Session | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba", "bcaba", "rbt"] as const;

export default async function NewSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; providerId?: string }>;
}) {
  const { clientId, providerId } = await searchParams;
  const user = await requireRole([...WRITE_ROLES]);

  const [clientOptions, providerOptions] = await Promise.all([
    getClientOptions(user.organizationId),
    getProviderOptions(user.organizationId),
  ]);

  return (
    <div className="space-y-6">
      <Link href="/sessions" className="text-xs text-primary hover:underline">
        &larr; Back to Sessions
      </Link>
      <PageHeader
        title="Log Session"
        description="Record a therapy session with unit tracking and authorization linking."
      />
      <SessionForm
        clientOptions={clientOptions}
        providerOptions={providerOptions}
        preselectedClientId={clientId}
        preselectedProviderId={providerId}
      />
    </div>
  );
}
