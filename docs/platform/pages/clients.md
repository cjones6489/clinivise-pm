# Client Pages — Design Spec

> Covers: `/clients` (list), `/clients/new` (create), `/clients/[id]` (detail)

---

## Purpose

The client page is where every role starts their day. A BCBA opens a client's chart to check authorization status before planning the week. An RBT opens it to review goals before a session. An admin opens it to update insurance info. It's the most-visited page in the platform.

---

## User Stories

1. **BCBA** — "I open Marcus Thompson's chart Monday morning to check his auth utilization before scheduling this week's sessions. I need to see: are we running low on hours? When does the auth expire? What goals are we working on?"

2. **RBT/BT** — "I'm about to start a session with Sophia Williams. I pull up her chart to review today's goals and check if there are any notes from the last session about her elopement behavior."

3. **Admin** — "Aetna sent us a new auth letter for Liam Patel. I need to upload the PDF and update his authorization with the new approved units."

4. **Billing staff** — "I'm submitting claims for last week. I need to check that Marcus's insurance is active and his auth covers the sessions billed."

---

## Client List (`/clients`)

### Who uses it
All roles. Daily. This is the primary navigation point to individual clients.

### Hero moment
The table itself — scannable rows with key data visible at a glance.

### Layout

```
+------------------------------------------------------------------+
| Clients                                      [+ New Client]       |
| 24 active clients                                                 |
+------------------------------------------------------------------+
| [Search: name, DOB, diagnosis...]     [Status: All v] [Payer v]  |
+------------------------------------------------------------------+
| Name           | DOB      | Payer    | Auth Util | Expiry | Status|
|----------------|----------|----------|-----------|--------|-------|
| Thompson, M.   | 03/2020  | Aetna   | ████░ 78% | 14d    | Active|
| Williams, S.   | 11/2019  | BCBS    | ██░░░ 42% | 45d    | Active|
| Patel, L.      | 06/2021  | UHC     | █████ 95% | 7d (!) | Active|
| Chen, A.       | 02/2020  | Medicaid| ░░░░░  0% | —      | Intake|
+------------------------------------------------------------------+
| Showing 1-24 of 24                          [10 v] [< 1 of 1 >]  |
+------------------------------------------------------------------+
```

### Columns

| Column | Data | Why |
|--------|------|-----|
| Name | Last, First (link to detail) | Primary identifier |
| DOB | MM/YYYY (compact) | Identify the child quickly |
| Payer | Primary insurance name | Billing context at a glance |
| Auth Utilization | Compact progress bar + percentage | The #1 metric practices care about |
| Auth Expiry | Days remaining + badge color | Urgency indicator |
| Status | Badge (active/intake/waitlist/on hold) | Workflow state |

### Features

- [x] Search by name
- [x] Filter by status
- [x] Auth utilization column with color thresholds
- [x] Auth expiry with badges
- [x] Payer column
- [ ] Filter by payer
- [ ] Sort by expiry (soonest first)
- [ ] Bulk actions (export CSV)

---

## Client Detail (`/clients/[id]`)

### Who uses it
All roles, multiple times per day. The most important page in the platform.

### Hero moment
The metric cards row — authorization utilization at a glance. A BCBA should know within 1 second if this client is on track.

### Page Header

```
+------------------------------------------------------------------+
| <- Clients                                                        |
| Thompson, Marcus                                                  |
| DOB: 03/15/2020 . Age 6 . F84.0: Autism Spectrum Disorder       |
| Guardian: Maria Thompson . Aetna (Member: AET-29481)             |
|                                                                    |
| [Active]  [BCBA]              [Log Session] [Edit] [Archive v]    |
+------------------------------------------------------------------+
```

**Header data:** Name, DOB + age, primary diagnosis, guardian name (from contacts), primary payer + member ID. Status badge. Credential badge (if provider is assigned). Action buttons.

The header should give enough context that the user rarely needs to scroll down for basic identity information.

### Metric Cards Row

```
| Total Approved | Used        | Weekly Avg | Days Left |
| 120 hrs        | 94 hrs (78%)| 12.5 hrs   | 14d       |
| 3 services     | [amber]     | per week   | Apr 10    |
```

