# Clinivise Product Spec — Page-by-Page

> **Purpose**: Define every page in the application — who uses it, what they see, what they do, and what data powers it. This is the source of truth that bridges the wireframe (how it looks) with the implementation (how it works).
>
> **How to use**: Before building or redesigning any page, read its entry here first. The wireframe (`docs/design/clinivise-wireframes.jsx`) shows the visual layout. This doc explains the *why* and *what*.

---

## Competitor Context

What ABA PM tools typically include, so we know what practitioners expect:

| Feature Area | CentralReach | AlohaABA | Theralytics | Raven Health | SimplePractice |
|---|---|---|---|---|---|
| Scheduling | AI-powered, multi-view calendar | Drag-and-drop, conflict alerts | Calendar with availability | Drag-and-drop | Color-coded calendar |
| Client management | Intake forms → auto-create profile | Client records + portal | Client profiles | Client records | Client portal + intake |
| Authorization tracking | Electronic auth management | Auth management + alerts | Auth tracking | Auth tracking | N/A (not ABA-specific) |
| Session logging | Notes → auto-billing entries | Session notes + data | Data collection + AI notes | Real-time data + offline | Progress notes + templates |
| Billing / Claims | Bulk invoicing, clearinghouse, ERA | Claims, AR, invoicing | Flexible claim processing | Claims + revenue | Insurance claims filing |
| Data collection | Program books, data sheets, offline | Via HiRasmus/Motivity | Built-in curriculum + graphing | Built-in + offline + graphing | N/A |
| Payroll | Integrated | Built-in | N/A | N/A | N/A |
| Eligibility checks | Built-in | Live eligibility | N/A | N/A | Insurance verification |
| AI features | AI scheduling | N/A | AI session note summaries | AI session notes | N/A |
| Parent portal | Yes | Yes | N/A | N/A | Client portal |
| Reporting | KPI dashboards, BI | Reports + analytics | Dashboards + graphing | Graphing + reporting | Income + referral reports |

### What Clinivise does differently

We don't try to be CentralReach (60+ features, $300+/month). We target the gap: **small practices (1-50 staff) that need clean PM + billing, not a bloated enterprise suite.** Free PM tool, monetized via 2-4% of collected revenue on billing.

Our edge:
- **Modern UX** — CentralReach users complain about crashes, data loss, confusing navigation, and "logistical nightmare" workflows. We win by being fast, clean, and reliable.
- **AI-native** — Auth letter parsing, session note drafts, pre-claim error scrubbing. Not bolted on — designed in.
- **ABA-specific** — Not a generic EHR adapted for ABA. Purpose-built for CPT 97153-97158, authorization tracking, and the CMS 8-minute rule.
- **Cmd+K command palette** — Universal search and action entry point, like Linear. Find any client, provider, or action without navigating.
- **Auto-save with visible state** — Every form shows saved/saving/unsaved status. localStorage persistence prevents data loss. Direct counter to CentralReach's #1 complaint.

### What we deliberately exclude (and why)

| Feature | Why we skip it |
|---|---|
| Clinical data collection (DTT, graphing) | Practices already use Catalyst, Motivity, or Hi Rasmus. Integrations later, not competition. |
| Scheduling / calendar | Complex to build well. Practices use Google Calendar or existing tools. Phase 2+ if demand proves it. |
| Payroll | Not core to PM. Practices use Gusto, ADP, or AlohaABA's payroll. |
| Telehealth | Not ABA-specific. Practices use Zoom or platform-provided telehealth. |
| Parent portal | Phase 3. Nice-to-have, not essential for operations. |
| Learning management (LMS) | Enterprise feature. Not relevant for small practices. |

---

## Core Design Philosophy

Exceptional UI/UX is not a nice-to-have — it's the product strategy. ABA practitioners specifically hate their current tools. CentralReach users report crashes, data loss, confusing navigation, and "logistical nightmare" workflows. AlohaABA users report glitches and inconsistencies. This is our competitive opening: **if we're just as capable but dramatically easier and more pleasant to use, we win.**

Every page, every feature, every interaction must be designed with these principles:

### 1. Workflow-first, not data-first
Start with what the user is trying to do, not what the database stores. The schema serves the UI. Ask: "What did they just do? What are they trying to accomplish? What's their next action?" Then design the page to serve that flow.

### 2. Speed over ceremony
The most frequent action (session logging) should take under 30 seconds. Pre-fill everything derivable from context. Minimize clicks. The UI should feel like it's working WITH the user, anticipating their needs.

### 3. Information hierarchy is everything
Every page has a hero moment — one visually dominant element. Three tiers of visual weight: primary (hero numbers, key status), secondary (section cards, supporting data), tertiary (metadata, timestamps). If everything looks the same, nothing stands out.

### 4. Data density without clutter
This is a billing/PM tool. Users WANT to see lots of data. Use compact spacing, small text, dense tables. But organize with clear visual hierarchy, section cards with title bars, and key-value pairs — not walls of form inputs.

### 5. Zero data anxiety
Visible save state on every form. Confirmation dialogs only for destructive actions. Optimistic UI with rollback on failure. Never silently discard input. This directly counters CentralReach's #1 user complaint.

### 6. Designed, not generated
Every screen should feel intentionally crafted. No bare headings with loose content — use section cards. No disabled form inputs for display — use key-value pairs. No placeholder stubs — use designed empty states. No flat tables — use rich rows with inline context and badges.

### 7. Anticipate the next action
Every page should have contextual action buttons for what the user most likely wants to do next. Client detail → "Log Session." Auth list → "Upload Auth Letter." Don't make users navigate elsewhere for the obvious next step.

---

## MVP Value Proposition

Be honest about what we ship at launch vs. what's coming. Don't promise auto-save if it's Phase 2. Don't claim AI billing scrubbing if it's not built yet.

### What we CAN promise at MVP

| Promise | How we deliver it |
|---|---|
| **"See your authorizations at a glance"** | Utilization bars on client detail, dashboard alerts for expiring/over-utilized auths, per-CPT progress tracking |
| **"Log sessions in 30 seconds"** | Pre-fill from context, auto-calculated units, one-screen form, Quick Log for repeat sessions |
| **"Catch billing errors before they happen"** | CPT-credential validation, unit mismatch warnings, overlap detection, max units/day enforcement — the only free ABA tool with built-in compliance checks |
| **"Free, forever"** | All PM features are free. Billing (Phase 2) is the paid upgrade at 2-4% of collections |
| **"Never fight your software"** | Modern UI, Cmd+K command palette, flat navigation, designed for RBTs on tablets and BCBAs on laptops |

