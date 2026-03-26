"use server";

import { authActionClient } from "@/lib/safe-action";
import { createClientSchema, updateClientSchema } from "@/lib/validators/clients";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { clients, authorizations, clientProviders } from "@/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { NotFoundError, StaleDataError } from "@/lib/errors";
import { z } from "zod/v4";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";

export const createClient = authActionClient
  .schema(createClientSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

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

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "client",
      entityId: client?.id,
    });

    revalidatePath("/clients");
    return { success: true as const, data: client };
  });

export const updateClient = authActionClient
  .schema(updateClientSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const { id, updatedAt, ...updates } = parsedInput;

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
      throw new NotFoundError("Client");
    }

    const [client] = await db
      .update(clients)
      .set(undefinedToNull(updates) as Partial<typeof clients.$inferInsert>)
      .where(
        and(
          eq(clients.id, id),
          eq(clients.organizationId, ctx.organizationId),
          eq(clients.updatedAt, new Date(updatedAt)),
        ),
      )
      .returning();

    if (!client) {
      throw new StaleDataError();
    }

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "client",
      entityId: id,
    });

    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true as const, data: client };
  });

export const deleteClient = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    // Atomic: archive client + cascade to their active authorizations
    const client = await db.transaction(async (tx) => {
      const [archived] = await tx
        .update(clients)
        .set({ deletedAt: new Date(), status: "archived" })
        .where(
          and(
            eq(clients.id, parsedInput.id),
            eq(clients.organizationId, ctx.organizationId),
            isNull(clients.deletedAt),
          ),
        )
        .returning();

      if (!archived) throw new NotFoundError("Client");

      // Cascade: soft-delete active authorizations to prevent phantom dashboard alerts
      await tx
        .update(authorizations)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(authorizations.clientId, parsedInput.id),
            eq(authorizations.organizationId, ctx.organizationId),
            isNull(authorizations.deletedAt),
          ),
        );

      // Cascade: end all active care team assignments
      await tx
        .update(clientProviders)
        .set({ endDate: new Date().toISOString().slice(0, 10) })
        .where(
          and(
            eq(clientProviders.clientId, parsedInput.id),
            eq(clientProviders.organizationId, ctx.organizationId),
            isNull(clientProviders.endDate),
          ),
        );

      return archived;
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "archive",
      entityType: "client",
      entityId: parsedInput.id,
      metadata: { cascadeAuthArchive: true },
    });

    revalidatePath("/clients");
    revalidatePath("/authorizations");
    revalidatePath("/overview");
    return { success: true as const, data: client };
  });
