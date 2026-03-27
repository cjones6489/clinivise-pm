/**
 * Seed script: Populate YOUR account with realistic ABA practice data
 *
 * Run: pnpm exec tsx src/server/db/seed-my-account.ts
 *
 * Uses your real Clerk org + user IDs so data appears when you log in.
 * Idempotent — safe to re-run.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

// ---------------------------------------------------------------------------
// Your real IDs
// ---------------------------------------------------------------------------

const ORG_ID = "lrMquvZAi_JLLXXoTLqnV";
const USER_OWNER_ID = "OmOKVfzaU74GvokciLGai";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function relDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split("T")[0]!;
}

function makeTimestamp(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

// ---------------------------------------------------------------------------
// Fixed IDs (enables idempotency)
// ---------------------------------------------------------------------------

const PROV_BCBA = "prov_my_bcba_sarah";
const PROV_BCBA2 = "prov_my_bcba_marcus";
const PROV_RBT1 = "prov_my_rbt_david";
const PROV_RBT2 = "prov_my_rbt_jessica";

const PAYER_BCBS = "payer_my_bcbs";
const PAYER_AETNA = "payer_my_aetna";
const PAYER_UHC = "payer_my_uhc";
const PAYER_MEDICAID = "payer_my_medicaid";

const clients = [
  {
    id: "cl_my_01",
    first: "Ethan",
    last: "Miller",
    dob: "2018-03-15",
    gender: "M" as const,
    guardian: "Rebecca Miller",
    payerId: PAYER_BCBS,
    rbt: PROV_RBT1,
  },
  {
    id: "cl_my_02",
    first: "Sophia",
    last: "Garcia",
    dob: "2019-07-22",
    gender: "F" as const,
    guardian: "Maria Garcia",
    payerId: PAYER_AETNA,
    rbt: PROV_RBT2,
  },
  {
    id: "cl_my_03",
    first: "Liam",
    last: "Johnson",
    dob: "2017-11-03",
    gender: "M" as const,
    guardian: "Tanya Johnson",
    payerId: PAYER_UHC,
    rbt: PROV_RBT1,
  },
  {
    id: "cl_my_04",
    first: "Olivia",
    last: "Thompson",
    dob: "2020-01-18",
    gender: "F" as const,
    guardian: "Marcus Thompson",
    payerId: PAYER_MEDICAID,
    rbt: PROV_RBT2,
  },
  {
    id: "cl_my_05",
    first: "Noah",
    last: "Williams",
    dob: "2018-09-05",
    gender: "M" as const,
    guardian: "Jordan Williams",
    payerId: PAYER_BCBS,
    rbt: PROV_RBT1,
  },
  {
    id: "cl_my_06",
    first: "Emma",
    last: "Rodriguez",
    dob: "2019-04-12",
    gender: "F" as const,
    guardian: "Carlos Rodriguez",
    payerId: PAYER_AETNA,
    rbt: PROV_RBT2,
  },
  {
    id: "cl_my_07",
    first: "Aiden",
    last: "Chen",
    dob: "2016-12-28",
    gender: "M" as const,
    guardian: "Lisa Chen",
    payerId: PAYER_UHC,
    rbt: PROV_RBT1,
  },
  {
    id: "cl_my_08",
    first: "Isabella",
    last: "Patel",
    dob: "2020-06-09",
    gender: "F" as const,
    guardian: "Priya Patel",
    payerId: PAYER_MEDICAID,
    rbt: PROV_RBT2,
  },
];

// Auth profiles — mix of states
const authProfiles = [
  { startOff: -120, endOff: 60, usedPct: 0.55, status: "approved" }, // active, healthy
  { startOff: -90, endOff: 90, usedPct: 0.4, status: "approved" }, // active, healthy
  { startOff: -150, endOff: 30, usedPct: 0.7, status: "approved" }, // active, moderate
  { startOff: -60, endOff: 120, usedPct: 0.25, status: "approved" }, // active, early
  { startOff: -170, endOff: 10, usedPct: 0.85, status: "approved" }, // expiring soon, high util
  { startOff: -175, endOff: 5, usedPct: 0.92, status: "approved" }, // expiring very soon, critical
  { startOff: -210, endOff: -10, usedPct: 0.78, status: "approved" }, // expired
  { startOff: -180, endOff: 0, usedPct: 1.0, status: "approved" }, // exhausted
];

// ---------------------------------------------------------------------------

async function seed() {
  console.log("🌱 Seeding data under your account...\n");

  // Update org name
  console.log("  Updating org...");
  await db
    .update(schema.organizations)
    .set({
      name: "Bright Futures ABA",
      npi: "1234567893",
      taxId: "74-1234567",
      taxonomyCode: "103K00000X",
      phone: "(512) 555-0100",
      addressLine1: "100 Congress Ave, Suite 200",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
    })
    .where(eq(schema.organizations.id, ORG_ID));

  // Providers
  console.log("  Providers...");
  await db
    .insert(schema.providers)
    .values([
      {
        id: PROV_BCBA,
        organizationId: ORG_ID,
        userId: USER_OWNER_ID,
        firstName: "Sarah",
        lastName: "Chen",
        credentialType: "bcba_d",
        npi: "1111111112",
        credentialNumber: "BCBA-D-12345",
        credentialExpiry: relDate(365),
        modifierCode: "HP",
      },
      {
        id: PROV_BCBA2,
        organizationId: ORG_ID,
        firstName: "Marcus",
        lastName: "Wright",
        credentialType: "bcba",
        npi: "2222222223",
        credentialNumber: "BCBA-67890",
        credentialExpiry: relDate(200),
        supervisorId: PROV_BCBA,
        modifierCode: "HO",
      },
      {
        id: PROV_RBT1,
        organizationId: ORG_ID,
        firstName: "David",
        lastName: "Park",
        credentialType: "rbt",
        credentialNumber: "RBT-11111",
        credentialExpiry: relDate(180),
        supervisorId: PROV_BCBA,
        modifierCode: "HM",
      },
      {
        id: PROV_RBT2,
        organizationId: ORG_ID,
        firstName: "Jessica",
        lastName: "Torres",
        credentialType: "rbt",
        credentialNumber: "RBT-22222",
        credentialExpiry: relDate(90),
        supervisorId: PROV_BCBA2,
        modifierCode: "HM",
      },
    ])
    .onConflictDoNothing();

  // Payers
  console.log("  Payers...");
  await db
    .insert(schema.payers)
    .values([
      {
        id: PAYER_BCBS,
        organizationId: ORG_ID,
        name: "Blue Cross Blue Shield of Texas",
        payerType: "commercial",
        timelyFilingDays: 90,
        unitCalcMethod: "ama",
      },
      {
        id: PAYER_AETNA,
        organizationId: ORG_ID,
        name: "Aetna",
        payerType: "commercial",
        timelyFilingDays: 90,
        unitCalcMethod: "ama",
      },
      {
        id: PAYER_UHC,
        organizationId: ORG_ID,
        name: "UnitedHealthcare",
        payerType: "commercial",
        timelyFilingDays: 120,
        unitCalcMethod: "ama",
      },
      {
        id: PAYER_MEDICAID,
        organizationId: ORG_ID,
        name: "Texas Medicaid (HHSC)",
        payerType: "medicaid",
        timelyFilingDays: 365,
        unitCalcMethod: "cms",
      },
    ])
    .onConflictDoNothing();

  // Clients
  console.log("  Clients...");
  for (const c of clients) {
    await db
      .insert(schema.clients)
      .values({
        id: c.id,
        organizationId: ORG_ID,
        firstName: c.first,
        lastName: c.last,
        dateOfBirth: c.dob,
        gender: c.gender,
        phone: `(512) 555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        diagnosisCode: "F84.0",
        diagnosisDescription: "Autism Spectrum Disorder",
        status: "active",
        addressLine1: `${Math.floor(Math.random() * 999) + 100} Oak St`,
        city: "Austin",
        state: "TX",
        zipCode: "78701",
      })
      .onConflictDoNothing();

    // Guardian contact
    const guardianParts = c.guardian.split(" ");
    await db
      .insert(schema.clientContacts)
      .values({
        id: `contact_my_${c.id}`,
        organizationId: ORG_ID,
        clientId: c.id,
        firstName: guardianParts[0]!,
        lastName: guardianParts[1]!,
        relationship: "mother",
        phone: `(512) 555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        isLegalGuardian: true,
        isEmergencyContact: true,
        isBillingResponsible: true,
        canReceivePhi: true,
        canPickup: true,
        livesWithClient: true,
        priority: 1,
      })
      .onConflictDoNothing();

    // Insurance
    await db
      .insert(schema.clientInsurance)
      .values({
        id: `ins_my_${c.id}`,
        organizationId: ORG_ID,
        clientId: c.id,
        payerId: c.payerId,
        memberId: `MEM${String(Math.floor(Math.random() * 900000) + 100000)}`,
        groupNumber: `GRP-${Math.floor(Math.random() * 90000) + 10000}`,
        subscriberFirstName: guardianParts[0]!,
        subscriberLastName: guardianParts[1]!,
        relationshipToSubscriber: "child",
        priority: 1,
      })
      .onConflictDoNothing();
  }

  // Care team assignments
  console.log("  Care team assignments...");
  for (const c of clients) {
    // Supervising BCBA (primary)
    await db
      .insert(schema.clientProviders)
      .values({
        id: `cp_my_bcba_${c.id}`,
        organizationId: ORG_ID,
        clientId: c.id,
        providerId: PROV_BCBA,
        role: "supervising_bcba",
        isPrimary: true,
        startDate: relDate(-120),
      })
      .onConflictDoNothing();

    // RBT (direct service)
    await db
      .insert(schema.clientProviders)
      .values({
        id: `cp_my_rbt_${c.id}`,
        organizationId: ORG_ID,
        clientId: c.id,
        providerId: c.rbt,
        role: "rbt",
        isPrimary: false,
        startDate: relDate(-120),
      })
      .onConflictDoNothing();
  }

  // Authorizations + service lines
  console.log("  Authorizations...");
  for (let i = 0; i < clients.length; i++) {
    const c = clients[i]!;
    const p = authProfiles[i % authProfiles.length]!;
    const authId = `auth_my_${c.id}`;
    const approved97153 = 120;
    const approved97155 = 20;
    const used97153 = Math.round(approved97153 * p.usedPct);
    const used97155 = Math.round(approved97155 * p.usedPct);

    await db
      .insert(schema.authorizations)
      .values({
        id: authId,
        organizationId: ORG_ID,
        clientId: c.id,
        payerId: c.payerId,
        clientInsuranceId: `ins_my_${c.id}`,
        authorizationNumber: `AUTH-2026-${String(1000 + i).slice(-4)}`,
        status: p.status,
        startDate: relDate(p.startOff),
        endDate: relDate(p.endOff),
        diagnosisCode: "F84.0",
      })
      .onConflictDoNothing();

    await db
      .insert(schema.authorizationServices)
      .values([
        {
          id: `asvc_my_${c.id}_97153`,
          organizationId: ORG_ID,
          authorizationId: authId,
          cptCode: "97153",
          approvedUnits: approved97153,
          usedUnits: used97153,
          frequency: "weekly",
          maxUnitsPerDay: 32,
        },
        {
          id: `asvc_my_${c.id}_97155`,
          organizationId: ORG_ID,
          authorizationId: authId,
          cptCode: "97155",
          approvedUnits: approved97155,
          usedUnits: used97155,
          frequency: "monthly",
          maxUnitsPerDay: 24,
        },
      ])
      .onConflictDoNothing();
  }

  // Sessions — 5 per client over the last 2 weeks
  console.log("  Sessions...");
  const sessionDays = [-1, -3, -5, -8, -10];
  for (const c of clients) {
    const authId = `auth_my_${c.id}`;
    const authSvcId = `asvc_my_${c.id}_97153`;

    for (let s = 0; s < 5; s++) {
      const date = relDate(sessionDays[s]!);
      const sessionId = `sess_my_${c.id}_${s}`;
      const startHour = 9 + Math.floor(Math.random() * 3);
      const duration = [2, 3, 3, 4, 2][s]!;
      const endHour = startHour + duration;
      const units = duration * 4; // 4 units per hour

      await db
        .insert(schema.sessions)
        .values({
          id: sessionId,
          organizationId: ORG_ID,
          clientId: c.id,
          providerId: c.rbt,
          supervisorId: PROV_BCBA,
          authorizationId: authId,
          authorizationServiceId: authSvcId,
          sessionDate: date,
          startTime: makeTimestamp(date, `${String(startHour).padStart(2, "0")}:00`),
          endTime: makeTimestamp(date, `${String(endHour).padStart(2, "0")}:00`),
          cptCode: "97153",
          modifierCodes: ["HM"],
          units,
          actualMinutes: duration * 60,
          unitCalcMethod: "ama",
          placeOfService: "12",
          status: s === 4 && c.id === "cl_my_03" ? "flagged" : "completed",
        })
        .onConflictDoNothing();
    }
  }

  // ── Goal Domains ──────────────────────────────────────────────────────────
  console.log("  Goal domains...");
  const DOMAIN_COMM = "dom_my_communication";
  const DOMAIN_SOCIAL = "dom_my_social";
  const DOMAIN_ADAPTIVE = "dom_my_adaptive";
  const DOMAIN_BEHAVIOR = "dom_my_behavior";
  const DOMAIN_SELFCARE = "dom_my_selfcare";

  const domains = [
    { id: DOMAIN_COMM, name: "Communication", sortOrder: 0 },
    { id: DOMAIN_SOCIAL, name: "Social Skills", sortOrder: 1 },
    { id: DOMAIN_ADAPTIVE, name: "Adaptive Behavior", sortOrder: 2 },
    { id: DOMAIN_BEHAVIOR, name: "Behavior Reduction", sortOrder: 3 },
    { id: DOMAIN_SELFCARE, name: "Self-Care", sortOrder: 4 },
  ];

  for (const d of domains) {
    await db
      .insert(schema.goalDomains)
      .values({ ...d, organizationId: ORG_ID, isDefault: true })
      .onConflictDoNothing();
  }

  // ── Goals + Objectives (for first 3 clients) ────────────────────────────
  console.log("  Goals & objectives...");

  // Client 1: Ethan Miller — 4 goals across 3 domains
  const ethanGoals = [
    {
      id: "goal_my_01",
      clientId: "cl_my_01",
      domainId: DOMAIN_COMM,
      goalNumber: 1,
      title: "Manding for preferred items",
      description: "Given natural environment, client will independently mand for 15+ items using 2-word phrases with 80% accuracy across 3 consecutive sessions.",
      protocol: "Use NET during play. Present 3-second time delay before prompting. Reinforce with preferred edible on VR3 schedule. Record each mand opportunity.",
      goalType: "skill_acquisition",
      status: "active",
      masteryCriteria: "80% across 3 consecutive sessions",
      baselineData: "20% accuracy at intake assessment",
      targetBehavior: "Independent manding using 2+ word phrases",
      assessmentSource: "vb_mapp",
      assessmentItemRef: "Mand Level 2, M8",
      startDate: relDate(-90),
      targetDate: relDate(90),
    },
    {
      id: "goal_my_02",
      clientId: "cl_my_01",
      domainId: DOMAIN_COMM,
      goalNumber: 2,
      title: "Tacting common objects",
      description: "Client will independently tact 25 common objects when presented with 90% accuracy.",
      protocol: "DTT with picture cards. Present stimulus, wait 3 seconds. Score as independent or prompted. Use token board (5 tokens = 2 min iPad).",
      goalType: "skill_acquisition",
      status: "mastered",
      masteryCriteria: "90% across 3 sessions with 2 different therapists",
      baselineData: "40% at intake",
      startDate: relDate(-120),
      metDate: relDate(-15),
      assessmentSource: "vb_mapp",
      assessmentItemRef: "Tact Level 2, T6",
    },
    {
      id: "goal_my_03",
      clientId: "cl_my_01",
      domainId: DOMAIN_SOCIAL,
      goalNumber: 3,
      title: "Gross motor imitation",
      description: "Client will imitate 10 gross motor actions with 80% accuracy across 20 trials.",
      goalType: "skill_acquisition",
      status: "maintenance",
      masteryCriteria: "80% across 20 trials",
      baselineData: "30% at intake",
      startDate: relDate(-150),
    },
    {
      id: "goal_my_04",
      clientId: "cl_my_01",
      domainId: DOMAIN_BEHAVIOR,
      goalNumber: 4,
      title: "Reduce elopement",
      description: "Client will reduce elopement to fewer than 1 occurrence per session across 5 consecutive sessions.",
      protocol: "Use antecedent strategies: 2-min and 1-min transition warnings, visual timer. On elopement: block/redirect within 5 seconds, re-present demand after 10-sec delay. Record frequency per session.",
      goalType: "behavior_reduction",
      status: "active",
      masteryCriteria: "<1 occurrence per session across 5 sessions",
      baselineData: "3-5 occurrences per 2-hour session",
      functionOfBehavior: "escape",
      severityLevel: "moderate",
      operationalDefinition: "Client leaves assigned area by moving more than 3 feet away without permission during structured or semi-structured activities.",
      replacementBehavior: "Verbal request for break using communication board or 2-word phrase",
      antecedentStrategies: "2-min and 1-min countdown timers before transitions. Choice board for next activity. Preferred activity available after demand compliance.",
      consequenceStrategies: "Block and redirect within 5 seconds. 10-second response delay. Re-present demand. Reinforce compliance on FR1.",
      crisisProtocol: "If client reaches door or exits building: follow at safe distance, do not chase. Radio for support. Guide back to area when calm. Document incident.",
      startDate: relDate(-60),
      targetDate: relDate(120),
    },
  ];

  for (const g of ethanGoals) {
    await db
      .insert(schema.clientGoals)
      .values({ ...g, organizationId: ORG_ID })
      .onConflictDoNothing();
  }

  // Objectives for Ethan's goals
  const ethanObjectives = [
    // Goal 1: Manding — 3 objectives
    { id: "obj_my_01", goalId: "goal_my_01", objectiveNumber: 1, description: "Request 3+ preferred edibles using 2-word phrases with 80% independence across 20 trials", status: "active", masteryCriteria: "80% across 20 trials", currentPerformance: "75% (Mar 26)", dataCollectionType: "dtt" },
    { id: "obj_my_02", goalId: "goal_my_01", objectiveNumber: 2, description: "Request 3+ preferred toys using 2-word phrases with 80% independence", status: "met", masteryCriteria: "80% across 20 trials", metDate: relDate(-10), dataCollectionType: "dtt" },
    { id: "obj_my_03", goalId: "goal_my_01", objectiveNumber: 3, description: "Request preferred items during transitions between activities", status: "baseline", masteryCriteria: "80% across 3 sessions", dataCollectionType: "frequency" },
    // Goal 2: Tacting — 2 objectives (both met)
    { id: "obj_my_04", goalId: "goal_my_02", objectiveNumber: 1, description: "Tact 15 common household objects", status: "met", metDate: relDate(-30), dataCollectionType: "dtt" },
    { id: "obj_my_05", goalId: "goal_my_02", objectiveNumber: 2, description: "Tact 10 outdoor/community objects", status: "met", metDate: relDate(-15), dataCollectionType: "dtt" },
    // Goal 3: Imitation — 2 objectives
    { id: "obj_my_06", goalId: "goal_my_03", objectiveNumber: 1, description: "Imitate 5 single-step gross motor actions (clap, wave, stomp)", status: "met", metDate: relDate(-45), dataCollectionType: "dtt" },
    { id: "obj_my_07", goalId: "goal_my_03", objectiveNumber: 2, description: "Imitate 5 two-step gross motor sequences", status: "active", masteryCriteria: "80% across 20 trials", currentPerformance: "65%", dataCollectionType: "dtt" },
    // Goal 4: Elopement — 1 objective
    { id: "obj_my_08", goalId: "goal_my_04", objectiveNumber: 1, description: "Request break verbally instead of eloping from demanding tasks", status: "active", masteryCriteria: "Verbal break request on 80% of escape-motivated occasions", currentPerformance: "40% of opportunities", dataCollectionType: "frequency" },
  ];

  for (const o of ethanObjectives) {
    await db
      .insert(schema.clientGoalObjectives)
      .values({ ...o, organizationId: ORG_ID, sortOrder: o.objectiveNumber })
      .onConflictDoNothing();
  }

  // Client 2: Sophia Garcia — 3 goals
  const sophiaGoals = [
    {
      id: "goal_my_05",
      clientId: "cl_my_02",
      domainId: DOMAIN_COMM,
      goalNumber: 1,
      title: "Receptive language — following 2-step instructions",
      description: "Client will follow 2-step unrelated instructions with 80% accuracy across 3 consecutive sessions.",
      protocol: "Present instructions during play routines. Wait 5 seconds before prompting. Use least-to-most prompting. Reinforce with social praise + access to preferred activity.",
      goalType: "skill_acquisition",
      status: "active",
      masteryCriteria: "80% across 3 consecutive sessions",
      baselineData: "35% at intake",
      startDate: relDate(-75),
      targetDate: relDate(105),
      assessmentSource: "ablls_r",
      assessmentItemRef: "Section C: Receptive Language, C14",
    },
    {
      id: "goal_my_06",
      clientId: "cl_my_02",
      domainId: DOMAIN_SELFCARE,
      goalNumber: 2,
      title: "Tooth brushing independence",
      description: "Client will independently complete all 12 steps of tooth brushing task analysis.",
      protocol: "Forward chaining. Physically prompt remaining steps after last independent step. Fade prompts one step at a time. Use visual schedule at sink.",
      goalType: "skill_acquisition",
      status: "active",
      masteryCriteria: "12/12 steps independent across 3 consecutive days",
      baselineData: "5/12 steps independent",
      startDate: relDate(-45),
      targetDate: relDate(135),
    },
    {
      id: "goal_my_07",
      clientId: "cl_my_02",
      domainId: DOMAIN_BEHAVIOR,
      goalNumber: 3,
      title: "Reduce tantrum duration",
      description: "Client will reduce tantrum duration to under 2 minutes per occurrence across 5 consecutive sessions.",
      goalType: "behavior_reduction",
      status: "active",
      masteryCriteria: "<2 min average duration across 5 sessions",
      baselineData: "Average 8 min per occurrence",
      functionOfBehavior: "tangible",
      severityLevel: "mild",
      operationalDefinition: "Crying, screaming, or dropping to the floor lasting more than 30 seconds, occurring when access to preferred item/activity is denied.",
      replacementBehavior: "Verbal request using 'I want [item]' or 'Can I have [item]'",
      startDate: relDate(-30),
      targetDate: relDate(150),
    },
  ];

  for (const g of sophiaGoals) {
    await db
      .insert(schema.clientGoals)
      .values({ ...g, organizationId: ORG_ID })
      .onConflictDoNothing();
  }

  const sophiaObjectives = [
    { id: "obj_my_09", goalId: "goal_my_05", objectiveNumber: 1, description: "Follow 2-step related instructions (e.g., 'get your shoes and put them on')", status: "met", metDate: relDate(-20), dataCollectionType: "dtt" },
    { id: "obj_my_10", goalId: "goal_my_05", objectiveNumber: 2, description: "Follow 2-step unrelated instructions (e.g., 'clap your hands and touch your nose')", status: "active", masteryCriteria: "80% across 20 trials", currentPerformance: "60%", dataCollectionType: "dtt" },
    { id: "obj_my_11", goalId: "goal_my_06", objectiveNumber: 1, description: "Complete steps 1-6 independently (get brush, wet, paste, brush front, brush sides, brush top)", status: "active", masteryCriteria: "6/6 steps across 3 days", currentPerformance: "5/6 steps", dataCollectionType: "task_analysis" },
    { id: "obj_my_12", goalId: "goal_my_06", objectiveNumber: 2, description: "Complete steps 7-12 independently (brush tongue, spit, rinse, rinse brush, replace brush, wipe face)", status: "baseline", dataCollectionType: "task_analysis" },
    { id: "obj_my_13", goalId: "goal_my_07", objectiveNumber: 1, description: "Use verbal request when preferred item is visible but out of reach", status: "active", masteryCriteria: "80% of opportunities", currentPerformance: "55%", dataCollectionType: "frequency" },
  ];

  for (const o of sophiaObjectives) {
    await db
      .insert(schema.clientGoalObjectives)
      .values({ ...o, organizationId: ORG_ID, sortOrder: o.objectiveNumber })
      .onConflictDoNothing();
  }

  // Client 3: Liam Johnson — 2 goals (one met)
  const liamGoals = [
    {
      id: "goal_my_08",
      clientId: "cl_my_03",
      domainId: DOMAIN_ADAPTIVE,
      goalNumber: 1,
      title: "Independent snack preparation",
      description: "Client will independently prepare a simple snack (crackers with cheese, fruit in bowl) completing all steps of task analysis.",
      goalType: "skill_acquisition",
      status: "active",
      masteryCriteria: "All steps independent across 3 different snacks",
      baselineData: "Requires full physical prompt for 6 of 8 steps",
      startDate: relDate(-60),
      targetDate: relDate(120),
    },
    {
      id: "goal_my_09",
      clientId: "cl_my_03",
      domainId: DOMAIN_SOCIAL,
      goalNumber: 2,
      title: "Parallel play with peers",
      description: "Client will engage in parallel play alongside a peer for 5+ minutes without adult prompting.",
      goalType: "skill_acquisition",
      status: "met",
      masteryCriteria: "5+ min parallel play in 4 of 5 opportunities",
      baselineData: "<1 min before leaving play area",
      startDate: relDate(-120),
      metDate: relDate(-20),
    },
  ];

  for (const g of liamGoals) {
    await db
      .insert(schema.clientGoals)
      .values({ ...g, organizationId: ORG_ID })
      .onConflictDoNothing();
  }

  const liamObjectives = [
    { id: "obj_my_14", goalId: "goal_my_08", objectiveNumber: 1, description: "Retrieve snack items from designated shelf/fridge independently", status: "met", metDate: relDate(-25), dataCollectionType: "task_analysis" },
    { id: "obj_my_15", goalId: "goal_my_08", objectiveNumber: 2, description: "Prepare crackers with cheese using 6-step task analysis", status: "active", masteryCriteria: "6/6 steps across 3 days", currentPerformance: "4/6 steps", dataCollectionType: "task_analysis" },
    { id: "obj_my_16", goalId: "goal_my_09", objectiveNumber: 1, description: "Sit near peer with shared materials for 3+ minutes", status: "met", metDate: relDate(-40), dataCollectionType: "duration" },
    { id: "obj_my_17", goalId: "goal_my_09", objectiveNumber: 2, description: "Engage with own materials near peer for 5+ minutes", status: "met", metDate: relDate(-20), dataCollectionType: "duration" },
  ];

  for (const o of liamObjectives) {
    await db
      .insert(schema.clientGoalObjectives)
      .values({ ...o, organizationId: ORG_ID, sortOrder: o.objectiveNumber })
      .onConflictDoNothing();
  }

  console.log("\n✅ Done! Seeded under your account:");
  console.log("   4 providers, 4 payers, 8 clients, 8 authorizations, 40 sessions");
  console.log("   5 goal domains, 9 goals (7 SA + 2 BR), 17 objectives");
  console.log("   Log in as cjones6489@gmail.com to see the data.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
