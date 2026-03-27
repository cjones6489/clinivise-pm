"use client";

import { useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type { CareTeamMember, PastCareTeamMember, AvailableProvider } from "@/server/queries/clients";
import { formatDate } from "@/lib/utils";
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

// Credential-based avatar colors for visual differentiation
const CREDENTIAL_AVATAR = {
  bcba: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  bcba_d: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  bcaba: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  rbt: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  other: "bg-muted text-muted-foreground",
} as Record<string, string>;

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
  const avatarColor = CREDENTIAL_AVATAR[member.credentialType] ?? CREDENTIAL_AVATAR.other;

  return (
    <div className="hover:bg-accent/30 group flex items-center gap-3.5 px-4 py-3 transition-colors last:rounded-b-lg">
      {/* Avatar — larger, credential-colored */}
      <div className="relative shrink-0">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}
        >
          {getInitials(member.providerFirstName, member.providerLastName)}
        </div>
        {member.isPrimary && (
          <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 shadow-sm dark:bg-amber-500">
            <HugeiconsIcon icon={StarIcon} size={10} className="text-background" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/providers/${member.providerId}`}
            className="text-sm font-semibold tracking-tight hover:underline"
          >
            {member.providerFirstName} {member.providerLastName}
          </Link>
          <Badge
            variant="secondary"
            className="text-[10px] font-medium"
          >
            {CREDENTIAL_LABELS[member.credentialType as CredentialType] ??
              member.credentialType.toUpperCase()}
          </Badge>
        </div>
        <div className="text-muted-foreground mt-0.5 text-xs">
          {CARE_TEAM_ROLE_LABELS[member.role as CareTeamRole] ?? member.role}
          {member.startDate && (
            <span className="ml-1.5">· since {formatDate(member.startDate)}</span>
          )}
        </div>
      </div>

      {/* Actions — visible on hover */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
            disabled={isPending}
          >
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
    <div className="border-border/20 flex items-center gap-2.5 border-b px-4 py-2 last:border-b-0">
      <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold">
        {getInitials(member.providerFirstName, member.providerLastName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium">
          {member.providerFirstName} {member.providerLastName}
        </div>
        <div className="text-muted-foreground text-[10px]">
          {CARE_TEAM_ROLE_LABELS[member.role as CareTeamRole] ?? member.role}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={`h-6 w-6 ${member.isPrimary ? "cursor-default text-amber-500" : "text-muted-foreground/40 hover:text-amber-500"}`}
        onClick={member.isPrimary ? undefined : onSetPrimary}
        disabled={member.isPrimary}
        title={member.isPrimary ? "Primary provider" : "Set as primary"}
      >
        <HugeiconsIcon icon={StarIcon} size={14} strokeWidth={member.isPrimary ? 2 : 1.5} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground/40 hover:text-destructive h-6 w-6"
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
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to add provider"),
  });

  const { execute: executeRemoveAction } = useAction(removeFromTeam, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove provider"),
  });

  const { execute: executeUpdate } = useAction(updateTeamMember, {
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
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="px-5 pt-5 pb-3">
          <DialogTitle className="text-sm font-semibold">Manage Care Team</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Search and add providers. Use the menu on each member to set primary or remove.
          </DialogDescription>
        </DialogHeader>

        {/* Search + Add section */}
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
                placeholder="Search providers to add..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
                autoFocus
              />
            </div>
          </div>

          {/* Available providers list */}
          <div className="border-border/30 max-h-48 overflow-y-auto border-t">
            {availableProviders.length > 0 ? (
              <>
                {bcbas.length > 0 && (
                  <>
                    <div className="bg-muted/50 sticky top-0 z-10 px-4 py-1.5">
                      <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        BCBAs & Supervisors
                      </span>
                    </div>
                    {bcbas.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isAdding}
                        onClick={() => handleAdd(p)}
                        className="hover:bg-accent/50 flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-colors disabled:opacity-50"
                      >
                        <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold">
                          {getInitials(p.firstName, p.lastName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">
                            {p.firstName} {p.lastName}
                          </span>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[9px]">
                          {CREDENTIAL_LABELS[p.credentialType as CredentialType] ??
                            p.credentialType.toUpperCase()}
                        </Badge>
                        <span className="text-primary shrink-0 text-[11px] font-medium">+ Add</span>
                      </button>
                    ))}
                  </>
                )}
                {rbts.length > 0 && (
                  <>
                    <div className="bg-muted/50 sticky top-0 z-10 px-4 py-1.5">
                      <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                        RBTs & Technicians
                      </span>
                    </div>
                    {rbts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isAdding}
                        onClick={() => handleAdd(p)}
                        className="hover:bg-accent/50 flex w-full items-center gap-3 px-4 py-2 text-left text-xs transition-colors disabled:opacity-50"
                      >
                        <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold">
                          {getInitials(p.firstName, p.lastName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">
                            {p.firstName} {p.lastName}
                          </span>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-[9px]">
                          {CREDENTIAL_LABELS[p.credentialType as CredentialType] ??
                            p.credentialType.toUpperCase()}
                        </Badge>
                        <span className="text-primary shrink-0 text-[11px] font-medium">+ Add</span>
                      </button>
                    ))}
                  </>
                )}
                {filtered.length === 0 && (
                  <div className="text-muted-foreground px-4 py-4 text-center text-xs">
                    No providers match your search.
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted-foreground px-4 py-4 text-center text-xs">
                All providers are already on this team.
              </div>
            )}
          </div>
        </div>

        {/* Current team */}
        <div className="border-border/40 flex-1 overflow-y-auto border-t">
          <div className="px-4 py-2.5">
            <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
              Current Team
              {careTeam.length > 0 && (
                <span className="ml-1.5 font-normal tracking-normal normal-case">
                  ({careTeam.length})
                </span>
              )}
            </span>
          </div>

          {careTeam.length > 0 ? (
            <>
              {teamBcbas.length > 0 && (
                <div>
                  <div className="bg-muted/30 border-border/20 border-y px-4 py-1">
                    <span className="text-muted-foreground text-[10px] font-medium">
                      BCBAs & Supervisors
                    </span>
                  </div>
                  {teamBcbas.map((m) => (
                    <ModalTeamRow
                      key={m.id}
                      member={m}
                      onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })}
                      onRemove={() => executeRemoveAction({ id: m.id })}
                    />
                  ))}
                </div>
              )}
              {teamRbts.length > 0 && (
                <div>
                  <div className="bg-muted/30 border-border/20 border-y px-4 py-1">
                    <span className="text-muted-foreground text-[10px] font-medium">
                      RBTs & Technicians
                    </span>
                  </div>
                  {teamRbts.map((m) => (
                    <ModalTeamRow
                      key={m.id}
                      member={m}
                      onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })}
                      onRemove={() => executeRemoveAction({ id: m.id })}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <HugeiconsIcon icon={UserIcon} size={20} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-xs">
                No team members yet. Add providers above.
              </p>
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
  pastCareTeam,
  availableProviders,
  canEdit,
}: {
  clientId: string;
  careTeam: CareTeamMember[];
  pastCareTeam: PastCareTeamMember[];
  availableProviders: AvailableProvider[];
  canEdit: boolean;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<CareTeamMember | null>(null);
  const [showPast, setShowPast] = useState(false);

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateTeamMember, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to update care team"),
  });

  const { executeAsync: executeRemove } = useAction(removeFromTeam, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove provider"),
  });

  const bcbaMembers = careTeam.filter((m) =>
    ["bcba", "bcba_d", "bcaba"].includes(m.credentialType),
  );
  const rbtMembers = careTeam.filter(
    (m) => !["bcba", "bcba_d", "bcaba"].includes(m.credentialType),
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          {careTeam.length > 0
            ? `${bcbaMembers.length} BCBA${bcbaMembers.length !== 1 ? "s" : ""} · ${rbtMembers.length} RBT${rbtMembers.length !== 1 ? "s" : ""}${pastCareTeam.length > 0 ? ` · ${pastCareTeam.length} past` : ""}`
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
            Manage Team
          </Button>
        )}
      </div>

      {/* Empty state */}
      {careTeam.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-12 text-center shadow-sm">
          <div className="mb-4 flex -space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/40 dark:text-violet-300">BC</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">RT</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-sky-100 text-xs font-bold text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">BT</div>
          </div>
          <p className="text-sm font-semibold">Build the care team</p>
          <p className="text-muted-foreground mt-1 max-w-xs text-xs">
            Add BCBAs, RBTs, and other providers to track assignments, supervision, and session coverage.
          </p>
          {canEdit && (
            <Button
              size="sm"
              className="mt-4 text-xs"
              onClick={() => setModalOpen(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
              Add Team Members
            </Button>
          )}
        </div>
      ) : (
        <>
          {bcbaMembers.length > 0 && (
            <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 border-b px-4 py-2.5">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                <span className="text-xs font-semibold">BCBAs & Supervisors</span>
                <span className="text-muted-foreground text-xs">({bcbaMembers.length})</span>
              </div>
              <div className="divide-border/30 divide-y">
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
            </div>
          )}

          {rbtMembers.length > 0 && (
            <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
              <div className="flex items-center gap-2 border-b px-4 py-2.5">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold">RBTs & Technicians</span>
                <span className="text-muted-foreground text-xs">({rbtMembers.length})</span>
              </div>
              <div className="divide-border/30 divide-y">
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
            </div>
          )}
        </>
      )}

      {/* Past Assignments (collapsible) */}
      {pastCareTeam.length > 0 && (
        <div className="border-border/50 overflow-hidden rounded-xl border">
          <button
            type="button"
            onClick={() => setShowPast(!showPast)}
            className="bg-muted/30 hover:bg-muted/50 flex w-full items-center justify-between px-4 py-2.5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span className="text-muted-foreground text-xs font-medium">
                Past Assignments
              </span>
              <span className="text-muted-foreground/60 text-xs">({pastCareTeam.length})</span>
            </div>
            <span className="text-muted-foreground text-xs">{showPast ? "Hide" : "Show"}</span>
          </button>
          {showPast && (
            <div className="divide-border/20 divide-y">
              {pastCareTeam.map((m) => {
                const avatarColor = CREDENTIAL_AVATAR[m.credentialType] ?? CREDENTIAL_AVATAR.other;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3.5 px-4 py-3 opacity-60"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}
                    >
                      {getInitials(m.providerFirstName, m.providerLastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/providers/${m.providerId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {m.providerFirstName} {m.providerLastName}
                        </Link>
                        <Badge variant="secondary" className="text-[10px]">
                          {CREDENTIAL_LABELS[m.credentialType as CredentialType] ?? m.credentialType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mt-0.5 text-xs">
                        {formatDate(m.startDate)} — {formatDate(m.endDate)}
                        {m.notes && <span className="ml-1.5 italic">· {m.notes}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title="Remove from care team"
        description={
          removeTarget
            ? `Remove ${removeTarget.providerFirstName} ${removeTarget.providerLastName} from this client's care team? They can still log sessions for this client.`
            : ""
        }
        onConfirm={async () => {
          if (removeTarget) await executeRemove({ id: removeTarget.id });
        }}
        variant="destructive"
        confirmLabel="Remove"
      />
    </div>
  );
}
