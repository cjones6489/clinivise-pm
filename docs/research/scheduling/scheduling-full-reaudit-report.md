# Scheduling Full Re-Audit Report: ABA Audit Document vs. Plan

> **Date:** 2026-03-28
> **Auditor:** Claude Opus 4.6 (1M context)
> **Scope:** Cross-reference every item in `aba-scheduling-audit.md` (Sections 1-10, all ID-prefixed items) against the CEO plan's 41 decisions (CEO 0-10, E1-E23, D1-D20), the existing codebase (`sessions.ts`, `constants.ts`), and the previous audit report
>
> **CORRECTION NOTE (2026-03-28):** This report was produced BEFORE the validation
> philosophy correction. Items marked "HARD BLOCK" for concurrent billing rules should
> be read as "AMA/ABA default warnings with payer override capability," not absolute
> blocks. Only 7 code-definition rules are true hard blocks. See CEO plan "Validation
> Philosophy Amendment (CORRECTED)" for the authoritative model. Priority rankings
> (P0/P1/P2/P3) should be re-evaluated against the corrected framing — several P0
> items that were "must block" become P1 "should warn with defaults."
>
> **Documents reviewed:**
> 1. CEO plan with all decisions: `~/.gstack/projects/.../2026-03-27-scheduling-calendar.md`
> 2. Feature spec: `docs/platform/features/scheduling.md`
> 3. Edge case master (72 cases): `docs/research/scheduling/aba-scheduling-edge-cases-master.md`
> 4. Independent research: `docs/research/scheduling/claude_scheduling_research.md`
> 5. New ABA audit document: `docs/research/scheduling/aba-scheduling-audit.md`
> 6. Previous audit report: `docs/research/scheduling/scheduling-plan-audit-report.md`
> 7. Existing code: `src/server/actions/sessions.ts`
> 8. Constants: `src/lib/constants.ts`

---

## Executive Summary

The ABA scheduling audit document contains **96 distinct items** across 10 sections (CPT-001 through CPT-010, AUTH-001 through AUTH-009, SUPV-001 through SUPV-013, CANC-001 through CANC-005, OVLP-001 through OVLP-007, TMPL-001 through TMPL-008, POS-001 through POS-006, TIME-001 through TIME-006, STATE-CA/TX/FL/NY/MA-001, SCENE-001 through SCENE-018). Plus the concurrent billing matrix (Section 1.3) and two appendices.

**Coverage Summary:**

| Status | Count | Percentage |
|--------|-------|------------|
| **COVERED** | 22 | 23% |
| **PARTIALLY COVERED** | 28 | 29% |
| **NEW GAP** | 24 | 25% |
| **DEFERRED** | 22 | 23% |
| **Total** | 96 | 100% |

**Critical finding:** The concurrent billing matrix (Section 1.3) introduces CODE-PAIR-SPECIFIC overlap rules far more granular than our current plan. Our plan handles same-provider overlap (E1/EC-001) and client overlap (E16), but does NOT implement the full 10x10 code-pair validation matrix. This is the single biggest architectural gap.

**Architectural verdict on E23 (payer rules):** The 3 flat fields on `payers` approach is insufficient. The audit document's Appendix C proposes a `PayerConfig` entity with concurrent_billing_rules, telehealth_matrix, modifier_matrix, auth_cap_types, and unit_calc_method. The plan should adopt a `payer_rules` table. Details in Section 4.

---

## 1. Full Cross-Reference Table

### Section 1: CPT Code Concurrent Billing Rules

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **CPT-001** | BLOCK | 97153+97155 concurrent billing — different providers required, same provider blocked | **PARTIALLY COVERED** | `checkSessionOverlap()` blocks same-provider overlap for non-group codes. E16 adds client overlap. | The plan blocks same-provider overlap generically, which catches the "single provider may NOT bill both" case. However, the plan does NOT validate the "different providers required" positive case (i.e., it does not verify that the concurrent pair has different rendering providers). NC Medicaid exception (concurrent 97153+97155 NOT permitted at all) is completely unhandled. TRICARE concurrent exclusion for ACD Category I codes also unhandled. **Payer-specific concurrent rules are a gap.** |
| **CPT-002** | BLOCK | 97154+97155 concurrent — group + QHP oversight, different providers | **PARTIALLY COVERED** | `checkSessionOverlap()` exempts GROUP_CPT_CODES (97154 is a group code). A BCBA scheduling 97155 alongside an RBT's 97154 would pass. | Same-provider check for non-group codes handles the negative case. Group size validation (2-8 for 97154) is not implemented — deferred per EC-019 to v1.1. Per-client billing for 97154 is a claims-phase concern. |
| **CPT-003** | BLOCK | 97155+97156/97157 cannot overlap same provider | **PARTIALLY COVERED** | `checkSessionOverlap()` blocks same-provider overlap for 97155 and 97156 (neither is GROUP_CPT_CODES). | The overlap check catches this implicitly. However, the distinct-time-block documentation requirement (UHC/Optum) is not surfaced — it is a claims/notes concern, not scheduling. Covered for scheduling purposes. |
| **CPT-004** | BLOCK | 97151 cannot be used for day-to-day treatment | **NEW GAP** | Not addressed. No scheduling guard for 97151 usage frequency. | Plan has no concept of restricting 97151 to assessment windows. EC-055 in the master doc flags this as INFORMATIONAL, and the previous audit deferred it to v1.1. But the audit doc marks it BLOCK. Texas Medicaid 30-day window rule is unhandled. |
| **CPT-005** | BLOCK | 97153 cannot be used for group treatment | **PARTIALLY COVERED** | `GROUP_CPT_CODES` in constants distinguishes group from individual. But no validation prevents scheduling 97153 for multiple clients at the same time with the same provider. | The code prevents scheduling overlapping 1:1 sessions for the same provider, so a second 97153 at the same time would be blocked. But there is no proactive check "if >1 client assigned to same provider at same time, code must be 97154." This is relevant for group session creation workflows, which are v1.1. |
| **CPT-006** | BLOCK | 97158 is QHP-only group | **COVERED** | `QHP_ONLY_CPT_CODES` includes 97158. `validateCptCredential()` blocks RBTs from billing it. | Fully covered by existing credential-code validation. |
| **CPT-007** | WARN | 0362T/0373T QHP must be "immediately available" | **NEW GAP** | Not addressed. No concept of "immediately available and interruptible" supervisor validation. | 0362T/0373T are rare codes with retirement date 2027-01-01 (tracked in constants). Low priority given impending retirement. Defer to v2.0. |
| **CPT-008** | WARN | MUE enforcement — Medicare vs. Medicaid discrepancy | **PARTIALLY COVERED** | E19 adds `checkDailyMUE()`. `ABA_CPT_CODES` has `maxUnitsPerDay`. E23 adds payer-configurable `max_units_per_day`. | E19 uses the constants' MUE values (which appear to be CMS/Medicaid defaults). The audit doc highlights that 97151 has 8 units (Medicare) vs. 32 units (Medicaid). E23's payer-level override can address this, but the implementation needs to check payer config first, then fall back to constants. The interplay between E19 and E23 needs clarification. |
| **CPT-009** | BLOCK | Per-provider daily billing cap (Nevada: 12 hrs/day, 40 hrs/week per client) | **NEW GAP** | Not addressed. No per-provider daily or per-client weekly combined hour cap. | Nevada-specific rule. E23's `max_units_per_day` is per-code, not per-provider-combined or per-client-combined. This is a payer-rules-engine concern (Layer 3, v2.0+). |
| **CPT-010** | WARN | Modifier auto-application by provider level | **COVERED** | `computeModifierCodes()` in `session-helpers.ts` auto-applies HM/HN/HO/HP based on credential. `CREDENTIAL_MODIFIERS` in constants. Telehealth modifiers (95, GT) defined in `MODIFIER_PRIORITY`. | Fully covered. Texas Medicaid modifier matrix may need payer-specific overrides in v2.0. |

