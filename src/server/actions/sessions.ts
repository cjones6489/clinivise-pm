"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createSessionSchema,
  updateSessionSchema,
  cancelSessionSchema,
} from "@/lib/validators/sessions";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import {
  sessions,
  clients,
  providers,
  authorizationServices,
  authorizations,
} from "@/server/db/schema";
import { eq, and, sql, lt, lte, gte, asc, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod/v4";
import { logAudit } from "@/server/audit";
import {
  computeModifierCodes,
  computeActualMinutes,
  isValidStatusTransition,
  computeCreateAccountingOps,
  computeUpdateAccountingOps,
  computeCancelAccountingOps,
} from "@/lib/session-helpers";
import { requirePermission } from "@/lib/permissions";
import { NotFoundError, StaleDataError, ConflictError } from "@/lib/errors";
import { QHP_ONLY_CPT_CODES, CREDENTIAL_LABELS } from "@/lib/constants";
import type { CredentialType } from "@/lib/constants";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function validateSessionForeignKeys(
  orgId: string,
  input: {
    clientId: string;
    providerId: string;
    supervisorId?: string;
    authorizationServiceId?: string;
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

  const [provider] = await db
    .select({
      id: providers.id,
      credentialType: providers.credentialType,
      supervisorId: providers.supervisorId,
      isActive: providers.isActive,
    })
    .from(providers)
    .where(
      and(
        eq(providers.id, input.providerId),
        eq(providers.organizationId, orgId),
        isNull(providers.deletedAt),
      ),
    )
    .limit(1);

  if (!provider) throw new NotFoundError("Provider");
  if (!provider.isActive) throw new ConflictError("Provider not active");

  if (input.supervisorId) {
    const [supervisor] = await db
      .select({ id: providers.id })
      .from(providers)
      .where(
        and(
          eq(providers.id, input.supervisorId),
          eq(providers.organizationId, orgId),
          isNull(providers.deletedAt),
        ),
      )
      .limit(1);

    if (!supervisor) throw new NotFoundError("Supervisor");
  }

  let authorizationId: string | null = null;

  if (input.authorizationServiceId) {
    const [authSvc] = await db
      .select({
        id: authorizationServices.id,
        authorizationId: authorizationServices.authorizationId,
        clientId: authorizations.clientId,
      })
      .from(authorizationServices)
      .innerJoin(authorizations, eq(authorizationServices.authorizationId, authorizations.id))
      .where(
        and(
          eq(authorizationServices.id, input.authorizationServiceId),
          eq(authorizationServices.organizationId, orgId),
        ),
      )
      .limit(1);

    if (!authSvc) throw new NotFoundError("Authorization service");

    // Verify auth belongs to the same client
    if (input.clientId && authSvc.clientId !== input.clientId) {
      throw new NotFoundError("Authorization service");
    }

    authorizationId = authSvc.authorizationId;
  }

  return { provider, authorizationId };
}

/** Block RBTs and BCaBAs from billing QHP-only CPT codes (97151, 97155-97158). */
function validateCptCredential(credentialType: string, cptCode: string) {
  if (
    (credentialType === "rbt" || credentialType === "bcaba") &&
    (QHP_ONLY_CPT_CODES as readonly string[]).includes(cptCode)
  ) {
    const label = CREDENTIAL_LABELS[credentialType as CredentialType] ?? credentialType;
    throw new ConflictError(
      `CPT ${cptCode} requires a qualified healthcare professional (BCBA/BCBA-D). ${label} providers cannot bill this code.`,
    );
  }
}

// ── Create Session ───────────────────────────────────────────────────────────

export const createSession = authActionClient
  .schema(createSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "sessions.write");

    const { provider, authorizationId } = await validateSessionForeignKeys(
      ctx.organizationId,
      parsedInput,
    );

    // Block RBTs/BCaBAs from QHP-only CPT codes
    validateCptCredential(provider.credentialType, parsedInput.cptCode);

    // Auto-set supervisor from provider if RBT and not provided
    let supervisorId = parsedInput.supervisorId ?? null;
    if (
      !supervisorId &&
      (provider.credentialType === "rbt" || provider.credentialType === "bcaba") &&
      provider.supervisorId
    ) {
      supervisorId = provider.supervisorId;
    }

    // Compute modifiers
    const modifierCodes = computeModifierCodes(
      provider.credentialType,
      parsedInput.placeOfService,
      parsedInput.modifierCodes,
    );

    // Compute actual minutes from times
    const { startTimestamp, endTimestamp, actualMinutes } = computeActualMinutes(
      parsedInput.sessionDate,
      parsedInput.startTime,
      parsedInput.endTime,
    );

    // Initial auth context from explicit selection
    let authServiceId = parsedInput.authorizationServiceId ?? null;
    let resolvedAuthId = authorizationId;

    const result = await db.transaction(async (tx) => {
      // FIFO auto-select authorization inside transaction to prevent race conditions
      if (!authServiceId) {
        const [match] = await tx
          .select({
            id: authorizationServices.id,
            authorizationId: authorizationServices.authorizationId,
          })
          .from(authorizationServices)
          .innerJoin(authorizations, eq(authorizationServices.authorizationId, authorizations.id))
          .where(
            and(
              eq(authorizations.organizationId, ctx.organizationId),
              eq(authorizations.clientId, parsedInput.clientId),
              eq(authorizations.status, "approved"),
              isNull(authorizations.deletedAt),
              eq(authorizationServices.cptCode, parsedInput.cptCode),
              lte(authorizations.startDate, parsedInput.sessionDate),
              gte(authorizations.endDate, parsedInput.sessionDate),
              lt(authorizationServices.usedUnits, authorizationServices.approvedUnits),
            ),
          )
          .orderBy(asc(authorizations.endDate))
          .for("update")
          .limit(1);

        if (match) {
          authServiceId = match.id;
          resolvedAuthId = match.authorizationId;
        }
      }

      const accountingOp = computeCreateAccountingOps(
        parsedInput.status,
        authServiceId,
        parsedInput.units,
      );

      // Lock explicitly selected auth service row
      if (accountingOp.type === "increment" && parsedInput.authorizationServiceId) {
        await tx
          .select({ id: authorizationServices.id })
          .from(authorizationServices)
          .where(eq(authorizationServices.id, accountingOp.authServiceId))
          .for("update");
      }

      const [session] = await tx
        .insert(sessions)
        .values({
          organizationId: ctx.organizationId,
          clientId: parsedInput.clientId,
          providerId: parsedInput.providerId,
          supervisorId,
          authorizationId: resolvedAuthId,
          authorizationServiceId: authServiceId,
          sessionDate: parsedInput.sessionDate,
          startTime: startTimestamp,
          endTime: endTimestamp,
          cptCode: parsedInput.cptCode,
          modifierCodes: modifierCodes.length > 0 ? modifierCodes : null,
          units: parsedInput.units,
          actualMinutes,
          unitCalcMethod: "ama",
          placeOfService: parsedInput.placeOfService,
          status: parsedInput.status,
          notes: parsedInput.notes ?? null,
          idempotencyKey: parsedInput.idempotencyKey ?? null,
        })
        .returning();

      if (!session) throw new ConflictError("Failed to create session");

      if (accountingOp.type === "increment") {
        await tx
          .update(authorizationServices)
          .set({
            usedUnits: sql`${authorizationServices.usedUnits} + ${accountingOp.units}`,
          })
          .where(
            and(
              eq(authorizationServices.id, accountingOp.authServiceId),
              eq(authorizationServices.organizationId, ctx.organizationId),
            ),
          );
      }

      return session;
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "create",
      entityType: "session",
      entityId: result.id,
      metadata: {
        cptCode: parsedInput.cptCode,
        units: parsedInput.units,
        status: parsedInput.status,
        authServiceId,
      },
    });

    revalidatePath("/sessions");
    revalidatePath(`/clients/${parsedInput.clientId}`);
    if (resolvedAuthId) revalidatePath(`/authorizations/${resolvedAuthId}`);
    return { success: true as const, data: result };
  });

