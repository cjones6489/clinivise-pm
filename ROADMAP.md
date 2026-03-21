# Clinivise Phase 1 — Technical Working Roadmap

> **Scope**: Auth, multi-tenant foundation, client/provider/authorization CRUD, session logging, dashboard, AI auth letter parsing, audit logging.
>
> **Status legend**: `[ ]` not started · `[~]` in progress · `[x]` done · `[—]` skipped/deferred

---

## Pre-work (completed)

- [x] Initialize Next.js 16.2 project
- [x] Install all Phase 1 dependencies (Drizzle, Clerk, shadcn, TanStack, etc.)
- [x] Configure environment variables (`.env.local` — Neon, Clerk, Bedrock, Upstash, Sentry, Vercel Blob)
- [x] Set up `@t3-oss/env-nextjs` validation (`src/lib/env.ts`)
- [x] Install shadcn/ui Mira components (button, input, table, sidebar, dialog, sheet, etc.)
- [x] Set up `cn()` utility (`src/lib/utils.ts`)

---

## Sprint 1: Foundation (completed)

### 1A — Database Schema & Client

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | Fix `drizzle.config.ts` schema path → `./src/server/db/schema/index.ts` | `drizzle.config.ts` | `[x]` |
| 2 | Create shared constants (roles, statuses, CPT, POS as `as const` arrays) | `src/lib/constants.ts` | `[x]` |
| 3 | Create `organizations` table | `src/server/db/schema/organizations.ts` | `[x]` |
| 4 | Create `users` table (composite unique on clerkUserId + orgId) | `src/server/db/schema/users.ts` | `[x]` |
| 5 | Create `providers` table (self-ref `supervisorId` FK via AnyPgColumn) | `src/server/db/schema/providers.ts` | `[x]` |
| 6 | Create `clients` + `client_insurance` tables | `src/server/db/schema/clients.ts` | `[x]` |
| 7 | Create `payers` table (`timelyFilingDays` as integer) | `src/server/db/schema/payers.ts` | `[x]` |
| 8 | Create `authorizations` + `authorization_services` tables | `src/server/db/schema/authorizations.ts` | `[x]` |
| 9 | Create `sessions` table (FK to `authorizationServiceId`) | `src/server/db/schema/sessions.ts` | `[x]` |
| 10 | Create `claims` + `claim_lines` + `claim_responses` tables (Phase 2 stubs) | `src/server/db/schema/claims.ts` | `[x]` |
| 11 | Create `eligibility_checks` table (Phase 2 stub, monetary fields as numeric) | `src/server/db/schema/eligibility.ts` | `[x]` |
| 12 | Create `documents` table | `src/server/db/schema/documents.ts` | `[x]` |
| 13 | Create `audit_logs` table (append-only) | `src/server/db/schema/audit-logs.ts` | `[x]` |
| 14 | Create schema barrel export | `src/server/db/schema/index.ts` | `[x]` |
| 15 | Create Neon serverless DB client (uses validated `env.DATABASE_URL`) | `src/server/db/index.ts` | `[x]` |
| 16 | Generate migration (`pnpm db:generate`) — 15 tables, 47 FKs, 49 indexes | `drizzle/` | `[x]` |
| 17 | Run migration against Neon (`pnpm db:migrate`) | — | `[x]` |

### 1B — Auth & Providers

| # | Task | Files | Status |
|---|------|-------|--------|
| 18 | Create Clerk proxy middleware (Next.js 16 `proxy.ts` convention) | `src/proxy.ts` | `[x]` |
| 19 | Set up root layout with providers (ClerkProvider inside body) | `src/app/layout.tsx` | `[x]` |
| 20 | Create `QueryProvider` wrapper (clears cache on org switch) | `src/components/providers/query-provider.tsx` | `[x]` |
| 21 | Create `ThemeProvider` wrapper | `src/components/providers/theme-provider.tsx` | `[x]` |
| 22 | Create auth sign-in page | `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | `[x]` |
| 23 | Create auth sign-up page | `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | `[x]` |
| 24 | Create centered auth layout | `src/app/(auth)/layout.tsx` | `[x]` |

### 1C — Infrastructure (after 1A + 1B)