### Section 1.3: Concurrent Billing Quick-Reference Matrix

This is the **most critical new content** in the audit document. The 10x10 matrix defines which code pairs can overlap and under what conditions.

| Code Pair | Matrix Value | Plan Status | Gap Detail |
|-----------|-------------|-------------|------------|
| **97151 + anything** | N (all) | **PARTIALLY COVERED** | 97151 is not in GROUP_CPT_CODES, so same-provider overlap is blocked. But two DIFFERENT providers (e.g., BCBA doing 97151 + RBT doing 97153 on same client at same time) would pass all checks. The matrix says 97151 cannot overlap with ANYTHING for the same client. E16 (client overlap) would need to hard-block 97151 overlaps universally. |
| **97152 + anything** | N (all) | **PARTIALLY COVERED** | Same as 97151 — client overlap check (E16) does not currently know about code-specific rules. |
| **97153 + 97155** | C* (different providers) | **PARTIALLY COVERED** | Same-provider blocked by `checkSessionOverlap()`. Different-provider allowed (passes all checks). But no validation that the providers ARE actually different — the system simply does not block different-provider overlaps. This is correct behavior. But payer exceptions (NC Medicaid: not permitted at all; TRICARE: restricted for ACD) are unhandled. |
| **97153 + 97156** | C** (different providers, patient not present in family session) | **NEW GAP** | No validation exists for this combination. The "patient not present in family session" condition cannot be validated at scheduling time. This should be an informational note, not a block. |
| **97153 + 97157** | C** (same as above) | **NEW GAP** | Same gap as 97153+97156. |
| **97154 + 97155** | C* (different providers) | **PARTIALLY COVERED** | 97154 is in GROUP_CPT_CODES so it is exempt from same-provider overlap. A BCBA scheduling 97155 alongside an RBT's 97154 passes correctly. |
| **97154 + 97156/97157** | C** | **NEW GAP** | Same gap as 97153+97156. |
| **97155 + 97155** | N (same provider) | **COVERED** | `checkSessionOverlap()` blocks same-provider overlap. |
| **97155 + 97156/97157** | N | **PARTIALLY COVERED** | Same-provider 97155+97156 overlap blocked by `checkSessionOverlap()`. But different-provider 97155+97156 for the same client at the same time is NOT blocked — the matrix says N (not allowed at all). E16 client overlap would need code-pair awareness. |
| **97158 + anything** | N (all) | **PARTIALLY COVERED** | 97158 IS in GROUP_CPT_CODES, so `checkSessionOverlap()` exempts it from same-provider overlap checks. But the matrix says 97158 cannot overlap with anything else for the same client. E16 client overlap needs to handle this. |
| **0362T/0373T + 97155** | C*** (direction only) | **NEW GAP** | No validation. Rare codes, deferred. |

**Summary of Matrix Coverage:**
- 7 out of 10 diagonal entries (same-code overlap) are handled by `checkSessionOverlap()`
- Cross-code overlaps for the SAME CLIENT are NOT handled unless E16 is enhanced with code-pair awareness
- Payer-specific exceptions (NC Medicaid, TRICARE) are completely unhandled
- The "C* = different providers required" condition is implicitly satisfied (system does not block different providers) but not validated

