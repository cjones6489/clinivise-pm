# Phase 1-Core Implementation Research

> **Purpose**: Industry standards and best practices for building sessions, auth intelligence, and dashboard. Compiled from 4 parallel research agents covering ABA billing compliance, healthcare UX, competitor patterns, and technical implementation.
>
> **Date**: 2026-03-25
> **Sources**: 60+ sources including CMS documentation, ABA billing guides, payer requirements, 11+ competitor analyses, Next.js/Drizzle/Neon docs, healthcare UX research.

---

## 1. Session Logging — Billing Compliance Requirements

### CMS 8-Minute Rule (Current through 2026)

The formula: `floor(minutes / 15) + (minutes % 15 >= 8 ? 1 : 0)`

| Minutes | Units | Explanation |
|---------|-------|-------------|
| 1-7 | 0 | Not billable |
| 8-22 | 1 | First unit |
| 23-37 | 2 | Second unit |
| 38-52 | 3 | Third unit |
| 53-67 | 4 | Fourth unit |

**AMA (per-code) vs CMS (aggregate) method**:
- **AMA**: Each CPT code evaluated independently. Remainder minutes from different codes CANNOT be combined. Used by most commercial payers.
- **CMS**: Sum ALL timed minutes across ALL CPT codes for one patient on one date. Distribute units back. Extra unit goes to code with largest remainder. Used by Medicare/Medicaid.
- **Our implementation**: AMA is the default (`unitCalcMethod: "ama"` on payers). CMS method stored but not yet calculated (Phase 2 for aggregate day-level billing).

### MUE Limits (Medically Unlikely Edits)

| CPT | Description | Medicare MUE | Medicaid MUE | Our `maxUnitsPerDay` |
|-----|-------------|-------------|-------------|---------------------|
| 97151 | Assessment | **8** | 32 | 32 |
| 97152 | Assessment support | 16 | 16 | 16 |
| 97153 | Adaptive behavior treatment | 32 | 32 | 32 |
| 97154 | Group treatment | 18 | 18 | 18 |
| 97155 | Protocol modification | 24 | 24 | 24 |
| 97156 | Caregiver training | 16 | 16 | 16 |
| 97157 | Group caregiver training | 16 | 16 | 16 |
| 97158 | Group protocol modification | 16 | 16 | 16 |

**Action item**: Our `maxUnitsPerDay` uses Medicaid values. The 97151 Medicare discrepancy (8 vs 32) is significant. Consider adding `medicareMaxUnitsPerDay` field for practices billing Medicare.

### Required Fields for Billable Sessions

These map to CMS-1500 claim form fields:

| CMS-1500 Box | Field | Our Schema | Required? |
|-------------|-------|-----------|-----------|
| 21 | ICD-10 Diagnosis (F84.0) | On client record | Yes |
| 23 | Authorization Number | `authorizationId` → auth.authorizationNumber | Yes (nearly universal for ABA) |
| 24A | Date of Service | `sessionDate` | Yes |
| 24B | Place of Service | `placeOfService` | Yes |
| 24D | CPT + Modifiers | `cptCode` + `modifierCodes` | Yes |
| 24G | Units | `units` | Yes |
| 24J | Rendering Provider NPI | Via `providerId` → provider.npi | Yes |
| 33 | Billing Provider NPI | Organization-level | Yes |

**Action item**: Start/end times should be REQUIRED for completed sessions — our schema has them optional, but nearly every payer requires them for billing compliance.

### Modifier Requirements

| Modifier | Credential | Role | Status |
|----------|-----------|------|--------|
| HM | < Bachelor's | RBT | Implemented ✓ |
| HN | Bachelor's | BCaBA | Implemented ✓ |
| HO | Master's | BCBA | Implemented ✓ |
| HP | Doctoral | BCBA-D | Implemented ✓ |
| 95 | Any | Telehealth (POS 02/10) | Implemented ✓ |
| 59/XE/XP/XS/XU | Any | Distinct procedural service | Not implemented (Phase 2) |