| # | Task | Files | Status |
|---|------|-------|--------|
| 25 | Create auth helpers (two-step Clerk→internal org lookup) | `src/lib/auth.ts` | `[x]` |
| 26 | Create `authActionClient` (org-scoped, generic error messages) | `src/lib/safe-action.ts` | `[x]` |
| 27 | Add utility functions (`formatDate`, `calculateUnits`, `utilizationPercent`) | `src/lib/utils.ts` | `[x]` |
| 28 | Add ABA constants (CPT codes, modifiers, POS codes, thresholds) | `src/lib/constants.ts` | `[x]` |
| 29 | Create money utilities (`decimal.js` wrappers, null-safe) | `src/lib/money.ts` | `[x]` |
| 30 | Create shared Zod validators (date validation with refine) | `src/lib/validators/index.ts` | `[x]` |
| 31 | Replace root page with redirect to `/overview` | `src/app/page.tsx` | `[x]` |
| 32 | Create global error boundary | `src/app/global-error.tsx` | `[x]` |

### 1D — Dashboard Layout

| # | Task | Files | Status |
|---|------|-------|--------|
| 33 | Create app sidebar (accepts `userRole` prop for filtering) | `src/components/layout/app-sidebar.tsx` | `[x]` |
| 34 | Create sidebar nav items config (role-based visibility) | `src/components/layout/sidebar-nav.ts` | `[x]` |
| 35 | Create header (SidebarTrigger, UserButton) | `src/components/layout/header.tsx` | `[x]` |
| 36 | Create page header (title + description + action slot) | `src/components/layout/page-header.tsx` | `[x]` |
| 37 | Create dashboard layout (server component, passes userRole) | `src/app/(dashboard)/layout.tsx` | `[x]` |
| 38 | Create dashboard error boundary | `src/app/(dashboard)/error.tsx` | `[x]` |
| 39 | Create dashboard loading skeleton | `src/app/(dashboard)/loading.tsx` | `[x]` |
| 40 | Create overview placeholder page | `src/app/(dashboard)/overview/page.tsx` | `[x]` |

### 1E — Shared Components

| # | Task | Files | Status |
|---|------|-------|--------|
| 41 | Create reusable `DataTable` (composable TanStack wrapper) | `src/components/shared/data-table.tsx` | `[x]` |
| 42 | Create `DataTableToolbar` (debounced search, filter slots) | `src/components/shared/data-table-toolbar.tsx` | `[x]` |
| 43 | Create `DataTablePagination` (guarded empty state) | `src/components/shared/data-table-pagination.tsx` | `[x]` |
| 44 | Create `EmptyState` component (icon + message + CTA) | `src/components/shared/empty-state.tsx` | `[x]` |
| 45 | Create `ConfirmDialog` (error handling + pending state) | `src/components/shared/confirm-dialog.tsx` | `[x]` |
| 46 | Create `LoadingSkeleton` variants (page, table, card) | `src/components/shared/loading-skeleton.tsx` | `[x]` |
| 47 | Create `useDebounce` hook | `src/hooks/use-debounce.ts` | `[x]` |

### 1F — Audit Fixes (4 rounds, 33 issues resolved)

Key fixes applied across all audit rounds:
- All FK constraints with explicit `onDelete` behavior (47 total)
- `$onUpdate(() => new Date())` on all `updatedAt` columns
- Composite unique index on `users(clerkUserId, organizationId)` for multi-org
- `authActionClient` and `auth.ts` both use two-step Clerk→internal org lookup
- `handleServerError` returns generic messages (no internal error leakage)
- `QueryProvider` clears cache on org switch (prevents cross-tenant UI leakage)
- `money.ts` null-safe with try/catch on malformed inputs
- `calculateUnits` returns -1 for negative durations
- `dateStringSchema` validates date semantics (not just format)
- `env.ts` wired into `db/index.ts`; Phase 2 vars made optional
- `ClerkProvider` placed inside `<body>` per Clerk Core 3+ docs
- Dashboard `error.tsx` + `loading.tsx` boundaries

---

## Sprint 2: Core CRUD

### 2A — Providers (completed)

| # | Task | Files | Status |
|---|------|-------|--------|
| 48 | Provider list page (data table, search, filters) | `src/app/(dashboard)/providers/page.tsx` | `[x]` |
| 49 | Provider table component | `src/components/providers/provider-table.tsx` | `[x]` |
| 50 | Provider create/edit form (credential type, NPI, supervisor) | `src/components/providers/provider-form.tsx` | `[x]` |
| 51 | Provider detail page (credentials, caseload) | `src/app/(dashboard)/providers/[id]/page.tsx` | `[x]` |
| 52 | Provider server actions (CRUD) | `src/server/actions/providers.ts` | `[x]` |
| 53 | Provider Zod validators | `src/lib/validators/providers.ts` | `[x]` |
| 54 | Provider read queries | `src/server/queries/providers.ts` | `[x]` |

