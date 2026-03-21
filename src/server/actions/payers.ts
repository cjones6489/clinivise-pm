"use server";

import { authActionClient } from "@/lib/safe-action";
import { createPayerSchema, updatePayerSchema } from "@/lib/validators/payers";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { payers, clientInsurance } from "@/server/db/schema";
import { eq, and, isNull, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";

const ADMIN_ROLES = ["owner", "admin"];

export const createPayer = authActionClient
  .schema(createPayerSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!ADMIN_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const [payer] = await db
      .insert(payers)
      .values({
        ...stripUndefined(parsedInput),
        organizationId: ctx.organizationId,
      })
      .returning();

    revalidatePath("/settings");
    return { success: true as const, data: payer };
  });

export const updatePayer = authActionClient
  .schema(updatePayerSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!ADMIN_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const { id, ...updates } = parsedInput;

    // Verify ownership
    const [existing] = await db
      .select({ id: payers.id })
      .from(payers)
      .where(and(eq(payers.id, id), eq(payers.organizationId, ctx.organizationId)))
      .limit(1);

    if (!existing) {
      throw new Error("Payer not found");
    }

    const [payer] = await db
      .update(payers)
      .set(undefinedToNull(updates) as Partial<typeof payers.$inferInsert>)
      .where(and(eq(payers.id, id), eq(payers.organizationId, ctx.organizationId)))
      .returning();

    revalidatePath("/settings");
    return { success: true as const, data: payer };
  });

export const deletePayer = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    if (!ADMIN_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    // Verify ownership
    const [existing] = await db
      .select({ id: payers.id })
      .from(payers)
      .where(and(eq(payers.id, parsedInput.id), eq(payers.organizationId, ctx.organizationId)))
      .limit(1);

    if (!existing) {
      throw new Error("Payer not found");
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
      throw new Error("Cannot delete payer with active insurance policies");
    }

    // Deactivate rather than hard delete for FK integrity
    await db
      .update(payers)
      .set({ isActive: false })
      .where(and(eq(payers.id, parsedInput.id), eq(payers.organizationId, ctx.organizationId)));

    revalidatePath("/settings");
    return { success: true as const };
  });
