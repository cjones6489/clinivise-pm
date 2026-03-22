# Authorization Lifecycle UX Research: System-Wide Integration Patterns

> Sprint 2D supplemental research. Focuses on how authorization data should permeate the entire product — not live on a single page — and the UX patterns that make this feel natural rather than noisy.
>
> Researched: 2026-03-21
>
> Companion documents:
> - [`authorization-tracking-ux-research.md`](authorization-tracking-ux-research.md) — Component-level patterns, alerting, AI features, mobile UX
> - [`authorization-tracking-competitive-research.md`](authorization-tracking-competitive-research.md) — Competitor deep dives, user complaints, differentiation opportunities

---

## Table of Contents

1. [Authorization as a System-Wide Concern](#1-authorization-as-a-system-wide-concern)
2. [Progressive Disclosure Across Contexts](#2-progressive-disclosure-across-contexts)
3. [Integration Touchpoints](#3-integration-touchpoints)
4. [Authorization Health Score](#4-authorization-health-score)
5. [Re-Authorization Workflow UX](#5-re-authorization-workflow-ux)
6. [Timeline and History Visualization](#6-timeline-and-history-visualization)
7. [Mobile/Tablet Authorization Experience](#7-mobiletablet-authorization-experience)
8. [Synthesis: The Authorization Data Layer](#8-synthesis-the-authorization-data-layer)

---

## 1. Authorization as a System-Wide Concern

### The Core Insight: Authorization Is Not a Page, It Is a Lens

The biggest UX mistake in ABA practice management software (CentralReach, AlohaABA, Motivity) is treating authorization as a module — a page you navigate to, a tab you click, a report you run. This forces clinicians to context-switch away from their work to check authorization status.

The best SaaS tools take a different approach: quota/limit/budget data surfaces *where you are*, not *where it lives*.

### 1A. Stripe: Usage Limits as Ambient Context

**How they do it:**
- Stripe's billing credits maintain a running ledger visible at multiple touchpoints — the dashboard summary, the customer detail page, and the invoice preview all show the same credit balance, adapted to each context.
- Usage-based billing shows real-time consumption on the Meters page, and threshold-based webhooks trigger when customers approach depletion. But the key UX insight is that the *customer portal* itself shows usage data — the customer never needs to ask "how much have I used?"
- Stripe doesn't hide usage on a "Usage" page. It surfaces it on invoices ("usage this period: X"), on the dashboard ("approaching threshold"), and on the customer detail page ("credit balance: Y").

**Pattern for Clinivise:**
Authorization utilization should appear:
- On the client profile (not hidden in a tab — visible in the header area)
- On the session logging form (remaining units for the selected auth)
- On the scheduling calendar (constraint warnings when creating appointments)
- On the dashboard (aggregated health across all clients)
- On the authorization detail page (full breakdown — this is the *only* place you go for depth)

The authorization detail page is the drill-down destination, not the primary surface.

**Sources:** [Stripe Billing Credits](https://stripe.com/blog/introducing-credits-for-usage-based-billing), [Stripe Usage-Based Billing](https://docs.stripe.com/billing/subscriptions/usage-based), [Stripe Thresholds](https://docs.stripe.com/billing/subscriptions/usage-based/thresholds)

---

### 1B. Linear: Capacity Data Embedded in Every View

**How they do it:**
- Linear's cycle capacity dial appears on the cycles view, showing whether the team is likely to complete all issues. Capacity is calculated from the velocity of the previous three completed cycles.
- The sidebar (Cmd/Ctrl+I) on *any* cycle view shows distribution of work across the team — total issue count, percentage completion per assignee, scope changes since cycle start.
- **Insights are attached to every view across the app** — whatever list of issues you are currently seeing, the insights panel illustrates that specific slice. There is no separate "analytics" page that shows different data.

**Pattern for Clinivise:**
- The authorization "capacity" (remaining units) should be visible wherever authorization-related data appears — not just on the auth detail page.
- When viewing a client's sessions, show the auth utilization for the relevant period in a sidebar or header.
- When viewing the scheduling calendar, show remaining units for the selected client/date range.
- The dashboard "insights" should reflect the currently-filtered view (e.g., filter by BCBA to see their caseload's auth health).

**Sources:** [Linear Cycles](https://linear.app/docs/use-cycles), [Linear Insights](https://linear.app/features/insights), [Linear Changelog: Cycle Capacity](https://linear.app/changelog/2022-09-22-cycles-and-graph-improvements)

---

### 1C. Notion: Same Data, Many Views, Global Filters

**How they do it:**
- Notion's linked databases let you show the same source data across multiple locations. Each linked view has its own filters, sorts, and layout — but changes to the underlying data reflect everywhere.
- The new Dashboard view (March 2026) acts as a container for multiple sub-views with global filters. Pick a project, and every chart/table/board filters to show only that project's data.
- A master "Tasks" database can appear as: a Kanban board on a team page, a calendar on a planning page, a filtered list on a personal dashboard, and a chart on an executive summary — all from the same data source.

**Pattern for Clinivise:**
Authorization data is a single source of truth (the `authorizations` + `authorization_services` tables), but it should appear in multiple contexts:

| Context | View | Filter | Detail Level |
|---------|------|--------|-------------|
| Dashboard overview | Aggregated alerts widget | Org-wide, severity-sorted | Alert only (count + CTA) |
| Client detail page | Auth summary cards | This client's active auths | Utilization bars per service line |
| Session logging form | Auth picker cards | This client, today's date in range | Remaining units + status badge |
| Scheduling calendar | Inline constraint indicators | This client, selected date | "12 units remaining" or "Auth expires before session" |
| Authorization list page | Full data table | Filterable by status, client, payer, date | All columns, sortable |
| Authorization detail page | Tabbed detail view | Single authorization | Everything: services, sessions, docs, timeline |
| Sidebar nav | Badge count | Unresolved alerts | Number only |

**Sources:** [Notion Linked Databases](https://www.notion.com/help/guides/using-linked-databases), [Notion Dashboard Views (March 2026)](https://www.notion.com/releases/2026-03-10), [Notion Views, Filters, Sorts](https://www.notion.com/help/views-filters-and-sorts)

---

### 1D. Mercury: Budget Constraints Surfaced at Point of Action

**How they do it:**
- Mercury shows card spending limits, category locks, and budget tracking at the point of transaction — not just on a settings page. When a card has a category lock, transactions outside those categories are automatically declined with an explanatory message.
- Expense management consolidates employee expenses, cards, bills, and incoming transactions in one place for cross-referencing. The dashboard highlights insights (not raw data), using progress bars for budget proximity.

**Pattern for Clinivise:**
Authorization constraints should be enforced and communicated at the point of action:
- **Scheduling**: When booking a session that would exceed remaining units or fall outside the auth date range, show an inline warning *before* the user submits — not after a failed claim.
- **Session logging**: If logging a session that exceeds remaining units, show a blocking dialog (configurable: warn vs. hard block).
- **Claims generation (Phase 2)**: Auto-populate auth number on claims. Validate auth validity before submission.

The constraint is the message. Every "you can't do this" moment is also "here's why and what to do instead."

**Sources:** [Mercury Expense Management](https://support.mercury.com/hc/en-us/articles/43590602733972-Getting-started-with-expense-management), [Mercury Category Locked Cards](https://support.mercury.com/hc/en-us/articles/31669993068564-Creating-and-managing-category-locked-cards)

---

### 1E. Carbon Design System: Contextual Status Indicators

**How they do it:**
IBM's Carbon Design System defines a rigorous taxonomy for status indicators:
- **Icon indicators** ("contextual" indicators) are linked to specific UI elements and placed near those elements.
- **Severity levels** (high/medium/low attention) determine visual treatment — high-severity prompts immediate action, low-severity allows passive response.
- **Color palette with semantic meaning**: red = danger/error, orange = serious warning, yellow = regular warning, green = success, blue = informational, gray = draft/not started, purple = outlier/undefined.
- **Triple encoding for accessibility**: shape + color + text label. At least three of four elements (icon, shape, color, text) must be present for WCAG compliance.
- **Conditional presence**: indicators appear or change based on conditions — they are not always visible.

**Pattern for Clinivise:**
Authorization status indicators should follow the Carbon pattern:
- Use **contextual placement** — the status indicator appears next to the element it describes (next to a client name, next to a date field, next to a unit count).
- Use **severity-driven styling** — critical alerts (expiring in 7 days, over-utilized) get high-attention treatment (red, icon, text). Informational status (active, healthy utilization) gets low-attention treatment (green dot, small text).
- Use **conditional display** — don't show a "healthy" badge on every authorization. Only show indicators when they communicate something the user needs to know. Absence of an indicator = everything is fine.

**Sources:** [Carbon Design System Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/), [Carbon Status Indicators v10](https://v10.carbondesignsystem.com/patterns/status-indicator-pattern/)

---

## 2. Progressive Disclosure Across Contexts

### The Framework: Different Detail Levels for the Same Data

Nielsen Norman Group defines progressive disclosure as deferring advanced information to secondary screens. The key insight for authorization data: **every touchpoint shows exactly the right amount of detail for that context — no more, no less.**

Hypertext provides a natural implementation: higher-level pages show simplified descriptions; lower-level pages fill in details. Multiple levels of progressive disclosure are not just acceptable — they are necessary for complex data like authorization utilization.

### 2A. Four-Tier Authorization Disclosure Model

Based on research across Stripe, Linear, Notion, Carbon, and healthcare PM tools, authorization data in Clinivise should follow a four-tier disclosure model:

**Tier 1: Ambient Indicator (peripheral awareness)**
- **Where**: Sidebar nav badge, dashboard alert count, client list status dot
- **What**: A number or color that says "something needs attention" without specifying what
- **Example**: Red badge "3" on the Authorizations nav item. Amber dot next to a client name in the client list.
- **Interaction**: Click to navigate to the relevant detail level
- **Design**: Badge pill (shadcn Badge), dot indicator (4px circle with color), or count chip

**Tier 2: Contextual Summary (working context)**
- **Where**: Session form auth picker, scheduling calendar inline, client detail header
- **What**: The minimum information needed to make a decision in the current workflow
- **Example on session form**: Card showing "Blue Cross | 97153 | 12 of 40 units remaining" with an emerald/amber/red border
- **Example on client detail**: Summary card with utilization bar, status badge, expiry countdown
- **Example on calendar**: Tooltip or inline text: "Auth expires Jun 7 — 12 units remaining"
- **Interaction**: Click to navigate to the authorization detail page
- **Design**: Compact card, inline text with badge, tooltip

**Tier 3: Focused Detail (management context)**
- **Where**: Authorization list page, dashboard widgets
- **What**: Enough detail to triage and prioritize across multiple authorizations
- **Example on auth list**: Table row with client name, status badge, utilization percentage + bar, expiry date, payer
- **Example on dashboard**: "3 authorizations expiring this week" with severity-sorted cards showing client name, days remaining, utilization status
- **Interaction**: Click row/card to navigate to full detail
- **Design**: Data table with column priority hiding, alert widgets with card lists

**Tier 4: Full Detail (deep dive context)**
- **Where**: Authorization detail page (tabbed)
- **What**: Everything — service lines, session history, documents, timeline, burndown projection, re-auth actions
- **Example**: Full detail page with header card (status, dates, utilization bar, actions) + tabs (Overview, Services, Sessions, Documents, Timeline)
- **Interaction**: Edit, re-authorize, upload documents, review sessions
- **Design**: Header card + tabbed content area

### 2B. Who Sees What: Role-Based Disclosure

Progressive disclosure should also be role-aware. Different roles need different default detail levels:

| Role | Primary Auth Interactions | Default Disclosure Tier | What They Don't Need |
|------|--------------------------|------------------------|---------------------|
| **RBT** | Session logging (select auth, see remaining units) | Tier 2 (contextual summary) | Auth numbers, payer details, billing rates, financial projections |
| **BCBA** | Client oversight (utilization trends, expiry warnings, re-auth decisions) | Tier 3 (focused detail) | Individual session-level billing details |
| **Billing Staff** | Auth management (create, edit, monitor utilization, claims validation) | Tier 4 (full detail) | Clinical session notes |
| **Admin/Owner** | Practice-wide oversight (aggregated health, revenue at risk) | Tier 1 + Tier 3 (ambient + dashboard) | Individual service line details |

**Sources:** [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/), [Progressive Disclosure in SaaS (Lollypop)](https://lollypop.design/blog/2025/may/progressive-disclosure/), [Userpilot Progressive Disclosure Examples](https://userpilot.com/blog/progressive-disclosure-examples/)

---

## 3. Integration Touchpoints

### 3A. Scheduling: Authorization Constraints as Guard Rails

**Industry pattern:**
Passage Health's scheduler automatically checks insurance authorizations and prevents booking beyond approved hours. ABA Matrix monitors remaining authorized units in real time with calendar integration, alerting when authorizations approach expiration. CentralReach's algorithm-powered scheduler considers authorized service hours alongside drive time and technician availability.

**What the best tools do:**
- **Pre-validation**: Before a booking is confirmed, check: (a) is there an active auth for this client on this date? (b) does the auth cover the selected CPT code? (c) are there enough remaining units? (d) does the auth expire before the session date?
- **Inline warnings** (not post-hoc errors): Hub Planner's warning system displays pop-ups when overbooking is about to occur during the scheduling process. The warning analyzes current workload and compares it against new bookings being assigned.
- **Two modes**: "Display warning" (allow override with reason) vs. "Disabled" (prevent the booking entirely). The mode should be configurable per practice.

**Clinivise implementation:**
When creating/editing an appointment:
1. **No active auth**: Yellow banner — "No active authorization found for [Client] on [Date]. Session may not be billable." CTA: "Create Authorization"
2. **Auth expires before session**: Amber banner — "Authorization expires [Date], before this session on [Date]." CTA: "View Authorization"
3. **Insufficient units**: Red banner — "Only 3 units remaining on this authorization. This session requires 4 units." CTA: "View Authorization" or "Schedule Anyway" (with override reason, logged to audit trail)
4. **All clear**: Green check (subtle, not a banner) — "Authorization verified: 12 units remaining"

The "all clear" state should be the *quietest* — absence of warnings is the positive signal. This prevents "banner blindness" from always showing green success messages.

**Sources:** [Passage Health ABA Scheduling](https://www.passagehealth.com/blog/aba-scheduler-software), [ABA Matrix Authorization Management](https://www.abamatrix.com/aba-authorization-management/), [Hub Planner Overbooking Prevention](https://hubplanner.com/preventing-resource-over-booking-with-a-new-built-in-warning-system/)

---

### 3B. Session Logging: Authorization as First-Class Context

**Industry pattern:**
TherapyLake displays units in real time — used, reserved, and remaining — broken down by service code. Clinics can click in to view which sessions used specific units. CentralReach's CR Mobile guides RBTs through sessions with a built-in interface, though authorization data is not prominently displayed during session entry.

**What makes a great session form auth experience:**

1. **Auto-select the correct authorization**: When an RBT selects a client and CPT code, the system should automatically select the best-matching active authorization (FIFO — oldest expiration first, matching the CPT code, with remaining units). Manual override available.

2. **Show remaining units prominently**: Not in a tooltip, not in a secondary panel — directly on the session form. "97153 | Blue Cross | 12 of 40 units remaining" with a utilization bar.

3. **Warn before exceeding**: If the session would consume the last units or exceed remaining units, show a clear warning *before* the user submits:
   - "This session (4 units) will use the last remaining units on this authorization."
   - "This session (4 units) exceeds the 3 remaining units on this authorization. [Log Anyway] [Choose Different Auth]"

4. **Confirmation feedback**: After saving, confirm the deduction: "Session saved. 8 of 40 units remaining on AUTH-2026-001."

**Clinivise implementation:**
The `AuthorizationPicker` component (already specced in companion research) should be a card-based sheet — not a dropdown. Each card shows:
- Payer name + auth number (small text)
- Date range with visual remaining-time indicator
- Utilization bar per relevant CPT code
- "12 of 40 units remaining" (large text, `text-sm font-semibold tabular-nums`)
- Green/amber/red left border based on utilization status
- Auto-selected card has a visible check mark and elevated border

**Sources:** [TherapyLake Authorization Tracking](https://blog.therapylake.com/aba-billing-authorization-automation/), [CentralReach CR Mobile](https://centralreach.com/products/cr-mobile/)

---

### 3C. Client Detail: Authorization as a Prominent Section

**Industry pattern:**
CentralReach buries authorization data in the Billing module — clinicians must navigate away from the client context to check auth status. Healthie's client profile uses collapsible sections that let team members hide what they don't need, but this can lead to authorization status being collapsed and invisible.

**What the best tools do differently:**
Authorization status should be one of the first things visible on a client profile — not hidden in a tab, not collapsed by default. It is *contextual to the client* and *critical to every interaction with that client*.

**Clinivise implementation:**
On the client detail page, authorization data should appear in two places:

1. **Client header area** (always visible, above tabs):
   - If the client has an active auth: Compact summary — "Active Auth | Blue Cross | Expires Jun 7 (23d) | 12/40 units (30%)" with utilization color indicator
   - If the client has an expiring auth: Amber/red warning — "Auth expires in 7 days | 3 units remaining" with CTA "Re-authorize"
   - If the client has no active auth: Red warning — "No active authorization" with CTA "Create Authorization"
   - If multiple active auths: Show the most urgent (lowest remaining units or nearest expiry) with a "+2 more" link

2. **Authorizations tab** (within client detail tabs):
   - Card list of all authorizations for this client (active, expiring, expired)
   - Each card: status badge, payer, date range, overall utilization bar, service line breakdown
   - Sorted by: active first, then expiring, then expired (reverse chronological within each group)

The header summary acts as Tier 2 (contextual summary). The tab acts as Tier 3 (focused detail). Clicking any card navigates to the authorization detail page (Tier 4).

**Sources:** [CentralReach Authorization Management](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/), [Healthie Client Profile Overview](https://help.gethealthie.com/article/1249-client-profile-overview)

---

### 3D. Dashboard: Aggregated Authorization Health

**Industry pattern:**
Healthcare RCM dashboards provide real-time visibility into authorization compliance, denial rates, and revenue at risk. Pre-authorization compliance tracking is an essential KPI. Portfolio dashboards aggregate project-level issues into a single view to identify systemic threats.

**What to show on the Clinivise dashboard:**

**Widget 1: Authorization Alerts** (severity-sorted, max 5 visible)
- Over-utilized authorizations (>100%) — red
- Near-exhaustion (>95%) — red
- Expiring within 7 days — red
- High utilization (80-94%) — amber
- Expiring within 14-30 days — amber
- Under-utilized with >50% of period elapsed — amber
- Each alert: client name, payer, specific issue, CTA ("View Auth", "Re-authorize", "Adjust Schedule")

**Widget 2: Revenue at Risk** (aggregated financial impact)
- "Revenue at risk" is a concept borrowed from financial dashboards: the dollar value of services that may not be billable due to authorization issues.
- Calculate: (scheduled but not-yet-billed sessions) x (per-unit rate) for authorizations that are expiring, over-utilized, or have no remaining units
- Display as a single metric with sparkline trend: "$2,340 at risk from 3 authorizations"
- This is powerful because it translates clinical data into financial impact — admins and owners respond to dollar amounts more urgently than unit counts

**Widget 3: Utilization Overview** (practice-wide)
- Distribution chart: how many authorizations are in each utilization band (0-50%, 50-80%, 80-95%, 95%+)
- Or simplified: "12 on track | 3 under-utilizing | 2 over-utilizing | 1 expiring"

**Sources:** [Healthcare Dashboard Examples (Folio3)](https://data.folio3.com/blog/healthcare-dashboard-examples/), [Revenue Cycle Dashboards (Azalea Health)](https://azaleahealth.com/blog/revenue-cycle-reporting-tips/), [Healthcare KPI Dashboards (Medical Advantage)](https://www.medicaladvantage.com/blog/managing-your-portfolio-with-healthcare-kpi-dashboards/)

---

### 3E. Claims Generation (Phase 2): Authorization as Validation Layer

**Industry pattern:**
Passage Health's billing software automatically populates billing records with correct CPT codes, units, and dates from scheduled sessions. AlohaABA alerts staff to missing pre-authorizations before claim submission.

**Clinivise implementation (Phase 2):**
- Auto-populate auth number on claims from the linked session's authorization
- Pre-submission validation checklist:
  - Is the authorization active on the date of service?
  - Does the CPT code match an authorized service line?
  - Were units within the authorized limit at the time of service?
  - Is the rendering provider credentialed with the payer?
- Block submission if critical validations fail; warn (with override) for soft validations

---

## 4. Authorization Health Score

### 4A. The Concept: A Single Number for Complex Status

**Inspiration: Gainsight Customer Health Scores**

Gainsight consolidates multiple inputs (product usage, support history, NPS, engagement) into a single score visualized as red/yellow/green or 0-100. The system uses weighted measures, scoring models (color-based, numeric, or letter grades), and threshold bands where admins set cutoff values for transitions between states.

**Inspiration: Procore Project Health Dashboard**

Procore's Project Health Score combines budget, schedule, and risk factors into a weighted composite metric. Weights are configurable by project type — budget-critical projects weight budget at 40%, schedule at 30%, quality at 20%, team at 10%.

**Inspiration: Composite Financial Index**

Higher education institutions use a Composite Financial Index with four component ratios, each weighted and converted to a common scale, then totaled into a single score that "paints a composite picture of financial health at a point in time."

### 4B. Authorization Health Score for Clinivise

**Definition:** A per-client composite score (0-100 or RAG) that combines multiple authorization health signals into a single glanceable indicator.

**Component signals and weights:**

| Signal | Weight | Calculation | Rationale |
|--------|--------|-------------|-----------|
| **Utilization pacing** | 35% | Compare actual burn rate vs. ideal burn rate (approved_units / auth_period_days). Score 100 if on pace, degrade as deviation increases. | Most important — directly impacts revenue |
| **Expiry proximity** | 25% | Score 100 if >60 days remaining. Degrade linearly: 60d=100, 30d=75, 14d=50, 7d=25, 0d=0. | Expiring auths need re-auth action |
| **Coverage gap risk** | 20% | Score 100 if next auth exists or current auth has >30 days remaining. Score 0 if auth expires in <14 days with no successor. | Gap = no billable sessions |
| **Service line balance** | 20% | Score 100 if all service lines are within 20% of proportional utilization. Degrade as imbalance increases (e.g., 97153 at 90% while 97155 at 20%). | Imbalanced utilization leads to partial auth waste |

**Score bands:**

| Score | RAG | Label | Dashboard Display |
|-------|-----|-------|-------------------|
| 80-100 | Green | Healthy | Emerald dot. No action needed. |
| 60-79 | Yellow | Needs Attention | Amber dot. "Review utilization" or "Re-auth approaching." |
| 40-59 | Orange | At Risk | Amber dot (stronger). "Action needed within 2 weeks." |
| 0-39 | Red | Critical | Red dot. "Immediate action required." |

**Where to display:**
- **Client list page**: Small colored dot next to each client name (Tier 1 ambient)
- **Client detail header**: Score + label (e.g., "Auth Health: 72 — Needs Attention") (Tier 2 contextual)
- **Dashboard**: Aggregated distribution — "18 healthy | 4 need attention | 2 at risk | 1 critical" (Tier 3 focused)
- **Authorization detail page**: Full breakdown of score components with individual signal scores (Tier 4 full detail)

**Implementation considerations:**
- Calculate on read (not stored) — derived from `authorization_services.used_units`, `authorizations.start_date/end_date`, and scheduled sessions
- Cache with short TTL (5 min) via React Query stale time for dashboard aggregation
- The score is a *communication tool*, not a clinical metric. It helps prioritize attention.
- Make the formula transparent — clicking the score shows the breakdown (progressive disclosure)

**Phase:** Start with simplified RAG (green/amber/red based on utilization + expiry only) in Sprint 2D. Add the weighted composite score in Sprint 3B dashboard work.

**Sources:** [Gainsight Health Scores](https://www.gainsight.com/blog/customer-health-scores/), [Gainsight Scorecards](https://support.gainsight.com/gainsight_nxt/05Scorecards/01About/Scorecards_Overview), [Procore Health Dashboard](https://support.procore.com/products/online/user-guide/company-level/portfolio/tutorials/view-the-health-dashboard-in-the-portfolio-tool), [Procore Project Health Chart](https://support.procore.com/integrations/procore-analytics/reports/project-management-report/project-health-chart)

---

## 5. Re-Authorization Workflow UX

### 5A. The Problem: Re-Auth Is a Multi-Step Process with a Deadline

Re-authorization in ABA is not a single action — it is a recurring workflow with document collection, clinical justification, submission, and tracking. The workflow repeats every 3-6 months per client. Missing a re-auth deadline means a coverage gap, which means unbillable sessions, which means lost revenue.

Current ABA tools treat re-auth as "create a new authorization." They don't guide the user through the preparation steps.

### 5B. Inspiration: Project Management Recurring Workflows

**Manifestly Checklists / CheckFlow:**
- Recurring workflows with scheduled runs (daily, weekly, quarterly)
- Step-by-step checklists with data collection fields, file uploads, and signature collection
- Deadline-driven: reminders for overdue items, late task highlighting on summary pages
- Conditional logic: show/hide steps based on previous answers
- Progress tracking: summary page shows assignments, late checklists, and late tasks

**Asana Recurring Tasks:**
- Tasks can repeat on a schedule (daily, weekly, monthly)
- Task templates provide pre-built structures for common processes
- Due dates auto-calculate relative to the trigger date

**UnitedHealthcare TrackIt:**
- Self-service tool for tracking prior authorizations, referrals, and pending claims
- Highlights recent decisions and items needing action in near real time
- Status tracking from submission through resolution

### 5C. Clinivise Re-Authorization Workflow Design

**Trigger:** 45 days before authorization expiry (configurable per practice), the system creates a re-authorization task.

**The re-auth checklist (displayed as a progress tracker on the auth detail page):**

```
Re-Authorization Checklist for [Client Name]
Due by: [Auth Expiry Date - 14 days]
Progress: 3 of 6 steps complete
━━━━━━━━━━━━━━━━━░░░░░░░░░░ 50%

[x] 1. Review current utilization
       Utilization: 78% (31/40 units). On pace.
       Completed Mar 15 by Sarah K.

[x] 2. Generate progress summary
       AI-generated summary of last 90 days of sessions.
       Completed Mar 16 by System (AI)

[x] 3. Gather supporting documents
       Treatment plan (uploaded), Progress notes (3 of 3)
       Completed Mar 17 by Sarah K.

[ ] 4. Prepare authorization request
       Pre-filled from current auth. Review and adjust requested units.
       CTA: [Prepare Request]

[ ] 5. Submit to payer
       Submit via payer portal or fax.
       CTA: [Mark as Submitted]

[ ] 6. Track payer response
       Record approval/denial and new auth details.
       CTA: [Record Response]
```

**Key UX decisions:**

1. **Checklist, not form**: The re-auth process is a checklist with heterogeneous steps (review data, upload files, submit externally, record result). A multi-step form wizard is wrong here because the steps happen over days/weeks, not in a single sitting.

2. **Auto-complete where possible**: Step 1 (review utilization) can auto-complete when a BCBA views the auth detail page. Step 2 (progress summary) can be AI-generated. Step 3 can track document uploads automatically.

3. **Deadline-driven urgency**: The checklist header shows days remaining. Steps turn amber at 14 days remaining, red at 7 days. The dashboard widget escalates urgency as the deadline approaches.

4. **Non-blocking**: The checklist is a guide, not a gate. Practices with simple payers may skip steps. The system tracks but does not enforce strict ordering.

5. **Link to new auth**: When step 6 is completed (response recorded), the new authorization is created and linked to the previous one via `previousAuthorizationId`. The old auth transitions to "Replaced" status.

**Phase:** Basic re-auth action (pre-filled form linked to previous auth) in Sprint 2D. Full checklist workflow in Phase 1.5 or Phase 2. AI progress summary generation in Phase 2.

**Sources:** [Manifestly Checklists](https://www.manifest.ly/features/), [CheckFlow Recurring Checklists](https://checkflow.io/recurring-checklists), [UHC TrackIt](https://www.uhcprovider.com/en/resource-library/provider-portal-resources/trackIt.html), [UXPin Progress Trackers](https://www.uxpin.com/studio/blog/design-progress-trackers/)

---

## 6. Timeline and History Visualization

### 6A. The Need: Visualizing Authorization Periods Over Time

A client's authorization history is a series of date ranges — some contiguous, some with gaps, some overlapping (different CPT code groups). Visualizing this history helps BCBAs and billing staff:
- Identify coverage gaps (dates with no active authorization)
- Verify continuity of care documentation
- Plan re-authorizations with historical context
- Audit billing against authorization periods

### 6B. Horizontal Range Bar (Swimlane) Pattern

**The most appropriate visualization for authorization periods is a horizontal range bar chart** — similar to a Gantt chart but simpler. Each row represents an authorization, and bars span the authorization's date range.

**Why this works for auth history:**
- Gantt charts excel at showing "how tasks or phases overlap and the order in which they need to occur"
- Authorization periods are inherently time-bounded ranges — a horizontal bar is the natural representation
- Gaps between bars are immediately visible as white space
- Overlapping authorizations (different service groups) can be shown as stacked bars within a swimlane
- The current date is marked with a vertical line, making it clear which auths are active

**Visual design:**

```
Authorization Timeline for [Client Name]
                     2025                           2026
         Jul  Aug  Sep  Oct  Nov  Dec  Jan  Feb  Mar  Apr  May  Jun
         ─────────────────────────────────────────────────────────
Auth 1   ████████████████████████████                   [Expired]
         BC/BS | 97153+97155 | 92%

Auth 2                                ████████████████████████████
         BC/BS | 97153+97155 | 34%    [Active]        ▼ today

         ─── Gap: Nov 15 - Dec 1 (16 days) ───
```

**Color coding:**
- Emerald fill: active, healthy utilization
- Amber fill: active, high utilization or nearing expiry
- Red fill: active, over-utilized or expiring imminently
- Gray fill: expired
- Red dashed outline: gap period (no coverage)
- Blue fill: pending/future authorization

### 6C. React Component Options

For implementation in Clinivise's React/Next.js stack:

1. **vis.js Timeline** (`vis-timeline` + `react-vis-timeline`): Interactive timeline visualization. Items can have start and end dates (ranges). Users can zoom and drag. Good for exploratory views. May be too heavy for a simple auth timeline.

2. **Custom Tailwind implementation**: Since auth timelines are relatively simple (3-10 bars per client, one axis), a custom component using absolute positioning and Tailwind classes may be lighter weight and more consistent with the design system. Calculate percentage positions from date ranges relative to the viewport timeframe.

3. **ApexCharts Timeline/RangeBar**: `apexcharts` with `react-apexcharts` supports timeline/range bar charts natively. Lighter than vis.js, decent customization.

**Recommendation:** Build a custom `AuthorizationTimeline` component using Tailwind. The data is simple enough (5-15 auth periods per client) that a charting library is overkill. A custom component ensures pixel-perfect design system consistency and avoids a heavy dependency.

**Phase:** Sprint 3B (authorization detail page Timeline tab). The custom component is an S-M effort.

**Sources:** [vis.js Timeline](https://visjs.github.io/vis-timeline/docs/timeline/), [React Timeline Components (Bashooka)](https://bashooka.com/coding/react-libraries-to-visualize-timelines/), [ApexCharts Timeline](https://apexcharts.com/react-chart-demos/timeline-charts/)

---

### 6D. Stripe-Inspired Activity Feed Pattern

For the authorization *activity* timeline (audit log), use a vertical activity feed rather than a horizontal range chart. Stripe's subscription management shows event history as a chronological feed:

```
Authorization Activity — AUTH-2026-001

Mar 21, 2026  Session logged — 4 units consumed (32/40 used)
              By: Maria R. (RBT) | Session #SES-2026-0847

Mar 18, 2026  80% utilization threshold crossed
              Alert sent to Sarah K. (BCBA)

Mar 15, 2026  Session logged — 4 units consumed (28/40 used)
              By: Maria R. (RBT) | Session #SES-2026-0831

Feb 1, 2026   Authorization activated
              By: System | Start date reached

Jan 28, 2026  Authorization approved by payer
              Recorded by: Jennifer L. (Billing)

Jan 15, 2026  Authorization created
              By: Jennifer L. (Billing) | From re-auth of AUTH-2025-012
```

**Design:** Use the shadcn Timeline component (vertical, left-aligned icons). Color-code event types: blue for creation/status changes, emerald for normal sessions, amber for threshold crossings, red for over-utilization events.

---

## 7. Mobile/Tablet Authorization Experience

### 7A. RBT Tablet Context: Minimum Viable Authorization Info

**The reality:** RBTs log sessions on tablets in homes, schools, and clinics. They have a child in front of them. They need to start a timer, take data, and log the session. Authorization is a background concern — they need to know "am I okay to provide this service?" not "what is the auth number and payer ID?"

**Research findings:**
- TallyFlex designed ABA data collection for "one-finger" operation — tap to count, timers for duration. The interface replaces paper data sheets and clipboards.
- CR Mobile guides RBTs through sessions with voice-to-text and offline-first design.
- RethinkBH's mobile app provides full data access with real-time syncing, supporting both online and offline collection.
- All successful ABA mobile apps prioritize speed and simplicity over completeness.

**Minimum viable auth display for RBT tablet session form:**

```
┌─────────────────────────────────────────────┐
│  97153 — Direct Therapy                      │
│  ████████████░░░░░░░░░░░  12 units left     │
│  ● Active until Jun 7                        │
└─────────────────────────────────────────────┘
```

That is: CPT code name, utilization bar, remaining units in large text, status with expiry date. No auth number. No payer name. No billing rate. Those details are irrelevant to the RBT's task.

**Touch targets:** Every tappable element must be minimum 44px (min-h-11 min-w-11). Authorization cards should be full-width on tablet, tappable anywhere on the card surface. The selected card gets a visible check mark and an elevated/highlighted border.

### 7B. BCBA Tablet Context: Triage and Oversight

BCBAs may review authorization status on a tablet between sessions or during supervision. They need more than RBTs but less than the full desktop detail view.

**BCBA tablet needs:**
- Client list with auth health indicators (colored dot per client)
- Quick drill-down to utilization summary per client
- Expiry warnings with action buttons (re-authorize, adjust schedule)
- Swipe between clients during supervision rounds

**Responsive strategy:**
On tablet viewports (768px-1024px), the authorization list table should use priority-based column hiding (companion research 4B), and the authorization detail page should stack tabs vertically or use a scrollable tab bar.

### 7C. Offline Considerations (Phase 2)

For field sessions without reliable connectivity:
- Cache last-known authorization state locally (remaining units, expiry date, status)
- Display "Last synced: [time]" indicator
- Allow session logging offline — sync and validate authorization on reconnect
- If the cached auth shows <5 remaining units, display a prominent "unverified" warning

**Sources:** [TallyFlex ABA Data Collection](https://tallyflex.com/), [CentralReach CR Mobile](https://centralreach.com/products/cr-mobile/), [RethinkBH Mobile](https://www.rethinkbehavioralhealth.com/our-solutions/aba-data-collection/), [Passage Health ABA Software](https://www.passagehealth.com/blog/aba-data-collection-software)

---

## 8. Synthesis: The Authorization Data Layer

### 8A. Architecture Principle: Authorization Is Infrastructure, Not a Feature

The research across all seven areas points to a single architectural principle: **authorization data is infrastructure that the entire application reads from, not a feature that lives in one place.**

This means:
1. Authorization queries should be composable — `getClientAuthorizationSummary(clientId)` returns the compact summary usable by the client detail page, the session form, and the scheduling calendar.
2. Authorization alerts should be computed once and cached — not recalculated on every page load.
3. The `AuthorizationStatusBadge`, `UtilizationBar`, and `UtilizationIndicator` components should be shared primitives used across 6+ pages.
4. Authorization state changes (unit consumed, threshold crossed, expiry approached) should trigger revalidation of all surfaces that display auth data.

### 8B. Data Flow Map

```
┌─────────────────────────────────────────────────────────┐
│                    Server Queries                        │
│                                                         │
│  getAuthorizationSummary(authId)     → Detail page      │
│  getClientAuthSummaries(clientId)    → Client detail     │
│  getSessionAuthOptions(clientId, date, cptCode)         │
│                                      → Session form      │
│  getScheduleAuthConstraints(clientId, date)             │
│                                      → Calendar          │
│  getDashboardAuthAlerts(orgId)       → Dashboard         │
│  getAuthHealthScore(clientId)        → Client list dot   │
│  getOrgAuthDistribution(orgId)       → Dashboard widget  │
│                                                         │
│  All queries filter by organization_id.                 │
│  All queries respect soft-delete (deleted_at IS NULL).  │
└─────────────────────────────────────────────────────────┘
```

### 8C. Component Reuse Map

| Component | Used On | Tier |
|-----------|---------|------|
| `AuthorizationStatusBadge` | Auth list, auth detail, client detail, session form, dashboard | 1-4 |
| `UtilizationIndicator` (compact dot + %) | Auth list table cells, client list, dashboard widgets | 1-3 |
| `UtilizationBar` (progress bar) | Auth detail, client detail auth cards, session form auth picker | 2-4 |
| `ExpiryCountdown` (badge: "23d") | Auth list, auth detail header, client detail header, dashboard | 1-3 |
| `AuthHealthDot` (colored dot) | Client list, dashboard distribution | 1 |
| `AuthorizationPicker` (card sheet) | Session form, scheduling form | 2 |
| `AuthConstraintBanner` (inline warning) | Scheduling form, session form | 2 |
| `AuthAlertWidget` (dashboard card list) | Dashboard | 3 |
| `RevenueAtRiskMetric` (single number) | Dashboard | 3 |
| `AuthorizationTimeline` (horizontal range bars) | Auth detail Timeline tab, client detail | 4 |
| `AuthActivityFeed` (vertical event list) | Auth detail Timeline tab | 4 |
| `ReAuthChecklist` (progress tracker) | Auth detail page | 4 |

### 8D. Implementation Priority (Addendum to Companion Research)

The companion research (`authorization-tracking-ux-research.md`) defines the Sprint 2D-4B component build order. This research adds the following to that sequence:

| Priority | New Component/Pattern | Sprint | Rationale |
|----------|----------------------|--------|-----------|
| A | Authorization summary in client detail header | 2D | System-wide visibility starts with the most-visited page |
| B | `AuthHealthDot` on client list | 3B | Ambient awareness across the practice |
| C | `AuthConstraintBanner` on scheduling form | 3A | Prevention > remediation |
| D | Revenue at Risk metric on dashboard | 3B | Translates clinical data to financial urgency |
| E | Authorization Health Score (simplified RAG) | 3B | Composite indicator for prioritization |
| F | `ReAuthChecklist` (basic version) | 3B | Guide the recurring workflow |
| G | `AuthorizationTimeline` (horizontal range bars) | 3B | Visual coverage history |
| H | Authorization Health Score (weighted composite) | Phase 1.5 | Full formula requires tuning |
| I | Re-auth checklist with AI progress summary | Phase 2 | Depends on AI infrastructure |
| J | Offline auth caching for mobile | Phase 2 | Requires service worker infrastructure |

---

## Sources

### System-Wide Quota/Status Patterns
- [Stripe Billing Credits](https://stripe.com/blog/introducing-credits-for-usage-based-billing)
- [Stripe Usage-Based Billing](https://docs.stripe.com/billing/subscriptions/usage-based)
- [Stripe Thresholds](https://docs.stripe.com/billing/subscriptions/usage-based/thresholds)
- [Linear Cycles](https://linear.app/docs/use-cycles)
- [Linear Insights](https://linear.app/features/insights)
- [Linear Cycle Capacity Changelog](https://linear.app/changelog/2022-09-22-cycles-and-graph-improvements)
- [Notion Linked Databases](https://www.notion.com/help/guides/using-linked-databases)
- [Notion Dashboard Views (March 2026)](https://www.notion.com/releases/2026-03-10)
- [Notion Views, Filters, Sorts](https://www.notion.com/help/views-filters-and-sorts)
- [Mercury Expense Management](https://support.mercury.com/hc/en-us/articles/43590602733972-Getting-started-with-expense-management)
- [Mercury Category Locked Cards](https://support.mercury.com/hc/en-us/articles/31669993068564-Creating-and-managing-category-locked-cards)

### Status Indicators and Design Systems
- [Carbon Design System Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/)
- [Carbon Status Indicators v10](https://v10.carbondesignsystem.com/patterns/status-indicator-pattern/)
- [NN/g Indicators, Validations, Notifications](https://www.nngroup.com/articles/indicators-validations-notifications/)
- [Badges vs Pills vs Chips vs Tags (Smart Interface Design Patterns)](https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/)
- [UX Best Practices for Status Indicators (KoruUX)](https://www.koruux.com/blog/ux-best-practices-designing-status-indicators/)

### Progressive Disclosure
- [NN/g Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [Progressive Disclosure in SaaS (Lollypop)](https://lollypop.design/blog/2025/may/progressive-disclosure/)
- [Userpilot Progressive Disclosure Examples](https://userpilot.com/blog/progressive-disclosure-examples/)
- [Information Density and Progressive Disclosure (Algolia)](https://www.algolia.com/blog/ux/information-density-and-progressive-disclosure-search-ux/)

### Health Scores and Composite Indicators
- [Gainsight Customer Health Scores](https://www.gainsight.com/blog/customer-health-scores/)
- [Gainsight Scorecards Overview](https://support.gainsight.com/gainsight_nxt/05Scorecards/01About/Scorecards_Overview)
- [Gainsight Health Score Redesign](https://www.gainsight.com/blog/how-gainsight-redesigned-the-customer-health-score/)
- [Procore Health Dashboard](https://support.procore.com/products/online/user-guide/company-level/portfolio/tutorials/view-the-health-dashboard-in-the-portfolio-tool)
- [Procore Project Health Chart](https://support.procore.com/integrations/procore-analytics/reports/project-management-report/project-health-chart)
- [Vitally: Create Health Score with 4 Metrics](https://www.vitally.io/post/how-to-create-a-customer-health-score-with-four-metrics)
- [ChurnZero: Health Score](https://churnzero.com/churnopedia/health-score/)
- [RAG Status Dashboard (Mastt)](https://www.mastt.com/blogs/project-rag-status-dashboard)

### Scheduling and Constraint UX
- [Hub Planner Overbooking Prevention](https://hubplanner.com/preventing-resource-over-booking-with-a-new-built-in-warning-system/)
- [Passage Health ABA Scheduling](https://www.passagehealth.com/blog/aba-scheduler-software)
- [ABA Matrix Authorization Management](https://www.abamatrix.com/aba-authorization-management/)

### Utilization Pacing and Burndown
- [Budget Pacing Guide (Improvado)](https://improvado.io/blog/budget-pacing)
- [Burn Rate Chart Guide (Mirorim)](https://mirorim.com/blog/burn-rate-chart/)
- [Budget Burndown Charts (GP Strategies)](https://www.gpstrategies.com/blog/the-value-of-burndown-charts-to-manage-project-costs/)
- [SLO Error Budget Burn Rate Visualization](https://oneuptime.com/blog/post/2026-02-06-slo-error-budget-burn-rate-grafana/view)

### Re-Authorization Workflow
- [Manifestly Checklists](https://www.manifest.ly/features/)
- [CheckFlow Recurring Checklists](https://checkflow.io/recurring-checklists)
- [UHC TrackIt](https://www.uhcprovider.com/en/resource-library/provider-portal-resources/trackIt.html)
- [UXPin Progress Trackers](https://www.uxpin.com/studio/blog/design-progress-trackers/)
- [UserGuiding Progress Trackers](https://userguiding.com/blog/progress-trackers-and-indicators)
- [Prior Authorization Workflow (CCD Care)](https://ccdcare.com/resource-center/prior-authorization-workflow/)
- [Waystar Automated Prior Authorization](https://www.waystar.com/blog-automated-prior-authorization-101-how-to-activate-staff-exception-based-workflows/)

### Timeline Visualization
- [vis.js Timeline](https://visjs.github.io/vis-timeline/docs/timeline/)
- [react-vis-timeline](https://github.com/razbensimon/react-vis-timeline)
- [React Timeline Components (Bashooka)](https://bashooka.com/coding/react-libraries-to-visualize-timelines/)
- [ApexCharts Timeline](https://apexcharts.com/react-chart-demos/timeline-charts/)
- [Gantt Charts for Healthcare (ClickUp)](https://clickup.com/templates/gantt-chart/healthcare-administrators)

### ABA Practice Management and Authorization
- [TherapyLake Authorization Tracking](https://blog.therapylake.com/aba-billing-authorization-automation/)
- [CentralReach Proactive Authorization Management](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [CentralReach CR Mobile](https://centralreach.com/products/cr-mobile/)
- [AlohaABA Authorization Management](https://alohaaba.com/features/authorization-management)
- [Passage Health Practice Management](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [Operant Billing: Authorization Management in ABA](https://operantbilling.com/improving-authorization-management-in-aba-therapy-a-path-to-financial-health-and-client-success/)

### Mobile/Tablet Healthcare
- [TallyFlex ABA Data Collection](https://tallyflex.com/)
- [RethinkBH Mobile Data Collection](https://www.rethinkbehavioralhealth.com/our-solutions/aba-data-collection/)
- [Passage Health Data Collection Software](https://www.passagehealth.com/blog/aba-data-collection-software)

### Revenue at Risk and Healthcare Dashboards
- [Healthcare Dashboard Examples (Folio3)](https://data.folio3.com/blog/healthcare-dashboard-examples/)
- [Revenue Cycle Dashboards (Azalea Health)](https://azaleahealth.com/blog/revenue-cycle-reporting-tips/)
- [Healthcare KPI Dashboards (Medical Advantage)](https://www.medicaladvantage.com/blog/managing-your-portfolio-with-healthcare-kpi-dashboards/)
- [Revenue at Risk in Healthcare (Crowe)](https://www.crowe.com/industries/healthcare/net-revenue-reporting-and-reimbursement/revenue-at-risk)
- [Prior Authorization Revenue Impact (Aspirion)](https://www.aspirion.com/prior-authorization-impact-on-healthcare-revenue-cycle-management/)
