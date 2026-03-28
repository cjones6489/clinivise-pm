# Authorizations Feature Spec

> The complete reference for authorization tracking in Clinivise. Architecture, data model, competitor analysis, UI specifications, and roadmap.

---

## What Authorizations Are in ABA

Insurance authorizations are the financial backbone of ABA therapy. Every session must be authorized before it can be billed. The flow:

1. **BCBA requests authorization** from the payer (insurance company) — includes diagnosis, treatment plan, requested hours per CPT code
2. **Payer approves** with specific: auth number, date range, approved units per CPT code, any restrictions
3. **Practice delivers sessions** against the authorization — each session consumes units
4. **Utilization is tracked** — how many approved units have been used, how many remain
5. **Before expiry**, BCBA submits a re-authorization request with progress data
6. **If denied**, practice appeals within the appeal deadline

Authorization tracking is the #1 pain point practices report. Over-utilization = delivering sessions that can't be billed. Under-utilization = leaving approved hours on the table (revenue loss). Auth gaps = no active auth means sessions can't be billed at all.

---

## Architecture

Authorizations appear in three places:

```
1. Client Detail Page — Authorizations Tab
   └── List of all authorizations for this client
   └── Per-auth cards with utilization, expiry, service lines

2. Client Detail Page — Overview Tab
   └── Metric cards (approved/used/weekly avg/days left)
   └── Under-utilization alert
   └── Per-CPT utilization bars (from active auth)

3. Standalone Authorizations Page (/authorizations)
   └── Cross-client auth list with filters
   └── Status, expiry, utilization across all clients
   └── Auth detail page with tabs (overview, service lines, sessions, documents)
```

---

## Data Model

### `authorizations` table (21 columns)
- id, organizationId, clientId, payerId, clientInsuranceId
- previousAuthorizationId (FK for auth chains)
- authorizationNumber, status, authType
- requestingProviderId
- startDate, endDate
- diagnosisCode
- denialReason, appealDeadline
- notes, aiParsedData, aiConfidenceScore
- deletedAt, createdAt, updatedAt

### `authorization_services` table (12 columns)
- id, organizationId, authorizationId
- cptCode, approvedUnits, usedUnits
- frequency, maxUnitsPerDay, maxUnitsPerWeek
- notes, createdAt, updatedAt

### Status Lifecycle
`pending` → `approved` → `expired` | `exhausted` | `denied`

---

## Competitor Analysis — Client Auth Tab (Verified 2026-03-27)

### What Competitors Show Per Authorization on Client Page

| Feature | Passage | Theralytics | TherapyPM | TherapyLake | AlohaABA | Motivity | Hipp | Clinivise Auth Tab | Clinivise Overview |
|---|---|---|---|---|---|---|---|---|---|
| Payer + auth number | Yes | Yes | Yes | Yes | Yes | Yes | N/A | Yes | No |
| Status badge | Yes | Yes | Yes | Yes | Yes | Yes | N/A | Yes | No |
| Date range | Yes | Yes | Yes | Yes | Yes | Yes | N/A | Yes | No |
| Aggregate utilization % | Yes | Yes | Yes | Yes | Yes | Yes | N/A | Yes (text) | Yes (metric card) |
| **Per-CPT utilization bars** | Yes | Basic | Yes | Yes | Yes | Unclear | N/A | **No** | **Yes** |
| **Days remaining** | Yes | Yes | Yes | Yes | Unclear | Unclear | N/A | **No** | **Yes** |
| **Expiry warning on card** | Yes | Yes | Yes | Yes (red) | Yes | Unclear | N/A | **No** | Partial |
| **Visual utilization bar** | Yes | Basic | Yes | Yes | Unclear | Yes | N/A | **No (text only)** | **Yes** |
| Reserved/scheduled units | Yes | No | No | **Yes** | Yes | Yes | N/A | No | No |
| Pacing/velocity metric | **Yes** | No | No | No | No | No | N/A | No | No |
| Session drill-down | No | No | No | **Yes** | No | No | N/A | No | No |
| Clone/reauth shortcut | No | No | **Yes** | No | No | No | N/A | No | No |
| Monthly burn-rate | No | No | No | No | **Yes** | No | N/A | No | No |
| Auto scheduling check | **Yes** | No | No | No | No | No | N/A | No | No |