// ── Update Session ───────────────────────────────────────────────────────────

export const updateSession = authActionClient
  .schema(updateSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "sessions.write");

    const { id, clientId: _submittedClientId, updatedAt, ...inputFields } = parsedInput;

    // Load existing session
    const [existing] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.organizationId, ctx.organizationId)))
      .limit(1);

    if (!existing) throw new NotFoundError("Session");

    // Client cannot be changed after creation — lock to existing value
    const input = { ...inputFields, clientId: existing.clientId };

    // Validate status transition
    if (!isValidStatusTransition(existing.status, input.status)) {
      throw new ConflictError("Invalid status transition");
    }

    const { provider, authorizationId } = await validateSessionForeignKeys(
      ctx.organizationId,
      input,
    );

    // Block RBTs/BCaBAs from QHP-only CPT codes
    validateCptCredential(provider.credentialType, input.cptCode);

    // Auto-set supervisor
    let supervisorId = input.supervisorId ?? null;
    if (
      !supervisorId &&
      (provider.credentialType === "rbt" || provider.credentialType === "bcaba") &&
      provider.supervisorId
    ) {
      supervisorId = provider.supervisorId;
    }

    const modifierCodes = computeModifierCodes(
      provider.credentialType,
      input.placeOfService,
      input.modifierCodes,
    );

    const { startTimestamp, endTimestamp, actualMinutes } = computeActualMinutes(
      input.sessionDate,
      input.startTime,
      input.endTime,
    );

    const newAuthServiceId = input.authorizationServiceId ?? null;
    const resolvedAuthId = authorizationId;

    const { reverse, apply } = computeUpdateAccountingOps(
      existing.status,
      existing.authorizationServiceId,
      existing.units,
      input.status,
      newAuthServiceId,
      input.units,
    );

    await db.transaction(async (tx) => {
      // Lock auth service rows to prevent concurrent over-allocation (ordered by ID to prevent deadlocks)
      const lockIds = [
        reverse.type === "decrement" ? reverse.authServiceId : null,
        apply.type === "increment" ? apply.authServiceId : null,
      ]
        .filter((id): id is string => id !== null)
        .sort();
      for (const lockId of [...new Set(lockIds)]) {
        await tx
          .select({ id: authorizationServices.id })
          .from(authorizationServices)
          .where(eq(authorizationServices.id, lockId))
          .for("update");
      }

      // Step A: REVERSE old units
      if (reverse.type === "decrement") {
        const [reversed] = await tx
          .update(authorizationServices)
          .set({
            usedUnits: sql`${authorizationServices.usedUnits} - ${reverse.units}`,
          })
          .where(
            and(
              eq(authorizationServices.id, reverse.authServiceId),
              eq(authorizationServices.organizationId, ctx.organizationId),
              sql`${authorizationServices.usedUnits} >= ${reverse.units}`,
            ),
          )
          .returning({ id: authorizationServices.id });

        if (!reversed) {
          throw new ConflictError("Cannot reverse more units than are recorded");
        }
      }

      // Step B: APPLY new units
      if (apply.type === "increment") {
        await tx
          .update(authorizationServices)
          .set({
            usedUnits: sql`${authorizationServices.usedUnits} + ${apply.units}`,
          })
          .where(
            and(
              eq(authorizationServices.id, apply.authServiceId),
              eq(authorizationServices.organizationId, ctx.organizationId),
            ),
          );
      }

      // UPDATE session row
      const [updated] = await tx
        .update(sessions)
        .set({
          clientId: input.clientId,
          providerId: input.providerId,
          supervisorId,
          authorizationId: resolvedAuthId,
          authorizationServiceId: newAuthServiceId,
          sessionDate: input.sessionDate,
          startTime: startTimestamp,
          endTime: endTimestamp,
          cptCode: input.cptCode,
          modifierCodes: modifierCodes.length > 0 ? modifierCodes : null,
          units: input.units,
          actualMinutes,
          placeOfService: input.placeOfService,
          status: input.status,
          notes: input.notes ?? null,
        })
        .where(
          and(
            eq(sessions.id, id),
            eq(sessions.organizationId, ctx.organizationId),
            eq(sessions.updatedAt, new Date(updatedAt)),
          ),
        )
        .returning();

      if (!updated) {
        throw new StaleDataError();
      }
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "session",
      entityId: id,
      metadata: {
        oldStatus: existing.status,
        newStatus: input.status,
        oldUnits: existing.units,
        newUnits: input.units,
      },
    });

    revalidatePath("/sessions");
    revalidatePath(`/sessions/${id}`);
    revalidatePath(`/clients/${input.clientId}`);
    if (existing.authorizationId) revalidatePath(`/authorizations/${existing.authorizationId}`);
    if (resolvedAuthId && resolvedAuthId !== existing.authorizationId)
      revalidatePath(`/authorizations/${resolvedAuthId}`);
    return { success: true as const };
  });

