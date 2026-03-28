# ABA Scheduling: Clinical & Business Domain Research

> **Purpose:** Understand the clinical workflows, regulatory constraints, payer rules, and practitioner pain points that must inform Clinivise's scheduling feature design. This is domain research, not software design.
>
> **Last updated:** 2026-03-27
>
> **Research method:** BACB official documentation, ABA Coding Coalition, ABA practitioner blogs, industry publications, competitor feature analysis, payer policy documents, billing specialist resources.

---

## Table of Contents

1. [Scheduling Workflows by Role](#1-scheduling-workflows-by-role)
2. [ABA-Specific Scheduling Constraints](#2-aba-specific-scheduling-constraints)
3. [Common Scheduling Patterns](#3-common-scheduling-patterns)
4. [Scheduling Pain Points](#4-scheduling-pain-points)
5. [Payer-Specific Scheduling Rules](#5-payer-specific-scheduling-rules)
6. [Key Metrics & Benchmarks](#6-key-metrics--benchmarks)
7. [Implications for Clinivise](#7-implications-for-clinivise)

---

## 1. Scheduling Workflows by Role

### 1A. Scheduler / Admin

The scheduler is the operational backbone. In most small ABA practices (1-50 staff), this role is often performed by the practice owner, office manager, or a dedicated scheduling coordinator. In very small practices, the BCBA does it themselves.

**Weekly workflow:**

1. **Build recurring templates** -- Most clients have fixed weekly schedules (e.g., Mon/Wed/Fri 9am-12pm). The scheduler creates a recurring weekly template at intake and adjusts it rarely. The template becomes the "ground truth" that individual weeks deviate from.

2. **Match therapists to clients** -- Consider: geographic proximity (minimize travel between home-based clients), clinician-client fit (some RBTs work better with certain clients), credential requirements (only BCBAs/BCaBAs can bill 97155/97156/97158), availability blocks, and language/specialization needs.

3. **Check authorizations before scheduling** -- Before confirming any session, verify: the client has an active authorization, the CPT code is authorized, sufficient units remain for the planned session, and the session falls within the auth date range. This is the #1 source of claim denials when missed.

4. **Handle weekly exceptions** -- Process cancellations (client sick, family vacation, RBT called out), find replacement RBTs for staff absences, schedule makeup sessions to recover lost hours, accommodate one-off schedule changes (doctor appointments, school events).

5. **Manage waitlist intake** -- When a new client is authorized, find therapist availability that matches the prescribed hours, geographic area, and family schedule preferences. Average waitlist time nationally: 5.7 months (75% of caregivers report waiting).

6. **Monitor authorization pacing** -- Track whether scheduled hours will consume authorized units evenly across the authorization period. Flag clients where scheduling patterns will lead to under-utilization (wasted approved hours) or over-utilization (running out early).

**Key decision points:**
- Which RBT to assign when the primary is out?
- Can a makeup session fit this week or does it need to be next week?
- Is this client's auth running low enough to reduce scheduled hours?
- Which new waitlist client can fill a departing client's time slot?

### 1B. BCBA (Board Certified Behavior Analyst)

BCBAs have the most complex scheduling because they serve multiple functions: direct clinical work, supervision of RBTs, treatment plan development, parent training, and administrative tasks.

**Daily workflow:**

- **Morning check (before 9am):** Review today's schedule -- which clients, which RBTs to observe, any cancellations to fill. Check supervision compliance -- am I meeting the 5% minimum for each RBT this month? Review unsigned notes from previous days.

- **During sessions (9am-4pm):**
  - Conduct 2-4 direct sessions (97155 -- protocol modification, 97156 -- parent training, 97157/97158 -- group)
  - Observe 1-2 RBT sessions for BACB supervision credit (must overlap with RBT session time)
  - Log each session: client, CPT code, start/end time, goals addressed, modifications made
  - Between sessions: 30-minute blocks for treatment plan updates, parent communication

- **End of day (4pm-6pm):** Complete session notes, review RBT notes for co-signature, update treatment plans, prepare for tomorrow.

**Supervision scheduling specifically:**
- BCBAs must strategically schedule supervision visits to overlap with existing RBT sessions
- They need to visit each RBT at least twice per month (face-to-face)
- At least one visit per month must include direct observation of the RBT with a client
- Must accumulate at least 5% of each RBT's monthly service hours in supervision
- Supervision visits must be distributed -- cannot be all in one day

**Typical BCBA caseload:** 8-15 clients, with 23-30 billable hours per week target. Non-billable tasks (documentation, treatment planning, team meetings) consume an additional 5-15 hours per week.

### 1C. RBT (Registered Behavior Technician)

RBTs have the simplest but most time-sensitive scheduling needs. They deliver the bulk of direct therapy hours (97153).

**Daily workflow:**

- **View today's schedule** -- Typically 3-5 clients per day, 2-4 hours each. Need to see: client name, location (home/clinic/school), start/end time, and any special notes.
- **Travel between sessions** -- Home-based RBTs may drive 15-45 minutes between clients. Travel buffers must be built into the schedule.
- **Log sessions immediately** -- Session notes should be completed within 24 hours, ideally same day. Mobile-first for in-home and school-based settings.
- **Handle day-of changes** -- Client cancels morning session; can the RBT pick up a waitlist client or extend another session? RBTs need to see cancellations and available fill-in slots in real time.

**RBT scheduling constraints:**
- Cannot work without an active supervisor (BCBA/BCaBA) assigned
- Maximum billable hours per day limited by MUE (32 units = 8 hours for 97153)
- Need adequate breaks (state labor laws apply)
- Travel time between home-based clients is non-billable but must be scheduled
- Some clients require specific RBTs for consistency (clinical preference, not a billing requirement)

**Typical RBT schedule:**
- Full-time: 30-35 billable hours/week across 4-6 clients
- Part-time: 15-20 billable hours/week, often after-school only (3pm-7pm)

### 1D. Practice Owner / Clinical Director

Practice owners need scheduling visibility for business health, not individual session management.

**What they monitor:**

- **Staff utilization rate** -- Billable hours / total available hours. Target: 75-85%. Below 65% signals over-staffing or scheduling gaps. Above 90% signals burnout risk.
- **Authorization utilization** -- Are clients using their approved hours? Under-utilization means lost revenue. Target: 90%+ utilization of authorized hours across all clients.
- **Cancellation rate** -- Target: below 10%. Above 15% indicates systemic problems (poor family engagement, scheduling mismatches). Track by client, by day of week, by therapist.
- **Hours authorized vs. hours delivered vs. hours billed** -- The three-number dashboard. Gaps between any pair indicate scheduling, documentation, or billing workflow problems.
- **Supervision compliance** -- Are all RBTs receiving required supervision? BACB non-compliance puts the practice's ability to employ RBTs at risk.
- **Revenue per client per month** -- Derived from delivered hours * reimbursement rate. Scheduling directly impacts this.
- **Waitlist depth and conversion** -- How many clients are waiting, and how quickly can they be onboarded when slots open?

---

## 2. ABA-Specific Scheduling Constraints

### 2A. BACB Supervision Requirements (Current as of 2026)

The Behavior Analyst Certification Board (BACB) sets certification requirements that directly constrain scheduling.

**RBT Ongoing Supervision:**
- **Minimum 5% of total monthly service hours** must be supervision. Example: RBT delivers 120 hours/month of 97153 --> needs at least 6 hours of supervision that month.
- **Minimum 2 hours per month** regardless of how few hours the RBT works.
- **At least 2 face-to-face, real-time contacts per month.**
- **At least 1 contact per month must include direct observation** of the RBT with a client (the supervisor must be physically or virtually present during an actual session).
- **Minimum 50% of supervision hours must be individual** (one-on-one between supervisor and RBT). The other 50% can be group supervision.
- **Supervision and professional development are separate** -- supervision hours (which are client-focused) cannot count toward the RBT's 12 PDU recertification requirement.

**Who can supervise RBTs (effective January 2026):**
- Only BCBA, BCBA-D, or BCaBA who has completed the 8-Hour Supervision Training
- Noncertified supervisors are **no longer permitted** as of January 1, 2026 -- this is a significant change that affects practices relying on non-certified supervisors

**BCBA supervision distinction:**
- BACB supervision (5% monthly requirement) is a **certification requirement** -- it's about maintaining the RBT's credential
- Payer supervision (billing 97155 when BCBA overlaps with RBT session) is a **billing requirement** -- it's about how the BCBA's time is coded
- These overlap in practice but are tracked separately. A BCBA observing an RBT session counts toward both, but other supervision activities (reviewing data, meeting about cases) count toward BACB but not toward 97155 billing.

**BCaBA Supervision (effective 2026):**
- BCaBAs must receive ongoing supervision from a BCBA
- BCaBAs can supervise RBTs but must themselves be supervised

### 2B. Session Frequency Requirements by Payer

Payers authorize specific hours per week by CPT code. The authorization is the scheduling ceiling.

**Typical authorization patterns:**

| Service | CPT Code | Typical Approved Range | Common Pattern |
|---------|----------|----------------------|----------------|
| Direct therapy (RBT) | 97153 | 10-40 hours/week | 20-30 hrs/week most common |
| Supervision/protocol modification (BCBA) | 97155 | 10-20% of 97153 hours | 2-6 hrs/week |
| Parent training | 97156 | 1-4 hours/month | 1 hr/week or 2 hrs biweekly |
| Group therapy (technician-led) | 97154 | 2-8 hours/week | Varies by program |
| Group therapy (BCBA-led) | 97158 | 2-4 hours/week | Social skills groups |
| Assessment (initial) | 97151 | One-time, 8-32 units | At intake + reassessment |
| Assessment (supporting) | 97152 | One-time, 8-16 units | At intake |

**Payer-specific frequency rules:**
- Some payers specify minimum sessions per week (e.g., "minimum 3 sessions/week of 97153")
- Some payers cap 97155 at a percentage of 97153 (commonly 10-20%)
- Medicaid often requires quarterly re-authorization with progress reports every 90 days
- TRICARE authorizes 6 months at a time with mandatory parent training within 30 days
- Many commercial payers require re-authorization every 6-12 months

### 2C. Authorization Utilization Pacing

**The core tension:** Authorizations approve a fixed number of units over a fixed period. Practices must pace delivery to maximize utilization without exhausting units prematurely.

**Best practices from industry research:**

1. **Schedule 100% of authorized hours at authorization start.** Map the full auth period into recurring weekly sessions immediately. Account for known holidays, vacations, and staff availability.

2. **Overschedule by 10-20%** to account for inevitable cancellations. The worst case (rarely happens) is reducing hours in the final week. The common case is that cancellations bring actual delivery close to 100%.

3. **Spread hours evenly.** Resist the temptation to front-load (burning through hours quickly) or back-load (scrambling at the end). Even distribution provides the most clinical benefit and the most predictable revenue.

4. **Track pacing weekly.** Compare actual delivered hours to expected delivery based on linear interpolation across the auth period. Flag clients falling behind pace early.

5. **Make up cancellations quickly.** Extend existing sessions by 15 minutes per day rather than scheduling full makeup blocks. This is easier to fit into existing schedules. Alternatively, use backup/floater RBTs to cover absences.

6. **Alert on under-utilization.** If a client has used less than 50% of authorized hours with more than 50% of the auth period elapsed, escalate immediately.

### 2D. MUE Limits (Medically Unlikely Edits)

MUEs define the maximum units billable per CPT code per day per patient. These are hard billing ceilings that constrain scheduling.

| CPT Code | Description | Medicare MUE (units/day) | Medicaid MUE (units/day) | Time Equivalent |
|----------|-------------|--------------------------|--------------------------|-----------------|
| 97151 | Behavior identification assessment | 8 | 32 | 2 hrs / 8 hrs |
| 97152 | Behavior identification supporting assessment | 16 | 16 | 4 hrs |
| 97153 | Adaptive behavior treatment by protocol | 32 | 32 | 8 hrs |
| 97154 | Group adaptive behavior treatment by protocol | 18 | 18 | 4.5 hrs |
| 97155 | Adaptive behavior treatment with protocol modification | 24 | 24 | 6 hrs |
| 97156 | Family adaptive behavior treatment guidance | 16 | 16 | 4 hrs |
| 97157 | Multiple-family group guidance | 16 | 16 | 4 hrs |
| 97158 | Group adaptive behavior treatment w/ protocol modification | 16 | 16 | 4 hrs |
| 0362T | Supporting assessment (destructive behavior) | 16 | 16 | 4 hrs |
| 0373T | Protocol modification (destructive behavior) | 32 | 32 | 8 hrs |

**Important:** MUE Adjudication Indicator is 3 for all ABA codes, meaning services **may be paid in excess** of the MUE if actually provided, properly coded, and medically necessary. However, exceeding MUE triggers manual review by most payers.

**Scheduling implication:** A single client session of 97153 should not exceed 8 hours (32 units) in one calendar day. If a client receives split sessions (morning + afternoon), the combined units still cannot exceed the MUE without risk of denial.

### 2E. Group Therapy Scheduling (97154 / 97157 / 97158)

Group sessions introduce multi-client scheduling complexity.

**Group size:** Minimum 2 patients, maximum 8 patients per group.

**Code distinctions:**
- **97154** -- Technician-led group (RBT delivers treatment to 2+ clients following protocol)
- **97157** -- BCBA-led group parent/caregiver training (multiple families, clients not present)
- **97158** -- BCBA-led group treatment (2+ clients, direct treatment with protocol modification)

**Scheduling considerations:**
- Must coordinate availability of multiple clients AND the provider
- Clients in a group should have compatible goals (social skills, communication, etc.)
- Each client is billed individually for group time
- Group sessions are often clinic-based (harder to do in-home with multiple clients)
- Groups typically run on fixed weekly schedules (e.g., social skills group every Tuesday 3-5pm)
- Need to track minimum group size -- if too many clients cancel, the session may need to convert to individual or be cancelled

### 2F. Cancellation and Makeup Session Policies

**Industry standard cancellation policies:**
- **24-hour minimum notice** required for cancellations without fee
- **72-hour notice** for planned absences (vacations, travel)
- **$50-$60 late cancellation fee** (charged to family, not billable to insurance)
- **No-show fee** of similar amount if client does not attend and does not notify

**Makeup session practices:**
- Makeup sessions should be offered for all missed sessions
- Best practice: make up within 2 weeks of missed session
- Extension method: add 15 minutes to existing sessions over several days to recover lost time (easier to schedule than a full makeup block)
- Floater/backup RBT: experienced RBT on guaranteed hours who fills gaps from staff cancellations
- Some practices use alternate therapist coverage, which also supports skill generalization

**Attendance expectations:**
- Most practices require **80% minimum attendance** of scheduled sessions per month
- Below 80% attendance may trigger discharge discussions or modified treatment plans
- Insurance companies may question continued medical necessity if attendance is consistently low

**Cancellation rate benchmarks:**
- Industry average: 15-24% (pediatric specialty clinics report ~24.3% no-show rate)
- Telehealth cancellations can reach 30%
- Target: below 10% for well-run practices
- Mondays, Fridays, and post-holiday periods show the highest cancellation patterns

---

## 3. Common Scheduling Patterns

### 3A. Recurring Weekly Templates

The dominant pattern in ABA. Most clients have fixed weekly schedules that change infrequently (quarterly or at re-authorization).

**Example: Typical client weekly template**
```
Mon  9:00-12:00  97153 (RBT: Sarah)    Home
Wed  9:00-12:00  97153 (RBT: Sarah)    Home
Wed  1:00-2:00   97155 (BCBA: Dr. Kim) Home (overlaps with RBT for supervision)
Fri  9:00-12:00  97153 (RBT: Sarah)    Home
Fri  3:00-4:00   97156 (BCBA: Dr. Kim) Home (parent training, no RBT needed)
```

This client receives: 9 hours/week of 97153, 1 hour/week of 97155, 1 hour/week of 97156.

**Template lifecycle:**
1. Created at client intake when authorization is received
2. Adjusted when re-authorization changes approved hours
3. Adjusted when school year / summer transition changes availability
4. Adjusted when therapist changes (RBT leaves, new RBT assigned)
5. Individual weeks deviate from template due to cancellations, holidays, makeup sessions

### 3B. Block Scheduling

RBTs typically work in blocks -- one client per time block with travel/break buffers between blocks.

**Example: RBT daily schedule (home-based)**
```
8:00-8:30   Travel to Client A
8:30-11:30  Client A (97153, 12 units)
11:30-12:00 Travel + lunch break
12:00-12:30 Travel to Client B
12:30-3:30  Client B (97153, 12 units)
3:30-4:00   Travel back / documentation time
4:00-4:30   Complete session notes
```

**Example: RBT daily schedule (clinic-based)**
```
8:00-8:30   Setup / review session plans
8:30-11:30  Client A (97153, 12 units)
11:30-12:00 Break + transition
12:00-3:00  Client B (97153, 12 units)
3:00-3:15   Break
3:15-5:15   Client C (97153, 8 units)
5:15-5:45   Complete session notes
```

### 3C. Split Sessions

Same client, same day, different time blocks. Less common but occurs in specific scenarios:

**When split sessions happen:**
- School-based: morning session before school activities, afternoon session after
- Clinic-based: client attends group in morning (97154/97158), individual in afternoon (97153)
- Medical appointments: session split around a doctor visit
- Behavioral management: shorter sessions are clinically appropriate for some clients

**Billing considerations:**
- Both session blocks on the same day count toward the daily MUE limit
- Each block needs separate documentation with start/end times
- Some payers require modifier -59 or -XU for same-day same-code services
- Combined units must not exceed MUE without medical necessity justification

### 3D. Overlap Sessions (BCBA Supervision)

The BCBA joins an existing RBT session for a portion of it. This is the most common supervision pattern.

**How it works:**
```
Timeline:
RBT (Sarah):     |-------- 97153 (8:30-11:30) --------|
BCBA (Dr. Kim):            |-- 97155 (9:30-10:30) --|
```

- The RBT bills 97153 for the full session (12 units)
- The BCBA bills 97155 for the overlap period (4 units)
- **Both codes are billed on the same day for the same client** -- this is expected and correct
- The BCBA must be actively modifying the protocol, not just passively observing
- Documentation must clearly show what modifications the BCBA made and why
- The overlap counts toward both BACB supervision requirements AND billable 97155 hours
- The same BCBA cannot bill 97153 and 97155 simultaneously for overlapping time -- they are separate, distinct services

**Payer variations on concurrent billing:**
- Most commercial payers allow 97153 + 97155 on the same day with separate providers
- Some payers require prior authorization for concurrent billing
- Florida Medicaid has specific mechanisms for concurrent billing when medically necessary
- Anthem and some other payers have specific policies -- always verify

### 3E. Location-Based Scheduling Differences

**Home-based:**
- Most common for young children (under 6)
- Requires travel time between clients (15-45 min depending on geography)
- RBT caseload limited by travel -- typically 3-4 clients/day
- Session times constrained by family schedules
- POS code: 12

**Clinic-based:**
- More efficient -- no travel between clients
- Can see 4-6 clients/day
- Enables group sessions (97154, 97157, 97158)
- Fixed facility hours constrain scheduling
- POS code: 11

**School-based:**
- Constrained by bell schedule, school calendar, teacher schedules
- Sessions must work around lunch, recess, specials, testing
- Requires school district coordination and often IEP alignment
- Summer: either pause or shift to home/clinic (ESY may apply)
- POS code: 03

**Telehealth:**
- Expanded post-COVID, CMS extended coverage through at least December 2026
- Higher cancellation rates (~30%) than in-person
- Must document client's physical location for billing
- POS code: 10 (client at home) or 02 (client elsewhere)
- Not all CPT codes are eligible for telehealth delivery by all payers

### 3F. Seasonal Scheduling Adjustments

ABA practices experience two major schedule transitions per year:

**School-to-summer transition (May/June):**
- School-age clients suddenly available during the day
- Practices can increase hours for clients who were limited to after-school
- New recurring templates needed for summer availability
- Clinic-based summer programs/camps become available
- ESY (Extended School Year) services may overlap

**Summer-to-school transition (August/September):**
- Clients return to school, shrinking available windows
- After-school slots (3pm-7pm) become premium and oversubscribed
- Practitioners compete for limited afternoon/evening availability
- Some clients reduce hours during school year
- New recurring templates needed to match school schedules

**Other seasonal patterns:**
- Holiday weeks (Thanksgiving, winter break, spring break): high cancellation periods
- School testing weeks: may disrupt school-based sessions
- Summer vacation: families traveling leads to multi-week gaps

---

## 4. Scheduling Pain Points

### 4A. Practitioner-Reported Frustrations

From industry research, practitioner blogs, and ABA practice management literature:

**"Scheduling is the most stressful part of running an ABA practice."**

1. **Constant churn.** Schedules shift weekly. Cancellations, staff callouts, and family changes create a never-ending cycle of rescheduling. Small practices report the scheduler spends 10-15 hours/week managing exceptions.

2. **Authorization-scheduling mismatch.** Sessions get booked outside authorization limits and the error is not caught until billing -- weeks or months later. This is the #1 preventable cause of claim denials.

3. **Manual coordination overload.** Information about schedules, authorizations, therapist availability, and client preferences lives in multiple systems (Google Calendar, spreadsheets, the PM software, someone's head). When information is fragmented, exceptions are forgotten and errors compound.

4. **BCBA scheduling is a puzzle.** Fitting supervision visits around RBT sessions, across 8-15 clients, while meeting BACB's 5% rule and per-RBT contact frequency requirements, while also doing direct clinical work -- this is a complex multi-constraint optimization problem that most BCBAs solve by brute force.

5. **Travel time ignored.** Schedulers book back-to-back sessions without accounting for drive time between locations. This causes tardiness, shortened sessions, and cascading schedule disruptions. RBTs report this as a top frustration.

6. **Cancellation cascading.** When a client cancels, the RBT has a gap. If the gap can't be filled, it's lost revenue and the RBT is underutilized. Practices without automated waitlist/backfill systems lose significant revenue to gaps.

7. **Staff turnover disrupts everything.** ABA has 80-100% annual turnover for RBTs at smaller centers. Every departure requires reassigning all of that RBT's clients, finding matches from remaining staff, and notifying families -- a scheduling earthquake.

8. **Seasonal transitions are chaotic.** The school-to-summer and summer-to-school transitions require rebuilding schedules for a large portion of the caseload simultaneously.

9. **No visibility into utilization until it's too late.** Practice owners discover authorization under-utilization or staff under-utilization at month-end, when it's too late to correct. Real-time dashboards are universally requested.

10. **Software doesn't understand ABA.** Generic scheduling tools (Google Calendar, Calendly, etc.) don't know about authorizations, supervision requirements, MUE limits, or CPT codes. ABA-specific PM tools often have poor UX or are too expensive for small practices.

### 4B. Most Requested Features

Based on practitioner requests across industry sources:

1. **Authorization-aware scheduling** -- Block booking beyond approved hours, alert on approaching limits, show remaining hours when scheduling
2. **Recurring session templates** -- Set it once, adjust as needed, don't rebuild weekly
3. **Automated conflict detection** -- Double-booking prevention, travel time enforcement, MUE limit checking
4. **Cancellation + backfill workflow** -- One-click cancel with reason code, automatic notification to waitlist clients, suggested replacement sessions
5. **Supervision compliance tracker** -- Dashboard showing each RBT's supervision status, which ones need visits this month, auto-suggest BCBA schedule adjustments
6. **Mobile schedule view** -- RBTs in the field need their daily schedule on a phone, not a desktop
7. **Real-time utilization dashboard** -- Staff utilization, authorization utilization, cancellation rates, all in one view
8. **Session-to-billing automation** -- Scheduled session auto-creates the session record with pre-filled CPT codes, units, and authorization data
9. **Geographic/route optimization** -- For home-based practices, minimize travel between clients
10. **Multi-location calendar** -- See all locations, all providers, all clients in one unified view

### 4C. Administrative Burden Impact

- **93% of behavioral health workers report some level of burnout**, 62% at moderate-to-severe levels
- Staff lose an estimated **10 hours/week to redundant admin work**
- BCBAs commonly take on scheduling tasks on top of clinical responsibilities -- "wearing multiple hats" is a top burnout contributor
- Scheduling errors lead to **duplicate records, denied claims, and compounding stress**
- Smaller practices especially suffer because they cannot afford dedicated scheduling staff

---

## 5. Payer-Specific Scheduling Rules

### 5A. Same-Day Billing Rules

**Can you bill 97153 and 97155 on the same day for the same client?** YES, in most cases.

This is the standard supervision overlap pattern. The RBT bills 97153, the BCBA bills 97155, at different times (or overlapping times with separate documentation).

**Requirements for same-day billing:**
- Services must be separate and distinct
- Each service needs its own documentation with exact start/end times
- Different providers must deliver the services (RBT for 97153, BCBA for 97155)
- The same individual cannot bill both 97153 and 97155 for overlapping time periods
- Modifiers may be required (-25, -59, -XU) depending on payer
- Documentation must clearly demonstrate what was different about each service

**Payer-specific variations:**
- **Most commercial payers:** Allow same-day 97153 + 97155 with separate providers and documentation
- **Anthem:** Has specific policies on concurrent 97153/97155 -- verify before billing
- **Florida Medicaid:** Has a specific mechanism for concurrent billing when medically necessary and prior authorized
- **UnitedHealthcare/Optum:** Requires clear documentation separation between services (2024 policy)

### 5B. Medicaid Rules

- Prior authorization required before services begin
- **Quarterly re-authorization** common (every 90 days) with required BCBA progress reports
- State-by-state variation is significant -- each state Medicaid program has different rules
- MUE limits for 97151 are higher (32 units) under Medicaid than Medicare (8 units)
- Supervision requirements may exceed BACB minimums in some states
- Some states require specific provider-to-client ratios for group services

### 5C. TRICARE (Military)

- **No yearly or lifetime caps** on ABA services
- Authorized **6 months at a time** based on medical necessity
- 10-40 hours/week typical, with 25-40 recommended for young children
- **Mandatory parent training**: at least 1 session of 97156 or 97157 within 30 days of authorization start
- Billed in 15-minute increments
- All services on one day = one copayment
- Every 2 years: new referral from ASD diagnosing provider required
- Every 6 months: updated treatment plan assessment and re-authorization
- Uses Humana Military as regional contractor for most processing

### 5D. BCBS (Blue Cross Blue Shield)

- Requirements vary dramatically by state and plan
- Generally requires prior authorization
- Many BCBS plans cap 97155 at 10-20% of 97153 hours
- Some plans require specific BCBA-to-client ratios for supervision
- Medicare Advantage plans through BCBS have different rules than commercial

### 5E. UHC / Optum

- Requires prior authorization
- Has specific documentation standards for concurrent same-day services
- Historically strict on MUE enforcement
- Some plans require the supervisor (BCBA) and treating provider (RBT) to be in the same physical location for 97155

### 5F. Place of Service Impact on Scheduling

Different POS codes affect reimbursement rates and may have different authorization requirements:

| POS Code | Setting | Scheduling Impact |
|----------|---------|-------------------|
| 03 | School | Constrained by bell schedule, school calendar |
| 10 | Telehealth (home) | Higher cancellation rates, must verify client location |
| 02 | Telehealth (other) | Must verify client location for billing |
| 11 | Office/Clinic | Most efficient, enables groups |
| 12 | Home | Travel time required, limits daily caseload |

Some payers reimburse at different rates by POS. Telehealth rates may be lower than in-person for the same CPT code. This affects scheduling decisions (prioritize in-person for higher reimbursement vs. telehealth for client convenience).

---

## 6. Key Metrics & Benchmarks

### 6A. Staff Utilization

| Metric | Good | Better | Best |
|--------|------|--------|------|
| **Billable utilization (RBT)** | 65-70% | 75-85% | 90%+ |
| **Billable utilization (BCBA)** | 55-65% | 65-75% | 80%+ |
| **Cancellation/no-show rate** | <15% | <10% | <5% |
| **Travel time % (home-based)** | <20% | <15% | <10% |
| **Documentation within 24 hrs** | 80% | 90% | 95%+ |

**Calculation:** Billable utilization = billable hours / total available hours * 100

Example: Full-time RBT works 40 hrs/week, delivers 28 billable hours = 70% utilization. The other 12 hours are travel, breaks, documentation, training, and supervision.

BCBA utilization is naturally lower because they have more non-billable responsibilities (treatment planning, team meetings, supervision documentation, progress reports).

### 6B. Authorization Utilization

| Metric | Red Flag | Acceptable | Target |
|--------|----------|------------|--------|
| **Auth utilization (overall)** | <75% | 80-90% | 90-95%+ |
| **Pacing (delivery vs. linear forecast)** | >20% behind | 10-20% behind | Within 10% |
| **Hours scheduled vs. hours authorized** | <80% | 85-95% | 95-110% (overschedule) |

### 6C. Revenue Cycle

| Metric | Good | Better | Best |
|--------|------|--------|------|
| **First-pass claim acceptance** | 80-85% | 90%+ | 95%+ |
| **Days sales outstanding (DSO)** | <30 days | <20 days | <15 days |
| **Billing lag (session to claim)** | <14 days | <7 days | <3 days |

---

## 7. Implications for Clinivise

### 7A. Core Scheduling Concepts to Model

1. **Recurring template as primary entity.** The weekly recurring schedule is the foundation. Individual appointments are instances/exceptions of the template. Don't build an appointment-first system -- build a template-first system.

2. **Authorization is the scheduling ceiling.** Every scheduled session must validate against the client's active authorization for that CPT code. This is the single most impactful feature for reducing claim denials.

3. **Supervision is a scheduling overlay.** BCBA supervision visits are layered on top of existing RBT sessions. The system should suggest optimal supervision placement based on BACB requirements.

4. **Location affects everything.** Home vs. clinic vs. school vs. telehealth changes travel time, caseload capacity, group availability, reimbursement rates, and seasonal patterns.

5. **Cancellations are a first-class workflow.** Not just deleting an appointment -- it's recording a reason, calculating auth impact, triggering makeup suggestions, and potentially backfilling from a waitlist.

### 7B. Critical Validation Rules for Scheduling

**Hard blocks (prevent scheduling):**
- Session outside authorization date range
- Session exceeds remaining authorized units for that CPT code
- Same provider double-booked for overlapping 1:1 sessions
- Provider credential doesn't match CPT code requirements (e.g., RBT billing 97155)

**Warnings (allow but flag):**
- Session would exceed MUE limit for the day
- No travel buffer between consecutive home-based sessions
- BCBA supervision below 5% pace for the month
- Client attendance below 80% threshold
- Authorization utilization behind pace

### 7C. Data Model Considerations

Key entities that scheduling will need:

- **Schedule templates** (recurring weekly patterns, linked to client + provider + auth)
- **Schedule instances/appointments** (specific date occurrences, may deviate from template)
- **Cancellations** (with reason code, linked to original appointment, tracks makeup status)
- **Availability blocks** (provider working hours, time-off, location preferences)
- **Travel time estimates** (between locations, for route optimization)
- **Supervision tracking** (per-RBT monthly accumulator, linked to specific sessions)
- **Waitlist** (clients awaiting scheduling, with preferences and auth status)

### 7D. Competitive Differentiation Opportunities

Based on the research, the biggest gaps in existing ABA scheduling tools:

1. **Authorization-first scheduling** -- Most tools check auth AFTER scheduling. Clinivise should make auth status visible DURING scheduling as the primary constraint.
2. **Supervision compliance automation** -- No tool does this well. Auto-calculating 5% requirements, suggesting optimal BCBA visit placement, alerting on shortfalls.
3. **Pacing intelligence** -- Show projected auth exhaustion/under-utilization based on current scheduling patterns. Proactive, not reactive.
4. **Cancellation recovery workflow** -- One-click cancel with automatic makeup suggestions, not just deletion.
5. **Seasonal template swapping** -- Easy transition between school-year and summer templates without rebuilding from scratch.

---

## Sources

### Official / Regulatory
- [BACB RBT Ongoing Supervision Fact Sheet](https://www.bacb.com/rbt-ongoing-supervision-fact-sheet/)
- [BACB Supervision, Assessment, Training, and Oversight](https://www.bacb.com/supervision-and-training/)
- [ABA Coding Coalition - Billing Codes](https://abacodes.org/codes/)
- [ABA Coding Coalition - Advocacy / MUE Efforts](https://abacodes.org/advocacy/)
- [ABA Billing Codes - Medically Unlikely Edits](https://www.ababillingcodes.com/resources/medically-unlikely-edits/)
- [TRICARE Autism Care Demonstration](https://www.tricare.mil/autism)
- [TRICARE ABA Services - How to Obtain](https://tricare.mil/About/Regions/East-Region/Wellness/Conditions/Autism/ABA-Services)
- [Humana Military Treatment Plan Requirements](https://www.humanamilitary.com/provider/managedcare/acoe/treatmentplan)

### BACB 2026 Changes
- [BACB Changes in 2026 - ABA Resource Center](https://www.abaresourcecenter.com/post/bacb-changes-in-2026)
- [New RBT Requirements 2026 - Ensora Health](https://ensorahealth.com/blog/new-rbt-requirements-coming-in-2026/)
- [2026 RBT Updates - Theralytics](https://www.theralytics.net/blogs/2026-updates-for-rbts-and-rbt-supervisors)
- [BACB December 2025 Newsletter Summary - ATCC](https://www.atcconline.com/blog/summarized-december-2025-bacb-newsletter)
- [BACB Recent & Upcoming Changes](https://www.bacb.com/upcoming-changes/)

### Industry / Practitioner Resources
- [Scheduling Strategies for ABA Practices - Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)
- [Scheduling Tips to Maximize Utilization - ABA Building Blocks](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/)
- [Optimizing Authorizations and Scheduling - Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [ABA Cancellation Policy - TotalCare ABA](https://www.totalcareaba.com/autism/aba-cancellation-policy)
- [How to Handle Session Cancellations - Cross River Therapy](https://www.crossrivertherapy.com/articles/how-to-handle-session-cancellations-in-aba-therapy)
- [Workforce Operational Efficiency - Theralytics](https://www.theralytics.net/blogs/improve-workforce-operational-efficiency-aba-clinic)
- [BCBA Burnout Rate Solutions - Theralytics](https://www.theralytics.net/blogs/bcba-burnout-rate)
- [ABA Workforce Challenges 2025 - Plutus Health](https://www.plutushealthinc.com/post/aba-workforce-operational-efficiency-2025)
- [BCBA & RBT Burnout - Artemis ABA](https://www.artemisaba.com/blog/ways-to-reduce-bcba-rbt-turnover-and-retention)

### Competitor / Software Analysis
- [5 Best ABA Scheduler Software 2026 - Passage Health](https://www.passagehealth.com/blog/aba-scheduler-software)
- [Best ABA Practice Management Software 2026 - Passage Health](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [ABA Practice Management Software Tasks - ABA Matrix](https://www.abamatrix.com/aba-practice-management-software-tasks/)
- [ABA Scheduling Made Simple - ABA Matrix](https://www.abamatrix.com/aba-scheduling-made-simple-for-better-outcomes/)
- [ABA Scheduling Software - RethinkBH](https://www.rethinkbehavioralhealth.com/our-solutions/aba-scheduling/)
- [CentralReach Practice Management Software](https://centralreach.com/products/aba-practice-management-software/)
- [Setup Recurring Appointments - TherapyPM](https://therapypms.com/save-time-and-stay-organized-with-recurring-appointments-in-aba-therapy/)

### Billing / CPT Code Guides
- [ABA Billing Codes Guide - Passage Health](https://www.passagehealth.com/blog/aba-billing-codes)
- [CPT 97155 Explained - Brellium](https://brellium.com/resources/articles/understanding-and-applying-the-97155-cpt-code)
- [ABA Billing Playbook 2025-2026 - Cube Therapy Billing](https://www.cubetherapybilling.com/aba-billing-playbook)
- [ABA Billing Codes for Beginners - Behavior Business Builder](https://www.behaviorbusinessbuilder.com/post/5-aba-cpt-codes-for-beginners)
- [Code 97157/97158 Guide - Operant Billing](https://operantbilling.com/code-97157-97158-in-aba-therapy-how-when-to-use-them/)
- [ABA CPT Codes Guide 2025 - AlohaABA](https://alohaaba.com/blogs/understanding-cpt-codes-for-aba-therapy-billing-a-comprehensive-guide)
