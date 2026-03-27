# Deep Technical Research: ABA Practice Management UI/UX

## Topic

**How should Clinivise design its UI/UX to decisively beat CentralReach, AlohaABA, and every other ABA practice management tool on usability, design quality, and practitioner satisfaction?**

This matters because ABA software is a uniquely frustrated market. Practitioners use these tools 6-8 hours per day, yet every major platform was designed as "forms in a browser" with enterprise complexity, inconsistent save behavior, and zero design ambition. SimplePractice proved that superior UX is a durable competitive moat in therapy PM. Clinivise's free-tier + % of collections model means we must win on product experience — users have no switching cost, so design quality is what keeps them.

This research synthesizes findings from 6 specialized research agents analyzing: ABA competitors, adjacent well-designed platforms, open source references, healthcare UX standards, architectural patterns, frontier/emerging trends, and UI/UX failure modes.

---

## Executive Summary

### The Opportunity

ABA software is stuck in 2012. CentralReach's inconsistent save behavior causes data loss. AlohaABA's reporting isn't customizable. RethinkBH can't edit data after entry. No competitor has a command palette, keyboard-first navigation, or AI-native design. The design bar is on the floor.

### The Strategy

Build a **data-dense, speed-obsessed, authorization-aware** interface that borrows patterns from Linear (information hierarchy), Mercury (financial data density), Stripe (billing UI), and SimplePractice (healthcare PM polish) — adapted to ABA-specific workflows.

### The 5 Bets

1. **Speed as a feature** — Session logging in < 30 seconds. Pre-fill everything. Cmd+K command palette. Keyboard-first.
2. **Authorization utilization as first-class citizen** — Progress bars everywhere, color-coded thresholds, proactive alerts at point of action.
3. **Zero data anxiety** — Auto-save with visible status. Optimistic UI. localStorage form persistence. Never lose work.
4. **Data density done right** — Mira compact style (12px base). Dense tables. Visual hierarchy through typography weight, not spacing.
5. **AI-native from day one** — Confidence-based displays, linked evidence, audit trails built into every AI interaction.

### The Biggest Risks

- Session timer drift in background browser tabs (use Web Workers)
- TanStack Query cache surviving org switches (data leak)
- Pre-fill errors creating incorrect billing submissions
- Double-submit on slow connections creating duplicate sessions
- Alert fatigue from authorization warnings

---

## Research Method

Six specialized agents conducted parallel research:

| Agent                    | Focus                                                  | Key Methods                                                   |
| ------------------------ | ------------------------------------------------------ | ------------------------------------------------------------- |
| **Competitive/Platform** | ABA competitors + adjacent well-designed platforms     | Web research on 15+ platforms, user reviews, UX analysis      |
| **Open Source/Repo**     | Well-designed OSS projects for UI inspiration          | GitHub analysis of 30+ repos, stack comparison                |
| **Documentation**        | Healthcare UX standards, ABA workflows, library docs   | ONC/NIST guidelines, BACB requirements, Context7 library docs |
| **Architecture/DX**      | Component patterns, state management, performance      | Next.js/TanStack/shadcn architectural research                |
| **Frontier/Emerging**    | Bleeding-edge UI patterns, AI integration, YC startups | Startup research, emerging pattern analysis                   |
| **Risk/Failure Mode**    | UI/UX failure modes, edge cases, safety risks          | EHR safety literature, healthcare IT hazard reports           |

---

## Official Documentation Findings

### Healthcare UI/UX Standards

**ONC Health IT Usability Guidelines** mandate that healthcare software follow user-centered design processes. The core principle: map actual workflows before building. Never automate paper-based processes as-is. For Clinivise, this means designing the session logging flow around how an RBT actually works (open timer → select client → document → stop → write note), not around the database schema.

**NIST GCR 15-996** (559 participants, 86 observations, 5 EHR usability tests) found that a usable EHR is a safe EHR. Critical finding: users reviewed up to 20 screens to verify medication context, and 72% were uncertain about dosages due to navigation. **Clinivise application:** every detail page must show client name, auth period, and utilization summary in a sticky header — never force navigation to verify context.

**Nielsen Norman Group** healthcare UX research confirms: when staff create paper workarounds, the interface has failed. Display contextually appropriate defaults. Never use ambiguous temporal references — always explicit dates.

**WCAG 2.2 / Section 508** non-negotiable requirements:

- 4.5:1 contrast ratio for standard text
- 3:1 for large text and non-text UI components
- Never rely on color alone — status indicators must combine at least 2 of: color, shape/icon, text

### ABA-Specific Workflow Documentation

**CPT Codes (2025):** All ABA codes (97151-97158, 0362T, 0373T) are time-based, billed in 15-minute units. CPT code selectors must filter by provider role (RBTs see 97152/97153/97154; BCBAs see 97151/97155-97158).

**CMS 8-Minute Rule:** 0-7 min = 0 units, 8-22 = 1, 23-37 = 2, 38-52 = 3, 53-67 = 4. Two methods: CMS (aggregate across codes, Medicare/Medicaid) vs AMA (per-code, commercial payers). Session timer must show: elapsed time, current billable units, next-unit threshold ("3 more min for next unit"), and color-code the threshold boundary.

**BACB 2025 Supervision Requirements:** 5% of RBT service hours/month minimum, 2+ contacts/month, at least 1 direct observation and 1 individual session per month, 60-day timeout triggers suspension risk. Software must auto-calculate compliance percentage and alert at 30/45/60 days.

**Session Note Requirements:** Required within 24-72 hours. Must include: client info, session details (date, times, units, CPT), provider info, clinical documentation (goals, interventions, data, progress). Workflow: Draft → Ready for Review → BCBA Reviewed → Submitted.

### Current Library Documentation (via Context7)

**TanStack Table v5:** Server-side pagination via `manualPagination`, faceted filtering via `getFacetedRowModel()`, column pinning via CSS `position: sticky`, virtual scrolling via `@tanstack/react-virtual` with `estimateSize: () => 33` for compact rows.

**React Hook Form:** `useFieldArray` for dynamic goals/interventions in session notes. `useWatch` for isolated re-renders on real-time unit calculations. `FormProvider` + `useFormContext` for multi-section forms without prop drilling.

**Tailwind CSS v4:** CSS-first config via `@theme` directive. Container queries built in (no plugin) — dashboard cards adapt to sidebar state. 5x faster full builds, 100x faster incremental.

