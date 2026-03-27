import "server-only";

import { db } from "@/server/db";
import {
  sessionNotes,
  sessionNoteGoals,
  sessionNoteBehaviors,
  sessions,
  clients,
  providers,
} from "@/server/db/schema";
import { eq, and, asc, desc, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

// ── Aliases ──────────────────────────────────────────────────────────────────

const signerAlias = alias(providers, "signer");
const cosignerAlias = alias(providers, "cosigner");

// ── Types ────────────────────────────────────────────────────────────────────

export type SessionNoteDetail = {
  id: string;
  organizationId: string;
  sessionId: string;
  noteType: string;

  // Universal
  othersPresent: string | null;
  subjectiveNotes: string | null;
  clientPresentation: string | null;
  sessionNarrative: string | null;
  barriersToPerformance: string | null;
  caregiverCommunication: string | null;
  planNextSession: string | null;

  // 97155
  modificationRationale: string | null;
  modificationDescription: string | null;
  clientResponseToModification: string | null;
  updatedProtocol: string | null;

  // 97156
  caregiverName: string | null;
  caregiverRelationship: string | null;
  clientPresent: boolean | null;
  trainingObjectives: string | null;
  teachingMethod: string | null;
  caregiverCompetency: string | null;
  generalizationPlan: string | null;
  homeworkAssigned: string | null;

  // 97151
  assessmentToolsUsed: string[] | null;
  faceToFaceMinutes: number | null;
  nonFaceToFaceMinutes: number | null;
  caregiverParticipated: boolean | null;
  findingsSummary: string | null;
  recommendations: string | null;

  // Signatures
  status: string;
  signedById: string | null;
  signedAt: Date | null;
  signerFirstName: string | null;
  signerLastName: string | null;
  cosignedById: string | null;
  cosignedAt: Date | null;
  cosignerFirstName: string | null;
  cosignerLastName: string | null;

  createdAt: Date;
  updatedAt: Date;

  // Session context
  sessionDate: string;
  cptCode: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  providerId: string;
  providerFirstName: string;
  providerLastName: string;
  providerCredentialType: string;

  // Nested
  goals: SessionNoteGoalRow[];
  behaviors: SessionNoteBehaviorRow[];
};

export type SessionNoteGoalRow = {
  id: string;
  goalId: string | null;
  goalName: string;
  procedure: string | null;
  measurementType: string;
  trialsCompleted: number | null;
  trialsCorrect: number | null;
  percentageCorrect: string | null;
  frequencyCount: number | null;
  durationSeconds: number | null;
  ratePerMinute: string | null;
  latencySeconds: number | null;
  stepsCompleted: number | null;
  stepsTotal: number | null;
  probeCorrect: number | null;
  probeTotal: number | null;
  ratingScaleValue: number | null;
  ratingScaleMax: number | null;
  intervalsScored: number | null;
  intervalsTotal: number | null;
  promptLevel: string | null;
  reinforcement: string | null;
  progressStatus: string;
  notes: string | null;
  sortOrder: number;
};

export type SessionNoteBehaviorRow = {
  id: string;
  behaviorName: string;
  occurrenceTime: string | null;
  antecedent: string | null;
  behaviorDescription: string | null;
  consequence: string | null;
  durationSeconds: number | null;
  intensity: string | null;
  notes: string | null;
  sortOrder: number;
};

/** Summary row for the BCBA review queue and session list badges */
export type SessionNoteListItem = {
  id: string;
  sessionId: string;
  noteType: string;
  status: string;
  signedAt: Date | null;
  cosignedAt: Date | null;
  signerFirstName: string | null;
  signerLastName: string | null;
  createdAt: Date;

  // Session context for the review queue
  sessionDate: string;
  cptCode: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  providerId: string;
  providerFirstName: string;
  providerLastName: string;
  providerCredentialType: string;
};

// ── Queries ──────────────────────────────────────────────────────────────────

/** Get a session note by session ID (the primary lookup — one note per session) */
export async function getSessionNoteBySessionId(
  orgId: string,
  sessionId: string,
): Promise<SessionNoteDetail | null> {
  const [row] = await db
    .select({
      id: sessionNotes.id,
      organizationId: sessionNotes.organizationId,
      sessionId: sessionNotes.sessionId,
      noteType: sessionNotes.noteType,

      othersPresent: sessionNotes.othersPresent,
      subjectiveNotes: sessionNotes.subjectiveNotes,
      clientPresentation: sessionNotes.clientPresentation,
      sessionNarrative: sessionNotes.sessionNarrative,
      barriersToPerformance: sessionNotes.barriersToPerformance,
      caregiverCommunication: sessionNotes.caregiverCommunication,
      planNextSession: sessionNotes.planNextSession,

      modificationRationale: sessionNotes.modificationRationale,
      modificationDescription: sessionNotes.modificationDescription,
      clientResponseToModification: sessionNotes.clientResponseToModification,
      updatedProtocol: sessionNotes.updatedProtocol,

      caregiverName: sessionNotes.caregiverName,
      caregiverRelationship: sessionNotes.caregiverRelationship,
      clientPresent: sessionNotes.clientPresent,
      trainingObjectives: sessionNotes.trainingObjectives,
      teachingMethod: sessionNotes.teachingMethod,
      caregiverCompetency: sessionNotes.caregiverCompetency,
      generalizationPlan: sessionNotes.generalizationPlan,
      homeworkAssigned: sessionNotes.homeworkAssigned,

      assessmentToolsUsed: sessionNotes.assessmentToolsUsed,
      faceToFaceMinutes: sessionNotes.faceToFaceMinutes,
      nonFaceToFaceMinutes: sessionNotes.nonFaceToFaceMinutes,
      caregiverParticipated: sessionNotes.caregiverParticipated,
      findingsSummary: sessionNotes.findingsSummary,
      recommendations: sessionNotes.recommendations,

      status: sessionNotes.status,
      signedById: sessionNotes.signedById,
      signedAt: sessionNotes.signedAt,
      signerFirstName: signerAlias.firstName,
      signerLastName: signerAlias.lastName,
      cosignedById: sessionNotes.cosignedById,
      cosignedAt: sessionNotes.cosignedAt,
      cosignerFirstName: cosignerAlias.firstName,
      cosignerLastName: cosignerAlias.lastName,

      createdAt: sessionNotes.createdAt,
      updatedAt: sessionNotes.updatedAt,

      sessionDate: sessions.sessionDate,
      cptCode: sessions.cptCode,
      clientId: sessions.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      providerId: sessions.providerId,
      providerFirstName: providers.firstName,
      providerLastName: providers.lastName,
      providerCredentialType: providers.credentialType,
    })
    .from(sessionNotes)
    .innerJoin(sessions, eq(sessionNotes.sessionId, sessions.id))
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .leftJoin(signerAlias, eq(sessionNotes.signedById, signerAlias.id))
    .leftJoin(cosignerAlias, eq(sessionNotes.cosignedById, cosignerAlias.id))
    .where(
      and(
        eq(sessionNotes.organizationId, orgId),
        eq(sessionNotes.sessionId, sessionId),
      ),
    )
    .limit(1);

  if (!row) return null;

  // Batch-fetch goals and behaviors
  const [goals, behaviors] = await Promise.all([
    db
      .select({
        id: sessionNoteGoals.id,
        goalId: sessionNoteGoals.goalId,
        goalName: sessionNoteGoals.goalName,
        procedure: sessionNoteGoals.procedure,
        measurementType: sessionNoteGoals.measurementType,
        trialsCompleted: sessionNoteGoals.trialsCompleted,
        trialsCorrect: sessionNoteGoals.trialsCorrect,
        percentageCorrect: sessionNoteGoals.percentageCorrect,
        frequencyCount: sessionNoteGoals.frequencyCount,
        durationSeconds: sessionNoteGoals.durationSeconds,
        ratePerMinute: sessionNoteGoals.ratePerMinute,
        latencySeconds: sessionNoteGoals.latencySeconds,
        stepsCompleted: sessionNoteGoals.stepsCompleted,
        stepsTotal: sessionNoteGoals.stepsTotal,
        probeCorrect: sessionNoteGoals.probeCorrect,
        probeTotal: sessionNoteGoals.probeTotal,
        ratingScaleValue: sessionNoteGoals.ratingScaleValue,
        ratingScaleMax: sessionNoteGoals.ratingScaleMax,
        intervalsScored: sessionNoteGoals.intervalsScored,
        intervalsTotal: sessionNoteGoals.intervalsTotal,
        promptLevel: sessionNoteGoals.promptLevel,
        reinforcement: sessionNoteGoals.reinforcement,
        progressStatus: sessionNoteGoals.progressStatus,
        notes: sessionNoteGoals.notes,
        sortOrder: sessionNoteGoals.sortOrder,
      })
      .from(sessionNoteGoals)
      .where(
        and(
          eq(sessionNoteGoals.organizationId, orgId),
          eq(sessionNoteGoals.sessionNoteId, row.id),
        ),
      )
      .orderBy(asc(sessionNoteGoals.sortOrder)),

    db
      .select({
        id: sessionNoteBehaviors.id,
        behaviorName: sessionNoteBehaviors.behaviorName,
        occurrenceTime: sessionNoteBehaviors.occurrenceTime,
        antecedent: sessionNoteBehaviors.antecedent,
        behaviorDescription: sessionNoteBehaviors.behaviorDescription,
        consequence: sessionNoteBehaviors.consequence,
        durationSeconds: sessionNoteBehaviors.durationSeconds,
        intensity: sessionNoteBehaviors.intensity,
        notes: sessionNoteBehaviors.notes,
        sortOrder: sessionNoteBehaviors.sortOrder,
      })
      .from(sessionNoteBehaviors)
      .where(
        and(
          eq(sessionNoteBehaviors.organizationId, orgId),
          eq(sessionNoteBehaviors.sessionNoteId, row.id),
        ),
      )
      .orderBy(asc(sessionNoteBehaviors.sortOrder)),
  ]);

  return { ...row, goals, behaviors };
}

/** BCBA review queue: notes in "signed" status awaiting cosignature.
 *  Only shows notes where the session provider is NOT a BCBA/BCBA-D
 *  (BCBA-authored notes don't require cosignature). */
export async function getNotesAwaitingCosign(
  orgId: string,
): Promise<SessionNoteListItem[]> {
  return db
    .select({
      id: sessionNotes.id,
      sessionId: sessionNotes.sessionId,
      noteType: sessionNotes.noteType,
      status: sessionNotes.status,
      signedAt: sessionNotes.signedAt,
      cosignedAt: sessionNotes.cosignedAt,
      signerFirstName: signerAlias.firstName,
      signerLastName: signerAlias.lastName,
      createdAt: sessionNotes.createdAt,

      sessionDate: sessions.sessionDate,
      cptCode: sessions.cptCode,
      clientId: sessions.clientId,
      clientFirstName: clients.firstName,
      clientLastName: clients.lastName,
      providerId: sessions.providerId,
      providerFirstName: providers.firstName,
      providerLastName: providers.lastName,
      providerCredentialType: providers.credentialType,
    })
    .from(sessionNotes)
    .innerJoin(sessions, eq(sessionNotes.sessionId, sessions.id))
    .innerJoin(clients, eq(sessions.clientId, clients.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .leftJoin(signerAlias, eq(sessionNotes.signedById, signerAlias.id))
    .where(
      and(
        eq(sessionNotes.organizationId, orgId),
        eq(sessionNotes.status, "signed"),
        // Only notes from non-BCBA providers need cosignature
        sql`${providers.credentialType} NOT IN ('bcba', 'bcba_d')`,
      ),
    )
    .orderBy(asc(sessionNotes.signedAt)); // Oldest first
}

/** Count of unsigned notes for dashboard alert badge */
export async function getUnsignedNoteCount(orgId: string): Promise<{
  draftCount: number;
  awaitingCosignCount: number;
}> {
  const [result] = await db
    .select({
      draftCount: sql<number>`count(*) filter (
        where ${sessionNotes.status} = 'draft'
      )::int`,
      awaitingCosignCount: sql<number>`count(*) filter (
        where ${sessionNotes.status} = 'signed'
        and ${providers.credentialType} not in ('bcba', 'bcba_d')
      )::int`,
    })
    .from(sessionNotes)
    .innerJoin(sessions, eq(sessionNotes.sessionId, sessions.id))
    .innerJoin(providers, eq(sessions.providerId, providers.id))
    .where(eq(sessionNotes.organizationId, orgId));

  return {
    draftCount: result?.draftCount ?? 0,
    awaitingCosignCount: result?.awaitingCosignCount ?? 0,
  };
}

/** Check if a session already has a note (for "Complete Note" button state and detail card) */
export async function sessionHasNote(
  orgId: string,
  sessionId: string,
): Promise<{
  hasNote: boolean;
  noteId: string | null;
  noteStatus: string | null;
  noteType: string | null;
  signedByName: string | null;
  signedAt: Date | null;
  cosignedByName: string | null;
  cosignedAt: Date | null;
}> {
  const [row] = await db
    .select({
      id: sessionNotes.id,
      status: sessionNotes.status,
      noteType: sessionNotes.noteType,
      signedAt: sessionNotes.signedAt,
      cosignedAt: sessionNotes.cosignedAt,
      signerFirstName: signerAlias.firstName,
      signerLastName: signerAlias.lastName,
      cosignerFirstName: cosignerAlias.firstName,
      cosignerLastName: cosignerAlias.lastName,
    })
    .from(sessionNotes)
    .leftJoin(signerAlias, eq(sessionNotes.signedById, signerAlias.id))
    .leftJoin(cosignerAlias, eq(sessionNotes.cosignedById, cosignerAlias.id))
    .where(
      and(
        eq(sessionNotes.organizationId, orgId),
        eq(sessionNotes.sessionId, sessionId),
      ),
    )
    .limit(1);

  if (!row) {
    return {
      hasNote: false,
      noteId: null,
      noteStatus: null,
      noteType: null,
      signedByName: null,
      signedAt: null,
      cosignedByName: null,
      cosignedAt: null,
    };
  }

  const signedByName =
    row.signerFirstName && row.signerLastName
      ? `${row.signerLastName}, ${row.signerFirstName}`
      : null;
  const cosignedByName =
    row.cosignerFirstName && row.cosignerLastName
      ? `${row.cosignerLastName}, ${row.cosignerFirstName}`
      : null;

  return {
    hasNote: true,
    noteId: row.id,
    noteStatus: row.status,
    noteType: row.noteType,
    signedByName,
    signedAt: row.signedAt,
    cosignedByName,
    cosignedAt: row.cosignedAt,
  };
}

/** Batch-check note status for a list of session IDs (for session table badges) */
export async function getSessionNoteStatuses(
  orgId: string,
  sessionIds: string[],
): Promise<Map<string, { noteId: string; status: string }>> {
  if (sessionIds.length === 0) return new Map();

  const rows = await db
    .select({
      sessionId: sessionNotes.sessionId,
      noteId: sessionNotes.id,
      status: sessionNotes.status,
    })
    .from(sessionNotes)
    .where(
      and(
        eq(sessionNotes.organizationId, orgId),
        inArray(sessionNotes.sessionId, sessionIds),
      ),
    );

  const map = new Map<string, { noteId: string; status: string }>();
  for (const row of rows) {
    map.set(row.sessionId, { noteId: row.noteId, status: row.status });
  }
  return map;
}
