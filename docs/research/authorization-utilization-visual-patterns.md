# Authorization & Utilization Tracking: Visual Design Patterns to Steal

> Research date: 2026-03-25
> Focus: Visual design patterns, user flows, and screen-level UX for authorization/utilization tracking. Covers healthcare PM, ABA-specific tools, design-leading SaaS, YC startups, tablet-first interfaces, and AI-native approaches.
>
> Companion documents:
>
> - [`authorization-tracking-ux-research.md`](authorization-tracking-ux-research.md) -- Component-level patterns, alerting, mobile UX
> - [`authorization-tracking-competitive-research.md`](authorization-tracking-competitive-research.md) -- Competitor deep dives
> - [`authorization-lifecycle-ux-research.md`](authorization-lifecycle-ux-research.md) -- System-wide integration, progressive disclosure
> - [`authorization-lifecycle-frontier-research.md`](authorization-lifecycle-frontier-research.md) -- AI-native auth management

---

## Patterns to Steal: Summary Table

| #   | Pattern                                                                  | Stolen From                         | Serves          | Page Type                  | Maturity                                       |
| --- | ------------------------------------------------------------------------ | ----------------------------------- | --------------- | -------------------------- | ---------------------------------------------- |
| 1   | Segmented multi-color utilization bar                                    | Linear + VA.gov                     | All personas    | Client page + auth detail  | Production-proven                              |
| 2   | Budget-as-ambient-context (every screen shows budget)                    | Ramp Budgets                        | BCBA, Billing   | Hybrid (pervasive)         | Production-proven                              |
| 3   | Burndown projection line ("units exhaust on [date]")                     | Mercury cash burn                   | BCBA, Admin     | Auth detail + dashboard    | Production-proven concept, novel in ABA        |
| 4   | Tiered usage meters with threshold coloring                              | Vercel usage dashboard              | Admin, Billing  | Dashboard                  | Production-proven                              |
| 5   | Global filter dashboard (filter by BCBA/client/payer)                    | Notion Dashboards (March 2026)      | Admin, BCBA     | Dashboard                  | Production-proven                              |
| 6   | Auth picker as touch-friendly card carousel                              | Motivity/Catalyst mobile patterns   | RBT             | Session form               | Early-adopter (ABA mobile)                     |
| 7   | AI-parsed auth letter with confidence-scored field review                | Cohere Health + LandingAI           | Billing         | Auth creation flow         | Production at scale (Cohere), novel in ABA     |
| 8   | Authorization pipeline / kanban status board                             | Cohere Health + healthcare PA tools | Billing         | Standalone auth management | Production-proven (PA platforms)               |
| 9   | Predictive re-auth trigger with pre-populated renewal                    | Infinx + Waystar AI agents          | BCBA, Billing   | Auth detail + notification | Early-adopter                                  |
| 10  | Four-tier progressive disclosure (ambient > contextual > focused > deep) | Carbon Design System + Stripe       | All personas    | System-wide                | Production-proven pattern, novel in ABA        |
| 11  | Pacing gauge: actual vs. expected utilization velocity                   | RethinkBH + Mercury                 | BCBA, Admin     | Auth detail + dashboard    | Production (RethinkBH), novel visual treatment |
| 12  | Absence-is-success: quiet when healthy, loud when broken                 | Carbon + Mercury                    | All personas    | System-wide                | Production-proven                              |
| 13  | Compact auth constraint warning at point of scheduling                   | Passage Health + AlohaABA           | BCBA, Scheduler | Calendar/scheduling        | Production-proven                              |
| 14  | Authorization health score (composite metric)                            | Cohere Align trust score            | Admin           | Dashboard                  | Experimental                                   |

---

## Pattern 1: Segmented Multi-Color Utilization Bar

**Stolen from:** Linear project progress bars + VA.gov segmented progress + Stack Overflow Stacks design system

**What it looks like:**
A horizontal bar divided into segments, one per CPT service line on the authorization. Each segment shows the ratio of used-to-approved units with distinct fill colors based on utilization health. The overall authorization bar aggregates all lines.

```
Authorization: Blue Cross #AUTH-2026-001
Overall: 18/52 units (34.6%)
+--------------------------------------------------+
| ===97153=== | ==97155== | =97156= |              |
| ####        | ###       | ##      |  (unfilled)  |
| 12/40       | 4/8       | 2/4     |              |
+--------------------------------------------------+
  emerald      amber       amber     light gray
```

Individual service line bars use threshold coloring:

- **0-79% (emerald):** On track. Subtle, recedes.
- **80-94% (amber):** Warning. Slightly more prominent.
- **95-100% (red):** Critical. Demands attention.
- **>100% (red + overflow hash):** Over-utilized. Overflow indicator extends past 100% mark.

**Who it serves:** All personas. BCBAs see it on client detail pages. RBTs see it on the session form auth picker. Billing staff sees it on the auth list/detail. Admins see aggregated bars on the dashboard.

**What makes it good UX:**

- Encodes three dimensions in one compact element (CPT code, utilization ratio, health status via color)
- Scannable at a glance -- you don't need to read numbers to know which service lines need attention
- Linear proved that segmented bars can be information-dense without feeling cluttered
- Accessible: combine color + text labels + percentage numbers (triple encoding per Carbon Design System)

**Page type:** Hybrid -- appears on client detail page header, auth detail overview, auth list table rows, session form auth picker, and dashboard widget. Different fidelity per context (full segmented on detail pages, simplified single bar on list rows).

