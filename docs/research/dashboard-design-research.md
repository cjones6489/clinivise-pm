# Dashboard Design Research: ABA Practice Management & EHR Platforms

> Research conducted March 2026. Covers 10+ platforms across ABA-specific and general practice management software.

---

## Table of Contents

1. [Platform-by-Platform Analysis](#platform-by-platform-analysis)
2. [Role-Specific Workflows](#role-specific-workflows)
3. [Dashboard Design Patterns (Comparison)](#dashboard-design-patterns)
4. [Common Patterns (What Everyone Does)](#common-patterns)
5. [Differentiators (What Sets the Best Apart)](#differentiators)
6. [Recommendations for Clinivise](#recommendations-for-clinivise)

---

## Platform-by-Platform Analysis

### 1. CentralReach (ABA-Specific, Market Leader)

**Home/Landing Page:** Customizable widget-based dashboard ("My Dashboard"). Users land on their dashboard with an agenda view and configurable widgets. Navigation is module-based with icons along the top bar.

**Metrics/KPIs Shown:**

- Authorization utilization rates (hours authorized vs. hours worked vs. hours scheduled)
- Billing performance and daily average billing
- Customizable BI dashboards with KPI widgets (via paid add-on "INSI")
- Client progress tracking via graphs

**Alerts/Notifications:**

- Unconverted billable appointments (blue lightning bolt icon)
- Partially converted billable appointments (yellow lightning bolt icon)
- Overdue tasks
- Checklist notifications

**Navigation:** Top navigation bar with module icons: Dashboard, Contacts, Messages, Files, Billing, HR, Claims, Scheduling, Tasks. Each module is a distinct section.

**Quick Actions:**

- Convert billable appointments directly from dashboard
- Create tasks from dashboard
- Send messages
- Access "My Agenda" for daily activities

**Client Overview:** Contacts module with employee, client, generic, and provider categories. Filterable, sortable, bulk-updatable.

**Unique Patterns:**

- Widget-based dashboard is fully customizable (drag and rearrange)
- "My Agenda" as a separate day-planning view
- Unconverted appointment tracking with visual icons (lightning bolts)
- Authorization Utilization dashboard shows hour-based utilization with utilization percentage
- Role-based widget visibility
- Activity & Call Log widget for contact-level dashboards

---

### 2. AlohaABA (ABA-Specific, Small-Mid Practices)

**Home/Landing Page:** "My Dashboard" is the first screen after login. Accessed via icon on left sidebar. Completely customizable by user and permissions level.

**Metrics/KPIs Shown:**

- Unbilled appointments count
- Revenue trends
- Client progress
- Claim approvals
- Staff utilization
- Operational, financial, and clinical data combined into visual dashboards

**Alerts/Notifications:**

- Unbilled Appointments Widget (ensures no sessions fall through cracks)
- Widgets scoped by "My" (personal) vs. organizational level

**Navigation:** Left sidebar with icons. Clean, minimal design focused on ease of use.

**Quick Actions:**

- Access scheduling for billable, non-billable, drive time, mileage appointments, and breaks
- Billing management
- Payroll management

**Client Overview:** Client management accessible from sidebar navigation.

**Unique Patterns:**

- "My" prefix widgets = personal data; no prefix = organization-wide data
- Customizable per user AND per permission level (different staff levels get different default widgets)
- Strong focus on unbilled appointment tracking as a revenue-loss prevention feature
- Known for very low learning curve

---

### 3. Theralytics (ABA-Specific, Best Value)

**Home/Landing Page:** Activity Dashboard with customizable metrics. Users create their own dashboards via "+ Create Dashboard" button.

**Metrics/KPIs Shown:**

- Revenue metrics
- Claim status
- Appointment trends
- Custom-selected metrics per dashboard

**Alerts/Notifications:**

- Real-time data updates
- Configurable alerts based on dashboard filters

**Navigation:** Standard sidebar navigation. Known for intuitive design.

**Quick Actions:**

- Create custom activity dashboards
- Add filters to dashboard data
- Share dashboards with other team members

**Client Overview:** Client management with scheduling integration.

**Unique Patterns:**

- User-created dashboards (not just widget customization, but full dashboard creation)
- Interactive charts and graphs for data exploration
- Shareable dashboards (collaboration feature)
- Real-time data refresh

---

### 4. Raven Health (ABA-Specific, Mobile-First)

**Home/Landing Page:** Practice Management Dashboard showing therapy session data, key metrics, and progress trends in one view.

**Metrics/KPIs Shown (4 Key Metrics Framework):**

1. Attendance rate and no-show/cancellation rate
2. Gross collection rate, claim approval rate, average reimbursement time
3. Authorization renewal tracking and treatment duration
4. Clinical progress (skill acquisition rates, behavior goal mastery %)

**Alerts/Notifications:**

- Authorization renewal reminders
- Clinical outcome trend alerts

**Navigation:** Web + mobile (iOS/Android) with mobile-first design. Offline-capable with sync.

**Quick Actions:**

- Monitor client progress
- Manage treatment plans
- Analyze financial performance

**Client Overview:** Centralized client data management with customizable graphing.

**Unique Patterns:**

- Mobile-first design with offline capability and seamless sync
- AI-powered features for clinical insights
- Cross-platform (web, iOS, Android) with consistent experience
- Emphasis on "4 key metrics" as a mental model for practice health
- VB-MAPP assessment tracking built into dashboard

---

### 5. SimplePractice (General Therapy, Market Leader)

**Home/Landing Page:** Calendar is the landing page. Analytics dashboard is a separate section.

**Analytics Dashboard Metrics (5 tiles):**

1. **Income** snapshot (total revenue for date range + projected income for next month)
2. **Outstanding Balances** (client + insurance payer amounts owed)
3. **Claims Filed** (counts by status: Paid, Rejected, Denied, Deductible, Accepted, Other)
4. **Appointments** (counts by status: Show, Canceled, No show, Late canceled)
5. **Notes** status

**Alerts/Notifications:**

- Appointment reminders (automated)
- Claim status changes

**Navigation:** Clean sidebar navigation. Calendar-first design.

**Quick Actions:**

- Drag-and-drop calendar scheduling
- Client search from calendar view
- Manage waiting list from home page

**Client Overview:** Client charts accessible from calendar; intuitive flow from intake to billing.

**Unique Patterns:**

- Calendar as home page (not dashboard) -- therapists think in terms of "who am I seeing today"
- Projected income based on historical reimbursement data (forward-looking metric)
- Date range selector (current month, last 30 days, last month, this year, custom) on analytics
- Color-coding by service code, clinician, or appointment status
- "Sleek, clinician-centric design that reduces clicks"

---

### 6. Jane App (General Practice Management)

**Home/Landing Page:** Day Sheet (daily schedule) is the default view. Practitioner Dashboard is toggled on/off via the top-right corner toggle.

**Dashboard Sections (3 modules):**

1. **Chart Status** -- distribution of signed, drafted, and never-started chart entries for arrived appointments in past 90 days
2. **Top Treatments** -- most frequently booked session types in past 365 days with counts
3. **Patient Metrics** -- average visits per client, total new clients (365-day range)

**Clinic Owner Additional View:**

- Financial metrics (toggle-controlled by permission level)
- Supervision tab for reviewing supervisee charts
- Compensation reports for tracking practitioner income

**Alerts/Notifications:**

- Chart completion status (never started charts = action needed)
- Supervision review queue

**Navigation:** Blue banner at top with Day Sheet access on the left. Sidebar for main sections.

**Quick Actions:**

- Toggle dashboard visibility
- Click chart status to filter charts
- Jump to supervision tab
- Privacy mode (Shift+P) to obfuscate patient names

**Client Overview:** Patient profile dashboard with visit history.

**Unique Patterns:**

- Privacy Mode (Shift+P) -- instantly obfuscates patient names on dashboard (great for screen sharing or public spaces)
- Day Sheet as default, dashboard as optional overlay (respects different workflow preferences)
- Chart Status module drives documentation completion behavior
- Clear permission-gated financial data (clinic owners see financials, practitioners don't by default)
- "Average visits per client" as a retention metric

---

### 7. Healthie (General Health & Wellness)

**Home/Landing Page:** Provider Dashboard with activity feed and task management.

**Dashboard Sections:**

1. **Appointments** -- unconfirmed appointments needing action
2. **Tasks** -- due and overdue task items
3. **Activity Feed** -- newsfeed of client entries (food logs, metrics, workouts) with reaction/comment capability
4. **Business Analytics Board** (Practice Plus plans and above)

**Reporting Dashboards:**

- **Appointments Dashboard** -- visual display of appointment report data
- **Provider Utilization Dashboard** -- three core metrics:
  - Total Availability Hours
  - Total Appointment Hours
  - Utilization Percentage (booked / available)

**Alerts/Notifications:**

- Unconfirmed appointment alerts
- Task due/overdue notifications
- Email notifications for tasks

**Navigation:** Sidebar navigation. Calendar accessible as separate view.

**Quick Actions:**

- Add appointment from dashboard
- Add task from dashboard
- React to or comment on client activity entries

**Client Overview:** Client profiles with engagement tracking and metrics.

**Unique Patterns:**

- Activity feed with social-media-style engagement (reactions + comments on client entries)
- Provider Utilization Dashboard as a dedicated view with 3 focused metrics
- Mobile app mirrors web dashboard exactly
- "Smart Tasks" for automated task creation and assignment

---

### 8. TherapyAppointment (General Therapy)

**Home/Landing Page:** Home page with daily agenda and action items. Color-coding highlights what needs immediate action.

**Dashboard Sections:**

1. **Today's Appointments** -- daily agenda at top left with click-to-expand appointment details
2. **Charting Tasks** -- incomplete documentation
3. **Client Management** -- alerts and actions
4. **Claim Actions** -- billing tasks

**Alerts/Notifications:**

- Treatment plans expiring within 2 weeks
- Expired treatment plans
- Color-coded urgency indicators

**Navigation:** Standard navigation. Home page is action-oriented.

**Quick Actions:**

- Click appointment to see details (time, type, client alert on hover)
- Expand/collapse task sections
- Direct links to relevant modules from action items

**Unique Patterns:**

- Collapsible task sections to keep the home page clean
- Color-coding for urgency (immediate attention items stand out)
- Treatment plan expiration warnings surfaced on home screen
- Action-oriented design (everything on home page is something you need to DO)

---

### 9. Motivity (ABA-Specific, Clinical Focus)

**Home/Landing Page:** Dashboard with appointment count indicator and customizable analytics.

**Metrics/KPIs Shown:**

- Session data (real-time)
- Appointment counts with numbered badge
- Billing and claims status
- Appointment patterns
- Clinical program outcomes
- Payor hour utilization

**Alerts/Notifications:**

- Payor hours underused
- Staff overbooked
- Clinical outcomes off track

**Navigation:** Dashboard with tabs. Appointments tab shows daily count.

**Quick Actions:**

- View by learner, location, team, or payor
- Custom or ready-made dashboards

**Unique Patterns:**

- Amazon QuickSight-powered BI for advanced analytics
- Alert when "payor hours are underused, staff is overbooked, or clinical outcomes are off track" -- proactive problem detection
- Multi-dimensional filtering (learner, location, team, payor)

---

### 10. Artemis ABA (ABA-Specific, Salesforce-Based)

**Home/Landing Page:** Unified dashboard showing revenue, utilization, cancellations, and authorizations in one view.

**Metrics/KPIs Shown:**

- Revenue
- Utilization rates
- Cancellation tracking
- Authorization status
- Real-time KPI dashboards

**Alerts/Notifications:**

- Exception-based alerts (only surfaces problems)
- Scheduling gap detection

**Navigation:** Product menu: Scheduling, Practice Management, Data and Collections, Reporting, MEBS, Billing Automation, Managed Billing Services, RCM.

**Quick Actions:**

- Review combined schedules
- Drill down to appointment details
- Interactive dashboard exploration

**Unique Patterns:**

- "360-degree outlook" on clients -- comprehensive view from one screen
- Exception-based alerting (only alerts you when something is wrong)
- Built on Salesforce Cloud (enterprise-grade but heavy)
- Combined schedule view + drill-down on same screen

---

### 11. Noteable (ABA + Community Mental Health)

**Home/Landing Page:** Integrated dashboard with task-driven alerts.

**Metrics/KPIs Shown:**

- Claim status
- ERA activity
- Denial history
- Revenue cycle visibility

**Alerts/Notifications:**

- Next-step alerts (tells you what to do AND where to go)
- Task management to prevent items from falling through cracks

**Navigation:** Integrated workflow -- notes flow into billing, data feeds into reports.

**Quick Actions:**

- Calendar automations
- Scheduling client appointments and internal meetings
- HIPAA-compliant telehealth (Supervision Mode)

**Unique Patterns:**

- "Tells you the next step and exactly where to go" -- guided workflow, not just data display
- Everything connects: notes -> billing -> reports (no duplicate data entry)
- Calendar Automations for recurring scheduling patterns
- Supervision Mode for telehealth built directly into the platform

---

## Role-Specific Workflows

### What a BCBA Needs First Thing in the Morning

Based on research across ABA platforms and practitioner workflows:

1. **Today's schedule** -- who am I seeing, where, and when?
2. **Supervision hours status** -- am I on track for required supervision contacts this month?
3. **Client data review** -- quick scan of progress data from recent RBT sessions before supervision
4. **Authorization status** -- which clients are approaching utilization limits? Any expiring soon?
5. **Pending documentation** -- unsigned session notes, incomplete assessments, overdue treatment plans
6. **RBT supervision queue** -- which supervisees need observation? Which charts need review?
7. **Cancellation/no-show alerts** -- gaps in today's schedule that need rescheduling

**Key insight:** BCBAs think in terms of _client caseload health_ and _team oversight_. They want a "clinical command center" not a financial dashboard.

### What an RBT Needs First Thing

1. **Today's sessions** -- simple list: client name, time, location, session type
2. **Session materials** -- quick access to each client's BIP, current targets, and skill instructions
3. **Last session context** -- what happened last time? Any BCBA notes or updates?
4. **Session timer and data entry** -- start session, collect data, stop session
5. **Pending notes** -- any unsigned session notes from previous days
6. **Communication** -- messages from BCBA about client updates or schedule changes

**Key insight:** RBTs need a _stripped-down, mobile-friendly, session-focused_ interface. Large touch targets, minimal taps. They are actively working with a child -- the software must not compete for attention.

### What a Practice Owner/Admin Needs

1. **Revenue overview** -- today/this week/this month revenue, trend vs. last period
2. **Unbilled sessions** -- how much revenue is sitting in uncoverted sessions?
3. **Claims aging** -- AR by age bucket (0-30, 31-60, 61-90, 90+ days)
4. **Staff utilization** -- billable hours / available hours per provider
5. **Authorization health** -- utilization rates, upcoming expirations, under-utilized authorizations
6. **Cancellation rate** -- target less than 10%, tracked weekly
7. **Billing lag** -- days between service and claim submission (target: 24-48 hours)
8. **Collection rate** -- net collection rate (target: 95%+)
9. **Credential tracking** -- staff credential expirations approaching

**Key insight:** Owners think in terms of _practice health metrics_ and _revenue leakage prevention_. They want trends, not just snapshots.

---

## Dashboard Design Patterns

### Comparison Table

| Feature                       | CentralReach      | AlohaABA      | Theralytics      | Raven Health       | SimplePractice  | Jane App         | Healthie     | TherapyAppt       | Motivity       | Artemis   | Noteable    |
| ----------------------------- | ----------------- | ------------- | ---------------- | ------------------ | --------------- | ---------------- | ------------ | ----------------- | -------------- | --------- | ----------- |
| **Default landing page**      | Dashboard         | Dashboard     | Dashboard        | Dashboard          | Calendar        | Day Sheet        | Dashboard    | Home/Agenda       | Dashboard      | Dashboard | Dashboard   |
| **Today's schedule visible?** | Via Agenda widget | Yes           | No (separate)    | Yes                | Yes (calendar)  | Yes (Day Sheet)  | Via calendar | Yes (top-left)    | Yes (badge)    | Yes       | Yes         |
| **Metric cards/tiles**        | Widget-based      | Widget-based  | Custom charts    | 4 key metrics      | 5 tiles         | 3 modules        | 3+ sections  | 4 sections        | Custom         | 4 KPIs    | Task-driven |
| **Authorization tracking**    | Yes (dedicated)   | Limited       | Yes              | Yes                | N/A             | N/A              | N/A          | N/A               | Yes            | Yes       | Yes         |
| **Unbilled session alerts**   | Yes (icons)       | Yes (widget)  | No               | No                 | Via claims      | No               | No           | No                | No             | No        | Yes         |
| **Financial metrics**         | Via BI add-on     | Yes           | Yes              | Yes                | Yes (5 tiles)   | Permission-gated | Paid tier    | Limited           | Via QuickSight | Yes       | Yes         |
| **Task/to-do list**           | Yes (widget)      | No            | No               | No                 | No              | No               | Yes          | Yes (collapsible) | No             | No        | Yes         |
| **Activity feed**             | No                | No            | No               | No                 | No              | No               | Yes          | No                | No             | No        | No          |
| **Chart/note completion**     | No                | No            | No               | No                 | Yes             | Yes (90-day)     | No           | Yes               | No             | No        | Yes         |
| **Quick add actions**         | Yes               | Yes           | Yes              | Yes                | Yes (drag-drop) | Yes              | Yes          | Limited           | Limited        | Yes       | Yes         |
| **Mobile-optimized**          | No                | No            | No               | Yes (mobile-first) | Yes             | Yes (tablet)     | Yes          | No                | Yes            | No        | Yes         |
| **Custom dashboards**         | Yes (widgets)     | Yes (widgets) | Yes (create new) | No                 | No              | No               | No           | No                | Yes (BI)       | Yes       | No          |
| **Role-based views**          | Yes               | Yes           | No               | No                 | Limited         | Yes              | Limited      | No                | No             | Yes       | No          |
| **Privacy mode**              | No                | No            | No               | No                 | No              | Yes (Shift+P)    | No           | No                | No             | No        | No          |
| **Guided next steps**         | No                | No            | No               | No                 | No              | No               | No           | No                | No             | No        | Yes         |

---

## Common Patterns

These patterns appear across most or all platforms researched:

### 1. Dashboard is the Landing Page (8 of 11)

Most platforms land users on a dashboard, not a calendar. The exceptions (SimplePractice, Jane App) serve solo practitioners who think in terms of "my schedule today." For multi-user ABA practices, a dashboard with schedule context wins.

### 2. Today's Schedule is Always Visible

Whether as a dedicated widget, a sidebar, or the full page -- every platform surfaces today's appointments prominently. This is the single most important piece of information when a clinician opens the software.

### 3. Widget/Card-Based Layout

Every modern platform uses some form of cards, tiles, or widgets to organize dashboard information. Typically 3-5 key metric cards at the top, with detailed sections below.

### 4. Sidebar Navigation

Left sidebar is the dominant navigation pattern for practice management software. Typical order:

1. Dashboard / Home
2. Schedule / Calendar
3. Clients / Patients
4. Sessions / Appointments
5. Authorizations (ABA-specific)
6. Billing / Claims
7. Reports / Analytics
8. Settings

### 5. Action-Oriented Design

Dashboards surface things that need attention, not just data. Unbilled sessions, unsigned notes, expiring authorizations -- the best dashboards are to-do lists disguised as dashboards.

### 6. Date Range Filtering

Financial and operational metrics are always filterable by date range (today, this week, this month, custom range).

### 7. Color-Coding for Status

Consistent use of color to indicate status: green = complete/good, yellow/amber = warning/needs attention, red = overdue/critical. Applied to appointments, chart completion, authorization utilization.

---

## Differentiators

What separates the _best_ dashboards from the mediocre ones:

### 1. Guided Workflow (Noteable)

Instead of just showing data, Noteable tells you _what to do next and where to go_. This is the most powerful pattern for reducing cognitive load. Most platforms show you a wall of data; the best ones tell you the single most important thing to do right now.

### 2. Exception-Based Alerting (Artemis, Motivity)

Only surface problems. Don't show "12 sessions completed today" -- show "3 sessions have no notes" or "2 authorizations under 20% utilization." Happy paths don't need dashboard space.

### 3. Privacy Mode (Jane App)

Shift+P to instantly obfuscate all patient names. Essential for screen sharing, working in public spaces, or quick demos. No other platform has this.

### 4. Projected Revenue (SimplePractice)

Not just "what did we earn" but "what will we earn next month" based on scheduled appointments and historical reimbursement rates. Forward-looking metrics are rare and valuable.

### 5. Personal vs. Organization Scope (AlohaABA)

"My Unbilled Sessions" vs. "Unbilled Sessions" -- same widget, different scope. Simple naming convention that solves the "whose data am I looking at?" problem elegantly.

### 6. Mobile-First with Offline (Raven Health)

Designed for the field first, desktop second. Offline data collection with seamless sync. Critical for RBTs who work in homes with poor connectivity.

### 7. Activity Feed with Social Engagement (Healthie)

Client activity as a scrollable feed with reactions and comments. Creates a sense of connection and makes monitoring feel natural rather than clinical.

### 8. Chart Status as Behavioral Nudge (Jane App)

Showing the distribution of signed/drafted/never-started charts for the past 90 days creates accountability without micromanagement. Practitioners self-correct when they see their completion rates.

---

## Recommendations for Clinivise

### Design Philosophy

**"Action-first dashboard, not a data dashboard."**

Every element on the Clinivise dashboard should either (a) answer "what do I need to do right now?" or (b) tell the user something is wrong that needs fixing. If a metric is green and normal, it should take up minimal space. Abnormal metrics should expand and demand attention.

### Landing Page: Role-Adaptive Dashboard

The dashboard should be the landing page for ALL roles, but the content adapts based on role:

**BCBA View:** Caseload-focused
**RBT View:** Session-focused (almost just today's schedule)
**Admin/Owner View:** Practice health metrics

### Recommended Layout (BCBA / Default View)

```
+-----------------------------------------------------------------------+
|  HEADER: Page title "Dashboard" + Date (Today, Mar 21) + Quick Actions |
|  Quick Actions: [+ New Session] [+ New Client] [Schedule]             |
+-----------------------------------------------------------------------+
|                                                                        |
|  ROW 1: 4 Metric Cards (horizontal, equal width)                      |
|  +----------------+ +----------------+ +----------------+ +-----------+|
|  | Sessions Today | | Pending Notes  | | Auth Alerts    | | Util Rate ||
|  | 6 scheduled    | | 3 unsigned     | | 2 expiring     | | 78%       ||
|  | 1 completed    | | [red if >0]    | | 1 over 90%     | | avg across ||
|  | 0 canceled     | |                | |                | | caseload  ||
|  +----------------+ +----------------+ +----------------+ +-----------+|
|                                                                        |
|  ROW 2: Two-column layout                                              |
|  +------------------------------------+ +-----------------------------+|
|  | TODAY'S SCHEDULE                    | | ACTION ITEMS                ||
|  | (timeline/agenda view)             | | (prioritized to-do list)    ||
|  |                                    | |                             ||
|  | 8:00  Client A - Direct (97153)   | | ! Auth expiring in 7 days   ||
|  |       RBT: Sarah M.               | |   Client D - Aetna          ||
|  |       [In Progress]               | |   [Renew Auth]              ||
|  |                                    | |                             ||
|  | 10:00 Client B - Supervision      | | ! 3 session notes unsigned  ||
|  |       (97155)                      | |   Mar 18 (2), Mar 19 (1)   ||
|  |       [Upcoming]                  | |   [Review Notes]            ||
|  |                                    | |                             ||
|  | 1:00  Client C - Assessment       | | Auth utilization < 50%      ||
|  |       (97151)                      | |   Client E - 38% used      ||
|  |       [Upcoming]                  | |   62% of period elapsed     ||
|  |                                    | |   [View Auth]               ||
|  | 3:00  Parent Training - Client A  | |                             ||
|  |       (97156)                      | | Credential expiring         ||
|  |       [Upcoming]                  | |   RBT cert - Sarah M.       ||
|  |                                    | |   Expires Apr 15            ||
|  +------------------------------------+ +-----------------------------+|
|                                                                        |
|  ROW 3: Authorization Health (full width)                              |
|  +--------------------------------------------------------------------+|
|  | AUTHORIZATION OVERVIEW                               [View All →]  ||
|  |                                                                    ||
|  | Client    | Payer    | CPT   | Used/Approved | Util% | Expires    ||
|  | Client A  | BCBS    | 97153 | 28/40 units   | 70%   | Apr 30     ||
|  | Client B  | Aetna   | 97153 | 38/40 units   | 95%   | May 15     ||
|  | Client D  | Aetna   | 97153 | 8/40 units    | 20%   | Apr 10     ||
|  | Client E  | UHC     | 97153 | 15/40 units   | 38%   | Jun 01     ||
|  |                                                                    ||
|  | [Only showing authorizations needing attention. 12 total healthy.] ||
|  +--------------------------------------------------------------------+|
|                                                                        |
+-----------------------------------------------------------------------+
```

### Recommended Layout (Admin/Owner View)

```
+-----------------------------------------------------------------------+
|  HEADER: "Practice Overview" + Date Range Selector                     |
|  [Today] [This Week] [This Month] [Custom]                           |
+-----------------------------------------------------------------------+
|                                                                        |
|  ROW 1: 4 Financial Metric Cards                                      |
|  +----------------+ +----------------+ +----------------+ +-----------+|
|  | Revenue (MTD)  | | Unbilled       | | Collection     | | Billing   ||
|  | $42,350        | | Sessions       | | Rate           | | Lag       ||
|  | +12% vs last   | | 14 sessions    | | 96.2%          | | 1.8 days  ||
|  | month          | | ~$2,100 est.   | | [green]        | | [green]   ||
|  +----------------+ +----------------+ +----------------+ +-----------+|
|                                                                        |
|  ROW 2: 4 Operational Metric Cards                                    |
|  +----------------+ +----------------+ +----------------+ +-----------+|
|  | Staff Util     | | Cancellation   | | Auth Util      | | Active    ||
|  | Rate           | | Rate           | | (Avg)          | | Clients   ||
|  | 82%            | | 7.2%           | | 76%            | | 34        ||
|  | [green]        | | [green <10%]   | | [amber]        | | +3 this mo||
|  +----------------+ +----------------+ +----------------+ +-----------+|
|                                                                        |
|  ROW 3: Two-column layout                                              |
|  +------------------------------------+ +-----------------------------+|
|  | REVENUE TREND                       | | CLAIMS STATUS              ||
|  | (line chart, last 6 months)        | | (stacked bar or donut)     ||
|  |                                    | |                             ||
|  | $50k ┌──────────────────┐         | | Paid: 142                   ||
|  |      │    ╱──╲   ╱──    │         | | Pending: 23                 ||
|  | $40k │   ╱    ╲─╱       │         | | Denied: 4                   ||
|  |      │  ╱                │         | | Rejected: 1                 ||
|  | $30k │ ╱                 │         | |                             ||
|  |      └──────────────────┘         | | Denial rate: 2.4%           ||
|  |      Oct Nov Dec Jan Feb Mar      | | [View Claims →]             ||
|  +------------------------------------+ +-----------------------------+|
|                                                                        |
|  ROW 4: Action Items (full width, same as BCBA view)                  |
|  +--------------------------------------------------------------------+|
|  | NEEDS ATTENTION                                                    ||
|  | ! 14 unbilled sessions (oldest: 5 days ago)          [Convert All]||
|  | ! 2 authorizations expiring within 14 days            [View Auths]||
|  | ! 1 staff credential expiring within 30 days          [View Staff]||
|  | ! 4 denied claims need resubmission                    [View Claims]||
|  +--------------------------------------------------------------------+|
|                                                                        |
+-----------------------------------------------------------------------+
```

### Recommended Layout (RBT View)

```
+-----------------------------------------------------------------------+
|  HEADER: "My Sessions" + Today's Date                                  |
+-----------------------------------------------------------------------+
|                                                                        |
|  ROW 1: Simple Stats (2 cards only)                                   |
|  +------------------------------------+ +-----------------------------+|
|  | Sessions Today: 4                  | | Pending Notes: 1            ||
|  | 1 completed, 3 upcoming            | | From Mar 19 [Write Note]    ||
|  +------------------------------------+ +-----------------------------+|
|                                                                        |
|  ROW 2: Today's Session List (full width, large touch targets)        |
|  +--------------------------------------------------------------------+|
|  | ✓ 8:00-10:00  Client A  |  97153  |  Home  |  [View Note]         ||
|  |─────────────────────────────────────────────────────────────────────||
|  | → 10:30-12:30 Client B  |  97153  |  Clinic | [Start Session]     ||
|  |─────────────────────────────────────────────────────────────────────||
|  |   1:30-3:30   Client C  |  97153  |  Home   |                     ||
|  |─────────────────────────────────────────────────────────────────────||
|  |   4:00-5:00   Client A  |  97155  |  Clinic | (Supervision)       ||
|  +--------------------------------------------------------------------+|
|                                                                        |
|  [Large session cards. Each row: min-h-16. Tap to expand for          |
|   BIP summary, last session notes, BCBA instructions]                 |
|                                                                        |
+-----------------------------------------------------------------------+
```

### Metric Card Specifications

Each metric card should follow this structure:

- **Size:** Equal width, 4 per row on desktop, 2 per row on tablet, 1 per row on mobile
- **Height:** Fixed height (~120px) for visual consistency
- **Content:**
  - Label (text-xs font-medium text-muted-foreground)
  - Value (text-2xl font-semibold tabular-nums)
  - Trend/context (text-xs text-muted-foreground, with emerald/red for up/down)
- **Color coding:** Border-left or subtle background tint for status (emerald = healthy, amber = warning, red = critical)
- **Interaction:** Clickable -- navigates to the relevant detail page

### Navigation Sidebar Items (Phase 1)

Based on research, Clinivise should use this sidebar order:

1. **Dashboard** (home icon) -- role-adaptive landing page
2. **Schedule** (calendar icon) -- calendar view with day/week/month
3. **Clients** (people icon) -- client list and detail pages
4. **Providers** (user-badge icon) -- staff/provider management
5. **Authorizations** (shield-check icon) -- auth tracking and utilization
6. **Sessions** (clock icon) -- session log and management
7. **Reports** (chart icon) -- analytics and reporting (Phase 1: basic)

**Phase 2 additions (below a divider):** 8. **Billing** (dollar icon) -- claims, ERA, payments 9. **Settings** (gear icon) -- practice settings, integrations

### Key ABA-Specific KPIs to Surface

Based on industry research, these are the metrics that matter most:

| KPI                            | Target           | Alert Threshold    | Dashboard Location        |
| ------------------------------ | ---------------- | ------------------ | ------------------------- |
| Authorization utilization      | 85-95%           | <50% or >95%       | BCBA + Admin metric card  |
| Cancellation rate              | <10%             | >10% weekly        | Admin metric card         |
| Billing lag (days to submit)   | <2 days          | >3 days            | Admin metric card         |
| Net collection rate            | >95%             | <90%               | Admin metric card         |
| Staff utilization (billable %) | 75-85%           | <70% or >90%       | Admin metric card         |
| Unsigned session notes         | 0                | >0                 | BCBA + RBT metric card    |
| Expiring authorizations        | 0 within 14 days | Any within 14 days | BCBA + Admin action items |
| Revenue per session (avg)      | Varies by payer  | Declining trend    | Admin trend chart         |
| Treatment plan adherence       | >90%             | <80%               | BCBA view (Phase 2)       |

### Implementation Priority

1. **Sprint MVP:** 4 metric cards + today's schedule + action items list (BCBA view)
2. **Sprint +1:** Admin/owner view with financial metrics
3. **Sprint +2:** RBT simplified view, mobile optimization
4. **Sprint +3:** Trend charts, date range filtering, authorization health table
5. **Future:** Customizable widgets, projected revenue, chart completion tracking

### Design Principles (from Research)

1. **5-9 metrics per screen maximum** -- cognitive load research supports this limit
2. **Exception-based alerting** -- show problems, not happy paths
3. **Progressive disclosure** -- metric cards summarize, click to expand/navigate
4. **Consistent color language** -- emerald (good), amber (watch), red (act now)
5. **Action verbs on CTAs** -- "Renew Auth" not "View", "Write Note" not "Notes"
6. **Personal scope by default** -- show "my" data first, org data on demand
7. **Today-first, then expand** -- default to today, allow date range expansion
8. **Mobile-friendly touch targets** -- min 44px height on all interactive elements

---

## Sources

### ABA-Specific Platforms

- [CentralReach - ABA Practice Management](https://centralreach.com/products/aba-practice-management-software/)
- [CentralReach - Available Dashboard Widgets](https://community.centralreach.com/s/article/knowledge-available-widgets-in-my-dashboard)
- [CentralReach - Authorization Utilization Dashboard](https://community.centralreach.com/s/article/knowledge-the-authorization-utilization-hour-based-dashboard)
- [CentralReach - Navigating CentralReach](https://help.centralreach.com/navigating-centralreach/)
- [CentralReach - Convert Appointments from Dashboard](https://help.centralreach.com/convert-appointments-from-the-dashboard-module/)
- [CentralReach Essentials](https://essentials.centralreach.com/)
- [AlohaABA - My Dashboard](https://support.alohaaba.com/portal/en/kb/articles/dashboard-9-11-2022)
- [AlohaABA - Features](https://alohaaba.com)
- [Theralytics - ABA Practice Management](https://www.theralytics.net/)
- [Theralytics - Reporting & Analytics](https://www.theralytics.net/aba-reporting-and-analytics-software)
- [Raven Health - 4 Key Metrics for ABA Practices](https://ravenhealth.com/blog/aba-practice-metrics-to-track/)
- [Raven Health - Practice Management](https://ravenhealth.com/key-features-practice-management/)
- [Motivity - ABA Practice Management KPIs](https://www.motivity.net/blog/aba-practice-management-kpi)
- [Motivity - ABA Practice Management Features](https://www.motivity.net/blog/aba-practice-management-software-features)
- [Artemis ABA - Product Summary](https://www.artemisaba.com/artemis-product-summary)
- [Noteable - ABA Practice Management](https://mynoteable.com/aba)
- [Measure PM - ABA Practice Management](https://measurepm.com/)

### General Practice Management

- [SimplePractice - Analytics Dashboard](https://support.simplepractice.com/hc/en-us/articles/7796201723789-Understanding-your-Analytics-dashboard-and-reports)
- [SimplePractice - Calendar Navigation](https://support.simplepractice.com/hc/en-us/articles/207625726-Navigating-your-calendar)
- [Jane App - Practitioner Dashboard Explained](https://jane.app/guide/the-practitioner-dashboard-explained)
- [Jane App - Practitioner Dashboard for Clinic Owners](https://jane.app/guide/the-practitioner-dashboard-for-clinic-owners)
- [Healthie - Provider Dashboard](https://help.gethealthie.com/article/535-your-provider-dashboard)
- [Healthie - Provider Utilization Dashboard](https://www.gethealthie.com/blog/product-spotlight-provider-utilization-dashboard)
- [Healthie - Reporting Dashboards](https://help.gethealthie.com/article/729-reporting-dashboards)
- [TherapyAppointment - Home Dashboard](https://support.therapyappointment.com/article/229-dashboard)

### Dashboard Design Best Practices

- [Healthcare Dashboard Design Best Practices - FuseLab Creative](https://fuselabcreative.com/healthcare-dashboard-design-best-practices/)
- [Best Practices in Healthcare Dashboard Design - Thinkitive](https://www.thinkitive.com/blog/best-practices-in-healthcare-dashboard-design/)
- [Healthcare Dashboard Examples - Arcadia](https://arcadia.io/resources/healthcare-dashboard-examples)
- [UX/UI Best Practices for Healthcare Analytics Dashboards - Sidekick](https://www.sidekickinteractive.com/designing-your-app/uxui-best-practices-for-healthcare-analytics-dashboards/)

### ABA Practice KPIs & Workflows

- [Top KPIs to Track in ABA Practice Management - Motivity](https://www.motivity.net/blog/aba-practice-management-kpi)
- [Top KPIs in ABA Practice Management - LeadSquared](https://www.leadsquared.com/us/industries/healthcare/kpis-to-track-in-aba-practice-management/)
- [ABA Practice Management Tasks - ABA Matrix](https://www.abamatrix.com/aba-practice-management-software-tasks/)
- [RBT Software Tools - Artemis ABA](https://www.artemisaba.com/rbt)
- [BCBA Software Tools - Artemis ABA](https://www.artemisaba.com/bcba)
- [Effective ABA Software for RBTs - ABA Smart](https://abasmart.net/blog/effective-aba-software-for-rbts)
