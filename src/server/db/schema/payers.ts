import { pgTable, text, timestamp, boolean, index, integer } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";

export const payers = pgTable(
  "payers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    stediPayerId: text("stedi_payer_id"),
    payerType: text("payer_type").default("commercial"),
    phone: text("phone"),
    authPhone: text("auth_phone"),
    claimsAddress: text("claims_address"),
    timelyFilingDays: integer("timely_filing_days"),
    unitCalcMethod: text("unit_calc_method").default("ama"),
    notes: text("notes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("payers_org_idx").on(table.organizationId),
    index("payers_stedi_idx").on(table.stediPayerId),
  ],
);
