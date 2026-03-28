# ABA scheduling is broken: a bottom-up market research sweep

**ABA therapy scheduling is the most complex scheduling problem in outpatient healthcare, and no platform solves it well.** Practitioners across every role—BCBAs, RBTs, schedulers, billing staff—report that existing software forces them into manual workarounds for problems that should be automated: cancellation cascades, authorization pacing, supervision compliance, seasonal schedule transitions, and payer-specific billing rules that vary by state and insurer. The average ABA practice loses **$2.5M–$3.5M annually per 500 clients** from scheduling-related inefficiencies, with cancellation rates averaging **38%** and claim denial rates hovering at **15–19%** industry-wide. This report synthesizes findings from practitioner reviews, Reddit discussions, payer manuals, BACB requirements, and industry analyses across all 13+ major ABA platforms.

---

## 1. The ten most common scheduling complaints, ranked by frequency

These pain points emerged repeatedly across G2, Capterra, Software Advice, practitioner blogs, LinkedIn posts, and industry analyses. They are ranked by how frequently they appeared across independent sources.

**1. Cancellation cascades with no automated recovery.** This was the single most discussed scheduling problem across every source. One cancellation triggers a multi-stakeholder scramble affecting RBTs (lost pay), BCBAs (disrupted supervision), families, and billing. *"One missed hour turns into a shuffle of new locations, new staff, a frustrated family, and a stressed-out manager trying to hold everything together"* (Motivity blog). The average individual cancellation rate is **38%**, with some facilities reporting **30%+ cancellation rates**. No platform automatically fills cancelled slots from a waitlist, recalculates drive times for affected therapists, or checks authorization impact—all of which must happen simultaneously.

**2. Authorization tracking disconnected from the calendar.** Schedulers cannot see authorized-vs.-utilized hours in real time during scheduling. Sessions get booked beyond authorization limits, and the problem surfaces only at billing time. *"A calendar can look full while still hiding unbillable hours... these issues aren't obvious until the billing cycle hits, and by then it's too late"* (Motivity). CentralReach offers schedule validation but requires manual configuration that many practices skip; most other platforms lack even basic auth-aware scheduling.

**3. Excessive clicks and rigid calendar UX (especially CentralReach).** CentralReach, the market leader, requires **15–20 clicks to reschedule a single session** with no smart matching or real-time proposal engine. *"Schedulers spend entire days fighting the tool instead of optimizing the schedule"* (Serious Development analysis). Scheduler-to-client ratios sit at 1:100 without automation versus 1:300–400 with it. Users of RethinkBH also report *"the schedule is difficult to view... much worse than ABA Schedules"* and *"no drag-and-drop"* functionality.

**4. No batch operations for bulk cancel/reschedule.** When a holiday, weather event, or therapist departure requires changing many sessions at once, most platforms force individual modifications. CentralReach users report *"you have to go into each staff's calendar and add them separately."* RethinkBH *"doesn't allow for scheduling multiple staff members or kids at the same time"* (Bethany C., Clinical Director). SimplePractice has *"no bulk-reassignment capability, no programmatic booking via API"* (Crown Counseling).

**5. Drive time and travel not dynamically calculated.** Most systems look at distance in miles, not actual drive time accounting for traffic and time of day. *"In metro areas, 5 miles can take 45 minutes depending on time of day"* (MissionViewpoint). One California clinic found **30% of RBTs were driving over an hour between sessions** before restructuring. Only Theralytics, CentralReach ScheduleAI, and ABA Matrix offer any drive-time integration, and none use real-time traffic data.

**6. BCBA supervision scheduling is manual and compliance-risky.** The BACB requires **5% of each RBT's monthly service hours** be supervised, with at least two synchronous contacts per month, at least one individual, and at least one direct observation. If no supervision occurs for **60 consecutive days**, RBT certification may be suspended. No platform proactively tracks whether a BCBA is on pace to meet the 5% threshold across all supervisees or automatically schedules supervision sessions to maintain compliance.

**7. Mobile app quality inadequate for field RBTs.** RBTs working in homes and schools rely on mobile access, but apps crash, lose data, and lack feature parity with desktop. CentralReach users report: *"The app is very unreliable"* (G2), *"offline sessions do not work properly"* (G2), and *"it crashes and does not save data"* (Capterra). AlohaABA lacks a native mobile app entirely. Only Raven Health received praise for mobile-first design with offline capability.

**8. Seasonal schedule transitions require full manual rebuilds.** The school-year-to-summer transition forces every client's schedule to change—from after-school slots to daytime—affecting all therapists simultaneously. *"Scheduling is not 'set it and forget it'—it's a living, breathing puzzle, highly sensitive to seasons, schools, and life events"* (MissionViewpoint). No platform offers a bulk schedule transition tool or seasonal template switching.

