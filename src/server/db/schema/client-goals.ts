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
    domainId: text("domain_id")
      .references(() => goalDomains.id, { onDelete: "set null" }),
    goalNumber: integer("goal_number").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    goalType: text("goal_type").notNull().default("skill_acquisition"),
    status: text("status").notNull().default("active"),
    baselineData: text("baseline_data"),
    masteryCriteria: text("mastery_criteria"),
    targetBehavior: text("target_behavior"),
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
