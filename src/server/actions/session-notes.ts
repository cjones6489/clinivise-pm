"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  saveSessionNoteSchema,
  signSessionNoteSchema,
  cosignSessionNoteSchema,
  deleteSessionNoteSchema,
  validateSignReadiness,
} from "@/lib/validators/session-notes";
import { db } from "@/server/db";
import {
  sessionNotes,
  sessionNoteGoals,
  sessionNoteBehaviors,
  sessions,
  providers,
} from "@/server/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";
import { NotFoundError, ConflictError, StaleDataError } from "@/lib/errors";
import { CPT_TO_NOTE_TYPE, SUPERVISOR_CREDENTIAL_TYPES, type NoteType } from "@/lib/constants";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Look up the provider record linked to the current user (via users.id → providers.userId) */
async function getProviderForUser(orgId: string, userId: string) {
  const [provider] = await db
    .select({ id: providers.id, credentialType: providers.credentialType })
    .from(providers)
    .where(
      and(
        eq(providers.organizationId, orgId),
        eq(providers.userId, userId),
      ),
    )
    .limit(1);

  return provider ?? null;
}

async function loadSessionForNote(orgId: string, sessionId: string) {
  const [session] = await db
    .select({
      id: sessions.id,
      clientId: sessions.clientId,
      providerId: sessions.providerId,
      cptCode: sessions.cptCode,
      status: sessions.status,
    })
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), eq(sessions.organizationId, orgId)))
    .limit(1);

  if (!session) throw new NotFoundError("Session");
  if (session.status === "cancelled") {
    throw new ConflictError("Cannot create or edit notes for cancelled sessions");
  }

  return session;
}

async function loadNoteWithOrgCheck(orgId: string, noteId: string) {
  const [note] = await db
    .select()
    .from(sessionNotes)
    .where(and(eq(sessionNotes.id, noteId), eq(sessionNotes.organizationId, orgId)))
    .limit(1);

  if (!note) throw new NotFoundError("Session note");
  return note;
}

function revalidateNotePaths(sessionId: string, clientId: string) {
  revalidatePath(`/sessions/${sessionId}`);
  revalidatePath("/sessions");
  revalidatePath("/notes");
  revalidatePath(`/clients/${clientId}`);
}

// ── Save Session Note (bulk upsert: note + goals + behaviors) ────────────────