**Recharts:** `ResponsiveContainer` required. Custom tooltips for healthcare context ("32 of 40 units"). Gradient areas via SVG `linearGradient`.

---

## Modern Platform and Ecosystem Patterns

### ABA Competitors — What They Get Wrong

| Competitor       | Rating | Key UX Failures                                                                                                                                           | Our Opening                         |
| ---------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **CentralReach** | 4.3/5  | Inconsistent save behavior (data loss), deep navigation trees, frequent auto-logouts deleting unsaved data, 87% of users report advanced feature problems | Over-engineered for small practices |
| **AlohaABA**     | 4.9/5  | No unique client identifier, non-customizable dashboards, cumbersome note navigation, slow                                                                | Simple but limited depth            |
| **RethinkBH**    | —      | Cannot edit data after entry, non-existent customer service, doesn't scale, mobile app unreliable                                                         | Critical data integrity gap         |
| **Motivity**     | —      | PM features still maturing, $48/learner all-in-one pricing                                                                                                | Clinical-first, PM second           |
| **Raven Health** | —      | New/unproven at scale, limited integrations, % of collections can get expensive                                                                           | Validates our pricing model         |

**Theralytics** (4.8/5, 98% satisfaction) is the small-practice benchmark: built by BCBAs, billing pulls from session data automatically, progress graphs update in real-time, transparent pricing ($15/user/month). We must match this baseline.

**Passage Health** has the pattern we must steal: **authorization-aware scheduling** that prevents booking beyond approved hours. Prevents the #1 billing pain point at the scheduling stage rather than catching denials after the fact.

### Adjacent Well-Designed Platforms

**SimplePractice** — Gold standard for therapy PM UX. Private design system with 20+ accessible components. Dashboard requires zero training. Proves that "modern, intuitive interface" is a competitive moat in healthcare.

**Jane App** — Best-in-industry design for physiotherapy PM. Color-coded scheduling that's visually scannable at a glance. "Calming" interface philosophy — healthcare should feel trustworthy, not overwhelming.

**Linear** — Gold standard for dense data UI:

- **Warm neutrals** (shifted from cool blue-gray to warmer gray — "crisp but less saturated")
- **Minimal accent color** (monochrome + meaningful status colors only)
- **Keyboard-first** (C to create, Cmd+K command palette, x to select)
- **Redesigned filter system** with include/exclude logic
- **Data-dense sortable/filterable tables** as default view

**Mercury** — Financial data density done right. 367 UI screens, 112 components. Single-snapshot dashboard with all funds visible at a glance. AI-powered categorization.

**Stripe Dashboard** — Blueprint for billing UI. Business-at-a-glance overview charts linking to deeper areas. Constrained component system maintains consistency.

**Vercel Dashboard** — Performance-first design. Optimistic UI showing expected states immediately. Empty states as actionable commands. Geist design system prioritizing clarity, speed, and information density over decoration.

### Design Decisions Validated by Research

| Decision                            | Validated By                  | Rationale                                           |
| ----------------------------------- | ----------------------------- | --------------------------------------------------- |
| Mira compact typography (12px base) | Linear, Retool, Tremor        | Data-dense interfaces need compact type             |
| Warm neutral palette                | Linear 2025 refresh           | Warmer grays feel crisp but calmer for all-day use  |
| Minimal accent color                | Linear, Stripe                | Color should be meaningful (status), not decorative |
| Skeleton loaders over spinners      | SimplePractice, Vercel        | 30% faster perceived performance                    |
| Sidebar navigation                  | Linear, Stripe, all ABA tools | Standard for PM tools; collapsible for mobile       |
| `tabular-nums` on financial data    | Mercury, Stripe               | Alignment of monetary values in columns             |

---

## Relevant Repos, Libraries, and Technical References

### Priority 1 — Near-Identical Stack (use as primary references)

**next-shadcn-dashboard-starter** (Kiranism)

- GitHub: https://github.com/Kiranism/next-shadcn-dashboard-starter | 6.1k stars
- Stack: Next.js 16, React 19, TypeScript, shadcn/ui, Tailwind CSS v4, Clerk, TanStack Data Tables, React Hook Form, Zod, Recharts, Zustand, Nuqs, Sentry
- Why it matters: Nearly identical stack to Clinivise. Reference for RBAC sidebar with Clerk Organizations, feature-based folder structure, data table patterns with Nuqs URL state.

**shadcn-table (tablecn)** (sadmann7)

- GitHub: https://github.com/sadmann7/shadcn-table | 6k stars | Demo: https://tablecn.com/
- Stack: Next.js, shadcn/ui, TanStack React Table, Drizzle ORM, PostgreSQL, Zod
- Why it matters: Definitive server-side data table with our exact DB stack. Notion/Airtable-style faceted filters, Linear-style compact filters, skeleton loading, bulk action bar.

### Priority 2 — Domain-Relevant Patterns

**Midday** (midday-ai)

- GitHub: https://github.com/midday-ai/midday | 14.1k stars
- Stack: TypeScript, Next.js, React, Tailwind CSS, shadcn/ui, Supabase
- Why it matters: 232 dashboard components including time tracking (`tracker-calendar`, `tracker-timer`, `tracker-schedule`) and invoicing. UI package extends shadcn with `currency-input`, `date-range-picker`, `quantity-input`, `time-range-input` — all directly useful for our forms.

**Medplum**

- GitHub: https://github.com/medplum/medplum | 2.2k stars | Last active: March 2026
- Stack: TypeScript, React, Node.js, PostgreSQL, FHIR
- Why it matters: Healthcare-specific React components: `PatientTimeline`, `Scheduler`, `CodingInput` (CPT code entry), `MoneyInput`, `SearchControl`. Timeline pattern is perfect for client history and audit trail.

**Tremor** (acquired by Vercel, Jan 2025)

- GitHub: https://github.com/tremorlabs/tremor | 3.3k stars
- Stack: TypeScript, React, Tailwind CSS, Radix UI
- Why it matters: 39 dashboard components. `CategoryBar` is perfect for authorization utilization (colored segments at 80%/95%/100% thresholds). `SparkChart` enables inline mini-charts in table cells. `Tracker` visualizes session attendance patterns.

### Priority 3 — Architectural Patterns

**Cal.com** — 40.6k stars. Scheduling UI patterns, `Empty-Screen` component, `Organization-Banner` for multi-tenant display.

**Documenso** — 12.5k stars. Document workflow (upload → configure → sign → track) parallels authorization workflow. Study status tracking and audit trail patterns.

