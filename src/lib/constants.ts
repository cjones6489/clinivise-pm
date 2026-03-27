// ── Status & Type Enums (as const arrays — NO pgEnum) ──────────────────────

export const USER_ROLES = ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["invited", "active", "deactivated"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const CREDENTIAL_TYPES = ["bcba", "bcba_d", "bcaba", "rbt", "other"] as const;
export type CredentialType = (typeof CREDENTIAL_TYPES)[number];

/** Credential types that qualify as supervisors (BCBA-level or above). */
export const SUPERVISOR_CREDENTIAL_TYPES: readonly CredentialType[] = ["bcba", "bcba_d"];

// ── Care Team Roles ─────────────────────────────────────────────────────────

export const CARE_TEAM_ROLES = ["supervising_bcba", "bcba", "bcaba", "lead_rbt", "rbt"] as const;
export type CareTeamRole = (typeof CARE_TEAM_ROLES)[number];

export const CARE_TEAM_ROLE_LABELS: Record<CareTeamRole, string> = {
  supervising_bcba: "Supervising BCBA",
  bcba: "BCBA",
  bcaba: "BCaBA",
  lead_rbt: "Lead RBT",
  rbt: "RBT",
};

/** Group labels for Care Team tab sections */
export const CARE_TEAM_ROLE_GROUPS = {
  supervising: ["supervising_bcba", "bcba", "bcaba"] as readonly CareTeamRole[],
  direct_service: ["lead_rbt", "rbt"] as readonly CareTeamRole[],
};

/** Auto-suggest a care team role from provider credential type */
export function defaultCareTeamRole(credentialType: string): CareTeamRole {
  switch (credentialType) {
    case "bcba":
    case "bcba_d":
      return "supervising_bcba";
    case "bcaba":
      return "bcaba";
    case "rbt":
      return "rbt";
    default:
      return "rbt";
  }
}

// ── Goal Domains (defaults seeded per org) ──────────────────────────────────

export const DEFAULT_GOAL_DOMAINS = [
  "Communication",
  "Social Skills",
  "Adaptive Behavior",
  "Behavior Reduction",
  "Academic",
  "Play & Leisure",
  "Self-Care",
  "Motor Skills",
  "Vocational",
  "Other",
] as const;

// ── Goal Types & Statuses ───────────────────────────────────────────────────

export const GOAL_TYPES = ["skill_acquisition", "behavior_reduction"] as const;
export type GoalType = (typeof GOAL_TYPES)[number];

export const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  skill_acquisition: "Skill Acquisition",
  behavior_reduction: "Behavior Reduction",
};

export const GOAL_STATUSES = ["active", "met", "on_hold", "discontinued"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: "Active",
  met: "Met",
  on_hold: "On Hold",
  discontinued: "Discontinued",
};

export const GOAL_STATUS_VARIANT: Record<GoalStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  met: "secondary",
  on_hold: "outline",
  discontinued: "outline",
};

// ── Data Collection Types (for Phase 3 readiness) ───────────────────────────

export const DATA_COLLECTION_TYPES = [
  "dtt",
  "frequency",
  "duration",
  "task_analysis",
  "interval",
  "probe",
  "rating_scale",
] as const;
export type DataCollectionType = (typeof DATA_COLLECTION_TYPES)[number];

export const DATA_COLLECTION_TYPE_LABELS: Record<DataCollectionType, string> = {
  dtt: "Discrete Trial (DTT)",
  frequency: "Frequency / Event",
  duration: "Duration",
  task_analysis: "Task Analysis",
  interval: "Interval Recording",
  probe: "Probe / Cold Probe",
  rating_scale: "Rating Scale",
};

export const AUTH_STATUSES = ["pending", "approved", "denied", "expired", "exhausted"] as const;
export type AuthStatus = (typeof AUTH_STATUSES)[number];

