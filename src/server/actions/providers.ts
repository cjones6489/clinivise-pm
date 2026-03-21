"use server";

import { authActionClient } from "@/lib/safe-action";
import { createProviderSchema, updateProviderSchema } from "@/lib/validators/providers";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { providers } from "@/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { CREDENTIAL_MODIFIERS } from "@/lib/constants";
import { undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";

export const createProvider = authActionClient
  .schema(createProviderSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (ctx.userRole !== "owner" && ctx.userRole !== "admin") {
      throw new Error("Forbidden: insufficient role");
    }

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
        ...undefinedToNull(parsedInput),
        organizationId: ctx.organizationId,
        modifierCode,
      })
      .returning();

    revalidatePath("/providers");
    return { success: true as const, data: provider };
  });

export const updateProvider = authActionClient
  .schema(updateProviderSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (ctx.userRole !== "owner" && ctx.userRole !== "admin") {
      throw new Error("Forbidden: insufficient role");
    }

    const { id, ...updates } = parsedInput;

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
      .where(eq(providers.id, id))
      .returning();

    revalidatePath("/providers");
    revalidatePath(`/providers/${id}`);
    return { success: true as const, data: provider };
  });

export const deleteProvider = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    if (ctx.userRole !== "owner" && ctx.userRole !== "admin") {
      throw new Error("Forbidden: insufficient role");
    }

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
      .where(eq(providers.id, parsedInput.id))
      .returning();

    revalidatePath("/providers");
    return { success: true as const, data: provider };
  });