### CPT-Credential Matching Rules

| CPT | RBT? | BCaBA? | BCBA/BCBA-D? |
|-----|-------|--------|-------------|
| 97151 | **No** | **No** | Yes (QHP only) |
| 97152 | Yes (supervised) | Yes (supervised) | Yes |
| 97153 | Yes (supervised) | Yes (supervised) | Yes |
| 97154 | Yes (supervised) | Yes (supervised) | Yes |
| 97155 | **No** | **No** | Yes (QHP only) |
| 97156 | **No** | **No** | Yes (QHP only) |
| 97157 | **No** | **No** | Yes (QHP only) |
| 97158 | **No** | **No** | Yes (QHP only) |

**Action item**: RBTs should be BLOCKED (not just warned) from logging 97151/97155/97156/97157/97158. These are QHP-only codes.

### Session Validation Checklist (Pre-Claim)

| # | Rule | Phase 1-Core? | Notes |
|---|------|--------------|-------|
| 1 | Authorization active (approved, within date range) | Yes | FIFO auto-select handles this |
| 2 | Authorization has remaining units | Yes | `usedUnits < approvedUnits` check |
| 3 | CPT matches provider credential | Yes | Block RBT from QHP-only codes |
| 4 | Start/end time present for completed sessions | Yes | Make required in validator |
| 5 | Units match duration per 8-min rule | Phase 1-Polish | Store actualMinutes, validate later |
| 6 | No overlapping sessions (same provider, same time) | Phase 1-Polish | Never allowed |
| 7 | No overlapping sessions (same client, same time) | Phase 1-Polish | Allowed only for specific concurrent billing |
| 8 | Units don't exceed MUE for the day | Phase 1-Polish | Aggregate all sessions for client+CPT+date |
| 9 | Provider has valid NPI | Phase 2 | Check at claim generation |
| 10 | Client has diagnosis code | Phase 2 | Check at claim generation |

### Session Status Lifecycle

Our current statuses (5) are correct for Phase 1:
```
scheduled → completed, cancelled, no_show
completed → cancelled, flagged
flagged → completed, cancelled
cancelled → (terminal)
no_show → (terminal)
```

Phase 2 additions (on the claim, not the session):
- `pending_review` — awaiting supervisor co-sign
- `ready_to_bill` — validated, ready for claim generation
- `billed` — claim submitted
- `paid` — payment received

### Authorization Tracking — Race Condition Fix

**Current gap**: Our FIFO select checks `usedUnits < approvedUnits`, but by the time the increment executes, another concurrent transaction could have consumed those units.

**Fix**: Add `SELECT ... FOR UPDATE` on the auth service row within the transaction:
```sql
-- Lock the row before incrementing
SELECT id FROM authorization_services
WHERE id = ? FOR UPDATE;

-- Then safely increment
UPDATE authorization_services
SET used_units = used_units + ?
WHERE id = ?;
```

This serializes concurrent session creation against the same auth service.

### Retroactive Session Entry

- Authorization lookup must use session date, not today's date (already correct in our code)
- Consider flagging sessions where entry date is >7 days after session date
- Even if auth is now expired, if it was active on the session date, it should be selectable (already correct)

---

## 2. Dashboard — Design Patterns & Alert Systems

### ABA Practice KPIs (Tier 1 — Daily)

| KPI | Target | Warning | Critical |
|-----|--------|---------|----------|
| Auth utilization | 85-95% | <50% or >95% | <30% or >100% |
| Cancellation/no-show rate | <10% | 10-15% | >15% |
| Staff utilization (billable %) | 75-85% | <70% or >90% | <60% |
| Unsigned notes | 0 | 1-3 | >3 |
| Billing lag (service → claim) | <2 days | 2-5 days | >5 days |

### Alert Fatigue Prevention (Critical Research)