export const SESSION_STATUSES = [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
  "flagged",
] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const CLAIM_STATUSES = [
  "draft",
  "ready",
  "submitted",
  "accepted",
  "rejected",
  "paid",
  "partially_paid",
  "denied",
  "appealed",
  "void",
] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const DOCUMENT_TYPES = [
  "authorization_letter",
  "assessment_report",
  "treatment_plan",
  "insurance_card",
  "other",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const PLACE_OF_SERVICE_CODES = ["02", "03", "10", "11", "12", "99"] as const;
export type PlaceOfServiceCode = (typeof PLACE_OF_SERVICE_CODES)[number];

export const PAYER_TYPES = ["commercial", "medicaid", "medicare", "tricare"] as const;
export type PayerType = (typeof PAYER_TYPES)[number];

export const SUBSCRIBER_RELATIONSHIPS = ["self", "spouse", "child", "other"] as const;
export type SubscriberRelationship = (typeof SUBSCRIBER_RELATIONSHIPS)[number];

export const AI_PROCESSING_STATUSES = ["pending", "processing", "completed", "failed"] as const;
export type AiProcessingStatus = (typeof AI_PROCESSING_STATUSES)[number];

export const GENDERS = ["M", "F", "U"] as const;
export type Gender = (typeof GENDERS)[number];

export const UNIT_CALC_METHODS = ["cms", "ama"] as const;
export type UnitCalcMethod = (typeof UNIT_CALC_METHODS)[number];

// ── Client Statuses ──────────────────────────────────────────────────────────

export const CLIENT_STATUSES = [
  "inquiry",
  "intake",
  "waitlist",
  "pending_assessment",
  "pending_treatment_auth",
  "active",
  "on_hold",
  "discharged",
  "archived",
] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  inquiry: "Inquiry",
  intake: "Intake",
  waitlist: "Waitlist",
  pending_assessment: "Pending Assessment",
  pending_treatment_auth: "Pending Auth",
  active: "Active",
  on_hold: "On Hold",
  discharged: "Discharged",
  archived: "Archived",
};

export const CLIENT_STATUS_VARIANT: Record<ClientStatus, "default" | "secondary" | "outline"> = {
  inquiry: "outline",
  intake: "secondary",
  waitlist: "secondary",
  pending_assessment: "secondary",
  pending_treatment_auth: "secondary",
  active: "default",
  on_hold: "outline",
  discharged: "outline",
  archived: "outline",
};

// ── Contact Relationship Types ───────────────────────────────────────────────

export const CONTACT_RELATIONSHIP_TYPES = [
  "mother",
  "father",
  "stepmother",
  "stepfather",
  "grandmother",
  "grandfather",
  "legal_guardian",
  "foster_parent",
  "aunt",
  "uncle",
  "sibling",
  "other",
] as const;
export type ContactRelationshipType = (typeof CONTACT_RELATIONSHIP_TYPES)[number];

export const CONTACT_RELATIONSHIP_LABELS: Record<ContactRelationshipType, string> = {
  mother: "Mother",
  father: "Father",
  stepmother: "Stepmother",
  stepfather: "Stepfather",
  grandmother: "Grandmother",
  grandfather: "Grandfather",
  legal_guardian: "Legal Guardian",
  foster_parent: "Foster Parent",
  aunt: "Aunt",
  uncle: "Uncle",
  sibling: "Sibling",
  other: "Other",
};

// ── Referral Sources ─────────────────────────────────────────────────────────

export const REFERRAL_SOURCES = [
  "pediatrician",
  "school",
  "self_referral",
  "insurance",
  "other_provider",
  "website",
  "word_of_mouth",
  "other",
] as const;
export type ReferralSource = (typeof REFERRAL_SOURCES)[number];

export const REFERRAL_SOURCE_LABELS: Record<ReferralSource, string> = {
  pediatrician: "Pediatrician",
  school: "School",
  self_referral: "Self-Referral",
  insurance: "Insurance",
  other_provider: "Other Provider",
  website: "Website",
  word_of_mouth: "Word of Mouth",
  other: "Other",
};

// ── Verification Statuses ────────────────────────────────────────────────────

export const VERIFICATION_STATUSES = ["unverified", "verified", "failed"] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUSES)[number];

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  unverified: "Unverified",
  verified: "Verified",
  failed: "Failed",
};