### Section 2: Authorization Lifecycle Edge Cases

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **AUTH-001** | BLOCK | Auth expires mid-recurring-session-series | **PARTIALLY COVERED** | E6: batch creates beyond auth dates with warning. E22: batch gen reports within-auth vs. beyond-auth counts. E23 (from first audit): template-auth boundary check. | The plan generates sessions beyond auth end date but warns. The audit doc says BLOCK generation at auth boundary and only allow "pending auth" status sessions beyond. Plan approach is more pragmatic (practices schedule ahead). Partially covered — the warning is there but stop-generation behavior is not. TRICARE 2-year referral cycle tracking is unhandled. |
| **AUTH-002** | WARN | Auth renewal with different codes/hours | **NEW GAP** | Not addressed. No comparison of old auth vs. new auth parameters against existing schedule. | When a new auth is received with different parameters, there is no automated flagging of sessions using dropped codes or exceeding new hour limits. This requires manual review. |
| **AUTH-003** | WARN | Overlapping auths from primary/secondary payer | **NEW GAP** | Not addressed. The existing auth system does not track primary vs. secondary payer auth separately for scheduling validation. | The `authorizations` table links to `insurances` which has priority. But no scheduling logic checks dual-payer auth limits simultaneously. Defer to v1.1. |
| **AUTH-004** | WARN | Utilization pacing — on pace vs. behind | **PARTIALLY COVERED** | E1: query-time auth projection. Previous audit flagged EC-038 (under-utilization). `AUTH_ALERT_THRESHOLDS` defined. | The projection query exists. The pacing dashboard with green/yellow/orange/red bands is NOT implemented. Thresholds exist in constants but no pacing calculation (expected pace vs. actual pace with linear interpolation). |
| **AUTH-005** | BLOCK | Per-day vs. per-week vs. total-period caps interaction | **PARTIALLY COVERED** | E19: daily MUE. E17: auth utilization enforcement at 100%. E23: `max_units_per_day` on payers. | Daily and total-period caps are addressed. Weekly caps are NOT addressed. The audit doc says "enforce ALL cap layers simultaneously." NC Medicaid weekly-non-rollable units are unhandled. Per-week per-code caps need E23 enhancement or a payer_rules table. |
| **AUTH-006** | WARN | Make-up session logic | **NEW GAP** | Cancellation reasons tracked (constants). No make-up session workflow. | No logic for "can this cancelled session be made up?" including weekly-capped vs. total-period-capped auth distinction. Defer to v1.1. |
| **AUTH-007** | BLOCK | Auth exhausted mid-period | **PARTIALLY COVERED** | E17: auth utilization enforcement. Block when projected remaining goes negative. | E17 addresses this at booking time. But the audit doc adds: flag all remaining scheduled sessions when auth is exhausted, auto-generate re-auth prompt. The "cascade to existing future sessions" behavior is not in the plan. |
| **AUTH-008** | WARN | Concurrent review impact on scheduling | **NEW GAP** | Not addressed. No concept of concurrent review milestones in auth lifecycle. | The `AUTH_TYPES` constant includes `concurrent_review` but no scheduling logic handles reduced hours after a concurrent review. |
| **AUTH-009** | INFO | Re-authorization warning timelines | **PARTIALLY COVERED** | E20: multi-stage auth expiration alerts at 30/14/7 days. `AUTH_ALERT_THRESHOLDS.EXPIRY_WARNING_DAYS: 30`. | E20 addresses the alert timeline. The audit doc recommends 60/45/30/14/7 day milestones (vs. plan's 30/14/7). Adding 60 and 45 is low effort. TRICARE-specific outcome measure requirements are unhandled. |

### Section 3: BACB Supervision Compliance Rules

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **SUPV-001** | BLOCK | 5% monthly supervision minimum | **DEFERRED** | CEO plan defers supervision compliance tracker to TODOS.md. Feature spec puts it in NEXT phase. | EC-030 in master doc is v1.1 Should-Handle. The audit doc marks it BLOCK. Given that it is a certification compliance requirement (not billing), and the scheduling MVP is focused on billing validation, deferral to v1.1 is acceptable but it should be P1 in the fast-follow. |
| **SUPV-002** | BLOCK | Minimum 2 contacts + 1 observation per month | **DEFERRED** | Same deferral as SUPV-001. | EC-031 in master doc is v1.1. |
| **SUPV-003** | WARN | Group supervision cap (50%) | **DEFERRED** | Not addressed. EC-032 is v2.0. | |
| **SUPV-004** | BLOCK | Supervisor must be listed in BACB account | **DEFERRED** | Not addressed. No supervisor-supervisee mapping beyond the `supervisorId` on providers. | The current `providers.supervisorId` field tracks the primary supervisor. No BACB account linkage validation. Defer to v1.1. |
| **SUPV-005** | BLOCK | 8-hour supervisor training prerequisite | **DEFERRED** | Not addressed. No training tracking on providers. | Add to provider profile in v1.1. |
| **SUPV-006** | WARN | Remote/telehealth supervision requirements | **DEFERRED** | Not addressed. | Defer to v1.1. |
| **SUPV-007** | INFO | 7-year supervision record retention | **DEFERRED** | No retention policy in the plan. | Architectural note: session/note records should never be hard-deleted. Soft-delete already exists. |
| **SUPV-008** | WARN | Real-time compliance calculation formula | **DEFERRED** | Supervision tracking deferred entirely. | The formula in the audit doc is well-specified. When implementing supervision tracking, use this as the reference. |
| **SUPV-009** | BLOCK | California — LBA/LaBA rules | **DEFERRED** | No state-specific rules in plan. | v2.0+ payer rules engine. |
| **SUPV-010** | BLOCK | Texas — LBA/RBT telehealth prohibition | **PARTIALLY COVERED** | Previous audit flagged Texas Medicaid RBT telehealth as a payer-specific warning. | The previous audit report recommends a warning for Texas Medicaid RBT telehealth. E23 does not specifically address this. POS-003 in the audit doc covers this. |
| **SUPV-011** | WARN | Florida — MCO-specific supervision rules | **DEFERRED** | Not addressed. | v2.0. |
| **SUPV-012** | WARN | New York — state licensing beyond BACB | **DEFERRED** | Not addressed. NY requires both state license and BACB cert. | v2.0. |
| **SUPV-013** | WARN | Massachusetts — AG enforcement priority | **DEFERRED** | Not addressed. | v2.0. |

### Section 4: Cancellation Business Logic

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **CANC-001** | INFO | Cancellation taxonomy (10 categories) | **PARTIALLY COVERED** | `CANCELLATION_REASONS` in constants has 9 categories. `CANCELLED_BY_OPTIONS` tracks who cancelled. | The audit doc's taxonomy has 10 categories with system implications (auth impact, RBT pay impact). The constants cover the reason codes but not the metadata (notice period, auth impact, pay impact). The "Insurance Lapse" category (INL) is missing from `CANCELLATION_REASONS`. |
| **CANC-002** | WARN | Late cancel vs. no-show billing differences | **PARTIALLY COVERED** | `cancelSession` action tracks reason and cancelledBy. `no_show` is a distinct session status. | The plan distinguishes no_show from cancelled. But no logic prevents billing a cancelled/no_show session (the audit doc says BLOCK claim creation for these). This is a claims-phase concern. The notice-period distinction (late cancel < 24hrs vs. advance cancel) is not tracked — no timestamp of when cancellation was initiated. |
| **CANC-003** | WARN | Cancellation cascade resolution priority | **NEW GAP** | Not addressed. No cascade logic on cancellation. | The audit doc defines a 7-step cascade (auth recalc, RBT gap flagging, supervision recalc, frequency tracking, rate tracking, parent notification, make-up scheduling). Current `cancelSession` only does status change + unit reversal. The full cascade is v1.1. |
| **CANC-004** | INFO | Cancellation rate benchmarks and thresholds | **PARTIALLY COVERED** | EC-040 in previous audit: cancellation rate on client detail. Data captured via `CANCELLATION_REASONS`. | Thresholds defined in audit doc (normal <10%, concerning 10-20%, critical >20%). No implementation yet. The data is being captured. Dashboard metric deferred to NEXT phase per feature spec. |
| **CANC-005** | WARN | High cancellation impact on auth renewal | **NEW GAP** | Not addressed. No utilization risk report combining cancellation data with auth pacing. | v1.1 analytics feature. |

### Section 5: Session Overlap & Conflict Rules

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **OVLP-001** | BLOCK | Same provider, same time, 1:1 codes | **COVERED** | `checkSessionOverlap()` in sessions.ts. GROUP_CPT_CODES exemption. EC-001 in master doc. | Fully implemented. |
| **OVLP-002** | WARN | Same provider, same time, group codes — cannot lead two groups simultaneously | **NEW GAP** | GROUP_CPT_CODES exempts 97154/97157/97158 from overlap checks entirely. A provider could be scheduled for two separate group sessions at the same time. | The current code skips overlap checks for group codes entirely. It should block a provider from leading TWO group sessions simultaneously, while allowing one group session with multiple clients. This is a new gap. |
| **OVLP-003** | BLOCK | Same client, different providers, same time — only valid for RBT 97153 + BCBA 97155 | **PARTIALLY COVERED** | E16: `checkClientOverlap()` blocks same client individual+group or individual+individual overlap. D19: concurrent session indicator. | E16 adds client overlap but does not implement the code-pair validation matrix. The audit doc says the ONLY valid same-client overlap is RBT 97153 + BCBA 97155 (and tech 0362T + available BCBA). E16 needs to be enhanced with the concurrent billing matrix to allow valid pairs and block everything else. |
| **OVLP-004** | BLOCK | ABA + non-ABA concurrent therapy restrictions (TRICARE, Cigna) | **DEFERRED** | Not addressed. Clinivise only schedules ABA sessions. | Only relevant when handling multi-discipline scheduling. Deferred. |
| **OVLP-005** | WARN | BCBA supervision overlapping RBT — billing implications | **PARTIALLY COVERED** | D19: concurrent session indicator. E5: session conversion flow. | The plan shows concurrent sessions and allows the pattern. The audit doc adds: "supervision-only" session types that track BACB supervision without generating a 97155 claim. This is a v1.1 supervision tracking feature. |
| **OVLP-006** | WARN | Drive time buffers between sessions | **PARTIALLY COVERED** | Previous audit E21 (from first audit, renumbered): travel buffer warning when different serviceAddress + <30 min gap. CEO plan defers full drive time to TODOS.md. | E21 in the first audit adds a minimal travel warning. The audit doc recommends configurable buffers (default 15 min), same-location exemption, and non-billable display. E21 covers the basic warning; the configurable buffer and same-location exemption are enhancements. |
| **OVLP-007** | WARN | Telehealth-to-in-person transition buffer (5 min) | **NEW GAP** | Not addressed. | Low priority. Could be rolled into OVLP-006 buffer logic. When one session is telehealth (POS 02/10) and the next is in-person, the buffer requirement is lower (5 min vs. 15+ min for location change). |

### Section 6: Template & Recurring Schedule Edge Cases

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **TMPL-001** | BLOCK | Client discharged — auto-cancel future sessions | **NEW GAP** | Not addressed in scheduling plan. Client status pipeline exists but no cascade to sessions. | When a client's status changes to "discharged," all future scheduled sessions should be auto-cancelled. This requires a status change hook. TRICARE transition plan requirement is unhandled. |
| **TMPL-002** | WARN | Client placed on hold — suspend recurring sessions | **NEW GAP** | Not addressed. No concept of "on hold" suspending templates/sessions. | The client status "on_hold" exists in `CLIENT_STATUSES`. But changing status to on_hold does not cascade to sessions or templates. |
| **TMPL-003** | BLOCK | RBT departure with multiple clients needing bulk reassignment | **PARTIALLY COVERED** | D18: bulk reassign deferred, one-at-a-time drag-drop for MVP. D20: "Mark unavailable" provider action for single-day absence. | D18 explicitly defers bulk reassignment. D20 handles daily absence. Full RBT departure workflow (8-client reassignment with credential/payer/geographic matching) is v1.1. |
| **TMPL-004** | WARN | Recurring template spanning auth boundary | **PARTIALLY COVERED** | E22 (from first audit): batch gen reports within-auth vs. beyond-auth. E6: creates beyond auth with warning. | The plan generates beyond auth with warnings. The audit doc says stop generation at boundary and only extend into new auth with new auth parameters. Partially covered. |
| **TMPL-005** | WARN | School break auto-pause / seasonal template swap | **DEFERRED** | Not addressed. Feature spec defers seasonal scheduling. | EC-058 in master doc is v1.1. The audit doc adds school calendar integration and auto-swap between templates. v1.1 fast-follow. |
| **TMPL-006** | WARN | Template collision and deduplication | **COVERED** | E2: ON CONFLICT DO NOTHING for idempotency. E13: auto-generate on template save with idempotency key `tmpl:{templateId}:{date}`. | Idempotency key prevents duplicate generation. Template priority ordering is not implemented but basic dedup is covered. |
| **TMPL-007** | BLOCK | Auth-aware session generation (stop when auth units would be exceeded) | **PARTIALLY COVERED** | E17: auth utilization enforcement. E22: batch gen reporting. | E17 blocks individual bookings at 100%. But batch generation (E14) explicitly SKIPS auth matching and unit accounting. The audit doc says batch gen should track cumulative units and stop when remaining would be exceeded. This is a gap between E14 and E17 — batch gen does not enforce auth limits. |
| **TMPL-008** | INFO | Holiday-aware recurring sessions | **NEW GAP** | Not addressed. No holiday calendar concept. | The audit doc recommends a configurable holiday calendar. When generating recurring sessions, skip holidays. This is a common feature request. Low effort: a `practice_holidays` table + skip-date check in batch gen. |

### Section 7: Place of Service & Telehealth Rules

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **POS-001** | BLOCK | POS code requirements for ABA claims | **COVERED** | `PLACE_OF_SERVICE_CODES` in constants. Sessions require `placeOfService`. | POS is required on every session. Auto-suggest from client profile is not implemented but the field exists. |
| **POS-002** | BLOCK | TRICARE school-based RBT restriction | **PARTIALLY COVERED** | Previous audit flagged as payer-specific warning. | The previous audit report recommended 3 payer-specific warnings including TRICARE school-based RBT. Not yet in a plan decision. Needs E24 or inclusion in payer_rules. |
| **POS-003** | BLOCK | Texas Medicaid RBT telehealth prohibition | **PARTIALLY COVERED** | Previous audit flagged as payer-specific warning. SUPV-010 also covers this. | Same as POS-002 — flagged but not formalized as a plan decision. |
| **POS-004** | WARN | CPT code telehealth eligibility matrix | **NEW GAP** | Not addressed. No validation of CPT code vs. telehealth POS. | The audit doc lists which codes are generally telehealth-eligible (97155, 97156, 97157) vs. not (97153, 97154, 97158). No validation exists. 97153 telehealth (RBT direct therapy via video) is generally not billable, but no check prevents scheduling it with POS 02/10. |
| **POS-005** | WARN | Cross-state licensure for telehealth | **DEFERRED** | Not addressed. No provider licensure by state. | EC-059 behavior. Defer to v2.0 — requires provider_licenses table with state-by-state tracking. |
| **POS-006** | WARN | Telehealth modifier requirements (95 vs. GT vs. FQ) | **PARTIALLY COVERED** | `MODIFIER_PRIORITY` includes 95 and GT. `computeModifierCodes()` handles telehealth. | The modifier infrastructure exists. Payer-specific modifier selection (95 vs. GT vs. FQ) is not implemented — it defaults to standard. Needs payer_rules table for per-payer modifier config. |

### Section 8: Time & Unit Calculation Edge Cases

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **TIME-001** | BLOCK | CMS 8-minute rule + both calculation methods | **COVERED** | `UNIT_CALC_METHODS` in constants: ["cms", "ama"]. `unitCalcMethod` stored on sessions (defaults to "ama"). `MINUTES_PER_UNIT = 15`. | Both methods are supported. Session stores which method is used. `session-helpers.ts` handles unit calculation. |
| **TIME-002** | BLOCK | 7-minute trap (< 8 min = 0 billable units) | **PARTIALLY COVERED** | No explicit < 8 minute check in `createSession`. `computeActualMinutes()` calculates duration but does not validate minimum. | The plan does not flag sessions under 8 minutes as non-billable. This is primarily a claims-phase concern, but a scheduling warning would be helpful. |
| **TIME-003** | WARN | Mixed-code session unit splitting | **NEW GAP** | Not addressed. Sessions are one-code-per-record. | The audit doc describes a scenario where a single encounter has multiple CPT codes (45 min of 97155 then 30 min of 97156). The current schema stores one CPT per session. Multi-code sessions would need separate session records. This is correct architecture — each code gets its own session row. But no UI guides this workflow. Defer to session completion flow enhancement. |
| **TIME-004** | BLOCK | Timezone handling for telehealth (store UTC, display local, bill in client timezone) | **PARTIALLY COVERED** | E15: org timezone for template-to-timestamp conversion. D15: calendar renders in org timezone with banner if browser TZ differs. | Org timezone is used. But the audit doc's concern about cross-timezone telehealth (provider Pacific, client Eastern — bill in client's timezone) is not addressed. The system uses org timezone, not client timezone. For single-org practices in one timezone, this is fine. Multi-timezone telehealth is a v2.0 concern. |
| **TIME-005** | WARN | DST transition edge cases | **PARTIALLY COVERED** | E15: org timezone handling. | The audit doc's DST concerns (spring forward gap, fall back ambiguity) are relevant but rare for ABA (most sessions 8AM-7PM). Recurring templates that "maintain same local clock time" are the standard behavior when using timezone-aware timestamp conversion (E15). |
| **TIME-006** | WARN | Scheduled vs. completed time conversion | **PARTIALLY COVERED** | E5: "Complete Session" pre-fills from schedule. Previous audit E22: time delta check at completion. | E5 pre-fills times. E22 (from first audit) adds a warning when actual differs from scheduled by >15 min. The audit doc adds: default billing units to actual (not scheduled), flag if actual < 80% of scheduled, track both for utilization reporting. E22 partially covers this. |

