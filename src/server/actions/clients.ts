"use server";

import { authActionClient } from "@/lib/safe-action";
import { createClientSchema, updateClientSchema } from "@/lib/validators/clients";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { clients, providers } from "@/server/db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";

const WRITE_ROLES = ["owner", "admin", "bcba"];

export const createClient = authActionClient
  .schema(createClientSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    if (parsedInput.assignedBcbaId) {
      const [bcba] = await db
        .select({ id: providers.id })
        .from(providers)
        .where(
          and(
            eq(providers.id, parsedInput.assignedBcbaId),
            eq(providers.organizationId, ctx.organizationId),
            isNull(providers.deletedAt),
            inArray(providers.credentialType, ["bcba", "bcba_d"]),
            eq(providers.isActive, true),
          ),
        )
        .limit(1);
      if (!bcba) {
        throw new Error("BCBA not found");
      }
    }

    // Auto-set intakeDate to today if status is not "inquiry" and no intake date provided
    const intakeDate =
      parsedInput.intakeDate ??
      (parsedInput.status !== "inquiry" ? new Date().toISOString().split("T")[0] : undefined);

    const [client] = await db
      .insert(clients)
      .values({
        ...stripUndefined(parsedInput),
        intakeDate,
        organizationId: ctx.organizationId,
      })
      .returning();

    revalidatePath("/clients");
    return { success: true as const, data: client };
  });

export const updateClient = authActionClient
  .schema(updateClientSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const { id, ...updates } = parsedInput;

    const [existing] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.id, id),
          eq(clients.organizationId, ctx.organizationId),
          isNull(clients.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Client not found");
    }

    if (updates.assignedBcbaId) {
      const [bcba] = await db
        .select({ id: providers.id })
        .from(providers)
        .where(
          and(
            eq(providers.id, updates.assignedBcbaId),
            eq(providers.organizationId, ctx.organizationId),
            isNull(providers.deletedAt),
            inArray(providers.credentialType, ["bcba", "bcba_d"]),
            eq(providers.isActive, true),
          ),
        )
        .limit(1);
      if (!bcba) {
        throw new Error("BCBA not found");
      }
    }

    const [client] = await db
      .update(clients)
      .set(undefinedToNull(updates) as Partial<typeof clients.$inferInsert>)
      .where(and(eq(clients.id, id), eq(clients.organizationId, ctx.organizationId)))
      .returning();

    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true as const, data: client };
  });

export const deleteClient = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    const [existing] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.id, parsedInput.id),
          eq(clients.organizationId, ctx.organizationId),
          isNull(clients.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Client not found");
    }

    const [client] = await db
      .update(clients)
      .set({ deletedAt: new Date(), status: "archived" })
      .where(and(eq(clients.id, parsedInput.id), eq(clients.organizationId, ctx.organizationId)))
      .returning();

    revalidatePath("/clients");
    return { success: true as const, data: client };
  });
