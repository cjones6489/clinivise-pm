import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getProviders } from "@/server/queries/providers";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ProviderTable } from "@/components/providers/provider-table";
import { Button } from "@/components/ui/button";
import { StethoscopeIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Providers | Clinivise",
};

export default async function ProvidersPage() {
  const user = await requireRole(["owner", "admin"]);
  const providers = await getProviders(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Providers"
        description={`${providers.length} provider${providers.length !== 1 ? "s" : ""} in your practice`}
        actions={
          <Button asChild size="sm" className="text-xs">
            <Link href="/providers/new">Add Provider</Link>
          </Button>
        }
      />
      {providers.length > 0 ? (
        <ProviderTable data={providers} />
      ) : (
        <EmptyState
          icon={StethoscopeIcon}
          title="No providers yet"
          description="Add your first provider to start managing credentials and assignments."
          action={
            <Button asChild size="sm" className="text-xs">
              <Link href="/providers/new">Add Provider</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
