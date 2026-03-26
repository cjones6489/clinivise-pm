"use server";

import { z } from "zod/v4";
import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";
import { USER_ROLES } from "@/lib/constants";
import { NotFoundError, ConflictError, ForbiddenError } from "@/lib/errors";
import { idSchema } from "@/lib/validators";

// ── Update Member Role ──────────────────────────────────────────────────────

const updateMemberRoleSchema = z.object({
  memberId: idSchema,
  newRole: z.enum(USER_ROLES),
});

export const updateMemberRole = authActionClient
  .schema(updateMemberRoleSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "settings.write");

    const { memberId, newRole } = parsedInput;

    // Can't change own role
    if (memberId === ctx.userId) {
      throw new ConflictError("You cannot change your own role.");
    }

    // Load target member
    const [member] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, memberId), eq(users.organizationId, ctx.organizationId)))
      .limit(1);

    if (!member) throw new NotFoundError("Team member");

    // Can't demote/change the owner (only one owner allowed)
    if (member.role === "owner") {
      throw new ConflictError("The owner role cannot be changed. Transfer ownership first.");
    }

    // Only owner can assign owner role
    if (newRole === "owner" && ctx.userRole !== "owner") {
      throw new ForbiddenError();
    }

    // Can't assign owner role (there should only be one)
    if (newRole === "owner") {
      throw new ConflictError("Cannot assign owner role. Transfer ownership instead.");
    }

    const oldRole = member.role;

    await db
      .update(users)
      .set({ role: newRole })
      .where(and(eq(users.id, memberId), eq(users.organizationId, ctx.organizationId)));

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "user",
      entityId: memberId,
      metadata: { oldRole, newRole, memberEmail: member.email },
    });

    revalidatePath("/team");
    return { success: true as const };
  });

// ── Invite Member ───────────────────────────────────────────────────────────

const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(USER_ROLES.filter((r) => r !== "owner") as [string, ...string[]]),
});

export const inviteMember = authActionClient
  .schema(inviteMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "settings.write");

    const { email, role } = parsedInput;

    // Check if user already exists in this org
    const [existing] = await db
      .select({ id: users.id, status: users.status })
      .from(users)
      .where(and(eq(users.email, email), eq(users.organizationId, ctx.organizationId)))
      .limit(1);

    if (existing) {
      if (existing.status === "active") {
        throw new ConflictError("This email is already a member of your practice.");
      }
      if (existing.status === "invited") {
        throw new ConflictError("An invitation has already been sent to this email.");
      }
      // If deactivated, reactivate with new role
      await db
        .update(users)
        .set({ role, status: "invited", invitedBy: ctx.userId, invitedAt: new Date() })
        .where(eq(users.id, existing.id));
    } else {
      // Pre-create user row with invited status
      await db.insert(users).values({
        email,
        organizationId: ctx.organizationId,
        role,
        status: "invited",
        invitedBy: ctx.userId,
        invitedAt: new Date(),
      });
    }

    // TODO: Call Clerk org invite API to send email
    // await clerkClient.organizations.createInvitation({
    //   organizationId: ctx.clerkOrgId,
    //   emailAddress: email,
    //   role: "org:member",
    // });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "user",
      entityId: email,
      metadata: { role, action: "invite" },
    });

    revalidatePath("/team");
    return { success: true as const };
  });

// ── Remove Member ───────────────────────────────────────────────────────────

const removeMemberSchema = z.object({
  memberId: idSchema,
});

export const removeMember = authActionClient
  .schema(removeMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "settings.write");

    const { memberId } = parsedInput;

    // Can't remove yourself
    if (memberId === ctx.userId) {
      throw new ConflictError("You cannot remove yourself from the practice.");
    }

    const [member] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, memberId), eq(users.organizationId, ctx.organizationId)))
      .limit(1);

    if (!member) throw new NotFoundError("Team member");

    // Can't remove the owner
    if (member.role === "owner") {
      throw new ConflictError("The practice owner cannot be removed.");
    }

    await db
      .update(users)
      .set({ status: "deactivated", isActive: false })
      .where(and(eq(users.id, memberId), eq(users.organizationId, ctx.organizationId)));

    // TODO: Call Clerk API to revoke org membership
    // await clerkClient.organizations.revokeOrganizationMembership({
    //   organizationId: ctx.clerkOrgId,
    //   userId: member.clerkUserId,
    // });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "delete",
      entityType: "user",
      entityId: memberId,
      metadata: { memberEmail: member.email, memberRole: member.role, action: "deactivate" },
    });

    revalidatePath("/team");
    return { success: true as const };
  });