**9. Holiday and PTO handling breaks recurring schedules.** When a holiday falls mid-week, recurring sessions must be manually deleted. Restoring the recurring pattern afterward often fails. When therapists take PTO, there's no automated impact analysis showing which clients are affected or whether authorization utilization will suffer. *"Holidays, teacher workdays, and breaks cause unpredictable disruptions"* that schedulers must resolve one appointment at a time.

**10. Waitlist management is disconnected from active scheduling.** When cancellations open slots, there's no automated way to fill them from a prioritized waitlist. *"When a cancellation hits, filling the spot shouldn't require an all-hands rush"* (Motivity). Meanwhile, **75% of caregivers** report spending time on a waitlist for ABA services, with average wait times of **5.5–5.7 months**. No platform offers an integrated waitlist-to-caseload pipeline handling priority scoring, insurance verification, therapist matching, and schedule building as one workflow.

---

## 2. Claim denial risks: payer scheduling rules that software must enforce

ABA claim denial rates run **15–19% nationally**, and a significant share traces back to scheduling errors that flow into billing. The following rules, if violated at the scheduling stage, trigger automatic denials.

### Overlapping time blocks are the most common scheduling-caused denial

When an RBT bills 97153 (direct treatment) and a BCBA joins for 97155 (protocol modification) during the same session, the overlap period creates a billing conflict unless the payer explicitly allows concurrent billing with separate providers. **A single QHP may never bill both 97153 and 97155 concurrently**—this is a universal CPT rule. Texas Medicaid and TRICARE prohibit any concurrent ABA billing outright. Scheduling software must either reduce the RBT's billed minutes during the overlap or confirm the payer allows concurrent billing with distinct providers.

### Daily unit cap violations trigger automatic denials

CMS Medically Unlikely Edits (MUEs) cap most treatment codes at **32 units per day** (8 hours) for Medicaid populations. However, many commercial payers' claims systems apply the stricter **Medicare MUEs** (only 8 units/day for 97151 and 0362T) even for non-Medicare ABA patients. Texas Medicaid enforces **32 combined units per day** across 97153, 97154, 97155, and 97158. Scheduling a 9-hour treatment day (36 units) guarantees denial.

### Authorization window and utilization violations

Sessions scheduled outside the authorization date range or exceeding approved unit counts are denied universally. TRICARE requires all initial 97151 assessment units completed within **14 calendar days** of the first date of service. Texas Medicaid allows **30 calendar days**. Scheduling software that doesn't track these windows creates preventable denials.

### Group size limits vary by payer

CPT standard allows **2–8 participants** for group codes (97154, 97157, 97158). Florida Medicaid is stricter at **6 participants maximum**. Scheduling a 7-person group in Florida triggers denial.

### ABA concurrent with other therapies

Cigna/Evernorth explicitly excludes coverage when ABA is delivered simultaneously with any other treatment modality (OT, speech, PT). TRICARE similarly prohibits concurrent ABA and non-ABA services. Scheduling software should prevent booking ABA and other therapies in overlapping slots for the same client when these payers are involved.

### Parent training milestones (TRICARE-specific)

TRICARE's Autism Care Demonstration requires the **first parent training session within 30 days** of starting ABA and **6 sessions within each 6-month authorization**. Failure to schedule these triggers suspension from the ACD program.

### Wrong provider type for CPT code

RBTs cannot bill under 97155 (QHP-only code); BCBAs should not bill under 97153 without proper modifiers. Software must validate provider credentials against scheduled CPT codes and auto-assign correct modifiers: **HM** (RBT), **HN** (BCaBA), **HO** (BCBA/supervisor).

---

## 3. What each major platform gets wrong about scheduling

### CentralReach: powerful but painful

CentralReach dominates the enterprise ABA market but draws the most scheduling complaints of any platform. The **15–20 clicks per reschedule** problem is well-documented. The calendar is described as *"too rigid, not easy to create or change appointments"* with poor multi-provider visibility—users *"can't easily see when other providers have appointments with shared clients ON the calendar."* Frequent system outages block schedule access entirely: *"There was an entire week where CentralReach was down and no one could login"* (G2). The mobile app is unreliable with offline sessions that don't sync. Group scheduling is missing—*"not allowing a group appointment for things like company-wide meetings."* CentralReach's newer ScheduleAI product addresses some gaps (one provider reported **75% time savings**) but requires additional licensing costs on top of already expensive per-employee pricing.

### RethinkBH (Ensora): scheduling UX lags behind promises

