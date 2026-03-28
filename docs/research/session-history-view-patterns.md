# Client Session History View — Competitive Research

> Research date: 2026-03-27
> Scope: How entry-level ABA practice management platforms display session history on a client detail page — columns, features, statuses, filtering, actions, and UX patterns.
> Sources: Platform help docs, feature pages, blog posts, release notes, review sites, and industry documentation.

---

## 1. Platform-by-Platform Findings

### 1a. Passage Health (passagehealth.com)

**Session Management Model:**
- Integrated scheduling + session execution + billing in one system — sessions are created from the schedule and flow directly into claims
- Mobile-first: field staff run sessions from the Passage mobile app with offline support
- Schedule views by client or team member (daily/weekly/monthly)

**Session List / Client View:**
- Client profile stores demographics, care locations, insurance, and medical info
- Schedule view shows sessions filtered by client, with ability to track unassigned and canceled sessions
- Authorization tracking monitors utilization across billing codes and expiry dates for single or multiple authorizations

**Session Note Features:**
- Fully customizable and configurable session note templates
- Edit notes and collect data simultaneously (not sequential)
- Auto-summarize session data into narrative (AI-generated)
- Auto-insert client/team info into note templates
- Collect signatures on mobile with GPS geolocation auto-recorded on notes
- Real-time data syncing — no data loss

**Key UX Pattern:** Passage treats sessions and notes as one workflow — you run the session, collect data, and complete the note in the same flow. The note is not a separate step after the session.

**Columns (inferred from features):** Date, time, provider, service code (CPT), duration/units, location, note status, signature status, authorization linkage.

---

### 1b. Theralytics (theralytics.net)

**Session Management Model:**
- All-in-one: scheduling + data collection + AI session notes + billing
- ONC Certified and SOC 2 Type II compliant
- Mobile app with offline support, GPS-stamped signatures

**Session/Notes View:**
- Session Notes section on learner profile
- AI-powered narrative summaries generated from session data — "reduces documentation time to just a few clicks"
- Supports multiple measurement methods (frequencies, durations, intervals)
- Real-time data entry during sessions (not after)
- Interactive graphs and reports for progress tracking — filter by staff member, behavior, or time period

**Document Management:**
- HIPAA-compliant document storage with expiration tracking
- Role-based access control
- Secure sharing with parents/caregivers

**Key UX Pattern:** Theralytics differentiates with AI-generated narrative summaries and mobile-first field use. The emphasis is on minimizing documentation time.

**Columns (inferred):** Date, provider, session type, data collection status, note status, signature status.

---

### 1c. TherapyPM (therapypms.com)

**Session Management Model:**
- Affordable all-in-one ($8/mo starting) for independent therapists and small practices
- Scheduling + billing + notes + telehealth in one platform
- Structured ABA session notes supporting daily tracking

**Session/Client View:**
- Client-level ABA documentation gives clinical and admin teams a complete view of session history
- Session notes support daily session tracking and clinical consistency across therapists
- Client portal with 24/7 access to appointments, documents, and payments

**Key UX Pattern:** TherapyPM emphasizes consistency across therapists — structured notes ensure everyone documents the same way. Affordable and simple, not feature-rich.

**Columns (inferred):** Date, provider, appointment type, session note (attached), billing status, payment status.

---

### 1d. TherapyLake (therapylake.com)

**Session Management Model:**
- All-in-one ABA EMR designed by ABA professionals
- Emphasis on intuitive, clutter-free UI
- Real-time data analytics for client progress, session outcomes, and team performance

**Session/Client View:**
- Comprehensive client management from intake to ongoing sessions
- Detailed client records, notes, and treatment plans accessible anytime/anywhere
- Digital notes attached to each appointment with e-signatures for BCBAs, caregivers, or supervisors
- Real-time authorization tracking: view used, reserved, and remaining units per client, filterable by date ranges and services

