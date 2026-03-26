# Authorization Navigation & Page Architecture: Competitive Research

> Research date: 2026-03-25
> Focus: How ABA PM tools and adjacent healthcare platforms organize authorization management UI/UX — navigation patterns, page architecture, creation flows, and cross-client views. Fills gaps in existing auth research with specific navigation/workflow details.

---

## Table of Contents

1. [Competitor Deep Dives](#1-competitor-deep-dives)
2. [Comparison Table](#2-comparison-table)
3. [User Complaints & Pain Points](#3-user-complaints--pain-points)
4. [Key Insights for Clinivise](#4-key-insights-for-clinivise)

---

## 1. Competitor Deep Dives

### 1.1 CentralReach

**Navigation path:** Billing module (top nav) > Authorizations tab

**Architecture — dual access model:**
CentralReach is the only competitor with a true dual-access model for authorizations:

1. **Billing > Authorizations (standalone cross-client grid):** A full-page data grid showing ALL authorizations across ALL clients. Defaults to monthly actual (not prorated) with hour amounts. Grid columns: client name, service codes, start date, end date, insurance company, provider (if locked to one), frequency, authorized amount, worked hours, pending hours, remaining hours, utilization rate. Toggle filters at the top switch between Month/Hours/Units/Visits views.

2. **Client Dashboard > Authorization Widget:** An in-context widget on the individual client's dashboard. Users can view and edit a specific client's authorization directly from here. Smaller footprint — designed for "check this one client" use, not fleet management.

3. **ABI (Advanced Business Intelligence) > Authorization Analysis Report:** A third access point for analytics. Contains:
   - % of Auth Hours Used indicator widget
   - % of Auth Hours Used over time (monthly trend)
   - Provider Scatter Chart (X: Auth Hours, Y: % Used, Bubble: Remaining)
   - Client Scatter Chart (same dimensions)
   - Authorizations by Manager Tree Map (sized by hours, colored by % used)
   - Upcoming Authorization Expirations calendar (blue shading = expiring auths, darker = more expiring)

**Creating new authorizations:** From the Billing module (NOT from the client page). Steps: Billing > Authorizations > Create. Fields: auth name (recommended: "[Client Name] auth [dates]"), Manager (BCBA responsible), Payor, Valid Dates, Authorization #, Diagnosis Codes, then add Service Codes (single, grouped, or from template). Templates can be saved for common auth packages.

**Known UX issues:**
- Authorizations live in Billing, not where clinicians work — requires navigating away from clinical context
- The ABI report is powerful but complex; requires training to interpret scatter charts and tree maps
- Deleted authorizations still appear on reports (known bug)
- 87% of users report advanced features have problems and slow processes down
- Near 100% of users report frequent downtime during updates

**Key UX pattern:** Data grid (table) with column toggles and filters. Analytics in separate report module.

---

### 1.2 AlohaABA

**Navigation path:** Client Profile > Authorization section (per-client); also accessible from Schedule view

**Architecture — client-centric with schedule overlay:**

1. **Client Profile > Authorizations:** Authorization utilization is visible directly in the client profile. Clicking expands to show scheduled, completed, billed, and cancelled appointments for each service in the authorization. Supports monthly breakdown view. Controlled by permissions: Settings > Security > User Roles > Client > Client Authorizations (view only / full access).

2. **Schedule View > Authorization Utilization Reports:** Utilization data is accessible directly within the scheduling interface — users don't need to navigate to a separate billing module to check remaining hours before booking.

3. **Authorization Management (top-level feature):** Marketed as a standalone navigation item alongside Billing, Scheduling, and Payroll. Provides alerts for expiring auths and prevents scheduling beyond limits.

**Creating new authorizations:** From the client profile. Set up authorizations per client, assign access rights, configure authorization defaults to streamline billing.

**Cross-client view:** No dedicated cross-client authorization list page found in documentation. Relies on reporting module for aggregate views. Billing staff use reports filtered by expiration date to review expiring auths.

**Expiring auth alerts:** Timely alerts pushed to relevant users. Also alerts when attempting to schedule beyond authorization limits (blocking at schedule-time, not just notification).

**Known UX issues:**
- Scheduling calendar interface needs improvement
- Some reporting features lacking
- No patient-facing app
- Double data entry and synchronization issues reported

**Key UX pattern:** Authorization data embedded in client profile and schedule view. No standalone cross-client auth list — relies on reports.

---

### 1.3 Theralytics

**Navigation path:** Client Management (main nav) > Select Client > Manage Client (expandable menu) > Authorizations

**Architecture — strictly client-centric:**

1. **Client Management > [Client] > Manage Client > Authorizations:** This is the only access point. Authorization data lives exclusively within individual client profiles. The authorization screen shows per-service breakdown: modifiers, approved units (in units and hours), units completed, units scheduled (past/present/future), units remaining.

2. **Dashboard visibility:** Option to show/hide authorization on the Theralytics Dashboard (per-auth toggle), but this is a widget on the main dashboard, not a full cross-client auth page.

**Creating new authorizations:** From the client profile only. Client Management > [Client] > Authorizations > Add Authorization. Fields: service codes (one per line), modifiers (optional), approved units (can specify per clinician type). Green plus icon to add additional service codes.

**Cross-client view:** No cross-client authorization list or dedicated authorization reporting page found. Theralytics relies on its general reporting/analytics module (customizable by location, payer, appointment type, staff) but does not appear to have a purpose-built "all expiring authorizations" view.

**Known UX issues:**
- Adding authorization information described as "easy and seamless" by users
- High praise for ease of use (4.9/5 Capterra for ease of use)
- No specific authorization complaints surfaced

**Key UX pattern:** Expandable detail panel within client record. No standalone auth page.

---

### 1.4 Passage Health

**Navigation path:** Client record (per-client); also surfaced in scheduling and dashboard

**Architecture — integrated/ambient model:**

1. **Client Record:** Shows how many hours a client has used and how many are left in their authorization, broken down by service code. Tracks one or multiple authorization utilizations across billing codes and authorization expiry.

2. **Scheduling Integration:** Automatically checks insurance authorizations when scheduling. Blocks booking beyond approved hours. Shows remaining hours and supervision needs at scheduling time.

3. **Dashboard:** Dashboards showing therapist utilization, authorization usage, pending renewals, and revenue leaks. Custom reporting by provider, location, or key metric.

**Per-CPT progress bars:** Passage Health's marketing references tracking utilization "across billing codes" with visual indicators, but specific progress bar screenshots were not publicly available. The visualization appears to be numeric (hours used / hours remaining per code) integrated into the client record and scheduling views, with "intelligent pacing metrics" that flag approaching limits.

**Creating new authorizations:** From the client record. Authorization data flows into scheduling and billing automatically.

**Cross-client view:** Dashboard-level aggregate views of authorization usage and pending renewals exist. Not a dedicated standalone list, but operational dashboards surface auth health across the practice.

**Known UX issues:**
- Positions itself as "flag before booking, not after denial" — proactive approach
- Newer platform with less market feedback available
- Strong content marketing but limited public documentation of actual UI

**Key UX pattern:** Authorization as ambient infrastructure — surfaced where you work (scheduling, client record, dashboard) rather than a standalone destination.

---

### 1.5 Raven Health

**Navigation path:** Client records > authorization management (basic)

**Architecture — minimal:**

Raven Health offers basic authorization management as part of its practice management module, but **lacks automated authorization checks or advanced scheduling logic**. This is a significant limitation compared to all other ABA competitors.

**Features:**
- Store client insurance information
- Basic auth status tracking
- AI-driven prior authorization tracking (marketed, details unclear)
- Integrated with scheduling, billing, records, compliance

**Cross-client view:** No dedicated cross-client authorization dashboard or list found.

**Creating new authorizations:** From the client record.

**Pricing model:** Not truly free. Three plans: Data Collection Essentials ($29/user/month), Managed Billing Bundle (5% of claims paid — "free" software), Self-Billing Package (2% of claims submitted). $300 implementation fee.

**Key UX pattern:** Minimal — auth is a data field on the client record, not a workflow. Comparable to SimplePractice's limited approach.

---

### 1.6 SimplePractice

**Navigation path:** Client's Overview page > + Authorization number

**Architecture — field-level only:**

Authorization tracking in SimplePractice is essentially a form field, not a workflow or page:

1. **Client Overview > Insurance section:** Click "+ Authorization number" to add. Fields: prior authorization number, number of uses, valid date range.
2. The authorization number auto-populates into Box 23 of insurance claims.
3. **Critical limitation:** No auto-decrementing of units. The system does NOT track how many authorized sessions have been used. Users must manually track usage.
4. Multiple authorization numbers can be stored (active + historical), but only the active one populates on claims.

**Cross-client view:** None. No authorization reporting, no expiration alerts, no utilization tracking.

**Creating new authorizations:** Client Overview page only.

**Known UX issues:**
- Must manually edit Box 23 on secondary claim forms
- Must manually remove authorization numbers for payers that don't require them
- No auto-decrementing = practices lose revenue from missed/expired auths
- Workaround: enter "1" as auth number just to use the counting fields

**Key UX pattern:** A single form field on the client record. Not a feature — a data entry point.

---

### 1.7 Jane App

**Navigation path:** Patient Profile > Billing > Insurance Policies > View/New Insurance Policy

**Architecture — insurance-policy-centric:**

Authorization is a field within the insurance policy record, not a standalone concept:

1. **Patient Profile > Billing > Insurance Policies:** Prior Authorization Number is set within a patient's insurance policy configuration.
2. Jane does NOT track historical, expired, or expended prior authorization numbers.
3. When obtaining a new authorization, users must manually replace the existing number.
4. For claims referencing expired authorizations, manual modification is required before submission.

**Cross-client view:** The Reports section has an Insurance Policies report with filters to focus on policies needing attention, but this is insurance-policy-level reporting, not authorization-specific.

**Creating new authorizations:** Within the patient's insurance policy only.

**Known UX issues:**
- No historical authorization tracking
- Manual replacement workflow = error-prone
- No auto-decrementing, no utilization tracking, no expiration alerts

**Key UX pattern:** Authorization as a sub-field of insurance policy. Even more minimal than SimplePractice.

---

### 1.8 Healthie

**Navigation path:** Client Profile > Overview > Insurance Eligibility > Edit Eligibility; Cross-client via Reports

**Architecture — client-record + reporting model:**

Best non-ABA implementation found:

1. **Client Profile > Overview > Insurance Eligibility:** Per-client tracker with: authorization number, total authorized visits, visits used, visits remaining, effective dates, benefits details (copay/coinsurance/deductible), covered CPT and ICD-10 codes, telehealth coverage status, referral requirements.

2. **Auto-decrementing:** Connected to Healthie's Calendar. When a client is booked for any session, visits deducted from "Visits Left" and added to "Visits Used." Cancellations, no-shows, and rescheduled appointments auto-restore the count. **Important limitation:** Does not prevent scheduling when visits are exhausted — no blocking.

3. **Insurance Authorization Report (cross-client):** Two versions — individual provider view (only their clients) and organization-wide view (all clients). 25+ fields including authorization number, visits authorized, visits used, effective dates. Downloads as CSV. Filters by date range.

**Creating new authorizations:** From client profile only. Must enable feature first: Settings > Insurance > Track Client Insurance Eligibility.

**Known UX issues:**
- Report is CSV download, not an interactive dashboard
- No scheduling blocks when auth is exhausted
- Simplified navigation improvements shipped October 2025

**Key UX pattern:** Client-record tracker with calendar integration + CSV report for cross-client view. Better than SimplePractice/Jane, but lacks the interactive dashboard of CentralReach.

---

## 2. Comparison Table

| Dimension | CentralReach | AlohaABA | Theralytics | Passage Health | Raven Health | SimplePractice | Jane App | Healthie |
|-----------|-------------|----------|-------------|----------------|--------------|----------------|----------|---------|
| **Auth access point** | Billing module (standalone) + Client widget + ABI report | Client profile + Schedule view | Client Management > Client > Manage Client > Auths | Client record + Scheduling + Dashboard | Client record (basic) | Client Overview (form field) | Patient > Insurance Policy (sub-field) | Client > Insurance Eligibility |
| **Cross-client auth list** | Yes — Billing > Authorizations grid (full page) | No — reports only | No | Dashboard aggregates only | No | No | Insurance Policies report (not auth-specific) | Yes — Insurance Authorization Report (CSV) |
| **Create auth from** | Billing module only (not client page) | Client profile | Client profile only | Client record | Client record | Client Overview | Insurance Policy | Client profile |
| **Auto-decrement units** | Yes | Yes | Yes | Yes | Unclear | No | No | Yes (calendar-connected) |
| **Schedule-time blocking** | Yes (with override) | Yes (with alerts) | Yes (prevents overbooking) | Yes (blocks booking) | No | No | No | No |
| **Expiration alerts** | ABI report calendar widget | Push alerts | Dashboard toggle | Dashboard + scheduling flags | Basic | No | No | Report-based |
| **Utilization visualization** | Scatter charts, tree maps, utilization rate % | In-schedule utilization, utilization reports | Per-code breakdown (units/hours) | Pacing metrics, hours used/remaining | None | None | None | Visits used/remaining count |
| **Primary UX pattern** | Data grid + analytics dashboard | Embedded in workflow (client + schedule) | Expandable detail panel | Ambient/integrated | Minimal data field | Form field | Insurance sub-field | Client tracker + CSV report |
| **Complexity** | High (requires training) | Medium | Low-Medium | Medium | Low | Very Low | Very Low | Low-Medium |

---

## 3. User Complaints & Pain Points

### 3.1 Industry-Wide Authorization Pain Points

From Capterra reviews, industry reports, and billing service providers (2024-2026):

**Navigation/workflow complaints:**
- **"Authorization is in the wrong place"** — CentralReach's decision to put auth management in the Billing module forces clinicians to context-switch away from the client record. BCBAs who need to check auth status while planning sessions must navigate to Billing, find the client, check utilization, then navigate back.
- **"I can't see all my expiring auths in one place"** — Platforms without cross-client auth views (Theralytics, SimplePractice, Jane) force billing staff to click into each client individually to check authorization status. With 50+ clients, this is a daily time sink.
- **"No one told me the auth was expiring"** — Platforms without proactive alerts lead to missed reauthorizations. The downstream cost: denied claims, service gaps, and revenue leakage estimated at $21-43K per BCBA per year (from existing Clinivise research).

**Data entry complaints:**
- **"I have to enter the same auth info twice"** — Practices that use both a PM tool and a separate billing system report double data entry for authorizations.
- **"Reauthorizations are copy-paste hell"** — Without a clone/duplicate feature (only TherapyPM and CentralReach offer this), users manually re-enter all auth data every 3-6 months per client.
- **"The system didn't catch that the auth expired"** — SimplePractice and Jane don't auto-decrement, so users discover expired/exhausted auths only when claims are denied.

**Reporting complaints:**
- **"CentralReach reports are powerful but require a PhD"** — Scatter charts and tree maps are analytically rich but too complex for daily operational use.
- **"I just want a list of who's expiring this month"** — The most common billing staff need is a simple filterable list, not an analytics dashboard.
- **"Quarterly re-auth deadlines get missed"** — Medicaid often requires updated authorization documentation every 90 days. Without automated tracking, QTR deadlines get missed, which stops all claims.

### 3.2 Platform-Specific Complaints

| Platform | Auth-Specific Complaints |
|----------|------------------------|
| CentralReach | Auth buried in Billing module; analytics too complex for daily use; deleted auths still appear on reports; advanced features slow and buggy; downtime during updates |
| AlohaABA | Calendar/scheduling interface needs improvement; reporting features lacking; no patient app |
| Theralytics | No cross-client auth view (inferred gap, not a user complaint — users praise ease of use) |
| SimplePractice | No auto-decrementing (most common complaint); must manually track usage; no alerts; secondary insurance auth handling is manual |
| Jane App | No historical auth tracking; manual replacement workflow; no utilization tracking |
| Raven Health | No automated auth checks; no advanced scheduling logic; basic feature set |

---

## 4. Key Insights for Clinivise

### Insight 1: The Two-Access-Point Model is Correct

The market has converged on two distinct auth access patterns serving different user needs:

- **Client-centric (per-client):** For BCBAs checking "how is THIS client's auth doing?" — embedded in the client profile, contextual, quick.
- **Fleet view (cross-client):** For billing staff/admins checking "which auths across ALL clients need attention?" — standalone page, filterable, sortable.

**CentralReach is the only platform that truly offers both**, but they execute poorly (auth creation only from Billing, not client page; analytics too complex). AlohaABA and Passage Health lean client-centric. Theralytics/SimplePractice/Jane are client-only. No one does both well.

**Clinivise opportunity:** Offer both — a rich auth section on the client detail page AND a cross-client Authorization List page. Create authorizations from EITHER location. This is a clear gap.

### Insight 2: Authorization Creation Point Matters

- CentralReach: Create from Billing only (forces billing staff workflow)
- Everyone else: Create from client profile only (forces clinical staff workflow)
- Nobody: Create from both locations

The creation point determines which persona "owns" auth management. In small practices (Clinivise's target), the BCBA often does everything — so client-page creation is essential. But as practices grow, billing staff need a centralized creation point too.

**Clinivise opportunity:** Auth creation from both the client detail page and the standalone auth list page. Same form, same flow, just different entry points.

### Insight 3: "Where You Work" Integration is Table Stakes

AlohaABA's key insight — surfacing auth utilization in the schedule view — is the pattern that gets the most user praise. Passage Health extends this to "ambient" auth awareness everywhere (scheduling, client record, dashboard). The market is moving away from "go to the auth module" toward "auth data follows you."

**Clinivise should surface auth health:**
- Client detail page: auth section with per-CPT utilization bars
- Dashboard: expiring auth alerts widget, utilization overview
- Session logging: show remaining auth units for the selected CPT code
- (Future) Scheduling: block/warn when auth is running low

### Insight 4: The Cross-Client Auth List is Underserved

Only CentralReach has a real cross-client auth grid, and it's buried in the Billing module with complex analytics. Healthie has a CSV report. Everyone else forces client-by-client clicking.

The billing staff daily workflow is: "Show me all auths expiring in the next 30 days, sorted by expiration date, so I can prioritize reauthorization requests." No platform makes this effortless.

**Clinivise opportunity:** A clean, filterable auth list page at the top-level navigation. Columns: Client, Payer, Auth #, CPT Codes, Utilization %, Days Remaining, Status (active/expiring/expired/critical). Pre-built filters: "Expiring in 30 days," "Over 80% utilized," "Under 50% utilized." This is the #1 page billing staff will live on.

### Insight 5: Visualization Complexity Should Match the Audience

CentralReach's scatter charts and tree maps are analytically interesting but operationally useless for daily workflow. The most effective visualization pattern across the industry is simple and glanceable:

- **Progress bar** per CPT code: green (< 80%), amber (80-95%), red (> 95%)
- **Numeric label:** "142 / 192 units (74%)"
- **Time-based pacing indicator:** "On track" / "Behind" / "Ahead"

No scatter charts. No tree maps. Save analytics for a reporting page, not the operational view.

### Insight 6: Clone/Duplicate is Sleeper Feature

Only TherapyPM and CentralReach offer one-click auth cloning for reauthorizations. Since most auths repeat with minor date/unit changes every 3-6 months, this saves significant time. Combined with Clinivise's AI letter parsing, the reauthorization flow could be: upload new auth letter → AI pre-fills changes → user reviews diffs → save. Competitors require full manual re-entry.

---

## Sources

- [CentralReach: Navigate Authorizations in the Billing Module](https://help.centralreach.com/navigate-authorizations-in-the-billing-module/)
- [CentralReach: Create an Authorization](https://help.centralreach.com/create-an-authorization/)
- [CentralReach: Authorization Analysis Report](https://help.centralreach.com/the-authorization-analysis-report/)
- [CentralReach: Finding Expired Authorizations](https://help.centralreach.com/finding-expired-authorizations/)
- [CentralReach: Proactive Authorization Management](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [CentralReach: Authorization Widget (9.8 Release)](https://community.centralreach.com/s/article/9-8-A-New-Widget-for-Clients-Additional-Billing-and-Authorization-Filters-and-New-ABI-Reports)
- [AlohaABA: Authorization Management](https://alohaaba.com/features/authorization-management)
- [AlohaABA: Track Client Service Authorization Usage](https://support.alohaaba.com/portal/en/kb/articles/check-client-authorization-usage)
- [AlohaABA: Streamline Authorizations](https://alohaaba.com/authorization)
- [Theralytics: How to View Authorizations & Track Units](https://theralytics.freshdesk.com/support/solutions/articles/44002603441-how-to-view-authorizations-track-units-in-theralytics)
- [Theralytics: Adding Authorizations](https://theralytics.freshdesk.com/support/solutions/articles/44002219409-adding-authorizations)
- [Passage Health: Practice Management](https://www.passagehealth.com/practice-management)
- [Passage Health: Best ABA Practice Management Software](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [Raven Health: Key Features Practice Management](https://ravenhealth.com/key-features-practice-management/)
- [Raven Health: Pricing](https://ravenhealth.com/pricing/)
- [SimplePractice: Using Authorization Tracking](https://support.simplepractice.com/hc/en-us/articles/7007890860045-Using-Authorization-Tracking)
- [Jane App: Box 23 / Prior Authorization](https://jane.app/guide/box-23)
- [Jane App: Insurance Policies Report](https://jane.app/guide/insurance-policy-report)
- [Healthie: Insurance Eligibility Tracker](https://help.gethealthie.com/article/347-insurance-authorization-tracker)
- [Healthie: Insurance Authorization Report](https://help.gethealthie.com/article/533-deep-dive-insurance-authorization-report)
- [ABA Matrix: Authorization Management](https://www.abamatrix.com/aba-authorization-management/)
- [TherapyPM: ABA Practice Management](https://therapypms.com/aba-practice-management-software/)
- [Operant Billing: Improving Authorization Management](https://operantbilling.com/improving-authorization-management-in-aba-therapy-a-path-to-financial-health-and-client-success/)
