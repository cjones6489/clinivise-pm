# ABA Scheduling Edge Cases: Master Reference

> **Purpose:** Single authoritative reference for every scheduling edge case identified across all research documents. Deduplicated, categorized by handling severity, and prioritized for implementation.
>
> **Last updated:** 2026-03-28
>
> **IMPORTANT — Validation framing (corrected 2026-03-28):**
> The "HARD BLOCK" category in this document was overstated. After deeper research:
> - **Only CPT code DEFINITIONS are truly universal** (7 rules — see CEO plan).
> - **Everything labeled "HARD BLOCK" for concurrent billing rules** is actually AMA/ABA
>   Coding Coalition guidance that individual payers can override. NC Medicaid blocks
>   97153+97155 concurrent billing. TRICARE restricts most concurrent billing. Anthem
>   has challenged it in some states. The ABA Coding Coalition states: "Policies vary
>   across payers, so providers should check their contract with each payer."
> - **MUE limits** are CMS rules. Commercial payers may apply different limits.
> - The implementation should treat non-definitional "HARD BLOCK" items as **configurable
>   defaults with payer override capability**, not absolute blocks.
> - See CEO plan "Validation Philosophy Amendment (CORRECTED)" for the authoritative
>   three-tier validation model.
>
> **Synthesized from:**
> - `scheduling-practitioner-pain-points.md` (20 pain points)
> - `scheduling-clinical-edge-cases.md` (25 edge cases)
> - `scheduling-billing-failure-modes-research.md` (25 failure modes)
> - `scheduling-operational-edge-cases.md` (26 scenarios)
> - `scheduling-user-complaints-research.md` (23 complaints + cross-platform issues)
> - `scheduling-domain-research.md` (domain context, validation rules, benchmarks)
> - `aba-scheduling-audit.md` (detailed CPT matrix, auth lifecycle, supervision, state rules)
> - `claude_scheduling_research.md` (payer rules table, platform complaints, practitioner research)

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| **Total unique edge cases** | 72 |
| **Hard Blocks** | 10 |
| **Warnings** | 27 |
| **Monitoring** | 16 |
| **Informational** | 12 |
| **Deferred** | 7 |

### Key Financial Data Points

| Statistic | Value | Source |
|-----------|-------|--------|
| National ABA claim denial rate (average) | 20-25% | MBWRCM case study |
| Well-managed practice denial rate | 5-6% | MBWRCM |
| Improper Medicaid ABA payments (Colorado) | $77.8M confirmed, $207M potential | HHS OIG March 2026 |
| Indiana improper ABA claims | $56M | Cube Therapy Billing |
| Cost per denial to rework | $25-30 | MGMA / Operant Billing |
| OIG time-unit overpayments (single year) | $200M+ | OIG 2021 |
| Revenue loss per 1-week auth gap (full-time client) | $1,500-3,000 | Annex Med |
| Revenue loss from under-scheduling (40-client practice) | ~$320K/year | ABA Building Blocks |
| Lost revenue per 500-client practice from rescheduling friction | $2.5M-$3.5M/year | Serious Development |
| Permanent revenue loss from missed makeup sessions | 19-23% of authorized hours | Billing research |

### Key Operational Data Points

| Statistic | Value | Source |
|-----------|-------|--------|
| Average individual cancellation rate | 38% (5.2 cancelled vs 9.0 completed) | Peer-reviewed study |
| Pediatric specialty no-show rate | 24.3% | Industry data |
| Telehealth cancellation rate | ~30% | Industry data |
| Target cancellation rate (well-run practice) | <10% | Industry benchmark |
| RBT turnover (small practices) | 77.4% annually | BH Field |
| RBT turnover (enterprise) | 103.3% annually | BH Field |
| Cost per RBT departure | $15,000-$25,000 | Measure PM |
| BCBAs reporting admin burden | 61% | RethinkBH 2025 survey (n=390) |
| BCBAs considering leaving profession | 58% | RethinkBH |
| BCBAs with no formal hours-determination training | 80% | BHB 2025 |
| Scheduler productivity ceiling (without automation) | 75-100 clients/FTE | Serious Development |
| BCBA time on direct therapy | 25% of week | RethinkBH |
| RBTs driving >1 hour between sessions | 30% (pre-restructuring) | Measure PM |
| National average ABA waitlist | 5.7 months | CentralReach |

---

## Categories

### HARD BLOCKS
Must prevent at scheduling time. Allowing these creates fraud risk, compliance failure, or impossible billing scenarios.

---

#### EC-001: Same Provider Overlapping 1:1 Sessions

