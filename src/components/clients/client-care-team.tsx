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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

// ── Add Member Popover ───────────────────────────────────────────────────────
// GitHub SelectPanel / Notion person picker pattern.
// Lightweight popover anchored to the trigger button.

function AddMemberPopover({
  clientId,
  availableProviders,
  careTeam,
  children,
}: {
  clientId: string;
  availableProviders: AvailableProvider[];
  careTeam: CareTeamMember[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { execute: executeAdd, isPending: isAdding } = useAction(addToTeam, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to add provider"),
  });

  const onTeamIds = new Set(careTeam.map((m) => m.providerId));

  // Combine available + on-team into one list for display (all org providers)
  const allProviders = [
    ...availableProviders,
    ...careTeam.map((m) => ({
      id: m.providerId,
      firstName: m.providerFirstName,
      lastName: m.providerLastName,
      credentialType: m.credentialType,
    })),
  ];

  // Dedupe by id (in case of overlap)
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

  function ProviderItem({ provider }: { provider: (typeof uniqueProviders)[number] }) {
    const avatarColor = CREDENTIAL_AVATAR[provider.credentialType] ?? CREDENTIAL_AVATAR.other;
    const isOnTeam = onTeamIds.has(provider.id);

    return (
      <button
        type="button"
        disabled={isAdding || isOnTeam}
        onClick={() => handleAdd(provider)}
        className="hover:bg-accent/50 flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors disabled:cursor-default disabled:hover:bg-transparent"
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor}`}
        >
          {getInitials(provider.firstName, provider.lastName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold">
            {provider.firstName} {provider.lastName}
          </div>
          <div className="text-muted-foreground text-[11px]">
            {CREDENTIAL_LABELS[provider.credentialType as CredentialType] ??
              provider.credentialType.toUpperCase()}
          </div>
        </div>
        {isOnTeam ? (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={16}
            className="shrink-0 text-emerald-500"
          />
        ) : (
          <span className="text-primary shrink-0 text-[11px] font-medium">+ Add</span>
        )}
      </button>
    );
  }

  return (
    <Popover open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSearch(""); }}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={4}>
        {/* Search */}
        <div className="p-2">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              strokeWidth={1.5}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2"
            />
            <Input
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 text-xs"
              autoFocus
            />
          </div>
        </div>

        {/* Provider list */}
        <div className="max-h-72 overflow-y-auto">
          {filtered.length > 0 ? (
            <>
              {supervisors.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      BCBAs & Supervisors
                    </span>
                  </div>
                  {supervisors.map((p) => (
                    <ProviderItem key={p.id} provider={p} />
                  ))}
                </>
              )}
              {technicians.length > 0 && (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      RBTs & Technicians
                    </span>
                  </div>
                  {technicians.map((p) => (
                    <ProviderItem key={p.id} provider={p} />
                  ))}
                </>
              )}
            </>
          ) : search ? (
            <div className="text-muted-foreground px-3 py-6 text-center text-xs">
              No providers match &ldquo;{search}&rdquo;
            </div>
          ) : (
            <div className="text-muted-foreground px-3 py-6 text-center text-xs">
              No providers available.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
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
        <AddMemberPopover
          clientId={clientId}
          availableProviders={availableProviders}
          careTeam={careTeam}
        >
          <Button variant="outline" size="sm" className="text-xs">
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
            Add Member
          </Button>
        </AddMemberPopover>
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
            <AddMemberPopover
              clientId={clientId}
              availableProviders={availableProviders}
              careTeam={careTeam}
            >
              <Button size="sm" className="mt-4 text-xs">
                <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
                Add Team Members
              </Button>
            </AddMemberPopover>
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
