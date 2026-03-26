# Authorization Management: Regulatory & Business Constraints for UI/UX Design

> Research date: 2026-03-25
> Scope: Regulatory requirements, billing compliance, role-based workflows, payer differences, and common errors that constrain authorization page architecture
> Purpose: Structured constraint list to inform page design decisions for authorization CRUD, detail views, dashboards, and alerts

---

## Table of Contents

1. [Data That MUST Be Visible on an Authorization](#1-required-authorization-data-for-billing-compliance)
2. [Role-Based Authorization Access](#2-who-needs-to-seemanage-authorizations)
3. [Common Authorization Billing Errors & UI Prevention](#3-common-authorization-billing-errors--ui-prevention)
4. [Payer-Specific Differences](#4-payer-specific-requirements)
5. [BACB Ethical Requirements](#5-bacb-ethical-requirements)
6. [Re-Authorization Workflow Constraints](#6-re-authorization-workflow-constraints)
7. [Day-to-Day Workflow Patterns (1-50 Staff)](#7-day-to-day-workflow-patterns)
8. [Consolidated Constraint List for Page Architecture](#8-consolidated-constraint-list)

---

## 1. Required Authorization Data for Billing Compliance

### CMS-1500 Claim Form Requirements

Every ABA claim is submitted on the CMS-1500 (paper) or 837P (electronic) format. The authorization directly feeds these required fields:

| CMS-1500 Box | Field | Authorization Data Source | Consequence If Missing |
|--------------|-------|--------------------------|----------------------|
| Box 23 | Prior authorization number | `authorization_number` | Automatic denial (CO 197) regardless of clinical documentation |
| Box 24A | Dates of service | Must fall within `effective_start_date` to `effective_end_date` | Denial for out-of-range dates |
| Box 24D | CPT/HCPCS code + modifier | Must match `authorization_services.cpt_code` | Denial for code mismatch |
| Box 24E | Diagnosis pointer | Must align with diagnosis on the authorization request | Denial for medical necessity |
| Box 24G | Units | Cannot exceed `approved_units - used_units` per CPT code | Denial + audit risk for over-billing |
| Box 24J | Rendering provider NPI | Must match provider listed on the authorization | Denial (CO 15) for provider mismatch |

**UI constraint:** The authorization detail page must surface all six of these fields prominently. They are not "nice to have" metadata -- they are the exact data that flows onto every claim. If any field is wrong or missing, the claim is denied.

### Per-Service Authorization Fields

Authorizations are not a single approval -- they contain **per-CPT-code service lines**, each with independent tracking:

| Field | Description | Why It Matters |
|-------|-------------|---------------|
| CPT code | Specific service authorized (97151, 97153, 97155, 97156, 97157) | Each code has separate unit allocation; billing wrong code = denial |
| Approved units | Total units authorized for the period | Hard ceiling on billable services |
| Used units | Units consumed so far | Must be tracked in real time to prevent over-billing |
| Remaining units | `approved - used` | The number BCBAs and schedulers need most |
| Frequency type | Total, weekly, monthly, or quarterly limits | Some payers cap weekly hours (e.g., 97153 cannot roll over week to week) |
| Frequency units | Units per frequency period | NC Medicaid: weekly 97153 units cannot roll to other weeks; monthly 97155/97156 units cannot roll to other months |
| Provider type | BCBA, RBT, BCaBA | Only credentialed providers can bill under the auth |
| Service location | Home, clinic, school, telehealth | Auth may restrict where services can be delivered |

**UI constraint:** Authorization detail must show a table/grid of service lines, not a single summary. Each service line needs its own utilization bar, remaining units, and provider/location restrictions. Collapsing all CPT codes into one number is a compliance risk.

### Authorization-Level Fields

| Field | Description | UI Implication |
|-------|-------------|---------------|
| Authorization number | Payer-assigned ID | Must be prominent -- billing staff needs to copy/reference it constantly |
| Effective dates (start/end) | Coverage window | Must be visually clear with days-remaining countdown |
| Auth type | Assessment, treatment, modification, SCA | Affects what fields are relevant |
| Status | Pending, submitted, approved, partially approved, denied, expired, cancelled | Primary visual indicator on the auth card |
| Payer | Insurance company | Determines which rules apply |
| Approved providers | Rendering providers listed on the auth | Scheduling must validate against this list |
| Special conditions | Payer-imposed limitations | Free text but must be visible to schedulers and BCBAs |
| Previous authorization ID | Link to prior auth in the chain | Enables re-auth history view |

---

## 2. Who Needs to See/Manage Authorizations

### Role-Based Access Matrix

| Capability | Admin/Owner | BCBA | Billing Staff | RBT |
|-----------|-------------|------|---------------|-----|
| **View all authorizations** | Yes | Only assigned clients | Yes | Only assigned clients |
| **Create/edit authorizations** | Yes | For assigned clients | Yes | No |
| **Override auth limits** | Yes | No | No | No |
| **See remaining units** | Yes | Yes (assigned) | Yes | Yes (assigned) -- read-only |
| **See expiration dates** | Yes | Yes (assigned) | Yes | Yes (assigned) |
| **See authorization number** | Yes | Yes | Yes | No (not needed) |
| **Trigger re-auth workflow** | Yes | Yes | Yes | No |
| **View utilization dashboard** | Yes | Yes (assigned) | Yes | Limited |
| **Manage alerts** | Yes | Yes (assigned) | Yes | No |
| **View audit trail** | Yes | No | Limited | No |

### What Each Role Needs to See (UI Implications)

**Practice Owner/Admin -- "The Big Picture"**
- Dashboard: All auths approaching expiration, under-utilized auths, gap risks, revenue at risk
- Needs: Aggregate metrics, trend lines, financial impact numbers
- Action: Override limits, reassign, approve financial decisions during gaps
- UI: Dashboard-level widgets with drill-down to individual auths

**BCBA -- "My Caseload"**
- Dashboard: Auth status for all assigned clients, units remaining per CPT code, re-auth due dates
- Needs: Quick glance at whether they can schedule more sessions, how much supervision time remains
- Action: Initiate re-auth, view utilization pacing, check if parent training minimums are met
- UI: Client-centric view with auth cards per client, not a giant table of all auths
- Critical info: "12 of 40 units used (3.0 hours of 10.0 hours)" -- dual format because BCBAs think in hours, billing thinks in units

**Billing Staff -- "Can I Bill This?"**
- Dashboard: Pending auths, expired auths, auth numbers needed for claims, units available
- Needs: Quick access to auth numbers, date validation, unit balance checks before claim submission
- Action: Enter auth details from payer letters, track submissions, manage denials
- UI: Table-oriented view with sort/filter by status, payer, expiration date

**RBT -- "Am I Good to Work Today?"**
- Dashboard: For each assigned client, is the auth active? How many units remain?
- Needs: Simple yes/no indicator before starting a session
- Action: None -- view only
- UI: Minimal display -- green/yellow/red status indicator on client card, remaining hours in plain language

---

## 3. Common Authorization Billing Errors & UI Prevention

### The 6 Most Common Authorization-Related Denials

| # | Error | How It Happens | Frequency | Financial Impact | UI Prevention |
|---|-------|---------------|-----------|-----------------|---------------|
| 1 | **Expired authorization** | Sessions continue past auth end date without re-auth | Most common -- "sneakiest revenue killer" | Full session write-off | Countdown timer on auth, red banner at 30/14/7/0 days, hard block on session logging after expiry |
| 2 | **Exhausted units** | Sessions delivered after approved units are fully consumed | High without real-time tracking | Full session write-off | Real-time unit balance per CPT code, yellow at 80%, red at 95%, hard block at 100% |
| 3 | **CPT code mismatch** | Billed service doesn't match authorized service code | Common with staff changes | Denial + rework | Session logging validates CPT code against active auth services; only show authorized codes in dropdown |
| 4 | **Provider mismatch** | Rendering/supervising provider not listed on the authorization | Common with staff turnover | Denial (CO 15) | Scheduling validates provider against auth-approved providers; flag unmatched providers |
| 5 | **Missing auth number** | Auth number not included on claim (Box 23) | Preventable but common | Automatic denial (CO 197) | Auto-populate auth number on claims from auth record; block claim submission without auth number |
| 6 | **Date range error** | Session dates fall outside auth effective period | Common near auth boundaries | Denial for out-of-range | Calendar/scheduling shows auth date boundaries visually; warn on sessions near start/end dates |

### Under-Utilization (The Silent Revenue Killer)

Under-utilization is not a denial -- it is a **compounding revenue penalty**:

1. Practice delivers only 62.5% of authorized hours (25 of 40 hours/week)
2. Payer sees under-utilization at re-auth and reduces next authorization to 25 hours/week
3. Practice revenue from this client drops permanently by 37.5%
4. Client receives less treatment, progress slows, further reductions follow

**UI Prevention:**
- Utilization pacing indicator: "On track" / "Behind" / "Ahead" per auth
- Under-utilization alert at <50% used with >50% of period elapsed
- Cancellation tracking with makeup session recommendations
- Weekly pacing target: "You need to deliver X more units this week to stay on track"

### Audit Risk

- 35-40% of ABA providers experience documentation/billing audits within first 5 years
- OIG audit of Indiana Medicaid found errors in 100% of sampled ABA claims
- Recoupments from past years can reach 5-15% of historical Medicaid revenue
- Payers conduct pre-payment and post-payment audits focusing on session notes, measurable outcomes, and auth alignment

**UI Prevention:**
- Audit trail for every auth change (who, what, when)
- Pre-claim validation that catches auth issues before submission
- Documentation completeness indicators on session logs

---

## 4. Payer-Specific Requirements

### Authorization Period & Renewal Timing

| Payer | Auth Period | Submission Deadline | Special Requirements |
|-------|-----------|-------------------|---------------------|
| **Medicaid** (varies by state) | 90-180 days | State-dependent | State-specific forms; some require per-code unit breakdowns; EPSDT mandate for under-21 |
| **BCBS** (varies by state) | 6 months | 2-4 weeks before expiry (Horizon) | Thorough documentation with graphs for most goals; published Supplemental Clinical Criteria |
| **Aetna** | 6-12 months | Standard | DSM-5-TR alignment required; validated reassessment every 6-12 months; functional improvement proof |
| **UHC/Optum** | 6 months | Standard | Solid metrics (% skill gains, quantified behavior drops); supervision cap often 20% of 97153 units |
| **TRICARE** | 6 months | 60 days in advance; <30 days = non-reimbursement risk | Specific assessment tools required (PSI, SIPA, PDDBI); min 6 parent training sessions per 6 months |
| **Cigna/Evernorth** | 6 months | Standard | Separate assessment vs. treatment auth; specific modifier requirements |

### Frequency/Rollover Rules (Per CPT Code)

| Rule | Example | UI Implication |
|------|---------|---------------|
| Weekly units cannot roll over | 97153: 80 units/week, unused units are lost | Show weekly utilization, not just total |
| Monthly units cannot roll over | 97155/97156: monthly cap | Show monthly utilization for supervision/parent training |
| Total period units | Overall cap for the auth period | Show total utilization with pacing |
| Supervision ratio caps | UHC: 97155 cannot exceed 20% of 97153 | Validate ratio at scheduling time |
| Parent training minimums | TRICARE: min 6 sessions per 6-month period | Track and alert on parent training pace |

**UI constraint:** The system must support multiple frequency types (total, weekly, monthly, quarterly) per service line within the same authorization. A single "units remaining" number is insufficient -- the UI must show the relevant frequency-based balance.

### Payer-Specific Form Requirements

| Payer | Form/Template | UI Implication |
|-------|--------------|---------------|
| Aetna | Outpatient BH ABA Treatment Request form | Payer-specific template selection |
| BCBS TX | 5-page Clinical Service Request Form | Must accommodate multi-page forms |
| Kaiser | Own progress report template | Template engine needed |
| Medicaid (by state) | State-specific forms and portals | State-aware configuration |

**UI constraint:** The re-auth preparation workflow must adapt to payer-specific documentation requirements. A "one size fits all" progress report template will cause denials.

---

## 5. BACB Ethical Requirements

### Ethics Code for Behavior Analysts (2022, current)

The BACB Ethics Code imposes specific obligations on BCBAs regarding authorization and billing:

| Code Section | Requirement | UI Implication |
|-------------|-------------|---------------|
| Billing accuracy | "Behavior analysts identify their services accurately and include all required information on reports, bills, invoices, requests for reimbursement, and receipts" | Auth data must be accurate and audit-traceable |
| Non-behavioral services | "Behavior analysts do not implement or bill nonbehavioral services under an authorization or contract for behavioral services" | CPT code validation against authorized behavioral codes |
| Billing inaccuracies | "If inaccuracies in reporting or billing are discovered, they inform all relevant parties, correct the inaccuracy in a timely manner, and document all actions taken" | Edit audit trail; ability to flag and correct billing discrepancies |
| Fee transparency | BCBAs must communicate fee requirements to responsible parties and resolve conflicts | Auth utilization visible to clinical and billing teams |
| Supervision responsibility | BCBAs take "full responsibility" for supervised services | BCBA must have visibility into RBT session logs against their clients' authorizations |

**UI constraint:** BCBAs are personally ethically liable for billing accuracy on their caseload. The BCBA view must give them clear, real-time visibility into authorization utilization, session accuracy, and any billing discrepancies for their assigned clients. This is not just a convenience -- it is an ethical mandate.

### RBT Ethics Code

| Requirement | UI Implication |
|-------------|---------------|
| RBTs must maintain communication with scheduling/billing teams about authorization status | RBTs need read access to auth status for their clients |
| RBTs must use correct modifiers (e.g., U1 modifier) | Session logging should auto-apply correct modifiers based on provider role |

---

## 6. Re-Authorization Workflow Constraints

### Timeline Requirements

| Milestone | Timing | Who | UI Feature |
|-----------|--------|-----|-----------|
| Begin re-auth preparation | 60-90 days before expiry (or 75% units consumed, whichever first) | BCBA + Billing | Automated task creation with due date |
| Re-administer standardized assessments | 45-60 days before expiry | BCBA | Assessment scheduling reminder |
| Draft progress report | 30-45 days before expiry | BCBA | Report template with auto-populated data (graphs, utilization metrics, goal status) |
| Submit re-auth package | 30-60 days before expiry (payer-dependent) | Billing/Intake | Submission tracking with payer-specific deadlines |
| Payer review period | 2-6 weeks | N/A | Status tracking: submitted, under review, additional info requested, approved, denied |
| Gap risk threshold | <30 days remaining without approval | Admin | Critical alert + decision point: continue services at risk or pause |

### Re-Authorization Documentation Package

| Document | Source | Auto-Populate Potential |
|----------|--------|----------------------|
| Updated treatment plan | BCBA | Goals from previous plan + progress data |
| Progress report with data/graphs | BCBA + session data | Line graphs from data collection, utilization summary from auth tracker |
| Re-administered assessment scores | BCBA | Pre/post comparison from assessment records |
| Updated Letter of Medical Necessity | BCBA | Template with client details, diagnosis, progress summary |
| Authorization request form | Billing | Payer-specific form with requested units per CPT code |
| Utilization summary | System | Hours authorized vs. delivered, by CPT code |

**UI constraint:** The re-auth workflow is a multi-step, multi-role process that spans 60-90 days. It needs a dedicated task/pipeline view -- not just a status field on the authorization record. The BCBA needs to see "what do I need to do next" and the billing staff needs to see "what's ready to submit."

### Gap Management

When current auth expires before re-auth is approved:

| Scenario | Decision | Financial Risk | UI Support |
|----------|----------|---------------|-----------|
| Continue services without auth | Practice owner decides | Full write-off if retro-auth denied | Flag sessions as "pending auth" with financial risk indicator |
| Pause services | Clinical team notifies family | Lost revenue + client regression | Gap period tracking, family notification template |
| Retroactive approval | Depends on payer | Variable | Track retro-auth requests separately |

**UI constraint:** Authorization gap is a critical business event. The system must predict gaps (based on expiry date and payer turnaround time), alert proactively, and provide a clear decision workflow for the practice owner.

---

## 7. Day-to-Day Workflow Patterns

### How Small Practices (1-50 Staff) Actually Manage Authorizations

Based on industry research, the typical workflow in a small ABA practice:

**Monday Morning (BCBA)**
1. Check caseload: Which clients have sessions this week?
2. For each client: Is the auth still active? How many units remain?
3. Are any auths expiring in the next 30 days? Do I need to start re-auth prep?
4. Are any clients under-utilized? Do I need to schedule makeup sessions?

**Before Scheduling a Session (Scheduler/Admin)**
1. Check auth: Is it active? Are there remaining units for this CPT code?
2. Check provider: Is the assigned RBT/BCBA listed on the auth?
3. Check location: Is the service location authorized?
4. Check frequency: Does this session fit within weekly/monthly limits?

**Before Logging a Session (RBT)**
1. Quick check: Is the auth active for today's date?
2. Start session timer
3. Log session with CPT code, duration, activities
4. System auto-decrements auth units

**Weekly (Billing Staff)**
1. Review sessions ready for billing
2. For each session: Does the auth number exist? Are dates within range? Are units available?
3. Pre-claim validation against auth data
4. Submit claims with auto-populated auth numbers
5. Check for any auth-related denials from previous submissions

**Monthly (Practice Owner/Admin)**
1. Review utilization dashboard: Which clients are under-utilized? Over-utilized?
2. Review expiring authorizations: What's the re-auth pipeline status?
3. Review revenue at risk: How much revenue could be lost to auth issues?
4. Review payer performance: Which payers are slow to approve?

### Common Small Practice Problems

| Problem | Root Cause | UI Solution |
|---------|-----------|-------------|
| Auth data lives in spreadsheets | No integrated system | Centralized auth management connected to scheduling and billing |
| Different staff track different things | No shared visibility | Role-based dashboards with shared data source |
| Re-auth deadlines missed | No automated reminders | Escalating alerts at 90/60/30/10 days |
| Units tracked manually | Disconnected from session logging | Atomic unit decrement on session completion |
| Cancellations not tracked against utilization | Cancellations logged separately from auth tracking | Cancellation impact on utilization calculated automatically |
| BCBAs don't know supervision hours remaining | 97155 tracked separately from direct treatment | Per-CPT-code utilization visible on BCBA dashboard |
| Billing submits claims without checking auth | No pre-submission validation | Automated claim scrubbing against auth data |

---

## 8. Consolidated Constraint List for Page Architecture

### Hard Constraints (Regulatory / Compliance)

These are non-negotiable -- the system MUST enforce these or the practice risks denied claims, audits, and revenue loss.

| # | Constraint | Affected Page(s) | Affected Role(s) |
|---|-----------|------------------|-------------------|
| H1 | Authorization number must be visible and copyable for claim submission | Auth detail, client detail | Billing |
| H2 | Per-CPT-code unit tracking (not aggregated) -- each service line has independent approved/used/remaining | Auth detail, session logging | All |
| H3 | Date range enforcement -- sessions cannot be logged outside auth effective dates | Session logging, scheduling | RBT, Scheduler |
| H4 | Provider validation -- only auth-approved providers can be scheduled/billed | Scheduling, session logging | Scheduler, RBT |
| H5 | Real-time unit balance -- used units must be atomically decremented on session completion | Auth detail, session logging | System |
| H6 | Frequency-based limits (weekly, monthly, total) must be tracked separately | Auth detail, scheduling | Scheduler, BCBA |
| H7 | Over-utilization hard stop at 100% -- cannot schedule or log sessions beyond approved units | Session logging, scheduling | RBT, Scheduler |
| H8 | Auth status drives client service eligibility -- no active auth = no billable sessions | Client detail, scheduling | All |
| H9 | Audit trail for all auth changes (create, edit, status change, unit adjustment) | Auth detail, admin views | Admin, Billing |
| H10 | Multi-tenant isolation -- every auth query filtered by organization_id | All auth pages | System |

### Soft Constraints (Best Practice / Revenue Protection)

These are strongly recommended -- without them, the practice will lose revenue or face operational problems.

| # | Constraint | Affected Page(s) | Affected Role(s) |
|---|-----------|------------------|-------------------|
| S1 | Expiration alerts at 90/60/30/14/7 days | Dashboard, auth detail, notifications | Admin, BCBA, Billing |
| S2 | Utilization alerts at 75%/90%/95%/100% | Dashboard, auth detail, client detail | Admin, BCBA, Billing |
| S3 | Under-utilization warning at <50% used with >50% period elapsed | Dashboard, auth detail | Admin, BCBA, Owner |
| S4 | Re-auth task pipeline with multi-step tracking | Auth detail, task list | BCBA, Billing, Admin |
| S5 | Pacing indicator: "On track" / "Behind" / "Ahead" per auth | Auth detail, client detail | BCBA |
| S6 | Dual format display: units AND hours (BCBAs think in hours, billing in units) | Auth detail, all utilization displays | BCBA, Billing |
| S7 | Cancellation tracking linked to utilization impact | Session logging, auth detail | BCBA, Admin |
| S8 | Gap risk prediction based on expiry date minus payer turnaround time | Dashboard, auth detail | Admin, Billing |
| S9 | Pre-claim validation against auth data before submission | Billing workflow | Billing |
| S10 | Parent training minimum tracking (separate from direct treatment) | Auth detail, BCBA dashboard | BCBA |
| S11 | Supervision ratio monitoring (97155 as % of 97153) | Auth detail, BCBA dashboard | BCBA |
| S12 | Payer-specific documentation requirements surfaced during re-auth prep | Re-auth workflow | BCBA, Billing |

### Information Architecture Constraints

| # | Constraint | Rationale |
|---|-----------|-----------|
| A1 | Authorization is a first-class entity, not a sub-field on the client | Auth connects to scheduling, billing, sessions, and reporting independently |
| A2 | Client detail page must show auth summary (status, utilization, expiry) | BCBAs access auth data through the client, not through a separate auth module |
| A3 | Dashboard must surface auth alerts across all clients | Practice-wide visibility prevents missed deadlines |
| A4 | Auth detail page needs three visual tiers: header (status/dates), service lines (per-CPT utilization), and timeline (events/history) | Matches information needs: quick glance, detailed tracking, audit trail |
| A5 | BCBA view is client-centric; billing view is table/list-centric | Different mental models for the same data |
| A6 | RBT view is minimal: active/inactive indicator + remaining hours | RBTs don't manage auths; they just need to know if they can work |
| A7 | Multiple active authorizations per client (dual coverage, assessment + treatment, overlapping periods) | COB scenarios require parallel auth tracking |
| A8 | Auth chain: link current auth to previous auth for re-auth history | Payer decisions reference historical utilization; practices need the full chain |

---

## Sources

### CMS-1500 & Billing Requirements
- [CMS-1500 Billing Instructions for ABA - Louisiana Medicaid](https://www.lamedicaid.com/provweb1/billing_information/CMS_1500_Billing_Instructions.pdf)
- [Understanding the CMS-1500 Claim Form - Cube Therapy Billing](https://www.cubetherapybilling.com/news/understanding-the-cms-1500-hcfa-claim-form-importance-in-accurate-medical-billing)
- [CMS 1500 Box 23 - CMS1500ClaimBilling](https://cms1500claimbilling.com/box-23-cms-1500-when-to-use-authorization-or-clia-or-zip-code-on/)
- [CMS 1500 Instructions - Security Health](https://www.securityhealth.org/providers/provider-manual/shared-content/claims-processing-policies-and-procedures/cms-1500-instructions)

### Authorization Management & Denials
- [ABA Authorization Management: Prevent Denials - ABA Matrix](https://www.abamatrix.com/aba-authorization-management/)
- [Prior Authorization Management for ABA - Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-a-priorauthorization)
- [ABA Claim Denials: 5 Common Mistakes - TherapyPM](https://therapypms.com/5-common-aba-claim-denials-and-strategies-to-avoid-them/)
- [Common ABA Billing Mistakes - Operant Billing](https://operantbilling.com/common-aba-therapy-billing-mistakes-tips-to-prevent-errors/)
- [ABA Denial Management - Passage Health](https://www.passagehealth.com/blog/aba-denial-management)
- [Common Billing Errors - ABA Building Blocks](https://ababuildingblocks.com/common-billing-errors-and-how-to-avoid-them/)

### Payer-Specific Requirements
- [Aetna ABA Medical Necessity Guide](https://www.aetna.com/content/dam/aetna/pdfs/health-care-professionals/applied-behavioral-analysis.pdf)
- [Aetna Outpatient BH ABA Treatment Request](https://www.aetna.com/document-library/pharmacy-insurance/healthcare-professional/documents/outpatient-behavioral-health-BH-ABA-assessment-precert.pdf)
- [Anthem BCBS ABA Provider Resource Guide](https://www.anthembluecross.com/content/dam/digital/docs/anthembluecross/provider/commercial/forms/aba-provider-resource-guide-abc.pdf)
- [ABA Billing Playbook 2025-2026 - Cube Therapy Billing](https://www.cubetherapybilling.com/aba-billing-playbook)
- [ABA Billing Guidelines 2026 - MedCloudMD](https://www.medcloudmd.com/post/aba-billing-guideline-2026)

### BACB Ethics & Compliance
- [Ethics Code for Behavior Analysts - BACB](https://www.bacb.com/wp-content/uploads/2022/01/Ethics-Code-for-Behavior-Analysts-240830-a.pdf)
- [RBT Ethics Code - BACB](https://www.bacb.com/wp-content/uploads/2022/01/RBT-Ethics-Code-240830-a.pdf)
- [Ethical Responsibilities of BCBAs - All Star ABA](https://www.allstaraba.org/bcba-ethical-responsibilities)
- [Behavior Analyst Ethics Code: 4 Core Principles - Passage Health](https://www.passagehealth.com/blog/behavior-analyst-ethics-code)

### Authorization Workflows & Software
- [Enhance ABA Practices with Proactive Auth Management - CentralReach](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [Mitigate Risks of Overutilized Authorization - CentralReach](https://centralreach.com/blog/mitigating-risks-associated-with-over-utilized-authorizations-in-aba-practices/)
- [Improving Scheduling & Authorizations - Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [Authorization Management Software - AlohaABA](https://alohaaba.com/features/authorization-management)
- [ABA Authorization Management: Streamline Revenue - TherapyLake](https://blog.therapylake.com/aba-authorization-management/)

### Re-Authorization & Progress Reports
- [Guide to ABA Progress Reports for Reauthorization - Praxis Notes](https://www.praxisnotes.com/resources/guide-aba-progress-reports-reauthorization)
- [ABA Prior Authorization Checklist - MBW RCM](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-prior-authorization-checklist)
- [BCBA Initial Authorization Checklist - Praxis Notes](https://www.praxisnotes.com/resources/bcba-prior-authorization-checklist)

### CPT Codes & Unit Tracking
- [ABA Billing Codes - ABA Coding Coalition](https://abacodes.org/codes/)
- [ABA CPT Codes & Modifiers - AnnexMed](https://annexmed.com/aba-therapy-cpt-codes)
- [ABA Billing Codes: 10 Main Codes - Passage Health](https://www.passagehealth.com/blog/aba-billing-codes)
- [CPT Codes for ABA - Humana Military](https://www.humanamilitary.com/content/dam/sites/humana-military-com/provider/tipsheets/autism_tipsheets/CPT-Codes.pdf)

### Audit & Compliance Risk
- [Preparing for an ABA Audit - MBW RCM](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-audit-preparation-guide)
- [Heightened Scrutiny of Medicaid ABA Services - Benesch Law](https://www.beneschlaw.com/insight/heightened-scrutiny-of-medicaid-funded-aba-services-key-takeaways-for-providers/)
- [ABA Documentation Audits - Revenue Cycle Blog](https://revenuecycleblog.com/documentation/aba-documentation-audit-billing-compliance-guide)
- [How the $56M OIG Audit Impacts ABA - BillingParadise](https://www.billingparadise.com/blog/aba-audit-readiness/)