export const saveSessionNote = authActionClient
  .schema(saveSessionNoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "notes.write");

    const session = await loadSessionForNote(ctx.organizationId, parsedInput.sessionId);

    // Derive noteType from CPT code — never trust client
    const noteType = CPT_TO_NOTE_TYPE[session.cptCode];
    if (!noteType) {
      throw new ConflictError(`No note template for CPT code ${session.cptCode}`);
    }

    // Check if note already exists for this session
    const [existing] = await db
      .select({ id: sessionNotes.id, status: sessionNotes.status })
      .from(sessionNotes)
      .where(
        and(
          eq(sessionNotes.organizationId, ctx.organizationId),
          eq(sessionNotes.sessionId, parsedInput.sessionId),
        ),
      )
      .limit(1);

    // Cannot edit signed/cosigned notes
    if (existing && existing.status !== "draft") {
      throw new ConflictError("Cannot edit a note that has already been signed");
    }

    const {
      sessionId,
      goals: goalInputs,
      behaviors: behaviorInputs,
      ...noteFields
    } = parsedInput;

    const result = await db.transaction(async (tx) => {
      let noteId: string;

      if (existing) {
        // Update existing draft
        const [updated] = await tx
          .update(sessionNotes)
          .set({
            ...noteFields,
            noteType,
          })
          .where(
            and(
              eq(sessionNotes.id, existing.id),
              eq(sessionNotes.organizationId, ctx.organizationId),
            ),
          )
          .returning({ id: sessionNotes.id });

        if (!updated) throw new StaleDataError();
        noteId = updated.id;
      } else {
        // Create new note
        const [created] = await tx
          .insert(sessionNotes)
          .values({
            organizationId: ctx.organizationId,
            sessionId,
            noteType,
            ...noteFields,
          })
          .returning({ id: sessionNotes.id });

        if (!created) throw new ConflictError("Failed to create session note");
        noteId = created.id;
      }

      // ── Reconcile goals (full replace strategy) ──────────────────────
      // Delete goals not in the input, update existing, insert new

      const existingGoals = await tx
        .select({ id: sessionNoteGoals.id })
        .from(sessionNoteGoals)
        .where(
          and(
            eq(sessionNoteGoals.sessionNoteId, noteId),
            eq(sessionNoteGoals.organizationId, ctx.organizationId),
          ),
        );

      const inputGoalIds = new Set(goalInputs.filter((g) => g.id).map((g) => g.id!));
      const toDeleteGoalIds = existingGoals
        .filter((eg) => !inputGoalIds.has(eg.id))
        .map((eg) => eg.id);

      if (toDeleteGoalIds.length > 0) {
        await tx
          .delete(sessionNoteGoals)
          .where(
            and(
              eq(sessionNoteGoals.organizationId, ctx.organizationId),
              inArray(sessionNoteGoals.id, toDeleteGoalIds),
            ),
          );
      }

      for (let i = 0; i < goalInputs.length; i++) {
        const { id: goalRowId, ...goalData } = goalInputs[i];
        if (goalRowId && inputGoalIds.has(goalRowId)) {
          // Update existing goal
          await tx
            .update(sessionNoteGoals)
            .set({ ...goalData, sortOrder: i })
            .where(
              and(
                eq(sessionNoteGoals.id, goalRowId),
                eq(sessionNoteGoals.organizationId, ctx.organizationId),
              ),
            );
        } else {
          // Insert new goal
          await tx.insert(sessionNoteGoals).values({
            organizationId: ctx.organizationId,
            sessionNoteId: noteId,
            ...goalData,
            sortOrder: i,
          });
        }
      }

      // ── Reconcile behaviors (full replace strategy) ──────────────────

      const existingBehaviors = await tx
        .select({ id: sessionNoteBehaviors.id })
        .from(sessionNoteBehaviors)
        .where(
          and(
            eq(sessionNoteBehaviors.sessionNoteId, noteId),
            eq(sessionNoteBehaviors.organizationId, ctx.organizationId),
          ),
        );

      const inputBehaviorIds = new Set(behaviorInputs.filter((b) => b.id).map((b) => b.id!));
      const toDeleteBehaviorIds = existingBehaviors
        .filter((eb) => !inputBehaviorIds.has(eb.id))
        .map((eb) => eb.id);

      if (toDeleteBehaviorIds.length > 0) {
        await tx
          .delete(sessionNoteBehaviors)
          .where(
            and(
              eq(sessionNoteBehaviors.organizationId, ctx.organizationId),
              inArray(sessionNoteBehaviors.id, toDeleteBehaviorIds),
            ),
          );
      }

      for (let i = 0; i < behaviorInputs.length; i++) {
        const { id: behaviorRowId, ...behaviorData } = behaviorInputs[i];
        if (behaviorRowId && inputBehaviorIds.has(behaviorRowId)) {
          await tx
            .update(sessionNoteBehaviors)
            .set({ ...behaviorData, sortOrder: i })
            .where(
              and(
                eq(sessionNoteBehaviors.id, behaviorRowId),
                eq(sessionNoteBehaviors.organizationId, ctx.organizationId),
              ),
            );
        } else {
          await tx.insert(sessionNoteBehaviors).values({
            organizationId: ctx.organizationId,
            sessionNoteId: noteId,
            ...behaviorData,
            sortOrder: i,
          });
        }
      }

      return noteId;
    });

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: existing ? "update" : "create",
      entityType: "session_note",
      entityId: result,
      metadata: { sessionId, noteType, goalCount: goalInputs.length, behaviorCount: behaviorInputs.length },
    });

    revalidateNotePaths(sessionId, session.clientId);
    return { success: true as const, data: { noteId: result } };
  });

// ── Sign Session Note ────────────────────────────────────────────────────────
// The session provider (or any provider with sign permission) attests
// the note is complete and accurate.

