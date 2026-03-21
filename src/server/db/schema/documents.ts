import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { clients } from "./clients";
import { authorizations } from "./authorizations";
import { claims } from "./claims";
import { users } from "./users";

export const documents = pgTable(
  "documents",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    clientId: text("client_id").references(() => clients.id, {
      onDelete: "set null",
    }),
    authorizationId: text("authorization_id").references(
      () => authorizations.id,
      { onDelete: "set null" },
    ),
    claimId: text("claim_id").references(() => claims.id, {
      onDelete: "set null",
    }),
    documentType: text("document_type").notNull(),
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url").notNull(),
    fileSizeBytes: integer("file_size_bytes"),
    mimeType: text("mime_type"),
    uploadedByUserId: text("uploaded_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    aiProcessed: text("ai_processed").default("pending"),
    aiExtractedData: text("ai_extracted_data"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("documents_org_idx").on(table.organizationId),
    index("documents_client_idx").on(table.clientId),
    index("documents_auth_idx").on(table.authorizationId),
  ],
);
