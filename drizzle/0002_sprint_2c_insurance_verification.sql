ALTER TABLE "client_insurance" ADD COLUMN "plan_name" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "subscriber_address_line_1" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "subscriber_city" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "subscriber_state" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "subscriber_zip_code" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "verification_status" text DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "card_front_url" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "card_back_url" text;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD COLUMN "deleted_at" timestamp with time zone;