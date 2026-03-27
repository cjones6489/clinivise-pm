CREATE TABLE "client_goal_targets" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"objective_id" text NOT NULL,
	"target_number" integer NOT NULL,
	"target_name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"mastery_criteria" text,
	"met_date" date,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "function_of_behavior" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "replacement_behavior" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "operational_definition" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "severity_level" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "crisis_protocol" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "antecedent_strategies" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "consequence_strategies" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "assessment_source" text;--> statement-breakpoint
ALTER TABLE "client_goals" ADD COLUMN "assessment_item_ref" text;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "probe_correct" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "probe_total" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "rating_scale_value" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "rating_scale_max" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "intervals_scored" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "intervals_total" integer;--> statement-breakpoint
ALTER TABLE "client_goal_targets" ADD CONSTRAINT "client_goal_targets_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goal_targets" ADD CONSTRAINT "client_goal_targets_objective_id_client_goal_objectives_id_fk" FOREIGN KEY ("objective_id") REFERENCES "public"."client_goal_objectives"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_goal_targets_org_idx" ON "client_goal_targets" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "client_goal_targets_obj_idx" ON "client_goal_targets" USING btree ("objective_id");