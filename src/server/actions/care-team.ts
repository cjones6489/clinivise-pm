"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  addToTeamSchema,
  updateTeamMemberSchema,
  removeFromTeamSchema,
} from "@/lib/validators/care-team";
import { db } from "@/server/db";
import { clientProviders, clients, providers } from "@/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NotFoundError, ConflictError } from "@/lib/errors";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";

// ── Add Provider to Care Team ────────────────────────────────────────────────

export const addToTeam = authActionClient
  .schema(addToTeamSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const { clientId, providerId, role, isPrimary } = parsedInput;

    // Verify client belongs to org
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.id, clientId),
          eq(clients.organizationId, ctx.organizationId),
          isNull(clients.deletedAt),
        ),
      )
      .limit(1);
    if (!client) throw new NotFoundError("Client");

    // Verify provider belongs to org and is active
    const [provider] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(
        and(
          eq(providers.id, providerId),
          eq(providers.organizationId, ctx.organizationId),
          isNull(providers.deletedAt),
          eq(providers.isActive, true),
        ),
      )
      .limit(1);
    if (!provider) throw new NotFoundError("Provider");

    // Check for existing active assignment (prevent duplicate)
    const [existing] = await db
      .select({ id: clientProviders.id })
      .from(clientProviders)
      .where(
        and(
          eq(clientProviders.organizationId, ctx.organizationId),
          eq(clientProviders.clientId, clientId),
          eq(clientProviders.providerId, providerId),
          isNull(clientProviders.endDate),
        ),
      )
      .limit(1);
    if (existing) throw new ConflictError("This provider is already on the care team");

    const result = await db.transaction(async (tx) => {
      // If marking as primary, clear existing primary first
      if (isPrimary) {
        await tx
          .update(clientProviders)
          .set({ isPrimary: false })
          .where(
            and(
              eq(clientProviders.organizationId, ctx.organizationId),
              eq(clientProviders.clientId, clientId),
              eq(clientProviders.isPrimary, true),
              isNull(clientProviders.endDate),
            ),
          );
      }

      const [assignment] = await tx
        .insert(clientProviders)
        .values({
          organizationId: ctx.organizationId,
          clientId,
          providerId,
          role,
          isPrimary,
          startDate: new Date().toISOString().slice(0, 10),
        })
        .returning();

      return assignment;
    });

    if (!result) throw new ConflictError("Failed to add provider to care team");

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "client_provider",
      entityId: result.id,
      metadata: { clientId, providerId, role, isPrimary },
    });

    revalidatePath(`/clients/${clientId}`);
    revalidatePath(`/providers/${providerId}`);
    return { success: true as const, data: result };
  });

// ── Update Care Team Member ──────────────────────────────────────────────────

export const updateTeamMember = authActionClient
  .schema(updateTeamMemberSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const { id, role, isPrimary } = parsedInput;

    // Verify assignment belongs to org
    const [existing] = await db
      .select()
      .from(clientProviders)
      .where(
        and(
          eq(clientProviders.id, id),
          eq(clientProviders.organizationId, ctx.organizationId),
          isNull(clientProviders.endDate),
        ),
      )
      .limit(1);
    if (!existing) throw new NotFoundError("Care team assignment");

    await db.transaction(async (tx) => {
      // If setting as primary, clear existing primary first
      if (isPrimary === true) {
        await tx
          .update(clientProviders)
          .set({ isPrimary: false })
          .where(
            and(
              eq(clientProviders.organizationId, ctx.organizationId),
              eq(clientProviders.clientId, existing.clientId),
              eq(clientProviders.isPrimary, true),
              isNull(clientProviders.endDate),
            ),
          );
      }

      const updates: Record<string, unknown> = {};
      if (role !== undefined) updates.role = role;
      if (isPrimary !== undefined) updates.isPrimary = isPrimary;

      if (Object.keys(updates).length > 0) {
        await tx
          .update(clientProviders)
          .set(updates)
          .where(eq(clientProviders.id, id));
      }
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "client_provider",
      entityId: id,
      metadata: { role, isPrimary },
    });

    revalidatePath(`/clients/${existing.clientId}`);
    revalidatePath(`/providers/${existing.providerId}`);
    return { success: true as const };
  });

// ── Remove from Care Team ────────────────────────────────────────────────────

export const removeFromTeam = authActionClient
  .schema(removeFromTeamSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const [existing] = await db
      .select()
      .from(clientProviders)
      .where(
        and(
          eq(clientProviders.id, parsedInput.id),
          eq(clientProviders.organizationId, ctx.organizationId),
          isNull(clientProviders.endDate),
        ),
      )
      .limit(1);
    if (!existing) throw new NotFoundError("Care team assignment");

    // End the assignment (soft remove — preserves history)
    await db
      .update(clientProviders)
      .set({ endDate: new Date().toISOString().slice(0, 10) })
      .where(eq(clientProviders.id, parsedInput.id));

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "delete",
      entityType: "client_provider",
      entityId: parsedInput.id,
      metadata: { clientId: existing.clientId, providerId: existing.providerId },
    });

    revalidatePath(`/clients/${existing.clientId}`);
    revalidatePath(`/providers/${existing.providerId}`);
    return { success: true as const };
  });
