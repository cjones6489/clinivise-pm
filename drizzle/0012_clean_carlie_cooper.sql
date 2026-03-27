CREATE TABLE "goal_domains" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_goal_objectives" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"goal_id" text NOT NULL,
	"objective_number" integer NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"mastery_criteria" text,
	"current_performance" text,
	"data_collection_type" text,
	"met_date" date,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_goals" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"client_id" text NOT NULL,
	"domain_id" text,
	"goal_number" integer NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"goal_type" text DEFAULT 'skill_acquisition' NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"baseline_data" text,
	"mastery_criteria" text,
	"target_behavior" text,
	"start_date" date,
	"target_date" date,
	"met_date" date,
	"treatment_plan_ref" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "goal_domains" ADD CONSTRAINT "goal_domains_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goal_objectives" ADD CONSTRAINT "client_goal_objectives_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goal_objectives" ADD CONSTRAINT "client_goal_objectives_goal_id_client_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."client_goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_domain_id_goal_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."goal_domains"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "goal_domains_org_idx" ON "goal_domains" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "client_goal_objectives_org_idx" ON "client_goal_objectives" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "client_goal_objectives_goal_idx" ON "client_goal_objectives" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "client_goals_org_idx" ON "client_goals" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "client_goals_client_idx" ON "client_goals" USING btree ("organization_id","client_id");--> statement-breakpoint
CREATE INDEX "client_goals_domain_idx" ON "client_goals" USING btree ("domain_id");