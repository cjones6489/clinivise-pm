# Scheduling Feature — Implementation Plan

> **Status:** Ready to build
> **Feature spec:** `scheduling.md` (data model, UI spec, queries, domain constraints)
> **Validation rules:** `scheduling-validation-rules.md` (all 9 hard blocks, 10 warnings, 5 informational)
> **CEO plan:** `~/.gstack/projects/cjones6489-clinivise-pm/ceo-plans/2026-03-27-scheduling-calendar.md` (51 decisions: E1-E28, D1-D23)
> **Research:** `docs/research/scheduling/` (12 docs, 72 edge cases, 18 scenarios)
> **Calendar library:** Schedule-X Premium (purchased, €299/yr)

---

## Decision Reference

All 51 decisions are in the CEO plan. Key documents to have open while building:

| Document | Use For |
|---|---|
| `scheduling-validation-rules.md` | Every validation check, user messages, override policy |
| `scheduling.md` | Data model, UI wireframes, queries, domain constraints |
| `aba-scheduling-audit.md` | CPT concurrent billing matrix (Section 1.3), scenario walkthroughs (Section 10) |
| `aba-scheduling-edge-cases-master.md` | 72 edge cases with handling recommendations |
| CEO plan (E1-E28) | Engineering decisions with rationale |
| CEO plan (D1-D23) | Design decisions with wireframes |

---

## Key Architectural Principles (read before building)

1. **Appointments ARE sessions** with `status="scheduled"`. No separate table.
2. **Only 9 code-definition rules are hard blocks.** Everything else is a configurable AMA/ABA default with payer override.
3. **Auth model is total-period pool**, not monthly. Underutilization is the real problem.
4. **"Save as payer rule" workflow** — warnings include [Allow for this payer] / [Block for this payer]. Practice builds payer config through use.
5. **Schedule-X is client-only rendered** (`ssr: false`). Page shell server-renders with skeleton.
6. **Overlap checks must run inside the transaction** to prevent TOCTOU race conditions.
7. **Templates auto-generate on save** — "set it and sessions appear" UX.
8. **My Schedule default** — calendar shows logged-in provider's sessions. Non-providers see empty calendar with filter sidebar.

---

## Phase 1: Schema + Validation Foundation

**Goal:** Data layer is correct. All validation functions exist and are tested. Nothing renders yet.

### Schema Changes

**New table: `appointment_templates`**
```
File: src/server/db/schema/appointment-templates.ts

id                  text PK (nanoid)
organization_id     text NOT NULL FK → organizations
client_id           text NOT NULL FK → clients
provider_id         text NOT NULL FK → providers
supervisor_id       text FK → providers (nullable)
cpt_code            text NOT NULL
place_of_service    text NOT NULL DEFAULT '12'
day_of_week         integer NOT NULL (0=Sunday..6=Saturday)
start_time          text NOT NULL (HH:MM, 24-hour)
end_time            text NOT NULL (HH:MM, 24-hour)
units               integer NOT NULL
effective_from      date NOT NULL
effective_until     date (NULL = ongoing)
is_active           boolean NOT NULL DEFAULT true
notes               text
created_at          timestamp with tz
updated_at          timestamp with tz

Indexes:
  (organization_id)
  (organization_id, client_id)
  (organization_id, provider_id)
  (organization_id, provider_id, day_of_week)
```

**Sessions table additions:**
```
File: src/server/db/schema/sessions.ts (modify)

group_session_id    text (nullable)  -- schema-forward for group sessions feature
```

**Providers table addition:**
```
File: src/server/db/schema/providers.ts (modify)

credential_expires_at    timestamp with tz (nullable)
```

**Payers table additions:**
```
File: src/server/db/schema/payers.ts (modify)

max_units_per_day            integer (nullable, null = CMS MUE default)
allows_concurrent_billing    boolean NOT NULL DEFAULT true
max_group_size               integer (nullable, null = CPT default 8)
```

**New indexes on sessions:**
```
File: src/server/db/schema/sessions.ts (modify)

sessions_provider_date_idx  ON (organization_id, provider_id, session_date)
sessions_client_date_idx    ON (organization_id, client_id, session_date)
```