These are the same metric cards currently on the page. They're correct as-is.

### Tabs

```
[Overview]  [Care Team]  [Goals]  [Authorizations]  [Sessions]  [Documents]  [Edit]
```

**7 tabs** (down from 8). Contacts and Insurance merged into Overview.

---

### Overview Tab

The "at a glance" tab. Everything a provider needs to know about this client without clicking further. Organized as a grid of section cards.

```
+------------------------------------------------------------------+
| [Under-utilization alert banner — if applicable]                  |
+------------------------------------------------------------------+
| CLINICAL INFO              | INSURANCE                            |
| Diagnosis: F84.0           | Payer: Aetna                        |
| Secondary: F90.9, F41.1    | Member ID: AET-29481                |
| Language: English           | Group: GRP-1234                     |
| Referring: Dr. Smith        | Type: Commercial                    |
|   NPI 1234567890           | Effective: 01/01/2026               |
| Medicaid ID: —             | Term: 12/31/2026                    |
|                             |                                     |
|                             | [+ Add Policy] (if no insurance)    |
+----------------------------+-------------------------------------+
| CONTACTS                   | CARE TEAM                            |
| Maria Thompson (mother)    | JS  Jessica Smith, RBT (Primary)    |
|   Guardian . Emergency     |     Caseload provider                |
|   (512) 555-0101           | SC  Dr. Sarah Chen, BCBA            |
|   maria@email.com          |     Supervising BCBA                 |
|                             |                                     |
| Robert Thompson (father)   | [Manage Team]                        |
|   (512) 555-0102           |                                     |
| [+ Add Contact]            |                                     |
+----------------------------+-------------------------------------+
| AUTHORIZED SERVICES (per-CPT utilization bars)                    |
| 97153 — Adaptive Behavior Treatment                               |
| ████████████████░░░░ 78% (94/120 units) . 47.0/60.0 hrs         |
| 97155 — Protocol Modification                                     |
| ██████░░░░░░░░░░░░░░ 30% (12/40 units) . 6.0/20.0 hrs          |
+------------------------------------------------------------------+
| RECENT SESSIONS                                    Last 5 shown   |
| Date    | CPT   | Provider       | Units | Status                |
| Mar 26  | 97153 | Smith, J (RBT) | 8     | [Completed] [Signed] |
| Mar 25  | 97153 | Smith, J (RBT) | 8     | [Completed] [Draft]  |
| Mar 24  | 97155 | Chen, S (BCBA) | 4     | [Completed] [Signed] |
| Mar 22  | 97153 | Smith, J (RBT) | 8     | [Completed] [—]      |
| Mar 21  | 97153 | Smith, J (RBT) | 6     | [Completed] [Signed] |
+------------------------------------------------------------------+
| NOTES (if any)                                                     |
| Internal notes about this client...                                |
+------------------------------------------------------------------+
```

**Key design decisions:**

1. **2-column grid for the top section** — Clinical Info + Insurance on the first row, Contacts + Care Team on the second row. This matches the AlohaABA/Passage pattern of showing all identity info without tab switching.

2. **Contacts as compact list** — Name, relationship badges (guardian, emergency), phone, email. Not a full table. "Add Contact" link at the bottom. This is sufficient for the 1-3 contacts most clients have.

3. **Insurance as KV pairs** — Payer, member ID, group, type, dates. If multiple policies, show primary with a "2 policies" badge linking to the full view. "Add Policy" CTA when empty.

4. **Auth utilization bars stay prominent** — This is the hero data. Color-coded per our thresholds (80% amber, 95% red).

5. **Recent sessions include note status** — A "Note" column showing Missing/Draft/Signed badges. This answers the "where do notes live" question — they're visible from the client's session history without a separate tab.

---

### Care Team Tab

> **Competitive context:** Only Motivity and CentralReach have a dedicated care team section. Most platforms rely on scheduling relationships. Our tab with roles, primary toggle, and grouped display is ahead of our tier.
>
> **UI pattern research (2026-03-27):** Studied Linear, Notion, GitHub, Slack, Figma, Google Docs for team assignment UX. Conclusion: modals are for permission-heavy flows (Slack channels, Figma sharing). Our care team add is a lightweight 2-5 person selection from 5-20 providers — a **popover** (GitHub SelectPanel / Notion person picker pattern) is the right weight.