Healthcare alert fatigue causes **49-96% of alerts to be overridden** (AHRQ PSNet). A 2025 study found alert fatigue led to **14%+ increase in medical errors**.

**The "5 Rights" framework for Clinivise alerts**:

| Right | Application |
|-------|------------|
| Right information | Only alert on actionable items (not "5 auths are healthy") |
| Right person | RBTs see session alerts. BCBAs see caseload. Admins see practice-level. |
| Right format | Critical = inline banner. Warning = badge/pill. Info = dashboard widget only. |
| Right channel | Dashboard for aggregates. Session form for point-of-action. |
| Right time | Escalating: 30d (info) → 14d (warning) → 7d (critical) |

**Anti-fatigue strategies**:
1. **Exception-based only**: Show problems, not happy paths
2. **Maximum 3-5 visible alerts** before "View all (N)" link
3. **Aggregate similar alerts**: "3 auths expiring within 14d" (one row), not 3 separate rows
4. **Escalating severity**: Same alert changes from info → warning → critical as deadline approaches
5. **Threshold-crossing fires once**: 80% utilization alerts once, not on every subsequent session

### Alert Dismissability

| Severity | Dismissable? | Behavior |
|----------|-------------|----------|
| Critical | No | Persists until resolved. Can be "acknowledged" (collapses but visible) |
| Warning | Snooze | "Dismiss for 24h / 7 days / until resolved". Log who dismissed for audit. |
| Info | Yes | Dismissed permanently once seen |

**Key insight**: Replace interruptive pop-ups with passive inline alerts (banners, badges). Only use blocking dialogs for destructive actions.

### Dashboard Layout — Optimal Structure

- **4 metric cards** in primary row (our spec is correct). 4 is the sweet spot — scannable in one eye sweep.
- **Priority Alerts card** immediately below metrics. Max 3-5 visible. Color-coded left border (red/amber). Each row has entity name + description + action button.
- **Client Overview table** with 5-10 rows max on dashboard. **Sort by urgency** (most critical auth status first), not alphabetically. "Only showing items needing attention" as default filter.
- **Per-section Suspense boundaries** — metrics load first, alerts second, table last.

### Dashboard Data Loading

- **On page visit** (MVP): Server Component re-render. Always fresh. Simplest.
- **Aggregation queries in SQL** — not fetch-all-rows-and-compute-in-JS. Use Postgres `FILTER (WHERE ...)`.
- **Skeleton loaders** must match exact content dimensions. Never a centered spinner.
- **3-second rule**: Clinician should know what needs attention within 3 seconds of page load.

---

## 3. Auth Utilization — Visualization Standards

### Display Format

- **Hours preferred** over units for readability. BCBAs think in hours. Display: `units * 15 / 60`.
- **Units for precision** on detail pages and billing contexts.
- **Progress bar + percentage** is the most common pattern (CentralReach, TherapyPMS, our spec).
- **Color thresholds**: emerald (<80%), amber (80-95%), red (>95%). Our spec is aligned.
- **Over-utilization (>100%)**: Show bar at 100% with red overflow indicator. Text shows actual percentage.

### Expiry Display

- **Days remaining as number** ("62d") in table columns. Color: green >30d, amber 7-30d, red <7d, "Expired" if past.
- **Full date** ("Expires Jun 18, 2026") on detail pages alongside days remaining.
- **Lead times**: 30d (info), 14d (warning), 7d (critical). Our spec matches.

### Client Detail Overview — Data Architecture

Use **3 Suspense boundaries** (Vercel Tier 1 pattern):

1. **Page shell** (`Promise.all`): client record + guardian → header renders immediately
2. **Suspense 1**: Insurance snapshot + Care Team (fast, small queries)
3. **Suspense 2**: Auth metric cards + per-CPT utilization bars (aggregate query)
4. **Suspense 3**: Recent sessions (may be slower, loads last)

Each section is an async server component fetching independently. Skeleton loaders match content shape.

---

## 4. Technical Implementation Patterns

### Drizzle Aggregation for Dashboard

