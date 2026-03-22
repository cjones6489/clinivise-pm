# The Complete ABA Authorization Lifecycle: End-to-End Research

> Research date: 2026-03-21
> Scope: Full authorization lifecycle mapping from referral through re-authorization, payer-specific differences, pain points, connection to every PM function, and authorization as an adoption driver
> Audience: Clinivise product and engineering team
> Purpose: Definitive reference for building authorization lifecycle as Clinivise's core differentiator

---

## Table of Contents

1. [The Complete Authorization Lifecycle Map](#1-the-complete-authorization-lifecycle-map)
2. [How Authorization Connects to Every PM Function](#2-how-authorization-connects-to-every-pm-function)
3. [Pain Points and Revenue Leakage](#3-pain-points-and-revenue-leakage-in-the-authorization-lifecycle)
4. [Payer-Specific Authorization Lifecycle Differences](#4-payer-specific-authorization-lifecycle-differences)
5. [Authorization as the Platform Adoption Wedge](#5-authorization-as-the-platform-adoption-wedge)
6. [Data Model Implications](#6-data-model-implications-for-clinivise)
7. [Staff Roles in the Authorization Lifecycle](#7-staff-roles-in-the-authorization-lifecycle)
8. [Strategic Recommendations](#8-strategic-recommendations-for-clinivise)

---

## 1. The Complete Authorization Lifecycle Map

The ABA authorization lifecycle is a continuous, repeating cycle with 10 distinct phases. Understanding every phase is critical because authorization governs **what can be scheduled, billed, and paid**. A failure at any phase cascades into revenue loss.

### Phase 1: Referral and Insurance Verification

**Trigger:** A family contacts the practice (self-referral, physician referral, or school referral) with a child who has an ASD diagnosis.

**What happens:**
1. **Intake coordinator** collects: child's name, DOB, diagnosis, insurance info, referral source
2. **Insurance verification (VOB/QOB):** Staff contacts the payer (phone, portal, or eligibility API) to confirm:
   - ABA therapy is a covered benefit under the plan
   - Maximum hours allowed per week/month/year
   - Provider credential requirements (BCBA, LBA, etc.)
   - Whether prior authorization is required (and for which CPT codes)
   - Co-pays, deductibles, out-of-pocket maximums
   - Age restrictions or service location limitations (home, clinic, school, telehealth)
   - Whether the practice is in-network or requires a Single Case Agreement (SCA)
3. **Required documents gathered:**
   - Diagnostic evaluation confirming ASD (DSM-5, ICD-10 F84.0)
   - Physician referral/prescription for ABA services
   - Prior medical records if relevant
   - Insurance card (front and back)
   - Signed consent forms

**Timeline:** 1-5 business days for verification. Eligibility APIs can return results in seconds; phone verification can take 30-60 minutes per call.

**Key insight:** 68% of healthcare providers report that inaccurate or incomplete patient data at intake causes billing denials. This is the first point where authorization failures originate.

**Clinivise opportunity:** Auto-verify eligibility at intake, flag missing documents before the BCBA is scheduled, and pre-populate auth request forms from intake data.

---

### Phase 2: Assessment Authorization Request

**Trigger:** Insurance verification confirms ABA is covered and prior auth is required.

**What happens:**
1. Practice submits a **prior authorization request for assessment only** (CPT 97151 - Behavior Identification Assessment)
2. Submission includes:
   - Client demographics and insurance details
   - Referring provider information
   - Diagnosis code (F84.0 or related)
   - Requested units: typically 8-32 units (2-8 hours) for initial assessment
   - Clinical justification for assessment
3. Payer reviews and approves (or requests additional information)

**Submission methods vary by payer:**
- Online payer portals (Availity, payer-specific portals) -- preferred by most payers
- Fax (still common for smaller regional payers)
- Phone (live reviews for some payers)
- EHR integration (limited availability)

**Timeline:** 3-10 business days for assessment authorization approval. Some payers auto-approve assessment requests; others require full review.

**Important nuance:** Some states (e.g., Virginia) have exempted assessment codes (97151, 97152, 0362T) from requiring prior authorization, while still requiring it for treatment codes. This varies significantly by state and payer.

**Clinivise opportunity:** Track which payers require assessment auth vs. auto-approve. Pre-fill assessment auth requests from intake data. Alert when assessment auth is approved so BCBA can be scheduled immediately.

---

### Phase 3: Comprehensive Assessment (BCBA Conducts Evaluation)

**Trigger:** Assessment authorization is approved (or not required).

**What happens:**
1. **BCBA conducts the assessment** using standardized tools:
   - VB-MAPP (Verbal Behavior Milestones Assessment and Placement Program)
   - ABLLS-R (Assessment of Basic Language and Learning Skills)
   - AFLS (Assessment of Functional Living Skills)
   - ABAS (Adaptive Behavior Assessment System)
   - Vineland Adaptive Behavior Scales
   - Direct observations of behavior in natural settings
   - Caregiver/parent interviews
2. Assessment includes both face-to-face and non-face-to-face time (data analysis, report writing)
3. **Only a BCBA or licensed behavior analyst** can bill 97151 -- RBTs cannot
4. Billed in 15-minute units under the 8-minute rule

**Timeline:** 1-3 weeks from scheduling to completed assessment, depending on BCBA availability and complexity.

**Output:** A comprehensive assessment report that becomes the foundation for the treatment plan and treatment authorization request.

**Clinivise opportunity:** Track assessment units used vs. authorized. Alert BCBA when approaching unit limit. Provide assessment report templates that align with payer requirements.

---

### Phase 4: Treatment Plan Development

**Trigger:** Assessment is completed.

**What happens:**
1. **BCBA develops an individualized treatment plan** based on assessment results
2. Treatment plan must include:
   - **Target behaviors** with clear definitions, baseline levels, and measurable criteria
   - **3-7 SMART objectives per domain** (e.g., "Client will initiate social interactions with peers in 80% of opportunities within 6 months")
   - **Recommended service hours** by CPT code:
     - 97153 (RBT direct treatment): typically 20-40 hours/week for comprehensive programs
     - 97155 (BCBA protocol modification/supervision): minimum 1 hour per 10 hours of 97153
     - 97156/97157 (parent/caregiver training): minimum 6 sessions per 6-month auth period
   - **Service location** breakdown (home, clinic, school, telehealth)
   - **Weekly schedule** of proposed sessions
   - **Clinical justification** for recommended intensity level
   - **Behavioral intervention techniques**, reinforcement strategies, generalization plans
   - **Discharge criteria**

**Key business rule:** The BCBA determines "medically necessary treatment dosage" -- the number of hours per week. This recommendation directly determines the units requested in the authorization.

**Clinivise opportunity:** Template-driven treatment plan generation. Auto-calculate supervision ratios (97155 must be at least 10% of 97153). Pre-populate from assessment data. Flag when plans don't meet payer-specific minimum requirements (e.g., parent training minimums).

---

### Phase 5: Treatment Authorization Submission

**Trigger:** Treatment plan is complete. This is the second authorization request (the first was for assessment).

**What happens:**
1. **Practice submits treatment authorization request** including:
   - Completed treatment plan
   - Assessment report with standardized tool scores
   - Diagnostic evaluation (if not already on file)
   - Letter of Medical Necessity (LMN) -- 1-2 page narrative justifying treatment
   - Physician referral/prescription
   - Consent forms
   - Proposed service schedule by setting (home, clinic, school, telehealth)
   - **Detailed service breakdown by CPT code:**
     - CPT code, requested units per authorization period, provider type, frequency

2. **Authorization request specifies:**
   - Authorization period (typically 6 months, some payers 3 months)
   - Units per CPT code per period
   - Rendering providers (must be credentialed with the payer)
   - Service locations

3. **Payer review process:**
   - Clinical reviewer (often a BCBA employed by the payer or utilization management company) evaluates
   - May request additional documentation
   - May approve full request, partially approve (reduced hours), or deny
   - Partial approvals are appeal-able

**Timeline:** 2-6 weeks from submission to approval, depending on payer and completeness of submission. Incomplete submissions are the #1 cause of delays.

**Common submission errors that cause delays:**
- Missing or expired diagnosis
- Treatment plan goals not measurable
- Hours not clinically justified
- Missing standardized assessment scores
- Provider not credentialed with payer
- Wrong form used for the payer

**Clinivise opportunity:** This is the highest-value automation target. AI-powered form pre-fill, payer-specific template selection, completeness validation before submission, LMN generation assistance, and tracking of submission status.

---

### Phase 6: Authorization Approval and Setup

**Trigger:** Payer approves (fully or partially) the treatment authorization.

**What happens:**
1. Practice receives authorization details:
   - **Authorization number** (critical -- must appear on every claim)
   - **Effective dates** (start and end)
   - **Approved units per CPT code** (may differ from requested)
   - **Approved providers** (rendering providers listed on the auth)
   - **Service location** restrictions
   - **Any special conditions or limitations**

2. **If partially approved (hours reduced):**
   - Practice can accept the reduced hours
   - OR request the payer issue a formal denial to trigger appeal rights
   - During appeal, services can continue at the **previously authorized level** under continuity of care protections
   - Appeals must be filed within 30-90 days (payer-dependent)

3. **Authorization is entered into the practice management system:**
   - Auth number, dates, CPT codes, approved units, provider assignments
   - Scheduling can now begin within the authorized parameters

**Key business rules:**
- Sessions cannot be scheduled before the auth start date
- Sessions cannot be scheduled after the auth end date
- Sessions cannot exceed approved units per CPT code
- Only approved rendering providers can deliver services
- Auth number must appear on every claim tied to this authorization

**Clinivise opportunity:** Auto-populate authorization details from payer notifications. Immediately unlock scheduling within authorized parameters. Calculate utilization pacing from day one. Alert if approved hours are significantly less than requested (triggering appeal workflow).

---

### Phase 7: Active Treatment Period (Utilization Tracking)

**Trigger:** Authorization is active and sessions are being delivered.

**What happens:**
1. **RBTs deliver direct treatment** (97153) according to the schedule
2. **BCBAs provide supervision** (97155) and protocol modification
3. **Parent/caregiver training** (97156/97157) is delivered
4. **Every session consumes authorized units:**
   - Units are tracked in 15-minute increments
   - CMS 8-minute rule applies: minimum 8 minutes to bill 1 unit
   - Used units are decremented from the authorization balance
   - Running utilization rate = used_units / approved_units

5. **Utilization monitoring is continuous:**
   - **Healthy utilization:** 80-100% of authorized hours delivered
   - **Under-utilization (<80%):** Flags risk of future auth reductions
   - **Over-utilization (>100%):** Hard stop required -- sessions beyond auth are unbillable

6. **Alert thresholds (industry best practice):**
   - **75% units used:** Re-authorization preparation should begin
   - **80% utilization rate:** Warning alert
   - **90-day, 60-day, 30-day, 10-day before expiration:** Escalating renewal alerts
   - **95% units used:** Critical alert -- scheduling should pause or slow
   - **100% units used:** Hard stop -- no more sessions until new auth

7. **Cancellations and makeups:**
   - Client cancellations reduce delivered hours (hurting utilization)
   - Makeup sessions may be allowed within the auth period
   - Some payers allow "overbilling at the frequency level" (e.g., extra sessions in one month) as long as the total auth period units are not exceeded

**Critical business rule:** Under-utilization has a compounding penalty. If a practice only delivers 60% of authorized hours, the payer will likely reduce the next authorization to match actual utilization. This creates a downward spiral where the client receives progressively fewer approved hours.

**Clinivise opportunity:** Real-time utilization dashboard per client, per CPT code. Pacing indicators ("On track" / "Behind" / "Ahead"). Smart scheduling suggestions to optimize utilization. Automated alerts at every threshold. Cancellation tracking with makeup session recommendations.

---

### Phase 8: Re-Authorization Preparation

**Trigger:** 60-90 days before current authorization expires (or 75% of units consumed, whichever comes first).

**What happens:**
1. **BCBA re-administers standardized assessments** (VB-MAPP, ABLLS, etc.)
2. **BCBA prepares progress report** including:
   - Client demographics and diagnosis
   - Current goal status with **data and graphs**:
     - Line graphs for skill acquisition (x-axis: sessions, y-axis: % independent)
     - Bar charts for behavior reduction
     - Pre/post standardized assessment score comparisons
   - **Utilization summary:** hours authorized vs. hours delivered
   - Service summary: what was provided, frequency, settings
   - **Barriers to progress** (cancellations, staffing changes, behavioral crises)
   - Updated treatment plan with new/modified goals
   - **Clinical rationale for continued services** at the same or modified intensity
   - **Discharge planning** progress

3. **Payer-specific report requirements:**
   - **Aetna:** Wants proof of functional improvements, real-life impact, validated reassessment every 6-12 months
   - **BCBS (Horizon):** Requires thorough documentation including graphs for most goals, submission 2-4 weeks before expiration
   - **UnitedHealthcare/Optum:** Pushes for solid metrics -- skill gains in percentages, drops in problem behaviors (not vague descriptions)
   - **Medicaid:** Requirements vary by state, often quarterly reports for intensive cases
   - **Kaiser:** Has their own specific progress report template

**Timeline:** BCBAs typically spend 20-30 minutes per re-authorization form (some report significantly more). With a caseload of 8-15 clients, this represents 3-8+ hours of administrative work every 6 months per BCBA, recurring perpetually.

**Clinivise opportunity:** AI-generated progress report drafts from session data. Auto-populated graphs from data collection. Payer-specific template selection. Side-by-side comparison of current vs. previous assessment scores. Automated calculation of utilization metrics for the report.

---

### Phase 9: Re-Authorization Submission and Review

**Trigger:** Progress report and updated treatment plan are complete.

**What happens:**
1. **Submission timing is critical:**
   - Submit 30-60 days before current auth expires (payer-dependent)
   - Humana Military allows submissions up to 60 days in advance
   - Submitting less than 30 days before expiration risks non-reimbursement during the gap
   - **Best practice:** Submit at the 60-day mark to allow time for payer questions

2. **Submission package includes:**
   - Updated treatment plan
   - Progress report with data visualization
   - Re-administered standardized assessment results (pre/post comparison)
   - Updated Letter of Medical Necessity
   - Authorization request form with requested units for next period

3. **Payer review outcomes:**
   - **Full approval:** Next auth period begins seamlessly
   - **Partial approval (reduced hours):** Payer approves fewer hours than requested
     - Often based on under-utilization in the current period
     - Appeal rights apply (30-90 day window)
     - Continuity of care: services continue at previous level during appeal
   - **Denial:** Services not authorized to continue
     - Must appeal within deadline
     - Internal review first, then external review (independent, binding)
   - **Request for additional information:** Delays the decision, may cause gap

**Timeline:** 2-6 weeks for payer review. During this time, the current authorization may expire.

**Clinivise opportunity:** Deadline tracking with escalating alerts. Submission status tracking (submitted, under review, approved, denied, additional info requested). Gap risk calculator. Auto-trigger scheduling holds if gap is likely.

---

### Phase 10: Authorization Gap Management

**Trigger:** Current authorization expires before re-authorization is approved.

**What happens (the worst-case scenario):**
1. **Services delivered after expiration are typically not reimbursed** until renewed
2. **Practice must decide:** Continue services at financial risk, or pause services
3. **If services pause:**
   - Client progress may regress
   - Behavioral crises may escalate without routine support
   - Family trust erodes
   - Under-utilization in next period (fewer sessions delivered = fewer approved next time)
4. **If services continue without auth:**
   - Practice bears the financial risk
   - Claims will be denied
   - Some payers grant retroactive approval; most do not
   - Practice may use "provisional codes" and flag claims as pending retro approval

**Gap management protocol:**
1. Immediately notify the family and the payer, documenting all communication
2. Log every administrative action to create a clear audit trail for appeals
3. Prepare tailored care plans for the gap period (RBT guidance, parent strategies)
4. Track gap duration for reporting and payer negotiations

**Prevention is the only real solution:** Start re-auth 60+ days early. Track submission status weekly. Escalate immediately if payer requests additional info.

**Clinivise opportunity:** This is where Clinivise can be transformative. Predictive gap risk scoring based on payer turnaround times, submission completeness, and historical patterns. Automated escalation workflows. Gap period tracking and financial impact calculation.

---

### Phase 11 (Ongoing): Authorization Modifications

**Trigger:** Clinical circumstances change during an active authorization period.

**Types of modifications:**
1. **Unit increase:** More hours needed (e.g., behavioral crisis, new target behaviors)
   - Requires clinical justification and updated treatment plan
   - Some payers allow mid-auth modification requests via portal
   - Others require calling the number on the member's ID card
2. **Date extension:** More time needed for assessment or treatment
   - Does NOT add additional units -- just extends the timeline
3. **Provider change:** New rendering provider needs to be added to the auth
   - Requires the new provider to be credentialed with the payer
4. **Service location change:** Adding or changing settings (home to clinic, adding telehealth)
   - May require additional clinical justification, especially for clinic-based or telehealth services
5. **Service reduction:** Stepping down hours (documented with clinical rationale)
   - Important: must document reduction reason to avoid future auth complications

**Clinivise opportunity:** Modification request tracking. Templates for different modification types. Status tracking for pending modifications. Impact analysis (how does this modification affect utilization pacing?).

---

### Lifecycle Visualization

```
Referral → Intake/Verification → Assessment Auth → Assessment → Treatment Plan
     ↓                                                              ↓
     ↓                                                    Treatment Auth Submission
     ↓                                                              ↓
     ↓                                                    Auth Approval/Setup
     ↓                                                              ↓
     ↓                                              Active Treatment (Utilization Tracking)
     ↓                                                    ↓                    ↓
     ↓                                              Modifications        Re-Auth Prep (60-90 days before expiry)
     ↓                                                                        ↓
     ↓                                                              Re-Auth Submission
     ↓                                                                        ↓
     ↓                                                              Approval / Gap / Denial
     ↓                                                                        ↓
     ↓                                                              ┌─── loops back to ───┐
     ↓                                                              ↓ Active Treatment     ↓
     └──────────────────────────────────────────────────────────────────────────────────────┘
```

**The cycle repeats every 3-6 months** for the duration of treatment, which for ABA therapy often spans years.

---

## 2. How Authorization Connects to Every PM Function

Authorization is not a standalone feature -- it is the **central nervous system** of an ABA practice. Every other PM function depends on authorization data.

### 2.1 Authorization --> Scheduling

| Connection Point | How It Works | What Goes Wrong Without It |
|-----------------|-------------|---------------------------|
| **Available units** | Scheduler checks remaining auth units before booking | Sessions booked without auth = unbillable work |
| **Date range** | Sessions can only be scheduled within auth effective dates | Sessions outside auth dates = denied claims |
| **Provider matching** | Only providers listed on the auth can be scheduled | Wrong provider = denied claim |
| **Location restrictions** | Auth may specify home, clinic, school, or telehealth | Wrong location = denied claim |
| **CPT code limits** | Each code has its own unit allocation | Scheduling 97155 when only 97153 is authorized = denied |
| **Pacing** | Weekly session count should match auth utilization targets | Over-scheduling one week, under-scheduling another = poor pacing |
| **Cancellation impact** | Every cancellation reduces utilization rate | Untracked cancellations lead to under-utilization penalties |

**Real workflow:** When scheduling, the system should show: "Client has 480 units of 97153 remaining (of 960 authorized). At current pace of 80 units/month, authorization will exhaust on [date]. Next re-auth due [date]."

### 2.2 Authorization --> Session Logging

| Connection Point | How It Works | What Goes Wrong Without It |
|-----------------|-------------|---------------------------|
| **Unit deduction** | Each logged session decrements auth balance | Manual tracking leads to over/under counts |
| **Real-time visibility** | RBTs need to know remaining units when logging | RBTs log sessions against exhausted auths = write-offs |
| **Time validation** | Session start/end must fall within auth dates | Post-expiration sessions rejected at billing |
| **Code validation** | Session CPT code must match authorized code | Wrong code billed = denial |
| **Provider validation** | Rendering provider must be on the auth | Non-credentialed provider = denial |
| **8-minute rule** | Units calculated per CMS rules from actual minutes | Wrong unit calculation = underbilling or audit risk |

**Real workflow:** When an RBT starts a session, they should see: "This session will use 8 units of 97153. After this session, 472 units remain (49% utilized, on pace for 95% by auth end)."

### 2.3 Authorization --> Billing/Claims

| Connection Point | How It Works | What Goes Wrong Without It |
|-----------------|-------------|---------------------------|
| **Auth number on claims** | Every claim must include the authorization number | Missing auth number = CO 197 denial |
| **Date range validation** | Claim dates must fall within auth effective dates | Out-of-range dates = denial |
| **Unit validation** | Billed units cannot exceed authorized units | Over-billed units = denial + audit risk |
| **CPT code matching** | Billed code must match authorized code exactly | Code mismatch = denial |
| **Provider matching** | Rendering provider on claim must be on the auth | Provider mismatch = CO 15 denial |
| **Claim scrubbing** | Pre-submission validation catches auth issues | Unvalidated claims = 20-30% denial rate |

**Real workflow:** At claim generation, the system should auto-populate: auth number, validate date range, confirm units do not exceed remaining auth balance, verify provider credentials, and flag any discrepancies before submission.

### 2.4 Authorization --> Client Management

| Connection Point | How It Works |
|-----------------|-------------|
| **Client status** | Auth status drives client status (Active, Pending Auth, Auth Expired, Discharged) |
| **Intake workflow** | New client cannot begin services until auth is approved |
| **Insurance changes** | New insurance = new auth process from scratch |
| **Client dashboard** | Auth utilization is a primary KPI on the client profile |
| **Family communication** | Auth status changes trigger family notifications |

### 2.5 Authorization --> Reporting

| Report | What It Shows | Who Needs It |
|--------|-------------|-------------|
| **Auth utilization by client** | Used vs. approved units, pacing, projected exhaustion | BCBA, Admin |
| **Expiring authorizations** | Auths expiring in 30/60/90 days | Admin, Billing |
| **Under-utilized authorizations** | Clients below target utilization | BCBA, Practice Owner |
| **Over-utilized authorizations** | Clients approaching or exceeding limits | Billing, Admin |
| **Auth gap report** | Clients with lapsed or pending auths | Admin, Practice Owner |
| **Denial analysis** | Auth-related denials by reason code | Billing, Practice Owner |
| **Revenue at risk** | Dollar value of sessions at risk due to auth issues | Practice Owner |
| **Payer performance** | Auth turnaround times, approval rates by payer | Practice Owner |

---

## 3. Pain Points and Revenue Leakage in the Authorization Lifecycle

### 3.1 Where Practices Lose Money

| Pain Point | Revenue Impact | Frequency |
|-----------|---------------|-----------|
| **Expired authorizations** | Sessions delivered post-expiration are write-offs | Most common -- "sneakiest revenue killer" |
| **Over-utilized authorizations** | Sessions beyond approved units are unrecoverable | High in practices without real-time tracking |
| **Under-utilized authorizations** | Lost revenue opportunity + future auth reductions | Pervasive -- compounds over time |
| **Authorization gaps** | Pause in services = lost billable hours | Common during re-auth transitions |
| **Denied claims (auth-related)** | Rework cost + delayed payment + possible write-off | 20-30% of claims in poorly managed practices |
| **Reduced re-authorizations** | Payers cut hours based on under-utilization | Systemic -- affects practices for years |
| **Billing without auth number** | CO 197 denial, cannot be resubmitted easily | Preventable but common with manual processes |
| **Wrong provider on claim** | Denial if rendering provider not on auth | Common with staff turnover |

### 3.2 The Under-Utilization Death Spiral

This is the most insidious auth-related revenue problem in ABA:

1. Practice is authorized for 40 hours/week of 97153
2. Due to cancellations, staffing gaps, or scheduling inefficiency, only 25 hours/week are delivered (62.5% utilization)
3. At re-authorization, payer sees under-utilization and reduces next auth to 25 hours/week
4. Practice can now only bill for 25 hours maximum, even if clinical need is 40
5. Client receives less treatment, progress slows
6. Slower progress may lead to further payer scrutiny and additional reductions
7. Practice revenue from this client drops by 37.5%

**This is a permanent revenue reduction that compounds.** The only prevention is maintaining 80%+ utilization throughout the auth period.

### 3.3 BCBA Administrative Burden

| Task | Time Per Instance | Frequency | Annual Burden (15 clients) |
|------|------------------|-----------|---------------------------|
| Initial auth request | 30-60 min | Once per client | 7.5-15 hours |
| Treatment plan development | 4-8 hours | Every 6 months | 120-240 hours |
| Progress report for re-auth | 20-30 min per form + 2-4 hours for report | Every 6 months | 60-120 hours |
| Re-auth submission | 30-60 min | Every 6 months | 15-30 hours |
| Auth modification requests | 15-30 min | As needed (2-3/year) | 5-10 hours |
| Appeals for denials/reductions | 1-3 hours | As needed | 5-15 hours |
| **Total admin burden** | | | **~210-430 hours/year** |

BCBAs billing at $80-120/hour for clinical services are spending 25-50% of their potential billable time on authorization paperwork. At $100/hour, the opportunity cost is $21,000-$43,000 per BCBA per year.

### 3.4 Claim Denial Statistics

- ABA practices see denial rates of **20-30%** when billing is not specialty-managed
- Industry benchmark: denial rates should be below 10-12%
- More than **60% of claim denials are preventable** (documentation-related)
- Manual claim status inquiries average **24 minutes and cost ~$12 per inquiry**
- Behavioral health providers average **45-60 day AR timelines** vs. 30-day benchmark
- One provider had **$250K+ trapped in claims older than 90 days**

### 3.5 Authorization-Specific Denial Codes

| Denial Code | Meaning | Root Cause | Prevention |
|-------------|---------|------------|------------|
| CO 197 | Pre-certification/authorization absent | Auth not requested or expired | Real-time auth expiration tracking |
| CO 15 | Invalid authorization number | Auth number wrong on claim | Auto-populate from auth record |
| N/A | Units exceed authorized | Billed more than approved | Real-time unit balance tracking |
| N/A | Service outside authorized date range | Session date outside auth period | Schedule validation against auth dates |
| N/A | Provider not listed on authorization | Wrong rendering provider | Provider-auth matching in scheduling |
| N/A | CPT code mismatch | Wrong code billed | Code validation at session logging |

---

## 4. Payer-Specific Authorization Lifecycle Differences

### 4.1 The Two-Stage Authorization Model

Nearly all payers use a **two-stage authorization** process, but the specifics differ significantly:

**Stage 1: Assessment Authorization**
- Purpose: Authorize the BCBA to conduct the initial evaluation (97151)
- Typical units: 8-32 units (2-8 hours)
- Some payers/states exempt assessment from prior auth entirely

**Stage 2: Treatment Authorization**
- Purpose: Authorize ongoing ABA treatment based on the assessment and treatment plan
- Typical duration: 3-6 months
- Typical units: Varies enormously by payer, diagnosis severity, and age

### 4.2 Payer-Specific Requirements

#### Medicaid (State-by-State Variation)

| Aspect | Typical Medicaid | Notes |
|--------|-----------------|-------|
| Auth period | 90-180 days | Some states require quarterly re-auth for intensive cases |
| Report frequency | Every 90 days (some states) to 6 months | Medicaid EPSDT follows state timelines |
| Assessment auth | Often exempt from prior auth | Varies by state |
| Treatment auth max | 180 days in many states (e.g., Louisiana) | State-specific caps |
| Unit limits | State-dependent, often generous | EPSDT mandate requires medically necessary coverage |
| Unique requirements | State-specific forms, per-code unit breakdowns | Virginia now requires exact units per CPT code (no bundled requests) |
| Audit risk | **Very high** -- OIG focus area | 100% of sampled claims in Indiana contained errors |

**Key state differences:**
- **Virginia:** Service auth requests must specify exact units per CPT code. Assessment codes (97151, 97152, 0362T) do NOT require service authorization.
- **Louisiana:** Two-stage auth required. Treatment auths cannot exceed 180 days.
- **Texas:** Requires co-morbid details in auth requests.
- **California:** Emphasizes interdisciplinary evaluations.
- **Nevada:** Has its own Provider Type 85 billing guide with specific ABA rules.

#### Blue Cross Blue Shield (Varies by State)

| Aspect | BCBS Typical | Notes |
|--------|-------------|-------|
| Auth period | 6 months | Plan-specific variation |
| Submission deadline | 2-4 weeks before expiration (Horizon BCBS) | Strict deadline enforcement |
| Report requirements | Thorough documentation including graphs for most goals | Horizon BCBS specifically requires visual data |
| Clinical criteria | Published Supplemental Clinical Criteria documents | Updated regularly (Jan 2026 version available) |
| Special requirements | Clinical Service Request Form (BCBS TX uses a specific 5-page form) | Payer-specific forms |

#### Aetna

| Aspect | Aetna | Notes |
|--------|-------|-------|
| Auth period | 6-12 months | Longer periods than most |
| Re-auth requirements | Clear signs of progress, real-life improvements, justification for continued sessions | Emphasizes functional outcomes |
| Assessment tool requirement | Validated reassessment every 6-12 months | Must demonstrate response to intervention |
| Documentation standard | Medical necessity guide published (publicly available PDF) | Specific form requirements |
| Submission method | Outpatient Behavioral Health ABA Treatment Request form | Precertification process |

#### UnitedHealthcare / Optum

| Aspect | UHC/Optum | Notes |
|--------|-----------|-------|
| Auth management | Via Optum behavioral health | Separate portal from medical |
| Data requirements | Solid metrics required -- percentage-based skill gains, quantified behavior drops | Rejects vague descriptions |
| Supervision cap | Many plans cap 97155 at 20% of 97153 units | Critical to track |
| Re-auth standards | Published reimbursement policies with specific frequency and unit rules | Different from other BCBS-type payers |

#### TRICARE / Humana Military

| Aspect | TRICARE | Notes |
|--------|---------|-------|
| Initial requirements | Referral from PCM/ASD-diagnosing provider, DSM-5 diagnosis | Military-specific referral pathway |
| Assessment auth | Authorized upon receipt of all necessary documents | Relatively streamlined |
| Treatment auth | 6-month periods | Standard |
| Re-auth deadline | Submit up to 60 days in advance | Less than 30 days = risk of non-reimbursement |
| Required tools | PSI (short form), SIPA, PDDBI (parent and teacher form) | Specific assessment tools required |
| Supervision requirement | Authorized ABA supervisor or ACSP must request re-auth | Specific provider requirement |
| Parent training | Minimum 6 sessions per 6-month period | Tracked separately |

### 4.3 Coordination of Benefits (Dual Coverage)

When a client has both commercial insurance and Medicaid:

1. **Medicaid is ALWAYS the payer of last resort** -- commercial insurance is billed first
2. **Both payers may require separate authorizations** -- 46% of BCBA respondents reported needing auth from both primary and secondary payers
3. **Billing workflow:** Submit to primary first --> wait for EOB --> submit to secondary with primary EOB attached
4. **Secondary payment:** Typically pays the lesser of their allowed amount minus primary payment, or the patient responsibility from primary
5. **Authorization tracking must handle both payers simultaneously** for the same client

**Clinivise implication:** The authorization data model must support multiple active authorizations per client (one per payer), with clear primary/secondary designation and claim routing rules.

### 4.4 Single Case Agreements (SCAs)

When a practice is out-of-network with a payer:

1. SCA is a one-time contract for a specific patient at in-network rates
2. **Eligibility:** No adequate in-network providers available (waitlists, lack of expertise, geography)
3. **Best practice:** Request SCA simultaneously with the initial assessment authorization
4. **Documentation:** Clinical justification, provider credentials, proposed rates, CPT codes, proof of inadequate in-network options
5. **Tracking:** SCA terms may differ from standard in-network auth terms

---

## 5. Authorization as the Platform Adoption Wedge

### 5.1 Why Practices Switch Software

Based on research across industry sources, the top reasons ABA practices evaluate new software:

| Priority | Reason | Authorization Connection |
|---------|--------|------------------------|
| 1 | **Billing/revenue cycle issues** | Auth errors are #1 cause of preventable denials |
| 2 | **Operational fragmentation** | Auth data living in spreadsheets, separate from scheduling and billing |
| 3 | **Authorization management failures** | Missed renewals, expired auths, unbillable sessions |
| 4 | **Cost of current platform** | CentralReach add-on pricing; enterprise pricing for small practices |
| 5 | **Poor user experience** | Complex UIs that require extensive training |
| 6 | **Data collection limitations** | Clinical data not connected to auth/billing data |

**Key finding:** Authorization management is not just a feature -- it is the **root cause** of billing problems, scheduling errors, and revenue leakage. Practices that fix authorization management fix a cascade of downstream problems.

### 5.2 What Makes Authorization Management a Switching Trigger

From user reviews and industry analysis:

- "If you're tracking units outside your EHR, you're one oversight away from a billing problem that could've been prevented"
- "In 2026, the best platforms treat authorization utilization as a first-class workflow -- not a spreadsheet on the side"
- "ABA practice management software can materially reduce errors, because the authorization stops living in email threads and starts governing scheduling, documentation, and billing rules"
- "Missed authorizations or overbooked hours directly lead to denied claims and lost revenue"

### 5.3 Competitor Weaknesses in Authorization

| Competitor | Authorization Weakness | Clinivise Opportunity |
|-----------|----------------------|----------------------|
| **CentralReach** | Auth lives in Billing module, not client profile. Expensive add-ons. Complex UI. | Auth as first-class entity on client profile. Inclusive pricing. |
| **AlohaABA** | Clean UI but authorization tracking is basic. Limited automation. | Deep auth intelligence with AI automation. |
| **Rethink/RethinkBH** | Good tracking but multi-disciplinary focus dilutes ABA-specific depth. | ABA-specific auth rules engine. |
| **Theralytics** | Basic auth tracking. No AI features. | AI-powered auth lifecycle management. |
| **Spreadsheet users** | Manual tracking, error-prone, no integration with scheduling/billing. | Integrated platform that replaces spreadsheets entirely. |

### 5.4 The Free PM + Authorization Hook

Clinivise's business model (free PM, monetized via billing %) creates a unique adoption path:

1. **Entry:** Free practice management with **best-in-class authorization tracking**
2. **Stickiness:** Once auth data is in Clinivise, switching costs are enormous (all auth histories, payer patterns, utilization trends)
3. **Upgrade:** When practices add billing through Clinivise, auth data flows seamlessly into claims
4. **Lock-in:** Auth intelligence improves over time (AI learns payer patterns, auto-generates reports, predicts outcomes)

Authorization is the ideal adoption wedge because:
- It is the highest-pain function in ABA practice management
- It connects to every other function (scheduling, billing, client management, reporting)
- It accumulates institutional knowledge over time (payer patterns, utilization history)
- It saves 3-5+ hours per week in administrative work for small practices (replacing manual spreadsheet tracking)
- Integrated practice management software typically saves about 3 to 5 hours per week by eliminating double-entry, manual authorization checking, and billing data cleanup

---

## 6. Data Model Implications for Clinivise

Based on this lifecycle research, the authorization data model must capture:

### 6.1 Core Authorization Fields

```
authorization:
  id                    # nanoid
  organization_id       # multi-tenant isolation
  client_id             # FK to client
  payer_id              # FK to insurance/payer
  authorization_number  # from payer (may be null until approved)
  auth_type             # 'assessment' | 'treatment' | 'modification' | 'sca'
  status                # 'pending' | 'submitted' | 'approved' | 'partially_approved' | 'denied' | 'expired' | 'cancelled'
  request_date          # when submitted to payer
  effective_start_date  # auth period start
  effective_end_date    # auth period end
  payer_response_date   # when payer responded
  notes                 # free text
  is_primary            # boolean (for COB scenarios)
  previous_auth_id      # FK to previous auth (for re-auth chain)
  created_at
  updated_at
  deleted_at            # soft delete
```

### 6.2 Authorization Services (Per-CPT Code Tracking)

```
authorization_service:
  id                    # nanoid
  organization_id       # multi-tenant isolation
  authorization_id      # FK to authorization
  cpt_code              # text: '97151', '97153', '97155', '97156', '97157'
  approved_units        # numeric: total approved for auth period
  used_units            # numeric: consumed (ATOMIC INCREMENT ONLY)
  frequency_type        # 'total' | 'monthly' | 'quarterly' | 'weekly'
  frequency_units       # if frequency-based, units per frequency period
  provider_type         # 'bcba' | 'rbt' | 'bcaba'
  service_location      # 'home' | 'clinic' | 'school' | 'telehealth'
  notes
  created_at
  updated_at
```

### 6.3 Authorization Events (Audit Trail)

```
authorization_event:
  id                    # nanoid
  organization_id
  authorization_id      # FK
  event_type            # 'created' | 'submitted' | 'approved' | 'denied' | 'modified' | 'expired' | 'gap_started' | 'gap_ended' | 'appeal_filed' | 'units_added' | 'date_extended'
  event_date
  performed_by          # user ID
  details               # JSON: old/new values, payer response, etc.
  created_at
```

### 6.4 Authorization Alerts

```
authorization_alert:
  id
  organization_id
  authorization_id
  alert_type            # 'expiring_90d' | 'expiring_60d' | 'expiring_30d' | 'expiring_10d' | 'units_75pct' | 'units_90pct' | 'units_100pct' | 'under_utilized' | 'gap_risk' | 'reauth_due'
  severity              # 'info' | 'warning' | 'critical'
  triggered_at
  acknowledged_at       # null until user acknowledges
  acknowledged_by
  resolved_at           # null until resolved
```

### 6.5 Re-Authorization Tracking

```
reauthorization_task:
  id
  organization_id
  current_auth_id       # FK to expiring auth
  new_auth_id           # FK to new auth (once created)
  status                # 'not_started' | 'assessment_scheduled' | 'assessment_complete' | 'report_drafting' | 'report_complete' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'appealed'
  due_date              # when re-auth submission should happen
  assigned_to           # BCBA responsible
  assessment_date       # when re-assessment is scheduled/completed
  submission_date       # when submitted to payer
  notes
  created_at
  updated_at
```

---

## 7. Staff Roles in the Authorization Lifecycle

### 7.1 Role-Based Responsibilities

| Phase | Intake Coordinator | BCBA | Billing Specialist | Practice Owner/Admin |
|-------|-------------------|------|-------------------|---------------------|
| Referral/Verification | **Primary:** Collect docs, verify insurance | Review referral | Confirm benefits | Monitor pipeline |
| Assessment Auth | Submit request | Review if needed | Track submission | -- |
| Assessment | Schedule BCBA | **Primary:** Conduct assessment | -- | -- |
| Treatment Plan | -- | **Primary:** Write treatment plan | -- | Review if needed |
| Treatment Auth | Submit documents | **Primary:** Clinical content, LMN | Track submission, follow up | -- |
| Auth Approval/Setup | Enter auth details into system | Verify accuracy | Map to billing rules | -- |
| Active Treatment | Schedule sessions within auth | Supervise, log 97155 | Monitor utilization | Review dashboards |
| Re-Auth Prep | Schedule re-assessment | **Primary:** Re-assess, write report | Track timeline | Review utilization |
| Re-Auth Submission | Submit package | Review before submission | **Primary:** Track and follow up | Monitor gaps |
| Gap Management | Notify families | Develop gap care plans | Hold/flag claims | Decision: continue or pause |
| Modifications | Submit modification requests | Clinical justification | Track status | Approve financial decisions |

### 7.2 Permission Requirements in Clinivise

| Role | Auth Permissions |
|------|-----------------|
| **Admin** | Full CRUD on all auths. Override auth limits. View all reports. |
| **BCBA** | View/edit auths for assigned clients. Cannot override limits. Create re-auth tasks. |
| **RBT** | View-only auth status for assigned clients (remaining units, expiration date). Cannot edit. |
| **Billing** | View/edit auth numbers, dates, units. Track submissions. Cannot modify clinical content. |

---

## 8. Strategic Recommendations for Clinivise

### 8.1 Authorization as the Core Product Differentiator

Based on this research, authorization lifecycle management should be Clinivise's **primary differentiator** for three reasons:

1. **It is the highest-pain problem:** BCBAs spend 25-50% of potential billable time on auth paperwork. Practices lose significant revenue to auth-related denials.

2. **It connects everything:** Auth governs scheduling, billing, session logging, client status, and reporting. Owning the auth lifecycle means owning the practice workflow.

3. **No competitor does it well for small practices:** CentralReach is expensive and complex. AlohaABA is clean but shallow. Spreadsheets are the real competitor for small practices.

### 8.2 Phase 1 Authorization Features (MVP)

Must-have features for launch:

1. **Authorization CRUD** with full lifecycle status tracking
2. **Per-CPT-code unit tracking** with atomic increments
3. **Real-time utilization dashboard** per client, per code
4. **Expiration alerts** at 90/60/30/10/0 days
5. **Utilization alerts** at 75%/90%/95%/100%
6. **Under-utilization warnings** (<50% used with >50% of period elapsed)
7. **Scheduling integration** that prevents booking beyond auth limits
8. **Session logging integration** that validates against active auth
9. **Auth number auto-population** on generated claims
10. **Re-authorization task tracking** with due dates and status

### 8.3 Phase 2 Authorization Features (AI-Enhanced)

Differentiation features:

1. **AI-powered auth letter parsing** (upload approval letter, auto-extract fields)
2. **AI-generated progress reports** from session data
3. **AI-drafted Letters of Medical Necessity**
4. **Payer-specific template engine** (auto-select correct form/format per payer)
5. **Predictive gap risk scoring** based on payer turnaround times
6. **Utilization pacing recommendations** ("Schedule 3 more sessions this week to stay on pace")
7. **Historical payer pattern analysis** (avg. approval time, common reduction triggers)
8. **Automated re-auth timeline generation** based on payer rules
9. **Denial pattern analysis** with suggested corrections
10. **COB/dual insurance auth management**

### 8.4 Key Metrics to Track

| Metric | Target | Why It Matters |
|--------|--------|---------------|
| Auth utilization rate | 85-100% | Revenue maximization, prevents future reductions |
| Auth gap days | 0 | Every gap day = lost revenue |
| Re-auth submission lead time | 60+ days | Prevents gaps |
| Auth-related denial rate | <5% | Industry average is 20-30% without proper management |
| BCBA admin time saved | 50%+ reduction | Direct ROI measurement for practices |
| Time to first session | <21 days from referral | Competitive advantage for client acquisition |

---

## Sources

### Authorization Lifecycle & Process
- [ABA Authorization Process - Humana Military](https://www.humanamilitary.com/content/humana-military-com/us/en/provider/managedcare/acoe/authorizationprocess.html)
- [3 Phases of Insurance Authorization - Cultivate BHE](https://cultivatebhe.com/3-phases-of-the-insurance-authorization-process/)
- [ABA Authorization Management - Motivity](https://www.motivity.net/blog/aba-authorization-management)
- [Guide to ABA Insurance Authorization - Cube Therapy Billing](https://www.cubetherapybilling.com/guidetoabainsuranceauthorization)
- [Authorizations for ABA Services - Taylor Prime](https://taylorprimeemcee.com/authorizations-for-aba-services-what-providers-need-to-know)
- [Strengthening ABA Practices - S Cubed](https://scubed.io/blog/strengthening-aba-practices-with-effective-authorization-management-strategies)

### Assessment & CPT Codes
- [CPT Code 97151 Guide - Brellium](https://brellium.com/resources/articles/how-to-cpt-code-97151-for-aba-therapy)
- [CPT Code 97151 Guide 2026 - MedCloudMD](https://www.medcloudmd.com/post/cpt-code-97151-guide-2026)
- [CPT Code 97153 Guide 2026 - MedCloudMD](https://www.medcloudmd.com/post/cpt-code-97153-aba-billing-2026)
- [ABA Billing Codes - Passage Health](https://www.passagehealth.com/blog/aba-billing-codes)
- [ABA Billing & CPT Codes Guide - Instafill](https://resources.instafill.ai/docs/aba/aba-billing-cpt-codes-guide)
- [Billing Codes - ABA Coding Coalition](https://abacodes.org/codes/)

### Re-Authorization & Progress Reports
- [ABA Progress Reports for Reauthorization - Praxis Notes](https://www.praxisnotes.com/resources/guide-aba-progress-reports-reauthorization)
- [ABA Billing Playbook 2025-2026 - Cube Therapy Billing](https://www.cubetherapybilling.com/aba-billing-playbook)
- [ABA Prior Authorization Checklist - MBW RCM](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-prior-authorization-checklist)
- [BCBA Initial Authorization Checklist - Praxis Notes](https://www.praxisnotes.com/resources/bcba-prior-authorization-checklist)

### Authorization Gaps & Management
- [BCBA Authorization Gap Guide - Praxis Notes](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide)
- [ABA Authorization Management - ABA Matrix](https://www.abamatrix.com/aba-authorization-management/)
- [Prior Authorization Delays - AnnexMed](https://annexmed.com/aba-prior-authorization-delays-revenue-stability)
- [Enhance ABA Practices - CentralReach](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)

### Payer-Specific Requirements
- [BCBS ABA Supplemental Clinical Criteria (Jan 2026)](https://www.bcbsm.com/amslibs/content/dam/public/important-information/documents/bh-aba-supplemental-clinical-criteria-jan-2026.pdf)
- [Aetna ABA Medical Necessity Guide](https://www.aetna.com/content/dam/aetna/pdfs/health-care-professionals/applied-behavioral-analysis.pdf)
- [Aetna Outpatient BH ABA Treatment Request](https://www.aetna.com/document-library/pharmacy-insurance/healthcare-professional/documents/outpatient-behavioral-health-BH-ABA-assessment-precert.pdf)
- [Virginia Medicaid ABA Policy Update (Oct 2025)](https://vamedicaid.dmas.virginia.gov/bulletin/service-authorization-update-applied-behavior-analysis-aba-effective-october-15-2025)
- [Louisiana ABA Medicaid Manual](https://www.lamedicaid.com/provweb1/providermanuals/manuals/aba/aba.pdf)
- [Carelon ABA Treatment Report Guidelines](https://www.carelonbehavioralhealth.com/content/dam/digital/carelon/cbh-assets/documents/global/clinical/aba-treatment-report-guidelines.pdf)

### Billing, Denials & Revenue
- [Prior Authorization Management for ABA - Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-a-priorauthorization)
- [Common Billing Errors - ABA Building Blocks](https://ababuildingblocks.com/common-billing-errors-and-how-to-avoid-them/)
- [ABA Billing Documentation Guide - TherapyPM](https://therapypms.com/aba-billing-documentation-clean-aba-claims/)
- [7 Common Billing Challenges - S Cubed](https://scubed.io/blog/7-common-clinical-billing-challenges-in-the-aba-industry-and-how-to-fix-them)
- [ABA Billing and Authorization Automation - TherapyLake](https://blog.therapylake.com/aba-billing-authorization-automation/)
- [Mitigate Risks of Over-Utilized Authorization - CentralReach](https://centralreach.com/blog/mitigating-risks-associated-with-over-utilized-authorizations-in-aba-practices/)

### Scheduling & Utilization
- [Improving Scheduling & Authorizations - Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [Scheduling Strategies for ABA - Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)
- [Streamlining ABA Therapy Scheduling - S Cubed](https://scubed.io/blog/aba-therapy-scheduling-billing-software-authorizations)
- [Scheduling Tips to Maximize Utilization - ABA Building Blocks](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/)

### Software & Adoption
- [Best ABA Practice Management Software 2026 - Passage Health](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [ABA Practice Management Guide - Motivity](https://www.motivity.net/blog/best-aba-practice-management-software)
- [Ultimate 2026 Guide - AlohaABA](https://alohaaba.com/blogs/the-ultimate-guide-to-aba-practice-management-software-streamline-your-therapy-business)
- [ABA Administrative Tools 2026 - TherapyLake](https://blog.therapylake.com/aba-administrative-tools-that-actually-make-a-difference/)
- [CentralReach Reviews - Capterra](https://www.capterra.com/p/140743/CentralReach/reviews/)

### AI & Automation
- [AI Strengthens ABA Treatment Plans - Neuromnia](https://www.neuromnia.com/blog-posts/ai-enhanced-aba-treatment-plans-medical-necessity.html)
- [AI Next-Gen Prior Authorization - McKinsey](https://www.mckinsey.com/industries/healthcare/our-insights/ai-ushers-in-next-gen-prior-authorization-in-healthcare)
- [Transforming Prior Authorizations with AI - Availity](https://www.availity.com/blog/transforming-prior-authorizations-with-ai-powered-automation/)
- [ABA Insurance Authorization Forms Guide - Instafill](https://resources.instafill.ai/docs/aba/aba-insurance-authorization-forms-guide)

### Coordination of Benefits & Dual Coverage
- [How to Bill Secondary Insurance for ABA - BellMedEx](https://bellmedex.com/how-to-bill-secondary-insurance-for-aba-services/)
- [Coordination of Benefits in ABA - Wayfinder RCM](https://www.wayfinderrcm.com/blog/how-coordination-of-benefits-impacts-billing-for-aba-services)
- [Coordination of Benefits in ABA - Operant Billing](https://operantbilling.com/coordination-of-benefits-in-aba-therapy-what-is-it-why-its-important/)
- [Single Case Agreement 101 - Your Missing Piece](https://yourmissingpiece.com/resources/single-case-agreement-101/)

### KPIs & Metrics
- [4 Key Metrics Every ABA Practice - Raven Health](https://ravenhealth.com/blog/aba-practice-metrics-to-track/)
- [Top KPIs in ABA Practice Management - Motivity](https://www.motivity.net/blog/aba-practice-management-kpi)
- [ABA Denial Management - Passage Health](https://www.passagehealth.com/blog/aba-denial-management)

### Compliance & Audits
- [ABA Documentation Audits - Revenue Cycle Blog](https://revenuecycleblog.com/documentation/aba-documentation-audit-billing-compliance-guide)
- [Heightened Scrutiny of Medicaid ABA - Benesch Law](https://www.beneschlaw.com/insight/heightened-scrutiny-of-medicaid-funded-aba-services-key-takeaways-for-providers/)
- [Insurance Denials and Appeals - ABA Therapy](https://www.intellistarsaba.com/blog/how-to-appeal-an-aba-therapy-insurance-denial)
- [Authorization and Appeals Playbook - Autism Law Summit](https://autismlawsummit.com/media/0rhkfsj5/2022-10-12-autismlawsummit-theplaybook.pdf)

### Intake & Onboarding
- [ABA Intake Process - Passage Health](https://www.passagehealth.com/blog/aba-intake-process)
- [ABA Therapy Process: Referral to First Session - TotalCare ABA](https://www.totalcareaba.com/autism/aba-therapy-process-referral-to-first-session)
- [ABA Intake Management - TherapyLake](https://blog.therapylake.com/aba-intake-management-solutions/)
