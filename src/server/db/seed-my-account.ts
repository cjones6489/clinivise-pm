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

  console.log("\n✅ Done! Seeded under your account:");
  console.log("   4 providers, 4 payers, 8 clients, 8 authorizations, 40 sessions");
  console.log("   Log in as cjones6489@gmail.com to see the data.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
