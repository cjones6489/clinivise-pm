/**
 * Seed script: "Bright Futures ABA" practice
 *
 * Run: pnpm exec tsx src/server/db/seed.ts
 *
 * Idempotent — safe to re-run. Uses fixed IDs and ON CONFLICT DO NOTHING.
 * Generates dates relative to today so data always looks current.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/neon-serverless";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const db = drizzle(DATABASE_URL, { schema });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Date relative to today: daysFromToday(-30) = 30 days ago */
function relDate(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split("T")[0]!;
}

/** Timestamp relative to today */
function relTimestamp(daysFromToday: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d;
}

/** Create a timestamp for a given date + time string */
function makeTimestamp(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

// ---------------------------------------------------------------------------
// Fixed IDs (enables idempotency via ON CONFLICT DO NOTHING)
// ---------------------------------------------------------------------------

const ORG_ID = "org_seed_bright_futures";
const CLERK_ORG_ID = "org_dev_seed";

// Users
const USER_OWNER = "user_seed_owner";
const USER_BCBA = "user_seed_bcba";
const USER_RBT1 = "user_seed_rbt1";
const USER_RBT2 = "user_seed_rbt2";

// Providers
const PROV_BCBA = "prov_seed_bcba";
const PROV_BCBA_D = "prov_seed_bcba_d";
const PROV_RBT1 = "prov_seed_rbt1";
const PROV_RBT2 = "prov_seed_rbt2";

// Payers
const PAYER_BCBS = "payer_seed_bcbs";
const PAYER_AETNA = "payer_seed_aetna";
const PAYER_UHC = "payer_seed_uhc";
const PAYER_MEDICAID = "payer_seed_medicaid";

// Clients (10)
const CLIENT_IDS = Array.from({ length: 10 }, (_, i) => `client_seed_${i + 1}`);

// Contacts (1 per client)
const CONTACT_IDS = Array.from({ length: 10 }, (_, i) => `contact_seed_${i + 1}`);

// Insurance (1 per client)
const INS_IDS = Array.from({ length: 10 }, (_, i) => `ins_seed_${i + 1}`);

// Authorizations (10 — varying states)
const AUTH_IDS = Array.from({ length: 10 }, (_, i) => `auth_seed_${i + 1}`);

// Authorization services (1-2 per auth)
const AUTH_SVC_IDS = Array.from({ length: 15 }, (_, i) => `authsvc_seed_${i + 1}`);

// Sessions (60)
const SESSION_IDS = Array.from({ length: 60 }, (_, i) => `session_seed_${String(i + 1).padStart(2, "0")}`);

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const clientData = [
  { first: "Ethan", last: "Miller", dob: "2018-03-15", gender: "M" as const, guardian: { first: "Rebecca", last: "Miller", rel: "mother" as const }, city: "Austin", state: "TX" },
  { first: "Sophia", last: "Garcia", dob: "2019-07-22", gender: "F" as const, guardian: { first: "Maria", last: "Garcia", rel: "mother" as const }, city: "Austin", state: "TX" },
  { first: "Liam", last: "Johnson", dob: "2017-11-03", gender: "M" as const, guardian: { first: "Tanya", last: "Johnson", rel: "mother" as const }, city: "Round Rock", state: "TX" },
  { first: "Olivia", last: "Thompson", dob: "2020-01-18", gender: "F" as const, guardian: { first: "Marcus", last: "Thompson", rel: "father" as const }, city: "Cedar Park", state: "TX" },
  { first: "Noah", last: "Williams", dob: "2018-09-05", gender: "M" as const, guardian: { first: "Jordan", last: "Williams", rel: "mother" as const }, city: "Austin", state: "TX" },
  { first: "Emma", last: "Rodriguez", dob: "2019-04-12", gender: "F" as const, guardian: { first: "Carlos", last: "Rodriguez", rel: "father" as const }, city: "Pflugerville", state: "TX" },
  { first: "Aiden", last: "Chen", dob: "2016-12-28", gender: "M" as const, guardian: { first: "Lisa", last: "Chen", rel: "mother" as const }, city: "Austin", state: "TX" },
  { first: "Isabella", last: "Patel", dob: "2020-06-09", gender: "F" as const, guardian: { first: "Priya", last: "Patel", rel: "mother" as const }, city: "Georgetown", state: "TX" },
  { first: "Mason", last: "Kim", dob: "2017-08-14", gender: "M" as const, guardian: { first: "Soo-Jin", last: "Kim", rel: "mother" as const }, city: "Austin", state: "TX" },
  { first: "Ava", last: "Davis", dob: "2019-02-27", gender: "F" as const, guardian: { first: "Michael", last: "Davis", rel: "father" as const }, city: "Leander", state: "TX" },
];

// Assign each client a payer rotation and a provider (RBT1 or RBT2), BCBA supervises all
const payerRotation = [PAYER_BCBS, PAYER_AETNA, PAYER_UHC, PAYER_MEDICAID, PAYER_BCBS, PAYER_AETNA, PAYER_UHC, PAYER_MEDICAID, PAYER_BCBS, PAYER_AETNA];
const rbtRotation = [PROV_RBT1, PROV_RBT2, PROV_RBT1, PROV_RBT2, PROV_RBT1, PROV_RBT2, PROV_RBT1, PROV_RBT2, PROV_RBT1, PROV_RBT2];

// Auth states: 0-3 active, 4-5 expiring (within 14 days), 6-7 expired, 8 exhausted, 9 pending
type AuthProfile = { status: string; startOffset: number; endOffset: number; usedPct: number };
const authProfiles: AuthProfile[] = [
  { status: "approved", startOffset: -120, endOffset: 60, usedPct: 0.55 },   // active, healthy
  { status: "approved", startOffset: -90, endOffset: 90, usedPct: 0.40 },    // active, healthy
  { status: "approved", startOffset: -150, endOffset: 30, usedPct: 0.70 },   // active, moderate
  { status: "approved", startOffset: -60, endOffset: 120, usedPct: 0.25 },   // active, early
  { status: "approved", startOffset: -170, endOffset: 10, usedPct: 0.85 },   // expiring soon, high util
  { status: "approved", startOffset: -175, endOffset: 5, usedPct: 0.92 },    // expiring very soon, critical
  { status: "approved", startOffset: -210, endOffset: -10, usedPct: 0.78 },  // expired 10 days ago
  { status: "expired",  startOffset: -240, endOffset: -30, usedPct: 0.65 },  // expired 30 days ago
  { status: "approved", startOffset: -180, endOffset: 0, usedPct: 1.0 },     // exhausted (100% used)
  { status: "pending",  startOffset: 5, endOffset: 185, usedPct: 0 },        // pending future auth
];

// ---------------------------------------------------------------------------
// Main seed function
// ---------------------------------------------------------------------------

async function seed() {
  console.log("Seeding Bright Futures ABA practice...\n");

  // 1. Organization
  console.log("  Organization...");
  await db
    .insert(schema.organizations)
    .values({
      id: ORG_ID,
      clerkOrgId: CLERK_ORG_ID,
      name: "Bright Futures ABA",
      npi: "1234567893",
      phone: "(512) 555-0100",
      email: "admin@brightfuturesaba.com",
      addressLine1: "100 Congress Ave, Suite 200",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      taxonomyCode: "103K00000X",
      timezone: "America/Chicago",
    })
    .onConflictDoNothing();

  // 2. Users
  console.log("  Users...");
  await db
    .insert(schema.users)
    .values([
      { id: USER_OWNER, clerkUserId: "clerk_seed_owner", organizationId: ORG_ID, email: "sarah.chen@brightfuturesaba.com", firstName: "Sarah", lastName: "Chen", role: "owner" },
      { id: USER_BCBA, clerkUserId: "clerk_seed_bcba", organizationId: ORG_ID, email: "marcus.wright@brightfuturesaba.com", firstName: "Marcus", lastName: "Wright", role: "bcba" },
      { id: USER_RBT1, clerkUserId: "clerk_seed_rbt1", organizationId: ORG_ID, email: "david.park@brightfuturesaba.com", firstName: "David", lastName: "Park", role: "rbt" },
      { id: USER_RBT2, clerkUserId: "clerk_seed_rbt2", organizationId: ORG_ID, email: "jessica.torres@brightfuturesaba.com", firstName: "Jessica", lastName: "Torres", role: "rbt" },
    ])
    .onConflictDoNothing();

  // 3. Providers
  console.log("  Providers...");
  await db
    .insert(schema.providers)
    .values([
      { id: PROV_BCBA, organizationId: ORG_ID, userId: USER_OWNER, firstName: "Sarah", lastName: "Chen", credentialType: "bcba_d", npi: "1111111112", credentialNumber: "BCBA-D-12345", credentialExpiry: relDate(365), modifierCode: "HP" },
      { id: PROV_BCBA_D, organizationId: ORG_ID, userId: USER_BCBA, firstName: "Marcus", lastName: "Wright", credentialType: "bcba", npi: "2222222223", credentialNumber: "BCBA-67890", credentialExpiry: relDate(200), supervisorId: PROV_BCBA, modifierCode: "HO" },
      { id: PROV_RBT1, organizationId: ORG_ID, userId: USER_RBT1, firstName: "David", lastName: "Park", credentialType: "rbt", credentialNumber: "RBT-11111", credentialExpiry: relDate(180), supervisorId: PROV_BCBA, modifierCode: "HM" },
      { id: PROV_RBT2, organizationId: ORG_ID, userId: USER_RBT2, firstName: "Jessica", lastName: "Torres", credentialType: "rbt", credentialNumber: "RBT-22222", credentialExpiry: relDate(90), supervisorId: PROV_BCBA_D, modifierCode: "HM" },
    ])
    .onConflictDoNothing();

  // 4. Payers
  console.log("  Payers...");
  await db
    .insert(schema.payers)
    .values([
      { id: PAYER_BCBS, organizationId: ORG_ID, name: "Blue Cross Blue Shield of Texas", payerType: "commercial", timelyFilingDays: 90, unitCalcMethod: "ama", phone: "(800) 555-2583" },
      { id: PAYER_AETNA, organizationId: ORG_ID, name: "Aetna", payerType: "commercial", timelyFilingDays: 90, unitCalcMethod: "ama", phone: "(800) 555-1234" },
      { id: PAYER_UHC, organizationId: ORG_ID, name: "UnitedHealthcare", payerType: "commercial", timelyFilingDays: 120, unitCalcMethod: "ama", phone: "(800) 555-5678" },
      { id: PAYER_MEDICAID, organizationId: ORG_ID, name: "Texas Medicaid (HHSC)", payerType: "medicaid", timelyFilingDays: 365, unitCalcMethod: "cms", phone: "(800) 555-9012" },
    ])
    .onConflictDoNothing();

  // 5. Clients
  console.log("  Clients...");
  const clientValues = clientData.map((c, i) => ({
    id: CLIENT_IDS[i]!,
    organizationId: ORG_ID,
    firstName: c.first,
    lastName: c.last,
    dateOfBirth: c.dob,
    gender: c.gender,
    phone: `(512) 555-${String(1000 + i).slice(-4)}`,
    email: `${c.first.toLowerCase()}.${c.last.toLowerCase()}@example.com`,
    addressLine1: `${100 + i * 10} ${["Oak", "Elm", "Pine", "Cedar", "Maple"][i % 5]} St`,
    city: c.city,
    state: c.state,
    zipCode: "78701",
    diagnosisCode: "F84.0",
    diagnosisDescription: "Autism Spectrum Disorder",
    assignedBcbaId: i < 5 ? PROV_BCBA : PROV_BCBA_D,
    intakeDate: relDate(-180 + i * 10),
    status: i === 8 ? "on_hold" : "active",
    referralSource: ["pediatrician", "school", "self_referral", "insurance", "other_provider"][i % 5],
    holdReason: i === 8 ? "Family vacation — returning next month" : null,
  }));
  await db.insert(schema.clients).values(clientValues).onConflictDoNothing();

  // 6. Client contacts (guardians)
  console.log("  Contacts...");
  const contactValues = clientData.map((c, i) => ({
    id: CONTACT_IDS[i]!,
    organizationId: ORG_ID,
    clientId: CLIENT_IDS[i]!,
    firstName: c.guardian.first,
    lastName: c.guardian.last,
    phone: `(512) 555-${String(2000 + i).slice(-4)}`,
    email: `${c.guardian.first.toLowerCase()}.${c.guardian.last.toLowerCase()}@example.com`,
    relationship: c.guardian.rel,
    isLegalGuardian: true,
    isEmergencyContact: true,
    isBillingResponsible: true,
    canReceivePhi: true,
    canPickup: true,
    livesWithClient: true,
    priority: 1,
  }));
  await db.insert(schema.clientContacts).values(contactValues).onConflictDoNothing();

  // 7. Client insurance
  console.log("  Insurance policies...");
  const insuranceValues = clientData.map((c, i) => ({
    id: INS_IDS[i]!,
    organizationId: ORG_ID,
    clientId: CLIENT_IDS[i]!,
    payerId: payerRotation[i]!,
    memberId: `MEM${String(100000 + i * 1111).slice(-6)}`,
    groupNumber: `GRP-${44521 + i}`,
    subscriberFirstName: c.guardian.first,
    subscriberLastName: c.guardian.last,
    relationshipToSubscriber: "child" as const,
    planName: i % 2 === 0 ? "PPO Select" : "HMO Basic",
    priority: 1,
    effectiveDate: relDate(-365),
    verificationStatus: i < 7 ? "verified" : "unverified",
    verifiedAt: i < 7 ? relTimestamp(-30) : null,
  }));
  await db.insert(schema.clientInsurance).values(insuranceValues).onConflictDoNothing();

  // 8. Authorizations
  console.log("  Authorizations...");
  const authValues = authProfiles.map((ap, i) => ({
    id: AUTH_IDS[i]!,
    organizationId: ORG_ID,
    clientId: CLIENT_IDS[i]!,
    payerId: payerRotation[i]!,
    clientInsuranceId: INS_IDS[i]!,
    authorizationNumber: `AUTH-${String(1000 + i).slice(-4)}`,
    status: ap.status,
    startDate: relDate(ap.startOffset),
    endDate: relDate(ap.endOffset),
    diagnosisCode: "F84.0",
  }));
  await db.insert(schema.authorizations).values(authValues).onConflictDoNothing();

  // 9. Authorization services (97153 for all, 97155 for first 5)
  console.log("  Authorization services...");
  let svcIdx = 0;
  const svcValues: Array<{
    id: string;
    organizationId: string;
    authorizationId: string;
    cptCode: string;
    approvedUnits: number;
    usedUnits: number;
    frequency: string;
  }> = [];

  for (let i = 0; i < 10; i++) {
    const ap = authProfiles[i]!;
    const approved97153 = 120 + i * 8; // 120-192 units (30-48 hours)
    const used97153 = Math.round(approved97153 * ap.usedPct);
    svcValues.push({
      id: AUTH_SVC_IDS[svcIdx++]!,
      organizationId: ORG_ID,
      authorizationId: AUTH_IDS[i]!,
      cptCode: "97153",
      approvedUnits: approved97153,
      usedUnits: used97153,
      frequency: "weekly",
    });

    // Add 97155 (protocol modification) for first 5 clients
    if (i < 5) {
      const approved97155 = 20 + i * 4;
      const used97155 = Math.round(approved97155 * ap.usedPct);
      svcValues.push({
        id: AUTH_SVC_IDS[svcIdx++]!,
        organizationId: ORG_ID,
        authorizationId: AUTH_IDS[i]!,
        cptCode: "97155",
        approvedUnits: approved97155,
        usedUnits: used97155,
        frequency: "weekly",
      });
    }
  }
  await db.insert(schema.authorizationServices).values(svcValues).onConflictDoNothing();

  // 10. Sessions (60 sessions across the last 30 days)
  console.log("  Sessions (60)...");
  const sessionValues: Array<{
    id: string;
    organizationId: string;
    clientId: string;
    providerId: string;
    supervisorId: string;
    authorizationId: string | null;
    authorizationServiceId: string | null;
    sessionDate: string;
    startTime: Date;
    endTime: Date;
    cptCode: string;
    modifierCodes: string[];
    units: number;
    placeOfService: string;
    status: string;
    actualMinutes: number;
    unitCalcMethod: string;
    notes: string | null;
  }> = [];

  // Only generate sessions for clients with active/expiring auths (indices 0-5)
  // and the exhausted auth (index 8)
  const sessionClients = [0, 1, 2, 3, 4, 5, 8];

  let sessionIdx = 0;
  for (const clientIdx of sessionClients) {
    const rbt = rbtRotation[clientIdx]!;
    const supervisor = clientIdx < 5 ? PROV_BCBA : PROV_BCBA_D;
    const ap = authProfiles[clientIdx]!;

    // Skip pending auths
    if (ap.status === "pending") continue;

    // Generate 7-10 sessions per client over the last 30 days
    const numSessions = 7 + (clientIdx % 4);
    for (let s = 0; s < numSessions; s++) {
      if (sessionIdx >= 60) break;

      const dayOffset = -30 + Math.floor((s / numSessions) * 30);
      const date = relDate(dayOffset);
      const startHour = 8 + (s % 3); // 8, 9, 10 AM
      const durationHours = 2 + (s % 2); // 2 or 3 hours
      const endHour = startHour + durationHours;
      const actualMinutes = durationHours * 60;
      const units = durationHours * 4; // 15-min units

      // Determine session status — mostly completed, some variation
      let status: string;
      let notes: string | null = null;
      if (sessionIdx === 5) {
        status = "cancelled";
        notes = "Client sick — rescheduled to next week";
      } else if (sessionIdx === 12) {
        status = "no_show";
        notes = "Family no-show, no advance notice";
      } else if (sessionIdx === 20) {
        status = "flagged";
        notes = "No active authorization found for this CPT code";
      } else if (sessionIdx === 35) {
        status = "cancelled";
        notes = "Provider unavailable — rescheduled";
      } else {
        status = "completed";
      }

      // For the exhausted auth (client 8), link to the auth service
      // For cancelled/no_show sessions, don't link to auth
      const isCompleted = status === "completed";
      const hasAuth = clientIdx !== 6 && clientIdx !== 7; // expired auths — still link if they existed during session period

      // Find the first auth service for this client's 97153
      const authSvcId = svcValues.find(
        (sv) => sv.authorizationId === AUTH_IDS[clientIdx] && sv.cptCode === "97153",
      )?.id;

      // For BCBA sessions (every 5th session), use 97155 instead
      const isBcbaSession = s % 5 === 4 && clientIdx < 5;
      const cptCode = isBcbaSession ? "97155" : "97153";
      const provider = isBcbaSession ? PROV_BCBA : rbt;
      const modifier = isBcbaSession ? "HP" : "HM";

      const authSvcForCpt = isBcbaSession
        ? svcValues.find(
            (sv) => sv.authorizationId === AUTH_IDS[clientIdx] && sv.cptCode === "97155",
          )?.id
        : authSvcId;

      sessionValues.push({
        id: SESSION_IDS[sessionIdx]!,
        organizationId: ORG_ID,
        clientId: CLIENT_IDS[clientIdx]!,
        providerId: provider,
        supervisorId: supervisor,
        authorizationId: hasAuth && isCompleted ? AUTH_IDS[clientIdx]! : null,
        authorizationServiceId: hasAuth && isCompleted ? (authSvcForCpt ?? null) : null,
        sessionDate: date,
        startTime: makeTimestamp(date, `${String(startHour).padStart(2, "0")}:00`),
        endTime: makeTimestamp(date, `${String(endHour).padStart(2, "0")}:00`),
        cptCode,
        modifierCodes: [modifier],
        units: status === "completed" || status === "flagged" ? units : 0,
        placeOfService: s % 3 === 2 ? "11" : "12", // mostly home, some clinic
        status,
        actualMinutes: status === "completed" || status === "flagged" ? actualMinutes : 0,
        unitCalcMethod: "ama",
        notes,
      });

      sessionIdx++;
    }
  }

  // Fill remaining sessions with recent sessions for clients 0-2
  while (sessionIdx < 60) {
    const clientIdx = sessionIdx % 3;
    const dayOffset = -(sessionIdx - 50);
    const date = relDate(dayOffset);

    sessionValues.push({
      id: SESSION_IDS[sessionIdx]!,
      organizationId: ORG_ID,
      clientId: CLIENT_IDS[clientIdx]!,
      providerId: rbtRotation[clientIdx]!,
      supervisorId: PROV_BCBA,
      authorizationId: AUTH_IDS[clientIdx]!,
      authorizationServiceId: svcValues.find(
        (sv) => sv.authorizationId === AUTH_IDS[clientIdx] && sv.cptCode === "97153",
      )?.id ?? null,
      sessionDate: date,
      startTime: makeTimestamp(date, "09:00"),
      endTime: makeTimestamp(date, "12:00"),
      cptCode: "97153",
      modifierCodes: ["HM"],
      units: 12,
      placeOfService: "12",
      status: "completed",
      actualMinutes: 180,
      unitCalcMethod: "ama",
      notes: null,
    });

    sessionIdx++;
  }

  await db.insert(schema.sessions).values(sessionValues).onConflictDoNothing();

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  const counts = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(schema.organizations).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.users).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.providers).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.payers).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.clients).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.clientContacts).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.clientInsurance).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.authorizations).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.authorizationServices).then((r) => r[0]?.count),
    db.select({ count: sql<number>`count(*)` }).from(schema.sessions).then((r) => r[0]?.count),
  ]);

  console.log("\nSeed complete! Database counts:");
  console.log(`  Organizations:          ${counts[0]}`);
  console.log(`  Users:                  ${counts[1]}`);
  console.log(`  Providers:              ${counts[2]}`);
  console.log(`  Payers:                 ${counts[3]}`);
  console.log(`  Clients:                ${counts[4]}`);
  console.log(`  Contacts:               ${counts[5]}`);
  console.log(`  Insurance policies:     ${counts[6]}`);
  console.log(`  Authorizations:         ${counts[7]}`);
  console.log(`  Authorization services: ${counts[8]}`);
  console.log(`  Sessions:               ${counts[9]}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