**Legend:** "N/A" = platform doesn't use traditional auth dashboard (see Hipp notes below). "Basic" = feature exists but limited detail publicly visible.

**Table order:** Primary competitors first (Passage, Theralytics, TherapyPM, TherapyLake), then secondary (AlohaABA, Motivity), then alternative approach (Hipp). Raven Health excluded — platform fully gated with no public feature documentation.

### Competitor Notes

**Theralytics** — Auth tracking included in billing/RCM module. Expiration alerts and utilization monitoring confirmed. Per-CPT detail level unclear from public docs but basic auth management is well-documented. Free 6-month startup tier, SOC 2 Type II, ONC Health IT Certified. $15-25/client/month.

**Passage Health** — Best auth-to-scheduling integration in our tier. Auto-checks authorizations before scheduling, prevents booking beyond approved hours, sends expiration alerts. Frontera AI ($42M) partnership for clinical intelligence. Ranked #1 in multiple 2026 comparison articles.

**Hipp Health** — Takes a fundamentally different, AI-agent-first approach. No traditional auth tab or utilization dashboard documented. Instead:
- **AI Compliance Agent**: Always-on background scanner that checks authorizations, verifications, and clinical notes across all patients/providers/locations. Auto-generates remediation tasks sent via SMS.
- **Claim-time validation**: Billing module "automatically checks claims against a known list of potential errors" — auth validation at submission, not scheduling.
- **Staff utilization focus**: Emphasizes technician utilization rates and schedule fill rates over per-client auth utilization.
- Hipp bets on proactive alerts rather than visual dashboards. Interesting but may frustrate admins who want at-a-glance visibility.

**Raven Health (secondary)** — Platform entirely gated behind demos. Marketing mentions "authorization tracking" and "utilization monitoring" but no public screenshots or help docs. Passage Health's comparison claims Raven has "no automated authorization checks." Not included in feature comparison table due to insufficient public data.

### Key Findings

1. **Our Overview tab is competitive.** It has per-CPT utilization bars, days remaining, weekly averages, and under-utilization alerts.

2. **Our Authorizations tab is behind 5 of 6 dashboard-based competitors** (Passage, Theralytics, TherapyPM, TherapyLake, AlohaABA, Motivity). It shows a single line of text per auth with no visual utilization, no expiry indicator, no per-CPT breakdown. The data and components exist — they're just not wired into the auth tab.

3. **Entry-level tier is split on approach:** Traditional dashboard (Passage, Theralytics, TherapyPM, TherapyLake) vs. AI-agent monitoring (Hipp). We should build the dashboard baseline first (what practices expect), with AI-powered proactive monitoring as a Phase 3+ differentiator.

4. **Passage Health's auto scheduling check is unique** in our tier — prevents booking beyond approved hours. Worth adding to our Phase 2 roadmap (scheduling + auth integration).

5. **No competitor at our tier shows pacing/velocity metrics.** Future differentiator: "At current pace, this auth will exhaust 12 days before expiry" or "Under-utilizing: only 40% used with 60% of period elapsed."

6. **AI session notes are now table stakes** — Theralytics, Hipp, Passage (via Frontera), Artemis, PortiaPro, and ABA Matrix all have some form. Our AI differentiation needs to go beyond notes.

---

## Client Auth Tab — Redesign Spec

### Current State (4/10)

```
+------------------------------------------------------------------+
| Authorizations                              [Add Authorization]   |
|                                                                    |
| Blue Cross Blue Shield  #AUTH-2026-1000  [Approved]               |
| Period: Nov 25, 2025 — May 24, 2026  Utilization: 77/140 (55%)   |
| Services: 2                                                       |
+------------------------------------------------------------------+
```

One line of text. No visual hierarchy. "Services: 2" is meaningless. No expiry indicator. No per-CPT detail.

### Target State (matches competitors)

```
+------------------------------------------------------------------+
| Authorizations                              [Add Authorization]   |
+==================================================================+
| Blue Cross Blue Shield  #AUTH-2026-1000                           |
| [Approved]  Nov 25, 2025 — May 24, 2026            [58d left]    |
|                                                                    |
| 97153 — Adaptive Behavior Treatment                               |
| ████████████░░░░░░░░ 60% (60/100 units) · 30.0/50.0 hrs         |
|                                                                    |
| 97155 — Protocol Modification                                     |
| ██████░░░░░░░░░░░░░░ 43% (17/40 units) · 4.3/10.0 hrs           |
|                                                                    |
| Aggregate: 77/140 units (55%)              Weekly avg: 6.2 hrs    |
+==================================================================+
| EXPIRED / HISTORICAL                              [Show/Hide]     |
| (collapsed — previous authorizations)                             |
+------------------------------------------------------------------+
```

