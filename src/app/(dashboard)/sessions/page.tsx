import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/auth";
import { getSessions } from "@/server/queries/sessions";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SessionTable } from "@/components/sessions/session-table";
import { Button } from "@/components/ui/button";
import { Clock01Icon } from "@hugeicons/core-free-icons";

export const metadata: Metadata = {
  title: "Sessions | Clinivise",
};

const WRITE_ROLES = ["owner", "admin", "bcba", "bcaba", "rbt"];

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const user = await requireAuth();
  const canCreate = WRITE_ROLES.includes(user.role);
  const page = Math.max(0, parseInt(pageParam ?? "0", 10) || 0);
  const { data: sessions, total, pageSize } = await getSessions(user.organizationId, { page });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Log and track therapy sessions, unit consumption, and provider activity."
        actions={
          canCreate ? (
            <Button asChild size="sm" className="text-xs">
              <Link href="/sessions/new">Log Session</Link>
            </Button>
          ) : undefined
        }
      />
      {sessions.length > 0 || page > 0 ? (
        <SessionTable data={sessions} canEdit={canCreate} pagination={{ page, pageSize, total }} />
      ) : (
        <EmptyState
          icon={Clock01Icon}
          title="No sessions yet"
          description="Log your first session to start tracking service delivery and authorization utilization."
          action={
            canCreate ? (
              <Button asChild size="sm" className="text-xs">
                <Link href="/sessions/new">Log Session</Link>
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
