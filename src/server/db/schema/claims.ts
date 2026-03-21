import {
  pgTable,
  text,
  timestamp,
  index,
  date,
  integer,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients, clientInsurance } from "./clients";
import { payers } from "./payers";
import { providers } from "./providers";
import { authorizations } from "./authorizations";
import { sessions } from "./sessions";

// Phase 2 stubs — tables exist for FK integrity but no CRUD actions yet

export const claims = pgTable(
  "claims",
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
    renderingProviderId: text("rendering_provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "restrict" }),
    billingProviderId: text("billing_provider_id").references(() => providers.id, {
      onDelete: "set null",
    }),
    authorizationId: text("authorization_id").references(() => authorizations.id, {
      onDelete: "set null",
    }),
    claimNumber: text("claim_number"),
    stediTransactionId: text("stedi_transaction_id"),
    status: text("status").notNull().default("draft"),
    serviceDate: date("service_date").notNull(),
    submittedAt: timestamp("submitted_at", { withTimezone: true }),
    totalBilledAmount: numeric("total_billed_amount", {
      precision: 10,
      scale: 2,
    }),
    totalAllowedAmount: numeric("total_allowed_amount", {
      precision: 10,
      scale: 2,
    }),
    totalPaidAmount: numeric("total_paid_amount", {
      precision: 10,
      scale: 2,
    }),
    patientResponsibility: numeric("patient_responsibility", {
      precision: 10,
      scale: 2,
    }),
    diagnosisCode: text("diagnosis_code").default("F84.0"),
    placeOfService: text("place_of_service"),
    aiPreCheckResult: jsonb("ai_pre_check_result"),
    aiPreCheckAt: timestamp("ai_pre_check_at", { withTimezone: true }),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("claims_org_idx").on(table.organizationId),
    index("claims_client_idx").on(table.clientId),
    index("claims_status_idx").on(table.organizationId, table.status),
    index("claims_stedi_idx").on(table.stediTransactionId),
    index("claims_payer_idx").on(table.payerId),
  ],
);

export const claimLines = pgTable(
  "claim_lines",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    claimId: text("claim_id")
      .notNull()
      .references(() => claims.id, { onDelete: "cascade" }),
    sessionId: text("session_id").references(() => sessions.id, {
      onDelete: "set null",
    }),
    lineNumber: integer("line_number").notNull(),
    cptCode: text("cpt_code").notNull(),
    modifierCodes: text("modifier_codes").array(),
    units: integer("units").notNull(),
    chargeAmount: numeric("charge_amount", { precision: 10, scale: 2 }).notNull(),
    allowedAmount: numeric("allowed_amount", { precision: 10, scale: 2 }),
    paidAmount: numeric("paid_amount", { precision: 10, scale: 2 }),
    adjustmentReasonCode: text("adjustment_reason_code"),
    adjustmentAmount: numeric("adjustment_amount", {
      precision: 10,
      scale: 2,
    }),
    remarkCode: text("remark_code"),
    serviceDateFrom: date("service_date_from").notNull(),
    serviceDateTo: date("service_date_to"),
    renderingProviderNpi: text("rendering_provider_npi"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("claim_lines_org_idx").on(table.organizationId),
    index("claim_lines_claim_idx").on(table.claimId),
    index("claim_lines_session_idx").on(table.sessionId),
  ],
);

export const claimResponses = pgTable(
  "claim_responses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    claimId: text("claim_id")
      .notNull()
      .references(() => claims.id, { onDelete: "cascade" }),
    responseType: text("response_type").notNull(),
    stediTransactionId: text("stedi_transaction_id"),
    rawResponse: jsonb("raw_response"),
    statusCode: text("status_code"),
    statusDescription: text("status_description"),
    effectiveDate: date("effective_date"),
    checkNumber: text("check_number"),
    checkAmount: numeric("check_amount", { precision: 10, scale: 2 }),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("claim_responses_org_idx").on(table.organizationId),
    index("claim_responses_claim_idx").on(table.claimId),
    index("claim_responses_type_idx").on(table.responseType),
  ],
);
