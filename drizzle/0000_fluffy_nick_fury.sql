CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_org_id" text NOT NULL,
	"name" text NOT NULL,
	"npi" text,
	"tax_id" text,
	"phone" text,
	"email" text,
	"address_line_1" text,
	"address_line_2" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"taxonomy_code" text,
	"timezone" text DEFAULT 'America/New_York' NOT NULL,
	"stedi_api_key" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_clerk_org_id_unique" UNIQUE("clerk_org_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" text DEFAULT 'rbt' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"npi" text,
	"credential_type" text NOT NULL,
	"credential_number" text,
	"credential_expiry" date,
	"supervisor_id" text,
	"modifier_code" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_insurance" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"payer_id" text NOT NULL,
	"member_id" text NOT NULL,
	"group_number" text,
	"subscriber_first_name" text,
	"subscriber_last_name" text,
	"subscriber_date_of_birth" date,
	"relationship_to_subscriber" text DEFAULT 'self',
	"is_primary" boolean DEFAULT true NOT NULL,
	"effective_date" date,
	"termination_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"date_of_birth" date NOT NULL,
	"gender" text,
	"phone" text,
	"email" text,
	"address_line_1" text,
	"address_line_2" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"diagnosis_code" text DEFAULT 'F84.0',
	"diagnosis_description" text DEFAULT 'Autism Spectrum Disorder',
	"assigned_bcba_id" text,
	"intake_date" date,
	"discharge_date" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"notes" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payers" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"stedi_payer_id" text,
	"payer_type" text DEFAULT 'commercial',
	"phone" text,
	"auth_phone" text,
	"claims_address" text,
	"timely_filing_days" integer,
	"unit_calc_method" text DEFAULT 'ama',
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authorization_services" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"authorization_id" text NOT NULL,
	"cpt_code" text NOT NULL,
	"approved_units" integer NOT NULL,
	"used_units" integer DEFAULT 0 NOT NULL,
	"frequency" text,
	"max_units_per_day" integer,
	"max_units_per_week" integer,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "authorizations" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"payer_id" text NOT NULL,
	"client_insurance_id" text NOT NULL,
	"authorization_number" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"diagnosis_code" text DEFAULT 'F84.0',
	"notes" text,
	"ai_parsed_data" text,
	"ai_confidence_score" numeric(5, 2),
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"supervisor_id" text,
	"authorization_id" text,
	"authorization_service_id" text,
	"session_date" date NOT NULL,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"cpt_code" text NOT NULL,
	"modifier_codes" text[],
	"units" integer NOT NULL,
	"place_of_service" text DEFAULT '12' NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"notes" text,
	"claim_id" text,
	"billed_amount" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claim_lines" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"claim_id" text NOT NULL,
	"session_id" text,
	"line_number" integer NOT NULL,
	"cpt_code" text NOT NULL,
	"modifier_codes" text[],
	"units" integer NOT NULL,
	"charge_amount" numeric(10, 2) NOT NULL,
	"allowed_amount" numeric(10, 2),
	"paid_amount" numeric(10, 2),
	"adjustment_reason_code" text,
	"adjustment_amount" numeric(10, 2),
	"remark_code" text,
	"service_date_from" date NOT NULL,
	"service_date_to" date,
	"rendering_provider_npi" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claim_responses" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"claim_id" text NOT NULL,
	"response_type" text NOT NULL,
	"stedi_transaction_id" text,
	"raw_response" jsonb,
	"status_code" text,
	"status_description" text,
	"effective_date" date,
	"check_number" text,
	"check_amount" numeric(10, 2),
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claims" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"client_insurance_id" text NOT NULL,
	"payer_id" text NOT NULL,
	"rendering_provider_id" text NOT NULL,
	"billing_provider_id" text,
	"authorization_id" text,
	"claim_number" text,
	"stedi_transaction_id" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"service_date" date NOT NULL,
	"submitted_at" timestamp with time zone,
	"total_billed_amount" numeric(10, 2),
	"total_allowed_amount" numeric(10, 2),
	"total_paid_amount" numeric(10, 2),
	"patient_responsibility" numeric(10, 2),
	"diagnosis_code" text DEFAULT 'F84.0',
	"place_of_service" text,
	"ai_pre_check_result" jsonb,
	"ai_pre_check_at" timestamp with time zone,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eligibility_checks" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"client_insurance_id" text NOT NULL,
	"payer_id" text NOT NULL,
	"stedi_transaction_id" text,
	"request_payload" jsonb,
	"response_payload" jsonb,
	"is_eligible" boolean,
	"plan_name" text,
	"plan_type" text,
	"copay" numeric(10, 2),
	"coinsurance" text,
	"deductible" numeric(10, 2),
	"deductible_remaining" numeric(10, 2),
	"out_of_pocket_max" numeric(10, 2),
	"out_of_pocket_remaining" numeric(10, 2),
	"aba_specific_benefits" jsonb,
	"ai_interpretation" text,
	"checked_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text,
	"authorization_id" text,
	"claim_id" text,
	"document_type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_size_bytes" integer,
	"mime_type" text,
	"uploaded_by_user_id" text,
	"ai_processed" text DEFAULT 'pending',
	"ai_extracted_data" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_supervisor_id_providers_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD CONSTRAINT "client_insurance_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD CONSTRAINT "client_insurance_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_insurance" ADD CONSTRAINT "client_insurance_payer_id_payers_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."payers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_bcba_id_providers_id_fk" FOREIGN KEY ("assigned_bcba_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payers" ADD CONSTRAINT "payers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorization_services" ADD CONSTRAINT "authorization_services_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorization_services" ADD CONSTRAINT "authorization_services_authorization_id_authorizations_id_fk" FOREIGN KEY ("authorization_id") REFERENCES "public"."authorizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_payer_id_payers_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."payers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authorizations" ADD CONSTRAINT "authorizations_client_insurance_id_client_insurance_id_fk" FOREIGN KEY ("client_insurance_id") REFERENCES "public"."client_insurance"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_supervisor_id_providers_id_fk" FOREIGN KEY ("supervisor_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_authorization_id_authorizations_id_fk" FOREIGN KEY ("authorization_id") REFERENCES "public"."authorizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_authorization_service_id_authorization_services_id_fk" FOREIGN KEY ("authorization_service_id") REFERENCES "public"."authorization_services"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_lines" ADD CONSTRAINT "claim_lines_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_lines" ADD CONSTRAINT "claim_lines_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_lines" ADD CONSTRAINT "claim_lines_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_responses" ADD CONSTRAINT "claim_responses_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_responses" ADD CONSTRAINT "claim_responses_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_client_insurance_id_client_insurance_id_fk" FOREIGN KEY ("client_insurance_id") REFERENCES "public"."client_insurance"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_payer_id_payers_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."payers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_rendering_provider_id_providers_id_fk" FOREIGN KEY ("rendering_provider_id") REFERENCES "public"."providers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_billing_provider_id_providers_id_fk" FOREIGN KEY ("billing_provider_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claims" ADD CONSTRAINT "claims_authorization_id_authorizations_id_fk" FOREIGN KEY ("authorization_id") REFERENCES "public"."authorizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_checks" ADD CONSTRAINT "eligibility_checks_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_checks" ADD CONSTRAINT "eligibility_checks_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_checks" ADD CONSTRAINT "eligibility_checks_client_insurance_id_client_insurance_id_fk" FOREIGN KEY ("client_insurance_id") REFERENCES "public"."client_insurance"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eligibility_checks" ADD CONSTRAINT "eligibility_checks_payer_id_payers_id_fk" FOREIGN KEY ("payer_id") REFERENCES "public"."payers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_authorization_id_authorizations_id_fk" FOREIGN KEY ("authorization_id") REFERENCES "public"."authorizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_claim_id_claims_id_fk" FOREIGN KEY ("claim_id") REFERENCES "public"."claims"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_user_id_users_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_org_idx" ON "users" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "users_clerk_idx" ON "users" USING btree ("clerk_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_clerk_org_idx" ON "users" USING btree ("clerk_user_id","organization_id");--> statement-breakpoint
CREATE INDEX "providers_org_idx" ON "providers" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "providers_user_idx" ON "providers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "providers_supervisor_idx" ON "providers" USING btree ("supervisor_id");--> statement-breakpoint
CREATE INDEX "client_insurance_org_idx" ON "client_insurance" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "client_insurance_client_idx" ON "client_insurance" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "client_insurance_payer_idx" ON "client_insurance" USING btree ("payer_id");--> statement-breakpoint
CREATE INDEX "clients_org_idx" ON "clients" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "clients_bcba_idx" ON "clients" USING btree ("assigned_bcba_id");--> statement-breakpoint
CREATE INDEX "clients_name_idx" ON "clients" USING btree ("organization_id","last_name","first_name");--> statement-breakpoint
CREATE INDEX "payers_org_idx" ON "payers" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "payers_stedi_idx" ON "payers" USING btree ("stedi_payer_id");--> statement-breakpoint
CREATE INDEX "auth_services_org_idx" ON "authorization_services" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "auth_services_auth_idx" ON "authorization_services" USING btree ("authorization_id");--> statement-breakpoint
CREATE INDEX "auth_services_cpt_idx" ON "authorization_services" USING btree ("authorization_id","cpt_code");--> statement-breakpoint
CREATE INDEX "auths_org_idx" ON "authorizations" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "auths_client_idx" ON "authorizations" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "auths_status_idx" ON "authorizations" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "auths_end_date_idx" ON "authorizations" USING btree ("organization_id","end_date");--> statement-breakpoint
CREATE INDEX "sessions_org_idx" ON "sessions" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "sessions_client_idx" ON "sessions" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "sessions_provider_idx" ON "sessions" USING btree ("provider_id");--> statement-breakpoint
CREATE INDEX "sessions_auth_idx" ON "sessions" USING btree ("authorization_id");--> statement-breakpoint
CREATE INDEX "sessions_auth_service_idx" ON "sessions" USING btree ("authorization_service_id");--> statement-breakpoint
CREATE INDEX "sessions_date_idx" ON "sessions" USING btree ("organization_id","session_date");--> statement-breakpoint
CREATE INDEX "sessions_claim_idx" ON "sessions" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "sessions_status_idx" ON "sessions" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "claim_lines_org_idx" ON "claim_lines" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "claim_lines_claim_idx" ON "claim_lines" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "claim_lines_session_idx" ON "claim_lines" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "claim_responses_org_idx" ON "claim_responses" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "claim_responses_claim_idx" ON "claim_responses" USING btree ("claim_id");--> statement-breakpoint
CREATE INDEX "claim_responses_type_idx" ON "claim_responses" USING btree ("response_type");--> statement-breakpoint
CREATE INDEX "claims_org_idx" ON "claims" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "claims_client_idx" ON "claims" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "claims_status_idx" ON "claims" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "claims_stedi_idx" ON "claims" USING btree ("stedi_transaction_id");--> statement-breakpoint
CREATE INDEX "claims_payer_idx" ON "claims" USING btree ("payer_id");--> statement-breakpoint
CREATE INDEX "eligibility_org_idx" ON "eligibility_checks" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "eligibility_client_idx" ON "eligibility_checks" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "eligibility_date_idx" ON "eligibility_checks" USING btree ("organization_id","checked_at");--> statement-breakpoint
CREATE INDEX "documents_org_idx" ON "documents" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "documents_client_idx" ON "documents" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "documents_auth_idx" ON "documents" USING btree ("authorization_id");--> statement-breakpoint
CREATE INDEX "audit_org_idx" ON "audit_logs" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "audit_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_date_idx" ON "audit_logs" USING btree ("organization_id","created_at");