// ── Cancel Session ───────────────────────────────────────────────────────────

export const cancelSession = authActionClient
  .schema(cancelSessionSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "sessions.cancel");

    const [existing] = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, parsedInput.id), eq(sessions.organizationId, ctx.organizationId)))
      .limit(1);

    if (!existing) throw new NotFoundError("Session");

    // Validate transition
    if (!isValidStatusTransition(existing.status, "cancelled")) {
      throw new ConflictError("Invalid status transition");
    }

    const cancelOp = computeCancelAccountingOps(
      existing.status,
      existing.authorizationServiceId,
      existing.units,
    );

    await db.transaction(async (tx) => {
      // Lock auth service row to prevent concurrent modification
      if (cancelOp.type === "decrement") {
        await tx
          .select({ id: authorizationServices.id })
          .from(authorizationServices)
          .where(eq(authorizationServices.id, cancelOp.authServiceId))
          .for("update");

        const [reversed] = await tx
          .update(authorizationServices)
          .set({
            usedUnits: sql`${authorizationServices.usedUnits} - ${cancelOp.units}`,
          })
          .where(
            and(
              eq(authorizationServices.id, cancelOp.authServiceId),
              eq(authorizationServices.organizationId, ctx.organizationId),
              sql`${authorizationServices.usedUnits} >= ${cancelOp.units}`,
            ),
          )
          .returning({ id: authorizationServices.id });

        if (!reversed) {
          throw new ConflictError("Cannot reverse more units than are recorded");
        }
      }

      const [cancelledRow] = await tx
        .update(sessions)
        .set({
          status: "cancelled",
          notes: parsedInput.reason
            ? `${existing.notes ? existing.notes + "\n" : ""}Cancellation reason: ${parsedInput.reason}`
            : existing.notes,
        })
        .where(
          and(
            eq(sessions.id, parsedInput.id),
            eq(sessions.organizationId, ctx.organizationId),
            eq(sessions.updatedAt, existing.updatedAt),
          ),
        )
        .returning({ id: sessions.id });

      if (!cancelledRow) {
        throw new StaleDataError();
      }
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "cancel",
      entityType: "session",
      entityId: parsedInput.id,
      metadata: {
        previousStatus: existing.status,
        reason: parsedInput.reason,
      },
    });

    revalidatePath("/sessions");
    revalidatePath(`/sessions/${parsedInput.id}`);
    revalidatePath(`/clients/${existing.clientId}`);
    if (existing.authorizationId) revalidatePath(`/authorizations/${existing.authorizationId}`);
    return { success: true as const };
  });