// ── Payer Type Labels ────────────────────────────────────────────────────────

export const PAYER_TYPE_LABELS: Record<PayerType, string> = {
  commercial: "Commercial",
  medicaid: "Medicaid",
  medicare: "Medicare",
  tricare: "TRICARE",
};

// ── Subscriber Relationship Labels ──────────────────────────────────────────

export const SUBSCRIBER_RELATIONSHIP_LABELS: Record<SubscriberRelationship, string> = {
  self: "Self",
  spouse: "Spouse",
  child: "Child",
  other: "Other",
};

// ── Unit Calc Method Labels ─────────────────────────────────────────────────

export const UNIT_CALC_METHOD_LABELS: Record<UnitCalcMethod, string> = {
  cms: "CMS (Medicare/Medicaid)",
  ama: "AMA (Commercial)",
};

// ── Insurance Priority Labels ───────────────────────────────────────────────

export const PRIORITY_LABELS: Record<number, string> = {
  1: "Primary",
  2: "Secondary",
  3: "Tertiary",
};

// ── ABA CPT Codes ───────────────────────────────────────────────────────────

export const ABA_CPT_CODES = {
  "97151": {
    description: "Behavior identification assessment",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 32,
    isAssessment: true,
  },
  "97152": {
    description: "Behavior identification supporting assessment",
    provider: "RBT under QHP",
    maxUnitsPerDay: 16,
    isAssessment: true,
  },
  "97153": {
    description: "Adaptive behavior treatment by protocol (1:1 direct therapy)",
    provider: "RBT under QHP",
    maxUnitsPerDay: 32,
    isAssessment: false,
  },
  "97154": {
    description: "Group adaptive behavior treatment by protocol (2–8 patients)",
    provider: "RBT under QHP",
    maxUnitsPerDay: 18,
    isAssessment: false,
  },
  "97155": {
    description: "Adaptive behavior treatment with protocol modification",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 24,
    isAssessment: false,
  },
  "97156": {
    description: "Family adaptive behavior treatment guidance (caregiver training)",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 16,
    isAssessment: false,
  },
  "97157": {
    description: "Multiple-family group treatment guidance",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 16,
    isAssessment: false,
  },
  "97158": {
    description: "Group treatment with protocol modification (2–8 patients)",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 16,
    isAssessment: false,
  },
  "0362T": {
    description: "Multi-technician behavior assessment for destructive behavior",
    provider: "QHP on-site",
    maxUnitsPerDay: 16,
    isAssessment: true,
    retirementDate: "2027-01-01",
  },
  "0373T": {
    description: "Multi-technician adaptive behavior treatment for destructive behavior",
    provider: "QHP on-site",
    maxUnitsPerDay: 32,
    isAssessment: false,
    retirementDate: "2027-01-01",
  },
} as const;

export type CptCode = keyof typeof ABA_CPT_CODES;

// ── Authorization Status Labels & Variants ──────────────────────────────────

export const AUTH_STATUS_LABELS: Record<AuthStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
  expired: "Expired",
  exhausted: "Exhausted",
};

export const AUTH_STATUS_VARIANT: Record<
  AuthStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  pending: "secondary",
  approved: "default",
  denied: "destructive",
  expired: "outline",
  exhausted: "outline",
};

// ── CPT Code Options (for select dropdowns) ────────────────────────────────

export const CPT_CODE_OPTIONS = Object.entries(ABA_CPT_CODES).map(([code, meta]) => ({
  value: code,
  label: `${code} — ${meta.description}`,
  shortLabel: code,
  maxUnitsPerDay: meta.maxUnitsPerDay,
}));

// ── Service Frequencies ─────────────────────────────────────────────────────

export const SERVICE_FREQUENCIES = ["daily", "weekly", "biweekly", "monthly", "as_needed"] as const;
export type ServiceFrequency = (typeof SERVICE_FREQUENCIES)[number];

export const SERVICE_FREQUENCY_LABELS: Record<ServiceFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
  as_needed: "As Needed",
};

// ── Credential Labels ──────────────────────────────────────────────────────