**Session Validation:**
- Verify required documentation (notes, signatures) before allowing billing or claim generation
- Credential tracking: prevents scheduling if staff are out of compliance (expired licenses, TB tests, DOJ clearances, CPR certs)

**Key UX Pattern:** TherapyLake gates billing on documentation completeness — sessions without required notes/signatures cannot become claims. This creates a natural workflow enforcement.

**Columns (inferred):** Date, provider, service, duration/units, note status, signature status, auth linkage, billing status.

---

### 1e. AlohaABA (alohaaba.com)

**Session Management Model:**
- Mid-market ABA PM with strong authorization-scheduling integration
- Multiple schedule views: day, week, month, list, and timeline
- Captures staff and client signatures, time, date, and geotag

**Client Profile Sessions Tab:**
- **Authorization utilization visible directly in client profile** (not buried in billing)
- Clicking Sessions tab shows: **scheduled, completed, billed, and cancelled appointments** for each service in the authorization
- Clicking Reports shows: total appointments scheduled within the service and authorization, plus a **monthly breakdown**
- Integration with Motivity/Hi Rasmus for clinical notes

**Appointment Features:**
- Appointment statuses: Scheduled, Completed, Billed, Cancelled (+ others)
- Appointment status tracking history (audit trail)
- **Appointment Validations with four enforcement levels: None, Flag, Warn, Stop**
- Additional list columns: Staff Hourly Rate, Contract Rate (for expected reimbursement)
- Scheduling validations minimize billing errors
- Authorization utilization verification directly within scheduling process

**Key UX Pattern:** AlohaABA's client Sessions tab is authorization-centric — sessions are grouped by authorization and service code, showing utilization against approved units. This is the strongest pattern for authorization-aware session views.

**Columns:** Date, provider, service code, scheduled/completed/billed/cancelled status, units, authorization linkage, staff rate, contract rate.

---

### 1f. Motivity (motivity.net)

**Session Management Model:**
- Clinically-focused — built for BCBAs running ABA programs, not billing staff
- Real-time data collection during sessions
- Separate from PM (pairs with AlohaABA for billing)

**Learner Timeline & Reports:**
- Sessions live in the learner's **Timeline and Reports** section
- Chronological timeline with filterable item types: Session, Session Notes, General Notes, Progress Reports, Transitions, Events, Videos
- **Filter by date** (show everything up to a certain date) and **filter by type** (select one or multiple categories)
- Filter icon in top-right corner

