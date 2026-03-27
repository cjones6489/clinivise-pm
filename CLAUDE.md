# Clinivise

All-in-one ABA therapy platform — clinical operations, practice management, and AI-native billing in a single product. HIPAA-compliant, multi-tenant SaaS for small practices (1–50 staff). The goal: eliminate the need for multiple software tools (CentralReach for billing, Motivity for data collection, etc.) by building both sides with exceptional UX. Free PM tier, monetized via 2–4% of collected revenue on billing.

@AGENTS.md

## Development Philosophy

**The interface IS the product.** Backend and frontend are not separate phases — they are two sides of the same user workflow, designed together.

### How we build features

Every feature follows this sequence. **No step can be skipped.** Steps 1-3 happen BEFORE any code is written.

**Step 1 — Clinical Data Model Research (MANDATORY GATE)**

Before building ANY feature that touches clinical data (goals, session notes, assessments, treatment plans, billing, scheduling), research the real-world data model:

1. **Fetch real templates and standards** — Use web search to find CASP templates, TRICARE requirements, CMS-1500 field requirements, payer audit checklists, and BACB standards relevant to the feature.
2. **Verify against competitor implementations** — Check what CentralReach, Motivity, Catalyst/Rethink, Raven Health, and AlohaABA include. What fields do ALL of them have?
3. **Verify against assessment tools** — For clinical features, check VB-MAPP, ABLLS-R, AFLS, PEAK structures. ABA has specific data hierarchies (Domain → Goal → Objective → Target) and measurement types (discrete trial, frequency, duration, rate, latency, task analysis, interval) that must be modeled correctly.
4. **Create a research doc** — Save findings to `docs/research/` with sources. This becomes the blueprint.
5. **Verify the proposed schema** against the research BEFORE writing any migration. Every field should trace to a real requirement, not an assumption.

**Why this gate exists:** During the goals and session notes build, assumptions about clinical data structures led to 3 rounds of gap-fixing: missing goal statuses (baseline/mastered/maintenance/generalization), missing behavior reduction fields (function/replacement/operational definition), missing Target level, wrong measurement types, missing audit-critical session note fields. Researching first would have gotten it right in one pass.

**This gate applies to:** Goals, session notes, data collection, treatment plans, assessments, scheduling (auth-aware), billing/claims, progress reports, supervision tracking. It does NOT apply to purely technical features (auth setup, UI components, infrastructure).

**Step 2 — User Story**: Who does what, when, and why? Write a concrete scenario.

> _"A BCBA opens a client's page Monday morning to check if their authorization is running low before scheduling this week's sessions."_

**Step 3 — Page Design**: What do they see? What do they click? What data appears where? Reference the wireframe (`docs/design/clinivise-wireframes.jsx`) for layout patterns. Describe:

