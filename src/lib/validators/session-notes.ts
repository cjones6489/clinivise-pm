import { z } from "zod/v4";
import {
  NOTE_TYPES,
  GOAL_PROGRESS_STATUSES,
  MEASUREMENT_TYPES,
  PROMPT_LEVELS,
  BEHAVIOR_INTENSITIES,
} from "@/lib/constants";

const optionalText = z
  .string()
  .max(10000)
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

// ── Session Note CRUD ────────────────────────────────────────────────────────

export const createSessionNoteSchema = z.object({
  sessionId: z.string().min(1),
  noteType: z.enum(NOTE_TYPES),

  // Universal
  othersPresent: optionalText,
  subjectiveNotes: optionalText,
  clientPresentation: optionalText,
  sessionNarrative: optionalText,
  barriersToPerformance: optionalText,
  caregiverCommunication: optionalText,
  planNextSession: optionalText,

  // 97155-specific
  modificationRationale: optionalText,
  modificationDescription: optionalText,
  clientResponseToModification: optionalText,
  updatedProtocol: optionalText,

  // 97156-specific
  caregiverName: optionalText,
  caregiverRelationship: optionalText,
  clientPresent: z.boolean().optional(),
  trainingObjectives: optionalText,
  teachingMethod: optionalText,
  caregiverCompetency: optionalText,
  generalizationPlan: optionalText,
  homeworkAssigned: optionalText,

  // 97151-specific
  assessmentToolsUsed: z.array(z.string()).optional(),
  faceToFaceMinutes: z.coerce.number().int().min(0).optional(),
  nonFaceToFaceMinutes: z.coerce.number().int().min(0).optional(),
  caregiverParticipated: z.boolean().optional(),
  findingsSummary: optionalText,
  recommendations: optionalText,
});

export const updateSessionNoteSchema = z.object({
  id: z.string().min(1),

  // Universal
  othersPresent: optionalText,
  subjectiveNotes: optionalText,
  clientPresentation: optionalText,
  sessionNarrative: optionalText,
  barriersToPerformance: optionalText,
  caregiverCommunication: optionalText,
  planNextSession: optionalText,

  // 97155-specific
  modificationRationale: optionalText,
  modificationDescription: optionalText,
  clientResponseToModification: optionalText,
  updatedProtocol: optionalText,

  // 97156-specific
  caregiverName: optionalText,
  caregiverRelationship: optionalText,
  clientPresent: z.boolean().optional(),
  trainingObjectives: optionalText,
  teachingMethod: optionalText,
  caregiverCompetency: optionalText,
  generalizationPlan: optionalText,
  homeworkAssigned: optionalText,

  // 97151-specific
  assessmentToolsUsed: z.array(z.string()).optional(),
  faceToFaceMinutes: z.coerce.number().int().min(0).optional(),
  nonFaceToFaceMinutes: z.coerce.number().int().min(0).optional(),
  caregiverParticipated: z.boolean().optional(),
  findingsSummary: optionalText,
  recommendations: optionalText,
});

export const signSessionNoteSchema = z.object({
  id: z.string().min(1),
});

export const cosignSessionNoteSchema = z.object({
  id: z.string().min(1),
});

// ── Session Note Goals ───────────────────────────────────────────────────────

