# ABA Scheduling Software: Real User Complaints Research

> **Purpose:** Catalog specific, attributed complaints from ABA practitioners about scheduling in existing practice management software. These are the pain points Clinivise must avoid or solve.
>
> **Last updated:** 2026-03-28
>
> **Research method:** Capterra, G2, Software Advice, TrustRadius verified reviews; industry analysis articles; competitor comparison blogs; practitioner community discussions.

---

## Table of Contents

1. [CentralReach Complaints](#1-centralreach-complaints)
2. [AlohaABA Complaints](#2-alohaaba-complaints)
3. [Theralytics Complaints](#3-theralytics-complaints)
4. [CR Essentials Complaints](#4-cr-essentials-complaints)
5. [Raven Health Complaints](#5-raven-health-complaints)
6. [Noteable Complaints](#6-noteable-complaints)
7. [Cross-Platform Structural Problems](#7-cross-platform-structural-problems)
8. [The Spreadsheet Workaround Problem](#8-the-spreadsheet-workaround-problem)
9. [Features Practitioners Wish They Had](#9-features-practitioners-wish-they-had)
10. [Opportunities for Clinivise](#10-opportunities-for-clinivise)

---

## 1. CentralReach Complaints

CentralReach is the market leader (~4,000 practices) and generates the most complaints, partly because of its large user base and partly because of genuine UX debt accumulated over years.

### Complaint 1: Excessive Click Burden for Rescheduling

- **Source:** Serious Development blog analysis, corroborated by multiple Software Advice reviews
- **Who:** Scheduling coordinators, practice administrators
- **Complaint:** "15-20 clicks to reschedule one session." Last-minute cancellations by caregivers or RBTs create "an expensive scramble" because the tool makes each reschedule so labor-intensive.
- **Root cause:** The scheduling module was designed for initial appointment creation, not for the constant rescheduling reality of ABA (where cancellation rates run 10%+ weekly).
- **Impact:** Scheduler productivity capped at ~75-100 clients per staff member due to system friction. At a 500-client operation with 10% cancellation rate, this equals ~50,000 lost billable hours annually ($2.5M-$3.5M revenue loss).

### Complaint 2: Rigid Calendar / Hard to Modify Appointments

- **Source:** Software Advice verified reviews, Capterra reviews
- **Who:** Administrators, schedulers
- **Complaint:** "The calendar feature is too rigid, not easy to create or change appointments at all, or to see when other providers have appointments with shared clients on the calendar." Also: "Calendars do not reflect converted changes."
- **Root cause:** Calendar view doesn't update in real-time after session status changes. Shared client visibility is limited.

### Complaint 3: No Smart Matching or Proposal Automation

- **Source:** Serious Development analysis
- **Who:** Scheduling coordinators
- **Complaint:** "No smart algorithmic scoring of RBT credentials against open slots." Schedulers resort to manual spreadsheet cross-checks for qualifications, languages, and travel radius. "No two-way SMS/Client App appointment proposals" — slow caregiver and RBT response rates mean time-sensitive slots expire unfilled.
- **Root cause:** Matching logic is manual. No automated proposal workflow for caregivers or providers.

### Complaint 4: No Real-Time Utilization Dashboard

- **Source:** Serious Development analysis
- **Who:** Practice owners, schedulers
- **Complaint:** Absence of real-time "Utilized vs. Authorized hours" tracking in the scheduling view. No cancellation heat maps or trend visibility. "Schedulers spend entire days fighting the tool instead of optimizing the schedule."
- **Root cause:** Scheduling and authorization tracking live in separate modules without real-time cross-referencing.

### Complaint 5: Steep Learning Curve / Not Intuitive

- **Source:** Capterra, G2, Software Advice — multiple verified reviews
- **Who:** BCBAs, RBTs, administrators
- **Complaints:**
  - "In providing a great amount of flexibility, they have created a less than intuitive environment that has a steep learning curve."
  - "Very confusing at first."
  - "It is not intuitive. If you do not fully understand something (e.g., giving access to contacts), you can be left wondering why things are missing."
  - "Adding and removing appointments was also tedious."
- **Root cause:** Feature density accumulated over 10+ years without UX simplification. Designed for power users, not for the RBT who just needs to see today's schedule.

### Complaint 6: System Instability and Data Loss

- **Source:** TrustRadius, Capterra, G2 verified reviews
- **Who:** Hospital administrators, clinicians
- **Complaints:**
  - "CentralReach has had a lot of latency issues recently which has caused the system to go down" — making it "impossible for end users to complete their job responsibilities."
  - "Often logs me out while I am using it and will delete the data I have inputted within it."
  - "There tends to be at most weekly and at least monthly system failures when I cannot access the data portion of my charts."
  - "The App is terrible!!"
- **Root cause:** Scalability issues with legacy architecture. Mobile app quality significantly behind desktop.

### Complaint 7: Expensive Add-On Pricing

- **Source:** Software Advice, Capterra reviews
- **Who:** Practice owners
- **Complaint:** "The system is very expensive, and the cost of all the add-ons is a bit much, and having to pay that for each employee when only certain ones use a feature." Tailored/opaque pricing with hidden add-ons. Contracts auto-renew and require 45+ days notice to cancel.
- **Root cause:** Enterprise pricing model applied to small practices. Per-user add-on costs scale poorly.

---

## 2. AlohaABA Complaints

AlohaABA is popular with small practices for billing but receives consistent criticism on scheduling UX and clinical gaps.

### Complaint 8: No Monthly Calendar View

- **Source:** Capterra reviews, Passage Health comparison
- **Who:** Schedulers, practice owners
- **Complaint:** "The view for scheduling isn't as user-friendly and you cannot see a monthly view for the schedule." Also: "A new tab opens each time to look at the scheduling page."
- **Root cause:** Calendar component limited to daily/weekly views. Navigation requires new browser tabs, breaking workflow context.

### Complaint 9: No Mobile App

- **Source:** Multiple review platforms
- **Who:** RBTs, field therapists
- **Complaint:** "No dedicated mobile app limits field flexibility." The browser-based system "doesn't feel optimized for mobile use." Users wish there was "a mobile app, at least to view the schedule."
- **Root cause:** Built as a desktop-first billing tool. Mobile was never a primary use case.

### Complaint 10: Slow Documentation Workflow

- **Source:** Passage Health review analysis
- **Who:** RBTs, BCBAs
- **Complaint:** "Multiple clicks for common tasks" during data entry. "Slower data entry compared to newer platforms." System feels "compliance-focused rather than clinician-friendly." Users want "fewer required fields per note."
- **Root cause:** Form design prioritizes billing compliance fields over clinical workflow speed. Built for billers, not therapists.

### Complaint 11: Clinical Data Not Natively Supported

- **Source:** Passage Health review, Capterra
- **Who:** BCBAs, practice owners
- **Complaint:** Clinical documentation "isn't natively supported" — requires integration with separate data collection systems (HiRasmus or Motivity). This creates "synchronization issues as practices grow." Users reported feeling "thrown in the water without a life jacket" after going live.
- **Root cause:** AlohaABA is a PM/billing tool, not a clinical platform. Clinical data lives in a separate system, requiring double-entry or fragile integrations.

### Complaint 12: Reporting Requires Spreadsheet Export

- **Source:** Passage Health analysis
- **Who:** Practice owners, administrators
- **Complaint:** Reporting customization challenges mean users "might have to export the data into a Microsoft Excel spreadsheet" to get needed information.
- **Root cause:** Limited built-in analytics. No real-time dashboards for scheduling metrics.

---

## 3. Theralytics Complaints

Theralytics is marketed as affordable and BCBA-built, but has serious reliability issues that directly impact scheduling-to-billing integrity.

### Complaint 13: Session Edits Create Hidden Billing Errors

- **Source:** Software Advice verified reviews
- **Who:** Billing staff, practice owners
- **Complaint:** "Hidden back-end errors occur when sessions are edited from what was originally scheduled, which can cause errors in the produced claim. The only way to be sure is to either forbid any edits to all scheduled sessions or assign someone to crosscheck each session note with the resulting claim."
- **Root cause:** Session-to-claim pipeline doesn't properly handle post-scheduling edits. Editing a scheduled session creates a mismatch between the session record and the generated claim.

### Complaint 14: Year of Claims Denied Due to Bundling Bug

- **Source:** Software Advice verified review
- **Who:** Practice owner / billing staff
- **Complaint:** "An entire year's worth of claims were denied as duplicates because the system is incapable of correctly bundling alike sessions."
- **Root cause:** Claim generation logic doesn't properly handle multiple same-day sessions or same-code sessions across a period.

### Complaint 15: Miscalculated Time-to-Unit Conversions

- **Source:** Software Advice verified review
- **Who:** Billing staff
- **Complaint:** "More than 6 months worth of miscalculated conversions of time to units — instances like 5 units billed for a 3 hour session or 10 units billed for a half-hour session."
- **Root cause:** Unit calculation engine has bugs. Scheduled session duration doesn't reliably translate to correct billable units.

### Complaint 16: Session Notes and Signatures Routinely Lost

- **Source:** Software Advice reviews
- **Who:** RBTs, BCBAs
- **Complaint:** "Session notes are routinely deleted, session notes fail to save, and signatures fail to save." The mobile app is "non-functional" and there is "no offline accessibility."
- **Root cause:** Data persistence issues. No autosave. Mobile app unreliable.

### Complaint 17: Can't Type Dates, Only Dropdowns

- **Source:** Capterra reviews
- **Who:** Schedulers, administrators
- **Complaint:** Cannot "type out the dates as opposed to a drop-down menu" when scheduling. Limited integrations with payroll systems.
- **Root cause:** Input controls not optimized for speed. Dropdown-only date selection is slow for power users scheduling dozens of appointments daily.

---

## 4. CR Essentials Complaints

CentralReach's small-practice offering (rebranded from BehaviorSoft) has its own issues.

### Complaint 18: Post-Rebrand Technical Regression

- **Source:** Capterra reviews
- **Who:** Practice owners
- **Complaint:** "After rebranding to CR Essentials, problems began including devices locking down requiring complete restarts, and data not always transferring to the server, forcing users to rely on paper and pencil."
- **Root cause:** Migration/rebranding introduced instability. Data sync issues between device and server.

### Complaint 19: Limited Data Collection, Paywall on Features

- **Source:** Capterra reviews
- **Who:** BCBAs
- **Complaint:** "Not a good data collection system, couldn't add other types of measurement systems, lacked instructions on app programs, couldn't modify graphs, and program library access was locked behind a paywall."
- **Root cause:** Essential clinical features gated behind additional payments. Limited measurement type support.

---

## 5. Raven Health Complaints

### Complaint 20: Inaccurate Daily Data Calculations

- **Source:** GetApp reviews
- **Who:** BCBAs
- **Complaint:** "Data calculation for the day isn't accurate when summing up data from all the sessions for the day." Users "find themselves extracting data from the program and redoing the calculation themselves."
- **Root cause:** Aggregation logic doesn't correctly sum multi-session daily data.

### Complaint 21: Limited Cross-Staff Note Access

- **Source:** Software Advice reviews
- **Who:** BCBAs
- **Complaint:** "It's a challenge to access staff session notes or have staff access my session notes."
- **Root cause:** Note visibility permissions too restrictive for the collaborative supervision model in ABA.

---

## 6. Noteable Complaints

### Complaint 22: Cannot Pre-Schedule or Save Draft Notes

- **Source:** Software Advice reviews
- **Who:** BCBAs, RBTs
- **Complaint:** "Session notes can't be started and saved to return to later. If you have to step away, you have to start over." Also: "Cannot pre-schedule appointments on calendar."
- **Root cause:** No draft/save state for notes. Calendar lacks forward-scheduling capability.

### Complaint 23: Multiple Unnecessary Steps, App Limitations

- **Source:** Software Advice reviews
- **Who:** RBTs
- **Complaint:** "Techs cannot finalize their notes on the app, leading to additional unnecessary steps." "Multiple unnecessary steps for adding programs." "Bug issues that lead to additional work and costs."
- **Root cause:** Mobile app feature parity issues. Workflow requires switching between app and desktop.

---

## 7. Cross-Platform Structural Problems

These complaints recur across multiple platforms and represent industry-wide gaps.

### 7A. Scheduling-Authorization Disconnect

- **Platforms:** CentralReach, AlohaABA, Theralytics, Raven Health
- **Problem:** Scheduling and authorization tracking live in separate modules or systems. Schedulers can't see remaining authorized hours while scheduling. Sessions get scheduled beyond authorization limits, creating unbillable sessions discovered only at claim time.
- **Quote (Passage Health analysis):** "Separate systems mean your data bounces around between platforms, people have to enter the same info twice, and someone's always confused about what version is current."

### 7B. No Intelligent Cancellation Recovery

- **Platforms:** Most platforms except newest AI-native entries (Hipp Health)
- **Problem:** When a session cancels, the scheduler must manually find a replacement. No automated waitlist matching, no proximity-based suggestion, no caregiver notification workflow.
- **Impact:** ABA practices average 10-15% cancellation rates. Without automated backfill, each cancellation is a manual fire drill.

### 7C. Mobile Experience is an Afterthought

- **Platforms:** CentralReach, AlohaABA, Theralytics, CR Essentials
- **Problem:** RBTs and BCBAs are mobile workers — driving between homes, working in clinics, at schools. Yet most scheduling tools are desktop-first. Mobile apps are either non-existent (AlohaABA), non-functional (Theralytics), or "terrible" (CentralReach app review).
- **Who this hurts most:** RBTs who need to see today's schedule, get driving directions, check session details, and log notes — all from their phone.

### 7D. Travel Time Not Integrated

- **Platforms:** Most platforms
- **Problem:** ABA scheduling involves home-based and school-based sessions with significant drive time. Most schedulers manually estimate drive times. Systems measure distance rather than real-time traffic. "5 miles can take 45 minutes" in metro areas.
- **Impact:** 30% of RBTs in one case study were driving over an hour between sessions, contributing directly to turnover.

### 7E. The "Two-System Tax"

- **Platforms:** AlohaABA + HiRasmus/Motivity, others using separate clinical tools
- **Problem:** When scheduling lives in one system and clinical data lives in another, practices pay a "two-system tax" — double data entry, sync failures, staff confusion about which system is the source of truth.
- **Quote:** AlohaABA "requires integration with separate clinical tools like HiRasmus or Motivity, which can create synchronization issues as practices grow."

---

## 8. The Spreadsheet Workaround Problem

Many ABA practices supplement their PM software with manual tools:

- **Email, texts, and spreadsheets** are used for scheduling coordination even when practices have dedicated software (Mission Viewpoint analysis)
- Schedulers maintain **side spreadsheets** to cross-check RBT qualifications, languages, travel radius, and credentialing — data that their PM doesn't surface in the scheduling view
- Practice owners **export to Excel** to get scheduling analytics their software can't provide natively (AlohaABA review)
- Some practices have **given up on software scheduling entirely** and use custom internal workflows patched together from emails and texts

---

## 9. Features Practitioners Wish They Had

Based on complaint patterns, gap analysis, and what newer platforms (Hipp Health, Passage Health) are building:

1. **Real-time auth tracking in the scheduling view** — See remaining authorized hours while scheduling, get warned before over-scheduling
2. **One-click reschedule** — Drag-and-drop or single-action reschedule, not 15-20 clicks
3. **Smart RBT-client matching** — Auto-suggest providers based on credentials, language, insurance credentialing, proximity, and availability
4. **Cancellation backfill automation** — When a session cancels, auto-notify waitlisted clients or available RBTs based on proximity and skills
5. **Mobile-first schedule view** — RBTs need to see today's schedule, get directions, and check session details from their phone
6. **Travel time estimation** — Real drive-time calculation between sessions, not straight-line distance
7. **Monthly calendar view** — AlohaABA users specifically request this; weekly-only is insufficient for planning
8. **Schedule-to-billing integrity** — Editing a scheduled session should correctly update the downstream claim, not create hidden errors
9. **Autosave on notes** — Never lose a session note because the app crashed or the user navigated away
10. **Parent/caregiver scheduling portal** — Two-way communication for appointment proposals, confirmations, and cancellations
11. **Utilization dashboards** — Cancellation heat maps, utilization trends, staff productivity metrics — without exporting to Excel
12. **Unified system** — Clinical data, scheduling, billing, and authorization in one platform — no "two-system tax"

---

## 10. Opportunities for Clinivise

### What we must get right from day one

| Complaint Pattern | Clinivise Response |
|---|---|
| Too many clicks to reschedule | Drag-and-drop calendar with one-action reschedule |
| Can't see auth status while scheduling | Auth utilization bar visible on every client in the scheduler |
| Mobile is broken or missing | Mobile-responsive from the start; RBT daily view |
| Session edits break billing | Single source of truth: session record drives claims, edits propagate |
| Notes don't save / no autosave | Autosave with conflict resolution, never lose data |
| Learning curve is months | Clinivise should be learnable in one session — simple first |
| Scheduling and clinical data in different systems | All-in-one: scheduling, notes, goals, billing in one platform |
| No monthly calendar view | Day, week, and month views from launch |
| Drive time ignored | Integrate estimated drive time between sessions |

### What would differentiate us

| Feature | Competitive Position |
|---|---|
| Auth-aware scheduling | Only Passage Health and Hipp Health do this well today |
| AI-suggested backfill on cancellation | Hipp Health is building this; most platforms don't have it |
| Sub-2-minute RBT workflow | No platform optimizes for RBT speed today |
| Zero-export analytics | Most practices still export to Excel for scheduling insights |
| Transparent pricing | Theralytics does this; CentralReach does not |

### What we should NOT build for MVP

- Complex approval workflows for schedule changes (enterprise feature)
- Multi-location optimization with route clustering (Phase 3+)
- AI-powered auto-scheduling (watch Hipp Health first)
- EVV integration (payer-specific, add when needed)
- Two-way SMS appointment proposals (nice-to-have, not MVP)

---

## Sources

- [CentralReach Scheduling Bottleneck Analysis — Serious Development](https://blog.seriousdevelopment.com/cracking-the-centralreach-scheduling-bottleneck/)
- [CentralReach Reviews — TrustRadius](https://www.trustradius.com/products/centralreach/reviews)
- [CentralReach Reviews — Capterra](https://www.capterra.com/p/140743/CentralReach/reviews/)
- [CentralReach Reviews — Software Advice](https://www.softwareadvice.com/medical/centralreach-profile/reviews/)
- [CentralReach Alternatives — Noteable](https://mynoteable.com/blog/centralreachalternatives)
- [AlohaABA Reviews — Capterra](https://www.capterra.com/p/192774/AlohaABA/reviews/)
- [AlohaABA Review — Passage Health](https://www.passagehealth.com/blog/aloha-aba-reviews)
- [Theralytics Reviews — Software Advice](https://www.softwareadvice.com/medical/theralytics-profile/reviews/)
- [Theralytics Reviews — Capterra](https://www.capterra.com/p/179836/Theralytics/reviews/)
- [Best ABA PM Software Comparison — Passage Health](https://www.passagehealth.com/blog/best-aba-practice-management-software)
- [ABA Scheduler Software Comparison — Passage Health](https://www.passagehealth.com/blog/aba-scheduler-software)
- [Why Is ABA Scheduling So Ridiculously Hard? — Mission Viewpoint](https://www.missionviewpoint.com/why-is-aba-scheduling-so-ridiculously-hard/)
- [Maximizing RBT Retention Through Scheduling — Measure PM](https://measurepm.com/blog/maximizing-rbt-retention)
- [ABA Scheduling Made Simple — ABA Matrix](https://www.abamatrix.com/aba-scheduling-made-simple-for-better-outcomes/)
- [Hipp Health Smart Scheduling](https://www.hipp.health/product/smart-aba-scheduling-software)
- [CR Essentials Reviews — Capterra](https://www.capterra.com/p/210165/Behaviorsoft/)
- [CR Essentials Reviews — SelectHub](https://www.selecthub.com/p/aba-software/cr-essentials/)
- [Noteable Reviews — Software Advice](https://www.softwareadvice.com/medical/noteable-profile/)
- [Raven Health Reviews — GetApp](https://www.getapp.ca/software/2077761/raven-health)
