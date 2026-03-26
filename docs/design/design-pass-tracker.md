# Design Pass Tracker

> **Purpose**: Track all UI/UX gaps between the wireframes, design system, and current implementation. Organized by priority and sprint. Updated as fixes are applied.
>
> **References**:
> - Wireframes: [`clinivise-wireframes.jsx`](clinivise-wireframes.jsx)
> - Design system: [`.claude/skills/design/references/design-system.md`](../../.claude/skills/design/references/design-system.md)
> - Product spec: [`../specs/product-spec.md`](../specs/product-spec.md)

---

## Design Pass 1: Systemic Fixes (affects every page)

> These are the highest-leverage changes — fixing them improves every page at once.

| # | Issue | Location | Wireframe Spec | Current | Fix | Status |
|---|-------|----------|---------------|---------|-----|--------|
| 1 | **PageHeader typography too large** | `src/components/layout/page-header.tsx` | `text-lg font-semibold tracking-tight` title, `text-xs` description | `text-xl font-bold` title, `text-sm` description | Reduce title to `text-lg font-semibold tracking-tight`, description to `text-xs text-muted-foreground` | `[ ]` |
| 2 | **Dashboard action buttons** | `src/app/(dashboard)/overview/page.tsx` | No action buttons — dashboard is pure signal | "Log Session" + "Add Client" buttons in header | Remove both buttons. Actions live on `/sessions` and `/clients`. | `[ ]` |
| 3 | **Session form naked headings** | `src/components/sessions/session-form.tsx` | Sections wrapped in card with title bar | Bare `<h3>` headings ("Client & Provider", "Session Details", "Authorization") | Wrap each section in a section card with title bar. Anti-pattern explicitly called out in design system. | `[ ]` |
| 4 | **Client list missing columns** | `src/components/clients/client-columns.tsx` | Rich rows: name+DOB+diagnosis, guardian, payer, BCBA, eligibility badge, auth status+days | Only: name+DOB+diagnosis, age, status, BCBA | Add guardian, payer, auth status (ExpiryBadge) columns. Consider removing standalone Age column (inline it with name cell like wireframe). | `[ ]` |
| 5 | **Auth detail Overview is a form** | `src/components/authorizations/authorization-detail.tsx` | Read-only KV pair display with section cards | Renders `AuthorizationForm` (disabled when not canEdit) | Build a read-only `AuthorizationOverview` component using KV pairs and section cards. Keep form on a dedicated Edit tab. | `[ ]` |
| 6 | **MetricCard font-bold → font-semibold** | `src/components/shared/metric-card.tsx` | `text-2xl font-semibold tabular-nums` | `text-2xl font-bold` | Change to `font-semibold` per design system | `[ ]` |

---

## Design Pass 2: Page-Specific Enhancements

> Individual page improvements to match wireframe fidelity.

### Dashboard (`/overview`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 7 | Client overview table missing **payer** column | Add payer name from `getClientOverviewForDashboard` (already in query) | `[ ]` |
| 8 | ~~No personalized greeting~~ | ~~Use user's first name~~ | `[—]` skipped per D4 |
| 9 | `space-y-4` between sections | Consider `space-y-6` for consistency with other pages, or document as intentional | `[ ]` |

### Sessions List (`/sessions`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 10 | No back link or breadcrumbs on form page | Add "← Back to Sessions" link on `/sessions/new` | `[ ]` |

### Client List (`/clients`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 11 | Diagnosis fallback hardcoded to "F84.0" | Change to "—" or empty when no diagnosis code | `[ ]` |
| 12 | No dynamic count in header description | Show "{N} clients in your practice" like sessions page does | `[ ]` |

### Client Detail (`/clients/[id]`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 13 | Header uses `text-[22px] font-bold` | Change to `text-xl font-semibold tracking-tight` (or keep larger for hero moment but use `font-semibold`) | `[ ]` |
| 14 | Back link uses `text-[13px]` | Standardize to `text-xs` (12px) | `[ ]` |
| 15 | Overview has 4 section cards (Insurance, Care Team, Guardian, Details) | Wireframe shows 2 (Insurance + Care Team). Consider merging Guardian into header or Care Team card, Details into a collapsible section | `[ ]` |
| 16 | Recent Sessions "All sessions →" link points to client's own page | Should switch to Sessions tab or use a filtered sessions URL | `[ ]` |

