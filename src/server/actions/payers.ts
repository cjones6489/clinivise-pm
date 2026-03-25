"use server";

import { authActionClient } from "@/lib/safe-action";
import { createPayerSchema, updatePayerSchema } from "@/lib/validators/payers";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { payers, clientInsurance } from "@/server/db/schema";
import { eq, and, isNull, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { NotFoundError, StaleDataError, ConflictError } from "@/lib/errors";
import { z } from "zod/v4";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";

export const createPayer = authActionClient
  .schema(createPayerSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "payers.write");

    const [payer] = await db
      .insert(payers)
      .values({
        ...stripUndefined(parsedInput),
        organizationId: ctx.organizationId,
      })
      .returning();

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "payer",
      entityId: payer?.id,
    });

    revalidatePath("/settings");
    return { success: true as const, data: payer };
  });

export const updatePayer = authActionClient
  .schema(updatePayerSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "payers.write");

    const { id, updatedAt, ...updates } = parsedInput;

    // Verify ownership
    const [existing] = await db
      .select({ id: payers.id })
      .from(payers)
      .where(and(eq(payers.id, id), eq(payers.organizationId, ctx.organizationId)))
      .limit(1);

    if (!existing) {
      throw new NotFoundError("Payer");
    }

    const [payer] = await db
      .update(payers)
      .set(undefinedToNull(updates) as Partial<typeof payers.$inferInsert>)
      .where(
        and(
          eq(payers.id, id),
          eq(payers.organizationId, ctx.organizationId),
          eq(payers.updatedAt, new Date(updatedAt)),
        ),
      )
      .returning();

    if (!payer) {
      throw new StaleDataError();
    }

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "payer",
      entityId: id,
    });

    revalidatePath("/settings");
    return { success: true as const, data: payer };
  });

export const deletePayer = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "payers.write");

    // Verify ownership
    const [existing] = await db
      .select({ id: payers.id })
      .from(payers)
      .where(and(eq(payers.id, parsedInput.id), eq(payers.organizationId, ctx.organizationId)))
      .limit(1);

    if (!existing) {
      throw new NotFoundError("Payer");
    }

    // Check for active insurance policies referencing this payer (org-scoped)
    const countResult = await db
      .select({ activeCount: count() })
      .from(clientInsurance)
      .where(
        and(
          eq(clientInsurance.payerId, parsedInput.id),
          eq(clientInsurance.organizationId, ctx.organizationId),
          isNull(clientInsurance.deletedAt),
        ),
      );

    if ((countResult[0]?.activeCount ?? 0) > 0) {
      throw new ConflictError("Cannot delete payer with active insurance policies");
    }

    // Deactivate rather than hard delete for FK integrity
    await db
      .update(payers)
      .set({ isActive: false })
      .where(and(eq(payers.id, parsedInput.id), eq(payers.organizationId, ctx.organizationId)));

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "deactivate",
      entityType: "payer",
      entityId: parsedInput.id,
    });

    revalidatePath("/settings");
    return { success: true as const };
  });