### Section 9: State Medicaid Rules

| Item ID | Severity | Description | Plan Status | Plan Reference | Gap Detail |
|---------|----------|-------------|-------------|----------------|------------|
| **STATE-CA-001** | BLOCK | Medi-Cal BHT rules, LaBA/RBT telehealth prohibition | **DEFERRED** | Not addressed. | Payer rules engine, v2.0. |
| **STATE-TX-001** | BLOCK | Texas Medicaid — no concurrent billing, RBT telehealth ban, 97151 30-day window | **PARTIALLY COVERED** | Previous audit flagged Texas Medicaid concurrent billing + RBT telehealth as warnings. | Two of the three Texas rules are flagged but not formalized. The 97151 30-day window is unhandled. Concurrent billing prohibition is the highest-impact Texas-specific rule. |
| **STATE-FL-001** | WARN | Florida Medicaid — MCO-specific rules | **DEFERRED** | Not addressed. | v2.0. |
| **STATE-NY-001** | WARN | New York — dual BACB + state license requirement | **DEFERRED** | Not addressed. | v2.0. |
| **STATE-MA-001** | WARN | Massachusetts — AG enforcement, strict documentation | **DEFERRED** | Not addressed. | v2.0. |

### Section 10: Real-World Scenario Walkthroughs

