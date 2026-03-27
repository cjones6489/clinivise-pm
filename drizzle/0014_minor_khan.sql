ALTER TABLE "session_notes" ALTER COLUMN "assessment_tools_used" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "measurement_type" text DEFAULT 'discrete_trial' NOT NULL;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "frequency_count" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "duration_seconds" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "rate_per_minute" numeric(7, 2);--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "latency_seconds" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "steps_completed" integer;--> statement-breakpoint
ALTER TABLE "session_note_goals" ADD COLUMN "steps_total" integer;--> statement-breakpoint
ALTER TABLE "session_notes" ADD COLUMN "others_present" text;--> statement-breakpoint
ALTER TABLE "session_notes" ADD COLUMN "subjective_notes" text;--> statement-breakpoint
ALTER TABLE "session_notes" ADD COLUMN "barriers_to_performance" text;--> statement-breakpoint
ALTER TABLE "session_notes" ADD COLUMN "caregiver_communication" text;