**Migration:**
```
pnpm drizzle-kit generate
-- Review generated SQL
pnpm drizzle-kit migrate
```

### Constants Updates

```
File: src/lib/constants.ts (modify)

- ASSESSMENT_CPT_CODES = ["97151", "97152"] as const
- CONCURRENT_BILLING_MATRIX: Record<string, Record<string, "Y" | "N" | "C">>
  (encode the 10x10 matrix from aba-scheduling-audit.md Section 1.3)
- CONCURRENT_EXEMPTIONS: descriptions of C*, C**, C*** conditions
- US_FEDERAL_HOLIDAYS: array of { month, day, name } for holiday calendar
- CREDENTIAL_ALERT_DAYS = [90, 60, 30, 14, 7] as const
```

### New Validation Functions

```
File: src/lib/scheduling-validators.ts (new)

checkClientOverlap(orgId, clientId, sessionDate, startTime, endTime, cptCode, providerId, excludeSessionId?)
  → { allowed: boolean, reason?: string, exemption?: string }
  Rules: See scheduling-validation-rules.md HB-002
  Must handle all code-pair exemptions (supervision, caregiver training, 0362T/0373T)
  Must block assessment codes (97151/97152) with everything

checkDailyMUE(orgId, clientId, cptCode, sessionDate, newUnits, excludeSessionId?)
  → { allowed: boolean, currentTotal: number, limit: number, payerLimit?: number }
  Check payer-specific max_units_per_day first, fall back to ABA_CPT_CODES.maxUnitsPerDay

getProjectedAuthUtilization(orgId, clientId, cptCode, authServiceId?)
  → { approved: number, used: number, scheduled: number, available: number, pacing: object }
  Must count future scheduled sessions (status='scheduled', date >= today)
  Pacing: { percentUsed, percentElapsed, status: 'on_pace'|'behind'|'at_risk'|'over_pace' }

checkConcurrentBilling(orgId, clientId, sessionDate, startTime, endTime, cptCode, providerId, payerId?)
  → { allowed: boolean, conflictCode?: string, message: string, isPyaerOverride: boolean }
  Check CONCURRENT_BILLING_MATRIX defaults
  If payer has allows_concurrent_billing=false, upgrade warning to block

validateSupervisor(providerId, supervisorId)
  → { valid: boolean, reason?: string }
  Check: supervisorId !== providerId
  Check: supervisor has BCBA/BCaBA/BCBA-D credential
```

```
File: src/server/actions/sessions.ts (modify)

- Move checkSessionOverlap() INSIDE the transaction
- Add checkClientOverlap() call after provider overlap check
- Add checkDailyMUE() call
- Add getProjectedAuthUtilization() enforcement (block at >100%)
- Add supervisorId !== providerId check
- Fix group code exemption: allow ONE group at a time, not unlimited
```

### Tests (Phase 1)

```
File: src/lib/scheduling-validators.test.ts (new)

checkClientOverlap:
  - Blocks two 97153s for same client
  - Blocks 97153 + 97154 (individual + group)
  - Allows 97153 + 97155 with different providers (supervision)
  - Allows 97153 + 97156 with different providers (parent training)
  - Allows 0362T + 97155 (destructive behavior + QHP direction)
  - Blocks 97151 + anything (assessment exclusive)
  - Blocks 97152 + anything (assessment exclusive)
  - Blocks same provider + same client regardless of code

checkDailyMUE:
  - Warns when daily total exceeds MUE
  - Uses payer-specific limit when set
  - Falls back to CMS default when payer limit is null
  - Excludes cancelled sessions from count

getProjectedAuthUtilization:
  - Correct math: approved - used - scheduled
  - Only counts future scheduled sessions
  - Returns pacing status
  - Handles no auth found
  - Handles multiple auth services

validateSupervisor:
  - Blocks self-supervision
  - Blocks non-BCBA/BCaBA as supervisor

Provider overlap (existing, modified):
  - Still blocks same-provider 1:1 overlap
  - Allows ONE group session at a time
  - Blocks two simultaneous groups for same provider
  - Runs inside transaction (no race condition)

Auth enforcement:
  - Allows booking up to 100%
  - Blocks when projected goes negative
  - Admin override works with reason
```