- The page layout (metric cards, section cards, tables, action buttons)
- The information hierarchy (what's the hero moment? what's secondary? what's metadata?)
- The user's primary and secondary actions from this page
- All states: empty, loading, populated, error, edge cases

**Step 4 — Data & Actions**: What schema, queries, and mutations power the page design from Step 3? The schema serves the UI, not the other way around. Cross-check every field against the Step 1 research doc.

**Step 5 — Build**: Implement schema + actions + UI as one integrated vertical slice. The page component is not an afterthought — it's built WITH the same care as the data layer.

**Step 6 — Audit**: Run `/audit-build` after implementation. Fix all critical and high findings before moving to the next feature.

### When to use the abbreviated flow

If a thorough research doc already exists for the feature (e.g., `docs/research/session-note-requirements-research.md`), skip Step 1 and use the existing doc as the blueprint. Still do Steps 2-6.

For purely technical tasks (infrastructure, refactoring, bug fixes), skip Steps 1-3. Still audit after building.

### Why this order matters

When you start with the schema and "slap a form on top," you get a database admin panel. When you start with the user's workflow, the schema naturally follows and the UI reflects actual usage patterns. When you skip research, you make assumptions about clinical data that lead to rework.

### Design quality standard

Every page must have: a rich header with contextual metadata, section cards with title bars (not naked headings), key-value pairs for detail display (not disabled form inputs), metric cards for important numbers, at least one contextual action button, and three tiers of visual hierarchy. See `.claude/skills/design/references/design-system.md` for the full Page Design Framework.

## Tech Stack

| Layer          | Technology                           | Notes                                                         |
| -------------- | ------------------------------------ | ------------------------------------------------------------- |
| Framework      | Next.js 16.2                         | App Router, Server Components default                         |
| Language       | TypeScript 5.9                       | Strict mode                                                   |
| Styling        | Tailwind CSS v4                      | CSS-first config (`globals.css`), no `tailwind.config.js`     |
| Components     | shadcn/ui (Mira style)               | `radix-ui` unified package, `cn()` from `@/lib/utils`         |
| Database       | Neon Postgres + Drizzle ORM 0.45     | Serverless driver, `@neondatabase/serverless`                 |
| Auth           | Clerk Pro                            | Organizations, RBAC, MFA. No BAA needed (staff-only)          |
| Server Actions | next-safe-action v8                  | `authActionClient` injects org context                        |
| Data Fetching  | TanStack Query v5                    | Client-side. Server components use direct DB calls            |
| Forms          | React Hook Form + Zod v4             | `zod/v4` import path, `@hookform/resolvers`                   |
| AI             | Any LLM (prototype) → Bedrock (prod) | Direct API for now; migrate to Bedrock when handling real PHI |
| File Storage   | Vercel Blob                          | Auth letter PDFs. Covered under Vercel BAA                    |
| Rate Limiting  | Upstash Redis                        | HTTP-based, serverless-native                                 |
| Monitoring     | Sentry v10                           | Add PHI scrubbing before production                           |
| Billing API    | Stedi (Phase 2)                      | JSON-first EDI. Basic plan for dev, Developer for prod        |
| Testing        | Vitest 4 + Playwright 1.58           | Unit + E2E                                                    |

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint
pnpm prettier --check . # Check formatting
pnpm vitest           # Unit tests
pnpm vitest run       # Unit tests (CI mode)
pnpm exec playwright test  # E2E tests
pnpm drizzle-kit generate # Generate migration
pnpm drizzle-kit migrate  # Run migrations
pnpm drizzle-kit studio   # DB browser
```

## Architecture

```
src/
├── app/
│   ├── (auth)/            # Public auth routes (Clerk SignIn/SignUp)
│   ├── (dashboard)/       # Authenticated PM routes (sidebar layout)
│   ├── (billing)/         # Billing routes (Phase 2)
│   └── api/
│       ├── webhooks/      # Clerk + Stedi webhooks
│       └── ai/            # AI endpoints (any LLM for now)
├── components/
│   ├── ui/                # shadcn/ui primitives (auto-generated)
│   ├── layout/            # Sidebar, header, page-header
│   ├── clients/           # Client CRUD components
│   ├── authorizations/    # Auth tracking + AI upload
│   ├── sessions/          # Session logging + timer
│   ├── billing/           # Claims, ERA, denials (Phase 2)
│   └── dashboard/         # Metrics, charts, alerts
├── server/
│   ├── db/
│   │   ├── schema/        # Drizzle table definitions
│   │   └── index.ts       # DB client (Neon serverless)
│   ├── actions/           # next-safe-action server actions
│   └── queries/           # Read-only query functions
├── lib/
│   ├── utils.ts           # cn(), formatters
│   ├── safe-action.ts     # authActionClient setup
│   └── validators/        # Shared Zod schemas
└── hooks/                 # React hooks (useDebounce, etc.)
```

### Data Flow

1. **Reads**: Server Component → `server/queries/` → Drizzle → Neon (always filtered by `organization_id`)
2. **Mutations**: Client → `server/actions/` (via `authActionClient`) → Drizzle → Neon → revalidate
3. **Client state**: TanStack Query for cache/optimistic updates
4. **AI**: Upload → API route → LLM (via `lib/ai.ts` wrapper) → structured response → save to DB

## Critical Constraints

- **Security**: See `.claude/rules/security.md`. Key: always filter by `organization_id`, keep AI behind a wrapper for easy provider swap later
- **Multi-tenancy**: Every table has `organization_id`. Every query filters by it. `authActionClient` injects it from Clerk session. Use a scoped query builder that auto-injects `organization_id` + `deleted_at IS NULL`
- **IDs**: `nanoid()` for all primary keys (not UUID)
- **Enums**: `text` columns + TypeScript `as const` arrays + Zod validation. NEVER use `pgEnum` (can't remove values, Drizzle migration bugs, ACCESS EXCLUSIVE lock on ALTER TYPE)
- **Money**: `numeric(10, 2)` in Postgres. Use `decimal.js` for arithmetic. NEVER `parseFloat()` or `Number()` on monetary values. Drizzle returns numeric as strings — this is correct, pass directly to Stedi API
- **Sessions**: Measured in 15-minute units per CMS 8-minute rule. Store actual minutes + calculated units. Two calculation methods: CMS (aggregate across codes, Medicare/Medicaid) and AMA (per-code, commercial payers). Default AMA. Store payer preference
- **Auth tracking**: `used_units` vs `approved_units` per CPT code per authorization. Atomic SQL increments only (`SET used_units = used_units + N`), never read-modify-write. Overlapping auths: FIFO (oldest expiration first), allow manual override
- **Auth utilization alerts**: 80% warning, 95% critical, 100%+ over-utilized. Alert on expiring auths (30/14/7 days). Alert on under-utilization (<50% used with >50% of period elapsed)
- **Care team**: `client_providers` junction table with roles (`supervising_bcba`, `bcba`, `lead_rbt`, `rbt`, `bcaba`), `is_primary` flag, and time-bounded assignments (`start_date`/`end_date`). **Care team is suggestive, not restrictive** — any active org provider can log sessions for any client. Multiple BCBAs per client are valid (coverage, transitions, clinical director). The team drives smart defaults (pre-fill provider dropdowns, auto-suggest supervisor, caseload views) but never blocks service delivery.
- **Session validation**: Only 2 hard blocks at session creation: (1) same provider overlapping 1:1 sessions, (2) RBT billing QHP-only codes. Everything else is a WARNING (auth date range, MUE, missing supervisor, expired credentials, BCaBA QHP codes). Session logging captures what happened — never block it for billing issues. Warn at creation, hard-block at claim generation. See `ROADMAP.md` "Session Validation Rules" for full details.
- **RBT supervision on claims**: NOT universal. Three billing models exist (bill under BCBA NPI, bill under RBT NPI + supervisor, group billing). Which model depends on the payer. BACB supervision (5% monthly) is a certification requirement, separate from claim requirements.

- **Clinical data model**: Full hierarchy: `goal_domains` (custom per org) → `client_goals` (treatment plan goals with domain, type, mastery criteria) → `client_goal_objectives` (measurable milestones) → targets + data collection (future). Session notes reference goals with per-goal structured data entry. Notes are NOT submitted with claims — kept on file for audits.
- **All-in-one strategy**: Clinivise replaces both the PM tool (AlohaABA) AND the clinical tool (Motivity/Catalyst). No double-entry, no integration friction. Build clinical features incrementally on top of the PM foundation. See ROADMAP.md "Clinical Platform" for full plan.

## Phase Context

**Phase 1 (complete):** Multi-tenant foundation, client/provider/authorization CRUD, session logging, care team management, dashboard overview, Clerk webhooks, session validation.

**Phase 2 (current):** Clinical foundation — goal domains, treatment goals + objectives, structured session notes, signature workflow.

**Phase 3:** Data collection during sessions (DTT, frequency, duration, task analysis), mobile/tablet interface, real-time data entry.

**Phase 4:** Graphing + mastery automation, phase progression, AI note generation, progress reports.

**Phase 5:** Claims submission (Stedi), ERA processing, eligibility checks, denial management.

**Future:** Analytics, parent portal, scheduling/calendar, supervision compliance tracking.

## Documentation

All project docs are indexed in `docs/INDEX.md`. Key references:

- `docs/specs/product-spec.md` — **Page-by-page product spec.** Every page defined with user stories, layouts, data requirements, actions, and MVP scope. **Read the relevant page entry before building or redesigning any page.**
- `docs/design/clinivise-wireframes.jsx` — Interactive wireframes showing intended page layouts, data density, and visual hierarchy. **Reference this alongside the product spec.**
- `docs/specs/engineering-spec.md` — Full DB schema, config files, task breakdown
- `docs/specs/research-spec.md` — Technology decisions, pricing, ABA billing codes, HIPAA analysis
- `ROADMAP.md` — Phase 1 working roadmap with task tracking

## MCP Servers

- **Context7** — Fetch current library docs before writing code. Always resolve library ID first
- **Next DevTools** — Next.js debugging and docs
- **shadcn** — Component registry, examples, audit checklist
- **Clerk** — Auth SDK snippets and patterns