- **Category:** HARD BLOCK
- **Title:** Same provider scheduled for overlapping 1:1 sessions
- **Scenario:** A provider is scheduled for two different 1:1 sessions at overlapping times. An RBT cannot be face-to-face with two clients simultaneously for 97153. If the schedule shows overlapping 1:1 sessions and both are billed, payer audit will flag this as fraud -- one person cannot be in two places at once.
- **Who is affected:** Provider (fraud risk), billing staff, practice owner
- **Frequency:** Per scheduling action (daily prevention needed)
- **Impact if unhandled:** Recoupment of all overlapping claims + potential fraud investigation. The OIG's $56M ABA audit specifically flags overlapping service times. If caught internally, one session must be cancelled (lost revenue) or reassigned.
- **Recommended handling:** Hard block at session creation. Prevent scheduling any 1:1 session for a provider who already has a 1:1 session at that time. Show conflict immediately when creating or moving a session. This is the most fundamental scheduling validation.
- **Source:** billing-failure-modes (FM 19), operational-edge-cases (5.1), domain-research (7B), clinical-edge-cases (#4 related)

---

#### EC-002: RBT Billing QHP-Only CPT Codes

- **Category:** HARD BLOCK
- **Title:** RBT assigned to QHP-only codes (97155, 97156, 97157, 97158)
- **Scenario:** An RBT is scheduled or attempts to bill 97155 (protocol modification), 97156 (parent training), 97157 (group parent training), or 97158 (group treatment with protocol modification). These codes require a Qualified Healthcare Provider (BCBA or BCaBA). An RBT cannot bill these under any circumstance.
- **Who is affected:** RBT, billing staff, practice owner
- **Frequency:** Per scheduling action for new session creation
- **Impact if unhandled:** 100% claim denial. Denial code CO-185 (provider not certified/eligible). Repeated violations trigger payer audit attention.
- **Recommended handling:** Hard block. When assigning a CPT code to a session, if the provider is an RBT and the code is 97155/97156/97157/97158, block with message: "RBTs cannot bill QHP-only codes. Only BCBA or BCaBA providers may bill these codes."
- **Source:** clinical-edge-cases (#13), billing-failure-modes (FM 9), domain-research (7B)

---

#### EC-003: Session Scheduled Against Expired Authorization

- **Category:** HARD BLOCK
- **Title:** Scheduling sessions under an expired authorization
- **Scenario:** An authorization has expired but the system still shows it as "active" because nobody updated the status. Sessions are scheduled against a dead authorization. The auto-pilot of recurring schedules continues generating sessions past the auth end date.
- **Who is affected:** Scheduler, billing staff, practice owner
- **Frequency:** Per authorization cycle (every 3-6 months per client)
- **Impact if unhandled:** 100% claim denial for all sessions under the expired auth. Denial code CO-27 (outside coverage dates) or CO-197 (authorization required but not found). At $30-60/unit, a full-time client generates $2,000-4,000/week in unbillable revenue.
- **Recommended handling:** Hard block. Auto-transition auth status to `expired` when end_date passes. Prevent scheduling new sessions against expired auth. For recurring templates, auto-flag instances that extend beyond auth end date. Only `active` and `expiring_soon` auths allow session scheduling.
- **Source:** billing-failure-modes (FM 1, FM 6), clinical-edge-cases (#17), domain-research (7B)

---

#### EC-004: Session CPT Code Not on Active Authorization

- **Category:** HARD BLOCK
- **Title:** Scheduling a CPT code not covered by the client's authorization
- **Scenario:** The authorization approves 97153 and 97155, but a scheduler creates a parent training session (97156) for the client. The CPT code is not on the authorization. The session is delivered but the claim is denied because the billed service doesn't match authorization terms.
- **Who is affected:** Scheduler, billing staff, BCBA
- **Frequency:** Per scheduling action
- **Impact if unhandled:** 100% denial for the mismatched service. Denial code CO-197. The service cannot be retroactively changed to a different CPT code since documentation must match actual service delivered.
- **Recommended handling:** Hard block. When scheduling a session, restrict CPT code options to codes that appear on the client's active authorization. If no authorization covers the selected code, show: "97156 is not authorized for this client. Active auth covers: 97153, 97155."
- **Source:** billing-failure-modes (FM 5), domain-research (7B)

---

#### EC-005: Session Outside Authorization Date Range

- **Category:** HARD BLOCK
- **Title:** Session falls before auth start date or after auth end date
- **Scenario:** A session is scheduled before the authorization start date or after its end date. This happens most often during auth transitions, or when a new client's authorization hasn't started yet but sessions are optimistically scheduled.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** During auth transitions (every 3-6 months per client)
- **Impact if unhandled:** 100% claim denial. Retroactive authorizations are rare and payer-dependent. At $30-60/unit, even a one-week gap for a 25hr/week client = $1,500-3,000 lost.
- **Recommended handling:** Hard block for sessions outside all active auth date ranges. Surface auth expiration prominently: 30/14/7-day countdown. Auto-flag recurring schedule instances that extend beyond auth end date. Show a "gap" visual on the calendar when no auth covers a future date range.
- **Source:** billing-failure-modes (FM 1), clinical-edge-cases (#17), domain-research (7B)

---

#### EC-006: Noncertified Provider Assigned as RBT Supervisor

- **Category:** HARD BLOCK
- **Title:** Non-BCBA/BCaBA assigned as RBT supervisor (effective January 2026)
- **Scenario:** A practice uses a licensed psychologist (non-BCBA) as an RBT supervisor. As of January 1, 2026, noncertified RBT supervisors are no longer permitted by BACB. Supervision by unqualified individuals does not count toward BACB requirements; RBTs supervised only by them will fall out of compliance.
- **Who is affected:** RBTs (certification at risk), BCBA (if role improperly assigned), practice owner
- **Frequency:** Per supervisor assignment
- **Impact if unhandled:** Supervision does not count. RBTs risk certification loss. Practice may believe compliance is met when it is not.
- **Recommended handling:** Hard block. Only allow providers with active BCBA, BCBA-D, or BCaBA credentials (plus verified 8-Hour Supervision Training) to be assigned as RBT supervisors.
- **Source:** clinical-edge-cases (#7), domain-research (2A)

---

#### EC-007: Provider Credential Expired -- Sessions Not Billable

- **Category:** HARD BLOCK
- **Title:** Provider with lapsed certification scheduled for billable sessions
- **Scenario:** An RBT's BACB certification expires (missed renewal deadline). After the 30-day grace period, the RBT must restart the entire certification process. During any lapse, the RBT cannot legally provide or bill for ABA services. All scheduled sessions are unbillable.
- **Who is affected:** The RBT (cannot work), all clients on their caseload, scheduler (emergency reassignment), billing staff
- **Frequency:** Quarterly across a practice (individual renewal dates scattered throughout year)
- **Impact if unhandled:** Services by a non-credentialed provider are non-billable. 2 weeks of undetected lapse = total denial of all sessions in that period. Payer may flag provider for future credentialing issues.
- **Recommended handling:** Hard block on creating new sessions for providers with lapsed credentials. Existing sessions after expiration flagged red: "Provider credential expired -- session will not be billable. Reassign to a credentialed provider." Proactive alerts at 90/60/30/14/7 days before expiration. Allow admin override with acknowledgment (provider may be in renewal process).
- **Source:** clinical-edge-cases (#25), operational-edge-cases (1.5), billing-failure-modes (FM 9)

---

#### EC-008: Same Provider Billing 97153 and 97155 Simultaneously

- **Category:** HARD BLOCK
- **Title:** Same provider billing both direct therapy and protocol modification for overlapping time
- **Scenario:** A single provider bills both 97153 (direct therapy) and 97155 (protocol modification) for overlapping time on the same client. One person cannot simultaneously deliver routine protocol-following AND direct the modification of that protocol -- these are distinct services requiring distinct providers.
- **Who is affected:** Provider, billing staff, practice owner (fraud risk)
- **Frequency:** Per scheduling action
- **Impact if unhandled:** Fraud indicator. Payer audit will flag and recoup. Repeated violations trigger investigation.
- **Recommended handling:** Hard block. Cannot schedule 97153 and 97155 for the same provider + same client at overlapping times. Different providers for overlapping codes is valid and expected (EC-034).
- **Source:** billing-failure-modes (FM 21), clinical-edge-cases (#4), domain-research (3D, 5A)

---

#### EC-009: Client in Individual and Group Session Simultaneously

- **Category:** HARD BLOCK
- **Title:** Client scheduled for both 97153 (individual) and 97154 (group) at the same time
- **Scenario:** A client is scheduled for a 1:1 direct therapy session (97153) and a group therapy session (97154) at the same time. A client cannot physically participate in both individual and group treatment simultaneously.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** Occasional scheduling error
- **Impact if unhandled:** Claim denial for one or both services. Audit flag for impossible service combination.
- **Recommended handling:** Hard block. Cannot schedule 97153 and 97154 for the same client at overlapping times.
- **Source:** billing-failure-modes (FM 21, FM 22)

---

#### EC-010: Exceeding Authorized Units (Over-Scheduling Past 100%)

- **Category:** HARD BLOCK
- **Title:** Scheduling sessions that would exceed total authorized units
- **Scenario:** Authorization approves 520 units over 6 months. Cumulative scheduled + rendered sessions exceed 520 units. The scheduler does not realize cumulative bookings have surpassed the cap. Claims for excess units are denied outright.
- **Who is affected:** Scheduler, billing staff, practice owner
- **Frequency:** Per authorization cycle
- **Impact if unhandled:** 100% denial for units beyond the cap. Denial code CO-197. Over-utilization also triggers payer audits, which can result in recoupment of previously paid claims.
- **Recommended handling:** Hard block at 100% of authorized units. Real-time "units remaining" counter visible on every scheduling action showing: approved, used (completed), scheduled (committed but not yet delivered), and net available. Warning at 80%, critical at 95%, block at 100%.
- **Source:** billing-failure-modes (FM 2), domain-research (7B)

---

### WARNINGS
Show at scheduling time. Let the user proceed but clearly flag the issue with required acknowledgment.

---

#### EC-011: Authorization Approaching Unit Limit (80-95%)

- **Category:** WARNING
- **Title:** Authorization utilization approaching exhaustion
- **Scenario:** A client's auth is at 82% utilized with 6 weeks remaining. If the current scheduling pace continues, the auth will exhaust 3 weeks before expiration, leaving the client without coverage.
- **Who is affected:** Scheduler, BCBA, billing staff
- **Frequency:** Weekly monitoring per client
- **Impact if unhandled:** Sessions scheduled after auth exhaustion are denied. Practice either over-delivers (unbillable) or must abruptly stop services.
- **Recommended handling:** Warning at 80% utilization, critical alert at 95%. Show projected exhaustion date: "At current pace, this auth exhausts on [date], 3 weeks before expiration." Allow scheduling with acknowledgment.
- **Source:** billing-failure-modes (FM 2), domain-research (2C, 6B)

---

#### EC-012: Daily MUE Limit Exceeded Across Split Sessions

- **Category:** WARNING
- **Title:** Combined daily units for a CPT code exceed MUE limit
- **Scenario:** A client has a morning 97153 session (24 units) and the scheduler books an afternoon 97153 session (12 units). Combined: 36 units, exceeding the MUE of 32 units/day. MUE Adjudication Indicator 3 means claims may be paid if properly justified, but in practice most are denied without compelling documentation.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** When split sessions are scheduled for the same client on the same day
- **Impact if unhandled:** Excess units denied. If 80% of a 10-hour assessment day is denied for MUE exceedance, that is significant revenue loss.
- **Recommended handling:** Warning with daily unit accumulator. Display running total of daily units per CPT per client. When a new session would cause daily total to exceed MUE, warn with specific numbers. Allow override with acknowledgment (MUE indicator 3 allows justified exceedance). Flag for manual review at claim generation.
- **Source:** clinical-edge-cases (#12, #15), billing-failure-modes (FM 23), domain-research (2D)

---

#### EC-013: Provider Not Credentialed with Client's Payer

- **Category:** WARNING
- **Title:** Scheduled provider not credentialed/paneled with the client's insurance
- **Scenario:** An RBT is scheduled for a client whose insurance requires a credentialed provider. The RBT isn't paneled with that specific payer. The session happens, the note is written, but the claim is denied weeks later. Some clinics rush therapists into service before obtaining credentials.
- **Who is affected:** Scheduler, billing staff, RBT
- **Frequency:** Per new client-therapist pairing; ongoing for credential changes
- **Impact if unhandled:** 100% claim denial. Denial code CO-185. If a substitute provider works for 2 weeks before mismatch is caught, all sessions denied. Wasted clinical effort.
- **Recommended handling:** Warning when assigning a provider who isn't credentialed with the client's payer. Maintain provider-payer credentialing matrix. Surface credential expiration dates proactively. Allow override (provider may be in credentialing process).
- **Source:** practitioner-pain-points (#5), billing-failure-modes (FM 9), user-complaints (7A)

---

#### EC-014: Provider Not Listed on Authorization

- **Category:** WARNING
- **Title:** Scheduled provider not named on the client's authorization
- **Scenario:** Some payers list specific rendering and supervising providers on the authorization. Substituting a different BCBA or RBT not named on the auth triggers a denial.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** Per provider substitution
- **Impact if unhandled:** Claim denial for sessions with unlisted provider.
- **Recommended handling:** Warning when scheduling a provider not on the authorization's provider list. Some payers don't list providers; this is payer-configurable. Allow override with documentation.
- **Source:** billing-failure-modes (FM 9)

---

#### EC-015: Session Location Doesn't Match Authorization

- **Category:** WARNING
- **Title:** Place of Service mismatch between scheduled session and authorization
- **Scenario:** Authorization specifies clinic-only services, but the session is scheduled in-home. Or auth covers home-based but session is at school. POS code on the claim doesn't match authorization terms.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** Per scheduling action for sessions at non-default locations
- **Impact if unhandled:** 100% denial. Requires re-authorization for correct location or appeal.
- **Recommended handling:** Warning if session location doesn't match an authorized location type. Auto-populate POS code from session location. For telehealth, prompt for client location to determine POS 02 vs POS 10.
- **Source:** billing-failure-modes (FM 10)

---

#### EC-016: Authorization Gap During Renewal

- **Category:** WARNING
- **Title:** Sessions scheduled in the gap between expired auth and pending re-auth
- **Scenario:** A client's auth expires March 31. Re-auth request submitted March 20. Payer takes 15 business days. New auth approved April 10. Sessions April 1-9 fall in a coverage gap and are typically non-reimbursable.
- **Who is affected:** Scheduler, BCBA, billing staff, client family
- **Frequency:** Per re-authorization cycle (every 3-6 months per client)
- **Impact if unhandled:** At $30-60/unit, a full-time client could generate thousands in unrecoverable revenue during a 10-day gap. Clinical disruption from pausing services harms progress.
- **Recommended handling:** Multi-stage warnings: 45 days (begin re-auth docs), 30 days (submit to payer), 14 days (escalate), 7 days (consider pausing schedule). During gap: allow scheduling with prominent "AUTHORIZATION GAP" indicator. Do NOT hard-block -- practice may choose to provide services at financial risk to maintain clinical continuity.
- **Source:** clinical-edge-cases (#17), billing-failure-modes (FM 4, FM 7), practitioner-pain-points (#4)

---

#### EC-017: Scheduling Under Pending (Not Yet Approved) Authorization

- **Category:** WARNING
- **Title:** Sessions scheduled under a pending authorization
- **Scenario:** A new client's auth is still pending payer approval, but the practice begins scheduling sessions optimistically. Most payers require approved auth before reimbursement. Sessions during pending period are held or denied.
- **Who is affected:** Scheduler, billing staff, practice owner
- **Frequency:** Per new client intake
- **Impact if unhandled:** Sessions delivered under pending auth = payer-dependent outcome (some allow retro-auth, most don't). Practice absorbs cost of unbillable services.
- **Recommended handling:** Warning. `pending` auth allows scheduling but marks sessions with visual "at-risk" indicator. Pending auth dashboard showing all clients awaiting decisions.
- **Source:** billing-failure-modes (FM 6)

---

#### EC-018: BCBA Billing 97153 (Technician Code)

- **Category:** WARNING
- **Title:** BCBA scheduled for technician-level code 97153
- **Scenario:** A BCBA is the sole provider for a 97153 session (treatment by protocol). While a BCBA is qualified to do what an RBT does, this is unusual and may raise payer questions about medical necessity for a higher-credentialed provider doing technician-level work.
- **Who is affected:** BCBA, billing staff
- **Frequency:** Occasional (typically only when covering for an absent RBT)
- **Impact if unhandled:** May trigger payer review or questioning. Not a denial per se, but draws audit attention.
- **Recommended handling:** Warning: "BCBAs typically bill 97155 for direct clinical work. Billing 97153 as a BCBA may trigger payer review. Continue?" Allow override.
- **Source:** clinical-edge-cases (#13)

---

#### EC-019: Group Session Below Minimum or Above Maximum Size

- **Category:** WARNING
- **Title:** Group therapy scheduled with fewer than 2 or more than 8 patients
- **Scenario:** A social skills group (97158) is scheduled with 4 clients. On session day, 3 cancel. A single client does not constitute a group. The session cannot be billed as 97154/97157/97158. Conversely, scheduling a 9th client exceeds the 8-patient max.
- **Who is affected:** BCBA, scheduler, billing staff
- **Frequency:** Per group session (daily at practices running groups)
- **Impact if unhandled:** Claim denial for group code with <2 clients. Potential denial for exceeding max participants.
- **Recommended handling:** At scheduling: enforce 2-8 client enrollment range. At session conversion: if attendance <2, prompt to convert to individual code or cancel. Track enrollment count prominently.
- **Source:** clinical-edge-cases (#8), billing-failure-modes (FM 22), domain-research (2E)

---

#### EC-020: Mutually Exclusive Code Combinations on Same Date

- **Category:** WARNING
- **Title:** Scheduling code combinations that cannot be billed together
- **Scenario:** Certain ABA code combinations cannot be billed on the same date or at the same time: 97151 + 97152 on the same date, 97154 + 97155 concurrently by the same provider. NCCI edits define bundling rules, but payers can be more restrictive.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** When scheduling multiple ABA services on the same day for the same client
- **Impact if unhandled:** Denied claims for the bundled code (usually the lower-paying one). Repeated violations trigger audit.
- **Recommended handling:** Warning with code conflict rules. Flag when scheduling mutually exclusive codes. Allow override with documented justification.
- **Source:** billing-failure-modes (FM 21)

---

#### EC-021: Split Session Same-Day Same-Code Missing Modifier

- **Category:** WARNING
- **Title:** Two sessions of same CPT code on same day for same client
- **Scenario:** A school-age client has morning 97153 (before school) and afternoon 97153 (after school). Many payers require modifier -59 or -XS for same-day, same-code services. Without the modifier, the second line may be denied as a duplicate.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** When scheduling split sessions
- **Impact if unhandled:** Duplicate claim denial on second session. Combined daily units may also exceed MUE.
- **Recommended handling:** Warning when scheduling second same-day, same-code session. Display combined daily total. Auto-add modifier -59/-XS at claim generation. Track cumulative daily units per CPT code.
- **Source:** clinical-edge-cases (#12), billing-failure-modes (FM 23)

---

#### EC-022: Payer-Specific Daily or Weekly Hour Caps

- **Category:** WARNING
- **Title:** Session would exceed payer-imposed daily/weekly caps
- **Scenario:** Indiana Medicaid caps ABA at 30 hours/week. Client is already at 28 hours for the week. A Friday 5-hour session would push to 33 hours. These caps vary by payer, plan, and state.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** Per scheduling action (for clients with payers that have caps)
- **Impact if unhandled:** Denial for hours exceeding the cap. Not caught until billing.
- **Recommended handling:** Warning (payer-configurable). Allow payer records to include optional weekly/daily caps. When scheduling, check and display: "This session would bring weekly total to 33 hours. Payer caps at 30 hours/week." Warning, not block -- payer may approve exceptions.
- **Source:** clinical-edge-cases (#14), domain-research (5B)

---

#### EC-023: TRICARE Mandatory Parent Training Timing

- **Category:** WARNING
- **Title:** TRICARE client missing required parent training within 30 days
- **Scenario:** TRICARE requires at least 1 session of 97156/97157 within 30 days of authorization start, and 6 sessions per 6-month auth period. Missing the 30-day deadline can flag the entire auth for non-compliance, affecting re-authorization.
- **Who is affected:** BCBA, scheduler
- **Frequency:** Per TRICARE client at auth start and ongoing
- **Impact if unhandled:** Authorization flagged for non-compliance. Potential impact on re-authorization.
- **Recommended handling:** Proactive payer-specific warning. Day 1: "TRICARE requires parent training within 30 days. Schedule now?" Day 15: alert if none scheduled. Day 25: critical alert. Track 97156 frequency against 6-session minimum on auth dashboard.
- **Source:** clinical-edge-cases (#10, #16), domain-research (5C)

---

#### EC-024: Caregiver Not Available During Scheduled Home Session

- **Category:** WARNING
- **Title:** In-home session scheduled when no caregiver is present
- **Scenario:** For home-based ABA, a caregiver must be present (required by most payers and clinical protocol). The caregiver works 9am-2pm. Session scheduled at 10am. The RBT arrives to a locked house, or an unauthorized person is home.
- **Who is affected:** RBT, family, scheduler
- **Frequency:** Per scheduling action for home-based sessions
- **Impact if unhandled:** Cancelled session (lost revenue). Potential compliance violation if session occurs without caregiver. At minimum, wasted drive time.
- **Recommended handling:** Warning when scheduling in-home session outside defined caregiver availability. Also warn when authorized hours exceed available caregiver windows.
- **Source:** clinical-edge-cases (#24), operational-edge-cases (4.2)

---

#### EC-025: Back-to-Back Sessions at Different Locations Without Travel Buffer

- **Category:** WARNING
- **Title:** Insufficient travel time between consecutive sessions at different locations
- **Scenario:** Scheduler books RBT for 12pm-3pm at Client A's home and 3pm-5pm at Client B's home, 40 minutes away. Zero buffer. The RBT will either leave early or arrive late. "5 miles can take 45 minutes" in metro areas.
- **Who is affected:** RBT (stressed, late), both client families, scheduler
- **Frequency:** Daily without travel-time safeguards
- **Impact if unhandled:** Late arrivals, shortened sessions, cascading disruptions. If logged times don't match actual times, potential audit issue. Leading indicator for RBT turnover.
- **Recommended handling:** Warning when scheduling back-to-back sessions at different locations without adequate buffer. Auto-calculate required buffer based on distance. Visual "travel block" on calendar between sessions. Show provider's "day route" view.
- **Source:** practitioner-pain-points (#3), operational-edge-cases (3.1, 3.5), user-complaints (7D), domain-research (4A)

---

#### EC-026: RBT Transition / Overlap Session Billing

- **Category:** WARNING
- **Title:** Two RBTs assigned to same client session during provider transition
- **Scenario:** An RBT is leaving. The practice schedules 2-3 overlap sessions where both old and new RBT are present. Only one RBT can bill 97153. If both bill, it's a duplicate claim. The session also consumes authorization units for transition rather than treatment.
- **Who is affected:** Scheduler, billing staff, both RBTs, client family
- **Frequency:** Per RBT transition (monthly at high-turnover practices)
- **Impact if unhandled:** Duplicate billing = claim denial or fraud flag. Authorization units consumed for non-treatment overlap.
- **Recommended handling:** Warning when scheduling two RBTs for same client. Prompt: "Is this a transition/overlap session? Only one RBT can bill." Require designation of primary (billing) vs. observing RBT. Track transition sessions as distinct category.
- **Source:** clinical-edge-cases (#22), operational-edge-cases (1.2)

---

#### EC-027: Scheduling Under Auth Expiring Within 7 Days (No Renewal in Progress)

- **Category:** WARNING
- **Title:** Scheduling sessions under an authorization about to expire with no re-auth submitted
- **Scenario:** Auth expires in 5 days. No re-authorization has been submitted. Sessions scheduled for next week will likely fall into an auth gap.
- **Who is affected:** Scheduler, BCBA, billing staff
- **Frequency:** Per auth expiration cycle
- **Impact if unhandled:** Auth gap creates unbillable sessions.
- **Recommended handling:** Warning: "Auth expires in 5 days. No re-authorization submitted. Sessions after expiration may not be reimbursable." Escalating alerts starting at 45 days.
- **Source:** billing-failure-modes (FM 4, FM 7), clinical-edge-cases (#17)

---

#### EC-028: Same-Day Multi-Code Billing Payer Restrictions

- **Category:** WARNING
- **Title:** Multiple ABA codes for same client on same day may violate payer rules
- **Scenario:** A BCBA provides 97155 (10-11am) and 97156 (11am-12pm) for the same client same day. Most payers allow this when services are separate and distinct, but some (e.g., UHC) require prior auth for concurrent billing. Anthem has specific policies.
- **Who is affected:** BCBA, billing staff
- **Frequency:** When scheduling multiple BCBA services on the same day
- **Impact if unhandled:** Inconsistent denials discovered weeks later. Payer-by-payer variation makes this unpredictable.
- **Recommended handling:** Warning (payer-configurable). For MVP, display generic: "Multiple ABA codes for same client on same day. Verify payer allows same-day billing." Phase 2+: payer-specific override rules.
- **Source:** clinical-edge-cases (#18), domain-research (5A)

---

#### EC-029: Medicaid Quarterly Re-Authorization Scheduling Uncertainty

- **Category:** WARNING
- **Title:** Recurring template extends beyond Medicaid 90-day auth cycle
- **Scenario:** Medicaid client's auth is in 90-day cycles. Recurring template extends past current 90 days. Sessions beyond the current auth are scheduled against an authorization that doesn't yet exist. If re-auth is denied or modified, all pre-scheduled sessions are invalid.
- **Who is affected:** Scheduler, BCBA, billing staff
- **Frequency:** Every 90 days per Medicaid client
- **Impact if unhandled:** Invalid sessions requiring mass rescheduling. Revenue uncertainty.
- **Recommended handling:** Warning at template creation: "This client's auth expires [date]. Sessions beyond are pending re-auth." Visually differentiate sessions within active auth (solid) vs. beyond (dashed/faded). 30-day alerts for progress report deadline.
- **Source:** clinical-edge-cases (#19)

---

#### EC-030: BACB 5% Monthly Supervision Pacing Behind

- **Category:** WARNING
- **Title:** RBT supervision hours falling below 5% monthly requirement
- **Scenario:** RBT delivers 120 hours of 97153 in a month. BACB requires 5% = 6 hours minimum supervision. BCBA has scheduled only 4 hours with 5 days left.
- **Who is affected:** BCBA, RBT (certification risk), practice owner
- **Frequency:** Monthly per RBT
- **Impact if unhandled:** RBT certification at risk. BACB can revoke credential. Unlike billing issues (which lose money), this is a certification compliance failure that removes a provider from the workforce. If an RBT goes 60 consecutive days without supervision, BACB may suspend certification.
- **Recommended handling:** Warning on supervision dashboard. Real-time pacing tracker. Informational at week 2, warning at week 3, critical in final week.
- **Source:** clinical-edge-cases (#1), practitioner-pain-points (#7), domain-research (2A)

---

#### EC-031: Minimum 2 Face-to-Face Supervision Contacts Not Met

- **Category:** WARNING
- **Title:** RBT has fewer than 2 face-to-face supervision contacts this month
- **Scenario:** BCBA meets supervision hours through phone/email but only had 1 in-person or live-video contact. BACB requires at least 2 face-to-face contacts regardless of total hours. Phone and email don't count.
- **Who is affected:** BCBA, RBT
- **Frequency:** Monthly per RBT-BCBA pair
- **Impact if unhandled:** Non-compliance with BACB despite meeting 5% hour total. RBT certification risk.
- **Recommended handling:** Warning on supervision dashboard. Track supervision contacts by type (in-person, live video, phone/other). Alert when month is >50% elapsed with <2 face-to-face contacts scheduled.
- **Source:** clinical-edge-cases (#2), domain-research (2A)

---

#### EC-032: 50% Individual Supervision Rule Violated

- **Category:** WARNING
- **Title:** More than 50% of RBT supervision hours are group supervision
- **Scenario:** BCBA provides all supervision via weekly group meetings. BACB requires at least 50% of supervision hours be individual (one-on-one). An RBT with 4 hours group / 0 hours individual is non-compliant.
- **Who is affected:** BCBA, RBT
- **Frequency:** Monthly per RBT
- **Impact if unhandled:** BACB non-compliance. RBT certification risk.
- **Recommended handling:** Warning when scheduling group supervision. Calculate running individual-vs-group ratio. Alert when ratio exceeds 50% group.
- **Source:** clinical-edge-cases (#3), domain-research (2A)

---

#### EC-033: Telehealth Supervision Payer Won't Reimburse

- **Category:** WARNING
- **Title:** Payer requires physical co-location for 97155 supervision billing
- **Scenario:** BCBA observes RBT session via live video. BACB allows this (telehealth counts as face-to-face). But the payer (e.g., UHC/Optum) requires the supervisor to be physically present for 97155 billing. The session satisfies BACB but the claim is denied.
- **Who is affected:** BCBA, billing staff
- **Frequency:** Per telehealth supervision session for affected payers
- **Impact if unhandled:** Claim denial for 97155. Practice loses revenue and discovers weeks later.
- **Recommended handling:** Warning (payer-specific). When scheduling telehealth supervision, check client's payer for co-location requirements. Warn: "This payer may require BCBA physical presence for 97155." Allow the session (it satisfies BACB even if not billable). Track as "BACB-compliant but potentially non-billable."
- **Source:** clinical-edge-cases (#6), domain-research (5E)

---

#### EC-034: Concurrent BCBA-RBT Session Display

- **Category:** WARNING (display as informational, but block if same provider)
- **Title:** BCBA overlapping with RBT session -- valid concurrent billing
- **Scenario:** BCBA joins an ongoing RBT session (97153) and bills 97155 for protocol modification. Two different providers, two different codes, same client, overlapping time. This is correct and expected. Software must not flag this as a conflict -- but must block if the SAME provider tries to bill both.
- **Who is affected:** BCBA, RBT, scheduler
- **Frequency:** Multiple times per week per BCBA (core supervision pattern)
- **Impact if unhandled:** Blocking valid concurrent billing disrupts the primary supervision workflow. Allowing same-provider overlap is fraud.
- **Recommended handling:** Informational display when different-provider overlap. Show: "This session overlaps with [RBT]'s 97153 session. Concurrent billing will apply." Hard block if same provider for both codes. Link supervision session to RBT session for BACB tracking.
- **Source:** clinical-edge-cases (#4, #11), billing-failure-modes (FM 20), domain-research (3D)

---

#### EC-035: BCaBA Supervision Chain Tracking

- **Category:** WARNING
- **Title:** BCaBA needs supervision from BCBA while supervising RBTs
- **Scenario:** A BCaBA supervises 3 RBTs and is herself supervised by a BCBA. Two-tier chain: BCBA supervises BCaBA, BCaBA supervises RBTs. If BCBA availability is constrained, the entire chain can fail. BCaBA must also have completed 8-Hour Supervision Training.
- **Who is affected:** BCaBA, BCBA, RBTs supervised by BCaBA
- **Frequency:** Monthly supervision planning
- **Impact if unhandled:** Entire supervision chain fails if any link is broken. BCaBA and/or RBTs fall out of compliance.
- **Recommended handling:** Warning on supervision dashboard. Model supervision as chain: BCBA -> BCaBA -> RBTs. Track each level's requirements separately. Alert when any level falls behind.
- **Source:** clinical-edge-cases (#5), domain-research (2A)

---

#### EC-036: Documentation-Schedule Time Mismatch

- **Category:** WARNING
- **Title:** Session note documents different times/duration than scheduled
- **Scenario:** Session scheduled 9am-12pm (12 units). Actual session: 9:15am-11:45am (10 units). If claim is submitted based on scheduled time rather than actual time, it's overbilling. The OIG found over $200M in overpayments from improper time-unit billing.
- **Who is affected:** RBT, billing staff, practice owner (recoupment risk)
- **Frequency:** Daily. 20-30% of sessions have >15-minute variance between scheduled and actual times.
- **Impact if unhandled:** Audit recoupment (worse than denial -- must return already-paid money). Retroactive to all similarly billed sessions.
- **Recommended handling:** Warning when documented time differs from scheduled by >15 minutes. Auto-calculate billable units from actual time, never scheduled time. Require actual start/end on every note. Pre-fill from schedule but require confirmation.
- **Source:** billing-failure-modes (FM 12, FM 25), operational-edge-cases (5.2)

---

#### EC-037: CMS vs. AMA Unit Calculation Method Mismatch

- **Category:** WARNING
- **Title:** Wrong unit calculation method applied for payer type
- **Scenario:** CMS method (aggregate across all codes, used for Medicare/Medicaid) vs. AMA method (per-code, used for most commercial payers). Using CMS method for a commercial payer or vice versa leads to incorrect unit counts. Billing 16 minutes across two codes as 2 units when CMS rules only allow 1 unit.
- **Who is affected:** Billing staff, practice owner
- **Frequency:** Per claim generation
- **Impact if unhandled:** Systematic over-counting even by 1 unit/session across 100 sessions/week = significant recoupment risk.
- **Recommended handling:** Warning. Support both calculation methods, configurable per payer. Default AMA. Show calculation transparently. Alert when calculated units differ from scheduled units.
- **Source:** billing-failure-modes (FM 24), domain-research (2D)

---

### MONITORING
Show on dashboard/reports. Not at individual scheduling time -- these are aggregate patterns to track.

---

#### EC-038: Authorization Under-Utilization Pacing

- **Category:** MONITORING
- **Title:** Client consistently receiving fewer hours than authorized
- **Scenario:** Client authorized for 25 hours/week but consistently receives 15-18 hours due to cancellations, staffing shortages, or gaps. Payers monitor utilization and reduce future authorizations.
- **Who is affected:** Practice owner, BCBA, billing staff
- **Frequency:** Weekly tracking per client
- **Impact if unhandled:** Double loss -- immediate revenue left on table PLUS reduced future authorizations. A client dropping from 25 to 18 approved hours = ~$16,800 annualized revenue loss at $40/unit. Clinically, delays treatment progress.
- **Recommended handling:** Dashboard metric. Weekly utilization tracking: actual vs. authorized as percentage. Alert when <80% of authorized pace for 2+ weeks. Flag clients where <50% used with >50% of auth period elapsed. Suggest scheduling actions.
- **Source:** billing-failure-modes (FM 3), practitioner-pain-points (#4), domain-research (2C, 6B)

---

#### EC-039: Authorization Pacing Off-Track (Front-Loading or Back-Loading)

- **Category:** MONITORING
- **Title:** Uneven distribution of authorized units across auth period
- **Scenario:** Auth approves 520 units over 26 weeks. Practice schedules 25 units/week initially, runs out with 6 weeks remaining. Or under-schedules early, then tries to cram at the end. Both patterns cause problems.
- **Who is affected:** Practice owner, scheduler, BCBA
- **Frequency:** Weekly monitoring per client
- **Impact if unhandled:** Front-loading = uncovered sessions at end. Back-loading = wasted units + MUE denials. No tracking = surprise over/under utilization. Reduces effective revenue capture by 10-30%.
- **Recommended handling:** Dashboard. Weekly pacing indicator: target pace vs. actual. Burn-down chart. Alert when pace deviates >15% for 2+ weeks. "What-if" tool for schedule adjustments.
- **Source:** billing-failure-modes (FM 8), domain-research (2C)

---

#### EC-040: Client Cancellation Rate Exceeding Threshold

- **Category:** MONITORING
- **Title:** Client cancellation rate exceeds 30% over rolling 4-week window
- **Scenario:** A specific client cancels 40% of sessions over the past month. Pattern erodes auth utilization and may indicate disengagement. Insurance companies may question continued medical necessity if attendance is consistently low.
- **Who is affected:** BCBA, practice owner, billing staff
- **Frequency:** Continuous monitoring
- **Impact if unhandled:** Lost revenue, reduced future authorizations, potential discharge discussions needed. Most practices require 80% minimum attendance.
- **Recommended handling:** Dashboard alert. Track cancellation rate per client, per provider, practice-wide. Categorize by reason. Alert when client exceeds 30% for 4+ weeks. Show cancellation patterns (day-of-week, season, reason).
- **Source:** billing-failure-modes (FM 15), practitioner-pain-points (#1), domain-research (2F, 6A)

---

#### EC-041: Timely Filing Deadline Approaching

- **Category:** MONITORING
- **Title:** Sessions approaching payer filing deadline without claim submission
- **Scenario:** Payer has 90-day filing deadline. Session from 75 days ago hasn't progressed to claim submission because the note was never completed. Once deadline passes, revenue is permanently lost -- no appeal.
- **Who is affected:** Billing staff, practice owner
- **Frequency:** Continuous monitoring
- **Impact if unhandled:** 100% permanent revenue loss. Cannot be appealed. A practice that falls behind on documentation for 3 months risks losing an entire quarter of revenue.
- **Recommended handling:** Dashboard. Track every session through: completed -> note_written -> note_signed -> claim_generated -> claim_submitted. Per-payer filing deadline config. Aging report sorted by urgency. Critical alert at 14 days before deadline.
- **Source:** billing-failure-modes (FM 11)

---

#### EC-042: Sessions Completed Without Notes (Aging >48 Hours)

- **Category:** MONITORING
- **Title:** Completed sessions missing documentation past deadline
- **Scenario:** RBTs fall behind on notes. Notes are due within 24 hours but some languish for days. Late notes delay billing. Mismatched notes cause denials. "When staff don't submit documentation, delays cascade through claims and payroll."
- **Who is affected:** RBT, billing staff, practice owner
- **Frequency:** Daily
- **Impact if unhandled:** Billing delays cascade. If notes are never completed, sessions become unbillable. Approaches timely filing risk.
- **Recommended handling:** Dashboard. Show sessions lacking completed notes aged by hours since session. Alert RBTs and supervisors. Track documentation completion rate as KPI.
- **Source:** billing-failure-modes (FM 11, FM 12), practitioner-pain-points (#17), operational-edge-cases (5.2)

---

#### EC-043: 97155:97153 Ratio Outlier Per BCBA

- **Category:** MONITORING
- **Title:** BCBA's supervision billing ratio triggers audit risk
- **Scenario:** A BCBA bills 97155 for every minute of RBT observation. Payers look at the ratio of 97155-to-97153 hours. Disproportionate 97155 billing is one of the most audited patterns in ABA.
- **Who is affected:** BCBA, practice owner
- **Frequency:** Monthly review
- **Impact if unhandled:** Audit triggers recoupment of all improperly billed 97155 sessions.
- **Recommended handling:** Dashboard metric. Track 97155:97153 ratio per BCBA. Flag outliers against practice average and industry norms. Alert for clinical review.
- **Source:** billing-failure-modes (FM 20)

---

#### EC-044: Staff Utilization Rate Outside Target Range

- **Category:** MONITORING
- **Title:** Provider billable utilization below 65% or above 90%
- **Scenario:** RBT utilization at 55% indicates scheduling gaps or excessive cancellations. RBT utilization at 95% indicates burnout risk. Target: 75-85% for RBTs, 65-75% for BCBAs.
- **Who is affected:** Practice owner, scheduler
- **Frequency:** Weekly monitoring
- **Impact if unhandled:** Low utilization = lost revenue. High utilization = burnout and turnover (which costs $15K-$25K per departure).
- **Recommended handling:** Dashboard. Show utilization per provider. Adjusted metric that accounts for travel time (billable / (total - travel)). Alert when outside target range.
- **Source:** practitioner-pain-points (#2, #20), operational-edge-cases (3.2), domain-research (6A)

---

#### EC-045: RBT Hours Guarantee vs. Actual Hours

- **Category:** MONITORING
- **Title:** RBT scheduled hours falling below promised/guaranteed minimum
- **Scenario:** RBTs are hired with a promised hour range. When clients cancel, actual hours fall short. This creates income instability. "Staff are promised certain hours upon hire but report that the company only has fewer hours to give them."
- **Who is affected:** RBT, practice owner (retention risk)
- **Frequency:** Weekly
- **Impact if unhandled:** RBT turnover (40% within 2 years). "Many clinics lose capacity not because of lack of clients, but because of burnout and unpredictable schedules."
- **Recommended handling:** Dashboard. Track projected vs. actual hours per RBT per week. Alert when an RBT is trending below guaranteed minimum. Support fair distribution visibility.
- **Source:** practitioner-pain-points (#2), operational-edge-cases (3.2)

---

#### EC-046: Workload Inequity Across Staff

- **Category:** MONITORING
- **Title:** Uneven distribution of caseload difficulty, drive time, and cancellation burden
- **Scenario:** "The same staff members repeatedly flex to cover gaps." Some RBTs get consistently harder caseloads, longer drives, or more cancellation-prone clients. Individually reasonable decisions compound into systemic unfairness.
- **Who is affected:** RBTs, practice owner
- **Frequency:** Cumulative, visible over weeks/months
- **Impact if unhandled:** Star performers burn out and leave. Team morale suffers. "High drive times are a leading indicator for staff turnover."
- **Recommended handling:** Dashboard. Compare per-RBT: billable hours, drive time, cancellation rate, caseload complexity. Equity alerts when one provider's load is significantly higher.
- **Source:** practitioner-pain-points (#20)

---

#### EC-047: Recurring Template Extends Beyond Current Auth End Date

- **Category:** MONITORING
- **Title:** Recurring schedule generates sessions past authorization expiration
- **Scenario:** A recurring template was created during an active auth. The auth expires but the template keeps generating sessions. These future sessions have no authorization backing.
- **Who is affected:** Scheduler, billing staff
- **Frequency:** Per auth cycle
- **Impact if unhandled:** Unbillable sessions accumulate silently until billing discovers the gap.
- **Recommended handling:** Dashboard alert. Scan recurring templates weekly. Flag any that generate sessions beyond current auth end date. Show gap visual on calendar timeline.
- **Source:** billing-failure-modes (FM 1), domain-research (7B)

---

#### EC-048: Credential Expiration Approaching

- **Category:** MONITORING
- **Title:** Provider credentials approaching expiration (RBT cert, BCBA license, CPR, background check)
- **Scenario:** An RBT's certification renewal is in 30 days. If missed, they cannot provide services. The 30-day BACB grace period exists but the 45-day competency assessment window is commonly missed.
- **Who is affected:** Provider, practice admin, scheduler
- **Frequency:** Ongoing (individual dates scattered throughout year)
- **Impact if unhandled:** Credential lapse = unbillable sessions, emergency reassignment, potential loss of provider permanently.
- **Recommended handling:** Dashboard. Store all credential expiration dates. Automated alerts at 90/60/30/14/7 days. Credential dashboard sorted by nearest expiration.
- **Source:** operational-edge-cases (1.5), clinical-edge-cases (#25)

---

#### EC-049: Cancellation Pattern Detection

- **Category:** MONITORING
- **Title:** Systemic cancellation patterns by day, client, season, or provider
- **Scenario:** Mondays and Fridays have 2x the cancellation rate. One specific client cancels every other week. Summer months show 30% higher cancellations. These patterns are invisible without analytics.
- **Who is affected:** Practice owner, scheduler
- **Frequency:** Monthly analysis
- **Impact if unhandled:** Missed opportunities to proactively address scheduling fragility. Cannot optimize staffing or client engagement.
- **Recommended handling:** Dashboard. Cancellation heat maps by day-of-week, client, provider, season, reason. Trend analysis over time.
- **Source:** practitioner-pain-points (#1, #14), billing-failure-modes (FM 15)

---

#### EC-050: Coordination of Benefits Errors

- **Category:** MONITORING
- **Title:** Client with dual insurance -- claims submitted in wrong order
- **Scenario:** Client has two insurance plans. Claims must go to primary first, then secondary after receiving EOB. ABA's high session volume means a COB error affects dozens of claims per month per client.
- **Who is affected:** Billing staff, practice owner
- **Frequency:** Per dual-coverage client
- **Impact if unhandled:** CO-22 denials. Clawback risk when both payers pay. 4-20 denied claims per month per affected client.
- **Recommended handling:** Dashboard. Client insurance profile with explicit primary/secondary. Birthday rule logic. Track EOB receipt before enabling secondary claim.
- **Source:** billing-failure-modes (FM 13)

---

#### EC-051: Duplicate Claim Submission Risk

- **Category:** MONITORING
- **Title:** Same session at risk of being billed twice
- **Scenario:** Claim submitted individually, then re-included in a batch. Or scheduling change creates two records for same session. If both paid, payer demands clawback + potential fraud investigation.
- **Who is affected:** Billing staff, practice owner
- **Frequency:** Per claim batch
- **Impact if unhandled:** CO-18 denial. If both paid, audit + clawback + fraud flag.
- **Recommended handling:** Dashboard. Unique session ID through entire pipeline. Prevent generating claim for session that already has one. Duplicate detection at claim generation.
- **Source:** billing-failure-modes (FM 14)

---

#### EC-052: Makeup Session Success Rate

- **Category:** MONITORING
- **Title:** Track what percentage of cancelled sessions result in makeup sessions
- **Scenario:** With 38% cancellation rate and ~40-50% makeup success rate, practices permanently lose 19-23% of authorized hours. No visibility into this metric means no ability to improve it.
- **Who is affected:** Practice owner, scheduler
- **Frequency:** Monthly
- **Impact if unhandled:** Every unrecovered session is permanent revenue loss.
- **Recommended handling:** Dashboard. Track makeup rate as KPI alongside cancellation rate. When session cancels, prompt to schedule makeup with pre-checked auth availability.
- **Source:** billing-failure-modes (FM 18)

---

#### EC-053: Session-to-Claim Conversion Lag

- **Category:** MONITORING
- **Title:** Time between session delivery and claim submission exceeds target
- **Scenario:** Target: <48 hours session-to-claim. If lag extends to weeks, approaches timely filing risk. Batch processing makes this worse.
- **Who is affected:** Billing staff, practice owner
- **Frequency:** Continuous
- **Impact if unhandled:** Approaches timely filing deadline risk. Cash flow delays.
- **Recommended handling:** Dashboard. Track pipeline: session -> note -> signed -> claim -> submitted -> adjudicated. Alert on sessions not progressing within expected timeframes.
- **Source:** billing-failure-modes (FM 11)

---

### INFORMATIONAL
Display context to help scheduling decisions. No warning dialog -- just visible information during the scheduling workflow.

---

#### EC-054: Concurrent BCBA-RBT Session Overlay Display

- **Category:** INFORMATIONAL
- **Title:** Show multi-provider concurrent sessions for same client in layered calendar view
- **Scenario:** A common day: RBT bills 97153 (9am-12pm), BCBA overlaps with 97155 (10-11am), then BCBA does 97156 parent training (11-11:30am). The calendar must show all three in a stacked/layered view without treating them as conflicts.
- **Who is affected:** Scheduler, BCBA, RBT
- **Frequency:** Multiple times per week
- **Impact if unhandled:** If software treats this as a conflict, it blocks the primary supervision workflow. If it doesn't display them, the scheduler can't see the full picture.
- **Recommended handling:** Informational display. Multi-layer calendar view showing overlapping sessions for same client with different providers. Clear visual distinction.
- **Source:** clinical-edge-cases (#4, #11), domain-research (3D)

---

#### EC-055: Assessment Sessions (97151) -- Non-Recurring Pattern

- **Category:** INFORMATIONAL
- **Title:** Assessment sessions should default to single/multi-day, not recurring
- **Scenario:** Assessment authorized for 32 units to complete within 14 days. Scheduler creates recurring weekly template for 97151 -- scheduling assessments into perpetuity. Assessments are one-time events (initial + periodic reassessments).
- **Who is affected:** Scheduler
- **Frequency:** Per assessment scheduling
- **Impact if unhandled:** Recurring assessment sessions beyond authorization scope. Over-scheduling.
- **Recommended handling:** Informational guard. When scheduling 97151, default to single/multi-day. If user tries recurring, note: "Assessment codes are typically one-time. Create as individual appointments instead?" Show remaining assessment units and completion deadline.
- **Source:** clinical-edge-cases (#9), domain-research (3C)

---

#### EC-056: Client Scheduling Notes / Preferred Session Times

- **Category:** INFORMATIONAL
- **Title:** Clinical notes about optimal session timing for client
- **Scenario:** A client with severe behavioral challenges has more productive morning sessions (40% fewer incidents before 12pm per behavioral data). BCBA documents this. Scheduler assigns 4pm slot because it's the only RBT opening.
- **Who is affected:** Scheduler, BCBA, RBT
- **Frequency:** Per scheduling action for clients with notes
- **Impact if unhandled:** Reduced clinical outcomes. Payer may question treatment effectiveness at re-authorization if outcomes are poor.
- **Recommended handling:** Informational. "Scheduling Notes" field on client profile. Display during scheduling: "Clinical note: Morning sessions recommended per treatment plan." Advisory only -- no block, no warning dialog.
- **Source:** clinical-edge-cases (#23)

---

#### EC-057: Sibling Scheduling at Same Address

- **Category:** INFORMATIONAL
- **Title:** Siblings at same household -- linked scheduling context
- **Scenario:** Family has two children receiving ABA. Each has own auth, treatment plan, goals. Options: same RBT back-to-back (preferred by families), different RBTs simultaneously, or overlapping. System should not flag same-address sessions as travel conflict or insert travel buffer.
- **Who is affected:** Scheduler, family, RBTs
- **Frequency:** 5-10% of clients are siblings
- **Impact if unhandled:** Unnecessary travel buffer warnings. Missed opportunity for back-to-back efficiency. If one sibling cancels, no prompt to consider cancelling the other.
- **Recommended handling:** Informational. Link sibling records (household grouping). Suppress travel warnings for same address. Show sibling schedule when scheduling either child. When one cancels, prompt about the other.
- **Source:** clinical-edge-cases (#21), operational-edge-cases (4.1)

---

#### EC-058: School-Age Child Seasonal Availability

- **Category:** INFORMATIONAL
- **Title:** School-age clients have bifurcated seasonal availability
- **Scenario:** School year: available 3pm-7pm only. Summer: available full day. Transitions happen May/June and Aug/Sept. The 3pm-7pm window is the most competitive in ABA -- every school-age client needs it. Effective capacity in after-school hours (accounting for travel/breaks) is 12-15 hours vs. 20+ authorized.
- **Who is affected:** Scheduler, family, all providers
- **Frequency:** Twice per year (major transitions), with minor adjustments for breaks
- **Impact if unhandled:** Scheduler manually rebuilds templates for every school-age client twice per year. May schedule sessions during school hours unknowingly.
- **Recommended handling:** Informational. Support "School Year" and "Summer" template sets per client. When authorized hours exceed available windows: "20 hours/week may not fit in after-school availability (17.5 hours/week max)."
- **Source:** clinical-edge-cases (#20), operational-edge-cases (2.4), practitioner-pain-points (#6, #14)

---

#### EC-059: Session Modality (Telehealth vs. In-Person) Display

- **Category:** INFORMATIONAL
- **Title:** Clear visual distinction of session delivery modality on calendar
- **Scenario:** BCBA has morning clinic sessions, 1pm telehealth parent training, 3pm in-home observation. Must know when to be where. Families need to know if session is in-person or virtual. Telehealth from clinic vs. from home affects availability for subsequent in-person sessions.
- **Who is affected:** BCBA, scheduler, family
- **Frequency:** Daily (BCBAs typically have 1-3 telehealth sessions mixed in)
- **Impact if unhandled:** Providers show up at wrong location. Families unprepared for modality. Drive time miscalculated.
- **Recommended handling:** Informational. Session modality field with visual distinction on calendar (color/icon for telehealth). Location-aware scheduling respects modality transitions.
- **Source:** operational-edge-cases (3.4)

---

#### EC-060: Parent Training (97156) as Distinct Scheduling Category

- **Category:** INFORMATIONAL
- **Title:** Parent training has different scheduling patterns than direct therapy
- **Scenario:** 97156 is less frequent (1-2x/month vs. 3-5x/week for 97153), requires caregiver availability (not just child), and is often scheduled adjacent to existing therapy sessions. Some payers mandate minimum frequency.
- **Who is affected:** BCBA, scheduler
- **Frequency:** Per 97156 scheduling
- **Impact if unhandled:** Parent training gets deprioritized and falls off schedule, leading to payer non-compliance (especially TRICARE).
- **Recommended handling:** Informational. When scheduling 97156, prompt for caregiver availability. Suggest time slots adjacent to existing 97153 sessions. Show payer-specific frequency requirements.
- **Source:** clinical-edge-cases (#10), domain-research (2B)

---

#### EC-061: Drive Time as Non-Billable Schedule Block

- **Category:** INFORMATIONAL
- **Title:** Travel time occupies schedule but isn't visible in availability
- **Scenario:** RBT has 6 billable hours + 90 minutes drive time = 7.5 hour day. Utilization shows 80% but effective utilization is much higher. The RBT feels overworked despite "only" 30 billable hours because 7-8 hours of weekly driving isn't counted.
- **Who is affected:** RBT, scheduler, practice owner
- **Frequency:** Daily for home-based providers
- **Impact if unhandled:** Misleading utilization metrics. Burnout from uncounted work. Availability miscalculated (provider shows "free" during drive time).
- **Recommended handling:** Informational. First-class "travel block" on calendar. Adjusted utilization metric: billable / (total - travel). Travel factored into availability calculations. Weekly summary: billable + travel + admin hours per RBT.
- **Source:** practitioner-pain-points (#3), operational-edge-cases (3.1, 3.2)

---

#### EC-062: Non-Billable Time Blocks (Notes, Admin, Supervision Prep)

- **Category:** INFORMATIONAL
- **Title:** BCBAs and RBTs need non-billable time visible on schedule
- **Scenario:** "If you only schedule billable sessions, you steal time from notes, travel, and supervision. That is how burnout starts." BCBAs spend ~37% of time on non-billable admin. Only 25% goes to direct therapy. When non-billable time is invisible, it gets squeezed out.
- **Who is affected:** BCBA, RBT, scheduler, practice owner
- **Frequency:** Daily
- **Impact if unhandled:** 89% of BCBAs experience work-related stress. 58% considering leaving. Notes completed late (billing delays). Burnout-driven turnover.
- **Recommended handling:** Informational. Allow scheduling non-billable blocks (notes, travel, supervision prep, admin) alongside billable sessions. Show full workload including non-billable time.
- **Source:** practitioner-pain-points (#8, #17)

---

#### EC-063: Coverage Board for Provider Absence

- **Category:** INFORMATIONAL
- **Title:** When provider is absent, display coverage needs vs. available substitutes
- **Scenario:** RBT calls in sick at 7:15am. Has 3 clients today at different locations. Scheduler has 45 minutes to find coverage. Needs to see: unassigned sessions on one side, available RBTs (with matching free time, proximity, familiarity with client) on the other.
- **Who is affected:** Scheduler, families, fill-in RBTs, BCBA
- **Frequency:** Weekly (2-4 callouts per week at a 15-RBT practice)
- **Impact if unhandled:** All sessions cancel (lost revenue). Families disrupted. RBT income lost.
- **Recommended handling:** Informational. "Mark unavailable" action shows all affected sessions. Coverage board displays unassigned sessions vs. available providers filtered by proximity, familiarity, schedule gaps. One-click reassign for single day without affecting recurring template.
- **Source:** operational-edge-cases (1.4, 2.1), practitioner-pain-points (#1, #13)

---

#### EC-064: Revenue Impact Display for Cancellations/Closures

- **Category:** INFORMATIONAL
- **Title:** Show estimated revenue impact when cancelling sessions
- **Scenario:** Weather closure cancels 30 sessions. Practice owner needs to know: "Today's closure cancelled X sessions = Y units = $Z estimated revenue loss." Helps prioritize makeup sessions by impact.
- **Who is affected:** Practice owner, scheduler
- **Frequency:** Per cancellation event (daily for individual, periodic for closures)
- **Impact if unhandled:** Decisions made without understanding financial consequences. No prioritization for makeup efforts.
- **Recommended handling:** Informational. Calculate and display estimated revenue impact when cancelling. Sort makeup queue by auth urgency (clients closer to expiration/under-utilization get priority).
- **Source:** operational-edge-cases (2.3)

---

#### EC-065: Urban vs. Rural Scheduling Density Context

- **Category:** INFORMATIONAL
- **Title:** Geographic context affects scheduling capacity expectations
- **Scenario:** Urban RBTs serve 5 clients/day (15-min drives). Rural RBTs serve 2-3/day (45-60 min drives). Standard utilization targets don't account for this. A rural RBT with 20 billable hours + 10 travel hours works as hard as an urban RBT with 32 billable + 3 travel.
- **Who is affected:** Practice owner, scheduler, rural RBTs
- **Frequency:** Constant for practices in mixed-density areas
- **Impact if unhandled:** Rural RBTs appear underperforming on metrics. Unfair comparisons. Burnout from invisible work.
- **Recommended handling:** Informational. Support geographic zones affecting scheduling expectations. Adjust utilization targets by zone. Geographic heat map of client locations.
- **Source:** operational-edge-cases (3.3)

---

### DEFERRED
Real edge cases acknowledged but not handled in MVP. Will address in later phases.

---

#### EC-066: EVV (Electronic Visit Verification) for Medicaid

- **Category:** DEFERRED
- **Title:** GPS-verified check-in/check-out for Medicaid home visits
- **Scenario:** Colorado and Florida mandate EVV for ABA. Requires capturing 6 data elements for each home visit. RBT must electronically check in/out with location verification. More states expanding this mandate.
- **Who is affected:** RBTs (home-based Medicaid sessions), billing staff
- **Frequency:** Every Medicaid home-based session in applicable states
- **Impact if unhandled:** State compliance failure for Medicaid-heavy practices.
- **Recommended handling:** Deferred to Phase 3+ (mobile/tablet interface). Track which payers require EVV as a flag. Full EVV with GPS requires mobile app.
- **Source:** operational-edge-cases (5.3)

---

#### EC-067: AI-Powered Auto-Scheduling / Route Optimization

- **Category:** DEFERRED
- **Title:** Automatic schedule generation and multi-location route optimization
- **Scenario:** New client intake requires solving a multi-constraint optimization problem: 25 hours of RBT availability matching family windows, geographic proximity, credential requirements, and schedule fit. Currently solved by brute force. Route clustering for home-based practices with 20+ clients.
- **Who is affected:** Scheduler
- **Frequency:** Per new client intake, per major schedule restructuring
- **Impact if unhandled:** Scheduler productivity ceiling at 75-100 clients/FTE. Suboptimal provider-client matching.
- **Recommended handling:** Deferred. Watch Hipp Health's approach first. For MVP, provide manual tools with good visibility (availability grids, constraint displays). AI auto-scheduling in v2.0+.
- **Source:** practitioner-pain-points (#10, #11), user-complaints (3, 7B)

---

#### EC-068: Two-Way SMS/Client App Scheduling Proposals

- **Category:** DEFERRED
- **Title:** Automated appointment proposals and confirmations via SMS/app
- **Scenario:** When a session cancels, auto-notify waitlisted clients or available RBTs via SMS. Two-way confirmation so families accept/decline reschedule proposals. Real-time calendar sync to phones.
- **Who is affected:** Families, RBTs, scheduler
- **Frequency:** Per cancellation/reschedule event
- **Impact if unhandled:** Slow manual communication means time-sensitive slots expire unfilled. CentralReach lacks this; it's a known gap.
- **Recommended handling:** Deferred to v1.1+. For MVP, focus on in-app notifications and email. SMS integration in fast-follow.
- **Source:** user-complaints (3), practitioner-pain-points (#13)

---

#### EC-069: Labor Law Compliance Guardrails

- **Category:** DEFERRED
- **Title:** Overtime, split shift, break compliance tracking during rescheduling
- **Scenario:** Rescheduling triggers labor law risks: paid travel time obligations, meal/rest break violations, overtime thresholds, split shift premiums (California). "Cancellation cascades are a labor compliance problem."
- **Who is affected:** Practice owner, scheduler, RBTs
- **Frequency:** Per reschedule event
- **Impact if unhandled:** Wage/hour violations, potential class action lawsuits. Real legal exposure documented.
- **Recommended handling:** Deferred. Complex state-by-state rules. For MVP, track total work hours per provider per day/week (visible but not enforced). Full labor compliance in v2.0.
- **Source:** practitioner-pain-points (#19)

---

#### EC-070: Waitlist-to-Schedule Automated Pipeline

- **Category:** DEFERRED
- **Title:** Automatic matching of waitlisted clients to newly available slots
- **Scenario:** 75% of caregivers experience waitlists (5.7 month average). When a slot opens (client discharges, RBT has new availability), the system should auto-match waitlisted clients by auth parameters, family availability, and geography.
- **Who is affected:** Families on waitlist, scheduler, practice owner
- **Frequency:** Per slot opening
- **Impact if unhandled:** Slow onboarding loses families to competitors. Revenue delayed.
- **Recommended handling:** Deferred to v1.1. For MVP, manual waitlist with visibility into open slots. Automated matching in fast-follow.
- **Source:** practitioner-pain-points (#12), domain-research (1A)

---

#### EC-071: Family Self-Service Availability and Scheduling Portal

- **Category:** DEFERRED
- **Title:** Families update availability and confirm/decline sessions online
- **Scenario:** Families' availability "revolves around work, school, therapies, naps, and extracurriculars -- and shifts frequently." A self-service portal lets families update availability and respond to scheduling proposals without phone tag.
- **Who is affected:** Families, scheduler
- **Frequency:** Per availability change (seasonally at minimum)
- **Impact if unhandled:** Scheduler spends hours per week on phone/text coordinating availability changes.
- **Recommended handling:** Deferred to future phase (parent portal). For MVP, scheduler manages availability from client profile.
- **Source:** practitioner-pain-points (#6), user-complaints (9)

---

#### EC-072: Session Edits Creating Hidden Billing Errors

- **Category:** DEFERRED
- **Title:** Post-scheduling edits desync session record from generated claim
- **Scenario:** Theralytics users report "hidden back-end errors when sessions are edited from what was originally scheduled, which can cause errors in the produced claim." Only fix: forbid edits or manually crosscheck every claim. This is an architectural integrity issue.
- **Who is affected:** Billing staff, practice owner
- **Frequency:** Per session edit
- **Impact if unhandled:** Claim errors, year-long denial cascades (Theralytics reported entire year's claims denied). Unit miscalculations (5 units billed for 3-hour session).
- **Recommended handling:** Deferred to claims phase (Phase 5). Architecture decision: single source of truth where session record drives claims and edits propagate automatically. Never generate claims from scheduled time -- always from documented actual time.
- **Source:** user-complaints (13, 14, 15)

---

## Priority Matrix

### MVP Must-Handle (scheduling feature cannot ship without these)

| ID | Edge Case | Category | Rationale |
|----|-----------|----------|-----------|
| EC-001 | Same provider overlapping 1:1 sessions | HARD BLOCK | Fraud prevention; most fundamental scheduling validation |
| EC-002 | RBT billing QHP-only codes | HARD BLOCK | 100% denial; credential-code mismatch |
| EC-003 | Session under expired authorization | HARD BLOCK | 100% denial; most common preventable revenue loss |
| EC-004 | CPT code not on authorization | HARD BLOCK | 100% denial |
| EC-005 | Session outside auth date range | HARD BLOCK | 100% denial |
| EC-007 | Provider credential expired | HARD BLOCK | All sessions unbillable |
| EC-008 | Same provider billing 97153 + 97155 simultaneously | HARD BLOCK | Fraud indicator |
| EC-009 | Client in individual + group at same time | HARD BLOCK | Impossible scenario |
| EC-010 | Exceeding authorized units (100%) | HARD BLOCK | 100% denial for excess |
| EC-011 | Auth approaching unit limit (80-95%) | WARNING | Prevent over-utilization |
| EC-012 | Daily MUE limit exceeded | WARNING | High denial rate for excess units |
| EC-013 | Provider not credentialed with payer | WARNING | 100% denial if not caught |
| EC-016 | Authorization gap during renewal | WARNING | Multi-stage alerts prevent gaps |
| EC-025 | Back-to-back sessions without travel buffer | WARNING | Daily occurrence; RBT turnover driver |
| EC-034 | Concurrent BCBA-RBT overlap (allow + display) | WARNING/INFO | Core supervision pattern |
| EC-036 | Documentation-schedule time mismatch | WARNING | Audit recoupment risk |
| EC-038 | Auth under-utilization pacing | MONITORING | Revenue + future auth impact |
| EC-040 | Client cancellation rate threshold | MONITORING | Revenue and clinical impact |
| EC-042 | Sessions without notes (aging) | MONITORING | Billing pipeline blocker |
| EC-047 | Recurring template beyond auth end date | MONITORING | Silent revenue loss |
| EC-054 | Multi-provider concurrent session display | INFORMATIONAL | Core calendar UX requirement |
| EC-061 | Drive time as non-billable block | INFORMATIONAL | Availability accuracy |
| EC-063 | Coverage board for provider absence | INFORMATIONAL | Weekly operations essential |

### v1.1 Should-Handle (fast-follow after calendar ships)

| ID | Edge Case | Category | Rationale |
|----|-----------|----------|-----------|
| EC-006 | Noncertified supervisor block | HARD BLOCK | Compliance; lower frequency |
| EC-014 | Provider not on authorization | WARNING | Payer-specific |
| EC-015 | Session location mismatch | WARNING | Less common but 100% denial |
| EC-017 | Scheduling under pending auth | WARNING | Risk indicator |
| EC-019 | Group session min/max size | WARNING | Only for group-running practices |
| EC-020 | Mutually exclusive codes | WARNING | Code conflict engine |
| EC-021 | Split session same-day modifier | WARNING | Auto-add at claim generation |
| EC-023 | TRICARE parent training timing | WARNING | Payer-specific proactive alerts |
| EC-026 | RBT transition overlap billing | WARNING | Turnover-driven |
| EC-027 | Auth expiring <7 days, no renewal | WARNING | Auth gap prevention |
| EC-030 | BACB 5% supervision pacing | WARNING | Certification compliance |
| EC-031 | 2 face-to-face contacts per month | WARNING | BACB requirement |
| EC-037 | CMS vs AMA unit calculation | WARNING | Claims accuracy |
| EC-039 | Auth pacing off-track | MONITORING | Revenue optimization |
| EC-041 | Timely filing deadline approaching | MONITORING | Permanent revenue loss |
| EC-043 | 97155:97153 ratio outlier | MONITORING | Audit risk |
| EC-044 | Staff utilization outside range | MONITORING | Operational health |
| EC-048 | Credential expiration approaching | MONITORING | Proactive prevention |
| EC-049 | Cancellation pattern detection | MONITORING | Operational intelligence |
| EC-052 | Makeup session success rate | MONITORING | Revenue recovery |
| EC-055 | Assessment non-recurring guard | INFORMATIONAL | Scheduling guard |
| EC-057 | Sibling scheduling context | INFORMATIONAL | Family convenience |
| EC-058 | School-age seasonal availability | INFORMATIONAL | Template management |
| EC-060 | Parent training scheduling context | INFORMATIONAL | Frequency compliance |
| EC-062 | Non-billable time blocks | INFORMATIONAL | Burnout prevention |

### v2.0 Nice-to-Handle (later phases)

| ID | Edge Case | Category | Rationale |
|----|-----------|----------|-----------|
| EC-018 | BCBA billing 97153 | WARNING | Edge case, not common |
| EC-022 | Payer-specific daily/weekly caps | WARNING | Requires payer config engine |
| EC-024 | Caregiver availability constraint | WARNING | Family-level scheduling |
| EC-028 | Same-day multi-code payer rules | WARNING | Requires payer-specific rules |
| EC-029 | Medicaid quarterly re-auth templates | WARNING | Payer-specific workflow |
| EC-032 | 50% individual supervision rule | WARNING | Detailed supervision tracking |
| EC-033 | Telehealth supervision payer mismatch | WARNING | Payer-specific |
| EC-035 | BCaBA supervision chain | WARNING | Uncommon at small practices |
| EC-045 | RBT hours guarantee tracking | MONITORING | Retention metric |
| EC-046 | Workload inequity across staff | MONITORING | Equity dashboard |
| EC-050 | Coordination of benefits errors | MONITORING | Claims phase |
| EC-051 | Duplicate claim prevention | MONITORING | Claims phase |
| EC-053 | Session-to-claim lag | MONITORING | Claims phase |
| EC-056 | Client scheduling notes | INFORMATIONAL | Clinical preference |
| EC-059 | Session modality display | INFORMATIONAL | UX refinement |
| EC-064 | Revenue impact display | INFORMATIONAL | Business intelligence |
| EC-065 | Urban vs rural density context | INFORMATIONAL | Geographic zones |
| EC-066 | EVV for Medicaid | DEFERRED | Requires mobile app |
| EC-067 | AI auto-scheduling | DEFERRED | Watch competitors first |
| EC-068 | Two-way SMS proposals | DEFERRED | Communication infrastructure |
| EC-069 | Labor law compliance | DEFERRED | State-by-state complexity |
| EC-070 | Waitlist automation | DEFERRED | Intake pipeline |
| EC-071 | Family self-service portal | DEFERRED | Parent portal phase |
| EC-072 | Session edit billing integrity | DEFERRED | Claims architecture |

---

## Sources

All sources are documented in the individual research documents. Key references:

- BACB Official Documentation (2026 standards)
- ABA Coding Coalition FAQs
- HHS OIG March 2026 Report (Colorado Medicaid ABA audit)
- RethinkBH 2025 BCBA Survey (n=390)
- Payer policy documents (TRICARE, UHC/Optum, Anthem, state Medicaid)
- ABA billing specialist publications (Cube Therapy Billing, Operant Billing, MBWRCM)
- Competitor analysis (CentralReach, AlohaABA, Theralytics, Passage Health, Hipp Health, Raven Health, CR Essentials, Noteable)
- Practitioner resources (Mission Viewpoint, Behaviorist Book Club, ABA Building Blocks, Measure PM)
- Verified user reviews (Capterra, G2, Software Advice, TrustRadius, GetApp)
