# Authorization Tracking & Management: Competitive Research

> Research date: 2026-03-21
> Focus: How ABA competitors and adjacent healthcare platforms implement authorization tracking, management, and utilization monitoring.

---

## Table of Contents

1. [ABA Competitor Deep Dives](#1-aba-competitor-deep-dives)
2. [Adjacent Healthcare Platforms](#2-adjacent-healthcare-platforms)
3. [Common UX Patterns](#3-common-ux-patterns-for-authorization-tracking)
4. [User Complaints & Pain Points](#4-user-complaints--pain-points)
5. [Synthesis & Opportunities for Clinivise](#5-synthesis--opportunities-for-clinivise)

---

## 1. ABA Competitor Deep Dives

### 1.1 CentralReach

**Market position:** Dominant ABA platform, enterprise-focused. High feature density, high price, widely used by mid-to-large practices.

**Authorization creation workflow:**
- Auths live in the Billing module, not the client profile (requires navigation away from clinical context)
- Fields: valid dates, authorization number (optional), contacts (assigned providers), manager (BCBA responsible), payor name, diagnosis codes
- Service codes can be added as: single code, grouped codes (shared authorized amount across a set of CPT codes), or from a pre-built template
- Authorization Claim Settings include EPSDT referral codes, contract type codes, reference identification, and G2/LU fields
- Templates can be saved for common authorization patterns (e.g., standard 97153 + 97155 + 97156 package)

**Frequency and unit tracking:**
- Frequency options: Once (lifetime), Monthly (recommended), Quarterly, Semi-annually
- Users set tracking frequency and authorized amounts (hours, units, or visits) per code
- "Calculate Totals" auto-computes total group amounts from frequency and date range
- "Calculate Frequency" reverse-calculates frequency amounts from total group amounts
- Supports allowing overbilling at the frequency level (for makeup sessions) but recommends blocking it at the group total level

**Utilization tracking:**
- Authorizations section in Billing module shows: total authorized hours, hours with scheduled appointments, hours worked, pending hours, remaining hours, utilization rate
- Goal is 100% utilization rate (all authorized hours worked)
- Authorization Analysis Report includes:
  - Provider Scatter Chart (Auth Hours vs % Used, bubble size = remaining hours)
  - Client Scatter Chart (same dimensions)
  - Authorizations by Manager as a Tree Map (sized by auth hours, colored by % used)

**Schedule validation:**
- When booking appointments, Schedule Validation feature identifies authorization issues via warning icons
- Overlapping appointment warnings appear at the bottom of appointment details
- Override checkboxes allow accepting overlap issues
- Permission-based controls: "Override Authorization Limitations" and "Schedule Overlapping Appointments" can be completely blocked per user role
- Best practice: schedule recurring appointment series equal to authorization date range

**Follow-up authorizations:**
- System supports creating follow-up auths linked to the previous one
- Deleted authorizations still appear on reports (known issue/complaint)

**What users praise:**
- Comprehensive feature set; everything in one place
- Easy access to patient chart info including records, billing, and authorizations
- 78% of users find the interface easy to navigate for basic tasks

**What users complain about:**
- 87% of users report that advanced features have problems and slow processes down
- Near 100% of users report frequent downtime during updates, with data inaccessible during update windows
- Support is slow (60% of users report time-consuming support)
- Each additional feature is a high monthly add-on cost
- Entire week of downtime reported where no one could log in
- Reports are data-dense but require significant training to interpret
- Deleted authorization bug (still shows on reports)

**Key takeaway for Clinivise:** CentralReach is feature-complete but has terrible UX/performance. Authorization tracking is buried in the billing module rather than being visible where clinicians work. The scatter chart visualization is interesting but too complex for daily use. The gap is real-time, glanceable utilization where you work (scheduling, client profile), not buried in reports.

---

### 1.2 AlohaABA

**Market position:** Mid-market ABA platform, strong on ease of use. Targets practices that find CentralReach too complex.

**Authorization workflow:**
- Create authorizations per client with assigned access rights to files, systems, services, and treatment types
- Configure authorization defaults to streamline billing setup
- System prevents scheduling beyond authorization limits with alerts at schedule time

**Utilization tracking:**
- Authorization utilization reports accessible directly within the schedule view (not a separate module)
- Real-time monitoring of authorized units
- Connects appointment tracking directly to billing workflows

**Alerts:**
- Timely alerts for expiring authorizations
- Alerts when attempting to schedule beyond authorization limits
- Prevents unauthorized sessions and reduces billing errors proactively

**Dashboard:**
- Customizable dashboard with widgets that vary by user role/permissions
- Real-time dashboards showing denial trends, AR aging, team productivity, appointment fill rates
- Unified billing and reporting dashboards

**What users praise:**
- Easy-to-use interface, "pretty design"
- Integrated billing and payroll
- Good customer support ("no question is too small")
- Utilization reports within the schedule view (not buried in a separate module)

**What users complain about:**
- No app for patients/users
- Some reporting features lacking
- Scheduling calendar needs improvement

**Key takeaway for Clinivise:** AlohaABA's decision to surface authorization utilization directly within the scheduling view is exactly right. Users should not have to navigate to a billing module to check if they can schedule a session. Their alert system at scheduling time is the pattern to follow.

---

### 1.3 Passage Health

**Market position:** Modern ABA platform focused on scheduling-authorization integration. Strong content marketing; positions itself as the "new generation" alternative to CentralReach.

**Authorization workflow:**
- Unified scheduling with built-in authorization checks
- System automatically checks insurance authorizations when scheduling
- Prevents booking beyond approved hours
- Shows remaining hours and supervision needs at scheduling time

**Utilization tracking:**
- Tracks authorization balances across clients and codes
- "Intelligent pacing metrics" -- flags when approaching limits
- Shows used hours vs. remaining hours per authorization
- Supervision tracking integrated (shows if client is close to running out of BCBA supervision hours)

**Alerts and prevention:**
- Flags expiring authorizations and incomplete documentation before they create revenue problems
- Proactive approach: flags problems before appointments get booked, not after claims get denied
- Authorization limits and payer compliance issues flagged pre-submission

**Key reports:**
- Authorization utilization
- Event cancellations
- Team member supervision hours

**Key takeaway for Clinivise:** Passage Health's "flag before booking, not after denial" philosophy is the gold standard. Intelligent pacing metrics that predict when you'll exhaust authorization based on current scheduling patterns, rather than just showing static remaining units, is a differentiation opportunity.

---

### 1.4 RethinkBH

**Market position:** Enterprise ABA platform with SOC 2 Type II certification. Strong compliance/security story.

**Authorization features:**
- Automated insurance authorization tracking with utilization and renewal monitoring
- Analyze authorizations by: progress, renewal requirements, therapist, and practice
- Tracks authorization balances across clients and codes
- Intelligent pacing metrics with limit flags

**Billing integration:**
- Built-in validation engine cross-references claims against payor-specific rules before submission
- Real-time claim tracking
- Automatic ERA posting

**Key takeaway for Clinivise:** The multi-dimensional analysis (by progress, renewal, therapist, practice) is valuable for larger practices. For Clinivise's target market (1-50 staff), the key insight is the validation engine that catches auth-related claim errors before submission.

---

### 1.5 Motivity

**Market position:** Clinical-first ABA platform expanding into practice management. Strong data collection roots.

**Authorization features:**
- Authorization management module with guided flow for adding authorizations
- Tracks utilization and compliance
- Manages secondary payor needs
- Links scheduling directly to authorizations, utilization, and compliance alerts

**Scheduling integration:**
- Only eligible providers matched with clients (factors in credentials, authorizations, real-time availability)
- Automated drive-time and authorization tracking to ensure full utilization

**Dashboard:**
- Intuitive dashboards with easy-to-generate reports
- Instant visibility into authorization utilization, provider capacity, and RCM

**Key takeaway for Clinivise:** Motivity's provider-authorization matching (only showing eligible providers when scheduling) is a smart UX pattern. Credential-aware scheduling that knows which providers CAN deliver which services under which authorization reduces errors upstream.

---

### 1.6 TherapyPM

**Market position:** All-in-one therapy PM targeting ABA and other therapy types.

**Authorization management module (detailed):**
- Add, edit, clone, and manage primary and secondary authorizations
- Track service utilizations, auth statuses, and expiration dates
- View approved and remaining authorization units alongside client and billing data
- Schedule appointments based on authorization units (enforced limits)

**Clone feature:**
- One-click duplication of existing authorizations
- Copies dates, services, and structure for recurring patients
- Saves significant time for reauthorizations

**Edit capabilities:**
- Update any part without starting over (dates, CPT codes, session limits, billing info)
- Remove entire auths with linked services when no longer needed

**Audit trail:**
- Full history log of every authorization action
- Tracks who edited what, when, and how

**Alerts:**
- Notifications months in advance of expiring authorizations
- Timely alerts for approaching utilization limits

**Key takeaway for Clinivise:** The clone feature for reauthorizations is essential -- most auths repeat with minor date/unit changes. Full audit trail is also critical for compliance. TherapyPM's granular edit capabilities (update without starting over) show the importance of flexible authorization management.

---

### 1.7 ABA Matrix

**Market position:** Modern ABA software connecting prior authorizations directly to scheduling, service delivery, and billing.

**Authorization workflow:**
- Authorizations added to client profile with approved units and coverage periods
- Teams monitor utilization in real time as sessions are scheduled or updated
- Calendar integration shows remaining authorized units
- Alerts when authorizations approach expiration

**Payer validation:**
- Built-in payer validation ensures only covered procedure codes and modifiers are configured
- Reduces billing errors and supports compliance

**Integrated workflow:**
- Scheduling connects to authorization tracking
- Service delivery flows into clinical documentation
- Documentation reconciles automatically with billing
- Single coherent process reduces denial drivers at source

**Key takeaway for Clinivise:** The end-to-end integration (scheduling -> auth tracking -> documentation -> billing) as a single process, not separate modules, is the aspirational architecture. ABA Matrix's payer validation (ensuring only covered CPT codes/modifiers) is a valuable feature that prevents errors at data entry time.

---

### 1.8 Raven Health

**Market position:** AI-driven ABA platform, newer entrant. Focuses on automation and modern UX.

**Authorization features:**
- AI-driven prior authorization tracking
- Practice management with auth status tracking
- Secure client insurance information storage
- Integrated with scheduling, billing, records, compliance, and treatment tracking

**Key takeaway for Clinivise:** Raven's AI-first approach to authorization is closest to Clinivise's strategy. Their AI-driven prior auth tracking suggests market readiness for AI-powered authorization features.

---

## 2. Adjacent Healthcare Platforms

### 2.1 SimplePractice

**Market position:** Dominant in solo/small practice mental health. Basic authorization tracking.

**Authorization tracking (limited):**
- Enter prior authorization number, number of uses, and valid date range
- Authorization number auto-applied to insurance claims
- **Critical limitation:** No auto-decrementing units -- system does NOT automatically track how many authorized sessions have been used
- Manual workaround: enter "1" as authorization number just to use the tracking fields for counting

**Secondary insurance issues:**
- Must manually edit Box 23 on secondary claim forms
- Must manually remove authorization numbers for payers that don't require them

**Key takeaway for Clinivise:** SimplePractice proves there's a massive gap in authorization tracking for small practices. Their authorization feature is essentially a form field, not a workflow. Auto-decrementing units is table stakes that SimplePractice still doesn't offer, and this is the dominant platform for small practices. Clinivise can easily surpass this.

---

### 2.2 athenahealth

**Market position:** Large EHR/PM platform for multi-specialty practices.

**Prior authorization workflow (gold standard for general healthcare):**
- Built-in to clinical workflow -- NOT a separate portal or bolt-on
- Automatically identifies when a service requires prior authorization at the point of order
- Triggers submission workflows from moment an order is placed
- Pre-populates authorization requests with patient and clinical data from EHR
- Returns status updates and decisions in real time, inside the provider workflow
- Authorization Determination Engine avoids submitting unnecessary authorizations

**Authorization Tracker:**
- Monitor authorization status at a glance
- Ensures timely follow-up
- Expedites patient care decisions

**Key design principle:** "It's not a portal, a bolt-on, or a patchwork fix. It's a built-in feature of the clinical workflow that aligns provider behavior with health plan rules from the moment care is ordered."

**Key takeaway for Clinivise:** athenahealth's philosophy of embedding authorization into the existing workflow rather than making it a separate destination is the north star for UX design. The automatic identification of when authorization is required, combined with pre-populated submissions, eliminates manual checking and data entry.

---

### 2.3 Availity

**Market position:** Multi-payer authorization portal (not practice-specific, but used by many practices).

**Authorization workflow:**
- Centralized multi-payer portal
- Check if authorization is required before submitting
- Electronically submit authorization with documentation
- Dashboard for all authorization statuses
- Multi-channel submission (portal, trading partners, API, X12)

**UX features:**
- Same user experience across all participating health plans
- Upload documentation rather than fax
- Single-pane dashboard for status tracking

**Key takeaway for Clinivise:** The multi-payer consistency pattern is important -- ABA practices deal with many different insurance companies, and a consistent interface regardless of payer reduces cognitive load and errors.

---

## 3. Common UX Patterns for Authorization Tracking

### 3.1 Utilization Visualization

**How competitors visualize utilization:**

| Pattern | Used By | Pros | Cons |
|---------|---------|------|------|
| Scatter charts (hours vs. % used, bubble = remaining) | CentralReach | Rich multi-dimensional view | Complex, requires training |
| Tree maps (sized by hours, colored by % used) | CentralReach | Good for manager-level overview | Not actionable for daily use |
| In-schedule utilization numbers | AlohaABA, Passage | Contextual, where users already work | Limited to schedule context |
| Table with approved/used/remaining columns | Most platforms | Simple, scannable | No visual urgency indicators |
| Real-time dashboards with configurable widgets | AlohaABA, RethinkBH | Role-customizable | Can be overwhelming |

**Best practice synthesis for Clinivise:**
- Primary: Color-coded progress bars per CPT code showing used/remaining units (green -> amber at 80% -> red at 95%)
- Secondary: Numeric display of used/approved/remaining alongside progress bars
- Tertiary: Pacing indicator showing "on track" / "ahead" / "behind" based on time elapsed vs. units consumed
- Context: Surface these in the client profile, on the scheduling screen, and on the dashboard

### 3.2 Overlapping Authorization Handling

**How competitors handle overlapping auths:**
- Most platforms associate appointments with a specific authorization at scheduling time
- CentralReach uses schedule validation with override checkboxes -- warns but allows override
- Better platforms (Passage, ABA Matrix) link scheduling directly so the system selects the correct authorization automatically
- **No competitor found that explicitly documents a FIFO strategy for overlapping auths** -- this is mostly a manual decision or left to the scheduler

**Clinivise opportunity:** Implement automatic FIFO selection (oldest expiration first) as the default, with a manual override option. This is a gap in the market -- most systems either require manual selection or don't address the overlap scenario explicitly.

### 3.3 Expiring Authorization Alerts

**Common alert patterns across competitors:**

| Alert Type | When | Who Gets Notified |
|-----------|------|-------------------|
| Expiration warning | 30/14/7 days before expiration | BCBA, billing team, intake coordinator |
| Utilization threshold | 80% of units consumed | BCBA, billing team |
| Over-utilization | >100% of units consumed | Billing team, admin |
| Under-utilization | <50% used with >50% of period elapsed | BCBA, clinical director |
| Reauthorization needed | 6-8 weeks before expiration | BCBA (for clinical documentation), billing (for submission) |

**Best practice synthesis:**
- Multi-channel alerts (in-app notification, email, dashboard widget)
- Different stakeholders get different alerts at different times
- Reauthorization should trigger a workflow, not just a notification
- Advanced: factor in payer processing time (some payers take 2-3 weeks to process, so alert earlier)

### 3.4 Authorization Data Entry Flow

**Fields required across platforms:**

**Core fields (every platform requires these):**
- Client name (auto-populated from context)
- Payer/insurance company
- Authorization number
- Valid date range (start date, end date)
- Diagnosis codes (ICD-10)

**Service-level fields (per CPT code within the auth):**
- CPT code (e.g., 97153, 97155, 97156)
- Approved units or hours
- Frequency (weekly, monthly, total)
- Assigned/eligible providers

**Advanced fields (only some platforms):**
- Secondary insurance information
- Referring provider
- EPSDT referral codes
- Authorization claim settings (G2, LU fields)
- Daily min/max units
- Overbilling allowance settings

**Best practice for data entry:**
- Templates for common authorization packages (e.g., "Standard ABA Auth" = 97153 + 97155 + 97156 with typical unit allocations)
- Clone/duplicate from previous authorization (TherapyPM's one-click clone)
- AI-powered auto-fill from uploaded authorization letter (Clinivise's differentiator)
- Progressive disclosure: show core fields first, expand advanced fields on demand
- Pre-fill from context: default to today's date, client's current insurance, client's diagnosis codes

### 3.5 Authorization-to-Session Connection

**How units get consumed:**

Most platforms decrement units when one of these events occurs:
1. **At scheduling time** -- units are "reserved" when an appointment is created (prevents double-booking against the same auth)
2. **At session completion** -- units are "consumed" when the session note is converted/finalized
3. **At billing time** -- units are "billed" when the claim is generated

**Best practice:** Use a three-state model:
- **Reserved** (scheduled but not yet delivered)
- **Consumed** (session completed and documented)
- **Billed** (claim submitted)

This gives visibility into the full pipeline: "You have 100 approved units, 40 consumed, 20 reserved (scheduled), 40 available."

---

## 4. User Complaints & Pain Points

### 4.1 The Spreadsheet Problem

**Current state of the industry:**
- Many ABA practices still rely on spreadsheets for authorization tracking, especially practices with 1-50 staff (Clinivise's target market)
- Spreadsheets work for small caseloads but become unmanageable as practices scale
- Authorization tracking is disconnected from scheduling in spreadsheet-based workflows
- Administrative staff track units manually while scheduling teams assign therapy hours independently
- Issues discovered only after claims are submitted and denied

**Impact:** 3-5 hours per week of staff time wasted on manual auth tracking (per industry estimates). This is direct time Clinivise can reclaim.

### 4.2 Authorization Gap Crises

**What happens when authorizations lapse:**
- Services must stop immediately when authorization expires (cannot treat without valid auth)
- Gap causes client regression (children lose developmental progress)
- Claims for services during gap are automatically denied
- Staff must use provisional codes and flag claims as pending retro-approval
- Strong documentation supports ~95% appeal success rate, but appeals take months
- Many insurance plans require reauthorization every 90 days

**Best practice timeline:**
- Begin reauthorization prep 6-8 weeks before expiration
- Submit at least 2-3 weeks before expiration
- Factor in payer processing time (varies by payer)

### 4.3 Common Authorization-Related Billing Errors

| Error | Frequency | Root Cause | Prevention |
|-------|-----------|------------|------------|
| Services billed beyond authorized units | Very common | Manual tracking, disconnected systems | Real-time unit tracking with hard stops |
| Expired authorization on claims | Very common | Missed renewal dates | Automated expiration alerts at 30/14/7 days |
| Wrong CPT code on claim vs. auth | Common | Manual data entry | Payer validation, auto-linking auth to session |
| Unit/time misalignment | Common | 8-minute rule miscalculation | Automated unit calculation from session time |
| Missing authorization number on claim | Common | Manual entry | Auto-populate from linked authorization |
| Services after auth gap | Moderate | Slow reauthorization | Reauthorization workflow with timelines |
| Over-utilized units with recoupment | Moderate | No real-time tracking | Hard/soft stops at utilization thresholds |

**Financial impact:** $77.8M in improper Medicaid ABA payments found in Colorado alone (HHS OIG report, March 2026), largely tied to documentation and compliance issues. 15-20% of authorization requests require appeals before approval.

### 4.4 Platform-Specific User Frustrations

**CentralReach users complain about:**
- Advanced features are buggy and slow down workflows
- Frequent, lengthy downtime during updates
- Slow customer support
- High per-feature add-on costs
- Steep learning curve for authorization reports
- Deleted authorizations still appearing on reports

**AlohaABA users complain about:**
- Missing patient-facing app
- Limited reporting capabilities
- Calendar/scheduling UI needs improvement

**SimplePractice users complain about:**
- No auto-decrementing authorization units (fundamental limitation)
- Manual processes for secondary insurance authorization numbers
- Not built for ABA therapy specifically

**General industry complaints:**
- Authorization tracking disconnected from scheduling
- No intelligent pacing (just static remaining units, no forecast)
- Reauthorization is a manual, panic-driven process
- No visibility into utilization until claims are denied
- Different payers have different unit tracking rules (weekly vs. monthly rollover)

---

## 5. Synthesis & Opportunities for Clinivise

### 5.1 Table Stakes (Must Have)

Every competitive ABA platform offers these. Clinivise must match:

1. **Authorization CRUD** -- Create, read, update, soft-delete authorizations with all standard fields
2. **Per-CPT-code unit tracking** -- Approved units, used units, remaining units per service code
3. **Expiration alerts** -- 30/14/7 day warnings before auth expires
4. **Utilization thresholds** -- 80% warning, 95% critical, 100%+ over-utilized alerts
5. **Schedule-auth integration** -- Prevent scheduling beyond authorized limits
6. **Authorization-to-claim linking** -- Auto-populate auth number on claims

### 5.2 Differentiators (Clinivise Can Win With)

Features that few or no competitors execute well:

1. **AI-powered authorization letter parsing** -- Upload an auth letter, AI extracts all fields (auth number, dates, CPT codes, approved units, diagnosis, payer). No other ABA platform does this natively.

2. **Intelligent pacing visualization** -- Not just "40 of 100 units used" but "You're 60% through the auth period and have used 40% of units -- you're under-utilizing by 20%. At current pace, you'll exhaust authorization on [date] with [N] units unused."

3. **FIFO overlapping auth resolution** -- Automatic selection of oldest-expiring authorization as default, with manual override. No competitor explicitly documents this.

4. **Reauthorization workflow** -- Not just an alert, but a guided workflow: auto-generate reauth checklist, pull progress data, create documentation package, track submission status. Best platforms only alert; none guide the reauth process.

5. **Three-state unit tracking** -- Reserved (scheduled) / Consumed (session completed) / Billed (claim submitted). Most platforms only track two states. This gives full pipeline visibility.

6. **Authorization-aware scheduling with provider matching** -- When scheduling, show only providers whose credentials match the CPT codes in the client's authorization. Motivity does this; most others don't.

7. **Payer-specific rule enforcement** -- Some payers track weekly (97153 units can't roll over week to week), others monthly. Embed payer-specific rules so the system enforces the correct tracking frequency automatically.

### 5.3 UX Principles (Learned from Competitor Weaknesses)

1. **Authorization visibility where you work** -- Don't bury auth data in a billing module. Surface utilization on the client profile, the scheduling screen, and the dashboard.

2. **Progressive disclosure** -- Core fields first, advanced fields on demand. Most competitors show everything at once, overwhelming users.

3. **Prevent, don't just report** -- Flag auth issues at scheduling time, not after claims are denied. This is the single biggest UX differentiator.

4. **Clone for reauthorization** -- One-click duplication of existing auth with new dates. TherapyPM does this well; it should be table stakes.

5. **Color-coded utilization** -- Emerald for healthy (<80%), amber for warning (80-95%), red for critical (>95%). Consistent with Clinivise's design system status colors.

6. **Glanceable metrics** -- Authorization utilization should be visible at a glance (progress bars, not scatter charts). CentralReach's scatter charts are technically impressive but practically useless for daily operations.

7. **Mobile-friendly authorization checking** -- RBTs in the field need to quickly verify that a session is authorized before starting. None of the competitors prioritize this.

### 5.4 Data Model Implications

Research confirms the Clinivise schema design decisions in the engineering spec:

- `used_units` must be atomic (SQL `SET used_units = used_units + N`) -- confirmed by industry reports of race conditions in manual tracking
- Per-CPT-code tracking within an authorization is essential (not just total units across all codes)
- Frequency tracking matters: some payers authorize weekly, others monthly, others for the full period
- Overlapping authorization handling (FIFO with manual override) is a gap in every competitor
- Audit trail on authorization changes is required for compliance (TherapyPM's full history log pattern)
- Three-state tracking (reserved/consumed/billed) is the aspirational model

### 5.5 Recommended Implementation Priority

**Phase 1 (Current):**
1. Authorization CRUD with all standard fields
2. Per-CPT-code unit tracking (approved/used/remaining)
3. AI-powered auth letter parsing (unique differentiator)
4. Utilization visualization with color-coded progress bars
5. Expiration alerts (30/14/7 days)
6. Utilization threshold alerts (80%/95%/100%)
7. Under-utilization alerts (<50% used with >50% of period elapsed)
8. Schedule validation (prevent booking beyond authorized limits)
9. Clone authorization for reauthorization
10. Audit trail on all authorization changes

**Phase 2 (Billing):**
1. Authorization-to-claim auto-linking
2. Payer-specific rule enforcement
3. Three-state unit tracking (reserved/consumed/billed)
4. Intelligent pacing with exhaustion date forecasting
5. Reauthorization guided workflow
6. Provider-authorization credential matching at scheduling

---

## Sources

### CentralReach
- [Authorization Management: Proactive Scheduling](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [Create an Authorization](https://help.centralreach.com/create-an-authorization/)
- [Authorization Analysis Report](https://help.centralreach.com/the-authorization-analysis-report/)
- [Schedule Validation Authorization Errors](https://help.centralreach.com/schedule-validation-authorization-error-details/)
- [Setting Authorization Frequencies](https://help.centralreach.com/setting-authorization-frequencies/)
- [Authorization Utilization Dashboard](https://community.centralreach.com/s/article/knowledge-the-authorization-utilization-hour-based-dashboard)
- [Mitigate Over-Utilized Authorization Risks](https://centralreach.com/blog/mitigating-risks-associated-with-over-utilized-authorizations-in-aba-practices/)
- [CentralReach Reviews - Capterra](https://www.capterra.com/p/140743/CentralReach/reviews/)
- [CentralReach Reviews - G2](https://www.g2.com/products/centralreach/reviews)

### AlohaABA
- [Authorization Management Software](https://alohaaba.com/features/authorization-management)
- [Streamline Authorizations](https://alohaaba.com/authorization)
- [AlohaABA Review - Passage Health](https://www.passagehealth.com/blog/aloha-aba-reviews)
- [Check Client Authorization Usage](https://support.alohaaba.com/portal/en/kb/articles/check-client-authorization-usage)

### Passage Health
- [Best ABA Practice Management Software](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [ABA Practice Management Software Ranked](https://www.passagehealth.com/blog/aba-practice-management-software)
- [Practice Management](https://www.passagehealth.com/practice-management)

### RethinkBH
- [ABA Billing Software](https://www.rethinkbehavioralhealth.com/our-solutions/rethinkbh-billing/)
- [Practice Management](https://www.rethinkbehavioralhealth.com/our-solutions/practice-management/)

### Motivity
- [ABA Authorization Management](https://www.motivity.net/blog/aba-authorization-management)
- [ABA Practice Management](https://www.motivity.net/features/aba-practice-management)

### TherapyPM
- [Authorization Management](https://therapypms.com/authorization/)
- [Authorization Module Playbook](https://therapypms.com/therapypm-authorization-management-module-playbook-download-now/)
- [ABA Practice Management Software](https://therapypms.com/aba-practice-management-software/)

### ABA Matrix
- [Authorization Management: Prevent Denials](https://www.abamatrix.com/aba-authorization-management/)

### Raven Health
- [ABA Authorization](https://ravenhealth.com/blog/aba-authorization/)

### SimplePractice
- [Using Authorization Tracking](https://support.simplepractice.com/hc/en-us/articles/7007890860045-Using-Authorization-Tracking)
- [SimplePractice Limitations](https://pimsyehr.com/simplepractice-limitations/)

### athenahealth
- [Prior Authorization](https://www.athenahealth.com/prior-authorization)
- [Authorization Management Solutions](https://www.athenahealth.com/solutions/athenaone/authorization-management)
- [athenaPayer Modernizes Prior Authorization](https://www.athenahealth.com/resources/blog/athenapayer-modernizing-prior-authorization)

### Availity
- [Authorizations](https://www.availity.com/authorizations/)
- [End-to-End Authorizations](https://www.availity.com/end-to-end-authorizations/)

### Industry & Billing
- [ABA Authorization Management Guide - Cube Therapy](https://www.cubetherapybilling.com/guidetoabainsuranceauthorization)
- [ABA Claim Denials - TherapyPM](https://therapypms.com/5-common-aba-claim-denials-and-strategies-to-avoid-them/)
- [Authorization Gap Guide - Praxis Notes](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide)
- [ABA Authorization Management - Operant Billing](https://operantbilling.com/improving-authorization-management-in-aba-therapy-a-path-to-financial-health-and-client-success/)
- [Scheduling & Authorizations - Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [ABA KPIs - Motivity](https://www.motivity.net/blog/aba-practice-management-kpi)
- [ABA KPIs - Raven Health](https://ravenhealth.com/blog/aba-practice-metrics-to-track/)
- [ABA Billing Codes - Passage Health](https://www.passagehealth.com/blog/aba-billing-codes)
- [ABA Denial Management - Passage Health](https://www.passagehealth.com/blog/aba-denial-management)
