# Scheduling Plan Audit Report: MVP Edge Case Coverage

> **Date:** 2026-03-28
> **Auditor:** Claude Opus 4.6
> **Scope:** Cross-reference the 23 MVP Must-Handle edge cases against the CEO plan (decisions E1-E15, D1-D18) and existing codebase (`sessions.ts`, `constants.ts`, `session-helpers.ts`)
>
> **CORRECTION NOTE (2026-03-28):** The "Plan 'Warn Not Block' vs. Research 'Must Block'"
> section was based on overstated universality of concurrent billing rules. After deeper
> research, only 7 code-definition rules are true hard blocks. Everything else is
> configurable AMA/ABA defaults. See CEO plan "Validation Philosophy Amendment (CORRECTED)."
> Items EC-003, EC-004, EC-005 are correctly handled as warnings (not blocks) per the
> corrected framing. EC-010 (auth >100%) remains a hard block (math, not policy).
>
> **Documents reviewed:**
> - CEO plan: `~/.gstack/projects/cjones6489-clinivise-pm/ceo-plans/2026-03-27-scheduling-calendar.md`
> - Feature spec: `docs/platform/features/scheduling.md`
> - Edge case master: `docs/research/scheduling/aba-scheduling-edge-cases-master.md`
> - Independent research: `docs/research/scheduling/claude_scheduling_research.md` (sections 2, 5, 7)
> - Existing code: `src/server/actions/sessions.ts`, `src/lib/constants.ts`, `src/lib/session-helpers.ts`

---

## MVP Edge Case Audit Table

