# ABA Scheduling Edge Cases & Business Logic Audit Document

**Clinivise Practice Management Platform**
**Version 1.0 — March 2026**
**Classification: Engineering Reference — Scheduling Module**

---

## Document Purpose

This document catalogs every known scheduling edge case, billing conflict, compliance rule, and business logic requirement that the Clinivise scheduling engine must handle. Each item includes a scenario ID, severity level, affected roles, and payer-specific notes. The engineering team should use this as a verification checklist against the scheduling implementation.

### Severity Levels

| Level | Meaning | System Behavior |
|-------|---------|-----------------|
| **BLOCK** | Prevents session creation or claim submission | Hard stop — cannot proceed without resolution |
| **WARN** | High risk of denial or compliance violation | Allow with prominent warning and acknowledgment |
| **INFO** | Best practice or optimization opportunity | Display advisory; log for reporting |

### Role Abbreviations

| Abbrev | Role |
|--------|------|
| BCBA | Board Certified Behavior Analyst |
| BCaBA | Board Certified Assistant Behavior Analyst |
| RBT | Registered Behavior Technician |
| QHP | Qualified Healthcare Professional |
| BT | Behavior Technician (uncredentialed) |
| PM | Practice Manager / Admin |
| BILL | Billing Staff |

---

## Section 1: CPT Code Concurrent Billing Rules Matrix

### 1.1 Code Reference Table

All ABA CPT codes are 15-minute timed codes. The system must store and validate these attributes:

| Code | Description | Provider Level | Group? | MUE (Medicare) | MUE (Medicaid) |
|------|-------------|---------------|--------|----------------|----------------|
| 97151 | Assessment/treatment plan development | QHP only | No | 8 units (2 hrs) | 32 units (8 hrs) |
| 97152 | Assessment — technician under QHP direction | Tech + QHP | No | 16 units (4 hrs) | 16 units (4 hrs) |
| 97153 | Treatment by protocol — technician | Tech under QHP | No | 32 units (8 hrs) | 32 units (8 hrs) |
| 97154 | Group treatment by protocol — technician | Tech under QHP | Yes (2-8) | 18 units (4.5 hrs) | 18 units (4.5 hrs) |
| 97155 | Treatment with protocol modification — QHP | QHP only | No | 24 units (6 hrs) | 24 units (6 hrs) |
| 97156 | Family/caregiver guidance — QHP | QHP only | No | 16 units (4 hrs) | 16 units (4 hrs) |
| 97157 | Multiple-family group guidance — QHP | QHP only | Yes (families) | 16 units (4 hrs) | 16 units (4 hrs) |
| 97158 | Group treatment with protocol modification — QHP | QHP only | Yes (2-8) | 16 units (4 hrs) | 16 units (4 hrs) |
| 0362T | Assessment — tech with 2 techs + QHP available | Tech + QHP avail | No | 16 units (4 hrs) | 16 units (4 hrs) |
| 0373T | Treatment with protocol modification — QHP + 2 techs | QHP + 2 Techs | No | 32 units (8 hrs) | 32 units (8 hrs) |

### 1.2 Concurrent Billing Rules — Core Matrix

**CPT-001** | BLOCK | Roles: BCBA, RBT, BILL
**Rule: 97153 + 97155 — Concurrent billing by DIFFERENT providers**
97153 (RBT delivering treatment) and 97155 (BCBA directing technician/modifying protocol) MAY be billed concurrently when both providers are face-to-face with the same client at the same time. The RBT bills 97153 and the BCBA bills 97155. This is the most common concurrent billing scenario in ABA.
- **Critical constraint**: A single provider may NOT report both 97153 and 97155 for the same time block. The codes require different rendering providers.
- **Modifier requirement**: RBT uses HM (not physician) or HN modifier; BCBA uses HO modifier (or state-specific equivalent).
- **Payer exceptions**:
  - NC Medicaid: Concurrent billing of 97153 and 97155 is explicitly NOT permitted — only one code may be billed for concurrent care.
  - Anthem (IN, OH, TX): Has historically attempted to restrict concurrent billing; ABA Coding Coalition successfully advocated against this.
  - TRICARE: Concurrent billing excluded for all ACD Category I codes EXCEPT when family and patient are receiving separate, distinct services and the patient is not present in the family session.

**CPT-002** | BLOCK | Roles: BCBA, RBT, BILL
**Rule: 97154 + 97155 — Group treatment + QHP oversight**
97154 (group treatment by tech) and 97155 (QHP protocol modification) may be billed concurrently when the BCBA is directing the technician during a group session and modifying protocols. A single QHP may NOT report both 97154 and 97155 for the same time.
- **Group size validation**: 97154 requires minimum 2 clients, maximum 8.
- System must bill 97154 per client in the group.

**CPT-003** | BLOCK | Roles: BCBA, BILL
**Rule: 97155 + 97156/97157 — Protocol modification + caregiver training**
97155 cannot be billed concurrently with caregiver training codes (97156/97157) by the same provider. The QHP must deliver these as separate, distinct time blocks.
- 97155 and 97156 CAN occur on the same date of service — they just cannot overlap temporally.
- Documentation must clearly separate the two services with distinct start/end times.
- **UHC/Optum**: Explicitly requires services to be "separate, distinct, and clearly documented in the progress notes."

**CPT-004** | BLOCK | Roles: BCBA, BILL
**Rule: 97151 — Cannot be used for day-to-day treatment planning**
97151 is exclusively for initial assessment/treatment plan development and periodic reassessment (typically every 180 days, per payer policy). Day-to-day assessment and treatment planning activities are bundled into treatment codes 97153-97158 and 0373T.
- System should restrict 97151 scheduling to assessment windows and re-evaluation periods.
- **Texas Medicaid**: 97151 authorized for up to 24 units (6 hours) for initial evaluation; must be used within 30 calendar days of first date of service.

**CPT-005** | BLOCK | Roles: BCBA, BILL
**Rule: 97153 — Cannot be used for group treatment**
Sessions that operate as group treatment must be billed as 97154, not 97153. System must validate: if session has >1 client assigned to same RBT at same time, code must be 97154.

**CPT-006** | BLOCK | Roles: BCBA, BILL
**Rule: 97158 — QHP-led group only**
97158 is for group adaptive behavior treatment with protocol modification delivered by QHP. This code cannot be used for technician-led group sessions (use 97154 instead).
- Group size: 2-8 clients.
- System must validate rendering provider is QHP-level when 97158 is selected.

**CPT-007** | WARN | Roles: BCBA, BILL
**Rule: 0362T/0373T — QHP "immediately available and interruptible"**
For 0362T and 0373T sessions, a QHP must be physically present at the same location and not assigned to deliver any direct services to other clients or caregivers that would prevent them from being immediately available. The QHP CAN provide direction to a technician (97155) during this time, but cannot be conducting 97151, 97153 (with modifier), or 97156/97157.
- System should flag scheduling conflicts where the supervising QHP has overlapping direct-service sessions with other clients.

**CPT-008** | WARN | Roles: BILL, PM
**Rule: MUE enforcement — Medicare vs. Medicaid discrepancy**
Most commercial payers follow Medicare MUEs. System should default to Medicare MUE limits but allow practice-level configuration per payer. Key discrepancy: 97151 has 8 units (Medicare) vs. 32 units (Medicaid).
- When scheduled units for a date of service approach MUE limits, system should display warning.
- Claims exceeding MUE may still be submitted with documentation of medical necessity but are high-denial risk.

**CPT-009** | BLOCK | Roles: BILL, PM
**Rule: Per-provider daily billing cap**
Nevada Medicaid enforces: each individual servicing provider may provide billable services for no more than 12 hours on any given day. Combined weekly cap: 40 hours per recipient across all providers for codes 0373T, 97153-97158.
- System should track cumulative daily hours per provider and weekly hours per client.
- Flag when approaching caps.

**CPT-010** | WARN | Roles: BCBA, BILL
**Rule: Modifier requirements by provider level**
All 97153 claims require a modifier indicating the rendering provider's credential level:
- HM: Not a physician (general)
- HN: Bachelors degree level (some states use for RBT)
- HO: Masters degree level (BCBA)
- HP: Doctoral level (BCBA-D)
- Modifier 95 or GT: Telehealth (payer-specific)
- System must auto-apply the correct modifier based on the rendering provider's credential profile.
- **Texas Medicaid**: Specific modifier matrix for 97155, 97156, 97158 (QHP codes) vs. 97153, 97154 (technician codes).

### 1.3 Concurrent Billing Quick-Reference Matrix

The system must implement this validation matrix. "Y" = valid concurrent pair, "N" = invalid, "C" = conditional.

| | 97151 | 97152 | 97153 | 97154 | 97155 | 97156 | 97157 | 97158 | 0362T | 0373T |
|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| **97151** | N | N | N | N | N | N | N | N | N | N |
| **97152** | N | N | N | N | N | N | N | N | N | N |
| **97153** | N | N | N | N | C* | C** | C** | N | N | N |
| **97154** | N | N | N | N | C* | C** | C** | N | N | N |
| **97155** | N | N | C* | C* | N | N | N | N | C*** | C*** |
| **97156** | N | N | C** | C** | N | N | N | N | N | N |
| **97157** | N | N | C** | C** | N | N | N | N | N | N |
| **97158** | N | N | N | N | N | N | N | N | N | N |
| **0362T** | N | N | N | N | C*** | N | N | N | N | N |
| **0373T** | N | N | N | N | C*** | N | N | N | N | N |