### Acceptance Criteria
- [ ] Migration runs clean
- [ ] All new tables/columns exist in DB
- [ ] All validation functions pass their tests
- [ ] Existing session CRUD still works (no regression)
- [ ] `pnpm vitest run` passes

---

## Phase 2: Templates + Batch Generation

**Goal:** BCBAs can create recurring schedule templates and generate sessions from them.

### Template Validators

```
File: src/lib/validators/appointment-templates.ts (new)

Zod schema for template CRUD:
  clientId, providerId, supervisorId?, cptCode, placeOfService,
  dayOfWeek (0-6), startTime (HH:MM), endTime (HH:MM), units,
  effectiveFrom (date), effectiveUntil (date?), isActive, notes?

Refinements:
  - endTime > startTime
  - units >= 1
  - dayOfWeek 0-6
  - 97151 template warning (E25): flag but don't block
```

### Template Actions

```
File: src/server/actions/appointment-templates.ts (new)

createTemplate(input):
  - Validate with Zod schema
  - Check template overlap for same provider + day (E9, warning not block)
  - Insert template
  - AUTO-GENERATE: immediately call generateSessionsFromTemplates for next 2 weeks (E13)
  - Return template + generation count

updateTemplate(id, input):
  - Validate ownership (org_id)
  - Update template fields
  - Show confirmation: "This won't change X already-scheduled sessions" (D7)
  - Optionally: "Regenerate" cancels future sessions + re-generates

deleteTemplate(id):
  - Cascade prompt: count future sessions with matching idempotency prefix
  - Options: [Delete template only] / [Delete + cancel future sessions] (E11)
  - Cancel uses idempotency key prefix tmpl:{templateId}:*

generateSessionsFromTemplates(orgId, clientId?, startDate, endDate):
  - Query active templates (filter by clientId if provided)
  - For each template x date in range:
    - Skip if date is a holiday (E28)
    - Skip if dayOfWeek doesn't match
    - Skip if outside template effective_from/effective_until
    - Use generateScheduledSession() helper (E14)
    - Idempotency key: tmpl:{templateId}:{date}
    - ON CONFLICT DO NOTHING
  - Return: { created, skipped, beyondAuth, holidays } (E22)
```

### Scheduling Helper

```
File: src/server/actions/scheduling-helpers.ts (new)

generateScheduledSession(orgId, templateData, sessionDate, timezone):
  - Convert template HH:MM + date → UTC timestamp using org timezone (E15)
  - Shared validation with createSession: FK checks, overlap checks
  - SKIP: FIFO auth matching, FOR UPDATE locks, unit accounting (E14)
  - Set status = "scheduled"
  - Set idempotencyKey = tmpl:{templateId}:{date}
  - Insert with ON CONFLICT DO NOTHING
  - Return { created: boolean, reason?: string }
```

### Template Queries

```
File: src/server/queries/scheduling.ts (new)

getAppointmentTemplates(orgId, clientId?)
  → active templates with provider name, client name, supervisor name

getTemplateOverlaps(orgId, providerId, dayOfWeek, startTime, endTime, excludeId?)
  → conflicting templates for warning display
```

### Tests (Phase 2)

```
File: src/server/actions/appointment-templates.test.ts (new)

- Create template: valid, invalid fields, org isolation
- Update template: valid, org isolation, doesn't cascade
- Delete template: template only, template + future sessions
- Generate: correct dates, idempotency (re-run = 0 new), holiday skip,
  auth boundary reporting, template date bounds, inactive templates skipped
- Auto-generate on save: creating template triggers 2-week generation
```

### Acceptance Criteria
- [ ] Template CRUD works via server actions
- [ ] Creating a template auto-generates 2 weeks of sessions
- [ ] Re-running generation creates no duplicates
- [ ] Holidays are skipped
- [ ] Batch gen reports: X created, Y skipped, Z beyond auth
- [ ] Template deletion prompts for future session handling
- [ ] All tests pass

---

## Phase 3: Calendar Page UI

