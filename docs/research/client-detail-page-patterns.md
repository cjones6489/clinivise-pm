# Client Detail Page Patterns — ABA & EHR Competitive Research

> Comprehensive analysis of how ABA practice management and EHR platforms design their client/patient detail pages.
> Research date: 2026-03-21

---

## Table of Contents

1. [Platform-by-Platform Analysis](#1-platform-by-platform-analysis)
2. [Comparison Table: Tabs & Sections per Platform](#2-comparison-table)
3. [Must-Have Sections (Universal)](#3-must-have-sections)
4. [Differentiators (Competitive Edge)](#4-differentiators)
5. [Client Header Banner Recommendations](#5-client-header-banner-recommendations)
6. [Overview Tab Content Recommendations](#6-overview-tab-content-recommendations)
7. [Clinivise Layout Recommendations](#7-clinivise-layout-recommendations)
8. [Sources](#8-sources)

---

## 1. Platform-by-Platform Analysis

### 1a. CentralReach (ABA-specific, market leader)

**Header / Banner:**
- Contact details sidebar on the left side of the Dashboard displays a summary of the contact's basic profile information
- Contact labels, basic information, and meta data visible in the sidebar
- Expandable/collapsible sidebar toggled by clicking the contact name

**Tabs / Sections:**
- **Profile**: Account-specific info, office locations, user credentials, merchant settings, billing information
- **Notes & Forms**: Electronic clinical documents for collecting and maintaining client clinical information; accessible from Profile tab > Notes & Forms
- **Authorizations**: Accessible via the Billing module; shows total authorized hours, hours with scheduled appointment, hours worked, pending hours, remaining hours, and utilization rate
- **Files/Documents**: All uploaded documents — session notes & forms, medical reports, insurance authorizations, videos, photos
- **Team**: Directory of contacts connected to the client (providers, staff)
- **Billing**: Invoices (insurance and patient responsibility), provider timesheets; clients can preview/download invoices, pay invoices, save credit card info, view and e-sign timesheets
- **Schedule**: Scheduled appointments managed by the organization
- **Insurance**: Overview tab, Insurance tab, Subscriber tab, Patient tab for managing insurance information

**Authorization Display:**
- Authorizations section in the Billing module shows: total authorized hours, scheduled hours, worked hours, pending hours, remaining hours, utilization rate
- Proactive authorization management with alerts for approaching limits

**Quick Actions:**
- View/edit profile, access notes & forms, manage billing, view schedule
- Dashboard has 4 customizable widgets: call activity, files, messages, appointments
- Widgets can be stretched, shrunk, dragged, and rearranged

**Guardian / Contacts:**
- Team menu includes directory of all contacts connected to the client
- Auto-share client information with employees via connections feature

**Key Insight:** CentralReach buries authorization utilization in the Billing module rather than surfacing it on the client page. This is a documented pain point.

---

### 1b. AlohaABA (ABA-specific, mid-market)

**Header / Banner:**
- Client profile includes key details such as demographics, authorizations, and service information

**Tabs / Sections:**
- **Demographics**: Client intake data including demographics, medical history, treatment plans
- **Contacts**: Guardian/caregiver information
- **Insurance**: Insurance data stored in HIPAA-compliant location
- **Sessions**: Appointment tracking tied to authorization utilization
- **Authorization Management**: Real-time utilization visible in client profile; clicking shows scheduled, completed, billed, and cancelled appointments per service

**Authorization Display:**
- Authorization utilization is visible directly in the client profile (not buried in billing)
- Clicking utilization opens detail view showing: scheduled, completed, billed, and cancelled appointments for each service in the authorization
- Authorization utilization reports available within the schedule view
- Alerts when scheduling beyond authorization limits
- Intelligent pacing metrics and flags when approaching limits
- Tracks authorization balances across clients and codes

**Quick Actions:**
- Scheduling directly from client profile
- Authorization alerts integrated into scheduling workflow

**Guardian / Contacts:**
- Share documents with parents/caregivers
- Collect signatures from caregivers at session completion
- Track communications between staff and caregivers

**Key Insight:** AlohaABA's strength is authorization-scheduling integration. Utilization data surfaces contextually where schedulers need it.

---

### 1c. Theralytics (ABA-specific, startup-friendly)

**Header / Banner:**
- Learner profile with basic identification and clinical details

**Tabs / Sections:**
- **Profile/Demographics**: Basic client information
- **Scheduling**: Drag-and-drop appointments, drive-time/mileage tracking
- **Data Collection**: Multiple collection methods, real-time data entry
- **Session Notes**: AI-powered narrative summaries from session data
- **Progress Tracking**: Interactive graphs and reports, skill monitoring (social skills, communication, adaptive behaviors, maladaptive behaviors)
- **Billing**: Claims, payments, revenue management integrated with scheduling and documentation

**Authorization Display:**
- Authorization tracking integrated with scheduling and billing workflow

**Quick Actions:**
- Mobile app: collect data, view client details, take session notes, capture signatures with GPS coordinates, complete sessions (works offline)

**Key Insight:** Theralytics differentiates with mobile-first field use and AI-generated session note narratives.

---

### 1d. Motivity (ABA-specific, clinical focus)

**Header / Banner:**
- Learner profile with identifying information

**Tabs / Sections (Learner Dashboard):**
- **Collect Data**: Real-time data collection during sessions
- **Timeline and Reports**: Session history and progress data visualization
- **Programs and Progress**: Clinical programming, targets, mastery criteria
- **Team**: Care team members assigned to the learner
- **Calendar**: Appointments/sessions (synced from integrated platforms like AlohaABA)
- **Pending Notes**: Notes awaiting signatures or approval, with statuses (missing signatures, rejected, awaiting approval)

**Profile Information:**
- Editable learner profile with fields for clinical details
- Section for links to behavior plans or other relevant external files
- Profile information can be auto-inserted into note templates

**Key Insight:** Motivity is clinically-focused — built for BCBAs running ABA programs, not for billing staff. The "Programs and Progress" tab is a differentiator that PM-focused tools lack.

---

### 1e. SimplePractice (Multi-discipline therapy, widely used)

**Header / Banner:**
- Client name displayed prominently
- Client profile opens to the Overview tab by default

**Tabs / Sections:**
- **Overview**: Chronological timeline of all client activity — appointments, documentation, and notes. Two view options: Excerpt View (2-row icon, more detail) and List View (4-row icon, compact). Right navigation panel with collapsible sections.
- **Billing**: Complete billing summary — current balance, unallocated payments, unpaid/uninvoiced amounts. Invoices, insurance claims, payments. Actions: create invoice, statement, super bill, insurance claim.
- **Files**: Intake forms, questionnaires, consent documents, uploaded files. Shows when forms were viewed or signed by client.
- **Client Info** (edit mode): Demographics and contact information in sub-tabs:
  - Name section (Legal first/last required)
  - Phone with type/permission dropdowns
  - Primary address (auto-populates billing documents)
  - Billing and Insurance sub-tab (insurance details)
  - Contacts sub-tab (emergency contacts, guardians, beneficiaries)

**Insurance Display:**
- Insurance information entered via Client Info > Billing and Insurance tab
- Billing profiles for insurance managed separately
- Insurance verification with automated eligibility checks

**Guardian / Contacts:**
- Contacts tab within client edit: add emergency contact, third-party beneficiary, or guardian
- Each contact listed with relationship type

**Key Insight:** SimplePractice's Overview tab as a chronological timeline is intuitive but can get noisy with high-volume ABA clients (15-40 sessions/week). The excerpt/list view toggle is a smart UX pattern.

---

### 1f. Jane App (Multi-discipline, health & wellness)

**Header / Banner:**
- Patient Profile Dashboard: row of metrics near the top showing appointment history, billing status, and account balance
- Clickable metrics that navigate to relevant tabs
- Pronouns field in profile

**Tabs / Sections:**
- **Dashboard/Summary**: Metrics row — total scheduled appointments (Booked, Arrived, Checked In, No Show), claims outstanding, account balance
- **Appointments**: Full appointment history filterable by date range, state, location, staff member, billing status
- **Billing**: Insurance Policies area, payment tracking, claims outstanding
- **Chart**: Clinical notes, treatment plans, exercise prescriptions, lab results, files. Chart entries can be shared with patients. Pinned sections for critical notes.
- **Relationships/Contacts**: Family profiles with relationship management. Link family members across profiles. Create new contacts or search existing.

**Patient Profile Dashboard Metrics:**
- Total scheduled appointments (clickable, navigates to Appointments tab)
- No Show count (clickable, navigates to filtered Appointments)
- Claims Outstanding (clickable, navigates to Billing > Insurance Policies)
- Patient account balance

**Key Insight:** Jane's clickable metric dashboard is an excellent pattern — each metric is a shortcut to the relevant tab/filter. The family profiles feature is well-suited for ABA where multiple siblings may be clients.

---

### 1g. Healthie (Multi-discipline EHR)

**Header / Banner:**
- Quick Profile view showing summary stats and quick navigation

**Tabs / Sections:**
- **Actions Tab**: Designed for quick viewing and updating of key details in one place. Includes:
  - Insurance Billing Information (claims, benefits, eligibility)
  - Medications and Prescriptions
  - Program Enrollments
  - Documents, Forms, and Notes
  - Care Plans and Goals (create/track care plans, set measurable goals)
  - Metrics and Journals (health metrics, client-submitted entries)
- **Charting**: EHR notes with customized templates, smart fields connecting intake forms to charting, pre-fill from previous notes and metrics
- **Billing**: Payments, outstanding balances, receipts, recurring charges, cancellation policies. Everything recorded in billing tab per client.
- **Documents/Forms/Notes**: Uploaded files, completed forms, charting notes

**Interface Features:**
- Three-dot menu on each section for editing, deleting, managing
- Direct "Add" button in sections for commonly used actions (based on user feedback)
- Quick Profile feature for at-a-glance summary

**Key Insight:** Healthie's Actions Tab is the strongest "overview" pattern found — it consolidates quick views of all major data categories with inline edit/add capabilities. The three-dot menu + "Add" button pattern reduces clicks.

---

### 1h. RethinkBH (ABA-specific, enterprise)

**Tabs / Sections (from feature descriptions):**
- Full EHR with document management
- Clinical data auto-embedded into session notes
- Customizable templates based on funder requirements
- Progress notes and care plan management
- Practice management integration

**Key Insight:** Rethink differentiates by auto-embedding clinical data into session notes and customizing templates per funder — a pattern relevant for Clinivise's multi-payer world.

---

## 2. Comparison Table

### Tabs/Sections per Platform

| Section | CentralReach | AlohaABA | Theralytics | Motivity | SimplePractice | Jane App | Healthie |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Overview/Dashboard** | Widgets | -- | -- | Dashboard | Timeline | Metrics Row | Actions Tab |
| **Demographics/Profile** | Sidebar | Tab | Tab | Profile | Client Info | Profile | Quick Profile |
| **Contacts/Guardians** | Team | Tab | -- | Team | Contacts tab | Relationships | -- |
| **Insurance** | Multi-tab | Tab | -- | -- | Billing & Ins | Billing > Ins | Actions > Ins |
| **Authorizations** | Billing module | Tab (inline) | Integrated | -- | -- | -- | -- |
| **Sessions/Appointments** | Schedule | Sessions | Scheduling | Calendar | Overview timeline | Appointments | -- |
| **Clinical Notes/Charts** | Notes & Forms | -- | Session Notes | Timeline & Reports | Files | Chart | Charting |
| **Data Collection/Progress** | Learning tree | -- | Data Collection | Programs & Progress | -- | -- | Metrics |
| **Billing** | Billing tab | -- | Billing | -- | Billing tab | Billing tab | Billing tab |
| **Documents/Files** | Files | -- | -- | -- | Files tab | Chart (shared) | Documents |
| **Care Plan/Goals** | -- | -- | Treatment plan | Programs | -- | -- | Care Plans |
| **Activity/Timeline** | Call Activity | -- | -- | Timeline | Overview | -- | Journals |

### Header/Banner Information per Platform

| Element | CentralReach | AlohaABA | SimplePractice | Jane App | Healthie |
|---------|:---:|:---:|:---:|:---:|:---:|
| Client name | Yes | Yes | Yes | Yes | Yes |
| DOB / Age | Sidebar | Profile | Client Info | Profile | Profile |
| Status indicator | Labels | -- | -- | -- | -- |
| Diagnosis | Metadata | -- | -- | -- | -- |
| Photo/Avatar | -- | -- | -- | -- | -- |
| Metrics row | Widgets | -- | -- | Clickable metrics | Quick Profile |
| Guardian info | Team tab | -- | Contacts tab | Relationships | -- |
| Insurance status | Separate tab | -- | -- | Claims metric | Actions tab |

---

## 3. Must-Have Sections (Universal)

These sections appear across every platform studied. They are table stakes for a client detail page:

### 3a. Demographics / Profile
- Client name (legal first, legal last, preferred name)
- Date of birth + calculated age
- Gender
- Phone, email
- Address
- Status (active/inactive/on hold/discharged)

### 3b. Contacts / Guardians
- Critical for ABA (clients are children)
- Guardian name, relationship, phone, email
- Emergency contact
- Legal guardian flag (for consent/signatures)
- Multiple contacts supported

### 3c. Insurance Information
- Primary insurance: payer, member ID, group number, plan type
- Subscriber info (name, DOB, relationship — always needed for ABA dependents)
- Policy effective/termination dates
- Verification status with timestamp
- Secondary insurance support

### 3d. Clinical Notes / Documentation
- Session notes or chart entries
- Treatment plan reference
- Assessment records

### 3e. Appointments / Sessions
- Session history (date, provider, duration, CPT code, status)
- Upcoming sessions
- Filterable by date range

### 3f. Billing
- Current balance
- Invoice/claim history
- Payment history

---

## 4. Differentiators (Competitive Edge)

These are sections/features that separate the best platforms from the rest:

### 4a. Authorization Utilization on Client Page (ABA differentiator)
- **Who does it well:** AlohaABA (inline on client profile), CentralReach (Billing module — buried)
- **The gap:** Most platforms separate authorization data from the client page. BCBAs and schedulers need it front-and-center.
- **Clinivise opportunity:** Show utilization bars with per-CPT breakdown directly on the client Overview tab. This is the #1 "hero moment" identified in the product spec.

### 4b. Clickable Metrics Dashboard (Jane App pattern)
- Metrics row at the top that doubles as navigation shortcuts
- Each metric click jumps to the relevant tab/filter
- Clinivise should adopt this: metrics like "Auth Days Left," "Sessions This Month," "Used Units" each link to their detailed view.

### 4c. Actions Tab / Quick View (Healthie pattern)
- Single tab consolidating quick views of all major data categories
- Inline edit/add buttons per section
- Three-dot menu for secondary actions
- Reduces tab-switching for common workflows

### 4d. AI-Generated Session Summaries (Theralytics pattern)
- Generative AI analyzes collected session data and drafts narrative summaries
- Therapists review and finalize rather than writing from scratch
- Reduces documentation time to a few clicks

### 4e. Family Profiles / Linked Clients (Jane App pattern)
- Link sibling client records together
- Share guardian contacts across family
- View family billing summary
- Critical for ABA (many families have 2-3 children in services)

### 4f. View Density Toggle (SimplePractice pattern)
- Excerpt View vs. List View toggle on timeline/overview
- Compact view for power users, expanded view for detailed review
- Especially useful for high-volume ABA clients with many sessions

### 4g. Mobile Field Use (Theralytics / CentralReach Mobile)
- Data collection, session notes, signature capture on mobile
- GPS-stamped signatures
- Offline capability with sync
- Voice-to-text for notes

### 4h. Programs and Progress Tab (Motivity differentiator)
- Clinical programming view: targets, mastery criteria, skill tracking
- Not standard in PM tools — Motivity is clinically-focused
- Consider for Phase 2+: visualizing progress toward treatment goals

---

## 5. Client Header Banner Recommendations

Based on EHR best practices and ABA-specific research, the client header banner should be a persistent (sticky) element containing the most critical identification and context information.

### 5a. What EHR Best Practices Say

- **Patient banner bar** should always be visible when scrolling (sticky header)
- Must include: name, DOB, age, sex, MRN/ID at minimum
- Critical alerts (allergies, code status) displayed with color-coded indicators
- Expandable/collapsible for additional encounter details
- Preferred name should appear first if available, legal name secondary
- Use red for high-risk alerts, amber for warnings, green for verified/active

### 5b. Recommended Header for Clinivise

```
+-----------------------------------------------------------------------+
| < Back to Clients                                    [Log Session] v  |
|                                                                       |
| Ethan Miller                                    [Active] [Auth: 42d] |
| DOB: 03/15/2019 (7y) · M · F84.0 Autism Spectrum Disorder           |
| Guardian: Sarah Miller · (555) 123-4567 · sarah@email.com            |
| BCBA: Dr. Amanda Chen · Primary Ins: BCBS (Verified)                |
+-----------------------------------------------------------------------+
| [Overview] [Insurance] [Authorizations] [Sessions] [Documents] [Edit]|
+-----------------------------------------------------------------------+
```

### 5c. Header Data Elements (Priority Order)

| Element | Rationale | Source |
|---------|-----------|--------|
| **Client name** (large, bold) | Primary identifier; every platform shows this | Universal |
| **DOB + Age** | Required for clinical context; age calculated automatically | EHR best practice |
| **Gender** | Clinical relevance | EHR best practice |
| **Diagnosis code + description** | ABA-specific: BCBAs need this at a glance | ABA workflow research |
| **Status badge** | Active/Inactive/On Hold — color coded | Universal |
| **Auth days remaining badge** | ABA-critical: how many days until current auth expires | CentralReach gap, product spec hero moment |
| **Guardian name + contact** | ABA clients are children; guardian is primary contact | ABA intake research |
| **Assigned BCBA** | Clinical accountability | ABA workflow |
| **Primary insurance + verification** | Billing context without switching tabs | Healthie, CentralReach |

### 5d. What NOT to Put in the Header

- Full address (too much space, not needed at a glance)
- Insurance member ID / group number (belongs on Insurance tab)
- Session history (belongs in Sessions tab)
- Detailed authorization data (belongs in metric cards and Authorizations tab)
- Notes or narrative text

---

## 6. Overview Tab Content Recommendations

The Overview tab is the default landing view. It should give a comprehensive snapshot without requiring tab switches for the most common questions: "How many units are left?", "Is insurance active?", "When is the next session?", "Who is on the care team?"

### 6a. Metric Cards Row (Top)

Four clickable metric cards inspired by the Jane App pattern. Each card click navigates to the relevant tab.

| Card | Content | Visual | Click Target |
|------|---------|--------|--------------|
| **Total Approved** | Sum of `approved_units` across active auth services, displayed as hours. Sub-text: breakdown by CPT ("97153: 100 · 97155: 20") | Large number, `tabular-nums`, `text-2xl font-semibold` | Authorizations tab |
| **Used / Utilized** | Sum of `used_units`, displayed as hours. Sub-text: "61% utilized" with color-coded threshold (emerald <80%, amber 80-95%, red >95%) | Large number with color indicator | Authorizations tab |
| **Weekly Avg** | Average session hours per week over the auth period | Number with trend arrow (up/down vs prior period) | Sessions tab |
| **Days Left** | `end_date - today` from active authorization. Sub-text: "Auth expires {date}". Red if <14d, amber if <30d | Number with urgency color | Authorizations tab |

### 6b. Authorized Services Card

Full-width card below metrics. Per-CPT-code utilization display.

```
Authorized Services                                    [View All →]
+-------------------------------------------------------------------+
| 97153 · Adaptive Behavior Treatment            62 hrs remaining   |
| [████████████░░░░░░░░] 38%                     100 approved       |
|                                                                   |
| 97155 · Adaptive Behavior Treatment w/ Mod      4 hrs remaining   |
| [████████████████████░] 80%                      20 approved      |
|                                                                   |
| 97156 · Family Adaptive Behavior Treatment       8 hrs remaining  |
| [████████░░░░░░░░░░░░] 20%                       10 approved      |
+-------------------------------------------------------------------+
```

**Design details:**
- Progress bar color: emerald (<80%), amber (80-95%), red (>95%)
- CPT code in monospace with primary color
- "hrs remaining" aligned right, `tabular-nums`
- If no active authorization: show empty state with "Add Authorization" CTA
- "View All" link navigates to Authorizations tab

### 6c. Two-Column Grid (Below Services)

**Left Column: Insurance Snapshot Card**

```
Insurance                                              [Manage →]
+----------------------------------+
| BCBS of Texas            (Active)|
| Member ID: XYZ123456             |
| Group: 98765                     |
| Effective: 01/01/2025            |
| Verified: 03/15/2025 ✓          |
+----------------------------------+
```

- Shows primary insurance only (link to Insurance tab for secondary)
- Status dot: green (active/verified), amber (pending), red (expired)
- "Manage" link goes to Insurance tab
- If no insurance: amber warning with "Add Insurance" CTA

**Right Column: Care Team Card**

```
Care Team                                             [Manage →]
+----------------------------------+
| [AC] Dr. Amanda Chen     BCBA   |
| [JD] Jessica Davis       RBT    |
| [MR] Michael Rodriguez   RBT    |
+----------------------------------+
```

- Avatar initials with colored background
- Provider name + credential type
- Assigned BCBA always listed first
- "Manage" link goes to Edit tab (for now)
- Phase 2: Add/remove team members directly

### 6d. Recent Sessions Card (Below Grid)

```
Recent Sessions                                     [View All →]
+-------------------------------------------------------------------+
| Mar 20  3:00-4:30p  Jessica Davis   97153   6u   Completed       |
| Mar 19  3:00-4:30p  Jessica Davis   97153   6u   Completed       |
| Mar 18  9:00-10:00a Dr. Chen        97155   4u   Completed       |
| Mar 17  3:00-4:30p  Jessica Davis   97153   6u   Completed       |
| Mar 15  3:00-4:30p  Jessica Davis   97153   6u   No Show         |
+-------------------------------------------------------------------+
```

- Last 5 sessions, most recent first
- Compact table: date, time range, provider, CPT code (monospace), units, status badge
- "View All" navigates to Sessions tab
- If no sessions: empty state with "Log Session" CTA

### 6e. Alerts/Warnings Section (Conditional)

Only appears when there are actionable items. Shown between metrics and services.

```
⚠ Authorization expires in 12 days (Apr 02, 2026)     [Renew →]
⚠ Secondary insurance not verified (last check 94d ago) [Verify →]
```

- Amber background for warnings, red for critical
- Each alert has a direct action link
- Alert types:
  - Auth expiring (30d, 14d, 7d thresholds)
  - Auth over-utilized (>95%)
  - Auth under-utilized (<50% used with >50% of period elapsed)
  - Insurance unverified or expired
  - Missing guardian contact
  - Incomplete intake (missing required fields)

---

## 7. Clinivise Layout Recommendations

### 7a. Full Page Architecture

```
+===================================================================+
| STICKY HEADER                                                      |
| < Back to Clients                            [Log Session ▾]      |
|                                                                    |
| Ethan Miller                            [Active] [Auth: 42d]     |
| DOB: 03/15/2019 (7y) · M · F84.0 Autism Spectrum Disorder        |
| Guardian: Sarah Miller · (555) 123-4567                            |
| BCBA: Dr. Amanda Chen · Ins: BCBS (Verified ✓)                   |
+===================================================================+
| [Overview] [Insurance] [Authorizations] [Sessions] [Docs] [Edit] |
+===================================================================+
| TAB CONTENT (scrollable)                                           |
|                                                                    |
| Overview Tab Layout:                                               |
|                                                                    |
| [Alerts/Warnings - conditional]                                    |
|                                                                    |
| [Approved] [Used/Util%] [Weekly Avg] [Days Left]   ← metric cards |
|                                                                    |
| [Authorized Services - per CPT utilization bars]    ← full width  |
|                                                                    |
| [Insurance Snapshot]  [Care Team]                   ← 2 columns   |
|                                                                    |
| [Recent Sessions - last 5]                          ← full width  |
+===================================================================+
```

### 7b. Tab Structure

| Tab | Content | Role Priority |
|-----|---------|---------------|
| **Overview** (default) | Metric cards, alerts, auth utilization, insurance snapshot, care team, recent sessions | All roles |
| **Insurance** | Full insurance policy cards with verification, subscriber details, card images | Billing staff, Admins |
| **Authorizations** | All auths (active expanded, expired collapsed), per-service detail, upload auth letter | BCBAs, Billing staff |
| **Sessions** | Full session history table, filterable, with "Log Session" action | BCBAs, RBTs |
| **Documents** (Phase 2) | Uploaded files, auth letters, assessments, referrals | All roles |
| **Edit** | Full client edit form (demographics, clinical, address, notes) | BCBAs, Admins |

### 7c. Role-Based Tab Emphasis

| Role | Primary Tabs | Secondary Tabs |
|------|-------------|----------------|
| BCBA | Overview, Authorizations, Sessions | Insurance, Edit |
| RBT | Overview (auth status check), Sessions | -- |
| Billing Staff | Insurance, Authorizations, Overview | Sessions |
| Admin | All tabs equally | -- |

Tabs should remain visible to all authenticated roles but could show a subtle visual indicator for "your most relevant tabs" based on role.

### 7d. Key UX Principles for the Client Detail Page

1. **Sticky header** — Client identity always visible while scrolling tab content
2. **Overview-first** — Default to the summary tab; never make users hunt for basic info
3. **Clickable metrics** — Every metric card is a shortcut to its detail tab (Jane App pattern)
4. **Progressive disclosure** — Show summary counts with "View All" expand links (Stripe pattern)
5. **Alerts surface proactively** — Expiring auth, missing data, over-utilization shown as inline banners, not buried in reports
6. **Minimal tab switching** — The Overview tab answers the top 5 questions without changing tabs
7. **Action buttons contextual** — "Log Session" always accessible from header; tab-specific actions (Add Auth, Edit Insurance) appear within their tabs
8. **Auth utilization is the hero** — Color-coded progress bars are the visual centerpiece. This is Clinivise's differentiation from CentralReach (which buries it in billing).

### 7e. What Makes Clinivise's Client Detail Better Than Competitors

| Competitor Gap | Clinivise Advantage |
|---------------|---------------------|
| CentralReach buries auth utilization in Billing module | Auth utilization is the hero of the Overview tab with per-CPT progress bars |
| CentralReach is not mobile-friendly | Responsive design with 44px+ touch targets, tablet-optimized layout |
| AlohaABA has auth data but no unified Overview | Single Overview tab consolidates metrics, insurance, care team, sessions |
| SimplePractice uses chronological timeline (noisy for high-volume ABA) | Structured cards and sections with progressive disclosure |
| No ABA tool surfaces alerts proactively on the client page | Inline alert banners for expiring auths, missing insurance, under-utilization |
| Most tools require 3-4 clicks to check auth remaining | Metric cards + utilization bars visible immediately on page load |
| Guardian info often buried in contacts/edit screens | Guardian name + phone in the sticky header (ABA clients are children) |
| No competitor uses clickable metrics as navigation | Metric cards double as tab shortcuts (Jane App pattern adapted for ABA) |

---

## 8. Sources

### ABA Practice Management Platforms
- [CentralReach Help: Contact Details Sidebar](https://help.centralreach.com/contact-details-sidebar/)
- [CentralReach Help: Manage Client Profile](https://help.centralreach.com/manage-my-client-profile/)
- [CentralReach Help: Navigating Client Portal](https://help.centralreach.com/navigating-the-client-portal/)
- [CentralReach Help: Authorizations in Billing](https://help.centralreach.com/how-to-use-the-authorizations-section-of-the-billing-module/)
- [CentralReach Help: Notes & Forms](https://help.centralreach.com/notes-forms/)
- [CentralReach Help: Client Insurance Verification](https://help.centralreach.com/client-insurance-verification/)
- [CentralReach: Proactive Authorization Management](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [AlohaABA: Authorization Management](https://alohaaba.com/features/authorization-management)
- [AlohaABA: Practice Management](https://alohaaba.com/features/practice-management)
- [Theralytics: ABA Practice Management](https://www.theralytics.net/)
- [Theralytics: Optimizing ABA Practice Management](https://www.theralytics.net/blogs/how-theralytics-optimizes-aba-practice-management)
- [Motivity Help: Profiles](https://help.motivity.net/profiles-within-motivity)
- [Motivity Help: Edit Learner Profile](https://help.motivity.net/edit-a-learner-profile)
- [Motivity Help: Session Notes](https://help.motivity.net/session-notes)
- [RethinkBH: Practice Management](https://www.rethinkbehavioralhealth.com/our-solutions/practice-management/)

### General EHR / Therapy Platforms
- [SimplePractice: Navigating Client Overview](https://support.simplepractice.com/hc/en-us/articles/5357432054541-Navigating-the-client-Overview-page)
- [SimplePractice: Editing Client Info](https://support.simplepractice.com/hc/en-us/articles/360049778071-Editing-a-client-s-information)
- [SimplePractice: Client Billing Overview](https://support.simplepractice.com/hc/en-us/articles/360056811751-Using-the-client-Billing-Overview-page)
- [SimplePractice: Setting Up Insurance Billing](https://support.simplepractice.com/hc/en-us/articles/360015456932-Setting-up-insurance-billing-for-your-clients)
- [Jane App: Patient Profile Dashboard](https://jane.app/guide/patient-profile-dashboard)
- [Jane App: Patients Tab](https://jane.app/guide/the-patients-tab-a-snapshot-of-your-full-patient-list)
- [Jane App: Family Profiles](https://jane.app/guide/family-profiles-managing-family-members-from-the-client-profile)
- [Jane App: Patient Profiles Category](https://jane.app/guide/category/patient-profiles)
- [Healthie: Client Profile Overview](https://help.gethealthie.com/article/1249-client-profile-overview)
- [Healthie: Quick Profile & Quick Notes](https://help.gethealthie.com/article/49-quick-notes)
- [Healthie: Getting Started with Charting](https://help.gethealthie.com/article/173-overview-charting-within-healthie)
- [Healthie: Care Plans](https://help.gethealthie.com/article/371-care-plans)
- [Healthie: Collecting Insurance Information](https://help.gethealthie.com/article/288-collecting-insurance-information)

### EHR UX Design Principles
- [Fuselab: EHR Interface Design Principles](https://fuselabcreative.com/ehr-interface-design-principles-ux-and-usability-challenges/)
- [Purrweb: EMR/EHR Interface Design](https://www.purrweb.com/blog/emr-ehr-interface-design/)
- [Zazz: 15 EHR/EMR Interface Principles](https://www.zazz.io/blog/ehr-emr-interface-design-principles/)
- [Stfalcon: EMR/EHR Interface Key Principles](https://stfalcon.com/en/blog/post/ehr-user-interface-design-principles)
- [Phenomenon Studio: EHR System Design](https://phenomenonstudio.com/ehr-system-design/)
- [Eleken: Healthcare UI Design 2026](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Binariks: EMR Interface Design Techniques](https://binariks.com/blog/emr-interface-design-techniques/)
- [KoruUX: 50 Healthcare UX/UI Design Trends](https://www.koruux.com/50-examples-of-healthcare-UI/)
- [PowerChart: Patient Banner Bar](https://www.augusta.edu/mcg/ultrasound-education/pclclinic/patientbannerbar.pdf)
- [emedpractice: Patient 360 View](https://emedpractice.com/complete-health-profile-patient-360-view/)

### ABA Intake & Clinical Workflow
- [ABA Engine: Guide to ABA Intake Forms](https://abaengine.com/blog/a-guide-to-using-aba-intake-forms/)
- [Your Missing Piece: ABA Intake Paperwork](https://yourmissingpiece.com/blog/what-should-be-included-in-the-aba-intake-paperwork/)
- [UW Autism Center: ABA Intake Packet](https://depts.washington.edu/uwautism/wp-content/uploads/2018/04/1b.-IntakeForm_ABA1.pdf)
- [I Love ABA: Conducting Client Intakes](https://www.iloveaba.com/2014/01/conducting-client-intakes.html)
- [Artemis ABA: Session Notes](https://www.artemisaba.com/blog/aba-session-notes)
- [Behavioral Innovations: Day in the Life of a BCBA](https://behavioral-innovations.com/blog/day-in-the-life-bcba/)
- [ABA Matrix: Authorization Management](https://www.abamatrix.com/aba-authorization-management/)
- [ABA Matrix: Practice Management Tasks](https://www.abamatrix.com/aba-practice-management-software-tasks/)
- [Passage Health: Best ABA Practice Management Software](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [Alpaca Health: ABA Practice Management Guide](https://www.alpacahealth.io/provider-resources/aba-practice-management-guide)
