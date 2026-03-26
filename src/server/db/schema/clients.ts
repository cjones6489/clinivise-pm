import { pgTable, text, timestamp, boolean, integer, index, date } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { payers } from "./payers";

export const clients = pgTable(
  "clients",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    gender: text("gender"),
    phone: text("phone"),
    email: text("email"),
    addressLine1: text("address_line_1"),
    addressLine2: text("address_line_2"),
    city: text("city"),
    state: text("state"),
    zipCode: text("zip_code"),
    diagnosisCode: text("diagnosis_code").default("F84.0"),
    diagnosisDescription: text("diagnosis_description").default("Autism Spectrum Disorder"),
    intakeDate: date("intake_date"),
    status: text("status").default("inquiry").notNull(),
    referralSource: text("referral_source"),
    holdReason: text("hold_reason"),
    notes: text("notes"),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("clients_org_idx").on(table.organizationId),
    index("clients_name_idx").on(table.organizationId, table.lastName, table.firstName),
    index("clients_status_idx").on(table.organizationId, table.status),
  ],
);

export const clientInsurance = pgTable(
  "client_insurance",
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
    memberId: text("member_id").notNull(),
    groupNumber: text("group_number"),
    subscriberFirstName: text("subscriber_first_name"),
    subscriberLastName: text("subscriber_last_name"),
    subscriberDateOfBirth: date("subscriber_date_of_birth"),
    subscriberGender: text("subscriber_gender"),
    planName: text("plan_name"),
    relationshipToSubscriber: text("relationship_to_subscriber").default("self"),
    subscriberAddressLine1: text("subscriber_address_line_1"),
    subscriberCity: text("subscriber_city"),
    subscriberState: text("subscriber_state"),
    subscriberZipCode: text("subscriber_zip_code"),
    priority: integer("priority").default(1).notNull(),
    effectiveDate: date("effective_date"),
    terminationDate: date("termination_date"),
    verificationStatus: text("verification_status").default("unverified").notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    cardFrontUrl: text("card_front_url"),
    cardBackUrl: text("card_back_url"),
    isActive: boolean("is_active").default(true).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("client_insurance_org_idx").on(table.organizationId),
    index("client_insurance_client_idx").on(table.clientId),
    index("client_insurance_payer_idx").on(table.payerId),
    index("client_insurance_org_client_deleted_idx").on(
      table.organizationId,
      table.clientId,
      table.deletedAt,
    ),
    index("client_insurance_org_payer_deleted_idx").on(
      table.organizationId,
      table.payerId,
      table.deletedAt,
    ),
  ],
);

export const clientContacts = pgTable(
  "client_contacts",
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
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    email: text("email"),
    relationship: text("relationship").notNull(),
    isLegalGuardian: boolean("is_legal_guardian").default(false).notNull(),
    isEmergencyContact: boolean("is_emergency_contact").default(false).notNull(),
    isBillingResponsible: boolean("is_billing_responsible").default(false).notNull(),
    canReceivePhi: boolean("can_receive_phi").default(false).notNull(),
    canPickup: boolean("can_pickup").default(false).notNull(),
    livesWithClient: boolean("lives_with_client").default(false).notNull(),
    priority: integer("priority").default(1).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("client_contacts_org_idx").on(table.organizationId),
    index("client_contacts_client_idx").on(table.organizationId, table.clientId),
  ],
);