export const CREDENTIAL_LABELS: Record<CredentialType, string> = {
  bcba: "BCBA",
  bcba_d: "BCBA-D",
  bcaba: "BCaBA",
  rbt: "RBT",
  other: "Other",
};

// ── Provider Modifier Codes ─────────────────────────────────────────────────

export const CREDENTIAL_MODIFIERS: Record<string, string> = {
  rbt: "HM",
  bcaba: "HN",
  bcba: "HO",
  bcba_d: "HP",
};

/** CMS modifier ordering priority — credential first, telehealth second, etc. */
export const MODIFIER_PRIORITY: Record<string, number> = {
  // Tier 1: Credential (pricing) modifiers
  HM: 1, HN: 1, HO: 1, HP: 1,
  // Tier 2: Telehealth modifiers
  "95": 2, GT: 2,
  // Tier 3: Distinct service modifiers
  "59": 3, XE: 3, XP: 3, XS: 3, XU: 3,
  // Tier 4: Informational modifiers
  "76": 4, "77": 4, KX: 4,
};

/** Max modifiers per claim line (CMS 1500 form limit). */
export const MAX_MODIFIERS_PER_LINE = 4;

/** Additional modifiers available for manual selection by billing staff. */
export const ADDITIONAL_MODIFIER_OPTIONS = [
  { value: "59", label: "59 — Distinct Procedural Service" },
  { value: "XE", label: "XE — Separate Encounter" },
  { value: "XP", label: "XP — Separate Practitioner" },
  { value: "XS", label: "XS — Separate Structure" },
  { value: "XU", label: "XU — Unusual Non-Overlapping Service" },
  { value: "76", label: "76 — Repeat Procedure, Same Provider" },
  { value: "77", label: "77 — Repeat Procedure, Different Provider" },
  { value: "GT", label: "GT — Via Telehealth (legacy)" },
  { value: "KX", label: "KX — Medical Policy Requirements Met" },
] as const;

// ── Place of Service Labels ─────────────────────────────────────────────────

export const PLACE_OF_SERVICE_LABELS: Record<PlaceOfServiceCode, string> = {
  "02": "Telehealth (not patient home)",
  "03": "School",
  "10": "Telehealth (patient home)",
  "11": "Office/Clinic",
  "12": "Home",
  "99": "Other/Community",
};

// ── Unit / Time Conversion ─────────────────────────────────────────────────

/** Each billing unit = 15 minutes per CMS 8-minute rule */
export const MINUTES_PER_UNIT = 15;

/** Milliseconds in one day */
export const MS_PER_DAY = 86_400_000;

/** Convert billing units to hours */
export function unitsToHours(units: number): number {
  return (units * MINUTES_PER_UNIT) / 60;
}

// ── Authorization Alert Thresholds ──────────────────────────────────────────

export const AUTH_ALERT_THRESHOLDS = {
  EXPIRY_WARNING_DAYS: 30,
  UTILIZATION_WARNING_PCT: 80,
  UTILIZATION_CRITICAL_PCT: 95,
  UNDER_UTILIZATION_PCT: 50,
} as const;

// ── User Role Labels ────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: "Owner",
  admin: "Admin",
  bcba: "BCBA",
  bcaba: "BCaBA",
  rbt: "RBT",
  billing_staff: "Billing Staff",
};

export const ROLE_HIERARCHY = ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"] as const;

// ── Session Status Labels & Variants ────────────────────────────────────────

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No Show",
  flagged: "Flagged",
};

export const SESSION_STATUS_VARIANT: Record<
  SessionStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  scheduled: "secondary",
  completed: "default",
  cancelled: "outline",
  no_show: "destructive",
  flagged: "destructive",
};

// ── Valid Session Status Transitions ────────────────────────────────────────

export const VALID_SESSION_TRANSITIONS: Record<SessionStatus, readonly SessionStatus[]> = {
  scheduled: ["completed", "cancelled", "no_show"],
  completed: ["cancelled", "flagged"],
  cancelled: [],
  no_show: [],
  flagged: ["completed", "cancelled"],
};

