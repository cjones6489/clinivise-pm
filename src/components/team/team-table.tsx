"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type { TeamMember } from "@/server/queries/team";
import { updateMemberRole, removeMember } from "@/server/actions/team";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalCircle01Icon } from "@hugeicons/core-free-icons";
import { CREDENTIAL_LABELS, type CredentialType } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROLE_BADGE_COLORS: Record<string, string> = {
  owner: "bg-primary/10 text-primary border-primary/20",
  admin:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
  bcba: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  bcaba:
    "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-800",
  rbt: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  billing_staff:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800",
};

const STATUS_STYLES: Record<string, string> = {
  active: "text-emerald-600 dark:text-emerald-400",
  invited: "text-amber-600 dark:text-amber-400",
  deactivated: "text-muted-foreground",
};

const ASSIGNABLE_ROLES = USER_ROLES.filter((r) => r !== "owner") as UserRole[];

export function TeamTable({
  members,
  currentUserId,
  canManage,
}: {
  members: TeamMember[];
  currentUserId: string;
  canManage: boolean;
}) {
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);

  const { execute: executeRoleChange } = useAction(updateMemberRole, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Role updated");
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update role");
    },
  });

  const { executeAsync: executeRemove } = useAction(removeMember, {
    onSuccess: ({ data }) => {
      if (data?.success) toast.success("Member removed");
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to remove member");
    },
  });

  return (
    <>
      <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        {/* Header */}
        <div className="border-border bg-muted/50 hidden grid-cols-[2fr_2fr_1fr_0.8fr_40px] gap-2 border-b px-4 py-2 sm:grid">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Name
          </span>
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Email
          </span>
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Role
          </span>
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Status
          </span>
          <span />
        </div>

        {/* Rows */}
        {members.map((member) => {
          const isOwner = member.role === "owner";
          const isSelf = member.id === currentUserId;
          const canChangeRole = canManage && !isOwner && !isSelf;
          const canRemove = canManage && !isOwner && !isSelf;
          const credLabel = member.credentialType
            ? CREDENTIAL_LABELS[member.credentialType as CredentialType]
            : null;

          return (
            <div
              key={member.id}
              className="border-border/40 grid grid-cols-1 gap-2 border-b px-4 py-2.5 last:border-0 sm:grid-cols-[2fr_2fr_1fr_0.8fr_40px] sm:items-center"
            >
              {/* Name + credential */}
              <div>
                <div className="text-xs font-medium">
                  {member.firstName && member.lastName
                    ? `${member.firstName} ${member.lastName}`
                    : member.email.split("@")[0]}
                  {isSelf && <span className="text-muted-foreground ml-1">(you)</span>}
                </div>
                {credLabel && <div className="text-muted-foreground text-[11px]">{credLabel}</div>}
              </div>

              {/* Email */}
              <div className="text-muted-foreground truncate text-xs">{member.email}</div>

              {/* Role */}
              <div>
                {canChangeRole ? (
                  <Select
                    value={member.role}
                    onValueChange={(newRole) =>
                      executeRoleChange({ memberId: member.id, newRole: newRole as UserRole })
                    }
                  >
                    <SelectTrigger className="h-7 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNABLE_ROLES.map((role) => (
                        <SelectItem key={role} value={role} className="text-xs">
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", ROLE_BADGE_COLORS[member.role] ?? "")}
                  >
                    {ROLE_LABELS[member.role as UserRole] ?? member.role}
                  </Badge>
                )}
              </div>

              {/* Status */}
              <div>
                <span
                  className={cn(
                    "text-xs font-medium capitalize",
                    STATUS_STYLES[member.status] ?? "",
                  )}
                >
                  {member.status}
                </span>
              </div>

              {/* Actions */}
              <div>
                {canRemove && (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <div onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setRemoveTarget(member)}
                          className="text-destructive focus:text-destructive"
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {members.length === 0 && (
          <div className="text-muted-foreground px-4 py-8 text-center text-xs">
            No team members yet. Invite your first team member to get started.
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(open) => {
          if (!open) setRemoveTarget(null);
        }}
        title="Remove team member"
        description={
          removeTarget
            ? `Are you sure you want to remove ${removeTarget.firstName ?? removeTarget.email} from the practice? They will lose access to all practice data.`
            : ""
        }
        onConfirm={async () => {
          if (removeTarget) await executeRemove({ memberId: removeTarget.id });
        }}
        variant="destructive"
        confirmLabel="Remove Member"
      />
    </>
  );
}
