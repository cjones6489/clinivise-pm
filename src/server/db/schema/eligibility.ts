import { pgTable, text, timestamp, index, jsonb, boolean, numeric } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients, clientInsurance } from "./clients";
import { payers } from "./payers";

// Phase 2 stub — table exists for schema completeness

export const eligibilityChecks = pgTable(
  "eligibility_checks",
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
    clientInsuranceId: text("client_insurance_id")
      .notNull()
      .references(() => clientInsurance.id, { onDelete: "restrict" }),
    payerId: text("payer_id")
      .notNull()
      .references(() => payers.id, { onDelete: "restrict" }),
    stediTransactionId: text("stedi_transaction_id"),
    requestPayload: jsonb("request_payload"),
    responsePayload: jsonb("response_payload"),
    isEligible: boolean("is_eligible"),
    planName: text("plan_name"),
    planType: text("plan_type"),
    copay: numeric("copay", { precision: 10, scale: 2 }),
    coinsurance: text("coinsurance"),
    deductible: numeric("deductible", { precision: 10, scale: 2 }),
    deductibleRemaining: numeric("deductible_remaining", {
      precision: 10,
      scale: 2,
    }),
    outOfPocketMax: numeric("out_of_pocket_max", {
      precision: 10,
      scale: 2,
    }),
    outOfPocketRemaining: numeric("out_of_pocket_remaining", {
      precision: 10,
      scale: 2,
    }),
    abaSpecificBenefits: jsonb("aba_specific_benefits"),
    aiInterpretation: text("ai_interpretation"),
    checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("eligibility_org_idx").on(table.organizationId),
    index("eligibility_client_idx").on(table.clientId),
    index("eligibility_date_idx").on(table.organizationId, table.checkedAt),
  ],
);