export const createNoteGoalSchema = z.object({
  sessionNoteId: z.string().min(1),
  goalId: z.string().min(1).optional().or(z.literal("")).transform((v) => v || undefined),
  goalName: z.string().trim().min(1, "Goal name is required").max(500),
  procedure: optionalText,
  measurementType: z.enum(MEASUREMENT_TYPES).default("discrete_trial"),

  // Discrete trial
  trialsCompleted: z.coerce.number().int().min(0).optional(),
  trialsCorrect: z.coerce.number().int().min(0).optional(),
  percentageCorrect: z.coerce.number().min(0).max(100).optional(),

  // Frequency
  frequencyCount: z.coerce.number().int().min(0).optional(),

  // Duration
  durationSeconds: z.coerce.number().int().min(0).optional(),

  // Rate
  ratePerMinute: z.coerce.number().min(0).optional(),

  // Latency
  latencySeconds: z.coerce.number().int().min(0).optional(),

  // Task analysis
  stepsCompleted: z.coerce.number().int().min(0).optional(),
  stepsTotal: z.coerce.number().int().min(1).optional(),

  // Probe
  probeCorrect: z.coerce.number().int().min(0).optional(),
  probeTotal: z.coerce.number().int().min(0).optional(),

  // Rating scale
  ratingScaleValue: z.coerce.number().int().min(0).optional(),
  ratingScaleMax: z.coerce.number().int().min(1).optional(),

  // Interval recording
  intervalsScored: z.coerce.number().int().min(0).optional(),
  intervalsTotal: z.coerce.number().int().min(0).optional(),

  promptLevel: z.enum(PROMPT_LEVELS).optional().or(z.literal("")).transform((v) => v || undefined),
  reinforcement: optionalText,
  progressStatus: z.enum(GOAL_PROGRESS_STATUSES).default("not_assessed"),
  notes: optionalText,
});

export const updateNoteGoalSchema = z.object({
  id: z.string().min(1),
  goalName: z.string().trim().min(1).max(500).optional(),
  procedure: optionalText,
  measurementType: z.enum(MEASUREMENT_TYPES).optional(),

  // Discrete trial
  trialsCompleted: z.coerce.number().int().min(0).optional(),
  trialsCorrect: z.coerce.number().int().min(0).optional(),
  percentageCorrect: z.coerce.number().min(0).max(100).optional(),

  // Frequency
  frequencyCount: z.coerce.number().int().min(0).optional(),

  // Duration
  durationSeconds: z.coerce.number().int().min(0).optional(),

  // Rate
  ratePerMinute: z.coerce.number().min(0).optional(),

  // Latency
  latencySeconds: z.coerce.number().int().min(0).optional(),

  // Task analysis
  stepsCompleted: z.coerce.number().int().min(0).optional(),
  stepsTotal: z.coerce.number().int().min(1).optional(),

  // Probe
  probeCorrect: z.coerce.number().int().min(0).optional(),
  probeTotal: z.coerce.number().int().min(0).optional(),

  // Rating scale
  ratingScaleValue: z.coerce.number().int().min(0).optional(),
  ratingScaleMax: z.coerce.number().int().min(1).optional(),

  // Interval recording
  intervalsScored: z.coerce.number().int().min(0).optional(),
  intervalsTotal: z.coerce.number().int().min(0).optional(),

  promptLevel: z.enum(PROMPT_LEVELS).optional().or(z.literal("")).transform((v) => v || undefined),
  reinforcement: optionalText,
  progressStatus: z.enum(GOAL_PROGRESS_STATUSES).optional(),
  notes: optionalText,
});

export const deleteNoteGoalSchema = z.object({
  id: z.string().min(1),
});

// ── Session Note Behaviors ───────────────────────────────────────────────────

export const createNoteBehaviorSchema = z.object({
  sessionNoteId: z.string().min(1),
  behaviorName: z.string().trim().min(1, "Behavior name is required").max(200),
  occurrenceTime: optionalText,
  antecedent: optionalText,
  behaviorDescription: optionalText,
  consequence: optionalText,
  durationSeconds: z.coerce.number().int().min(0).optional(),
  intensity: z.enum(BEHAVIOR_INTENSITIES).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: optionalText,
});

export const updateNoteBehaviorSchema = z.object({
  id: z.string().min(1),
  behaviorName: z.string().trim().min(1).max(200).optional(),
  occurrenceTime: optionalText,
  antecedent: optionalText,
  behaviorDescription: optionalText,
  consequence: optionalText,
  durationSeconds: z.coerce.number().int().min(0).optional(),
  intensity: z.enum(BEHAVIOR_INTENSITIES).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: optionalText,
});

export const deleteNoteBehaviorSchema = z.object({
  id: z.string().min(1),
});