### What Changes

1. **Per-CPT utilization bars** on each auth card — same `UtilizationBar` component already used on Overview. Show each service line with its CPT code, description, used/approved, and hours.

2. **Days remaining badge** — color-coded: green (>30d), amber (7-30d), red (<7d), expired. Use existing `ExpiryBadge` component.

3. **Visual utilization bar** per service line (not just aggregate text).

4. **Aggregate summary line** — total units + weekly average (already calculated on Overview).

5. **Active vs Historical separation** — active/pending auths shown prominently, expired/exhausted in collapsible section below (same pattern as Care Team past assignments and Goals met section).

6. **Click to navigate** — clicking an auth card still navigates to the full auth detail page.

### What We Already Have (just needs wiring)

| Component | Location | Used On | Needed On |
|---|---|---|---|
| `UtilizationBar` | `components/shared/utilization-bar.tsx` | Overview tab | Auth tab cards |
| `ExpiryBadge` | `components/shared/expiry-badge.tsx` | Overview tab, auth list page | Auth tab cards |
| `daysUntilExpiry` | `lib/utils.ts` | Overview tab | Auth tab cards |
| `getClientAuthUtilization` | `server/queries/authorizations.ts` | Overview tab | Already passed to client detail |
| `unitsToHours` | `lib/constants.ts` | Overview tab | Auth tab cards |

---

## Standalone Auth Page — Current State

The standalone `/authorizations` page and `/authorizations/[id]` detail page are separate from the client page auth tab. They have:

- Auth list with status filters, expiry badges
- Auth detail with tabs: Overview, Service Lines, Sessions, Documents, Edit
- Per-CPT utilization bars on the Service Lines tab
- Auth form with service line management

These are in good shape and not part of this redesign. The client page auth tab is the gap.

---

## Phased Roadmap

### DONE — Auth Tab Redesign (completed 2026-03-27)
- [x] Add per-CPT utilization bars to each auth card on client page
- [x] Add ExpiryBadge (days remaining) to each auth card
- [x] Add aggregate summary (total units + weekly avg)
- [x] Separate active from historical auths (collapsible)
- [x] No active auth warning banner
- [x] New query `getClientAuthorizationsWithServices` (2-query batch, grouped in memory)
- [x] Audit: fixed SQL `inArray`, CardTitle text, future-start weekly avg edge case

### NEXT — Phase 2 Enhancements
- [ ] "Renew" button on expiring auths (pre-fill new auth from existing)
- [ ] Pacing projection ("at current rate, exhausted by [date]")
- [ ] Reserved/scheduled units tracking (session status = scheduled counts separately)

### LATER — Phase 3+
- [ ] Session-level drill-down per service line
- [ ] Monthly burn-rate visualization
- [ ] AI auth letter parsing UI (schema exists, upload workflow not built)
- [ ] Re-auth workflow checklist

---

## Sources

**Primary competitors:**
- Passage Health: ABA Scheduler Software, Best ABA PM Software, 5 Best ABA PM Software 2026
- Theralytics: Billing/RCM module, authorization tracking, SOC 2 documentation
- TherapyPM: Authorization Management, How to Add Authorization Service, Authorization Module Playbook
- TherapyLake: ABA Authorization Management, ABA Billing Authorization Automation
- AlohaABA: Authorization Management, Track Client Service Authorization Usage

**Secondary competitors:**
- Motivity: ABA Practice Management All-in-One
- CentralReach: Navigate Authorizations, Authorization Utilization Dashboard
- Hipp Health: Compliance Agent, Smart Scheduling, Billing, Care Management, Use Cases (UI gated behind demo)
- Raven Health: ABA Authorization blog, ABA Practice Metrics to Track (UI fully gated)

**Other sources:**
- Mission Viewpoint: Hipp Health Platform Card
- HIT Consultant: Hipp Health $6.2M Funding (Oct 2025)
- Sprypt: Best ABA Therapy Software 2026
- Capterra: Best ABA Software for Small Businesses
