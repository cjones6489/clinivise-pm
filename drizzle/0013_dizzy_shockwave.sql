CREATE TABLE "session_note_behaviors" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"session_note_id" text NOT NULL,
	"behavior_name" text NOT NULL,
	"occurrence_time" text,
	"antecedent" text,
	"behavior_description" text,
	"consequence" text,
	"duration_seconds" integer,
	"intensity" text,
	"notes" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_note_goals" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"session_note_id" text NOT NULL,
	"goal_id" text,
	"goal_name" text NOT NULL,
	"procedure" text,
	"trials_completed" integer,
	"trials_correct" integer,
	"percentage_correct" numeric(5, 2),
	"prompt_level" text,
	"reinforcement" text,
	"progress_status" text DEFAULT 'not_assessed' NOT NULL,
	"notes" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_notes" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"session_id" text NOT NULL,
	"note_type" text NOT NULL,
	"client_presentation" text,
	"session_narrative" text,
	"plan_next_session" text,
	"modification_rationale" text,
	"modification_description" text,
	"client_response_to_modification" text,
	"updated_protocol" text,
	"caregiver_name" text,
	"caregiver_relationship" text,
	"client_present" boolean,
	"training_objectives" text,
	"teaching_method" text,
	"caregiver_competency" text,
	"generalization_plan" text,
	"homework_assigned" text,
	"assessment_tools_used" text,
	"face_to_face_minutes" integer,
	"non_face_to_face_minutes" integer,
	"caregiver_participated" boolean,
	"findings_summary" text,
	"recommendations" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"signed_by_id" text,
	"signed_at" timestamp with time zone,
	"cosigned_by_id" text,
	"cosigned_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_note_behaviors" ADD CONSTRAINT "session_note_behaviors_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_note_behaviors" ADD CONSTRAINT "session_note_behaviors_session_note_id_session_notes_id_fk" FOREIGN KEY ("session_note_id") REFERENCES "public"."session_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD CONSTRAINT "session_note_goals_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD CONSTRAINT "session_note_goals_session_note_id_session_notes_id_fk" FOREIGN KEY ("session_note_id") REFERENCES "public"."session_notes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD CONSTRAINT "session_note_goals_goal_id_client_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."client_goals"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_signed_by_id_providers_id_fk" FOREIGN KEY ("signed_by_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_notes" ADD CONSTRAINT "session_notes_cosigned_by_id_providers_id_fk" FOREIGN KEY ("cosigned_by_id") REFERENCES "public"."providers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "session_note_behaviors_note_idx" ON "session_note_behaviors" USING btree ("session_note_id");--> statement-breakpoint
CREATE INDEX "session_note_goals_note_idx" ON "session_note_goals" USING btree ("session_note_id");--> statement-breakpoint
CREATE INDEX "session_note_goals_goal_idx" ON "session_note_goals" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "session_notes_org_idx" ON "session_notes" USING btree ("organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_notes_session_idx" ON "session_notes" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "session_notes_status_idx" ON "session_notes" USING btree ("organization_id","status");--> statement-breakpoint
CREATE INDEX "session_notes_signed_by_idx" ON "session_notes" USING btree ("signed_by_id");