**OpenStatus** — 8.5k stars. Uses Drizzle ORM + shadcn/ui. Status visualization with uptime indicators (adapt for auth utilization). React Table type augmentation.

**Plane** — 46.8k stars. Open source Linear alternative. Multi-view organization (list, kanban, calendar). Customizable filters. Command menu implementation.

**shadcn-admin** (satnaing) — 11.5k stars. 10+ pages, global command search, modified shadcn components.

**Lago** — 9.4k stars. Billing dashboard patterns, invoice UI, usage metering visualization.

### Priority 4 — Utility References

**Dub** — 23.2k stars. Next.js + Upstash Redis rate limiting integration (same as our stack).

**Refine** — 34.3k stars. Headless React admin framework. Hooks-based CRUD abstractions.

**Kimai** — 4.6k stars. Time tracking domain model: multi-timer, punch-in/out, money+time budgets, user-specific rates.

---

## Architecture Options

### Option A: Server Component First with Surgical Client Boundaries (Recommended)

**Overview:** Server Components by default. `'use client'` only for interactivity, hooks, or browser APIs. Data flows from Server Component (page) → Suspense boundary → async Server Component (data loader) → Client Component (interactive table/form receiving data as props).

**Component tier model:**

```
Tier 1: shadcn/ui primitives (never modify)
Tier 2: Domain wrappers (thin, adds domain semantics — CurrencyInput, CptCodeSelect)
Tier 3: Composed patterns (DataTable, FormField, MetricCard)
Tier 4: Page sections (ClientTable, SessionForm, DashboardMetrics)
```

**Three-tier state management:**

```
Tier 1: SERVER STATE    → TanStack Query (cache, refetch, optimistic updates)
Tier 2: URL STATE       → nuqs (table filters, pagination, search, selected tab)
Tier 3: EPHEMERAL STATE → React useState (modal open, form inputs, hover, focus)
```

- **Strengths:** Zero client JS for data display pages. TanStack Query + nuqs + useState covers every need — no Zustand, no Redux. Skeletons + Suspense streaming gives instant perceived performance. Server Components simplify data fetching (just `await`).
- **Weaknesses:** More files to create (skeleton per async component). Requires discipline on the server/client boundary.
- **Complexity cost:** Low-medium. The boundary decisions become intuitive quickly.
- **Scaling:** Excellent. Server Components mean flat bundle sizes regardless of page count.
- **Maintainability:** Strong. Data always flows one direction. No global store to reason about.
- **DX:** Good. The only question per component is "does this need `'use client'`?" Feature folders keep everything colocated.

### Option B: Client-Heavy with TanStack Query Everywhere

**Overview:** Client Components for all interactive pages. TanStack Query handles all data fetching. Server Components only for the outermost layout shell.

- **Strengths:** Simpler mental model (everything is a client component). Rich ecosystem of client-side patterns.
- **Weaknesses:** Larger bundle sizes. All data fetching logic ships to the client. More loading states to manage. Doesn't leverage React 19 / Next.js 16 capabilities.
- **When appropriate:** Legacy projects migrating from pages router, or teams unfamiliar with Server Components.

### Option C: Full-Stack RSC with Server Actions Only (No TanStack Query)

**Overview:** Pure Server Components with server actions for mutations. No client-side cache layer.

- **Strengths:** Minimal client JavaScript. Maximum simplicity.
- **Weaknesses:** No optimistic updates. No client-side cache. Every navigation is a full server round-trip. Poor perceived performance for data-dense interactions. No prefetching.
- **When appropriate:** Content-heavy sites with minimal interactivity. Not appropriate for a PM tool.

**Recommendation: Option A.** It balances Server Component performance with TanStack Query's cache and optimistic update capabilities, which are essential for a data-dense PM tool used 6-8 hours per day.

### Data Table Architecture

**Recommended: Composable DataTable with Context Provider + URL State**

```
src/components/shared/data-table/
  data-table.tsx              # Main component + DataTableProvider context
  data-table-content.tsx      # Table body rendering
  data-table-toolbar.tsx      # Search + filter bar
  data-table-pagination.tsx   # Pagination controls
  data-table-column-toggle.tsx # Column visibility
  data-table-bulk-actions.tsx # Floating bulk action bar
  data-table-skeleton.tsx     # Loading skeleton
  use-data-table.ts           # Hook that creates the table instance
```

Usage: compound composition pattern where sub-components access the TanStack Table instance via context:

```tsx
<DataTable data={clients} columns={columns}>
  <DataTable.Toolbar>
    <DataTable.Search column="name" placeholder="Search clients..." />
    <DataTable.FilterDropdown column="status" options={AUTH_STATUSES} />
  </DataTable.Toolbar>
  <DataTable.Content />
  <DataTable.Pagination />
</DataTable>
```

**Client-side vs server-side decision:** < 200 rows = client-side filtering/sorting. 200+ rows = server-side pagination with nuqs URL state. Virtual scrolling only for audit trail (1000+ rows) — add later if measured.

### Form Architecture

**Recommended: React Hook Form + Zod v4 + FormProvider for multi-section forms**

Auto-save strategy per form type:
| Form Type | Strategy |
|-----------|----------|
| Session notes (text) | Auto-save, 2s debounce |
| Session metadata (date, CPT, time) | Explicit save |
| Client intake, authorization services | Explicit save |
| Quick status updates | Optimistic + explicit |

Form data loss prevention: persist dirty form state to `localStorage` on field change. Restore on page reload. Show `beforeunload` warning for unsaved changes.

### Dashboard Architecture

**Recommended: Staggered Suspense Streaming**

```
Dashboard Page (Server Component)
  [immediate]  PageHeader
  [Suspense]   MetricCards (4 KPIs, grouped)
  [Suspense]   TodaySessions (independent stream)
  [Suspense]   AuthAlerts (independent stream)
  [Suspense]   RecentActivity (independent stream)
```

Each section is an async Server Component that fetches its own data. Related widgets share a Suspense boundary; independent sections stream independently. Charts wrapped in `next/dynamic` with `ssr: false`.

---

## Recommended Approach for Our Platform

### The Clinivise Design Blueprint

**Design Philosophy: "Anti-CentralReach"**

Every design decision should answer: "Would a frustrated CentralReach user feel relief when they see this?" The three emotional responses we're designing for:

1. **"This is fast"** — session logging < 30 seconds, pre-filled forms, Cmd+K navigation
2. **"I can see everything I need"** — data-dense tables, inline auth utilization, sticky context headers
3. **"My work is safe"** — visible save state, auto-save, form persistence, optimistic UI with clear rollback

