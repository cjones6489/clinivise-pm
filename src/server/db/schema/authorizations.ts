import {
  pgTable,
  text,
  timestamp,
  index,
  date,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients, clientInsurance } from "./clients";
import { payers } from "./payers";

export const authorizations = pgTable(
  "authorizations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "restrict" }),
    payerId: text("payer_id")
      .notNull()
      .references(() => payers.id, { onDelete: "restrict" }),
    clientInsuranceId: text("client_insurance_id")
      .notNull()
      .references(() => clientInsurance.id, { onDelete: "restrict" }),
    authorizationNumber: text("authorization_number"),
    status: text("status").notNull().default("pending"),
    startDate: date("start_date").notNull(),
    endDate: date("end_date").notNull(),
    diagnosisCode: text("diagnosis_code").default("F84.0"),
    notes: text("notes"),
    aiParsedData: text("ai_parsed_data"),
    aiConfidenceScore: numeric("ai_confidence_score", {
      precision: 5,
      scale: 2,
    }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("auths_org_idx").on(table.organizationId),
    index("auths_client_idx").on(table.clientId),
    index("auths_status_idx").on(table.organizationId, table.status),
    index("auths_end_date_idx").on(table.organizationId, table.endDate),
  ],
);

export const authorizationServices = pgTable(
  "authorization_services",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    authorizationId: text("authorization_id")
      .notNull()
      .references(() => authorizations.id, { onDelete: "cascade" }),
    cptCode: text("cpt_code").notNull(),
    approvedUnits: integer("approved_units").notNull(),
    usedUnits: integer("used_units").default(0).notNull(),
    frequency: text("frequency"),
    maxUnitsPerDay: integer("max_units_per_day"),
    maxUnitsPerWeek: integer("max_units_per_week"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("auth_services_org_idx").on(table.organizationId),
    index("auth_services_auth_idx").on(table.authorizationId),
    index("auth_services_cpt_idx").on(table.authorizationId, table.cptCode),
  ],
);
