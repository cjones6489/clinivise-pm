# Authorization Lifecycle Management: Frontier Research

> Research date: 2026-03-21
> Scope: AI-native authorization management, platform adoption wedge, proactive management, value-based care trends, dashboard patterns, workflow automation, stickiness factors
> Audience: Clinivise product and engineering team
> Focus: Small ABA practices (1-50 staff)

---

## Table of Contents

1. [AI-Native Authorization Management](#1-ai-native-authorization-management)
2. [Authorization as the Wedge for Platform Adoption](#2-authorization-as-the-wedge-for-platform-adoption)
3. [Proactive Authorization Management](#3-proactive-authorization-management)
4. [Authorization in Value-Based Care](#4-authorization-in-value-based-care)
5. [The Single Pane of Glass for Authorization](#5-the-single-pane-of-glass-for-authorization)
6. [Authorization Workflow Automation](#6-authorization-workflow-automation)
7. [What Makes Authorization Management Sticky](#7-what-makes-authorization-management-sticky)
8. [Strategic Recommendations for Clinivise](#8-strategic-recommendations-for-clinivise)

---

## 1. AI-Native Authorization Management

### Industry Leaders and Their Approaches

#### Cohere Health (Payer-Side, Pattern Reference)
- **Scale:** 660,000+ providers, 12M+ prior auth requests/year
- **Core approach:** Clinician-crafted AI models + evidence-based care guidelines automate up to 90% of authorization requests with 94% provider satisfaction
- **Cohere Align (2025):** "Smart waiver" that analyzes providers' historical behavior and performance. Trusted clinicians get dynamically reduced PA requirements. Result: ~80% of PA submissions streamlined for pre-approved providers, 55% reduction in submission time, 98% provider satisfaction
- **Ambient Prior Authorization (2025-2026):** Partnership with Microsoft Dragon Copilot. During patient visits, ambient listening triggers Cohere's AI agents to collect/parse documentation in real time, enabling point-of-care authorization decisions. This is the frontier -- authorization approval embedded in the clinical encounter itself
- **Policy Studio:** AI converts static policy PDFs into structured, API-compatible formats
- **Relevance to Clinivise:** The pattern of AI parsing unstructured authorization documents into structured data is directly applicable. Cohere proves that 90%+ auto-processing is achievable. The "trust score" concept (Cohere Align) could inform how we handle repeat authorizations with known payers

#### Waystar (Post-Olive AI Acquisition)
- **Auth Accelerate (Feb 2025):** End-to-end authorization submission automation, claiming 70% time reduction and 90%+ auto-approval rates
- **Key insight:** 2B+ prior authorizations occur annually in the US. Average time per manual authorization: 24 minutes. Providers ranked PA automation as their #1 revenue cycle investment priority for 2025
- **AltitudeAI suite:** Comprehensive AI for the full payment lifecycle
- **Relevance to Clinivise:** Validates that auth automation is the highest-priority investment area. The 24-minute-per-auth benchmark is useful for ROI calculations with prospects

#### Infinx (AI Authorization Determination)
- **Authorization Determination Agent (ADA):** Automatically determines whether prior auth is required for a given CPT code + payer combination with 98%+ accuracy
- **How it works:** ML models trained on millions of historical PA cases across 1,400+ payers, learning patterns across payer policies, procedures, and geographic variations. Adapts as payers change policies
- **Three-agent pipeline:**
  1. **Determination:** Is auth required? (instant answer)
  2. **Initiation:** Auto-fills patient details, navigates payer portal, submits request
  3. **Follow-up:** Automated status checks via payer APIs (Availity, EviCore, Optum integrations)
- **Relevance to Clinivise:** The determination step is extremely valuable for ABA practices. If we can tell a scheduler "this payer does NOT require auth for 97153" instantly, that saves significant staff time. The three-agent pipeline is an ideal target architecture

#### Rhyme Health (Provider-Payer Network)
- **LiveAuth network:** Connects 300+ health plans and 50 largest health systems for touchless real-time authorization decisions
- **KLAS Points of Light winner 2023, 2024:** Recognized for payer-provider collaboration
- **Core innovation:** Rather than automating portal-by-portal submission, Rhyme creates a direct network between providers and payers, bypassing portal friction entirely
- **Relevance to Clinivise:** Network-based auth is the future but requires payer adoption. For small ABA practices, this is "watch" territory -- too dependent on payer participation. However, designing our data model to be API-ready for future network participation is smart

### What a Fully AI-Automated Auth Lifecycle Looks Like

Based on synthesizing all four approaches, the ideal end state:

| Step | Current State | AI-Automated State |
|------|--------------|-------------------|
| **1. Determination** | Staff calls payer or checks portal manually | AI instantly determines if auth is required per CPT + payer + state |
| **2. Document assembly** | BCBA manually writes treatment plan, pulls clinical data | AI drafts auth request from session data, assessments, and progress notes |
| **3. Submission** | Staff navigates payer portal, fills forms | AI auto-submits via payer API or portal automation |
| **4. Status tracking** | Staff calls or checks portal repeatedly | Automated polling + webhook monitoring |
| **5. Decision parsing** | Staff reads approval letter, manually enters units/dates | AI parses authorization letter, extracts CPT codes, units, dates, conditions |
| **6. Utilization monitoring** | Spreadsheets or basic alerts | Real-time burndown with predictive exhaustion dates |
| **7. Re-auth trigger** | Manual calendar reminders | System auto-initiates re-auth based on utilization rate + payer lead times |
| **8. Re-auth document prep** | BCBA manually assembles progress report | AI generates re-auth package from accumulated session data and outcomes |

### Regulatory Context (Critical for 2026)

- **CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F):** Initial provisions take effect January 2026. Health plans must respond to urgent PA requests within 72 hours and standard requests within 7 days
- **Medicare WISeR Model:** Testing AI-powered prior authorizations in 6 states (AZ, NJ, OH, OK, TX, WA) through 2031
- **State-level AI restrictions:** Texas (2025), Arizona, and Maryland prohibit fully automated adverse determinations without human oversight. This means AI can auto-approve but cannot auto-deny
- **Implication for Clinivise:** Design the system to auto-approve and flag-for-review, never auto-deny. The regulatory direction is clearly toward faster, more automated authorization -- we are building in the right direction

### Assessment

| Capability | Maturity | Relevance to Small ABA | Recommendation |
|-----------|----------|----------------------|---------------|
| AI auth letter parsing | **High** -- multiple production systems | **Critical** -- every practice deals with auth letters | **Build now** (Phase 1 feature) |
| Auth determination (is auth required?) | **High** -- Infinx at 98%+ accuracy | **High** -- saves scheduler time daily | **Design for** -- build a payer rules engine, add AI later |
| Auto-submission to payer portals | **Medium** -- works for large portals | **Medium** -- small practices have fewer payers | **Watch** -- CMS API mandate will make this easier by 2027 |
| Ambient/point-of-care auth | **Early** -- Cohere + Microsoft only | **Low** -- ABA sessions are different from medical visits | **Watch** |
| Payer network participation | **Early** -- requires payer adoption | **Low** -- small practices have no leverage | **Watch** |

---

## 2. Authorization as the Wedge for Platform Adoption

### Authorization is THE Pain Point in ABA

The research overwhelmingly confirms that authorization management is the single largest administrative burden in ABA practice management:

- **Manual auth processes consume an average of 14 hours per week per practice** -- nearly a half-time employee dedicated solely to auth administration
- **Lost revenue from PA delays averages $100,000 per practice annually**
- **15-20% of ABA authorization requests require appeals before approval**
- **Colorado Medicaid audit found $77.8M in improper payments and $207M in potentially improper payments** related to ABA documentation/compliance
- **Every unauthorized session is unbillable** -- the practice absorbs 100% of the cost

### Why Practices Switch Software

ABA practices evaluate and switch software primarily based on:

1. **Authorization + scheduling integration** -- the most cited pain point. When auth tracking is disconnected from scheduling, staff track units manually while schedulers assign hours independently. This disconnect is the #1 source of billing denials
2. **Real-time utilization visibility** -- without clear auth utilization data, practices discover issues only after claims are submitted and denied
3. **Billing accuracy** -- over-utilization means the practice pays for sessions out of pocket; under-utilization means leaving approved revenue on the table
4. **Ease of use** -- ABA staff (especially RBTs) resist complex software. User-friendliness is key to adoption
5. **Data migration and onboarding** -- practices fear losing authorization history during transitions. Some vendors charge for data exports or restrict post-termination access

### Quantified Cost of Poor Authorization Management

| Scenario | Financial Impact |
|----------|-----------------|
| Over-utilization (billing beyond approved units) | 100% revenue loss on unauthorized sessions + potential payer recoupment |
| Under-utilization (not using approved units) | Direct revenue loss per unused hour. At $60/unit, a 10% underutilization on 500 sessions/month = $3,000/month = $36,000/year |
| Authorization gap (lapse between auth periods) | Zero billable sessions during gap. For a clinic with 20 clients, a 1-week gap across just 5 clients could mean $5,000-$15,000 in lost revenue |
| Denied claims from auth issues | Average denial rate of 15-20%, with each appeal consuming 30-60 minutes of staff time |
| Staff time on manual auth management | 14 hours/week at $25/hr = $18,200/year in direct labor cost |

**Total annual cost of poor auth management for a small practice: $60,000-$170,000+**

### Competitive Landscape Positioning

| Competitor | Auth Tracking | Auth-Scheduling Integration | AI Features | Target Market |
|-----------|--------------|---------------------------|------------|--------------|
| **CentralReach** | Basic alerts, unit tracking | Partial (requires configuration) | None | Enterprise (100+ staff) |
| **Theralytics** | Good unit tracking | Integrated | None | Mid-market |
| **Passage Health** | Strong -- blocks over-scheduling | Deep integration with pacing metrics | None | Small-mid practices |
| **AlohaABA** | Basic | Basic | None | Small practices |
| **Raven Health** | Basic | No automated checks | None | Small practices |
| **Clinivise (target)** | Predictive + proactive | Deep integration + smart scheduling | AI letter parsing, predictive burndown, auto re-auth prep | Small practices (1-50) |

### Assessment

| Factor | Finding | Recommendation |
|--------|---------|---------------|
| Auth as evaluation criterion | **Confirmed** -- auth + scheduling integration is #1 concern | **Build now** -- make auth tracking a flagship feature |
| Quantified cost of poor auth | **$60K-$170K/year** for small practices | Use in marketing -- "Clinivise pays for itself" |
| Switching trigger | Auth-related billing denials + staff frustration | Position auth management as the reason to switch |
| Competitive gap | No competitor combines AI + proactive auth for small practices | **Build now** -- this is our differentiation window |

---

## 3. Proactive Authorization Management

### Predictive Analytics for Authorization

Current state of the art in ABA auth prediction:

**What exists today:**
- CentralReach: Basic alerts at unit thresholds (e.g., 80% utilized, near expiration)
- Passage Health: "Intelligent pacing metrics" that flag when utilization is off-track
- Most platforms: Simple countdown/percentage displays

**What does NOT exist (our opportunity):**
- Predictive unit exhaustion based on actual scheduling patterns (not just linear burn rate)
- AI-powered re-auth timing recommendations based on payer-specific turnaround times
- Intelligent under-utilization alerts that differentiate between "client cancelled" and "scheduling gap"
- Cross-client portfolio optimization (which clients need attention now vs. later)

### Proactive Re-Authorization

Best practice timing: **Submit re-auth 2-4 weeks before expiration**, depending on payer turnaround time.

**Current approach (manual):**
1. Staff checks spreadsheet/calendar for upcoming expirations
2. BCBA manually reviews client progress
3. BCBA writes progress report and new treatment plan
4. Staff compiles documentation package
5. Staff submits to payer portal
6. Staff follows up manually

**Ideal automated approach:**
1. System calculates optimal re-auth submission date per client per payer (factoring payer turnaround time, current utilization, and auth end date)
2. System alerts BCBA with pre-populated progress summary generated from session data
3. BCBA reviews and adjusts AI-drafted progress report
4. System assembles complete documentation package
5. Staff reviews and submits (or system auto-submits where payer API allows)
6. System auto-tracks status

### Gap Prevention Strategies

**Authorization gaps** (periods where auth expires before re-auth is approved) are a critical revenue risk:

- **BACB Ethics Code 3.16** mandates BCBAs minimize client harm during service interruptions, including authorization gaps
- Gaps of even 1-2 weeks can mean thousands in lost revenue and disrupted client progress
- Prevention requires knowing payer-specific processing timelines and building adequate buffer

**Smart gap prevention system should:**
1. Track historical payer turnaround times (build a database per payer)
2. Calculate "last safe submission date" = auth end date - payer turnaround - safety buffer
3. Escalate alerts as the last safe date approaches
4. Provide a "gap risk" score per client visible in the dashboard

### Smart Scheduling with Auth Optimization

The most sophisticated ABA scheduling approaches optimize auth utilization by:

1. **Even distribution:** Spread approved units across the auth period to avoid front-loading (which risks running out) or back-loading (which risks under-utilization if cancellations occur)
2. **Cancellation recovery:** When a session is cancelled, automatically suggest make-up times within the auth period to maintain target utilization
3. **Cross-code optimization:** When a client has auth for multiple CPT codes (e.g., 97153 direct therapy + 97155 supervision), ensure both are utilized proportionally
4. **Scheduler warnings:** Block scheduling beyond authorized limits and warn when scheduling patterns will lead to under-utilization

### Assessment

| Capability | Maturity | Relevance to Small ABA | Recommendation |
|-----------|----------|----------------------|---------------|
| Expiration alerts (basic) | **Commodity** -- every platform has them | **Table stakes** | **Build now** (Phase 1) |
| Utilization pacing metrics | **Emerging** -- Passage Health leads | **High** | **Build now** (Phase 1) -- differentiate on quality |
| Predictive exhaustion dates | **Novel** -- nobody does this well | **High** | **Build now** -- low engineering effort, high perceived value |
| Smart re-auth timing | **Novel** -- nobody does this | **Very high** | **Design for** (Phase 1 data model) -- **Build Phase 2** |
| AI-generated re-auth documents | **Novel** in ABA | **Very high** -- BCBAs hate writing re-auth reports | **Design for** -- **Build Phase 2** with AI features |
| Cancellation recovery scheduling | **Emerging** -- basic in CentralReach | **High** | **Design for** -- needs scheduling engine first |
| Payer turnaround time tracking | **Novel** -- nobody tracks this systematically | **High** | **Build now** -- simple to implement, compounds in value |

---

## 4. Authorization in Value-Based Care

### The Shift from Volume to Value in ABA

The ABA industry is undergoing a fundamental transition:

- **2025-2026 is the inflection point:** "Behavioral health in 2026 will transition from growth to proof." Both payers and investors are pushing ABA providers to demonstrate tangible outcomes
- **Over 60% of behavioral health providers expect to engage in a value-based arrangement by 2026**
- **Commercial insurers are tightening utilization management:** Approving hours more carefully, requiring stronger documentation for continued care
- **Clinical trend: Lower authorized dosages** with tightened criteria for medical necessity amid expected audits
- **US ABA market size:** $7.97B (2025) projected to $9.96B by 2030

### Outcomes-Based Authorization (Emerging)

The concept: payers approve more units for providers who demonstrate better outcomes.

- **Cohere Align** already adjusts PA requirements based on provider track record. Trusted providers get streamlined approvals. This is the precursor to outcomes-based auth
- **CMS Innovation Models:**
  - **IBH Model (2025-2032):** Value-based integrated behavioral health care in MI, NY, SC
  - **ACCESS Model (launching July 2026):** Outcome-aligned payment approach in Original Medicare
- **Medicaid MCOs** are piloting episode-of-care and outcomes-based arrangements requiring different documentation and reporting
- **Industry expectation:** Providers who can demonstrate outcomes with data will get faster approvals and more generous authorizations

### What This Means for Clinivise

**Opportunity:** If we systematically collect outcome data alongside authorization utilization data, we can:
1. Help practices demonstrate that their services produce results (supporting auth renewals)
2. Provide data for value-based arrangements (which most ABA software cannot do today)
3. Generate AI-powered progress summaries that directly link outcomes to authorized treatment

**Practical implications for auth management:**
- Authorizations will increasingly be granted based on demonstrated progress, not just diagnosis
- Practices that can show "we used X units and achieved Y outcome" will get better re-authorizations
- Software that links session data to outcomes to authorization requests has a massive competitive advantage

### Assessment

| Trend | Timeline | Relevance to Small ABA | Recommendation |
|-------|----------|----------------------|---------------|
| Tightened utilization management | **Now** | **Critical** -- affects every auth request | **Build now** -- strong documentation = better approvals |
| Outcomes-based authorization | **2-3 years** for ABA specifically | **High** -- early adopters will benefit | **Design for** -- collect outcome data now, report later |
| Value-based contracts | **3-5 years** for small practices | **Medium** -- MCOs will approach larger groups first | **Watch** -- but build the data infrastructure |
| Provider trust scores (a la Cohere Align) | **2-4 years** | **Medium** -- depends on payer adoption | **Watch** -- but track our practices' approval rates |

---

## 5. The Single Pane of Glass for Authorization

### Design Principles for Unified Status Dashboards

Research on effective dashboard design for complex portfolio-level views:

**Information hierarchy (most critical first):**
1. **Immediate action required** -- auths expiring this week, units exhausted, gap risks
2. **Trending concerns** -- clients approaching utilization thresholds, upcoming expirations
3. **Portfolio health** -- aggregate utilization rate, revenue at risk, re-auth pipeline
4. **Historical context** -- trends over time, payer performance, denial patterns

**SaaS dashboard best practices:**
- Users need to find what they need within 5 seconds
- Progressive disclosure: overview first, drill down on click
- Role-based views: admin sees portfolio, BCBA sees their clients, RBT sees their schedule
- Color coding: emerald (healthy), amber (attention needed), red (action required) -- aligns with our design system

**Financial dashboard patterns applicable to auth management:**
- Portfolio value tracking maps to total authorized revenue remaining
- Risk assessment matrices map to auth expiration + utilization risk
- Traffic light status indicators for per-client auth health
- Trend lines for utilization pacing (actual vs. expected)

### Proposed Authorization Dashboard Architecture

**Level 1: Practice Overview (Admin/Owner)**
```
+--------------------------------------------------+
|  Authorization Health Score: 87/100               |
|  [===============================-----]           |
+--------------------------------------------------+
|  Action Required (3)  |  Attention (7)  |  OK (42)|
+--------------------------------------------------+
|  Revenue at Risk: $12,400                         |
|  - Expiring this month: $8,200 (4 clients)        |
|  - Over 90% utilized: $4,200 (3 clients)          |
+--------------------------------------------------+
|  Re-Auth Pipeline                                 |
|  Submitted: 5  |  Pending: 3  |  Due this month: 2|
+--------------------------------------------------+
```

**Level 2: Client Auth Detail (BCBA/Admin)**
```
+--------------------------------------------------+
|  Client: [Name]                                   |
|  Auth Period: 01/15/2026 - 07/14/2026             |
|  Payer: BlueCross BlueShield                      |
+--------------------------------------------------+
|  97153 (Direct)  [===========------] 68% used     |
|    128/188 units  |  Pace: On Track               |
|    Predicted exhaustion: 06/28 (16 days before end)|
|                                                    |
|  97155 (Supervision) [=====---------] 42% used    |
|    21/50 units   |  Pace: Behind (schedule more)   |
|    Predicted exhaustion: After auth ends (OK)      |
+--------------------------------------------------+
|  Re-Auth Status: Not yet submitted                |
|  Recommended submit by: 06/01 (payer avg: 12 days)|
+--------------------------------------------------+
```

**Level 3: Scheduler View**
```
+--------------------------------------------------+
|  This Week's Auth Warnings                        |
|  [Client A] - 3 units remaining on 97153         |
|  [Client B] - Auth expires in 5 days, no re-auth |
|  [Client C] - 97155 under-utilized, need 4 more  |
+--------------------------------------------------+
```

### Key Design Decisions

1. **Auth Health Score:** A single composite number (0-100) that combines utilization pacing, expiration proximity, gap risk, and re-auth status. This is the "at a glance" metric
2. **Revenue at Risk:** Always quantify in dollars, not just unit counts. "$12,400 at risk" is more motivating than "47 units approaching limit"
3. **Predicted exhaustion date:** Based on actual scheduling patterns, not linear burn rate. If a client has sessions M/W/F, project forward from that pattern
4. **Payer turnaround context:** Show payer-specific data alongside re-auth timing. "Payer avg turnaround: 12 days" makes the recommended submit date credible

### Assessment

| Pattern | Maturity | Relevance | Recommendation |
|---------|----------|-----------|---------------|
| Traffic light auth status | **Commodity** | **Table stakes** | **Build now** |
| Revenue-at-risk quantification | **Novel** in ABA tools | **Very high** | **Build now** -- simple math, high impact |
| Composite auth health score | **Novel** in ABA tools | **High** | **Build now** -- differentiator |
| Predictive exhaustion visualization | **Novel** | **Very high** | **Build now** -- uses data we already collect |
| Role-based dashboard views | **Standard SaaS pattern** | **High** | **Build now** (Phase 1 dashboard) |
| Payer turnaround benchmarks | **Novel** in ABA tools | **High** | **Design for** -- accumulate data from day 1 |

---

## 6. Authorization Workflow Automation

### Current Automation Landscape

**What exists in the broader healthcare market:**
- **Waystar Auth Accelerate:** End-to-end submission automation (70% time reduction)
- **Infinx:** Three-agent pipeline (determine, initiate, follow-up)
- **Rhyme LiveAuth:** Direct payer-provider network for real-time decisions
- **Notable Health:** AI document assembly + form filling
- **Myndshft:** Real-time eligibility + auth determination

**What exists in ABA-specific tools:**
- **CentralReach:** Basic expiration alerts, manual submission
- **Passage Health:** Scheduling blocks when auth exhausted
- **Theralytics:** Unit tracking with alerts
- **All others:** Essentially manual processes with alert overlays

### Automation Opportunity Map for ABA

| Workflow Step | Current (Most Practices) | Automation Level Available | Clinivise Target |
|--------------|-------------------------|---------------------------|-----------------|
| Expiration reminders | Calendar alerts or none | **Easy** -- rule-based alerts | Phase 1 |
| Utilization alerts | Spreadsheet review | **Easy** -- threshold-based | Phase 1 |
| Auth letter parsing | Manual data entry (20-30 min) | **Medium** -- AI extraction | Phase 1 |
| Utilization forecasting | Not done | **Medium** -- statistical projection | Phase 1 |
| Re-auth timing recommendations | Manual/memory | **Medium** -- payer data + rules | Phase 1-2 |
| Progress report generation | BCBA writes from scratch | **Hard** -- AI draft from session data | Phase 2 |
| Document package assembly | Manual compilation | **Medium** -- template + data merge | Phase 2 |
| Payer portal submission | Manual portal navigation | **Hard** -- varies by payer | Phase 3+ |
| Status tracking/follow-up | Manual calls/portal checks | **Hard** -- requires payer API/RPA | Phase 3+ |
| Appeal preparation | Manual | **Hard** -- requires denial analysis AI | Phase 3+ |

### Automation ROI for Small ABA Practices

Using industry benchmarks:
- **14 hours/week** saved on manual PA processes (at $25/hr = $18,200/year)
- **60% reduction in PA processing costs** through workflow automation
- **25-40% reduction in denial rates** from better documentation
- **$100,000/year** in recovered revenue from fewer PA delays

For a practice managing 40-50 PA requests per month:
- At 24 minutes per manual PA, that is 16-20 hours/month of pure admin work
- Automation can reclaim 80-120 staff hours monthly (equivalent of a part-time employee)

### Assessment

| Automation | Effort | Impact | Recommendation |
|-----------|--------|--------|---------------|
| Smart alert system (expiry, utilization, pace) | **Low** | **High** | **Build now** (Phase 1) |
| AI auth letter parsing | **Medium** | **Very high** | **Build now** (Phase 1) |
| Predictive burndown + exhaustion | **Low** | **High** | **Build now** (Phase 1) |
| Re-auth timing engine | **Medium** | **High** | **Build Phase 1** (data collection) + **Phase 2** (recommendations) |
| AI progress report draft | **High** | **Very high** | **Phase 2** |
| Document package assembly | **Medium** | **Medium** | **Phase 2** |
| Payer portal automation | **Very high** | **High** | **Phase 3+** (wait for CMS API mandate) |

---

## 7. What Makes Authorization Management Sticky

### Switching Cost Analysis

**Data gravity:** Authorization data accumulates over time and becomes increasingly valuable:
- Historical utilization patterns per client per payer
- Payer turnaround time benchmarks (data we collect over months/years)
- Authorization history (past auths, approval rates, denial reasons)
- Scheduling patterns tied to auth periods
- Progress notes and clinical documentation linked to auth periods

**Migration challenges identified in the research:**
- Patient demographics, insurance information, and open authorizations must transfer accurately
- Mid-auth-period migrations are particularly painful -- you cannot easily split an authorization's tracking between two systems
- Post-termination data access varies widely across vendors (some charge for exports)
- Implementation timeline: 4-8 weeks for small practices, 3-6 months for mid-sized

### What Creates Lock-In (Without Being Anti-User)

The healthiest form of stickiness comes from **accumulated value**, not data hostage-taking:

1. **Learned payer intelligence:** The longer a practice uses the system, the better its payer-specific predictions become (turnaround times, approval patterns, documentation requirements). This data is unique to each practice and cannot be replicated in a new system
2. **Historical context:** When a BCBA prepares a re-auth, having the full authorization history, past approval letters, and utilization patterns in one place is invaluable. Moving to a new system means losing this context
3. **Workflow muscle memory:** Once staff learn "check the auth dashboard every Monday, address red items, review amber items" -- that workflow is hard to replicate elsewhere
4. **AI improvement over time:** As our AI parses more auth letters from a practice's specific payers, it gets better at extracting the right data. This learning is practice-specific
5. **Scheduling optimization history:** The system learns the practice's scheduling patterns and can make better utilization predictions. A new system starts cold

### Network Effects in Authorization Management

Unlike EHR systems (where Epic creates network effects through interoperability), authorization management has **limited direct network effects** for small practices. However, there are indirect network effects:

- **Payer intelligence pooling:** If we aggregate (anonymized) payer behavior data across all Clinivise practices, every practice benefits from the collective intelligence. "BlueCross in Texas averages 11 days for ABA re-auth approvals" is data no single practice can generate alone
- **Documentation template sharing:** Best-practice auth request templates that have high approval rates can be shared across the platform
- **Benchmark data:** "Your authorization approval rate is 94%, compared to the Clinivise average of 87%" creates value from the network

### Anti-Churn Design Principles

1. **Make data portable:** Offer full data export always. Confidence in portability paradoxically reduces churn -- it removes the "trapped" anxiety that makes users evaluate alternatives
2. **Increase accumulated value:** Every month of use should make the system more valuable (better predictions, more history, smarter recommendations)
3. **Embed in workflows:** Make the auth dashboard the first thing staff check every morning. Become the system of record, not a secondary tool
4. **Create "aha moments" regularly:** Monthly "Clinivise prevented $X in lost revenue" summaries remind users of value
5. **Smooth onboarding with historical import:** If we can import auth history from competitors (even from spreadsheets), we reduce switching friction INTO Clinivise while increasing switching friction AWAY from it

### Assessment

| Stickiness Factor | Effort to Build | Lock-In Strength | Recommendation |
|-------------------|----------------|-------------------|---------------|
| Historical auth data accumulation | **Low** -- happens naturally | **High** | **Build now** -- store everything |
| Payer intelligence (practice-specific) | **Medium** | **Very high** | **Build now** -- start tracking payer turnaround |
| Payer intelligence (cross-practice pooling) | **High** | **Very high** (network effect) | **Design for** -- schema ready, build when at scale |
| AI model improvement over time | **Medium** | **High** | **Design for** -- log AI parsing results |
| Revenue-saved reporting | **Low** | **Medium** (emotional stickiness) | **Build now** -- simple but powerful |
| Full data export | **Low** | **Reduces churn anxiety** | **Build now** -- strategic trust-builder |
| Historical import from competitors | **Medium** | **Reduces switching friction IN** | **Build Phase 1** -- even CSV import helps |

---

## 8. Strategic Recommendations for Clinivise

### Phase 1 "Build Now" Features (Current Sprint Focus)

These are the authorization features that should ship in Phase 1 to establish Clinivise as the best auth management tool for small ABA practices:

| Feature | Why Now | Competitive Position |
|---------|---------|---------------------|
| **AI auth letter parsing** | Saves 20-30 min per auth, immediate "wow" factor | Nobody in ABA has this |
| **Predictive utilization burndown** | Low effort, high perceived value, uses data we already have | Novel in ABA tools |
| **Auth health score (composite)** | Single metric that tells the whole story | Novel in ABA tools |
| **Revenue-at-risk quantification** | Translates units into dollars -- more motivating | Novel in ABA tools |
| **Smart alert system** (tiered: 80%, 95%, 100%, expiring) | Table stakes done better with context | Commodity but we do it smarter |
| **Payer turnaround tracking** (start collecting data) | Compounds in value over time | Novel -- nobody tracks this |
| **Auth-scheduling integration** (block over-scheduling) | #1 requested feature in ABA software | Passage Health does this; we match + exceed |
| **Full data export** | Trust builder, reduces switching anxiety | Strategic positioning |

### Phase 2 "Design For" Features

Build the data model and UI hooks now, implement the logic in Phase 2:

| Feature | Why Phase 2 | Data/Schema Needs Now |
|---------|------------|----------------------|
| **AI re-auth document generation** | Needs accumulated session + outcome data | Store structured session summaries |
| **Smart re-auth timing engine** | Needs payer turnaround data we are collecting | `payer_turnaround_days` tracking |
| **Outcome-linked authorization support** | Value-based care is 2-3 years out | Outcome measurement schema |
| **Cancellation recovery scheduling** | Needs scheduling engine maturity | Session cancellation tracking with reason codes |
| **Cross-practice payer intelligence** | Needs multiple practices on the platform | Anonymized aggregate query infrastructure |

### "Watch" List (Monitor, Do Not Build Yet)

| Trend | Why Watch | Trigger to Act |
|-------|----------|---------------|
| Payer portal auto-submission | CMS API mandate will simplify this by 2027 | When 3+ major ABA payers offer PA APIs |
| Ambient/point-of-care auth | ABA workflow is different from medical | If ABA payers adopt real-time auth networks |
| Provider trust scores | Requires payer-side adoption | When payers begin offering tiered PA requirements |
| Value-based contracts | 3-5 years for small practices | When a single payer offers VBC to small ABA practices |
| Network-based auth (Rhyme model) | Requires critical mass of payer participation | When Rhyme or similar enters ABA specifically |

### Positioning Summary

**Clinivise's authorization management should be positioned as:**

> "The first ABA practice management platform that treats authorization as a financial asset to be optimized, not a form to be filled out."

Key differentiators vs. the market:
1. **AI-native from day one** -- auth letter parsing, predictive burndown, smart alerts
2. **Revenue-denominated** -- everything expressed in dollars, not just units
3. **Proactive, not reactive** -- predicts problems before they happen
4. **Learns over time** -- gets smarter about your specific payers and patterns
5. **Built for small practices** -- no enterprise bloat, no configuration maze

---

## Sources

### AI-Native Authorization Management
- [Cohere Health - AI Prior Authorization](https://www.coherehealth.com/)
- [Cohere Health - Ambient Prior Authorization at Point of Care](https://www.prnewswire.com/news-releases/cohere-health-improves-provider-experience-with-ai-powered-ambient-prior-authorization-at-the-point-of-care-302585634.html)
- [Cohere Health - AI Prior Authorization Compliance](https://www.coherehealth.com/news/cohere-health-prior-authorization-compliance-ai)
- [Cohere Health Company Profile | IntuitionLabs](https://intuitionlabs.ai/articles/cohere-health-ai-prior-authorization)
- [Waystar Authorization Automation Expansion](https://www.waystar.com/news/waystar-expands-authorization-automation-to-address-healthcare-providers-top-2025-investment-priority/)
- [Infinx Prior Authorization Solution](https://www.infinx.com/prior-authorization-solution-ai-and-automation/)
- [Infinx Authorization Determination Case Study](https://www.infinx.com/case-study/national-imaging-network-achieves-prior-authorization-determination-accuracy-with-ai/)
- [Infinx ROI Assessment for PA Software](https://www.infinx.com/factors-to-consider-when-assessing-return-on-investment-roi-of-prior-authorization-software/)
- [Rhyme Health - Eliminating Prior Auth](https://getrhyme.com/)
- [Cohere Health, Medical Mutual, and Rhyme Partnership](https://www.prnewswire.com/news-releases/cohere-health-medical-mutual-and-rhyme-partner-on-utilization-management-transformation-302162495.html)

### Regulatory and Market Context
- [CMS Prior Authorization API Requirements Q&A](https://www.hcinnovationgroup.com/interoperability-hie/application-programming-interfaces-apis/article/55343388/qa-cohere-healths-matt-parker-on-meeting-cms-prior-authorization-api-requirements)
- [Medicare WISeR AI Experiment](https://stateline.org/2025/12/04/medicares-new-ai-experiment-sparks-alarm-among-doctors-lawmakers/)
- [AI and Automation in Healthcare 2026 Predictions](https://www.healthcareittoday.com/2025/12/23/ai-and-automation-in-healthcare-2026-health-it-predictions/)
- [Prior Authorization Overhaul 2026 - Behavioral Health Business](https://bhbusiness.com/2025/06/24/prior-authorization-overhaul-to-debut-in-2026-with-broader-reform-for-behavioral-health-on-the-horizon/)
- [Prior Authorization Automation Guide 2026](https://www.getprosper.ai/blog/prior-authorization-automation-guide)

### ABA-Specific Authorization Management
- [ABA Authorization Management - ABA Matrix](https://www.abamatrix.com/aba-authorization-management/)
- [CentralReach Proactive Authorization Management](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [CentralReach Mitigating Over-Utilized Authorizations](https://centralreach.com/blog/mitigating-risks-associated-with-over-utilized-authorizations-in-aba-practices/)
- [Improving Authorization Management - Operant Billing](https://operantbilling.com/improving-authorization-management-in-aba-therapy-a-path-to-financial-health-and-client-success/)
- [Optimizing Authorizations and Scheduling - Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [BCBA Authorization Gap Documentation Guide - Praxis Notes](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide)
- [ABA Prior Authorization Checklist](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-prior-authorization-checklist)
- [Prior Authorization for ABA - Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-a-priorauthorization)

### ABA Industry Trends and Value-Based Care
- [ABA Trends 2026 - ABA Matrix](https://www.abamatrix.com/aba-trends-2026/)
- [Behavioral Health 2026: Growth to Proof](https://bhbusiness.com/2025/12/31/behavioral-health-in-2026-will-transition-from-growth-to-proof/)
- [Autism Care Market Reckoning - Outcomes Push](https://bhbusiness.com/2025/11/21/autism-care-faces-market-reckoning-as-payers-investors-push-for-proof-of-outcomes/)
- [State Medicaid ABA Rate Cuts](https://bhbusiness.com/2025/11/13/how-providers-can-future-proof-themselves-as-state-medicaid-agencies-cut-aba-rates/)
- [ABA Billing and Credentialing 2025-2026 Playbook](https://www.cubetherapybilling.com/aba-billing-and-credentialing-in-2025-what-s-new-what-s-critical-and-what-s-next)
- [CMS IBH Model](https://www.cms.gov/priorities/innovation/innovation-models/ibh)

### Software Evaluation, Switching, and Stickiness
- [Top ABA Practice Management Software 2026 - Passage Health](https://www.passagehealth.com/blog/aba-practice-management-software)
- [ABA Practice Management Software Guide - AlohaABA](https://alohaaba.com/blogs/the-ultimate-guide-to-aba-practice-management-software-streamline-your-therapy-business)
- [Selecting ABA Practice Management Software - ABA Matrix](https://www.abamatrix.com/the-ultimate-guide-to-selecting-an-aba-practice-management-software/)
- [EHR Data Migration Challenges - MD Synergy](https://www.mdsynergy.com/ehr-data-migration-challenges-when-switching-ehr-systems-what-healthcare-practices-need-to-know/)
- [Epic EHR Network Effects - Harvard Digital](https://d3.harvard.edu/platform-digit/submission/epic-ehr-systems-the-role-of-network-effects/)
- [Technology Adoption in ABA Clinics](https://masteringaba.com/implementing-new-tech-in-an-aba-clinic-adoption-training-and-change-management-real-world-examples-and-case-applications/)
- [Small Practice Technology Needs](https://linksaba.com/how-to-choose-aba-practice-management-software/)

### Dashboard Design Patterns
- [Single Pane of Glass - IBM](https://www.ibm.com/think/topics/single-pane-of-glass)
- [Healthcare Dashboard Design Best Practices - Thinkitive](https://www.thinkitive.com/blog/best-practices-in-healthcare-dashboard-design/)
- [SaaS Dashboard Design Best Practices](https://adamfard.com/blog/saas-dashboard-design)
- [Dashboard Design Best Practices - DataCamp](https://www.datacamp.com/tutorial/dashboard-design-tutorial)
- [Financial Dashboard Color Palettes](https://www.phoenixstrategy.group/blog/best-color-palettes-for-financial-dashboards)

### Workflow Automation
- [Authorization Workflow Automation - Waystar](https://www.waystar.com/blog-automated-prior-authorization-101-how-to-activate-staff-exception-based-workflows/)
- [Prior Authorization Automation - Notable Health](https://www.notablehealth.com/blog/getting-started-with-prior-authorization-automation)
- [Transforming Prior Authorizations with AI - Availity](https://www.availity.com/blog/transforming-prior-authorizations-with-ai-powered-automation/)
- [ABA Software Trends 2026 - Motivity](https://www.motivity.net/blog/aba-software-trends-2026)