| EC-ID | Title | Category | Status | Plan Reference | Code Reference | Gap Description | Recommended Fix |
|-------|-------|----------|--------|---------------|----------------|-----------------|-----------------|
| EC-001 | Same provider overlapping 1:1 sessions | HARD BLOCK | **COVERED** | Architectural Decision 4 ("hard blocks only for provider overlap"); E14 (batch helper shares overlap detection); D6 (cross-column drag overlap check) | `checkSessionOverlap()` in `sessions.ts` lines 141-179; GROUP_CPT_CODES exemption at line 151 | None. Fully implemented with group code exemption. | None needed. |
| EC-002 | RBT billing QHP-only codes | HARD BLOCK | **COVERED** | Feature spec "Validation Rules" item 4 (warning); existing code treats as hard block | `validateCptCredential()` in `sessions.ts` lines 130-136; `QHP_ONLY_CPT_CODES` in `constants.ts` line 702 | None. Hard block for RBTs, BCaBAs allowed through (correct per payer variance). | None needed. |
| EC-003 | Session under expired authorization | HARD BLOCK | **GAP** | Plan says E6: "Batch creates sessions even beyond auth dates. Warning toast." Plan Decision 4: "Auth validation as warnings at booking, hard blocks only for provider overlap." | `createSession` does FIFO auto-select filtering by `lte(authorizations.startDate, sessionDate)` and `gte(authorizations.endDate, sessionDate)` -- but this is for auto-matching, not blocking. If no auth matches, session is created with null auth. | **The plan explicitly allows scheduling against expired auths (E6: "Practices schedule ahead of re-auth").** Research recommends HARD BLOCK. The existing code does not block -- it simply fails to match an auth and proceeds with `authServiceId = null`. Sessions are created with no authorization reference, which means zero validation that the auth is expired vs. never existed vs. pending. | See E16 recommendation below. The plan's "warn not block" philosophy directly conflicts with this edge case. A session created with no auth link and no explicit warning creates silent revenue loss. At minimum, the UI must display an unmissable "NO ACTIVE AUTHORIZATION" banner on the booking form and require acknowledgment. For expired auths specifically, auto-transition auth status to `expired` when end_date passes. |
| EC-004 | CPT code not on authorization | HARD BLOCK | **GAP** | Plan mentions "Auth remaining display" on quick-create (Decision 8) and E1 (query-time auth projection). Feature spec mentions "restrict CPT code options to codes on active auth." | `fetchMatchingAuthorizations` in `sessions.ts` lines 640-686 filters by `eq(authorizationServices.cptCode, parsedInput.cptCode)`. This returns empty if no auth covers the CPT. But `createSession` does not block on empty auth results. | **The feature spec says "restrict CPT code options" but the plan does not enforce this restriction.** The code allows session creation with any CPT regardless of authorization coverage. The `fetchMatchingAuthorizations` query is used for form cascade (UI hint) but never as a gate. | Add CPT-auth validation to the scheduling action. At minimum: when status="scheduled" and no auth covers this CPT, emit a WARNING (not block, per plan philosophy). But display prominently: "97156 is not authorized for this client. Active auth covers: 97153, 97155." Require acknowledgment checkbox. |
| EC-005 | Session outside auth date range | HARD BLOCK | **PARTIALLY COVERED** | E6 explicitly allows this: "Batch creates sessions even beyond auth dates." E1 (projected auth) shows remaining at booking. | FIFO matching in `createSession` filters `lte(startDate, sessionDate)` and `gte(endDate, sessionDate)`, so out-of-range sessions get no auth match. No block exists. | **Same issue as EC-003.** Sessions outside auth date range are created without any auth link and without explicit user notification at the action level. The UI shows "Auth remaining" but the action does not enforce or warn. For batch generation, E6 says sessions are created even beyond auth dates with a warning toast. | The batch generation warning toast (E6) partially addresses this for templates. For individual booking, add a server-side check: if no auth covers the session date, return a warning in the action response. The UI must surface this. For batch gen, differentiate "no auth exists" vs. "auth expired" vs. "beyond auth end date" in the warning. |
| EC-007 | Provider credential expired | HARD BLOCK | **GAP** | Not mentioned in the plan. Feature spec defers "Credential-gated booking" to LATER phase. CEO plan defers it to TODOS.md. | `validateSessionForeignKeys` checks `provider.isActive` but has no credential expiration check. The `providers` table likely has no credential expiration date column. | **Complete gap.** Neither the plan nor existing code tracks provider credential expiration dates. The plan explicitly defers this. However, the edge case master rates this as MVP Must-Handle (HARD BLOCK) because all sessions by an expired-credential provider are unbillable. | Requires schema addition: credential expiration dates on the providers table (or a `provider_credentials` table). For MVP, a pragmatic compromise: add `credentialExpiresAt` to the providers table. Check at session creation: if expired, hard block with "Provider credential expired on [date]. Reassign to a credentialed provider." Add proactive dashboard alerts at 90/60/30 days. This is a plan amendment (E16). |
| EC-008 | Same provider billing 97153+97155 simultaneously | HARD BLOCK | **PARTIALLY COVERED** | Not explicitly called out in the plan. | `checkSessionOverlap()` blocks same-provider overlapping 1:1 sessions. 97155 is NOT in GROUP_CPT_CODES, so same-provider 97153+97155 overlap would be caught by the existing overlap check. | The existing overlap check catches this case implicitly -- if the same provider tries to schedule both 97153 and 97155 at overlapping times, `checkSessionOverlap` blocks it (since neither is a group code). However, the error message says "cannot deliver 1:1 services to two clients simultaneously," which is misleading -- this scenario is same client, different codes. The message should be specific to the fraud scenario. | Improve error messaging: detect when the overlap is same-client + different codes and produce a specific message: "A single provider cannot bill 97153 and 97155 for overlapping time. Use separate providers." Low effort, high clarity. |
| EC-009 | Client in individual + group at same time | HARD BLOCK | **GAP** | Not mentioned in the plan. | `checkSessionOverlap()` checks **provider** overlap, not **client** overlap. A client scheduled for 97153 with Provider A and 97154 with Provider B at the same time would pass all existing checks. | **No client-level overlap detection exists.** The current code only checks provider conflicts, not client conflicts. A client physically cannot be in both individual and group therapy simultaneously. | Add `checkClientOverlap()` function: same client, same date, overlapping times, incompatible code types (individual 97153 vs. group 97154). Group+group at same time should also be blocked (client can only be in one group). This requires a new validation function and a plan amendment (E17). |
| EC-010 | Exceeding authorized units (100%) | HARD BLOCK | **PARTIALLY COVERED** | E1: "Query-time auth projection: approved - used - SUM(future scheduled)." E6: "Generate + warn on auth mismatch." The plan projects remaining units but does not specify a hard block at 100%. | `createSession` does FIFO matching with `lt(usedUnits, approvedUnits)` -- this prevents matching to an exhausted auth. But if no auth matches, the session is created without auth linkage (no block). `computeCreateAccountingOps` only increments for status="completed". | **Partial coverage.** For completed sessions, the FIFO check `lt(usedUnits, approvedUnits)` prevents assigning to an exhausted auth. But for scheduled sessions, E14 explicitly says "scheduled sessions don't consume units" and FIFO/FOR UPDATE is skipped. The E1 projection (approved - used - future_scheduled) is query-time only -- it's never enforced as a constraint. A scheduler could book sessions totaling 600 units against a 520-unit auth with no block. | The projection query (E1) must be computed at booking time and enforced. When `approved - used - SUM(future_scheduled) - new_session_units < 0`, emit a hard block (or at minimum a mandatory-acknowledge warning). This is the most financially impactful gap -- the research shows 100% denial for excess units. Implement as a new check in the scheduling action or the batch-optimized helper (E14). Plan amendment E18. |
| EC-011 | Auth approaching unit limit (80-95%) | WARNING | **PARTIALLY COVERED** | E1: projected utilization query. Decision 8: "Auth remaining display" on quick-create popover. | `AUTH_ALERT_THRESHOLDS` in `constants.ts` defines `UTILIZATION_WARNING_PCT: 80` and `UTILIZATION_CRITICAL_PCT: 95`. `fetchMatchingAuthorizations` returns `remainingUnits`. | The constants and query infrastructure exist. The plan shows "Auth: 142/200 units remaining" in the quick-create popover. But there is no warning trigger at 80% or 95% -- just a passive display. The thresholds are defined but never referenced in the scheduling flow. | Wire the threshold constants into the scheduling UI. When the projected remaining (after this booking) drops below 20% of approved, show amber warning. Below 5%, show red critical warning. The data and constants are ready -- just needs UI integration. Low effort. |
| EC-012 | Daily MUE limit exceeded | WARNING | **PARTIALLY COVERED** | Feature spec "Validation Rules" item 3: "MUE exceeded for this CPT code on this date." | `ABA_CPT_CODES` in `constants.ts` includes `maxUnitsPerDay` for every code. No MUE check exists in `createSession` or any scheduling action. | **MUE data exists in constants but is never checked.** The `maxUnitsPerDay` values are defined per CPT code but no validation aggregates daily units across sessions for a client+CPT combination. | Add a daily MUE check to the scheduling action: query sum of units for same client + same CPT + same date (excluding cancelled sessions). If adding this session would exceed `maxUnitsPerDay`, emit a warning (not block -- MUE indicator 3 allows justified exceedance). Display: "This would bring daily 97153 total to 36 units (MUE limit: 32)." Plan amendment E19. |
| EC-013 | Provider not credentialed with payer | WARNING | **GAP** | Not mentioned in the plan. Feature spec defers "Credential-gated booking" to LATER. | No provider-payer credentialing data exists in the schema. The `providers` table has `credentialType` (BCBA/RBT/etc.) but not payer-specific credentialing status. | **Complete gap.** No provider-payer credentialing matrix exists. The research notes this causes 100% claim denial (CO-185) when a provider isn't paneled with the client's insurer. The plan defers this entirely. | For MVP, this is admittedly complex to implement fully (requires a `provider_payer_credentials` junction table). Pragmatic MVP approach: add a warning note on the session form if the provider has never had a completed session billed to this client's payer. This uses existing data as a heuristic. Full implementation deferred to v1.1 as the master doc allows. However, given the 100% denial risk, flag this as a high-priority fast-follow. |
| EC-016 | Authorization gap during renewal | WARNING | **PARTIALLY COVERED** | E6: "Practices schedule ahead of re-auth." Plan allows scheduling beyond auth dates. Feature spec mentions "30/14/7-day countdown." | `AUTH_ALERT_THRESHOLDS.EXPIRY_WARNING_DAYS: 30` in constants. No gap detection logic exists. Auth status transitions (pending/approved/expired) exist in `AUTH_STATUSES`. | The plan acknowledges that practices schedule ahead of re-auth (E6) but does not implement the multi-stage alert system the research recommends (45/30/14/7 days). The constants define a 30-day threshold but it's not wired into scheduling. No visual "AUTHORIZATION GAP" indicator is specified in the plan's calendar design decisions. | Add auth expiration countdown to the client schedule section (D-10, E10). When scheduling in a gap period (after auth end, before new auth start), show a prominent "AUTH GAP" visual indicator on the calendar event. Implement tiered alerts: the 30-day threshold exists in constants; add 14-day and 7-day variants. Display on dashboard and in scheduling forms. Plan amendment E20. |
| EC-025 | Back-to-back sessions without travel buffer | WARNING | **GAP** | CEO plan defers "Drive time tracking" to TODOS.md. Feature spec defers to "Phase 3." | No travel time or location-distance logic exists in the codebase. Sessions have `placeOfService` and `serviceAddress` but no proximity calculation. | **Complete gap.** The plan explicitly defers drive time. However, the edge case master rates this as MVP Must-Handle because it's a daily occurrence and a top RBT turnover driver. The research shows 30% of RBTs drive >1 hour between sessions. | Pragmatic MVP: when scheduling a provider's next session at a different `serviceAddress` with <30 minutes gap, show a soft warning: "Next session is at a different location with [X] minutes between sessions." No distance calculation needed -- just flag when `serviceAddress` differs and gap < 30 min. This is low-effort and covers the most common case. Full drive-time calculation deferred. Plan amendment E21. |
| EC-034 | Concurrent BCBA-RBT overlap (allow + display) | WARNING/INFO | **PARTIALLY COVERED** | D3 (event click popover shows details). D6 (cross-column drag). Feature spec mentions concurrent billing. | `checkSessionOverlap()` checks **provider** overlap only. Different providers with overlapping times for the same client are NOT flagged -- they pass through silently. This is correct (concurrent billing is valid). | The code correctly allows different-provider overlap. However, the plan does not specify how concurrent sessions are **displayed** on the calendar. D2 (event card) and D3 (popover) don't mention concurrent session indicators. The research says this must be layered/stacked, not treated as a conflict. The plan's multi-provider day view (D12) would show them in separate columns, which naturally solves provider-level display. But on the client schedule view, concurrent sessions need stacked display. | Add to the calendar UX spec: when viewing a single client's schedule (E10, client detail), show concurrent BCBA+RBT sessions as stacked/layered blocks with a "concurrent billing" indicator. In the quick-create popover, when scheduling a BCBA 97155 that overlaps an existing RBT 97153 for the same client, show informational note: "This overlaps with [RBT]'s 97153 session. Concurrent billing will apply." Low effort UX addition. Plan amendment D19. |
| EC-036 | Documentation-schedule time mismatch | WARNING | **PARTIALLY COVERED** | E5: "Complete Session -> status change + pre-fill times -> redirect to note form." Times are pre-filled from schedule. | `computeActualMinutes()` in `session-helpers.ts` computes duration from provided times. Session creation stores `startTime`, `endTime`, and `actualMinutes`. | The plan's E5 pre-fills times from the scheduled appointment, which is exactly the right pattern. However, no validation exists to flag when actual documented times differ from scheduled times by >15 minutes. The session note flow (Phase 2 current build) would need to compare note times against session times. | At session completion (status transition from scheduled -> completed): if the user changes start/end times such that `|actual - scheduled| > 15 minutes`, show a warning: "Documented time differs from scheduled by [X] minutes. Ensure actual times are recorded accurately." The pre-fill-and-confirm pattern from E5 is good -- just add the delta check. Plan amendment E22. |
| EC-038 | Auth under-utilization pacing | MONITORING | **PARTIALLY COVERED** | E1: projected auth utilization query. Feature spec mentions "auth pacing alerts." Dashboard metrics accepted (Scope Decision 1). | `AUTH_ALERT_THRESHOLDS.UNDER_UTILIZATION_PCT: 50` in constants. No pacing query or dashboard widget exists yet. | The constant threshold (50%) exists. The projected utilization query (E1) provides the math. But no dashboard widget, no pacing calculation (actual vs. expected linear interpolation), and no alert trigger are implemented. The plan accepts dashboard integration but only specifies "sessions today, hours this week" -- not auth pacing. | Add an auth pacing metric to the dashboard scope. For each active client: `(used_units / expected_units_by_today) * 100%`. If < 50% with > 50% of auth period elapsed, surface on dashboard. E1's projection query provides the foundation. Plan amendment to Dashboard scope (expand Scope Decision 1). |
| EC-040 | Client cancellation rate threshold | MONITORING | **PARTIALLY COVERED** | Plan captures `cancellationReason` and `cancelledBy` on session cancel. Feature spec mentions "Cancellation reason tracking + analytics" in NEXT phase. | `CANCELLATION_REASONS` and `CANCELLED_BY_OPTIONS` in constants. `cancelSession` stores reason and cancelledBy. | Cancellation data is captured, which is the prerequisite. But no aggregation query, no threshold check, and no dashboard alert exists. The plan defers cancellation analytics to NEXT phase. | Pragmatic MVP: add a simple cancellation rate display to the client detail page (E10 client schedule section). Count cancelled vs. total sessions in last 30 days. Flag if > 30%. The data exists -- just needs a query and a badge. No new schema needed. Plan note for E10. |
| EC-042 | Sessions without notes (aging) | MONITORING | **PARTIALLY COVERED** | E5: session conversion flow includes note completion. The session notes feature (Phase 2 current build) tracks note status. | Session notes system exists (Phase 2). `NOTE_STATUSES` in constants: `["draft", "signed"]`. Sessions have a completion flow. | Note tracking exists from Phase 2. But no aging query ("sessions completed > 48 hours ago without a signed note") is specified in the plan. The plan's dashboard scope (Scope Decision 1) only mentions "sessions today, hours this week." | Add a "notes overdue" count to the dashboard metrics (alongside sessions today, hours this week). Query: completed sessions where `session_date < NOW() - 48h` and no associated signed note. Simple count + link to filtered sessions list. Plan amendment to Scope Decision 1. |
| EC-047 | Recurring template beyond auth end date | MONITORING | **PARTIALLY COVERED** | E6: "Batch creates sessions even beyond auth dates. Warning toast." E9: "Warn at template creation for overlap." E13: "Auto-generate on template save." | No template-to-auth comparison exists in code yet (template table is new). | The plan acknowledges this scenario (E6) and provides the warning toast mechanism. However, the warning is reactive (shown after batch generation), not proactive. No ongoing monitoring scans templates weekly to flag those generating sessions beyond auth end dates. | At template creation/update (E9 + E13): compare `effective_until` (or ongoing) against client's current auth end date. If template extends beyond auth, show warning: "This template generates sessions past auth expiration ([date]). Sessions after this date may not be billable." Also: during batch generation, count and separately report sessions created beyond auth coverage. Plan amendment E23. |
| EC-054 | Multi-provider concurrent session display | INFORMATIONAL | **COVERED** | D6: cross-column drag reassigns provider. D12: multi-provider max 6 columns. The multi-provider day view naturally displays concurrent sessions in separate provider columns. | No calendar UI exists yet, but the Schedule-X resource view handles multi-provider display natively. | The multi-provider side-by-side view (D12) inherently shows concurrent sessions -- each provider is a column, so overlapping BCBA+RBT sessions for the same client appear in their respective columns at the same time. Schedule-X handles this natively. | None needed for the multi-provider view. For the single-provider or client-focused view, add stacked display for concurrent sessions (see EC-034 note). |
| EC-061 | Drive time as non-billable block | INFORMATIONAL | **GAP** | CEO plan defers drive time tracking to TODOS.md. No mention of non-billable time blocks in the plan. | No non-billable block concept in the codebase. Sessions are always billable service records. | **Complete gap.** The plan does not support scheduling non-billable blocks (travel, admin, notes time) on the calendar. The research rates this as MVP Must-Handle because without it, provider "availability" is inaccurate -- they show as free during drive time. | Pragmatic MVP: Allow creating calendar events that are NOT sessions -- a simple "block" type with a label (travel, admin, break). These render on the calendar and affect availability display but don't touch the sessions table. Could be as simple as a `calendar_blocks` table with: `provider_id`, `date`, `start_time`, `end_time`, `block_type`, `notes`. Plan amendment E24 + new table. |
| EC-063 | Coverage board for provider absence | INFORMATIONAL | **GAP** | D18: "Bulk reassign deferred. Provider callout handled via one-at-a-time drag-drop + individual cancel." | No coverage/absence workflow exists. | **The plan acknowledges provider absence but defers bulk handling (D18).** The research recommends a coverage board showing unassigned sessions vs. available providers. The plan only offers one-at-a-time drag-drop, which is inadequate for a morning-of callout with 3-5 affected sessions. | Pragmatic MVP: "Mark provider unavailable" action that: (1) lists all their sessions for the day, (2) shows sessions as "needs coverage" with orange indicator, (3) allows one-click reassign per session from a filtered provider dropdown. Not a full coverage board, but better than pure drag-drop. Could be a dialog triggered from the provider filter sidebar. Plan amendment D20. |

