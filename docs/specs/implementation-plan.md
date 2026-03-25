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
> **Review**: This plan was reviewed against 11 architectural findings backed by 5 industry research dives. See [Architecture Decisions](#architecture-decisions-reference) and [Research Findings](#research-findings-reference) at the bottom.

---

## What's Done

| Sprint | Scope |
|--------|-------|
| 1 | Foundation — 15-table schema, Clerk auth, dashboard layout, shared components |
| 2A | Provider CRUD — list, detail, create/edit, actions, validators |
| 2B | Client CRUD — list, detail (5-tab), contacts, actions, validators |
| 2C | Insurance & Payer CRUD — policies, verification, payer management, 55 unit tests |
| 2D-1 | Authorization CRUD — list, create, detail, service lines, validators, tests |

Uncommitted: permissions map, scoped query builder, validator refinements, migration `0006`.

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

## Phase 1: The Product (Sessions + Auth Intelligence + Dashboard)

> **This is the product.** These three features — session logging, auth utilization visibility, and the dashboard — are what makes a BCBA think "this is better than CentralReach." Build them end-to-end: each feature delivers its query, action, component, and page together.
>
> The order below is logical (sessions feed the dashboard, auth intelligence gives context to sessions), but build what makes sense in the moment. The features are interleaved, not sequential.

---

### 1A — Session Logging

> *Product spec §8 (Log Session), §7 (Sessions List), UI/UX guide §3 (Session Log Form), session form patterns research.*
> **The single most frequent action in the entire app.** Target: form completion in <30 seconds.

#### Session Backend

Schema:
- [ ] Verify session schema has correct time handling per Phase 0D
- [ ] Ensure `authorization_service_id` FK is correct and nullable (sessions without auth = flagged)

Validators:
- [ ] `createSessionSchema` — client, provider, date, startTime, endTime, cptCode, placeOfService, notes, status
- [ ] `updateSessionSchema` — same fields + `id` + `updatedAt` for optimistic locking
- [ ] Date/time refinements: endTime > startTime, date not in future (allow backdated)
- [ ] Unit calculation validation: auto-calculated units match time range

Actions (three separate actions — see [Architecture Decision #9](#architecture-decisions-reference)):
- [ ] `createSession` — validate, find matching auth (FIFO), atomic `SET used_units = used_units + N`, create session, audit log. When status is `cancelled` or `no_show`, skip auth resolution and unit increment (no service was rendered).
- [ ] `updateSession` — with optimistic locking (`updatedAt` check), ordered locking on auth service rows by ID to prevent deadlocks, adjust auth units (atomic decrement old + increment new if auth changed). Audit log captures **all changed fields** (before/after state for CPT, provider, auth, date, units — not just status), per CMS 3.3.2.5 requirements. See [Architecture Decision #5](#architecture-decisions-reference).
- [ ] `cancelSession` — separate privileged action (owner/admin/bcba only) for retroactive void of completed sessions. Requires `reason` field. Atomic `SET used_units = used_units - N WHERE used_units >= N` on linked auth service. Only decrements if previous status was `completed`. Terminal state — cancelled sessions cannot transition out. See [Architecture Decision #9](#architecture-decisions-reference).
- [ ] Auth resolution logic: find active auths for client + CPT where `start_date <= sessionDate <= end_date`, pick earliest expiry (FIFO)

Queries:
- [ ] `getSessions(orgId, filters)` — list with client + provider + auth JOINs, filter by date/provider/client/status
- [ ] `getSessionById(id, orgId)` — detail with all JOINs
- [ ] `getClientSessions(clientId, orgId)` — for client detail Sessions tab
- [ ] `getProviderRecentSessions(providerId, orgId, limit)` — for Quick Log feature
- [ ] `getActiveAuthsForSession(clientId, cptCode, sessionDate, orgId)` — for auth picker

Tests:
- [ ] Session validators: valid session, invalid times, future date, CMS 8-min rule edge cases
- [ ] Unit calculation: 0 minutes, 8 minutes (1 unit), 15 minutes (1 unit), 23 minutes (2 units), 480 minutes (32 units)
- [ ] FIFO auth selection: given two active auths for same CPT, picks earlier expiry
- [ ] Atomic unit decrement: `createSession` increments used_units, `cancelSession` decrements
- [ ] Org isolation: session actions with wrong org context return error / empty
- [ ] `createSession` with status `cancelled` does NOT link auth or increment units
- [ ] `cancelSession` on a non-completed session does NOT decrement units

#### Session List Page

Frontend:
- [ ] Page header: "Sessions" + "{N} sessions logged this month" + "Log Session" button (primary)
- [ ] 4 metric cards: This Week (hours), Sessions 7d (count), Flagged (count, red if >0), Unbilled (count, "—" for MVP)
- [ ] Data table: Date, Client, Provider, CPT (monospace), Units (tabular-nums), POS, Status (badge)
- [ ] Filter tabs: All | This Week | Flagged
- [ ] Row click → session detail dialog (key-value display, edit button)
- [ ] Empty state: "No sessions logged yet. Log your first session to start tracking hours." CTA: "Log Session"

Backend:
- [ ] Session list metrics query (hours this week, count 7d, flagged count)

Tests:
- [ ] Metrics query: correct hours/count with mixed session statuses (cancelled sessions excluded from hours)

#### Log Session Form — build incrementally

> **Decision**: Split into 4 increments. Each is independently shippable and testable. See [Architecture Decision #2](#architecture-decisions-reference).

**Increment 1 — Core Form:**
- [ ] Two-column layout: Client (combobox) + Provider (select) — Row 1
- [ ] Date (pre-fill today) + Start Time + End Time — Row 2
- [ ] CPT Code (select with code + description) + Place of Service (select with code + label) — Row 3
- [ ] **Auto-calculated card** (blue/info): Duration, Units (CMS 8-min rule), Modifier (from provider credential) — real-time as user types
- [ ] Notes textarea (optional)
- [ ] Status field (default: completed, options: completed/cancelled/no_show) — hide time fields when cancelled/no_show
- [ ] Cancel + Save Session buttons, disable Save during submission (`isPending`)
- [ ] Success: redirect to `/sessions` with toast

**Increment 2 — Auth Integration:**
- [ ] **Authorization Check card**: selected auth + remaining units before/after
  - Green: "Auth AUTH-0891 has 38 units remaining. This session uses 12 units → 26 remaining."
  - Amber: remaining units < 20% of approved → "Low remaining units"
  - Red: insufficient units → "This session exceeds remaining authorized units"
  - Gray: no active auth → "No active authorization for this CPT code"
- [ ] **Auth picker**: auto-select FIFO (earliest expiry), show "Change" link for manual override, compact card with utilization
- [ ] Wire `createSession` to resolve auth and atomically increment `used_units`
- [ ] Fresh `used_units` fetch on client/CPT selection (bypass TanStack Query cache)

**Increment 3 — Intelligence & Pre-fill:**
- [ ] **Pre-fill logic**: date=today, provider=current user's linked provider, CPT=last used for client, POS=last used for client
- [ ] **Quick Log section** (above form): last 3-5 sessions as compact cards with "Log Again" button
- [ ] **Validation warnings** (competitive differentiator):
  - CPT-credential mismatch (e.g., BCBA logging 97153 should be RBT)
  - maxUnitsPerDay enforcement (e.g., 97153 max 32 units/day)
  - Session overlap detection (provider already has a session at this time)
  - Auto-unit mismatch (user manually overrides calculated units)
  - No active auth (session saved as "flagged")

**Increment 4 — Resilience:**
- [ ] **Draft persistence**: save form state to localStorage keyed by `draft-session-{orgId}`, show resume/discard banner on return
- [ ] Cancellation/no-show: when status is `cancelled` or `no_show`, hide time fields, show optional cancellation reason field

---

### 1B — Auth Intelligence

> *Product spec §5 (Auth List), §3 (Client Detail Overview), UI/UX guide §5 (Authorizations).*
> **The "aha moment"** — the user sees auth utilization at a glance. No ABA competitor shows this on the client page.

#### Shared Utilization Components

Frontend (reusable):
- [ ] `src/components/shared/utilization-bar.tsx` — color-coded progress bar (emerald <80%, amber 80-95%, red >95%), shows "{used}/{approved} ({pct}%)" text, accepts `usedUnits`, `approvedUnits` props
- [ ] `src/components/shared/expiry-badge.tsx` — "{N}d" with color coding (green >30d, amber 7-30d, red <7d, "Expired" if past), accepts `endDate` prop
- [ ] `src/components/authorizations/auth-status-badge.tsx` — reusable badge (Active=green, Expiring=amber, Expired=red, Pending=outline, Denied=red, Exhausted=muted)

Tests:
- [ ] Utilization bar: correct colors at 50%, 80%, 95%, 100%, 110%
- [ ] Expiry badge: correct colors at 60d, 30d, 14d, 7d, 0d, -3d

#### Authorization List Enhancement

Frontend:
- [ ] Add inline utilization mini-bar column to auth table
- [ ] Add expiry badge column with sort-by-days-until-expiry
- [ ] Add 4 metric cards above table: Active (green), Expiring 30d (amber), Expired (red), Avg Utilization (themed)
- [ ] Add filter tabs: All | Active | Expiring Soon | Expired | Pending
- [ ] Match wireframe layout from UI/UX guide §5

Backend:
- [ ] Aggregation query for auth list metrics (counts by status, avg utilization)
- [ ] Filter support in auth list query (by status category)

Tests:
- [ ] Aggregation query returns correct counts and averages for mixed auth states
- [ ] Filter by "Expiring Soon" returns only auths with `end_date` within 30 days

#### Client Detail Overview Tab

> **Decision**: Uses Suspense boundaries with async server components (Vercel Tier 1 pattern). Critical data loads in the page shell, section data streams in via 3 Suspense boundaries. See [Architecture Decision #6](#architecture-decisions-reference).

Page shell (critical data, `Promise.all`):
- [ ] Load client record + guardian contact together — renders header immediately, `notFound()` if missing

Suspense boundary 1 — Insurance & Care Team:
- [ ] `getClientPrimaryInsurance(clientId, orgId)` — single JOIN, fast
- [ ] `getClientCareTeam(clientId, orgId)` — single query, fast
- [ ] **Insurance snapshot card**: key-value pairs (Payer, Member ID, Group, Plan, Type, Effective Date)
- [ ] **Care Team card**: avatar initials + provider name + role (BCBA)

Suspense boundary 2 — Authorization Utilization:
- [ ] `getClientAuthUtilization(clientId, orgId)` — aggregate query across auth services
- [ ] **Metric cards** (4): Total Approved (hours), Used (hours + % utilized), Weekly Avg, Days Left — with color coding per product spec §3
- [ ] **Authorized Services card**: per-CPT utilization bars with progress, remaining hours, color thresholds
- [ ] Compute hours from units: `units * 15 / 60` for display

Suspense boundary 3 — Recent Sessions:
- [ ] Recent sessions table (last 5), or "No sessions yet" empty state before sessions are built

Skeleton loaders:
- [ ] Content-shaped skeletons for each Suspense boundary (not spinners)

Tests:
- [ ] Hours-from-units computation: 0 units → 0 hrs, 4 units → 1 hr, 32 units → 8 hrs
- [ ] Each query returns correct shape and respects org isolation

#### Authorization Detail Enhancement

Frontend:
- [ ] **Header card**: status badge, dates, payer, client, diagnosis, days remaining, overall utilization bar
- [ ] **Per-service-line utilization bars** in the services section
- [ ] **Expiry alert banner**: 30/14/7-day severity-coded banner at top of page
- [ ] Client detail: wire Authorizations tab (filtered auth list with "Add Authorization" button)

#### Auth Intelligence — Session-Dependent Features

> These features require session history. Build after sessions are logging.
>
> **Decision**: Predictive burndown and pacing alerts only. Revenue-at-risk deferred (requires fee schedule data). Composite health score deferred to Phase 2+ pending practitioner validation. See [Architecture Decision #7](#architecture-decisions-reference).

- [ ] **Predictive burndown** on auth detail: "At current pace, exhausts on {date}" — uses session burn rate over last 4 weeks. Calculation: `remaining_units / (units_used_last_4_weeks / 4) = weeks_remaining`
- [ ] **Under-utilization pacing alert**: "<50% used with >50% period elapsed" — flag for review on auth detail and dashboard alerts

Tests:
- [ ] Burndown projection: 10 units/week burn rate, 40 units remaining → exhausts in 4 weeks
- [ ] Pacing alert: 30% used at 60% elapsed → triggers under-utilization warning
- [ ] Pacing alert: 70% used at 60% elapsed → no warning (on pace)

---

### 1C — Dashboard

> *Product spec §1 (Dashboard), UI/UX guide §1 (Dashboard), dashboard design research.*
> Landing page after login. Practice health at a glance.

#### Dashboard Backend

Queries:
- [ ] `getDashboardMetrics(orgId)` — active client count, avg utilization, hours this week, action item count
- [ ] `getDashboardAlerts(orgId)` — expiring auths (30/14/7d), high utilization (>=80%), expired auths, expired provider credentials, terminated insurance with active auth, flagged sessions
- [ ] `getClientOverviewForDashboard(orgId)` — clients with inline payer, BCBA, auth utilization, auth status, days remaining
- [ ] `getUserSessionsToday(providerId, orgId)` — for "Your Sessions Today" widget

Tests:
- [ ] Alert detection: expiring auth within 7 days returns critical severity
- [ ] Alert detection: terminated insurance with active auth returns critical
- [ ] Metric aggregation: avg utilization correctly weights across auths
- [ ] Org isolation: dashboard queries only return data for the authenticated org

#### Dashboard Frontend

Layout (match wireframe):
- [ ] **Header**: "Dashboard" + date + description + action buttons (Log Session, Export)
- [ ] **4 metric cards**: Active Clients, Avg Utilization (color-coded), Hours This Week, Action Items (with critical count)
- [ ] **Priority Alerts card**: color-coded rows (red=critical, amber=warning), each with entity name, description, action button (Verify/Renew/Review)
- [ ] **Client Overview table**: client name+diagnosis+age, payer, eligibility (— for MVP), auth utilization bar, auth status badge with days remaining, clickable rows → client detail
- [ ] **Your Sessions Today card**: compact card for current user's sessions today, "Log Session" CTA. Only visible when user has a linked provider.

Design quality:
- [ ] Suspense boundaries for staggered loading (metric cards load independently of table)
- [ ] Individual skeleton states per section
- [ ] Exception-based alerting: only surface problems, not happy paths
- [ ] Use section cards with title bars (not naked headings)

#### First-Time Experience

> When a new practice signs up, the dashboard must guide setup — not show a wall of zeroes.

- [ ] **Getting Started card**: 3-step checklist (Add practice info → Add first provider → Add first client). Links to relevant pages. Checkmarks when complete. Disappears when provider + client exist.
- [ ] **Post-creation redirect**: after first client, show setup checklist on client detail (Add guardian → Add insurance → Enter authorization)
- [ ] Empty states on all list pages (already built, verify quality)

---

### 1D — Integration Points

> Wire everything together.

- [ ] Client detail: wire **Sessions tab** (filtered session table + "Log Session" button)
- [ ] Auth detail: wire **Sessions tab** (sessions logged against this auth)
- [ ] Auth detail: show impact of sessions on utilization (used_units reflects logged sessions)
- [ ] Client detail Overview tab: wire Recent Sessions with real data (Suspense boundary 3)
- [ ] Fix dashboard age calculation (use `differenceInYears` from date-fns, not year subtraction)
- [ ] Batch authorization service inserts (single `tx.insert(...).values(services.map(...))`)

Tests:
- [ ] E2E flow: log a session → verify auth used_units incremented → verify session appears in list and client detail
- [ ] Edge case: log session with no matching auth → session created as "flagged"
- [ ] Edge case: cancel completed session → used_units decremented
- [ ] Edge case: cancel non-completed session → no unit adjustment

**Phase 1 Checkpoint**: A BCBA can log in, see their dashboard with real alerts, navigate to a client, see auth utilization at a glance, log a session in under 30 seconds, and watch the utilization update. **This is the product.**

---

## Phase 2: First Users + Polish

> Ship to a handful of ABA practices. Gather feedback. Polish based on what actually matters.

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

---

## Risk Register

| Risk | Severity | When to Address |
|------|----------|-----------------|
| Concurrent auth unit corruption | High | Phase 4 (ordered locking) — or sooner if you see issues |
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
*Status: Flexible roadmap. Start with Phase 0, then build the product.*