**Goal:** The calendar renders with sessions. Users can navigate views, filter providers, toggle colors.

### Schedule-X Setup

```
File: src/app/(dashboard)/calendar/page.tsx (new)

- Server component: page shell with PageHeader, toolbar, sidebar
- dynamic(() => import('./calendar-view'), { ssr: false })
- Suspense with calendar skeleton
- URL params: ?view=, ?providers=, ?colorBy=, ?client=

File: src/components/scheduling/calendar-view.tsx (new, client component)

- Schedule-X initialization with premium plugins
- CSS variable mapping to OKLCH tokens (D11)
- Org timezone from server prop (D15)
- Week/day/month view switching
- Resource view when 2+ providers selected (D12)
```

### Page Layout (D1)

```
File: src/components/scheduling/calendar-toolbar.tsx (new)
- Left: date navigator (prev/today/next + date label)
- Center: view toggle (Day | Week | Month) — underline tab style
- Right: color coding dropdown, + New button

File: src/components/scheduling/calendar-sidebar.tsx (new)
- Provider filter checkboxes (searchable)
- Client filter (search)
- Collapses on tablet, hidden on mobile
```

### Event Rendering (D2)

```
File: src/components/scheduling/calendar-event.tsx (new)
- 3-line card: client name, CPT + description, provider name
- 4th line for tall events: time range + units
- 2px left border = status color (blue/emerald/grey/red)
- Short session (1hr): truncate to 2 lines
- Pending auth: dashed border + amber "No Auth" badge (D22)
- Color by provider/CPT when toggled (D10 palette, E7 URL param)
```

### Data Fetching

```
File: src/server/queries/scheduling.ts (add to existing)

getProviderSchedule(orgId, providerId, startDate, endDate)
getOrgSchedule(orgId, providerIds[], startDate, endDate)
getClientSchedule(orgId, clientId, startDate, endDate)
getCurrentProviderForUser(orgId, clerkUserId)
  → resolves Clerk user → users.id → providers.userId
```

### Navigation

```
File: src/components/layout/sidebar-nav.ts (modify)
- Add Calendar to Core group (between Clients and Sessions)
- Icon: CalendarIcon from hugeicons
- All roles can see it
```

### Acceptance Criteria
- [ ] Calendar page renders at /calendar
- [ ] Week/day/month views work
- [ ] Provider filter shows/hides sessions
- [ ] Color coding toggles work (status/provider/CPT)
- [ ] My Schedule default loads current user's sessions
- [ ] Non-provider users see empty calendar with filters
- [ ] Multi-provider day view shows provider columns (max 6)
- [ ] Mobile: agenda view. Tablet: 3-day. Desktop: full week.
- [ ] Skeleton loads while calendar hydrates
- [ ] Sidebar nav has Calendar entry

---

## Phase 4: Interactions + Warnings

**Goal:** Users can create, view, edit, complete, and reschedule sessions from the calendar. All validation warnings are wired.

### Quick-Create (D17, E4)

```
File: src/components/scheduling/appointment-quick-create.tsx (new)
- Popover, w-80, anchored to clicked timeslot
- 5 fields: client, provider, CPT, date/time (pre-filled), auth remaining
- [Create] calls createSession with status='scheduled'
- [More] opens AppointmentDialog
- Mobile: bottom Drawer instead of Popover

File: src/components/scheduling/appointment-dialog.tsx (new)
- Dialog wrapping existing SessionForm
- Pre-fills from quick-create fields
- Status defaults to 'scheduled'
```

### Event Detail Popover (D3)

```
File: src/components/scheduling/event-detail-popover.tsx (new)
- Click event → popover with: client, CPT, time, provider, supervisor,
  location, auth remaining, note status
- Actions: [Complete Session] [Edit] [Cancel] [...]
- Complete → two-step conversion (E5): status change + redirect to note
```

### Drag-and-Drop

```
Schedule-X handles drag events natively. On drop:
- Call updateSession with new date/time
- If multi-provider view: cross-column drag changes provider (D6)
- Overlap check on drop → toast warning if conflict
- Auth warning as toast after move committed
```

### Validation Warning UI

