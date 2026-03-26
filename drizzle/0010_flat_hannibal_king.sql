ALTER TABLE "client_providers" DROP CONSTRAINT "client_providers_active_unique";
--> statement-breakpoint
-- Only one active assignment per provider-client pair (allows re-assignment after ending)
CREATE UNIQUE INDEX "client_providers_active_unique"
  ON "client_providers" ("organization_id", "client_id", "provider_id")
  WHERE "end_date" IS NULL;
--> statement-breakpoint
-- Only one active primary per client (prevents duplicate primaries)
CREATE UNIQUE INDEX "client_providers_one_primary_idx"
  ON "client_providers" ("organization_id", "client_id")
  WHERE "is_primary" = true AND "end_date" IS NULL;