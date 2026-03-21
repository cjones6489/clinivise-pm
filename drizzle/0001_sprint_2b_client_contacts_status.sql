CREATE TABLE "client_contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"email" text,
	"relationship" text NOT NULL,
	"is_legal_guardian" boolean DEFAULT false NOT NULL,
	"is_emergency_contact" boolean DEFAULT false NOT NULL,
	"is_billing_responsible" boolean DEFAULT false NOT NULL,
	"can_receive_phi" boolean DEFAULT false NOT NULL,
	"can_pickup" boolean DEFAULT false NOT NULL,
	"lives_with_client" boolean DEFAULT false NOT NULL,
	"priority" integer DEFAULT 1 NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_insurance" DROP CONSTRAINT "client_insurance_client_id_clients_id_fk";
--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "subscriber_gender" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "priority" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "status" text DEFAULT 'inquiry' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "referral_source" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "hold_reason" text;--> statement-breakpoint
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_contacts" ADD CONSTRAINT "client_contacts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_contacts_org_idx" ON "client_contacts" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "client_contacts_client_idx" ON "client_contacts" USING btree ("organization_id","client_id");--> statement-breakpoint
ALTER TABLE "client_insurance" ADD CONSTRAINT "client_insurance_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_status_idx" ON "clients" USING btree ("organization_id","status");--> statement-breakpoint
ALTER TABLE "client_insurance" DROP COLUMN "is_primary";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "discharge_date";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN "is_active";