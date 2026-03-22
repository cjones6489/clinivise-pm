# Deep Technical Research: Practice Management & EHR Architecture for ABA Therapy

## Topic

What is the optimal design architecture for Clinivise — an ABA therapy practice management and billing platform targeting small practices (1–50 staff)? This research covers multi-tenant data architecture, authorization tracking, claims lifecycle, AI integration, HIPAA compliance, and competitive positioning to inform our Phase 1 foundation decisions before writing business logic.

---

## Executive Summary

**Our architecture is fundamentally sound.** The research validates our core decisions (shared-schema multi-tenancy, Drizzle + Neon, Clerk org-based auth, next-safe-action middleware chain, Stedi for Phase 2 EDI). However, seven critical findings require action before we write our first schema file:

1. **The CMS 8-minute rule has two calculation methods** (CMS vs. Substantial Portion) that vary by payer — our system must support both, not just one formula.
2. **Authorization utilization must use atomic SQL increments** (`SET used_units = used_units + N`), never read-modify-write — two RBTs logging simultaneously will corrupt data otherwise.
3. **The `pgEnum` vs. text enum contradiction** in our specs must be resolved NOW — CLAUDE.md says text, the engineering spec uses pgEnum. We should use text with TypeScript `as const` arrays (pgEnums can't remove values).
4. **Money handling needs a strategy decided before any schema** — integer cents or a decimal library. Never `parseFloat()` on Postgres `numeric` strings.
5. **Raven Health already operates our exact business model** (free PM + 2% revenue share) — we differentiate on UX quality and AI-native features, not business model novelty.
6. **CMS-0057-F mandates FHIR-based prior auth APIs by Jan 2027** — design our authorization schema to be FHIR-mappable now to avoid painful migrations later.
7. **Zero open-source ABA PM tools exist** — we're building in a genuinely underserved space with no prior art for CMS 8-minute rule implementations, authorization unit tracking, or ABA-specific CPT code management.

**Recommended approach:** Proceed with our planned architecture but add a scoped query builder (auto-injects `organization_id` + `deleted_at IS NULL`), resolve the enum decision, use `numeric(10,2)` with a decimal library for money, and write exhaustive CMS 8-minute rule tests before building any session logic.

### Decisions Finalized (2026-03-20)

Following additional targeted research on industry standards:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Enums** | `text` columns + TypeScript `as const` + Zod validation. No pgEnum. | Crunchy Data recommends against pgEnum. `ALTER TYPE` acquires ACCESS EXCLUSIVE lock (full table scan). Drizzle has multiple open bugs around pgEnum migration (can't delete values, broken defaults). |
| **Money** | `numeric(10,2)` in Postgres + `decimal.js` for arithmetic. Never `parseFloat()`. | X12 837P/835 EDI uses decimal strings. Stedi API expects decimal strings. Drizzle returns `numeric` as strings — pass directly to Stedi without conversion. Integer cents would require constant conversion at every EDI boundary. |
| **8-Minute Rule** | Per-session unit calculation in Phase 1. Per-day aggregation at claim generation in Phase 2. Store payer method (CMS vs AMA) in payer config. Default to AMA. | CMS aggregates across codes (Medicare/Medicaid). AMA evaluates per-code independently (commercial payers). Most ABA payers are commercial → default AMA. For ABA's long sessions (1-4 hrs), rounding rarely changes unit count within a session. |
| **Auth Overlap** | Default FIFO (oldest expiration first). Allow manual override. Alert on expiring auth with remaining units. | No regulatory mandate, but strong operational consensus among ABA billers: unused units on expiring auth are forfeited. CentralReach supports manual priority but defaults to practice choice. |

---

## Research Method

Seven specialized agents researched concurrently:

| Agent | Focus | Key Output |
|-------|-------|------------|
| Documentation Research | FHIR R4, X12 EDI, HIPAA 45 CFR 164.312, CMS billing rules, Drizzle/Clerk/Next.js docs | 10 critical implementation constraints |
| Competitive Analysis | CentralReach, AlohaABA, Catalyst, Raven Health, Jane App, SimplePractice, Canvas Medical, Stedi, Candid Health | Competitor weaknesses, UX patterns to steal, business model validation |
| Open Source Research | Medplum, OpenEMR, multi-tenant SaaS repos, PDF extraction tools, npm healthcare libraries | Repository pattern from Medplum, ERA parsing from OpenEMR, zero ABA open source |
| Architecture Analysis | Multi-tenancy options, auth tracking, claims state machine, caching, AI pipeline | Option A (shared schema) confirmed, atomic increment pattern, pull-based alerts |
| DX / Product Experience | Stack ergonomics, form complexity, data table UX, type safety flow, maintainability | 11-file CRUD pattern acceptable, composable DataTable, session form 3-tap happy path |
| Frontier Patterns | AI-native RCM startups, CMS-0057-F, offline-first, YC healthcare companies | FHIR PA APIs by 2027, PowerSync for offline, Medicaid rate cuts context |
| Risk / Failure Modes | Multi-tenancy leaks, auth race conditions, billing edge cases, HIPAA gaps | 32 risks identified, 11 must be addressed before coding |

---

## Official Documentation Findings

### Healthcare Data Standards

**FHIR R4 alignment matters for future interoperability.** Our entities map cleanly to FHIR resources: `clients` → Patient, `providers` → Practitioner, `client_insurance` → Coverage, `authorizations` → ServiceRequest, `claims` → Claim, ERA → ExplanationOfBenefit. We don't need a FHIR server, but aligning field names and cardinality now avoids migration pain when payers expose FHIR APIs (mandated by 2027).

**X12 EDI is fully abstracted by Stedi.** No viable TypeScript X12 parser exists in open source. Stedi converts everything to JSON — 837P claims, 270/271 eligibility, 835 ERA. Their idempotency key header prevents double-submission. Candid Health (Series C, $99.5M) uses Stedi as their underlying clearinghouse, validating the choice.

**ABA CPT codes require modifier validation.** Modifiers (HO for BCBA, HM for RBT, HN for BCaBA) must be auto-applied based on provider credential type. The 97155-to-97153 ratio cap (many payers limit supervision to 20% of direct therapy hours) should be surfaced as a dashboard alert.

### CMS 8-Minute Rule — Two Calculation Methods

This is the most critical finding for billing accuracy:

| Method | Used By | How It Works |
|--------|---------|-------------|
| **CMS/Medicare** | Medicare, some Medicaid | Sum total minutes across ALL timed codes, then convert. Remainders from different codes can combine — if they total 8+ min, bill an additional unit. |
| **Substantial Portion (SPM)** | Commercial payers (Aetna, Cigna, UHC) | Each code must independently meet 8+ minutes of its 15-minute unit. No combining remainders across codes. |

**Implementation requirement:** Store actual minutes per CPT code per session. Calculate units based on payer's method (configurable per payer). The formula `Math.floor((minutes + 7) / 15)` is an approximation — the correct formula is:

```
units = Math.floor(minutes / 15) + (minutes % 15 >= 8 ? 1 : 0)
```

Additionally, the CMS method aggregates across all timed codes in a single day for a single patient, not per-session. This adds complexity for practices where an RBT sees the same client twice in one day.

### HIPAA Audit Requirements (45 CFR 164.312)

**What must be logged:** Authentication events, ePHI access, data modifications, privilege changes, data exports. Every entry needs: user ID, UTC timestamp, action, resource ID (never PHI content), outcome, organization ID.

**Retention:** Minimum 6 years (HIPAA) / 7 years (BACB clinical records). Use 7 years as the floor.

**Log integrity:** Append-only, immutable. Never allow UPDATE or DELETE on the audit_logs table. The 2025 HIPAA Security Rule NPRM (expected finalized 2026) proposes eliminating all "addressable" specs — making encryption at rest, MFA, and annual security audits mandatory. Build to these standards now.

### Drizzle ORM + Neon Specifics

**Drizzle has first-class RLS support** via `pgTable.withRLS()` and `pgPolicy()`. Neon's PgBouncer runs in transaction mode, meaning `SET LOCAL` is safe for tenant context (scoped to current transaction only). Session-level `SET` and prepared statements are NOT supported through pooled connections.

**Neon cold starts:** ~1-3 seconds after 5 minutes of inactivity (free/low-traffic). Scale plan offers "always on" compute. For Phase 1 dev, accept the cold start; show a loading skeleton immediately.

---

## Modern Platform and Ecosystem Patterns

### ABA Competitor Landscape

| Platform | Strength | Clinivise Opportunity |
|----------|----------|----------------------|
| **CentralReach** | Market leader, 4,000 practices | Universally hated UX, $59+/user/month, enterprise complexity for small practices |
| **AlohaABA** | Simple billing, 4.9/5 satisfaction | No native data collection, limited reporting, poor onboarding |
| **Catalyst** | Best-in-class graphing engine | Mobile crashes and data loss, no PM/billing |
| **Raven Health** | **Free PM + 2% revenue share** (our model) | $300 implementation fee, limited AI, newer entrant |
| **Motivity** | Transparent pricing ($24-48/learner) | Weaker billing integration |
| **Theralytics** | Free startup tier, fast onboarding | Limited innovation, no AI |

**Key finding: Raven Health is our closest analog.** They validate the business model (free PM + revenue share works in ABA) but charge a $300 implementation fee and lack AI features. Clinivise differentiates on: zero onboarding cost, AI-native auth letter parsing, and modern UX that practitioners actually enjoy using.

### Design Patterns to Steal

| Pattern | Source | Why It Matters |
|---------|--------|---------------|
| Schedule-time auth enforcement | RethinkBH | Check authorizations BEFORE scheduling, not after claim denial |
| Session-to-billing automation | Passage Health | Session data auto-populates CPT codes, units, payer rules |
| Three-panel layout | Elation Health | Navigation \| list \| detail — most effective for clinical workflows |
| Color-coded scheduling | Jane App | Visual schedule as homepage — what every user checks first |
| Role-based dashboards | Motivity | Tie clinical, ops, and billing data together per role |
| "Days not weeks" onboarding | Theralytics | Speed-to-value is a key differentiator for small practices |

### Key ABA Business Metrics

| Metric | Target | Industry Avg |
|--------|--------|-------------|
| Gross collection rate | 92%+ | — |
| Days in AR | <30 days | 45-60 days |
| Claim denial rate | <5% | 12% national avg |
| Cancellation rate | <10% | — |
| Authorization utilization | 95%+ | Varies widely |
| Billing lag (session → claim) | <7 days | Often 30+ days |

---

## Relevant Repos, Libraries, and Technical References

### Medplum — Gold Standard for Tenant-Scoped Data Access
- **GitHub:** github.com/medplum/medplum | 2.2k stars | Active (v5.1.4)
- **Why it matters:** Their `Repository` class receives a context (projects, author, access policy) and automatically applies tenant filters to every query. This is the pattern Clinivise should adopt — a scoped query builder that injects `organization_id` automatically, making it impossible to forget the filter.
- **What to avoid:** FHIR data model is overkill. ABA billing has specific domain models better modeled directly in Drizzle.

### OpenEMR — ERA/835 Parsing Reference
- **GitHub:** github.com/openemr/openemr | 5k stars | Active
- **Why it matters:** `ParseERA.php` implements the exact reconciliation logic Clinivise needs for Phase 2: extract ISA/GS/ST headers, BPR payment info, CLP claim status, CAS adjustment codes, SVC service lines. The formula `charge_total - approved_total - patient_responsibility = sum(service_payments) + sum(adjustments)` is the ERA reconciliation equation.
- **What to avoid:** PHP procedural architecture. Implement in TypeScript against Stedi's JSON responses.

### OCRBase + Extract Kit — PDF Extraction Pipeline
- **OCRBase:** github.com/ocrbase-hq/ocrbase | 973 stars | Uses Drizzle ORM
- **Extract Kit:** github.com/aidalinfo/extract-kit | Zod schema validation on AI-extracted data
- **Why it matters:** The pattern of defining a Zod schema for expected output, letting the LLM extract, then validating with Zod is exactly right for auth letter parsing. OCRBase adds queue-based processing for bulk uploads.

### Dr.Agenda — Closest Stack Match
- **GitHub:** github.com/Dnowdd/Dr.Agenda | 14 stars
- **Stack:** Next.js 15, React 19, Drizzle ORM, PostgreSQL, Tailwind v4, shadcn/ui, TanStack Query/Table, React Hook Form + Zod, **next-safe-action**
- **Why it matters:** Nearly identical tech stack. Their action-per-feature directory structure (`src/actions/add-appointment/`, `src/actions/upsert-doctor/`) is worth studying as an alternative to our single-file-per-entity pattern.

### No Open-Source ABA Tools Exist
Searches for ABA practice management, CMS 8-minute rule implementations, authorization unit tracking, and healthcare TanStack Table implementations returned zero viable results. Clinivise is building entirely net-new implementations for these domains.

---

## Architecture Options

### Multi-Tenancy: Shared Schema Confirmed

| Option | Verdict | Rationale |
|--------|---------|-----------|
| **A: Shared schema + org_id filtering** | **ADOPT** | Already our plan. Simple, single migration path, works with Drizzle and Neon serverless. Add RLS as defense-in-depth before production PHI. |
| B: Schema-per-tenant | Reject | Drizzle has no first-class dynamic schema support. Breaks type safety, N migration sets. |
| C: Database-per-tenant | Reject | Requires separate Neon projects, separate connection strings, routing layer. Enormous operational cost for a startup. |
| D: Hybrid isolation | Reject | Splits data model into two systems, doubles migration complexity. The boundary between "PHI-heavy" and "not" is blurry in healthcare. |

**Defense-in-depth:** Create a scoped query builder that auto-injects `WHERE organization_id = $orgId AND deleted_at IS NULL`. This is the single highest-leverage defensive measure. Add Postgres RLS policies before handling real PHI.

### Authorization Tracking: Atomic Increments + Pull-Based Alerts

**Utilization tracking:** When a session is saved, atomically increment `used_units` within the same transaction:
```sql
UPDATE authorization_services
SET used_units = used_units + :sessionUnits
WHERE id = :id AND used_units + :sessionUnits <= approved_units
```
If 0 rows affected, the authorization is exhausted. This handles concurrent logging correctly — no optimistic locking needed for counters.

**Session edits:** Compute delta (`new_units - old_units`) and apply atomically. For deletes, `used_units -= session.billed_units`. Build a reconciliation function that recalculates from session sums — run nightly or on demand as a repair tool.

**Alerts:** Pull-based on dashboard load. Query authorization_services where utilization ≥ 80% or end_date within 30 days. Cache in TanStack Query with 60s stale time. Add proactive notifications (email/cron) in Phase 2.

**Projected utilization:** Compute client-side from auth data. `burnRate = usedUnits / elapsedDays`. `projectedRunoutDate = today + (remainingUnits / burnRate)`. No need to store — it changes daily.

### Claims Lifecycle: Simple Status Column + Transition Function

Model claim status as a `text` column (not pgEnum) with a pure function validating transitions:
```
draft → ready → submitted → acknowledged → accepted → paid (terminal)
                                          → rejected → draft (correction)
                           → accepted → denied → appealed → paid/denied
```
Put transition validation in a pure function called from server actions. Business rules (required fields, payer-specific checks) live in the action handler, not the state machine.

**Idempotency:** Generate a `submissionId` client-side when clicking "Submit." Store on claim row. Reject duplicate submissions server-side.

### Server Actions vs. API Routes

| Use Server Actions | Use API Routes |
|-------------------|---------------|
| User-initiated mutations (CRUD) | Webhooks (Clerk, Stedi) |
| Form submissions | External service callbacks |
| Anything needing auth context | Long-running AI operations (if timeout issues) |

For AI parsing: start synchronous in the server action (3-10s for 1-3 page auth letters). If timeouts become an issue, move to async job pattern with polling.

### Caching: TanStack Query Only (No Server Cache)

At our scale (100-1000 sessions/month per org), Neon handles every query in <50ms. Adding Redis or server-side caching adds operational complexity for zero user-visible benefit.

| Data | Stale Time | Invalidation |
|------|-----------|-------------|
| Dashboard metrics | 60s | On session/claim mutation |
| Client list | 5 min | On client CRUD |
| Auth utilization | 30s | On session save |
| Payer list | 1 hour | Rarely changes |
| CPT codes | Forever | Static reference data |

### Audit Logging: Synchronous, In-Transaction

Append a row to `audit_logs` in the same transaction as the mutation. At our scale, this adds <1ms per transaction. Guaranteed consistency: if the mutation succeeds, the audit log exists. Never use event sourcing — it's massively overengineered for this use case.

---

## Recommended Approach for Our Platform

**Proceed with our planned architecture** with these specific adjustments:

### Resolve Before Writing Schema

1. **Use text for enums, not pgEnum.** Define allowed values as `as const` arrays in `src/lib/constants.ts`. Validate with Zod in actions. pgEnums can't remove values and require `ALTER TYPE` migrations.

2. **Use integer cents for money.** Store `$125.50` as `12550`. Create `src/lib/money.ts` with `toCents()`, `fromCents()`, `formatMoney()`. Never `parseFloat()` on Postgres numeric strings.

3. **Add `organization_id` timezone to organizations table.** Store `America/New_York`. Use for all date calculations — never rely on browser timezone for business logic.

4. **Make `authorization_service_id` the FK on sessions**, not just `authorization_id`. This forces every session to specify which CPT code/service line it draws from.

5. **Add a CHECK constraint** on authorization_services: `CHECK (used_units <= approved_units)` as a database-level safety net.

### Build Phase (Sprint 1)

6. **Create a scoped query helper** that wraps Drizzle and auto-injects `organization_id` + `deleted_at IS NULL` filters. Every query goes through this, not raw `db.select()`.

7. **Write the CMS 8-minute rule function and exhaustive tests first.** Cover every minute from 0-120. Support both CMS and SPM calculation methods. This sets the testing culture.

8. **Create `useActionWithToast` wrapper hook** that handles server errors via Sonner toast automatically. Standardize error handling before building the first CRUD page.

9. **Add type-level assertions** between Drizzle schema types and Zod validator types to catch schema drift at compile time.

---

## Frontier and Emerging Patterns

### Adopt Now

| Pattern | Who | Maturity | Action |
|---------|-----|----------|--------|
| AI auth letter parsing (multimodal LLM) | Reducto, Extract Kit, internal | Production-ready | Build `lib/ai.ts` wrapper with Zod-validated structured output + confidence scoring |
| Vercel HIPAA BAA | Vercel | Production | Enable on Pro plan before any real patient data |
| Neon HIPAA add-on | Neon | Production | Available on Scale plan with BAA and pgAudit |

### Design For Later

| Pattern | Who | Maturity | Action |
|---------|-----|----------|--------|
| FHIR-mappable authorization model | CMS-0057-F mandate | Regulatory (2027) | Structure auth schema to map to CoverageEligibilityRequest. First-mover advantage for ABA. |
| Offline session timer | PowerSync + Neon | Early-adopter | Architect session timer for offline-first. Killer feature for field-based RBTs. |
| Denial prediction model | Candid Health pattern | Early-adopter | Capture denial reasons + outcomes in schema now. Train model once you have volume. |
| Payer rate tracking | Industry need | Concept | Schema support for tracking reimbursement rates over time (Medicaid rate cuts context). |
| Event-driven billing pipeline | AWS reference architectures | Production-proven | Keep server actions modular so they can become event-driven services when claims volume grows. |

### Watch Only

| Pattern | Who | Why Watch |
|---------|-----|-----------|
| AI voice agents for claim follow-up | LunaBill (YC F25, $764K ARR) | Real but Phase 3+ territory |
| TEFCA for billing | HHS, 500M records exchanged | Currently clinical data exchange only |
| Candid Health as RCM layer | Candid ($99.5M raised) | Revenue share conflicts with our model — build on Stedi directly |
| Local-first CRDTs | Ditto, Electric SQL | PowerSync is simpler for our use case |

### Critical Regulatory Context

**CMS-0057-F (Interoperability & Prior Authorization Rule):**
- Jan 2026: Payers must meet operational provisions (72-hour expedited, 7-day standard PA decisions)
- Jan 2027: FHIR-based Prior Authorization APIs mandatory
- CMS allows FHIR-only PA APIs without X12 278 compliance

**This is a structural opportunity.** By 2027, Clinivise could be the first ABA PM tool to submit prior auth requests programmatically via FHIR APIs instead of through portals/fax. Design the authorization data model now to map cleanly to FHIR ServiceRequest and CoverageEligibilityRequest.

**ABA Medicaid pressure:** North Carolina (-10% rate cuts), Nebraska (-50% for some providers), NY proposed 680-hour annual cap on ABA therapy. Federal Medicaid spending audits flagging improper payments. This makes authorization utilization tracking even more critical — practices need to maximize every approved unit.

---

## Opportunities to Build Something Better

### 1. Authorization-Aware Session Logging (No Competitor Does This Well)
CentralReach and AlohaABA let you log sessions that exceed authorization limits — the denial happens weeks later. Clinivise should **block or warn in real-time** during session logging with an inline utilization check. "This session would use 12 of your remaining 4 units. Contact the BCBA to request additional authorization."

### 2. AI Auth Letter Parsing (Unique Differentiator)
No ABA PM tool offers AI-powered extraction from authorization letter PDFs. The upload → extract → review → save workflow with confidence scoring per field is a clear competitive advantage. BCBAs currently spend 15-30 minutes manually entering authorization data from letters.

### 3. Projected Utilization + "Money Left on Table" Alerts
Show practices not just current utilization, but projected utilization at expiry based on burn rate. Alert when a practice is under-utilizing an authorization (e.g., <50% used with >50% of auth period elapsed). This catches revenue that would otherwise be silently lost.

### 4. Zero-Friction Onboarding (Under 30 Minutes)
CentralReach requires weeks of implementation. Theralytics proved "days not weeks" is possible. Clinivise should target sign-up → first session logged in under 30 minutes. Clerk handles auth instantly. Import CSV for existing client data. Pre-seed common payers. AI-parse the first auth letter during onboarding.

### 5. Dual 8-Minute Rule Support (Per-Payer Configuration)
No open-source implementation of the CMS 8-minute rule exists. Most PM tools implement one method. Supporting both CMS and SPM methods with per-payer configuration is a genuine differentiator for practices billing multiple payer types.

---

## Risks, Gaps, and Edge Cases

### Must Address Before Coding (11 Critical Items)

| # | Risk | Severity | Mitigation |
|---|------|----------|------------|
| 1 | Missing `organization_id` filter | Critical | Scoped query builder that auto-injects org_id + deleted_at filter |
| 2 | Authorization race condition (concurrent logging) | Critical | Atomic SQL increment `SET used_units = used_units + N`, never read-modify-write |
| 3 | `authActionClient` null orgId | Critical | Hard-fail immediately if orgId is falsy. NOT NULL constraint on org_id columns |
| 4 | CMS 8-minute rule incorrect implementation | Critical | Support both CMS and SPM methods. Exhaustive tests (0-120 minutes). Store raw minutes + calculated units |
| 5 | Money precision (parseFloat on numeric) | Critical | Integer cents throughout. `src/lib/money.ts` utility functions. Never JavaScript floats for money |
| 6 | pgEnum vs text enum contradiction | High | Resolve to text + `as const` arrays before writing any schema |
| 7 | New table missing organization_id | High | Base table factory function. Automated lint/test checking all tables |
| 8 | Session → authorization_service FK | High | FK to service line (not just authorization) forces CPT code specificity |
| 9 | Timezone handling | High | Org-level timezone. session_date derived from start_time in org TZ |
| 10 | Webhook signature verification | Critical | Verify Clerk webhook signatures via svix. Rate limit webhook endpoints |
| 11 | AI extraction auto-commit | High | NEVER auto-save AI-parsed data. Always show review screen with confidence scoring |

### Address During Phase 1

| Risk | Severity | When |
|------|----------|------|
| TanStack Query keys must include orgId | High | First client component |
| Server-side pagination from Day 1 | Medium | First data table |
| File upload validation (type, size, magic bytes) | High | Auth letter upload |
| Sentry PHI scrubbing config | High | Sentry setup |
| FK onDelete constraints explicitly set (default RESTRICT) | Medium | Schema definition |
| Soft delete filtering in all queries | High | Scoped query builder |
| Auth date range validation on session creation | Medium | Session actions |
| Auth overlap detection (FIFO: oldest first) | High | Authorization queries |
| Clerk webhook idempotency | High | Webhook route |
| Optimistic concurrency (updated_at check on edits) | High | Update actions |

### Design Now, Implement Phase 2

| Risk | Severity |
|------|----------|
| Claim state machine + idempotency key | Critical |
| ERA/835 matching with manual reconciliation queue | High |
| Timely filing deadline tracking per payer | Critical |
| Payer-specific billing rule configuration | High |
| Provider credential expiration tracking + enforcement | High |
| Coordination of benefits (primary/secondary insurance) | Medium |

---

## Recommended Technical Direction

### Design Pattern
**Layered CRUD with scoped data access.** Server Components for reads → scoped query functions → Drizzle → Neon. Client mutations → next-safe-action with authActionClient → business logic in service layer → Drizzle transactions → audit log → revalidate.

### Architecture
**Shared-schema multi-tenancy** with `organization_id` on every table. Application-level filtering via scoped query builder as primary mechanism. Postgres RLS as defense-in-depth before production PHI. Synchronous audit logging in-transaction.

### Key Libraries/Tools
- **Drizzle ORM 0.45** — schema, queries, migrations, RLS support
- **Neon serverless** — Postgres with connection pooling, branching for dev
- **Clerk Pro** — org-based multi-tenancy, RBAC, MFA
- **next-safe-action v8** — middleware chain for auth context injection
- **Stedi** (Phase 2) — JSON-first EDI for claims, eligibility, ERA
- **TanStack Query/Table** — client-side caching, data tables
- **Sonner** — toast notifications for all action feedback

### What to Do Now
1. Resolve enum strategy (text + `as const`)
2. Resolve money strategy (integer cents)
3. Add org timezone to organizations table
4. Create scoped query builder
5. Write CMS 8-minute rule function + tests
6. Create `src/lib/money.ts` utilities
7. Create `useActionWithToast` hook
8. Build database schema (Sprint 1A)
9. Build Clerk middleware + providers (Sprint 1B, parallel)

### What to Defer
- RLS policies (pre-production hardening)
- Claims state machine + Stedi integration (Phase 2)
- Async job queue for AI (only if sync timeouts become an issue)
- Redis/Upstash caching layer (TanStack Query is sufficient at our scale)
- Notification system + cron jobs (Phase 2)
- Offline session timer (Phase 1.5, PowerSync)
- Event sourcing (likely never)

### What to Avoid
- pgEnum for status columns (can't remove values, hard to migrate)
- Database-per-tenant or schema-per-tenant (wrong for our scale and stack)
- parseFloat on money values (guaranteed billing errors)
- Read-modify-write for utilization counters (race conditions)
- Auto-committing AI-parsed data without human review
- Enterprise patterns (event sourcing, CQRS, microservices) that add complexity without benefit at our scale
- Building X12 EDI parsing in-house (Stedi abstracts this entirely)

---

## Open Questions

1. ~~**CMS vs SPM 8-minute rule default:**~~ **RESOLVED** — Default to AMA/SPM (per-code). Store payer method preference. Most ABA payers are commercial.

2. ~~**Session aggregation scope:**~~ **RESOLVED** — Per-session calculation in Phase 1. Per-day aggregation at claim generation in Phase 2. For ABA's long sessions, the difference is negligible.

3. ~~**Authorization FIFO:**~~ **RESOLVED** — Default FIFO (oldest expiration first). Allow manual override. Alert on expiring auth with remaining units.

4. **Offline support timeline:** PowerSync + Neon is viable for offline session timers. Is this Phase 1.5 or Phase 2? Field connectivity is a real pain point for RBTs.

5. **Provider credential enforcement:** Warn or hard-block when a provider's credentials are expired on the session date? Phase 1 or Phase 2?

6. **Dashboard read auditing:** HIPAA requires auditing ePHI access (reads), not just mutations. At scale, read auditing generates 10x the volume. When do we implement this?

---

## Sources and References

### Official Documentation
- [FHIR R4 ExplanationOfBenefit](https://hl7.org/fhir/R4/explanationofbenefit.html)
- [FHIR R4 Claim](https://hl7.org/fhir/claim.html)
- [FHIR R4 Coverage](https://www.hl7.org/fhir/R4/coverage.html)
- [FHIR R4 ServiceRequest](https://hl7.org/fhir/R4/servicerequest.html)
- [Da Vinci Prior Authorization Support IG](https://hl7.org/fhir/us/davinci-pas/)
- [Da Vinci PAS FHIR IG v2.1.0](https://hl7.org/fhir/us/davinci-pas/)
- [45 CFR 164.312 Technical Safeguards](https://www.law.cornell.edu/cfr/text/45/164.312)
- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Drizzle ORM RLS Documentation](https://orm.drizzle.team/docs/rls)
- [Neon Connection Pooling](https://neon.com/docs/connect/connection-pooling)
- [Neon Multitenancy Guide](https://neon.com/docs/guides/multitenancy)
- [Neon HIPAA Compliance](https://neon.com/docs/security/hipaa)
- [next-safe-action Middleware Docs](https://next-safe-action.dev/docs/define-actions/middleware)

### Specifications and Standards
- [CMS-0057-F Interoperability & Prior Authorization Final Rule](https://www.cms.gov/newsroom/fact-sheets/cms-interoperability-prior-authorization-final-rule-cms-0057-f)
- [CMS-0057-F Must-Have APIs for 2026-2027](https://fire.ly/blog/cms-0057-f-decoded-must-have-apis-vs-nice-to-have-igs-for-2026-2027/)
- [HHS HIPAA Security Rule NPRM Fact Sheet](https://www.hhs.gov/hipaa/for-professionals/security/hipaa-security-rule-nprm/factsheet/index.html)
- [Federal Register - HIPAA Security Rule NPRM](https://www.federalregister.gov/documents/2025/01/06/2024-30983/hipaa-security-rule-to-strengthen-the-cybersecurity-of-electronic-protected-health-information)
- [ABA Coding Coalition - CPT Codes](https://abacodes.org/codes/)

### Platform and Product References
- [Stedi Healthcare Developer Docs](https://www.stedi.com/docs/healthcare)
- [Stedi Professional Claims (837P) API](https://www.stedi.com/docs/api-reference/healthcare/post-healthcare-claims)
- [Stedi Eligibility (270/271) API](https://www.stedi.com/docs/healthcare/api-reference/post-healthcare-eligibility)
- [Stedi Behavioral Health Eligibility Tips](https://www.stedi.com/blog/6-tips-for-behavioral-health-eligibility-checks)
- [Stedi Prior Auth in 271 Response](https://www.stedi.com/blog/how-to-check-for-prior-authorization-requirements-in-a-271-eligibility-response)
- [Stedi Series B ($70M)](https://www.stedi.com/blog/series-b)
- [Candid Health Series C ($52.5M)](https://hlth.com/insights/news/candid-health-raises-52-5m-series-c)
- [Candid Health Integration Guide](https://docs.joincandidhealth.com/introduction/integration-guide)
- [Cohere Health UM Suite](https://www.coherehealth.com/utilization-management-suite)
- [Vercel HIPAA Compliance Guide](https://vercel.com/kb/guide/hipaa-compliance-guide-vercel)
- [Vercel HIPAA BAA for Pro Teams](https://vercel.com/changelog/hipaa-baas-are-now-available-to-pro-teams)

### Repositories and Code References
- [Medplum](https://github.com/medplum/medplum) — 2.2k stars, FHIR-native platform, repository pattern for tenant scoping
- [OpenEMR](https://github.com/openemr/openemr) — 5k stars, ERA/835 parsing in `src/Billing/ParseERA.php`
- [next-safe-action](https://github.com/TheEdoRan/next-safe-action) — 3k stars, middleware chain pattern
- [OCRBase](https://github.com/ocrbase-hq/ocrbase) — 973 stars, queue-based PDF extraction with Drizzle ORM
- [Extract Kit](https://github.com/aidalinfo/extract-kit) — Zod schema validation on AI-extracted data
- [Dr.Agenda](https://github.com/Dnowdd/Dr.Agenda) — 14 stars, closest tech stack match (Next.js 15 + Drizzle + next-safe-action + shadcn)

### Competitor and Market References
- [CentralReach Reviews - Capterra](https://www.capterra.com/p/140743/CentralReach/reviews/)
- [AlohaABA Reviews - Capterra](https://www.capterra.com/p/192774/AlohaABA/)
- [Raven Health Pricing](https://ravenhealth.com/pricing/) — Free PM + 2% revenue share model
- [ABA Therapy Market - Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/applied-behavior-analysis-market) — $8.33B in 2026
- [States Refine ABA Coverage: Caps, Rate Cuts](https://bhbusiness.com/2026/01/22/states-refine-aba-coverage-new-hour-caps-age-limits-rate-cuts/)
- [LunaBill YC Launch](https://www.ycombinator.com/launches/Ooq-lunabill-ai-voice-callers-for-healthcare-billing-teams) — AI voice agents for billing
- [PowerSync](https://www.powersync.com/) — Postgres to SQLite offline sync
- [How Healthcare Payments Work - Out-of-Pocket](https://www.outofpocket.health/p/how-healthcare-payments-work-with-candid-health)

### Internal Codebase References
- `CLAUDE.md` — Architecture, tech stack, constraints, phase context
- `.claude/rules/database.md` — "Use text for enums" (contradicts engineering spec's pgEnum usage)
- `.claude/rules/security.md` — PHI handling, multi-tenant isolation guidelines
- `.claude/rules/server-actions.md` — authActionClient patterns
- `docs/engineering-spec.md` — Full DB schema definitions (uses pgEnum — needs resolution)
- `src/lib/env.ts` — t3-env validation (lines 1-68)
- `drizzle.config.ts` — Schema path needs updating to `./src/server/db/schema/index.ts`

---

*Research completed: 2026-03-20. Seven agents, ~50 sources consulted.*
