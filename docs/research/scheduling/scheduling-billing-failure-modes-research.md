# ABA Scheduling Errors That Cause Billing Failures & Claim Denials

> **Purpose:** Document the specific ways scheduling mistakes lead to claim denials, revenue loss, and compliance risk in ABA therapy. Each failure mode includes what goes wrong, financial impact, and what the scheduling software must do to prevent it.
>
> **Last updated:** 2026-03-28
>
> **Research method:** ABA billing specialist publications, billing service case studies, ABA Coding Coalition guidance, payer policy documents, OIG audit reports, competitor PM feature analysis, RCM industry benchmarks.

---

## Table of Contents

1. [Authorization-Scheduling Mismatches (Failure Modes 1-8)](#1-authorization-scheduling-mismatches)
2. [Claim Denial Patterns from Scheduling (Failure Modes 9-14)](#2-claim-denial-patterns-from-scheduling)
3. [Cancellation Economics (Failure Modes 15-18)](#3-cancellation-economics)
4. [Concurrent and Overlapping Sessions (Failure Modes 19-22)](#4-concurrent-and-overlapping-sessions)
5. [MUE and Unit Calculation Errors (Failure Modes 23-25)](#5-mue-and-unit-calculation-errors)
6. [Summary: Prevention Matrix](#6-summary-prevention-matrix)

---

## Industry Context: The Scale of the Problem

- **National ABA claim denial rate:** 20-25% average across practices. Well-managed practices achieve 5-6%. (Source: [MBWRCM case study](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-medical-billing-services-case-study))
- **Improper Medicaid ABA payments:** HHS OIG March 2026 report found **$77.8M in improper Medicaid ABA payments** and **$207M in potentially improper payments** in Colorado alone. Primary cause: documentation/authorization deficiencies. (Source: [ABA Matrix](https://www.abamatrix.com/aba-authorization-management/))
- **Indiana audit:** $56M in improper ABA claims, triggering stricter billing compliance mandates. (Source: [Cube Therapy Billing](https://www.cubetherapybilling.com/aba-billing-playbook))
- **Cost per denial:** $25-30 to work a single denial, per MGMA. (Source: [Operant Billing](https://operantbilling.com/what-are-the-essential-billing-metrics-every-aba-practice-should-track/))
- **Clean claims target:** 90%+ for healthy revenue cycle; below 85% is critical. (Source: [SimiTree](https://simitreehc.com/simitree-blog/how-to-calculate-and-improve-your-behavioral-health-clean-claims-rate/))
- **OIG time-unit overpayments:** Over $200M in a single year from improper time-unit billing. (Source: [OIG, 2021](https://www.cubetherapybilling.com/impact-of-the-8-minute-rule-on-aba-therapy-billing))

---

## 1. Authorization-Scheduling Mismatches

### Failure Mode 1: Sessions Scheduled Outside Authorization Date Range

**What goes wrong:** A session is scheduled (and delivered) before the authorization start date or after its end date. This happens most often during auth transitions — the old auth expires on the 15th, the new auth starts on the 16th, but the recurring schedule doesn't know about the gap. Also occurs when re-authorization is delayed and sessions continue on autopilot.

**Financial impact:** 100% claim denial. Sessions delivered outside the authorized date range are non-billable. At $30-60 per 15-minute unit for common ABA codes, a full-time client (25 hrs/week) generates $2,000-4,000/week in revenue. Even a one-week gap represents thousands in unrecoverable revenue. Retroactive authorizations are rare and payer-dependent — they should never be the recovery plan. (Source: [Annex Med](https://annexmed.com/aba-prior-authorization-delays-revenue-stability))

**Denial code:** CO-27 (services rendered outside coverage dates) or CO-197 (authorization required but not found).

**What Clinivise must do:**
- Every scheduled session must validate against an active authorization's date range at scheduling time
- Red-block any session that falls outside all active auth date ranges for that client + CPT code
- Surface auth expiration prominently on the calendar: 30-day, 14-day, 7-day countdown warnings
- Auto-flag recurring schedule instances that extend beyond the current auth end date
- Show a "gap" visual on the calendar timeline when no auth covers a future date range

---

### Failure Mode 2: Exceeding Authorized Units (Over-Scheduling)

**What goes wrong:** More sessions are scheduled than the authorization allows. Authorization might approve 520 units (130 hours) over 6 months. If scheduling doesn't track cumulative scheduled units against the auth cap, the practice exceeds the limit. Claims for excess units are denied. The scheduler may not discover the problem until weeks of unbillable sessions have accumulated.

**Financial impact:** Any session exceeding the approved unit total is denied outright. In busy practices juggling 50+ active authorizations, this can cascade across multiple clients simultaneously. Over-utilization also triggers payer audits, which can result in recoupment of previously paid claims.

**Denial code:** CO-197 (authorization exceeded / units exhausted).

**What Clinivise must do:**
- Real-time "units remaining" counter visible on every scheduling action, showing: approved units, used units (converted from completed sessions), scheduled-but-not-yet-rendered units, and net available units
- Warning at 80% utilization, critical alert at 95%, hard-block at 100%
- When scheduling a new session, show projected impact: "This session would use 8 of the remaining 24 units"
- Differentiate between "used" (session completed, claim-ready) and "scheduled" (committed but not yet delivered) units — both reduce availability
- Burn-down chart showing projected auth exhaustion date based on current schedule

---

### Failure Mode 3: Under-Utilization (Scheduling Too Few Hours)

**What goes wrong:** The client is authorized for 25 hours/week but consistently receives only 15-18 hours due to cancellations, staffing shortages, or scheduling gaps. Payers monitor utilization patterns. Continuous under-utilization signals to the payer that fewer hours are medically necessary, which leads to **reduced hours on subsequent authorizations**. The practice then loses both the unused revenue in the current period AND future authorized capacity. (Source: [Your Missing Piece](https://yourmissingpiece.com/resources/managing-your-aba-authorizations/))

**Financial impact:** Double loss — immediate revenue left on the table (each unused authorized hour is direct lost revenue) PLUS reduced future authorizations. A client dropping from 25 to 18 approved hours/week across a 6-month auth represents ~$16,800 in annualized revenue loss at $40/unit. Clinically, under-utilization delays treatment progress, which harms outcomes and client retention.

**What Clinivise must do:**
- Weekly utilization tracking dashboard: actual hours delivered vs. authorized hours, expressed as a percentage
- Under-utilization alert when actual delivery falls below 80% of authorized pace for 2+ consecutive weeks
- "Pacing" indicator showing whether the client is on track to use their full authorization by end date
- Visualization: "At current pace, this authorization will use 72% of approved units by expiration" — with weeks remaining and hours to recover
- Flag clients where under-utilization is trending toward the danger zone (< 50% used with > 50% of auth period elapsed)
- Suggest scheduling actions: add sessions, extend session durations, schedule makeup sessions

---

### Failure Mode 4: Authorization Gaps (Auth Expires, New One Pending)

**What goes wrong:** The current authorization expires and the re-authorization hasn't been approved yet. Sessions scheduled during the gap are non-billable. This is the most common preventable cause of revenue loss in ABA practices. Most authorizations last 3-6 months. Re-authorization requires BCBA-prepared documentation (updated treatment plan, progress data, continued medical necessity justification) and payer review, which takes 2-4 weeks. If re-auth paperwork starts too late, a gap is inevitable. (Sources: [Praxis Notes](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide), [Annex Med](https://annexmed.com/aba-prior-authorization-delays-revenue-stability))

**Financial impact:** At $30-60 per 15-minute unit, a single missed authorization renewal for a full-time client can represent thousands of dollars in unrecoverable lost revenue within weeks. Even a 1-week gap for a 25-hr/week client = $1,500-3,000 lost. Multiply across a caseload of 40 clients and auth gaps become an existential revenue threat.

**Denial code:** CO-197 (precertification/authorization required but not found in system).

**What Clinivise must do:**
- Automated re-authorization reminders starting 45 days before expiration (configurable per payer turnaround time)
- Escalating alerts: 45 days (BCBA start documentation), 30 days (submit to payer), 14 days (escalate if no response), 7 days (critical — consider pausing schedule)
- Visual "gap risk" indicator on client cards and auth dashboard
- "Pending auth" status that marks scheduled sessions as "at risk" — visually distinct on calendar
- When auth gap is confirmed, option to pause recurring schedule (not delete) and auto-resume when new auth is entered
- Track re-auth submission date, expected response date, and actual approval date for payer SLA monitoring

---

### Failure Mode 5: Wrong CPT Code on Scheduled Session vs. Authorization

**What goes wrong:** The authorization approves specific CPT codes (e.g., 97153 for direct therapy and 97155 for BCBA protocol modification). A session is scheduled using a CPT code not on the authorization — for example, scheduling a parent training session (97156) when the auth only covers 97153 and 97155. The claim is denied because the billed service doesn't match the authorization terms. (Source: [Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-a-priorauthorization))

**Financial impact:** 100% denial for the mismatched service. Often discovered only after claims submission, meaning the session was already delivered. The service cannot be retroactively changed to a different CPT code — the documentation must match the actual service delivered.

**Denial code:** CO-197 or payer-specific authorization mismatch codes.

**What Clinivise must do:**
- When scheduling a session, restrict CPT code dropdown to only codes that appear on the client's active authorization
- If no authorization covers the selected CPT code, show a clear warning: "97156 is not authorized for this client. Active auth covers: 97153, 97155"
- Cross-reference the scheduled provider's credentials with the CPT code requirements (only QHPs can deliver 97155/97156; only technicians deliver 97153)
- Per-code unit tracking — each authorized CPT code has its own approved unit pool

---

### Failure Mode 6: Scheduling with Expired or Pending Authorizations

**What goes wrong:** Two distinct scenarios: (a) The authorization has already expired but the system still shows it as "active" because nobody updated the status. Sessions are scheduled against a dead authorization. (b) A new client's authorization is still pending payer approval, but the practice begins scheduling (and delivering) sessions optimistically. Most payers require approved authorization before reimbursement — sessions delivered during pending periods are held or denied. (Sources: [Cube Therapy Billing](https://www.cubetherapybilling.com/guidetoabainsuranceauthorization), [Annex Med](https://annexmed.com/aba-prior-authorization-delays-revenue-stability))

**Financial impact:** Sessions delivered under expired auth = 100% denial. Sessions during pending auth = payer-dependent (some allow retro-auth, most don't). Practice absorbs full cost of delivered-but-unbillable services.

**What Clinivise must do:**
- Authorization status engine with clear states: `pending`, `active`, `expiring_soon`, `expired`, `denied`, `on_hold`
- Only `active` and `expiring_soon` auths allow session scheduling
- `pending` auth allows scheduling but marks sessions with visual "at-risk" indicator
- Auto-transition auth status: when end_date passes, status becomes `expired` regardless of manual intervention
- Prevent scheduling against `expired` auth — hard block, not just warning
- "Pending auth" dashboard showing all clients awaiting authorization decisions

---

### Failure Mode 7: Re-Authorization Timing Failures

**What goes wrong:** Re-authorization is submitted too late, or the practice doesn't account for payer-specific turnaround times. Different payers have vastly different processing times: commercial payers may take 5-10 business days, Medicaid can take 15-30+ days, and some require additional clinical documentation that adds weeks. If the practice uses a one-size-fits-all 30-day reminder, Medicaid clients will have auth gaps while commercial clients get reminded unnecessarily early.

**Financial impact:** Directly causes Failure Mode 4 (auth gaps). The lag between submission and approval creates a window of uncertainty where sessions are either paused (lost revenue) or delivered at risk (potential denial).

**What Clinivise must do:**
- Payer-specific re-auth lead time configuration: "For BlueCross, start 30 days early. For Medicaid, start 45 days early."
- Auto-calculate reminder dates based on auth end date minus payer lead time
- Track re-auth workflow stages: documentation_started, submitted, under_review, additional_info_requested, approved, denied
- Alert BCBA when it's time to prepare clinical documentation for re-auth (treatment plan update, progress summary)
- Dashboard showing all upcoming re-auths sorted by urgency

---

### Failure Mode 8: Poor Auth Pacing (Uneven Unit Distribution)

**What goes wrong:** Authorization approves 520 units over 26 weeks. Three pacing failures occur:

1. **Front-loading:** Practice schedules 25 units/week in the first 3 months, runs out of units with 6 weeks remaining. Client has no coverage for the final auth period.
2. **Back-loading:** Practice under-schedules early (15 units/week), then tries to cram 30 units/week at the end. Payer may deny claims that exceed daily MUE limits. Staff can't absorb the spike. Units go unused.
3. **No tracking:** No one monitors the pace. The practice discovers at week 20 that they've used 90% of units with 6 weeks remaining.

Industry best practice: schedule to use 90-100% of authorized hours, review utilization weekly, and course-correct early rather than panic late. Over-scheduling by 10-20% accounts for cancellations, with the worst case being tempering down hours in the last week. (Source: [ABA Building Blocks](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/))

**Financial impact:** Front-loading = uncovered sessions at end of auth. Back-loading = wasted units and MUE denials. No tracking = surprise over/under utilization. All three patterns reduce effective revenue capture by 10-30%.

**What Clinivise must do:**
- Weekly pacing indicator: "20 units/week target to use auth evenly. Current pace: 23 units/week. Projected exhaustion: 3 weeks early."
- Burn-down chart showing ideal pace line vs. actual usage
- Alert when pace deviates significantly (> 15%) from target for 2+ consecutive weeks
- "What-if" tool: "If I add 2 hours/week for this client, when will the auth run out?"
- Auto-suggest schedule adjustments when pacing is off track

---

## 2. Claim Denial Patterns from Scheduling

### Failure Mode 9: Provider Credential Mismatch

**What goes wrong:** The session is scheduled with a provider who isn't credentialed with the client's payer, or whose credentials don't match the CPT code requirements. Key scenarios:

- **RBT billing QHP-only codes:** RBTs cannot deliver or bill 97155, 97156, or 97158. These require a BCBA/BCaBA.
- **Provider not on the authorization:** Some payers list specific rendering and supervising providers on the auth. Substituting a different BCBA triggers a denial.
- **Provider NPI not credentialed with payer:** The provider is qualified but not enrolled/credentialed with that specific insurance company.
- **Rendering vs. supervising provider confusion:** RBT-delivered sessions (97153) are typically billed under the supervising BCBA's NPI, but the rendering provider field should list the RBT. Getting this wrong causes denials. (Sources: [Operant Billing](https://operantbilling.com/rendering-provider-in-aba-therapy-billing-a-comprehensive-guide/), [Passage Health](https://www.passagehealth.com/blog/aba-credentialing))

**Financial impact:** 100% denial for the mismatched claim. If a substitute provider works for 2 weeks before the mismatch is caught, all sessions in that period are denied.

**Denial code:** CO-185 (provider not certified/eligible) or payer-specific credential denial.

**What Clinivise must do:**
- When assigning a provider to a session, validate: (a) provider credentials match CPT code requirements, (b) provider is credentialed with the client's payer, (c) if auth lists specific providers, the scheduled provider is on the list
- Hard-block RBTs from being scheduled for QHP-only codes (97155, 97156, 97158)
- Warn when scheduling a provider not on the authorization's provider list
- Maintain provider-payer credentialing matrix and alert when credentials are expiring

---

### Failure Mode 10: Location/Place of Service Mismatch

**What goes wrong:** The authorization specifies a service location (clinic-only, home-only, or specific facility). A session is scheduled at a different location than what the auth covers — e.g., auth is for clinic services but the session is delivered in-home. The Place of Service (POS) code on the claim doesn't match the authorization, triggering a denial. This also happens with telehealth: POS 02 (telehealth-facility) vs. POS 10 (telehealth-home) must match where the client actually is. (Source: [Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-a-priorauthorization))

**Financial impact:** 100% denial. The service was delivered correctly, but the location doesn't match authorization terms. Requires re-authorization for the correct location or appeal.

**What Clinivise must do:**
- Authorization records include approved location types (clinic, home, school, telehealth)
- When scheduling, validate that the session location matches an authorized location type
- Warn if scheduling a home session when auth only covers clinic
- Auto-populate POS code based on session location to prevent code mismatch at claim submission
- For telehealth: prompt for client location to determine correct POS (02 vs. 10)

---

### Failure Mode 11: Timely Filing Deadline Missed

**What goes wrong:** The claim is submitted after the payer's filing deadline. Deadlines vary by payer: 60-180 days from date of service, with most commercial payers at 90-120 days. Medicaid deadlines vary by state. Once the deadline passes, the claim is auto-denied with **no exception process** — the revenue is permanently lost. This is scheduling-related because: (a) sessions not converted to notes can't become claims, (b) incomplete documentation holds up claim submission, (c) batching claims monthly instead of submitting weekly lets deadlines creep up. (Source: [Passage Health](https://www.passagehealth.com/blog/aba-denial-management))

**Financial impact:** 100% permanent revenue loss. Unlike other denials, timely filing denials cannot be appealed (except in rare circumstances involving payer processing errors). A practice that falls behind on documentation for 3 months risks losing an entire quarter of revenue.

**What Clinivise must do:**
- Per-payer timely filing deadline configuration
- Track every session through the claims pipeline: session_completed -> note_written -> note_signed -> claim_generated -> claim_submitted -> claim_adjudicated
- Alert on sessions that haven't progressed to the next stage within expected timeframes
- "Aging" dashboard showing sessions approaching filing deadlines, sorted by urgency
- Critical alert when a session is within 14 days of its payer's filing deadline and hasn't been submitted
- Encourage real-time claim submission (submit as sessions are documented) rather than batch processing

---

### Failure Mode 12: Documentation-Schedule Mismatch

**What goes wrong:** The session note documentation doesn't match what was scheduled. Key mismatches:

- **Time mismatch:** Session was scheduled 9am-12pm (12 units) but the note documents 9:15am-11:45am (10 units). The claim bills 12 units but documentation supports only 10.
- **Service mismatch:** Session was scheduled as 97155 (BCBA protocol modification) but the note describes routine protocol following — which should be 97153.
- **Provider mismatch:** Session scheduled with Provider A, but Provider B actually delivered the service (substitution wasn't updated in the system).
- **Duration rounding errors:** CMS 8-minute rule requires specific time-to-unit calculations. Rounding every session up, even when minutes don't meet the threshold, overstates units.

**Financial impact:** Payer audits compare claim data against documentation. Mismatches result in recoupment (clawback of already-paid claims), which is worse than a denial because the practice must return money. The OIG found over $200M in overpayments from improper time-unit billing in a single year.

**What Clinivise must do:**
- Session start/end time from the note auto-calculates billable units (using correct CMS or AMA method per payer)
- Warn when documented time differs from scheduled time by more than a threshold (e.g., 15+ minutes)
- Validate that the CPT code on the note matches the scheduled CPT code — or require explicit override with reason
- Ensure rendering provider on the note matches the scheduled (or substituted) provider
- Pre-fill note fields from the schedule to reduce manual entry errors

---

### Failure Mode 13: Coordination of Benefits Errors

**What goes wrong:** Client has two insurance plans (e.g., both parents have employer coverage). Claims must be submitted to the primary insurer first, then the secondary after receiving the primary's Explanation of Benefits (EOB). Scheduling-related failures: (a) incorrect insurance is listed as primary, (b) claim is sent to secondary before primary processes it, (c) both payers pay the claim and one demands a clawback. This is worse in ABA because of the high session volume — a COB error affects dozens of claims per month per client. (Source: [Wayfinder RCM](https://www.wayfinderrcm.com/blog/how-coordination-of-benefits-impacts-billing-for-aba-services))

**Financial impact:** CO-22 denials (duplicate/COB issue). Clawback risk when both payers pay. Administrative cost of re-submitting claims in correct order. Typical per-client impact: 4-20 denied claims per month until resolved.

**Denial code:** CO-22 (coordination of benefits adjustment).

**What Clinivise must do:**
- Client insurance profile with explicit primary/secondary designation
- Birthday rule logic for dual-parent coverage
- Workflow enforcing primary-first claim submission
- Track EOB receipt from primary before enabling secondary claim generation
- Alert when client has multiple active insurance plans and COB hasn't been verified recently

---

### Failure Mode 14: Duplicate Claim Submission

**What goes wrong:** The same session is billed twice — either because the claim was submitted, appeared to fail, and was resubmitted (but the original actually went through), or because a scheduling change created two records for the same session. Common in practices that batch-submit claims: a claim submitted individually gets re-included in a monthly batch.

**Financial impact:** CO-18 denial on the duplicate. But worse: if both claims are paid, the payer will audit and demand clawback plus potential fraud investigation. Even innocent duplicates raise red flags.

**Denial code:** CO-18 (exact duplicate claim).

**What Clinivise must do:**
- Unique session ID linked through the entire pipeline: schedule -> note -> claim
- Prevent generating a claim for a session that already has a claim in any status other than `denied` or `voided`
- Duplicate detection at claim generation: same client + same date + same CPT code + same provider = flag for review
- Track claim submission status to prevent re-submission of pending claims

---

## 3. Cancellation Economics

### Failure Mode 15: High Cancellation Rate Eroding Auth Utilization

**What goes wrong:** ABA therapy has an exceptionally high cancellation rate. Research shows an **average individual cancellation rate of 38%** (5.2 cancelled vs. 9.0 completed appointments). Pediatric specialty clinics report a 24.3% no-show rate. When a client authorized for 25 hours/week consistently receives only 15-18 hours, the gap between authorized and delivered hours represents both lost revenue and clinical regression risk. (Sources: [BillingParadise](https://www.billingparadise.com/blog/reduce-aba-cancellations-boost-revenue/), [Raven Health](https://ravenhealth.com/blog/aba-practice-metrics-to-track/))

**Financial impact:** For high-performing clients, utilization reaches 97%. For low-performing clients, utilization drops below 50%. The gap represents "50% potential loss in skill acquisition and 50% revenue left on the table." Additionally, chronic under-utilization leads to reduced future authorizations (Failure Mode 3). (Source: [ABA Building Blocks](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/))

**What Clinivise must do:**
- Track cancellation rate per client, per provider, and practice-wide
- Categorize cancellations: client_cancel (advance notice), client_late_cancel (< 24hr), client_no_show, provider_cancel, provider_sick, weather, other
- Cancellation pattern detection: alert when a client's cancellation rate exceeds 30% over a rolling 4-week window
- Missed session documentation support — even cancelled sessions need a non-billable record for clinical and legal purposes
- Cancellation reason analytics: identify systemic issues (e.g., Monday cancellation spikes suggesting schedule fatigue)

---

### Failure Mode 16: Failure to Over-Schedule to Compensate for Cancellations

**What goes wrong:** Industry best practice is to over-schedule by 10-20% to buffer for inevitable cancellations. A client authorized for 20 units/week should be scheduled for 22-24 units/week. Without this buffer, the expected 20-38% cancellation rate guarantees under-utilization. However, over-scheduling requires careful tracking — you must temper down hours in the last week of the auth period if cancellations were lower than expected, to avoid over-utilization. (Source: [ABA Building Blocks](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/))

**Financial impact:** Under-scheduling without a cancellation buffer means practices reliably capture only 62-80% of authorized revenue (the inverse of the cancellation rate). For a 40-client practice averaging 20 authorized hours each, a 20% under-capture = ~$320K/year in lost revenue at $40/unit.

**What Clinivise must do:**
- Configurable over-scheduling target per client or practice-wide (default: 10-15%)
- "Effective utilization" metric that accounts for cancellation history: "Based on this client's 25% cancel rate, schedule 27 units to target 20 delivered"
- End-of-auth warning: "Client is over-scheduled relative to remaining units. Reduce by 4 units this week to avoid exceeding auth."
- Dashboard showing: authorized units, scheduled units, expected delivered units (after historical cancellation rate), and net gap

---

### Failure Mode 17: Cascading Cancellations from Drive Time

**What goes wrong:** An RBT's schedule has three home-based clients in sequence: Client A (9-11am), 30-min drive, Client B (11:30-1:30pm), 30-min drive, Client C (2-4pm). Client A cancels at 8am. The RBT now has a 2.5-hour gap before Client B. Options are all bad: sit idle (lost productivity), drive to Client B early (they're not ready), try to fill with a different client (unlikely on short notice). Worse: if the RBT was already en route to Client A, the drive time is wasted. Drive time is non-billable — payers don't reimburse it. (Source: [Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices))

**Financial impact:** Non-billable drive time already consumes 10-20% of an RBT's day. When cancellations cascade, the ratio of billable-to-total hours drops further. An RBT losing one 2-hour session to cancellation plus 1 hour of wasted drive time effectively loses 37% of an 8-hour day.

**What Clinivise must do:**
- Geographic clustering: group home-based clients by area to minimize drive time
- Travel time estimates between session locations (at minimum, distance-based estimates)
- When a cancellation occurs, identify nearby clients who could fill the slot (considering auth availability and client willingness)
- Buffer time between sessions: don't schedule back-to-back if locations are far apart
- RBT daily schedule view showing travel time between sessions as explicit non-billable blocks

---

### Failure Mode 18: Makeup Session Scheduling Failures

**What goes wrong:** When a session is cancelled, the practice attempts to schedule a makeup session to recover lost hours. Several problems arise:

- **No availability:** The RBT's schedule is full — no slots to add a makeup
- **Authorization constraints:** Makeup sessions must still fall within auth dates and not exceed daily MUE limits
- **Family constraints:** The family's availability doesn't align with the provider's availability
- **Session stacking:** Attempting a longer session (e.g., 5 hours instead of 3) to make up lost time, but exceeding daily MUE limits or going beyond what's clinically appropriate

Alternative strategies: extend existing sessions by 10-15 minutes daily to gradually recover hours, or use alternate/floater RBTs for substitution sessions. (Source: [ABA Building Blocks](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/))

**Financial impact:** Every cancelled session not made up is permanently lost revenue. With a 38% cancellation rate and a typical 40-50% makeup success rate, practices permanently lose 19-23% of authorized hours.

**What Clinivise must do:**
- When a session is cancelled, prompt to schedule a makeup — pre-check auth availability (units remaining, date range, MUE limits)
- Show available time slots for the assigned provider within the same auth week
- Suggest alternate providers with compatible availability if primary provider is full
- Track makeup session rate as a KPI alongside cancellation rate
- Validate makeup sessions against daily MUE limits (can't just stack 10 hours into one day)

---

## 4. Concurrent and Overlapping Sessions

### Failure Mode 19: Same Provider Overlapping 1:1 Sessions

**What goes wrong:** A provider is scheduled for two different 1:1 sessions at overlapping times. An RBT can only be face-to-face with one client at a time for 97153. If the schedule shows overlapping 1:1 sessions, payer audit will flag this as fraud — one person cannot be in two places simultaneously. This is a **hard block** — the most straightforward scheduling error to prevent.

**Financial impact:** If caught by payer audit: recoupment of all overlapping claims + potential fraud investigation. If caught internally: one session must be cancelled (lost revenue) or reassigned (requires available provider).

**What Clinivise must do:**
- Hard block: prevent scheduling any 1:1 session for a provider who already has a 1:1 session at that time
- Show conflict immediately when creating or moving a session
- This is the only scheduling validation that is a hard block (not a warning) at session creation time

---

### Failure Mode 20: Improper BCBA-RBT Supervision Overlap Billing

**What goes wrong:** When a BCBA supervises an RBT during a session, two codes can bill concurrently: 97153 (RBT delivering direct therapy) + 97155 (BCBA directing the technician). This is legitimate — but only when: the BCBA is actively present and directing, the client is present, and both code descriptors' criteria are fully met. Billing 97155 for passive supervision (just being in the room), data review, or reviewing the RBT's work without the client present is a misuse that payers actively audit. (Sources: [ABA Coding Coalition](https://abacodes.org/frequently-asked-questions/), [Brellium](https://brellium.com/resources/articles/understanding-and-applying-the-97155-cpt-code))

**Financial impact:** Overuse of 97155 is one of the most audited patterns in ABA billing. Audit findings result in recoupment of all improperly billed 97155 sessions. Payers look at the ratio of 97155-to-97153 hours — a BCBA billing 97155 for every minute of RBT observation raises red flags.

**What Clinivise must do:**
- Allow concurrent scheduling of 97153 (RBT) + 97155 (BCBA) for the same client at the same time
- Require that the 97155 session explicitly references which RBT session it overlaps with
- Document that BCBA was actively directing (not passively observing) — note template should prompt for specific protocol modifications made
- Track 97155:97153 ratio per BCBA and flag outliers for clinical review
- Never allow 97155 + 97153 to be billed by the same provider for the same client simultaneously

---

### Failure Mode 21: Mutually Exclusive Code Combinations

**What goes wrong:** Certain ABA code combinations cannot be billed on the same date or at the same time:

- **97151 + 97152** on the same date (assessment codes — some payers auto-deny)
- **97153 + 97154** for the same client at the same time (individual vs. group — client can't be in both)
- **97154 + 97155** concurrently (a single QHP cannot report both)
- **97155 + 97153** by the **same provider** for the **same client** (the person delivering direct therapy can't simultaneously be directing themselves)

NCCI (National Correct Coding Initiative) edits define these bundling rules, but payers can be more restrictive. (Source: [ABA Coding Coalition](https://abacodes.org/frequently-asked-questions/))

**Financial impact:** Denied claims for the bundled code. Usually the lower-paying code is denied. Repeated violations trigger audit attention.

**What Clinivise must do:**
- Code conflict rules engine: hard-block or warn when scheduling mutually exclusive codes
- Same-provider check: cannot schedule 97153 and 97155 for the same provider + same client at the same time
- Same-client check: cannot schedule 97153 and 97154 for the same client at the same time
- Date-level checks: flag same-day assessment codes that may be denied
- Allow overrides with documented justification for edge cases, but require explicit acknowledgment

---

### Failure Mode 22: Group Session Scheduling Errors

**What goes wrong:** Group sessions (97154, 97157) have specific rules:

- **Group size:** Minimum 2 patients, maximum 8 (some payers cap at 5 without documented justification)
- **Per-client billing:** Each client in the group is billed separately, but each must have their own authorization, their own note, and their own goal data
- **Individual + group overlap:** A client cannot be in a 97153 individual session and a 97154 group session simultaneously
- **Generic notes:** Group notes that don't differentiate client-specific data are denied — each client's note must document their individual progress

(Source: [Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-cpt-code-97154))

**Financial impact:** Denied claims for any client in the group who lacks proper authorization, documentation, or exceeds group size limits. Can cascade to denials for all clients in the session if the group itself is improperly constituted.

**What Clinivise must do:**
- Group session scheduling enforces minimum (2) and maximum (8) participant counts
- Each participant validated against their individual authorization (active auth, authorized CPT code, available units)
- Prevent scheduling a client for both an individual and group session at the same time
- Note template for group sessions generates individual per-client documentation sections
- Alert when approaching payer-specific group size limits

---

## 5. MUE and Unit Calculation Errors

### Failure Mode 23: Exceeding Daily MUE Limits

**What goes wrong:** Medically Unlikely Edits (MUEs) set daily unit caps per CPT code per client. Key limits:

| CPT Code | Description | MUE (units/day) | Hours Equivalent |
|----------|------------|-----------------|-----------------|
| 97151 | Assessment | 32 (Medicaid) / 8 (Medicare) | 8h / 2h |
| 97152 | Assessment support | 16 | 4h |
| 97153 | Direct therapy | 32 | 8h |
| 97154 | Group therapy | 18 | 4.5h |
| 97155 | Protocol modification | 24 | 6h |
| 97156 | Parent training | 16 | 4h |
| 97157 | Group parent training | 16 | 4h |
| 97158 | Group protocol modification | 16 | 4h |

(Source: [ABA Billing Codes](https://www.ababillingcodes.com/resources/medically-unlikely-edits/))

Claims exceeding MUE limits may be: paid only up to the MUE amount (excess units denied), entirely denied for the line item, or auto-flagged for audit. MUE Adjudication Indicator 3 means claims CAN exceed MUE when medically necessary and properly documented — but this requires appeal for most payers.

**Financial impact:** Excess units denied. If the practice scheduled a 10-hour assessment day (40 units of 97151) for a Medicare patient with an MUE of 8 units (2 hours), 32 units are denied — 80% of the day's revenue.

**What Clinivise must do:**
- MUE limits stored per CPT code (with payer-specific overrides for Medicare vs. Medicaid vs. commercial)
- When scheduling, calculate total daily units for the client + CPT code combination
- Warning when approaching MUE limit (e.g., at 80%), hard warning at limit
- If multiple sessions of the same code are scheduled on the same day, sum total units and validate
- Support for MUE override documentation when clinically justified

---

### Failure Mode 24: CMS 8-Minute Rule Miscalculation

**What goes wrong:** Time-based ABA codes (all 9715x codes) convert minutes to 15-minute billing units using specific rules. Two calculation methods exist:

- **CMS method (Medicare/Medicaid):** Aggregate total timed minutes across ALL codes, then distribute units. 8-22 min = 1 unit, 23-37 min = 2 units, etc. The "rule of eights" applies: after the first 8 minutes, each additional 15 minutes earns another unit.
- **AMA method (most commercial payers):** Calculate units per individual code. Each code independently converts its minutes to units.

Common errors: (a) rounding every session up, even when minutes don't meet the 8-minute threshold; (b) using CMS method for commercial payers or vice versa; (c) billing 16 minutes across two codes as 2 units when CMS rules only allow 1 unit for 16 total minutes.

**Financial impact:** OIG found over $200M in overpayments from improper time-unit billing in a single year. Practices that systematically over-count by even 1 unit per session across 100 sessions/week face significant recoupment risk.

**What Clinivise must do:**
- Auto-calculate billable units from documented start/end times
- Support both CMS and AMA calculation methods, configurable per payer
- Default to AMA method (most commercial payers use it)
- Show the calculation transparently: "47 minutes of 97153 = 3 units (AMA method: 8+15+15+9 remaining = 3 units)"
- Prevent manual unit override without documented justification
- Alert when calculated units differ from scheduled units

---

### Failure Mode 25: Session Duration Doesn't Meet Minimum Billing Threshold

**What goes wrong:** A session must last at least 8 minutes to bill 1 unit. If a client arrives late, a session is cut short, or a behavioral crisis ends the session early, the actual service time may fall below the 8-minute minimum. The scheduled 2-hour session becomes a 5-minute interaction — but the schedule shows 8 units. If the claim is submitted based on scheduled time rather than actual time, it's fraud.

**Financial impact:** Over-billing based on scheduled (not actual) time is the most common audit finding. Recoupment applies retroactively to all similarly billed sessions. Under-billing (not billing for sessions that did meet the threshold) is lost revenue.

**What Clinivise must do:**
- Require documented actual start and end time on every session note — not auto-filled from schedule
- Calculate billable units from actual time, not scheduled time
- Flag sessions where actual duration is less than 50% of scheduled duration — may indicate data entry error or clinical issue
- Warn when documented time is under 8 minutes: "This session is below the minimum billing threshold. 0 units are billable."
- Never auto-populate claim units from scheduled duration — always derive from documented actual time

---

## 6. Summary: Prevention Matrix

### Hard Blocks (Prevent at Scheduling Time — Cannot Override)

| # | Validation | Prevents |
|---|-----------|----------|
| 1 | Same provider overlapping 1:1 sessions | FM 19 |
| 2 | RBT scheduled for QHP-only CPT codes | FM 9 |
| 3 | Session scheduled against expired authorization | FM 6 |
| 4 | Session CPT code not on active authorization | FM 5 |
| 5 | Session outside authorization date range (no active auth) | FM 1 |

### Warnings (Alert at Scheduling Time — Can Override with Reason)

| # | Validation | Prevents |
|---|-----------|----------|
| 6 | Authorization approaching unit limit (>80%) | FM 2 |
| 7 | Session exceeds daily MUE limit for code | FM 23 |
| 8 | Provider not credentialed with client's payer | FM 9 |
| 9 | Provider not listed on authorization | FM 9 |
| 10 | Session location doesn't match auth location type | FM 10 |
| 11 | Mutually exclusive code combination on same date | FM 21 |
| 12 | Group session below minimum or above maximum participants | FM 22 |
| 13 | Client in individual and group session simultaneously | FM 22 |
| 14 | Authorization in `pending` status (not yet approved) | FM 6 |
| 15 | Scheduling under auth that expires within 7 days (no renewal in progress) | FM 4 |

### Dashboard Alerts (Monitor Ongoing — Not Per-Session)

| # | Alert | Prevents |
|---|-------|----------|
| 16 | Auth utilization pacing off-track (> 15% deviation from target) | FM 3, 8 |
| 17 | Under-utilization alert (< 80% of authorized pace for 2+ weeks) | FM 3 |
| 18 | Auth expiring within 45/30/14/7 days without re-auth submitted | FM 4, 7 |
| 19 | Client cancellation rate > 30% (rolling 4-week window) | FM 15 |
| 20 | Sessions approaching payer timely filing deadline | FM 11 |
| 21 | Sessions completed but no note written (aging > 48 hours) | FM 11, 12 |
| 22 | 97155:97153 ratio outlier per BCBA | FM 20 |
| 23 | Effective utilization below target after cancellation adjustment | FM 16 |
| 24 | Recurring schedule extends beyond current auth end date | FM 1 |
| 25 | Sessions in "at-risk" status (pending auth, pending credential) | FM 6 |

### Key Metrics to Track

| Metric | Target | Source |
|--------|--------|--------|
| Clean claim rate | > 90% (ideal: 95%+) | Industry benchmark |
| Claim denial rate | < 5% | MGMA |
| Authorization utilization | 90-100% of approved units | ABA Building Blocks |
| Cancellation rate | < 20% (industry avg: 38%) | Research data |
| Makeup session rate | > 50% of cancellations | Best practice |
| Timely filing compliance | 100% (zero expired claims) | Non-negotiable |
| Session-to-claim conversion time | < 48 hours | Best practice |
| Auth gap days (per client/year) | 0 | Target |

---

## Sources

- [ABA Building Blocks — Scheduling Tips to Maximize Utilization](https://ababuildingblocks.com/scheduling-tips-to-maximize-utilization/)
- [ABA Billing Codes — Medically Unlikely Edits](https://www.ababillingcodes.com/resources/medically-unlikely-edits/)
- [ABA Coding Coalition — FAQ](https://abacodes.org/frequently-asked-questions/)
- [ABA Matrix — Authorization Management](https://www.abamatrix.com/aba-authorization-management/)
- [Annex Med — Prior Authorization Delays](https://annexmed.com/aba-prior-authorization-delays-revenue-stability)
- [Avenue Billing — CO-197 Denial Code](https://avenuebillingservices.com/co-197-denial-code/)
- [BillingParadise — ABA Revenue Rescue](https://www.billingparadise.com/blog/reduce-aba-cancellations-boost-revenue/)
- [Brellium — CPT 97155 Explained](https://brellium.com/resources/articles/understanding-and-applying-the-97155-cpt-code)
- [CentralReach — Proactive Authorization Management](https://centralreach.com/blog/enhance-aba-practices-with-proactive-authorization-management/)
- [Cross River Therapy — Session Cancellations](https://www.crossrivertherapy.com/articles/how-to-handle-session-cancellations-in-aba-therapy)
- [Cube Therapy Billing — ABA Billing Playbook 2025-2026](https://www.cubetherapybilling.com/aba-billing-playbook)
- [Cube Therapy Billing — CPT 97154 Guide](https://www.cubetherapybilling.com/what-is-cpt-code-97154)
- [Cube Therapy Billing — Prior Authorization Management](https://www.cubetherapybilling.com/what-is-a-priorauthorization)
- [MBWRCM — ABA Medical Billing Case Study](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-medical-billing-services-case-study)
- [Motivity — Scheduling Strategies](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)
- [Operant Billing — Authorization Management](https://operantbilling.com/improving-authorization-management-in-aba-therapy-a-path-to-financial-health-and-client-success/)
- [Operant Billing — Rendering Provider Guide](https://operantbilling.com/rendering-provider-in-aba-therapy-billing-a-comprehensive-guide/)
- [Passage Health — ABA Credentialing](https://www.passagehealth.com/blog/aba-credentialing)
- [Passage Health — ABA Denial Management](https://www.passagehealth.com/blog/aba-denial-management)
- [Praxis Notes — Authorization Gap Guide](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide)
- [Raven Health — ABA Practice Metrics](https://ravenhealth.com/blog/aba-practice-metrics-to-track/)
- [SimiTree — Clean Claims Rate](https://simitreehc.com/simitree-blog/how-to-calculate-and-improve-your-behavioral-health-clean-claims-rate/)
- [TherapyPM — 5 Common ABA Claim Denials](https://therapypms.com/5-common-aba-claim-denials-and-strategies-to-avoid-them/)
- [Wayfinder RCM — Coordination of Benefits](https://www.wayfinderrcm.com/blog/how-coordination-of-benefits-impacts-billing-for-aba-services)
- [Your Missing Piece — Managing Authorizations](https://yourmissingpiece.com/resources/managing-your-aba-authorizations/)
- [Your Missing Piece — Optimizing Authorizations and Scheduling](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
