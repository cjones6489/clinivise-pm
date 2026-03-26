import Link from "next/link";
import { getClientOverviewForDashboard } from "@/server/queries/dashboard";
import type { DashboardClientRow } from "@/server/queries/dashboard";
import { Button } from "@/components/ui/button";
import { UtilizationBar } from "@/components/shared/utilization-bar";
import { ExpiryBadge } from "@/components/shared/expiry-badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { differenceInYears } from "date-fns";

function ClientRow({ client }: { client: DashboardClientRow }) {
  const age = differenceInYears(new Date(), new Date(client.dateOfBirth));

  return (
    <Link
      href={`/clients/${client.id}`}
      className="border-border/40 hover:bg-muted/30 block border-b px-4 py-2.5 transition-colors last:border-b-0"
    >
      {/* Desktop grid */}
      <div className="hidden items-center gap-2 sm:grid sm:grid-cols-[2fr_0.8fr_1fr_1.5fr_0.8fr_24px]">
        <div>
          <span className="text-xs font-semibold">
            {client.firstName} {client.lastName}
          </span>
          <span className="text-muted-foreground ml-1.5 text-[11px]">
            · {client.diagnosisCode ?? "—"} · Age {age}
          </span>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {client.payerName ?? "—"}
        </div>
        <div className="text-xs text-muted-foreground">
          {client.bcbaName ?? "—"}
        </div>
        <div>
          {client.totalApproved > 0 ? (
            <UtilizationBar usedUnits={client.totalUsed} approvedUnits={client.totalApproved} compact />
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
        <div>
          {client.nearestExpiry ? (
            <ExpiryBadge endDate={client.nearestExpiry} />
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
        <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-muted-foreground" />
      </div>

      {/* Mobile stacked */}
      <div className="flex flex-col gap-1.5 sm:hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold">
              {client.firstName} {client.lastName}
            </span>
            <span className="text-muted-foreground ml-1.5 text-[11px]">
              · {client.diagnosisCode ?? "—"}
            </span>
          </div>
          {client.nearestExpiry && <ExpiryBadge endDate={client.nearestExpiry} />}
        </div>
        {client.totalApproved > 0 ? (
          <UtilizationBar usedUnits={client.totalUsed} approvedUnits={client.totalApproved} compact />
        ) : (
          <span className="text-xs text-muted-foreground">
            {client.bcbaName ? `${client.bcbaName} · No auth` : "No auth"}
          </span>
        )}
      </div>
    </Link>
  );
}

export async function DashboardClients({ orgId }: { orgId: string }) {
  const clients = await getClientOverviewForDashboard(orgId);

  if (clients.length === 0) return null;

  const needsAttention = clients.filter((c) => c.urgencyScore > 0);
  const healthy = clients.filter((c) => c.urgencyScore === 0);

  return (
    <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Client Overview
        </span>
        <div className="flex items-center gap-2">
          {needsAttention.length > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {needsAttention.length} need{needsAttention.length !== 1 ? "" : "s"} attention
            </span>
          )}
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
            <Link href="/clients">View All &rarr;</Link>
          </Button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="border-border bg-muted/50 hidden grid-cols-[2fr_0.8fr_1fr_1.5fr_0.8fr_24px] gap-2 border-b px-4 py-2 sm:grid">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">Client</span>
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">Payer</span>
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">BCBA</span>
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">Utilization</span>
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">Expiry</span>
        <span />
      </div>

      <div>
        {/* Show clients needing attention first, then healthy */}
        {needsAttention.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
        {healthy.length > 0 && needsAttention.length > 0 && (
          <div className="border-border/40 bg-muted/20 border-b px-4 py-1.5 text-[11px] text-muted-foreground">
            On track ({healthy.length})
          </div>
        )}
        {healthy.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}

export function DashboardClientsSkeleton() {
  return (
    <div className="border-border bg-card animate-pulse rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <div className="bg-muted h-3 w-28 rounded" />
        <div className="bg-muted h-5 w-16 rounded" />
      </div>
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/40 px-4 py-3 last:border-b-0">
            <div className="flex-1 space-y-1.5">
              <div className="bg-muted h-3 w-40 rounded" />
              <div className="bg-muted h-3 w-24 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
