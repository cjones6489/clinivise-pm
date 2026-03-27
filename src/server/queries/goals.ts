import "server-only";

import { db } from "@/server/db";
import { clientGoals, clientGoalObjectives, goalDomains } from "@/server/db/schema";
import { eq, and, isNull, asc, inArray } from "drizzle-orm";

// ── Types ────────────────────────────────────────────────────────────────────

export type GoalDomain = typeof goalDomains.$inferSelect;

export type GoalWithObjectives = {
  id: string;
  goalNumber: number;
  title: string;
  description: string | null;
  goalType: string;
  status: string;
  baselineData: string | null;
  masteryCriteria: string | null;
  targetBehavior: string | null;
  // Behavior reduction fields
  functionOfBehavior: string | null;
  replacementBehavior: string | null;
  operationalDefinition: string | null;
  severityLevel: string | null;
  crisisProtocol: string | null;
  antecedentStrategies: string | null;
  consequenceStrategies: string | null;
  // Assessment provenance
  assessmentSource: string | null;
  assessmentItemRef: string | null;
  startDate: string | null;
  targetDate: string | null;
  metDate: string | null;
  treatmentPlanRef: string | null;
  sortOrder: number;
  notes: string | null;
  domainId: string | null;
  domainName: string | null;
  objectives: GoalObjective[];
};

export type GoalObjective = {
  id: string;
  objectiveNumber: number;
  description: string;
  status: string;
  masteryCriteria: string | null;
  currentPerformance: string | null;
  dataCollectionType: string | null;
  metDate: string | null;
  sortOrder: number;
  notes: string | null;
};

// ── Queries ──────────────────────────────────────────────────────────────────

/** Get all goal domains for an org (custom + defaults) */
export async function getGoalDomains(orgId: string): Promise<GoalDomain[]> {
  return db
    .select()
    .from(goalDomains)
    .where(eq(goalDomains.organizationId, orgId))
    .orderBy(asc(goalDomains.sortOrder), asc(goalDomains.name));
}

/** Get all goals for a client, with objectives, grouped-ready (sorted by domain + goal number) */
export async function getClientGoals(
  orgId: string,
  clientId: string,
): Promise<GoalWithObjectives[]> {
  // Fetch goals with domain name
  const goals = await db
    .select({
      id: clientGoals.id,
      goalNumber: clientGoals.goalNumber,
      title: clientGoals.title,
      description: clientGoals.description,
      goalType: clientGoals.goalType,
      status: clientGoals.status,
      baselineData: clientGoals.baselineData,
      masteryCriteria: clientGoals.masteryCriteria,
      targetBehavior: clientGoals.targetBehavior,
      functionOfBehavior: clientGoals.functionOfBehavior,
      replacementBehavior: clientGoals.replacementBehavior,
      operationalDefinition: clientGoals.operationalDefinition,
      severityLevel: clientGoals.severityLevel,
      crisisProtocol: clientGoals.crisisProtocol,
      antecedentStrategies: clientGoals.antecedentStrategies,
      consequenceStrategies: clientGoals.consequenceStrategies,
      assessmentSource: clientGoals.assessmentSource,
      assessmentItemRef: clientGoals.assessmentItemRef,
      startDate: clientGoals.startDate,
      targetDate: clientGoals.targetDate,
      metDate: clientGoals.metDate,
      treatmentPlanRef: clientGoals.treatmentPlanRef,
      sortOrder: clientGoals.sortOrder,
      notes: clientGoals.notes,
      domainId: clientGoals.domainId,
      domainName: goalDomains.name,
    })
    .from(clientGoals)
    .leftJoin(goalDomains, eq(clientGoals.domainId, goalDomains.id))
    .where(
      and(
        eq(clientGoals.organizationId, orgId),
        eq(clientGoals.clientId, clientId),
        isNull(clientGoals.deletedAt),
      ),
    )
    .orderBy(asc(goalDomains.sortOrder), asc(clientGoals.goalNumber));

  if (goals.length === 0) return [];

  // Fetch objectives for these goals in one query using IN clause
  const goalIds = goals.map((g) => g.id);
  const allObjectives = await db
    .select({
      id: clientGoalObjectives.id,
      goalId: clientGoalObjectives.goalId,
      objectiveNumber: clientGoalObjectives.objectiveNumber,
      description: clientGoalObjectives.description,
      status: clientGoalObjectives.status,
      masteryCriteria: clientGoalObjectives.masteryCriteria,
      currentPerformance: clientGoalObjectives.currentPerformance,
      dataCollectionType: clientGoalObjectives.dataCollectionType,
      metDate: clientGoalObjectives.metDate,
      sortOrder: clientGoalObjectives.sortOrder,
      notes: clientGoalObjectives.notes,
    })
    .from(clientGoalObjectives)
    .where(
      and(
        eq(clientGoalObjectives.organizationId, orgId),
        isNull(clientGoalObjectives.deletedAt),
        inArray(clientGoalObjectives.goalId, goalIds),
      ),
    )
    .orderBy(asc(clientGoalObjectives.objectiveNumber));

  // Group objectives by goalId
  const objectivesByGoal = new Map<string, GoalObjective[]>();
  for (const obj of allObjectives) {
    const list = objectivesByGoal.get(obj.goalId) ?? [];
    list.push({
      id: obj.id,
      objectiveNumber: obj.objectiveNumber,
      description: obj.description,
      status: obj.status,
      masteryCriteria: obj.masteryCriteria,
      currentPerformance: obj.currentPerformance,
      dataCollectionType: obj.dataCollectionType,
      metDate: obj.metDate,
      sortOrder: obj.sortOrder,
      notes: obj.notes,
    });
    objectivesByGoal.set(obj.goalId, list);
  }

  return goals.map((g) => ({
    ...g,
    objectives: objectivesByGoal.get(g.id) ?? [],
  }));
}