---

## Summary

### Coverage Totals

| Status | Count | Percentage |
|--------|-------|------------|
| **COVERED** | 3 | 13% |
| **PARTIALLY COVERED** | 11 | 48% |
| **GAP** | 9 | 39% |
| **Total** | 23 | 100% |

### By Edge Case Category

| Category | Total | Covered | Partial | Gap |
|----------|-------|---------|---------|-----|
| HARD BLOCK | 9 | 2 | 4 | 3 |
| WARNING | 6 | 0 | 5 | 1 |
| MONITORING | 5 | 0 | 5 | 0 |
| INFORMATIONAL | 3 | 1 | 0 | 2 |

### Critical Finding: HARD BLOCK Gaps

Three edge cases rated HARD BLOCK by the research are complete gaps:

1. **EC-007 (Provider credential expired)** -- The plan explicitly defers credential-gated booking. Every session by an expired-credential provider is 100% unbillable. This is a schema gap (no expiration date field) and a validation gap.

2. **EC-009 (Client in individual + group simultaneously)** -- No client-level overlap detection exists anywhere. The code only checks provider overlap. A client physically cannot be in two places at once.

3. **EC-013 (Provider not credentialed with payer)** -- No provider-payer credentialing data exists. 100% denial risk. This requires a new junction table.

