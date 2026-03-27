import { z } from "zod/v4";
import {
  GOAL_TYPES,
  GOAL_STATUSES,
  DATA_COLLECTION_TYPES,
  BEHAVIOR_FUNCTIONS,
  BEHAVIOR_SEVERITIES,
  ASSESSMENT_SOURCES,
} from "@/lib/constants";

const optionalText = z
  .string()
  .max(5000)
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

// ── Goal CRUD ────────────────────────────────────────────────────────────────

export const createGoalSchema = z.object({
  clientId: z.string().min(1),
  domainId: z.string().min(1).optional().or(z.literal("")).transform((v) => v || undefined),
  goalNumber: z.coerce.number().int().min(1),
  title: z.string().trim().min(1, "Title is required").max(500),
  description: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
  goalType: z.enum(GOAL_TYPES),
  baselineData: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  masteryCriteria: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  targetBehavior: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),

  // Behavior reduction fields
  functionOfBehavior: z.enum(BEHAVIOR_FUNCTIONS).optional().or(z.literal("")).transform((v) => v || undefined),
  replacementBehavior: optionalText,
  operationalDefinition: optionalText,
  severityLevel: z.enum(BEHAVIOR_SEVERITIES).optional().or(z.literal("")).transform((v) => v || undefined),
  crisisProtocol: optionalText,
  antecedentStrategies: optionalText,
  consequenceStrategies: optionalText,

  // Assessment provenance
  assessmentSource: z.enum(ASSESSMENT_SOURCES).optional().or(z.literal("")).transform((v) => v || undefined),
  assessmentItemRef: z.string().max(500).optional().or(z.literal("")).transform((v) => v || undefined),

  startDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  targetDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  treatmentPlanRef: z.string().max(500).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
});

export const updateGoalSchema = z.object({
  id: z.string().min(1),
  domainId: z.string().min(1).optional().or(z.literal("")).transform((v) => v || undefined),
  goalNumber: z.coerce.number().int().min(1).optional(),
  title: z.string().min(1).max(500).optional(),
  description: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
  goalType: z.enum(GOAL_TYPES).optional(),
  status: z.enum(GOAL_STATUSES).optional(),
  baselineData: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  masteryCriteria: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  targetBehavior: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),

  // Behavior reduction fields
  functionOfBehavior: z.enum(BEHAVIOR_FUNCTIONS).optional().or(z.literal("")).transform((v) => v || undefined),
  replacementBehavior: optionalText,
  operationalDefinition: optionalText,
  severityLevel: z.enum(BEHAVIOR_SEVERITIES).optional().or(z.literal("")).transform((v) => v || undefined),
  crisisProtocol: optionalText,
  antecedentStrategies: optionalText,
  consequenceStrategies: optionalText,

  // Assessment provenance
  assessmentSource: z.enum(ASSESSMENT_SOURCES).optional().or(z.literal("")).transform((v) => v || undefined),
  assessmentItemRef: z.string().max(500).optional().or(z.literal("")).transform((v) => v || undefined),

  startDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  targetDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  metDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  treatmentPlanRef: z.string().max(500).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
});

export const deleteGoalSchema = z.object({
  id: z.string().min(1),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

// ── Objective CRUD ───────────────────────────────────────────────────────────

export const createObjectiveSchema = z.object({
  goalId: z.string().min(1),
  objectiveNumber: z.coerce.number().int().min(1),
  description: z.string().trim().min(1, "Description is required").max(5000),
  masteryCriteria: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  dataCollectionType: z.enum(DATA_COLLECTION_TYPES).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
});

export const updateObjectiveSchema = z.object({
  id: z.string().min(1),
  objectiveNumber: z.coerce.number().int().min(1).optional(),
  description: z.string().min(1).max(5000).optional(),
  status: z.enum(GOAL_STATUSES).optional(),
  masteryCriteria: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  currentPerformance: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  dataCollectionType: z.enum(DATA_COLLECTION_TYPES).optional().or(z.literal("")).transform((v) => v || undefined),
  metDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
});

export const deleteObjectiveSchema = z.object({
  id: z.string().min(1),
});

export type CreateObjectiveInput = z.infer<typeof createObjectiveSchema>;
export type UpdateObjectiveInput = z.infer<typeof updateObjectiveSchema>;

// ── Target CRUD ──────────────────────────────────────────────────────────────

const TARGET_STATUSES = ["active", "mastered", "maintenance", "generalization"] as const;

export const createTargetSchema = z.object({
  objectiveId: z.string().min(1),
  targetNumber: z.coerce.number().int().min(1),
  targetName: z.string().trim().min(1, "Target name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")).transform((v) => v || undefined),
  masteryCriteria: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
});

export const updateTargetSchema = z.object({
  id: z.string().min(1),
  targetNumber: z.coerce.number().int().min(1).optional(),
  targetName: z.string().trim().min(1).max(200).optional(),
  description: z.string().max(2000).optional().or(z.literal("")).transform((v) => v || undefined),
  status: z.enum(TARGET_STATUSES).optional(),
  masteryCriteria: z.string().max(1000).optional().or(z.literal("")).transform((v) => v || undefined),
  metDate: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  notes: z.string().max(5000).optional().or(z.literal("")).transform((v) => v || undefined),
});

export const deleteTargetSchema = z.object({
  id: z.string().min(1),
});

export type CreateTargetInput = z.infer<typeof createTargetSchema>;
export type UpdateTargetInput = z.infer<typeof updateTargetSchema>;
