"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createGoalSchema,
  updateGoalSchema,
  deleteGoalSchema,
  createObjectiveSchema,
  updateObjectiveSchema,
  deleteObjectiveSchema,
} from "@/lib/validators/goals";
import { db } from "@/server/db";
import { clientGoals, clientGoalObjectives, clients, goalDomains } from "@/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";
import { stripUndefined } from "@/lib/utils";

// ── Valid goal status transitions ────────────────────────────────────────────
const VALID_TRANSITIONS: Record<string, string[]> = {
  baseline: ["active", "on_hold", "discontinued"],
  active: ["mastered", "on_hold", "discontinued"],
  mastered: ["maintenance", "active", "on_hold", "discontinued"],
  maintenance: ["generalization", "mastered", "active", "on_hold", "discontinued"],
  generalization: ["met", "maintenance", "active", "on_hold", "discontinued"],
  met: ["active"], // reactivate
  on_hold: ["baseline", "active", "discontinued"],
  discontinued: ["active"], // reactivate
};

// ── Goal CRUD ────────────────────────────────────────────────────────────────

export const createGoal = authActionClient
  .schema(createGoalSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    // Verify client belongs to org
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.id, parsedInput.clientId),
          eq(clients.organizationId, ctx.organizationId),
          isNull(clients.deletedAt),
        ),
      )
      .limit(1);
    if (!client) throw new NotFoundError("Client");

    // Verify domain belongs to this org (prevent cross-org domain injection)
    if (parsedInput.domainId) {
      const [domain] = await db
        .select({ id: goalDomains.id })
        .from(goalDomains)
        .where(
          and(
            eq(goalDomains.id, parsedInput.domainId),
            eq(goalDomains.organizationId, ctx.organizationId),
          ),
        )
        .limit(1);
      if (!domain) throw new NotFoundError("Goal domain");
    }

    const [goal] = await db
      .insert(clientGoals)
      .values({
        ...stripUndefined(parsedInput),
        organizationId: ctx.organizationId,
      })
      .returning();

    if (!goal) throw new NotFoundError("Failed to create goal");

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "client_goal",
      entityId: goal.id,
      metadata: { clientId: parsedInput.clientId, title: parsedInput.title },
    });

    revalidatePath(`/clients/${parsedInput.clientId}`);
    return { success: true as const, data: goal };
  });

export const updateGoal = authActionClient
  .schema(updateGoalSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const { id, ...updates } = parsedInput;

    const [existing] = await db
      .select({ id: clientGoals.id, clientId: clientGoals.clientId, status: clientGoals.status })
      .from(clientGoals)
      .where(
        and(
          eq(clientGoals.id, id),
          eq(clientGoals.organizationId, ctx.organizationId),
          isNull(clientGoals.deletedAt),
        ),
      )
      .limit(1);
    if (!existing) throw new NotFoundError("Goal");

    // Validate status transition
    if (updates.status && updates.status !== existing.status) {
      const allowed = VALID_TRANSITIONS[existing.status];
      if (!allowed || !allowed.includes(updates.status)) {
        throw new ConflictError(
          `Cannot transition goal from "${existing.status}" to "${updates.status}".`,
        );
      }
    }

    // Verify domain belongs to this org if changing it
    if (updates.domainId) {
      const [domain] = await db
        .select({ id: goalDomains.id })
        .from(goalDomains)
        .where(
          and(
            eq(goalDomains.id, updates.domainId),
            eq(goalDomains.organizationId, ctx.organizationId),
          ),
        )
        .limit(1);
      if (!domain) throw new NotFoundError("Goal domain");
    }

    // Build update object, only include defined fields
    const setValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) setValues[key] = value ?? null;
    }

    // Auto-set metDate when marking as met, clear when leaving met
    if (updates.status === "met" && existing.status !== "met") {
      setValues.metDate = new Date().toISOString().slice(0, 10);
    } else if (updates.status && updates.status !== "met" && existing.status === "met") {
      setValues.metDate = null;
    }

    if (Object.keys(setValues).length > 0) {
      await db
        .update(clientGoals)
        .set(setValues)
        .where(and(eq(clientGoals.id, id), eq(clientGoals.organizationId, ctx.organizationId)));

      // Cascade status to objectives when goal reaches terminal states
      if (updates.status === "met" || updates.status === "discontinued") {
        await db
          .update(clientGoalObjectives)
          .set({
            status: updates.status,
            ...(updates.status === "met" ? { metDate: new Date().toISOString().slice(0, 10) } : {}),
          })
          .where(
            and(
              eq(clientGoalObjectives.goalId, id),
              eq(clientGoalObjectives.organizationId, ctx.organizationId),
              isNull(clientGoalObjectives.deletedAt),
            ),
          );
      }
    }

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "client_goal",
      entityId: id,
      metadata: { fields: Object.keys(setValues) },
    });

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });

export const deleteGoal = authActionClient
  .schema(deleteGoalSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const [existing] = await db
      .select({ id: clientGoals.id, clientId: clientGoals.clientId })
      .from(clientGoals)
      .where(
        and(
          eq(clientGoals.id, parsedInput.id),
          eq(clientGoals.organizationId, ctx.organizationId),
          isNull(clientGoals.deletedAt),
        ),
      )
      .limit(1);
    if (!existing) throw new NotFoundError("Goal");

    // Soft-delete goal + objectives atomically
    await db.transaction(async (tx) => {
      await tx
        .update(clientGoals)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(clientGoals.id, parsedInput.id),
            eq(clientGoals.organizationId, ctx.organizationId),
          ),
        );

      await tx
        .update(clientGoalObjectives)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(clientGoalObjectives.goalId, parsedInput.id),
            eq(clientGoalObjectives.organizationId, ctx.organizationId),
            isNull(clientGoalObjectives.deletedAt),
          ),
        );
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "delete",
      entityType: "client_goal",
      entityId: parsedInput.id,
      metadata: { clientId: existing.clientId },
    });

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });

// ── Objective CRUD ───────────────────────────────────────────────────────────

export const createObjective = authActionClient
  .schema(createObjectiveSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    // Verify goal belongs to org and is in a state that accepts new objectives
    const [goal] = await db
      .select({ id: clientGoals.id, clientId: clientGoals.clientId, status: clientGoals.status })
      .from(clientGoals)
      .where(
        and(
          eq(clientGoals.id, parsedInput.goalId),
          eq(clientGoals.organizationId, ctx.organizationId),
          isNull(clientGoals.deletedAt),
        ),
      )
      .limit(1);
    if (!goal) throw new NotFoundError("Goal");
    if (goal.status === "met" || goal.status === "discontinued") {
      throw new ConflictError("Cannot add objectives to a goal that is met or discontinued.");
    }

    const [objective] = await db
      .insert(clientGoalObjectives)
      .values({
        organizationId: ctx.organizationId,
        goalId: parsedInput.goalId,
        objectiveNumber: parsedInput.objectiveNumber,
        description: parsedInput.description,
        masteryCriteria: parsedInput.masteryCriteria ?? null,
        dataCollectionType: parsedInput.dataCollectionType ?? null,
        notes: parsedInput.notes ?? null,
      })
      .returning();

    if (!objective) throw new NotFoundError("Failed to create objective");

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "client_goal_objective",
      entityId: objective.id,
      metadata: { goalId: parsedInput.goalId },
    });

    revalidatePath(`/clients/${goal.clientId}`);
    return { success: true as const, data: objective };
  });

export const updateObjective = authActionClient
  .schema(updateObjectiveSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const { id, ...updates } = parsedInput;

    const [existing] = await db
      .select({
        id: clientGoalObjectives.id,
        goalId: clientGoalObjectives.goalId,
      })
      .from(clientGoalObjectives)
      .where(
        and(
          eq(clientGoalObjectives.id, id),
          eq(clientGoalObjectives.organizationId, ctx.organizationId),
          isNull(clientGoalObjectives.deletedAt),
        ),
      )
      .limit(1);
    if (!existing) throw new NotFoundError("Objective");

    const setValues: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) setValues[key] = value ?? null;
    }

    if (Object.keys(setValues).length > 0) {
      await db
        .update(clientGoalObjectives)
        .set(setValues)
        .where(
          and(
            eq(clientGoalObjectives.id, id),
            eq(clientGoalObjectives.organizationId, ctx.organizationId),
          ),
        );
    }

    // Get the client ID for revalidation
    const [goal] = await db
      .select({ clientId: clientGoals.clientId })
      .from(clientGoals)
      .where(
        and(
          eq(clientGoals.id, existing.goalId),
          eq(clientGoals.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "client_goal_objective",
      entityId: id,
      metadata: { goalId: existing.goalId, fields: Object.keys(setValues) },
    });

    if (goal) revalidatePath(`/clients/${goal.clientId}`);
    return { success: true as const };
  });

export const deleteObjective = authActionClient
  .schema(deleteObjectiveSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const [existing] = await db
      .select({
        id: clientGoalObjectives.id,
        goalId: clientGoalObjectives.goalId,
      })
      .from(clientGoalObjectives)
      .where(
        and(
          eq(clientGoalObjectives.id, parsedInput.id),
          eq(clientGoalObjectives.organizationId, ctx.organizationId),
          isNull(clientGoalObjectives.deletedAt),
        ),
      )
      .limit(1);
    if (!existing) throw new NotFoundError("Objective");

    await db
      .update(clientGoalObjectives)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(clientGoalObjectives.id, parsedInput.id),
          eq(clientGoalObjectives.organizationId, ctx.organizationId),
        ),
      );

    const [goal] = await db
      .select({ clientId: clientGoals.clientId })
      .from(clientGoals)
      .where(
        and(
          eq(clientGoals.id, existing.goalId),
          eq(clientGoals.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "delete",
      entityType: "client_goal_objective",
      entityId: parsedInput.id,
      metadata: { goalId: existing.goalId },
    });

    if (goal) revalidatePath(`/clients/${goal.clientId}`);
    return { success: true as const };
  });