### 10 Priority Design Patterns to Implement

**1. Authorization-Aware Everything (from Passage Health)**
Check remaining authorized hours before booking sessions. Show utilization inline on every client, session form, and dashboard. Block over-scheduling at the point of action, not after denial. This is our signature UX element.

**2. Auto-Save with Visible State (differentiator vs CentralReach)**
CentralReach's inconsistent save behavior is their most-cited UX failure. Clinivise: auto-save all text inputs (2s debounce). Show "Saved"/"Saving..."/"Unsaved changes" indicator on every form. Persist drafts to localStorage. Never let a logout, crash, or navigation lose work.

**3. Cmd+K Command Palette (from Linear, already in our stack)**
Global search/action interface. No ABA competitor has this. Search clients, providers, authorizations. Execute actions ("New session for Jordan," "Check auth 97153"). Built on shadcn Command (cmdk) — already installed.

**4. Pre-Fill Everything with Visual Distinction (from NN/g, CMS documentation)**
Every form pre-fills from context: today's date, current provider, last-used CPT code, last-used location. Pre-filled values get a subtle visual indicator so users can verify or override. If before 10 AM, prompt "Today's or yesterday's session?"

**5. Data-Dense Tables with Inline Status (from Linear, tablecn)**
Compact TanStack Table rows with: `py-2 px-3 text-xs`, `tabular-nums` on numerics, inline status badges (color + icon + text, never color alone), sortable/filterable columns, server-side pagination for large datasets, URL-based filter state via nuqs.

**6. Dashboard with North Star Metrics (from Mercury, Stripe)**
Top-left quadrant: total collected revenue (or key phase-appropriate metric). Supporting: outstanding claims, denial rate, auth utilization %, sessions this week. Each metric links to detail view. F-pattern scanning. Staggered Suspense streaming.

**7. Role-Specific Information Density**
| Role | View Complexity | Primary Dashboard |
|------|----------------|-------------------|
| RBT | Simple — 4 nav items | Today's schedule + quick session log |
| BCBA | Rich — 8 nav items | Caseload overview + auth status + supervision compliance |
| Billing Staff | Dense — billing section | Claims queue + denials + aging reports |
| Admin/Owner | High-level — all sections | Financial metrics + staff utilization |

**8. Session Timer in Web Worker (risk mitigation)**
Chrome throttles `setInterval` to 1-minute resolution in background tabs. RBTs switch between apps during sessions. Use a Web Worker for the timer. Calculate elapsed from `Date.now() - startTime`, not counter increment. Reconcile on `visibilitychange`.

**9. Redundant Status Encoding (from WCAG, Carbon DS)**
Every status indicator combines color + icon + text label. Authorization utilization: progress bar + percentage text + status label ("Nearing limit") + icon. This serves colorblind users (8% of males) and meets WCAG 2.2.

**10. Optimistic UI for Speed, Explicit Save for Safety**
| Action Type | Pattern |
|-------------|---------|
| Status updates, toggles | Optimistic update |
| Session metadata save | `isPending` loading state, confirm from server |
| Session note text | Auto-save (silent) |
| Claim submission | Explicit confirmation, no optimistic |
| Destructive actions | Confirmation dialog |

### Component Architecture Summary

```
src/
├── components/
│   ├── ui/                    # Tier 1: shadcn/ui primitives (never modify)
│   ├── shared/                # Tier 2: Reusable building blocks
│   │   ├── data-table/        # Composable DataTable with Context
│   │   ├── money.tsx          # <Money> component (string → formatted, no Number())
│   │   ├── status-badge.tsx   # CVA variants: success/warning/error/info/neutral
│   │   ├── empty-state.tsx    # Icon + message + CTA
│   │   ├── stat-card.tsx      # Metric card with sparkline
│   │   └── page-header.tsx    # Title + breadcrumbs + actions
│   ├── clients/               # Tier 3: Domain components
│   ├── authorizations/
│   ├── sessions/
│   ├── dashboard/
│   └── layout/                # Sidebar, app shell
├── hooks/
│   ├── use-permission.ts      # RBAC check hook
│   ├── use-auto-save.ts       # Generic auto-save with debounce
│   └── use-unsaved-changes.ts # beforeunload warning
└── lib/
    ├── query-keys.ts          # TanStack Query key factory
    ├── status-map.ts          # Domain status → visual variant mapping
    └── constants.ts           # Enum values as const arrays
```

### State Management (No Extra Libraries)

```
SERVER STATE  → TanStack Query  (cache, refetch, optimistic updates, polling)
URL STATE     → nuqs            (table filters, pagination, search, active tab)
FORM STATE    → React Hook Form (form inputs, validation, dirty tracking)
LOCAL STATE   → React useState  (modals, hover, focus, ephemeral UI)
```

No Zustand. No Redux. No Jotai. Three concerns, three built-in solutions plus React's own state.

### Performance Targets

| Metric                    | Target                 |
| ------------------------- | ---------------------- |
| First Load JS per route   | < 100KB                |
| Shared JS (framework)     | < 85KB                 |
| FCP                       | < 1.0s                 |
| LCP                       | < 2.0s                 |
| INP                       | < 200ms                |
| Session log form → submit | < 30 seconds user time |

---

## Frontier and Emerging Patterns

### Adopt Now (Phase 1)

**Command Palette (Cmd+K)** — Production-proven (Linear, Vercel, Ramp). shadcn Command component already installed. Index clients, providers, authorizations. Add quick-create actions. No ABA competitor has this.

- _Maturity:_ Production-proven in SaaS, early-adopter in healthcare
- _Complexity:_ Low-medium (cmdk handles the hard parts)
- _Competitive advantage:_ High — makes Clinivise the only keyboard-first ABA tool

**Confidence-Based AI Display** — When parsing authorization letters with AI, show confidence scores on extracted fields. High-confidence auto-fills; low-confidence highlights for manual review. Each field clickable to see source text. Pattern used by Abridge ("Linked Evidence"), GitHub Copilot (ghost text), and agentic-design.ai pattern library.

- _Maturity:_ Production-proven (Copilot pattern), early-adopter (healthcare confidence routing)
- _Complexity:_ Medium
- _Competitive advantage:_ High — AI-native from day one vs. competitors bolting AI on later