**2A audit fixes (3 rounds):** Radix Select empty-string crash, NPI empty-string validation, Drizzle `undefined` → `null` for clearable fields, archive confirmation dialog, `CREDENTIAL_LABELS` deduplication, `Record<string, unknown>` type safety, invalid calendar date validation (round-trip refine), whitespace-only name rejection (`.trim()`), supervisor FK existence check, `handleServerError` whitelist for business-logic errors, duplicate-submit guard (`hasSubmitted` state)

### 2B — Clients

| # | Task | Files | Status |
|---|------|-------|--------|
| 55 | Client list page (data table, search, filters) | `src/app/(dashboard)/clients/page.tsx` | `[ ]` |
| 56 | Client table component | `src/components/clients/client-table.tsx` | `[ ]` |
| 57 | Client create form (new page) | `src/app/(dashboard)/clients/new/page.tsx`, `src/components/clients/client-form.tsx` | `[ ]` |
| 58 | Client detail page (info, insurance, auths, sessions tabs) | `src/app/(dashboard)/clients/[id]/page.tsx` | `[ ]` |
| 59 | Client info card component | `src/components/clients/client-info-card.tsx` | `[ ]` |
| 60 | Client server actions (CRUD) | `src/server/actions/clients.ts` | `[ ]` |
| 61 | Client Zod validators | `src/lib/validators/clients.ts` | `[ ]` |
| 62 | Client read queries | `src/server/queries/clients.ts` | `[ ]` |

### 2C — Client Insurance & Payers

| # | Task | Files | Status |
|---|------|-------|--------|
| 63 | Insurance form (add/edit policy per client) | `src/components/clients/insurance-form.tsx` | `[ ]` |
| 64 | Insurance server actions | `src/server/actions/client-insurance.ts` | `[ ]` |
| 65 | Payer management page (list, create, edit) | `src/app/(dashboard)/settings/page.tsx` | `[ ]` |
| 66 | Payer server actions | `src/server/actions/payers.ts` | `[ ]` |

### 2D — Authorizations

| # | Task | Files | Status |
|---|------|-------|--------|
| 67 | Authorization list page (filterable, expiry alerts) | `src/app/(dashboard)/authorizations/page.tsx` | `[ ]` |
| 68 | Authorization table component | `src/components/authorizations/auth-table.tsx` | `[ ]` |
| 69 | Authorization create/edit form | `src/components/authorizations/auth-form.tsx` | `[ ]` |
| 70 | Authorization detail page (services, utilization, docs) | `src/app/(dashboard)/authorizations/[id]/page.tsx` | `[ ]` |
| 71 | Authorization service lines (add CPT code + approved units) | `src/components/authorizations/auth-services.tsx` | `[ ]` |
| 72 | Utilization tracker (used vs approved, visual bar) | `src/components/authorizations/auth-utilization.tsx` | `[ ]` |
| 73 | Expiry alert card | `src/components/authorizations/auth-expiry-alert.tsx` | `[ ]` |
| 74 | Authorization server actions (CRUD + utilization calc) | `src/server/actions/authorizations.ts` | `[ ]` |
| 75 | Authorization Zod validators | `src/lib/validators/authorizations.ts` | `[ ]` |
| 76 | Authorization read queries | `src/server/queries/authorizations.ts` | `[ ]` |

---

## Sprint 3: Sessions & Dashboard

### 3A — Session Logging

| # | Task | Files | Status |
|---|------|-------|--------|
| 77 | Session log form (provider, client, CPT, units, POS, date/time) | `src/components/sessions/session-form.tsx` | `[ ]` |
| 78 | Auto-calculate units from start/end time (CMS 8-min rule) | Built into session form + `calculateUnits()` | `[ ]` |
| 79 | Auto-populate modifier codes from provider credential type | Built into session form | `[ ]` |
| 80 | Auth enforcement: warn/block if exceeding authorized units | Built into session form | `[ ]` |
| 81 | Session list page with filters (date, provider, client, status) | `src/app/(dashboard)/sessions/page.tsx` | `[ ]` |
| 82 | Session table component | `src/components/sessions/session-table.tsx` | `[ ]` |
| 83 | New session page | `src/app/(dashboard)/sessions/new/page.tsx` | `[ ]` |
| 84 | Auto-decrement auth utilization on session save (atomic increment) | `src/server/actions/sessions.ts` | `[ ]` |
| 85 | Session server actions (CRUD) | `src/server/actions/sessions.ts` | `[ ]` |
| 86 | Session Zod validators | `src/lib/validators/sessions.ts` | `[ ]` |
| 87 | Session read queries | `src/server/queries/sessions.ts` | `[ ]` |

