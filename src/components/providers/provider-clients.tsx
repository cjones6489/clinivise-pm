"use client";

import { useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type { ProviderCaseloadItem, AvailableClient } from "@/server/queries/providers";
import { addToTeam, removeFromTeam, updateTeamMember } from "@/server/actions/care-team";
import {
  CARE_TEAM_ROLE_LABELS,
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_VARIANT,
  defaultCareTeamRole,
  type CareTeamRole,
  type ClientStatus,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  StarIcon,
  Delete01Icon,
  UserMultipleIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

// ── Assign Clients Modal ─────────────────────────────────────────────────────

function AssignClientsModal({
  open,
  onOpenChange,
  providerId,
  credentialType,
  availableClients,
  caseload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
  credentialType: string;
  availableClients: AvailableClient[];
  caseload: ProviderCaseloadItem[];
}) {
  const [search, setSearch] = useState("");

  const { execute: executeAdd, isPending: isAdding } = useAction(addToTeam, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Client assigned");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to assign client"),
  });

  const { execute: executeRemoveAction } = useAction(removeFromTeam, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Client removed from caseload");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove client"),
  });

  const { execute: executeUpdate } = useAction(updateTeamMember, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Assignment updated");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to update"),
  });

  const filtered = search
    ? availableClients.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          (c.diagnosisCode ?? "").toLowerCase().includes(search.toLowerCase()),
      )
    : availableClients;

  function handleAdd(client: AvailableClient) {
    executeAdd({
      clientId: client.id,
      providerId,
      role: defaultCareTeamRole(credentialType),
      isPrimary: false,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-sm font-semibold">Manage Caseload</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Search and assign clients. Click remove to unassign.
          </DialogDescription>
        </DialogHeader>

        {/* Search + Add */}
        <div className="border-border/40 border-t">
          <div className="px-4 py-3">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={14}
                strokeWidth={1.5}
                className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
              />
              <Input
                placeholder="Search clients to assign..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
                autoFocus
              />
            </div>
          </div>

          <div className="border-border/30 max-h-48 overflow-y-auto border-t">
            {availableClients.length > 0 ? (
              <>
                {filtered.length > 0 ? (
                  filtered.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      disabled={isAdding}
                      onClick={() => handleAdd(c)}
                      className="hover:bg-accent/50 flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-colors disabled:opacity-50"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">
                          {c.lastName}, {c.firstName}
                        </span>
                        {c.diagnosisCode && (
                          <span className="text-muted-foreground ml-1.5">· {c.diagnosisCode}</span>
                        )}
                      </div>
                      <Badge
                        variant={CLIENT_STATUS_VARIANT[c.status as ClientStatus] ?? "outline"}
                        className="shrink-0 text-[9px]"
                      >
                        {CLIENT_STATUS_LABELS[c.status as ClientStatus] ?? c.status}
                      </Badge>
                      <span className="text-primary shrink-0 text-[11px] font-medium">
                        + Assign
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-muted-foreground px-4 py-4 text-center text-xs">
                    No clients match your search.
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground px-4 py-4 text-center text-xs">
                All clients are already assigned to this provider.
              </div>
            )}
          </div>
        </div>

        {/* Current caseload */}
        <div className="border-border/40 flex-1 overflow-y-auto border-t">
          <div className="px-4 py-2.5">
            <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
              Current Caseload
              {caseload.length > 0 && (
                <span className="ml-1.5 font-normal tracking-normal normal-case">
                  ({caseload.length})
                </span>
              )}
            </span>
          </div>

          {caseload.length > 0 ? (
            caseload.map((c) => (
              <div
                key={c.clientId}
                className="border-border/20 flex items-center gap-2.5 border-b px-4 py-2 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/clients/${c.clientId}`}
                      className="text-xs font-medium hover:underline"
                    >
                      {c.clientLastName}, {c.clientFirstName}
                    </Link>
                    {c.isPrimary && (
                      <HugeiconsIcon icon={StarIcon} size={12} className="text-amber-500" />
                    )}
                  </div>
                  <div className="text-muted-foreground text-[10px]">
                    {CARE_TEAM_ROLE_LABELS[c.role as CareTeamRole] ?? c.role}
                    {c.lastSessionDate ? ` · Last session ${formatDate(c.lastSessionDate)}` : ""}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${c.isPrimary ? "cursor-default text-amber-500" : "text-muted-foreground/40 hover:text-amber-500"}`}
                  onClick={
                    c.isPrimary
                      ? undefined
                      : () => executeUpdate({ id: c.assignmentId, isPrimary: true })
                  }
                  disabled={c.isPrimary}
                  title={c.isPrimary ? "Primary for this client" : "Set as primary"}
                >
                  <HugeiconsIcon icon={StarIcon} size={14} strokeWidth={c.isPrimary ? 2 : 1.5} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground/40 hover:text-destructive h-6 w-6"
                  onClick={() => executeRemoveAction({ id: c.assignmentId })}
                  title="Remove from caseload"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={14} />
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HugeiconsIcon
                icon={UserMultipleIcon}
                size={20}
                className="text-muted-foreground mb-2"
              />
              <p className="text-muted-foreground text-xs">
                No clients assigned. Add clients above.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Provider Clients Component ──────────────────────────────────────────

export function ProviderClients({
  providerId,
  credentialType,
  caseload,
  availableClients,
  canEdit,
}: {
  providerId: string;
  credentialType: string;
  caseload: ProviderCaseloadItem[];
  availableClients: AvailableClient[];
  canEdit: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<ProviderCaseloadItem | null>(null);

  const { executeAsync: executeRemove } = useAction(removeFromTeam, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Client removed from caseload");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove client"),
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          {caseload.length > 0
            ? `${caseload.length} client${caseload.length !== 1 ? "s" : ""} assigned`
            : null}
        </div>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setModalOpen(true)}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
            Manage Caseload
          </Button>
        )}
      </div>

      {/* Caseload table */}
      {caseload.length > 0 ? (
        <div className="border-border/40 bg-card overflow-hidden rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-border bg-muted/20 border-b">
                  <th className="text-muted-foreground px-3 py-2 text-left text-[11px] font-semibold tracking-wider uppercase">
                    Client
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-left text-[11px] font-semibold tracking-wider uppercase">
                    Role
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-left text-[11px] font-semibold tracking-wider uppercase">
                    Status
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-right text-[11px] font-semibold tracking-wider uppercase">
                    Sessions
                  </th>
                  <th className="text-muted-foreground px-3 py-2 text-right text-[11px] font-semibold tracking-wider uppercase">
                    Last Session
                  </th>
                  {canEdit && <th className="w-8 px-3 py-2" />}
                </tr>
              </thead>
              <tbody>
                {caseload.map((c) => (
                  <tr
                    key={c.clientId}
                    className="border-border/30 hover:bg-accent/30 border-b transition-colors last:border-0"
                  >
                    <td className="px-3 py-2">
                      <Link href={`/clients/${c.clientId}`} className="font-medium hover:underline">
                        {c.clientLastName}, {c.clientFirstName}
                      </Link>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-muted-foreground">
                        {CARE_TEAM_ROLE_LABELS[c.role as CareTeamRole] ?? c.role}
                      </span>
                      {c.isPrimary && (
                        <Badge className="ml-1.5 border-amber-200 bg-amber-50 text-[8px] text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                          Primary
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <Badge
                        variant={CLIENT_STATUS_VARIANT[c.clientStatus as ClientStatus] ?? "outline"}
                        className="text-[10px]"
                      >
                        {CLIENT_STATUS_LABELS[c.clientStatus as ClientStatus] ?? c.clientStatus}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{c.sessionCount}</td>
                    <td className="text-muted-foreground px-3 py-2 text-right tabular-nums">
                      {c.lastSessionDate ? formatDate(c.lastSessionDate) : "—"}
                    </td>
                    {canEdit && (
                      <td className="px-3 py-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground/40 hover:text-destructive h-6 w-6"
                          onClick={() => setRemoveTarget(c)}
                          title="Remove from caseload"
                        >
                          <HugeiconsIcon icon={Delete01Icon} size={14} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="border-border/40 bg-card flex flex-col items-center justify-center rounded-lg border py-8 text-center shadow-sm">
          <div className="bg-muted mb-3 rounded-lg p-3">
            <HugeiconsIcon icon={UserMultipleIcon} size={24} className="text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">No clients assigned</p>
          <p className="text-muted-foreground mt-1 text-[11px]">
            Assign clients to this provider&apos;s caseload to track care team membership.
          </p>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs"
              onClick={() => setModalOpen(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
              Manage Caseload
            </Button>
          )}
        </div>
      )}

      {/* Manage Caseload Modal */}
      {canEdit && (
        <AssignClientsModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          providerId={providerId}
          credentialType={credentialType}
          availableClients={availableClients}
          caseload={caseload}
        />
      )}

      {/* Remove confirmation */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title="Remove from caseload"
        description={
          removeTarget
            ? `Remove ${removeTarget.clientFirstName} ${removeTarget.clientLastName} from this provider's caseload?`
            : ""
        }
        onConfirm={async () => {
          if (removeTarget) await executeRemove({ id: removeTarget.assignmentId });
        }}
        variant="destructive"
        confirmLabel="Remove"
      />
    </div>
  );
}