RethinkBH markets AI scheduling but users report the reality falls short. The schedule display is *"difficult to view"* and *"EXTREMELY SLOW TO LOAD ANYTHING"* (Capterra UK). It lacks drag-and-drop—*"In my previous experience with CentralReach scheduling, I was able to drag and drop, which was helpful"* (FindEMR). Multi-staff scheduling is absent: *"Scheduling doesn't allow for scheduling multiple staff members at the same time"* (Bethany C., Clinical Director). Some users praise authorization-integrated scheduling and find appointment creation fast, but the overall UX is inconsistent.

### Theralytics: recurring appointments create billing errors

Theralytics receives good marks for ease of use and color-coded calendars, but has a critical scheduling-to-billing defect. *"If one day a session that is scheduled as recurring is different, any changes could cause errors in the produced claim"* (Capterra). One reviewer reported *"an entire year's worth of claims denied as duplicates because the system is incapable of correctly bundling alike sessions."* Connectivity issues cause notes to disappear: *"Staff write notes in a separate document and cut and paste because they were having to rewrite notes so often."*

### WebABA (Ensora ABA Suite): appointment editing bugs and sync failures

WebABA users report that *"when canceling or editing an appointment, I've had an issue of the appointment moving to an earlier date several times"* (Capterra). Integration with Catalyst data collection is unreliable: *"Notes between WebABA and Catalyst do not sync up on the same day."* The system is described as *"not user friendly"* with basic UX problems like dropdown menus not in alphabetical order and no way for employees to enter lunch breaks.

### SimplePractice: not built for ABA at all

SimplePractice is a general practice management tool adopted by some solo ABA providers but fundamentally lacks ABA-specific features. No authorization tracking, no provider credential matching, no session-type management, no group notes for 3+ participants, and no bulk operations. A **catastrophic March 2025 outage** locked *"thousands of healthcare professionals"* out of schedules for an entire business day.

### AlohaABA: solid PM but no native mobile app

AlohaABA earns praise for scheduling ease and authorization verification within the scheduling workflow. However, it lacks a native mobile app (browser-only), has a steep learning curve for small teams, and creates integration headaches when paired with separate clinical data collection tools requiring double data entry.

### AccuPoint: quality declined after Therapy Brands acquisition

Users who initially praised AccuPoint report declining quality: *"I loved it for the first 2 years but ended up switching after it was bought out by Therapy Brands"* (Capterra). Scheduling is described as *"not that user friendly"* with *"a lot of behind-the-scenes issues we have no control over."*

### Motivity, Hi Rasmus, Raven Health, Hipp Health, Passage Health

These newer platforms have fewer negative reviews but also less market validation. **Motivity** is primarily clinical/data collection with scheduling as an add-on module—users find it *"overly complex and awkward."* **Raven Health** is praised for mobile-first design and offline capability but is early-stage. **Hipp Health** markets AI scheduling but has minimal third-party reviews. **Passage Health** shows promise on authorization tracking but App Store reviews cite *"major flaws"* and sessions not displaying. **Hi Rasmus** has virtually no independent negative reviews, suggesting either excellent product or insufficient market penetration for feedback.

---

## 4. How scheduling pain differs by role

### BCBAs face supervision scheduling nightmares

BCBAs must juggle their own clinical caseload alongside **5% supervision obligations** for every RBT they oversee—a target that shifts monthly based on RBT hours worked. They must coordinate three-way availability (BCBA + RBT + client) for direct observation sessions, maintain the individual-vs.-group supervision balance (at least 50% individual), and track the **60-day compliance clock** that could suspend RBT certifications. Most BCBAs manage this via personal spreadsheets. *"80% of BCBAs report no formal training in determining ABA service hours"* (RethinkBH survey of 390 BCBAs), and **58% say stress has led them to consider leaving the profession**.

### RBTs bear the financial brunt of scheduling failures

RBTs are hourly employees who don't get paid when clients cancel—and with a **38% average cancellation rate**, income instability is severe. *"With high rates of cancellations, inconsistent hours and financial strain can quickly compound, leading to frustration, burnout, and staff dissatisfaction"* (CentralReach). RBTs also shoulder unpaid drive time between in-home clients, unreliable mobile apps that lose session data, and schedules largely dictated by family availability rather than their own preferences. The result: **~45% annual RBT turnover**, with 40% citing scheduling conflicts as a top reason for leaving.

### Admins and schedulers drown in manual coordination

