import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  date,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { users } from "./users";

export const providers = pgTable(
  "providers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    npi: text("npi"),
    credentialType: text("credential_type").notNull(),
    credentialNumber: text("credential_number"),
    credentialExpiry: date("credential_expiry"),
    supervisorId: text("supervisor_id").references((): AnyPgColumn => providers.id, {
      onDelete: "set null",
    }),
    modifierCode: text("modifier_code"),
    isActive: boolean("is_active").default(true).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("providers_org_idx").on(table.organizationId),
    index("providers_user_idx").on(table.userId),
    index("providers_supervisor_idx").on(table.supervisorId),
  ],
);