**Inline Sparklines & Micro-Charts** — Tremor's `SparkChart` and `CategoryBar` components. Auth utilization progress bars with colored thresholds. Inline trend charts in table cells. Revenue sparklines in dashboard cards.

- _Maturity:_ Production-proven (Tremor acquired by Vercel)
- _Complexity:_ Low (Tremor components are Tailwind-native)

**Proactive Authorization Alerts at Point of Action** — Not just dashboard widgets. When logging a session: "3 units remaining on this auth." When scheduling: "Auth expires in 7 days." Tiered: 80% = subtle badge, 95% = inline banner, 100%+ = blocking modal.

- _Maturity:_ Production-proven concept, poorly implemented in ABA tools
- _Competitive advantage:_ Very high — no competitor surfaces this intelligence contextually

**Role-Based UI Density** — RBT dashboard = simplified session focus. BCBA dashboard = data-rich analysis. Not adaptive AI — role-based layout configuration using existing RBAC.

- _Maturity:_ Production-proven
- _Complexity:_ Medium (role-conditional rendering, multiple dashboard layouts)

### Design For Later (Phase 2-3)

**Ambient Voice Documentation** — RBTs capture voice during sessions → AI generates structured notes post-session. Used by Suki AI (76% documentation time reduction), Abridge (#1 Best in KLAS for Ambient AI), Raven Health (voice-to-text notes). Build the `lib/ai.ts` wrapper now with a "transcript → structured note" pipeline in mind.

- _Maturity:_ Production-proven (medical STT APIs), early-adopter (ABA-specific)
- _Target:_ Phase 2-3

**PWA / Offline Session Logging** — RBTs in the field need offline data entry. Serwist for Next.js PWA, IndexedDB + Background Sync achieves 99.8% sync success across 500K+ healthcare users. Design session data model with "unsynced" state now.

- _Maturity:_ Production-proven (PWA APIs), medium (healthcare offline)
- _Target:_ Phase 2

**Dark Mode** — Foundation already in place (OKLCH semantic tokens, dark mode CSS variables in globals.css). When ready, it's a CSS variable swap.

- _Maturity:_ Production-proven
- _Target:_ Phase 2 (low effort if semantic tokens are consistent — they are)

**Real-Time Presence** — "Dr. Smith is viewing Jordan's auth." Liveblocks for React/Next.js provides ready-made infrastructure. Foundation is the audit log (Phase 1).

- _Target:_ Phase 2-3

### Watch (Phase 3+)

**Progressive AI Autonomy** — AI gains independence gradually as trust builds. Gartner predicts 40% of enterprise apps embed AI agents by end of 2026.

**Anticipatory Navigation** — Dashboard personalizes based on usage patterns. "Recently viewed" and "frequent actions" in command palette are low-hanging fruit.

**Full Multiplayer Collaboration (Liveblocks)** — Overkill for small practices in Phase 1.

### Key Competitor to Watch: Raven Health

Founded by a BCBA, mobile-first, free + managed billing (% of collections). Validates our exact model. Their weaknesses: billing/revenue cycle depth (our Phase 2 advantage) and limited integrations. Monitor their feature development closely.

---

## Opportunities to Build Something Better

### 1. Authorization Tracking That Actually Prevents Denials

**Gap:** No competitor connects authorization data to scheduling AND session logging AND billing in a way that prevents over-utilization before it happens. CentralReach tracks auths but doesn't block over-scheduling. AlohaABA doesn't connect auths to scheduling at all.

**Our advantage:** Auth-aware everything. The utilization bar is our signature UI element — visible on client detail, session form, schedule view, and dashboard. Block actions that would exceed authorized units. Show remaining units at every decision point.

### 2. Save-State Consistency That Builds Trust

**Gap:** CentralReach's inconsistent auto-save/manual-save behavior is their most-cited UX failure. Users report data loss from crashes, auto-logouts, and navigation during unsaved edits.

**Our advantage:** Consistent save behavior everywhere. Auto-save for text (visible "Saved" indicator). Explicit save for structured data. localStorage form persistence. `beforeunload` warning. The rule is simple and universal: Clinivise never loses your work.

### 3. Keyboard-First Power User Navigation

**Gap:** No ABA competitor has a command palette, keyboard shortcuts for common actions, or any concept of "power user" workflows. Every action requires mouse navigation through menus.

**Our advantage:** Cmd+K command palette (already in stack via shadcn Command). Keyboard shortcuts for navigation and common actions. Tab through form fields, Enter to submit. This alone makes Clinivise feel 5 years ahead.

### 4. AI-Native Design vs. Bolt-On AI

**Gap:** Competitors adding AI as a feature (Raven Health AI notes, Alpaca Health AI treatment plans). The AI is a separate workflow — click a button, wait, get output.

**Our advantage:** AI integrated into the natural workflow. Auth letter parsing shows confidence scores inline. Session note suggestions appear as ghost text. Utilization predictions surface as proactive alerts. The AI isn't a feature — it's how the product works.

### 5. Session Logging Speed

**Gap:** CentralReach requires "several clicks" for basic operations. AlohaABA note navigation is "cumbersome." RethinkBH can't edit data after entry.

**Our advantage:** Pre-fill everything from context (provider, date, CPT, location). Timer with real-time unit calculation. One-tap submit. Edit/correct at any time with audit trail. Target: < 30 seconds from open to submitted.

### 6. Supervision Compliance Dashboard

**Gap:** No competitor provides a dedicated BCBA supervision compliance view that auto-calculates the 5% threshold, tracks contact frequency, flags observation gaps, and alerts at 30/45/60 day timeouts.

**Our advantage:** Pull supervision data from session logs automatically. Show compliance percentage per RBT. Alert BCBAs before deadlines are missed. This prevents BACB certification issues — a high-anxiety concern for BCBAs.

---

## Risks, Gaps, and Edge Cases

### Critical Severity (9 items — must address before shipping)

| ID   | Risk                                                                                                                                                                                       | Likelihood | Mitigation                                                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R2.5 | **Session timer drift** in background browser tabs — Chrome throttles `setInterval` to 1-min resolution. RBTs switch apps during sessions. Timer shows wrong elapsed time → wrong billing. | High       | Web Worker for timer. Calculate from `Date.now() - startTime`, not counter increment. Reconcile on `visibilitychange`.                                                |
| R7.1 | **TanStack Query cache survives org switch** — consultant BCBA switches orgs, cache still shows previous org's data. Data leak.                                                            | High       | `queryClient.clear()` on org switch. `orgId` in every query key. Integration test for cross-org data isolation.                                                       |
| R4.4 | **Double-submit on slow connections** — RBT clicks Save, nothing happens, clicks again. Two sessions created, double-billing.                                                              | High       | Disable button + `isPending` spinner on click. Server-side idempotency keys (generated client-side on form mount).                                                    |
| R5.3 | **Data loss from poor network** — RBT finishes home-visit session, saves, request fails (dead zone), closes tab thinking it saved.                                                         | High       | Persist form state to localStorage on field change. Persistent (non-dismissible) error banner on failure. Retry queue on `navigator.onLine` change.                   |
| R2.1 | **CMS vs AMA unit calculation confusion** — UI shows units using one method, payer expects the other. Claim denied.                                                                        | High       | Show active calculation method label on every unit display. Live unit calculator during session entry. Warning when aggregation method differs from payer preference. |
| R2.2 | **Auth unit tracker stale data** — RBT sees "12 remaining," another RBT already consumed 10. Over-utilization.                                                                             | High       | 30-second TanStack Query stale time for auth data. "Last updated" timestamp. Refresh button. Atomic SQL increments prevent DB-level corruption.                       |
| R1.1 | **Wrong-field data entry** — dense forms cause entry in wrong CPT code row or wrong client record.                                                                                         | High       | Visual grouping with section headers. Active-field left-border accent. Persistent client name header on all forms.                                                    |
| R7.3 | **URL manipulation → cross-org data access** — shared URL with resource ID, server-side org filter has a bug.                                                                              | Medium     | Every server fetch filters by `organization_id` from session. Generic 404 for cross-org resources (never "access denied"). Automated cross-org access tests.          |
| R7.4 | **Clerk orgId null on server** — documented edge case where `auth()` returns `userId` but null `orgId`.                                                                                    | Medium     | Hard-fail in `authActionClient` on null `orgId`. Redirect to org selection page. Explicit null check in all server components.                                        |

### High Severity (17 items — significant UX/operational impact)

| ID   | Risk                                                    | Mitigation                                                                                                                                                       |
| ---- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1.3 | Alert fatigue on auth warnings                          | Tiered presentation: 80% = subtle badge, 95% = inline banner, 100%+ = blocking modal. Never toast for auth alerts.                                               |
| R4.1 | Pre-fill errors creating wrong submissions              | Visual distinction on pre-filled values. "Today's or yesterday's?" prompt before 10 AM.                                                                          |
| R4.3 | Multi-tab editing conflict (last write wins)            | Optimistic concurrency: `updated_at` comparison before save. Conflict resolution UI.                                                                             |
| R3.1 | Row selection lost across pagination                    | Store selections by row ID. Show persistent selection count banner.                                                                                              |
| R5.1 | Virtual keyboard hiding input on tablet                 | `scrollIntoView({ block: 'center' })` on focus. Action buttons at top, not bottom.                                                                               |
| R5.2 | Touch targets too small in compact Mira UI              | `min-h-11 min-w-11` (44px) on all interactives. `pointer: coarse` media query for tablet adjustments.                                                            |
| R6.1 | Red/green invisible to colorblind (8% of males)         | Never color alone. Every status: color + icon + text label. Test with Chrome DevTools colorblind simulator.                                                      |
| R8.2 | Billing status confusion → double-billing               | Strict state machine. Timestamps + reasons on state transitions. Block duplicate claims for same service dates + CPT + client.                                   |
| R9.1 | Toast used for critical errors (auto-dismisses, missed) | Toasts for success only. Inline persistent banners for errors. Modals for critical failures.                                                                     |
| R9.2 | Timezone/DST boundary → wrong session date              | Store UTC with timezone. Derive session date from start time in org's timezone. Never `new Date()` for date-only values.                                         |
| R9.4 | Optimistic update reverts silently after navigation     | Global persistent notification for failed mutations. Failed-mutation retry queue. No optimistic updates for critical mutations (session save, claim submission). |
| R9.5 | Stale form data overwrites concurrent edit              | Compare `dataUpdatedAt` against form load timestamp. Show merge warning if underlying data changed during edit.                                                  |
| R6.2 | TanStack Table not accessible to screen readers         | Semantic `<table>` markup. `aria-sort` on sortable headers. `aria-live` for filter results.                                                                      |
| R2.3 | FIFO auth selection billing wrong auth                  | Show which auth will be used on session form. Visual split if units cross two auths. Manual override with audit trail.                                           |
| R7.2 | Browser back button shows previous org data             | `Cache-Control: no-store` on authenticated pages. Full page reload on org switch.                                                                                |
| R8.1 | Floating point display errors on monetary values        | Never convert monetary strings to `Number()`. `<Money>` component formats from string. Lint rule banning `parseFloat()`/`Number()` on money.                     |
| R1.4 | Copy-paste propagating errors across notes              | Pre-fill templates with dynamic data. Flag notes >80% identical to previous session. "Copied from" provenance indicator.                                         |

### Medium Severity (9 items)

| ID   | Risk                                             | Mitigation                                                                                              |
| ---- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| R3.2 | Active filters not visually obvious              | "Showing 12 of 85 (3 filters)" with "Clear all" button. Never hide total count.                         |
| R7.5 | RBAC UI shows then blocks forbidden actions      | `usePermission()` hook. Conditionally render (not just disable). Shared permission map.                 |
| R9.3 | Neon cold start (3-5s) perceived as broken       | Skeleton UI via Suspense. Consider warming endpoint during business hours.                              |
| R9.6 | Audit log volume degrades performance            | Partition by month. Separate indexes. Log only mutations in Phase 1.                                    |
| R8.3 | Sum-of-parts ≠ total from independent rounding   | Calculate totals from unrounded values. "Largest remainder" rounding. Tests for 3+ line items.          |
| R3.4 | Bulk action on wrong row set after filter change | Clear selection on filter change. List affected items in confirmation dialog.                           |
| R4.2 | Validation timing causing partial data loss      | `mode: 'onBlur'` for fields, `mode: 'onSubmit'` for cross-field. Never clear valid fields on re-render. |
| R5.4 | Orientation change breaks form layout            | Controlled components (RHF handles this). Test both orientations. Pin scroll position.                  |
| R4.5 | Required fields not visually distinct            | Red asterisk on required, "(optional)" text on optional.                                                |

### Prioritized Action Items

**Before writing any UI code:**

1. Create `<Money>` component (string → formatted, no `Number()` conversion)
2. Create `usePermission()` hook with shared permission map
3. Establish org-switch cleanup (`queryClient.clear()` on Clerk org change)
4. Design session timer using Web Workers
5. Define error display strategy: toasts for success only, banners for errors, modals for critical

**During each feature sprint:**

- Every data table: semantic HTML, `aria-sort`, filter count, null handling
- Every form: pre-fill visual distinction, blur validation, dirty tracking, localStorage persistence
- Every status indicator: color + text + icon triple encoding
- Every mutation: rollback tested, persistent failure notification if user navigates away

---

## Recommended Technical Direction

### Design Pattern

Data-dense, Mira-compact interfaces with three-level visual hierarchy (primary/secondary/tertiary). Progressive disclosure: glance → scan → drill-down. Authorization utilization as first-class visual element.

### Architecture

Server Components first. Composable DataTable with Context Provider. Three-tier state (TanStack Query + nuqs + useState). Staggered Suspense streaming for dashboards. FormProvider for multi-section forms.

### Libraries/Tools

- Add: `nuqs` (URL state management) — only new dependency needed
- Existing: TanStack Query, TanStack Table, React Hook Form, Zod v4, Recharts, shadcn/ui, Sonner
- Consider: Tremor spark chart components (for inline micro-charts)

### Implementation Approach

1. **App shell first** — Sidebar + page header + Cmd+K palette. Establishes navigation pattern.
2. **Client list table** — First real data-dense screen. Establishes DataTable compound component pattern.
3. **Dashboard** — Suspense streaming + metric cards + auth alerts. Establishes dashboard pattern.
4. **Session logging form** — Pre-fill + timer (Web Worker) + auto-save + unit calculation. The highest-frequency action.
5. **Authorization detail** — Utilization bar + service breakdown + alert banners. The signature UX element.

### What to Do Now

- Install `nuqs`
- Build `<Money>`, `<StatusBadge>`, `<EmptyState>` shared components
- Build `usePermission()`, `useAutoSave()`, `useUnsavedChanges()` hooks
- Build composable DataTable with Context Provider
- Define query key factory in `lib/query-keys.ts`
- Define status → variant mapping in `lib/status-map.ts`
- Add semantic status color tokens to `globals.css` `@theme inline`

### What to Defer

- Virtual scrolling (until audit trail table proves it's needed)
- PWA/offline support (Phase 2)
- Voice input (Phase 2-3)
- Dark mode (Phase 2, but semantic tokens make it trivial)
- Real-time presence (Phase 2-3)
- WebSocket infrastructure (polling is sufficient for ABA data frequency)

### What to Avoid

- Global state libraries (Zustand, Redux, Jotai) — not needed
- Custom UI primitives when shadcn components exist
- Inline table editing for financial/billing data (use modal/sheet)
- `loading.tsx` in dashboard routes (blocks entire page — use component Suspense)
- Optimistic updates for critical mutations (session save, claim submission)
- Toast notifications for errors (auto-dismiss = missed errors)
- Arbitrary Tailwind values (`text-[13px]`, `p-[7px]`)
- `parseFloat()` or `Number()` on monetary values

---

## Open Questions

1. **Should we add Tremor as a dependency for spark charts?** It's Tailwind-native and Vercel-backed (acquired Jan 2025), but adds bundle size. Alternative: build minimal sparkline component with Recharts.

2. **nuqs vs native `useSearchParams` for URL state?** nuqs provides type safety and serialization. Native is simpler but requires manual parsing. Recommendation: nuqs, but worth validating with Next.js 16.2 compatibility.

3. **Should session timer persist across page navigation?** If the RBT navigates away from the session page while a timer is running, should the timer continue? This requires global state (context or URL) for the active timer. Recommendation: yes, timer should be global — RBTs may check authorizations or client info mid-session.

4. **Auto-save granularity for session notes** — Save per field change or per "section" completion? Per-field is safer but creates more network traffic. Recommendation: debounce at 2 seconds, save the entire form state, not individual fields.

5. **Offline strategy for Phase 2** — Serwist (service worker) vs. native IndexedDB with manual sync? Serwist is recommended by Next.js docs, but adds complexity. Recommendation: research further when approaching Phase 2.

6. **Should we implement column visibility persistence?** Users who customize table columns expect their preferences to persist. This requires either localStorage or a user preferences table. Recommendation: localStorage for Phase 1, migrate to DB-backed preferences later.

---

## Sources and References

### Official Documentation

- [ONC Health IT Playbook — Usability](https://playbook.healthit.gov/playbook/full/)
- [ONC Usability and Provider Burden](https://healthit.gov/usability-and-provider-burden/)
- [NIST GCR 15-996 — Health IT User Interface Design](https://nvlpubs.nist.gov/nistpubs/gcr/2015/NIST.GCR.15-996.pdf)
- [WCAG 2.2 SC 1.4.3 — Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [Section 508](https://www.section508.gov/)
- [BACB RBT Ongoing Supervision Fact Sheet](https://www.bacb.com/rbt-ongoing-supervision-fact-sheet/)
- [ABA Coding Coalition — CPT Codes](https://abacodes.org/codes/)
- [CMS 8-Minute Rule — Medstates](https://www.medstates.com/8-minute-rule-therapy/)
- [CMS 8-Minute Rule — PROMBS 2026 Guide](https://prombs.com/8-minute-rule-therapy-billing-guide/)
- [Chrome Timer Throttling (Chrome 88)](https://developer.chrome.com/blog/timer-throttling-in-chrome-88)
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps)

### Healthcare UX Research

- [Nielsen Norman Group — Medical Usability](https://www.nngroup.com/articles/medical-usability/)
- [PMC — Heuristics for Clinical Decision Support](https://pmc.ncbi.nlm.nih.gov/articles/PMC5333283/)
- [PMC — EHR Usability Challenges and Documentation Burden](https://pmc.ncbi.nlm.nih.gov/articles/PMC12206486/)
- [AMA — 7 EHR Usability Safety Challenges](https://www.ama-assn.org/practice-management/digital-health/7-ehr-usability-safety-challenges-and-how-overcome-them)
- [ECRI — Top 10 Patient Safety Concerns 2025](https://home.ecri.org/blogs/ecri-thought-leadership-resources/top-10-patient-safety-concerns-2025)
- [ECRI — Top 10 Health Technology Hazards 2026](https://home.ecri.org/blogs/ecri-thought-leadership-resources/top-10-health-technology-hazards-for-2026-executive-brief)
- [AHRQ PSNet — EHR Copy and Paste](https://psnet.ahrq.gov/perspective/ehr-copy-and-paste-and-patient-safety)
- [Carbon Design System — Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/)

### ABA Industry

- [AlohaABA — CPT Code Guide](https://alohaaba.com/blogs/understanding-cpt-codes-for-aba-therapy-billing-a-comprehensive-guide)
- [Artemis ABA — Session Notes Guide](https://www.artemisaba.com/blog/aba-session-notes)
- [Praxis Notes — RBT Supervision 2025](https://www.praxisnotes.com/resources/rbt-supervision-documentation-2025-bacb-guide)
- [ABA Matrix — Authorization Management](https://www.abamatrix.com/aba-authorization-management/)
- [LinksABA — Billing Ethics and Pitfalls](https://linksaba.com/billing-ethics-and-pitfalls-for-aba-providers/)
- [Raven Health — Top 6 ABA Software](https://ravenhealth.com/blog/top-aba-practice-management-softwares/)
- [CentralReach Alternatives — Noteable](https://mynoteable.com/blog/centralreachalternatives)

### Design Research

- [Tufte's Data Visualization Principles](https://jtr13.github.io/cc19/tuftes-principles-of-data-ink.html)
- [Dashboard Cognitive Design Guidelines — UX Magazine](https://uxmag.com/articles/four-cognitive-design-guidelines-for-effective-information-dashboards)
- [Data Dashboard Patterns — Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- [Enterprise Data Table Patterns — Pencil & Paper](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)
- [Form Design for Complex Applications — Andrew Coyle](https://coyleandrew.medium.com/form-design-for-complex-applications-d8a1d025eba6)
- [Toast Notification Best Practices — LogRocket](https://blog.logrocket.com/ux-design/toast-notifications/)
- [Linear UI Redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Auto-Saving Forms Done Right — CodeMiner42](https://blog.codeminer42.com/auto-saving-forms-done-right-1-2/)

### AI and Emerging Patterns

- [Microsoft Dragon Copilot at HIMSS 2026](https://www.microsoft.com/en-us/industry/blog/healthcare/2026/03/05/unify-simplify-scale-microsoft-dragon-copilot-meets-the-moment-at-himss-2026/)
- [Abridge AI Platform](https://www.abridge.com/ai)
- [Suki AI — Ambient Clinical Intelligence](https://www.suki.ai/)
- [Nabla AI Copilot](https://www.nabla.com/)
- [Shape of AI — UX Patterns](https://www.shapeof.ai/)
- [Agentic AI UX Patterns — Smashing Magazine](https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/)
- [Agentic Design Patterns](https://agentic-design.ai/patterns/ui-ux-patterns)
- [Confidence Visualization Patterns](https://agentic-design.ai/patterns/ui-ux-patterns/confidence-visualization-patterns)
- [LunaBill — YC F25](https://www.ycombinator.com/companies/lunabill)

### Platform and Product References

- [Raven Health](https://ravenhealth.com/)
- [Passage Health](https://www.passagehealth.com/)
- [Mentalyc AI Notes](https://www.mentalyc.com/)
- [Alpaca Health](https://www.alpacahealth.com/)
- [Theralytics](https://www.theralytics.com/)
- [SimplePractice](https://www.simplepractice.com/)
- [Jane App](https://jane.app/)

### Repositories and Code References

- [next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter) — 6.1k stars, Feb 2026
- [shadcn-table (tablecn)](https://github.com/sadmann7/shadcn-table) — 6k stars
- [Midday](https://github.com/midday-ai/midday) — 14.1k stars
- [Medplum](https://github.com/medplum/medplum) — 2.2k stars, March 2026
- [Tremor](https://github.com/tremorlabs/tremor) — 3.3k stars
- [Cal.com](https://github.com/calcom/cal.com) — 40.6k stars
- [Documenso](https://github.com/documenso/documenso) — 12.5k stars
- [OpenStatus](https://github.com/openstatusHQ/openstatus) — 8.5k stars
- [shadcn-admin](https://github.com/satnaing/shadcn-admin) — 11.5k stars
- [Plane](https://github.com/makeplane/plane) — 46.8k stars
- [Twenty CRM](https://github.com/twentyhq/twenty) — 40.6k stars
- [Lago](https://github.com/getlago/lago) — 9.4k stars
- [Dub](https://github.com/dubinc/dub) — 23.2k stars
- [Refine](https://github.com/refinedev/refine) — 34.3k stars
- [Formbricks](https://github.com/formbricks/formbricks) — 12k stars
- [Kimai](https://github.com/kimai/kimai) — 4.6k stars

### Security and Multi-Tenancy

- [OWASP Multi-Tenant Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html)
- [Vanta Data Leak — ComplyDog](https://complydog.com/blog/vanta-data-leak)
- [Cross-Tenant Leakage Prevention — Agnite](https://agnitestudio.com/blog/preventing-cross-tenant-leakage/)

### Accessibility

- [WCAG 2.1 — Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
- [Section 508 — Making Color Usage Accessible](https://www.section508.gov/create/making-color-usage-accessible/)
- [Healthcare App Accessibility — BounDev](https://www.boundev.com/blog/healthcare-app-accessibility-wcag-compliance)
- [React Aria useTable — Adobe](https://react-spectrum.adobe.com/react-aria/useTable.html)

### Financial UI

- [Floating Point Breaking Financial Software](https://medium.com/@sohail_saifii/the-floating-point-standard-thats-silently-breaking-financial-software-7f7e93430dbb)
- [Floats Don't Work for Storing Cents — Modern Treasury](https://www.moderntreasury.com/journal/floats-dont-work-for-storing-cents)

### Internal Codebase References

- `src/app/globals.css` — OKLCH color tokens, Mira theme, dark mode variables
- `src/components/ui/` — 32 installed shadcn/ui components
- `src/lib/utils.ts` — `cn()` class merging helper
- `src/lib/env.ts` — Type-safe environment configuration
- `src/lib/safe-action.ts` — `authActionClient` with Clerk org context
- `src/hooks/use-mobile.ts` — Mobile detection (768px breakpoint)
- `components.json` — shadcn/ui Mira configuration, Hugeicons
- `.claude/skills/design/references/design-system.md` — Full design system reference
- `.claude/rules/frontend.md` — Frontend coding rules and patterns
- `.claude/rules/security.md` — Multi-tenant isolation, PHI handling
- `.claude/rules/database.md` — Drizzle patterns, money handling, enum strategy
