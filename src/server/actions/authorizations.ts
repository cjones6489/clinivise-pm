"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createAuthorizationSchema,
  updateAuthorizationSchema,
} from "@/lib/validators/authorizations";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import {
  authorizations,
  authorizationServices,
  sessions,
  clients,
  clientInsurance,
  payers,
} from "@/server/db/schema";
import { eq, and, isNull, notInArray, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { stripUndefined, undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";
import { NotFoundError, StaleDataError, ConflictError } from "@/lib/errors";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function validateForeignKeys(
  orgId: string,
  input: {
    clientId: string;
    payerId: string;
    clientInsuranceId: string;
    previousAuthorizationId?: string;
  },
) {
  const [client] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(
      and(
        eq(clients.id, input.clientId),
        eq(clients.organizationId, orgId),
        isNull(clients.deletedAt),
      ),
    )
    .limit(1);

  if (!client) throw new NotFoundError("Client");

  const [payer] = await db
    .select({ id: payers.id })
    .from(payers)
    .where(
      and(
        eq(payers.id, input.payerId),
        eq(payers.organizationId, orgId),
        eq(payers.isActive, true),
      ),
    )
    .limit(1);

  if (!payer) throw new NotFoundError("Payer");

  const [insurance] = await db
    .select({ id: clientInsurance.id })
    .from(clientInsurance)
    .where(
      and(
        eq(clientInsurance.id, input.clientInsuranceId),
        eq(clientInsurance.organizationId, orgId),
        eq(clientInsurance.clientId, input.clientId),
        isNull(clientInsurance.deletedAt),
      ),
    )
    .limit(1);

  if (!insurance) throw new NotFoundError("Client insurance");

  if (input.previousAuthorizationId) {
    const [prevAuth] = await db
      .select({ id: authorizations.id })
      .from(authorizations)
      .where(
        and(
          eq(authorizations.id, input.previousAuthorizationId),
          eq(authorizations.organizationId, orgId),
          eq(authorizations.clientId, input.clientId),
        ),
      )
      .limit(1);

    if (!prevAuth) throw new NotFoundError("Authorization");
  }
}

// ── Create Authorization ─────────────────────────────────────────────────────

export const createAuthorization = authActionClient
  .schema(createAuthorizationSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "authorizations.write");

    const { services, ...authFields } = parsedInput;

    await validateForeignKeys(ctx.organizationId, authFields);

    const result = await db.transaction(async (tx) => {
      const [auth] = await tx
        .insert(authorizations)
        .values({
          ...stripUndefined(authFields),
          organizationId: ctx.organizationId,
        })
        .returning();

      if (!auth) throw new ConflictError("Failed to create authorization");

      if (services.length > 0) {
        await tx.insert(authorizationServices).values(
          services.map((svc) => {
            const { id: _id, ...svcFields } = svc;
            return {
              ...stripUndefined(svcFields),
              authorizationId: auth.id,
              organizationId: ctx.organizationId,
            };
          }),
        );
      }

      return auth;
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "authorization",
      entityId: result.id,
      metadata: { serviceCount: services.length },
    });

    revalidatePath("/authorizations");
    revalidatePath(`/clients/${parsedInput.clientId}`);
    return { success: true as const, data: result };
  });

// ── Update Authorization ─────────────────────────────────────────────────────

