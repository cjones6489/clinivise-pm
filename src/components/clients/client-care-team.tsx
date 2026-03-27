"use client";

import { useState } from "react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type {
  CareTeamMember,
  PastCareTeamMember,
  AvailableProvider,
} from "@/server/queries/clients";
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
  Search01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

// ── Shared helpers ───────────────────────────────────────────────────────────

function getInitials(first: string, last: string): string {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

const CREDENTIAL_AVATAR: Record<string, string> = {
  bcba: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  bcba_d: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  bcaba: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  rbt: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  other: "bg-muted text-muted-foreground",
};

function isSupervisorTier(credentialType: string) {
  return ["bcba", "bcba_d", "bcaba"].includes(credentialType);
}

// ── Add Member Modal ─────────────────────────────────────────────────────────
// Focused add-only modal. Full provider roster with search, grouped by
// credential, checkmarks on already-assigned. Stays open for multi-add.

function AddMemberModal({
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

  const onTeamIds = new Set(careTeam.map((m) => m.providerId));

  // Combine available + on-team into one list (full org roster)
  const allProviders = [
    ...availableProviders,
    ...careTeam.map((m) => ({
      id: m.providerId,
      firstName: m.providerFirstName,
      lastName: m.providerLastName,
      credentialType: m.credentialType,
    })),
  ];
  const uniqueProviders = Array.from(
    new Map(allProviders.map((p) => [p.id, p])).values(),
  );

  // Filter by search
  const filtered = search
    ? uniqueProviders.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          (CREDENTIAL_LABELS[p.credentialType as CredentialType] ?? p.credentialType)
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    : uniqueProviders;

  const supervisors = filtered.filter((p) => isSupervisorTier(p.credentialType));
  const technicians = filtered.filter((p) => !isSupervisorTier(p.credentialType));

  function handleAdd(provider: { id: string; credentialType: string }) {
    executeAdd({
      clientId,
      providerId: provider.id,
      role: defaultCareTeamRole(provider.credentialType),
      isPrimary: false,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSearch(""); }}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 space-y-0 px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">Add Team Members</DialogTitle>
          <p className="text-muted-foreground text-xs">
            Select providers to add to the care team. Already-assigned providers show a checkmark.
          </p>
        </DialogHeader>

        {/* Search — prominent, full width */}
        <div className="shrink-0 px-5 pt-3 pb-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              strokeWidth={1.5}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              placeholder="Search by name or credential..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg pl-10 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Provider roster */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              {supervisors.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                      BCBAs & Supervisors
                    </span>
                    <span className="text-muted-foreground/50 text-[11px]">
                      ({supervisors.length})
                    </span>
                  </div>
                  {supervisors.map((p) => {
                    const avatarColor =
                      CREDENTIAL_AVATAR[p.credentialType] ?? CREDENTIAL_AVATAR.other;
                    const isOnTeam = onTeamIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isAdding || isOnTeam}
                        onClick={() => handleAdd(p)}
                        className="hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors disabled:cursor-default disabled:hover:bg-transparent"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarColor}`}
                        >
                          {getInitials(p.firstName, p.lastName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">
                            {p.firstName} {p.lastName}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {CREDENTIAL_LABELS[p.credentialType as CredentialType] ??
                              p.credentialType.toUpperCase()}
                          </div>
                        </div>
                        {isOnTeam ? (
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={18}
                            className="shrink-0 text-emerald-500"
                          />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 text-xs"
                            tabIndex={-1}
                            disabled={isAdding}
                          >
                            <HugeiconsIcon icon={Add01Icon} size={12} className="mr-1" />
                            Add
                          </Button>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              {technicians.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                      RBTs & Technicians
                    </span>
                    <span className="text-muted-foreground/50 text-[11px]">
                      ({technicians.length})
                    </span>
                  </div>
                  {technicians.map((p) => {
                    const avatarColor =
                      CREDENTIAL_AVATAR[p.credentialType] ?? CREDENTIAL_AVATAR.other;
                    const isOnTeam = onTeamIds.has(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={isAdding || isOnTeam}
                        onClick={() => handleAdd(p)}
                        className="hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors disabled:cursor-default disabled:hover:bg-transparent"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarColor}`}
                        >
                          {getInitials(p.firstName, p.lastName)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium">
                            {p.firstName} {p.lastName}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {CREDENTIAL_LABELS[p.credentialType as CredentialType] ??
                              p.credentialType.toUpperCase()}
                          </div>
                        </div>
                        {isOnTeam ? (
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            size={18}
                            className="shrink-0 text-emerald-500"
                          />
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 text-xs"
                            tabIndex={-1}
                            disabled={isAdding}
                          >
                            <HugeiconsIcon icon={Add01Icon} size={12} className="mr-1" />
                            Add
                          </Button>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : search ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-sm">
                No providers match &ldquo;{search}&rdquo;
              </p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                Try a different name or credential type
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground text-sm">No providers in this practice yet</p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                Add providers on the Providers page first
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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<CareTeamMember | null>(null);
  const [showPast, setShowPast] = useState(false);

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateTeamMember, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to update care team"),
  });

  const { executeAsync: executeRemove } = useAction(removeFromTeam, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to remove provider"),
  });

  const bcbaMembers = careTeam.filter((m) => isSupervisorTier(m.credentialType));
  const rbtMembers = careTeam.filter((m) => !isSupervisorTier(m.credentialType));

  // ── Header ──────────────────────────────────────────────────────────────

  const headerContent = (
    <div className="flex items-center justify-between">
      <div className="text-muted-foreground text-xs">
        {careTeam.length > 0
          ? `${careTeam.length} active${pastCareTeam.length > 0 ? ` · ${pastCareTeam.length} past` : ""}`
          : null}
      </div>
      {canEdit && (
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setAddModalOpen(true)}
        >
          <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
          Add Member
        </Button>
      )}
    </div>
  );

  // ── Empty state ──────────────────────────────────────────────────────────

  if (careTeam.length === 0) {
    return (
      <div className="space-y-4">
        {headerContent}
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-12 text-center shadow-sm">
          <div className="mb-4 flex -space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/40 dark:text-violet-300">
              BC
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              RT
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-sky-100 text-xs font-bold text-sky-600 dark:bg-sky-900/40 dark:text-sky-300">
              BT
            </div>
          </div>
          <p className="text-sm font-semibold">Build the care team</p>
          <p className="text-muted-foreground mt-1 max-w-xs text-xs">
            Add BCBAs, RBTs, and other providers to track assignments, supervision, and
            session coverage.
          </p>
          {canEdit && (
            <Button
              size="sm"
              className="mt-4 text-xs"
              onClick={() => setAddModalOpen(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
              Add Team Members
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Team list (single card) ─────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {headerContent}

      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        {/* BCBAs & Supervisors */}
        {bcbaMembers.length > 0 && (
          <>
            <div className="flex items-center gap-2 border-b px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                BCBAs & Supervisors
              </span>
              <span className="text-muted-foreground/50 text-[10px]">({bcbaMembers.length})</span>
            </div>
            {bcbaMembers.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                isPending={isUpdating}
                canEdit={canEdit}
                onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })}
                onRemove={() => setRemoveTarget(m)}
              />
            ))}
          </>
        )}

        {/* RBTs & Technicians */}
        {rbtMembers.length > 0 && (
          <>
            <div className="flex items-center gap-2 border-b border-t px-4 py-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                RBTs & Technicians
              </span>
              <span className="text-muted-foreground/50 text-[10px]">({rbtMembers.length})</span>
            </div>
            {rbtMembers.map((m) => (
              <MemberRow
                key={m.id}
                member={m}
                isPending={isUpdating}
                canEdit={canEdit}
                onSetPrimary={() => executeUpdate({ id: m.id, isPrimary: true })}
                onRemove={() => setRemoveTarget(m)}
              />
            ))}
          </>
        )}

        {/* Past Assignments (inline, collapsible) */}
        {pastCareTeam.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowPast(!showPast)}
              className="bg-muted/20 hover:bg-muted/40 flex w-full items-center justify-between border-t px-4 py-2 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="bg-muted-foreground/30 h-1.5 w-1.5 rounded-full" />
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Past
                </span>
                <span className="text-muted-foreground/50 text-[10px]">
                  ({pastCareTeam.length})
                </span>
              </div>
              <span className="text-muted-foreground text-[10px]">
                {showPast ? "Hide" : "Show"}
              </span>
            </button>
            {showPast &&
              pastCareTeam.map((m) => {
                const avatarColor =
                  CREDENTIAL_AVATAR[m.credentialType] ?? CREDENTIAL_AVATAR.other;
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3.5 px-4 py-2.5 opacity-50"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor}`}
                    >
                      {getInitials(m.providerFirstName, m.providerLastName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/providers/${m.providerId}`}
                          className="text-xs font-medium hover:underline"
                        >
                          {m.providerFirstName} {m.providerLastName}
                        </Link>
                        <Badge variant="secondary" className="text-[9px]">
                          {CREDENTIAL_LABELS[m.credentialType as CredentialType] ??
                            m.credentialType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mt-0.5 text-[11px]">
                        {formatDate(m.startDate)} — {formatDate(m.endDate)}
                        {m.notes && (
                          <span className="ml-1.5 italic">· {m.notes}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        )}
      </div>

      {/* Add Member Modal */}
      {canEdit && (
        <AddMemberModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          clientId={clientId}
          availableProviders={availableProviders}
          careTeam={careTeam}
        />
      )}

      {/* Remove confirmation */}
      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(o) => {
          if (!o) setRemoveTarget(null);
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

// ── Member Row (used in the single card) ─────────────────────────────────────

function MemberRow({
  member,
  onSetPrimary,
  onRemove,
  isPending,
  canEdit,
}: {
  member: CareTeamMember;
  onSetPrimary: () => void;
  onRemove: () => void;
  isPending: boolean;
  canEdit: boolean;
}) {
  const avatarColor = CREDENTIAL_AVATAR[member.credentialType] ?? CREDENTIAL_AVATAR.other;

  return (
    <div className="hover:bg-accent/30 group flex items-center gap-3.5 px-4 py-3 transition-colors">
      {/* Avatar with primary star */}
      <div className="relative shrink-0">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${avatarColor}`}
        >
          {getInitials(member.providerFirstName, member.providerLastName)}
        </div>
        {member.isPrimary && (
          <div className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 shadow-sm dark:bg-amber-500">
            <HugeiconsIcon
              icon={StarIcon}
              size={10}
              className="text-background"
              strokeWidth={2.5}
            />
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
          <Badge variant="secondary" className="text-[10px] font-medium">
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

      {/* Actions */}
      {canEdit && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-40 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
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
            <DropdownMenuItem
              onClick={onRemove}
              className="text-destructive focus:text-destructive"
            >
              <HugeiconsIcon icon={Delete01Icon} size={14} className="mr-2" />
              Remove from Team
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
