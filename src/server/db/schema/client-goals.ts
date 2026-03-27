import { pgTable, text, timestamp, integer, index, date } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients } from "./clients";
import { goalDomains } from "./goal-domains";

export const clientGoals = pgTable(
  "client_goals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    domainId: text("domain_id").references(() => goalDomains.id, { onDelete: "set null" }),
    goalNumber: integer("goal_number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    protocol: text("protocol"), // RBT instructions — how to run this program during a session (4/5 competitors have this)
    goalType: text("goal_type").notNull().default("skill_acquisition"),
    status: text("status").notNull().default("active"),
    baselineData: text("baseline_data"),
    masteryCriteria: text("mastery_criteria"),
    targetBehavior: text("target_behavior"),

    // ── Behavior reduction fields (nullable, only for goalType = "behavior_reduction") ──
    functionOfBehavior: text("function_of_behavior"), // escape | attention | tangible | sensory | automatic | multiple
    replacementBehavior: text("replacement_behavior"), // Functionally equivalent replacement
    operationalDefinition: text("operational_definition"), // Observable, measurable behavior definition
    severityLevel: text("severity_level"), // mild | moderate | severe | crisis
    crisisProtocol: text("crisis_protocol"), // What to do if behavior escalates
    antecedentStrategies: text("antecedent_strategies"), // Proactive prevention strategies
    consequenceStrategies: text("consequence_strategies"), // Reactive strategies from BIP

    // ── Assessment provenance ───────────────────────────────────────────────
    assessmentSource: text("assessment_source"), // vb_mapp | ablls_r | afls | peak | clinical_observation | other
    assessmentItemRef: text("assessment_item_ref"), // e.g., "VB-MAPP Mand Level 2, M8"

    startDate: date("start_date"),
    targetDate: date("target_date"),
    metDate: date("met_date"),
    treatmentPlanRef: text("treatment_plan_ref"),
    sortOrder: integer("sort_order").default(0).notNull(),
    notes: text("notes"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("client_goals_org_idx").on(table.organizationId),
    index("client_goals_client_idx").on(table.organizationId, table.clientId),
    index("client_goals_domain_idx").on(table.domainId),
  ],
);

export const clientGoalObjectives = pgTable(
  "client_goal_objectives",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    goalId: text("goal_id")
      .notNull()
      .references(() => clientGoals.id, { onDelete: "cascade" }),
    objectiveNumber: integer("objective_number").notNull(),
    description: text("description").notNull(),
    status: text("status").notNull().default("active"),
    masteryCriteria: text("mastery_criteria"),
    currentPerformance: text("current_performance"),
    dataCollectionType: text("data_collection_type"),
    metDate: date("met_date"),
    sortOrder: integer("sort_order").default(0).notNull(),
    notes: text("notes"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("client_goal_objectives_org_idx").on(table.organizationId),
    index("client_goal_objectives_goal_idx").on(table.goalId),
  ],
);

// ── Goal Targets ─────────────────────────────────────────────────────────────
// Discrete items to master within an objective. E.g., objective "mand for 10
// items" has targets: "cookie", "ball", "iPad", "swing", etc.
// RBTs work on targets — this is the daily teaching unit.

export const clientGoalTargets = pgTable(
  "client_goal_targets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    objectiveId: text("objective_id")
      .notNull()
      .references(() => clientGoalObjectives.id, { onDelete: "cascade" }),
    targetNumber: integer("target_number").notNull(),
    targetName: text("target_name").notNull(), // e.g., "cookie", "ball", "brush teeth step 4"
    description: text("description"),
    status: text("status").notNull().default("active"), // active | mastered | maintenance | generalization
    masteryCriteria: text("mastery_criteria"),
    metDate: date("met_date"),
    sortOrder: integer("sort_order").default(0).notNull(),
    notes: text("notes"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("client_goal_targets_org_idx").on(table.organizationId),
    index("client_goal_targets_obj_idx").on(table.objectiveId),
  ],
);