// ── RBT Supervised CPT Codes (require supervisor for billing) ───────────────

export const RBT_SUPERVISED_CPT_CODES = ["97152", "97153", "97154"] as const;

// ── QHP-Only CPT Codes (RBTs and BCaBAs CANNOT bill these) ──────────────────
// These codes require a Qualified Healthcare Professional (BCBA/BCBA-D).
// Billing under RBT/BCaBA credentials results in claim denial.
// See: ABA Coding Coalition CPT-credential matching rules.

export const QHP_ONLY_CPT_CODES = ["97151", "97155", "97156", "97157", "97158"] as const;

/** Group therapy codes — multiple clients simultaneously, so overlapping sessions for the same provider are valid. */
export const GROUP_CPT_CODES = ["97154", "97157", "97158"] as const;

// ── Session Note Types ────────────────────────────────────────────────────────

export const NOTE_TYPES = [
  "97153_direct",
  "97155_modification",
  "97156_caregiver",
  "97151_assessment",
] as const;
export type NoteType = (typeof NOTE_TYPES)[number];

export const NOTE_TYPE_LABELS: Record<NoteType, string> = {
  "97153_direct": "Direct Therapy (97153)",
  "97155_modification": "Protocol Modification (97155)",
  "97156_caregiver": "Caregiver Training (97156)",
  "97151_assessment": "Assessment (97151)",
};

/** Map CPT codes to note types */
export const CPT_TO_NOTE_TYPE: Record<string, NoteType> = {
  "97153": "97153_direct",
  "97154": "97153_direct", // Group therapy uses same note structure as direct
  "97155": "97155_modification",
  "97156": "97156_caregiver",
  "97157": "97156_caregiver", // Group caregiver uses same note structure
  "97151": "97151_assessment",
  "97152": "97151_assessment", // Supporting assessment uses same structure
  "97158": "97155_modification", // Group protocol modification
};

// ── Session Note Statuses ─────────────────────────────────────────────────────

export const NOTE_STATUSES = ["draft", "signed", "cosigned", "locked"] as const;
export type NoteStatus = (typeof NOTE_STATUSES)[number];

export const NOTE_STATUS_LABELS: Record<NoteStatus, string> = {
  draft: "Draft",
  signed: "Signed",
  cosigned: "Co-signed",
  locked: "Locked",
};

export const NOTE_STATUS_VARIANT: Record<NoteStatus, "secondary" | "outline" | "default" | "destructive"> = {
  draft: "secondary",
  signed: "outline",
  cosigned: "default",
  locked: "default",
};

// ── Goal Progress Statuses (per-goal within a session note) ──────────────────

export const GOAL_PROGRESS_STATUSES = [
  "met",
  "partially_met",
  "not_met",
  "regression",
  "maintenance",
  "not_assessed",
] as const;
export type GoalProgressStatus = (typeof GOAL_PROGRESS_STATUSES)[number];

export const GOAL_PROGRESS_LABELS: Record<GoalProgressStatus, string> = {
  met: "Met",
  partially_met: "Partially Met",
  not_met: "Not Met",
  regression: "Regression",
  maintenance: "Maintenance",
  not_assessed: "Not Assessed",
};

export const GOAL_PROGRESS_VARIANT: Record<GoalProgressStatus, "default" | "secondary" | "outline" | "destructive"> = {
  met: "default",
  partially_met: "outline",
  not_met: "secondary",
  regression: "destructive",
  maintenance: "outline",
  not_assessed: "secondary",
};

// ── ABA Prompt Levels ─────────────────────────────────────────────────────────

export const PROMPT_LEVELS = ["FP", "PP", "M", "V", "G", "PO", "TX", "VS", "EC", "I"] as const;
export type PromptLevel = (typeof PROMPT_LEVELS)[number];

export const PROMPT_LEVEL_LABELS: Record<PromptLevel, string> = {
  FP: "Full Physical",
  PP: "Partial Physical",
  M: "Model",
  V: "Verbal",
  G: "Gestural",
  PO: "Positional",
  TX: "Textual",
  VS: "Visual",
  EC: "Echoic",
  I: "Independent",
};