#### Who uses this
- **BCBA** — managing who's on the case, setting primary provider, adding/removing RBTs
- **Admin** — onboarding new staff, reassigning clients during staff transitions
- **RBT/BT** — read-only view of who else is on the team (for coordination)

#### How often
Weekly (BCBAs managing caseloads), occasionally (admin during staff changes).

#### Design Principles for This Tab
1. **One card, not separate grouped cards** — the team is one unit, not two. Use a single card with inline group dividers.
2. **Popover for adding, inline for managing** — add members via a lightweight popover; set primary and remove via inline actions on the team list.
3. **Credential colors are the visual language** — violet for BCBAs, emerald for RBTs, sky for BCaBAs. Consistent across the tab, popover, and overview card.
4. **2 clicks to add, 2 clicks to remove** — no unnecessary ceremony.

#### Wireframe — Team List

```
+------------------------------------------------------------------+
| 3 active · 1 past                        [+ Add Member ▾]        |
+==================================================================+
| ● BCBAs & Supervisors (1)                                        |
|------------------------------------------------------------------|
| [SC] Dr. Sarah Chen        BCBA  ★       Supervising · Jan 2026  |
|                                                          [···]    |
|=================================================================='
| ● RBTs & Technicians (2)                                         |
|------------------------------------------------------------------|
| [JS] Jessica Smith          RBT  ★       Lead RBT · Mar 2025     |
|                                                          [···]    |
|------------------------------------------------------------------|
| [DP] David Park             RBT          RBT · Sep 2025          |
|                                                          [···]    |
+==================================================================+
| ○ Past (1)                                         [Show/Hide]   |
|------------------------------------------------------------------|
| [AR] Alex Rodriguez         RBT          Jan — Mar 2026          |
|                                           Coverage during leave   |
+------------------------------------------------------------------+
```

**Key design changes from current:**
- **Single card** wrapping all members (not separate cards per group)
- **Colored dot** on group headers (● violet, ● emerald, ○ muted for past)
- **Star ★ overlaid on avatar** for primary (not a separate badge)
- **"Since" date** on every active member
- **Overflow menu [···]** appears on hover (opacity-40 → 100), always visible on touch
- **Past section** is inline in the same card, collapsed, with muted styling (opacity-60)

#### Wireframe — Add Member Modal

