# Design Pass Tracker

> **Purpose**: Track all UI/UX gaps between the wireframes, design system, and current implementation.
>
> **References**:
> - Wireframes: [`clinivise-wireframes.jsx`](clinivise-wireframes.jsx)
> - Design system: [`.claude/skills/design/references/design-system.md`](../../.claude/skills/design/references/design-system.md)
> - Product spec: [`../specs/product-spec.md`](../specs/product-spec.md)
> - Auth navigation research: [`../research/authorization-navigation-ux-research.md`](../research/authorization-navigation-ux-research.md)
> - Auth visual patterns: [`../research/authorization-utilization-visual-patterns.md`](../research/authorization-utilization-visual-patterns.md)

---

## Design Pass 1: Systemic Fixes — COMPLETE

| # | Issue | Status |
|---|-------|--------|
| 1 | PageHeader typography (text-lg font-semibold, text-xs description) | `[x]` |
| 2 | Dashboard action buttons removed | `[x]` |
| 3 | Session form sections wrapped in section cards | `[x]` |
| 4 | Client list: inline age, removed Age column, fixed diagnosis fallback | `[x]` |
| 5 | Auth detail: read-only KV overview + Edit tab | `[x]` |
| 6 | MetricCard font-bold → font-semibold | `[x]` |
| + | Client detail metadata text-[13px] → text-xs | `[x]` |
| + | Session form Auth section wrapped in section card | `[x]` |

## Design Pass 2: Page-Specific — COMPLETE

| # | Issue | Status |
|---|-------|--------|
| 7 | Dashboard payer column in client overview | `[x]` |
| 8 | ~~Personalized greeting~~ | `[—]` skipped per D4 |
| 9 | Dashboard spacing (kept space-y-4 as intentional) | `[x]` |
| 10 | Back link on sessions/new | `[x]` → breadcrumb in DP3 |
| 11 | Diagnosis fallback fixed | `[x]` in DP1 |
| 12 | Client list dynamic count | `[x]` already existed |
| 13 | Client detail header sizing | `[x]` in DP1 |
| 14 | Back link sizing standardized | `[x]` in DP1 audit |
| 15 | Client overview: 4 cards → 2 (Guardian + Details removed) | `[x]` |
| 16 | Recent Sessions link fixed | `[x]` |
| 17 | Auth list button "Add Authorization" (not upload — AI parse is Phase 3) | `[x]` |
| 18 | Auth list Period column added | `[x]` |
| 19 | Auth list Days Left column header | `[x]` |
| 20 | ~~Projected utilization column~~ | `[—]` Phase 1-Polish (needs burndown) |
| 21 | Auth detail metric cards (Days Remaining, Hours Used, Hours Approved, Weekly Burn) | `[x]` |
| 22 | Auth detail back link sizing | `[x]` → breadcrumb in DP3 |
| 23 | Auth detail service lines section card | `[x]` in DP1 |
| 24 | Auth detail documents EmptyState with icon | `[x]` in DP1 |
| 25 | ~~Provider metric cards~~ | `[—]` skipped per D5 |
| 26 | Provider dynamic count | `[x]` |

## Design Pass 3: Polish — COMPLETE

| # | Issue | Status |
|---|-------|--------|
| 27 | ~~Filter tabs style~~ | `[—]` keeping underline per D1 |
| 28 | Breadcrumbs on detail pages (client, auth, session form) | `[x]` |
| 29 | Non-functional search bar removed from header | `[x]` |
| 30 | tracking-wide → tracking-wider in DataTable | `[x]` |
| 31 | ~~Sidebar user name~~ | `[—]` deferred (UserButton suffices) |

---

## Decisions Made

| # | Decision | Rationale |
|---|----------|-----------|
| D1 | **Underline tabs** (not pills) | Already consistent, less visual noise |
| D2 | **2-card client overview** | Guardian to header, Details to Edit tab |
| D3 | **Read-only auth Overview + Edit tab** | Form-as-overview is anti-pattern |
| D4 | **No personalized greeting** | Adds no information |
| D5 | **No provider metric cards** | Setup page, not daily workflow |

## Architecture Validation (from research)

The dual-access auth model is **validated by industry research** (3 documents, 8+ platforms analyzed):
- `/authorizations` — cross-client health monitor (the gap no competitor fills well)
- Client detail — primary auth management entry point
- Dashboard — alert aggregator
- Session form — inline auth impact

No structural changes needed. Research confirms our approach matches CentralReach's model (the only competitor with dual access) while executing with better UX.

---

*Created: 2026-03-25*
*Design Pass 1: Complete (2026-03-25)*
*Design Pass 2: Complete (2026-03-25)*
*Design Pass 3: Complete (2026-03-25)*
*Architecture validated by research (2026-03-25)*
*Status: All design passes complete. Next: Phase 1-Polish features or Phase 2 deployment.*