### Critical Finding: Plan "Warn Not Block" vs. Research "Must Block"

The CEO plan's philosophy (Decision 4: "Auth validation as warnings at booking, hard blocks only for provider overlap") directly conflicts with the research's recommendations on 5 edge cases:

| EC-ID | Research Says | Plan Says | Financial Impact |
|-------|--------------|-----------|------------------|
| EC-003 | HARD BLOCK expired auths | Warn (E6: allow scheduling beyond auth) | $2,000-4,000/week per full-time client |
| EC-004 | HARD BLOCK mismatched CPT | Not addressed (implicit allow) | 100% denial, cannot retroactively change CPT |
| EC-005 | HARD BLOCK outside date range | Warn (E6: same as EC-003) | $1,500-3,000 per week of gap |
| EC-010 | HARD BLOCK at 100% utilization | Projected display only (E1), no enforcement | 100% denial for excess + audit trigger |
| EC-007 | HARD BLOCK expired credentials | Deferred entirely | All sessions unbillable during lapse |

**The plan's rationale is valid for EC-003 and EC-005:** practices genuinely schedule ahead of re-auth to maintain clinical continuity. Blocking would break real workflows. However, the plan fails to distinguish between:
- **Optimistic scheduling** (no auth yet, but re-auth in progress) -- should warn
- **Negligent scheduling** (auth expired, no re-auth submitted, scheduling continues) -- should block or require explicit override

