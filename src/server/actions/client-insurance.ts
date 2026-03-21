"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createInsuranceSchema,
  updateInsuranceSchema,
  verifyInsuranceSchema,
} from "@/lib/validators/client-insurance";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { clients, clientInsurance, payers } from "@/server/db/schema";
import { eq, and, isNull, count, max, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";

const WRITE_ROLES = ["owner", "admin", "bcba"];

export const createInsurance = authActionClient
  .schema(createInsuranceSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    // Verify client exists in org
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

    if (!client) {
      throw new Error("Client not found");
    }

    // Verify payer exists in org and is active
    const [payer] = await db
      .select({ id: payers.id })
      .from(payers)
      .where(
        and(
          eq(payers.id, parsedInput.payerId),
          eq(payers.organizationId, ctx.organizationId),
          eq(payers.isActive, true),
        ),
      )
      .limit(1);

    if (!payer) {
      throw new Error("Payer not found");
    }

    // Auto-calculate next priority in a transaction to prevent races
    const insurance = await db.transaction(async (tx) => {
      const [capacityRow, maxRow] = await Promise.all([
        tx
          .select({ activeCount: count() })
          .from(clientInsurance)
          .where(
            and(
              eq(clientInsurance.clientId, parsedInput.clientId),
              eq(clientInsurance.organizationId, ctx.organizationId),
              isNull(clientInsurance.deletedAt),
            ),
          )
          .then((r) => r[0]),
        tx
          .select({ maxPriority: max(clientInsurance.priority) })
          .from(clientInsurance)
          .where(
            and(
              eq(clientInsurance.clientId, parsedInput.clientId),
              eq(clientInsurance.organizationId, ctx.organizationId),
              isNull(clientInsurance.deletedAt),
            ),
          )
          .then((r) => r[0]),
      ]);

      const activeCount = capacityRow?.activeCount ?? 0;
      if (activeCount >= 3) {
        throw new Error("Maximum of 3 insurance policies allowed");
      }
      // Use MAX to avoid colliding with surviving non-contiguous priorities
      const nextPriority = (maxRow?.maxPriority ?? 0) + 1;

      const [created] = await tx
        .insert(clientInsurance)
        .values({
          ...stripUndefined(parsedInput),
          priority: nextPriority,
          organizationId: ctx.organizationId,
        })
        .returning();

      return created;
    });

    revalidatePath(`/clients/${parsedInput.clientId}`);
    return { success: true as const, data: insurance };
  });

export const updateInsurance = authActionClient
  .schema(updateInsuranceSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const { id, clientId: _clientId, ...updates } = parsedInput;

    // Verify ownership
    const [existing] = await db
      .select({
        id: clientInsurance.id,
        clientId: clientInsurance.clientId,
        payerId: clientInsurance.payerId,
        priority: clientInsurance.priority,
      })
      .from(clientInsurance)
      .where(
        and(
          eq(clientInsurance.id, id),
          eq(clientInsurance.organizationId, ctx.organizationId),
          isNull(clientInsurance.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Insurance policy not found");
    }

    // If payerId changed, verify new payer exists in org
    if (updates.payerId && updates.payerId !== existing.payerId) {
      const [payer] = await db
        .select({ id: payers.id })
        .from(payers)
        .where(
          and(
            eq(payers.id, updates.payerId),
            eq(payers.organizationId, ctx.organizationId),
            eq(payers.isActive, true),
          ),
        )
        .limit(1);

      if (!payer) {
        throw new Error("Payer not found");
      }
    }

    // If priority changed, swap with the displaced policy in a transaction
    if (updates.priority !== undefined && updates.priority !== existing.priority) {
      await db.transaction(async (tx) => {
        const [displaced] = await tx
          .select({ id: clientInsurance.id })
          .from(clientInsurance)
          .where(
            and(
              eq(clientInsurance.clientId, existing.clientId),
              eq(clientInsurance.organizationId, ctx.organizationId),
              eq(clientInsurance.priority, updates.priority!),
              isNull(clientInsurance.deletedAt),
            ),
          )
          .limit(1);

        if (displaced) {
          await tx
            .update(clientInsurance)
            .set({ priority: existing.priority })
            .where(
              and(
                eq(clientInsurance.id, displaced.id),
                eq(clientInsurance.organizationId, ctx.organizationId),
              ),
            );
        }

        await tx
          .update(clientInsurance)
          .set(undefinedToNull(updates) as Partial<typeof clientInsurance.$inferInsert>)
          .where(
            and(eq(clientInsurance.id, id), eq(clientInsurance.organizationId, ctx.organizationId)),
          );
      });
    } else {
      await db
        .update(clientInsurance)
        .set(undefinedToNull(updates) as Partial<typeof clientInsurance.$inferInsert>)
        .where(
          and(eq(clientInsurance.id, id), eq(clientInsurance.organizationId, ctx.organizationId)),
        );
    }

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });

export const deleteInsurance = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const [existing] = await db
      .select({ id: clientInsurance.id, clientId: clientInsurance.clientId })
      .from(clientInsurance)
      .where(
        and(
          eq(clientInsurance.id, parsedInput.id),
          eq(clientInsurance.organizationId, ctx.organizationId),
          isNull(clientInsurance.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Insurance policy not found");
    }

    await db.transaction(async (tx) => {
      // Soft-delete the policy
      await tx
        .update(clientInsurance)
        .set({ deletedAt: new Date(), isActive: false })
        .where(
          and(
            eq(clientInsurance.id, parsedInput.id),
            eq(clientInsurance.organizationId, ctx.organizationId),
          ),
        );

      // Re-compact surviving priorities to be contiguous (1, 2, ...)
      const surviving = await tx
        .select({ id: clientInsurance.id })
        .from(clientInsurance)
        .where(
          and(
            eq(clientInsurance.clientId, existing.clientId),
            eq(clientInsurance.organizationId, ctx.organizationId),
            isNull(clientInsurance.deletedAt),
          ),
        )
        .orderBy(asc(clientInsurance.priority));

      for (let i = 0; i < surviving.length; i++) {
        await tx
          .update(clientInsurance)
          .set({ priority: i + 1 })
          .where(
            and(
              eq(clientInsurance.id, surviving[i]!.id),
              eq(clientInsurance.organizationId, ctx.organizationId),
            ),
          );
      }
    });

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });

export const verifyInsurance = authActionClient
  .schema(verifyInsuranceSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const [existing] = await db
      .select({
        id: clientInsurance.id,
        clientId: clientInsurance.clientId,
        terminationDate: clientInsurance.terminationDate,
      })
      .from(clientInsurance)
      .where(
        and(
          eq(clientInsurance.id, parsedInput.id),
          eq(clientInsurance.organizationId, ctx.organizationId),
          isNull(clientInsurance.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Insurance policy not found");
    }

    // Reject verifying expired policies
    if (
      parsedInput.verificationStatus === "verified" &&
      existing.terminationDate &&
      new Date(existing.terminationDate) < new Date()
    ) {
      throw new Error("Cannot verify an expired insurance policy");
    }

    const verifiedAt = parsedInput.verificationStatus === "verified" ? new Date() : null;

    await db
      .update(clientInsurance)
      .set({
        verificationStatus: parsedInput.verificationStatus,
        verifiedAt,
      })
      .where(
        and(
          eq(clientInsurance.id, parsedInput.id),
          eq(clientInsurance.organizationId, ctx.organizationId),
        ),
      );

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });
