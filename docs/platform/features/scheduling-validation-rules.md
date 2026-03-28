# Scheduling Validation Rules — Complete Reference

> **Purpose:** Single authoritative reference for every validation rule in the scheduling engine.
> Engineers: implement from this doc. Designers: reference for error/warning message copy.
> Product: reference for override policy and audit requirements.
>
> **Last updated:** 2026-03-28
> **Source decisions:** CEO plan E1-E28, D1-D23, Validation Philosophy Amendment

---

## Validation Philosophy

Only CPT **code definitions** are universal. Everything else is AMA/ABA Coding Coalition
guidance that payers can override. The system uses three tiers:

- **Tier 1 HARD BLOCK** — Prevents session creation. Admin override available on most (with reason + audit log).
- **Tier 2 WARNING** — Allows creation with acknowledgment. Configurable per payer via "save as payer rule."
- **Tier 3 INFORMATIONAL** — Display-only context. No action required.

### Override Policy

- **Overridable blocks:** Admin or Owner role can override with a required `override_reason` text field. Override is logged to audit trail: who, when, which rule, why.
- **Non-overridable blocks:** Cannot be bypassed by any role. These are definitional impossibilities or credential violations with no valid exception.

---

## Tier 1 — Hard Blocks (9 rules)

### HB-001: Same Provider Overlapping 1:1 Sessions
- **Rule:** A single provider cannot be scheduled for two 1:1 sessions at overlapping times.
- **Why:** A person cannot be face-to-face with two clients simultaneously.
- **Exemptions:** Group codes (97154, 97157, 97158) are exempt — one provider serves multiple clients.
- **Admin override:** Yes (edge case: provider on telehealth + in-person simultaneously)
- **Audit log:** Required — `override_reason` field
- **User message:** "Provider [Name] already has a session from [time]-[time] with [Client]. Cannot schedule overlapping 1:1 sessions."
- **Implementation:** `checkSessionOverlap()` — must run INSIDE transaction to prevent race conditions
- **Code reference:** `src/server/actions/sessions.ts` (existing), plan decision E16
- **Source:** EC-001, OVLP-001

### HB-002: Same Client Overlapping Incompatible Sessions
- **Rule:** A single client cannot be in two sessions at overlapping times UNLESS the code pair is explicitly exempted.
- **Why:** A child cannot be in two places at once.
- **Allowed concurrent pairs (different providers required):**
  - 97153/97154 + 97155 (RBT has child, BCBA supervises/directs)
  - 97153/97154 + 97156/97157 (RBT has child, BCBA trains parent — child NOT present in parent session)
  - 0362T/0373T + 97155 (QHP directing tech during destructive behavior treatment)
