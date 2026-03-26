import { pgTable, text, timestamp, boolean, index, uniqueIndex } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    clerkUserId: text("clerk_user_id"),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    role: text("role").notNull().default("rbt"),
    status: text("status").notNull().default("active"),
    isActive: boolean("is_active").default(true).notNull(),
    invitedBy: text("invited_by"),
    invitedAt: timestamp("invited_at", { withTimezone: true }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("users_org_idx").on(table.organizationId),
    index("users_clerk_idx").on(table.clerkUserId),
    uniqueIndex("users_org_email_idx").on(table.organizationId, table.email),
  ],
);