// ── Measurement Types (per-goal data collection) ──────────────────────────────

export const MEASUREMENT_TYPES = [
  "discrete_trial",
  "frequency",
  "duration",
  "rate",
  "latency",
  "task_analysis",
  "interval",
  "other",
] as const;
export type MeasurementType = (typeof MEASUREMENT_TYPES)[number];

export const MEASUREMENT_TYPE_LABELS: Record<MeasurementType, string> = {
  discrete_trial: "Discrete Trial",
  frequency: "Frequency Count",
  duration: "Duration",
  rate: "Rate",
  latency: "Latency",
  task_analysis: "Task Analysis",
  interval: "Interval Recording",
  other: "Other",
};

// ── ABA Techniques ────────────────────────────────────────────────────────────

export const ABA_TECHNIQUES = [
  "dtt",
  "net",
  "incidental_teaching",
  "pivotal_response",
  "fluency_training",
  "chaining_forward",
  "chaining_backward",
  "shaping",
  "task_analysis",
  "modeling",
  "prompting",
  "fading",
  "reinforcement",
  "extinction",
  "dra",
  "dri",
  "dro",
  "functional_communication",
  "social_skills_training",
  "self_management",
  "video_modeling",
  "visual_supports",
  "token_economy",
  "other",
] as const;
export type AbaTechnique = (typeof ABA_TECHNIQUES)[number];

export const ABA_TECHNIQUE_LABELS: Record<AbaTechnique, string> = {
  dtt: "Discrete Trial Training (DTT)",
  net: "Natural Environment Teaching (NET)",
  incidental_teaching: "Incidental Teaching",
  pivotal_response: "Pivotal Response Training (PRT)",
  fluency_training: "Fluency Training",
  chaining_forward: "Forward Chaining",
  chaining_backward: "Backward Chaining",
  shaping: "Shaping",
  task_analysis: "Task Analysis",
  modeling: "Modeling",
  prompting: "Prompting",
  fading: "Fading",
  reinforcement: "Reinforcement",
  extinction: "Extinction",
  dra: "DRA (Differential Reinforcement of Alt.)",
  dri: "DRI (Differential Reinforcement of Incompat.)",
  dro: "DRO (Differential Reinforcement of Other)",
  functional_communication: "Functional Communication Training (FCT)",
  social_skills_training: "Social Skills Training",
  self_management: "Self-Management",
  video_modeling: "Video Modeling",
  visual_supports: "Visual Supports",
  token_economy: "Token Economy",
  other: "Other",
};

// ── Behavior Intensity ────────────────────────────────────────────────────────

export const BEHAVIOR_INTENSITIES = ["mild", "moderate", "severe"] as const;
export type BehaviorIntensity = (typeof BEHAVIOR_INTENSITIES)[number];

export const BEHAVIOR_INTENSITY_LABELS: Record<BehaviorIntensity, string> = {
  mild: "Mild",
  moderate: "Moderate",
  severe: "Severe",
};

// ── Caregiver Relationships (for 97156 notes) ────────────────────────────────

export const CAREGIVER_RELATIONSHIPS = [
  "mother",
  "father",
  "parent",
  "grandparent",
  "sibling",
  "teacher",
  "aide",
  "other",
] as const;
export type CaregiverRelationship = (typeof CAREGIVER_RELATIONSHIPS)[number];

export const CAREGIVER_RELATIONSHIP_LABELS: Record<CaregiverRelationship, string> = {
  mother: "Mother",
  father: "Father",
  parent: "Parent/Guardian",
  grandparent: "Grandparent",
  sibling: "Sibling",
  teacher: "Teacher",
  aide: "Aide",
  other: "Other",
};

// ── Assessment Tools (for 97151 notes) ────────────────────────────────────────

export const ASSESSMENT_TOOLS = [
  "VB-MAPP",
  "ABLLS-R",
  "AFLS",
  "Vineland-3",
  "PEAK",
  "ESDM Curriculum",
  "FBA",
  "FA",
  "FAST",
  "MAS",
  "Other",
] as const;