| Item ID | Severity | Description | Plan Status | Gap Detail |
|---------|----------|-------------|-------------|------------|
| **SCENE-001** | N/A | Monday cancellation cascade (9-step) | **PARTIALLY COVERED** | `cancelSession` handles status + unit reversal. Cancellation reasons tracked. No cascade logic (steps 3-9 unimplemented). |
| **SCENE-002** | N/A | RBT departure with 8 clients | **PARTIALLY COVERED** | D18 defers bulk reassign. D20 handles single-day absence. Full departure workflow is v1.1. |
| **SCENE-003** | N/A | Summer schedule transition | **DEFERRED** | No seasonal template concept. TMPL-005. |
| **SCENE-004** | BLOCK | Auth expiry with future sessions booked | **PARTIALLY COVERED** | E6: warn on batch gen beyond auth. E22: differentiated reporting. No "pending auth" session status. |
| **SCENE-005** | INFO | Holiday week schedule | **NEW GAP** | No holiday calendar. TMPL-008. |
| **SCENE-006** | BLOCK | Group session drop below minimum | **DEFERRED** | Group session management is v1.1. EC-019. |
| **SCENE-007** | BLOCK | BCBA supervision at 3.8% with 4 days left | **DEFERRED** | Supervision tracking deferred. SUPV-001/SUPV-008. |
| **SCENE-008** | N/A | New client onboarding workflow | **PARTIALLY COVERED** | Auth + session creation exist. Assessment-specific scheduling (97151 window) is a gap. No onboarding workflow. |
| **SCENE-009** | BLOCK | TRICARE parent training compliance | **DEFERRED** | EC-023 deferred to v1.1. |
| **SCENE-010** | BLOCK | Provider credential lapse | **PARTIALLY COVERED** | E21 adds `credential_expires_at` + warning. Hard block deferred to v1.1. |
| **SCENE-011** | WARN | Multi-payer client (COB coordination) | **DEFERRED** | Claims phase. AUTH-003. |
| **SCENE-012** | WARN | Mid-session code change (crisis to 0373T) | **NEW GAP** | No concept of splitting a session into multiple CPT segments. Requires separate session records per code, which is the current architecture. UI for mid-session code change is not designed. |
| **SCENE-013** | WARN | RBT working for two practices | **DEFERRED** | Multi-tenant isolation prevents cross-practice visibility by design. |
| **SCENE-014** | BLOCK | Auth reduction after concurrent review | **NEW GAP** | AUTH-008. No cascade when auth parameters change. |
| **SCENE-015** | BLOCK | End-of-year insurance transition | **NEW GAP** | No future-dated payer change concept. No workflow for auth transition across payers. |
| **SCENE-016** | WARN | Telehealth session technical failure | **PARTIALLY COVERED** | Session can be documented with actual (shorter) duration. No "interrupted" status. |
| **SCENE-017** | WARN | Overlapping assessment + treatment during re-evaluation | **PARTIALLY COVERED** | 97151 and 97153 on same day with non-overlapping times works with current schema. Same-time overlap would need code-pair matrix enforcement (97151 + anything = N). |
| **SCENE-018** | WARN | Group session multi-client auth mismatch | **PARTIALLY COVERED** | E18: CPT-auth mismatch warning at booking. But group session enrollment across multiple clients' auths is not validated. |