```
+------------------------------------------------------------------+
| Add Team Members                                          [x]    |
| Select providers to add. Already-assigned show a checkmark.      |
|                                                                    |
| [🔍 Search by name or credential...                       ]      |
|                                                                    |
| ● BCBAs & Supervisors (3)                                        |
| +--------------------------------------------------------------+ |
| | [SC] Dr. Sarah Chen          BCBA                     ✓     | |
| | [MJ] Dr. Maria Johnson       BCBA               [+ Add]    | |
| | [KL] Dr. Kim Lee             BCaBA                    ✓     | |
| +--------------------------------------------------------------+ |
|                                                                    |
| ● RBTs & Technicians (4)                                         |
| +--------------------------------------------------------------+ |
| | [JS] Jessica Smith           RBT                      ✓     | |
| | [DP] David Park              RBT                      ✓     | |
| | [TW] Tanya Williams          RBT                [+ Add]    | |
| | [AR] Alex Rodriguez          BT                 [+ Add]    | |
| +--------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

**Modal behavior:**
- **Trigger:** "Add Member" button opens a centered modal (~500px wide)
- **Search:** Prominent 40px input, auto-focused, filters by name or credential label
- **Full org roster:** Shows ALL active providers (not just unassigned)
- **Already on team:** Green checkmark ✓ (not hidden, not disabled text — clearly marked)
- **Available:** Outline "Add" button on the right side of each row
- **Click to add:** Instant — fires server action, checkmark appears, stays open for multi-add
- **Provider rows:** 36px credential-colored avatar, text-sm name, text-xs credential label, rounded hover state
- **Groups:** Colored dot headers (violet/emerald) with counts
- **Search clears on close**
- **Add-only:** No managing (primary/remove) in the modal. That stays on the tab.

**Why modal, not popover:**
- ABA practices can have 20-50 staff. A 320px popover is too cramped for that roster.
- The modal gives room for search + grouped display + comfortable row sizing.
- Still focused on one action (add) — not overloaded like the original manage modal was.

#### Overflow Menu Actions

```
[···] menu per active team member:
├── ★ Set as Primary     (if not already primary)
├── ─────────────
└── Remove from Team     (confirmation dialog)
```

**Remove confirmation:** "Remove Jessica Smith from this care team? They can still log sessions for this client."

Remove sets `endDate` to today (soft remove — preserves assignment history).

#### Auto-role mapping (on add)
- BCBA/BCBA-D → `supervising_bcba` role
- BCaBA → `bcaba` role
- RBT/other → `rbt` role

#### States

**Empty state:**
```
+------------------------------------------------------------------+
|     [BC] [RT] [BT]  (stacked credential-colored avatars)         |
|     Build the care team                                           |
|     Add BCBAs, RBTs, and other providers.                        |
|     [+ Add Team Members]                                          |
+------------------------------------------------------------------+
```

**Loading:** Skeleton rows matching the member row height.

**No search results (in modal):**
```
No providers match "xyz"
Try a different name or credential type
```

**No providers in org (in modal):**
```
No providers in this practice yet
Add providers on the Providers page first
```

#### Implementation Status

- [x] Single card layout (BCBAs + RBTs + Past in one card with inline dividers)
- [x] Team member rows with credential-colored avatars (violet/emerald/sky)
- [x] Primary toggle with gold star overlay on avatar corner
- [x] Name links to provider detail page
- [x] "Since" date on every member
- [x] Hover-reveal overflow menu (visible at 40% opacity for touch)
- [x] Set primary and remove from team actions
- [x] Past assignments section (collapsible, muted styling, date range + notes)
- [x] Past care team query (`getPastCareTeam`)
- [x] Empty state with stacked credential avatars
- [x] Group headers with colored dots and counts
- [x] Focused add-member modal (500px, search, grouped roster, checkmarks)
- [x] Green checkmark on already-assigned in modal
- [x] No success toasts (error toasts only)

#### Data Requirements

**All data requirements are met:**
- Table: `client_providers` with role, isPrimary, startDate, endDate, notes
- Query: `getCareTeam(orgId, clientId)` — active members (endDate IS NULL)
- Query: `getPastCareTeam(orgId, clientId)` — past members (endDate IS NOT NULL)
- Query: `getAvailableProviders(orgId, clientId)` — active providers NOT on team
- Actions: `addToTeam`, `updateTeamMember`, `removeFromTeam`

No new schema, queries, or actions needed for the remaining UI changes.

---

### Goals Tab

> **Full scope research:** `docs/research/goals-feature-scope-research.md`
> Goals are not one feature — they're a system with layers. The Goals tab is Layer 1. A Goal Detail Drawer is Layer 2. A full Clinical Workspace is Layer 3 (Phase 3-4). Design now for Layers 1-2 only.

#### Architecture (Two Levels)

```
Client Detail Page
├── Goals Tab (list view — Layer 1, redesigning now)
│   └── Goal Detail Drawer (click to expand — Layer 2, design now)
│       ├── Description, mastery criteria, status history
│       ├── Objectives with progress indicators
│       ├── Mini line chart (from session note data)
│       ├── Behavior reduction details (function, BIP info)
│       ├── Recent session data for this goal
│       └── "Open in Programs →" link (when Phase 3 exists)
│
└── [Future: "Programs" link in client header — Phase 3-4]
    └── /clients/[id]/programs (full clinical workspace)
        ├── Program builder (configure targets, protocols)
        ├── Full graphing suite (phase lines, trends, 20+ dimensions)
        ├── Session-by-session data table
        ├── Mastery automation
        └── Report generation for re-authorization
