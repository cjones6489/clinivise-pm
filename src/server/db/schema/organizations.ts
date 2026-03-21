import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const organizations = pgTable("organizations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  clerkOrgId: text("clerk_org_id").notNull().unique(),
  name: text("name").notNull(),
  npi: text("npi"),
  taxId: text("tax_id"),
  phone: text("phone"),
  email: text("email"),
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  taxonomyCode: text("taxonomy_code"),
  timezone: text("timezone").default("America/New_York").notNull(),
  stediApiKey: text("stedi_api_key"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
