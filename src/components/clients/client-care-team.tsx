"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type { CareTeamMember, AvailableProvider } from "@/server/queries/clients";
import { addToTeam, updateTeamMember, removeFromTeam } from "@/server/actions/care-team";
import {
  CARE_TEAM_ROLE_LABELS,
  CREDENTIAL_LABELS,
  defaultCareTeamRole,
  type CareTeamRole,
  type CredentialType,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  MoreHorizontalCircle01Icon,
  StarIcon,
  Delete01Icon,
  UserIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";

function getInitials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

// ── Team Member Row ──────────────────────────────────────────────────────────

function TeamMemberRow({
  member,
  onSetPrimary,
  onRemove,
  isPending,
}: {
  member: CareTeamMember;
  onSetPrimary: () => void;
  onRemove: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/30 px-4 py-2.5 last:border-b-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-semibold text-primary">
        {getInitials(member.providerFirstName, member.providerLastName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">
            {member.providerFirstName} {member.providerLastName}
          </span>
          <Badge variant="outline" className="text-[9px]">
            {CREDENTIAL_LABELS[member.credentialType as CredentialType] ?? member.credentialType.toUpperCase()}
          </Badge>
          {member.isPrimary && (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700 text-[9px] dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
              Primary
            </Badge>
          )}
        </div>
        <div className="text-[11px] text-muted-foreground">
          {CARE_TEAM_ROLE_LABELS[member.role as CareTeamRole] ?? member.role}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={isPending}>
            <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!member.isPrimary && (
            <>
              <DropdownMenuItem onClick={onSetPrimary}>
                <HugeiconsIcon icon={StarIcon} size={14} className="mr-2" />
                Set as Primary
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
            <HugeiconsIcon icon={Delete01Icon} size={14} className="mr-2" />
            Remove from Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Modal Team Row (visible star + remove buttons) ───────────────────────────

function ModalTeamRow({
  member,
  onSetPrimary,
  onRemove,
}: {
  member: CareTeamMember;
  onSetPrimary: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border/20 px-4 py-2 last:border-b-0">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
        {getInitials(member.providerFirstName, member.providerLastName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium">
          {member.providerFirstName} {member.providerLastName}
        </div>
        <div className="text-[10px] text-muted-foreground">
          {CARE_TEAM_ROLE_LABELS[member.role as CareTeamRole] ?? member.role}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${member.isPrimary ? "text-amber-500 cursor-default" : "text-muted-foreground/40 hover:text-amber-500"}`}
        onClick={member.isPrimary ? undefined : onSetPrimary}
        disabled={member.isPrimary}
        title={member.isPrimary ? "Primary provider" : "Set as primary"}
      >
        <HugeiconsIcon icon={StarIcon} size={14} strokeWidth={member.isPrimary ? 2 : 1.5} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 text-muted-foreground/40 hover:text-destructive"
        onClick={onRemove}
        title="Remove from team"
      >
        <HugeiconsIcon icon={Delete01Icon} size={14} />
      </Button>
    </div>
  );
}

// ── Manage Team Modal ────────────────────────────────────────────────────────

function ManageTeamModal({
  open,
  onOpenChange,
  clientId,
  availableProviders,
  careTeam,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  availableProviders: AvailableProvider[];
  careTeam: CareTeamMember[];
}) {
  const [search, setSearch] = useState("");

  const { execute: executeAdd, isPending: isAdding } = useAction(addToTeam, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Provider added to care team");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to add provider"),
  });

  const { execute: executeRemoveAction } = useAction(removeFromTeam, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Provider removed from care team");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove provider"),
  });

  const { execute: executeUpdate } = useAction(updateTeamMember, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Care team updated");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to update"),
  });

  // Filter available providers by search
  const filtered = search
    ? availableProviders.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          p.credentialType.toLowerCase().includes(search.toLowerCase()),
      )
    : availableProviders;

  // Group available by credential
  const bcbas = filtered.filter((p) => ["bcba", "bcba_d", "bcaba"].includes(p.credentialType));
  const rbts = filtered.filter((p) => !["bcba", "bcba_d", "bcaba"].includes(p.credentialType));

  // Group current team
  const teamBcbas = careTeam.filter((m) => ["bcba", "bcba_d", "bcaba"].includes(m.credentialType));
  const teamRbts = careTeam.filter((m) => !["bcba", "bcba_d", "bcaba"].includes(m.credentialType));

  function handleAdd(provider: AvailableProvider) {
    executeAdd({
      clientId,
      providerId: provider.id,
      role: defaultCareTeamRole(provider.credentialType),
      isPrimary: false,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 max-h-[85vh] flex flex-col">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-sm font-semibold">Manage Care Team</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Search and add providers. Use the menu on each member to set primary or remove.
          </DialogDescription>
        </DialogHeader>

        {/* Search + Add section */}
        <div className="border-t border-border/40">
          <div className="px-4 py-3">
            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={14}
                strokeWidth={1.5}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search providers to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
                autoFocus
              />
            </div>
          </div>

          {/* Available providers list */}
          <div className="max-h-48 overflow-y-auto border-t border-border/30">
            {availableProviders.length > 0 ? (
            <>
              {bcbas.length > 0 && (
                <>
                  <div className="sticky top-0 z-10 bg-muted/50 px-4 py-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                      BCBAs & Supervisors
                    </span>
                  </div>
                  {bcbas.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isAdding}
                      onClick={() => handleAdd(p)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-colors hover:bg-accent/50 disabled:opacity-50"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
                        {getInitials(p.firstName, p.lastName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">{p.firstName} {p.lastName}</span>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[9px]">
                        {CREDENTIAL_LABELS[p.credentialType as CredentialType] ?? p.credentialType.toUpperCase()}
                      </Badge>
                      <span className="shrink-0 text-[11px] font-medium text-primary">+ Add</span>
                    </button>
                  ))}
                </>
              )}
              {rbts.length > 0 && (
                <>
                  <div className="sticky top-0 z-10 bg-muted/50 px-4 py-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase text-muted-foreground">
                      RBTs & Technicians
                    </span>
                  </div>
                  {rbts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isAdding}
                      onClick={() => handleAdd(p)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-colors hover:bg-accent/50 disabled:opacity-50"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[10px] font-semibold text-primary">
                        {getInitials(p.firstName, p.lastName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-medium">{p.firstName} {p.lastName}</span>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-[9px]">
                        {CREDENTIAL_LABELS[p.credentialType as CredentialType] ?? p.credentialType.toUpperCase()}
                      </Badge>
                      <span className="shrink-0 text-[11px] font-medium text-primary">+ Add</span>
                    </button>
                  ))}
                </>
              )}
              {filtered.length === 0 && (
                <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                  No providers match your search.
                </div>
              )}
            </>
            ) : (
              <div className="px-4 py-4 text-center text-xs text-muted-foreground">
                All providers are already on this team.
              </div>
            )}
          </div>
        </div>

        {/* Current team */}
        <div className="flex-1 overflow-y-auto border-t border-border/40">
          <div className="px-4 py-2.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
              Current Team
              {careTeam.length > 0 && (
                <span className="ml-1.5 font-normal normal-case tracking-normal">
                  ({careTeam.length})
                </span>
              )}
            </span>
          </div>

          {careTeam.length > 0 ? (
            <>
              {teamBcbas.length > 0 && (
                <div>
                  <div className="bg-muted/30 px-4 py-1 border-y border-border/20">
                    <span className="text-[10px] font-medium text-muted-foreground">BCBAs & Supervisors</span>
                  </div>
                  {teamBcbas.map((m) => (
                    <ModalTeamRow key={m.id} member={m} onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })} onRemove={() => executeRemoveAction({ id: m.id })} />
                  ))}
                </div>
              )}
              {teamRbts.length > 0 && (
                <div>
                  <div className="bg-muted/30 px-4 py-1 border-y border-border/20">
                    <span className="text-[10px] font-medium text-muted-foreground">RBTs & Technicians</span>
                  </div>
                  {teamRbts.map((m) => (
                    <ModalTeamRow key={m.id} member={m} onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })} onRemove={() => executeRemoveAction({ id: m.id })} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HugeiconsIcon icon={UserIcon} size={20} className="mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">No team members yet. Add providers above.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Care Team Component ─────────────────────────────────────────────────

export function ClientCareTeam({
  clientId,
  careTeam,
  availableProviders,
  canEdit,
}: {
  clientId: string;
  careTeam: CareTeamMember[];
  availableProviders: AvailableProvider[];
  canEdit: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<CareTeamMember | null>(null);

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateTeamMember, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Care team updated");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to update care team"),
  });

  const { executeAsync: executeRemove } = useAction(removeFromTeam, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Provider removed from care team");
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove provider"),
  });

  const bcbaMembers = careTeam.filter((m) => ["bcba", "bcba_d", "bcaba"].includes(m.credentialType));
  const rbtMembers = careTeam.filter((m) => !["bcba", "bcba_d", "bcaba"].includes(m.credentialType));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {careTeam.length > 0
            ? `${bcbaMembers.length} BCBA${bcbaMembers.length !== 1 ? "s" : ""} · ${rbtMembers.length} RBT${rbtMembers.length !== 1 ? "s" : ""}`
            : null}
        </div>
        {canEdit && (
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setModalOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
            Manage Team
          </Button>
        )}
      </div>

      {/* Empty state */}
      {careTeam.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border/40 bg-card py-8 text-center shadow-sm">
          <div className="mb-3 rounded-lg bg-muted p-3">
            <HugeiconsIcon icon={UserIcon} size={24} className="text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">No team members assigned</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Add providers to this client&apos;s care team to track assignments and supervision.
          </p>
          {canEdit && (
            <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => setModalOpen(true)}>
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
              Manage Team
            </Button>
          )}
        </div>
      ) : (
        <>
          {bcbaMembers.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
              <div className="border-b border-border/40 bg-muted/20 px-4 py-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  BCBAs & Supervisors
                </span>
              </div>
              {bcbaMembers.map((m) => (
                <TeamMemberRow
                  key={m.id}
                  member={m}
                  isPending={isUpdating}
                  onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })}
                  onRemove={() => setRemoveTarget(m)}
                />
              ))}
            </div>
          )}

          {rbtMembers.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
              <div className="border-b border-border/40 bg-muted/20 px-4 py-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  RBTs & Technicians
                </span>
              </div>
              {rbtMembers.map((m) => (
                <TeamMemberRow
                  key={m.id}
                  member={m}
                  isPending={isUpdating}
                  onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })}
                  onRemove={() => setRemoveTarget(m)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Manage Team Modal */}
      {canEdit && (
        <ManageTeamModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          clientId={clientId}
          availableProviders={availableProviders}
          careTeam={careTeam}
        />
      )}

      {/* Remove confirmation */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}
        title="Remove from care team"
        description={
          removeTarget
            ? `Remove ${removeTarget.providerFirstName} ${removeTarget.providerLastName} from this client's care team? They can still log sessions for this client.`
            : ""
        }
        onConfirm={async () => { if (removeTarget) await executeRemove({ id: removeTarget.id }); }}
        variant="destructive"
        confirmLabel="Remove"
      />
    </div>
  );
}