### What's NOT in MVP (don't claim these yet)

| Feature | When | Why it's deferred |
|---|---|---|
| Auto-save on all forms | Phase 2 | Complex to implement well. MVP has localStorage drafts for Log Session specifically. |
| AI auth letter parsing | Phase 2 (AI track) | Requires AI infrastructure (Bedrock, Inngest). MVP has manual auth entry. |
| Claim scrubbing / billing | Phase 2 | Requires Stedi integration. This is the monetization layer. |
| Real-time eligibility checks | Phase 2 | Requires Stedi 270/271 integration. |
| Role-specific dashboards | Phase 2 | MVP dashboard shows practice-wide data with a "Your Sessions Today" widget for RBT relevance. |

### Aha Moments (optimize the design for these)

These are the moments when a new user thinks "this is better than what I had." Every design pass should make these feel polished and delightful.

1. **First utilization bar** — User sees auth utilization on the client detail page with color-coded thresholds and remaining units. "I can see at a glance how many units are left!" (CentralReach buries this in the billing module.)
2. **First auto-calculated session** — User enters start/end time on Log Session and instantly sees duration, units, and modifier auto-populate. "It already knows I'm an RBT and adds the HM modifier!"
3. **First dashboard alert** — Dashboard catches an expiring auth at 14 days with a "Renew" button. "This would have been a denied claim if I hadn't seen this."
4. **First Quick Log** — RBT taps "Log Again" on a previous session and the entire form pre-fills. "That took 5 seconds instead of 2 minutes."
5. **First compliance warning** — Session form warns "Total units for this client + CPT today would exceed 32 (max per day)." "No other free tool does this."

---

## Language & Tone

Use practitioner-friendly language throughout the app — not software-engineer jargon.

| Instead of | Say |
|---|---|
| "Create a provider record" | "Add a team member" |
| "Add a client entity" | "Add a client" |
| "Configure payer settings" | "Set up insurance companies" |
| "Organization profile" | "Practice info" |
| "Revalidate data" | (never show this to users) |
| "Authorization service line" | "Authorized service" or "Approved hours for {CPT}" |
| "Soft delete" | "Archive" |
| "organization_id" | (never show this to users) |

The Getting Started card, empty states, and error messages should all use plain, friendly language. If an RBT can't understand it in 3 seconds, rewrite it.

---

## Navigation Structure

### Sidebar (role-filtered)

```
CORE
  Overview        — all roles (owner, admin, bcba, bcaba, rbt, billing_staff)
  Clients         — all roles
  Authorizations  — owner, admin, bcba, bcaba, billing_staff
  Sessions        — all roles
  Providers       — owner, admin

SETTINGS
  Settings        — owner, admin
```

### Hidden pages (accessed via navigation, no sidebar entry)

- Client Detail (`/clients/[id]`) — click client row
- Provider Detail (`/providers/[id]`) — click provider row
- New Client (`/clients/new`) — "Add Client" button
- New Provider (`/providers/new`) — "Add Provider" button
- New Authorization (`/authorizations/new`) — "Add Manually" button
- Log Session (`/sessions/new`) — "Log Session" button

### Global features

- **Cmd+K command palette**: Search clients, providers, or jump to any page. Available on every page via keyboard shortcut.

---

## MVP Pages (Phase 1)

---

### 1. Dashboard / Overview (`/overview`)

**Who uses it**: Everyone, daily. This is the landing page after login.

**User story**: *"The practice owner opens Clinivise Monday morning to see what needs attention this week — expiring auths, flagged sessions, and overall practice health."*

**Hero moment**: The priority alerts card. What's broken RIGHT NOW.

**Layout** (from wireframe):
- **Header**: "Dashboard" title + "Good morning — here's what needs attention today." + action buttons (Export, Log Session)
- **Metric cards row** (4 cards):
  - Active Clients (count, with total)
  - Avg Utilization (percentage, colored by threshold — see thresholds below)
  - Hours This Week (against target)
  - Action Items (count, with critical count)
- **Priority Alerts card**: Color-coded alert rows with severity (critical/warning), entity name, description, and action button (Verify, Renew, Review)
  - Critical: expired auths, inactive insurance, flagged sessions, expired provider credentials, insurance terminated with active auth
  - Warning: expiring auths (30/14/7 days), high utilization (≥80%), low utilization (<50% used with >50% of period elapsed), expiring provider credentials (30 days)
- **Client Overview table**: Top clients with inline diagnosis + age (not DOB), payer, eligibility badge, auth utilization bar, auth status badge with days remaining
- **Your Sessions Today** (for RBTs/BCBAs): A compact card showing sessions the current user's provider has logged today, with a "Log Session" CTA. Makes the dashboard relevant to clinicians, not just management. Shows: "{N} sessions logged today · {X} hours". If no sessions today: "No sessions logged yet today. Log your first session →". Only visible when the current user has a linked provider record.

**Utilization alert thresholds** (from `constants.ts`):
- 0-79%: normal (default color)
- 80-94%: warning (amber) — "Nearing limit"
- 95-99%: critical (red) — "Almost exhausted"
- 100%+: over-utilized (red, bold) — "Over-utilized"
- <50% used with >50% period elapsed: under-utilized (amber) — flag for review

**Data required**:
- Client count: `COUNT(*)` from `clients` WHERE `status` != 'archived' AND `deleted_at IS NULL`
- Authorization utilization: aggregate `used_units / approved_units` from `authorization_services` joined through active `authorizations`
- Session hours this week: `SUM(units * 15 / 60)` from `sessions` WHERE date in current week (units are 15-minute increments)
- Alerts: auths WHERE `end_date` within 30 days, auth services WHERE utilization ≥ 80%, auths WHERE `status` = 'expired', sessions WHERE `status` = 'flagged'
- Client overview: `clients` LEFT JOIN `providers` (BCBA), `client_insurance` → `payers`, `authorizations` → `authorization_services`

**Actions from this page**:
- Primary: Log Session (→ `/sessions/new`)
- Secondary: Export (→ CSV of client overview table with columns matching the displayed table)
- Alert actions: Verify (→ `/clients/[id]` Insurance tab), Renew (→ `/clients/[id]` Authorizations tab), Review (→ session detail)
- Table row click: → `/clients/[id]`

**MVP scope**: Metric cards + alerts card + client overview table. All data is real, not mocked.

**Phase 2+**: Trend sparklines in metric cards, historical comparison, customizable alert thresholds, role-specific dashboard views (RBT sees their caseload sessions, BCBA sees supervisees), supervision compliance alerts (BACB 5% ratio).

---

### 2. Clients List (`/clients`)

