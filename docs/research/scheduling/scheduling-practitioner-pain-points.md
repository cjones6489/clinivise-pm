# ABA Scheduling: Practitioner Pain Points Research

> **Purpose:** Catalog real-world scheduling frustrations from BCBAs, RBTs, clinic managers, and schedulers to inform Clinivise's scheduling feature priorities. Complements `scheduling-domain-research.md` (clinical workflows) and `scheduling-calendar-competitive-research.md` (software patterns).
>
> **Last updated:** 2026-03-28
>
> **Research method:** Practitioner blog posts, ABA industry publications, vendor case studies, press releases (RethinkBH 2025 BCBA survey), Behavioral Health Business, ABA Resource Center, Chief Motivating Officers, Mission Viewpoint, BillingParadise, peer-reviewed cancellation studies.

---

## Summary

ABA scheduling is uniquely painful because it sits at the intersection of clinical requirements, payer rules, family availability, geographic logistics, and labor law. Unlike typical healthcare scheduling (provider has fixed office hours, patient books a slot), ABA scheduling is a multi-constraint optimization problem that changes daily. The research uncovered 20 distinct pain points, organized by who experiences them.

**Key statistics that frame the problem:**
- **38% average cancellation rate** per client (peer-reviewed study: 5.2 cancelled vs 9.0 completed appointments)
- **61% of BCBAs** say administrative burden interferes with direct patient care (RethinkBH survey, n=390)
- **58% of BCBAs** are considering leaving the profession due to role stress
- **40% of RBTs** leave their roles within two years, with scheduling conflicts as a top reason
- **72% of ABA professionals** report high burnout levels
- **Only 25%** of a BCBA's week goes to client therapy; 38% goes to billable non-therapy tasks
- **80% of BCBAs** received no formal training in determining therapy hours/dosing
- A scheduler's productivity ceiling without automation: **75-100 clients per FTE**

---

## Pain Points

### 1. The Cancellation Cascade

**Who:** Scheduler, RBT, BCBA, clinic owner
**What goes wrong:** A single cancellation triggers a chain reaction. The RBT loses income (paid hourly, only for rendered sessions). The scheduler scrambles to find a fill or makeup session. The BCBA's supervision observation gets displaced. The client loses therapy continuity. The authorization utilization falls behind pace.
**How often:** Daily. With a 38% cancellation rate, a clinic with 50 active clients sees roughly 25-30 cancelled sessions per week.
**Impact:** Lost revenue (unbillable hours), RBT income instability, client regression from inconsistent therapy, scheduler spending entire days reactive instead of proactive.
**What they wish software did:** Auto-suggest replacement sessions based on open RBT availability, client authorization remaining, and geographic proximity. Real-time cancellation notifications to all affected parties. Cancellation pattern analytics to identify which clients/days/seasons are highest risk.