### 3B — Dashboard Overview

| # | Task | Files | Status |
|---|------|-------|--------|
| 88 | Dashboard overview page | `src/app/(dashboard)/overview/page.tsx` | `[ ]` |
| 89 | Metrics cards (sessions this week, active clients, etc.) | `src/components/dashboard/metrics-cards.tsx` | `[ ]` |
| 90 | Expiring authorizations widget | `src/components/dashboard/expiring-auths-widget.tsx` | `[ ]` |
| 91 | Utilization warning alerts (80%/95% thresholds) | `src/components/dashboard/utilization-alerts.tsx` | `[ ]` |
| 92 | Recent sessions widget | `src/components/dashboard/recent-sessions-widget.tsx` | `[ ]` |
| 93 | Dashboard read queries (aggregations) | `src/server/queries/dashboard.ts` | `[ ]` |

---

## Sprint 4: AI, Documents & Polish

### 4A — Documents & File Upload

| # | Task | Files | Status |
|---|------|-------|--------|
| 94 | File upload component (Vercel Blob) | `src/components/shared/file-upload.tsx` | `[ ]` |
| 95 | Document management (upload, list, associate with client/auth) | `src/server/actions/documents.ts` | `[ ]` |
| 96 | Upload helper (type/size validation) | `src/lib/upload.ts` | `[ ]` |

### 4B — AI Auth Letter Parsing

| # | Task | Files | Status |
|---|------|-------|--------|
| 97 | AI client setup + prompt builder | `src/lib/ai.ts` | `[ ]` |
| 98 | Auth letter upload component | `src/components/authorizations/auth-upload.tsx` | `[ ]` |
| 99 | Parse auth letter API route (upload → extract → Claude → parse) | `src/app/api/ai/parse-auth-letter/route.ts` | `[ ]` |
| 100 | AI-extracted data review UI (editable fields + confidence scores) | `src/components/authorizations/auth-ai-review.tsx` | `[ ]` |

### 4C — Audit & Observability

| # | Task | Files | Status |
|---|------|-------|--------|
| 101 | Audit logging service (`withAuditLog` wrapper) | `src/server/services/audit.ts` | `[ ]` |
| 102 | Integrate audit logging into `authActionClient` middleware | `src/lib/safe-action.ts` | `[ ]` |
| 103 | Authorization alert detection logic | `src/server/services/authorization-alerts.ts` | `[ ]` |

### 4D — Clerk Webhook

| # | Task | Files | Status |
|---|------|-------|--------|
| 104 | Clerk webhook route (sync user/org changes to DB) | `src/app/api/webhooks/clerk/route.ts` | `[ ]` |

### 4E — Seed Data & Testing

| # | Task | Files | Status |
|---|------|-------|--------|
| 105 | Dev seed script ("Bright Futures ABA" practice with realistic data) | `src/server/db/seed.ts` | `[ ]` |
| 106 | Playwright E2E: auth flow (sign in, org select) | `tests/e2e/auth.spec.ts` | `[ ]` |
| 107 | Playwright E2E: client CRUD flow | `tests/e2e/clients.spec.ts` | `[ ]` |
| 108 | Vitest: `calculateUnits()` + `utilizationPercent()` | `src/lib/utils.test.ts` | `[ ]` |
| 109 | Vitest: server action org isolation | `src/server/actions/*.test.ts` | `[ ]` |

---

## Architecture Notes

### Key Decisions (from deep research)
- **Enums**: `text` columns + TypeScript `as const` arrays + Zod validation. No pgEnum.
- **Money**: `numeric(10,2)` in Postgres + `decimal.js` for arithmetic. Never `parseFloat()`.
- **Multi-tenancy**: Shared schema with `organization_id`. Scoped query builder planned for Sprint 2.
- **Auth utilization**: Atomic SQL increments (`SET used_units = used_units + N`). Never read-modify-write.
- **8-minute rule**: Per-session in Phase 1, per-day aggregation in Phase 2. Default AMA method.
- **Auth overlap**: FIFO (oldest expiration first), allow manual override.
- **Audit logging**: Synchronous, in-transaction, append-only.

### What's Explicitly Out of Scope (Phase 2+)
- Claims submission / ERA processing / eligibility checks (Stedi)
- Denial management / Billing dashboard
- Analytics & reporting
- Parent portal
- Clinical integrations (Motivity, Hi Rasmus)
- Postgres RLS (defense-in-depth before production PHI)

---

*Last updated: 2026-03-21*
