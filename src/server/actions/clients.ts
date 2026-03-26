"use server";

import { authActionClient } from "@/lib/safe-action";
import { createClientSchema, updateClientSchema } from "@/lib/validators/clients";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { clients, providers, authorizations } from "@/server/db/schema";
import { eq, and, isNull, inArray } from "drizzle-orm";
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
        throw new NotFoundError("BCBA");
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
        throw new NotFoundError("BCBA");
      }
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
      throw new NotFoundError("Client");
    }

    const [client] = await db
      .update(clients)
      .set({ deletedAt: new Date(), status: "archived" })
      .where(and(eq(clients.id, parsedInput.id), eq(clients.organizationId, ctx.organizationId)))
      .returning();

    // Also soft-delete the client's active authorizations to prevent
    // phantom alerts on the dashboard from archived clients
    await db
      .update(authorizations)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(authorizations.clientId, parsedInput.id),
          eq(authorizations.organizationId, ctx.organizationId),
          isNull(authorizations.deletedAt),
        ),
      );

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
