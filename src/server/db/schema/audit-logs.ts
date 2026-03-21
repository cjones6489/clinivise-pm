import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id"),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_org_idx").on(table.organizationId),
    index("audit_user_idx").on(table.userId),
    index("audit_entity_idx").on(table.entityType, table.entityId),
    index("audit_date_idx").on(table.organizationId, table.createdAt),
  ],
);
