# Session & Authorization Page Patterns: Competitive Research

> Research date: 2026-03-21
> Scope: Session logging forms, authorization tracking pages, and form design patterns across ABA practice management platforms. Competitive analysis, field inventories, UX patterns, and recommendations for Clinivise.

---

## Table of Contents

1. [Session Logging: Platform Comparison](#1-session-logging-platform-comparison)
2. [Authorization Tracking: Platform Comparison](#2-authorization-tracking-platform-comparison)
3. [Form Design Patterns for Healthcare](#3-form-design-patterns-for-healthcare)
4. [Specific Recommendations for Clinivise](#4-specific-recommendations-for-clinivise)

---

## 1. Session Logging: Platform Comparison

### 1A. Required Session Note Fields (Industry Standard)

Every ABA session note — regardless of platform — must capture these fields for insurance compliance and clinical integrity:

**Section 1: Session Identification (auto-populated)**

- Client name / ID
- Date of service
- Session start time / end time
- Duration (minutes)
- Billable units (calculated)
- Place of service (Home / Clinic / School / Community / Telehealth)
- Service location address (for home/community)

**Section 2: Provider & Credentials**

- Rendering provider (RBT / BCaBA / BCBA / BCBA-D) — full name + credential
- Supervising BCBA (if rendering provider is RBT)
- Others present (parent, caregiver, sibling — name + relationship)

**Section 3: Service & Billing**

- CPT code (97153, 97155, 97156, etc.)
- Modifier(s) (credential-based: HN for bachelor's, HO for master's, etc.)
- Authorization number (linked to active auth)
- Units billed

**Section 4: Clinical Content**

- Goals/programs targeted (pulled from treatment plan)
- Interventions used (DTT, NET, prompting, reinforcement, etc.)
- Prompt levels used per goal (Full Physical, Partial Physical, Model, Verbal, Gestural, Independent)
- Data: trial scores, frequency counts, duration measurements, percentage correct
- Behavior incidents (antecedent, behavior, consequence — ABC data)
- Session narrative / summary (what happened, what progress was made)

**Section 5: Assessment & Plan**

- Progress assessment per goal (met / partially met / not met / regression)
- Recommendations / next steps
- Caregiver/teacher communication notes (if applicable)
- Plan changes or adjustments

**Section 6: Signatures & Compliance**

- Provider signature (digital)
- Client/caregiver signature (some payers require)
- Signature date
- Note completion timestamp (must be within 24-72 hours of service)

---

### 1B. Platform-by-Platform Analysis

#### CentralReach

**Session Note Workflow:**

- Session notes are created from timesheets — the "conversion" flow. User clicks a lightning bolt icon on a calendar appointment to convert it to a timesheet, which triggers the session note form.
- Notes are linked to service codes. A specific note template is triggered based on the CPT code associated with the appointment.
- Dynamic fields auto-populate: client name, contact info, appointment date/time, service code, and Learning Tree clinical data.
- Placeholders in templates let users add goal progress reports, session summaries, and client goals by clicking on them.
- Both provider and client can sign digitally. Once signed, the note is locked and cannot be edited.

**Form Layout:**

- Template-based, customizable per practice. The base layout uses a structured form with sections that expand/collapse.
- Rich text sections for narrative alongside structured data fields.
- Goals and data can be dynamically pulled from the Learning Tree (CentralReach's data collection system).

**Pre-fill & Automation:**

- Client name, insurance, clinical data, and appointment details are pre-populated.
- Goal scores from data collection sessions can be inserted directly into the note.
- NoteDraftAI (new feature) generates a first-draft session note from session details, giving clinicians a starting point rather than a blank screen.

**Strengths:** Deep integration with data collection; mandatory note completion tied to billing (can't bill without a note); digital signature locking prevents tampering.

**Weaknesses:** Complex setup; templates are tedious to configure; UI elements are too small (click errors); conversion flow is confusing for new users; poor mobile experience.

**Time to complete:** Not specifically documented, but user complaints suggest the process is cumbersome compared to newer platforms.

---

#### AlohaABA

**Session Note Workflow:**

- Flexible, customizable data forms with real-time data collection during sessions.
- Supports Skill Acquisition, Behavior Reduction, and ABC data in a responsive interface designed for in-session flow.
- Authorization utilization visible directly in the client profile; clicking shows scheduled, completed, billed, and cancelled appointments per service in the authorization.
- Payer-specific fields can be added to forms: session limits, co-pays, authorization numbers.
- Currently in beta with Welina, a new real-time, in-session data collection tool.

**Form Layout:**

- Clean, professional appearance (user reviews consistently praise aesthetics).
- Light learning curve — described as easy to use even for non-technical staff.
- Forms configurable per practice with custom fields for authorizations, permissions, and teams.

**Pre-fill & Automation:**

- Authorization utilization reports accessible directly within the schedule view.
- Alerts when attempting to schedule beyond authorization limits.
- Integration with data collection partners (Hi Rasmus, Motivity, Ensora Health).

**Strengths:** Light learning curve; clean UI; authorization alerts during scheduling; built-in authorization utilization in the schedule view.

**Weaknesses:** Data collection is still maturing (Welina in beta); relies on third-party integrations for deep clinical data collection; less mature AI features than competitors.

---

#### Motivity

**Session Note Workflow:**

- Highly integrated clinical + PM platform with real-time data collection.
- Data collected during sessions is instantly visible to anyone with access — no refresh needed.
- Can collect data on multiple learners simultaneously by toggling between session tabs.
- Over 370 program templates (reading, language, math, and more) available as starting points.
- Phases, prompts, and measurement types are all customizable.

**Form Layout:**

- Runs on phones, tablets, laptops, and desktops — responsive design across all form factors.
- Every behavior, prompt, and note auto-saves as users work.
- ABC data collection for maladaptive behaviors is built-in.

**Pre-fill & Automation:**

- Prior session data carries forward for comparison.
- Configurable approval workflows for session notes.
- QA process for note review (edit, resubmit, track versions).

**Strengths:** Best-in-class real-time data collection; auto-save; multi-learner simultaneous sessions; strong clinical tools; good mobile experience.

**Weaknesses:** More clinically focused — PM/billing features are less mature than CentralReach or AlohaABA; learning curve for the full feature set.

---

#### Raven Health

**Session Note Workflow:**

- AI-powered session notes generator: transforms session data into clear, detailed narratives automatically.
- Voice-to-text on Apple devices for hands-free note capture.
- Data collected during session transfers directly to the session note at completion.
- Clinical notes customizable per payer compliance standards.
- Offline data entry supported for RBTs in the field without reliable connectivity.

**Form Layout:**

- Clean, simple, fast interface — designed specifically for mobile-first field use.
- Drag-and-drop scheduling integration.
- Session note compares each new record to the previous session for easy progress tracking.

**Pre-fill & Automation:**

- AI generates first-draft notes from session data.
- HIPAA-compliant AI highlights core details and corrects errors automatically.
- Previous session comparison built into the note view.

**Strengths:** AI note generation; voice-to-text; offline support; previous session comparison; mobile-first design.

**Weaknesses:** Smaller company; fewer enterprise features; less mature authorization tracking.

---

#### Passage Health

**Session Note Workflow:**

- Mobile app for real-time data collection with auto-syncing.
- Data collected in session auto-summarizes within the session note.
- Geolocations automatically recorded on session notes (compliance feature).
- Client and team member profile data auto-pulled onto session notes.
- Supports simultaneous note editing and data collection.

**Form Layout:**

- Mobile-first design with real-time sync.
- Supports trial, task analysis, duration, frequency, rate, interval, scale, and ABC data types.
- Digital forms for behaviors that need counting or timing.

**Pre-fill & Automation:**

- Session data syncs to billing in real-time.
- Automated graphs for progress tracking.
- Supervisors see data live on their own devices as it's entered.
- AI-powered clinical notes through Frontera AI integration.

**Strengths:** Real-time sync; geolocation auto-capture; simultaneous edit + collect; AI notes via Frontera; automated graphing.

**Weaknesses:** Newer platform; less established user base; some features still in development.

---

#### Artemis ABA

**Session Note Workflow:**

- Integrated session timer with alerts for missing notes or signatures.
- Session notes and signatures captured in one cloud-based solution.
- Pre-session setup prompts (materials, data sheets, timers, digital tools).
- Timer-based session tracking: start timer, select service codes, software auto-tracks duration, break times, and billable activities.
- Quick notes can be added during session without interrupting therapy flow.

**Form Layout:**

- Cloud-based, accessible on any device.
- One-click note comment generator for quick, professional notes.

**Pre-fill & Automation:**

- Timer auto-calculates duration and billable units.
- Session data syncs to EHR and billing systems automatically.
- Real-time dashboard showing therapist productivity and attendance.

**Strengths:** Session timer with automatic unit calculation; alerts for missing documentation; integrated billing flow; quick-note feature.

**Weaknesses:** Less mature data collection compared to Motivity; smaller feature set overall.

---

#### ABA Matrix

**Session Note Workflow:**

- Three-section structure: Daily Log, Data Collection, Therapist Signature.
- Daily Log uses structured questions with suggested prompts (dropdowns with pre-set answers).
- Contextual dropdowns: behavior selection changes available intervention options; antecedent options depend on function of behavior.
- Protocol evaluations for BCBAs with separate, more detailed form sections.

**Form Layout:**

- Grouped question sections with configurable dropdown lists.
- Most dropdowns come from agency-level configuration (controlling language, style, and options).
- Separate sections for behavior measurement, antecedent interventions, and consequence interventions.

**Pre-fill & Automation:**

- Intervention dropdowns are dynamically filtered based on selected behavior.
- Function-of-behavior selection filters available antecedent prompts.
- Agency configures custom lists for consistent language across all staff.

**Strengths:** Best contextual dropdown filtering (behavior -> intervention -> antecedent chain); strong agency-level customization; structured questions reduce free-text burden.

**Weaknesses:** Can feel rigid for practices wanting more flexibility; setup complexity for the configuration.

---

### 1C. Session Form Comparison Table

| Feature                                   | CentralReach         | AlohaABA       | Motivity       | Raven Health        | Passage Health      | Artemis         | ABA Matrix           |
| ----------------------------------------- | -------------------- | -------------- | -------------- | ------------------- | ------------------- | --------------- | -------------------- |
| **Auto-populate client/appointment data** | Yes (dynamic fields) | Yes            | Yes            | Yes                 | Yes (+ geolocation) | Yes             | Yes                  |
| **Auto-calculate units from time**        | Yes (timesheet)      | Via schedule   | Yes            | Yes                 | Yes                 | Yes (timer)     | Yes                  |
| **Session timer**                         | No (timesheet-based) | No             | No             | No                  | No                  | Yes             | No                   |
| **AI note generation**                    | Yes (NoteDraftAI)    | No             | No             | Yes (core feature)  | Yes (Frontera AI)   | No              | No                   |
| **Voice-to-text**                         | No                   | No             | No             | Yes (Apple)         | No                  | No              | No                   |
| **Offline support**                       | No                   | No             | Partial        | Yes                 | Yes (auto-sync)     | No              | No                   |
| **Auto-save during entry**                | No                   | No             | Yes            | Yes                 | Yes                 | No              | No                   |
| **Previous session comparison**           | Yes (Learning Tree)  | No             | Yes            | Yes (automatic)     | Yes                 | No              | No                   |
| **Contextual dropdowns**                  | Limited              | Limited        | Moderate       | Limited             | Limited             | Limited         | Strong               |
| **Digital signature**                     | Yes (locks note)     | Yes            | Yes            | Yes                 | Yes                 | Yes             | Yes                  |
| **Multi-learner simultaneous**            | No                   | No             | Yes            | No                  | No                  | No              | No                   |
| **Authorization check at logging**        | Yes (billing module) | Yes (alerts)   | Yes            | Limited             | Limited             | Limited         | Limited              |
| **Mobile-optimized form**                 | Poor                 | Moderate       | Good           | Good (mobile-first) | Good (mobile-first) | Good            | Moderate             |
| **Quick-note during session**             | No                   | No             | Yes            | Yes (quick notes)   | Yes                 | Yes (one-click) | No                   |
| **SOAP/DAP/BIRP format support**          | Template-based       | Template-based | Template-based | AI-adaptive         | Template-based      | Template-based  | Structured questions |
| **Payer-specific customization**          | Template per code    | Custom fields  | Limited        | AI-adjustable       | Limited             | Limited         | Agency config        |

---

### 1D. Documentation Time Burden

| Metric                         | Traditional (manual) | Template-based PM       | AI-assisted     |
| ------------------------------ | -------------------- | ----------------------- | --------------- |
| Time per note (45-min session) | 15-30 minutes        | 8-12 minutes            | 2-5 minutes     |
| Daily burden (5 sessions)      | 1.5-2.5 hours        | 40-60 minutes           | 10-25 minutes   |
| Completion within 24 hours     | ~60% compliance      | ~85% compliance         | ~95% compliance |
| Primary bottleneck             | Free-text narrative  | Selecting/entering data | Review + sign   |

**Key insight:** AI note generation is the single biggest documentation time reduction. Platforms with AI (Raven Health, CentralReach NoteDraftAI, Passage Health + Frontera) report 60-80% reduction in documentation time. This is a major competitive differentiator.

---

## 2. Authorization Tracking: Platform Comparison

### 2A. CentralReach Authorization Dashboard

**Utilization View:**

- Billing module shows per-authorization breakdown with columns: Frequency, Authorized (hours/units), Worked, Pending, Remaining, Utilization %.
- Authorization Utilization Hour-Based Dashboard in the Insights module shows weekly and monthly utilization by location, service code category, authorization manager, and client.
- Dashboard widgets include: "% of Auth Hours Used" indicator, "% of Auth Hours Used Over Months" trend, "Upcoming Authorization Expirations" list.

**Alert System:**

- Scheduling module warns when scheduling beyond authorized hours for a client.
- Authorizations report surfaces expired and soon-to-expire auths.
- Filter by expiration window: 7 days, 14 days, 30 days, 45 days.

**Authorization Detail View:**

- Frequency (weekly/monthly/total auth period)
- Authorized hours/units per frequency
- Hours worked, pending (scheduled but not converted), remaining
- Utilization rate as percentage
- Authorization Analysis Report compares utilization ratios across clients, providers, and managers.

**Strengths:** Most comprehensive authorization reporting; multiple drill-down dimensions (location, manager, category); expiration filtering.

**Weaknesses:** Complex setup; data lives in billing module (not easily accessible to clinical staff); dashboard requires Insights module access.

---

### 2B. AlohaABA Authorization Management

**Utilization View:**

- Client authorization utilization visible directly in the client profile (not buried in billing).
- Click to see breakdown: scheduled, completed, billed, and cancelled appointments per service.
- Total appointments scheduled within service and authorization displayed prominently.
- Monthly breakdown of authorization utilization available.
- Authorization utilization reports accessible directly within the schedule view.

**Alert System:**

- Timely alerts for expiring authorizations.
- Alerts when attempting to schedule beyond authorization limits.
- Prevents unauthorized sessions to reduce billing errors.

**Authorization Detail View:**

- Per-service breakdown with appointment counts by status.
- Monthly utilization breakdown.
- Authorization utilization connects appointment tracking to billing workflows.
- Real-time monitoring of authorized units.

**Strengths:** Auth utilization in client profile AND schedule (visible at point of use); monthly breakdown; schedule-level alerts; clean UI.

**Weaknesses:** Less granular reporting than CentralReach; no dashboard-level aggregate view documented.

---

### 2C. Other Platforms

**RethinkBH Analytics:**

- Visual dashboards for authorization utilization, service pacing, scheduling/staffing gaps.
- Practice-wide insights to determine what's working and where improvement is needed.

**ABA Matrix:**

- Widget-based dashboard showing all authorizations with progress indicators.
- Documents with start/end dates display a progress indicator bar.
- Expandable widget to see list of all authorizations and their progress.

**TherapyPM:**

- Automatic tracking of authorizations, remaining units, expirations, and insurance rules.
- Timely alerts and clear view of approved services.
- Intelligent pacing metrics and flags when approaching limits.

---

### 2D. Authorization View Comparison Table

| Feature                        | CentralReach                 | AlohaABA               | RethinkBH    | ABA Matrix      | TherapyPM |
| ------------------------------ | ---------------------------- | ---------------------- | ------------ | --------------- | --------- |
| **Utilization percentage**     | Yes                          | Yes                    | Yes          | Yes (widget)    | Yes       |
| **Progress bars**              | No (table)                   | No (table)             | Yes (visual) | Yes (indicator) | Limited   |
| **Per-CPT-code breakdown**     | Yes                          | Yes                    | Yes          | Limited         | Yes       |
| **Monthly pacing view**        | Yes (weekly + monthly)       | Yes (monthly)          | Yes          | No              | Limited   |
| **Expiration alerts**          | Yes (7/14/30/45 day filters) | Yes                    | Yes          | Limited         | Yes       |
| **Schedule integration**       | Yes (warning)                | Yes (alert + block)    | Yes          | No              | Yes       |
| **Client profile integration** | Limited                      | Yes (primary location) | Yes          | Yes (widget)    | Limited   |
| **Dashboard aggregate**        | Yes (Insights module)        | Limited                | Yes          | Yes (widget)    | Limited   |
| **Burndown projection**        | No                           | No                     | No           | No              | No        |
| **Columns: Authorized**        | Yes                          | Yes                    | Yes          | Yes             | Yes       |
| **Columns: Worked/Completed**  | Yes                          | Yes                    | Yes          | Yes             | Yes       |
| **Columns: Pending/Scheduled** | Yes                          | Yes                    | No           | No              | Yes       |
| **Columns: Remaining**         | Yes                          | Yes                    | Yes          | Yes             | Yes       |
| **Columns: Cancelled**         | No                           | Yes                    | No           | No              | No        |
| **Multi-auth per client**      | Yes                          | Yes                    | Yes          | Yes             | Yes       |
| **Auth-to-billing link**       | Yes (tight)                  | Yes (tight)            | Yes          | Moderate        | Yes       |

**Key insight:** No platform offers predictive burndown projections ("at current pace, units exhaust on [date]"). This is a whitespace opportunity for Clinivise, already identified in the authorization UX research.

---

## 3. Form Design Patterns for Healthcare

### 3A. Single-Column vs. Multi-Column

**Research consensus (Baymard Institute, NNGroup, CXL):**

- Single-column forms outperform multi-column forms in completion rates and error reduction.
- Users complete single-column forms approximately 15 seconds faster.
- Multi-column layouts cause eye-tracking confusion: users skip fields when they jump from bottom of left column to top of right column.

**Exception — paired fields:**

- First name + Last name on one line: acceptable (semantic pair).
- City + State + Zip on one line: acceptable (address convention).
- Start time + End time on one line: acceptable (temporal pair).
- CPT code + Modifier on one line: acceptable (billing pair).

**Recommendation for Clinivise:** Use single-column layout with paired exceptions for semantically related fields. Group fields into collapsible sections to reduce visual overwhelm.

---

### 3B. Field Grouping Patterns

The most effective clinical forms group fields into logical sections with clear visual boundaries:

**Pattern 1: Card-Based Sections**
Each field group lives in a card (shadcn Card component) with a section header. Cards can be collapsed/expanded. Benefits: clear visual separation; users can skip to relevant sections; feels less like a wall of inputs.

**Pattern 2: Stepped Wizard**
Multi-step form with a progress indicator. Each step contains one logical group (Session Info -> Goals & Data -> Narrative -> Review & Sign). Benefits: reduced cognitive load per step; forces completeness; good for mobile.

**Pattern 3: Hybrid (recommended for ABA)**
Top section (Session Info) is always visible as a compact header strip. Below, card-based sections for clinical content. Bottom sticky bar with save/submit actions. Benefits: combines density of card layout with progressive disclosure; session context always visible.

---

### 3C. Dropdown and Select Patterns for Frequently Used Values

**Best practices from healthcare UX:**

1. **Recent/Favorites first:** Show the 3-5 most recently used values at the top of a dropdown, separated by a divider from the full list. For CPT codes, most RBTs bill 1-2 codes repeatedly (97153, 97155).

2. **Searchable selects:** Any dropdown with more than 7 items should be searchable. CPT code selector should accept both code and description: typing "97153" or "adaptive" should find the right code.

3. **Contextual filtering:** ABA Matrix's approach is best-in-class — selecting a behavior filters available interventions. Apply this to: selecting a CPT code should auto-suggest the correct modifier based on provider credential.

4. **Sticky defaults:** If a provider always bills the same code for a client, pre-select it. If sessions are always at the same location, pre-select it. Let users override, but don't make them re-select every time.

5. **Smart grouping:** Group CPT codes by category (assessment, direct therapy, supervision, caregiver training) in the dropdown rather than a flat numeric list.

---

### 3D. Save Patterns

| Pattern                               | Best For                          | Pros                                                              | Cons                                                          |
| ------------------------------------- | --------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| **Auto-save**                         | Data collection during session    | No data loss; continuous saving                                   | Users unsure what's saved; harder to "undo"; accidental saves |
| **Manual save (button)**              | Session notes                     | Clear user control; easy to discard changes                       | Data loss risk if browser crashes; users forget to save       |
| **Draft + Submit**                    | Clinical notes requiring review   | Separates "work in progress" from "ready for review"; audit trail | Extra step; users may leave drafts incomplete                 |
| **Auto-save draft + explicit submit** | Recommended for ABA session notes | Best of both: no data loss AND clear completion action            | Slight complexity in UI (draft indicator + submit button)     |

**Recommendation for Clinivise:** Auto-save draft with explicit submit. Show a "Draft saved" timestamp indicator. Submit transitions note to "Pending Signature" status. Signature locks the note.

---

### 3E. Note Format Selection

| Format                   | Structure                                   | Time to Complete | Best For                                                           |
| ------------------------ | ------------------------------------------- | ---------------- | ------------------------------------------------------------------ |
| **SOAP**                 | Subjective, Objective, Assessment, Plan     | 10-15 min        | Insurance-heavy practices; initial evals; quarterly reviews        |
| **DAP**                  | Data, Assessment, Plan                      | 5-8 min          | Routine weekly sessions; streamlined documentation                 |
| **BIRP**                 | Behavior, Intervention, Response, Plan      | 8-12 min         | Agency/organizational settings; intervention-focused documentation |
| **Structured Questions** | Pre-defined questions with dropdown answers | 5-10 min         | Standardization across large teams; consistent language            |

**Recommendation for Clinivise:** Default to structured questions (ABA Matrix model) for RBTs (fastest, most consistent, reduces training time). Offer SOAP template for BCBAs doing evaluations. Both should support AI narrative generation from structured data.

---

## 4. Specific Recommendations for Clinivise

### 4A. Session Form Architecture

**Layout: Hybrid Card + Sticky Context**

```
+--------------------------------------------------+
| SESSION HEADER (always visible, compact)          |
| [Client: Jane D.] [Date: 03/21/2026] [97153 x 4] |
| [Provider: Alex R., RBT] [10:00 AM - 11:02 AM]   |
| [Auth: #A12345 — 28/40 units used (70%)]          |
+--------------------------------------------------+
|                                                    |
| SECTION 1: Session Details (card, collapsed if     |
|            auto-populated from appointment)         |
|  - Place of service [dropdown, sticky default]     |
|  - CPT Code [searchable, grouped by category]      |
|  - Modifier [auto-suggested from provider cred]    |
|  - Start/End time [paired, timer option]           |
|  - Duration / Units [auto-calculated]              |
|                                                    |
| SECTION 2: Goals & Data Collection (card)          |
|  - Goals pulled from treatment plan [checkboxes]   |
|  - Per-goal: data entry (trials, frequency, etc.)  |
|  - Per-goal: prompt level [segmented control]      |
|  - Per-goal: progress status [met/partial/not met] |
|                                                    |
| SECTION 3: Behavior Incidents (card, optional)     |
|  - ABC data: Antecedent / Behavior / Consequence   |
|  - Behavior dropdown [contextual interventions]    |
|  - Duration / frequency of behavior                |
|                                                    |
| SECTION 4: Session Narrative (card)                |
|  - Structured questions OR free-text               |
|  - [Generate with AI] button                       |
|  - Caregiver communication notes (optional)        |
|                                                    |
| SECTION 5: Review & Sign (card)                    |
|  - Summary of all data entered                     |
|  - Provider signature [digital]                    |
|  - Caregiver signature [optional, payer-dependent] |
|                                                    |
+--------------------------------------------------+
| STICKY FOOTER                                      |
| [Save Draft]  [Draft saved 2:34 PM]  [Submit Note] |
+--------------------------------------------------+
```

---

### 4B. Session Form Field Groupings

**Group 1: Session Identification (auto-populated from appointment)**
| Field | Type | Pre-fill Source | Required |
|-------|------|----------------|----------|
| Client | Display only | Appointment | Yes |
| Date of service | Date picker | Appointment date | Yes |
| Start time | Time input | Appointment start | Yes |
| End time | Time input | Appointment end OR timer | Yes |
| Duration (minutes) | Calculated | End - Start | Auto |
| Billable units | Calculated | CMS or AMA rule | Auto |
| Place of service | Dropdown (6 options) | Client default or last session | Yes |
| Location address | Conditional text | Client home address if POS=home | Conditional |

**Group 2: Service & Billing (auto-populated, editable)**
| Field | Type | Pre-fill Source | Required |
|-------|------|----------------|----------|
| CPT code | Searchable select | Appointment service code | Yes |
| Modifier | Auto-selected | Provider credential type | Yes |
| Authorization | Auto-linked | Active auth for this CPT + date range | Yes |
| Auth utilization | Display only | Used / Approved units | Info |
| Supervising BCBA | Select | Assigned supervisor | If RBT |

**Group 3: Goals & Data (pulled from treatment plan)**
| Field | Type | Pre-fill Source | Required |
|-------|------|----------------|----------|
| Active goals | Checklist | Treatment plan goals | Min 1 |
| Per-goal data | Dynamic (trial/freq/dur) | Goal measurement type | Per goal |
| Prompt level | Segmented control (6 levels) | None | Per trial |
| Progress status | Radio (met/partial/not met/regression) | None | Per goal |
| Goal notes | Short text | None | Optional |

**Group 4: Behavior Documentation (optional section)**
| Field | Type | Pre-fill Source | Required |
|-------|------|----------------|----------|
| Behavior occurred? | Toggle | None | No (section toggle) |
| Behavior type | Dropdown (from BIP) | None | If yes |
| Antecedent | Dropdown (contextual) | None | If yes |
| Consequence/Intervention | Dropdown (contextual) | None | If yes |
| Duration/frequency | Number | None | If yes |
| Intensity | Scale (1-5) | None | Optional |

**Group 5: Narrative & Communication**
| Field | Type | Pre-fill Source | Required |
|-------|------|----------------|----------|
| Session summary | Rich text OR structured Qs | AI-generated draft | Yes |
| Caregiver present? | Toggle | None | No |
| Caregiver communication | Short text | None | If present |
| Coordination of care | Short text | None | Optional |

**Group 6: Signature & Submission**
| Field | Type | Pre-fill Source | Required |
|-------|------|----------------|----------|
| Provider signature | Digital signature | None | Yes |
| Caregiver signature | Digital signature | None | Payer-dependent |
| Note status | Auto | Draft -> Submitted -> Co-signed | Auto |

---

### 4C. Session Form UX Patterns to Implement

**1. Session Timer (steal from Artemis)**

- Optional floating timer widget in bottom-right corner.
- Start/pause/stop controls.
- Auto-fills start time, end time, and duration when stopped.
- Tracks break time separately (excluded from billable time).
- Shows running unit count based on CMS/AMA rule (configurable per payer).

**2. AI Note Generation (steal from Raven Health)**

- After structured data is entered (goals, data, behaviors), offer "[Generate Session Narrative]" button.
- AI produces a 2-3 paragraph summary using the entered data.
- Editable before submission — clinician reviews and adjusts.
- AI draft should reference specific data points ("Client achieved 80% accuracy on manding targets, up from 65% in previous session").
- Save AI-generated vs. human-edited flag for audit purposes.

**3. Contextual Dropdowns (steal from ABA Matrix)**

- CPT code selection auto-suggests modifier based on provider credentials.
- Behavior selection filters available antecedent and intervention options.
- Place of service selection conditionally shows address field (only for home/community).
- Goal selection shows only active, age-appropriate goals from treatment plan.

**4. Authorization Guard Rail (steal from AlohaABA + CentralReach)**

- Before note submission, validate against active authorization.
- Show inline warning if: no active auth for this CPT code + date; auth is within 5 units of exhaustion; auth expires within 14 days; session would exceed remaining authorized units.
- Block submission (with override for admin) if no valid auth exists.
- Show utilization impact: "This session uses 4 units. After this: 32/40 used (80%)."

**5. Auto-Save Draft (steal from Motivity)**

- Auto-save every 30 seconds while form has unsaved changes.
- Show "Draft saved at 2:34 PM" indicator near the save button.
- Drafts persist across browser sessions (stored server-side, not localStorage).
- Incomplete notes surface in a "Pending Notes" dashboard widget.

**6. Repeat/Copy Session (new — gap in all competitors)**

- "Copy from last session" button pre-fills: same client, same CPT code, same goals, same place of service, same supervisor.
- Only date, time, data values, and narrative are blank (must be unique per session).
- Reduces time for recurring appointments (most ABA sessions are 3-5x/week with same parameters).

**7. Quick-Log Mode (new — gap in most competitors)**

- For RBTs logging multiple sessions at end of day (common reality despite best-practice guidance).
- Compact, single-screen view with minimal fields: client, date, time range, CPT code, goals (checkboxes), brief narrative.
- Skips optional sections (behaviors, caregiver communication) but flags for BCBA review.
- Still requires signature.

---

### 4D. Authorization Page Architecture

**Authorization List View (per client):**

```
+--------------------------------------------------+
| CLIENT: Jane Doe                                  |
| Active Authorizations (2)  |  Expired (3)  |  All |
+--------------------------------------------------+
|                                                    |
| AUTH CARD 1 — Active                        [Edit] |
| +----------------------------------------------+  |
| | #AUTH-2026-001  |  BCBS of Illinois           |  |
| | 01/01/2026 — 06/30/2026  (102 days remaining) |  |
| |                                                |  |
| | SERVICE LINES:                                 |  |
| | 97153 (Direct 1:1) ████████████░░░ 28/40 (70%) |  |
| | 97155 (Supervision) ██████░░░░░░░░░  6/20 (30%) |  |
| | 97156 (Caregiver)   ██░░░░░░░░░░░░░  2/12 (17%) |  |
| |                                                |  |
| | OVERALL: 36/72 units used (50%)                |  |
| | PACE: On track (projected completion: 05/15)   |  |
| | ⚠ 97156 under-utilized — 17% used, 50% elapsed |  |
| +----------------------------------------------+  |
|                                                    |
| AUTH CARD 2 — Active (Expiring Soon)        [Edit] |
| +----------------------------------------------+  |
| | #AUTH-2025-047  |  Medicaid                   |  |
| | 10/01/2025 — 03/31/2026  (10 days remaining)  |  |
| |                                                |  |
| | SERVICE LINES:                                 |  |
| | 97153 (Direct 1:1) █████████████████ 38/40 (95%)|  |
| | 97151 (Assessment)  ████████████████ 4/4 (100%) |  |
| |                                                |  |
| | OVERALL: 42/44 units used (95%)                |  |
| | 🔴 CRITICAL: 2 units remaining, expires in 10d |  |
| | 📋 Re-auth submitted 03/14 — pending           |  |
| +----------------------------------------------+  |
+--------------------------------------------------+
```

**Authorization Detail View (tabs):**

```
TAB: Overview
- Auth header: Number, Payer, Status badge, Date range
- Utilization summary card with segmented progress bars per CPT
- Burndown chart: units used over time with projection line
- Alert cards (expiring, under-utilized, over-utilized)
- Re-authorization status + checklist

TAB: Service Lines
- Table: CPT Code | Description | Approved Units | Used | Scheduled | Remaining | Utilization %
- Each row expandable to show individual sessions consuming units
- Sortable/filterable

TAB: Sessions
- All sessions linked to this authorization
- Columns: Date | Provider | CPT | Units | Status (draft/submitted/billed)
- Filters: date range, provider, CPT code, status

TAB: Documents
- Authorization letter (PDF)
- AI-parsed authorization details
- Re-authorization submissions
- Progress reports submitted

TAB: Timeline
- Audit log of all authorization events
- Auth created, units consumed, alerts triggered, re-auth submitted, auth renewed
```

---

### 4E. Authorization Page UX Patterns to Implement

**1. Segmented Progress Bars (steal from Linear)**

- Each CPT code gets its own progress bar within the auth card.
- Bar segments show: used (solid fill), scheduled (striped), remaining (empty).
- Color coding: emerald (<80%), amber (80-95%), red (>95%).
- Hover shows exact numbers.

**2. Burndown Projection (whitespace opportunity — no competitor has this)**

- Simple area chart showing unit consumption over time.
- Projection line extrapolates current pace to predict exhaustion date.
- Two reference lines: auth end date and projected exhaustion date.
- If projected exhaustion > auth end date: show "Under-utilized" warning.
- If projected exhaustion < auth end date: show "Projected to exhaust early" warning.

**3. Re-Authorization Workflow (steal from ABA Matrix + enhance)**

- Checklist widget appears when auth is within 30 days of expiration.
- Checklist items: Progress report drafted, Assessment updated, Service recommendation attached, Submission date set, Submitted to payer.
- Each item checkable by authorized staff.
- Status badge on auth card shows re-auth progress.

**4. Alert Tiers (combine CentralReach filtering + AlohaABA inline alerts)**

- Dashboard widget: "Authorizations Requiring Attention"
- Tier 1 (red): Expired with no renewal, over-utilized (>100%)
- Tier 2 (amber): Expiring within 14 days, >95% utilized, re-auth not yet submitted
- Tier 3 (blue): Expiring within 30 days, >80% utilized, under-utilized (<50% used but >50% of period elapsed)
- Each alert links directly to the authorization detail page.

**5. Schedule-Integrated Auth Checks (steal from AlohaABA)**

- When scheduling a session, show auth utilization inline on the scheduling form.
- Block scheduling beyond authorized units (with admin override).
- Show warning badges on calendar for sessions without valid authorization.
- Color-code calendar events by auth utilization level.

---

### 4F. What Clinivise Should Build First (Priority Order)

**Sprint Priority for Session Logging:**

| Priority | Feature                                         | Rationale                                           |
| -------- | ----------------------------------------------- | --------------------------------------------------- |
| P0       | Basic session form with all required fields     | Can't bill without session notes                    |
| P0       | Auto-populate from appointment data             | Reduces 60% of manual entry                         |
| P0       | Unit calculation (CMS + AMA)                    | Core billing accuracy                               |
| P0       | Authorization validation on submit              | Prevents billing errors                             |
| P1       | Auto-save drafts                                | Prevents data loss (RBTs in field)                  |
| P1       | Digital signature + note locking                | Compliance requirement                              |
| P1       | AI narrative generation                         | Primary competitive differentiator                  |
| P1       | Session timer                                   | Requested by RBTs; improves accuracy                |
| P2       | Contextual dropdowns (behavior -> intervention) | Clinically important; can ship after MVP            |
| P2       | Copy from last session                          | Quality of life; high impact for recurring sessions |
| P2       | Quick-log mode                                  | Addresses reality of delayed documentation          |
| P3       | Voice-to-text                                   | Apple-only initially; nice-to-have                  |
| P3       | Multi-learner simultaneous                      | Niche use case (group sessions)                     |

**Sprint Priority for Authorization Tracking:**

| Priority | Feature                                          | Rationale                 |
| -------- | ------------------------------------------------ | ------------------------- |
| P0       | Auth list view with utilization bars             | Core visibility           |
| P0       | Per-CPT-code utilization breakdown               | Billing accuracy          |
| P0       | Expiration alerts (14/30 day)                    | Prevents revenue loss     |
| P1       | Auth detail page (Overview + Service Lines tabs) | Drill-down capability     |
| P1       | Schedule-integrated auth checks                  | Prevents invalid sessions |
| P1       | Dashboard widget for auth attention              | Proactive management      |
| P1       | Sessions tab on auth detail                      | Audit trail               |
| P2       | Burndown projection chart                        | Unique differentiator     |
| P2       | Re-authorization checklist workflow              | Operational efficiency    |
| P2       | Documents tab (AI-parsed auth letters)           | Already in pipeline       |
| P3       | Timeline/audit tab                               | Compliance enhancement    |
| P3       | Under-utilization alerts                         | Revenue optimization      |

---

## Sources

### Session Logging

- [ABA Session Notes: Elements, Examples, Templates & Tips (Artemis)](https://www.artemisaba.com/blog/aba-session-notes)
- [8 Key Components of an Effective ABA Session Note Template (Raven Health)](https://ravenhealth.com/blog/aba-note-template/)
- [How to Write ABA Session Notes (Mentalyc)](https://www.mentalyc.com/blog/aba-notes)
- [RBT Session Notes: Examples & Best Practices (Instafill)](https://resources.instafill.ai/docs/aba/rbt-session-notes-guide)
- [CentralReach Notes & Forms Help](https://help.centralreach.com/notes-forms/)
- [CentralReach: Create a Note from a Timesheet](https://help.centralreach.com/create-a-note-from-a-timesheet/)
- [AlohaABA Data Collections](https://alohaaba.com/features/data-collections)
- [AlohaABA Authorization Management](https://alohaaba.com/features/authorization-management)
- [Motivity ABA Data Collection](https://www.motivity.net/solutions/aba-data-collection)
- [Motivity Session Note Completion Assurance](https://www.motivity.net/feature/session-note-completion-assurance)
- [Raven Health AI-Powered ABA Platform](https://ravenhealth.com/key-features-ai-capabilities/)
- [Passage Health Clinical Features](https://www.passagehealth.com/clinical)
- [Artemis ABA RBT Software Tools](https://www.artemisaba.com/rbt)
- [ABA Matrix: Setting Up Notes for Behavior Treatment Sessions](https://docs.abamatrix.com/article/673-admin-configuration-guide-setting-up-the-new-notes-system-for-behavior-treatment-sessions)
- [Top 5 ABA Practice Management Software (Passage Health)](https://www.passagehealth.com/blog/aba-practice-management-software)
- [Best ABA Practice Management Software 2026 (Motivity)](https://www.motivity.net/blog/best-aba-practice-management-software)

### Authorization Tracking

- [CentralReach: Authorization Utilization Hour-Based Dashboard](https://community.centralreach.com/s/article/knowledge-the-authorization-utilization-hour-based-dashboard)
- [CentralReach: Authorization Analysis Report](https://help.centralreach.com/the-authorization-analysis-report/)
- [CentralReach: Navigate Authorizations in Billing](https://help.centralreach.com/navigate-authorizations-in-the-billing-module/)
- [CentralReach: Prevent Overbilling with Authorizations Tool](https://centralreach.com/blog/prevent-overbilling-and-under-utilizing-with-centralreach-authorizations-tool/)
- [AlohaABA: Track Client Authorization Usage](https://support.alohaaba.com/portal/en/kb/articles/check-client-authorization-usage)
- [ABA Matrix: Authorization Management](https://www.abamatrix.com/aba-authorization-management/)
- [Visual Dashboards for ABA Clinics (ABA Engine)](https://abaengine.com/blog/visual-dashboards-for-aba-clinics/)

### Form Design & UX

- [Form Design Principles: 13 Empirically Backed Best Practices (CXL)](https://cxl.com/blog/form-design-best-practices/)
- [Healthcare UI Design 2026: Best Practices (Eleken)](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [How to Design Online Patient Forms: 18 Best Practices (314e)](https://www.314e.com/practifly/blog/patient-form-design-best-practices/)
- [Few Guesses, More Success: 4 Principles to Reduce Cognitive Load (NNGroup)](https://www.nngroup.com/articles/4-principles-reduce-cognitive-load/)
- [How to Design a Form Wizard (Andrew Coyle)](https://www.andrewcoyle.com/blog/how-to-design-a-form-wizard)
- [Multi-Step Form Design Best Practices (Growform)](https://www.growform.co/must-follow-ux-best-practices-when-designing-a-multi-step-form/)
- [Comparing Types of Progress Notes: SOAP, BIRP, DAP (Note Designer)](https://notedesigner.com/resources-comparing-types-of-progress-notes/)
- [SOAP vs DAP Notes (Freed)](https://www.getfreed.ai/resources/soap-vs-dap-notes)

### CPT Codes & Billing

- [ABA Therapy Billing Guide: CPT Codes & Best Practices (Plutus Health)](https://www.plutushealthinc.com/post/aba-billing)
- [ABA Billing Codes: 10 Main Codes (Passage Health)](https://www.passagehealth.com/blog/aba-billing-codes)
- [ABA CPT Code Updates 2025 (TherapyPM)](https://therapypms.com/aba-cpt-code-updates-2025/)
- [CMS 8-Minute Rule Guide (Clinicient)](https://www.clinicient.com/guide/8-minute-rule/)
- [Unit Calculator: 8-Minute Rule CMS & AMA (Patient Studio)](https://www.patientstudio.com/unit-calculator-physical-therapy-8-minute-rule)