// ── Fetch Matching Authorizations (for form cascade) ────────────────────────

export const fetchMatchingAuthorizations = authActionClient
  .schema(
    z.object({
      clientId: idSchema,
      cptCode: z.string().min(1),
      sessionDate: z.string().min(1),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const rows = await db
      .select({
        authServiceId: authorizationServices.id,
        authorizationId: authorizations.id,
        authorizationNumber: authorizations.authorizationNumber,
        cptCode: authorizationServices.cptCode,
        approvedUnits: authorizationServices.approvedUnits,
        usedUnits: authorizationServices.usedUnits,
        startDate: authorizations.startDate,
        endDate: authorizations.endDate,
        maxUnitsPerDay: authorizationServices.maxUnitsPerDay,
      })
      .from(authorizationServices)
      .innerJoin(authorizations, eq(authorizationServices.authorizationId, authorizations.id))
      .where(
        and(
          eq(authorizations.organizationId, ctx.organizationId),
          eq(authorizations.clientId, parsedInput.clientId),
          eq(authorizations.status, "approved"),
          isNull(authorizations.deletedAt),
          eq(authorizationServices.cptCode, parsedInput.cptCode),
          lte(authorizations.startDate, parsedInput.sessionDate),
          gte(authorizations.endDate, parsedInput.sessionDate),
          lt(authorizationServices.usedUnits, authorizationServices.approvedUnits),
        ),
      )
      .orderBy(asc(authorizations.endDate));

    const data = rows.map((r) => ({
      ...r,
      remainingUnits: r.approvedUnits - r.usedUnits,
    }));

    return { success: true as const, data };
  });
