# Clinivise Phase 1 — Implementation Roadmap

> **Purpose**: Flexible roadmap for the remaining Phase 1 work, bridging backend (engineering spec, architecture review) and frontend (UI/UX guide, product spec, wireframes). Each feature is built end-to-end (backend + frontend together). Order is a guide, not a mandate — adapt as you build.
>
> **Key references**:
> - Backend: [`engineering-spec.md`](engineering-spec.md) — schema, config, architecture
> - Frontend: [`../design/ui-ux-guide.md`](../design/ui-ux-guide.md) — page wireframes, design language
> - Product: [`product-spec.md`](product-spec.md) — page-by-page user stories, data requirements, MVP scope
> - Architecture fixes: [`../clinivise-pm-review.md`](../clinivise-pm-review.md) — 7 pre-launch recommendations
> - Wireframes: [`../design/clinivise-wireframes.jsx`](../design/clinivise-wireframes.jsx) — interactive layouts
> - Design system: [`.claude/skills/design/references/design-system.md`](../../.claude/skills/design/references/design-system.md) — tokens, typography, components
>
> **Review**: This plan was reviewed against 11 architectural findings backed by 5 industry research dives, plus Phase 1-Core implementation research (60+ sources). See [Architecture Decisions](#architecture-decisions-reference) and [Research Findings](#research-findings-reference) at the bottom.
> - Implementation research: [`../research/phase-1-implementation-research.md`](../research/phase-1-implementation-research.md) — billing compliance, dashboard UX, auth visualization, technical patterns

---

## What's Done

| Sprint | Scope |
|--------|-------|
| 1 | Foundation — 15-table schema, Clerk auth, dashboard layout, shared components |
| 2A | Provider CRUD — list, detail, create/edit, actions, validators |
| 2B | Client CRUD — list, detail (5-tab), contacts, actions, validators |
| 2C | Insurance & Payer CRUD — policies, verification, payer management, 55 unit tests |
| 2D-1 | Authorization CRUD — list, create, detail, service lines, validators, tests |
| Phase 0 | Stabilize — seed data, domain errors, timezone-safe session parsing |
| Phase 1A | Session Logging — billing compliance fixes (required times, CPT-credential blocking, FOR UPDATE lock), session list (metric cards, server-side filters, filter tabs), session form (auto-calc card, auth check card, status-conditional fields), session detail sheet. 263 tests. 10 audit findings fixed. |
| Phase 1B | Auth Intelligence — shared UtilizationBar (role="meter", a11y, over-utilization) + ExpiryBadge, auth list (metrics query, filter tabs, compact bars, expiry badges), client detail overview (per-CPT bars, auth badge, action buttons, under-utilization detection, new query), auth detail (rich header card, per-service bars, expiry alert banner). 263 tests. 14+ audit findings fixed. |
| Phase 1C | Dashboard — 3 SQL queries (metrics, alerts, client overview) with FILTER/coalesce/nullif replacing client-side computation. Suspense decomposition (3 async server components + ErrorBoundary + skeleton loaders). Alert aggregation (anti-fatigue grouping), urgency-sorted client overview with needs-attention/on-track split, "everything is fine" state, Hours This Week metric. 263 tests. 10+ audit findings fixed. |

---

## Phase 0: Stabilize + Seed Data + Quick Fixes

> Get to a clean baseline with testable data in the database and the two lowest-effort architecture fixes applied.

### 0A — Validate & Commit In-Progress Changes
- [ ] Run `pnpm vitest run` — ensure all 55+ existing tests pass with new validator changes
- [ ] Run `pnpm build` — ensure production build succeeds
- [ ] Run `pnpm lint` — clean linting
- [ ] Review the new migration (`0006_cloudy_harpoon.sql`) — verify it's correct before applying
- [ ] Apply migration to Neon dev database (`pnpm drizzle-kit migrate`)
- [ ] Commit: "Architecture hardening: permissions, scoped queries, validator refinements"
- [ ] Verify in browser: existing CRUD flows (clients, providers, insurance, authorizations) work end-to-end

### 0B — Seed Data
> Can't test features against an empty database. Move this up front.

- [ ] Dev seed script: "Bright Futures ABA" practice with:
  - 3 providers (BCBA, BCBA-D, 2 RBTs)
  - 10 clients with contacts, insurance, authorizations
  - 50+ sessions distributed across clients
  - Mix of auth states (active, expiring, expired, exhausted)
  - Mix of session states (completed, cancelled, no_show, flagged)
- [ ] Idempotent (can run multiple times safely)

### 0C — Domain Error Classes
> Low-effort, high-value. All subsequent work benefits from structured error handling. Replaces fragile string-based `USER_FACING_ERRORS` set.

- [ ] Create `src/lib/errors.ts` — `AppError`, `NotFoundError`, `ForbiddenError`, `ConflictError`, `StaleDataError`
- [ ] Refactor `handleServerError` in `safe-action.ts` — use `instanceof AppError` instead of `USER_FACING_ERRORS` set
- [ ] Migrate existing `throw new Error("...")` calls to use domain error classes
- [ ] Remove `USER_FACING_ERRORS` set (replaced by class hierarchy)

Tests:
- [ ] `AppError` subclasses are caught by `handleServerError` and return user-safe messages
- [ ] Non-`AppError` exceptions return the generic `DEFAULT_SERVER_ERROR_MESSAGE`

### 0D — Timezone-Safe Session Handling
> Must be correct before any session is logged. Fix the parsing logic — no schema migration needed.
>
> **Decision**: Keep existing timestamp columns. Duration calculation uses string arithmetic, not `Date` objects. See [Architecture Decision #3](#architecture-decisions-reference).

- [ ] Add `parseTimeToMinutes(timeString)` helper to `src/lib/utils.ts` (e.g., "14:30" → 870)
- [ ] Refactor `computeActualMinutes` — duration = `parseTimeToMinutes(end) - parseTimeToMinutes(start)`, no `new Date()` construction
- [ ] Update session form's client-side `calculateUnits` to use the same `parseTimeToMinutes` logic
- [ ] Use `sessionDate` (date) + org `timezone` for display only, not for arithmetic

Tests:
- [ ] `parseTimeToMinutes`: "00:00" → 0, "09:30" → 570, "23:59" → 1439
- [ ] `computeActualMinutes`: "09:00" to "12:00" → 180 minutes, regardless of server timezone

**Phase 0 Checkpoint**: Clean git, seed data in DB, structured errors, timezone-safe time parsing. Ready to build the product.

---

## Phase 1-Core: Make It Work (Sessions + Auth Visuals + Dashboard)

> **Ship this before first users see the product.** The minimum to make a BCBA think "this is better than what I have." Build end-to-end: each feature delivers its query, action, component, and page together.

---

### 1A — Session Logging

> *Product spec §8 (Log Session), §7 (Sessions List), UI/UX guide §3 (Session Log Form), session form patterns research.*
> **The single most frequent action in the entire app.** Target: form completion in <30 seconds.

#### What's Already Built

The session backend is substantially complete. This table tracks what exists vs what's needed.

| Component | File | Status |
|-----------|------|--------|
| Session schema (all fields, 9 indexes, FKs) | `src/server/db/schema/sessions.ts` | Done |
| `createSessionSchema` / `updateSessionSchema` / `cancelSessionSchema` | `src/lib/validators/sessions.ts` | Done (126 lines, refinements for time pairing, end > start, units required) |
| `createSession` action (FIFO, atomic units, audit) | `src/server/actions/sessions.ts` | Done (lines 128-263) |
| `updateSession` action (optimistic locking, two-step accounting) | `src/server/actions/sessions.ts` | Done (lines 267-422) |
| `cancelSession` action (privileged, reason, conditional decrement) | `src/server/actions/sessions.ts` | Done (lines 426-501) |
| `fetchMatchingAuthorizations` action (form cascade) | `src/server/actions/sessions.ts` | Done (lines 505-548) |
| `getSessions`, `getSessionById`, `getClientSessions`, `getAuthorizationSessions` | `src/server/queries/sessions.ts` | Done (paginated) |
| `getProviderOptions`, `getMatchingAuthorizationServices` | `src/server/queries/sessions.ts` | Done |
| Session helpers (unit accounting, modifiers, time parsing) | `src/lib/session-helpers.ts` | Done (127 lines, 82 tests) |
| Time/unit utilities (`parseTimeToMinutes`, `calculateUnitsFromMinutes`) | `src/lib/utils.ts` | Done (30 tests) |
| `session-form.tsx` (553 lines — RHF, cascading auth select, combobox) | `src/components/sessions/session-form.tsx` | Done |
| `session-table.tsx`, `session-columns.tsx`, `session-status-badge.tsx` | `src/components/sessions/` | Done |
| Session list page, new session page, detail page, edit page | `src/app/(dashboard)/sessions/` | Done (4 routes) |
| Constants (CPT codes, statuses, transitions, modifiers, POS) | `src/lib/constants.ts` | Done |

**What's remaining** — three focused sub-sprints:

---

#### 1A-1 — Billing Compliance Fixes + Validator Tests

> Close 3 gaps identified by implementation research. These are correctness issues that must be fixed before sessions are used with real data.

**Fix 1: Required start/end times for completed sessions**

> Nearly every payer requires start/end times for billing compliance (CMS-1500 Box 24A). Our validator allows completed sessions with no times. See [Research §1](../research/phase-1-implementation-research.md#required-fields-for-billable-sessions).

File: `src/lib/validators/sessions.ts`
- [ ] Add `timesRequiredWhenCompleted` refinement to `createSessionSchema` and `updateSessionSchema`: when `status === "completed"`, both `startTime` and `endTime` must be present. `cancelled`/`no_show`/`scheduled` sessions remain optional.

**Fix 2: CPT-credential blocking for RBTs/BCaBAs**

> RBTs billing QHP-only codes (97151, 97155-97158) results in denied claims. Must be a hard block, not a warning. See [Research §1](../research/phase-1-implementation-research.md#cpt-credential-matching-rules).

File: `src/server/actions/sessions.ts` (in `createSession` and `updateSession`, after provider lookup)
- [ ] After loading the provider record (which includes `credentialType`), check: if credential is `rbt` or `bcaba` and CPT is in `[97151, 97155, 97156, 97157, 97158]`, throw `ConflictError("CPT {code} requires a qualified healthcare professional (BCBA/BCBA-D). {credential} providers cannot bill this code.")`.
- [ ] Extract QHP-only codes list to `src/lib/constants.ts` as `QHP_ONLY_CPT_CODES` for reuse in client-side form warnings.

File: `src/components/sessions/session-form.tsx`
- [ ] Add client-side warning: when selected provider credential is RBT/BCaBA and CPT is QHP-only, show amber warning inline below CPT selector before the user submits.

**Fix 3: `SELECT ... FOR UPDATE` on auth service row**

> Without a row lock, two concurrent sessions can both read `usedUnits < approvedUnits` as true, then both increment, over-allocating the auth. The fix is one SQL statement. See [Research §1](../research/phase-1-implementation-research.md#authorization-tracking--race-condition-fix).

File: `src/server/actions/sessions.ts` (in `createSession` transaction, before unit increment)
- [ ] Add `SELECT ... FOR UPDATE` on the auth service row within the transaction, before the `UPDATE` that increments `usedUnits`. Lock both in `createSession` (before increment) and `cancelSession` (before decrement). In `updateSession`, the existing ordered locking pattern already serializes; add `FOR UPDATE` to the individual auth service selects there too.

**Tests** (`src/lib/validators/sessions.test.ts` — new file):

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | Valid completed session passes | `{status: "completed", startTime: "09:00", endTime: "12:00", units: 12, ...requiredFields}` | Passes validation |
| 2 | Completed session without times rejected | `{status: "completed", units: 12, ...requiredFields}` (no startTime/endTime) | Error on startTime: "Start and end times are required for completed sessions" |
| 3 | Cancelled session without times accepted | `{status: "cancelled", units: 0, ...requiredFields}` (no times) | Passes |
| 4 | No-show session without times accepted | `{status: "no_show", units: 0, ...requiredFields}` (no times) | Passes |
| 5 | Scheduled session without times accepted | `{status: "scheduled", units: 0, ...requiredFields}` (no times) | Passes |
| 6 | Start time without end time rejected | `{startTime: "09:00", endTime: undefined}` | Error: "Both start time and end time must be provided together" |
| 7 | End time before start time rejected | `{startTime: "12:00", endTime: "09:00"}` | Error: "End time must be after start time" |
| 8 | Zero units for completed rejected | `{status: "completed", units: 0}` | Error: "At least 1 unit required for completed sessions" |
| 9 | Valid cancel schema with reason | `{id: "abc", reason: "Client no-show"}` | Passes |
| 10 | Cancel reason over 2000 chars rejected | `{id: "abc", reason: "x".repeat(2001)}` | Error on reason |
| 11 | Update schema requires id + updatedAt | `{...validSession}` (no id) | Error: id required |
| 12 | Invalid CPT code rejected | `{cptCode: "99999"}` | Error: "Select a CPT code" |
| 13 | Invalid time format rejected | `{startTime: "9:00"}` | Error: "Time must be HH:MM format" |
| 14 | Invalid date format rejected | `{sessionDate: "03/25/2026"}` | Error on sessionDate |
| 15 | Notes over 5000 chars rejected | `{notes: "x".repeat(5001)}` | Error on notes |

---

#### 1A-2 — Session List Page Enhancement

> The session list page exists but is minimal (59 lines) — table + empty state + "Log Session" button. No metric cards, no filter tabs, no dynamic header.

**Backend** (`src/server/queries/sessions.ts`):
- [ ] `getSessionListMetrics(orgId)` — single SQL query using `FILTER (WHERE ...)`:
  - `hoursThisWeek`: `coalesce(sum(units) filter (where session_date >= weekStart and status = 'completed'), 0) * 15.0 / 60`
  - `sessions7d`: `count(*) filter (where session_date >= now - 7d and status != 'cancelled')`
  - `flaggedCount`: `count(*) filter (where status = 'flagged')`
  - `thisMonthCount`: `count(*) filter (where session_date >= monthStart)` (for header subtitle)
- [ ] **Extend `getSessions` with composable server-side filters** — URL search params are the source of truth. Single query function with a `filters` object, dynamic WHERE clauses via Drizzle `and()`. This is the standard pattern (Linear, Notion, Vercel dashboard examples) and the only approach that scales with pagination (client-side filtering only works within the current page).
  ```typescript
  type SessionFilters = {
    status?: string;       // "flagged", "completed", etc.
    dateFrom?: string;     // ISO date (e.g., week start)
    dateTo?: string;       // ISO date
    clientId?: string;
    providerId?: string;
  }
  // getSessions(orgId, { page, pageSize, filters })
  ```
  Filter tabs map to preset filter combinations: "This Week" → `{ dateFrom: weekStart }`, "Flagged" → `{ status: "flagged" }`.

**Frontend** (`src/app/(dashboard)/sessions/page.tsx`):
- [ ] Update `PageHeader` description: "{N} sessions logged this month" (dynamic from `thisMonthCount`)
- [ ] Add 4 metric cards between header and table:
  - This Week: `hoursThisWeek` hours (large number, "hours logged" subtitle)
  - Sessions 7d: count (large number, "past 7 days" subtitle)
  - Flagged: `flaggedCount` (red accent if > 0, "needs review" subtitle)
  - Unbilled: "—" with "Phase 2" subtitle (placeholder, no query yet)
- [ ] Add filter tabs above table: All | This Week | Flagged
  - Tabs render as links with search params (`?filter=week`, `?filter=flagged`)
  - Server component reads `searchParams`, maps to `SessionFilters`, passes to `getSessions`
  - Active tab highlighted based on current search params
  - Pagination resets to page 0 when filter changes

**Tests** (`src/server/queries/sessions.test.ts` — new file, or add to existing):

| # | Test | Setup | Expected |
|---|------|-------|----------|
| 1 | Hours this week correct | 3 completed sessions this week (12 + 8 + 4 units) | `hoursThisWeek = 6.0` (24 units * 15 / 60) |
| 2 | Cancelled sessions excluded from hours | 1 completed (12 units) + 1 cancelled (8 units) this week | `hoursThisWeek = 3.0` (12 units only) |
| 3 | Flagged count correct | 2 flagged + 3 completed | `flaggedCount = 2` |
| 4 | Sessions 7d excludes cancelled | 3 completed + 1 cancelled in 7d | `sessions7d = 3` |
| 5 | Org isolation | Sessions from org_A and org_B | Query with org_A returns only org_A sessions |

---

#### 1A-3 — Log Session Form Polish

> The form works and correctly debits auths. This sprint upgrades the UX to match the product spec — auto-calculated card, visual auth check card, and status-conditional fields. Pre-fill, Quick Log, validation warnings, and draft persistence remain Phase 1-Polish.

**Auto-calculated card** (`src/components/sessions/session-form.tsx`):
- [ ] Add a styled info card (blue/info background) below the time inputs that shows in real-time:
  - Duration: "{X}h {Y}m" (from `parseTimeToMinutes(end) - parseTimeToMinutes(start)`)
  - Units: auto-calculated via CMS 8-min rule
  - Modifier: from provider credential (e.g., "HM (RBT)")
  - Only visible when both start and end time are filled. Hidden when status is `cancelled`/`no_show`.

**Authorization Check card** (`src/components/sessions/session-form.tsx`):
- [ ] Replace current auth dropdown with a visual card showing utilization impact:
  - **Green**: "Auth #{number} has {remaining} units remaining. This session uses {units} units → {remaining - units} remaining."
  - **Amber**: remaining units < 20% of approved → "Low remaining units" warning
  - **Red**: units > remaining → "This session exceeds remaining authorized units"
  - **Gray**: no active auth found → "No active authorization for this CPT code. Session will be flagged."
  - Keep "Change" link for manual auth override (opens existing Select with auth options)

**Status-conditional fields** (`src/components/sessions/session-form.tsx`):
- [ ] When status is `cancelled` or `no_show`: hide start/end time inputs, auto-calc card, and auth check card. Show optional "Reason" textarea instead.
- [ ] When status is `scheduled`: hide auto-calc card (no times yet)

**Session detail sheet** (industry standard: Linear, Notion, Vercel dashboard):
- [ ] `src/components/sessions/session-detail-sheet.tsx` — shadcn `Sheet` (side panel) with read-only key-value session detail. Triggered by row click in `SessionTable`. Shows: status badge, client, provider, date, times, CPT + modifier, units, POS, auth info (utilization impact), notes. Footer: "Open" link (→ `/sessions/[id]`), "Edit" button (→ `/sessions/[id]/edit`), "Cancel" button (if canCancel).
- [ ] Keep existing `/sessions/[id]` page as the canonical full-page view for direct URLs, bookmarks, and sharing.
- [ ] Future upgrade path: Next.js intercepting routes (`(.)sessions/[id]`) + parallel routes (`@modal`) for URL-synced sheets — not needed now.

**Tests** (component — `src/components/sessions/session-form.test.tsx`):

| # | Test | Action | Expected |
|---|------|--------|----------|
| 1 | Auto-calc card shows correct values | Set start="09:00", end="12:00" | Card shows "3h 0m", "12 units", modifier from provider |
| 2 | Auto-calc card hidden when no times | Leave start/end empty | No auto-calc card visible |
| 3 | Auto-calc card hidden for cancelled | Set status="cancelled" | Time fields and auto-calc hidden |
| 4 | Auth check card green state | Auth has 38 remaining, session uses 12 | Green card: "26 remaining after" |
| 5 | Auth check card amber state | Auth has 6 remaining of 30 approved (20%) | Amber card: "Low remaining units" |
| 6 | Auth check card red state | Auth has 4 remaining, session uses 12 | Red card: "exceeds remaining" |
| 7 | Auth check card gray state | No matching auths | Gray card: "No active authorization" |
| 8 | Detail sheet opens on row click | Click session row in table | Sheet opens with correct session data |
| 9 | Detail sheet shows edit/cancel actions | Open sheet for completed session | "Edit" and "Cancel" buttons visible |

**Phase 1A Checkpoint**: Sessions log correctly with billing-compliant validation. The list page shows at-a-glance metrics with server-side filtering. The form gives real-time feedback on units and auth impact. Row click opens a detail sheet without losing list context. All backed by 112 existing helper/utility tests + ~29 new tests.

---

### 1B — Auth Intelligence (Visual Layer)

> *Product spec §5 (Auth List), §3 (Client Detail Overview), UI/UX guide §5 (Authorizations).*
> **The "aha moment"** — the user sees auth utilization at a glance. No ABA competitor shows this on the client page.

#### What's Already Built

| Component | File | Status |
|-----------|------|--------|
| Auth status badge (pending/approved/denied/expired/exhausted) | `src/components/authorizations/auth-status-badge.tsx` | Done (12 lines) |
| Auth pages (list, detail, create, edit) | `src/app/(dashboard)/authorizations/` | Done (4 routes) |
| Auth table columns (text utilization: `{used}/{approved} ({pct}%)`) | `src/components/authorizations/authorization-columns.tsx` | Done (98 lines, no bars) |
| Auth detail (tab view, services table, color-coded text) | `src/components/authorizations/authorization-detail.tsx` | Done (125 lines, no bars) |
| Auth form (CRUD with cascade dropdowns, service lines) | `src/components/authorizations/authorization-form.tsx` | Done (601 lines) |
| Auth queries (list, detail, client auths, alert counts) | `src/server/queries/authorizations.ts` | Done (302 lines) |
| Auth actions (create, update, archive) | `src/server/actions/authorizations.ts` | Done (379 lines) — no new actions needed |
| Client overview with inline UtilizationBar | `src/components/clients/client-overview.tsx` | Done (319 lines — uses shadcn `Progress`, not `role="meter"`) |
| Client authorizations card (text utilization) | `src/components/clients/client-authorizations-card.tsx` | Done (100 lines, no bars) |
| Utility functions (`utilizationPercent`, `daysUntilExpiry`) | `src/lib/utils.ts` | Done |

**What's remaining** — four focused sub-sprints:

---

#### 1B-1 — Shared Utilization Components + Tests

> Build the two reusable visual primitives that every other 1B sprint depends on. Replace the inline `UtilizationBar` in `client-overview.tsx` (which uses shadcn `Progress` / `role="progressbar"`) with a proper `role="meter"` component per research findings.
> See [Research §3: Auth Utilization — Visualization Standards](../research/phase-1-implementation-research.md#3-auth-utilization--visualization-standards).

**UtilizationBar** (`src/components/shared/utilization-bar.tsx` — new file):
- [ ] **Linear bar** (not circular — NNGroup: "length" is most effective preattentive attribute). Custom `div`-based bar, NOT shadcn `<Progress>`.
- [ ] Color-coded: emerald <80%, amber 80-95%, red >95%. Shows "{used}/{approved} ({pct}%)" text alongside remaining hours.
- [ ] **Accessibility**: `role="meter"` (not `progressbar`). Required: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext` (e.g., "67% — 12.5 hours remaining"). Text label per threshold ("On track", "Nearing limit", "Over-utilized") for color-blind users.
- [ ] **Over-utilization (>100%)**: Cap bar fill at 100%, show actual percentage in red bold, change track to `bg-red-100`, add "Over-utilized" label.
- [ ] **Responsive**: 120px min width. Mobile: stack vertically (label top, bar full-width, percentage right). Narrow table cells: fall back to colored percentage text via `compact` prop variant.
- [ ] Props: `usedUnits: number`, `approvedUnits: number`, `showHours?: boolean` (default true), `compact?: boolean` (for table cells).
- [ ] Display hours preferred over units: `units * 15 / 60`. Show `(X units)` annotation when `showHours` is true.

**ExpiryBadge** (`src/components/shared/expiry-badge.tsx` — new file):
- [ ] "{N}d" with color: emerald >30d, amber 7-30d, red <7d, muted "Expired" if past.
- [ ] `showFullDate` prop: shows "Expires Jun 18, 2026" alongside days remaining (for detail pages).
- [ ] Future auths: blue/info badge "Starts {date}" when `startDate > today`.
- [ ] Props: `endDate: string`, `startDate?: string`, `showFullDate?: boolean`.

**Update existing code:**
- [ ] Replace inline `UtilizationBar` in `src/components/clients/client-overview.tsx` with the shared component.

**Tests** (`src/components/shared/utilization-bar.test.tsx`, `expiry-badge.test.tsx`):

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | Green at 50% | `used=20, approved=40` | Emerald bar, "On track" label |
| 2 | Amber at 80% | `used=32, approved=40` | Amber bar, "Nearing limit" label |
| 3 | Amber at 95% | `used=38, approved=40` | Red bar (>95%), no longer amber |
| 4 | Red at 100% | `used=40, approved=40` | Red bar, 100% |
| 5 | Over-utilization at 110% | `used=44, approved=40` | Bar capped at 100%, red bold "110%", "Over-utilized" label |
| 6 | `role="meter"` present | Any | `role="meter"`, `aria-valuemin=0`, `aria-valuemax`, `aria-valuenow` |
| 7 | `aria-valuetext` descriptive | `used=20, approved=40` | `aria-valuetext` contains "50%" and hours remaining |
| 8 | Compact mode | `compact=true` | Renders percentage text only, no full bar |
| 9 | Expiry green >30d | `endDate` 60 days out | Green "60d" badge |
| 10 | Expiry amber 7-30d | `endDate` 14 days out | Amber "14d" badge |
| 11 | Expiry red <7d | `endDate` 3 days out | Red "3d" badge |
| 12 | Expiry past | `endDate` 5 days ago | Muted "Expired" badge |
| 13 | Future auth | `startDate` in future | Blue "Starts {date}" badge |
| 14 | Full date mode | `showFullDate=true` | Shows "Expires Jun 18, 2026" alongside days |

---

#### 1B-2 — Authorization List Enhancement

> Mirror the session list pattern from 1A-2: metric cards, server-side filters, visual bars in table. The auth list page exists (53 lines) with a basic table. Upgrade it.

**Backend** (`src/server/queries/authorizations.ts`):
- [ ] `getAuthListMetrics(orgId)` — single SQL query using `FILTER (WHERE ...)`:
  - `activeCount`: approved + end_date > today + not deleted
  - `expiring30dCount`: approved + end_date within 30 days + not deleted
  - `expiredCount`: status = 'expired' OR (approved + end_date < today) + not deleted
  - `avgUtilization`: `coalesce(round(sum(used) / nullif(sum(approved), 0) * 100), 0)` across active auths
- [ ] **Extend `getAuthorizations` with composable filters** — same `SessionFilters`-style pattern:
  ```typescript
  type AuthFilters = {
    statusCategory?: "active" | "expiring" | "expired" | "pending";
  }
  ```
  Filter tabs map to preset WHERE clauses. "Active" = approved + end_date > today. "Expiring Soon" = approved + end_date within 30 days. "Expired" = expired OR past end_date. "Pending" = pending status.

**Frontend** (`src/app/(dashboard)/authorizations/page.tsx`):
- [ ] Add 4 metric cards: Active (green), Expiring 30d (amber), Expired (red), Avg Utilization (themed by threshold)
- [ ] Add filter tabs: All | Active | Expiring Soon | Expired | Pending — as links with `?filter=` search params
- [ ] Dynamic header: "{N} active authorizations" (from `activeCount`)

**Frontend** (`src/components/authorizations/authorization-columns.tsx`):
- [ ] Replace text utilization column with inline `UtilizationBar` (compact mode)
- [ ] Add `ExpiryBadge` column with days remaining
- [ ] Sort by days-until-expiry when expiry column header clicked

**Tests**:
| # | Test | Expected |
|---|------|----------|
| 1 | Active count correct | Counts only approved + not expired + not deleted |
| 2 | Expiring 30d count correct | Counts approved with end_date within 30 days |
| 3 | Avg utilization correct | Weighted average across active auth services |
| 4 | Filter "expiring" returns correct subset | Only auths with end_date within 30 days |
| 5 | Org isolation | Query with wrong org returns empty |

---

#### 1B-3 — Client Detail Overview Tab

> **The biggest sub-sprint.** The client detail page exists with tabs and an overview component, but needs Suspense boundaries, new queries, and richer visual display per product spec §3.
> **Decision**: Uses Suspense boundaries with async server components (Vercel Tier 1 pattern). See [Architecture Decision #6](#architecture-decisions-reference).

**New queries** (`src/server/queries/clients.ts` or new file):
- [ ] `getClientPrimaryInsurance(clientId, orgId)` — single JOIN: `client_insurance` → `payers`, WHERE `priority = 1` and not terminated
- [ ] `getClientCareTeam(clientId, orgId)` — providers assigned to this client (via sessions or explicit assignment). For MVP: primary BCBA from client record + most recent RBT from sessions.
- [ ] `getClientAuthUtilization(clientId, orgId)` — aggregate across active auth services:
  - Total approved hours, total used hours, utilization percent
  - Per-CPT breakdown: `[{ cptCode, description, approvedUnits, usedUnits, remainingHours }]`
  - Days until nearest auth expiry
  - Under-utilization flag: `<50% used with >50% of auth period elapsed`

**Page shell** (`src/app/(dashboard)/clients/[id]/page.tsx`):
- [ ] **Auth status badge in header**: "Auth: Active" (green), "Auth: 14d left" (amber), "Auth: Expired" (red) — derived from nearest expiring active auth
- [ ] **Action buttons row** below header: Log Session (→ `/sessions/new?clientId={id}`), Upload Auth Letter (outline, Phase 2 stub)

**Suspense boundary 1 — Insurance & Care Team** (async server component):
- [ ] **Insurance snapshot card**: section card with key-value pairs (Payer, Member ID, Group, Plan, Type, Effective Date)
- [ ] **Care Team card**: avatar initials (colored square) + provider name + role (BCBA)
- [ ] Skeleton: 2-column card placeholders

**Suspense boundary 2 — Authorization Utilization** (async server component):
- [ ] **Metric cards** (4): Total Approved (hours), Used (hours + % utilized), Weekly Avg, Days Left — with color coding per product spec §3
- [ ] **Authorized Services card**: per-CPT utilization bars using shared `UtilizationBar`, remaining hours, color thresholds
- [ ] **Under-utilization detection**: amber banner when `<50% used with >50% of auth period elapsed`
- [ ] Skeleton: 4 metric card placeholders + bar placeholders

**Suspense boundary 3 — Recent Sessions** (async server component):
- [ ] Recent sessions table (last 5) using existing `getClientSessions` query (limited), or "No sessions yet" empty state
- [ ] Skeleton: 5-row table placeholder

**Tests**:
| # | Test | Expected |
|---|------|----------|
| 1 | Hours from units: 0 units | 0 hrs |
| 2 | Hours from units: 4 units | 1 hr |
| 3 | Hours from units: 32 units | 8 hrs |
| 4 | Under-utilization: 30% used at 60% elapsed | Warning triggered |
| 5 | Under-utilization: 70% used at 60% elapsed | No warning |
| 6 | Each query respects org isolation | Wrong org returns empty |

---

#### 1B-4 — Authorization Detail Enhancement

> The auth detail page exists with tabs (Overview, Service Lines, Sessions, Documents). Upgrade the visual display with a rich header card, per-service bars, and expiry alerts.

**Frontend** (`src/components/authorizations/authorization-detail.tsx` — enhance existing):
- [ ] **Header card** (above tabs): status badge, auth number, client name, payer, diagnosis code, date range, days remaining (`ExpiryBadge` with full date), overall utilization bar (`UtilizationBar`). Key-value pairs layout per design system.
- [ ] **Per-service-line utilization bars** in the Service Lines tab: replace text utilization with `UtilizationBar` per row. Each service line shows: CPT (monospace) + description, approved/used hours, bar, frequency, max/day.
- [ ] **Expiry alert banner**: severity-coded banner at top of page. 30d = info (blue), 14d = warning (amber), 7d = critical (red). Dismissable for info/warning, persistent for critical.

**Frontend** (`src/components/clients/client-authorizations-card.tsx` — enhance existing):
- [ ] Wire Authorizations tab on client detail: filtered auth list with `UtilizationBar` (compact) and `ExpiryBadge` inline. "Add Authorization" button.

**Phase 1B Checkpoint**: A BCBA opens a client page and immediately sees auth utilization bars, remaining hours per CPT code, and days until expiry — all at a glance. The auth list shows which auths need attention via color-coded bars and expiry badges. The auth detail page has a rich header with utilization impact. **This is the "aha moment" — no ABA competitor shows this.**

---

### 1C — Dashboard

> *Product spec §1 (Dashboard), UI/UX guide §1 (Dashboard), dashboard design research.*
> Landing page after login. Practice health at a glance.
>
> See [Research §2: Dashboard — Design Patterns & Alert Systems](../research/phase-1-implementation-research.md#2-dashboard--design-patterns--alert-systems) and [Research §4: Technical Implementation Patterns](../research/phase-1-implementation-research.md#4-technical-implementation-patterns).

#### What's Already Built

| Component | File | Status |
|-----------|------|--------|
| Dashboard page (fetches clients + auths, passes to client component) | `src/app/(dashboard)/overview/page.tsx` | Done (21 lines) |
| DashboardView (4 metric cards, alerts, client overview, getting started) | `src/components/dashboard/dashboard-view.tsx` | Done (462 lines — **all computation client-side**) |
| Alert count for sidebar badge | `src/server/queries/authorizations.ts:getAlertCount` | Done |

**What's wrong with the current dashboard** (per plan + research):

1. **All computation is client-side** — fetches ALL clients + ALL authorizations, computes in JS. Won't scale. Plan requires SQL aggregation.
2. **No "Hours This Week" metric** — shows "Active Auths" instead.
3. **No Suspense boundaries** — everything loads as one monolithic block.
4. **No ErrorBoundary per section** — one query failure breaks the whole page.
5. **Alerts not aggregated** — each expiring auth is a separate row. Research says "aggregate similar."
6. **No max alert limit** — all alerts shown. Research says "max 3-5 visible."
7. **Client overview sorted alphabetically** — plan says sort by urgency.
8. **No "everything is fine" state** — no alerts = nothing shown.
9. **No session data fetched** — can't show Hours This Week.
10. **Hardcoded thresholds** — dashboard-view uses `0.8` and `95` instead of `AUTH_ALERT_THRESHOLDS`.

**What's remaining** — three focused sub-sprints:

---

#### 1C-1 — Dashboard Backend (SQL Queries)

> Replace client-side computation with 3 server-side SQL queries using Postgres `FILTER (WHERE ...)`, `coalesce`, `nullif`. This is the foundation — 1C-2 and 1C-3 depend on these queries.

**New file** (`src/server/queries/dashboard.ts`):

- [ ] `getDashboardMetrics(orgId)` — single SQL query returning:
  - `activeClients`: `count(*) filter (where status = 'active')` from clients
  - `avgUtilization`: `coalesce(round(sum(used) / nullif(sum(approved), 0) * 100), 0)` across active auth services
  - `hoursThisWeek`: `coalesce(sum(units) filter (where session_date >= weekStart and status = 'completed'), 0) * 15.0 / 60` from sessions
  - `actionItemCount`: count of alerts (expiring + high util + expired + flagged sessions)
  - `criticalCount`: count of critical-severity alerts only
  - Use `AUTH_ALERT_THRESHOLDS` constants, not hardcoded values

- [ ] `getDashboardAlerts(orgId)` — returns individual alert items (grouped client-side for MVP):
  - Expiring auths: `approved + endDate within 30d` → severity from `getExpiryLevel`
  - Expired auths: `status = 'expired' OR (approved + endDate < today)`
  - High utilization: `used/approved >= UTILIZATION_WARNING_PCT/100`
  - Flagged sessions: `status = 'flagged'`
  - Each alert: `{ type, severity, entityId, entityName, description, actionHref, actionLabel }`
  - Order by severity (critical first), then by urgency within severity

- [ ] `getClientOverviewForDashboard(orgId)` — clients with inline auth utilization via subquery:
  - Subquery: per-client auth utilization (`sum(used)`, `sum(approved)`, `min(endDate)`) for active auths
  - Main query: clients LEFT JOIN subquery, LEFT JOIN providers (BCBA), LEFT JOIN payers (primary insurance)
  - **Sort by urgency**: expired auths first → expiring → high utilization → low utilization → healthy
  - Limit 10 rows for dashboard

**Tests** (`src/server/queries/dashboard.test.ts` — pure logic tests for alert severity/sorting):

| # | Test | Expected |
|---|------|----------|
| 1 | Alert severity: auth expiring in 3d | critical |
| 2 | Alert severity: auth expiring in 14d | warning |
| 3 | Alert severity: 90% utilized | warning |
| 4 | Alert severity: 100%+ utilized | critical |
| 5 | Metrics: hours this week excludes cancelled sessions | Correct |
| 6 | Client overview: sorted by urgency | expired → expiring → high util → healthy |

---

#### 1C-2 — Dashboard Page Rewrite (Suspense + Server Components)

> Decompose the monolithic `"use client"` DashboardView into async server components with per-section Suspense boundaries. This is a significant refactor — the entire `dashboard-view.tsx` (462 lines) is replaced.

**Page** (`src/app/(dashboard)/overview/page.tsx`):
- [ ] Server component shell with header + action buttons
- [ ] 3 Suspense boundaries, each wrapping an async server component:
  ```tsx
  <SectionErrorBoundary fallback={<SectionError title="Metrics unavailable" />}>
    <Suspense fallback={<MetricsSkeleton />}>
      <DashboardMetrics orgId={orgId} />
    </Suspense>
  </SectionErrorBoundary>
  ```
- [ ] Pattern: ErrorBoundary wraps Suspense (not the other way around)

**Async server components** (new files in `src/components/dashboard/`):
- [ ] `dashboard-metrics.tsx` — fetches `getDashboardMetrics`, renders 4 metric cards (Active Clients, Avg Utilization, Hours This Week, Action Items). Uses shared `MetricCard`, `getUtilizationLevel`, `LEVEL_COLORS`.
- [ ] `dashboard-alerts.tsx` — fetches `getDashboardAlerts`, renders Priority Alerts section card. Groups similar alerts, caps at 5 visible with "View all (N)" link.
- [ ] `dashboard-clients.tsx` — fetches `getClientOverviewForDashboard`, renders client overview table with `UtilizationBar` (compact) + `ExpiryBadge`. Clickable rows → client detail.

**Shared infrastructure**:
- [ ] `src/components/shared/section-error-boundary.tsx` — ErrorBoundary component with styled fallback ("Section unavailable. Try refreshing.")
- [ ] Skeleton components for each section (metric cards skeleton, alerts skeleton, table skeleton)

**Preserve from existing `dashboard-view.tsx`**:
- [ ] Getting Started card (conditional on empty practice) — move to its own component
- [ ] Header layout pattern (title + greeting + action button)

---

#### 1C-3 — Dashboard Polish

> Alert fatigue prevention, urgency sorting, visual quality per research findings.

**Alert aggregation + cap** (`dashboard-alerts.tsx`):
- [ ] Group alerts by type: "3 authorizations expiring within 14 days" (single row with expand)
- [ ] **Max 5 visible alerts** before "View all (N)" link
- [ ] **"Everything is fine" state**: when no alerts, show "All authorizations on track. No action items." with checkmark icon
- [ ] Severity ordering: critical first, then warning
- [ ] Action buttons per alert: "Verify" → insurance tab, "Renew" → auth tab, "Review" → session detail

**Client overview sorting** (`dashboard-clients.tsx`):
- [ ] **Sort by urgency**: expired auth → expiring ≤7d → expiring ≤30d → high utilization → under-utilized → healthy
- [ ] Default: "Showing items needing attention" — hide healthy clients. "Show all" toggle reveals full list.
- [ ] Limit 10 rows, "View all clients →" link

**Visual quality**:
- [ ] **60-30-10 color rule**: 60% default/muted, 30% accent/structure, 10% signal colors
- [ ] **3-second rule**: clinician knows what needs attention within 3 seconds
- [ ] All thresholds derived from `AUTH_ALERT_THRESHOLDS` constants (no hardcoded values)

**Phase 1C Checkpoint**: A practice owner opens the dashboard Monday morning and within 3 seconds sees: 4 metric cards (active clients, utilization %, hours this week, action items), a priority alerts card showing the top issues (expiring auths, over-utilized auths, flagged sessions), and a client overview sorted by who needs attention first. Each section loads independently via Suspense. If one query fails, the rest still render. **This is practice health at a glance.**

---

### 1D — Integration & Fixes

> Wire everything together.

Already done (built during earlier sprints):
- [x] Client detail: wire **Sessions tab** (filtered session table + "Log Session" button) — Sprint 2D-1
- [x] Auth detail: wire **Sessions tab** (sessions logged against this auth) — Sprint 2D-1
- [x] Auth detail: show impact of sessions on utilization (used_units reflects logged sessions) — Phase 1B-4
- [x] Fix dashboard age calculation (use `differenceInYears` from date-fns, not year subtraction) — Phase 1C-2
- [x] Batch authorization service inserts (single `tx.insert(...).values(services.map(...))`) — Sprint 2D-1

Remaining:
- [ ] Client detail Overview tab: **Recent Sessions** compact table (last 5 sessions) below Authorized Services. Shows date, CPT, provider, units, status badge. Empty state: "No sessions yet. Log your first session →". Links to Sessions tab for full list.

Tests (E2E — deferred to Phase 4 per roadmap, underlying logic covered by 263 unit tests):
- [ ] E2E flow: log a session → verify auth used_units incremented → verify session appears in list and client detail
- [ ] Edge case: log session with no matching auth → session created as "flagged"
- [ ] Edge case: cancel completed session → used_units decremented
- [ ] Edge case: cancel non-completed session → no unit adjustment

**Phase 1-Core Checkpoint**: A BCBA can log in, see their dashboard with real alerts, navigate to a client, see auth utilization at a glance, log a session, and watch the utilization update. **This is the minimum product.**

---

## Phase 1-Polish: Make It Delightful (after first user feedback)

> Ship these after 2-3 pilot practices are using the core product. Validate that the designs match real workflows before investing in polish. Some of these may change based on feedback.

### Session Intelligence & Resilience

- [ ] **Quick Log section** (above form): last 3-5 sessions as compact cards with "Log Again" button that pre-fills entire form
- [ ] **Pre-fill logic**: provider=current user's linked provider, CPT=last used for client, POS=last used for client
- [ ] **Validation warnings** (competitive differentiator):
  - CPT-credential mismatch (e.g., BCBA logging 97153 should be RBT)
  - maxUnitsPerDay enforcement (e.g., 97153 max 32 units/day)
  - Session overlap detection (provider already has a session at this time)
  - Auto-unit mismatch (user manually overrides calculated units)
  - No active auth (session saved as "flagged")
- [ ] **Draft persistence**: save form state to localStorage keyed by `draft-session-{orgId}`, show resume/discard banner on return
- [ ] **Cancellation reason field**: optional textarea when status is `cancelled` or `no_show`

### Auth Intelligence — Predictive Features

- [ ] **Predictive burndown** on auth detail: "At current pace, exhausts on {date}" — uses session burn rate over last 4 weeks. Calculation: `remaining_units / (units_used_last_4_weeks / 4) = weeks_remaining`
- [ ] **Under-utilization pacing alert**: "<50% used with >50% period elapsed" — flag for review on auth detail and dashboard alerts

Tests:
- [ ] Burndown projection: 10 units/week burn rate, 40 units remaining → exhausts in 4 weeks
- [ ] Pacing alert: 30% used at 60% elapsed → triggers under-utilization warning
- [ ] Pacing alert: 70% used at 60% elapsed → no warning (on pace)

### Dashboard Enhancements

- [ ] **Your Sessions Today card**: compact card for current user's sessions today, "Log Session" CTA. Only visible when user has a linked provider. Query: `getUserSessionsToday(providerId, orgId)`
- [ ] **Getting Started card**: 3-step checklist (Add practice info → Add first provider → Add first client). Links to relevant pages. Checkmarks when complete. Disappears when provider + client exist.
- [ ] **Post-creation redirect**: after first client, show setup checklist on client detail (Add guardian → Add insurance → Enter authorization)
- [ ] Empty states on all list pages (already built, verify quality)

**Phase 1-Polish Checkpoint**: Sessions log in <15 seconds with Quick Log. Validation warnings catch billing errors before they happen. Dashboard guides new practices through setup. Auth projections surface under-utilization proactively.

---

## Phase 2: Deploy + Settings + Design Pass

> Deploy after Phase 1-Core. Run Phase 1-Polish in parallel with Phase 2 based on user feedback.

### Deploy & Onboard
- [ ] Deploy to production (Vercel)
- [ ] Onboard 2-3 pilot practices
- [ ] Gather feedback on the core workflow (session logging speed, auth visibility, dashboard usefulness)

### Settings Completion

> **Decision**: Display-first UI (key-value pairs) with "Edit" button. Progressive disclosure: practice name + timezone minimum, NPI/Tax ID as "Complete your billing profile" soft nudge. See [Architecture Decision #10](#architecture-decisions-reference).

Backend:
- [ ] `updateOrganizationSchema` — Zod validator with NPI Luhn check digit (80840 prefix algorithm), Tax ID format (`/^\d{2}-?\d{7}$/`), taxonomy code from curated ABA dropdown, timezone from IANA list
- [ ] `updateOrganization` action — owner/admin only via permissions map, audit log for billing-critical fields (NPI, Tax ID, taxonomy)
- [ ] `getOrganization(orgId)` query — for pre-filling the settings form
- [ ] `isValidNpi(npi)` utility — Luhn algorithm with `80840` prefix in `src/lib/utils.ts`

Frontend:
- [ ] **Organization tab**: display-first as key-value pairs, "Edit" button opens form. NPI inline validation: "Invalid NPI — check digit does not match." Taxonomy code as curated dropdown. "Complete your billing profile" nudge for empty NPI/Tax ID.
- [ ] **Team tab**: Embed Clerk `<OrganizationProfile>` component
- [ ] **Payers tab**: Already built — verify design quality
- [ ] **Billing tab**: Phase 2 stub with "Coming soon" message

Tests:
- [ ] NPI Luhn validation: valid NPIs pass, transposed digits fail, non-10-digit rejected
- [ ] Non-owner/admin role cannot update org settings

Phase 2+ noted:
- [ ] NPPES registry lookup ("Verify against NPPES" button, advisory not blocking)
- [ ] Confirmation dialog for NPI/Tax ID changes when claims exist

### Cmd+K Command Palette

- [ ] Use shadcn `command.tsx` component
- [ ] Searchable: Clients (by name), Providers (by name), Pages (by title)
- [ ] Quick actions: Log Session, Add Client, Add Provider, View Dashboard, Settings
- [ ] Fuzzy match on entity names, prioritize exact prefix matches
- [ ] Results show entity type icon + name + subtitle
- [ ] Available on every page via `Cmd+K` / `Ctrl+K`

### Design Quality Pass

> Apply design system standards to all existing pages.

- [ ] **Client list**: rich table rows (name bold + DOB + diagnosis muted), guardian column, auth utilization mini-bar inline, days remaining badge
- [ ] **Provider detail**: overview as key-value pairs first (not form-first), edit behind a button/tab
- [ ] **Provider list**: add supervisor column, match visual quality standards
- [ ] **Client detail header**: sticky banner with name, DOB/Age/Diagnosis, Guardian, status badges, action buttons
- [ ] **All pages**: verify section cards with title bars, metric cards where appropriate, contextual action buttons, three tiers of visual hierarchy

### Audit Logging Completion

- [ ] Add `logAudit` calls to: `createClient`, `updateClient`, `deleteClient`, all insurance mutations, all contact mutations, all payer mutations
- [ ] Match pattern from sessions/authorizations audit logging
- [ ] Ensure all mutations have who/what/when/which-org audit trail

### Revenue-at-Risk

> Depends on fee schedule data. Shows when rate data exists, gracefully degrades when it doesn't. See [Architecture Decision #7](#architecture-decisions-reference).

- [ ] Add optional rate-per-CPT-per-payer fields to payer management in Settings (lightweight fee schedule)
- [ ] Revenue-at-risk calculation: `(approved_units - used_units) * rate_per_unit` for auths expiring within 30d
- [ ] JOIN authorization services → client insurance → payer → rate data
- [ ] Dashboard widget: "Revenue at risk: ${amount}" — only shows when rate data exists
- [ ] Auth detail: per-service-line dollar value of unused units. Shows "Add rates in Settings → Payers to see revenue projections" when rate data is missing.

---

## Phase 3: AI Auth Letter Parsing

> The differentiator. Build when the core product is stable.

### AI Foundation

Infrastructure:
- [ ] Install `ai`, `@ai-sdk/anthropic`, `@ai-sdk/amazon-bedrock`
- [ ] Create `src/server/ai/index.ts` — `getModel()` (anthropic for dev, bedrock for prod)
- [ ] Create `src/server/ai/providers.ts` — provider config
- [ ] Create AI audit logging middleware (wraps every AI call, logs to `audit_logs`)
- [ ] Add env vars: `ANTHROPIC_API_KEY`, `AI_PROVIDER` to `env.ts`

Golden eval set (see [Architecture Decision #11](#architecture-decisions-reference)):
- [ ] Collect 5-7 payer auth letter templates from public sources (Aetna, Cigna, BCBS, Medicaid — URLs documented in research findings)
- [ ] Generate 10-20 synthetic auth approval letters using Claude — define ground truth JSON first, then generate realistic letters in each payer's format
- [ ] Structure as `(document, expected_json)` pairs with field-level ground truth
- [ ] Set up field-level evaluation: exact match for IDs/codes, fuzzy for names, date normalization, numeric tolerance for units

### Document Upload Infrastructure

- [ ] File upload component (`src/components/shared/file-upload.tsx`) — Vercel Blob, drag-and-drop
- [ ] Document server actions (upload, list, associate with client/auth)
- [ ] Upload helper (`src/lib/upload.ts`) — server-side MIME type validation via magic bytes (not just extension), 10MB max, PDF/JPEG/PNG/HEIC/TIFF accepted, max 15 pages, min 1KB

### Auth Letter Parsing

Extraction:
- [ ] Zod schema for auth letter extraction (fields: auth number, client name, payer, start date, end date, diagnosis, CPT codes + approved units, confidence scores per field)
- [ ] Parse action: upload PDF → `generateObject` with vision → structured extraction
- [ ] Expand eval set to 50+ covering all major payer format variations

Error handling (see [Architecture Decision #8](#architecture-decisions-reference)):
- [ ] Catch `NoObjectGeneratedError` from Vercel AI SDK → fall back to empty form with document still visible: "Could not parse this document. Enter authorization details manually."
- [ ] Pre-validate before AI: if OCR quality < 0.60 confidence, reject with "Document quality too low. Please re-upload a clearer scan." (saves LLM tokens)
- [ ] Rate limit: 20 AI parse requests per org per hour via Upstash Redis
- [ ] Processing time target: <15 seconds (synchronous for single uploads)

Review UI (see [Architecture Decision #8](#architecture-decisions-reference)):
- [ ] **Side-by-side layout**: PDF viewer on left, pre-filled form on right
- [ ] **Field-level confidence indicators**: green (>=0.95 auto-filled), amber (0.80-0.94 flagged for review), red (<0.80 likely wrong, prominently flagged)
- [ ] **Accept All button** for high-confidence fields + individual field review for flagged fields. Shows count: "Accept 9 fields (3 need review)" — flagged fields still require individual action before final save.
- [ ] Confidence <0.65 on all fields → show "Low confidence extraction — please verify all fields" banner

Saving:
- [ ] Save confirmed extraction → create authorization + services
- [ ] Log AI-extracted values vs human-confirmed values separately in audit trail
- [ ] Wire "Upload Auth Letter" button on auth list and client detail

HITL feedback loop:
- [ ] Log every correction as `(document_id, ai_output, corrected_output)` for eval set growth
- [ ] Track per-payer extraction accuracy to identify weak patterns

Tests:
- [ ] Zod extraction schema validates against 5-10 golden eval samples
- [ ] File validation rejects: >10MB, wrong MIME type, >15 pages, corrupt PDF
- [ ] Failed LLM call → graceful fallback to manual entry (no crash, no blank page)
- [ ] Confidence threshold routing: >=0.95 green, 0.80-0.94 amber, <0.80 red

### Background Job Infrastructure (if needed)

- [ ] Install Inngest for durable background workflows
- [ ] Create Inngest client + API route
- [ ] Create auth letter processing workflow (upload → extract → validate → save)

**Phase 3 Checkpoint**: Upload a real auth letter → see AI extraction with confidence scores → confirm/correct → authorization created with service lines. Corrections logged for eval set growth.

---

## Phase 4: Production Hardening

> Add when you have real traffic and real users finding real edge cases.

### Data Integrity
- [ ] Optimistic locking on mutable entities — add `updatedAt` to update schemas, `WHERE updatedAt = ?` check, throw `StaleDataError` on mismatch, pass `updatedAt` through all edit forms, toast on stale data error
- [ ] Session idempotency keys — add `idempotency_key` column (text, nullable), unique index on `(organization_id, idempotency_key)`, `INSERT ... ON CONFLICT DO NOTHING`, generate key on form mount via `useMemo(() => nanoid(), [])`

### Infrastructure
- [ ] Upstash rate limiting on `authActionClient` (especially session creation and AI endpoints)
- [ ] Clerk webhook — `src/app/api/webhooks/clerk/route.ts`, handle user/org CRUD events, verify with Clerk testing tool
- [ ] Sentry PHI scrubbing for production breadcrumbs

### Testing
- [ ] E2E tests (Playwright): auth flow, client CRUD, session logging, authorization tracking
- [ ] Coverage gap analysis: verify every action has org isolation tests, every validator has boundary value tests
- [ ] Money arithmetic edge cases: rounding, zero, negative, max precision

### Revenue Features
- [ ] Revenue-at-risk (if not done in Phase 2): fee schedule rates per payer + `(approved - used) * rate` calculation
- [ ] Auth health composite score (if validated by practitioner feedback): weighted utilization pacing + expiry proximity + gap risk

---

## Architecture Decisions (Reference)

Key decisions from the plan review, backed by industry research. Refer to these when building.

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | **Domain errors before optimistic locking** | Locking depends on `StaleDataError`. Build error classes first. |
| 2 | **Build session form incrementally** (core → auth → intelligence → resilience) | Each increment is independently shippable and testable. |
| 3 | **Keep timestamp columns, fix parsing only** | Duration math uses `parseTimeToMinutes` string arithmetic. No `Date` objects, no timezone involvement. Avoids one-way door of column type migration. |
| 4 | **Tests inline with the feature, not back-loaded** | Write the test when you write the code. Don't save testing for "later." |
| 5 | **`updateSession` with ordered locking + full-field audit** | Industry standard is edit-in-place (CentralReach, SimplePractice). CMS 3.3.2.5 requires audit trail of all changed fields. Lock auth service rows by ID to prevent deadlocks. |
| 6 | **Suspense boundaries for client detail** (3 sections) | Vercel Tier 1 recommendation. React processes sibling Suspense boundaries concurrently. Fastest perceived performance. PPR for free in Next.js 16. |
| 7 | **Burndown + pacing now; revenue-at-risk later** | No ABA competitor offers burndown (genuine whitespace). Revenue-at-risk needs fee schedule data (payer → CPT → rate), not auth-level `ratePerUnit`. Composite score deferred to Phase 2+ pending practitioner validation. |
| 8 | **AI: always human-in-the-loop, Accept All for high-confidence** | Production IDP systems (Nanonets, Rossum, AWS A2I) use Accept All + individual review for flagged. Pre-validate OCR before spending LLM tokens. Always fall back to manual entry. ~$0.02-0.05 per auth letter at Claude Sonnet rates. |
| 9 | **Three separate session actions** (create, update, cancel) | Industry standard: void is a separate privileged action (CentralReach "Void" button, not part of "Edit"). Different permissions, side effects, and audit trail. `cancelSession` is a terminal state operation. |
| 10 | **NPI Luhn validation + display-first settings UI** | NPI errors are #1 cause of claim rejections. Luhn check with 80840 prefix catches typos at entry. Display-first (key-value pairs) matches industry pattern for rarely-edited settings. Progressive disclosure: name + timezone minimum, billing identifiers as soft nudge. |
| 11 | **Synthetic eval set from public templates, grow via HITL** | Standard healthcare AI bootstrapping. Public payer auth letter templates exist (Aetna, Cigna, BCBS, Medicaid). >98% extraction accuracy proven with 50 synthetic docs. HITL correction feedback loop grows eval set organically. |
| 12 | **`SELECT ... FOR UPDATE` on auth service during session creation** | Concurrent session creation against the same auth service can over-allocate units. Row-level lock serializes writes. Low contention for small practices, essential for correctness. See [Research §1](../research/phase-1-implementation-research.md#authorization-tracking--race-condition-fix). |
| 13 | **Linear utilization bars with `role="meter"` accessibility** | NNGroup: "length" is the most effective preattentive attribute for quantitative comparison. W3C ARIA APG: `role="meter"` for static value ranges (not `progressbar`). ~8% of men have color vision deficiency — never rely on color alone. See [Research §3](../research/phase-1-implementation-research.md#3-auth-utilization--visualization-standards). |
| 14 | **Hard-block RBTs from QHP-only CPT codes** | 97151/97155-97158 are QHP-only per ABA billing rules. Logging these under an RBT credential results in denied claims. Block at the validator level, not just a warning. See [Research §1](../research/phase-1-implementation-research.md#cpt-credential-matching-rules). |

---

## Research Findings (Reference)

Detailed findings from 5 industry research dives conducted during plan review. These provide the evidence behind the architecture decisions.

### Research 1: Session Editing Patterns (supports Decision #5)

**Finding**: All major ABA PM tools use **edit-in-place**, not void-and-recreate, for pre-billing session corrections.
- CentralReach has a dedicated "Edit" function on timesheets. Editing a locked/signed note removes collected signatures, requiring re-signing.
- CMS defines two correction mechanisms: Frequency Code 7 (replacement) and Code 8 (void). Replacement is the standard for corrections; void is for "this claim should never have existed."
- CMS Program Integrity Manual Section 3.3.2.5 requires: original content preserved, amendments clearly identified with date/author/reason, never overwrite the original.
- The atomic reversal + apply pattern (`decrement old + increment new` in a transaction) is the correct approach for auth unit adjustments on session edits.

**Sources**: CentralReach help docs, CMS-1500 Box 22 guides, AHIMA amendments toolkit, CMS Program Integrity Manual, HIPAA Security Rule audit requirements.

### Research 2: Session Cancellation Patterns (supports Decision #9)

**Finding**: Void is a **separate, privileged action** in every major PM system, not part of the general "update" workflow.
- CentralReach distinguishes "Delete" (unbilled entries) from "Void" (billed entries). Separate button, separate permissions.
- Two distinct cancellation paths: (1) logged as cancelled — no units consumed, (2) retroactive void of completed session — atomic unit decrement.
- No-shows and late cancellations cannot be billed to insurance. No CPT code exists for missed ABA sessions.
- Voiding requires elevated permissions, explicit confirmation with reason, and creates a terminal state.

**Sources**: CentralReach help docs (void vs delete), ABA Matrix symbology, AlohaABA correction workflow, Jane App billing guide, CMS MUE limits.

### Research 3: Client Detail Data Loading (supports Decision #6)

**Finding**: **Suspense boundaries with async server components** is the Vercel Tier 1 recommended pattern for pages with multiple independent data sources.
- Next.js processes sibling Suspense boundaries concurrently — no explicit `Promise.all` needed for independent sections.
- `Promise.all` is Tier 2 — appropriate for tightly-coupled data within a single component (e.g., client record + guardian for the header).
- Drizzle's relational query API outputs single SQL queries (not N+1). Useful for nested data but not for independent page sections.
- Neon pooler handles parallel queries well. ~100 pool slots per GB. 7 parallel queries for a client detail page is fine for a small practice app.
- Partial Prerendering (PPR) in Next.js 16: Suspense boundaries automatically delineate static shell vs. dynamic content.

**Sources**: Next.js v16 docs, Vercel Academy (Suspense and Streaming), Vercel blog (common App Router mistakes), Drizzle ORM relational queries v2 docs, Neon connection pooling docs.

### Research 4: Authorization Intelligence Features (supports Decision #7)

**Finding**: **No existing ABA PM tool offers predictive burndown, revenue-at-risk, or pacing analytics.** This is genuine competitive whitespace.
- CentralReach has backward-looking auth utilization reports but no projected exhaustion dates or burn-rate tracking.
- Under-utilization is the #1 revenue and clinical issue cited across sources. BCBAs particularly struggle with protocol modification hours.
- Revenue-at-risk requires fee schedule data (payer → CPT → rate), not auth-level `ratePerUnit`. Rates are configured during payer setup, not during auth entry. Every PM system separates fee schedules from authorizations.
- Composite auth health score is entirely novel — no evidence anyone has attempted it. Innovation opportunity but needs practitioner validation.
- Top practitioner pain points: (1) under-utilization undetected until too late, (2) reauthorization is reactive, (3) no dollarization of the problem, (4) fragmented visibility across clients, (5) over-utilization surprises.

**Sources**: CentralReach Authorization Dashboard docs, CentralReach "6 Challenges" blog, S-Cubed authorization strategies, CentralReach/SimplePractice/TherapyPMS fee schedule docs, BCBA all-in-one spreadsheet (behavioral analyst resource center).

### Research 5: AI Document Parsing Patterns (supports Decisions #8, #11)

**Finding**: Production healthcare document parsing uses a **tiered confidence model** with graceful degradation to manual entry.
- Confidence thresholds: >=0.95 auto-accept, 0.80-0.94 human review, <0.80 escalate/reject. Financial/medical fields need stricter thresholds.
- Side-by-side (document + form) is the universal review UI pattern across Rossum, Nanonets, Google Document AI, AWS A2I.
- Accept All IS standard for high-confidence fields + individual review for flagged. Not "NO Confirm All."
- Pre-validate OCR quality before spending LLM tokens — if average word confidence < 0.60, reject before extraction.
- File limits: 10MB max, PDF/JPEG/PNG/HEIC/TIFF, 15 pages max for auth letters.
- Vercel AI SDK throws `NoObjectGeneratedError` — catch and fall back gracefully. `jsonrepair` + `safeParseJSON` + Zod as recovery pipeline.
- Cost: ~$0.02-0.05 per auth letter at Claude Sonnet rates. Negligible for small practices (20-50/month).
- Golden eval set: start with 10-20 synthetic docs, expand to 50-100 for alpha, 200-500 for production. >98% accuracy achieved with Claude on 50 synthetic medical documents.
- Publicly available ABA auth letter templates exist from Aetna, Cigna, BCBS, Massachusetts Medicaid, MercyCare, Coordinated Care, Healthy Blue Louisiana, and others.
- HITL correction feedback loop is standard: every user correction flows back into eval set for continuous improvement.

**Sources**: Nanonets IDP docs, AWS A2I + Textract docs, Azure Document Intelligence docs, Vercel AI SDK v6 docs, Braintrust eval guide, Rossum IDP, Veryfi API docs, multiple public payer auth form URLs, Cleanlab structured output benchmark analysis, LangChain extraction benchmarking, medRxiv LLM extraction study.

### Research 6: Organization Settings Patterns (supports Decision #10)

**Finding**: Practice settings are **owner/admin only, one-time setup, display-first** across all healthcare PM platforms.
- NPI validation: 10 digits + Luhn check digit with `80840` prefix. Modified Luhn algorithm (ISO/IEC 7812). The #1 cause of claim rejections at the clearinghouse level is wrong/invalid NPI.
- Tax ID/EIN: format validation only (`/^\d{2}-?\d{7}$/`). No public check digit algorithm exists.
- Taxonomy code: 10-char alphanumeric (`/^[0-9]{3}[A-Z0-9][0-9]{5}[A-Z]$/`). ABA default: `103K00000X` (Behavioral Analyst). Use curated dropdown, not free text.
- NPPES Registry has a free public API (`https://npiregistry.cms.hhs.gov/api/?version=2.1`) — no auth required. Use for Phase 2 "Verify against NPPES" feature, not for real-time form validation.
- Progressive disclosure: practice name + timezone are minimum to start using PM features. NPI, Tax ID, taxonomy required before billing (Phase 2).
- Setup order across platforms: Practice Info → Providers → Clients → Insurance → Authorizations → Billing Setup.

**Sources**: CMS NPI Standard, NPPES Registry API (live-tested), NUCC Taxonomy Codes v25.1, CMS-1500/837P billing field requirements, CentralReach/SimplePractice/TherapyNotes settings docs.

### Research 7: Phase 1 Implementation Research (supports Decisions #12, #13, #14)

**Finding**: Consolidated findings from 4 parallel research agents (60+ sources) covering billing compliance, dashboard UX, auth visualization, and technical patterns. Full document: [`../research/phase-1-implementation-research.md`](../research/phase-1-implementation-research.md).

Key findings incorporated into the plan:
- **Billing compliance**: CMS 8-minute rule formula, MUE limits per CPT, CPT-credential matching rules (RBTs blocked from QHP-only codes), required fields for billable sessions (start/end times mandatory for completed sessions), session validation checklist.
- **Auth race condition**: `SELECT ... FOR UPDATE` on auth service row during session creation prevents concurrent over-allocation.
- **Alert fatigue**: AHRQ "5 Rights" framework — right information, person, format, channel, time. Max 3-5 visible alerts, aggregate similar, escalating severity, exception-based only.
- **Utilization visualization**: Linear bars outperform circular (NNGroup). `role="meter"` (not `progressbar`). Over-utilization: cap bar at 100%, red track, bold percentage. Hours preferred over units for BCBAs. 120px minimum bar width for readability.
- **Accessibility**: `aria-valuetext` for screen readers (not just percentage). Never rely on color alone — secondary indicator required for each threshold.
- **Dashboard data density**: 60-30-10 color rule, 3-second scanning rule, max 3 hierarchy levels per section, 4 metric cards optimal.
- **Client detail gaps vs product spec**: auth badge in header, action buttons row, per-CPT utilization bars (not aggregate-only), under-utilization detection.
- **Technical patterns**: Drizzle `FILTER (WHERE ...)` for conditional aggregation, `coalesce`/`nullif` for NULL/zero safety, subqueries for inline metrics, ErrorBoundary wrapping Suspense, Neon partial indexes for hot queries.

**Sources**: CMS Transmittal AB-01-56, ABA Coding Coalition, AHRQ PSNet (alert fatigue), NNGroup (preattentive processing), W3C ARIA APG, 11+ competitor analyses, Next.js 16 docs, Drizzle ORM docs, Neon Postgres docs, 60+ industry sources.

---

## Risk Register

| Risk | Severity | When to Address |
|------|----------|-----------------|
| Concurrent auth unit corruption | High | **Phase 1-Core** (`SELECT ... FOR UPDATE` in `createSession`) — see Decision #12 |
| Stale data overwrites | High | Phase 4 (optimistic locking) — low risk with few users |
| Duplicate session creation | Medium | Phase 4 (idempotency keys) — UI `isPending` guard is sufficient early on |
| AI extraction garbage on bad docs | Medium | Phase 3 (pre-validate, graceful fallback) |
| NPI entered incorrectly | Medium | Phase 2 (Luhn validation in settings) |
| Revenue-at-risk shows $0 | Medium | Phase 2 (fee schedule data in payer settings, graceful degradation) |
| Composite auth health score unvalidated | Low | Phase 2+ (defer pending practitioner feedback) |
| No E2E tests until Phase 4 | Medium | Unit/integration tests inline per feature; E2E needs full app |

---

*Created: 2026-03-25*
*Reviewed: 2026-03-25 — 11 architectural findings, 5 industry research dives*
*Updated: 2026-03-25 — Incorporated Phase 1 implementation research (60+ sources, 14 architecture decisions, 7 research findings)*
*Updated: 2026-03-25 — Phase 1A (Session Logging) complete + audited. Phase 1B (Auth Intelligence) complete + audited. Phase 1C (Dashboard) complete + audited. 263 tests, all passing.*
*Status: Phase 0 done. Phase 1A done. Phase 1B done. Phase 1C done. Phase 1-Core complete. Next: Phase 1D (Integration & Fixes).*
