# ABA Scheduling: Clinical Edge Cases Research

> **Purpose:** Document the domain-specific scheduling edge cases that generic scheduling software misses. Each edge case describes the scenario, what goes wrong if unhandled, and the recommended handling (warning, block, or informational display).
>
> **Last updated:** 2026-03-28
>
> **Research sources:** BACB official documentation (2026 standards), ABA Coding Coalition FAQs, payer policy documents (TRICARE/Humana Military, UHC/Optum, Anthem, state Medicaid programs), ABA billing specialist resources (Cube Therapy Billing, Operant Billing, Passage Health), competitor feature analysis (CentralReach, Theralytics, Passage Health), practitioner resources (Cross River Therapy, ABA Building Blocks, Your Missing Piece).

---

## Table of Contents

1. [Supervision Requirements (Edge Cases 1-7)](#1-supervision-requirements)
2. [Session Type Complexity (Edge Cases 8-13)](#2-session-type-complexity)
3. [Payer-Specific Rules (Edge Cases 14-19)](#3-payer-specific-rules)
4. [Client-Specific Constraints (Edge Cases 20-25)](#4-client-specific-constraints)

---

## 1. Supervision Requirements

### Edge Case 1: BACB 5% Monthly Supervision Pacing

**Scenario:** An RBT delivers 120 hours of 97153 in a month. BACB requires at least 5% supervision = 6 hours minimum. The BCBA has scheduled only 4 hours of supervision with 5 days left in the month.

**What goes wrong if unhandled:** The RBT's certification is at risk. If the practice fails to meet the 5% threshold consistently, BACB can revoke the RBT's credential. Unlike billing issues (which lose money), this is a *certification compliance* failure that can remove a provider from the workforce entirely. Practices often discover the shortfall after month-end when it is too late to schedule additional supervision.

**Recommended handling:** **Warning (proactive, dashboard-level).** Display a real-time supervision pacing tracker per RBT per month. Calculate: (supervision hours delivered so far) / (total RBT service hours delivered so far) as a running percentage. Alert at three thresholds:
- **Informational** (week 2): "RBT is at 3.8% supervision pace — on track if planned sessions hold."
- **Warning** (week 3): "RBT is at 3.2% — below 5% pace. Schedule additional supervision this week."
- **Critical** (final week): "RBT at 4.1% with 2 days remaining — needs 1.9 more hours to meet 5%."

---

### Edge Case 2: Minimum 2 Face-to-Face Contacts Per Month

**Scenario:** A BCBA supervises an RBT via one in-person observation and conducts the remaining supervision through phone calls and email feedback. The BCBA believes they have met supervision requirements.

**What goes wrong if unhandled:** BACB requires at least 2 face-to-face (in-person or live video) contacts per month, regardless of the 5% hour calculation. Phone calls, emails, and asynchronous review do not count. A BCBA who meets the 5% hours entirely through non-face-to-face methods is still non-compliant.

**Recommended handling:** **Warning (scheduling + dashboard).** Track supervision contacts by type (in-person, live video, phone/other). When scheduling a supervision session, tag whether it is face-to-face. On the supervision dashboard, show: "Face-to-face contacts this month: 1 of 2 required." Alert the BCBA when the month is >50% elapsed with <2 face-to-face contacts scheduled.

---

### Edge Case 3: 50% Individual Supervision Rule (Group vs. Individual)

**Scenario:** A BCBA runs a weekly group supervision meeting with 6 RBTs (1 hour each week = 4 hours/month group). For one RBT who works 80 hours/month, the 5% requirement is 4 hours. The BCBA provides all 4 hours via group supervision and zero individual supervision.

**What goes wrong if unhandled:** BACB requires that at least 50% of supervision hours be individual (one-on-one). The RBT receiving 4 hours of group supervision and 0 hours of individual supervision violates this rule, even though the 5% total is met. The practice is non-compliant.

**Recommended handling:** **Warning (at scheduling + dashboard).** When a BCBA schedules a group supervision session, calculate the running individual-vs-group ratio for each RBT in the group. Alert: "RBT Sarah has 3 hours group / 0.5 hours individual this month (86% group). BACB requires at least 50% individual." Prevent the ratio from exceeding 50% group without explicit override.

---

### Edge Case 4: Concurrent Billing During BCBA Supervision Overlap

**Scenario:** BCBA joins an ongoing RBT session (97153) and bills 97155 for protocol modification. The RBT session runs 9:00-12:00. The BCBA is present from 10:00-11:00. Both providers bill for the overlapping hour.

**What goes wrong if unhandled:** This is *correct and expected* billing — two different providers, two different CPT codes, same client, overlapping time. However, software that treats overlapping sessions as conflicts will flag or block this valid scenario. The opposite error is also dangerous: if the *same* provider tries to bill both 97153 and 97155 for overlapping time, that is fraud. The system must distinguish "different-provider overlap" (valid) from "same-provider overlap" (invalid).

**Recommended handling:** **Informational display (not a conflict).** When creating a BCBA session (97155) that overlaps with an existing RBT session (97153) for the same client:
- Allow it without conflict warning if the providers are different.
- Display: "This session overlaps with Sarah's 97153 session (9:00-12:00). Concurrent billing will apply."
- **Hard block** if the same provider attempts to bill 97153 and 97155 for overlapping time on the same client.
- Link the supervision session to the RBT session for BACB tracking purposes.

---

### Edge Case 5: BCaBA Supervision Chain (Supervisor Who Needs a Supervisor)

**Scenario:** A BCaBA supervises 3 RBTs and is herself supervised by a BCBA. The BCaBA's supervision sessions with RBTs need to be scheduled, AND the BCBA's supervision sessions with the BCaBA need to be scheduled. The BCaBA delivers 60 hours of service monthly and requires supervision from a BCBA (5% for first 1,000 hours post-certification = 3 hours/month minimum). Meanwhile, each RBT she supervises also needs 5% supervision.

**What goes wrong if unhandled:** The two-tier supervision chain creates a scheduling puzzle. The BCBA must schedule time to supervise the BCaBA, who must schedule time to supervise each RBT. If the BCBA's availability is constrained, the entire chain can fail. Additionally, effective January 2026, the BCaBA must have completed the 8-Hour Supervision Training to supervise RBTs. If this credential expires or was never completed, the BCaBA cannot serve as an RBT supervisor.

**Recommended handling:** **Warning (multi-level).** Model supervision as a chain: BCBA -> BCaBA -> RBTs. Track BCaBA supervision requirements separately from RBT supervision requirements. Alert when:
- The BCaBA is falling behind on receiving supervision from the BCBA.
- The BCaBA's RBTs are falling behind on receiving supervision from the BCaBA.
- The BCaBA's 8-Hour Supervision Training credential is expired or missing (hard block on scheduling supervision sessions).

---

### Edge Case 6: Supervision Across Telehealth + In-Person Split

**Scenario:** A BCBA observes an RBT's in-home session via live video (telehealth supervision) for one contact, and conducts the second monthly contact in person at the clinic. The payer (UHC/Optum) requires the supervisor and treating provider to be in the same physical location for 97155 billing.

**What goes wrong if unhandled:** BACB allows telehealth supervision (live video counts as face-to-face). However, specific payers may not reimburse 97155 when the BCBA is not physically present. The BCBA meets BACB requirements but the claim is denied. The practice loses revenue and may not discover this until ERA processing weeks later.

**Recommended handling:** **Warning (payer-specific, at scheduling).** When scheduling a supervision session tagged as telehealth:
- Check the client's active payer.
- If the payer has a known same-location requirement for 97155 (e.g., UHC/Optum), warn: "This client's payer (UHC) may require BCBA to be physically present for 97155 billing. Telehealth supervision may not be reimbursable."
- The session should still be allowed (it satisfies BACB requirements even if not billable).
- Track as "BACB-compliant but potentially non-billable."

---

### Edge Case 7: Noncertified Supervisor Elimination (January 2026 Change)

**Scenario:** A practice has been using a licensed psychologist (non-BCBA) as an RBT supervisor. As of January 1, 2026, noncertified RBT supervisors are no longer permitted by BACB. The practice's scheduling system still allows this psychologist to be assigned as a supervisor for RBT sessions.

**What goes wrong if unhandled:** Any supervision provided by a noncertified supervisor after January 1, 2026 does not count toward BACB requirements. RBTs supervised only by noncertified individuals will fall out of compliance, risking certification loss. The practice may believe supervision is being met when it is not.

**Recommended handling:** **Hard block (credential-gated).** Only allow providers with active BCBA, BCBA-D, or BCaBA credentials (plus verified 8-Hour Supervision Training completion) to be scheduled as RBT supervisors. If a provider's credential type does not qualify, prevent assignment as supervisor with message: "Only BCBA, BCBA-D, or BCaBA with current 8-Hour Supervision Training can supervise RBTs (BACB effective January 2026)."

---

## 2. Session Type Complexity

### Edge Case 8: Group Therapy Minimum/Maximum Size (97154/97157/97158)

**Scenario:** A clinic schedules a social skills group (97158, BCBA-led) with 4 clients for Tuesday 3-5pm. On Tuesday morning, 3 of 4 clients cancel. The remaining single client shows up.

**What goes wrong if unhandled:** Group codes (97154, 97157, 97158) require a minimum of 2 patients. A single client does not constitute a group. If the BCBA delivers the session to one client and bills 97158, the claim will be denied. The BCBA must either convert to an individual session (97155) or cancel. However, 97155 may not be authorized for this client, or may have a different authorization limit. Additionally, group sessions have a maximum of 8 patients. Scheduling a 9th client into a group should be prevented.

**Recommended handling:** **Warning at session conversion + hard block at claim.** At scheduling: allow adding 2-8 clients per group slot. Display current enrollment count. When converting a group session to a completed session:
- If attendance < 2: "Only 1 client attended. This cannot be billed as a group session (97154/97157/97158). Convert to individual session (97155) or mark as cancelled?"
- If enrollment > 8: "Group exceeds maximum of 8 patients. Remove clients or split into two groups."
- Track each client's individual attendance for their own billing record.

---

### Edge Case 9: Assessment Sessions (97151) — Non-Recurring, Multi-Hour, Time-Limited

**Scenario:** A new client is authorized for an initial assessment: 32 units (8 hours) of 97151, to be completed within 14 calendar days. The scheduler creates a recurring weekly appointment for 97151.

**What goes wrong if unhandled:** Assessments are fundamentally different from treatment sessions. They are one-time events (initial + periodic reassessments), authorized for a fixed total number of units (not weekly), and must be completed within a specific window (often 14 days). A recurring template is wrong — it will schedule assessments into perpetuity. Additionally, 97151 uniquely includes both face-to-face and indirect time (data analysis, scoring, report writing), so the scheduled face-to-face time may not equal the billed units.

**Recommended handling:** **Informational + scheduling guard.** When scheduling 97151:
- Default to single/multi-day appointments, NOT recurring.
- Display: "Assessment authorization: 32 units remaining, must complete by [date + 14 days]."
- If a user tries to create a recurring template for 97151, warn: "Assessment codes are typically one-time. Create as individual appointments instead?"
- Allow splitting across multiple days (e.g., 4 hours day 1, 4 hours day 3) but track cumulative units against the authorization.
- Show both direct (face-to-face) and indirect time fields, since 97151 allows billing for both.

---

### Edge Case 10: Parent/Caregiver Training (97156) — Different Scheduling Pattern

**Scenario:** A BCBA schedules parent training (97156) at 4pm on a Wednesday. The RBT's direct therapy session (97153) for the same client runs 1-4pm on Wednesdays. The parent arrives at 4pm expecting training, but the BCBA is not available because they are supervising another RBT at a different location at that time.

**What goes wrong if unhandled:** Parent training (97156) follows a different scheduling pattern than direct therapy. It is typically less frequent (1-2x per month vs. 3-5x per week for 97153), requires caregiver availability (not just child availability), and is often scheduled back-to-back with an existing therapy session for convenience. Unlike direct therapy, the child may or may not be present. Some payers mandate minimum frequency: TRICARE requires at least 1 session of 97156 within 30 days of authorization start, and at least 6 sessions per 6-month authorization period. If parent training falls off the schedule, the authorization may be non-compliant.

**Recommended handling:** **Warning (scheduling + dashboard).** Treat 97156 as a distinct scheduling category:
- When creating a 97156 appointment, prompt for caregiver name/availability (not just child availability).
- Show payer-specific frequency requirements: "TRICARE: minimum 1 session within 30 days of auth start."
- Track 97156 frequency against payer minimums on the authorization dashboard.
- Alert: "Client has 0 parent training sessions scheduled this month. TRICARE requires minimum frequency."
- When scheduling 97156, suggest time slots adjacent to existing 97153 sessions for the same client (convenience pattern).

---

### Edge Case 11: Protocol Modification (97155) Concurrent with Direct Therapy (97153)

**Scenario:** A BCBA arrives at the RBT's in-home session at 10:00am. The RBT session runs 9:00am-12:00pm (97153). The BCBA works with the RBT and client from 10:00-11:00, modifying the treatment protocol, then spends 11:00-11:30 speaking with the parent about implementing changes. The BCBA bills 97155 for 10:00-11:00 and 97156 for 11:00-11:30 on the same day.

**What goes wrong if unhandled:** This is a valid three-code day: 97153 (RBT, full session), 97155 (BCBA overlap, protocol modification), and 97156 (BCBA, parent training). All three can coexist on the same day for the same client with different providers. However, software that only models one session per client per time slot will block or corrupt this scenario. The system needs to handle:
1. RBT billing 97153 for the full 3-hour block.
2. BCBA billing 97155 for 1 hour overlapping with the 97153 session.
3. BCBA billing 97156 for 30 minutes after the overlap.
4. The 97155 and 97156 are sequential for the BCBA (no overlap of BCBA's own time).
5. The 97155 overlaps with the RBT's 97153 (different providers = valid).

**Recommended handling:** **Informational display (multi-layer view).** The calendar must support showing multiple concurrent sessions for the same client in the same time slot. Display the sessions in a stacked or layered view:
- RBT session (97153): 9:00-12:00 — full width.
- BCBA session (97155): 10:00-11:00 — overlay on the RBT session.
- BCBA session (97156): 11:00-11:30 — adjacent to 97155.
- Validate: no single provider has overlapping time across their own sessions.

---

### Edge Case 12: Split Sessions — Same Client, Same Day, Same CPT Code

**Scenario:** A school-age client has ABA therapy (97153) from 7:30-9:00am before school, then resumes from 3:30-5:30pm after school. The combined units for the day are 16 (4 hours), well within the MUE of 32. The scheduler creates two separate appointments for the same client, same RBT, same CPT code, same day.

**What goes wrong if unhandled:** Many payers require modifier -59 or -XS for same-day, same-code services to indicate they are distinct sessions. Without the modifier, the second claim line may be denied as a duplicate. Additionally, the system must track combined daily units across both sessions to enforce MUE limits. If the morning session is 12 units and the afternoon session is 22 units, the combined 34 units exceed the MUE of 32 and will trigger denial or manual review.

**Recommended handling:** **Warning (at scheduling + at claim generation).** When scheduling a second session for the same client, same CPT code, same day:
- Display: "This client already has a 97153 session today (7:30-9:00am, 6 units). Combined daily total will be 14 units."
- If combined units exceed MUE: **Hard block** with "Combined daily units (34) exceed MUE limit (32) for 97153. Reduce session length or split across days."
- At claim generation: auto-add modifier -59 or -XS for the second session on the same day.
- Track cumulative daily units per CPT code per client on the scheduling view.

---

### Edge Case 13: BCBA Billing QHP-Only Codes While RBT Bills Technician Codes

**Scenario:** An RBT attempts to bill 97155 (protocol modification) after spending time adjusting a program during a session. Or a BCBA attempts to bill 97153 (technician-delivered treatment) for a session where they were the sole provider.

**What goes wrong if unhandled:** CPT codes are credential-gated:
- 97153 (treatment by protocol) and 97154 (group treatment by protocol): Technician-delivered. RBTs bill these.
- 97155 (protocol modification), 97156 (parent training), 97157 (group parent training), 97158 (group treatment with protocol modification): QHP-only. Only BCBAs/BCaBAs bill these.
- A BCBA *can* deliver 97153 (they are qualified to do what an RBT does), but this is unusual and may raise payer questions about medical necessity for a higher-credentialed provider doing technician-level work.
- An RBT *cannot* bill 97155 under any circumstance.

**Recommended handling:** **Hard block (credential validation at scheduling).** When assigning a CPT code to a session:
- If provider is RBT and code is 97155/97156/97157/97158: **Block** with "RBTs cannot bill QHP-only codes (97155, 97156, 97157, 97158). Only BCBA or BCaBA providers may bill these codes."
- If provider is BCBA and code is 97153: **Warning** with "BCBAs typically bill 97155 for direct clinical work. Billing 97153 (technician code) as a BCBA may trigger payer review. Continue?" (Allow override — there are valid scenarios such as covering for an absent RBT.)

---

## 3. Payer-Specific Rules

### Edge Case 14: Payer-Specific Daily Hour Caps

**Scenario:** A client with Indiana Medicaid is scheduled for a 5-hour direct therapy session (97153, 20 units). Indiana Medicaid caps ABA at 30 hours per week. The client is already scheduled for 28 hours that week across Mon-Thu. The Friday 5-hour session would put the total at 33 hours.

**What goes wrong if unhandled:** Unlike MUE limits (which are per-CPT per-day), some payers impose weekly or daily aggregate caps across all ABA codes. Indiana Medicaid proposed a 30-hour weekly cap. Some commercial payers cap daily sessions at 4 hours. These caps are not universal — they vary by payer, plan, and state. A session that is valid under MUE rules may still be denied because it violates a payer-specific aggregate cap.

**Recommended handling:** **Warning (payer-configurable).** Allow payer records to include optional scheduling rules:
- Weekly hour cap (e.g., Indiana Medicaid: 30 hours/week).
- Daily hour cap (e.g., some commercial plans: 4 hours/day).
- When scheduling, check the client's payer rules and display: "This session would bring the weekly total to 33 hours. Client's payer (Indiana Medicaid) caps at 30 hours/week."
- This should be a warning, not a block — the payer may approve exceptions for intensive cases.

---

### Edge Case 15: MUE Limits Across Split Sessions

**Scenario:** A client has a morning 97153 session (24 units / 6 hours) and the scheduler books an afternoon 97153 session (12 units / 3 hours). Combined: 36 units, exceeding the MUE of 32 units per day for 97153.

**What goes wrong if unhandled:** MUE Adjudication Indicator for ABA codes is "3" — meaning units *may* be paid in excess of MUE if properly justified, but in practice, exceeding MUE triggers manual review and most claims are denied without compelling medical necessity documentation. The scheduler may not realize the two sessions for the same client on the same day push past the MUE threshold.

**Recommended handling:** **Warning (with daily unit accumulator).** Display a running total of daily units per CPT code per client on the scheduling view. When a new session would cause the daily total to exceed MUE:
- Warn: "Combined daily units for 97153 would be 36. MUE limit is 32 units/day. Claims exceeding MUE require medical necessity justification and are frequently denied."
- Allow override with acknowledgment (MUE indicator 3 means it is possible but risky).
- At claim generation: flag for manual review before submission.

---

### Edge Case 16: TRICARE Mandatory Parent Training Timing

**Scenario:** A new TRICARE client starts ABA services on March 1. The BCBA schedules direct therapy (97153) and supervision (97155) immediately but delays parent training (97156) because the parent's schedule is difficult. By March 31, zero parent training sessions have been delivered.

**What goes wrong if unhandled:** TRICARE/Humana Military requires at least 1 session of parent training (97156 or 97157) within 30 days of authorization start. Missing this deadline can result in the entire authorization being flagged for non-compliance, potentially affecting re-authorization. TRICARE also requires a minimum of 6 parent training sessions per 6-month authorization period. Falling behind on this frequency puts the practice at risk during the renewal review.

**Recommended handling:** **Warning (payer-specific, proactive).** When a client's payer is TRICARE:
- On day 1 of authorization: "TRICARE requires parent training (97156/97157) within 30 days. Schedule now?"
- At day 15 with no 97156 scheduled: "15 days remaining for mandatory TRICARE parent training. No sessions scheduled."
- At day 25 with no 97156 delivered: **Critical alert:** "5 days remaining for mandatory TRICARE parent training. Non-compliance may affect authorization."
- Track 97156 frequency against the 6-sessions-per-6-months minimum on the authorization dashboard.

---

### Edge Case 17: Authorization Gap During Renewal

**Scenario:** A client's authorization expires March 31. The BCBA submits the re-authorization request on March 20 (10 days before expiration). The payer takes 15 business days to process. The new authorization is approved on April 10. The client has sessions scheduled for April 1-9 that fall in the coverage gap.

**What goes wrong if unhandled:** Sessions delivered during an authorization gap are typically non-reimbursable. At $30-60 per 15-minute unit, a full-time client (20+ hours/week) could generate thousands of dollars in unrecoverable revenue loss during a 10-day gap. Additionally, the clinical disruption of pausing services harms the client's progress. Some payers allow retroactive authorization, but this is not guaranteed and requires additional documentation.

**Recommended handling:** **Warning (proactive, multi-stage).** Authorization expiration alerts:
- **45 days before expiration:** "Authorization expiring in 45 days. Begin re-authorization documentation."
- **30 days before expiration:** "Authorization expiring in 30 days. Submit re-authorization now to avoid gap." (Industry best practice is 30-day advance submission.)
- **14 days before expiration:** "Authorization expiring in 14 days. Has re-authorization been submitted?"
- **Day of expiration with no new auth:** "Authorization expired. Sessions scheduled after today will not be covered."
- **During gap:** Allow scheduling with prominent visual indicator: "AUTHORIZATION GAP — sessions may not be reimbursable" displayed on each affected appointment.
- Do NOT hard-block scheduling during gaps — the practice may choose to provide services at financial risk to maintain clinical continuity.

---

### Edge Case 18: Same-Day Billing Restrictions Vary by Payer

**Scenario:** A BCBA provides both protocol modification (97155, 10:00-11:00) and parent training (97156, 11:00-12:00) for the same client on the same day. One payer (Anthem) allows this; another payer (UHC) requires prior authorization for same-day multi-code billing.

**What goes wrong if unhandled:** Same-day billing of multiple ABA codes for the same client is generally allowed when services are separate and distinct, delivered by different providers (or the same QHP for different service types), and properly documented with separate start/end times. However, specific payers have additional requirements: some require modifiers (-25, -59, -XU), some require prior authorization for concurrent billing, and some restrict certain code combinations entirely. A practice that assumes universal same-day billing rules will experience inconsistent denials.

**Recommended handling:** **Warning (payer-configurable).** Allow payer records to include same-day billing rules:
- Default: allow same-day multi-code sessions with informational notice.
- Payer-specific overrides: "UHC requires prior auth for same-day 97155 + 97156" or "Anthem restricts concurrent 97153 + 97155 without specific documentation."
- When scheduling same-day multi-code sessions, check payer rules and display relevant warnings.
- This is a Phase 2+ feature — for MVP, display a generic informational message: "Multiple ABA codes scheduled for same client on same day. Verify payer allows same-day billing."

---

### Edge Case 19: Medicaid Quarterly Re-Authorization Scheduling Impact

**Scenario:** A Medicaid client's authorization is approved in 90-day cycles. The BCBA must produce a progress report at each re-authorization. The report requires data from recent sessions. The scheduler builds a recurring template for the full year, but every 90 days, there is a brief period where the authorization status is uncertain.

**What goes wrong if unhandled:** Medicaid quarterly re-authorization creates a repeating cycle of uncertainty. If the recurring template extends past the current 90-day authorization period, sessions in the next period are scheduled against an authorization that does not yet exist. If re-authorization is denied or modified (fewer hours approved, different CPT codes), all pre-scheduled sessions for the next period are invalid and must be rescheduled.

**Recommended handling:** **Warning (at template creation + proactive alerts).** When creating a recurring template for a Medicaid client:
- Display: "This client's authorization expires [date]. Recurring sessions beyond this date are pending re-authorization."
- Visually differentiate sessions within active authorization (solid) vs. beyond authorization end date (dashed/faded).
- 30 days before each re-authorization deadline: "Progress report due for Medicaid re-authorization. Ensure recent session data is complete."
- When re-authorization is received with different parameters: flag all affected scheduled sessions for review.

---

## 4. Client-Specific Constraints

### Edge Case 20: School-Age Child Availability Windows

**Scenario:** A 7-year-old client attends school from 8:00am-2:45pm. The practice schedules 97153 sessions for 3:00-6:00pm after school. During summer break (June-August), the client is available full-day. When school resumes in September, the schedule must revert to after-school hours only.

**What goes wrong if unhandled:** School-age children have bifurcated availability: limited after-school hours during the school year (typically 3pm-7pm), and full-day availability during summer/breaks. The 3pm-7pm window is the most competitive scheduling window in ABA — every school-age client in the practice needs it. If the system does not model seasonal availability transitions, the scheduler must manually rebuild templates for every school-age client twice per year. Additionally, after-school hours may not be sufficient to deliver the authorized hours (20 hours/week in a 3pm-7pm window across 5 days = 20 hours, but with travel time and breaks, effective capacity is 12-15 hours).

**Recommended handling:** **Informational (template management feature).** Support two template sets per client: "School Year" and "Summer/Break." Allow the scheduler to define availability windows per client (school hours, after-school hours, full-day) and switch between template sets at seasonal transitions. When a template exceeds the available hours window: "Scheduled hours (20/week) may not fit within after-school availability (3:00-6:30pm, 17.5 hours/week max). Consider adding a weekend session or reducing hours."

---

### Edge Case 21: Sibling Scheduling (Two Clients, Same Address, Same or Different Providers)

**Scenario:** A family has two children receiving ABA services. Child A has sessions Mon/Wed/Fri 9am-12pm with RBT Sarah. Child B has sessions Mon/Wed/Fri 1pm-4pm with RBT Maria. The family requests that both children be served simultaneously (9am-12pm) to reduce disruption. This requires two RBTs at the same address at the same time.

**What goes wrong if unhandled:** Sibling scheduling has several complexities:
1. **Same time, same address, different providers:** This is valid — each RBT provides 1:1 therapy to a different child. But the system must not flag this as a location conflict.
2. **Same provider, sequential siblings:** One RBT serves Child A from 9-12, then Child B from 12-3 at the same address. No travel time needed between sessions (same location). The system should not insert a travel buffer.
3. **Shared parent training:** The BCBA may deliver parent training (97156) to the parent covering strategies for both children. This is billed once per child, but delivered in a single session. Some payers may question double-billing 97156 for the same time period.
4. **Authorization independence:** Each child has their own authorization, payer, and approved hours. Scheduling one sibling cannot affect the other's authorization tracking.

**Recommended handling:** **Informational (family-aware scheduling).** Link sibling client records (optional family/household grouping). When scheduling at the same address:
- Suppress travel time warnings for consecutive sessions at the same location.
- Allow multiple providers at the same address simultaneously.
- When scheduling 97156 for siblings at the same time: warn "Parent training billed for two clients during the same time period. Some payers may require separate documentation demonstrating distinct services per child."

---

### Edge Case 22: RBT Transition / New Therapist Introduction

**Scenario:** An RBT is leaving the practice. Their 5 clients need to be transitioned to new RBTs. The practice wants to schedule 2-3 overlap sessions where both the outgoing and incoming RBT are present with each client, so the new RBT can observe the client's behavior patterns and the outgoing RBT can share effective strategies.

**What goes wrong if unhandled:** During transition overlap sessions:
1. **Only one RBT can bill 97153** for the session — the second RBT is observing, not delivering billable treatment. If both bill, it is a duplicate claim.
2. **The overlap session counts against authorization units** for the client — the family may not realize their authorized hours are being used for transition rather than treatment.
3. **The BCBA should ideally be present** for at least one transition session to facilitate clinical handover, adding a third person to coordinate.
4. If the system does not track which RBT is the "primary" vs. "observing" provider for transition sessions, billing errors will occur.

**Recommended handling:** **Warning (at scheduling).** When scheduling a session with two RBTs for the same client:
- Prompt: "Is this a transition/overlap session? Only one RBT can bill for this session."
- Require designation of primary (billing) RBT vs. observing RBT.
- Display: "Observing RBT will not generate a billable session."
- Track transition sessions as a distinct category so the practice can monitor how many authorization units are consumed for transitions.

---

### Edge Case 23: Client Behavioral Needs Affecting Session Timing

**Scenario:** A client with severe behavioral challenges has historically had more productive sessions in the morning (fewer meltdowns, better engagement). The BCBA documents this in the treatment plan. The scheduler assigns the client to a 4pm slot because that is the only opening the RBT has.

**What goes wrong if unhandled:** While time-of-day preference is not a billing or compliance requirement, it directly affects clinical outcomes. A client who consistently has behavioral crises in afternoon sessions will show less progress, which can lead to payer questions about treatment effectiveness during re-authorization review. The treatment plan may specify preferred session times as part of the clinical protocol.

**Recommended handling:** **Informational (client profile field).** Add a "Scheduling Notes" or "Preferred Session Times" field to the client profile:
- Display when scheduling: "Clinical note: Morning sessions recommended per treatment plan (behavioral data shows 40% fewer incidents before 12pm)."
- This is advisory only — no block, no warning dialog. Just visible context during scheduling.
- Allow the BCBA to update this field as clinical data changes.

---

### Edge Case 24: Caregiver Availability Window Constraints

**Scenario:** For home-based ABA, a caregiver must be present in the home during sessions (required by most payers and by clinical protocol for children). The caregiver works Monday-Friday 9am-2pm. The only available window for in-home therapy is 2:30pm-6:30pm weekdays and weekends. The authorization approves 25 hours/week, but the available caregiver windows only support 20 hours/week.

**What goes wrong if unhandled:** The scheduler may create a template for 25 hours/week that includes morning sessions when the caregiver is not home. Sessions delivered without a caregiver present may violate payer requirements and clinical safety protocols. At minimum, the RBT arrives to a locked house. At worst, the practice bills for sessions that did not occur as planned, creating compliance risk.

**Recommended handling:** **Warning (at scheduling).** Add optional "Caregiver Availability" to client profile (separate from child availability):
- When scheduling an in-home session outside caregiver availability: "No caregiver available at scheduled time. In-home sessions typically require caregiver presence."
- When authorized hours exceed available scheduling windows: "Authorized hours (25/week) exceed available caregiver windows (20 hours/week). Client may under-utilize authorization. Discuss with family about alternative scheduling options (clinic-based, weekend sessions)."

---

### Edge Case 25: Provider Credential Expiration Mid-Schedule

**Scenario:** An RBT's BACB registration expires on April 15. The practice has sessions scheduled through April 30. The RBT fails to renew on time. Sessions from April 16-30 are delivered by an individual who is no longer a credentialed RBT.

**What goes wrong if unhandled:** Services delivered by a non-credentialed provider are not billable. If the practice does not catch the lapsed credential, they will submit claims for 2 weeks of unbillable sessions. When the payer discovers the credential gap (during audit or ERA processing), all claims for that period will be denied or recouped. Additionally, the provider may be flagged, affecting future credentialing with that payer.

**Recommended handling:** **Hard block (at credential expiration) + proactive warning.**
- **60 days before expiration:** "RBT Sarah's BACB registration expires April 15. Begin renewal process."
- **30 days before expiration:** "RBT Sarah's credential expires in 30 days. Sessions scheduled after April 15 may not be billable."
- **14 days before expiration:** "Urgent: RBT Sarah's credential expires in 14 days. [X] sessions are scheduled after expiration."
- **On expiration date (if not renewed):** **Hard block** on creating new sessions for this provider. Existing scheduled sessions after the expiration date are flagged red: "Provider credential expired. Session will not be billable. Reassign to a credentialed provider."
- Allow admin override with acknowledgment (the RBT may be in the renewal process and expected to be re-credentialed soon).

---

## Summary Matrix

| # | Edge Case | Category | Handling | Severity |
|---|-----------|----------|----------|----------|
| 1 | BACB 5% monthly supervision pacing | Supervision | Warning (dashboard) | High |
| 2 | Minimum 2 face-to-face contacts/month | Supervision | Warning (scheduling + dashboard) | High |
| 3 | 50% individual supervision rule | Supervision | Warning (scheduling + dashboard) | Medium |
| 4 | Concurrent billing during supervision overlap | Supervision | Informational (allow) + block same-provider overlap | Critical |
| 5 | BCaBA supervision chain | Supervision | Warning (multi-level) | Medium |
| 6 | Telehealth supervision + payer restrictions | Supervision | Warning (payer-specific) | Medium |
| 7 | Noncertified supervisor elimination (2026) | Supervision | Hard block (credential-gated) | Critical |
| 8 | Group therapy min/max size | Session Type | Warning + block at claim | High |
| 9 | Assessment (97151) non-recurring scheduling | Session Type | Informational + guard | Medium |
| 10 | Parent training (97156) frequency requirements | Session Type | Warning (payer-specific) | High |
| 11 | Protocol modification concurrent with direct therapy | Session Type | Informational (multi-layer) | High |
| 12 | Split sessions same-day same-code | Session Type | Warning + daily unit tracking | High |
| 13 | Credential-gated CPT codes | Session Type | Hard block (RBT on QHP codes) | Critical |
| 14 | Payer-specific daily/weekly hour caps | Payer Rules | Warning (configurable) | High |
| 15 | MUE limits across split sessions | Payer Rules | Warning (daily accumulator) | High |
| 16 | TRICARE mandatory parent training timing | Payer Rules | Warning (proactive) | High |
| 17 | Authorization gap during renewal | Payer Rules | Warning (multi-stage) | Critical |
| 18 | Same-day multi-code payer restrictions | Payer Rules | Warning (payer-configurable) | Medium |
| 19 | Medicaid quarterly re-auth scheduling | Payer Rules | Warning (template + alerts) | Medium |
| 20 | School-age child availability windows | Client-Specific | Informational (template sets) | Medium |
| 21 | Sibling scheduling at same address | Client-Specific | Informational (family-aware) | Low |
| 22 | RBT transition overlap sessions | Client-Specific | Warning (billing designation) | Medium |
| 23 | Client behavioral needs / time-of-day preference | Client-Specific | Informational (profile field) | Low |
| 24 | Caregiver availability window constraints | Client-Specific | Warning (scheduling) | Medium |
| 25 | Provider credential expiration mid-schedule | Client-Specific | Hard block + proactive warning | Critical |

---

## Implementation Priority for Clinivise

### Must-have for scheduling MVP (Phase 5)

These edge cases, if unhandled, cause **claim denials, compliance failures, or revenue loss:**

1. **#4 — Concurrent billing overlap** (allow different-provider, block same-provider)
2. **#7 — Noncertified supervisor block** (credential-gated scheduling)
3. **#13 — Credential-gated CPT codes** (RBT cannot bill QHP codes)
4. **#15 — MUE daily accumulator** (track combined units per CPT per day per client)
5. **#17 — Authorization gap warnings** (multi-stage expiration alerts)
6. **#25 — Provider credential expiration** (block scheduling for expired credentials)
7. **#12 — Split session tracking** (same-day same-code daily unit totals)

### Should-have for scheduling v1.1

These improve compliance and reduce revenue leakage:

8. **#1 — BACB 5% supervision pacing** (dashboard tracker)
9. **#2 — Face-to-face contact tracking** (supervision type tagging)
10. **#8 — Group therapy min/max** (enrollment count + attendance check)
11. **#10 — Parent training frequency** (payer-specific minimums)
12. **#16 — TRICARE parent training mandate** (proactive alerts)
13. **#14 — Payer-specific hour caps** (configurable payer rules)

### Nice-to-have for scheduling v2.0

These improve UX and clinical workflow quality:

14. **#3 — 50% individual supervision rule**
15. **#5 — BCaBA supervision chain**
16. **#6 — Telehealth supervision payer restrictions**
17. **#9 — Assessment non-recurring guard**
18. **#11 — Multi-layer concurrent session display**
19. **#18 — Same-day multi-code payer warnings**
20. **#19 — Medicaid quarterly re-auth template management**
21. **#20 — School-age availability templates**
22. **#21 — Sibling scheduling**
23. **#22 — RBT transition sessions**
24. **#23 — Client time-of-day preferences**
25. **#24 — Caregiver availability windows**

---

## Sources

### Official / Regulatory
- [BACB RBT Ongoing Supervision Fact Sheet](https://www.bacb.com/rbt-ongoing-supervision-fact-sheet/)
- [BACB Supervision, Assessment, Training, and Oversight](https://www.bacb.com/supervision-and-training/)
- [BACB Recent & Upcoming Changes](https://www.bacb.com/upcoming-changes/)
- [BACB BCBA Handbook](https://www.bacb.com/wp-content/uploads/2025/08/BCBAHandbook_260130-a.pdf)
- [BACB RBT 2026 Requirements](https://www.bacb.com/wp-content/uploads/2025/07/RBT-2026-Requirements_250723-a.pdf)
- [ABA Coding Coalition — Billing Codes](https://abacodes.org/codes/)
- [ABA Coding Coalition — FAQs](https://abacodes.org/frequently-asked-questions/)
- [TRICARE Autism Care Demonstration](https://www.tricare.mil/autism)
- [Humana Military Treatment Plan Requirements](https://www.humanamilitary.com/provider/managedcare/acoe/treatmentplan)
- [TRICARE ABA Maximum Allowed Amounts](https://health.mil/Military-Health-Topics/Access-Cost-Quality-and-Safety/TRICARE-Health-Plan/Rates-and-Reimbursement/ABA-Max-Allowed-Amounts)

### BACB 2026 Changes
- [BACB Changes in 2026 — ABA Resource Center](https://www.abaresourcecenter.com/post/bacb-changes-in-2026)
- [Big BACB Updates for 2026-2027 — ATCC](https://www.atcconline.com/blog/summarized-december-2025-bacb-newsletter)
- [New RBT Requirements 2026 — Ensora Health](https://ensorahealth.com/blog/new-rbt-requirements-coming-in-2026/)
- [2026 RBT Updates — Theralytics](https://www.theralytics.net/blogs/2026-updates-for-rbts-and-rbt-supervisors)
- [Upcoming BACB Changes for BCBA and BCaBA — ReadySetABA](https://readysetaba.com/upcoming-bacb-changes-for-bcba-and-bcaba-certifications/)

### Billing / CPT Code Guides
- [ABA Billing Playbook 2025-2026 — Cube Therapy Billing](https://www.cubetherapybilling.com/aba-billing-playbook)
- [CPT 97155 Explained — Brellium](https://brellium.com/resources/articles/understanding-and-applying-the-97155-cpt-code)
- [CPT 97151 Guide 2026 — MedCloudMD](https://www.medcloudmd.com/post/cpt-code-97151-guide-2026)
- [CPT 97156 Parent Training — Brellium](https://brellium.com/resources/articles/understanding-and-applying-cpt-code-97156-for-aba-therapy)
- [Code 97157/97158 Guide — Operant Billing](https://operantbilling.com/code-97157-97158-in-aba-therapy-how-when-to-use-them/)
- [CPT 97154 Group Therapy Guide — Cube Therapy Billing](https://www.cubetherapybilling.com/what-is-cpt-code-97154)
- [ABA Billing Codes — Passage Health](https://www.passagehealth.com/blog/aba-billing-codes)
- [ABA CPT Codes Guide — AlohaABA](https://alohaaba.com/blogs/understanding-cpt-codes-for-aba-therapy-billing-a-comprehensive-guide)
- [BCBA Billing Guide for RBT Supervision — MBWRCM](https://www.mbwrcm.com/the-revenue-cycle-blog/bcba-billing-rbt-supervision-guide)

### Payer-Specific
- [States Refine ABA Coverage: Hour Caps, Age Limits, Rate Cuts — Behavioral Health Business](https://bhbusiness.com/2026/01/22/states-refine-aba-coverage-new-hour-caps-age-limits-rate-cuts/)
- [Indiana Medicaid Proposes 30-Hour Weekly Cap — Behavioral Health Business](https://bhbusiness.com/2025/01/17/indiana-medicaid-proposes-30-hour-weekly-lifetime-cap-for-aba/)
- [State Issues to Watch: ABA Hour Caps — Behavioral Health Business](https://bhbusiness.com/2025/03/03/state-issues-to-watch-in-autism-therapy-aba-hour-caps-rate-cuts/)
- [Authorization Gap Documentation Guide — Praxis Notes](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide)
- [ABA Authorization Management — ABA Matrix](https://www.abamatrix.com/aba-authorization-management/)
- [ABA Prior Authorization Checklist — MBWRCM](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-prior-authorization-checklist)

### Industry / Practitioner Resources
- [Scheduling Strategies for ABA Practices — Motivity](https://www.motivity.net/blog/scheduling-strategies-for-aba-practices)
- [Optimizing Authorizations and Scheduling — Your Missing Piece](https://yourmissingpiece.com/resources/optimizing-authorizations-and-scheduling/)
- [Transitioning to a New Behavior Technician — Circle City ABA](https://circlecityaba.com/transitioning-to-a-new-behavior-technician/)
- [How to Transition Between Therapists — Cross River Therapy](https://www.crossrivertherapy.com/articles/how-to-transition-between-therapists-in-long-term-aba-care)
- [BCBA Supervision Hours Breakdown — Operations Army](https://www.operationsarmy.com/post/bcba-supervision-hours-breakdown-percentages-contacts-and-observations-explained)
- [Decoding BACB Supervision Requirements — Hoom House](https://hoomhouse.com/blog/decoding-the-bacbs-supervision-requirements)
- [RBT Supervision Rules — Blue Jay ABA](https://www.bluejayaba.com/blog/rbt-supervision-requirements)
- [Navigating School Schedules for ABA — Lighthouse Autism Center](https://lighthouseautismcenter.com/blog/navigating-school-schedules-for-autistic-children-needing-aba-therapy-in-michigan/)
- [Home Based ABA Scheduling Strategies — Blue Jay ABA](https://www.bluejayaba.com/blog/home-based-aba-therapy-scheduling)