**Maturity:** Production-proven pattern (Linear, VA.gov, Stack Overflow). Novel application to ABA authorization tracking.

**Implementation note:** shadcn/ui does not natively support multi-segment progress bars. Community extensions exist (see [shadcn-ui/ui Discussion #3464](https://github.com/shadcn-ui/ui/discussions/3464)) showing a `ProgressSegment` type with value/color properties. Build a custom `<UtilizationBar>` component on top of the Radix Progress primitive.

---

## Pattern 2: Budget-as-Ambient-Context

**Stolen from:** Ramp Budgets (launched January 2026) + Stripe usage billing

**What it looks like:**
Budget/quota data is never hidden on a dedicated page -- it surfaces contextually wherever decisions are made. In Ramp, every approver sees real-time budget impact at the moment of decision. In Stripe, usage data appears on invoices, the dashboard, and the customer detail page simultaneously.

**Applied to Clinivise:**
Authorization utilization data appears at seven touchpoints:

| Touchpoint                   | What's Shown                                                            | Fidelity   |
| ---------------------------- | ----------------------------------------------------------------------- | ---------- |
| **Sidebar nav**              | Badge count of auths needing attention (e.g., "3")                      | Ambient    |
| **Dashboard**                | Aggregated widget: "X auths expiring this week, Y at >80% utilization"  | Focused    |
| **Client list**              | Status dot (red/amber/green) per client based on worst-case auth        | Ambient    |
| **Client detail header**     | Auth summary card per active auth with utilization bar                  | Contextual |
| **Session form auth picker** | Card per eligible auth showing remaining units, utilization bar, expiry | Contextual |
| **Auth list table**          | Full table rows with utilization %, status badge, expiry countdown      | Focused    |
| **Auth detail page**         | Complete breakdown: tabs, service lines, sessions, documents, timeline  | Deep dive  |

**Who it serves:** All personas at different levels. The key insight from Ramp: finance teams that see budget impact at decision time make better decisions than those who check a budget report weekly.

**What makes it good UX:**

- Prevents the "I had no idea the auth was almost used up" surprise that causes unbillable sessions
- Context-appropriate detail: an RBT on a tablet during session logging sees "12 units remaining" (just enough to decide). A BCBA on the client page sees the full utilization bar with CPT breakdown.
- Ramp proved that real-time budget visibility reduced overspend by 30% -- the same principle applies to authorization over-utilization

**Page type:** System-wide pattern, not a single page.

**Maturity:** Production-proven at Ramp, Stripe. The "authorization as ambient context" concept is the single biggest competitive gap in ABA software -- no competitor surfaces utilization data at every touchpoint. CentralReach buries it in Billing. AlohaABA shows it only in scheduling reports. Motivity has it in scheduling but not on the session form.

---

## Pattern 3: Burndown Projection Line

**Stolen from:** Mercury cash burn rate visualization + budget burndown charts

**What it looks like:**
A simple area chart or line chart on the authorization detail page showing:

- X-axis: time (auth start date to auth end date)
- Y-axis: units (0 to approved total)
- **Actual consumption line:** Steps up with each session logged
- **Projected consumption line:** Dashed line extrapolating from current pace to projected exhaustion date
- **Ideal pace line:** Light gray reference showing linear/expected consumption pace
- **Key callout:** "At current pace, units exhaust on [date]" or "Units will last until [date] (14 days past auth expiry)"

```
Units
40 |                                          ... projected
   |                                    .....
   |                              .....
   |                        .....(projected exhaustion: May 12)
   |                   -----
   |              -----  (actual: 18 units used)
   |         -----
   |    -----
   |----
 0 |__________|__________|__________|__________|
   Jan 1      Feb 1      Mar 1      Apr 1     Jun 7
   (start)                                    (auth end)
```

**Who it serves:** BCBAs (primary -- they make scheduling decisions based on utilization pace). Admin/owners see aggregated burndown across the practice on the dashboard.

**What makes it good UX:**

- Mercury proved that showing "months of runway remaining" changes decision-making. Applied to auths: "weeks of units remaining" drives proactive re-authorization.
- No ABA competitor offers predictive burndown visualization. CentralReach has scatter charts (complex, requires training). AlohaABA has basic utilization percentages (no projection). RethinkBH has "pacing" metrics but no visual burndown.
- The projection makes abstract numbers concrete: "72% utilized" is hard to act on. "Units exhaust 3 weeks before auth expires" is immediately actionable.

**Page type:** Auth detail page (Overview tab, primary visual) + Dashboard widget (simplified version showing only auths with concerning projections).

**Maturity:** Production-proven concept (Mercury, project management burndown charts). Novel application to ABA authorization tracking. This is a genuine differentiator -- no competitor does this visually.

**Implementation note:** Use a lightweight charting library (Recharts is already common in Next.js projects). The chart only needs 3 lines (actual, projected, ideal pace) and a shaded area.

---

## Pattern 4: Tiered Usage Meters with Threshold Coloring

**Stolen from:** Vercel usage dashboard + AWS CloudWatch quota visualization

**What it looks like:**
Vercel's usage dashboard organizes metrics into categories (Networking, Functions, Build) with each resource showing: current usage, included amount, overage amount, and a progress bar that changes color at thresholds. The key pattern: the bar is green when comfortable, yellow when approaching limits, red when exceeded -- and the included amount creates a visual "boundary" on the bar.

Applied to Clinivise dashboard:

```
Authorization Health Overview                    [Filter: All BCBAs v]
+------------------------------------------+
| Active Authorizations         47          |
| Expiring This Week            3  [!]      |
| At Risk (>80% utilized)       8  [!!]     |
| Over-utilized (>100%)         1  [!!!]    |
+------------------------------------------+

[  97153 Direct Therapy  ]  428 / 580 units  ============73%==  (emerald)
[  97155 Supervision     ]   82 / 96 units   ==========85%====  (amber)
[  97156 Caregiver       ]   34 / 40 units   ==========85%====  (amber)
[  97158 Group           ]   14 / 14 units   =========100%=====  (red)
```

**Who it serves:** Admin/owners and billing staff. This is the "practice-wide health check" view.

**What makes it good UX:**

- Vercel proved that developers care about quota usage and will proactively manage it when the data is visible and well-organized. Same principle: BCBAs and admins will proactively manage auth utilization when the dashboard makes it easy.
- Aggregation by CPT code across the practice reveals patterns: "We're consistently over-utilizing 97153 across all clients" points to a systemic scheduling issue.
- Threshold coloring eliminates the need to parse numbers -- the color IS the information.

**Page type:** Dashboard (practice-level overview).

**Maturity:** Production-proven (Vercel, AWS, Datadog). Novel aggregation for ABA authorization data.

---

## Pattern 5: Global Filter Dashboard

**Stolen from:** Notion Dashboards (March 2026 release) + Linear Insights

**What it looks like:**
Notion's March 2026 Dashboard view introduced global filters: a single filter bar at the top of a dashboard that filters ALL widgets simultaneously. Pick a BCBA, and every chart, table, and metric card on the dashboard shows only that BCBA's data.

Applied to Clinivise:

```
Dashboard                     [BCBA: Sarah Chen v] [Payer: All v] [Status: Active v]
+-----------+  +-----------+  +-----------+  +-----------+
| Clients   |  | Active    |  | Sessions  |  | Revenue   |
|    12     |  | Auths: 28 |  | This Week |  | At Risk   |
|           |  |           |  |    34     |  |  $4,200   |
+-----------+  +-----------+  +-----------+  +-----------+

[Expiring Authorizations]        [Utilization Alerts]
| Client      | Expires | Util% | | Client     | CPT   | Util% | Alert      |
| J. Martinez | Apr 2   | 89%   | | K. Park    | 97153 | 97%   | Near limit |
| K. Park     | Apr 8   | 97%   | | L. Chen    | 97155 | 102%  | Over-util  |
| ...                           | | ...                                     |
```

The global filter operates on ALL widgets. When you select "Sarah Chen" as BCBA, the client count, auth count, session count, revenue at risk, expiring authorizations table, and utilization alerts table ALL filter to show only her caseload.

**Who it serves:** Admin/owners (practice-wide view, filter by BCBA to review caseloads). BCBAs (filter to themselves for their own caseload overview).

**What makes it good UX:**

- Linear proved that "insights attached to the current view" is more useful than a separate analytics page. The same authorization data, filtered contextually, serves as both a practice-wide dashboard and a per-BCBA workload view.
- Notion's implementation shows this can be done with standard database filtering -- no separate "reports" module needed.
- Eliminates the need for a separate "BCBA caseload view" page. The dashboard IS the caseload view when filtered.

**Page type:** Dashboard (standalone).

**Maturity:** Production-proven (Notion, Linear). Novel application to ABA practice management. No ABA competitor offers cross-filtering dashboards.

---

## Pattern 6: Auth Picker as Touch-Friendly Card Carousel

**Stolen from:** Motivity tablet patterns + Apple Health card interactions + Catalyst mobile feedback

**What it looks like:**
When an RBT on a tablet taps "Log Session" and selects a client, instead of a dropdown list of authorization numbers, the system shows a horizontal scrollable card carousel of eligible authorizations. Each card shows:

```
+-----------------------------+  +-----------------------------+
| Blue Cross #AUTH-001        |  | Aetna #AUTH-002             |
| 97153 Direct Therapy        |  | 97155 Supervision           |
| ========72%==========       |  | ====85%==========           |
| 12 of 40 units remaining    |  | 3 of 20 units remaining     |
| Expires: Jun 7 (74 days)    |  | Expires: Apr 15 (21 days)   |
|          [Select]           |  |          [Select]           |
+-----------------------------+  +-----------------------------+
        (swipe for more -->)
```

Cards are sorted by system recommendation (FIFO: oldest expiration first) with the recommended card pre-selected (highlighted border). Cards show utilization bar inline so the RBT can see remaining units before selecting. Touch targets are min 48px (11-12 Tailwind units). The entire card is tappable.

**Who it serves:** RBTs (primary -- they log sessions on tablets in the field). BCBAs logging supervision sessions.

**What makes it good UX:**

- Catalyst users complain about "auto-switching to the next target" and scroll-to-top bugs on mobile. The card carousel avoids these issues by keeping each option discrete and visible.
- Motivity is tablet-native but doesn't show utilization data inline during auth selection. This is an opportunity.
- The card format communicates more context than a dropdown can: payer, CPT code, utilization, remaining units, and expiry all visible at a glance.
- Touch-friendly: each card is a large tap target, no precision required. Important for RBTs wearing gloves or working with kids on their lap.

**Page type:** Session form (client page context).

**Maturity:** Early-adopter. Card-based selection is production-proven (Apple, Material Design). Applied to auth selection specifically is novel in ABA. Catalyst and Motivity both use simpler dropdown selection.

---

## Pattern 7: AI-Parsed Auth Letter with Confidence-Scored Field Review

**Stolen from:** Cohere Health (90% auto-processing) + LandingAI agentic document extraction

**What it looks like:**
After uploading an authorization letter PDF:

1. **Processing state:** Animated skeleton showing the PDF being analyzed (2-5 seconds)
2. **Review state:** Side-by-side view with the PDF on the left and extracted fields on the right. Each field shows:
   - The extracted value
   - A confidence indicator (green check = high confidence, amber question mark = needs review, red X = extraction failed)
   - The source location highlighted on the PDF (click a field, the PDF scrolls to where it was extracted from)

```
+---------------------------+  +---------------------------+
| [PDF Preview]             |  | Extracted Authorization    |
|                           |  |                           |
| AUTHORIZATION LETTER      |  | Auth Number: AUTH-2026-45 |
| Blue Cross Blue Shield    |  |   [check] High confidence |
| Auth #: AUTH-2026-45      |  |                           |
| Client: James Martinez    |  | Payer: Blue Cross BS      |
| DOB: 03/15/2020          |  |   [check] High confidence |
| Provider: Sarah Chen      |  |                           |
| Service: 97153            |  | Client: James Martinez    |
| Units: 40/month          |  |   [check] High confidence |
| Start: 01/01/2026        |  |                           |
| End: 06/30/2026          |  | Services:                 |
|                           |  | +-------+------+--------+|
|                           |  | | CPT   | Units| Period  ||
|                           |  | | 97153 | 40   | monthly ||
|                           |  | | 97155 | 8    | monthly ||
|                           |  | | 97156 | 4    | monthly ||
|                           |  | +-------+------+--------+|
|                           |  |   [?] Review: period type |
|                           |  |                           |
|                           |  | Dates: Jan 1 - Jun 30    |
|                           |  |   [check] High confidence |
|                           |  |                           |
|                           |  | [Create Authorization]    |
+---------------------------+  +---------------------------+
```

Fields marked with amber are pre-populated but the user must confirm before proceeding. Fields marked with red require manual entry.

**Who it serves:** Billing staff (primary -- they receive and process auth letters). BCBAs (secondary -- they review auth details).

**What makes it good UX:**

- No ABA competitor does this. CentralReach, AlohaABA, Motivity, RethinkBH all require fully manual data entry from auth letters.
- Cohere Health proved that 90% auto-processing is achievable with modern AI. Even 70% accuracy saves significant time.
- The confidence scoring prevents blind trust in AI -- users know exactly which fields to verify.
- The side-by-side view with linked highlighting lets the user verify extraction against the source document without context-switching.

**Page type:** Auth creation flow (standalone screen, accessed from auth list or client detail).

**Maturity:** Production at scale for Cohere Health (12M+ requests/year). Novel in ABA practice management. This is Clinivise's Phase 1 capstone AI feature.

---

## Pattern 8: Authorization Pipeline / Kanban Status Board

**Stolen from:** Cohere Health UM suite + healthcare PA platforms + Linear project boards

**What it looks like:**
A kanban-style board showing authorizations moving through lifecycle stages:

```
| Pending      | Active       | Expiring     | Renewal      | Expired     |
| Approval     |              | (30 days)    | In Progress  |             |
|              |              |              |              |             |
| +----------+ | +----------+ | +----------+ | +----------+ | +----------+|
| | J. Park  | | | K. Lee   | | | L. Chen  | | | M. Kim   | | | N. Patel ||
| | BCBS     | | | Aetna    | | | UHC      | | | Cigna    | | | BCBS     ||
| | Submitted| | | 45% util | | | 89% util | | | Draft    | | | Expired  ||
| | 3 days   | | | 142 days | | | 21 days  | | | Ready    | | | Mar 10   ||
| +----------+ | +----------+ | +----------+ | +----------+ | +----------+|
|              | +----------+ | +----------+ |              |             |
|              | | P. Adams | | | Q. Smith | |              |             |
|              | | Tricare  | | | Medicaid | |              |             |
|              | | 72% util | | | 97% util | |              |             |
|              | | 88 days  | | | 8 days!  | |              |             |
|              | +----------+ | +----------+ |              |             |
```

Each card is a mini authorization summary with client name, payer, utilization or status, and countdown/date. Cards in the "Expiring" column are sorted by urgency (soonest first). The "Renewal In Progress" column tracks re-auth workflow status.

**Who it serves:** Billing staff (primary -- they manage the auth lifecycle). Admin/owners (practice-wide pipeline visibility).

**What makes it good UX:**

- Kanban boards are proven for workflow management in healthcare settings (ClickUp, KanbanZone, TeamHub all offer healthcare Kanban templates).
- The pipeline view reveals bottlenecks: a growing "Pending Approval" column means payer response times are slow. A growing "Expiring" column means the re-auth process needs to start earlier.
- This is more actionable than a table view for lifecycle management because the columns encode status visually.

**Page type:** Standalone auth management page (alternative view to the data table, toggled by a view switcher).

**Maturity:** Production-proven concept (Kanban in healthcare, Cohere Health PA pipeline). Novel as a dedicated view in ABA PM tools. CentralReach has module-based auth management but not a Kanban view.

**Recommendation:** Defer to Phase 1.5 or Phase 2. The table view with status filters covers the same use case for MVP. The Kanban view is a polish/delight feature.

---

## Pattern 9: Predictive Re-Auth Trigger with Pre-Populated Renewal

**Stolen from:** Infinx three-agent pipeline + SPRY proactive resubmission + CoverMyMeds renewals

**What it looks like:**
The system monitors each authorization and triggers a re-authorization workflow based on:

1. **Utilization pace:** If units will exhaust before auth expiry (burndown projection)
2. **Calendar proximity:** 30 days before expiry (configurable per payer, since some payers require 45-day lead time)
3. **Payer-specific lead time:** Known processing times per payer stored in the system

When triggered, the system:

- Creates a notification: "Authorization for J. Martinez (Blue Cross, 97153) should be renewed. Current utilization: 82%. Auth expires in 28 days."
- Pre-populates a renewal form with: previous auth details, updated utilization data, current session count, and a draft progress summary for the BCBA to review.
- CTA: "Start Renewal" opens the re-auth workflow with pre-filled data.

**Who it serves:** BCBA (reviews clinical progress for renewal). Billing staff (manages submission). Admin (monitors pipeline).

**What makes it good UX:**

- SPRY proved that proactive resubmission prevents care interruptions. Expired auths = unbillable sessions = $0 revenue.
- CoverMyMeds showed that proactive renewal prompts from payers to prescribers improve continuity of care.
- Pre-populating the renewal with existing data saves the BCBA 20-30 minutes per re-auth (the Waystar benchmark: 24 minutes per manual authorization).
- Payer-specific lead times prevent the "we submitted too late" problem -- the system knows Blue Cross needs 14 days but Medicaid needs 30 days.

**Page type:** Notification/alert (appears on dashboard and auth detail page) + renewal form (standalone).

**Maturity:** Early-adopter. Infinx and Waystar have production AI agents for PA automation. SPRY auto-identifies expiring auths. CoverMyMeds prompts renewals. The combination of predictive trigger + pre-populated form is the novel synthesis. Implement the trigger and notification in Phase 1, the pre-populated form in Phase 2 (after AI infrastructure is established).

---

## Pattern 10: Four-Tier Progressive Disclosure

**Stolen from:** Carbon Design System status indicators + Stripe usage billing + NN/g progressive disclosure principles

**What it looks like:**
The same authorization data appears at four levels of detail, each appropriate to its context:

**Tier 1 -- Ambient (peripheral awareness):**

- Sidebar nav: red badge "3" on Authorizations
- Client list: colored dot (red/amber/green/gray) based on worst-case auth status
- Design: Badge pill, 4px dot indicator, count chip
- Interaction: Click navigates to relevant detail

**Tier 2 -- Contextual (working context):**

- Session form: auth picker card with "Blue Cross | 97153 | 12/40 remaining" + utilization bar
- Client detail header: summary card per active auth
- Calendar tooltip: "Auth expires Jun 7 -- 12 units remaining"
- Design: Compact card, inline text with badge, tooltip

**Tier 3 -- Focused (management context):**

- Auth list table: full row with utilization %, status, expiry, payer
- Dashboard widget: severity-sorted alert cards
- Design: Data table, alert widgets, metric cards

**Tier 4 -- Deep dive (full context):**

- Auth detail page: header + tabs (Overview, Services, Sessions, Documents, Timeline)
- Burndown chart, full service line breakdown, session history, document uploads
- Design: Rich header card + tabbed content

**Role-based defaults:**
| Role | Default Tier | Sees | Doesn't See |
|------|-------------|------|-------------|
| RBT | Tier 2 | Remaining units, auth picker, session form context | Auth numbers, billing rates, financial projections |
| BCBA | Tier 3 | Utilization trends, expiry warnings, caseload overview | Individual session billing details |
| Billing | Tier 4 | Full breakdown, documents, timeline, rates | Clinical session notes |
| Admin | Tier 1 + 3 | Aggregated health, revenue at risk, dashboard | Individual service line details |

**What makes it good UX:**

- Carbon Design System proved that status indicators must be contextual (placed near the element they describe), severity-driven (critical = high attention, healthy = low attention), and conditionally displayed (only show when something needs communication).
- Stripe proved that usage data should appear at the point of billing/decision, not on a separate analytics page.
- NN/g's research on progressive disclosure: "Defer advanced information to secondary screens. The key insight: every touchpoint shows exactly the right amount of detail for that context."
- The "absence is success" corollary: if no indicators appear, everything is healthy. Only surface alerts when action is needed.

**Page type:** System-wide architectural pattern.

**Maturity:** Production-proven (Carbon, Stripe, Notion). The four-tier model applied to ABA authorization is novel but follows established UX principles.

---

## Pattern 11: Pacing Gauge -- Actual vs. Expected Utilization Velocity

**Stolen from:** RethinkBH authorization utilization pacing + Mercury transaction velocity charts

**What it looks like:**
A compact visualization showing whether utilization is on-pace, ahead, or behind for the authorization period. This is different from the burndown chart (Pattern 3) -- it's a single-glance gauge, not a time-series chart.

```
Authorization Pacing
+------------------------------------------+
|  97153 Direct Therapy                     |
|                                           |
|  Period: 40% elapsed (Jan 1 - Jun 30)    |
|  Units:  30% used (12 of 40)             |
|                                           |
|  Status: UNDER-PACED                      |
|  [------||--------||||-----------]        |
|          ^actual   ^expected              |
|                                           |
|  At this point, you should have used      |
|  16 units. You've used 12.                |
|  Gap: 4 units behind.                     |
|  Risk: Under-utilization (-10% of         |
|  authorized units) if pace continues.     |
+------------------------------------------+
```

The gauge shows a marker for actual position and a marker for expected position on a single horizontal line. The gap between them tells the story. Pacing states:

- **On pace** (within +/- 10%): green, no alert
- **Ahead of pace** (>10% ahead): amber, risk of early exhaustion
- **Behind pace** (>10% behind): amber, risk of under-utilization
- **Critically ahead** (projected exhaustion >30 days before auth end): red
- **Critically behind** (<50% used with >50% period elapsed): red

**Who it serves:** BCBAs (scheduling decisions), Admin (practice-wide pacing review).

**What makes it good UX:**

- RethinkBH offers "authorization utilization pacing" as a feature but presents it as a report/metric, not as a visual gauge. The visual treatment makes it instantly comprehensible.
- Under-utilization is as costly as over-utilization in ABA. Authorized hours not used = revenue left on the table + a signal to payers that fewer hours are needed (risking reduced future authorizations).
- The dual-marker gauge communicates the relationship between time elapsed and units consumed in a way that a single percentage number cannot.

**Page type:** Auth detail page (compact widget) + dashboard (aggregated across authorizations).

**Maturity:** Production concept (RethinkBH pacing metrics). Novel visual treatment. The dual-marker gauge is an established data visualization pattern not yet applied to ABA authorization.

---

## Pattern 12: Absence-is-Success Design Philosophy

**Stolen from:** Carbon Design System conditional indicators + Mercury's "highlights, not raw data" approach

**What it looks like:**
Rather than showing green "healthy" badges on every authorization, the system only surfaces visual indicators when something deviates from the expected state.

| Auth State                                     | Visual Treatment                             | Why                                     |
| ---------------------------------------------- | -------------------------------------------- | --------------------------------------- |
| Active, healthy utilization, not expiring soon | No indicator, no badge, no color. Clean row. | Absence of signal = everything is fine. |
| 80%+ utilization                               | Amber badge appears                          | Needs attention soon                    |
| 95%+ utilization                               | Red badge appears                            | Needs immediate attention               |
| Expiring in 30 days                            | Blue "30d" countdown chip appears            | Informational                           |
| Expiring in 7 days                             | Red "7d" countdown chip appears              | Urgent                                  |
| Over-utilized                                  | Red "OVER" badge with icon                   | Critical                                |

**What makes it good UX:**

- Mercury's design philosophy: "highlights, not raw data." The dashboard surfaces insights -- things that are notable or need attention -- rather than displaying all data with equal weight.
- Carbon Design System: "Conditional presence -- indicators appear or change based on conditions. They are not always visible." This prevents badge blindness where users stop seeing green "OK" badges because they're everywhere.
- CentralReach's approach of showing utilization rates on every row leads to information overload. When everything has a badge, nothing stands out.
- In a practice with 50 active authorizations, maybe 5 need attention. The UI should make those 5 visually prominent and let the other 45 recede.

**Page type:** System-wide design rule.

**Maturity:** Production-proven (Carbon, Mercury). Novel application to ABA authorization -- all competitors show status on every row.

---

## Pattern 13: Compact Auth Constraint Warning at Point of Scheduling

**Stolen from:** Passage Health + AlohaABA + Hub Planner overbooking prevention

**What it looks like:**
When creating or editing a scheduled session, the system validates authorization constraints in real-time and shows contextual inline warnings:

```
Schedule Session for James Martinez
+-------------------------------------------+
| Date: March 28, 2026    Time: 9:00 AM     |
| Duration: 1 hour        CPT: 97153        |
| Provider: Sarah Chen                       |
+-------------------------------------------+
| [!] Authorization Warning                  |
|                                            |
|  This session (4 units) will leave only    |
|  2 units remaining on Auth #AUTH-001.      |
|  Next scheduled session (Mar 30) needs     |
|  4 units -- insufficient.                  |
|                                            |
|  [ Schedule Anyway ]  [ Adjust Schedule ]  |
+-------------------------------------------+
```

Four validation states:

1. **No active auth:** Yellow banner. "No authorization found. Session may not be billable." CTA: "Create Authorization"
2. **Auth expires before session:** Amber banner. "Authorization expires [date], before this session." CTA: "View Authorization"
3. **Insufficient units:** Red banner with specific unit math. CTA: "Schedule Anyway" (with override reason, audit logged) or "Adjust Schedule"
4. **All clear:** No banner. Quiet green check mark in the corner. This is the absence-is-success pattern.

**Who it serves:** BCBAs (scheduling decisions), schedulers, admin.

**What makes it good UX:**

- AlohaABA and Passage Health both validate auth limits at schedule time, but their warnings are generic ("beyond authorization limits"). Clinivise shows the specific unit math -- "4 units needed, 2 remaining" -- making the constraint concrete and actionable.
- Hub Planner's pattern: show the warning during the scheduling process, not after submission. Prevention is better than error messages.
- The "all clear" state being silent prevents banner fatigue -- most sessions will pass validation, so the warning is meaningful when it appears.

**Page type:** Scheduling/calendar (inline contextual warning).

**Maturity:** Production-proven (Passage Health, AlohaABA, Hub Planner). The specific unit-math warning with forward-looking impact ("next session needs 4 units") is novel.

---

## Pattern 14: Authorization Health Score (Composite Metric)

**Stolen from:** Cohere Health Align trust scoring + credit score visualization patterns

**What it looks like:**
A single composite number (0-100) representing the overall health of an authorization, combining:

- Utilization pace (on-track vs. ahead vs. behind)
- Time remaining vs. units remaining ratio
- Renewal status (is renewal in progress?)
- Session scheduling coverage (are future sessions scheduled to use remaining units?)

```
Authorization Health Score
+-----------------------------+
|          [  78  ]           |
|        /  GOOD  \           |
|   =====[=========]---       |
|   0   25   50   75  100     |
|                              |
|  Utilization: On pace (+2%) |
|  Time left: 74 days         |
|  Renewal: Not started       |
|  Scheduled: 80% of remaining|
+-----------------------------+
```

Score ranges: 0-40 (red, critical), 41-70 (amber, needs attention), 71-100 (green, healthy).

**Who it serves:** Admin/owners (practice-wide health overview). The aggregate of all authorization health scores across the practice gives a single "practice auth health" number.

**What makes it good UX:**

- Cohere Health's Align feature creates a "trust score" per provider that dynamically adjusts PA requirements. The same concept -- a composite score -- applied to authorization health gives admins a single number to monitor.
- Credit score visualization is universally understood. People know "78 = good" without explanation.
- Reduces cognitive load: instead of checking utilization %, expiry date, renewal status, and scheduling coverage separately, one number captures them all.

**Page type:** Dashboard (practice-wide) + auth detail page header.

**Maturity:** Experimental. The composite scoring concept is novel for authorization management. Implement as a Phase 2 feature after validating the component metrics individually in Phase 1. Risk: the score formula needs careful calibration to be meaningful, not arbitrary.

---

## Cross-Cutting Theme: What the Best YC Startups Are Doing (2025-2026)

Several YC-backed startups are attacking the prior authorization problem from different angles. The common thread: **AI agents that automate the entire authorization lifecycle, not just one step.**

| Startup            | YC Batch | Focus                          | Auth Approach                                                                       |
| ------------------ | -------- | ------------------------------ | ----------------------------------------------------------------------------------- |
| **Saffron Health** | Recent   | AI for specialist referrals    | Agents complete prior authorizations, find in-network providers, help patients book |
| **Locata**         | Recent   | Referral automation            | AI agents automate PA submission, broadcast updates, follow up with patients        |
| **Beacon Health**  | W26      | AI back-office employees       | Automates PA, referrals, risk adjustment as background workflows                    |
| **Ruma Care**      | Recent   | Infusion clinic automation     | PA automation specifically for specialty medication administration                  |
| **Prosper**        | Recent   | Healthcare workflow automation | AI agents for PA among other time-intensive workflows                               |

**Key insight for Clinivise:** These startups are building general-purpose PA automation for large provider organizations. None are ABA-specific. The ABA authorization workflow has unique requirements (CPT 97153-97158, unit-based tracking with CMS 8-minute rule, frequency-based authorizations) that general PA automation doesn't handle. Clinivise's opportunity is ABA-specialized AI authorization management -- a niche too small for these startups but deeply valuable for small practices.

**Maturity:** All early-stage (pre-revenue to early revenue). The pattern of "AI agent handles the full PA lifecycle" is validated by Cohere Health (production, 660K+ providers) and Waystar (production, post-Olive AI acquisition). These YC startups are bringing the same approach to smaller, specialized use cases.

---

## Regulatory Context Informing UX (2026)

The CMS Interoperability and Prior Authorization Final Rule takes effect in 2026:

- Health plans must respond to urgent PA requests within 72 hours, standard within 7 days
- Plans must support electronic PA (HL7 FHIR-based APIs)
- Over 50 major insurers pledged to streamline PA starting in 2026
- CMS WISeR pilot: AI-powered PA screening in 6 states

**UX implication:** Design the authorization tracking UI to accommodate faster turnaround times. The "Pending Approval" state may last days instead of weeks. The status board (Pattern 8) should support real-time updates. The dashboard should highlight response time SLA compliance ("Blue Cross responded in 48 hours, within 72-hour requirement").

---

## Synthesis: What Clinivise Should Build

### Phase 1 (Now -- Sprint 2D/3A/3B)

1. **Segmented utilization bar component** (Pattern 1) -- the foundation component used everywhere
2. **Ambient context at all touchpoints** (Pattern 2) -- auth data visible on sidebar, client list, client detail, session form, auth list, auth detail
3. **Four-tier progressive disclosure** (Pattern 10) -- different detail levels per context
4. **Absence-is-success indicators** (Pattern 12) -- only show badges when something needs attention
5. **Touch-friendly auth picker cards** (Pattern 6) -- session form auth selection
6. **Scheduling constraint warnings** (Pattern 13) -- inline auth validation during scheduling
7. **Alert severity tiers** -- 80%/95%/100% utilization + 30/14/7 day expiry

### Phase 1.5 (Polish)

8. **Burndown projection chart** (Pattern 3) -- auth detail overview tab
9. **Pacing gauge** (Pattern 11) -- compact widget on auth detail + dashboard
10. **Tiered usage meters on dashboard** (Pattern 4) -- practice-wide CPT utilization aggregation
11. **Global filter dashboard** (Pattern 5) -- filter all dashboard widgets by BCBA/payer/status

### Phase 2 (AI + Billing)

12. **AI auth letter parsing** (Pattern 7) -- side-by-side PDF + extracted fields with confidence scoring
13. **Authorization pipeline/kanban** (Pattern 8) -- lifecycle status board
14. **Predictive re-auth trigger** (Pattern 9) -- proactive renewal notifications
15. **Authorization health score** (Pattern 14) -- composite metric

---

## Sources

### ABA Practice Management

- [CentralReach Authorization Analysis Report](https://help.centralreach.com/the-authorization-analysis-report/)
- [AlohaABA Authorization Management](https://alohaaba.com/features/authorization-management)
- [Motivity All-in-One ABA Software](https://www.motivity.net/solutions/aba-practice-management-all-in-one)
- [RethinkBH Practice Management](https://www.rethinkbehavioralhealth.com/our-solutions/practice-management/)
- [RethinkBH Enhanced Analytics](https://www.prnewswire.com/news-releases/rethinkbh-debuts-enhanced-analytics-to-optimize-aba-clinical-programming-and-practice-management-302225666.html)
- [Theralytics ABA Practice Management](https://www.theralytics.net/)
- [Passage Health ABA PM Software](https://www.passagehealth.com/blog/aba-practice-management-software)
- [Raven Health ABA Software](https://ravenhealth.com/)
- [ABA Authorization Management Best Practices](https://www.abamatrix.com/aba-authorization-management/)
- [ABA Practice Utilization Scheduling Tips](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/)

### Design-Leading SaaS

- [Ramp Budgets Launch (Jan 2026)](https://ramp.com/blog/ramp-budgets-launch)
- [Ramp Budgets Product Page](https://ramp.com/budgets)
- [Mercury Cash Burn Rate](https://mercury.com/tools/cash-burn-rate-calculator)
- [Mercury Insights](https://mercury.com/blog/insights-financial-data-art)
- [Mercury Updated Transactions Page](https://mercury.com/blog/updated-transactions-page)
- [Vercel Usage Dashboard](https://vercel.com/blog/sophisticated-usage-dashboard)
- [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design System (Figma)](https://www.figma.com/community/file/1222872653732435433/linear-design-system)
- [Notion Dashboard Views (March 2026)](https://www.notion.com/releases/2026-03-10)
- [Notion Dashboards Help](https://www.notion.com/help/dashboards)

### AI & Healthcare Authorization

- [Cohere Health UM Suite](https://www.coherehealth.com/utilization-management-suite)
- [Cohere Health Align](https://www.coherehealth.com/news/cohere-health-prior-authorization-compliance-ai)
- [SPRY Prior Authorization Software](https://www.sprypt.com/prior-authorization)
- [Infinx AI Authorization Determination](https://intuitionlabs.ai/articles/cohere-health-ai-prior-authorization)
- [Waystar Auth Accelerate](https://www.sprypt.com/blog/prior-authorization-software-electronic-solutions)
- [CoverMyMeds PA Renewals](https://www.covermymeds.com/main/pdf/cmm-case-study-renewals.pdf)
- [Nirvana Health Eligibility Verification](https://www.meetnirvana.com/)
- [Droidal AI Prior Authorization Trends](https://droidal.com/blog/ai-prior-authorization-trends-healthcare/)

### YC Startups (2025-2026)

- [YC Healthcare Companies](https://www.ycombinator.com/companies/industry/healthcare)
- [YC Healthcare IT Companies](https://www.ycombinator.com/companies/industry/Healthcare%20IT)
- [Prior Authorization Commitment 2026 (MedCity News)](https://medcitynews.com/2025/12/prior-authorization-commitment-2026/)

### Regulatory

- [CMS Prior Authorization Final Rule](https://drfirst.com/blog/how-2026-will-defog-the-prior-authorization-process/)
- [CMS WISeR AI PA Pilot](https://www.jonesday.com/en/insights/2025/08/coming-january-2026-cms-launches-ai-program-to-screen-prior-authorization-requests-for-treatments)
- [Health Affairs: AI in Utilization Review](https://www.healthaffairs.org/doi/10.1377/hlthaff.2025.00897)
- [Prior Authorization Crackdowns 2026](https://www.bristolhcs.com/blog/blog-detail/prior-authorization-crackdowns-how-predictive-utilization-controls-are-reshaping-healthcare-in-2026)

### Design Systems & Patterns

- [Carbon Design System Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/)
- [shadcn/ui Multi-Value Progress Bar Discussion](https://github.com/shadcn-ui/ui/discussions/3464)
- [SaaS Dashboard Design Patterns](https://dashboarddesignpatterns.github.io/patterns.html)
- [SaaSUI Real Interface Design Screenshots](https://www.saasui.design/)
- [Using Progress Bars in SaaS (Userpilot)](https://userpilot.medium.com/using-a-progress-bar-ui-in-saas-types-and-examples-2e6c7635cb62)
- [Healthcare App Design (Eleken)](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Tablet App Design Tips](https://gapsystudio.com/blog/tablet-app-design/)

### Tablet / Mobile UX

- [Healthcare UX/UI Design Trends 2026](https://www.excellentwebworld.com/healthcare-ux-ui-design-trends/)
- [NN/g Tablet UX Report](https://media.nngroup.com/media/reports/free/Tablet_Website_and_Application_UX.pdf)
- [Catalyst Data Collection Reviews](https://www.selecthub.com/p/aba-software/catalyst-data-collection/)