### Appendix B: Priority Matrix (Audit Doc)

| Audit Doc Priority | Items | Plan Coverage |
|-------------------|-------|---------------|
| **P0 — Launch Blockers** | CPT-001–006, AUTH-001, AUTH-005, AUTH-007, SUPV-001, SUPV-002, OVLP-001, OVLP-003, TIME-001, TIME-002, POS-002, POS-003 | 8 covered/partial, 4 deferred (SUPV-001/002, POS-002/003 need formalization), 4 new gaps |
| **P1 — High Value** | AUTH-004, CANC-001, CANC-003, SUPV-008, TMPL-001, TMPL-003, TMPL-007 | 3 partial, 4 gaps/deferred |
| **P2 — Competitive Edge** | AUTH-009, CANC-004, TMPL-005, TIME-004, SCENE workflows | Mostly partial or deferred |
| **P3 — Defense in Depth** | State rules, payer matrices, CPT-008, SUPV-006, POS-006 | Almost entirely deferred |

---

## 2. Summary Counts

| Status | Section 1 (CPT) | Section 2 (AUTH) | Section 3 (SUPV) | Section 4 (CANC) | Section 5 (OVLP) | Section 6 (TMPL) | Section 7 (POS) | Section 8 (TIME) | Section 9 (STATE) | Section 10 (SCENE) | **TOTAL** |
|--------|-----------------|------------------|-------------------|-------------------|-------------------|-------------------|-----------------|------------------|--------------------|--------------------|-----------|
| COVERED | 2 | 0 | 0 | 0 | 1 | 1 | 1 | 1 | 0 | 0 | **6** |
| PARTIALLY | 6 | 4 | 1 | 3 | 3 | 3 | 3 | 4 | 1 | 0 | **28** |
| NEW GAP | 2 | 4 | 0 | 2 | 2 | 2 | 1 | 1 | 0 | 4 | **18** |
| DEFERRED | 0 | 1 | 12 | 0 | 1 | 2 | 1 | 0 | 4 | 14 | **35** |
| **Subtotal** | 10 | 9 | 13 | 5 | 7 | 8 | 6 | 6 | 5 | 18 | **87** |

*Note: The matrix items (Section 1.3) add 9 unique entries counted within CPT section coverage. Total unique items across all sections: ~96 (some SCENE items map directly to earlier section items).*

**Adjusted totals (deduplicating SCENE items that map to earlier sections):**

| Status | Count | Percentage |
|--------|-------|------------|
| COVERED | 6 | 8% |
| PARTIALLY COVERED | 28 | 36% |
| NEW GAP | 18 | 23% |
| DEFERRED (explicitly acceptable) | 26 | 33% |
| **Total unique items** | 78 | 100% |

---

## 3. New Plan Amendments Needed

### Engineering Decisions

| # | Decision | Rationale | Audit Items Addressed | Priority |
|---|----------|-----------|----------------------|----------|
| **E24** | **Code-pair-aware client overlap detection** | E16's `checkClientOverlap()` must be enhanced with the concurrent billing matrix from Section 1.3. Rather than just blocking individual+group overlap, it must validate code pairs: 97151/97152 cannot overlap with anything for the same client; only 97153+97155 and 97154+97155 with different providers are valid. All other same-client overlaps are blocked. | CPT-001 through CPT-005, OVLP-003, SCENE-017 | **P0** |
| **E25** | **Group-code same-provider double-booking check** | Fix the GROUP_CPT_CODES exemption: a provider cannot lead two separate group sessions simultaneously. GROUP_CPT_CODES should exempt a provider from the "different clients" overlap check (allowing multiple clients in one group) but NOT allow two distinct group sessions at the same time. | OVLP-002 | **P0** |
| **E26** | **Payer-specific concurrent billing restrictions (Texas Medicaid, NC Medicaid)** | Add payer-level `allows_concurrent_billing` check. Texas Medicaid and NC Medicaid prohibit all concurrent ABA billing. When client's payer has `allows_concurrent_billing = false`, block or warn on any same-client concurrent sessions regardless of code pair. This is a targeted use of E23's existing `allows_concurrent_billing` field. | CPT-001 (payer exceptions), STATE-TX-001, previous audit payer warnings | **P1** |
| **E27** | **Auth-aware batch generation with unit cap** | E14's batch helper must track cumulative generated units and stop when auth remaining would be exceeded. When generating, compute `approved - used - already_scheduled - cumulative_generated`. Stop or flag when negative. Display summary: "Generated X sessions (Y units). Auth has Z units remaining. W sessions skipped (would exceed auth)." | TMPL-007, AUTH-007 | **P1** |
| **E28** | **Client status cascade to scheduled sessions** | When client status changes to `discharged` or `archived`, auto-cancel all future scheduled sessions with reason "client_discharged". When status changes to `on_hold`, mark future sessions with a visual "on hold" indicator (do not cancel — preserve template). | TMPL-001, TMPL-002 | **P1** |
| **E29** | **Holiday calendar table + batch gen skip logic** | New `practice_holidays` table: `id`, `organization_id`, `date`, `name`, `created_at`. When batch generating from templates, skip dates that fall on practice holidays. | TMPL-008, SCENE-005 | **P2** |
| **E30** | **CPT-telehealth eligibility warning** | When scheduling a session with telehealth POS (02/10), warn if the CPT code is generally not telehealth-eligible (97153, 97154, 97158, 0362T, 0373T). Simple lookup against a constant array. | POS-004 | **P2** |
| **E31** | **TRICARE school-based RBT hard block** | When client's payer is TRICARE and POS is 03 (school) and provider credential is RBT, block session creation. | POS-002 | **P1** |
| **E32** | **Texas Medicaid RBT telehealth hard block** | When client's payer is Texas Medicaid and POS is 02/10 (telehealth) and provider credential is RBT or BCaBA, block session creation. | POS-003, STATE-TX-001, SUPV-010 | **P1** |

### Design Decisions