Scheduling coordinators at ABA practices perform what amounts to a daily multi-constraint optimization problem—matching therapist credentials, client authorizations, geographic proximity, family availability, supervision requirements, and payer rules—using tools designed for simple appointment booking. *"Schedulers spend entire days fighting the tool instead of optimizing the schedule."* At scale, practices require **multiple full-time schedulers** (one provider reported needing dedicated scheduling staff for 3,000 employees across 86 clinics). Seasonal transitions, therapist turnover, and the daily cancellation cascade consume most of their time.

### Billing staff discover scheduling errors weeks too late

The handoff between "scheduled" and "billable" is where revenue leaks. Billing staff discover overlapping time blocks, exceeded authorization limits, wrong provider-code pairings, and missing modifiers only during claims submission—often weeks after the sessions occurred. *"Authorization tracking without proper configuration means providers risk exceeding approved hours"* (BillingParadise). Theralytics users reported an entire year of claims denied as duplicates due to scheduling-billing sync errors that went undetected.

---

## 5. Edge cases that break most scheduling software

**Authorization period mid-change.** When a client's authorization renews with different approved hours or codes, recurring sessions must be split and rebuilt at the boundary date. Most platforms require manual deletion and recreation of the entire recurring series.

**Full caseload reassignment after therapist departure.** When an RBT leaves (happening at 45% annual rate), their 5–8 clients need simultaneous reassignment requiring credential verification, authorization checks, family-therapist matching, and drive-time recalculation for each—a multi-dimensional problem no platform handles as a batch operation.

**Concurrent-but-not-overlapping billing on the same day.** Codes 97155 and 97156 can be billed on the same day but must occur in completely separate time blocks—never in the same 15-minute unit. Software that allows same-day scheduling without enforcing non-overlap creates denials.

**Cross-state telehealth licensure.** A BCBA licensed in State A scheduling a telehealth parent training session with a family who moved to State B faces a licensure violation. **No ABA platform performs automated cross-state licensure verification** during scheduling.

**Split-shift labor law compliance.** When rescheduling creates two short sessions with a long gap (e.g., 9–11 AM and 4–6 PM), some state laws require split-shift premium pay. *"Session shifts might interfere with mandated meal/rest breaks"* (MissionViewpoint). No scheduling software flags these labor law implications.

**Holiday in the middle of a recurring series.** Deleting a single instance from a recurring pattern often breaks the series logic, requiring manual restoration of subsequent sessions. Few platforms offer holiday-aware recurring sessions with configurable holiday calendars.

**Insurance re-credentialing during active caseload.** If a provider's insurance credentialing lapses, all their scheduled sessions become unbillable—but no platform monitors credentialing status against the active schedule.

**TRICARE parent training deadline tracking.** TRICARE requires specific parent training milestones (first session within 30 days, 6 within 6 months). Missing these jeopardizes the entire ACD enrollment. No scheduling platform tracks these milestone deadlines proactively.

---

## 6. Features practitioners want that no platform delivers

Based on practitioner posts, consultant blogs, and review site wishlists, these are the most frequently requested capabilities that remain unbuilt across the industry:

- **Predictive cancellation forecasting** using historical data to identify which sessions are likely to cancel and proactively schedule backups—*"Failing to have a methodological process to find the cancellation pattern"* leaves clinics reactive rather than preventive
- **Real-time traffic-aware drive-time optimization** that accounts for time of day, weather, and actual road conditions rather than static distance calculations
- **Authorization pacing dashboards** showing projected utilization versus actual, factoring in historical cancellation rates and remaining calendar days, with alerts when clients are falling behind pace—currently practitioners resort to spreadsheets for these calculations
- **One-click seasonal schedule transitions** converting school-year schedules to summer schedules (and back) across all clients simultaneously
- **Scenario planning and what-if modeling** answering questions like "what happens to our schedule and utilization if we lose this RBT?"—enabling proactive rather than reactive management
- **Supervision compliance forecasting** that tracks real-time progress toward the 5% monthly threshold for every BCBA-RBT pair and auto-suggests supervision sessions when ratios are at risk
- **Integrated waitlist-to-caseload pipeline** handling priority scoring, insurance verification, authorization tracking, therapist matching, and schedule building as one continuous automated workflow
- **Payer-aware scheduling rules engine** that automatically enforces the correct daily unit caps, concurrent billing rules, group size limits, and modifier requirements based on each client's specific insurance plan
- **PTO impact analysis** showing which clients are affected when a therapist requests time off, whether those clients will still meet authorization minimums, and suggesting qualified backup therapists

---

## 7. Payer scheduling rules reference

