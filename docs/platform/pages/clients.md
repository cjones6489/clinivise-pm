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

No changes from current implementation. Search-to-add modal, primary toggle, role groups.

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