export const signSessionNote = authActionClient
  .schema(signSessionNoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "notes.sign");

    const note = await loadNoteWithOrgCheck(ctx.organizationId, parsedInput.id);

    if (note.status !== "draft") {
      throw new ConflictError("Only draft notes can be signed");
    }

    // Load session to get provider info for sign-readiness check
    const [session] = await db
      .select({
        id: sessions.id,
        clientId: sessions.clientId,
        providerId: sessions.providerId,
      })
      .from(sessions)
      .where(
        and(
          eq(sessions.id, note.sessionId),
          eq(sessions.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);

    if (!session) throw new NotFoundError("Session");

    // Count goals for sign-readiness
    const [goalCountResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessionNoteGoals)
      .where(
        and(
          eq(sessionNoteGoals.sessionNoteId, note.id),
          eq(sessionNoteGoals.organizationId, ctx.organizationId),
        ),
      );

    // Validate CPT-specific minimum fields
    const errors = validateSignReadiness(
      note.noteType as NoteType,
      note as unknown as Record<string, unknown>,
      goalCountResult?.count ?? 0,
    );

    if (errors.length > 0) {
      throw new ConflictError(`Note is not ready to sign: ${errors.join("; ")}`);
    }

    // Look up the provider record for the current user to use as signer
    const signerProvider = await getProviderForUser(ctx.organizationId, ctx.userId);
    if (!signerProvider) {
      throw new ConflictError("You must have a provider profile to sign notes");
    }

    await db
      .update(sessionNotes)
      .set({
        status: "signed",
        signedById: signerProvider.id,
        signedAt: new Date(),
      })
      .where(
        and(
          eq(sessionNotes.id, note.id),
          eq(sessionNotes.organizationId, ctx.organizationId),
          eq(sessionNotes.status, "draft"), // Prevent double-sign race
        ),
      );

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "sign",
      entityType: "session_note",
      entityId: note.id,
      metadata: { sessionId: note.sessionId, signedById: signerProvider.id },
    });

    revalidateNotePaths(note.sessionId, session.clientId);
    return { success: true as const };
  });

// ── Cosign Session Note ──────────────────────────────────────────────────────
// A supervising BCBA reviews and cosigns a note authored by an RBT/BCaBA.
// BCBA-authored notes don't require cosignature.

export const cosignSessionNote = authActionClient
  .schema(cosignSessionNoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "notes.cosign");

    const note = await loadNoteWithOrgCheck(ctx.organizationId, parsedInput.id);

    if (note.status !== "signed") {
      throw new ConflictError("Only signed notes can be co-signed");
    }

    // Load session for revalidation paths
    const [session] = await db
      .select({ id: sessions.id, clientId: sessions.clientId })
      .from(sessions)
      .where(
        and(eq(sessions.id, note.sessionId), eq(sessions.organizationId, ctx.organizationId)),
      )
      .limit(1);

    if (!session) throw new NotFoundError("Session");

    // Verify cosigner is a BCBA/BCBA-D
    const cosignerProvider = await getProviderForUser(ctx.organizationId, ctx.userId);
    if (!cosignerProvider) {
      throw new ConflictError("You must have a provider profile to co-sign notes");
    }

    if (!(SUPERVISOR_CREDENTIAL_TYPES as readonly string[]).includes(cosignerProvider.credentialType)) {
      throw new ConflictError("Only BCBA or BCBA-D providers can co-sign notes");
    }

    // Cannot cosign your own note
    if (cosignerProvider.id === note.signedById) {
      throw new ConflictError("Cannot co-sign a note you already signed");
    }

    await db
      .update(sessionNotes)
      .set({
        status: "cosigned",
        cosignedById: cosignerProvider.id,
        cosignedAt: new Date(),
      })
      .where(
        and(
          eq(sessionNotes.id, note.id),
          eq(sessionNotes.organizationId, ctx.organizationId),
          eq(sessionNotes.status, "signed"), // Prevent race
        ),
      );

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "cosign",
      entityType: "session_note",
      entityId: note.id,
      metadata: { sessionId: note.sessionId, cosignedById: cosignerProvider.id },
    });

    revalidateNotePaths(note.sessionId, session.clientId);
    return { success: true as const };
  });

// ── Delete Session Note (draft only) ─────────────────────────────────────────

export const deleteSessionNote = authActionClient
  .schema(deleteSessionNoteSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "notes.write");

    const note = await loadNoteWithOrgCheck(ctx.organizationId, parsedInput.id);

    if (note.status !== "draft") {
      throw new ConflictError("Only draft notes can be deleted. Signed notes are permanent records.");
    }

    // Load session for revalidation
    const [session] = await db
      .select({ id: sessions.id, clientId: sessions.clientId })
      .from(sessions)
      .where(
        and(eq(sessions.id, note.sessionId), eq(sessions.organizationId, ctx.organizationId)),
      )
      .limit(1);

    // Delete note (cascades to goals + behaviors via FK)
    await db
      .delete(sessionNotes)
      .where(
        and(
          eq(sessionNotes.id, note.id),
          eq(sessionNotes.organizationId, ctx.organizationId),
          eq(sessionNotes.status, "draft"), // Safety: re-check status
        ),
      );

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "delete",
      entityType: "session_note",
      entityId: note.id,
      metadata: { sessionId: note.sessionId },
    });

    if (session) {
      revalidateNotePaths(note.sessionId, session.clientId);
    }

    return { success: true as const };
  });
