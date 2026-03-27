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
          <DropdownMenuItem onClick={onRemove} className="text-destructive focus:text-destructive">
            <HugeiconsIcon icon={Delete01Icon} size={14} className="mr-2" />
            Remove from Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Add Team Member Dialog ────────────────────────────────────────────────────
// Single purpose: search and add providers. Managing (primary, remove) happens
// on the main tab — not in this dialog.

function AddTeamMemberDialog({
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

  // Filter by search
  const filtered = search
    ? availableProviders.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
          (CREDENTIAL_LABELS[p.credentialType as CredentialType] ?? p.credentialType)
            .toLowerCase()
            .includes(search.toLowerCase()),
      )
    : availableProviders;

  // Group by credential tier
  const supervisors = filtered.filter((p) =>
    ["bcba", "bcba_d", "bcaba"].includes(p.credentialType),
  );
  const technicians = filtered.filter(
    (p) => !["bcba", "bcba_d", "bcaba"].includes(p.credentialType),
  );

  // Already on team set for quick lookup
  const onTeamIds = new Set(careTeam.map((m) => m.providerId));

  function handleAdd(provider: AvailableProvider) {
    executeAdd({
      clientId,
      providerId: provider.id,
      role: defaultCareTeamRole(provider.credentialType),
      isPrimary: false,
    });
  }

  function ProviderRow({ provider }: { provider: AvailableProvider }) {
    const avatarColor =
      CREDENTIAL_AVATAR[provider.credentialType] ?? CREDENTIAL_AVATAR.other;
    const alreadyAdded = onTeamIds.has(provider.id);

    return (
      <button
        type="button"
        disabled={isAdding || alreadyAdded}
        onClick={() => handleAdd(provider)}
        className="hover:bg-accent/40 flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors disabled:cursor-default disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${avatarColor}`}
        >
          {getInitials(provider.firstName, provider.lastName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium">
            {provider.firstName} {provider.lastName}
          </div>
          <div className="text-muted-foreground text-xs">
            {CREDENTIAL_LABELS[provider.credentialType as CredentialType] ??
              provider.credentialType.toUpperCase()}
          </div>
        </div>
        {alreadyAdded ? (
          <span className="text-muted-foreground shrink-0 text-xs">On team</span>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 text-xs"
            disabled={isAdding}
            tabIndex={-1}
          >
            <HugeiconsIcon icon={Add01Icon} size={12} className="mr-1" />
            Add
          </Button>
        )}
      </button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSearch(""); }}>
      <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="space-y-1 px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">Add Team Member</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Select a provider to add to this client&apos;s care team.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="px-5 pt-3 pb-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              strokeWidth={1.5}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />
            <Input
              placeholder="Search by name or credential..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-lg pl-9 text-sm"
              autoFocus
            />
          </div>
        </div>

        {/* Provider list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length > 0 ? (
            <>
              {supervisors.length > 0 && (
                <div>
                  <div className="sticky top-0 z-10 flex items-center gap-2 bg-background px-4 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      BCBAs & Supervisors
                    </span>
                  </div>
                  {supervisors.map((p) => (
                    <ProviderRow key={p.id} provider={p} />
                  ))}
                </div>
              )}
              {technicians.length > 0 && (
                <div>
                  <div className="sticky top-0 z-10 flex items-center gap-2 bg-background px-4 py-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      RBTs & Technicians
                    </span>
                  </div>
                  {technicians.map((p) => (
                    <ProviderRow key={p.id} provider={p} />
                  ))}
                </div>
              )}
            </>
          ) : availableProviders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="bg-muted mb-3 flex h-10 w-10 items-center justify-center rounded-full">
                <HugeiconsIcon icon={UserIcon} size={20} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">All providers assigned</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Every active provider is already on this care team.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-muted-foreground text-sm">No providers match &ldquo;{search}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border/40 border-t px-5 py-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
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
            Add Member
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
        <AddTeamMemberDialog
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