**Who uses it**: BCBAs (reviewing caseload), admins (managing roster), billing staff (checking insurance status). Daily.

**User story**: *"A BCBA wants to quickly find a client to check their authorization status before a parent meeting."*

**Hero moment**: The table itself — rich, scannable rows with inline context.

**Layout** (from wireframe):
- **Header**: "Clients" title + "{N} clients in your caseload" + search input + Filters button + "Add Client" button
- **Table** with columns:
  - Client (name bolded, "DOB: {date} · {diagnosisCode}" underneath in muted text)
  - Guardian (primary contact name where `isLegalGuardian = true`)
  - Payer (primary insurance payer name)
  - BCBA (assigned BCBA provider name)
  - Eligibility (badge: Active/Inactive — Phase 2 via Stedi, show "—" for MVP)
  - Auth Status (badge with days remaining: "90d" green, "10d" amber, "Expired" red, "—" if no auth)
  - Arrow icon (→) indicating clickable row

**Data required**:
- `clients` LEFT JOIN `providers` (BCBA name via `assigned_bcba_id`), LEFT JOIN `client_contacts` (first contact WHERE `is_legal_guardian = true`), LEFT JOIN `client_insurance` → `payers` (priority 1 policy's payer name)
- Auth status: most recent authorization WHERE `status` = 'approved' AND `end_date` >= today, calculated `days_remaining = end_date - today`

**Actions from this page**:
- Primary: Add Client (→ `/clients/new`)
- Secondary: Search (client-side table filter on name), Filters (by status, BCBA, payer)
- Row click: → `/clients/[id]`

**MVP scope**: Table with client name+DOB+diagnosis, guardian, payer, BCBA, status badge. Auth status shows days remaining once Sprint 2D lands. Eligibility column shows "—" until Phase 2.

**Phase 2+**: Eligibility badges (real-time Stedi), bulk eligibility check, CSV import, card view toggle.

---

### 3. Client Detail (`/clients/[id]`)

**Who uses it**: BCBAs (primary), RBTs (checking auth status), billing staff (insurance info), admins. Multiple times daily.

**User story**: *"A BCBA opens Ethan Miller's page to check if his 97153 authorization has enough units for this week's sessions, and to see if his insurance is still active."*

**Hero moment**: The metric cards showing authorization utilization at a glance.

**Layout** (from wireframe):
- **Back link**: "← Back to Clients" (text-primary, clickable)
- **Header**: Large client name (22px bold) + "DOB: {date} · Age {N} · {diagnosisCode}: {diagnosisDescription}" + "Guardian: {name} · {phone} · {email}" + status badges on right (status badge + "Auth: {N}d left" if active auth)
- **Action buttons row**: Log Session (primary blue), Upload Auth Letter (outline), Run Eligibility Check (outline, Phase 2)
- **Tabs**: Overview | Care Team | Insurance | Authorizations | Sessions | Documents | Edit (if canEdit)

**Overview tab**:
- **Metric cards** (4):
  - Total Approved: sum of `approved_units` across active auth services, displayed as hours (`units * 15 / 60`), sub-text shows breakdown by CPT ("97153: 100 · 97155: 20")
  - Used: sum of `used_units`, displayed as hours, sub-text shows "61% utilized" with color coding
  - Weekly Avg: average session hours per week over the auth period
  - Days Left: `end_date - today` from active auth, sub-text shows "Auth expires {date}"
- **2-column grid**:
  - Insurance card (section card with title bar): key-value pairs — Payer, Member ID, Group, Plan Name, Type, Effective Date, Term Date. Data from primary `client_insurance` with `payers` JOIN.
  - Care Team summary card (section card with title bar + "Manage →" link to Care Team tab): compact avatar stack showing team members with role labels. Shows count: "2 BCBAs · 3 RBTs". Phase 1: shows assigned BCBA only. Phase 2: full team from `client_providers`.
- **Authorized Services card** (section card with title bar): Per-CPT code utilization. Each row shows: CPT code (monospace, primary color) + description, "N hrs remaining" on right, progress bar (color-coded by utilization threshold). Data from `authorization_services` on the active authorization.

**Note on units vs hours**: The schema stores 15-minute units in `approved_units` and `used_units`. The UI displays hours for readability: `hours = units * 15 / 60`. Both the metric cards and utilization bars show hours. The Authorizations tab detail view can show raw units for precision.

**Insurance tab**: Already built (Sprint 2C). Insurance policy cards with verification status, payer combobox, subscriber details.

**Care Team tab** (Phase 2):

```
┌─────────────────────────────────────────────────────────────┐
│  CARE TEAM                          2 BCBAs · 3 RBTs       │
│                                                             │
│  ┌─ Supervising ──────────────────────────────────────────┐ │
│  │ [SC] Sarah Chen       BCBA    ★ Primary          [⋯]  │ │
│  │ [DP] David Park       BCBA                       [⋯]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ Direct Service ───────────────────────────────────────┐ │
│  │ [MJ] Marcus Johnson   RBT                        [⋯]  │ │
│  │ [AR] Amy Rodriguez    RBT    ★ Primary RBT       [⋯]  │ │
│  │ [CL] Chris Lee        RBT                        [⋯]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  [+ Add Provider to Care Team]                              │
└─────────────────────────────────────────────────────────────┘
```

**Interaction pattern** (combobox-search-and-add — NOT drag-and-drop):
1. Click "+ Add Provider to Care Team" → popover opens (not modal, keep team visible for context)
2. Search input auto-focused, type-ahead filters available providers (those NOT already on this team)
3. Each row: avatar initials, name, credential badge, # current clients (load context)
4. Click provider → role auto-selects from credential (BCBA→Supervising, RBT→Direct Service)
5. User can override role from inline dropdown if needed
6. Provider appears in grouped list with subtle animation + Sonner toast

**Team member row**: Avatar initials + name + credential badge + role dropdown (inline, changeable) + ★ primary toggle (star icon, single-click) + ⋯ overflow menu (Remove from team, View provider profile)

**Role groups (section headers):**
- Supervising (BCBAs, BCBA-Ds, BCaBAs)
- Direct Service (RBTs, lead RBTs)

**Primary designation**: ★ star toggle per role group — one primary BCBA (for auth/claims defaults) and optionally one primary RBT (lead). Click star → previous primary in that group is demoted. Not the same as "role" — a provider can be role=BCBA + primary=false (coverage BCBA).

**Key design decisions:**

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| No drag-and-drop | Combobox-add | Faster (3 clicks vs 5+), works on tablets, accessible, supports inline role assignment |
| Popover not modal | Keep team visible | Context: see who's already on the team while adding |
| Auto-role from credential | RBT→Direct, BCBA→Supervising | Reduces clicks; 80% of the time the default is correct |
| Grouped by role | Section headers | ABA teams have clear hierarchy; scannable |
| Primary = star toggle | Separate from role | Orthogonal concerns; most common edit is changing primary, should be 1 click |
| Remove via overflow menu | Not prominent button | Destructive action behind intentional click |

**Empty state**: "No care team assigned yet. Add providers to this client's care team." + [Add Provider] button.

**Phase 1 (current)**: Care Team tab shows single assigned BCBA (from `clients.assignedBcbaId`) in the same grouped layout. "Add Provider" button either links to Edit tab BCBA dropdown or is disabled with "Full care team management coming soon."

**Phase 2**: Full `client_providers` junction table. Add/remove/role-change interactions. Time-bounded assignments (start/end dates visible in ⋯ menu details).

**Phase 3**: Supervision ratio display per BCBA-RBT pair (% of hours supervised this month), substitution workflow (one-click temp assignment), bulk assignment from client list.

**Data required**: `client_providers` JOIN `providers` WHERE `end_date IS NULL` (active assignments). Phase 1: `providers` WHERE `id = client.assignedBcbaId`.

**Authorizations tab**: Card per authorization. Current/active auth expanded showing: period (start → end), days left, weekly target hours, projected utilization %, per-CPT utilization bars. Previous/expired auths collapsed showing one-line summary: "{period} · {CPT}: {used}/{approved} ({pct}%)". Actions: Add Authorization, Edit, Renew (creates new auth with `previous_authorization_id` link).

**Sessions tab**: Table of sessions for this client. Columns: Date, Time (start-end), Provider, CPT (monospace), Units, POS, Status (badge: Scheduled/Completed/Cancelled/No Show/Flagged). Filter by date range (This Week / This Month / All). Action: Log Session.

**Documents tab** (Phase 2): Upload and list documents (auth letters, assessments, referrals). Auth letter upload triggers AI parsing.

**Edit tab** (if canEdit): The full client edit form (fields: first/last name, DOB, gender, phone, email, address, diagnosis code/description, assigned BCBA, intake date, status, referral source, notes, hold reason).

**Data required**:
- `clients` record with all fields
- `client_contacts` (guardian lookup: first WHERE `is_legal_guardian = true`)
- `client_insurance` → `payers` JOIN (all policies, ordered by priority)
- `authorizations` → `authorization_services` (CPT + used/approved units)
- `sessions` for this client, joined with `providers`
- `providers` for care team display (Phase 1: BCBA via `assigned_bcba_id`; Phase 2: `client_providers` junction table)

**Actions from this page**:
- Primary: Log Session (→ `/sessions/new?clientId={id}`)
- Secondary: Upload Auth Letter (→ upload + AI parse, Phase 2), Run Eligibility Check (Phase 2)
- Tab-specific: Add/edit insurance (Insurance tab), Add/edit authorization (Authorizations tab), view/edit session (Sessions tab)

**MVP scope**: Rich header with contextual metadata + Overview tab (metric cards, insurance snapshot, care team summary, utilization bars) + Care Team tab (Phase 1: single BCBA display; Phase 2: full team management) + Insurance tab (built) + Authorizations tab (Sprint 2D) + Sessions tab (Sprint 3A) + Edit tab (built). Documents tab deferred to Phase 2.

**Phase 2+**: Full care team management (add/remove/roles via `client_providers`), eligibility check button (Stedi), AI auth letter parsing, document management, session graphing, supervision notes.

---

### 4. Add/Edit Client (`/clients/new`, `/clients/[id]` Edit tab)

**Who uses it**: BCBAs, admins. Weekly (new clients) or occasionally (edits).

**User story**: *"An admin is onboarding a new client referred by a pediatrician. They need to enter the basics — name, DOB, diagnosis, guardian info, and insurance — so the BCBA can start the assessment."*

**No wireframe exists for this page.** Layout based on current implementation.

**Layout**:
- **Back link**: "← Back to Clients" (new client page only)
- **Header**: "Add Client" (new) or shown as Edit tab on client detail
- **Form** (4 sections):
  - Basic Info: first name, last name, DOB (date input), gender (select: M/F/U), phone, email, status (select: all `CLIENT_STATUSES` except "archived"), referral source (select)
  - Address: address line 1, address line 2, city, state, zip code
  - Clinical: diagnosis code (default "F84.0"), diagnosis description (default "Autism Spectrum Disorder"), assigned BCBA (select from active BCBAs/BCBA-Ds), intake date
  - Notes: free text notes, hold reason (shown only when status = "on_hold")
- **Actions**: Create Client / Save Changes (primary), Cancel (outline)

**Data required**: Client fields from schema, BCBA options query (providers WHERE `credential_type` IN ('bcba', 'bcba_d') AND `is_active = true` AND `deleted_at IS NULL`).

**MVP scope**: All sections as currently built. New client is a full page (`/clients/new`). Editing an existing client is the "Edit" tab on the client detail page.

---

### 5. Authorizations List (`/authorizations`)

**Who uses it**: BCBAs (tracking renewals), billing staff (checking coverage before claims), admins. Weekly.

**User story**: *"The billing coordinator reviews all authorizations on Monday to identify which ones are expiring this month and need renewal requests submitted."*

**Hero moment**: The utilization bars and "Expiring Soon" filter.

**Layout** (from wireframe):
- **Header**: "Authorizations" title + "Track all client authorizations and renewals" + "Upload Auth Letter" button (primary)
- **Filter tabs**: All | Active | Expiring Soon | Expired | Pending
  - "Active" maps to DB status `approved` with `end_date` > today
  - "Expiring Soon" = `approved` with `end_date` within 30 days
  - "Expired" maps to DB status `expired` OR `approved` with `end_date` < today
  - "Pending" maps to DB status `pending`
  - Note: DB also has statuses `denied` and `exhausted` — these show under "All" but don't get dedicated filter tabs (low volume)
- **Metric cards** (4):
  - Active (count of approved auths with end_date > today, green)
  - Expiring 30d (count expiring within 30 days, amber)
  - Expired (count expired, red)
  - Avg Utilization (percentage across active auths, colored by threshold)
- **Table** with columns:
  - Client (name, bold)
  - Auth ID (monospace, from `authorization_number` field)
  - Period (start → end dates, formatted)
  - Days Left (number, red if negative/expired)
  - Utilization (progress bar: aggregate used/approved across all services for this auth, displayed as hours)
  - Projected (percentage: projected utilization at current weekly rate through end of auth period)
  - Status (badge: Active=green, Expiring=amber, Expired=red, Pending=outline, Denied=red, Exhausted=muted)

**Data required**:
- `authorizations` JOIN `clients` (name) JOIN `authorization_services` (for utilization aggregates)
- Calculated fields: `days_left = end_date - today`, `utilization_pct = SUM(used_units) / SUM(approved_units)`, `projected_pct` based on weekly burn rate × remaining weeks

**Actions from this page**:
- Primary: Upload Auth Letter (→ AI parse flow, Phase 2 — links to Add Manually for MVP)
- Secondary: Add Manually (→ `/authorizations/new` or dialog)
- Filter by status tab
- Row click: → `/clients/[id]` Authorizations tab

**MVP scope**: Full table with real data. Metric cards. Filter tabs. Utilization bars (displayed as hours). "Upload Auth Letter" button links to manual add form for MVP.

**Phase 2+**: AI auth letter upload + parsing, projected utilization calculation, renewal workflow (pre-fill from previous auth via `previous_authorization_id`), bulk auth status view.

---

### 6. Add/Edit Authorization (`/authorizations/new`, dialog, or `/clients/[id]` Authorizations tab)

**Who uses it**: BCBAs, admins. When a new authorization letter arrives from a payer.

**User story**: *"A BCBA received an authorization letter from Blue Cross approving 120 units of 97153 and 20 units of 97155 for the next 6 months. They need to enter this so session logging tracks against the approved units."*

**No wireframe exists for this page.** Design based on domain requirements.

**Layout**:
- **Form** (3 sections):
  - Authorization Info: client (select/combobox), client insurance policy (select from client's active policies), authorization number (text), status (select: pending/approved/denied/expired/exhausted), start date, end date, diagnosis code (pre-fill from client), notes
  - Service Lines (repeatable section): CPT code (select from `ABA_CPT_CODES`), approved units (number), used units (number, typically 0 for new auths). Add/remove service lines.
  - Renewal Link (optional): link to previous authorization (`previous_authorization_id`). If renewing, pre-fill client, insurance, diagnosis from the previous auth.
- **Actions**: Save Authorization (primary), Cancel

**Data required**: Client list, client insurance policies (for selected client), CPT code options from `ABA_CPT_CODES` constant.

**MVP scope**: Full form with service lines. Accessed from "Add Manually" on authorizations list or "Add Authorization" in client detail Authorizations tab. Can be a full page or a large dialog.

**Phase 2+**: AI auth letter parsing pre-fills this form. Confidence indicators per field. Side-by-side PDF viewer.

---

### 7. Sessions List (`/sessions`)

**Who uses it**: RBTs (logging sessions), BCBAs (reviewing), billing staff (preparing claims). Daily.

**User story**: *"An RBT just finished a 3-hour session with a client at their home. They need to log it — client, time, CPT code — before driving to the next appointment."*

**Hero moment**: The "Log Session" button and the session count/hours metrics.

**Layout** (from wireframe):
- **Header**: "Sessions" title + "{N} sessions logged this month" + "Import CSV" button (Phase 2) + "Log Session" button (primary)
- **Metric cards** (4):
  - This Week: total hours (`SUM(units * 15 / 60)` for current week)
  - Sessions 7d: count of sessions in last 7 days
  - Flagged: count WHERE `status = 'flagged'` (red if > 0)
  - Unbilled: count of sessions not yet attached to a claim (amber) + estimated dollar amount (Phase 2 — show count only for MVP)
- **Table** with columns:
  - Date (formatted)
  - Client (name, medium weight)
  - Provider (name)
  - CPT (monospace, primary color, from `cpt_code`)
  - Units (number, tabular-nums)
  - POS (code from `place_of_service`)
  - Status (badge): Scheduled (outline), Completed (green/"Done"), Cancelled (muted), No Show (muted), Flagged (red)
  - Billed (badge): "—" for MVP, "No" (gray) / "Billed" (blue) in Phase 2 when claims exist

**Data required**:
- `sessions` JOIN `clients` (name) JOIN `providers` (name)
- Aggregates: hours this week, session count 7d, flagged count, unbilled count
- Session duration is calculated from `start_time` and `end_time` (no separate `duration_minutes` column — duration is derived)

**Actions from this page**:
- Primary: Log Session (→ `/sessions/new`)
- Secondary: Import CSV (Phase 2)
- Row click: → session detail/edit (dialog or inline expand)

**MVP scope**: Full table with real data. Metric cards (unbilled shows count only, no dollar estimate until Phase 2). "Log Session" button. "Import CSV" button visible but disabled/Phase 2.

**Phase 2+**: Billed status from claims, bulk claim generation from selected sessions, CSV import, session detail expand.

---

### 8. Log Session (`/sessions/new`)

**Who uses it**: RBTs (primarily), BCBAs. Multiple times daily. **The single most frequent action in the entire app.**

**User story**: *"An RBT just finished a 3-hour direct therapy session (97153) with Marcus Thompson at his home. They need to log it in under 30 seconds before driving to the next client."*

**Hero moment**: The auto-calculated units display — the user enters start/end time and instantly sees duration, units, and modifier.

**Layout** (from wireframe):
- **Back link**: "← Back to Sessions"
- **Header**: "Log Session"
- **Quick Log section** (above the form, for returning users): Shows the user's last 3-5 sessions as compact cards: "{Client Name} · {CPT} · {Units} units · {POS} — {date}". Each has a "Log Again" button that pre-fills the entire form from that session (same client, CPT, POS, provider) with only date (today) and times left empty. This turns a 30-second form into a 5-10 second interaction. Hidden when the user has no previous sessions.
- **Form card**:
  - Row 1: Client (combobox, searchable), Provider (select, pre-filled if RBT)
  - Row 2: Date (date input, pre-filled today), Start Time (time input), End Time (time input)
  - Row 3: CPT Code (select with code + description, e.g. "97153 — Adaptive behavior treatment"), Place of Service (select with code + label, e.g. "12 — Home")
  - **Auto-calculated card** (blue/info background): Duration (e.g. "3h 0m"), Units at 15-min (e.g. "12"), Modifier (from provider credential, e.g. "HM" for RBT). Calculated client-side in real-time as user changes times.
  - **Authorization Check card**: Shows which auth will be debited, remaining units before and after this session.
    - Green: "Auth AUTH-0891 has 38 units remaining for 97153. This session uses 12 units → 26 remaining after."
    - Amber: remaining units < 20% of approved → "Low remaining units"
    - Red: insufficient units → "This session exceeds remaining authorized units"
    - Gray: no active auth found → "No active authorization for this CPT code"
  - Notes (optional textarea)
- **Actions**: Save Session (primary), Cancel

**Pre-fill logic**:
- Date: today
- Provider: current user's linked provider record (if user role is RBT or BCBA)
- CPT: last used CPT code for the selected client (query most recent session for this client)
- POS: last used POS for the selected client

**Data required**:
- Client list (active clients, combobox search)
- Provider list (active providers)
- Current user → provider mapping (for pre-fill)
- Active authorization + authorization_services for selected client + selected CPT code (for auth check)
- Provider credential type → modifier code mapping (from `CREDENTIAL_MODIFIERS` constant)
- `calculateUnits()` from `src/lib/utils.ts` for CMS 8-minute rule

**Actions from this page**:
- Primary: Save Session → creates session record, atomically increments `used_units` on the matched authorization service (`SET used_units = used_units + N`), redirects to `/sessions` with success toast
- Secondary: Cancel (→ back to sessions)

**Session validation checks** (ship with sessions — competitive differentiator):
These run client-side before save and surface as warnings (not blockers, since the session was already delivered):
1. **CPT-credential validation**: Warn if provider credential type doesn't match the CPT code's allowed provider (e.g., BCBA logging 97153 should be RBT, RBT logging 97155 should be BCBA). Uses `ABA_CPT_CODES.provider` field.
2. **maxUnitsPerDay enforcement**: Warn if total units for this client + CPT code today would exceed `ABA_CPT_CODES.maxUnitsPerDay` (e.g., 97153 max 32 units/day).
3. **Session overlap detection**: Warn if this provider already has a session logged during an overlapping time range on the same date.
4. **Auto-unit mismatch**: If the user manually overrides the auto-calculated units, show a subtle warning noting the discrepancy.
5. **No active auth**: Session CAN be saved without an active auth, but gets status "flagged" with reason "no_active_auth". This appears in dashboard alerts.

**Auth selection logic** (for clients with multiple active auths for the same CPT):
When multiple active authorizations cover the selected CPT code, the system auto-selects the one with the earliest expiration date (FIFO, per CLAUDE.md). A compact card shows the selected auth with a "Change" link that expands to show alternatives with their remaining units. The user can override the auto-selection.

**Auth date validation**: The authorization check compares `session_date` against `auth.start_date` and `auth.end_date` (inclusive on both ends). A session is covered if `start_date <= session_date <= end_date`, regardless of when the session is logged (supports backdated entry).

**Mobile / tablet considerations** (RBTs log sessions from the field):
- Below 768px: stack all form rows to single column, increase touch target sizes
- Time entry: use native `<input type="time">` on mobile (invokes OS time picker, touch-optimized)
- Client/Provider selects: use combobox with full-width on mobile
- **Draft persistence**: If the user has unsaved changes and navigates away or closes the browser, form state is persisted to localStorage keyed by `draft-session-{orgId}`. On return, a banner shows "You have an unsaved session draft. Resume or discard." This ships with MVP — it's the highest-risk data-loss scenario.
- Offline (Phase 2): Show "No connection" banner, queue session in localStorage, sync when online

**MVP scope**: Full form with auto-calculation, auth check display, pre-fill logic, session validation warnings, draft persistence to localStorage. This page gets the MOST design attention — speed is everything.

**Phase 2+**: Timer mode (start/stop instead of entering times), recurring session templates, session note AI drafts (ghost text from structured data), offline queue + sync, PWA installable app.

---

### 9. Providers List (`/providers`)

**Who uses it**: Admins, owners. Weekly or when onboarding new staff.

**User story**: *"The practice owner is hiring a new RBT and needs to add them to the system with their credential info and assign a supervising BCBA."*

**Hero moment**: The table showing all staff with credential type and status at a glance.

**No wireframe exists for this page.** Layout based on current implementation + standard patterns.

**Layout**:
- **Header**: "Providers" title + "Manage your practice's staff and credentials" + "Add Provider" button (primary)
- **Search + table** with columns:
  - Name (last, first — bold, with credential abbreviation in muted text underneath, e.g. "BCBA-D")
  - Credential (badge: BCBA, BCBA-D, BCaBA, RBT, Other)
  - NPI (tabular-nums, or "—" if not set)
  - Supervisor (name of supervising BCBA, or "—")
  - Status (badge: Active=default, Inactive=outline)
  - Actions (dropdown: Edit, Archive)

**Data required**:
- `providers` with self-join for supervisor name, filtered by `deleted_at IS NULL`, ordered by last name
- Role gating: only `owner` and `admin` can access this page

**Actions from this page**:
- Primary: Add Provider (→ `/providers/new`)
- Secondary: Search (filter on name)
- Row click: → `/providers/[id]`
- Actions dropdown: Edit (→ `/providers/[id]`), Archive (soft delete with confirmation)

**MVP scope**: Built (Sprint 2A). Needs design pass to add supervisor column and match visual quality standards (rich table rows).

---

### 10. Provider Detail (`/providers/[id]`)

**Who uses it**: Admins, owners. Occasionally.

**User story**: *"An admin needs to update a provider's NPI number and check when their RBT credential expires."*

**No wireframe exists for this page.** Layout based on current implementation.

**Layout**:
- **Back link**: "← Back to Providers"
- **Header**: Provider name (large bold) + credential badge + status badge
- **Overview section** (default view): Key-value pairs showing — Credential Type, NPI, Credential Number, Credential Expiry, Supervisor, Modifier Code, Status
- **Edit** (via button or tab): Full form with all provider fields (first name, last name, credential type, NPI, credential number, credential expiry, supervisor select, is active toggle)

**Data required**: `providers` record, supervisor provider record (for display name).

**MVP scope**: Built (Sprint 2A). Needs design pass to show overview as key-value pairs first (not form-first), with edit behind a button/tab.

---

### 11. Settings (`/settings`)

**Who uses it**: Admins, owners. Rarely (initial setup and occasional payer management).

**User story**: *"The admin needs to add a new insurance payer (Cigna) because a new client has coverage through them."*

**Layout** (from wireframe):
- **Tabs**: Organization | Team | Payers | Billing
- **Organization tab**: Practice info form — name, NPI, tax ID, taxonomy code (default "103K00000X"), address (line 1, city, state, zip), phone, email, timezone (select, default "America/New_York"). Maps to `organizations` table.
- **Team tab**: Embed Clerk's `<OrganizationProfile>` component for team/invite management. No custom UI needed.
- **Payers tab**: Payer table with CRUD (already built — Sprint 2C). Search, add, edit, deactivate.
- **Billing tab**: Phase 3 stub — Clinivise subscription/billing config.

**Data required**: `organizations` record (for Organization tab), `payers` (for Payers tab).

**MVP scope**: Payers tab is built. Organization tab needs a form for practice info (maps to `organizations` table columns). Team tab embeds Clerk component. Billing tab is Phase 3 stub.

---

## Phase 2 Pages (post-MVP)

These pages are defined at a high level. They'll get full specs when we plan their sprints.

### Billing Dashboard (`/billing`)

Claims lifecycle management. Generate claims from unbilled sessions, submit via Stedi, track payments, manage denials.

**Key elements**: Metric cards (unbilled sessions with dollar estimate, submitted claims, collected revenue, denied claims), filter tabs (Ready to Bill / Submitted / Paid / Denied), claims table with AI pre-claim check badges (Ready ✓ / Review ⚠ / Blocked ✕), bulk select + submit, bulk claim generation from completed sessions.

### Eligibility (`/eligibility`)

Insurance verification via Stedi 270/271. Batch check all clients, history timeline, plain-English AI interpretation.

**Key elements**: Metric cards (active, inactive, pending, last batch date), client table with payer, member ID, copay/deductible, status badge, verification history dots (green/red circles showing last 4 checks).

### Document Management

File upload (Vercel Blob), type classification, association with clients/authorizations. Auth letter upload triggers AI parsing workflow.

---

## Phase 3 Pages (future)

- **Parent Portal** — parents view session history, auth status, documents
- **Analytics / Reporting** — custom reports, revenue trends, utilization analytics, staff productivity
- **Clinical Integrations** — data import from Motivity, Catalyst, Hi Rasmus
- **Scheduling** — if demand warrants building our own vs integration
- **Supervision Tracking** — BACB 5% supervision ratio compliance, 30/45/60 day alerts

---

## Cross-Page Patterns

These patterns apply to EVERY page:

### First-Time Experience (new practice)

When a brand-new practice signs up, every list is empty and every metric is 0. The dashboard must NOT be a wall of zeroes — it should guide the user through setup.

**Getting Started card** (appears on Dashboard when `providers.count === 0` OR `clients.count === 0`):
```
Welcome to Clinivise! Set up your practice in 3 steps:
  ✓ / ○  Add your practice info        → /settings (Organization tab)
  ✓ / ○  Add your first provider       → /providers/new
  ✓ / ○  Add your first client         → /clients/new
```
Each step links to the relevant page and shows a checkmark when completed. The card disappears once the practice has at least 1 provider AND 1 client. Below the card, show the normal dashboard layout (metric cards will show meaningful zeroes once data exists).

**Post-creation redirect**: After adding the first client, redirect to the client detail page with a setup checklist in the Overview tab:
```
Next steps for {client name}:
  ○  Add a guardian contact            → Contacts tab
  ○  Add insurance policy              → Insurance tab
  ○  Enter authorization               → Authorizations tab
```
This checklist appears when the client has 0 contacts, 0 insurance, or 0 authorizations. It disappears as data is added.

### Client Status Pipeline

The 9 client statuses (`inquiry` → `intake` → `waitlist` → `pending_assessment` → `pending_treatment_auth` → `active` → `on_hold` → `discharged` → `archived`) represent an intake-to-discharge lifecycle. For MVP:

**Valid transitions** (enforced in the status dropdown, not in the backend):
- `inquiry` → `intake`, `archived`
- `intake` → `waitlist`, `pending_assessment`, `archived`
- `waitlist` → `intake`, `pending_assessment`, `archived`
- `pending_assessment` → `pending_treatment_auth`, `active`, `archived`
- `pending_treatment_auth` → `active`, `archived`
- `active` → `on_hold`, `discharged`
- `on_hold` → `active`, `discharged`
- `discharged` → `archived`

**Phase 2+**: Kanban/pipeline view on the Clients List page (group by status, drag to advance). Automated transitions (auth approved → move from `pending_treatment_auth` to `active`).

### Session Cancellation / No-Show Workflow

Sessions can be cancelled or marked as no-show. This is distinct from logging a completed session:

- The **Log Session form** has a `status` field (default: `completed`). The user can select `cancelled` or `no_show` instead. When cancelled/no-show is selected, the time fields and auto-calculation are hidden (no units to calculate).
- Cancelled and no-show sessions do NOT decrement `used_units` on authorization services.
- **Cancellation reason** (optional text field, shown when status is cancelled or no_show): Payer audits may require documentation.
- **Pattern detection** (Phase 2): 3+ no-shows in a row for a client triggers a dashboard alert.

### Provider Credential Alerts

Provider credentials have an `credentialExpiry` date. The dashboard should surface expiring credentials alongside authorization alerts:

- **30 days before expiry**: Warning alert — "Jordan Williams (RBT) credential expires in 28 days"
- **Expired**: Critical alert — "Jordan Williams (RBT) credential expired 3 days ago"
- **Log Session warning**: When logging a session with a provider whose credential is expired, show a warning: "This provider's {credentialType} credential expired on {date}. Sessions may not be billable."

### Re-Authorization Tracking (MVP-light)

Full re-authorization workflow (progress reports, payer submission) is Phase 2. For MVP, the spec supports basic tracking:

- Dashboard alerts surface auths expiring within 30/14/7 days with "Renew" action
- "Renew" action on the Authorizations tab creates a new authorization pre-filled from the expiring auth (client, insurance, diagnosis, CPT codes) with `previous_authorization_id` linked
- The previous auth's utilization is visible for reference during renewal

### Session Detail Interaction

When clicking a session row (in Sessions List or Client Detail Sessions tab), show a **dialog** with:
- All session fields displayed as key-value pairs (not a form)
- Status badge, auth utilization impact, validation warnings
- Edit button (if canEdit) that converts to an editable form in the same dialog
- This is a dialog, not a separate page (sessions are compact data, not complex enough for a full page)

### Cmd+K Command Palette

Available on every page via `Cmd+K` (Mac) or `Ctrl+K` (Windows). Uses the shadcn `command.tsx` component.

**Searchable entities**: Clients (by name), Providers (by name), Pages (by title)

**Quick actions**:
- "Log Session" → `/sessions/new`
- "Add Client" → `/clients/new`
- "Add Provider" → `/providers/new`
- "View Dashboard" → `/overview`
- "Settings" → `/settings`

**Search behavior**: Fuzzy match on entity names, prioritize exact prefix matches. Results show entity type icon + name + subtitle (e.g., "Ethan Miller · Client · F84.0"). Click navigates to the entity's detail page.

### Page Header Pattern
Every page has a header with: title (text-lg+ bold), subtitle/description (text-xs muted), and action buttons (right-aligned). Detail pages add a back link and contextual metadata (DOB, age, diagnosis, etc.).

### Empty States
Every list/table has a designed empty state with: icon (32px+), message explaining what goes here, and a CTA button to create the first item. Never a blank page.

Key empty states:
- **Dashboard (no data)**: Getting Started card (see above) + metric cards showing 0
- **Sessions list**: "No sessions logged yet. Log your first session to start tracking hours." CTA: "Log Session"
- **Clients list**: "No clients yet. Add your first client to start managing their care." CTA: "Add Client"
- **Client overview (no auth)**: Metric cards show "—" with "Add an authorization to start tracking utilization"

### Loading States
Skeleton components matching the content shape. Never a centered spinner. Metric cards get individual skeletons. Tables get row skeletons with shimmer.

### Error States
Inline error with retry action. Toast for action failures (via Sonner). Error boundary for page-level crashes (`error.tsx`).

### Auto-Save & Draft Persistence

**MVP**: Forms use explicit Save buttons with success toasts. The **Log Session form specifically** persists drafts to localStorage (see Log Session spec) since it's the highest-risk data-loss scenario.

**Phase 2**: All forms show saved/saving/unsaved state in the header. Full localStorage persistence for draft recovery across all forms. Direct counter to CentralReach's #1 user complaint.

### Data Freshness

- **Dashboard**: Server component, refreshes on each page visit. No polling in MVP. Shows "Last updated" timestamp. Manual refresh button.
- **Log Session auth check**: Always fetches fresh `used_units` on client/CPT selection (bypasses TanStack Query cache) to prevent double-booking units.
- **All other pages**: Standard server component rendering. Mutations trigger `revalidatePath` for freshness.

**Phase 2+**: Real-time updates via server-sent events for dashboard metrics and auth utilization.

### Insurance Termination Conflict

When a client's insurance `terminationDate` passes but they still have an active authorization through that payer:
- Dashboard surfaces alert: "Insurance terminated but authorization still active for {client}"
- Client detail Overview shows both the insurance status (Expired badge) and auth status (Active badge) — making the conflict visible
- This is a critical billing risk: sessions may be delivered but claims will be denied

### Sessions Filter Tabs

The Sessions List should support filter tabs for common workflows:
- All | This Week | Flagged | Unbilled (Phase 2)
- "Flagged" shows sessions with status = `flagged` (validation warnings, no auth, etc.)
- "Unbilled" shows sessions with status = `completed` and no linked claim (Phase 2)

### Role Gating

| Action | Roles |
|---|---|
| View clients, sessions, authorizations | All roles |
| Create/edit clients, contacts, insurance | Owner, Admin, BCBA |
| Create/edit authorizations | Owner, Admin, BCBA |
| Log sessions (all statuses including cancel/no-show) | All roles (RBTs need this daily) |
| Create/edit providers | Owner, Admin |
| Manage payers, settings | Owner, Admin |
| Archive/soft-delete records | Owner, Admin (BCBAs can archive own clients' insurance) |

### Revalidation
After any mutation (create, update, delete), the relevant page revalidates via `revalidatePath`. Lists refresh automatically. Detail pages refresh their data.

### Correction Workflows (when things go wrong)

Trust requires that mistakes are fixable. Users who've been burned by "can't edit data after entry" (RethinkBH complaint) need confidence they can correct errors.

**Session logged to wrong client**: Sessions can be edited (owner/admin/bcba roles). The edit updates the session record and adjusts `used_units` on both the old and new authorization services (decrement old, increment new). An audit trail entry logs the change with who/what/when.

**Wrong auth debited**: Admin can manually adjust `used_units` on an authorization service. This is a rare correction — surface it as an "Adjust Units" action on the auth detail, not prominently. Audit trail entry required.

**Session needs to be voided**: Sessions can be changed to status `cancelled` after the fact. This decrements `used_units` on the linked authorization service. Different from deleting — the session record persists for audit purposes.

**Insurance entered incorrectly**: Insurance policies can be edited at any time. If the payer changes, existing authorizations linked to the old policy are NOT automatically updated — the user must manually re-link or create new auths.

### Data Migration (switching from another PM tool)

Every practice switching to Clinivise has existing data. For MVP:

**Manual entry**: Practices re-enter clients, providers, and insurance manually. The "Add Client" form should support **sequential creation** — after saving, offer "Add Another Client" button (stays on the form with fields cleared) instead of redirecting to the list. This cuts onboarding time significantly for a practice entering 20-50 clients.

**Phase 2**: CSV import for clients (name, DOB, diagnosis, guardian info) and providers (name, credential, NPI). CSV template downloadable from the import page. Validation preview before committing (show which rows will succeed/fail).

**Phase 3**: API-based migration from CentralReach, AlohaABA (if they expose APIs). Direct data import with field mapping.

---

## Data Model Summary

| Page | Primary Tables | Key JOINs |
|---|---|---|
| Dashboard | clients, authorizations, authorization_services, sessions, client_insurance | clients → providers (BCBA), client_insurance → payers, authorizations → authorization_services |
| Clients List | clients | LEFT JOIN providers (BCBA), client_contacts (guardian), client_insurance → payers, authorizations (days left) |
| Client Detail | clients, client_contacts, client_insurance, authorizations, authorization_services, sessions | All above + providers for care team |
| Add/Edit Auth | authorizations, authorization_services | clients, client_insurance |
| Authorizations List | authorizations, authorization_services | JOIN clients |
| Sessions List | sessions | JOIN clients, JOIN providers |
| Log Session | sessions (INSERT), authorization_services (UPDATE used_units) | Query: clients, providers, authorizations + authorization_services |
| Providers | providers | Self-join for supervisor |
| Settings | payers, organizations | None |

### Key schema notes
- **Units**: `authorization_services.approved_units` and `used_units` store 15-minute unit counts. Display as hours in UI: `hours = units * 15 / 60`.
- **Session duration**: Derived from `start_time` and `end_time` timestamps. No separate `duration_minutes` column.
- **Auth renewal**: `authorizations.previous_authorization_id` links renewals to their predecessor (self-referencing FK).
- **Utilization**: Always calculated as `SUM(used_units) / SUM(approved_units)` across authorization_services for a given authorization. Atomic increments only (`SET used_units = used_units + N`).

---

*Last updated: 2026-03-21 (v4 — three audit passes: technical, edge-case, PM/designer)*
*Status: MVP pages 1-11 defined with cross-page workflows, session validation, first-time experience, mobile considerations, MVP value proposition, aha moments, correction workflows, and data migration. Phase 2-3 high-level only.*