| Payer/State | Daily Unit Cap | Concurrent ABA Billing | Required Gaps/Breaks | Supervision Rules | Group Size Max | Assessment Window | Key Scheduling Constraint |
|---|---|---|---|---|---|---|---|
| **CMS (Medicaid MUE)** | 32 units for 97153; 8 for 97156; 6 for 97157/97158 | 97153+97155 allowed with different QHPs only | None specified | N/A (defers to BACB) | 2–8 (CPT standard) | N/A | Many commercial payers incorrectly apply stricter Medicare MUEs |
| **Texas Medicaid** | 32 combined units/day across 97153+97154+97155+97158 | Prohibited—no concurrent ABA providers | N/A | Per BACB | Per CPT standard | 97151: within 30 days of first DOS | RBTs may NOT deliver telehealth; most restrictive concurrent billing rule |
| **Florida Medicaid** | Per managed care plan | Allowed only when BA needed to complete another medical service | Per plan | Supervisor reimbursed for observation | **6 maximum** (stricter than CPT) | Up to 6-month auth periods | Each MCO (Sunshine, Humana, United) has different requirements |
| **California Medi-Cal** | Per managed care plan | Per ABA Coding Coalition rules | Per county MHP | Per BACB | Per CPT standard | Progress reports every 6 months | County-level variation in Mental Health Plan rules |
| **New York Medicaid** | First 60 min (4 units) billed per DOS, then 15-min increments | Per CPT rules | N/A | LBA supervises max 6 CBAAs; CBAAs cannot bill FFS directly | 8 for 97158 | Treatment plan updates every 6 months | ABA carved into Managed Care Jan 2023—each MMC plan has different rules |
| **Massachusetts MassHealth** | No annual/lifetime caps—purely medical necessity | Per CPT rules | N/A | Per BACB | Per CPT standard | Per MCE (MBHP, Beacon) | Forthcoming accreditation requirement for ABA providers |
| **TRICARE (ACD)** | 6 units/day for 97157/97158 | Excluded for all ACD Category I codes | N/A | One ABA supervisor per child only | 8 maximum | 97151: all units within **14 days** of first DOS | Parent training: 1st session within 30 days, 6 within 6-month auth; school-based RBT NOT covered |
| **UHC/Optum** | 32 units/day for 97153 | 97153+97155 allowed with different QHPs | 97155+97156 must be separate time blocks | Per CPT rules; modifiers HM/HN/HO required | Per CPT standard | No precert for 97151/97152 if BCBA + autism dx | Recovery/non-reimbursement for exceeding 32 units |
| **Anthem BCBS** | Per NCCI MUE edits | 97153+97155 allowed only when both QHP and tech are face-to-face simultaneously | N/A | Documentation: start/stop times + total minutes required | Per CPT standard | Signature within 30 days of DOS | Reported rate reductions for 97153/97155 in IN, OH, TX |
| **Cigna/Evernorth** | Per NCCI edits | ABA NOT covered when delivered simultaneously with ANY other therapy modality | N/A | Per CPT rules | Per CPT standard | Treatment data within 60 days of review period start | Strictest cross-modality exclusion in the market |

---

## Conclusion: the scheduling gap is a market opportunity hiding in plain sight

The ABA scheduling problem is fundamentally a **real-time, multi-constraint optimization problem** that current platforms treat as simple calendar management. The gap between what practitioners need and what software delivers is enormous—and it directly causes revenue loss, compliance violations, staff burnout, and therapist turnover. Three structural insights stand out from this research.

First, **the scheduling-to-billing handoff is where money dies**. The disconnect between what gets scheduled and what is actually billable—due to authorization limits, concurrent billing rules, provider credential mismatches, and payer-specific unit caps—creates a systematic revenue leak that most practices don't quantify until claims are denied weeks later. A payer-aware scheduling rules engine that prevents unbillable sessions from being created in the first place would be transformational.

Second, **cancellation management is the single highest-ROI problem to solve**. With a 38% average cancellation rate and no platform offering automated cascade recovery (waitlist auto-fill + drive time recalculation + authorization impact check + labor law compliance), every practice leaves hundreds of thousands of dollars of billable hours unfilled annually. The practice that documented reducing cancellations from 30% to 17% through better tooling generated millions in recovered revenue.

Third, **supervision compliance tracking is an unserved regulatory need**. The BACB's 5% monthly supervision requirement, combined with individual-vs.-group ratios, direct observation mandates, and the 60-day suspension clock, creates a compliance burden that every practice manages via spreadsheets. The first platform to offer real-time supervision ratio tracking with proactive scheduling recommendations will capture significant market share among compliance-conscious organizations. The market is beginning to respond with AI scheduling tools from CentralReach, Motivity, Hipp Health, and others—but these remain early-stage, expensive add-ons rather than foundational platform capabilities.