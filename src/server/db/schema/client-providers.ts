import { pgTable, text, timestamp, boolean, index, date } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients } from "./clients";
import { providers } from "./providers";

export const clientProviders = pgTable(
  "client_providers",
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
    providerId: text("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    /** Role on this client's team */
    role: text("role").notNull(),
    /** One primary provider per client (the BCBA for auth/claims defaults) */
    isPrimary: boolean("is_primary").default(false).notNull(),
    /** When this assignment began */
    startDate: date("start_date").notNull(),
    /** Null = active assignment, date = ended */
    endDate: date("end_date"),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // Active team for a client
    index("client_providers_client_idx").on(table.organizationId, table.clientId),
    // Active caseload for a provider
    index("client_providers_provider_idx").on(table.organizationId, table.providerId),
    // Partial unique indexes are added via raw SQL in the migration
    // (Drizzle doesn't support WHERE clauses on unique constraints)
  ],
);