**C* = Different providers required** (RBT bills 97153/97154, BCBA bills 97155 simultaneously for same client)
**C** = Different providers, patient not present in family session** (RBT bills 97153 with client; different BCBA bills 97156/97157 with caregiver in separate location)
**C*** = 97155 direction only** (QHP providing 97155 direction to tech can be "immediately available" for 0362T/0373T at same location)

---

## Section 2: Authorization Lifecycle Edge Cases

### 2.1 Authorization Expiry Scenarios

**AUTH-001** | BLOCK | Roles: PM, BCBA, BILL
**Scenario: Auth expires mid-recurring-session-series**
A client has recurring sessions Mon/Wed/Fri. The authorization expires on a Wednesday. The system must:
1. Identify all future sessions beyond the auth end date at creation time.
2. Display a hard block on sessions scheduled after auth expiration.
3. When generating recurring sessions, stop generation at the auth end date.
4. If the practice has submitted a re-authorization request, allow sessions to be created in "pending auth" status (not billable until auth confirmed).
5. Send re-authorization reminders at configurable lead times (default: 45, 30, 15 days before expiry).
- **TRICARE-specific**: Auths are for 6-month periods. New referral from diagnosing provider required every 2 years. System must track both the 6-month auth cycle and the 2-year referral cycle.

**AUTH-002** | WARN | Roles: PM, BCBA
**Scenario: Auth renewal with different codes or hours**
A renewal authorization may change the approved codes (e.g., dropping 97156 parent training) or reduce/increase total hours. The system must:
1. Compare new auth parameters against existing recurring schedule.
2. Flag any sessions using codes no longer authorized.
3. Flag if scheduled weekly hours exceed the new auth's weekly/total allocation.
4. Prompt practice to adjust the schedule before the new auth period begins.
5. Maintain the old auth record for historical billing lookups.

**AUTH-003** | WARN | Roles: PM, BILL
**Scenario: Overlapping auths from primary/secondary payer**
A client has both Medicaid (primary) and a commercial plan (secondary). Each payer may issue separate authorizations with different parameters. System must:
1. Track authorizations per payer independently.
2. Apply the primary payer's auth limits for scheduling validation.
3. When primary denies/partially pays, check if secondary auth covers the service.
4. Never schedule services that exceed BOTH authorizations simultaneously.
5. Flag if auth periods don't align (e.g., primary auth 1/1-6/30, secondary auth 3/1-8/31).

**AUTH-004** | WARN | Roles: PM, BCBA
**Scenario: Utilization pacing — "on pace" vs. "behind"**
Given an auth for 500 units of 97153 over 6 months, the system should calculate:
- **Expected pace**: (Total auth units / total weeks in period) = target units per week.
- **Actual pace**: Sum of scheduled + completed units / weeks elapsed.
- **Pacing status**:
  - Green (On Pace): Actual within 90-110% of expected.
  - Yellow (Behind): Actual at 70-89% of expected.
  - Orange (Significantly Behind): Actual at 50-69%.
  - Red (At Risk): Below 50% — indicates likely inability to use authorized units.
  - Over Pace: Actual >110% — risk of exhausting auth early.
- Display pacing dashboard per client per auth code.
- Account for planned cancellations, holds, and school breaks in pacing calculations.

