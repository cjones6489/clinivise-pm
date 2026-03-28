# ABA Scheduling: Operational Edge Cases Research

> **Purpose:** Document the day-to-day chaos that ABA practice managers deal with -- the operational edge cases that scheduling software must handle gracefully. These are not theoretical; they happen daily/weekly at every practice.
>
> **Last updated:** 2026-03-28
>
> **Research method:** ABA practitioner blogs, BACB documentation, ABA billing specialists, competitor feature analysis, practice management publications, industry workforce data.

---

## Table of Contents

1. [Staff Turnover & Transitions](#1-staff-turnover--transitions) (5 scenarios)
2. [Schedule Disruption Patterns](#2-schedule-disruption-patterns) (7 scenarios)
3. [Geographic & Logistics](#3-geographic--logistics) (5 scenarios)
4. [Multi-Client Complexity](#4-multi-client-complexity) (4 scenarios)
5. [Compliance & Documentation](#5-compliance--documentation) (5 scenarios)
6. [Implications for Clinivise](#6-implications-for-clinivise)

---

## 1. Staff Turnover & Transitions

### 1.1 RBT Quits -- Caseload Orphaned

**Scenario:** An RBT gives two weeks notice (or quits without notice). They have 4-6 clients on a recurring weekly schedule totaling 25-30 billable hours. Every one of those sessions needs a replacement provider or the family loses services.

**Frequency:** Monthly at most practices. Industry turnover is 77-103% annually (77.4% at small practices, 103.3% at enterprise). Some large organizations report 90-100%+ annual RBT turnover. The cost per departure is $15,000-$25,000 when factoring in recruiting, onboarding, lost billable hours, and client disruption.

**Who is affected:** Scheduler (finds replacements), BCBA (redistributes supervision, manages family communication), clients (lose continuity), practice owner (lost revenue during gap).

**What the software should do:**
- When an RBT is deactivated/terminated, surface all their future scheduled sessions as "unassigned" in a bulk reassignment queue
- Show which clients are now without a provider, sorted by next upcoming session
- Filter available RBTs by: geographic proximity to each orphaned client, existing schedule gaps that match the needed time slots, credential status (active RBT certification)
- Track "days without coverage" per client to prioritize reassignment
- Allow bulk reassignment: select multiple sessions, assign to a new RBT in one action
- Preserve the recurring template but swap the provider -- don't force the scheduler to rebuild each client's weekly pattern from scratch

---

### 1.2 New RBT Onboarding -- Overlap/Shadow Sessions

**Scenario:** A new RBT is hired and needs to be introduced to their assigned clients. Best practice is 1-3 overlap sessions where the new RBT shadows the outgoing or experienced RBT during an actual client session. The BCBA also overlaps the first session to ensure fit. During this period, two providers are present for one client's session, but only one session is billable (97153 for the experienced RBT; the new RBT's time is non-billable training).

**Frequency:** Every new hire (monthly at high-turnover practices). Field training typically involves shadowing 2+ different clients across the first 1-2 weeks.

**Who is affected:** Scheduler (must coordinate two providers for one slot), BCBA (supervises introduction), new RBT (onboarding), outgoing/experienced RBT (hosts shadow), client family.

**What the software should do:**
- Support a "shadow/overlap" session type that assigns two providers to one time slot without triggering overlap conflict warnings
- Mark the shadow session as non-billable for the trainee, billable for the primary RBT
- After the overlap period, automatically transition the recurring template from old RBT to new RBT on a specified "handoff date"
- Track onboarding progress: which clients has the new RBT been introduced to, which still need overlap sessions

---

### 1.3 BCBA Leaves -- Caseload Redistribution

**Scenario:** A BCBA leaves the practice. They were supervising 8-15 clients and 3-5 RBTs. Every client needs a new supervising BCBA assigned. Every RBT under that BCBA needs a new supervisor for BACB compliance. Treatment plans, parent training sessions, and supervision schedules must all be reassigned. Unlike RBT turnover, BCBA turnover creates a compliance cascade -- without a supervising BCBA, RBTs technically cannot provide services.

**Frequency:** Quarterly to semi-annually at small practices (BCBA turnover is lower than RBT but more disruptive). A BCBA departure at a 5-BCBA practice affects 20-30% of the entire client base.

**Who is affected:** Every RBT supervised by that BCBA, every client on their caseload, the remaining BCBAs (who absorb extra cases), scheduler (rebuilds supervision calendar), practice owner (revenue and compliance risk).

**What the software should do:**
- Surface the full impact: list all clients, RBTs, and recurring sessions tied to the departing BCBA
- Show remaining BCBAs' current caseload sizes to identify who has capacity (sustainable range: 6-12 comprehensive, 10-15 focused clients per BCBA)
- Support bulk reassignment of the supervising BCBA role across multiple clients
- Automatically flag RBTs who would be left without any active supervisor (compliance violation)
- Recalculate supervision scheduling: new BCBA needs observation sessions with each reassigned RBT, distributed across the month (not all in one day)
- Generate a transition communication checklist: families to notify, treatment plans to transfer, supervision logs to close out

---

### 1.4 Temporary Coverage -- One RBT Covers Another's Clients

**Scenario:** An RBT is out for a day or a week (sick, personal leave, jury duty). Rather than cancel all their sessions, the scheduler tries to find a fill-in RBT for each slot. The fill-in may not know the client, which means the BCBA may need to be present for the first coverage session. Some families refuse a substitute RBT (clinical preference), so those sessions cancel anyway.

**Frequency:** Weekly. Between sick days, personal time, and car trouble, at least one RBT is out on any given week at a practice with 10+ RBTs. Some practices report 1-3 callouts per week.

**Who is affected:** Scheduler (scrambles same-morning to find coverage), fill-in RBT (picks up unfamiliar client), client family (meets new person), BCBA (may need to supervise the fill-in's first session).

**What the software should do:**
- "Provider unavailable" action that marks all of an RBT's sessions for a date range as needing coverage
- Show a coverage board: unassigned sessions on the left, available RBTs (with matching free time) on the right
- Highlight RBTs who have previously worked with each client (better clinical continuity)
- Distinguish between "covered" (substitute assigned), "cancelled -- provider," and "cancelled -- family declined substitute"
- Track coverage patterns over time: which RBTs call out most, which clients refuse substitutes most (operational intelligence for the practice owner)
- Support quick swap: one-click to reassign a single day's session to a different provider without affecting the recurring template

---

### 1.5 Credential Expiration Mid-Schedule

**Scenario:** An RBT's BACB certification expires because they missed their renewal deadline. The BACB offers a 30-day grace period (with late fee), but if missed, the RBT must restart the entire certification process (40-hour training + exam as of 2026). During any lapse, the RBT cannot legally provide or bill for ABA services. All their scheduled sessions must be cancelled or reassigned immediately.

**Frequency:** Quarterly across a practice (individual RBTs have annual renewal dates scattered throughout the year). The recertification competency assessment must occur within 45 days of expiration, creating a narrow window that is commonly missed.

**Who is affected:** The RBT (cannot work), scheduler (emergency reassignment), all clients on that RBT's caseload, BCBA (must complete the competency assessment before renewal).

**What the software should do:**
- Store credential expiration dates for all providers (RBT certification, BCBA certification, state license, CPR, background check)
- Automated alerts at 90/60/30/14/7 days before expiration to the provider, their supervisor, and the practice admin
- If a credential lapses: automatically flag all future sessions for that provider as "credential hold" -- do not allow conversion to billable sessions
- Surface a credential dashboard showing all providers sorted by nearest expiration
- Block session creation for providers with lapsed credentials (warning at creation, hard block at billing)

---

## 2. Schedule Disruption Patterns

### 2.1 Provider Calls Out Sick -- Day-of Cascade

**Scenario:** It's 7:15 AM. An RBT texts that they're sick and can't work today. They have 3 clients scheduled: 9am-12pm (home-based, 25 min drive from office), 1pm-3pm (clinic), 3:30pm-5:30pm (home-based, different direction). The scheduler has 45 minutes to find coverage for 3 different locations, notify 3 families, and potentially rearrange other RBTs' schedules to fill the gaps. Each slot may need a different solution -- one covered, one cancelled, one converted to telehealth.

**Frequency:** Weekly. At a 15-RBT practice, expect 2-4 sick callouts per week across the team.

**Who is affected:** Scheduler (crisis mode), the 3 client families (disrupted), other RBTs (may be asked to extend or shift), BCBA (informed of cancellations affecting auth utilization).

**What the software should do:**
- "Mark unavailable" workflow that instantly shows all affected sessions and triggers the coverage board
- SMS/push notification to families within minutes of a cancellation decision
- Suggest available fill-in RBTs sorted by: proximity to client location, familiarity with the client, current schedule gaps
- Offer telehealth conversion option for BCBA sessions (parent training, protocol modification) that can pivot from in-person to virtual
- Track the reason code for each cancellation (provider sick, provider no-show, family cancelled, weather, etc.) for pattern analysis
- End-of-day summary to practice owner: X sessions scheduled, Y delivered, Z cancelled with reasons

---

### 2.2 Family Vacation -- Template Pause (1-2 Weeks)

**Scenario:** A family tells their BCBA they'll be on vacation for two weeks in July. All 4 weekly sessions (Mon/Wed/Fri direct therapy + Thursday parent training) need to be cancelled for those two weeks, then resume exactly as before. The RBT's newly freed hours could be offered to waitlist clients or used for makeup sessions with other clients. But the template must "wake up" automatically when the family returns.

**Frequency:** Monthly (2-3 families per month during summer, 1 per month otherwise). Peak: June-August and December holidays.

**Who is affected:** Scheduler (pauses and resumes template), RBT (has open hours to fill temporarily), BCBA (tracks impact on auth utilization), family.

**What the software should do:**
- "Pause template" action with start/end dates that cancels all generated sessions in that range but preserves the recurring pattern
- Auto-resume: template generates sessions again after the pause end date without any manual intervention
- Show the RBT's newly available hours as "open for fill-in" so the scheduler can offer them to other clients or waitlist families
- Track the cancellation reason as "family vacation" (distinct from "family cancelled" for reporting)
- Alert if the pause will cause auth under-utilization: "This client will miss 8 units during the pause. They're at 62% utilization with 6 weeks remaining on auth."
- Support recurring annual pauses (same family vacations at the same time every year)

---

### 2.3 Weather/Emergency -- Practice-Wide Cancellation

**Scenario:** A winter storm hits. The practice decides to cancel all in-home sessions for the day. Clinic sessions may continue if the building is accessible. The scheduler needs to cancel 20-40 sessions in one action, notify all affected families and providers, and later help schedule makeup sessions for those who want them.

**Frequency:** 2-6 times per year depending on geography. Southern states: hurricane season. Northern states: snow/ice. All regions: occasional severe weather, power outages, or public health emergencies.

**Who is affected:** Everyone -- all providers, all clients scheduled that day, the scheduler (mass communication), practice owner (significant single-day revenue loss).

**What the software should do:**
- "Emergency closure" action that cancels all sessions for a date (or date range), optionally filtered by session type (cancel home-based only, keep clinic)
- Bulk notification to all affected families and providers via SMS/email
- Cancellation reason auto-set to "weather/emergency" for all affected sessions
- Generate a "makeup session" queue: list of all cancelled sessions sorted by client auth urgency (clients closer to auth expiration or under-utilization get priority)
- Revenue impact calculation: "Today's closure cancelled X sessions = Y billable units = $Z estimated revenue loss"
- Option to convert applicable sessions to telehealth rather than cancelling (BCBA sessions, parent training)

---

### 2.4 School Schedule Transitions (Summer, Holidays)

**Scenario:** It's late May. School ends June 5th. Fifteen clients who currently have after-school sessions (3pm-6pm) now need summer schedules. Summer sessions typically shift earlier (9am-12pm or 10am-2pm) and may increase in frequency (from 3x/week to 5x/week if auth allows). The scheduler must rebuild 15 client templates simultaneously, matching RBT availability to the new time slots. Then in late August, everything reverses.

**Frequency:** Twice per year (May/June and August/September). Smaller transitions for winter break (2 weeks), spring break (1 week), and school holidays throughout the year.

**Who is affected:** Scheduler (massive coordination effort over 2-3 weeks), all school-age clients and their families, RBTs (entire daily pattern shifts), BCBAs (supervision schedule shifts).

**What the software should do:**
- Support "seasonal templates" -- a client can have a "school year" template and a "summer" template, each with different days/times/frequencies
- Bulk template swap: on a specified date, deactivate school-year templates and activate summer templates for selected clients
- Preview mode: before activating, show the scheduler what the new week looks like (conflicts, gaps, over-scheduled RBTs)
- Wizard: "Summer transition" that walks the scheduler through each affected client, showing their current template, proposed summer template, and RBT availability
- Track which clients have transitioned and which still need new templates
- Calendar annotation: "Summer schedule starts June 5" visible to all providers

---

### 2.5 Daylight Saving Time Transition

**Scenario:** Clocks spring forward or fall back. The primary issue is not the software's time handling (most handle UTC correctly) but the human impact: after-school sessions that started at 3:30pm may now feel too early or too late for the family. A client whose sessions were scheduled "right after school" may need the time adjusted by an hour. Some families don't realize the change and show up at the wrong time.

**Frequency:** Twice per year (March and November in the US). Minor but causes 2-3 days of confusion each time.

**Who is affected:** Families (confusion about session times), RBTs (may arrive at wrong time if family miscommunicates), scheduler (fields calls about time changes).

**What the software should do:**
- Send automated reminders 1 week before DST transition: "Reminder: Clocks change this Sunday. Your Monday session is at 3:30 PM [new time zone offset]."
- Display session times in the family's local time zone (relevant for telehealth across time zones)
- Flag sessions within 1 week after DST change with a subtle indicator so providers are alert to potential confusion
- Support easy one-click time adjustment for sessions that need to shift by an hour post-DST

---

### 2.6 Client Hospitalization or Extended Illness -- Temporary Hold

**Scenario:** A client is hospitalized or has a prolonged illness (surgery recovery, extended flu, psychiatric crisis). Services need to pause indefinitely -- the family doesn't know when the child will be ready to resume. Unlike a vacation pause with known dates, this is open-ended. The RBT's hours become available, but the practice doesn't want to permanently reassign the slot because the client will return.

**Frequency:** Monthly across a mid-size practice (1-2 clients at any time). More common in practices serving clients with complex medical needs.

**Who is affected:** Family (communicates with BCBA), BCBA (manages clinical hold, may need to adjust treatment plan on return), scheduler (frees the slot temporarily), RBT (picks up temp coverage for other clients or has reduced hours).

**What the software should do:**
- "Indefinite hold" status on a client's schedule template that cancels future generated sessions without deleting the template
- The freed time slots marked as "temporarily available" (not permanently open)
- When the family is ready to resume, "reactivate" action that restores the template from the hold date forward
- If auth is expiring during the hold, alert the BCBA: "Client X has been on hold for 3 weeks. Their auth expires in 6 weeks with 45% of units remaining."
- Track hold reason (hospitalization, illness, family emergency) for reporting and to distinguish from standard cancellations

---

### 2.7 Mid-Session Crisis -- Remaining Schedule Disrupted

**Scenario:** During a 3-hour session, a client has a severe behavioral crisis (aggression, self-injury, elopement). The RBT follows the crisis protocol, but the session ends 90 minutes early. The RBT needs time to complete the incident report and decompress. Their next session starts in 30 minutes. The scheduler may need to adjust the remaining sessions for that RBT -- push back start times, shorten sessions, or find coverage.

**Frequency:** Weekly at practices serving clients with severe behaviors. Less frequent at practices with primarily mild/moderate caseloads.

**Who is affected:** RBT (emotional/physical impact, documentation burden), the client, BCBA (must be notified immediately, may need to adjust the behavior intervention plan), scheduler (may need to adjust remaining sessions), next client's family (may have a late start or cancelled session).

**What the software should do:**
- "End session early" action that logs actual end time (vs scheduled end time) and prompts for reason code (crisis, illness, family request, etc.)
- If the reason is "crisis/incident," trigger a notification to the supervising BCBA and practice admin
- Show the scheduler the RBT's remaining day with a visual indicator that the current session ended early
- Offer options: extend buffer before next session, cancel next session, find coverage for next session
- Link to incident report workflow (the incident documentation is often required within 24 hours)
- Track frequency of early terminations per client, per RBT, per reason -- patterns inform treatment plan modifications and staffing decisions

---

## 3. Geographic & Logistics

### 3.1 Travel Time Between Home-Based Clients

**Scenario:** An RBT has a 9am-12pm session at Client A's home (north side of town) and a 1pm-4pm session at Client B's home (south side). Google Maps says 35 minutes between locations. The scheduler left a 1-hour gap, but a 12:30pm-1pm gap means the RBT is driving during lunch. If the first session runs 5 minutes late, the RBT arrives late to the second. No scheduling tool accounts for this well -- most treat travel as invisible.

**Frequency:** Daily for every home-based RBT. A typical home-based RBT drives 30-90 minutes per day between clients. In rural areas, travel can consume 2+ hours daily.

**Who is affected:** RBTs (unpaid travel time, gas costs, fatigue), clients (late arrivals), scheduler (must account for geography), practice owner (non-billable hours reduce utilization).

**What the software should do:**
- Store client location (address or at minimum zip code/area) and support distance/drive-time estimation between locations
- When scheduling, automatically calculate travel time between consecutive sessions for the same provider and warn if the gap is insufficient
- Display travel time as a non-billable block on the provider's calendar (visually distinct from sessions and free time)
- Support "geographic clustering": when assigning clients to RBTs, group clients in similar geographic areas to minimize total daily travel
- Track total travel time per RBT per week for operational reporting
- Mileage tracking integration or export for RBT reimbursement

---

### 3.2 Drive Time as Non-Billable but Schedule-Occupying

**Scenario:** An RBT's schedule shows 6 billable hours today. But they also have 90 minutes of drive time between 3 home-based clients. Their actual workday is 7.5 hours, but only 6 are billable. The practice's utilization metrics show 80% for this RBT, but that's misleading -- accounting for travel, this RBT's effective utilization is much higher. The RBT feels overworked despite "only" having 30 billable hours/week because 7-8 hours of weekly driving isn't counted.

**Frequency:** Daily for all home-based providers. This is the single largest source of "invisible" schedule consumption in ABA practices.

**Who is affected:** RBTs (burnout from uncounted work hours), practice owner (misleading utilization metrics), scheduler (must balance travel load, not just session load).

**What the software should do:**
- First-class "travel block" or "non-billable time" on the calendar that occupies schedule space and is visible in availability calculations
- Adjusted utilization metric: billable hours / (total hours - travel time) gives a truer picture of provider productivity
- Travel time factored into availability: if an RBT has a 30-minute drive after their 12pm session, they're not available until 12:30pm, not 12:00pm
- Weekly summary showing each RBT: billable hours, travel hours, admin hours, total work hours
- Alert when travel time pushes an RBT's total work hours above threshold (e.g., >45 hours/week including travel = burnout risk)

---

### 3.3 Urban vs. Rural Scheduling Density

**Scenario:** A practice with both urban and rural coverage areas finds that their urban RBTs can serve 5 clients/day (15-minute drives between nearby homes and the clinic) while their rural RBTs can only serve 2-3 clients/day (45-60 minute drives between clients). Rural clients may require 2-3 hours of driving for the RBT per day. Standard caseload metrics don't account for this: a rural RBT with 20 billable hours/week and 10 hours of travel is working as hard as an urban RBT with 32 billable hours and 3 hours of travel.

**Frequency:** Constant for practices in mixed-density areas. Rural families may drive 2-3 hours each way for clinic-based services; rural home-based RBTs may have clients 45+ minutes apart.

**Who is affected:** Rural RBTs (lower billable hours despite full workdays), practice owner (lower revenue per rural RBT), scheduler, rural families (fewer available slots).

**What the software should do:**
- Support geographic zones or regions that affect scheduling expectations
- Adjust utilization targets by region: 85% billable target for urban RBTs, 65% for rural (accounting for travel)
- Show geographic heat map of client locations to help with hiring decisions ("We need an RBT who lives near the 3 underserved clients in the northwest area")
- Telehealth suitability flag per client: some rural clients may benefit from hybrid in-person + telehealth to reduce travel burden

---

### 3.4 Telehealth Mixed with In-Person on Same Day

**Scenario:** A BCBA has a morning of clinic-based sessions (9am-12pm), a telehealth parent training session at 1pm (from their home office), then needs to drive to a client's home for a 3pm in-person observation. The calendar must show location context for each session so the BCBA knows when they need to be where, and whether they can do the 1pm telehealth from the clinic before driving to the 3pm home visit.

**Frequency:** Daily for BCBAs. Telehealth is now standard for parent training (97156) and some supervision. Most BCBAs have 1-3 telehealth sessions mixed into their daily in-person schedule.

**Who is affected:** BCBAs (need to plan transitions between modalities), scheduler (must account for modality transitions), families (need to know if session is in-person or virtual).

**What the software should do:**
- Session modality field: in-person (clinic), in-person (home), in-person (school/community), telehealth
- Visual distinction on calendar: telehealth sessions with a different color/icon so providers can quickly scan their day
- Location-aware scheduling: if a provider has an in-person session at 2pm at a home location, don't schedule an in-person clinic session at 2:30pm (drive time needed)
- Telehealth link auto-generated and included in session details / family notifications
- Support "location of provider" for telehealth: BCBA doing telehealth from clinic vs. from home affects their availability for in-person sessions before/after

---

### 3.5 Back-to-Back Sessions at Different Locations

**Scenario:** The scheduler accidentally books an RBT for a 12pm-3pm session at Client A's home and a 3pm-5pm session at Client B's home 40 minutes away. There's zero buffer. The RBT will either leave Client A early (under-delivering) or arrive late to Client B. Neither family is happy. This is the most common scheduling error in ABA and it stems from the calendar showing "3pm is free" without considering where the RBT will be at 2:59pm.

**Frequency:** Weekly without travel-time safeguards. Daily at practices using basic calendar tools (Google Calendar, etc.) without ABA-specific logic.

**Who is affected:** RBT (stressed, late), both client families (disrupted), scheduler (gets complaints), practice (potential payer audit issue if logged times don't match actual times).

**What the software should do:**
- Hard warning (not just a soft notification) when scheduling back-to-back sessions at different locations without adequate travel buffer
- Auto-calculate required buffer based on distance between consecutive session locations
- Visual "travel block" automatically inserted between sessions at different locations
- Show the scheduler a "day route" view: map of the provider's sessions in geographic order with travel times
- Prevent scheduling conflicts where start time at Location B is before end time at Location A + estimated travel time

---

## 4. Multi-Client Complexity

### 4.1 Siblings at Same Address

**Scenario:** A family has two children (ages 4 and 7) both receiving ABA services at home. Each child has their own authorization, treatment plan, and goals. Options: (a) same RBT sees both back-to-back (most common -- one session 9am-12pm, next 12pm-3pm), (b) different RBTs come at different times, (c) overlapping sessions with different RBTs (requires separate rooms). The family strongly prefers option (a) -- one RBT, one long block, minimal household disruption.

**Frequency:** 5-10% of clients are siblings. A 50-client practice may have 3-5 sibling pairs/groups.

**Who is affected:** The family (scheduling convenience is a retention factor), RBT (longer block at one location, which is actually preferred -- less driving), scheduler (must keep sibling sessions linked), BCBA (may supervise both but treatment plans are independent).

**What the software should do:**
- "Sibling group" or "household" linkage between clients at the same address
- When scheduling one sibling, show the other sibling's schedule at the same location to facilitate back-to-back booking
- If one sibling's session is cancelled, prompt: "Cancel both siblings' sessions at this address?" (family may want to cancel both or keep one)
- Shared provider preference: if the family prefers one RBT for both children, flag conflicts when assigning different RBTs
- Each sibling has an independent authorization and billing -- never combine sessions or units across siblings
- When one sibling's session time changes, suggest adjusting the adjacent sibling's session to maintain the back-to-back pattern

---

### 4.2 Family Schedule Constraints

**Scenario:** A client's mother works Monday-Thursday 8am-4pm. Grandmother is available Mon/Wed 9am-2pm. Father works from home Tuesdays. The client goes to school 8:30am-2:30pm on school days. ABA sessions must happen when (a) the client is available AND (b) a caregiver is home (required for home-based ABA -- someone must be present). The scheduler must solve a constraint satisfaction problem with multiple family members' schedules.

**Frequency:** Every client at intake and whenever family circumstances change (new job, new school, etc.). Family schedule is the #1 constraint in ABA scheduling, more limiting than provider availability.

**Who is affected:** Scheduler (must map family availability), family (frustrated if sessions conflict with their constraints), RBT (must match the narrow available windows).

**What the software should do:**
- Client-level availability blocks: store when each client is available for sessions (distinct from provider availability)
- Family/caregiver availability: "Parent available Mon-Thu 4pm-7pm, Grandparent available Mon/Wed 9am-2pm"
- Warn when scheduling a session outside the client's defined availability window
- When family availability changes (e.g., parent gets a new job), highlight all sessions that now fall outside the new availability and need rescheduling
- Notes field on availability blocks: "Grandma available but doesn't drive -- must be home-based only on Mon/Wed"

---

### 4.3 Client Graduating / Aging Out -- Template Deactivation

**Scenario:** A client is being discharged from ABA services. The BCBA recommends a gradual fade: reduce from 5x/week to 3x/week for a month, then 1x/week for two weeks, then discharge. Each phase requires modifying the recurring template. On the discharge date, all recurring sessions must stop, and the RBT's freed hours should be surfaced for the waitlist. Some discharges are abrupt (family moves, insurance changes); others are planned over weeks.

**Frequency:** Monthly at a mid-size practice. Average ABA treatment duration is 1-3 years, so a 50-client practice discharges roughly 2-4 clients per month.

**Who is affected:** Client family, BCBA (discharge planning and documentation), RBT (loses hours), scheduler (manages fade schedule and slot reallocation), practice owner (waitlist conversion opportunity).

**What the software should do:**
- "Discharge schedule" workflow: define a phased reduction (e.g., Phase 1: reduce to 3x/week on June 1, Phase 2: reduce to 1x/week on July 1, Phase 3: discharge on July 15)
- Each phase automatically modifies the recurring template on the specified date
- On discharge date, deactivate the template and mark all future sessions as cancelled
- Surface freed hours to the scheduler/waitlist manager: "Client X discharged -- 20 hours/week now available at [location], [time range]"
- Support "unexpected discharge" (effective immediately) that cancels all future sessions in one action
- Retain historical schedule data for the discharged client (audit trail)

---

### 4.4 New Client Intake -- Building Initial Schedule

**Scenario:** A new client is authorized for 25 hours/week of 97153 and 3 hours/week of 97155. The BCBA has completed the assessment (1-3 sessions over 1-2 weeks). Now the scheduler must build a recurring weekly template from scratch: find an RBT with 25 hours of availability that matches the family's availability, in the right geographic area, with the right skill set. This is the hardest scheduling task in ABA -- it's a multi-constraint optimization problem. Average time from authorization to first scheduled session: 2-6 weeks. National average waitlist: 5.7 months.

**Frequency:** 2-4 new clients per month at a growing practice.

**Who is affected:** Scheduler (significant time investment per new client), family (waiting for services), assigned RBT, BCBA (designs the initial treatment plan around the schedule), practice owner (revenue starts when sessions start).

**What the software should do:**
- "New client scheduling" wizard that takes auth parameters (hours/week by CPT code, date range) and family availability as inputs
- Show provider availability grid filtered by: geographic area, matching time slots, credential level (RBT for 97153, BCBA for 97155)
- "Best match" suggestions: rank available RBTs by fit (geographic proximity, schedule alignment, caseload balance)
- Draft a weekly template that the scheduler can adjust before activating
- Track time-to-first-session from authorization date (operational KPI)
- Waitlist integration: when the new client can't be fully scheduled yet, show which hours are placed and which are still waiting for an available provider

---

## 5. Compliance & Documentation

### 5.1 Session Overlap Audit -- Same Provider, Same Time

**Scenario:** During a payer audit, the insurer pulls all claims for Provider X and checks for overlapping session times. If the provider billed 97153 for Client A from 2:00-4:00 PM and 97155 for Client B from 3:00-3:30 PM on the same day, that's an overlap that requires explanation. Legitimate overlaps exist (group sessions 97157/97158), but 1:1 service overlaps are fraud indicators. The OIG's recent $56M ABA audit specifically flags overlapping service times as a key finding.

**Frequency:** During every payer audit (annually per major payer). Proactive practices run internal overlap audits monthly.

**Who is affected:** Practice owner (liability), billing team (must resolve before claim submission), BCBA/RBT (may need to correct documentation), compliance officer.

**What the software should do:**
- Real-time overlap detection at scheduling: prevent scheduling the same provider for overlapping 1:1 sessions (hard block)
- Overlap detection at session logging: if actual start/end times create an overlap with another logged session for the same provider, flag immediately
- Monthly audit report: scan all logged sessions for provider-time overlaps, categorized as "legitimate" (group codes) or "requires review" (1:1 overlaps)
- Pre-claim scrub: before generating claims, run overlap check and block submission of overlapping claims
- Visual indicator on the calendar when a provider has overlapping sessions (even across different clients' views)

---

### 5.2 Scheduled vs. Actual Session Times -- Documentation Gap

**Scenario:** A session is scheduled for 9:00 AM - 12:00 PM (3 hours = 12 units). The RBT actually arrives at 9:15 AM (traffic) and the family ends early at 11:30 AM (doctor appointment). Actual session: 9:15 AM - 11:30 AM (2 hours 15 min = 9 units). The session note must reflect actual times, not scheduled times. If the practice bills 12 units based on the schedule, that's overbilling. If the practice has EVV (Electronic Visit Verification), the check-in/check-out timestamps will conflict with the scheduled times.

**Frequency:** Daily. Nearly every session has some variance between scheduled and actual times. Significant variance (>15 minutes) occurs in 20-30% of sessions.

**Who is affected:** RBT (must accurately log actual times), billing team (must bill actual, not scheduled), compliance (audit risk if billed != actual), practice owner (revenue impact of shortened sessions).

**What the software should do:**
- Clear distinction between "scheduled time" and "actual time" on every session
- Default actual time to scheduled time, but require confirmation/adjustment at session completion
- If actual time differs from scheduled by >15 minutes, prompt for a reason (late arrival, early end, family request, traffic, crisis)
- Bill based on actual time, never scheduled time
- Variance report: show all sessions where actual differed from scheduled, grouped by reason, to identify systemic issues (e.g., one client always starts 20 minutes late -- adjust the template)
- EVV compliance: if EVV is required, validate that check-in/check-out times match the actual times logged in the session note

---

### 5.3 EVV (Electronic Visit Verification) for Medicaid

**Scenario:** The practice serves Medicaid clients in a state that requires EVV for ABA services (currently Colorado and Florida mandate it; other states may follow). EVV requires capturing 6 data elements for each home visit: type of service, individual receiving the service, date of service, location, individual providing the service, and time the service begins and ends. The RBT must electronically "check in" when arriving at the client's home and "check out" when leaving. If the check-in time doesn't match the scheduled time, a reason code is required.

**Frequency:** Every Medicaid home-based session in applicable states. Expanding: the 21st Century Cures Act mandated EVV for all Medicaid personal care and home health services, and more states are including ABA under this mandate.

**Who is affected:** RBTs (must use EVV device/app for check-in/out), scheduler (scheduled times become a compliance reference point), billing team (EVV data must match claims), practice owner (state compliance requirement).

**What the software should do:**
- GPS-verified check-in/check-out for home-based sessions (mobile app captures timestamp + location)
- Automatic comparison of EVV timestamps vs. scheduled time vs. logged actual time -- flag discrepancies
- Reason code selection when EVV check-in differs from scheduled time (traffic, family late, provider early, etc.)
- EVV data export in the format required by the state's EVV aggregator system
- Dashboard showing EVV compliance rate: % of Medicaid home-based sessions with complete, matching EVV records
- Per-payer EVV requirement flag: track which payers/plans require EVV so the system only enforces it where mandated

---

### 5.4 BACB Supervision Audit -- Scheduling as Evidence

**Scenario:** The BACB audits a BCBA's supervision of their RBTs. The auditor requests documentation showing: dates and times of all supervision sessions, whether each was individual or group, whether direct observation occurred, total supervision hours as a percentage of each RBT's service hours, and the Monthly Fieldwork Verification Forms (signed by both parties). The scheduling system is the primary source of truth for when supervision actually occurred. If supervision sessions aren't in the calendar with accurate times and types, the BCBA cannot prove compliance.

**Frequency:** BACB audits can occur at any time; practices should maintain audit-ready records continuously. Monthly Fieldwork Verification Forms must be signed within one calendar month of the supervisory period ending -- a commonly missed deadline.

**Who is affected:** BCBA (must prove compliance), supervised RBTs (their certification depends on adequate supervision), practice owner (liability), compliance officer.

**What the software should do:**
- Track supervision sessions as a distinct session type with metadata: individual vs. group, direct observation (yes/no), supervision focus areas
- Automatic calculation of supervision percentage: (supervision hours / RBT service hours) per month per RBT-BCBA pair
- Alert when a BCBA is falling behind on supervision for any of their RBTs (< 5% threshold, < 2 contacts, < 1 observation)
- Monthly supervision report exportable as proof of compliance
- Deadline tracking: "Monthly Fieldwork Verification Form for [RBT] for [month] must be signed by [date]"
- Retain supervision records for 7 years per BACB policy

---

### 5.5 Incident During Session -- Documentation and Schedule Impact

**Scenario:** During a session, a client bites an RBT, breaking skin. The session is terminated early per the crisis protocol. The RBT must: (1) document the incident in an incident report within 24 hours, (2) notify the supervising BCBA, (3) potentially seek medical attention (affecting remaining schedule), (4) the BCBA may need to schedule an emergency session to adjust the behavior intervention plan and meet with the family. This single incident creates 3-4 unplanned scheduling needs within 24-48 hours.

**Frequency:** Weekly at practices with clients exhibiting severe behaviors (aggression, self-injury, elopement). Monthly at practices with milder caseloads.

**Who is affected:** RBT (physical/emotional impact, documentation), BCBA (must respond clinically), client family, scheduler (adjust remaining day + schedule follow-up sessions), practice admin (incident tracking, potential workers' comp).

**What the software should do:**
- "Incident" flag on a session that triggers: early termination logging, BCBA notification, incident report assignment
- Scheduler receives alert: "RBT X's session ended early at 10:30 AM due to incident. Remaining sessions today may be affected."
- Auto-create a follow-up task: "BCBA review incident and schedule emergency BIP update session with family within 48 hours"
- Track incident history per client (patterns inform treatment modifications) and per RBT (patterns may indicate training needs or poor client-provider fit)
- If the RBT needs medical attention, trigger the same-day coverage workflow (Section 2.1) for their remaining sessions
- Link incident report to the session record for audit trail

---

## 6. Implications for Clinivise

### Summary of Edge Cases by Frequency

| Frequency | Edge Cases |
|-----------|-----------|
| **Daily** | Travel time gaps (3.1), drive time as non-billable (3.2), scheduled vs actual times (5.2), back-to-back location conflicts (3.5), telehealth mixed day (3.4) |
| **Weekly** | Provider sick callout (2.1), temporary coverage (1.4), mid-session crisis (2.7), incidents (5.5), session overlap detection (5.1) |
| **Monthly** | RBT quits (1.1), family vacation pause (2.2), client hold (2.6), new client intake (4.4), client discharge (4.3), credential expiration (1.5) |
| **Quarterly** | BCBA departure (1.3), seasonal schedule transition (2.4) |
| **Semi-annually** | Practice-wide emergency closure (2.3), DST transition (2.5) |

### Priority for Clinivise MVP Scheduling

**Must-have (affects daily/weekly operations):**
1. Travel time awareness between sessions (even if just a manual buffer, not auto-calculated)
2. Same-provider overlap detection (compliance non-negotiable)
3. Scheduled vs. actual time tracking on sessions
4. Provider unavailable / coverage workflow
5. Session cancellation with reason codes and tracking
6. Basic provider credential expiration tracking and alerts

**Should-have (affects monthly operations):**
7. Template pause/resume for vacations and holds
8. Bulk reassignment when a provider leaves
9. Sibling/household linking
10. Client availability constraints
11. Supervision tracking and percentage calculation

**Nice-to-have (differentiators):**
12. Seasonal template swap
13. Geographic clustering / travel time estimation
14. EVV integration
15. Discharge fade schedule workflow
16. New client scheduling wizard with constraint solving
17. Incident-to-schedule cascade workflow

### Key Design Principle

**The recurring template is the foundation, and exceptions are the daily reality.** Every edge case above is a deviation from the template. The software must make the template easy to set up AND easy to deviate from without destroying it. The template is the "what should happen." Actual sessions are "what did happen." The gap between them is where all the chaos lives.

---

## Sources

- [Why RBTs Leave and What We Can Do to Keep Them](https://www.bhfield.com/resources/why-rbts-leave-and-what-we-can-do-to-keep-them)
- [Turnover in ABA Therapy: Reducing RBT and BCBA Burnout](https://www.raintreeinc.com/blog/therapist-turnover-in-aba/)
- [Breaking the Cycle: Addressing High RBT & BCBA Turnover in ABA](https://www.abaresourcecenter.com/post/reducing-high-rates-of-turnover-in-aba-rbt-bcba)
- [How ABA Leaders Can Solve Workforce Challenges in 2025](https://www.plutushealthinc.com/post/aba-workforce-operational-efficiency-2025)
- [Why Is ABA Scheduling So Ridiculously Hard?](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/)
- [Scheduling Strategies for ABA Practices (Motivity)](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)
- [ABA Scheduling Software (CentralReach)](https://centralreach.com/blog/simplifying-aba-scheduling-reduce-stress-fill-gaps-and-boost-utilization/)
- [How to Handle Session Cancellations in ABA Therapy](https://www.crossrivertherapy.com/articles/how-to-handle-session-cancellations-in-aba-therapy)
- [ABA Revenue Rescue: Fix Scheduling Gaps](https://www.billingparadise.com/blog/reduce-aba-cancellations-boost-revenue/)
- [EVV FAQ for ABA Therapy (Operant Billing)](https://operantbilling.com/electronic-visit-verification-faq-for-aba-therapy/)
- [Electronic Visit Verification (Medicaid.gov)](https://www.medicaid.gov/medicaid/home-community-based-services/guidance/electronic-visit-verification-evv)
- [What is EVV and Why Is It Important (RethinkBH)](https://www.rethinkbehavioralhealth.com/resources/what-is-electronic-visit-verification-evv-why-is-it-important/)
- [FWA Insights: Catching Inappropriate Billing in ASD Services](https://resources.cotiviti.com/fraud-waste-and-abuse/fwa-insights-catching-inappropriate-billing-within-asd-services)
- [How the $56M OIG Audit Impacts ABA Revenue](https://www.billingparadise.com/blog/aba-audit-readiness/)
- [Billing Ethics and Pitfalls for ABA Providers](https://linksaba.com/billing-ethics-and-pitfalls-for-aba-providers/)
- [When RBT Certification Doesn't Go as Planned (BACB)](https://www.bacb.com/when-rbt-certification-doesnt-go-as-planned/)
- [RBT Certification Changes in 2026](https://www.abamatrix.com/rbt-certification-changes-2026-explained/)
- [Maintaining RBT Certification](https://www.abaresourcecenter.com/post/maintaining-rbt-certification)
- [BCBA Fieldwork Documentation Audit Guide](https://www.praxisnotes.com/resources/bcba-fieldwork-audit-guide)
- [Tracking BCBA Supervision Hours](https://www.operationsarmy.com/post/tracking-bcba-supervision-hours-your-complete-guide-to-fieldwork-compliance-and-experience-document)
- [Graduation and Discharge from ABA Services](https://roguebehaviorservices.com/graduation-and-discharge-from-aba-services/)
- [Ethical ABA Discharge Criteria (Praxis Notes)](https://www.praxisnotes.com/resources/ethical-aba-discharge-criteria)
- [When to Pause ABA Therapy](https://www.allstaraba.org/blog/pausing-aba-therapy)
- [ABA in Rural Areas: Access, Telehealth, and Equity](https://linksaba.com/aba-in-rural-areas-access-telehealth-and-equity/)
- [Urban vs Suburban ABA Approaches](https://www.mastermindbehavior.com/post/differences-between-urban-and-suburban-aba-approaches)
- [ABA Intake Process: 8 Steps (Passage Health)](https://www.passagehealth.com/blog/aba-intake-process)
- [ABA Therapy and Crisis Management](https://www.upandupaba.com/faqs-resources/aba-therapy-and-crisis-management)
- [How to Support ABA Therapy Over Summer Break](https://www.azinstitute4autism.com/library/aba-therapy-summer-routine-tips)
- [RBT Training That Works (ABA Matrix)](https://www.abamatrix.com/rbt-training-that-works-build-a-system-for-your-aba-practice/)
- [Maximizing RBT Retention Through Smart Scheduling](https://measurepm.com/blog/maximizing-rbt-retention)