Use Postgres `FILTER (WHERE ...)` for conditional aggregation:
```ts
const [metrics] = await db
  .select({
    activeClients: sql<number>`count(*) filter (where ${clients.status} = 'active')::int`,
    totalClients: sql<number>`count(*)::int`,
  })
  .from(clients)
  .where(and(eq(clients.organizationId, orgId), isNull(clients.deletedAt)))
```

Always use `coalesce` for NULL safety and `nullif(..., 0)` to prevent division-by-zero:
```ts
avgUtilization: sql<number>`coalesce(
  round(sum(${svcAgg.totalUsed})::numeric / nullif(sum(${svcAgg.totalApproved}), 0) * 100),
  0
)::int`
```

### Client Overview Query with Subqueries

Use subqueries for inline metrics (avoid N+1):
```ts
// Subquery: active auth utilization per client
const authUtil = db
  .select({
    clientId: authorizations.clientId,
    totalApproved: sql<number>`coalesce(sum(${authorizationServices.approvedUnits}), 0)::int`,
    totalUsed: sql<number>`coalesce(sum(${authorizationServices.usedUnits}), 0)::int`,
    nearestExpiry: sql<string>`min(${authorizations.endDate})`,
  })
  .from(authorizations)
  .leftJoin(authorizationServices, eq(authorizations.id, authorizationServices.authorizationId))
  .where(and(
    eq(authorizations.organizationId, orgId),
    eq(authorizations.status, 'approved'),
    isNull(authorizations.deletedAt),
    gte(authorizations.endDate, now),
  ))
  .groupBy(authorizations.clientId)
  .as('auth_util')
```

### Suspense + Error Boundaries

ErrorBoundary wraps Suspense, not the other way around:
```tsx
<SectionErrorBoundary fallback={<SectionError title="Alerts unavailable" />}>
  <Suspense fallback={<AlertsSkeleton />}>
    <PriorityAlerts orgId={orgId} />
  </Suspense>
</SectionErrorBoundary>
```

### Neon Optimization

- **Verify DATABASE_URL uses `-pooler` hostname** (routes through PgBouncer, 10,000 connections)
- **Parallel queries via `Promise.all`** — cold start paid once, not per-query
- **Consider partial indexes** for hot queries:
  ```sql
  CREATE INDEX clients_active_idx ON clients(organization_id)
    WHERE status = 'active' AND deleted_at IS NULL;
  CREATE INDEX auths_active_idx ON authorizations(organization_id, status, end_date)
    WHERE deleted_at IS NULL;
  ```

---

## 5. Action Items for Phase 1-Core

### Must Do (before building)

1. **Make start/end times required for completed sessions** in `createSessionSchema`
2. **Block RBTs from QHP-only codes** (97151/97155-97158) — not just warn, block
3. **Add `FOR UPDATE` lock** on auth service row during session creation transaction
4. **Dashboard uses per-section Suspense boundaries** — not `Promise.all` for everything
5. **Dashboard queries use SQL aggregation** (`FILTER`, `coalesce`, `nullif`) — not JS computation

### Should Do (during build)

6. **Alert fatigue prevention**: max 3-5 visible alerts, aggregate similar, escalating severity
7. **Client overview table sorted by urgency** (most critical auth first), not alphabetical
8. **Skeleton loaders match content dimensions** for each Suspense section
9. **ErrorBoundary per section** so one failing query doesn't break the whole dashboard

### Consider (based on feedback)

10. Add `medicareMaxUnitsPerDay` field for 97151 discrepancy
11. Flag retroactive session entries (>7 days after session date)
12. Add session overlap detection queries
13. Add partial indexes on hot tables once query patterns are established

---

*Compiled from: CMS Transmittal AB-01-56, ABA Coding Coalition, AHRQ PSNet (alert fatigue), 11+ competitor analyses, Next.js 16 docs, Drizzle ORM docs, Neon Postgres docs, 60+ industry sources.*