```

**Why two levels:** Passage Health does this — the Goal Detail Drawer is the quick-view for BCBAs checking in. The full clinical workspace (separate page) is where BCBAs do deep analysis, configure programs, and generate reports. The drawer becomes the "preview" that links into the deeper view. No wasted work.

#### Who uses this
- **BCBA** — reviewing progress, checking mastery status, planning next steps
- **RBT/BT** — read-only view of goals and objectives before a session
- **Admin** — rarely (this is clinical, not administrative)

#### How often
Daily (BCBAs checking progress), before each session (RBTs reviewing targets).

#### Layer 1: Goals List (Redesign In Progress)

**Current state: 4/10 on design completeness.** The data model is solid but the visual design is "developer default" — everything is text-xs, no hierarchy, no progress visualization, no visual differentiation between goal types.

**Design decisions made (from plan-design-review):**

| Decision | Choice | Rationale |
|---|---|---|
| Goal type colors | 2 colors: emerald (skill acquisition), amber (behavior reduction) | 10 domain colors would be overwhelming. Type is the clinically meaningful distinction. |
| Progress indicator | Status badge with color weight (not dot-trail) | 8-step dot-trail is complex, most goals don't hit all 8. Bigger/bolder badge is clearer. |
| Objectives display | Always visible (not collapsed) | Objectives are what RBTs work on. Hiding adds a click. |
| Domain progress summary | Show counts in header ("2 active, 1 mastered") | Gives BCBAs at-a-glance progress without reading each goal. |
| Goal cards vs flat rows | Cards with colored left accent | Creates scannable entities, visual type differentiation. |

**Wireframe — Goals List:**

```
+------------------------------------------------------------------+
| 5 active · 2 met                               [+ Add Goal]      |
+==================================================================+
| COMMUNICATION                          2 active · 1 mastered     |
|------------------------------------------------------------------|
| ┃ 1. Manding for preferred items                                 |
| ┃    [Active]  Skill Acquisition                                 |
| ┃    Mastery: 80% across 3 sessions · Baseline: 20%             |
| ┃    Source: VB-MAPP (Mand Level 2, M8) · Since Jan 2026       |
| ┃                                                                 |
| ┃    Objectives:                                                  |
| ┃    ● 1.1 Request preferred edibles — 75% (partially met)      |
| ┃    ✓ 1.2 Request preferred toys — met                          |
| ┃    ○ 1.3 Request during transitions — baseline                 |
| ┃                                                         [···]  |
|------------------------------------------------------------------|
| ┃ 2. Gross motor imitation                                       |
| ┃    [Mastered → Maintenance]  Skill Acquisition                 |
| ┃    Mastery: 80% across 20 trials · Last: 80% (Mar 26)        |
| ┃    ...                                                  [···]  |
+==================================================================+
| BEHAVIOR REDUCTION                              1 active          |
|------------------------------------------------------------------|
| ┃ 3. Reduce elopement                                            |
| ┃    [Active]  Behavior Reduction                                 |
| ┃    Function: Escape · Severity: Moderate                        |
| ┃    Replacement: Verbal request for break                        |
| ┃    Mastery: <1 occurrence per session across 5 sessions        |
| ┃                                                         [···]  |
+==================================================================+
| MET & DISCONTINUED (2)                              [Show/Hide]  |
|------------------------------------------------------------------|
| (collapsed — same pattern as Care Team past assignments)          |
+------------------------------------------------------------------+
```

**Key visual elements:**
- **Colored left accent** — emerald for skill acquisition, amber for behavior reduction
- **Status badge** — prominent, color-coded per status (baseline=outline, active=default, mastered=emerald, maintenance=outline, met=secondary)
- **Domain headers** — with progress summary counts
- **Objective progress icons** — ● active, ✓ met, ○ baseline (larger than current 14px)
- **"Last session" data** — inline on each goal (e.g., "Last: 80% (Mar 26)")
- **Met section** — collapsible, same pattern as Care Team past assignments

#### Layer 2: Goal Detail Drawer (NEW — to design and build)

When you click a goal card, a drawer slides out from the right showing the full detail.

**Wireframe — Goal Detail Drawer:**

```
+----------------------------------------+
| ← Back to Goals                        |
| 1. Manding for preferred items         |
| [Active]  Skill Acquisition            |
+========================================+
| DESCRIPTION                            |
| Given natural environment, client will |
| independently mand for 15+ items using |
| 2-word phrases with 80% accuracy.     |
+----------------------------------------+
| MASTERY & PROGRESS                     |
|                                         |
| Mastery: 80% across 3 sessions         |
| Baseline: 20% at intake                |
| Current: 70% (trending ↑)              |
|                                         |
| [LINE CHART: accuracy % over time]     |
| ─────────────────────────────────      |
| Jan    Feb    Mar                       |
| 20%    45%    70%                       |
+----------------------------------------+
| OBJECTIVES (3)                         |
| ● 1.1 Request preferred edibles        |
|   75% · Partially met · DTT            |
| ✓ 1.2 Request preferred toys           |
|   Met Mar 15 · DTT                     |
| ○ 1.3 Request during transitions       |
|   Baseline · NET                        |
+----------------------------------------+
| RECENT SESSIONS (3)                    |
| Mar 26 · 70% · Smith, J · 97153       |
| Mar 24 · 65% · Smith, J · 97153       |
| Mar 22 · 68% · Park, D  · 97153       |
+----------------------------------------+
| DETAILS                                |
| Started: Jan 15, 2026                  |
| Target: Jun 30, 2026                   |
| Assessment: VB-MAPP Mand Level 2, M8  |
| Treatment Plan: ITP v2, Section 3.1   |
+----------------------------------------+
| [Open in Programs →] (future link)     |
+----------------------------------------+
```

**Drawer behavior:**
- Slides in from right side (~480px wide)
- Client page stays visible (dimmed) behind it
- Close via X, Escape, or click outside
- Mini line chart generated from `session_note_goals` data (accuracy % over time)
- "Recent Sessions" lists the last 3-5 sessions that referenced this goal
- "Open in Programs →" link is a placeholder for Phase 3 clinical workspace

**For behavior reduction goals, the drawer also shows:**
- Function of behavior, severity level
- Operational definition
- Replacement behavior
- Antecedent/consequence strategies
- Crisis protocol (if populated)

#### Layer 3: Clinical Workspace (Phase 3-4 — NOT designing now)

Documented here for planning purposes only.

When data collection ships (Phase 3), a full `/clients/[id]/programs` page will provide:
- Program builder (configure targets, protocols, prompt hierarchies)
- Full graphing suite (phase change lines, trend lines, filter by instructor/time/condition)
- Session-by-session data table with per-trial detail
- Mastery automation (auto-detect criteria met, suggest phase transitions)
- Progress report generation for insurance re-authorization
- Target-level CRUD (schema `client_goal_targets` already exists)

This is NOT a tab on the client detail page — it's a separate page linked from the client header and from the Goal Detail Drawer.

#### Implementation Status

**Layer 1 — Goals List:**
- [x] Domain-grouped display
- [x] Goal cards with status badges and type badges
- [x] Objectives nested inline
- [x] Behavior reduction fields (function, definition, replacement, severity)
- [x] Assessment source + item ref
- [x] Full 8-status lifecycle with server-side transition validation
- [x] Add Goal dialog with conditional behavior reduction section
- [x] Add Objective dialog
- [x] Status change via overflow menu
- [x] Archive goal with cascade to objectives
- [x] Met & Discontinued collapsible section
- [ ] **Visual redesign** — colored left accent, bigger status badges, domain progress summaries
- [ ] **"Last session" data** inline on goal cards
- [ ] **Objective progress icons** at useful size (currently 14px)

**Layer 2 — Goal Detail Drawer:**
- [ ] **Drawer component** — slide-in panel (~480px)
- [ ] **Full goal description** display
- [ ] **Mini line chart** from session_note_goals data
- [ ] **Recent sessions list** for this goal
- [ ] **Status history** (when each status change occurred)
- [ ] **Query**: getGoalSessionHistory(orgId, goalId) — session note goals for this goal over time

**Layer 3 — Clinical Workspace (Phase 3-4):**
- [ ] Not designed yet. Deferred to Phase 3 with data collection.

#### Data Requirements

**Layer 1 — all data exists.** No new queries needed for the list redesign.

**Layer 2 — needs:**
- Query: `getGoalSessionHistory(orgId, goalId)` — join `session_note_goals` → `session_notes` → `sessions` to get date + accuracy + provider for each session that addressed this goal
- This powers both the mini line chart and the "Recent Sessions" list in the drawer

**Layer 3 — needs full data collection schema (Phase 3).**

---

### Authorizations Tab

Client's authorizations with utilization bars. Links to auth detail pages. No changes needed.

---

### Sessions Tab

Client's session history. Add note status column.

```
| Date    | CPT   | Provider       | Units | Status    | Note        |
|---------|-------|----------------|-------|-----------|-------------|
| Mar 26  | 97153 | Smith, J (RBT) | 8     | Completed | [Draft]     |
| Mar 25  | 97153 | Smith, J (RBT) | 8     | Completed | [Missing] ! |
| Mar 24  | 97155 | Chen, S (BCBA) | 4     | Completed | [Signed]    |
```

Click a row → session detail page (existing behavior).

---

### Documents Tab (NEW — Phase 2)

Per-client document library. Upload, categorize, retrieve.

```
+------------------------------------------------------------------+
| DOCUMENTS                                    [+ Upload Document]  |
+------------------------------------------------------------------+
| Type             | Name                    | Uploaded    | By     |
|------------------|-------------------------|-------------|--------|
| Auth Letter      | Aetna Auth 2026-Q1.pdf | Mar 15      | Admin  |
| Consent Form     | Informed Consent.pdf    | Jan 10      | Admin  |
| Assessment       | VB-MAPP Results.pdf     | Dec 05      | BCBA   |
| Treatment Plan   | ITP v2 - 2026.pdf       | Jan 02      | BCBA   |
+------------------------------------------------------------------+
| Empty state: "No documents uploaded. Upload consent forms,        |
| assessment reports, and auth letters to keep the client's         |
| chart complete."                                                  |
+------------------------------------------------------------------+
```

**Document types:** Authorization letter, Assessment report, Treatment plan, Consent form, Insurance card, Progress report, Other.

Uses existing `documents` table + Vercel Blob storage.

---

### Edit Tab

Client form (inline tab). No changes to current behavior, except:
- Contacts section removed (contacts managed via Overview card)
- Insurance section removed (insurance managed via Overview card)

---

## Create Client (`/clients/new`)

Single-page form. Current implementation is correct. Fields:

**Basic Info:** First name, last name, DOB, gender, status, referral source
**Address:** Line 1, line 2, city, state, ZIP
**Clinical:** Primary diagnosis code + description, secondary diagnoses (comma-separated), primary language, interpreter needed, intake date, Medicaid ID
**Referring Provider:** Name, NPI
**Notes:** Free text, hold reason (conditional)

No changes needed to the create form.

---

## Implementation Status

### What exists today (Phase 1 — built)
- [x] Client list with search, status filter, auth utilization/expiry columns
- [x] Client detail with 8 tabs (Overview, Care Team, Goals, Contacts, Insurance, Authorizations, Sessions, Edit)
- [x] Overview with metric cards, auth utilization, insurance card, care team card, recent sessions
- [x] Clinical Info card (SA-1: diagnosis, secondary codes, language, interpreter, referring provider, Medicaid ID)
- [x] Full goals UI with behavior reduction, assessment source, expanded lifecycle
- [x] Session notes (CPT-specific forms, goal data, behavior incidents, sign workflow)
- [x] All SA-1 through SA-8 field additions

### What needs to change (design pass)
- [ ] **D1: Merge Contacts tab into Overview** — render contacts as a compact section card
- [ ] **D1: Merge Insurance tab into Overview** — render insurance as a KV section card
- [ ] **Remove Contacts and Insurance tab triggers** from client-detail.tsx
- [ ] **Add note status column** to Sessions tab and Overview recent sessions
- [ ] **Add Documents tab** (Phase 2 — needs document upload UI)
- [ ] **Payer filter** on client list page

### Data requirements
All data already exists. No new tables, queries, or schema changes needed for D1. The Overview tab already receives contacts, insurance, care team, auth utilization, and sessions as props — it just needs to render contacts and insurance as section cards.

Documents tab will need:
- Query: `getClientDocuments(orgId, clientId)`
- Action: `uploadDocument`, `deleteDocument`
- UI: Upload dialog, document type selector, file list table