**The plan's rationale is NOT valid for EC-004 and EC-010:** scheduling a CPT code that isn't on any authorization, or scheduling beyond 100% of authorized units, has no legitimate workflow justification. These should be hard blocks with admin override, not silent allows.

---

## Required Plan Amendments

### New Engineering Decisions

| # | Decision | Rationale | Edge Cases Addressed |
|---|----------|-----------|---------------------|
| E16 | **Add `credentialExpiresAt` to providers table** | Track provider credential expiration. Hard block session creation when expired. Dashboard alerts at 90/60/30 days. | EC-007 |
| E17 | **Add `checkClientOverlap()` validation** | Prevent same client from being scheduled for individual + group (or individual + individual) at overlapping times. | EC-009 |
| E18 | **Enforce projected auth utilization at booking** | At scheduling time, compute `approved - used - SUM(future_scheduled) - new_units`. Warn at 80%, critical at 95%, require admin override at 100%. Use E1's projection query in the action, not just the UI. | EC-010, EC-011 |
| E19 | **Add daily MUE accumulator check** | Query daily units per client+CPT. Warn when new session would exceed `maxUnitsPerDay`. Use existing `ABA_CPT_CODES` constants. | EC-012 |
| E20 | **Multi-stage auth expiration alerts** | Implement 30/14/7-day countdown using existing `AUTH_ALERT_THRESHOLDS`. Add visual "AUTH GAP" indicator on calendar events during gap periods. | EC-016 |
| E21 | **Minimal travel buffer warning** | When scheduling a provider's next session at a different `serviceAddress` with < 30 min gap, show soft warning. No distance API needed -- just address comparison + time gap check. | EC-025 |
| E22 | **Time delta check at session completion** | When transitioning scheduled -> completed, flag if actual times differ from scheduled by > 15 minutes. Warning only, not block. | EC-036 |
| E23 | **Template-to-auth boundary check** | At template creation and batch generation, compare against auth end date. Separate reporting of "within auth" vs. "beyond auth" sessions in batch results. | EC-047 |
| E24 | **Non-billable calendar blocks table** | New `calendar_blocks` table (provider, date, times, type, notes). Renders on calendar but not in sessions table. Types: travel, admin, break, notes time. | EC-061 |

