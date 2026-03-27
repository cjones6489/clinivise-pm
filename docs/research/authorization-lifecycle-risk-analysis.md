# Authorization Lifecycle Risk Analysis

Risk and failure mode analysis for ABA authorization management. Covers revenue loss, edge cases, fraud/compliance, data integrity, multi-payer complexity, and system integration failure modes.

---

## 1. Authorization-Related Revenue Loss

### 1.1 Scale of the Problem

OIG audits have exposed massive improper payment volumes in ABA Medicaid programs:

| State     | Improper Payments | Additional Potentially Improper | Sample Period | Source                                                                                                                                                                                                   |
| --------- | ----------------: | ------------------------------: | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Colorado  |            $77.8M |                           $207M | —             | [STAT News](https://www.statnews.com/2026/03/02/hhs-medicaid-audit-finds-autism-therapy-overpayment-colorado/)                                                                                           |
| Indiana   |              $56M |                               — | 2019–2020     | [HHS OIG](https://oig.hhs.gov/reports/all/2024/indiana-made-at-least-56-million-in-improper-fee-for-service-medicaid-payments-for-applied-behavior-analysis-provided-to-children-diagnosed-with-autism/) |
| Maine     |            $45.6M |                               — | —             | [Benesch/JDSupra](https://www.jdsupra.com/legalnews/oig-finds-significant-improper-medicaid-7138475/)                                                                                                    |
| Wisconsin |            $18.5M |                          $94.3M | 2021–2022     | [Benesch/JDSupra](https://www.jdsupra.com/legalnews/oig-finds-significant-improper-medicaid-7138475/)                                                                                                    |

In Indiana, **100% of sampled claims** contained one or more improper or potentially improper claim lines. In Wisconsin, **all 100 sampled enrollee-months** contained problems. These are not edge cases — they are systemic.

### 1.2 Denial Rates and Rework Costs

- National claim denial rate: ~12%. ABA practices handling billing internally see first-pass rates of 70–80%, meaning **20–30% of claims need rework**.
- Up to **25% of behavioral health claims go unpaid or underpaid**.
- Manual claim status inquiries average **24 minutes and cost ~$12 per inquiry**.
- One provider had **$250K+ trapped in claims older than 90 days**.
- Structured denial prevention and appeals improve collections **15–25%**.

### 1.3 Most Common Authorization-Related Denial Reasons

| Denial Code | Meaning                                | Root Cause                                        |
| ----------- | -------------------------------------- | ------------------------------------------------- |
| CO 197      | Pre-certification/authorization absent | Auth not requested before service or auth expired |
| CO 15       | Invalid authorization number           | Auth number mismatch, wrong auth on claim         |
| —           | Units exceed authorized                | Billed more units than auth allows                |
| —           | Service outside authorized date range  | Session date falls outside auth effective period  |
| —           | Provider not listed on authorization   | Rendering provider not credentialed on the auth   |
| —           | CPT code mismatch                      | Billed code differs from authorized code          |

**Risk: Authorization-related revenue leakage**

- Severity: **Critical**
- Likelihood: **High**
- Mitigation: Real-time unit tracking with hard stops at 100%, automated renewal alerts starting 30 days before expiration, claim-level auth validation before submission, and auth-scheduling integration that blocks booking when units are exhausted.

---

## 2. Edge Cases in Authorization Tracking

### 2.1 Concurrent Session Logging (Race Condition)

**Scenario:** Two RBTs log sessions against the same authorization simultaneously. Both read `used_units = 80` (approved = 100), both add 8 units. Expected result: 96 units. Possible result with read-modify-write: 88 units (lost update).

- Severity: **Critical**
- Likelihood: **Medium** (more likely in group settings, overlapping schedules, or mobile app usage with poor connectivity)
- Mitigation: **Atomic SQL increments only** (`SET used_units = used_units + N`). Never read-modify-write. Use PostgreSQL's `UPDATE ... RETURNING` to get the post-increment value in the same statement. At READ COMMITTED isolation (Postgres default), the atomic increment is safe because the second transaction will wait for the first's row lock and then see the committed value.

### 2.2 Session on Authorization Expiry Date

**Scenario:** Authorization expires March 31. A 2-hour session is scheduled for March 31. Is the session billable?

- Services rendered **on or before** the expiration date are typically covered. The authorization end date is inclusive.
- Services rendered **after** expiration are denied unless a new auth is in place or retroactive approval is obtained.
- The edge case: a session that starts at 4 PM on March 31 and ends at 6 PM on March 31 is fine. A session that starts at 11 PM on March 31 and ends at 1 AM on April 1 — the April 1 portion may be denied.

- Severity: **High**
- Likelihood: **Medium**
- Mitigation: Validate session date against auth date range at time of session creation and conversion. Flag sessions scheduled within 7 days of auth expiry. For sessions on the expiry date itself, display a prominent warning. The system should use the **service date** (not session creation date) for auth matching.

### 2.3 Authorization Gap (Services During Lapse)

**Scenario:** Authorization expires March 31. Renewal approved April 15. Services delivered April 1–14 have no active authorization.

- Most payers **will not reimburse** services delivered during an auth gap unless retroactive approval is granted.
- Some payers allow retroactive authorization requests up to **90 days from eligibility determination**, with robust clinical justification.
- Policy varies significantly by payer (Aetna, UHC, state Medicaid programs all differ).

- Severity: **Critical**
- Likelihood: **High** (15–20% of renewal requests require appeals before approval — delays are routine)
- Mitigation: Automated renewal alerts at 30/14/7 days before expiry. Track renewal request status (`pending`, `approved`, `denied`, `appealed`). When no active auth exists, the system should: (1) warn at scheduling time, (2) allow the session to be logged with a `pending_authorization` flag, (3) hold the session from claim submission until auth is confirmed, (4) surface a dashboard alert for all clients in auth gap status. Support retroactive auth matching when approval arrives.

### 2.4 Retroactive Authorization

**Scenario:** Provider delivers services for 2 weeks, then submits an authorization request. Payer approves retroactively with an effective date covering those 2 weeks.

- Some payers accept this; many do not.
- When accepted, the auth effective date will cover the already-delivered services.
- The system must be able to **backfill auth assignment** — link previously logged sessions to the newly approved auth and decrement units accordingly.

- Severity: **High**
- Likelihood: **Medium**
- Mitigation: Allow auth creation with a past effective date. When a retroactive auth is created, run a reconciliation query: find all sessions for that client + CPT code(s) in the auth date range that currently have no auth assignment, and prompt the user to link them. Recalculate `used_units` from scratch based on linked sessions (source-of-truth reconciliation, not incremental).

### 2.5 Split Sessions Across Authorization Service Lines

**Scenario:** A 2-hour session includes 60 min of 97153 (adaptive behavior treatment) + 60 min of 97155 (adaptive behavior treatment with protocol modification by BCBA). These may draw from different authorization service lines with separate unit pools.

- Each CPT code's units must be decremented from its **own** auth service line.
- A single session log may produce **multiple** auth service line decrements.
- If one service line has remaining units but another is exhausted, the session is partially billable.

- Severity: **High**
- Likelihood: **High** (split-code sessions are standard practice in ABA)
- Mitigation: Model sessions with a **session_services** join table (one row per CPT code per session). Each session_service links to a specific `authorization_service` row. Decrement units per service line independently. Validate available units per service line before session creation.

### 2.6 Overlapping Authorizations

**Scenario:** Client has Auth A (expires April 30, 200 units of 97153) and Auth B (starts April 1, 300 units of 97153). From April 1–30, both auths are active for the same service.

- Payer rules vary. Common approaches: use the **oldest expiring** auth first (FIFO), or allow manual selection.
- If FIFO is enforced automatically, the system must handle the transition when Auth A is exhausted mid-period.
- Billing the wrong auth number on a claim leads to denial (CO 15).

- Severity: **High**
- Likelihood: **Medium** (occurs during renewal overlap periods)
- Mitigation: Default to FIFO (oldest expiration first) with manual override capability. When multiple active auths exist for the same client + CPT code + date, display all options and auto-select FIFO. Store the selected auth on each session record. When generating claims, pull the auth number from the session's linked authorization.

---

## 3. Authorization Fraud and Compliance Risks

### 3.1 Billing Beyond Authorized Units

**Question:** Is billing beyond authorized units fraud or error?

**Answer:** It depends on intent and pattern, but regardless of classification, it results in denied claims and potential recoupment.

- **Error**: Single instances due to tracking failures. Still triggers denial and possible audit.
- **Fraud indicator**: Pattern of billing beyond authorized units across multiple clients, especially combined with missing documentation. OIG auditors specifically look for "impossible days" (billing more units than can be delivered in 24 hours).
- Medically Unlikely Edits (MUEs) set maximum daily units: **97153 = 32 units (8 hours)**, **97155 = 24 units (6 hours)**.

- Severity: **Critical**
- Likelihood: **Medium**
- Mitigation: Hard enforcement at 100% utilization — block session logging when auth units are exhausted (with admin override + documented reason). MUE validation at session entry (flag sessions exceeding daily per-code limits). Weekly utilization reports surfacing any client at >95% utilization.

### 3.2 Documentation Requirements to Survive Audit

Per OIG findings and payer guidelines, surviving an audit requires:

1. **Active authorization** with matching dates, CPT codes, and provider
2. **ASD diagnosis** within 3 years using a standardized assessment tool
3. **Treatment plan** updated every 6 months with measurable goals, supervision ratios, session frequency
4. **Session notes** with: patient identifiers, authorization details, diagnosis, rendering + supervising provider, service date, start/stop times, total minutes/units, place of service, goals addressed, clinical interventions, data on target behaviors, caregiver involvement when billed, and signatures per payer policy
5. **Contemporaneous documentation** — notes written at time of service, not retroactively
6. **Clear connection** between services billed and treatment plan goals

**Risk: Audit failure due to documentation gaps**

- Severity: **Critical**
- Likelihood: **High** (OIG found 100% of sampled claims had deficiencies in multiple states)
- Mitigation: Session logging form that requires all audit-critical fields before submission. Auto-populate authorization details, provider info, and diagnosis from the client record. Enforce start/stop time entry. Generate compliance reports showing documentation completeness rates. Flag sessions missing required fields.

### 3.3 Fraudulent Patterns the System Should Detect

| Pattern          | Description                                         | Detection Method                                       |
| ---------------- | --------------------------------------------------- | ------------------------------------------------------ |
| Impossible days  | >8 hours of direct service per provider per day     | Daily unit sum per provider                            |
| Phantom sessions | Sessions logged when provider was off-site          | GPS/location check (Phase 2), schedule cross-reference |
| Upcoding         | Billing 97155 (BCBA) when 97153 (RBT) was delivered | Provider credential check against billed CPT code      |
| Unbundling       | Splitting a single service into multiple codes      | NCCI edit validation                                   |
| Over-utilization | Consistently billing at or above authorized units   | Utilization trend analysis per client                  |

- Severity: **Critical**
- Likelihood: **Low** (for intentional fraud in small practices), **Medium** (for unintentional patterns)
- Mitigation: Built-in compliance checks that flag anomalies before claim submission. Not accusatory — positioned as "billing hygiene" that protects the practice.

---

## 4. Data Integrity Risks in Authorization Tracking

### 4.1 Unit Count Drift

**Problem:** Over time, `used_units` on an authorization service line may drift from the actual sum of linked session units due to: edited sessions, deleted sessions, failed transactions, or manual corrections.

- Severity: **Critical**
- Likelihood: **Medium**
- Mitigation strategy — **dual approach**:
  1. **Atomic increments for real-time**: `UPDATE authorization_services SET used_units = used_units + N WHERE id = ?` on session creation. `SET used_units = used_units - N` on session deletion/edit.
  2. **Periodic reconciliation for drift correction**: A background job that recalculates `used_units = SUM(units) FROM session_services WHERE authorization_service_id = ?` and compares to the stored counter. Log discrepancies. Auto-correct if the delta is small; alert admin if large.

### 4.2 Session Edit After Units Were Decremented

**Scenario:** RBT logs a session for 4 units of 97153. Auth decrements by 4. Later, BCBA edits the session to 3 units (correcting a mistake). The system must decrement by 1.

- The edit operation must: (1) calculate the delta between old and new units, (2) apply the delta atomically to the auth service line, (3) record the edit in an audit trail.
- If the session's auth assignment changes (e.g., moved from Auth A to Auth B), both auths must be updated: +N to Auth A, -N to Auth B.

- Severity: **High**
- Likelihood: **High** (session edits are routine — correcting times, codes, units)
- Mitigation: Implement session edits as a transactional operation:
  ```
  BEGIN;
  -- Read old session_service values
  -- Calculate delta per auth service line
  -- UPDATE authorization_services SET used_units = used_units + delta
  -- UPDATE session_services with new values
  -- INSERT audit_log entry
  COMMIT;
  ```
  Use `SELECT ... FOR UPDATE` on the authorization_service row to prevent concurrent modification during the edit transaction.

### 4.3 Session Deletion After Units Were Decremented

**Scenario:** Session is logged (units decremented), then soft-deleted. Units must be restored.

- Severity: **High**
- Likelihood: **Medium**
- Mitigation: Soft-delete the session and atomically increment the auth service line by the session's units (`used_units = used_units - N`). Never hard-delete sessions. The audit trail must capture the deletion reason. The reconciliation job (4.1) serves as a safety net.

### 4.4 Failed Transaction Leaves Partial State

**Scenario:** Session is inserted into the database, but the `used_units` increment fails (or vice versa) due to a transaction boundary error, network issue, or application crash.

- Severity: **Critical**
- Likelihood: **Low** (with proper transaction boundaries), **Medium** (without)
- Mitigation: **Both operations must be in the same database transaction.** Session insert + auth unit increment = single `BEGIN...COMMIT`. If either fails, both roll back. This is non-negotiable. The reconciliation job (4.1) catches any edge cases that slip through.

### 4.5 Negative or Impossible Unit Values

**Scenario:** A bug or race condition causes `used_units` to go negative, or to exceed `approved_units` without the system catching it.

- Severity: **High**
- Likelihood: **Low**
- Mitigation: Database-level `CHECK` constraint: `used_units >= 0`. Application-level validation before decrement: `SELECT used_units, approved_units FROM authorization_services WHERE id = ? FOR UPDATE`, then verify `used_units + N <= approved_units` before incrementing (or allow with explicit override + audit entry). The `FOR UPDATE` lock prevents concurrent transactions from both passing the check.

---

## 5. Multi-Payer Complexity

### 5.1 Dual Insurance and Separate Authorizations

**Scenario:** Client has primary (Blue Cross) and secondary (Medicaid) insurance. Both may require separate prior authorizations.

- **Primary insurance** processes claims first. Authorization from primary must be obtained and tracked.
- **Secondary insurance** processes the remainder after primary EOB is received. May or may not require its own authorization.
- The Birthday Rule determines primary coverage for children (parent with earliest calendar birthday = primary plan).
- Job vs. COBRA/retiree: plan from current job pays first.

- Severity: **High**
- Likelihood: **Medium** (many ABA clients have Medicaid as secondary)
- Mitigation: Support multiple insurance records per client with primary/secondary designation. Support multiple authorizations per client per date range (from different payers). Track which auth maps to which payer. When generating claims, use the correct auth number for the target payer. The system must support the "bill primary, receive EOB, bill secondary" workflow.

### 5.2 Coordination of Benefits (COB) Impact on Auth Tracking

- Units consumed count against **both** payers' authorizations (if both require them), even though only one pays per unit.
- If primary denies a claim, the units were still delivered — the question is whether to decrement the secondary auth or bill the secondary separately.
- Some secondary payers have their own unit limits that differ from primary.

- Severity: **Medium**
- Likelihood: **Medium**
- Mitigation: Track auth utilization per-payer independently. A single session may decrement units from both a primary and secondary auth. Display both utilization levels on the client dashboard. Alert when either auth is approaching exhaustion.

### 5.3 Payer-Specific Authorization Rules

Different payers have different:

- Auth duration periods (3 months, 6 months, 1 year)
- Unit calculation methods (CMS 8-minute rule for Medicare/Medicaid vs. AMA per-code for commercial)
- Re-authorization timelines and documentation requirements
- MUE enforcement (some enforce strictly, some don't)
- Retroactive auth policies (0 days to 90 days)

- Severity: **Medium**
- Likelihood: **High**
- Mitigation: Store payer-specific configuration: `unit_calculation_method` (CMS vs AMA), `auth_renewal_lead_days`, `retroactive_auth_allowed`, `mue_enforcement`. Default to conservative settings. Allow practice admin to configure per-payer rules.

---

## 6. Failure Modes at System Integration Points

### 6.1 Scheduling a Session When Auth Is About to Expire

**Scenario:** Scheduler books a session for April 2. Auth expires April 1. Claim will be denied.

- Severity: **High**
- Likelihood: **High**
- Mitigation: At scheduling time, validate the session date against active authorization date ranges. If no active auth covers the date: (1) show a warning, (2) check if a renewal is pending, (3) allow scheduling with a `no_active_auth` flag, (4) surface in a dashboard alert. Never silently allow scheduling without auth coverage.

### 6.2 Submitting a Claim with Wrong or Expired Auth Number

**Scenario:** Claim is generated with an auth number that doesn't match the payer's records (wrong number, expired, or for different CPT code). Result: CO 15 or CO 197 denial.

- Severity: **High**
- Likelihood: **Medium**
- Mitigation: Pre-submission claim validation:
  - Auth number is populated (not null/empty)
  - Auth date range covers the service date
  - Auth CPT code matches the billed CPT code
  - Auth has remaining units >= billed units
  - Auth payer matches the claim payer
  - Auth status is `approved` (not `pending`, `expired`, `denied`)
    Block claim submission if any validation fails. Generate a "claims hold" report for claims that can't be submitted.

### 6.3 Payer Retroactively Revokes an Authorization

**Scenario:** Payer approves auth in January. Services delivered January–March. In April, payer revokes the auth (eligibility terminated, policy change, audit finding). Payer demands recoupment of all paid claims under that auth.

- Health plans typically have **2 years** from the original claim payment date to recoup, unless fraud is suspected.
- Patients may be left legally responsible for the bill (the "retrospective denial" problem).
- Provider must either appeal, negotiate, or absorb the loss.

- Severity: **Critical**
- Likelihood: **Low**
- Mitigation: Track auth status changes over time (maintain a status history: `approved` -> `revoked`, with timestamp and reason). When an auth is revoked, automatically flag all claims submitted under that auth. Generate a financial exposure report (total paid claims at risk of recoupment). Support the appeal workflow with documentation assembly.

### 6.4 Auth Data Entry Errors

**Scenario:** Staff enters the auth number, dates, or approved units incorrectly when creating the authorization in the system. All downstream operations (session linking, claim generation) use incorrect data.

- Severity: **High**
- Likelihood: **High** (manual data entry from payer letters/faxes/portals)
- Mitigation: AI-powered auth letter parsing (Phase 1 feature) to extract auth data automatically with confidence scores. Human review required for low-confidence extractions. Support for auth verification against payer portals (Phase 2). Edit audit trail on all auth fields. Validation rules: date range must be positive, approved units must be > 0, CPT code must be valid.

### 6.5 System Downtime During Session Logging

**Scenario:** Provider completes a session but can't log it due to system downtime. They log it later (possibly the next day). The auth may have expired between session and logging.

- Severity: **Medium**
- Likelihood: **Low**
- Mitigation: Use the **service date** (when the session actually occurred), not the logging date, for auth matching. Support offline session creation with later sync. Validate auth coverage against service date, not creation timestamp.

### 6.6 Auth Renewal Timing Mismatch

**Scenario:** Practice submits renewal request 30 days before expiry (per best practice). Payer takes 45 days to respond. Result: 15-day gap with no active auth.

- Severity: **High**
- Likelihood: **High** (payer delays are the norm, not the exception — 15–20% of requests require appeals)
- Mitigation: Track renewal request submission date and status. Surface auth renewal pipeline in dashboard: `renewal_submitted`, `under_review`, `info_requested`, `approved`, `denied`. If auth expires while renewal is pending, trigger escalation workflow. Allow session logging with `pending_renewal` status. Hold claims until renewal is confirmed. If renewal is approved retroactively, bulk-update held sessions and release claims.

---

## Summary Risk Matrix

| #   | Risk                                                                  | Severity | Likelihood | Category       |
| --- | --------------------------------------------------------------------- | -------- | ---------- | -------------- |
| 1   | Revenue loss from auth-related denials                                | Critical | High       | Revenue        |
| 2   | Concurrent session race condition (lost updates)                      | Critical | Medium     | Data Integrity |
| 3   | Authorization gap — services without active auth                      | Critical | High       | Edge Case      |
| 4   | Billing beyond authorized units                                       | Critical | Medium     | Compliance     |
| 5   | Failed transaction leaves partial state (session without unit update) | Critical | Low        | Data Integrity |
| 6   | Payer retroactive auth revocation / recoupment                        | Critical | Low        | Integration    |
| 7   | OIG audit failure due to documentation gaps                           | Critical | High       | Compliance     |
| 8   | Unit count drift from reality over time                               | Critical | Medium     | Data Integrity |
| 9   | Session on authorization expiry date                                  | High     | Medium     | Edge Case      |
| 10  | Retroactive authorization backfill                                    | High     | Medium     | Edge Case      |
| 11  | Split sessions across multiple auth service lines                     | High     | High       | Edge Case      |
| 12  | Overlapping authorizations for same service                           | High     | Medium     | Edge Case      |
| 13  | Session edit/delete after units decremented                           | High     | High       | Data Integrity |
| 14  | Negative or impossible unit values                                    | High     | Low        | Data Integrity |
| 15  | Dual insurance with separate authorizations                           | High     | Medium     | Multi-Payer    |
| 16  | Scheduling session when auth about to expire                          | High     | High       | Integration    |
| 17  | Claim submission with wrong/expired auth number                       | High     | Medium     | Integration    |
| 18  | Auth data entry errors                                                | High     | High       | Integration    |
| 19  | Auth renewal timing mismatch (payer delay)                            | High     | High       | Integration    |
| 20  | Payer-specific authorization rules                                    | Medium   | High       | Multi-Payer    |
| 21  | COB impact on auth tracking                                           | Medium   | Medium     | Multi-Payer    |
| 22  | System downtime during session logging                                | Medium   | Low        | Integration    |

---

## Architectural Recommendations for Clinivise

Based on this analysis, the authorization subsystem should implement:

1. **Atomic unit tracking**: All unit increments/decrements via SQL `SET used_units = used_units + N` within the same transaction as the session insert/update/delete. Never read-modify-write.

2. **Periodic reconciliation job**: Recalculate `used_units` from `SUM(session_services.units)` and compare to stored counter. Log and alert on discrepancies.

3. **Database-level constraints**: `CHECK (used_units >= 0)` on `authorization_services`. Foreign key integrity between sessions, session_services, and authorization_services.

4. **Transactional session operations**: Session create, edit, and delete must be wrapped in a single transaction that includes both the session mutation and the auth unit adjustment.

5. **Auth-scheduling integration**: Validate auth coverage at scheduling time. Warn (don't block) when no active auth exists — the session may be covered by a pending renewal or retroactive auth.

6. **Multi-status session model**: Sessions should carry an auth status: `authorized`, `pending_authorization`, `no_authorization`, `retroactively_authorized`. Only `authorized` sessions should be eligible for claim submission.

7. **Pre-submission claim validation**: Validate auth number, date range, CPT code match, remaining units, payer match, and auth status before any claim is generated.

8. **Auth lifecycle state machine**: `pending` -> `approved` -> `active` -> `expiring_soon` -> `expired` (happy path), with branches for `denied`, `revoked`, `renewal_pending`. Track all state transitions with timestamps.

9. **Alert system with escalation**: 80% utilization warning, 95% critical, 100% hard stop (with override). Auth expiry alerts at 30/14/7 days. Auth gap alerts. Under-utilization alerts (<50% used with >50% of period elapsed).

10. **Audit trail on everything**: Every unit change, session edit, auth status change, and override must be logged with who, what, when, why, and which org.

---

## Sources

- [Federal Medicaid audit finds massive overpayment for autism therapy in Colorado | STAT](https://www.statnews.com/2026/03/02/hhs-medicaid-audit-finds-autism-therapy-overpayment-colorado/)
- [HHS-OIG Audits Indiana & Wisconsin Autism Programs | MI Health Freedom](https://mihealthfreedom.org/community/medicaid/hhs-oig-audits-indiana-finds-75-million-in-improper-payments/)
- [Colorado Busted For $78 Million Autism Therapy Blunder | Hoodline](https://hoodline.com/2026/03/colorado-busted-for-78-million-autism-therapy-blunder-as-feds-demand-cash-back/)
- [OIG Finds Significant Improper Medicaid Payments for ABA Services | Benesch/JDSupra](https://www.jdsupra.com/legalnews/oig-finds-significant-improper-medicaid-7138475/)
- [ABA Medicaid Audits Are Escalating: Lessons from the $56M OIG Report | BillingParadise](https://www.billingparadise.com/blog/aba-audit-readiness/)
- [Indiana OIG Report | HHS OIG](https://oig.hhs.gov/reports/all/2024/indiana-made-at-least-56-million-in-improper-fee-for-service-medicaid-payments-for-applied-behavior-analysis-provided-to-children-diagnosed-with-autism/)
- [ABA Prior Authorization Checklist | MBW RCM](https://www.mbwrcm.com/the-revenue-cycle-blog/aba-prior-authorization-checklist)
- [How ABA Prior Authorization Delays Disrupt Revenue Stability | AnnexMed](https://annexmed.com/aba-prior-authorization-delays-revenue-stability)
- [ABA Authorization Management: 6 Challenges | CentralReach](https://centralreach.com/blog/aba-authorization-management-6-challenges-organizations-face/)
- [Mitigate Risks of Overutilized Authorization | CentralReach](https://centralreach.com/blog/mitigating-risks-associated-with-over-utilized-authorizations-in-aba-practices/)
- [Billing Ethics and Pitfalls for ABA Providers | Links ABA](https://linksaba.com/billing-ethics-and-pitfalls-for-aba-providers/)
- [FWA Insights: Catching inappropriate billing within ASD services | Cotiviti](https://resources.cotiviti.com/fraud-waste-and-abuse/fwa-insights-catching-inappropriate-billing-within-asd-services)
- [How to Identify and Prevent Fraudulent in ABA Billing | Cube Therapy](https://www.cubetherapybilling.com/how-to-identify-and-prevent-fraudulent-in-aba-billing)
- [Preventing Insurance Denials Based on Misuse of MUEs | PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12209054/)
- [BCBA Authorization Gap Documentation Guide | Praxis Notes](https://www.praxisnotes.com/resources/bcba-authorization-gap-guide)
- [Coordination of Benefits Impacts Billing for ABA Services | Wayfinder RCM](https://www.wayfinderrcm.com/blog/how-coordination-of-benefits-impacts-billing-for-aba-services)
- [How to Bill Secondary Insurance for ABA Services | BellMedEx](https://bellmedex.com/how-to-bill-secondary-insurance-for-aba-services/)
- [Coordination Of Benefits In ABA Therapy | Operant Billing](https://operantbilling.com/coordination-of-benefits-in-aba-therapy-what-is-it-why-its-important/)
- [CO-197 Denial Code Guide | MedSoler RCM](https://medsolercm.com/blog/co-197-denial-code-guide)
- [CO 197 Denial Code | RCM Guide](https://www.rcmguide.com/co-197-denial-code-precertification-authorization-notification-absent/)
- [Authorization Denials in Healthcare Billing | Avenue Billing](https://avenuebillingservices.com/authorization-related-denials-in-medical-billing/)
- [Patients Stuck With Bills After Insurers Don't Pay As Promised | KFF Health News](https://kffhealthnews.org/news/prior-authorization-revoked-patients-stuck-with-bills-after-insurers-dont-pay-as-promised/)
- [Retro Authorization in Medical Billing | Outsource Strategies](https://www.outsourcestrategies.com/blog/retro-authorization-in-medical-billing/)
- [Avoiding OIG Audits: ABA Documentation and Coding Compliance | Cube Therapy](https://www.cubetherapybilling.com/avoiding-oig-audits-aba-medicaid-documentation-and-coding-compliance)
- [BCBA Audit Documentation Checklist | Praxis Notes](https://www.praxisnotes.com/resources/bcba-audit-documentation-checklist)
- [Medically Unlikely Edits for ABA | ABA Billing Codes](https://www.ababillingcodes.com/resources/medically-unlikely-edits/)
- [What Are MUEs for ABA Billing | Operant Billing](https://operantbilling.com/what-are-medically-unlikely-edits-mue-for-aba-billing/)
- [Heightened Scrutiny Of Medicaid-Funded ABA Services | Benesch](https://www.beneschlaw.com/insight/heightened-scrutiny-of-medicaid-funded-aba-services-key-takeaways-for-providers/)
- [Revenue Cycle Management for ABA Therapy | Your Missing Piece](https://yourmissingpiece.com/resources/revenue-cycle-management-rcm-for-aba-therapy-the-complete-guide/)
- [ABA Billing Metrics Every Practice Should Track | Operant Billing](https://operantbilling.com/what-are-the-essential-billing-metrics-every-aba-practice-should-track/)
- [Keeping ABA Clinics Profitable in 2025 | Your Missing Piece](https://yourmissingpiece.com/resources/how-aba-clinics-can-navigate-revenue-risks/)
