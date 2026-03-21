import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getAuthorizations } from "@/server/queries/authorizations";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AuthorizationTable } from "@/components/authorizations/authorization-table";
import { Button } from "@/components/ui/button";
import { FileValidationIcon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Authorizations | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba"];

export default async function AuthorizationsPage() {
  const user = await requireAuth();
  const canCreate = WRITE_ROLES.includes(user.role);
  const authorizations = await getAuthorizations(user.organizationId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Authorizations"
        description="Track insurance authorizations, service lines, and utilization."
        actions={
          canCreate ? (
            <Button asChild size="sm" className="text-xs">
              <Link href="/authorizations/new">Add Authorization</Link>
            </Button>
          ) : undefined
        }
      />
      {authorizations.length > 0 ? (
        <AuthorizationTable data={authorizations} canEdit={canCreate} />
      ) : (
        <EmptyState
          icon={FileValidationIcon}
          title="No authorizations yet"
          description="Add your first authorization to start tracking approved services and utilization."
          action={
            canCreate ? (
              <Button asChild size="sm" className="text-xs">
                <Link href="/authorizations/new">Add Authorization</Link>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
