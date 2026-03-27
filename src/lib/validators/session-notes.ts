import { z } from "zod/v4";
import {
  GOAL_PROGRESS_STATUSES,
  MEASUREMENT_TYPES,
  PROMPT_LEVELS,
  BEHAVIOR_INTENSITIES,
  type NoteType,
} from "@/lib/constants";

const optionalText = z
  .string()
  .max(10000)
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

// ── Shared note field shapes ─────────────────────────────────────────────────

const universalNoteFields = {
  othersPresent: optionalText,
  subjectiveNotes: optionalText,
  clientPresentation: optionalText,
  sessionNarrative: optionalText,
  barriersToPerformance: optionalText,
  caregiverCommunication: optionalText,
  planNextSession: optionalText,
};

const modificationFields = {
  modificationRationale: optionalText,
  modificationDescription: optionalText,
  clientResponseToModification: optionalText,
  updatedProtocol: optionalText,
};

const caregiverFields = {
  caregiverName: optionalText,
  caregiverRelationship: optionalText,
  clientPresent: z.boolean().optional(),
  trainingObjectives: optionalText,
  teachingMethod: optionalText,
  caregiverCompetency: optionalText,
  generalizationPlan: optionalText,
  homeworkAssigned: optionalText,
};

const assessmentFields = {
  assessmentToolsUsed: z.array(z.string()).optional(),
  faceToFaceMinutes: z.coerce.number().int().min(0).optional(),
  nonFaceToFaceMinutes: z.coerce.number().int().min(0).optional(),
  caregiverParticipated: z.boolean().optional(),
  findingsSummary: optionalText,
  recommendations: optionalText,
};

// ── Session Note Signature & Delete ──────────────────────────────────────────

export const signSessionNoteSchema = z.object({
  id: z.string().min(1),
});

export const deleteSessionNoteSchema = z.object({
  id: z.string().min(1),
});

// ── Bulk Save (note + goals + behaviors in one transaction) ──────────────────

const goalDataFields = {
  goalId: z
    .string()
    .min(1)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  goalName: z.string().trim().min(1, "Goal name is required").max(500),
  procedure: optionalText,
  measurementType: z.enum(MEASUREMENT_TYPES).default("discrete_trial"),

  trialsCompleted: z.coerce.number().int().min(0).optional(),
  trialsCorrect: z.coerce.number().int().min(0).optional(),
  percentageCorrect: z.coerce.number().min(0).max(100).optional(),
  frequencyCount: z.coerce.number().int().min(0).optional(),
  durationSeconds: z.coerce.number().int().min(0).optional(),
  ratePerMinute: z.coerce.number().min(0).optional(),
  latencySeconds: z.coerce.number().int().min(0).optional(),
  stepsCompleted: z.coerce.number().int().min(0).optional(),
  stepsTotal: z.coerce.number().int().min(1).optional(),
  probeCorrect: z.coerce.number().int().min(0).optional(),
  probeTotal: z.coerce.number().int().min(0).optional(),
  ratingScaleValue: z.coerce.number().int().min(0).optional(),
  ratingScaleMax: z.coerce.number().int().min(1).optional(),
  intervalsScored: z.coerce.number().int().min(0).optional(),
  intervalsTotal: z.coerce.number().int().min(0).optional(),

  promptLevel: z
    .enum(PROMPT_LEVELS)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  reinforcement: optionalText,
  progressStatus: z.enum(GOAL_PROGRESS_STATUSES).default("not_assessed"),
  notes: optionalText,
};

const behaviorDataFields = {
  behaviorName: z.string().trim().min(1, "Behavior name is required").max(200),
  occurrenceTime: optionalText,
  antecedent: optionalText,
  behaviorDescription: optionalText,
  consequence: optionalText,
  durationSeconds: z.coerce.number().int().min(0).optional(),
  intensity: z
    .enum(BEHAVIOR_INTENSITIES)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  notes: optionalText,
};

export const saveSessionNoteSchema = z.object({
  sessionId: z.string().min(1),

  // Note fields (all optional for draft saves)
  ...universalNoteFields,
  ...modificationFields,
  ...caregiverFields,
  ...assessmentFields,

  // Goals — full replace (send all current goals, server reconciles)
  goals: z
    .array(
      z.object({
        id: z.string().optional(), // Existing goal ID (omit for new)
        ...goalDataFields,
      }),
    )
    .default([]),

  // Behaviors — full replace
  behaviors: z
    .array(
      z.object({
        id: z.string().optional(), // Existing behavior ID (omit for new)
        ...behaviorDataFields,
      }),
    )
    .default([]),
});

export type SaveSessionNoteInput = z.input<typeof saveSessionNoteSchema>;

// ── Sign-readiness validation (CPT-specific minimum fields for audit) ────────
// These are NOT Zod schemas — they're runtime checks run before signing.
// Returns an array of human-readable missing field messages.

type NoteData = Record<string, unknown>;

export function validateSignReadiness(noteType: NoteType, note: NoteData, goalCount: number): string[] {
  const missing: string[] = [];

  // Universal requirements for all CPT codes
  if (!note.sessionNarrative) missing.push("Session narrative is required");
  if (!note.planNextSession) missing.push("Plan for next session is required");

  switch (noteType) {
    case "97153_direct":
      // Direct therapy: must have at least one goal with data
      if (goalCount === 0) missing.push("At least one goal with data is required for direct therapy notes");
      break;

    case "97155_modification":
      if (!note.modificationRationale) missing.push("Modification rationale is required");
      if (!note.modificationDescription) missing.push("Modification description is required");
      break;

    case "97156_caregiver":
      if (!note.caregiverName) missing.push("Caregiver name is required");
      if (!note.trainingObjectives) missing.push("Training objectives are required");
      break;

    case "97151_assessment":
      if (!note.findingsSummary) missing.push("Assessment findings summary is required");
      if (
        !note.assessmentToolsUsed ||
        !Array.isArray(note.assessmentToolsUsed) ||
        note.assessmentToolsUsed.length === 0
      ) {
        missing.push("At least one assessment tool must be specified");
      }
      break;
  }

  return missing;
}
