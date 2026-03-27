import {
  pgTable,
  text,
  timestamp,
  integer,
  numeric,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { organizations } from "./organizations";
import { sessions } from "./sessions";
import { providers } from "./providers";
import { clientGoals } from "./client-goals";

// ── Session Notes ────────────────────────────────────────────────────────────
// One note per session. CPT-specific fields are nullable — only the sections
// relevant to the session's CPT code are populated.

export const sessionNotes = pgTable(
  "session_notes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    noteType: text("note_type").notNull(), // 97153_direct | 97155_modification | 97156_caregiver | 97151_assessment

    // ── Universal sections (all CPT codes) ──────────────────────────────
    othersPresent: text("others_present"), // Names + relationships: "Maria Thompson (mother), school aide"
    subjectiveNotes: text("subjective_notes"), // SOAP "S": caregiver reports, setting events, context
    clientPresentation: text("client_presentation"), // SOAP "O" start: observable behavior at session start
    sessionNarrative: text("session_narrative"), // Free-text summary
    barriersToPerformance: text("barriers_to_performance"), // Why goals were not met (TRICARE requirement)
    caregiverCommunication: text("caregiver_communication"), // Informal caregiver communication (97153 when caregiver present)
    planNextSession: text("plan_next_session"), // Plan for next session

    // ── 97155-specific (protocol modification) ──────────────────────────
    modificationRationale: text("modification_rationale"), // Data prompting the change
    modificationDescription: text("modification_description"), // What was changed
    clientResponseToModification: text("client_response_to_modification"),
    updatedProtocol: text("updated_protocol"), // New protocol going forward

    // ── 97156-specific (caregiver training) ─────────────────────────────
    caregiverName: text("caregiver_name"),
    caregiverRelationship: text("caregiver_relationship"),
    clientPresent: boolean("client_present"),
    trainingObjectives: text("training_objectives"),
    teachingMethod: text("teaching_method"), // explain, model, role-play, feedback
    caregiverCompetency: text("caregiver_competency"), // Fidelity/competency assessment
    generalizationPlan: text("generalization_plan"),
    homeworkAssigned: text("homework_assigned"),

    // ── 97151-specific (assessment) ─────────────────────────────────────
    assessmentToolsUsed: text("assessment_tools_used").array(), // VB-MAPP, ABLLS-R, etc.
    faceToFaceMinutes: integer("face_to_face_minutes"),
    nonFaceToFaceMinutes: integer("non_face_to_face_minutes"),
    caregiverParticipated: boolean("caregiver_participated"),
    findingsSummary: text("findings_summary"),
    recommendations: text("recommendations"),

    // ── Compliance & signatures ──────────────────────────────────────────
    status: text("status").notNull().default("draft"), // draft | signed | cosigned | locked
    signedById: text("signed_by_id").references(() => providers.id, {
      onDelete: "set null",
    }),
    signedAt: timestamp("signed_at", { withTimezone: true }),
    cosignedById: text("cosigned_by_id").references(() => providers.id, {
      onDelete: "set null",
    }),
    cosignedAt: timestamp("cosigned_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("session_notes_org_idx").on(table.organizationId),
    uniqueIndex("session_notes_session_idx").on(table.sessionId), // One note per session
    index("session_notes_status_idx").on(table.organizationId, table.status),
    index("session_notes_signed_by_idx").on(table.signedById),
  ],
);

// ── Session Note Goals ───────────────────────────────────────────────────────
// Per-goal data within a session note (97153 and 97155 primarily).
// Tracks what was targeted, how many trials, prompt levels, progress.

export const sessionNoteGoals = pgTable(
  "session_note_goals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sessionNoteId: text("session_note_id")
      .notNull()
      .references(() => sessionNotes.id, { onDelete: "cascade" }),
    goalId: text("goal_id").references(() => clientGoals.id, {
      onDelete: "set null",
    }), // Link to treatment plan goal (nullable for ad-hoc)
    goalName: text("goal_name").notNull(), // Snapshot name (in case goal is edited later)
    procedure: text("procedure"), // ABA technique: DTT, NET, incidental teaching, etc.
    measurementType: text("measurement_type").notNull().default("discrete_trial"), // discrete_trial | frequency | duration | rate | latency | task_analysis | interval | other

    // Discrete trial data
    trialsCompleted: integer("trials_completed"),
    trialsCorrect: integer("trials_correct"),
    percentageCorrect: numeric("percentage_correct", {
      precision: 5,
      scale: 2,
    }),

    // Frequency data (e.g., manding count)
    frequencyCount: integer("frequency_count"),

    // Duration data (e.g., tantrum duration)
    durationSeconds: integer("duration_seconds"),

    // Rate data (frequency / time)
    ratePerMinute: numeric("rate_per_minute", { precision: 7, scale: 2 }),

    // Latency data (time between SD and response)
    latencySeconds: integer("latency_seconds"),

    // Task analysis data (e.g., toothbrushing 9/12 steps)
    stepsCompleted: integer("steps_completed"),
    stepsTotal: integer("steps_total"),

    promptLevel: text("prompt_level"), // Most common prompt: FP, PP, M, V, G, PO, TX, VS, EC, I
    reinforcement: text("reinforcement"), // Type and schedule
    progressStatus: text("progress_status").notNull().default("not_assessed"), // met | partially_met | not_met | regression | maintenance | not_assessed
    notes: text("notes"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("session_note_goals_note_idx").on(table.sessionNoteId),
    index("session_note_goals_goal_idx").on(table.goalId),
  ],
);

// ── Session Note Behaviors ───────────────────────────────────────────────────
// ABC incident tracking within a session note. Any session type.

export const sessionNoteBehaviors = pgTable(
  "session_note_behaviors",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    sessionNoteId: text("session_note_id")
      .notNull()
      .references(() => sessionNotes.id, { onDelete: "cascade" }),
    behaviorName: text("behavior_name").notNull(), // From BIP: elopement, aggression, SIB, etc.
    occurrenceTime: text("occurrence_time"), // When it happened (e.g., "10:23 AM")
    antecedent: text("antecedent"), // A — what triggered it
    behaviorDescription: text("behavior_description"), // B — what the client did
    consequence: text("consequence"), // C — how staff responded
    durationSeconds: integer("duration_seconds"),
    intensity: text("intensity"), // mild | moderate | severe
    notes: text("notes"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("session_note_behaviors_note_idx").on(table.sessionNoteId),
  ],
);
