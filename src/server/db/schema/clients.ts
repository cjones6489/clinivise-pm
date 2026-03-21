import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  date,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { providers } from "./providers";
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
    diagnosisDescription: text("diagnosis_description").default(
      "Autism Spectrum Disorder",
    ),
    assignedBcbaId: text("assigned_bcba_id").references(() => providers.id, {
      onDelete: "set null",
    }),
    intakeDate: date("intake_date"),
    dischargeDate: date("discharge_date"),
    isActive: boolean("is_active").default(true).notNull(),
    notes: text("notes"),
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
    index("clients_org_idx").on(table.organizationId),
    index("clients_bcba_idx").on(table.assignedBcbaId),
    index("clients_name_idx").on(
      table.organizationId,
      table.lastName,
      table.firstName,
    ),
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
      .references(() => clients.id, { onDelete: "cascade" }),
    payerId: text("payer_id")
      .notNull()
      .references(() => payers.id, { onDelete: "restrict" }),
    memberId: text("member_id").notNull(),
    groupNumber: text("group_number"),
    subscriberFirstName: text("subscriber_first_name"),
    subscriberLastName: text("subscriber_last_name"),
    subscriberDateOfBirth: date("subscriber_date_of_birth"),
    relationshipToSubscriber: text("relationship_to_subscriber").default(
      "self",
    ),
    isPrimary: boolean("is_primary").default(true).notNull(),
    effectiveDate: date("effective_date"),
    terminationDate: date("termination_date"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("client_insurance_org_idx").on(table.organizationId),
    index("client_insurance_client_idx").on(table.clientId),
    index("client_insurance_payer_idx").on(table.payerId),
  ],
);
