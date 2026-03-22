import { pgTable, text, timestamp, index, date, integer, numeric } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients } from "./clients";
import { providers } from "./providers";
import { authorizations, authorizationServices } from "./authorizations";

export const sessions = pgTable(
  "sessions",
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
    providerId: text("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "restrict" }),
    supervisorId: text("supervisor_id").references(() => providers.id, {
      onDelete: "set null",
    }),
    authorizationId: text("authorization_id").references(() => authorizations.id, {
      onDelete: "set null",
    }),
    authorizationServiceId: text("authorization_service_id").references(
      () => authorizationServices.id,
      { onDelete: "set null" },
    ),
    sessionDate: date("session_date").notNull(),
    startTime: timestamp("start_time", { withTimezone: true }),
    endTime: timestamp("end_time", { withTimezone: true }),
    cptCode: text("cpt_code").notNull(),
    modifierCodes: text("modifier_codes").array(),
    units: integer("units").notNull(),
    placeOfService: text("place_of_service").notNull().default("12"),
    status: text("status").notNull().default("completed"),
    actualMinutes: integer("actual_minutes"),
    unitCalcMethod: text("unit_calc_method"),
    notes: text("notes"),
    claimId: text("claim_id"),
    // Note: FK to claims.id intentionally omitted here due to circular import
    // (claims.ts imports sessions.ts for claimLines.sessionId).
    // Referential integrity enforced at application level in server actions.
    billedAmount: numeric("billed_amount", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("sessions_org_idx").on(table.organizationId),
    index("sessions_client_idx").on(table.clientId),
    index("sessions_provider_idx").on(table.providerId),
    index("sessions_auth_idx").on(table.authorizationId),
    index("sessions_auth_service_idx").on(table.authorizationServiceId),
    index("sessions_date_idx").on(table.organizationId, table.sessionDate),
    index("sessions_claim_idx").on(table.claimId),
    index("sessions_status_idx").on(table.organizationId, table.status),
  ],
);
