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

> **Competitive context:** Only Motivity and CentralReach have a dedicated care team section among our competitors. Most platforms (Raven, AlohaABA, TherapyPM) rely on scheduling relationships — no explicit team management. Our dedicated tab with roles, primary toggle, and grouped display already puts us ahead. ABA Matrix has the best assignment history UX (white/gray for current/past).

#### Who uses this
- **BCBA** — managing who's on the case, setting primary provider, adding/removing RBTs
- **Admin** — onboarding new staff, reassigning clients during staff transitions
- **RBT/BT** — read-only view of who else is on the team (for coordination)

#### How often
Weekly (BCBAs managing caseloads), occasionally (admin during staff changes).

#### Wireframe

```
+------------------------------------------------------------------+
| CARE TEAM                                    [+ Add Team Member]  |
+------------------------------------------------------------------+
| 3 active members · 1 past                                         |
+==================================================================+
| BCBAs & SUPERVISORS                                               |
+------------------------------------------------------------------+
| SC  Dr. Sarah Chen         BCBA     ★ Primary    [···]           |
|     Supervising BCBA                                              |
+------------------------------------------------------------------+
| RBTs & TECHNICIANS                                                |
+------------------------------------------------------------------+
| JS  Jessica Smith          RBT      ★ Primary    [···]           |
|     Lead RBT                                                      |
|                                                                    |
| DP  David Park             RBT                    [···]           |
|     RBT                                                           |
+==================================================================+
| PAST ASSIGNMENTS                                    [v Expand]    |
+------------------------------------------------------------------+
| (collapsed by default — click to expand)                          |
| AR  Alex Rodriguez         RBT      Jan 15 — Mar 01, 2026       |
|     Transferred to different caseload                             |
+------------------------------------------------------------------+
```

#### Team Member Row

Each row shows:
- **Avatar** — initials circle, primary-colored if primary
- **Name** — full name, clickable link to provider detail page
- **Credential** — badge (BCBA, RBT, BCaBA, etc.)
- **Primary badge** — ★ star icon, primary-colored, with "Primary" label
- **Role** — subtitle text (Supervising BCBA, Lead RBT, RBT, etc.)
- **Overflow menu** [···] — Set as Primary, Remove from Team

#### Role Groups

Team members are visually grouped by credential tier:
1. **BCBAs & Supervisors** — BCBA, BCBA-D, BCaBA with supervising roles
2. **RBTs & Technicians** — RBT, BT, lead RBT

Within each group, primary member sorts first.

#### Past Assignments Section (NEW — to implement)

Below active members, a collapsible "Past Assignments" section:
- Gray background to distinguish from active
- Shows: name, credential, assignment date range (start — end)
- Notes field visible if populated (e.g., "Transferred to different caseload")
- Collapsed by default. Expand to see full history.
- Only shown if there are past assignments (endDate is set).

This matches ABA Matrix's white/gray current/past visual pattern.

#### Add Team Member Dialog

```
+------------------------------------------------------------------+
| Add Team Member                                         [x]      |
|                                                                    |
| Search providers...                                               |
| [________________________________] (search input)                 |
|                                                                    |
| BCBAs & SUPERVISORS                                               |
| +--------------------------------------------------------------+ |
| | SC  Dr. Sarah Chen          BCBA        [Already on team]    | |
| | MJ  Dr. Maria Johnson       BCBA        [+ Add]             | |
| +--------------------------------------------------------------+ |
|                                                                    |
| RBTs & TECHNICIANS                                                |
| +--------------------------------------------------------------+ |
| | JS  Jessica Smith           RBT         [Already on team]    | |
| | DP  David Park              RBT         [Already on team]    | |
| | TW  Tanya Williams          RBT         [+ Add]             | |
| +--------------------------------------------------------------+ |
|                                                                    |
| (all active org providers shown, grouped by credential)           |
| (providers already on team shown as disabled "Already on team")   |
+------------------------------------------------------------------+
```

**Add flow:**
1. Open dialog → see all org providers grouped by credential
2. Search to filter by name
3. Click "+ Add" → provider is added with auto-role from credential
4. Dialog stays open (can add multiple)
5. Close dialog → team refreshes

**Auto-role mapping:**
- BCBA/BCBA-D → `supervising_bcba` role
- BCaBA → `bcaba` role
- RBT → `rbt` role

#### Overflow Menu Actions

```
[···] menu per team member:
├── ★ Set as Primary     (if not already primary)
├── Change Role →         (submenu with role options)
├── ─────────────
└── Remove from Team     (confirmation dialog)
```

**Remove confirmation:** "Remove Jessica Smith from Marcus Thompson's care team? They can still log sessions for this client."

Remove sets `endDate` to today (soft remove — preserves history).

#### States

**Empty state:**
```
+------------------------------------------------------------------+
|  [team icon]                                                      |
|  No team members assigned                                         |
|  Add providers from your practice to this client's care team.     |
|  [+ Add Team Member]                                              |
+------------------------------------------------------------------+
```

**Loading:** Skeleton rows matching the team member row layout.

**All providers assigned:**
```
(in the add dialog, when all active providers are already on the team)
"All active providers are already on this client's care team."
```

#### Implementation Status

- [x] Team member list with role groups (BCBAs & Supervisors, RBTs & Technicians)
- [x] Primary toggle with star indicator
- [x] Search-to-add dialog with credential grouping
- [x] Auto-role from credential on add
- [x] Remove from team with confirmation (soft remove via endDate)
- [x] Overflow menu (set primary, remove)
- [x] Empty state with CTA
- [x] "Already on team" disabled state in add dialog
- [ ] **Past assignments section** (endDate history, collapsible, gray styling)
- [ ] **Assignment notes display** (notes field from client_providers)
- [ ] **Name links to provider detail** page
- [ ] **Change Role submenu** in overflow menu

#### Data Requirements

**Existing (no changes needed):**
- Table: `client_providers` with role, isPrimary, startDate, endDate, notes
- Query: `getCareTeam(orgId, clientId)` — active members where endDate IS NULL
- Query: `getAvailableProviders(orgId, clientId)` — active providers NOT on team
- Actions: `addToTeam`, `updateTeamMember`, `removeFromTeam`

**New for past assignments:**
- [ ] Query: `getPastCareTeam(orgId, clientId)` — members where endDate IS NOT NULL, ordered by endDate desc
- [ ] Pass `pastCareTeam` to the Care Team tab component

---

### Goals Tab

No changes from current implementation. Domain-grouped cards, objectives, behavior reduction fields, assessment source, full lifecycle statuses.

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