**Source:** [BillingParadise](https://www.billingparadise.com/blog/reduce-aba-cancellations-boost-revenue/), [Chief Motivating Officers](https://chiefmotivatingofficers.com/aba-session-cancellation), [Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)

---

### 2. RBT Income Instability from Unpredictable Hours

**Who:** RBT (most acutely), clinic owner (retention)
**What goes wrong:** RBTs are hourly employees paid only for rendered sessions. When clients cancel, the RBT's paycheck shrinks unpredictably. Staff are "promised certain hours upon hire but report concerns that the company only has fewer hours to give them." Many RBTs work split shifts (morning session, 2-hour gap, afternoon session) with unpaid gaps.
**How often:** Weekly. Last-minute cancellations and fluctuating caseloads create chronic hour unpredictability.
**Impact:** 40% of RBTs leave within two years. "Many clinics lose capacity not because of lack of clients, but because of burnout and unpredictable schedules." RBT turnover costs clinics heavily in recruiting and training.
**What they wish software did:** Guaranteed-hours tracking that shows projected vs actual hours per RBT. Automatic gap-filling when cancellations occur. Fair workload distribution visibility so no single RBT absorbs disproportionate cancellations.

**Source:** [Measure PM](https://measurepm.com/blog/maximizing-rbt-retention), [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [ABA Matrix](https://www.abamatrix.com/aba-scheduling-made-simple-for-better-outcomes/)

---

### 3. Drive Time as Hidden Workload

**Who:** RBT, scheduler
**What goes wrong:** Home-based ABA therapy means RBTs travel between client homes. "30% of RBTs were driving over an hour between sessions" at one mid-sized California clinic before restructuring. Most scheduling systems calculate distance (miles) rather than real-time drive duration. "5 miles can take 45 minutes" in metro areas. Small address changes can collapse a balanced caseload.
**How often:** Daily. Every session transition involves travel math.
**Impact:** Unpaid drive time is a leading indicator for RBT turnover. A California clinic achieved a 25% reduction in RBT turnover in 6 months after restructuring assignments based on travel data. Labor law risks: paid travel time obligations, meal/rest break violations, split shift premiums, unexpected overtime thresholds.
**What they wish software did:** Real-time drive time calculation (not just distance), territory-based RBT assignment, automatic travel buffer insertion between sessions, drive time equity tracking across staff.

**Source:** [Measure PM](https://measurepm.com/blog/maximizing-rbt-retention), [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [Behaviorist Book Club](https://behavioristbookclub.com/workload-scheduling-optimization-in-aba-caseloads-schedules-and-burnout-prevention-real-world-examples-and-case-applications/)

---

### 4. Authorization-Schedule Disconnect

**Who:** Scheduler, billing staff, BCBA
**What goes wrong:** "A calendar can look full while still hiding unbillable hours -- hours get booked outside authorization limits, a provider covers a session they weren't eligible for, or documentation doesn't line up with the payer's expectations." These issues aren't obvious until the billing cycle hits. Every hour of authorized time that goes unused is direct revenue loss; every hour billed beyond authorization is a denial or clawback.
**How often:** Ongoing, but the pain surfaces monthly at billing time.
**Impact:** Claim denials, revenue clawbacks, wasted authorized hours. BCBAs frequently underutilize their protocol modification (97155) and treatment guidance hours because nobody tracks them at scheduling time. Authorizations expire with unused hours.
**What they wish software did:** Real-time authorized-vs-scheduled-vs-rendered hours visibility at the point of scheduling. Automatic alerts when scheduling would exceed authorization limits or when utilization is falling behind pace. Block scheduling sessions for CPT codes not on the authorization.

**Source:** [Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/), [CentralReach](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/), [Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)

---

### 5. Credential-Payer Mismatch at Scheduling Time

**Who:** Scheduler, billing staff
**What goes wrong:** An RBT is scheduled for a client whose insurance requires a credentialed provider. But the RBT isn't paneled with that specific payer. Or a BCaBA bills a QHP-only code. The session happens, the note is written, but the claim gets denied weeks later. "Therapists may be credentialed with one insurance company but not with another." Some clinics rush therapists to deliver service before obtaining credentials, resulting in denials.
**How often:** Per scheduling decision for new client-therapist pairings.
**Impact:** Claim denials discovered weeks/months after the session. Wasted clinical effort. Revenue loss. The scheduler must track which providers are credentialed with which payers -- often in a separate spreadsheet.
**What they wish software did:** Automatic credential-payer validation at scheduling time. Flag when assigning a provider who isn't credentialed with the client's payer. Surface credential expiration dates proactively.

**Source:** [Plutus Health](https://www.plutushealthinc.com/post/bcba-credentialing-for-aba-practices), [CentralReach](https://centralreach.com/blog/aba-credentialing-for-providers-starting-an-aba-practice/), [Your Missing Piece](https://yourmissingpiece.com/resources/credentialing-delays-what-providers-should-know/)

---

### 6. Family Availability is a Moving Target

**Who:** Scheduler, BCBA
**What goes wrong:** "Families' session windows revolve around work, school, therapies, naps, and extracurriculars -- and shift frequently." School calendars create seasonal upheaval: summer opens daytime hours, back-to-school compresses everything into after-school windows. Holidays, teacher workdays, and sibling schedules create unpredictable disruptions. A family might be available Mon/Wed/Fri 3-6pm in September but need a complete reschedule in October.
**How often:** Seasonally (major disruption 2-4x/year), with minor adjustments weekly.
**Impact:** Scheduling templates break every time the school calendar shifts. Sessions that worked for 3 months suddenly don't fit. The scheduler rebuilds large portions of the schedule several times per year.
**What they wish software did:** Family availability profiles that can be versioned (school year vs summer vs holidays). Template-based scheduling that can be bulk-adjusted when availability patterns change. Self-service family availability updates.

**Source:** [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)

---

### 7. Supervision Scheduling Complexity

**Who:** BCBA, scheduler
**What goes wrong:** BACB requires BCBAs to provide supervision for at least 5% of each RBT's monthly service hours, with at least 2 contacts per month and at least 1 in-person direct observation. The BCBA must physically overlap with the RBT's session to observe. This means the BCBA's schedule is partially dictated by when their RBTs are working, but the BCBA also has their own direct therapy sessions, parent training, assessments, and non-billable admin. Coordinating all of these is a puzzle.
**How often:** Monthly planning, weekly adjustment.
**Impact:** If an RBT goes 60 consecutive days without supervision, BACB may suspend their certification. Supervision shortfalls are a compliance risk. BCBAs report feeling "trapped in impossible schedules" trying to cover supervision across a large caseload.
**What they wish software did:** Automatic tracking of supervision hours per RBT against the 5% threshold. Visual overlay showing which RBT sessions lack a scheduled supervision contact this month. Alert when an RBT is approaching the 60-day no-supervision cliff.

**Source:** [BACB](https://www.bacb.com/supervision-and-training/), [All Star ABA](https://www.allstaraba.org/rbt-supervision-hours), [ABA Centers FL](https://abacentersfl.com/blog/managing-bcba-burnout/)

---

### 8. The BCBA Administrative Time Trap

**Who:** BCBA
**What goes wrong:** BCBAs spend only 25% of their week on direct client therapy. 38% goes to billable-but-non-therapy tasks (supervision, assessments, treatment planning). The remaining ~37% is non-billable administrative work: scheduling, meeting coordination, report writing. "61% of BCBAs say administrative tasks divert attention from patient care." Scheduling is often only done in terms of billable hours: "If you only schedule billable sessions, you steal time from notes, travel, and supervision. That is how burnout starts."
**How often:** Constant -- it's the shape of every BCBA's week.
**Impact:** 89% of BCBAs experience work-related stress. 58% are considering leaving the profession. One-third have operated under extreme stress for 2+ years. 46% prioritize clients' well-being over their own mental health.
**What they wish software did:** Schedule non-billable time blocks (notes, travel, supervision prep) alongside billable sessions so the full workload is visible. Caseload capacity planning that accounts for total hours, not just billable hours.

**Source:** [RethinkBH Survey](https://www.prnewswire.com/news-releases/61-of-bcbas-say-administrative-tasks-are-diverting-attention-from-patient-care-new-rethinkbh-survey-finds-302606879.html), [Behaviorist Book Club](https://behavioristbookclub.com/workload-scheduling-optimization-in-aba-caseloads-schedules-and-burnout-prevention-real-world-examples-and-case-applications/)

---

### 9. Multi-System Scheduling Chaos

**Who:** Scheduler, clinic owner, all staff
**What goes wrong:** "Behind the scenes of most ABA clinics is a pile of disconnected tools, sticky notes, Excel files. Scheduling handled in one platform, billing in another, data collection in a third, and compliance spread across three shared drives." Manual spreadsheet scheduling seems cheap but breaks as the practice grows: "Manual data entry, constant updates, and tracking changes across multiple sheets can lead to errors and unnecessary delays."
**How often:** Constant operational friction.
**Impact:** Double-entry, miscommunication, administrative backtracking. Data silos mean the scheduler can't see authorization status, credential status, or billing history when making scheduling decisions. Errors compound: a scheduling mistake becomes a billing mistake becomes a compliance issue.
**What they wish software did:** One system where scheduling, authorizations, credentials, and billing data are all visible in context. No tab-switching to check if a provider is credentialed before assigning them to a client.

**Source:** [S-Cubed](https://scubed.io/blog/top-challenges-aba-clinics-face-and-how-aba-practice-management-software-solves-them), [ABA Matrix](https://www.abamatrix.com/practical-tips-to-streamline-administrative-tasks-for-aba-therapy-clinics/), [ABA Toolbox](https://www.abatoolbox.com/post/guide-to-managing-aba-schedules)

---

### 10. Software Click Fatigue (CentralReach Problem)

**Who:** Scheduler
**What goes wrong:** CentralReach, the dominant ABA PM platform, requires "15-20 clicks to reschedule or modify a single appointment." When a scheduler handles 20+ cancellations in a day, that's 300-400 clicks just for rescheduling. "Schedulers spend entire days fighting the tool instead of optimizing the schedule." The platform offers "limited matching logic," forcing cross-referencing with manual spreadsheets for credentials, language, and travel radius.
**How often:** Every scheduling action, every day.
**Impact:** Scheduler productivity capped at 75-100 clients per FTE. Reactive mode instead of proactive optimization. No real-time utilized-vs-authorized hours dashboard. No cancellation heat maps for pattern identification.
**What they wish software did:** 1-3 click rescheduling. Intelligent therapist-client matching built into the scheduling UI. Cancellation heat maps. Real-time authorization utilization visible on the calendar.

**Source:** [Serious Development](https://blog.seriousdevelopment.com/cracking-the-centralreach-scheduling-bottleneck/), [CentralReach Reviews](https://www.selecthub.com/p/medical-software/centralreach/)

---

### 11. Therapist-Client Matching is Multi-Dimensional

**Who:** Scheduler, BCBA
**What goes wrong:** Matching isn't just "who's available." It requires checking: clinical expertise (autism experience, specific behavioral specialties), language needs, gender preferences, cultural fit, credential status with the client's payer, geographic proximity, EVV restrictions, and personality compatibility. "It's not always easy to find a therapist who is suitable for a particular child." When pairings are poor, "learners resist transitions, sessions get cut short, parents cancel frequently, and technicians experience burnout."
**How often:** Every new client intake, every RBT absence requiring coverage, every caseload rebalance.
**Impact:** Poor matching drives cancellations, client dissatisfaction, and RBT turnover. But good matching requires synthesizing information scattered across multiple systems.
**What they wish software did:** Matching criteria stored per client (language, preferences, behavioral complexity). Filter available providers by all relevant criteria at once. Track match quality over time (cancellation rate per pairing).

**Source:** [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [CentralReach](https://centralreach.com/blog/aba-scheduling-7-solvable-challenges-holding-your-practice-back/)

---

### 12. Waitlist-to-Schedule Bottleneck

**Who:** Scheduler, clinic owner, families
**What goes wrong:** "75% of caregivers experience waitlists; average wait time is 5.7 months." When a slot finally opens, the scheduler must match the new client's authorized hours, family availability, geographic location, and payer requirements against available therapist capacity. Meanwhile, "families place themselves on multiple waitlists simultaneously" -- slow intake means lost clients. "Insurance verification is often the biggest intake bottleneck."
**How often:** Per new client intake (ongoing as clients discharge and new slots open).
**Impact:** Revenue loss from slow onboarding. Families leave for competitors who onboard faster. "Clinics that use automated intake forms convert clients 40-60% faster." Annual BCBA/RBT turnover of 77-103% means constant caseload churn that requires re-matching.
**What they wish software did:** Waitlist integrated with the scheduling calendar so open slots are immediately visible. Automated matching of waitlisted clients to newly available time slots. Insurance verification status visible in the waitlist view.

**Source:** [CentralReach](https://centralreach.com/blog/waitlist-management-4-challenges-facing-aba-organizations/), [BillingParadise](https://www.billingparadise.com/blog/aba-waitlist-management-solutions/)

---

### 13. Cancellation Notification Failures

**Who:** RBT, BCBA, families
**What goes wrong:** When a cancellation happens, multiple people need to know: the assigned RBT (stop driving), the supervising BCBA (if it was an observation session), the scheduler (find a fill), the family (confirm). In manual systems, "changes slip through cracks... leaving staff arriving to sessions that don't exist." Two-way communication is slow: native CentralReach lacks "two-way SMS/Client App appointment proposals," causing "slow caregiver/RBT responses."
**How often:** Daily (at the 38% cancellation rate).
**Impact:** RBTs drive to cancelled sessions (wasted time and mileage). BCBAs lose planned supervision observations. Families don't get rescheduling options promptly. Open slots go unfilled because nobody knew about them in time.
**What they wish software did:** Instant multi-channel notifications (push, SMS, email) to all affected parties. Two-way confirmation so families can accept/decline reschedule proposals. Real-time calendar sync so RBTs see changes immediately on their phones.

**Source:** [CentralReach](https://centralreach.com/blog/aba-scheduling-7-solvable-challenges-holding-your-practice-back/), [Serious Development](https://blog.seriousdevelopment.com/cracking-the-centralreach-scheduling-bottleneck/)

---

### 14. Seasonal Schedule Upheaval

**Who:** Scheduler, all staff, families
**What goes wrong:** ABA scheduling has predictable seasonal disruptions that still catch practices off guard. Summer: school ends, daytime hours open up, families go on vacation. Back-to-school: schedules compress into 3-6pm windows, demand spikes. Holidays: "Mondays and Fridays tend to stretch thin. After long weekends or holidays, it's harder to stick to routines." Winter weather: transportation issues, especially for home-based sessions.
**How often:** 4-6 major disruptions per year, with predictable weekly patterns (Monday/Friday weakness).
**Impact:** The scheduler rebuilds significant portions of the master schedule multiple times per year. Therapists lose hours during vacation seasons. Authorization utilization targets get disrupted.
**What they wish software did:** Seasonal schedule templates (school year, summer, holiday). Bulk schedule adjustment tools. Proactive alerts showing how seasonal changes will impact authorization utilization.

**Source:** [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)

---

### 15. Hours Determination is Guesswork

**Who:** BCBA
**What goes wrong:** "80% of BCBAs lack formal training in determining service hours." Most master's programs don't cover it. Only "9% use data-based software or technology to determine ABA hours." The process is "more of an art than a science." Yet the prescribed hours become the authorization request, which becomes the scheduling target, which drives revenue. If the BCBA recommends 25 hours/week but only 15 are realistically schedulable given family availability, the authorization underutilizes.
**How often:** Per client, at assessment and reauthorization (every 3-6 months).
**Impact:** Misaligned hours recommendations lead to systematic under- or over-utilization. Authorizations expire with unused hours. Or families can't sustain the recommended intensity and cancel frequently.
**What they wish software did:** Historical data on actual hours rendered vs. authorized per client/family profile. Scheduling feasibility check before submitting the authorization request. "What-if" modeling: "If I recommend 20 hours/week, can we actually schedule it given this family's availability and our staff capacity?"

**Source:** [Behavioral Health Business](https://bhbusiness.com/2025/11/11/80-of-bcba-report-no-training-in-determining-aba-hours/), [RethinkBH Survey](https://www.prnewswire.com/news-releases/61-of-bcbas-say-administrative-tasks-are-diverting-attention-from-patient-care-new-rethinkbh-survey-finds-302606879.html)

---

### 16. Part-Time RBT Availability Fragility

**Who:** Scheduler
**What goes wrong:** "Many RBTs work part-time while studying or holding other jobs." Their availability changes between semesters, around exam periods, and when other job schedules shift. High turnover (40% within 2 years, 77-103% annually at some organizations) means the scheduler is constantly rebuilding caseloads. When an RBT leaves, all their clients need reassignment simultaneously.
**How often:** Semester boundaries (2-4x/year major shifts), with constant micro-adjustments.
**Impact:** Recurring template schedules break when RBT availability shifts. Clients experience provider changes that disrupt rapport and clinical continuity. The scheduler faces "an endless shuffle of new RBTs, new client matches, new schedules."
**What they wish software did:** RBT availability profiles with future-dated changes (e.g., "starting January, available M/W/F only"). Impact analysis when an RBT's availability changes: "Here are the 8 clients affected and potential replacement options." Automated caseload rebalancing suggestions.

**Source:** [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [ABA Resource Center](https://www.abaresourcecenter.com/post/reducing-high-rates-of-turnover-in-aba-rbt-bcba)

---

### 17. Documentation Completion Tied to Schedule

**Who:** RBT, BCBA, billing staff
**What goes wrong:** "When staff don't submit documentation and timesheets, delays cascade through claims and payroll processing." Notes are due after each session, but the time to write them isn't scheduled. Burnout warning signs include "notes are consistently late" and "staff skip breaks or eat while driving." Session notes that don't match the scheduled service type or duration trigger claim denials.
**How often:** After every session (daily for active RBTs).
**Impact:** Late notes delay billing. Mismatched notes cause claim denials. "When you do not plan for non-billable work, it does not disappear. It just happens off the clock, during lunch, or late at night."
**What they wish software did:** Built-in note-writing time blocks after sessions. Session-to-note continuity (pre-populated fields from the schedule). Visibility into which sessions lack completed notes. Alerts for documentation deadlines.

**Source:** [CentralReach](https://centralreach.com/blog/aba-scheduling-7-solvable-challenges-holding-your-practice-back/), [Behaviorist Book Club](https://behavioristbookclub.com/workload-scheduling-optimization-in-aba-caseloads-schedules-and-burnout-prevention-real-world-examples-and-case-applications/)

---

### 18. Inconsistent Client Experience from Provider Churn

**Who:** Families, clients, BCBA
**What goes wrong:** Without centralized scheduling, "clients see different therapists throughout the week" with varying approaches. High RBT turnover (40-103% annually) means children constantly adjust to new people. Cancellation-driven coverage swaps mean unfamiliar RBTs show up. "When pairings are poor, learners resist transitions, sessions get cut short, parents cancel frequently."
**How often:** Weekly for coverage swaps; quarterly for turnover-driven changes.
**Impact:** Client regression, family dissatisfaction, increased cancellation rates (families cancel when the "wrong" therapist is scheduled). Disrupted clinical rapport undermines treatment outcomes.
**What they wish software did:** Primary/backup therapist assignments per client. Track consistency metrics (how often does the primary RBT actually work with this client?). Minimize unnecessary provider changes by making them visible to decision-makers.

**Source:** [S-Cubed](https://scubed.io/blog/top-challenges-aba-clinics-face-and-how-aba-practice-management-software-solves-them), [CentralReach](https://centralreach.com/blog/the-scheduling-dilemma-managing-cancellations-in-aba/)

---

### 19. Labor Law Compliance Blind Spots

**Who:** Clinic owner, scheduler
**What goes wrong:** Rescheduling triggers labor law risks that most ABA scheduling tools don't track. When an RBT's session gets cancelled and they're reassigned to a different location: paid travel time obligations change, meal/rest break compliance may be violated, unexpected overtime thresholds may be crossed, split shift premium penalties may apply (in states like California), and EVV/mileage documentation gaps appear. "Cancellation cascades" aren't just a clinical problem -- they're a labor compliance problem.
**How often:** Every cancellation-driven reschedule.
**Impact:** Wage and hour violations, potential class action lawsuits. One investigation found RBTs "are expected to complete administrative tasks... for which they are not being adequately or at all compensated." The legal exposure is real.
**What they wish software did:** Automatic overtime calculation when rescheduling. Split shift premium alerts. Break compliance tracking. Travel time between locations calculated and flagged when it pushes past paid-travel thresholds.

**Source:** [Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/), [Migliaccio & Rathod](https://classlawdc.com/2021/01/22/investigation-of-failure-to-reimburse-admin-time-for-rbts/)

---

### 20. Workload Inequity Goes Invisible

**Who:** RBTs, BCBA (as supervisor), scheduler
**What goes wrong:** "The same staff members repeatedly flex to cover gaps, eroding team trust and contributing to burnout." Without visibility into workload distribution, some RBTs end up with consistently harder caseloads, longer drive times, or more cancellation-prone clients. The scheduler makes individually reasonable decisions that compound into systemic unfairness.
**How often:** Cumulative -- becomes visible over weeks/months.
**Impact:** Star performers burn out and leave. Other staff feel underutilized. Team morale suffers. "High drive times are a leading indicator for staff turnover."
**What they wish software did:** Workload distribution dashboard: billable hours, drive time, cancellation rate, and caseload complexity per RBT. Equity alerts when one staff member's load is significantly higher than peers. Historical trend tracking.

**Source:** [Behaviorist Book Club](https://behavioristbookclub.com/workload-scheduling-optimization-in-aba-caseloads-schedules-and-burnout-prevention-real-world-examples-and-case-applications/), [Measure PM](https://measurepm.com/blog/maximizing-rbt-retention)

---

## Implications for Clinivise

### Must-Have (addresses pain points experienced daily or causes revenue loss)

1. **Authorization-aware scheduling** -- Real-time auth utilization visible at point of scheduling. Never let a session be scheduled outside auth dates/codes/units without a warning.
2. **Fast rescheduling** -- 1-3 click reschedule with intelligent suggestions. This is the #1 daily workflow for schedulers.
3. **Cancellation management** -- Track reasons, notify all parties, suggest fills, show patterns over time.
4. **Recurring templates with easy exceptions** -- The 80% case is stable weekly schedules with daily deviations.
5. **Provider-client matching context** -- Show credentials, payer enrollment, language, and geographic data when assigning.
6. **Multi-view calendar** -- Day/week views by provider, by client, and by location.

### Should-Have (addresses weekly/monthly pain points)

7. **Supervision tracking overlay** -- Show which RBTs need observation this month against the 5% threshold.
8. **Drive time visibility** -- Calculate and display travel between home-based sessions.
9. **Non-billable time blocks** -- Let BCBAs and RBTs block time for notes, travel, supervision, and admin.
10. **Waitlist-to-schedule pipeline** -- When a slot opens, surface matching waitlisted clients.
11. **Utilization pacing alerts** -- "At current scheduling rate, this auth will expire with 40 unused hours."

### Nice-to-Have (addresses systemic/long-term issues)

12. **Workload equity dashboard** -- Compare RBT workload distribution across the team.
13. **Cancellation analytics** -- Heat maps by day-of-week, client, season, reason.
14. **Family self-service** -- Let families update availability and confirm/decline rescheduled sessions.
15. **Seasonal template management** -- Pre-built schedule variants for school year vs summer.
16. **Labor compliance guardrails** -- Overtime, split shift, and break violation warnings.

---

## Sources

- [BillingParadise - ABA Revenue Rescue](https://www.billingparadise.com/blog/reduce-aba-cancellations-boost-revenue/)
- [Motivity - Scheduling Strategies](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)
- [Behaviorist Book Club - Workload Optimization](https://behavioristbookclub.com/workload-scheduling-optimization-in-aba-caseloads-schedules-and-burnout-prevention-real-world-examples-and-case-applications/)
- [S-Cubed - Top ABA Clinic Challenges](https://scubed.io/blog/top-challenges-aba-clinics-face-and-how-aba-practice-management-software-solves-them)
- [Passage Health - BCBA Burnout](https://www.passagehealth.com/blog/bcba-burnout)
- [RethinkBH Survey (2025)](https://www.prnewswire.com/news-releases/61-of-bcbas-say-administrative-tasks-are-diverting-attention-from-patient-care-new-rethinkbh-survey-finds-302606879.html)
- [Behavioral Health Business - BCBA Hours Training](https://bhbusiness.com/2025/11/11/80-of-bcba-report-no-training-in-determining-aba-hours/)
- [Mission Viewpoint - Why Is ABA Scheduling So Hard](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/)
- [Chief Motivating Officers - Session Cancellation](https://chiefmotivatingofficers.com/aba-session-cancellation)
- [CentralReach - 7 Scheduling Challenges](https://centralreach.com/blog/aba-scheduling-7-solvable-challenges-holding-your-practice-back/)
- [CentralReach - Scheduling Dilemma](https://centralreach.com/blog/the-scheduling-dilemma-managing-cancellations-in-aba/)
- [CentralReach - Waitlist Management](https://centralreach.com/blog/waitlist-management-4-challenges-facing-aba-organizations/)
- [Serious Development - CentralReach Bottleneck](https://blog.seriousdevelopment.com/cracking-the-centralreach-scheduling-bottleneck/)
- [Measure PM - RBT Retention](https://measurepm.com/blog/maximizing-rbt-retention)
- [Your Missing Piece - Optimizing Authorizations](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [Raintree - ABA Turnover](https://www.raintreeinc.com/blog/therapist-turnover-in-aba/)
- [ABA Resource Center - RBT/BCBA Turnover](https://www.abaresourcecenter.com/post/reducing-high-rates-of-turnover-in-aba-rbt-bcba)
- [Migliaccio & Rathod - RBT Admin Time Investigation](https://classlawdc.com/2021/01/22/investigation-of-failure-to-reimburse-admin-time-for-rbts/)
- [ABA Matrix - Practical Tips](https://www.abamatrix.com/practical-tips-to-streamline-administrative-tasks-for-aba-therapy-clinics/)
- [ABA Matrix - Smarter Scheduling](https://www.abamatrix.com/aba-scheduling-made-simple-for-better-outcomes/)
- [Cross River Therapy - Session Cancellations](https://www.crossrivertherapy.com/articles/how-to-handle-session-cancellations-in-aba-therapy)
- [Plutus Health - BCBA Credentialing](https://www.plutushealthinc.com/post/bcba-credentialing-for-aba-practices)
- [SelectHub - CentralReach Reviews](https://www.selecthub.com/p/medical-software/centralreach/)