### New Design Decisions

| # | Decision | Rationale | Edge Cases Addressed |
|---|----------|-----------|---------------------|
| D19 | **Concurrent session indicator in client view** | When viewing a client's schedule, show stacked BCBA+RBT sessions with "concurrent billing" badge. In quick-create, show informational note when overlap detected with different provider. | EC-034 |
| D20 | **"Mark unavailable" provider action** | Dialog listing provider's sessions for the day as "needs coverage." Filtered provider dropdown for one-click reassign per session. Triggered from provider sidebar or calendar right-click. | EC-063 |

### Expanded Existing Decisions

| Existing | Amendment | Edge Cases Addressed |
|----------|-----------|---------------------|
| Scope Decision 1 (Dashboard) | Add: auth pacing metric, notes overdue count, per-client cancellation rate badge | EC-038, EC-042, EC-040 |
| E1 (Query-time auth projection) | Enforce server-side, not just UI display. Return warning/block signal from the scheduling action. | EC-010, EC-011 |
| E6 (Generate + warn) | Differentiate warning types: "no auth exists" vs. "auth expired" vs. "beyond auth end date" vs. "auth pending." Require acknowledgment for the first two. | EC-003, EC-005 |
| E10 (Client schedule section) | Add: auth expiration countdown, cancellation rate badge, template-beyond-auth indicator | EC-016, EC-040, EC-047 |
| E14 (Batch-optimized helper) | Add: client overlap check, MUE check, and projected utilization check. These are fast queries that don't need FOR UPDATE locks. | EC-009, EC-012, EC-010 |

---

## Code Changes Required

### New Functions / Queries

1. **`checkClientOverlap()`** -- New function in `sessions.ts` or scheduling actions. Query: same org, same client, same date, overlapping times, non-cancelled, incompatible code types.

2. **`checkDailyMUE()`** -- New function. Query: `SUM(units)` for same org + client + CPT + date (excluding cancelled). Compare against `ABA_CPT_CODES[cptCode].maxUnitsPerDay`.

3. **`getProjectedAuthUtilization()`** -- New query. `approved_units - used_units - SUM(units WHERE status='scheduled' AND same auth_service)`. Returns remaining schedulable units.

4. **`checkTravelBuffer()`** -- New function. For the provider's adjacent session on the same date, compare `serviceAddress`. If different and gap < 30 minutes, return warning.

5. **`getProviderCredentialStatus()`** -- New query checking `credentialExpiresAt` against current date.

### Schema Changes

1. **`providers` table**: Add `credential_expires_at` (timestamp with tz, nullable).
2. **New `calendar_blocks` table**: `id`, `organization_id`, `provider_id`, `block_date`, `start_time`, `end_time`, `block_type` (text: travel/admin/break/notes), `notes`, `created_at`, `updated_at`.
3. **New indexes on `sessions`**: `(organization_id, client_id, session_date, status)` for client overlap checks. The plan already adds `(org, client, session_date)` -- ensure `status` is included or the query filters efficiently.

### Existing Code Modifications

1. **`createSession` action**: Add calls to `checkClientOverlap()`, `checkDailyMUE()`, and `getProjectedAuthUtilization()` in the validation section (after FK validation, before transaction).
2. **`validateSessionForeignKeys`**: Add credential expiration check on the provider query.
3. **Batch generation helper (E14)**: Include client overlap, MUE, and projected utilization checks (as warnings in the batch result, not blocks).

---

## Payer-Specific Rules Cross-Reference

The Claude research (section 7) identifies payer-specific scheduling rules. Cross-referencing against the plan:

| Payer Rule | Research Reference | Plan Coverage | Recommendation |
|-----------|-------------------|---------------|----------------|
| **Texas Medicaid: No concurrent ABA billing** | Section 7: "Prohibited -- no concurrent ABA providers" | Plan allows BCBA+RBT concurrent billing (EC-034). No payer-specific override. | **WARNING needed.** For Texas Medicaid clients, concurrent BCBA+RBT billing that is valid elsewhere triggers denial. This is a v1.1 payer rules engine issue, but flag now: when client's payer is Texas Medicaid and concurrent sessions detected, warn. |
| **Texas Medicaid: RBTs cannot deliver telehealth** | Section 7: "RBTs may NOT deliver telehealth" | Not addressed anywhere. | **WARNING needed.** When scheduling an RBT for POS 02 or 10 (telehealth) with a Texas Medicaid client, warn: "Texas Medicaid does not reimburse RBT telehealth." |
| **Florida Medicaid: Group max 6 (not 8)** | Section 7: "6 maximum (stricter than CPT)" | Plan uses CPT standard (2-8). No payer-specific group limits. | **Informational.** Group session management is v1.1 (EC-019). Note for future: payer-configurable group size max. |
| **TRICARE: 97151 within 14 days of first DOS** | Section 7: "97151: all units within 14 days" | Not addressed. Assessment scheduling (EC-055) is v1.1. | **Informational.** Flag for v1.1 assessment scheduling. |
| **TRICARE: Parent training 1st session within 30 days** | Section 7: "1st session within 30 days, 6 within 6-month auth" | EC-023 deferred to v1.1. | **Acceptable deferral.** EC-023 is in v1.1 Should-Handle. |
| **TRICARE: School-based RBT NOT covered** | Section 7: "school-based RBT NOT covered" | Not addressed. | **WARNING needed.** When scheduling an RBT at POS 03 (school) for a TRICARE client, warn. |
| **UHC/Optum: 32 units/day for 97153, recovery for excess** | Section 7: "Recovery/non-reimbursement for exceeding 32 units" | EC-012 (MUE check) partially covers this. Uses CMS MUE of 32. | **Covered by E19** (MUE check). UHC follows standard MUE. |
| **Cigna: No concurrent ABA + other therapy** | Section 7: "ABA NOT covered when delivered simultaneously with ANY other therapy" | Not applicable to scheduling MVP (we only schedule ABA, not OT/Speech). | **Deferred.** Only relevant when Clinivise handles multi-discipline scheduling. |
| **Anthem: Signature within 30 days of DOS** | Section 7 | Covered by session notes Phase 2 (note signing). Not a scheduling concern. | **No action needed** for scheduling. |
| **CMS: Many commercial payers apply stricter Medicare MUEs** | Section 2: "Medicare MUEs (only 8 units/day for 97151)" | Plan uses standard MUEs from `ABA_CPT_CODES`. No payer-specific MUE overrides. | **Informational for v1.1.** The `maxUnitsPerDay` in constants uses standard values. Some commercial payers apply lower Medicare MUEs. Future: payer-configurable MUE overrides. |

### Payer Rules That Should Be Warnings Now

Three payer-specific rules warrant MVP-level warnings because they affect common payer types and cause 100% denial:

1. **Texas Medicaid concurrent billing prohibition** -- Affects all Texas Medicaid clients. The standard concurrent BCBA+RBT pattern that works everywhere else is denied in Texas.
2. **Texas Medicaid RBT telehealth prohibition** -- Affects all Texas Medicaid RBT telehealth sessions.
3. **TRICARE school-based RBT prohibition** -- Affects TRICARE clients receiving school-based services.

These three rules can be implemented as simple conditional checks: `if (client.payerType === 'specific_payer' && condition) { warn() }`. They don't require a full payer rules engine. However, implementing them requires the client's payer information to be accessible during scheduling, which requires a join to the client's insurance record.

---

## Priority Ranking of Gaps

Ordered by financial impact and implementation effort:

| Priority | EC-ID(s) | Gap | Effort | Financial Impact | Action |
|----------|----------|-----|--------|-----------------|--------|
| **P0** | EC-009 | Client overlap detection | Small (new query) | Fraud/denial risk | Must fix before ship |
| **P0** | EC-010 | Auth utilization enforcement | Medium (query + UI) | 100% denial for excess units | Must fix before ship |
| **P1** | EC-004 | CPT-auth mismatch warning | Small (UI change) | 100% denial | Must fix before ship |
| **P1** | EC-012 | MUE daily accumulator | Small (new query) | Denial for excess units | Must fix before ship |
| **P1** | EC-003/005 | Auth date range warnings | Medium (differentiated warnings) | $1,500-4,000/week | Should fix before ship |
| **P2** | EC-007 | Credential expiration | Medium (schema + query) | All sessions unbillable | Ship with manual workaround; fast-follow schema change |
| **P2** | EC-047 | Template-auth boundary | Small (comparison check) | Silent revenue loss | Should fix before ship |
| **P2** | EC-036 | Time delta check | Small (comparison) | Audit recoupment | Should fix before ship |
| **P3** | EC-061 | Non-billable blocks | Medium (new table + UI) | Indirect (burnout/turnover) | Fast-follow after ship |
| **P3** | EC-063 | Coverage board | Medium (new dialog) | Indirect (cancelled sessions) | Fast-follow after ship |
| **P3** | EC-025 | Travel buffer warning | Small (address compare) | Indirect (turnover) | Fast-follow after ship |
| **P3** | EC-013 | Provider-payer credentials | Large (new junction table) | 100% denial but lower frequency | v1.1 |

---

## Conclusion

The plan covers the foundational scheduling mechanics well -- calendar rendering, template management, batch generation, session conversion, and the core provider-overlap hard block. The existing codebase provides strong infrastructure for session creation, status transitions, and auth matching.

However, **9 of 23 MVP edge cases are complete gaps**, and the 4 most financially impactful auth-related validations (EC-003, EC-004, EC-005, EC-010) are covered only by passive UI display (E1 projection, quick-create auth remaining) rather than enforced server-side. The plan's "warn not block" philosophy is reasonable for auth date range issues (where practices legitimately schedule ahead), but is not appropriate for CPT-auth mismatches or 100% utilization overruns.

**Minimum viable changes before shipping:** Add client overlap detection (EC-009), projected utilization enforcement (EC-010), CPT-auth mismatch warning (EC-004), and daily MUE check (EC-012). These are 4 new validation functions totaling ~200 lines of code and address the highest denial-risk scenarios.

**Fast-follow within 2 weeks of ship:** Credential expiration tracking (EC-007), non-billable calendar blocks (EC-061), and basic coverage board (EC-063).