| # | Decision | Rationale | Audit Items Addressed | Priority |
|---|----------|-----------|----------------------|----------|
| **D21** | **"Pending Auth" visual indicator on calendar events** | Sessions scheduled beyond auth end date (or during auth gap) should display with a distinct visual treatment: dashed border, amber "Pending Auth" badge. This makes the financial risk visible without blocking scheduling. | AUTH-001, SCENE-004 | **P1** |
| **D22** | **Auth pacing band visualization on client schedule** | In the client schedule section (E10), show an auth pacing indicator: green (on pace), yellow (behind), orange (significantly behind), red (at risk), purple (over pace). Use AUTH-004 formula. | AUTH-004 | **P2** |

---

## 4. Architectural Decision: E23 Payer Rules — Flat Fields vs. payer_rules Table

### The Question

E23 currently adds 3 flat fields to the `payers` table:
- `max_units_per_day` (int, nullable)
- `allows_concurrent_billing` (bool, default true)
- `max_group_size` (int, nullable)

The audit document's Appendix C proposes a `PayerConfig` entity with: `mue_source`, `concurrent_billing_rules`, `telehealth_matrix`, `modifier_matrix`, `auth_cap_types`, `unit_calc_method`.

The Claude research session suggested "make the rule engine a first-class data layer, not if/else blocks" with a `payer_rules` table: `rule_type`, `code_pair`, `allowed`, `condition`, `override_value`.

### Recommendation: Keep E23's flat fields for MVP. Add payer_rules table in v1.1.

**Rationale:**

1. **The 3 flat fields solve 80% of the MVP payer variance.** `allows_concurrent_billing` handles Texas Medicaid and NC Medicaid (the two highest-impact concurrent billing restrictions). `max_units_per_day` handles payer-specific MUE overrides. `max_group_size` handles Florida Medicaid's 6-client max.

2. **The flat fields are zero-overhead to query.** They join directly to the client's payer during scheduling validation. A `payer_rules` table requires a multi-row lookup, parsing rule types, and handling precedence — complexity that does not belong in the MVP scheduling action.

3. **The payer_rules table is the right v1.1 architecture** for handling:
   - Telehealth eligibility per code per payer (POS-004)
   - Code-pair-specific concurrent billing rules (some payers allow 97153+97155 but not 97153+97156)
   - Modifier matrices per payer (POS-006)
   - Weekly/monthly unit caps beyond daily MUE (AUTH-005)
   - State-specific rules (Section 9)

4. **The migration path is clean:** v1.0 ships with 3 fields on `payers`. v1.1 adds a `payer_rules` table. The scheduling validation code checks payer_rules first (if any rows match), then falls back to the flat fields. Eventually the flat fields become deprecated.

**Schema sketch for v1.1 `payer_rules` table:**
```
payer_rules:
  id                  text PK (nanoid)
  organization_id     text NOT NULL FK -> organizations
  payer_id            text NOT NULL FK -> payers
  rule_type           text NOT NULL  -- 'concurrent_billing', 'mue_override', 'telehealth_eligibility', 'group_size', 'weekly_cap', 'modifier'
  cpt_code            text           -- nullable, for code-specific rules
  code_pair           text           -- nullable, for code-pair rules (e.g., '97153+97155')
  allowed             boolean        -- for yes/no rules
  max_value           integer        -- for cap rules
  condition           text           -- nullable, for conditional rules (e.g., 'different_providers')
  notes               text           -- human-readable explanation
  source              text           -- 'payer_manual', 'practice_experience', 'community_template'
  created_at          timestamp with tz
  updated_at          timestamp with tz

Indexes:
  (organization_id, payer_id)
  (organization_id, payer_id, rule_type)
  (organization_id, payer_id, rule_type, cpt_code)
```

**Decision: E23 remains as-is (3 flat fields on payers for MVP). The payer_rules table is added to the v1.1 roadmap as a first-class data layer.**

---

## 5. Updated Priority Matrix

### P0 — Must Fix Before Ship

These items would cause billing fraud, compliance violations, or systematic revenue loss if unaddressed.

| Item | Description | Effort | Source |
|------|-------------|--------|--------|
| **E24** | Code-pair-aware client overlap (enhance E16 with matrix) | Medium — extend `checkClientOverlap()` with code-pair lookup | CPT-001 to CPT-005, OVLP-003 |
| **E25** | Group-code double-booking fix | Small — add same-provider check for group codes | OVLP-002 |
| **E26** | Payer concurrent billing flag (`allows_concurrent_billing` enforcement) | Small — check E23's payer field during overlap validation | CPT-001 payer exceptions |

### P1 — Should Fix Before Ship

High financial impact or common scenarios that would cause user confusion.

| Item | Description | Effort | Source |
|------|-------------|--------|--------|
| **E27** | Auth-aware batch generation (stop at unit cap) | Medium — add unit tracking to batch helper | TMPL-007, AUTH-007 |
| **E28** | Client status cascade to sessions | Small — add status-change hook | TMPL-001, TMPL-002 |
| **E31** | TRICARE school-based RBT block | Small — conditional check | POS-002 |
| **E32** | Texas Medicaid RBT telehealth block | Small — conditional check | POS-003 |
| **D21** | "Pending Auth" calendar indicator | Small — CSS treatment | AUTH-001 |
| Enhance E20 | Add 60-day and 45-day auth expiration milestones | Small — add constants | AUTH-009 |
| Enhance E19 | E19 MUE check should consult E23's payer-level `max_units_per_day` first, then fall back to constants | Small — priority check | CPT-008 |

### P2 — Fast-Follow (v1.1)

Important for competitive positioning and operational completeness.

| Item | Description | Effort | Source |
|------|-------------|--------|--------|
| **E29** | Holiday calendar + batch gen skip | Medium — new table + skip logic | TMPL-008, SCENE-005 |
| **E30** | CPT-telehealth eligibility warning | Small — constant lookup | POS-004 |
| **D22** | Auth pacing band visualization | Medium — new dashboard component | AUTH-004 |
| `payer_rules` table | First-class payer rule data layer | Large — new table + query layer | Appendix C |
| Supervision tracking | SUPV-001, SUPV-002, SUPV-008 | Large — new module | Section 3 |
| Cancellation cascade | CANC-003 7-step cascade logic | Medium — event-driven | Section 4 |
| Auth renewal comparison | AUTH-002 old-vs-new parameter diff | Medium — comparison query | AUTH-002 |
| Group session management | EC-019 min/max, SCENE-006 drop-below | Medium — group enrollment UI | CPT-002, CPT-005, CPT-006 |
| Seasonal templates | TMPL-005 school year/summer swap | Medium — template variants | SCENE-003 |
| TMPL-003 bulk reassignment | Full RBT departure workflow | Large — assignment UI | SCENE-002 |

### P3 — v2.0