- **Blocked combinations:**
  - Two 97153 sessions (two RBTs can't both have the same child 1:1)
  - 97153 + 97154 (child can't be in individual AND group simultaneously)
  - Two 97154 sessions (child can't be in two groups simultaneously)
  - Any pair involving same provider (always blocked by HB-001)
- **Admin override:** Yes (payer may allow unusual concurrent pairs)
- **Audit log:** Required
- **User message:** "[Client] already has a [code] session from [time]-[time]. [Code]+[Code] cannot overlap for the same client."
- **Implementation:** `checkClientOverlap()` — new function, must run INSIDE transaction
- **Code reference:** Plan decision E16
- **Source:** EC-009, CPT-001, OVLP-003, adversarial review

### HB-003: RBT Billing QHP-Only Codes
- **Rule:** Providers with RBT credential cannot bill 97155, 97156, 97157, or 97158.
- **Why:** These codes require a Qualified Healthcare Professional (BCBA/BCaBA) by CPT definition.
- **Admin override:** **NO** — never valid. No payer exception exists.
- **User message:** "RBTs cannot bill [code]. This code requires a BCBA or BCaBA provider."
- **Implementation:** `validateCptCredential()` (existing)
- **Code reference:** `src/server/actions/sessions.ts`, `QHP_ONLY_CPT_CODES` in constants
- **Source:** EC-002

### HB-004: Same Provider Billing 97153+97155 Simultaneously
- **Rule:** A single provider cannot bill both 97153 and 97155 for overlapping time on the same client.
- **Why:** 97153 describes a technician following protocol. 97155 describes a QHP modifying protocol. These are different roles by definition — one person cannot be both simultaneously.
- **Admin override:** Yes (rare payer interpretations may differ)
- **Audit log:** Required
- **User message:** "A single provider cannot bill both 97153 and 97155 for overlapping time. These codes require different providers (technician + QHP)."
- **Implementation:** Caught by HB-001 (same provider overlap). Specific message enhancement needed.
- **Source:** EC-008, CPT-001

### HB-005: Group Codes Require 2-8 Clients
- **Rule:** Sessions billed as 97154 or 97158 must have 2-8 clients assigned.
- **Why:** CPT defines "group" as 2-8 participants. A group of 1 is not a group.
- **Sub-rule:** A provider cannot lead two separate group sessions simultaneously (E24 fix).
- **Admin override:** Yes (practice may run a group of 9 with documentation)
- **Audit log:** Required
- **User message:** "Group code [97154/97158] requires 2-8 clients. Currently [N] client(s) assigned."
- **MVP scope:** Validate group size and provider overlap. Block creation of 97154/97158 with <2 clients. Block provider leading two simultaneous groups.
- **Group creation flow, lifecycle, and templates:** Deferred to separate feature spec (`docs/platform/features/group-sessions.md`). Includes multi-client select, group roster popover, mid-session size changes, per-client completion. See CEO plan deferred section.
- **Implementation:** E24 (group validation). Group-specific E29-E31 and D24-D26 moved to group sessions feature.
- **Source:** CPT-005, CPT-006, OVLP-002, SCENE-006

### HB-006: 97158 Must Be QHP-Delivered
- **Rule:** 97158 (group treatment with protocol modification) must be rendered by a BCBA/BCaBA.
- **Why:** Code definition requires QHP.
- **Admin override:** **NO** — never valid. Same logic as HB-003.
- **User message:** "97158 requires a BCBA or BCaBA provider. [Provider] is an RBT."
- **Implementation:** Covered by HB-003 (97158 is in QHP_ONLY_CPT_CODES)
- **Source:** CPT-006

### HB-007: Auth Utilization Cannot Exceed 100%
- **Rule:** Projected utilization (approved - used - scheduled - new_session_units) cannot go negative.
- **Why:** Claims for units beyond the approved total are denied 100%.
- **Auth model:** Total-period pool. NOT monthly allocation. No proration.
- **Sub-thresholds (informational, not blocks):**
  - 80% = positive signal ("approaching full utilization")
  - 95% = caution ("nearly fully scheduled")
  - <50% used with >50% period elapsed = underutilization alert (the REAL problem)
- **Admin override:** Yes (practice may have verbal approval for additional units, or re-auth in progress)
- **Audit log:** Required — `override_reason` must state justification
- **User message:** "This session would exceed the authorization limit. [Approved]: [X] units, [Used]: [Y], [Scheduled]: [Z], [This session]: [N]. [Override requires admin approval]."
- **Implementation:** `getProjectedAuthUtilization()` enforced server-side. Plan decisions E1, E17.
- **Source:** EC-010, AUTH-007

### HB-008: Assessment Codes (97151/97152) Are Exclusive
- **Rule:** 97151 and 97152 cannot overlap with ANY other session for the same client.
- **Why:** Assessment is a distinct clinical activity. The concurrent billing matrix shows every cell in the 97151 and 97152 rows as "N" (not allowed with anything).
- **Admin override:** Yes (some payers may allow concurrent assessment + treatment on same day at different times — but overlapping times are definitionally impossible)
- **Audit log:** Required
- **User message:** "Assessment code [97151/97152] cannot overlap with other sessions for this client. Assessment must be a separate time block."
- **Implementation:** Part of `checkClientOverlap()` — 97151/97152 have zero exemptions.
- **Source:** CPT-004, concurrent billing matrix row 97151/97152, adversarial review

### HB-009: Provider Cannot Be Their Own Supervisor
- **Rule:** `supervisorId` cannot equal `providerId` on the same session.
- **Why:** Supervision is by definition between two different people.
- **Admin override:** **NO** — nonsensical. No valid exception.
- **User message:** "The supervisor cannot be the same person as the rendering provider."
- **Implementation:** Simple check in session creation validation: `if (supervisorId === providerId) throw`
- **Source:** Adversarial review issue #4

---

## Tier 2 — Configurable Warnings (AMA/ABA Defaults)

These are seeded from ABA Coding Coalition guidance. Each can be overridden per payer
via the "save as payer rule" workflow or the payer configuration fields (E23).

### W-001: CPT Code Not on Active Authorization
- **Default:** Warning with prominent amber banner
- **Message:** "[CPT] is not authorized for [Client]. Active auth covers: [list]. This session may not be billable."
- **Payer override:** N/A (auth-specific, not payer-specific)
- **Requires acknowledgment:** Yes
- **Source:** E18, EC-004

### W-002: Session Outside Authorization Date Range
- **Default:** Differentiated warning based on context
- **Messages:**
  - (a) "Authorization expired on [date]. Renew?" (auth exists but expired)
  - (b) "No authorization found for [Client] + [CPT]." (never had one)
  - (c) "Authorization starts [future date]. This session is before the auth period." (too early)
- **Requires acknowledgment:** Yes
- **Source:** E20, EC-003, EC-005

### W-003: Approaching Auth Utilization Threshold
- **Default:** Informational at 80% (positive), caution at 95%
- **Messages:**
  - 80%: "Auth is 80% utilized — on track for full utilization."
  - 95%: "Auth is 95% utilized — [X] units remaining. Plan accordingly."
- **Requires acknowledgment:** No (display-only)
- **Source:** E17, EC-011

### W-004: Daily MUE Limit Exceeded
- **Default:** Warning (MUE indicator 3 allows justified exceedance)
- **Message:** "Daily [CPT] total would be [X] units (MUE limit: [Y]). Claims exceeding MUE require medical necessity documentation."
- **Payer override:** `payers.max_units_per_day` overrides CMS default
- **Requires acknowledgment:** Yes
- **Source:** E19, EC-012

### W-005: Concurrent Billing Code Pair Flagged
- **Default:** Informational note based on ABA Coding Coalition matrix
- **Message:** "This [code] session overlaps with [Client]'s [other code] session. Under default ABA rules: [allowed/conditional/not allowed]. Check your payer contract for [Payer]. [Allow for this payer] [Block for this payer] [Dismiss]"
- **Payer override:** `payers.allows_concurrent_billing` (boolean). "Save as payer rule" writes per-payer config. When `allows_concurrent_billing = false`, concurrent sessions become a hard block for that payer.
- **Requires acknowledgment:** Only if flagged as "not allowed" by defaults
- **Source:** E26, concurrent billing matrix (Section 1.3 of audit doc)

### W-006: Provider Credential Expiring or Expired
- **Default:** Warning with countdown
- **Messages:**
  - 30+ days: "Provider credential expires [date] ([X] days)."
  - <30 days: "Provider credential expires in [X] days. Sessions after expiration may not be billable."
  - Expired: "Provider credential expired on [date]. Sessions may not be billable. Reassign to a credentialed provider."
- **Dashboard alerts:** 90/60/30/14/7 day countdown
- **Hard block:** Deferred to v1.1 (E21 ships warning only)
- **Source:** E21, EC-007

### W-007: No Supervisor Assigned for RBT Session
- **Default:** Warning
- **Message:** "No supervisor assigned for this RBT session. BACB requires supervision for all RBT services."
- **Requires acknowledgment:** No (informational — auto-assignment from provider profile may fill this)
- **Source:** Feature spec validation rule #5

### W-008: 97151 Assessment as Recurring Template
- **Default:** Warning at template creation
- **Message:** "Assessment code 97151 is typically one-time or periodic (~6 months). Are you sure you want a recurring template?"
- **Requires acknowledgment:** Yes (confirm intent)
- **Source:** E25, CPT-004

### W-009: Template Generates Sessions Beyond Auth End Date
- **Default:** Warning with specific counts
- **Message:** "Template generates sessions past auth expiration ([date]). [X] sessions within auth, [Y] sessions beyond — these may not be billable."
- **Requires acknowledgment:** No (toast after batch generation)
- **Source:** E22, EC-047

### W-010: Payer-Specific Concurrent Billing Block
- **Default:** Block when `payers.allows_concurrent_billing = false`
- **Message:** "[Payer] does not allow concurrent ABA billing. Cannot schedule overlapping sessions for this client."
- **This warning UPGRADES to a hard block based on payer config.**
- **Source:** E23, E26

---

## Tier 3 — Informational (Display Only)

### I-001: Auth Pacing Status
- **Display:** Green/yellow/orange/red bands on client overview tab
- **Thresholds:** Green (90-110% of expected), Yellow (70-89%), Orange (50-69%), Red (<50%)
- **Dashboard:** Aggregate "X clients behind pace" metric card
- **Source:** E17, D23, AUTH-004

### I-002: Concurrent BCBA-RBT Session Indicator
- **Display:** Stacked sessions with "concurrent billing" badge in client schedule view
- **Note in quick-create:** "This overlaps with [RBT]'s 97153 session. Concurrent billing will apply."
- **Source:** D19, EC-034

### I-003: Sessions Without Notes (Aging)
- **Display:** Dashboard metric: "X sessions without notes (>48 hrs)"
- **Source:** EC-042

### I-004: Client Cancellation Rate
- **Display:** Badge on client overview tab. Normal (<10%), Concerning (10-20%), Critical (>20%)
- **Source:** EC-040, CANC-004

### I-005: Pending Auth Visual on Calendar
- **Display:** Dashed border + amber "No Auth" badge on calendar events beyond auth coverage
- **Source:** D22

---

## Implementation Notes

### Transaction Safety
All Tier 1 checks (HB-001 through HB-009) must run INSIDE the database transaction to
prevent TOCTOU race conditions. Two concurrent scheduling requests for the same provider
or client must be serialized.

### Override Audit Schema
Overrides should be stored with the session record:

```
session fields for overrides:
  has_override         boolean DEFAULT false
  override_rule_id     text (e.g., "HB-001", "HB-007")
  override_reason      text NOT NULL (when has_override = true)
  override_by_user_id  text FK → users
  override_at          timestamp with tz
```

### Payer Rule Storage (MVP)
Three fields on `payers` table:
- `max_units_per_day` — integer, nullable (null = use CMS MUE default)
- `allows_concurrent_billing` — boolean, default true
- `max_group_size` — integer, nullable (null = CPT default of 8)

### "Save as Payer Rule" Workflow
When a Tier 2 warning fires and the user clicks "Allow for this payer" or "Block for this payer":
1. Write the decision to the payer config (for MVP: update the flat field on `payers` table)
2. Future sessions with this payer + condition use the saved decision
3. Audit log the rule creation

### Constants Reference
All CPT code definitions, MUE limits, and code-pair rules should be stored in
`src/lib/constants.ts` alongside existing `ABA_CPT_CODES`, `QHP_ONLY_CPT_CODES`,
and `GROUP_CPT_CODES` arrays. The concurrent billing matrix (Section 1.3 of
`aba-scheduling-audit.md`) should be encoded as a lookup structure.
