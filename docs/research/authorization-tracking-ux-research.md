# Authorization Tracking UX & AI-Native Research

> Sprint 2D pre-build research. Covers UX patterns, alerting, AI-native features, mobile/tablet UX, and workflow visualization for authorization tracking in ABA therapy practice management.
>
> Researched: 2026-03-21

---

## Table of Contents

1. [Best-in-Class Authorization UX](#1-best-in-class-authorization-ux)
2. [Authorization Alerting Patterns](#2-authorization-alerting-patterns)
3. [AI-Native Authorization Features](#3-ai-native-authorization-features)
4. [Mobile & Tablet UX](#4-mobile--tablet-ux)
5. [Authorization as a Workflow Pipeline](#5-authorization-as-a-workflow-pipeline)
6. [Recommended Architecture for Clinivise](#6-recommended-architecture-for-clinivise)

---

## 1. Best-in-Class Authorization UX

### 1A. Stripe Credits — Quota/Limit Tracking Done Right (production-proven)

**What they do:**

- Stripe's billing credits feature maintains a ledger system that tracks every credit-related action — granting, consuming, and invoicing. The Credit Balance Summary shows a running balance after all ledger transactions.
- Credits are tied to concrete business value rather than abstract units (e.g., "1 credit = 1,000 API calls"). This reduces confusion.
- Threshold-based webhooks trigger automated notifications when customers approach depletion. The system pre-calculates overages and consolidates into unified invoices.
- The UI surfaces usage inline at the point of billing, not in a separate analytics page.

**What to steal for Clinivise:**

- **Ledger-style utilization tracking**: Show authorization utilization as a running ledger — each session logged is a "debit" against approved units. Display "12 of 40 units used" inline, not buried in a detail page.
- **Concrete unit labeling**: ABA units are already concrete (15-min increments), but label them clearly: "12 units used (3.0 hours) of 40 approved (10.0 hours)" — dual format for BCBAs who think in hours and billing staff who think in units.
- **Threshold webhooks as alerts**: Map Stripe's approach to authorization thresholds — 80% (warning), 95% (critical), 100%+ (over-utilized). Trigger inline alerts, not just emails.

**Implement:** Phase 1 (Sprint 2D) — this is the core utilization tracker pattern.

**Source:** [Stripe Billing Credits](https://stripe.com/blog/introducing-credits-for-usage-based-billing), [Stripe Credits Docs](https://docs.stripe.com/billing/subscriptions/usage-based/billing-credits)

---

### 1B. Linear — Data-Dense Progress Tracking Without Clutter (production-proven)

**What they do:**

- Linear preserves rich information density without feeling overwhelming. Not every element carries equal visual weight — parts central to the user's task stay in focus while navigation elements recede.
- Sidebar, tabs, headers, and panels are tuned to reduce visual noise. Compact tabs with rounded corners, `text-xs` sizing, overflow handling via popover.
- Progress tracking is integrated into project views with colored progress bars showing initiative completion. The bars use segmented fills with distinct colors per status (done, in-progress, blocked).
- Right-side metadata panel keeps context visible while main content scrolls.

**What to steal for Clinivise:**

- **Segmented utilization bars**: Instead of a single progress bar, use a segmented bar per authorization service line. Each CPT code gets its own segment showing used/approved. The overall authorization bar aggregates all service lines.
- **Visual weight hierarchy**: Authorization status (active, expiring, expired) gets maximum visual weight. Utilization percentages get secondary weight. Metadata (auth number, payer, dates) recedes.
- **Compact tab overflow**: Authorization detail page will have tabs (Overview, Services, Sessions, Documents, Timeline). Apply Linear's overflow-to-popover pattern for tablet viewports.

**Implement:** Phase 1 (Sprint 2D) — the segmented bar and visual hierarchy.

**Source:** [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui), [Linear Design Refresh](https://linear.app/now/behind-the-latest-design-refresh)

---

### 1C. Mercury — Financial Tracking Visualization (production-proven)

**What they do:**

- Mercury's dashboard highlights insights rather than raw data. Budget tracking uses progress bars to convey proximity to goals.
- Color is used sparingly — red for alerts, green for positives. Top-left placement for highest-priority metrics (users scan left-to-right, top-to-bottom).
- Expense categorization and cash flow trends use clean bar and line charts. The design avoids clutter by grouping related metrics.
- Interactive elements surface on hover, keeping the default view clean.

**What to steal for Clinivise:**

- **Burndown visualization**: Apply Mercury's budget-to-spend ratio as a visual model for authorization burndown. Show a projection line: "At current pace, units exhaust on [date]" with a simple area chart.
- **Left-to-right scanning**: Place utilization percentage and status on the left of authorization cards. Place metadata (dates, auth number) on the right. Most important data is seen first.
- **Sparse color**: Only use color for semantic meaning — emerald for healthy utilization (<80%), amber for warning (80-95%), red for critical (>95%), blue for informational.

**Implement:** Phase 1 (burndown as a Sprint 3B dashboard widget). Area chart deferred to Phase 1.5.

**Source:** [Mercury Banking](https://mercury.com), [Mercury Demo](https://demo.mercury.com/dashboard)

---

### 1D. Card-Based vs. Table-Based Layout — When to Use Each

**Research findings:**

Tables excel when users need to scan large datasets, compare values across rows, or take bulk actions. Adjacent data points are easy to compare without storing information in working memory.

Cards excel for high-level overviews, rich individual content, and drag-and-drop. Cards stack naturally on mobile. Cards are better when N < 10 and each item has heterogeneous data.

The best approach is often a combination — cards for the authorization overview (high-level status, utilization bar, key dates) with a table for the service line detail (CPT codes, units, rates).

**Decision for Clinivise:**

| View                             | Pattern               | Rationale                                                                                                                  |
| -------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Authorization list page          | Data table            | Sortable, filterable, 10-100+ authorizations per practice. Users need to compare expiry dates, utilization across clients. |
| Authorization detail: header     | Card-style summary    | One authorization, rich metadata. Card with utilization bar, status badge, key dates, client name.                         |
| Authorization detail: services   | Compact table         | 1-8 service lines per auth. Need column comparison (approved vs. used vs. remaining per CPT).                              |
| Dashboard: expiring auths widget | Card list (max 5)     | Scannable at a glance. Card per expiring auth with countdown badge.                                                        |
| Dashboard: utilization alerts    | Stacked alert banners | Severity-sorted. Inline with dashboard flow.                                                                               |
| Session form: auth picker        | Cards in a sheet      | Touch-friendly. Show utilization inline so RBTs see remaining units before selecting.                                      |

**Implement:** Phase 1 (Sprint 2D) — this defines the component architecture.

**Source:** [Table vs List vs Cards](https://uxpatterns.dev/pattern-guide/table-vs-list-vs-cards), [Baymard: Dashboard Cards](https://baymard.com/blog/cards-dashboard-layout), [NN/g: Data Tables](https://www.nngroup.com/articles/data-tables/)

---

### 1E. Segmented & Multi-Segment Progress Bars (design system pattern)

**Research findings:**

Multi-segment progress bars display progress toward multiple goals within a single container. Stacked segments represent each goal's progress and overall completion status, using distinct colors per segment.

The VA.gov Design System uses segmented progress bars for multi-step form flows. Stack Overflow's design system (Stacks) provides dividers to create segmented progress bars that can be independent of or locked to dividers.

Best practice: limit to 5-7 segments. Use distinct colors. Provide text labels alongside visual bars for accessibility.

**Application to Clinivise:**

Authorization utilization bars should be multi-segment when showing the breakdown across service lines:

```
┌──────────────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ 97153 (12/40)    97155 (4/8)    97156 (2/4)      │
│ ═══════30%═══    ═══50%═══      ═══50%═══         │
└──────────────────────────────────────────────────┘
  Overall: 18/52 units used (34.6%)
```

For individual service lines, use a single-segment bar with color coding:

- Emerald fill: 0-79%
- Amber fill: 80-94%
- Red fill: 95-100%
- Red fill with overflow indicator: >100%

**Implement:** Phase 1 (Sprint 2D, task 73) — core utilization component.

**Source:** [VA.gov Progress Bar](https://design.va.gov/components/form/progress-bar-segmented), [Stacks Progress Bars](https://stackoverflow.design/product/components/progress-bars/), [Domo Progress Bars](https://www.domo.com/learn/charts/progress-bars)

---

### 1F. Detail Page Patterns — Tabs, Sections, Timeline

**Research findings:**

Tabs work best when splitting information into a few clear, equally important sections that users frequently switch between. Limit to 5-6 tabs maximum. Beyond that, consider alternative navigation.

Activity timelines help users reconstruct sequences, audit processes, and follow progress. Vertical orientation for activity feeds. Emphasize important events visually (size, color, weight). Use subdued styling for background items. Progressive disclosure: show summary by default, expand for details.

**Application to Clinivise authorization detail page:**

**Tab structure (5 tabs):**

1. **Overview** — Authorization summary card, all service line utilization bars, projected exhaustion, key dates
2. **Services** — Service line table (CPT, approved, used, remaining, rate). Add/edit/remove service lines.
3. **Sessions** — Filtered session table for this authorization only. Inline status (billed, pending, void).
4. **Documents** — Associated documents (auth letter PDF, supporting docs). Upload + AI parsing trigger.
5. **Timeline** — Audit log filtered to this authorization. Created, modified, units consumed, expiry alerts, re-auth events.

**Header (always visible above tabs):**

- Client name (linked)
- Authorization number + payer name
- Status badge (pending, active, expiring, expired, denied)
- Date range with countdown ("Expires in 23 days")
- Overall utilization bar
- Actions: Edit, Re-authorize, Archive

**Implement:** Phase 1 (Sprint 2D, task 71).

**Source:** [Timeline Pattern](https://uxpatterns.dev/patterns/data-display/timeline), [Tabs UX](https://www.eleken.co/blog-posts/tabs-ux), [Nicelydone Activity Feeds](https://nicelydone.club/pages/activity-feeds)

---

### 1G. CentralReach and AlohaABA — Competitive Gaps to Exploit

**CentralReach:**

- Has automated authorization tracking that monitors balances, tracks utilization by therapist and practice, and sends alerts.
- BUT: layout elements are too small, causing click errors. Configuration is tedious. Mobile/desktop experiences are inconsistent. Frequent outages.
- No predictive pacing. No inline point-of-action alerts. No AI letter parsing.

**AlohaABA:**

- Tracks authorizations and alerts staff to missing pre-authorizations before claim submission.
- Text fields and authorization configurations are customizable per practice workflow.
- BUT: no burndown/projection, no AI features, basic visualization.

**Motivity/RethinkBH:**

- RethinkBH automates insurance authorization tracking and renewal monitoring, with analysis by progress, renewal requirements, therapist, and practice.
- Mobile app rebuilt with real-time data syncing for field use.

**Competitive opportunity for Clinivise:**

1. **Inline utilization at point of action** — show remaining units when logging a session, not just on a separate dashboard
2. **Predictive burndown** — "At current pace, units exhaust 2 weeks before auth expires" (nobody does this)
3. **AI letter parsing** — upload PDF, get structured auth data (nobody in ABA does this)
4. **Touch-friendly auth selection** — when an RBT logs a session on a tablet, show authorization cards with utilization bars, not a dropdown
5. **Threshold alerts without noise** — tiered severity, inline placement, actionable CTAs

**Source:** [CentralReach](https://centralreach.com/products/aba-practice-management-software/), [AlohaABA](https://alohaaba.com), [RethinkBH](https://www.rethinkbehavioralhealth.com/our-solutions/practice-management/)

---

## 2. Authorization Alerting Patterns

### 2A. Alert Severity Tiers — The Right Framework

**Research findings:**

Notification design should classify on three severity levels: high, medium, and low attention. Limit to 3 visible alerts before showing a "more" footer — displaying 10 alerts overwhelms users and causes them to miss critical information.

Healthcare-specific research (PMC, AHRQ) shows that alert fatigue is a severe problem: clinicians seeing 100-200 alerts per day leads to 49-96% of alerts being overridden. The five-rights framework (right information, right person, right time, right format, right channel) reduced alert volume by 80% while improving response rates.

**Application to Clinivise:**

| Alert Type                                      | Severity        | Trigger                                    | Display Pattern                                                          | Frequency           |
| ----------------------------------------------- | --------------- | ------------------------------------------ | ------------------------------------------------------------------------ | ------------------- |
| Over-utilized (>100%)                           | Critical (red)  | Session logged that exceeds approved units | Inline banner on auth detail + session form block/warn + dashboard alert | On every occurrence |
| Near-exhaustion (95-100%)                       | Critical (red)  | Utilization crosses 95% threshold          | Inline banner on auth detail + dashboard alert                           | Once per crossing   |
| High utilization (80-94%)                       | Warning (amber) | Utilization crosses 80% threshold          | Subtle badge on auth list + dashboard widget                             | Once per crossing   |
| Expiring soon (7 days)                          | Critical (red)  | Calendar countdown                         | Dashboard alert + auth list badge                                        | Daily               |
| Expiring soon (14 days)                         | Warning (amber) | Calendar countdown                         | Dashboard widget                                                         | Daily               |
| Expiring soon (30 days)                         | Info (blue)     | Calendar countdown                         | Dashboard widget only                                                    | Weekly              |
| Under-utilized (<50% used, >50% period elapsed) | Warning (amber) | Pacing calculation                         | Dashboard widget + auth detail callout                                   | Weekly              |
| Projected early exhaustion                      | Warning (amber) | Burn rate exceeds sustainable pace         | Auth detail callout                                                      | On recalculation    |

**Implement:** Phase 1 — 80%/95%/100% utilization (Sprint 2D), expiry alerts (Sprint 2D), under-utilization + projection (Sprint 3B dashboard).

---

### 2B. Inline vs. Toast vs. Banner — When to Use Each

**Research findings (Carbon Design System, Smashing Magazine, PatternFly):**

| Pattern               | When to Use                                                                                   | Persistence                             | Interruptiveness                       |
| --------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------------------- |
| **Inline banner**     | Alert relates to specific page content. User needs to see it in context.                      | Persistent until dismissed or resolved. | Low — user discovers it while working. |
| **Toast**             | Immediate feedback after user action (e.g., "Session saved"). Low-priority confirmations.     | Auto-dismiss (3-5 seconds).             | Medium — appears but doesn't block.    |
| **Page-level banner** | System-wide or page-wide status. Authorization expired globally.                              | Persistent.                             | Low-medium — visible but not blocking. |
| **Blocking dialog**   | Destructive or irreversible action. "This session exceeds authorized units — proceed anyway?" | Until user acts.                        | High — blocks workflow.                |
| **Dashboard widget**  | Aggregated alerts. "3 authorizations expiring this week."                                     | Persistent on dashboard.                | None — user chooses to look.           |
| **Badge/pill on nav** | Unread alert count. "Authorizations (3)" in sidebar.                                          | Until alerts are resolved.              | Very low — peripheral awareness.       |

**Decision for Clinivise:**

- **Session form: exceeds authorized units** → Blocking dialog with amber warning (allow override with reason) or red block (no override, hard stop). Configurable per practice.
- **Authorization detail: utilization threshold crossed** → Inline banner at top of detail page. Persistent until units are adjusted or auth is renewed.
- **Authorization list: expiring soon** → Badge pill on the row + filter preset for "Expiring Soon."
- **Dashboard: aggregated alerts** → Dedicated alert widget, severity-sorted, max 5 visible with "View all" link.
- **Session saved / authorization created** → Toast notification (auto-dismiss).
- **Sidebar: unresolved alerts** → Badge count on "Authorizations" nav item.

**Implement:** Phase 1 — inline banners and badges (Sprint 2D), dashboard widget (Sprint 3B), sidebar badge (Sprint 3B), blocking dialog on session form (Sprint 3A).

**Source:** [Carbon Notification Pattern](https://carbondesignsystem.com/patterns/notification-pattern/), [Smashing Magazine Notifications UX](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/), [PatternFly Alert Guidelines](https://www.patternfly.org/components/alert/design-guidelines/)

---

### 2C. Alert Fatigue Prevention — Healthcare-Specific Strategies

**Research findings (AHRQ, Cleveland Clinic, Swiss Medical Weekly):**

Alert fatigue occurs when constant bombardment of unhelpful alerts causes clinicians to disregard or fail to respond to warnings. Key prevention strategies:

1. **Increase alert specificity**: Reduce clinically inconsequential alerts. Only alert on actionable thresholds.
2. **Tier alerts by severity**: Not all alerts deserve the same visual weight. Critical alerts interrupt; informational alerts passively surface.
3. **Apply human factors principles**: Format, content, legibility, color all affect response rates. User-centered design increased alert response from baseline to 14%.
4. **Customize to context**: Tailor alerts to patient attributes and provider roles. An RBT doesn't need billing alerts. A BCBA needs utilization alerts. Billing staff needs all of them.
5. **Sync to appointment times**: Let clinicians choose when to attend to alerts. Syncing alerts to scheduled times preserved response rates over time.
6. **Replace interruptive with passive**: One study replaced an interruptive alert with passive clinical decision support (visible but not blocking) and maintained the same clinical outcome with 80% less alert volume.

**Application to Clinivise:**

- **Role-based alert visibility**: RBTs see only session-relevant alerts (remaining units for today's session). BCBAs see utilization trends and expiry warnings. Billing staff sees all financial alerts.
- **Passive-first philosophy**: Default to inline banners and dashboard widgets. Reserve blocking dialogs only for over-utilization during session logging (preventing unbillable sessions is a hard business rule).
- **Aggregate, don't spam**: "3 authorizations expiring in 14 days" as one dashboard item, not 3 separate toasts.
- **Actionable CTAs**: Every alert must have a clear next step — "Re-authorize now," "Adjust schedule," "Review utilization."
- **Dismissible with memory**: If a BCBA acknowledges an 80% utilization warning, don't show it again until 95%. Track acknowledgment per authorization per user.

**Implement:** Role-based visibility in Phase 1 (Sprint 2D/3A). Dismissible alerts with memory deferred to Phase 1.5 (needs a `user_alert_acknowledgments` table).

**Source:** [AHRQ Alert Fatigue](https://psnet.ahrq.gov/primer/alert-fatigue), [Cleveland Clinic Alert Fatigue](https://consultqd.clevelandclinic.org/fighting-alert-fatigue-to-improve-patient-safety-and-standardization-of-care), [PMC Passive CDS Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10830237/)

---

## 3. AI-Native Authorization Features

### 3A. AI Authorization Letter Parsing — The Killer Feature

**Market context:**

No ABA competitor offers AI-powered authorization letter parsing. CentralReach, AlohaABA, Motivity, and RethinkBH all require manual data entry from authorization letters. This is Clinivise's Phase 1 capstone AI feature.

**How the best AI document extraction works (2025-2026):**

Modern approaches use multimodal vision-language models (Claude, GPT-4 Vision, Gemini) rather than traditional OCR. These models understand document layout, context, and meaning — not just character recognition.

Key architecture patterns from HealthEdge, LandingAI, and LlamaIndex:

- **Multi-pass extraction**: Layout-aware models break down the document visually, then vision-language models interpret each region in context.
- **Confidence scoring**: Each extracted field includes a confidence score. Low-confidence fields route to human review. High-confidence fields auto-populate.
- **Structured output**: LLMs output structured JSON directly — "Read this document and give me the data as JSON with specific fields."
- **Agentic document processing**: LandingAI's Agentic Document Extraction reviews and corrects outputs in real-time for near-perfect results, even on edge cases.

**Clinivise implementation plan (already in roadmap, tasks 97-100):**

1. Upload PDF/image of authorization letter
2. Send to LLM (Claude via direct API for prototype, Bedrock for production) with structured output schema
3. Extract: auth number, payer, client name, date range, CPT codes, approved units per code, provider requirements, diagnosis codes
4. Return confidence scores per field
5. Present in review UI — green (high confidence, auto-filled), amber (medium, needs verification), red (low, needs manual entry)
6. Staff confirms/corrects, saves to `authorizations` + `authorization_services` tables
7. Store original document in `documents` table via Vercel Blob

**What makes this frontier:**

- Vision model reads the PDF directly — no OCR preprocessing needed
- Handles varied letter formats across payers (each payer has a different template)
- Extracts implicit information (e.g., "approved for 6 months" → calculates end date from start date)
- Links extracted CPT codes to existing `authorization_services` schema automatically

**Implement:** Phase 1 (Sprint 4B, tasks 97-100). L effort. Already scored 5/5/5 in AI Feature Brainstorm.

**Source:** [Vellum: LLMs vs OCR](https://www.vellum.ai/blog/document-data-extraction-llms-vs-ocrs), [LandingAI Healthcare](https://landing.ai/solutions/healthcare), [LlamaIndex Document AI](https://www.llamaindex.ai/blog/document-ai-the-next-evolution-of-intelligent-document-processing)

---

### 3B. AI Prior Authorization Industry — What Cohere, Waystar, and Infinx Are Doing

**Cohere Health:**

- Automates decisioning for up to 90% of care needs. 50% faster reviews, 30% more accurate decisions.
- **Cohere Align** personalizes the PA process by analyzing providers' historical behavior. Pre-approved providers get ~80% of submissions streamlined, cutting submission time by 55%.
- **Early Trend Signal Intelligence** predicts medical utilization trends up to 3 months before claims data is available, using prior authorization data.
- AI extracts structured and unstructured information from clinical notes, imaging reports, and medical documentation.

**Waystar:**

- **Auth Accelerate** reduces submission times by 70%, boosts auto-approval rates to 85%, and cuts average payer approval wait from 4+ days to under 1 day.
- End-to-end authorization automation from submission through approval.

**Infinx:**

- Authorization determination agent automatically determines if prior auth is required with >98% accuracy by cross-referencing payer guidelines and CPT codes.
- Acquired Glidian (prior auth automation leader), processing 700,000+ patient access transactions monthly.
- Revenue Cycle Agent Platform integrates generative AI, automation, and human expertise.

**What this means for Clinivise:**

- These are payer-side and enterprise solutions. Clinivise operates on the provider side for small practices.
- The _concepts_ are transferable: predictive utilization, structured extraction, payer-specific logic.
- Clinivise won't build a Cohere competitor, but can implement the provider-facing aspects:
  - AI letter parsing (extraction, not decisioning)
  - Predictive utilization pacing (deterministic, not ML)
  - Payer-specific auth requirements (reference data, not real-time API)
  - Proactive re-auth reminders (calendar-based, not predictive)

**Implement:** Letter parsing in Phase 1. Predictive pacing in Phase 1. Payer-specific requirements and real-time eligibility in Phase 2 (Stedi integration).

**Source:** [Cohere Health](https://www.coherehealth.com/), [Cohere Early Trend Signal](https://www.coherehealth.com/news/cohere-health-launches-early-trend-signal-intelligence), [Waystar Auth Accelerate](https://www.waystar.com/news/waystar-expands-authorization-automation-to-address-healthcare-providers-top-2025-investment-priority/), [Infinx Prior Auth](https://www.infinx.com/prior-authorization-solution-ai-and-automation/)

---

### 3C. Predictive Utilization — Forecasting When Units Run Out

**Research findings:**

ABA practices should track utilization weekly, compare authorized vs. used units, and forecast the exhaustion date based on current scheduling pace. If a payer approves 600 units for 6 months and the practice schedules 40 units/week, units exhaust in 15 weeks — potentially before the authorization period ends.

Machine learning models in enterprise settings use prior authorization data to predict utilization trends 3+ months ahead. But for small ABA practices, a deterministic approach is more appropriate and trustworthy.

**Clinivise implementation (deterministic, no ML required):**

```
burn_rate = used_units / days_elapsed
remaining_units = approved_units - used_units
days_until_exhaustion = remaining_units / burn_rate
projected_exhaustion_date = today + days_until_exhaustion
auth_end_date = authorization.end_date

if projected_exhaustion_date < auth_end_date:
    alert("Units will run out {diff} days before authorization expires")
elif projected_exhaustion_date > auth_end_date:
    alert("Under-utilizing: {remaining} units will be unused at expiry")
```

**Display as:**

- **Burndown text**: "At current pace, units exhaust on May 15 — 23 days before auth expires on June 7"
- **Burndown visual**: Simple area chart with projected line vs. authorization end date
- **Pacing recommendation**: "To use all units before expiry, schedule {N} units/week (currently averaging {M} units/week)"

**Edge cases to handle:**

- No sessions logged yet (burn rate = 0): show "No sessions recorded — projection unavailable"
- Authorization just started (<7 days): show "Collecting data — projection available after first week"
- Erratic scheduling (high variance): show range ("exhausts between May 10–May 25")

**Implement:** Phase 1 (Sprint 2D for basic burndown text, Sprint 3B for dashboard widget with visual). M effort.

**Source:** [S3 ABA Authorization Management](https://scubed.io/blog/strengthening-aba-practices-with-effective-authorization-management-strategies), [CentralReach Proactive Auth](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/), [ABA Building Blocks Scheduling](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/)

---

### 3D. AI Features — Build Now vs. Defer

| Feature                                              | Phase               | Effort | Rationale                                                              |
| ---------------------------------------------------- | ------------------- | ------ | ---------------------------------------------------------------------- |
| Authorization letter parsing (PDF → structured data) | Phase 1 (Sprint 4B) | L      | Capstone AI feature. No competitor has it. Validates AI-native thesis. |
| Deterministic utilization projection                 | Phase 1 (Sprint 2D) | S      | Pure math. High value. Zero AI cost.                                   |
| Pacing recommendations (text)                        | Phase 1 (Sprint 3B) | S      | Simple calculation. Display in dashboard widget.                       |
| Burndown area chart                                  | Phase 1.5           | M      | Requires charting component. Nice-to-have.                             |
| AI-suggested re-auth timing                          | Phase 2             | M      | Needs historical pattern data from multiple auth cycles.               |
| Payer-specific auth requirement lookup               | Phase 2             | M      | Needs payer requirement database (Stedi or manual).                    |
| Auto-generate re-auth request letter                 | Phase 2             | M      | LLM generates letter from template + client data.                      |
| Predictive denial risk scoring                       | Phase 2+            | L      | Needs claims outcome data. Not available until billing is live.        |
| Real-time eligibility-aware auth tracking            | Phase 2             | M      | Stedi 270/271 integration.                                             |

---

## 4. Mobile & Tablet UX

### 4A. RBTs in the Field — The Primary Tablet Use Case

**Context:** RBTs (Registered Behavior Technicians) log sessions on tablets in homes, schools, and clinics. They need to:

1. Select the correct client
2. See which authorization applies (and remaining units)
3. Log the session (start/end time, CPT code, notes)
4. Confirm units were deducted

**Research findings:**

87% of doctors and 85% of clinical educators use smartphones/tablets during patient care. Navigation must be thumb-friendly and responsive. Apps should support offline use for unreliable connectivity in field settings.

RethinkBH rebuilt their mobile app with real-time data syncing, optimized for tablets. TallyFlex designed for "one-finger" data collection — tap to count, timers for duration. CentralReach's CR Mobile works on phones and tablets.

**Application to Clinivise authorization display on tablet:**

1. **Authorization picker during session logging**: Show authorization cards (not a dropdown) when an RBT selects a client. Each card shows:
   - Payer name + auth number
   - Date range with visual indicator of remaining time
   - Utilization bar per CPT code relevant to RBT's credential
   - "12 of 40 units remaining" in large text
   - Green/amber/red border based on utilization status

2. **Touch targets**: All interactive elements minimum 44px (min-h-11 min-w-11). Authorization cards should be full-width on tablet, tappable anywhere on the card to select.

3. **Simplified view**: RBTs don't need billing details, auth numbers, or payer IDs. Show only: client name, remaining units for relevant CPT codes, and a color-coded status indicator.

4. **Offline consideration (Phase 2)**: Store last-known authorization state locally. Display "Last synced: 2 min ago" indicator. Allow session logging offline with sync on reconnect.

**Implement:** Phase 1 (Sprint 3A session form) — card-based auth picker with utilization. Offline support deferred to Phase 2.

---

### 4B. Responsive Table Strategy for Authorization Data

**Research findings (Smashing Magazine, UX Matters):**

For responsive data tables on tablet:

- **Priority-based column hiding**: Assign numerical priority to columns. Lower values = higher priority = hidden last. Rightmost columns removed first by default.
- **Card transformation**: On narrow viewports, table rows transform into cards. Each card shows the most critical fields with expandable detail.
- **Fixed primary column**: Keep the identifying column (client name or auth number) fixed during horizontal scroll.
- **Progressive disclosure**: Show critical data in the card view, expand for full detail on tap.

**Authorization table column priorities:**

| Column          | Priority           | Mobile Behavior                          |
| --------------- | ------------------ | ---------------------------------------- |
| Client name     | 1 (always visible) | Bold, primary identifier                 |
| Status badge    | 1 (always visible) | Colored pill                             |
| Utilization bar | 2 (tablet+)        | Compact bar with percentage              |
| Expiry date     | 2 (tablet+)        | Countdown badge if <30 days              |
| Payer           | 3 (desktop)        | Hidden on mobile, shown in expanded card |
| Auth number     | 3 (desktop)        | Hidden on mobile, shown in expanded card |
| CPT codes       | 4 (desktop only)   | Hidden on mobile, shown in expanded card |
| Date range      | 4 (desktop only)   | Hidden on mobile, shown in expanded card |

**Implement:** Phase 1 (Sprint 2D) — use the existing DataTable component with column visibility config per breakpoint.

**Source:** [Smashing Magazine Responsive Tables](https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/), [UX Matters Mobile Tables](https://www.uxmatters.com/mt/archives/2020/07/designing-mobile-tables.php)

---

### 4C. Compact Status Indicators

**Research findings (Carbon Design System, Workday Canvas):**

Status indicators relay severity through shape, color, and text labels. Badges and pills present categorical information compactly. Best practice: never use color alone — always pair with text labels or icons for accessibility.

**Authorization status indicators for Clinivise:**

| Status             | Badge Color       | Icon           | Text              |
| ------------------ | ----------------- | -------------- | ----------------- |
| Pending            | Blue/info         | Clock          | "Pending"         |
| Active             | Emerald/success   | Check circle   | "Active"          |
| Expiring (30 days) | Amber/warning     | Alert triangle | "Expires in {N}d" |
| Expiring (7 days)  | Red/error         | Alert triangle | "Expires in {N}d" |
| Expired            | Red/error (muted) | X circle       | "Expired"         |
| Denied             | Red/error         | X circle       | "Denied"          |
| On Hold            | Gray/muted        | Pause circle   | "On Hold"         |

**Utilization indicators (compact, for table cells and card corners):**

| Utilization | Color         | Display                            |
| ----------- | ------------- | ---------------------------------- |
| 0-79%       | Emerald       | "32%" with emerald dot             |
| 80-94%      | Amber         | "87%" with amber dot               |
| 95-100%     | Red           | "97%" with red dot                 |
| >100%       | Red (pulsing) | "112%" with red dot + "OVER" badge |

**Implement:** Phase 1 (Sprint 2D) — status badges are a shared component, utilization indicators built into auth-utilization component.

**Source:** [Carbon Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/), [Badges vs Pills vs Chips](https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/)

---

## 5. Authorization as a Workflow Pipeline

### 5A. The Authorization Lifecycle

**Research findings:**

Prior authorization tracking is a lifecycle: initial verification → submission → pending → approved/denied → active tracking → threshold alerts → re-authorization → expiry. Proactive systems identify expiring authorizations 30-45 days in advance and automatically trigger renewal processes.

AI agents manage renewal requests by tracking care timelines, monitoring payer-specific renewal windows (often 7-10 days before expiry), and submitting re-authorizations. Every renewal event is logged with timestamps, user IDs, and payer confirmations for audit trails.

**The ABA authorization lifecycle:**

```
Intake → Request Auth → Payer Review → Approved/Denied
                                           │
                    ┌──────────────────────┘
                    ▼
              Active Tracking
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
  Units Consumed  Pacing Check  Expiry Approach
        │           │           │
        ▼           ▼           ▼
  80% Alert     Under/Over    30/14/7 Day
  95% Alert     Utilization    Warnings
  100% Block     Alert              │
        │           │           ▼
        └───────────┴──→ Re-Authorization
                              │
                              ▼
                        New Auth Created
                        (linked to previous)
```

**Implement:** The data model already supports this (Sprint 1A schema). The UX surfaces each stage through status badges, utilization components, and alert widgets across Sprint 2D and 3B.

---

### 5B. Kanban-Style Authorization Board — Evaluate for Phase 1.5

**Research findings:**

Kanban boards visualize records as cards progressing through stages. Drag-and-drop between columns updates status. Work-in-progress limits constrain column capacity. Suited for workflows with clear stages and manageable item counts.

**Pros for ABA authorization tracking:**

- Visual overview of all authorizations by status (Pending → Active → Expiring → Expired)
- Drag to move between statuses (e.g., mark as denied)
- Quick identification of bottlenecks (too many in "Pending" column)

**Cons for ABA authorization tracking:**

- Authorization status changes are mostly automated (Active → Expiring is calendar-driven, not drag-drop)
- The primary user need is utilization tracking within Active status, not status transitions
- Small practices may only have 10-30 active authorizations — Kanban adds visual overhead without proportional benefit
- Drag-drop is unreliable on tablets in the field

**Decision:** Defer Kanban board to Phase 1.5 or later. Phase 1 focuses on the table + detail page pattern, which better serves the primary use case (utilization monitoring). A Kanban view could be added as an optional view toggle on the authorization list page if users request it.

**Implement:** Deferred. Table + filter presets achieve 80% of the Kanban benefit with less engineering effort.

---

### 5C. Re-Authorization Workflow

**Research findings:**

Best-in-class systems identify expiring authorizations well in advance (30-45 days), automatically triggering renewal processes and preventing coverage gaps. SPRY identifies expiring authorizations and initiates renewals before they affect patient care.

**Clinivise re-authorization workflow:**

1. **30-day warning** (dashboard widget + auth detail banner): "Authorization expires in 30 days. 15 units remaining."
2. **Re-authorize action**: Button on auth detail page creates a new authorization pre-filled from the current one (same client, payer, CPT codes, adjusted dates). Linked to the previous auth via `previousAuthorizationId` FK.
3. **14-day warning** (escalated): "Authorization expires in 14 days. Re-authorization not yet created." CTA: "Start Re-Authorization."
4. **7-day critical**: Red banner. If sessions are still scheduled past expiry, show count of at-risk sessions.
5. **Expired**: Status changes to "Expired." If a new auth exists, show transition: "Replaced by AUTH-2024-002."

**Data model (already in schema):**

- `authorizations` table can link to previous via a self-referencing FK or metadata
- `authorization_services` on the new auth start fresh (used_units = 0)
- Timeline/audit log shows the chain: AUTH-001 → AUTH-002 → AUTH-003

**Implement:** Phase 1 (Sprint 2D) — re-authorize action and linked auth creation. Escalated warnings in Sprint 3B dashboard.

---

## 6. Recommended Architecture for Clinivise

### 6A. Component Map

Based on all research, here is the recommended component architecture for authorization tracking:

**Authorization List Page** (`/authorizations`)

- `AuthorizationTable` — Data table with column priority hiding, search, filters (status, client, payer, expiry range)
- `AuthorizationFilters` — Filter presets: "Active," "Expiring Soon," "Over-Utilized," "All"
- `AuthorizationStatusBadge` — Reusable status pill component
- `UtilizationIndicator` — Compact percentage + color dot for table cells

**Authorization Detail Page** (`/authorizations/[id]`)

- `AuthorizationHeader` — Card-style summary: client, payer, auth #, status badge, date range, countdown, overall utilization bar, actions
- `AuthorizationTabs` — 5 tabs: Overview, Services, Sessions, Documents, Timeline
- `AuthorizationOverview` — All service line utilization bars, projected exhaustion, pacing recommendation, alerts
- `AuthorizationServices` — Service line table (CPT, approved, used, remaining, rate) with add/edit
- `AuthorizationSessions` — Filtered session table for this auth
- `AuthorizationDocuments` — Document list with upload + AI parse trigger
- `AuthorizationTimeline` — Audit log filtered to this auth
- `UtilizationBar` — Single service line progress bar with color thresholds
- `UtilizationSummaryBar` — Multi-segment bar for overall authorization
- `BurndownProjection` — Text display of projected exhaustion date and pacing recommendation
- `ExpiryAlert` — Inline banner with countdown and CTA

**Authorization Form** (`/authorizations/new`, `/authorizations/[id]/edit`)

- `AuthorizationForm` — Create/edit form with service line management
- `ServiceLineForm` — Sub-form for adding CPT codes + approved units

**Dashboard Widgets** (on `/overview`)

- `ExpiringAuthsWidget` — Card list of authorizations expiring within 30 days
- `UtilizationAlertsWidget` — Severity-sorted alert list (over-utilized, under-utilized, expiring)

**Session Form Integration**

- `AuthorizationPicker` — Card-based picker shown when logging a session. Displays available auths for selected client with utilization bars.

**Shared**

- `AuthorizationStatusBadge` — Reused across list, detail, dashboard, session form
- `UtilizationIndicator` — Compact version for tables and inline display

### 6B. Implementation Priority

| Priority | Component                                 | Sprint    | Rationale                                            |
| -------- | ----------------------------------------- | --------- | ---------------------------------------------------- |
| 1        | Authorization list page + table           | 2D        | Entry point for all auth management                  |
| 2        | Authorization form (create/edit)          | 2D        | Core CRUD                                            |
| 3        | Authorization detail page + tabs          | 2D        | Primary information surface                          |
| 4        | UtilizationBar + UtilizationIndicator     | 2D        | Core value proposition — utilization visibility      |
| 5        | AuthorizationStatusBadge                  | 2D        | Reused everywhere                                    |
| 6        | ExpiryAlert (inline)                      | 2D        | Prevents missed re-auths                             |
| 7        | ServiceLineForm                           | 2D        | Needed for auth creation                             |
| 8        | BurndownProjection (text)                 | 2D        | Deterministic, high value, low effort                |
| 9        | AuthorizationPicker (for session form)    | 3A        | Touch-friendly auth selection during session logging |
| 10       | ExpiringAuthsWidget (dashboard)           | 3B        | Aggregated expiry visibility                         |
| 11       | UtilizationAlertsWidget (dashboard)       | 3B        | Aggregated utilization alerts                        |
| 12       | AuthorizationTimeline                     | 3B        | Audit trail                                          |
| 13       | AuthorizationDocuments + AI parse trigger | 4B        | AI letter parsing integration point                  |
| 14       | UtilizationSummaryBar (multi-segment)     | 3B        | Nice-to-have visual enhancement                      |
| 15       | Burndown area chart                       | Phase 1.5 | Requires charting component setup                    |
| 16       | Kanban view toggle                        | Deferred  | Low priority, table + filters sufficient             |

### 6C. Key Design Decisions Summary

| Decision               | Choice                                                                                   | Rationale                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| List layout            | Data table (not cards, not kanban)                                                       | Sortable, filterable, scales to 100+ auths. Cards for detail page only.                |
| Detail layout          | Header card + 5 tabs                                                                     | Matches client detail pattern (consistency). Tabs proven for 4-6 section detail pages. |
| Utilization display    | Segmented bar + percentage text + color coding                                           | Visual + numeric + semantic color for triple-redundancy. Accessible.                   |
| Alert placement        | Inline banners (detail) + dashboard widgets (aggregate) + blocking dialog (session form) | Context-appropriate. Prevents alert fatigue.                                           |
| Mobile/tablet strategy | Column priority hiding + card transformation on narrow viewports                         | Progressive disclosure. Works with existing DataTable component.                       |
| Authorization picker   | Card-based in sheet (not dropdown)                                                       | Touch-friendly for RBTs. Shows utilization inline.                                     |
| Re-authorization       | Pre-filled form linked to previous auth                                                  | Reduces data entry. Maintains authorization chain for auditing.                        |
| Status indicators      | Color + icon + text (triple encoding)                                                    | WCAG accessible. Clear at any size.                                                    |

---

## Sources

### Quota/Limit Tracking & Dashboard Design

- [Stripe Billing Credits](https://stripe.com/blog/introducing-credits-for-usage-based-billing)
- [Stripe Credits Documentation](https://docs.stripe.com/billing/subscriptions/usage-based/billing-credits)
- [Mercury Banking](https://mercury.com)
- [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Linear Design Refresh](https://linear.app/now/behind-the-latest-design-refresh)
- [Dashboard Design Principles (UXPin)](https://www.uxpin.com/studio/blog/dashboard-design-principles/)
- [UX Strategies for Real-Time Dashboards (Smashing Magazine)](https://www.smashingmagazine.com/2025/09/ux-strategies-real-time-dashboards/)
- [Table vs List vs Cards (UX Patterns)](https://uxpatterns.dev/pattern-guide/table-vs-list-vs-cards)
- [Dashboard Cards Consistency (Baymard)](https://baymard.com/blog/cards-dashboard-layout)
- [Data Tables: Four Major User Tasks (NN/g)](https://www.nngroup.com/articles/data-tables/)

### Progress Bar & Visualization

- [VA.gov Segmented Progress Bar](https://design.va.gov/components/form/progress-bar-segmented)
- [Stacks Progress Bars (Stack Overflow)](https://stackoverflow.design/product/components/progress-bars/)
- [Multi-Segment Progress Bar (Siteimprove)](https://fancy.siteimprove.com/lab/components/data%20visualization/multi%20segment%20progress%20bar/)
- [Progress Bar Types and Design Tips (Domo)](https://www.domo.com/learn/charts/progress-bars)

### Alerting & Notification Patterns

- [Carbon Design System Notification Pattern](https://carbondesignsystem.com/patterns/notification-pattern/)
- [Design Guidelines for Better Notifications UX (Smashing Magazine)](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/)
- [PatternFly Alert Design Guidelines](https://www.patternfly.org/components/alert/design-guidelines/)
- [Alert Design Best Practices (Andrew Coyle)](https://coyleandrew.medium.com/design-better-alerts-2e2ee238afde)
- [Toast Notifications UX (LogRocket)](https://blog.logrocket.com/ux-design/toast-notifications/)
- [Indicators, Validations, and Notifications (NN/g)](https://www.nngroup.com/articles/indicators-validations-notifications/)

### Alert Fatigue in Healthcare

- [Alert Fatigue Primer (AHRQ PSNet)](https://psnet.ahrq.gov/primer/alert-fatigue)
- [Fighting Alert Fatigue (Cleveland Clinic)](https://consultqd.clevelandclinic.org/fighting-alert-fatigue-to-improve-patient-safety-and-standardization-of-care)
- [Passive Clinical Decision Support (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10830237/)
- [Reducing Alert Fatigue (Premier)](https://premierinc.com/newsroom/blog/reducing-alert-fatigue-in-healthcare)
- [Fix Alert Fatigue: Focus on 3 Things (Synapse Medicine)](https://www.synapse-medicine.com/blog/blogpost/fix-alert-fatigue-healthcare)

### AI Prior Authorization

- [Cohere Health Platform](https://www.coherehealth.com/)
- [Cohere Early Trend Signal Intelligence](https://www.coherehealth.com/news/cohere-health-launches-early-trend-signal-intelligence)
- [Cohere Utilization Management Suite](https://www.coherehealth.com/utilization-management-suite)
- [Waystar Auth Accelerate](https://www.waystar.com/news/waystar-expands-authorization-automation-to-address-healthcare-providers-top-2025-investment-priority/)
- [Infinx Prior Authorization](https://www.infinx.com/prior-authorization-solution-ai-and-automation/)
- [Infinx AI + Automation for PA](https://www.infinx.com/ai-automation-agents-prior-authorizations/)
- [SPRY Prior Authorization](https://www.sprypt.com/prior-authorization)
- [Prior Authorization Software Comparison 2025](https://www.sprypt.com/blog/prior-authorization-software-electronic-solutions)

### AI Document Extraction

- [LLMs vs OCR for Document Extraction (Vellum)](https://www.vellum.ai/blog/document-data-extraction-llms-vs-ocrs)
- [LandingAI Agentic Document Extraction](https://landing.ai/ade)
- [LandingAI Healthcare Solutions](https://landing.ai/solutions/healthcare)
- [LlamaIndex Document AI Guide](https://www.llamaindex.ai/blog/document-ai-the-next-evolution-of-intelligent-document-processing)
- [HealthEdge AI OCR for Prior Authorization](https://healthedge.com/resources/blog/transforming-healthcare-document-processing-how-healthedge-s-ai-platform-revolutionized-prior-authorization-with-intelligent-ocr)

### ABA Authorization Management

- [Effective Authorization Management (S-Cubed)](https://scubed.io/blog/strengthening-aba-practices-with-effective-authorization-management-strategies)
- [CentralReach Proactive Authorization](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [ABA Authorization Management (ABA Matrix)](https://www.abamatrix.com/aba-authorization-management/)
- [Scheduling Tips for Utilization (ABA Building Blocks)](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/)
- [Key ABA Metrics (Raven Health)](https://ravenhealth.com/blog/aba-practice-metrics-to-track/)

### Mobile & Tablet Healthcare UX

- [Mobile Devices in Healthcare (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4029126/)
- [Healthcare Mobile App UX Tips (MedMatch)](https://medmatchnetwork.com/10-ux-tips-for-healthcare-mobile-apps/)
- [RethinkBH Practice Management](https://www.rethinkbehavioralhealth.com/our-solutions/practice-management/)
- [Best RBT Data Collection Apps 2026](https://rbtpracticeexam.net/best-rbt-data-collection-apps/)

### Responsive Tables

- [Responsive Tables Part 1 (Smashing Magazine)](https://www.smashingmagazine.com/2022/12/accessible-front-end-patterns-responsive-tables-part1/)
- [Designing Mobile Tables (UX Matters)](https://www.uxmatters.com/mt/archives/2020/07/designing-mobile-tables.php)
- [DataTables Column Priority](https://datatables.net/extensions/responsive/priority)

### Status Indicators & Badges

- [Carbon Status Indicator Pattern](https://carbondesignsystem.com/patterns/status-indicator-pattern/)
- [Badges vs Pills vs Chips vs Tags (Smart Interface Design)](https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/)
- [Workday Canvas Pill Component](https://canvas.workday.com/components/indicators/pill)

### Workflow & Authorization Lifecycle

- [Prior Authorization Tracking Guide (EZ MED)](https://ezmedpro.com/prior-authorization-tracking-best-practices-guide/)
- [Prior Authorization Process Flow Chart (careviso)](https://www.careviso.com/news-events/prior-authorization-process-flow-chart)
- [AI Flags Expiring Authorizations (Droidal)](https://medium.com/@droidalai/how-ai-automatically-flags-expiring-authorizations-to-prevent-missed-renewals-dfc6688c2a64)
- [Prior Authorization Automation Guide 2026 (Innovaccer)](https://innovaccer.com/blogs/the-definitive-guide-to-streamlining-prior-authorization-workflows-for-providers)

### Detail Page & Timeline Patterns

- [Timeline Pattern (UX Patterns)](https://uxpatterns.dev/patterns/data-display/timeline)
- [Tabs UX Best Practices (Eleken)](https://www.eleken.co/blog-posts/tabs-ux)
- [Activity Feed Examples (Nicelydone)](https://nicelydone.club/pages/activity-feeds)
- [Timeline Design Examples (Nicelydone)](https://nicelydone.club/pages/timeline)