```
File: src/components/scheduling/validation-warnings.tsx (new)
- Reusable warning banner component
- CPT-auth mismatch (E18): amber banner with auth list
- Auth date warnings (E20): differentiated messages (expired/missing/future)
- Credential expiration (E21): provider credential countdown
- Concurrent billing (E26): matrix lookup + "save as payer rule" buttons
- MUE warning (E19): daily total display
- All warnings: [Allow for this payer] / [Block for this payer] / [Dismiss]
```

### Empty States (D4, D5)

```
- Empty calendar: "No sessions this week. Book your first appointment →"
- Empty for provider filter: "No sessions for [Provider] this week."
- Batch gen progress toast: "Generating... 12/20 sessions"
- Drag rejection: snap back + red toast
- Error: inline retry card in calendar area
```

### Acceptance Criteria
- [ ] Click timeslot → quick-create popover
- [ ] Quick-create → session appears on calendar
- [ ] "More" expands to full dialog
- [ ] Click event → detail popover with actions
- [ ] Complete Session → status change + redirect to note form
- [ ] Drag-and-drop reschedules session (time + provider)
- [ ] Overlap on drag → toast warning
- [ ] All validation warnings display with correct messages
- [ ] "Save as payer rule" writes payer config
- [ ] Empty states render correctly
- [ ] Admin override works with reason field

---

## Phase 5: Integration Points

**Goal:** Scheduling is wired into the rest of the app. Dashboard, client detail, cross-links.

### Client Overview — Weekly Schedule Section (E10, D16)

```
File: src/components/clients/client-schedule-section.tsx (new)
- Section card on Overview tab (between auth utilization and recent sessions)
- Shows active templates as rows
- Empty state: calendar icon + "No recurring schedule yet" + [+ Add Weekly Block]
- Inline form for template creation (D16)
- Auth pacing color bands (D23): green/yellow/orange/red
- "Generate Next 2 Weeks" button
- Next 5 upcoming sessions display
```

### Dashboard Metrics

```
File: src/components/dashboard/dashboard-metrics.tsx (modify)
- Add: "Sessions Today" metric card
- Add: "Hours This Week" metric card (scheduled + completed)
- Add: "Clients Behind Pace" metric card (< 50% used, > 50% elapsed)
```

### Cross-Links (D14)

```
File: src/app/(dashboard)/sessions/page.tsx (modify)
- Add "Calendar View" link in toolbar → /calendar

File: src/components/scheduling/calendar-toolbar.tsx (modify)
- Add "List View" link → /sessions
```

### Client Discharge Auto-Cancel (E27, D21)

```
File: src/server/actions/clients.ts (modify)
- When status → 'discharged': query future scheduled sessions
- Show dialog: "Cancel X future sessions for [Client]?"
- [Cancel All] / [Keep] / [Review Individually]
- Auto-set cancellation reason to "Client Discharged"
```

### Provider Actions

```
File: src/components/scheduling/mark-unavailable-dialog.tsx (new)
- "Mark unavailable" action from provider filter sidebar (D20)
- Lists provider's sessions for the day as "needs coverage"
- Filtered provider dropdown for one-click reassign per session

File: src/components/scheduling/concurrent-indicator.tsx (new)
- Badge on stacked BCBA+RBT sessions in client view (D19)
- "Concurrent billing" indicator
```

### Acceptance Criteria
- [ ] Client overview shows Weekly Schedule section with templates
- [ ] Inline template creation works
- [ ] Auth pacing bands display correctly
- [ ] Dashboard has 3 new metric cards
- [ ] Calendar ↔ Sessions cross-link works
- [ ] Client discharge cancels future sessions with prompt
- [ ] Mark unavailable shows provider's sessions for reassignment

---

## Phase 6: Full Test Suite + QA

**Goal:** Complete test coverage. Visual QA. Ship-ready.

### Unit Tests

```
42+ tests from eng review test plan at:
~/.gstack/projects/cjones6489-clinivise-pm/cjone-main-eng-review-test-plan-20260327.md

Priority:
1. All Phase 1 validation functions (if not already complete)
2. Template CRUD + batch generation
3. Scheduling queries (org isolation, date ranges)
4. Auth projection (all math paths)
5. Override audit logging
```