**Pending Notes View:**
- Dedicated **Pending Notes** tab on learner profile and organization dashboard
- **Categories:** Unsigned (author hasn't signed), Awaiting Approval (ready for BCBA review), Revision Requested (returned with feedback)
- **Filter by:** Learner, Member (author), Title, Groups, Dates
- **Multiple simultaneous filters** supported
- **Actions per note:** Sign, Approve, Reject (buttons in right-hand corner)

**Session Note Types:**
- Session notes document billable services (97153 direct ABA, 97155 supervision, etc.)
- Non-billable notes are "general notes"
- Notes can be exported for reporting

**Key UX Pattern:** Motivity separates the clinical timeline (all session activity) from the operational queue (pending notes needing action). The Pending Notes tab is the strongest "review queue" pattern found — it's a filtered, actionable list specifically for supervisors.

**Columns on Timeline:** Date, type icon, title/description, author
**Columns on Pending Notes:** Note title, learner, author/member, date, status category (Unsigned/Awaiting Approval/Revision Requested), action buttons

---

### 1g. Hipp Health (hipp.health)

**Session Management Model:**
- AI-first platform: "Your Practice on Autopilot"
- Multi-modal note capture: write, record, or photograph session notes
- Gen AI-powered workflows for transcription, error correction, and billing handoff

**Session Verification Page:**
- Dedicated **Session Verification** interface
- **Filter by:** date range, service line, clinic location, provider
- Shows exactly what's **verified** and what's **pending**
- Badge counts for visibility

**Cancellation Tracking:**
- Dedicated **"All Cancellations" view** showing every cancellation for the day with badge count

**Session Data:**
- Single-tap trial logging with instant feedback
- Goal charts show full context and hourly rates
- Session notes highlight credentials and signatures
- Live session streaming to observing clinician
- AI-powered compliance agent

**Key UX Pattern:** Hipp's Session Verification page is a purpose-built audit view — it surfaces every session that needs review across the practice, filterable by the dimensions admins care about. The "verified vs pending" binary is simple and actionable.

**Columns (inferred):** Date, provider, service line, location, verification status (verified/pending), note status, credentials, signature status.

---

### 1h. CentralReach (centralreach.com)

**Session Management Model:**
- Enterprise ABA platform (market leader)
- Sessions are appointment → timesheet → session note (three-entity model)
- Grid View in Scheduling module is the primary session list interface

**Grid View (Session List):**
- Table with **dual columns**: appointment data alongside timesheet data (prefixed with `$` icon)
- Example: `Date` column next to `$Date` column, showing both appointment and timesheet values
- **$Mismatch column** lists all discrepancies between appointment and timesheet

**Available Mismatch Filters:**
- **Date:** differences between appointment date and timesheet service date
- **Duration:** differences between appointment length and timesheet length
- **Start Time:** differences between appointment start time and timesheet start time
- **Service Code:** differences between appointment service codes and timesheet service codes
- **Authorization:** mismatch between appointment auth and timesheet auth

**Grid View Columns (documented):**
- Date / $Date
- Client
- Provider
- Service / Auth (service code + linked authorization)
- Duration / $Duration
- Start Time / $Start Time
- Location (Place of Service, filterable)
- Labels (applied workflow labels, clickable)
- $Mismatch (audit column)
- Options (gear icon: preview, edit)
- Visibility icon (strikethrough eye = hidden from client portal)

**Filtering:**
- Date range selector at top
- Principal on appt. filter (scope to your own or remove to see all)
- Left-hand panel with expandable filter sections
- Conversion Mismatches filters
- Per-column filtering via funnel icon on hover

**Session Notes:**
- Notes attached to timesheets (not appointments)
- "Create session note..." dropdown in Session Notes section of timesheet
- Session note templates available
- 2000 character limit for Service Notes field (separate from clinical session note)

**Signatures:**
- Client and Provider signatures on timesheets
- Auditing view for signature status across timesheets

**Key UX Pattern:** CentralReach's dual-column appointment/timesheet grid is unique — it's an audit-first design that shows discrepancies inline. This is an enterprise pattern (too complex for entry-level) but the mismatch concept is valuable for flagging data quality issues.

**Columns:** Date, Client, Provider, Service/Auth, Duration, Start Time, Location/POS, Labels, $Mismatch, Options/Actions, plus all `$` timesheet mirror columns.

---

### 1i. ABA Matrix (bonus — discovered during research)

**Session Status Workflow (most detailed found):**
1. **In Progress** (Yellow) — from creation until therapist submits
2. **In Review** (Green) — therapist signed, awaiting analyst/supervisor review
3. **Rejected** (Red) — QA rejection with admin comments for required edits
4. **Incomplete** (Gray) — submitted without caregiver signature; therapist locked out
5. **Completed** (Blue) — analyst reviewed and signed, ready for billing
6. **Locked** (Pink) — blocked due to agency restrictions; requires staff unlock
7. **Canceled** — will not be billed or counted

**Billing Statuses (parallel track):**
- Not Billed (pending submission)
- Billed (sent to insurance)
- Not Paid (awaiting payment)
- Payroll Generated

**Event Types:** Standard therapy sessions, family trainings, RBT/BCaBA supervisions, assessments/reassessments

**Assessment Workflow:** In Progress -> In Review -> Completed Pending Approval -> Completed (after insurance authorization)

**Key UX Pattern:** ABA Matrix has the most granular status system — 7 session statuses + 4 billing statuses, color-coded with icons per event type. This is the gold standard for status tracking.

---

### 1j. SimplePractice (bonus — multi-discipline reference)

**Appointment Status Report:**
- Dedicated report showing financial status of every appointment
- Filter by: billing status (Paid, Unpaid, Uninvoiced/Unbilled, Overpaid)
- Can include Documentation column showing Progress Note Status per appointment
- Appointment statuses: Show, No Show, Late Canceled, Canceled, Clinician Canceled

**Client Overview:**
- Chronological timeline of all activity (appointments, documentation, notes)
- Two view modes: **Excerpt View** (more detail) and **List View** (compact)
- Shows previous and next appointments

**Key UX Pattern:** The Excerpt/List view toggle and the ability to add a Documentation/Note Status column to the appointment report are both smart patterns.

---

### 1k. Raven Health (bonus — direct competitor)

**Dashboard / Launchpad:**
- Personalized launchpad showing: your sessions, outstanding notes, client details
- **"Notes Outstanding" section** — high-priority, can't-miss feature at top of dashboard
- Staff can access any open session notes at tap of button

**Session Notes:**
- Customizable templates
- Save unfinished notes for later
- AI-powered note generator: transforms real ABA session data into clear, detailed narratives instantly
- Works on any device, even offline

**Scheduling:**
- Customizable one-time or recurring appointments
- Color-coded by appointment status, type, and location
- Multi-staff/multi-client view

**Key UX Pattern:** Raven's "Notes Outstanding" dashboard section makes unsigned/incomplete notes impossible to ignore. It's a persistent nudge, not a buried filter.

---

### 1l. Artemis ABA (bonus — discovered during research)

**Session List Categories:**
- **Active** — currently running sessions
- **My** — sessions assigned to current user
- **Incomplete** — sessions missing required documentation

**Session Documentation Fields:**
- Provider name and credentials
- Supervisor name and credentials
- Diagnosis codes and referring provider
- Service codes (CPT)
- Session times (start and end)
- Programs used during session
- Narrative overview
- Progress-to-date
- Next session date with treatment plans
- Provider signatures and credentials

**Calendar Views:** Month, week, day, and list

**Key UX Pattern:** The three-category filter (Active/My/Incomplete) is a simple, role-aware way to segment the session list.

---

## 2. Comparison Matrix

### Session List Columns Across Platforms

| Column | AlohaABA | CentralReach | Motivity | Hipp | Passage | TherapyLake | ABA Matrix | SimplePractice |
|--------|----------|--------------|----------|------|---------|-------------|------------|----------------|
| **Date** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| **Provider** | Yes | Yes | Yes (author) | Yes | Yes | Yes | Yes | Yes (clinician) |
| **Service/CPT Code** | Yes | Yes | -- | Yes | Yes | Yes | Yes | Yes (type) |
| **Units/Duration** | Yes | Yes | -- | Yes | Yes | Yes | Yes | Yes |
| **Session Status** | Yes | Yes | -- | Yes | -- | -- | Yes (7 statuses) | Yes (5 statuses) |
| **Note Status** | Via integration | Separate | Yes (Pending tab) | Yes (verified/pending) | Implicit | Yes | Embedded in session status | Optional column |
| **Signature Status** | Yes | Yes (audit view) | Yes (Unsigned category) | Yes | Yes (mobile) | Yes (e-sig) | Embedded in statuses | -- |
| **Authorization #** | Yes | Yes (Service/Auth) | -- | -- | Yes | Yes | -- | -- |
| **Place of Service** | Yes | Yes (Location) | -- | Yes (location) | Yes | -- | -- | -- |
| **Billing Status** | Yes (billed) | Yes ($Mismatch) | -- | -- | -- | Yes | Yes (4 statuses) | Yes (paid/unpaid) |
| **Client** | Implicit (on client page) | Yes | Implicit | -- | Implicit | Implicit | Implicit | Implicit |
| **Actions** | View, Edit | Preview, Edit (gear) | Sign, Approve, Reject | Verify | -- | -- | Status transitions | View |

### Session Statuses Across Platforms

| Status | AlohaABA | CentralReach | ABA Matrix | Motivity (Notes) | Hipp | SimplePractice | Our Current |
|--------|----------|--------------|------------|------------------|------|----------------|-------------|
| Scheduled | Yes | Appointment | -- | -- | -- | -- | Yes |
| In Progress | -- | -- | Yes (Yellow) | -- | -- | -- | -- |
| Completed | Yes | Timesheet | Yes (Blue) | -- | Verified | Show | Yes |
| In Review | -- | -- | Yes (Green) | Awaiting Approval | Pending | -- | -- |
| Rejected | -- | -- | Yes (Red) | Revision Requested | -- | -- | -- |
| Incomplete | -- | -- | Yes (Gray) | Unsigned | -- | -- | -- |
| Cancelled | Yes | Cancelled | Yes | -- | -- | Cancelled | Yes |
| No Show | -- | -- | -- | -- | -- | No Show | Yes |
| Flagged | -- | -- | Locked (Pink) | -- | -- | -- | Yes |
| Billed | Yes | -- | Not Billed/Billed | -- | -- | Paid/Unpaid | -- |

---

## 3. Common Patterns (Industry Standard)

### 3a. Universal Columns (table stakes)
Every platform shows these in their session list:
1. **Date** (session/service date)
2. **Provider** (name + credentials)
3. **Service type** (CPT code or description)
4. **Duration/Units** (time-based or unit-based)
5. **Status** (at minimum: scheduled, completed, cancelled)

### 3b. Near-Universal Columns (expected by practitioners)
Most platforms include:
6. **Note status** (draft/signed/missing/approved — shown inline or as a separate column)
7. **Signature status** (who has signed, who hasn't)
8. **Authorization linkage** (which auth the session draws from)

### 3c. Common Filtering Patterns
- **Date range** — every platform
- **Provider** — most platforms
- **Status/category** — filter tabs or dropdown (All | This Week | Flagged | Needs Review)
- **Service type/CPT** — some platforms
- **Note status** — Motivity, Hipp, SimplePractice

### 3d. Session Note Status Display
Three dominant patterns:
1. **Inline badge** — note status shown as a badge in the session row (ABA Matrix, TherapyLake)
2. **Separate Pending Notes tab** — dedicated view for notes needing action (Motivity)
3. **Optional report column** — note status available as an add-on column (SimplePractice)

**Industry consensus:** Note status should be visible at a glance in the session list. BCBAs and admins need to know which sessions have missing/unsigned notes without clicking into each one.

### 3e. Session Actions from List
Standard actions available from the session list:
- **View/Open** — click row or action menu (universal)
- **Edit** — modify session details (most platforms, permission-gated)
- **Sign/Approve/Reject** — note workflow actions (Motivity, ABA Matrix)
- **Cancel** — cancel the session (most platforms, with confirmation)
- **Verify** — mark session as verified (Hipp)

### 3f. Click Behavior
- **Row click navigates to session detail** — universal pattern
- Session detail page typically has tabs or sections for: overview, notes, signatures, billing

### 3g. Session Totals / Summaries
- **AlohaABA:** Monthly breakdown of scheduled/completed/billed per authorization service
- **CentralReach:** Aggregate views in reports, not inline
- **Most platforms:** Total count shown (e.g., "50 sessions total"), some show total hours/units for the filtered period
- **Metric cards above the list** — emerging pattern for key numbers (total sessions, hours this week, flagged count)

### 3h. Pagination
- Server-side pagination is universal for high-volume practices (ABA clients can have 15-40 sessions/week)
- Some platforms offer page size controls (10/25/50)
- Infinite scroll is rare — table pagination is standard

### 3i. Alerts/Warnings on Sessions
- **Missing notes** — surfaced as status badge or filter category (Motivity's "Unsigned", ABA Matrix's "Incomplete")
- **Unsigned sessions** — prominent across platforms (Raven's "Notes Outstanding", Motivity's "Pending Notes")
- **Authorization warnings** — sessions outside auth date range or exceeding units (AlohaABA flags, CentralReach mismatches)
- **Credential warnings** — TherapyLake blocks scheduling for expired credentials
- **Validation flags** — AlohaABA's 4-level system (None/Flag/Warn/Stop)

---

## 4. Differentiators (Competitive Edge Features)

### 4a. Authorization-Centric Session View (AlohaABA)
Sessions grouped by authorization and service code, showing utilization progress. This is the most relevant pattern for Clinivise since we already have strong authorization tracking.

### 4b. Session Verification Page (Hipp Health)
Purpose-built view for admins to verify sessions in bulk — filter by date range, service line, location, provider. Binary verified/pending status with badge counts.

### 4c. Dual Appointment/Timesheet Columns (CentralReach)
Enterprise audit pattern showing appointment data alongside actual timesheet data with mismatch detection. Too complex for entry-level but the mismatch concept (expected vs actual) is valuable.

### 4d. Pending Notes Queue (Motivity)
Separate tab showing all notes needing action, categorized (Unsigned, Awaiting Approval, Revision Requested) with inline Sign/Approve/Reject actions. Best-in-class for supervisor workflow.

### 4e. Notes Outstanding Dashboard (Raven Health)
High-priority section on the launchpad that makes unsigned notes impossible to ignore. Persistent nudge pattern.

### 4f. AI-Generated Narratives (Theralytics, Passage, Raven, Hipp)
"Few clicks" to generate session note narrative from collected data. Reduces RBT documentation time from 10+ minutes to under 2 minutes.

### 4g. Multi-Level Validation (AlohaABA)
Four enforcement levels (None/Flag/Warn/Stop) per validation rule. Gives practice admins control over how strictly rules are enforced.

---

## 5. Gap Analysis: Clinivise Current State

### What We Have (as of Phase 2)
**Sessions Page (`/sessions`):**
- Columns: Date, Client, Provider (with credentials), CPT, Units, Status, POS, Auth #, Actions
- Filter tabs: All | This Week | Flagged
- Metric cards: This Week hours, Sessions 7d, Flagged count, Unbilled (placeholder)
- Server-side pagination with page controls
- Actions: View (row click or dropdown), Cancel (dropdown)
- Search by client name

**Client Overview (Recent Sessions section):**
- Mini table showing last 5 sessions: Date, CPT, Provider, Units, Status
- Link to "see Sessions tab" when more than 5

**Session Statuses:** scheduled, completed, cancelled, no_show, flagged
**Note Statuses:** draft, signed

### What We're Missing vs Industry Standard

| Gap | Priority | Description |
|-----|----------|-------------|
| **Note status in session list** | HIGH | No note status column in the sessions table. BCBAs can't tell which sessions have missing/draft/signed notes at a glance. Every competitor shows this. |
| **Time columns (start/end)** | HIGH | We have start/end time in the data model but don't display them in the list. Most competitors show at least start time. |
| **Note review workflow statuses** | MEDIUM | We only have draft/signed. Industry standard adds: in_review (submitted by RBT, awaiting BCBA), cosigned (BCBA approved), returned (sent back for revision). ABA Matrix has 7 statuses. |
| **Needs Review filter tab** | MEDIUM | No way for BCBAs to see "sessions awaiting my review." Motivity's Pending Notes and Hipp's Session Verification are purpose-built for this. |
| **Missing Notes filter** | MEDIUM | No way to filter sessions with missing or unsigned notes. |
| **Date range filter** | MEDIUM | Only "This Week" preset. Competitors offer custom date range pickers. |
| **Provider filter** | LOW | No provider dropdown filter. Important for admins viewing all sessions. |
| **CPT filter** | LOW | No CPT code filter. Useful for utilization analysis. |
| **Session time display** | LOW | Start/end times not shown (we store actualMinutes but don't show time-of-day). |
| **Billing status** | FUTURE | No billing status column (Phase 5). AlohaABA and ABA Matrix show this inline. |
| **Monthly totals/breakdown** | LOW | No period-based summary (total units/hours for filtered range). AlohaABA shows monthly auth breakdown. |
| **Bulk actions** | FUTURE | No bulk sign/approve/verify. CentralReach and ABA Matrix support this for supervisors. |

### Recommended Priority Order
1. **Add note status column** to session list (inline badge: Missing, Draft, Signed, Co-signed)
2. **Add start/end time columns** to session list
3. **Add "Needs Review" and "Missing Notes" filter tabs** on sessions page
4. **Expand note statuses** to include: draft, signed, in_review, cosigned, returned
5. Add date range picker filter
6. Add provider dropdown filter
7. Add total hours/units summary for current filter period
8. Add CPT code filter

---

## 6. Recommended Session History UX for Clinivise

### Client Detail Page — Sessions Tab
Based on industry patterns, the client-scoped session history should show:

**Columns (in order):**
1. Date (formatted, clickable)
2. Time (start time, compact)
3. CPT Code
4. Provider (last name + credential abbreviation)
5. Units
6. Note Status (badge: Missing/Draft/Signed/Co-signed)
7. Session Status (badge: current statuses)
8. Actions (three-dot menu)

**Filter tabs:** All | This Week | Needs Review | Missing Notes
**Search:** Not needed on client-scoped view (already filtered to one client)
**Summary row or metric cards:** Total sessions, total units, total hours for the period

### Global Sessions Page
Same columns as above, plus:
- Client column (since it's cross-client)
- Auth # column
- POS column
- Provider dropdown filter
- Date range picker
- Client search

---

## Sources

- [Passage Health](https://www.passagehealth.com/) — Clinical features, practice management, blog posts
- [Theralytics](https://www.theralytics.net/) — Features, data collection software, documentation management
- [TherapyPM](https://therapypms.com/) — Features, ABA session notes guide, client portal
- [TherapyLake](https://therapylake.com/) — Blog posts on authorization management, compliance, scheduling
- [AlohaABA](https://alohaaba.com/) — Features, scheduling, practice management, [help center](https://support.alohaaba.com/), [authorization tracking](https://support.alohaaba.com/portal/en/kb/articles/check-client-authorization-usage)
- [Motivity](https://www.motivity.net/) — [Pending Notes](https://help.motivity.net/pending-notes), [Filtering Pending Notes](https://help.motivity.net/filtering-pending-notes), [Timeline Filter](https://help.motivity.net/timeline-filter), [Session Notes](https://help.motivity.net/session-notes), [Accessing Session Notes](https://help.motivity.net/accessing-session-notes)
- [Hipp Health](https://www.hipp.health/) — Session notes, care management, compliance agent, admin features
- [CentralReach](https://help.centralreach.com/) — [View as Grid](https://help.centralreach.com/view-as-grid/), [Session Notes in Timesheets](https://help.centralreach.com/session-notes-in-timesheets/), [Scheduling Filters](https://help.centralreach.com/the-scheduling-filters-panel/)
- [ABA Matrix](https://docs.abamatrix.com/article/434-symbology-in-aba-matrix) — Session status symbology and workflow
- [Raven Health](https://ravenhealth.com/) — Dashboard, data collection, AI capabilities
- [Artemis ABA](https://www.artemisaba.com/) — Session notes, scheduling, practice management
- [SimplePractice](https://support.simplepractice.com/) — Appointment status report, appointment statuses and billing