**AUTH-005** | BLOCK | Roles: PM, BILL
**Scenario: Per-day vs. per-week vs. total-period caps interaction**
Some auths layer multiple cap types. Example: 40 units/week of 97153 AND 520 total units for the 6-month period AND 12 units/day maximum. The system must enforce ALL cap layers simultaneously:
1. Per-session: Cannot exceed a single session's typical duration.
2. Per-day per code: Cannot exceed the payer's daily maximum or MUE.
3. Per-week per code: Some auths specify weekly unit maximums.
4. Per-period per code: Total authorization pool.
5. Per-week combined: Some payers cap total ABA hours regardless of code (e.g., Nevada's 40 hrs/week combined).
- When any cap is approaching, display the most restrictive limit.
- **NC Medicaid**: Weekly units for 97153 cannot be rolled over to other weeks. Monthly units for 97155 and 97156 cannot be rolled over. Period is Sunday-Saturday for weekly, calendar month for monthly.

**AUTH-006** | WARN | Roles: PM, BCBA
**Scenario: Make-up session logic**
When a session is cancelled, can it be made up? System logic:
1. Check if auth has a "no make-up" restriction (rare but exists).
2. Check if adding a make-up session would exceed any daily/weekly cap.
3. If auth is per-week capped and the cancellation occurred in a prior week, the units typically cannot be recovered (especially NC Medicaid).
4. If auth is total-period capped, the units can be rescheduled within the remaining auth period.
5. Make-up sessions should be flagged differently in reporting (for cancellation rate tracking).
6. System should suggest available make-up slots based on provider availability and auth remaining.

**AUTH-007** | BLOCK | Roles: PM, BILL
**Scenario: Auth exhausted mid-period**
When cumulative billed + scheduled units reach the auth total:
1. BLOCK any new session creation for that code under that auth.
2. Flag all remaining scheduled sessions as "Exceeds Auth" with a hard stop on billing.
3. Calculate the date when auth will be exhausted based on current schedule.
4. Alert PM at configurable thresholds (e.g., 80%, 90%, 95% utilized).
5. Auto-generate a prompt to request additional units or begin re-auth process.
- Distinguish between "completed and billed" units vs. "scheduled but not yet rendered" units. The system should consider scheduled future sessions as "reserved" units.

**AUTH-008** | WARN | Roles: PM, BCBA
**Scenario: Concurrent review impact on scheduling**
Some payers require concurrent utilization reviews at mid-points. During review periods:
1. Existing sessions may continue, but new sessions may need to be held pending review outcome.
2. If concurrent review results in reduced hours, the system must cascade the reduction to future scheduled sessions.
3. Track concurrent review dates as auth milestones alongside expiry dates.

**AUTH-009** | INFO | Roles: PM, BCBA
**Scenario: Re-authorization warning timelines**
Industry best practices for re-auth lead times:
- **60 days before expiry**: Begin re-evaluation (97151) data collection.
- **45 days before**: Submit re-auth request to payer.
- **30 days before**: Follow up if not yet approved.
- **14 days before**: Escalate; consider peer-to-peer review.
- **7 days before**: Emergency escalation; prepare for service gap contingency.
- System should generate automated workflow tasks at each milestone.
- **TRICARE**: Re-authorization every 6 months with updated treatment plan and outcome measures (Vineland-3, SRS-2, PDDBI).

---

## Section 3: BACB Supervision Compliance Rules

### 3.1 Core BACB Requirements

**SUPV-001** | BLOCK | Roles: BCBA, RBT, PM
**Rule: 5% Monthly Supervision Minimum**
RBTs must receive supervision for at least 5% of their total monthly ABA service hours. The 5% is calculated on direct client service hours only — administrative time, drive time, and non-billable activities are excluded.
- Formula: `Required supervision hours = Total RBT service hours × 0.05`
- Example: RBT delivers 120 hours of direct service → minimum 6 hours of supervision required.
- System must track this in real-time and display a compliance dashboard per RBT per calendar month.

**SUPV-002** | BLOCK | Roles: BCBA, RBT, PM
**Rule: Minimum supervision contact frequency**
Supervision must occur at least twice per month in live (synchronous) contacts. At least one contact per month must involve direct observation of the RBT providing services to a client. The system should:
1. Track the number of supervision contacts per month per RBT.
2. Flag if fewer than 2 contacts are scheduled.
3. Flag if no direct observation session is scheduled.
4. Distinguish between individual supervision, group supervision, and direct observation.

**SUPV-003** | WARN | Roles: BCBA, PM
**Rule: Group supervision cap**
No more than half (50%) of required supervision hours may be in group format. Maximum group size is 10 RBTs per supervision group session (per 2025 BACB RBT Handbook).
- System must track individual vs. group supervision hours separately.
- If group hours approach 50% of total required, warn before allowing additional group sessions.
- Validate group session participant count ≤ 10.

**SUPV-004** | BLOCK | Roles: BCBA, RBT, PM
**Rule: Supervisor must be listed in BACB account**
Ongoing supervision for an RBT only counts toward the 5% minimum if the RBT Supervisor has the RBT listed as a supervisee in their BACB account. System should:
1. Maintain a supervisor-supervisee mapping.
2. Flag if a supervision session is scheduled between a BCBA and an RBT not linked in the system.
3. Prompt the BCBA to verify BACB account linkage.

**SUPV-005** | BLOCK | Roles: BCBA, PM
**Rule: Supervisor training prerequisite**
Supervisors must complete the 8-hour supervision training based on the BACB Supervisor Training Curriculum Outline (2.0) before providing supervision. System should track:
1. Whether each BCBA has completed the 8-hour training.
2. Training completion date (for audit readiness).
3. Block assignment as RBT supervisor if training not documented.

**SUPV-006** | WARN | Roles: BCBA, PM
**Rule: Remote/telehealth supervision requirements**
BACB allows supervision via live video if the supervisor can directly observe the RBT providing services. Requirements:
1. Technology must be HIPAA-compliant.
2. Client consent for telehealth observation must be documented.
3. Same content/format/contact rules apply as in-person.
4. At least one in-person direct observation per month is required (cannot be fully remote).
- System should flag telehealth supervision sessions and validate at least one in-person observation is scheduled per month.

**SUPV-007** | INFO | Roles: BCBA, PM
**Rule: Documentation retention — 7-year requirement**
All supervision records must be maintained for 7 years per BACB requirements. Records must include: date, duration, type (individual/group/observation), content covered, participants, and co-signatures.
- System must retain supervision records and prevent deletion within the 7-year window.
- Monthly co-signature workflow: supervisor and RBT sign off on monthly supervision summary.

### 3.2 Real-Time Compliance Calculation

**SUPV-008** | WARN | Roles: BCBA, PM
**Scenario: How the system should calculate real-time compliance**
The system should run a rolling compliance calculation throughout each calendar month:

```
Current month service hours (RBT): Sum of all completed + scheduled service hours
Current month supervision hours (RBT): Sum of all completed + scheduled supervision hours
Compliance percentage: (supervision_hours / service_hours) × 100
Status:
  - ≥ 5.0% with ≥ 2 contacts and ≥ 1 observation → COMPLIANT (green)
  - 4.0-4.9% → AT RISK (yellow) — can still reach 5% with remaining days
  - < 4.0% with < 10 business days remaining → NON-COMPLIANT RISK (red)
  - < 5.0% on last day of month → NON-COMPLIANT (block)
```

Additional calculations:
- Projected end-of-month compliance based on scheduled sessions.
- If the RBT has sessions cancelled that reduce their service hours, supervision % goes up — system should recalculate dynamically.
- Dashboard showing all RBTs ranked by compliance status.

### 3.3 State-Specific Supervision Rules Beyond BACB Minimums

**SUPV-009** | BLOCK | Roles: BCBA, PM
**State: California**
- LBAs (Licensed Behavior Analysts) are licensed through the California Board of Psychology (until full licensure board is established).
- BCaBAs (LaBA in CA terminology) may deliver some services but may NOT deliver services remotely via telehealth.
- Medi-Cal BHT (Behavioral Health Treatment) benefit: supervision and oversight requirements are set by managed care plan policies, which may exceed BACB minimums.
- RBTs operating under Medi-Cal must work under the direction of an LBA; LaBA may be delegated parent training under LBA supervision.

**SUPV-010** | BLOCK | Roles: BCBA, PM
**State: Texas**
- ABA practitioners are licensed by the Texas Department of Licensing and Regulation (TDLR).
- Texas Medicaid ABA services: LBAs and RBTs may NOT deliver any service remotely via telehealth. Only LBAs (Licensed Behavior Analysts) can deliver 97155, 97156, 97158 via telehealth.
- Texas Medicaid will not reimburse multiple ABA providers during one ABA session with a child when more than one provider bills for the same service at the same time.
- 97151 must be used within 30 calendar days of first date of service.

**SUPV-011** | WARN | Roles: BCBA, PM
**State: Florida**
- BCBAs licensed under FL statute 491. Florida mandates insurance coverage with no dollar cap or age limit for ABA services for ASD diagnosis.
- Florida Medicaid: ABA services delivered through managed care plans (e.g., Sunshine Health, Molina, Aetna Better Health).
- Supervision ratios and documentation timing requirements follow BACB standards plus plan-specific policies.
- Telehealth: Florida allows telehealth ABA services; specific documentation of informed consent required.

**SUPV-012** | WARN | Roles: BCBA, PM
**State: New York**
- LBAs licensed under NY Education Law Article 167.
- NY Medicaid: ABA covered under EPSDT for children under 21.
- NY has specific credentialing requirements for behavior technicians — must meet state-defined training standards beyond RBT certification alone.
- Prior authorization required for most Medicaid managed care plans with plan-specific supervision documentation requirements.

**SUPV-013** | WARN | Roles: BCBA, PM
**State: Massachusetts**
- LBAs licensed under MA Board of Registration of Allied Health Professionals.
- ARICA (Applied Behavior Analysis coverage) mandated for all insurance plans.
- MA Medicaid (MassHealth): ABA coverage with state-specific utilization management criteria.
- Massachusetts AG office has identified ABA as an enforcement priority area for Medicaid fraud — heightened documentation requirements.
- Supervision documentation must clearly distinguish between billable supervision (97155) and non-billable BACB supervision.

---

## Section 4: Cancellation Business Logic Taxonomy

### 4.1 Cancellation Category Definitions

**CANC-001** | INFO | Roles: PM, BILL, BCBA
**Taxonomy: Cancellation categories and their system implications**

| Category | Code | Initiated By | Notice Period | Auth Impact | RBT Pay Impact |
|----------|------|-------------|---------------|-------------|----------------|
| Client No-Show | CNS | Client (implicit) | None | No deduction* | Practice-specific** |
| Client Late Cancel | CLC | Client | < 24 hrs | No deduction* | Practice-specific** |
| Client Same-Day Cancel | CSC | Client | < 24 hrs, before appt | No deduction* | Practice-specific** |
| Client Advance Cancel | CAC | Client | ≥ 24 hrs | No deduction | No pay |
| Provider Sick Call | PSC | Provider | Any | No deduction | Sick leave policy |
| Provider Schedule Change | PSH | Provider | ≥ 24 hrs | No deduction | No pay (rescheduled) |
| Practice Closure | PCL | Practice | Planned | No deduction | Holiday/PTO policy |
| Weather/Emergency | WEM | External | N/A | No deduction | Practice-specific |
| Client Illness | CIL | Client | Any | No deduction | Practice-specific |
| Insurance Lapse | INL | System-detected | N/A | Auth void | BLOCK — do not pay |

*Auth impact note: No-shows and late cancels do NOT reduce authorization units because no service was rendered and no claim is submitted. However, they represent lost utilization opportunity against total-period auths.

**RBT pay note: Whether RBTs receive partial compensation for no-shows/late cancels is a practice policy decision. System should support configurable cancellation pay rules per category.

**CANC-002** | WARN | Roles: PM, BCBA
**Rule: Late cancel vs. no-show vs. same-day cancel — billing differences**
- **No-show**: Client did not arrive and did not call. No claim can be submitted to insurance. Some practices charge a no-show fee to the client directly (verify payer contract — some prohibit this for Medicaid clients).
- **Late cancel (< 24 hrs)**: Client cancelled with less than the contractual notice threshold. Same billing treatment as no-show — no claim submitted. Late cancel fee may apply per practice policy.
- **Same-day cancel**: Client cancelled on the day of service before the appointment time. Generally treated same as late cancel.
- **Advance cancel (≥ 24 hrs)**: Client cancelled with adequate notice. No penalty. Session removed from schedule.
- **CRITICAL**: None of these categories allow billing the insurance for services not rendered. System must BLOCK any attempt to create a claim for a cancelled or no-show session.

**CANC-003** | WARN | Roles: PM, BCBA
**Rule: Cancellation cascade resolution priority**
When a cancellation occurs, the system should process cascading effects in this priority order:
1. **Auth utilization recalculation**: Update pacing dashboard. If this was a make-up-eligible session, flag it.
2. **RBT schedule impact**: If the RBT now has a gap, flag the time block as available for make-up sessions with other clients.
3. **Supervision compliance recalculation**: If the cancelled session would have included supervision (97155 overlap), recalculate the RBT's monthly supervision compliance.
4. **Client frequency tracking**: Update the client's weekly frequency count. If they've dropped below recommended frequency, alert BCBA.
5. **Cancellation rate tracking**: Increment the client's rolling cancellation rate.
6. **Parent communication**: Trigger notification to parent/caregiver about the cancellation.
7. **Make-up scheduling**: If practice policy allows and auth permits, offer make-up slot selection.

### 4.2 Cancellation Rate Monitoring

**CANC-004** | INFO | Roles: PM, BCBA
**Rule: Cancellation rate benchmarks and thresholds**

| Metric | Normal | Concerning | Critical |
|--------|--------|------------|----------|
| Client cancellation rate (rolling 30 days) | < 10% | 10-20% | > 20% |
| Client no-show rate (rolling 30 days) | < 5% | 5-10% | > 10% |
| Provider cancellation rate (rolling 30 days) | < 5% | 5-10% | > 10% |
| Practice-wide cancellation rate | < 12% | 12-18% | > 18% |
| Single client consecutive cancellations | 1 | 2 | 3+ |

System should:
- Calculate rolling 30-day cancellation rates per client, per provider, and practice-wide.
- Alert BCBA when a client hits "concerning" threshold.
- Alert PM when a client hits "critical" threshold.
- Track consecutive cancellations — 3+ consecutive may indicate client disengagement, family crisis, or discharge risk.
- Generate reports for auth renewals showing attendance compliance.

**CANC-005** | WARN | Roles: PM, BCBA
**Rule: Impact of high cancellation rates on clinical outcomes and authorization**
- Payers increasingly track utilization rates. If authorized hours are consistently underutilized (< 70%), payers may reduce hours at re-authorization.
- TRICARE explicitly monitors treatment adherence; provider must document all attempts to mitigate caregiver non-participation.
- System should generate a "utilization risk report" that combines cancellation data with auth pacing.

---

## Section 5: Session Overlap & Conflict Rules

### 5.1 Same-Provider Conflicts

**OVLP-001** | BLOCK | Roles: PM, BCBA, RBT
**Rule: Same provider, same time, 1:1 codes**
A single provider may NOT be scheduled for two 1:1 sessions at the same time. This applies to:
- RBT: Cannot have two 97153 sessions overlapping.
- BCBA: Cannot have two 97155 sessions overlapping (unless one is direction of a tech at the same location and the other is a group — but see group rules).
- Exception: BCBA providing 97155 (directing RBT with Client A) can potentially also be "immediately available" for 0362T/0373T for the same client — but NOT for a different client simultaneously.

**OVLP-002** | WARN | Roles: PM, BCBA
**Rule: Same provider, same time, group codes**
A provider may lead one group session (97154 or 97158) with 2-8 clients simultaneously. However:
- Cannot lead two separate group sessions at the same time.
- Cannot lead a group AND a 1:1 session simultaneously.
- The group session is billed per client in the group (each client gets a separate claim line).

### 5.2 Same-Client Conflicts

**OVLP-003** | BLOCK | Roles: PM, BCBA
**Rule: Different providers, same client, same time — valid combinations only**
The only valid scenario where two providers can be with the same client at the same time in ABA:
- RBT delivering 97153 AND BCBA delivering 97155 (tech direction/protocol modification).
- RBT delivering 0362T AND BCBA available (not billing 97155 for the overlap unless actively directing).
System must validate all other same-client overlaps as conflicts.

**OVLP-004** | BLOCK | Roles: PM, BCBA
**Rule: ABA + non-ABA concurrent therapy restrictions**
Some payers prohibit ABA services while the client is receiving other therapies simultaneously:
- **TRICARE**: ABA cannot overlap with speech therapy (ST), occupational therapy (OT), or physical therapy (PT) unless services are clearly addressing different goals and documented as such. TRICARE treatment plans must report hours of other support services being received.
- **Cigna**: Has historically restricted concurrent ABA and other behavioral health services. Verify contract-specific provisions.
- System should maintain a "concurrent therapy restriction" flag per payer and validate against the client's full schedule (not just ABA sessions).

**OVLP-005** | WARN | Roles: PM, BCBA
**Rule: BCBA supervision overlapping RBT treatment — billing implications**
When a BCBA joins an RBT's session for supervision:
- The RBT continues to bill 97153 for the full session duration.
- The BCBA bills 97155 only for the time they are face-to-face directing/observing the RBT.
- The BCBA cannot bill both 97155 AND count the time as BACB supervision for a different RBT.
- If the BCBA is providing supervision that does not involve protocol modification (pure BACB-required oversight), this may not be billable as 97155 — it depends on whether protocols are actually being modified.
- System should allow "supervision-only" session types that track BACB supervision hours without generating a 97155 claim.

### 5.3 Buffer and Travel Rules

**OVLP-006** | WARN | Roles: PM, RBT, BCBA
**Rule: Drive time buffers between sessions**
For providers who travel between client locations (in-home ABA), the system should enforce configurable drive time buffers:
- Default: 15-minute minimum buffer between sessions at different locations.
- Practice-configurable per geographic region.
- System should validate that back-to-back sessions at different addresses have adequate buffer.
- If both sessions are at the same location (e.g., same clinic), no buffer needed.
- Drive time is NOT billable and should not appear on claims.

**OVLP-007** | WARN | Roles: PM, BCBA
**Rule: Telehealth-to-in-person transition buffer**
If a provider has a telehealth session followed by an in-person session (or vice versa), standard drive buffers may not apply, but a minimum transition buffer of 5 minutes should be enforced for technology setup/teardown.

---

## Section 6: Template & Recurring Schedule Edge Cases

### 6.1 Client Status Changes

**TMPL-001** | BLOCK | Roles: PM, BCBA
**Scenario: Client discharged — future sessions**
When a client status changes to "Discharged":
1. All future scheduled sessions must be cancelled automatically.
2. Cancellation reason auto-set to "Client Discharged."
3. RBTs with freed time blocks should be flagged for reassignment.
4. Any pending claims for completed sessions remain unaffected.
5. Authorization records archived but retained.
6. System should prompt for discharge documentation (discharge summary, final progress report).
7. TRICARE prohibition: Providers may not terminate services without a transition plan. System should enforce transition plan documentation before allowing discharge status.

**TMPL-002** | WARN | Roles: PM, BCBA
**Scenario: Client placed on hold**
Client may be placed on temporary hold (vacation, family emergency, medical procedure). System must:
1. Suspend all recurring sessions for the hold period.
2. Do NOT cancel sessions — mark as "On Hold" to preserve the recurring template.
3. Track hold duration for auth pacing impact.
4. Auto-resume sessions at hold end date.
5. Flag if hold duration will cause auth underutilization.
6. If hold exceeds 30 consecutive days, alert BCBA — many payers require re-assessment or new auth after extended service gap.

### 6.2 Provider Departure

**TMPL-003** | BLOCK | Roles: PM, BCBA
**Scenario: RBT departure with multiple clients needing reassignment**
When an RBT leaves the practice:
1. Identify all active clients assigned to the departing RBT.
2. Display the total weekly hours requiring reassignment.
3. Show available RBTs with matching: credential level, geographic proximity, schedule availability, payer credentials.
4. Support bulk reassignment workflow (not one-by-one).
5. Validate the replacement RBT's schedule capacity before assignment.
6. Check that the replacement RBT is credentialed with the client's payer.
7. Generate parent notification for each affected client.
8. Ensure BCBA supervision mapping transfers to new RBT.
9. Recalculate supervision compliance for both the departing and receiving BCBAs.

### 6.3 Auth-Boundary and Calendar Edge Cases

**TMPL-004** | WARN | Roles: PM
**Scenario: Recurring template spanning auth boundary**
A weekly recurring schedule should not auto-generate sessions beyond the current auth end date. System behavior:
1. When generating future sessions from a template, check auth end date.
2. Stop generation at auth boundary.
3. If a new auth has been received for the next period, extend generation into the new auth using the new auth's parameters.
4. If new auth parameters differ (codes, hours), the template must be adjusted — do not auto-carry the old template into a new auth.

**TMPL-005** | WARN | Roles: PM
**Scenario: School break auto-pause**
Many ABA clients are school-aged. When school breaks occur, schedules may shift dramatically (from after-school to full-day, or to paused entirely). System should:
1. Support school calendar integration (or manual school break entry).
2. Allow "school break templates" that override the regular recurring template during defined break periods.
3. Auto-swap between school-year and break templates at configured dates.
4. Summer schedule transition: support separate summer recurring template with different days/times/hours.
5. Alert PM 2 weeks before each break to confirm schedule changes.

**TMPL-006** | WARN | Roles: PM
**Scenario: Template collision and deduplication**
If multiple templates are active for the same client (e.g., a regular template and a make-up template), the system must detect and prevent double-booking:
1. Before generating sessions from any template, check for existing sessions on the target dates/times.
2. If collision detected, skip that instance and alert PM.
3. Templates should have a priority order: regular > make-up > supplemental.

**TMPL-007** | BLOCK | Roles: PM
**Scenario: Auth-aware session generation**
When generating sessions from a recurring template, the system must:
1. Track cumulative units being generated.
2. Stop generation when the auth's remaining units would be exceeded.
3. If the last session generated would only be partially covered by remaining auth units, flag it (e.g., auth has 2 units left but session template is for 8 units — system should either truncate or block).
4. Display a summary: "This template would generate X sessions consuming Y units. Auth has Z units remaining. [Proceed / Adjust]"

**TMPL-008** | INFO | Roles: PM
**Scenario: Holiday-aware recurring sessions**
System should maintain a configurable holiday calendar. When generating recurring sessions:
1. Check each generated date against the holiday calendar.
2. If a session falls on a holiday, auto-skip (do not generate).
3. Optionally prompt to schedule a make-up session for skipped holiday dates.
4. Default holidays: major US holidays. Practice should be able to add custom closure dates.
5. Holiday sessions should not count against auth utilization pacing (since they were never scheduled).

---

## Section 7: Place of Service & Telehealth Rules

### 7.1 Place of Service Code Reference

**POS-001** | BLOCK | Roles: BILL, PM
**Rule: POS code requirements for ABA claims**

| POS Code | Description | Common ABA Use | Notes |
|----------|-------------|---------------|-------|
| 02 | Telehealth (off-site) | Remote parent training, BCBA supervision | Patient is not at provider's facility |
| 03 | School | School-based ABA sessions | See TRICARE restrictions |
| 10 | Telehealth (patient home) | Remote sessions where patient is at home | Newer code; some payers still use 02 |
| 11 | Office/Clinic | Center-based ABA | Most common for clinic programs |
| 12 | Home | In-home ABA sessions | Most common for home-based programs |
| 99 | Other | Community-based sessions | Parks, grocery stores, etc. |

System must:
- Require POS code on every session.
- Auto-suggest POS based on session location type in the client profile.
- Validate POS against CPT code eligibility rules.

### 7.2 Telehealth Rules and Restrictions

**POS-002** | BLOCK | Roles: PM, BCBA, RBT
**Rule: TRICARE school-based RBT restriction**
TRICARE ACD specifies: services rendered in a school setting will only be authorized to BCBA ABA supervisors (not RBTs or technicians). System must:
- If client's payer is TRICARE and POS = 03 (school), validate that the rendering provider is a BCBA.
- Block scheduling of RBT sessions at school for TRICARE clients.

**POS-003** | BLOCK | Roles: PM, RBT
**Rule: Texas Medicaid RBT telehealth prohibition**
Texas Medicaid explicitly states: LaBAs (BCaBAs) and RBTs may NOT deliver any service remotely via telehealth. Only LBAs (BCBAs) may deliver telehealth services.
- If client's payer is Texas Medicaid and session is telehealth, validate rendering provider is an LBA/BCBA.
- Block RBT telehealth sessions for Texas Medicaid clients.

**POS-004** | WARN | Roles: PM, BCBA
**Rule: CPT code telehealth eligibility**
Not all ABA CPT codes are eligible for telehealth delivery across all payers. General guidance:
- **Generally telehealth-eligible** (varies by payer): 97151 (assessment), 97155 (protocol modification/supervision), 97156 (parent training), 97157 (group parent training).
- **Generally NOT telehealth-eligible**: 97153 (direct treatment by tech — requires in-person client contact), 97154 (group treatment by tech), 97158 (group treatment by QHP).
- **0362T/0373T**: Require physical presence of multiple providers; not telehealth-eligible.
- System must maintain a payer-specific telehealth eligibility matrix per CPT code and validate at scheduling time.

**POS-005** | WARN | Roles: BCBA, PM
**Rule: Cross-state licensure validation for telehealth**
When a telehealth session is scheduled, both the provider's licensed state and the client's physical location state must be validated:
1. Provider must hold an active license in the state where the client is physically located during the session.
2. System should track provider licensure by state.
3. If a client moves or travels and requests telehealth, system must validate provider licensure in the new state.
4. Some states participate in the Psychology Interjurisdictional Compact (PSYPACT) — but this does NOT apply to behavior analyst licensure, which has no interstate compact as of 2025.

**POS-006** | WARN | Roles: BILL
**Rule: Telehealth modifier requirements — 95 vs. GT vs. FQ**

| Modifier | Meaning | Payer Usage |
|----------|---------|-------------|
| 95 | Synchronous audiovisual telehealth | CMS, most commercial payers, Texas Medicaid (audiovisual) |
| GT | Synchronous telehealth (legacy) | Some legacy payers, being phased out in favor of 95 |
| FQ | Synchronous audio-only | CMS, Texas Medicaid (audio-only, where allowed) |
| 93 | Audio-only (AMA) | Some commercial payers |

System must:
- Auto-apply the correct telehealth modifier based on: (a) payer configuration, (b) delivery modality (audio-visual vs. audio-only).
- Maintain a payer-modifier lookup table.
- Flag if audio-only modifier is used for a code/payer that requires audiovisual.

---

## Section 8: Time & Unit Calculation Edge Cases

### 8.1 CMS 8-Minute Rule

**TIME-001** | BLOCK | Roles: BILL, PM
**Rule: CMS 8-Minute Rule for timed ABA codes**
All ABA CPT codes (97151-97158, 0362T, 0373T) are 15-minute timed codes subject to the 8-minute rule. A provider must deliver at least 8 minutes of direct, face-to-face service to bill one unit. Units are then calculated in 15-minute increments.

**Unit conversion chart (per individual code — AMA/midpoint rule, used by most commercial payers):**

| Minutes | Units |
|---------|-------|
| 0-7 | 0 (not billable) |
| 8-22 | 1 |
| 23-37 | 2 |
| 38-52 | 3 |
| 53-67 | 4 |
| 68-82 | 5 |
| 83-97 | 6 |
| 98-112 | 7 |
| 113-127 | 8 |

**CMS aggregate method** (used for Medicare; some Medicaid plans follow):
- Total all minutes across all timed codes for the day.
- Divide by 15 to get whole units.
- If remainder ≥ 8 minutes, bill one additional unit.
- Assign units to individual codes based on which code has the most remainder minutes.

System must support BOTH calculation methods with a payer-level configuration switch.

**TIME-002** | BLOCK | Roles: BILL
**Rule: 7-minute trap**
If a session runs exactly 7 minutes, it produces 0 billable units. The system must:
1. Flag sessions of < 8 minutes as non-billable.
2. If a provider logs a session at exactly 7 minutes, display a warning: "Session duration of 7 minutes does not meet the 8-minute minimum for billing."
3. Do not auto-round up — the provider must attest to actual service time.

**TIME-003** | WARN | Roles: BILL, BCBA
**Rule: Mixed-code session unit splitting**
When a single encounter involves multiple CPT codes (e.g., BCBA conducts 45 min of 97155 then transitions to 30 min of 97156), the system must:
1. Track time per code separately.
2. Apply the unit calculation method (AMA or CMS) to each code.
3. Under CMS method: aggregate total time (75 min = 5 units), then assign units proportionally to codes with most time. Under AMA method: 45 min of 97155 = 3 units; 30 min of 97156 = 2 units.
4. Never allow total billed time to exceed the actual session duration.
5. Alert if the sum of time entries per code exceeds the session start-to-end time.

### 8.2 Timezone and DST Handling

**TIME-004** | BLOCK | Roles: PM, BCBA
**Rule: Timezone handling for telehealth sessions**
When a telehealth session connects a provider and client in different time zones:
1. Store all session times in UTC internally.
2. Display times in the viewer's local timezone.
3. The date of service for billing purposes is the date in the CLIENT's timezone (where the service is "received").
4. If a session starts at 11:30 PM Eastern for the client but the provider is in Pacific time (8:30 PM), the date of service is the Eastern date.
5. Session duration is absolute — timezone differences do not affect unit calculation.

**TIME-005** | WARN | Roles: PM
**Rule: DST transition edge cases**
When Daylight Saving Time transitions occur (spring forward / fall back):
- **Spring forward**: A 2:00 AM-3:00 AM gap means a session scheduled at 2:30 AM in that timezone doesn't exist. System should detect sessions falling in the DST gap and alert PM.
- **Fall back**: The 1:00 AM-2:00 AM hour repeats. A session at 1:30 AM could be ambiguous. System should store with explicit UTC offset.
- **Recurring sessions**: After DST transition, recurring sessions should maintain the same local clock time (e.g., "3:00 PM every Monday" stays 3:00 PM local time regardless of DST status). System must adjust the UTC time accordingly.
- Most ABA sessions occur during daytime hours (8 AM - 7 PM), making DST gap issues rare but fall-back ambiguity possible for evening sessions.

### 8.3 Scheduled vs. Completed Time

**TIME-006** | WARN | Roles: BILL, BCBA, RBT
**Rule: Scheduled-to-completed time conversion**
A session may be scheduled for 2 hours (8 units of 97153) but actually run for 1 hour 50 minutes (7 units). System must:
1. Support separate "scheduled duration" and "actual duration" fields.
2. Default billing units to actual duration, NOT scheduled duration.
3. If actual duration exceeds scheduled duration, flag for review (may indicate auth overuse or documentation issue).
4. If actual duration is significantly less than scheduled (< 80% of scheduled), flag for review (may indicate early termination, behavior incident, or billing concern).
5. For recurring session reporting, track both scheduled and actual hours for utilization rate calculations.

---

## Section 9: State Medicaid Rules — Top 5 Markets

### 9.1 California (Medi-Cal)

**STATE-CA-001** | BLOCK | Roles: PM, BCBA, BILL
**Medi-Cal ABA Coverage (Behavioral Health Treatment — BHT)**
- Covered under EPSDT for beneficiaries under 21.
- Medi-Cal does NOT require an autism diagnosis for BHT/ABA services — any behavioral condition meeting medical necessity criteria qualifies.
- Services managed through Medi-Cal managed care plans (e.g., Blue Shield Promise, L.A. Care, Health Net).
- Each managed care plan may have its own prior authorization requirements, utilization management criteria, and provider credentialing rules.
- **Provider types**: Licensed Behavior Analyst (LBA), Licensed Assistant Behavior Analyst (LaBA), and RBTs under LBA supervision.
- **Telehealth**: LBAs may deliver telehealth. LaBAs and RBTs may NOT deliver remote services under Medi-Cal.
- **Group size**: Per CPT code descriptor: 2-8 clients for 97154 and 97158. Medi-Cal plans follow this standard.
- **Documentation timing**: Progress notes generally due within 72 hours of service (varies by managed care plan). Treatment plans updated per payer policy or at minimum every 6 months.
- **Scheduling constraint**: No state-specific daily or weekly hour caps beyond auth limits, but some MCOs enforce internal limits (verify per plan).

### 9.2 Texas (Texas Medicaid — THSteps-CCP)

**STATE-TX-001** | BLOCK | Roles: PM, BCBA, BILL, RBT
**Texas Medicaid ABA Coverage**
- ABA services covered under Texas Health Steps Comprehensive Care Program (THSteps-CCP) for recipients ≤ 20 years of age.
- Effective February 1, 2022, ABA became a mandated Medicaid benefit in Texas (50th state to implement).
- **Provider types**: Licensed Behavior Analyst (LBA — equivalent to BCBA), Licensed Assistant Behavior Analyst (LaBA — equivalent to BCaBA), and RBTs.
- **Telehealth prohibition for techs**: LaBAs and RBTs may NOT deliver any service remotely. Only LBAs may use telehealth for eligible codes (97155, 97156, 97158). Audiovisual technology required (audio-only not permitted for ABA).
- **97151 limitation**: Up to 24 units (6 hours) for initial evaluation. Must be used within 30 calendar days of first date of service. For re-evaluations: up to 24 units per re-evaluation period.
- **Concurrent billing restriction**: Texas Medicaid will not reimburse multiple ABA providers during one ABA session with a child when more than one provider bills for the same service at the same time.
- **Prior authorization**: Required for all ABA services. Managed through MCOs (e.g., Superior HealthPlan, Amerigroup, Molina, UHC Community Plan).
- **Documentation**: Treatment plans must include specific units per code, not just hours. Session notes required same-day or within 24 hours (MCO-specific).
- **Modifier requirements**: Specific modifier matrix for QHP vs. technician codes (see CPT-010).

### 9.3 Florida

**STATE-FL-001** | WARN | Roles: PM, BCBA, BILL
**Florida Medicaid ABA Coverage**
- ABA covered under EPSDT through managed care plans (e.g., Sunshine Health, Molina, Aetna Better Health of Florida, Humana Healthy Horizons).
- Florida has a strong autism insurance mandate (FL Stat § 627.6686) with no annual dollar cap and no age limit for commercial plans.
- **Medicaid specifics**: Prior auth required through MCO. Auth periods typically 6 months. Re-auth requires updated treatment plan with progress data.
- **Provider types**: BCBA, BCaBA, and RBTs under BCBA supervision. Florida licenses behavior analysts under Chapter 491, Florida Statutes.
- **Telehealth**: Permitted for eligible codes. Informed consent documentation required. Florida's telehealth laws are relatively permissive.
- **Group size**: Standard CPT limits (2-8 clients).
- **Documentation timing**: Session notes required within 24 hours of service delivery for most MCOs. Treatment plan updates per auth cycle.
- **Scheduling constraint**: No state-specific caps beyond auth limits, but MCOs may impose internal utilization management criteria.

### 9.4 New York

**STATE-NY-001** | WARN | Roles: PM, BCBA, BILL
**New York Medicaid ABA Coverage**
- ABA covered under EPSDT. New York requires prior authorization through Medicaid managed care plans (e.g., Fidelis, Healthfirst, Amerigroup, UHC Community Plan).
- **Provider types**: Licensed Behavior Analyst (LBA) under NY Education Law Article 167. Licensed Behavior Analyst Assistant (LBAA). Behavior technicians must meet state-defined training requirements that may exceed RBT certification alone.
- **State licensing**: NY has its own behavior analyst licensure (separate from BACB certification, though BACB certification is typically a prerequisite). System must track both state license and BACB certification.
- **Telehealth**: Permitted for eligible codes. New York has enacted permanent telehealth parity legislation. Audio-visual required for most behavioral health services.
- **Documentation**: Treatment plans must include measurable goals, planned hours per code, and evidence-based justification. Progress reports typically required every 6 months or per auth cycle.
- **Group size**: Standard CPT limits; some MCOs may impose additional restrictions.
- **Scheduling**: No state-specific daily/weekly caps beyond auth and MUE limits.

### 9.5 Massachusetts

**STATE-MA-001** | WARN | Roles: PM, BCBA, BILL
**Massachusetts Medicaid (MassHealth) ABA Coverage**
- ARICA (Applied Behavior Analysis) mandated for all insurance plans under MA law.
- MassHealth covers ABA under EPSDT with its own utilization management criteria.
- **Provider types**: Licensed Applied Behavior Analyst (LABA) licensed under MA Board of Registration of Allied Health Professionals. Board Certified Assistant Behavior Analysts and RBTs under LABA supervision.
- **Enforcement priority**: Massachusetts Attorney General's Office has identified ABA as an enforcement priority for Medicaid fraud. Heightened documentation and audit risk.
- **Prior auth**: Required through MassHealth or managed care plan. Auth periods and review requirements vary by plan.
- **Telehealth**: Permitted with MA telehealth parity requirements. Informed consent and documentation of delivery modality required.
- **Documentation timing**: Same-day or within 24 hours for session notes. Treatment plans updated at each auth renewal with quantitative progress data.
- **Billing scrutiny**: Given the enforcement focus, system should enforce strict documentation compliance flags — flag any session lacking a completed note within 24 hours, flag any claim submitted without corresponding note, flag any supervision session without documentation.

---

## Section 10: Real-World Scenario Walkthroughs

### Scenario 1: Monday Cancellation Cascade

**SCENE-001** | Severity: N/A (composite) | Roles: All

**Setup**: It's Monday morning. An RBT (Sarah) has 5 clients scheduled back-to-back from 9 AM to 6 PM, each with 2-hour 97153 sessions.

**Event**: Client A (9 AM slot) parent calls at 8:45 AM — child is sick. Late cancel.

**System should**:
1. Record cancellation: Category = CIL (Client Illness), Notice = < 24 hrs → Late Cancel.
2. Update Client A auth pacing: no units consumed but opportunity lost. If weekly-capped auth, those units cannot roll over.
3. Recalculate Sarah's daily hours: 8 hours → 6 hours.
4. Flag Sarah's 9-11 AM slot as available.
5. Check if any other clients on Sarah's caseload have make-up sessions pending → offer to PM.
6. Recalculate Sarah's monthly supervision compliance: her denominator (service hours) decreased, so her supervision % increased slightly.
7. Trigger parent notification confirming cancellation.
8. Increment Client A's rolling cancellation rate. If this puts them at 2 consecutive cancellations, alert BCBA.
9. Check RBT pay policy: if practice pays for 2-hour late cancel, create the pay entry.

**Event escalation**: At 9:30 AM, Client B (11 AM slot) also cancels — parent says they forgot about a doctor's appointment. Late cancel.

**Additional system actions**:
10. Sarah now has 9 AM - 1 PM free. Flag for PM review — 4 consecutive hours of unbillable time.
11. Check if any clients with under-utilized auths have availability for a make-up session in this window.
12. Client B cancellation rate hits "concerning" threshold (15% rolling). Alert BCBA.
13. Recalculate all pacing dashboards.

---

### Scenario 2: RBT Departure with 8 Clients

**SCENE-002** | Severity: N/A (composite) | Roles: PM, BCBA

**Setup**: RBT Marcus gives 2-week notice. He has 8 active clients totaling 32 hours/week of 97153 services.

**System should execute bulk reassignment workflow**:
1. Generate a "departure impact report" listing all affected clients, their auth status, payer, location, schedule, and BCBA.
2. Display available RBTs with: matching payer credentials, geographic proximity to each client, schedule availability, current caseload utilization.
3. Allow PM to draft reassignment plan — drag-and-drop clients to new RBTs.
4. For each reassignment, validate:
   - New RBT has capacity (won't exceed reasonable weekly hours).
   - New RBT is credentialed with the client's payer.
   - No schedule conflicts with new RBT's existing sessions.
   - BCBA supervision mapping is updated.
5. Generate parent notification letters for all affected families.
6. Create transition documentation: Marcus should have overlap sessions with replacement RBTs if possible.
7. After Marcus's last day, deactivate his provider profile (but retain records).
8. Recalculate supervision compliance for all BCBAs whose supervision loads changed.
9. Flag any clients who couldn't be reassigned — these become a waitlist or coverage gap risk.

---

### Scenario 3: Summer Schedule Transition

**SCENE-003** | Severity: N/A (composite) | Roles: PM, BCBA

**Setup**: School year ends June 15. During school year, 12 clients receive ABA after school (3:30-5:30 PM). In summer, parents want morning sessions (9 AM - 12 PM) and some want increased hours.

**System should**:
1. Identify all clients with school-year schedule templates.
2. Allow PM to create "summer templates" for each client with new day/time/duration.
3. Validate summer templates against: auth remaining units, daily MUE limits, provider availability.
4. If any client wants increased hours, check if their auth supports it. If not, flag for additional auth request.
5. Auto-swap from school-year to summer template on June 16.
6. Send reminders to parents 2 weeks before summer transition confirming new schedule.
7. When school resumes (e.g., August 25), auto-swap back to school-year templates.
8. Handle the "partial week" transitions — if school ends mid-week, the template swap should occur on the correct date.
9. Recalculate auth pacing for clients with changed hours.

---

### Scenario 4: Auth Expiry with Future Sessions Booked

**SCENE-004** | Severity: BLOCK | Roles: PM, BILL

**Setup**: Client Jayden has auth expiring March 31. Recurring sessions are generated through April 30. Re-auth request submitted February 15 but not yet approved.

**System should**:
1. At auth creation: prevent session generation beyond March 31 (AUTH-001).
2. Display warning on Jayden's profile: "Authorization expires in X days. Re-auth pending."
3. Sessions April 1-30 should be in "Pending Auth" status — visible on schedule but clearly marked non-billable until auth received.
4. If re-auth is approved with different parameters: auto-adjust April sessions to match new auth codes/hours.
5. If re-auth is denied: cancel all April sessions automatically. Alert BCBA for clinical decision.
6. Track the gap days between auth expiry and new auth start — these sessions cannot be billed retroactively unless the new auth explicitly covers them.
7. If March 31 passes with no re-auth decision: escalate alert to PM and BCBA. Consider peer-to-peer review with payer.

---

### Scenario 5: Holiday Week Schedule

**SCENE-005** | Severity: INFO | Roles: PM

**Setup**: Thanksgiving week. Practice closed Thursday and Friday. Client schedules vary Mon-Fri.

**System should**:
1. Holiday calendar automatically suppresses Thursday and Friday sessions.
2. Monday, Tuesday, Wednesday sessions proceed normally.
3. For clients with Thursday/Friday sessions, check auth pacing: if total-period auth, no action needed (units not lost). If weekly-capped auth, those units may be lost.
4. Some practices offer make-up sessions on Saturday of holiday weeks. System should allow temporary session creation on non-standard days.
5. Provider availability may change for the week — support one-time schedule overrides.
6. RBT weekly hours will be reduced. Recalculate any hourly guarantees or pay implications.
7. Supervision compliance: if a supervision session was scheduled Thursday, it needs to be rescheduled within the month.

---

### Scenario 6: Group Session Drop-Below-Minimum

**SCENE-006** | BLOCK | Roles: BCBA, BILL

**Setup**: A social skills group session (97154) is scheduled with 4 clients. Two clients cancel day-of.

**System should**:
1. Detect that group size has dropped to 2 — still meets minimum (2 clients required for 97154).
2. If one more cancels: group drops to 1 client. System must BLOCK billing as 97154 — a group of 1 is not a group.
3. Options to present to BCBA:
   - Convert to 1:1 session (97153 if tech-delivered, 97155 if QHP-delivered).
   - Cancel the session entirely.
   - Attempt to add another client to restore group size.
4. If converted to 97153: validate that the client's auth covers 97153 (some auths only authorize group codes).
5. Log the code change with reason documentation.
6. If the group regularly drops below minimum, flag pattern for PM — may indicate a group composition problem.

---

### Scenario 7: BCBA Supervision Audit at 3.8%

**SCENE-007** | BLOCK | Roles: BCBA, PM

**Setup**: It's the 25th of the month. RBT Alex has logged 140 service hours this month. His BCBA has provided 5.3 hours of supervision (3.8%). The 5% requirement means he needs 7.0 hours minimum.

**System should**:
1. Dashboard shows Alex in RED status: 3.8% with 4 business days remaining.
2. Calculate gap: needs 1.7 additional supervision hours.
3. Display BCBA's availability for the remaining 4 days.
4. Suggest specific time slots where the BCBA could observe Alex during existing client sessions (counts as 97155 billable AND supervision).
5. If no BCBA availability exists, check if another BCBA (who has Alex listed as a supervisee in their BACB account) has availability.
6. Alert: if the month ends below 5%, Alex's BACB certification compliance is at risk. Document the shortfall and corrective action plan.
7. Check if any group supervision sessions are scheduled — reminder that group supervision cannot exceed 50% of total supervision hours.
8. Project forward: if Alex is likely to continue at this pace, suggest a standing supervision schedule adjustment for next month.

---

### Scenario 8: New Client Onboarding

**SCENE-008** | Severity: N/A (composite) | Roles: PM, BCBA

**Setup**: New client Emma, age 4, referred with ASD diagnosis. Family has UHC commercial insurance.

**System should support this onboarding workflow**:
1. **Eligibility verification**: Check UHC coverage for ABA CPT codes. Verify deductible/copay.
2. **Auth request**: No sessions can be scheduled until auth is obtained. Create auth request workflow.
3. **Auth received**: Auth for 97151 (24 units), 97153 (28 units/week × 26 weeks), 97155 (8 units/week × 26 weeks), 97156 (4 units/month).
4. **Assessment scheduling**: Schedule 97151 assessment sessions. Max 24 units per auth. Must be completed within 30 days (if payer requires).
5. **Treatment plan development**: BCBA completes assessment, develops treatment plan.
6. **Treatment scheduling**: Based on auth, create recurring template:
   - 97153: 28 units/week = ~7 hours/week. Split across 3-4 days per week.
   - 97155: 8 units/week = 2 hours/week of BCBA overlap.
   - 97156: 4 units/month = 1 hour/month parent training.
7. **RBT assignment**: Assign RBT based on availability, payer credentials, geographic match.
8. **Supervision setup**: Link RBT to BCBA as supervisee. Configure supervision tracking.
9. **TRICARE parent training deadline**: If Emma were TRICARE, first parent training (97156/97157) must occur within 30 days of treatment authorization. Minimum 6 parent training sessions per 6-month auth. System must track and alert.

---

### Scenario 9: TRICARE Parent Training Compliance

**SCENE-009** | BLOCK | Roles: BCBA, PM

**Setup**: TRICARE client, auth started January 15. TRICARE requires minimum of one parent training session (97156/97157) within 30 days of auth start, and at least 6 sessions over the 6-month auth period.

**System should**:
1. On auth creation, set milestone: "First parent training due by February 14."
2. Alert BCBA if no 97156/97157 session is scheduled within the first 30 days.
3. Track cumulative parent training sessions against the 6-session minimum.
4. Calculate pacing: 6 sessions over ~26 weeks = approximately 1 session every 4.3 weeks.
5. If parent training sessions are behind pace, alert BCBA.
6. TRICARE also requires: all attempts to mitigate parent/caregiver lack of involvement must be documented.
7. If parent repeatedly misses training: system should log documentation of outreach attempts, alternative scheduling offers, and impact notes.
8. Virtual health (telehealth) for parent training is allowed after the initial 6 months of treatment. For the first 6 months, parent training must be in-person. System must enforce this restriction for TRICARE clients.

---

### Scenario 10: Provider Credential Lapse

**SCENE-010** | BLOCK | Roles: PM, BCBA, RBT, BILL

**Setup**: RBT Jennifer's BACB certification expires on April 30. The system has her credential expiration date on file.

**System should**:
1. Alert PM and Jennifer at 90, 60, 30, and 14 days before expiry.
2. On expiration date: BLOCK Jennifer from being assigned to any new sessions.
3. All sessions scheduled after April 30 must be flagged: "Provider credential expired — cannot render services."
4. Any claims submitted for services rendered after credential expiry will be denied — system must BLOCK claim submission.
5. If Jennifer renews in time (submits proof of renewed certification), reactivate her profile.
6. If renewal is delayed: initiate the departure/reassignment workflow (SCENE-002) as a contingency.
7. Track all provider credentials with expiration dates: BACB certification, state license, CPR/first aid, background check, payer credentialing per payer.
8. Generate a monthly "credentials expiring soon" report for PM.

---

### Scenario 11: Multi-Payer Client (COB Coordination)

**SCENE-011** | WARN | Roles: BILL, PM

**Setup**: Client Marcus has Medicaid (primary) and Dad's employer-sponsored UHC plan (secondary). Both have issued authorizations.

**System should**:
1. Track both auths separately with clear primary/secondary designation.
2. Schedule based on primary auth limits (Medicaid).
3. Submit claims to Medicaid first.
4. For any Medicaid denials or partial payments, auto-queue secondary claim to UHC.
5. Ensure units billed don't exceed either auth.
6. Track COB (Coordination of Benefits) status per client.
7. Alert if one auth expires while the other remains active — service may continue under remaining auth but verify coverage.

---

### Scenario 12: Mid-Session Behavior Crisis Requiring Code Change

**SCENE-012** | WARN | Roles: BCBA, RBT, BILL

**Setup**: An RBT is delivering 97153 (treatment by protocol). 45 minutes into a 2-hour session, the client has a severe behavioral episode. The BCBA is called in and takes over, modifying protocols in real-time with 2 techs present. This becomes a 0373T scenario.

**System should**:
1. Allow session documentation to split a single appointment into multiple CPT code segments.
2. RBT logs: 97153 for first 45 minutes (3 units), then notes "BCBA called in."
3. BCBA logs: 0373T for remaining 75 minutes (5 units) with 2 techs present.
4. Validate that 0373T requires: QHP present, 2 technicians present, client present, protocols being modified for destructive behavior.
5. Verify auth covers 0373T — some auths may not authorize this code.
6. MUE check: total 0373T units for the day don't exceed 32 (Medicaid).

---

### Scenario 13: RBT Works for Two Practices

**SCENE-013** | WARN | Roles: PM, BILL

**Setup**: RBT Devon works part-time at Practice A (Mon-Wed) and Practice B (Thu-Fri). Both practices use Clinivise.

**System should**:
1. Each practice sees only their own sessions for Devon.
2. However, the system should flag potential cross-practice conflicts if Devon is credentialed with the same payers.
3. BACB supervision: Devon needs 5% supervision at EACH practice (or across both, depending on organizational structure). If practices have different supervising BCBAs, each BCBA is responsible for supervision of the hours they oversee.
4. Alert if Devon's combined weekly hours across known schedules approach overtime thresholds.
5. Payer audit risk: if Devon bills 97153 at Practice A until 5 PM and Practice B starting at 5 PM on the same day, a payer could flag overlapping provider time across tax IDs. System should warn about tight transitions.

---

### Scenario 14: Auth Reduction After Concurrent Review

**SCENE-014** | BLOCK | Roles: PM, BCBA

**Setup**: Client Aiden had 30 hours/week of 97153 authorized. At the 3-month concurrent review, the payer reduces authorization to 20 hours/week citing "adequate progress."

**System should**:
1. Accept the updated auth parameters.
2. Compare against existing recurring schedule: 30 hrs/week scheduled but only 20 authorized.
3. Calculate the overage: 10 hours/week of sessions that are no longer authorized.
4. Flag all affected sessions in the next auth period.
5. Generate a schedule adjustment task for the BCBA: decide which sessions to reduce/remove.
6. Present options: reduce session duration across all days, eliminate entire days, reduce certain days.
7. Recalculate supervision requirements based on reduced hours.
8. Recalculate auth pacing based on new total.
9. If BCBA believes the reduction is clinically inappropriate: support documentation for peer-to-peer review or appeal.

---

### Scenario 15: End-of-Year Insurance Transition

**SCENE-015** | BLOCK | Roles: PM, BILL

**Setup**: It's December 15. Client Sophia's family is switching from Cigna to Aetna effective January 1 due to parent's job change.

**System should**:
1. Accept the new payer information with a future effective date.
2. Flag all sessions after January 1 as requiring new payer verification.
3. Check if current providers are credentialed with Aetna.
4. Initiate new authorization request with Aetna (allow 30-45 day lead time).
5. If new auth is not received by January 1: sessions after that date must be blocked or marked "pending auth."
6. Cigna auth remains active for December sessions — no changes to current schedule.
7. If Aetna auth parameters differ from Cigna (different approved hours, codes, or provider types): generate schedule adjustment tasks.
8. Track the transition in client records for billing audit trail.
9. Ensure Cigna claims for December are submitted before any timely filing deadlines.

---

### Scenario 16: Telehealth Session Technical Failure

**SCENE-016** | WARN | Roles: BCBA, BILL

**Setup**: A BCBA is conducting a 97156 parent training session via telehealth. 20 minutes in, the video connection drops and cannot be re-established.

**System should**:
1. Allow the session to be documented with the actual duration (20 minutes = 1 unit, since > 8 min but < 23 min).
2. Support a "session interrupted" status with reason documentation.
3. The provider can attempt to resume via phone, but if the payer requires audiovisual for 97156 and only audio is available, the remaining time may not be billable under the telehealth POS.
4. Allow scheduling of a continuation session to complete the remaining planned content.
5. Flag for the BCBA: document the technical failure in the session note for audit protection.
6. If this client has repeated technical failures, suggest switching to in-person sessions.

---

### Scenario 17: Overlapping Assessment and Treatment During Re-evaluation

**SCENE-017** | WARN | Roles: BCBA, BILL

**Setup**: Client's 6-month re-evaluation is due. The BCBA needs to conduct 97151 (assessment/re-evaluation) while the client is also receiving ongoing 97153 treatment sessions with their RBT.

**System should**:
1. Allow 97151 and 97153 to occur on the same date of service, but NOT at overlapping times.
2. BCBA schedules 97151 assessment block (e.g., 9-11 AM).
3. RBT conducts 97153 treatment (e.g., 1-4 PM). No overlap.
4. Both codes can appear on the same day's claim with separate time entries.
5. Validate that total 97151 units for this re-evaluation period don't exceed auth limits.
6. Some BCBAs conduct "naturalistic assessment" by observing the RBT session — this observation time may count toward 97151 OR 97155, but the BCBA must choose one code per time block (cannot double-bill).
7. System should prevent the same time block from being assigned to both 97151 and 97155.

---

### Scenario 18: Group Session Multi-Client Auth Mismatch

**SCENE-018** | WARN | Roles: BCBA, PM, BILL

**Setup**: A social skills group (97154) has 5 clients enrolled. Client 3 has an auth that covers 97153 and 97155 but NOT 97154.

**System should**:
1. When adding a client to a group session, validate that the client's auth covers the group code.
2. Flag Client 3: "Authorization does not cover 97154. Cannot include in group billing."
3. Options: (a) request auth amendment to add 97154, (b) remove client from group, (c) provide service but do not bill (pro bono — requires practice decision and documentation).
4. If the practice proceeds without billing, track as "non-billable service hours" separately from auth utilization.
5. Alert if this situation recurs — may indicate a systemic auth request issue.

---

## Appendix A: Payer-Specific Quick Reference

| Payer | Key Scheduling Rules |
|-------|---------------------|
| **TRICARE** | 6-month auths; parent training within 30 days of auth start; min 6 parent sessions per auth; school-based RBT prohibited; concurrent billing restricted; 2-year referral cycle; outcome measures required (Vineland-3, SRS-2, PDDBI) |
| **UHC/Optum** | Follow Medicaid MUEs; 97155 and 97156 must be separate and distinct time blocks; modifier requirements per credential level; concurrent 97153/97155 allowed with proper documentation |
| **Texas Medicaid** | RBT/LaBA telehealth prohibited; 97151 within 30 calendar days; no multiple providers billing same service same time; specific modifier matrix |
| **NC Medicaid** | 97153/97155 concurrent billing NOT permitted; weekly units non-rollable; monthly units non-rollable |
| **Anthem** | Has historically restricted 97153/97155 concurrent billing in some states (IN, OH, TX); verify current contract |
| **Cigna** | Verify concurrent ABA + non-ABA therapy restrictions per contract |
| **Medi-Cal (CA)** | No ASD diagnosis required for BHT; managed care plan-specific rules; LaBA/RBT cannot deliver telehealth |
| **MassHealth (MA)** | AG enforcement priority; heightened documentation requirements; strict audit compliance |

---

## Appendix B: Implementation Priority Matrix

| Priority | Items | Rationale |
|----------|-------|-----------|
| **P0 — Launch Blockers** | CPT-001 through CPT-006, AUTH-001, AUTH-005, AUTH-007, SUPV-001, SUPV-002, OVLP-001, OVLP-003, TIME-001, TIME-002, POS-002, POS-003 | Hard blocks preventing billing errors and compliance violations |
| **P1 — High Value** | AUTH-004 (pacing), CANC-001 (taxonomy), CANC-003 (cascade), SUPV-008 (real-time calc), TMPL-001 (discharge), TMPL-003 (provider departure), TMPL-007 (auth-aware gen) | Core scheduling intelligence; prevents revenue leakage |
| **P2 — Competitive Edge** | AUTH-009 (re-auth workflow), CANC-004 (rate monitoring), TMPL-005 (school breaks), TIME-004 (timezone), SCENE workflows | Differentiated features vs. basic PM tools |
| **P3 — Defense in Depth** | State-specific rules (Section 9), payer-specific matrices, CPT-008 (MUE config), SUPV-006 (remote supervision), POS-006 (modifier matrix) | Configurability for multi-state practices |

---

## Appendix C: Data Model Implications

Key entities the scheduling module must support:

1. **Authorization**: payer, client, code, units_approved, units_consumed, units_scheduled, period_start, period_end, cap_type (daily/weekly/period), renewal_status
2. **Session**: client, provider, code, scheduled_start, scheduled_end, actual_start, actual_end, status (scheduled/completed/cancelled/no-show/pending-auth), pos_code, modifiers[], supervision_flag, group_id
3. **RecurringTemplate**: client, provider, code, day_of_week, start_time, duration, effective_start, effective_end, template_type (school-year/summer/break), priority
4. **ProviderCredential**: provider, credential_type (BACB/state_license/payer), credential_id, issue_date, expiry_date, state, status
5. **SupervisionLog**: supervisor, supervisee, date, duration, type (individual/group/observation), is_billable, session_id (if linked to billable session)
6. **CancellationRecord**: session_id, category, initiated_by, notice_hours, auth_impact, pay_impact, make_up_eligible, make_up_session_id
7. **PayerConfig**: payer_id, mue_source (medicare/medicaid/custom), concurrent_billing_rules, telehealth_matrix, modifier_matrix, auth_cap_types, unit_calc_method (ama/cms)

---

*Document Version 1.0 — Generated March 2026*
*Sources: ABA Coding Coalition (abacodes.org), BACB RBT Handbook 2025, CMS NCCI MUE data files, Optum/UHC ABA Reimbursement Policy, TRICARE Autism Care Demonstration guidelines, Texas Medicaid THSteps-CCP ABA billing guidelines, state-specific Medicaid provider manuals (CA, TX, FL, NY, MA).*