### Authorization List (`/authorizations`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 17 | Button says "Add Authorization" | Change to "Upload Auth Letter" per wireframe (even if AI parse isn't built yet, the intent is upload-first) | `[ ]` |
| 18 | Missing Period (date range) column | Add formatted "Dec 20 – Jun 18" column | `[ ]` |
| 19 | Missing Days Left (numeric) column | Currently using ExpiryBadge — could add a sortable numeric column alongside or replace | `[ ]` |
| 20 | Missing Projected utilization column | Deferred — requires burn rate calculation (Phase 1-Polish: predictive burndown) | `[—]` |

### Authorization Detail (`/authorizations/[id]`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 21 | No metric cards | Add 4 cards: Days Remaining, Hours Used, Hours Approved, Weekly Burn Rate | `[ ]` |
| 22 | Back link sizing inconsistent with client detail | Standardize to `text-xs` | `[ ]` |
| 23 | Service Lines tab lacks section card wrapping | Wrap utilization bars in a section card | `[ ]` |
| 24 | Documents tab empty state has no icon | Use `EmptyState` component with icon | `[ ]` |

### Provider List (`/providers`)

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 25 | ~~No metric cards~~ | ~~Add basic cards~~ | `[—]` skipped per D5 |
| 26 | No dynamic count in description | Show "{N} providers" | `[ ]` |

---

## Design Pass 3: Polish

> Visual consistency, accessibility, and micro-interactions.

| # | Issue | Fix | Status |
|---|-------|-----|--------|
| 27 | ~~Filter tabs use underline style~~ | ~~Decide on one pattern~~ | `[—]` keeping underline per D1 |
| 28 | Missing breadcrumbs on detail pages | Frontend rules say "Breadcrumbs on detail pages." Add below header on client detail, auth detail, session detail/edit. | `[ ]` |
| 29 | Non-functional search bar in header | Either implement Cmd+K command palette or remove the search bar to avoid false expectations | `[ ]` |
| 30 | `tracking-wide` vs `tracking-wider` inconsistency in dashboard table headers | Standardize to `tracking-wider` (matches section card title bars) | `[ ]` |
| 31 | Sidebar has no user name/role indicator | Show "Sarah Chen · BCBA" below the org switcher or in the header | `[ ]` |

---

## Decisions to Make

These items need a product decision before implementation:

| # | Question | Options | Decision |
|---|----------|---------|----------|
| D1 | **Filter style: underline tabs or pills?** | Underline is clean, already implemented. Pills match the wireframe more closely. | **Underline tabs.** Already consistent, more professional in Mira compact, less visual competition with metric cards. |
| D2 | **Client detail: 4 section cards or 2?** | Wireframe shows 2 (Insurance + Care Team). Current has 4 (+Guardian, +Details). Merging reduces scroll. | **2 cards.** Guardian moves to header, Details moves to Edit tab. Overview = metrics → Insurance + Care Team → Auth Services → Recent Sessions. |
| D3 | **Auth detail: separate Edit tab or keep form in Overview?** | Design system says no form-as-overview. But adding an Edit tab is scope. | **Read-only Overview + Edit tab.** Build KV-pair display, move form to Edit tab. Consistent with client detail. |
| D4 | **Personalized greeting: worth it?** | Nice touch but requires user name from Clerk. Low effort, small impact. | **Skip.** Greeting adds no information. Keep generic subtitle. |
| D5 | **Provider list metric cards: worth it?** | Every other list page has them. Consistency says yes. But providers are rarely visited. | **Skip.** Setup page, not daily workflow. False consistency. Revisit when credential tracking ships. |

---

*Created: 2026-03-25*
*Status: Ready for Design Pass 1*
