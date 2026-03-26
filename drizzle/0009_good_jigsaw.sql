CREATE TABLE "client_providers" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"role" text NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_providers_active_unique" UNIQUE("organization_id","client_id","provider_id")
);
--> statement-breakpoint
ALTER TABLE "client_providers" ADD CONSTRAINT "client_providers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_providers" ADD CONSTRAINT "client_providers_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_providers" ADD CONSTRAINT "client_providers_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_providers_client_idx" ON "client_providers" USING btree ("organization_id","client_id");--> statement-breakpoint
CREATE INDEX "client_providers_provider_idx" ON "client_providers" USING btree ("organization_id","provider_id");--> statement-breakpoint
-- Migrate existing BCBA assignments into client_providers before dropping the column
INSERT INTO "client_providers" ("id", "organization_id", "client_id", "provider_id", "role", "is_primary", "start_date")
SELECT
  gen_random_uuid()::text,
  c."organization_id",
  c."id",
  c."assigned_bcba_id",
  'supervising_bcba',
  true,
  COALESCE(c."intake_date", c."created_at"::date)
FROM "clients" c
WHERE c."assigned_bcba_id" IS NOT NULL
  AND c."deleted_at" IS NULL;
--> statement-breakpoint
ALTER TABLE "clients" DROP CONSTRAINT "clients_assigned_bcba_id_providers_id_fk";
--> statement-breakpoint
DROP INDEX "clients_bcba_idx";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "assigned_bcba_id";