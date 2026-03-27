import { z } from "zod/v4";
import { GOAL_TYPES, GOAL_STATUSES, DATA_COLLECTION_TYPES } from "@/lib/constants";

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