export const updateAuthorization = authActionClient
  .schema(updateAuthorizationSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "authorizations.write");

    const { id, updatedAt, services, ...authFields } = parsedInput;

    // Verify ownership
    const [existing] = await db
      .select({ id: authorizations.id, clientId: authorizations.clientId })
      .from(authorizations)
      .where(
        and(
          eq(authorizations.id, id),
          eq(authorizations.organizationId, ctx.organizationId),
          isNull(authorizations.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) throw new NotFoundError("Authorization");

    // Client cannot be changed after creation — strip it from the update payload
    // and use the existing clientId for FK validation and revalidation
    const { clientId: _submittedClientId, ...updatableFields } = authFields;
    const authFieldsWithLockedClient = { ...updatableFields, clientId: existing.clientId };

    await validateForeignKeys(ctx.organizationId, authFieldsWithLockedClient);

    await db.transaction(async (tx) => {
      // Update the authorization record (undefinedToNull so cleared fields become NULL)
      // clientId is excluded — it's locked to the original value
      const [updatedAuth] = await tx
        .update(authorizations)
        .set(undefinedToNull(updatableFields) as Partial<typeof authorizations.$inferInsert>)
        .where(
          and(
            eq(authorizations.id, id),
            eq(authorizations.organizationId, ctx.organizationId),
            eq(authorizations.updatedAt, new Date(updatedAt)),
          ),
        )
        .returning();

      if (!updatedAuth) {
        throw new StaleDataError();
      }

      // Reconcile service lines: update existing, insert new, delete removed
      const existingIds = services.filter((s) => s.id).map((s) => s.id!);

      // Guard: reject removal of service lines that have ANY linked sessions
      // (not just usedUnits > 0 — cancelled sessions may have reset units to 0
      //  but still reference the service line for audit trail purposes)
      const removedServiceIds = await tx
        .select({ id: authorizationServices.id })
        .from(authorizationServices)
        .where(
          and(
            eq(authorizationServices.authorizationId, id),
            eq(authorizationServices.organizationId, ctx.organizationId),
            ...(existingIds.length > 0 ? [notInArray(authorizationServices.id, existingIds)] : []),
          ),
        );

      if (removedServiceIds.length > 0) {
        const linkedSessions = await tx
          .select({ id: sessions.id })
          .from(sessions)
          .where(
            inArray(
              sessions.authorizationServiceId,
              removedServiceIds.map((r) => r.id),
            ),
          )
          .limit(1);

        if (linkedSessions.length > 0) {
          throw new ConflictError("Cannot remove service lines that have linked sessions");
        }
      }

      // Delete removed service lines (org-scoped for defense-in-depth)
      if (existingIds.length > 0) {
        await tx
          .delete(authorizationServices)
          .where(
            and(
              eq(authorizationServices.authorizationId, id),
              eq(authorizationServices.organizationId, ctx.organizationId),
              notInArray(authorizationServices.id, existingIds),
            ),
          );
      } else {
        // All service lines are new — delete all existing
        await tx
          .delete(authorizationServices)
          .where(
            and(
              eq(authorizationServices.authorizationId, id),
              eq(authorizationServices.organizationId, ctx.organizationId),
            ),
          );
      }

      for (const svc of services) {
        if (svc.id) {
          // Update existing — lock row and validate approvedUnits >= usedUnits
          const { id: svcId, ...svcFields } = svc;

          // Lock the service line to prevent concurrent session logging from
          // reading stale approvedUnits during the update
          const [locked] = await tx
            .select({ usedUnits: authorizationServices.usedUnits })
            .from(authorizationServices)
            .where(
              and(
                eq(authorizationServices.id, svcId),
                eq(authorizationServices.organizationId, ctx.organizationId),
              ),
            )
            .for("update");

          // If reducing approvedUnits, ensure it doesn't go below usedUnits
          if (locked && svcFields.approvedUnits !== undefined && svcFields.approvedUnits < locked.usedUnits) {
            throw new ConflictError(
              `Cannot reduce approved units below used units (${locked.usedUnits} used). Cancel excess sessions first.`,
            );
          }

          await tx
            .update(authorizationServices)
            .set(stripUndefined(svcFields) as Partial<typeof authorizationServices.$inferInsert>)
            .where(
              and(
                eq(authorizationServices.id, svcId),
                eq(authorizationServices.authorizationId, id),
                eq(authorizationServices.organizationId, ctx.organizationId),
              ),
            );
        } else {
          // Insert new service line
          const { id: _id, ...svcFields } = svc;
          await tx.insert(authorizationServices).values({
            ...stripUndefined(svcFields),
            authorizationId: id,
            organizationId: ctx.organizationId,
          });
        }
      }
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "authorization",
      entityId: id,
    });

    revalidatePath("/authorizations");
    revalidatePath(`/authorizations/${id}`);
    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });

// ── Archive Authorization ────────────────────────────────────────────────────

export const archiveAuthorization = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "authorizations.write");

    const [existing] = await db
      .select({ id: authorizations.id, clientId: authorizations.clientId })
      .from(authorizations)
      .where(
        and(
          eq(authorizations.id, parsedInput.id),
          eq(authorizations.organizationId, ctx.organizationId),
          isNull(authorizations.deletedAt),
        ),
      )
      .limit(1);

    if (!existing) throw new NotFoundError("Authorization");

    // Block archiving if there are scheduled or flagged sessions linked to this auth
    // (completed/cancelled/no_show sessions are fine — they're terminal or already processed)
    const [activeSession] = await db
      .select({ id: sessions.id })
      .from(sessions)
      .where(
        and(
          eq(sessions.authorizationId, parsedInput.id),
          eq(sessions.organizationId, ctx.organizationId),
          inArray(sessions.status, ["scheduled", "flagged"]),
        ),
      )
      .limit(1);

    if (activeSession) {
      throw new ConflictError("Cannot archive an authorization with scheduled or flagged sessions. Resolve those sessions first.");
    }

    await db
      .update(authorizations)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(authorizations.id, parsedInput.id),
          eq(authorizations.organizationId, ctx.organizationId),
        ),
      );

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "archive",
      entityType: "authorization",
      entityId: parsedInput.id,
    });

    revalidatePath("/authorizations");
    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });

// ── Fetch Client Insurance Options (for form cascade) ────────────────────────

export const fetchClientInsuranceOptions = authActionClient
  .schema(z.object({ clientId: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "authorizations.read");

    const rows = await db
      .select({
        id: clientInsurance.id,
        payerId: clientInsurance.payerId,
        payerName: payers.name,
        memberId: clientInsurance.memberId,
        priority: clientInsurance.priority,
      })
      .from(clientInsurance)
      .innerJoin(payers, eq(clientInsurance.payerId, payers.id))
      .where(
        and(
          eq(clientInsurance.organizationId, ctx.organizationId),
          eq(clientInsurance.clientId, parsedInput.clientId),
          isNull(clientInsurance.deletedAt),
          eq(clientInsurance.isActive, true),
        ),
      )
      .orderBy(clientInsurance.priority);

    return { success: true as const, data: rows };
  });

// ── Fetch Authorization Options (for previous auth selector) ─────────────────

export const fetchAuthorizationOptions = authActionClient
  .schema(z.object({ clientId: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "authorizations.read");

    const rows = await db
      .select({
        id: authorizations.id,
        authorizationNumber: authorizations.authorizationNumber,
        startDate: authorizations.startDate,
        endDate: authorizations.endDate,
        status: authorizations.status,
      })
      .from(authorizations)
      .where(
        and(
          eq(authorizations.organizationId, ctx.organizationId),
          eq(authorizations.clientId, parsedInput.clientId),
          isNull(authorizations.deletedAt),
        ),
      )
      .orderBy(authorizations.endDate);

    return { success: true as const, data: rows };
  });