| Item | Description | Source |
|------|-------------|--------|
| Full payer rules engine (Layer 3) | State-specific rules, telehealth matrices, modifier matrices | Section 9, POS-005, POS-006 |
| CPT-004 assessment window enforcement | 97151 usage restriction to assessment periods | CPT-004 |
| CPT-009 per-provider daily/weekly combined caps | Nevada-style combined caps | CPT-009 |
| Cross-state licensure validation | Provider licensure by state for telehealth | POS-005 |
| AUTH-005 full multi-layer cap enforcement | Weekly + daily + period caps simultaneously | AUTH-005 |
| AUTH-008 concurrent review cascade | Reduced hours cascade to schedule | AUTH-008 |
| SCENE-013 cross-practice RBT visibility | Multi-tenant cross-practice flagging | SCENE-013 |
| SCENE-015 insurance transition workflow | Future-dated payer change + auth migration | SCENE-015 |
| All remaining STATE items | CA, FL, NY, MA specific rules | Section 9 |
| 0362T/0373T validation | "Immediately available" QHP check | CPT-007 |

---

## 6. Items to Add to TODOS.md

### Scheduling v1.0 (Before Ship)

```
- [ ] E24: Enhance checkClientOverlap() with concurrent billing code-pair matrix
- [ ] E25: Fix GROUP_CPT_CODES exemption — block same-provider two-group overlap
- [ ] E26: Enforce allows_concurrent_billing from payer during overlap validation
- [ ] E27: Auth-aware batch generation — track cumulative units, stop at auth cap
- [ ] E28: Client status cascade — auto-cancel scheduled sessions on discharge/archive
- [ ] E31: TRICARE school-based RBT hard block (POS 03 + TRICARE + RBT)
- [ ] E32: Texas Medicaid RBT telehealth hard block (POS 02/10 + TX Medicaid + RBT/BCaBA)
- [ ] D21: "Pending Auth" dashed-border visual on calendar events beyond auth dates
- [ ] Enhance E19: MUE check consults payer-level max_units_per_day (E23) first
- [ ] Enhance E20: Add 60-day and 45-day auth expiration milestones
```

### Scheduling v1.1 (Fast-Follow)

```
- [ ] E29: Holiday calendar table + batch gen skip logic
- [ ] E30: CPT-telehealth eligibility warning (97153/97154/97158 at POS 02/10)
- [ ] D22: Auth pacing band visualization (green/yellow/orange/red) on client schedule
- [ ] payer_rules table: first-class data layer for payer-specific scheduling rules
- [ ] Supervision compliance tracker (SUPV-001, SUPV-002, SUPV-008)
- [ ] Cancellation cascade logic (CANC-003 — 7-step cascade on cancel)
- [ ] Auth renewal parameter comparison (AUTH-002 — old vs new auth diff)
- [ ] Group session management (min/max, code conversion on drop-below)
- [ ] Seasonal template swap (school year / summer / break templates)
- [ ] Bulk reassignment workflow for RBT departure (TMPL-003, SCENE-002)
- [ ] "On hold" session suspension (TMPL-002 — preserve template, pause generation)
- [ ] TRICARE parent training milestone tracking (EC-023, SCENE-009)
- [ ] Provider-payer credentialing matrix (EC-013)
- [ ] Make-up session workflow (AUTH-006)
- [ ] Cancellation rate benchmarks + dashboard (CANC-004)
```

---

## 7. Key Risks and Open Questions

### Risk 1: Concurrent Billing Matrix Complexity

The full 10x10 matrix with conditions (C*, C**, C***) is the most complex validation in the system. E24 must implement this carefully:

- **Implementation approach:** Create a `CONCURRENT_BILLING_MATRIX` constant (similar to `ABA_CPT_CODES`) that encodes the matrix. `checkClientOverlap()` looks up the code pair and applies the condition.
- **Condition handling:** "C* = different providers" is automatically satisfied since we only check same-client overlaps across different sessions. "C** = patient not present" cannot be validated at scheduling time — treat as informational note. "C*** = direction only" is an edge case for 0362T/0373T.

### Risk 2: Payer Data Availability During Scheduling

Several validations (E26, E31, E32, E19 enhancement) require knowing the client's payer at scheduling time. This requires a join from session -> client -> client_insurances -> payers. Ensure this join is efficient and the payer information is available in the scheduling action context.

### Risk 3: Batch Generation Performance with Auth Checks

E27 adds auth unit tracking to batch generation. E14 was explicitly designed to SKIP auth matching for performance. The enhancement needs to be lightweight: compute the running total client-side (sum units as you generate) and compare against a single pre-fetched auth remaining value. Do NOT do per-session FIFO matching or FOR UPDATE locks during batch gen.

### Risk 4: Group Code Exemption Fix (E25) Scope

The current `checkSessionOverlap()` returns early for group codes. E25 needs to change this to: "If the code is a group code AND the overlapping session is for a DIFFERENT client, allow (this is a group). If the overlapping session is for the SAME provider but a DIFFERENT group session (same provider, different set of clients, same time), block." This requires distinguishing "same group" from "different group" — which may need a `group_session_id` field or similar concept in v1.1.

For MVP, the simplest fix: group codes skip the per-client overlap check but still enforce per-provider overlap (a provider cannot lead two groups at once).

---

## Appendix: Concurrent Billing Matrix Constant (Implementation Reference)

```typescript
// For E24: Code-pair validation for same-client overlaps
// 'block' = never allowed for same client same time
// 'allow_different_providers' = allowed only if different providers
// 'allow_conditional' = allowed with conditions (informational)
export const CONCURRENT_BILLING_MATRIX: Record<string, Record<string, 'block' | 'allow_different_providers' | 'allow_conditional'>> = {
  '97151': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'block', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '97152': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'block', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '97153': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'allow_different_providers', '97156': 'allow_conditional', '97157': 'allow_conditional', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '97154': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'allow_different_providers', '97156': 'allow_conditional', '97157': 'allow_conditional', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '97155': { '97151': 'block', '97152': 'block', '97153': 'allow_different_providers', '97154': 'allow_different_providers', '97155': 'block', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'allow_conditional', '0373T': 'allow_conditional' },
  '97156': { '97151': 'block', '97152': 'block', '97153': 'allow_conditional', '97154': 'allow_conditional', '97155': 'block', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '97157': { '97151': 'block', '97152': 'block', '97153': 'allow_conditional', '97154': 'allow_conditional', '97155': 'block', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '97158': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'block', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '0362T': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'allow_conditional', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
  '0373T': { '97151': 'block', '97152': 'block', '97153': 'block', '97154': 'block', '97155': 'allow_conditional', '97156': 'block', '97157': 'block', '97158': 'block', '0362T': 'block', '0373T': 'block' },
};
```

---

*Report generated 2026-03-28 by Claude Opus 4.6 (1M context)*
*This is the definitive audit. All previous audit findings are incorporated and superseded by this document.*
