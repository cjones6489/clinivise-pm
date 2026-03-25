"use server";

import { authActionClient } from "@/lib/safe-action";
import { createProviderSchema, updateProviderSchema } from "@/lib/validators/providers";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { providers } from "@/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CREDENTIAL_MODIFIERS } from "@/lib/constants";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";

export const createProvider = authActionClient
  .schema(createProviderSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "providers.write");

    // Validate supervisorId exists in the same org if provided
    if (parsedInput.supervisorId) {
      const [supervisor] = await db
        .select({ id: providers.id })
        .from(providers)
        .where(
          and(
            eq(providers.id, parsedInput.supervisorId),
            eq(providers.organizationId, ctx.organizationId),
            isNull(providers.deletedAt),
          ),
        )
        .limit(1);
      if (!supervisor) {
        throw new Error("Supervisor not found");
      }
    }

    const modifierCode = CREDENTIAL_MODIFIERS[parsedInput.credentialType] ?? null;

    const [provider] = await db
      .insert(providers)
      .values({
        ...stripUndefined(parsedInput),
        organizationId: ctx.organizationId,
        modifierCode,
      })
      .returning();

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "provider",
      entityId: provider?.id,
    });

    revalidatePath("/providers");
    return { success: true as const, data: provider };
  });

export const updateProvider = authActionClient
  .schema(updateProviderSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "providers.write");

    const { id, updatedAt, ...updates } = parsedInput;

    // Verify ownership
    const [existing] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(
        and(
          eq(providers.id, id),
          eq(providers.organizationId, ctx.organizationId),
          isNull(providers.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Provider not found");
    }

    // Validate supervisorId exists in the same org if provided
    if (updates.supervisorId) {
      const [supervisor] = await db
        .select({ id: providers.id })
        .from(providers)
        .where(
          and(
            eq(providers.id, updates.supervisorId),
            eq(providers.organizationId, ctx.organizationId),
            isNull(providers.deletedAt),
          ),
        )
        .limit(1);
      if (!supervisor) {
        throw new Error("Supervisor not found");
      }
    }

    // Auto-update modifierCode if credentialType changed
    const modifierUpdate = updates.credentialType
      ? { modifierCode: CREDENTIAL_MODIFIERS[updates.credentialType] ?? null }
      : {};

    const [provider] = await db
      .update(providers)
      .set({
        ...undefinedToNull(updates),
        ...modifierUpdate,
      } as Partial<typeof providers.$inferInsert>)
      .where(
        and(
          eq(providers.id, id),
          eq(providers.organizationId, ctx.organizationId),
          eq(providers.updatedAt, new Date(updatedAt)),
        ),
      )
      .returning();

    if (!provider) {
      throw new Error("Record was modified by another user. Please refresh and try again.");
    }

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "provider",
      entityId: id,
    });

    revalidatePath("/providers");
    revalidatePath(`/providers/${id}`);
    return { success: true as const, data: provider };
  });

export const deleteProvider = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "providers.write");

    // Verify ownership
    const [existing] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(
        and(
          eq(providers.id, parsedInput.id),
          eq(providers.organizationId, ctx.organizationId),
          isNull(providers.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Provider not found");
    }

    const [provider] = await db
      .update(providers)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(providers.id, parsedInput.id), eq(providers.organizationId, ctx.organizationId)),
      )
      .returning();

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "archive",
      entityType: "provider",
      entityId: parsedInput.id,
    });

    revalidatePath("/providers");
    return { success: true as const, data: provider };
  });