### E2E Tests

```
15 key user flows:
1. Full booking: click timeslot → quick-create → session on calendar → complete → note
2. Template flow: create template → auto-gen → view on calendar → complete → verify auth
3. Multi-provider: day view → provider columns → drag between providers
4. Drag-and-drop: reschedule session, overlap rejection
5. Color coding: toggle status/provider/CPT
6. Responsive: mobile agenda, tablet 3-day, desktop week
7. My Schedule: login as RBT → see only my sessions
8. Non-provider: login as admin → empty calendar + filter sidebar
9. Auth warning: book session beyond auth → warning displays
10. Batch generation: template → generate → verify counts + holidays skipped
11. Template deletion: delete + cancel future sessions
12. Client discharge: discharge client → future sessions cancelled
13. Credential warning: schedule with expiring provider → warning
14. Concurrent billing: BCBA + RBT overlap → informational note
15. Org isolation: user from Org A cannot see Org B's calendar
```

### QA Runs

```
/qa against live calendar page
/design-review for visual QA against D1-D23 decisions
Fix all findings before shipping
```

### Acceptance Criteria
- [ ] `pnpm vitest run` — all tests pass
- [ ] `pnpm exec playwright test` — all E2E pass
- [ ] /qa — no critical or high bugs
- [ ] /design-review — score 8+/10
- [ ] `pnpm build` — no errors

---

## File Inventory

### New Files (estimated)

| Phase | File | Type |
|-------|------|------|
| 1 | `src/server/db/schema/appointment-templates.ts` | Schema |
| 1 | `src/lib/scheduling-validators.ts` | Validation |
| 1 | `src/lib/scheduling-validators.test.ts` | Tests |
| 2 | `src/lib/validators/appointment-templates.ts` | Zod schema |
| 2 | `src/server/actions/appointment-templates.ts` | Actions |
| 2 | `src/server/actions/scheduling-helpers.ts` | Helpers |
| 2 | `src/server/queries/scheduling.ts` | Queries |
| 2 | `src/server/actions/appointment-templates.test.ts` | Tests |
| 3 | `src/app/(dashboard)/calendar/page.tsx` | Page |
| 3 | `src/components/scheduling/calendar-view.tsx` | Component |
| 3 | `src/components/scheduling/calendar-toolbar.tsx` | Component |
| 3 | `src/components/scheduling/calendar-sidebar.tsx` | Component |
| 3 | `src/components/scheduling/calendar-event.tsx` | Component |
| 4 | `src/components/scheduling/appointment-quick-create.tsx` | Component |
| 4 | `src/components/scheduling/appointment-dialog.tsx` | Component |
| 4 | `src/components/scheduling/event-detail-popover.tsx` | Component |
| 4 | `src/components/scheduling/validation-warnings.tsx` | Component |
| 5 | `src/components/clients/client-schedule-section.tsx` | Component |
| 5 | `src/components/scheduling/mark-unavailable-dialog.tsx` | Component |
| 5 | `src/components/scheduling/concurrent-indicator.tsx` | Component |

### Modified Files

| Phase | File | Changes |
|-------|------|---------|
| 1 | `src/server/db/schema/sessions.ts` | group_session_id column, new indexes |
| 1 | `src/server/db/schema/providers.ts` | credential_expires_at |
| 1 | `src/server/db/schema/payers.ts` | 3 payer config fields |
| 1 | `src/server/db/schema/index.ts` | Export new table |
| 1 | `src/lib/constants.ts` | Concurrent billing matrix, holidays, assessment codes |
| 1 | `src/server/actions/sessions.ts` | New validation calls, overlap inside transaction |
| 3 | `src/components/layout/sidebar-nav.ts` | Calendar nav entry |
| 5 | `src/components/clients/client-overview.tsx` | Schedule section |
| 5 | `src/components/dashboard/dashboard-metrics.tsx` | New metric cards |
| 5 | `src/app/(dashboard)/sessions/page.tsx` | Calendar cross-link |
| 5 | `src/server/actions/clients.ts` | Discharge auto-cancel |
