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

| #   | Task                                                                         | Files                                    | Status |
| --- | ---------------------------------------------------------------------------- | ---------------------------------------- | ------ |
| 1   | Fix `drizzle.config.ts` schema path → `./src/server/db/schema/index.ts`      | `drizzle.config.ts`                      | `[x]`  |
| 2   | Create shared constants (roles, statuses, CPT, POS as `as const` arrays)     | `src/lib/constants.ts`                   | `[x]`  |
| 3   | Create `organizations` table                                                 | `src/server/db/schema/organizations.ts`  | `[x]`  |
| 4   | Create `users` table (composite unique on clerkUserId + orgId)               | `src/server/db/schema/users.ts`          | `[x]`  |
| 5   | Create `providers` table (self-ref `supervisorId` FK via AnyPgColumn)        | `src/server/db/schema/providers.ts`      | `[x]`  |
| 6   | Create `clients` + `client_insurance` tables                                 | `src/server/db/schema/clients.ts`        | `[x]`  |
| 7   | Create `payers` table (`timelyFilingDays` as integer)                        | `src/server/db/schema/payers.ts`         | `[x]`  |
| 8   | Create `authorizations` + `authorization_services` tables                    | `src/server/db/schema/authorizations.ts` | `[x]`  |
| 9   | Create `sessions` table (FK to `authorizationServiceId`)                     | `src/server/db/schema/sessions.ts`       | `[x]`  |
| 10  | Create `claims` + `claim_lines` + `claim_responses` tables (Phase 2 stubs)   | `src/server/db/schema/claims.ts`         | `[x]`  |
| 11  | Create `eligibility_checks` table (Phase 2 stub, monetary fields as numeric) | `src/server/db/schema/eligibility.ts`    | `[x]`  |
| 12  | Create `documents` table                                                     | `src/server/db/schema/documents.ts`      | `[x]`  |
| 13  | Create `audit_logs` table (append-only)                                      | `src/server/db/schema/audit-logs.ts`     | `[x]`  |
| 14  | Create schema barrel export                                                  | `src/server/db/schema/index.ts`          | `[x]`  |
| 15  | Create Neon serverless DB client (uses validated `env.DATABASE_URL`)         | `src/server/db/index.ts`                 | `[x]`  |
| 16  | Generate migration (`pnpm db:generate`) — 15 tables, 47 FKs, 49 indexes      | `drizzle/`                               | `[x]`  |
| 17  | Run migration against Neon (`pnpm db:migrate`)                               | —                                        | `[x]`  |

### 1B — Auth & Providers

| #   | Task                                                             | Files                                            | Status |
| --- | ---------------------------------------------------------------- | ------------------------------------------------ | ------ |
| 18  | Create Clerk proxy middleware (Next.js 16 `proxy.ts` convention) | `src/proxy.ts`                                   | `[x]`  |
| 19  | Set up root layout with providers (ClerkProvider inside body)    | `src/app/layout.tsx`                             | `[x]`  |
| 20  | Create `QueryProvider` wrapper (clears cache on org switch)      | `src/components/providers/query-provider.tsx`    | `[x]`  |
| 21  | Create `ThemeProvider` wrapper                                   | `src/components/providers/theme-provider.tsx`    | `[x]`  |
| 22  | Create auth sign-in page                                         | `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | `[x]`  |
| 23  | Create auth sign-up page                                         | `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | `[x]`  |
| 24  | Create centered auth layout                                      | `src/app/(auth)/layout.tsx`                      | `[x]`  |

### 1C — Infrastructure (after 1A + 1B)

| #   | Task                                                                         | Files                         | Status |
| --- | ---------------------------------------------------------------------------- | ----------------------------- | ------ |
| 25  | Create auth helpers (two-step Clerk→internal org lookup)                     | `src/lib/auth.ts`             | `[x]`  |
| 26  | Create `authActionClient` (org-scoped, generic error messages)               | `src/lib/safe-action.ts`      | `[x]`  |
| 27  | Add utility functions (`formatDate`, `calculateUnits`, `utilizationPercent`) | `src/lib/utils.ts`            | `[x]`  |
| 28  | Add ABA constants (CPT codes, modifiers, POS codes, thresholds)              | `src/lib/constants.ts`        | `[x]`  |
| 29  | Create money utilities (`decimal.js` wrappers, null-safe)                    | `src/lib/money.ts`            | `[x]`  |
| 30  | Create shared Zod validators (date validation with refine)                   | `src/lib/validators/index.ts` | `[x]`  |
| 31  | Replace root page with redirect to `/overview`                               | `src/app/page.tsx`            | `[x]`  |
| 32  | Create global error boundary                                                 | `src/app/global-error.tsx`    | `[x]`  |

### 1D — Dashboard Layout

| #   | Task                                                        | Files                                   | Status |
| --- | ----------------------------------------------------------- | --------------------------------------- | ------ |
| 33  | Create app sidebar (accepts `userRole` prop for filtering)  | `src/components/layout/app-sidebar.tsx` | `[x]`  |
| 34  | Create sidebar nav items config (role-based visibility)     | `src/components/layout/sidebar-nav.ts`  | `[x]`  |
| 35  | Create header (SidebarTrigger, UserButton)                  | `src/components/layout/header.tsx`      | `[x]`  |
| 36  | Create page header (title + description + action slot)      | `src/components/layout/page-header.tsx` | `[x]`  |
| 37  | Create dashboard layout (server component, passes userRole) | `src/app/(dashboard)/layout.tsx`        | `[x]`  |
| 38  | Create dashboard error boundary                             | `src/app/(dashboard)/error.tsx`         | `[x]`  |
| 39  | Create dashboard loading skeleton                           | `src/app/(dashboard)/loading.tsx`       | `[x]`  |
| 40  | Create overview placeholder page                            | `src/app/(dashboard)/overview/page.tsx` | `[x]`  |

### 1E — Shared Components

| #   | Task                                                       | Files                                             | Status |
| --- | ---------------------------------------------------------- | ------------------------------------------------- | ------ |
| 41  | Create reusable `DataTable` (composable TanStack wrapper)  | `src/components/shared/data-table.tsx`            | `[x]`  |
| 42  | Create `DataTableToolbar` (debounced search, filter slots) | `src/components/shared/data-table-toolbar.tsx`    | `[x]`  |
| 43  | Create `DataTablePagination` (guarded empty state)         | `src/components/shared/data-table-pagination.tsx` | `[x]`  |
| 44  | Create `EmptyState` component (icon + message + CTA)       | `src/components/shared/empty-state.tsx`           | `[x]`  |
| 45  | Create `ConfirmDialog` (error handling + pending state)    | `src/components/shared/confirm-dialog.tsx`        | `[x]`  |
| 46  | Create `LoadingSkeleton` variants (page, table, card)      | `src/components/shared/loading-skeleton.tsx`      | `[x]`  |
| 47  | Create `useDebounce` hook                                  | `src/hooks/use-debounce.ts`                       | `[x]`  |

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

| #   | Task                                                         | Files                                         | Status |
| --- | ------------------------------------------------------------ | --------------------------------------------- | ------ |
| 48  | Provider list page (data table, search, filters)             | `src/app/(dashboard)/providers/page.tsx`      | `[x]`  |
| 49  | Provider table component                                     | `src/components/providers/provider-table.tsx` | `[x]`  |
| 50  | Provider create/edit form (credential type, NPI, supervisor) | `src/components/providers/provider-form.tsx`  | `[x]`  |
| 51  | Provider detail page (credentials, caseload)                 | `src/app/(dashboard)/providers/[id]/page.tsx` | `[x]`  |
| 52  | Provider server actions (CRUD)                               | `src/server/actions/providers.ts`             | `[x]`  |
| 53  | Provider Zod validators                                      | `src/lib/validators/providers.ts`             | `[x]`  |
| 54  | Provider read queries                                        | `src/server/queries/providers.ts`             | `[x]`  |

**2A audit fixes (3 rounds):** Radix Select empty-string crash, NPI empty-string validation, Drizzle `undefined` → `null` for clearable fields, archive confirmation dialog, `CREDENTIAL_LABELS` deduplication, `Record<string, unknown>` type safety, invalid calendar date validation (round-trip refine), whitespace-only name rejection (`.trim()`), supervisor FK existence check, `handleServerError` whitelist for business-logic errors, duplicate-submit guard (`hasSubmitted` state)

### 2B — Clients (completed)

| #   | Task                                                                                     | Files                                                                                | Status |
| --- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| 55  | Client list page (data table, search, role-gated actions)                                | `src/app/(dashboard)/clients/page.tsx`                                               | `[x]`  |
| 56  | Client table + columns (name search, DOB+age, status badge, BCBA)                        | `src/components/clients/client-table.tsx`, `client-columns.tsx`                      | `[x]`  |
| 57  | Client create/edit form (4-section, disabled prop for read-only)                         | `src/app/(dashboard)/clients/new/page.tsx`, `src/components/clients/client-form.tsx` | `[x]`  |
| 58  | Client detail page (5-tab: Overview, Contacts, Insurance*, Auths*, Sessions\*)           | `src/app/(dashboard)/clients/[id]/page.tsx`, `client-detail.tsx`                     | `[x]`  |
| 59  | Client contacts CRUD (card + dialog form, hard delete)                                   | `src/components/clients/client-contacts-card.tsx`, `client-contact-form.tsx`         | `[x]`  |
| 60  | Client + contact server actions (CRUD, BCBA credential validation)                       | `src/server/actions/clients.ts`, `client-contacts.ts`                                | `[x]`  |
| 61  | Client + contact Zod validators (holdReason refinement on both schemas)                  | `src/lib/validators/clients.ts`, `client-contacts.ts`                                | `[x]`  |
| 62  | Client read queries (LEFT JOIN for BCBA name, BCBA options)                              | `src/server/queries/clients.ts`                                                      | `[x]`  |
| 63  | Schema migration: 9-status lifecycle, client_contacts table, clientInsurance FK restrict | `drizzle/0001_sprint_2b_client_contacts_status.sql`                                  | `[x]`  |

**2B schema changes:** replaced `isActive` boolean + `dischargeDate` with 9-value `status` text column (inquiry → intake → waitlist → pending_assessment → pending_treatment_auth → active → on_hold → discharged → archived), added `referralSource` + `holdReason`, added `client_contacts` table (FHIR RelatedPerson pattern, 6 boolean flags), altered `clientInsurance` FK to restrict + replaced `isPrimary` with `priority` integer.

**2B audit fixes (2 rounds):** stripped `clientId` from updateContact payload (cross-tenant mutation), fixed `updateClientSchema` `.partial()` status default (silent reset to inquiry), extracted `undefinedToNull` to shared utility, added BCBA `credentialType` + `isActive` validation, hidden Archive action from non-write roles, added holdReason refinement to `createClientSchema` (client-side validation), added priority `FieldError`.

### 2C — Client Insurance & Payers (completed)

| #   | Task                                                                          | Files                                                                                  | Status |
| --- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| 64  | Insurance card + form (add/edit/archive policy, verification workflow)        | `src/components/clients/client-insurance-card.tsx`, `client-insurance-form.tsx`        | `[x]`  |
| 65  | Insurance server actions (CRUD, priority auto-calc, soft delete + re-compact) | `src/server/actions/client-insurance.ts`                                               | `[x]`  |
| 66  | Insurance validators (create/update/verify schemas)                           | `src/lib/validators/client-insurance.ts`                                               | `[x]`  |
| 67  | Insurance queries (INNER JOIN payers, payer options)                          | `src/server/queries/clients.ts`                                                        | `[x]`  |
| 68  | Payer management page (admin-only, DataTable, CRUD)                           | `src/app/(dashboard)/settings/page.tsx`, `src/components/settings/payers-settings.tsx` | `[x]`  |
| 69  | Payer server actions (CRUD, deactivation with active-policy check)            | `src/server/actions/payers.ts`                                                         | `[x]`  |
| 70  | Payer validators + queries                                                    | `src/lib/validators/payers.ts`, `src/server/queries/payers.ts`                         | `[x]`  |
| 71  | Payer quick-add dialog (inline from insurance form)                           | `src/components/clients/payer-quick-add-dialog.tsx`                                    | `[x]`  |
| 72  | Schema migration (verification, subscriber address, soft delete, card URLs)   | `drizzle/0002_sprint_2c_insurance_verification.sql`                                    | `[x]`  |
| 73  | Composite indexes migration (org+client+deleted, org+payer+deleted)           | `drizzle/0003_add_insurance_composite_indexes.sql`                                     | `[x]`  |
| 74  | Constants (verification statuses, payer/subscriber/unit-calc labels)          | `src/lib/constants.ts`                                                                 | `[x]`  |
| 75  | Unit tests (55 tests: insurance validators, payer validators, utilities)      | `src/lib/validators/*.test.ts`, `src/lib/utils.test.ts`                                | `[x]`  |

**2C schema changes:** Added 10 columns to `client_insurance` (planName, verificationStatus, verifiedAt, subscriberAddress×4, cardFrontUrl, cardBackUrl, deletedAt). Added 2 composite indexes. Card image upload UI deferred (columns exist for Phase 2 OCR).

**2C audit fixes (3 rounds, 19 issues resolved):**

- Combobox `filter={null}` + `itemToStringLabel` (displayed nanoid instead of payer name)
- Priority collision after delete: switched to COUNT for capacity + MAX for assignment + post-delete re-compaction in transaction
- Race conditions: wrapped priority read+insert and priority swap in `db.transaction()`
- Defense-in-depth: added `organizationId` to all UPDATE/DELETE WHERE clauses (insurance + payer actions)
- ConfirmDialog on insurance archive (was firing without confirmation)
- Form reset: `key` prop on forms in Dialogs (insurance, payer, contact forms)
- Settings page: replaced `requireRole` throw with rendered "Access Denied" UI (was infinite error loop)
- Verification dropdown: "Mark Unverified" now shows for "failed" status (was missing transition path)
- Quick-add dialog: Cancel button now resets form state
- `payerOptions` state sync via `useEffect` (was stale after server revalidation)
- `stripUndefined` for INSERT operations (was overriding DB defaults with null)
- `timelyFilingDays` NaN on empty: union transform in Zod schema
- Expired verification rejection: blocks "Mark Verified" on terminated policies

**Broader QA fixes (Sprint 1/2A/2B retroactive):**

- Added `organizationId` to all UPDATE/DELETE WHERE clauses across providers, clients, contacts (6 locations)
- Fixed `updateProviderSchema` `.partial()` without `.omit()` on `isActive` (could silently re-activate)
- Fixed `updateContactSchema` `.partial()` without `.omit()` on 7 defaulted fields
- Switched all CREATE actions to `stripUndefined` (providers, clients, contacts)
- Added `"Organization not found"` and `"User not found in this organization"` to `USER_FACING_ERRORS`
- Dashboard layout: added `redirect("/sign-in")` when unauthenticated (defense-in-depth)
- Client form: filtered "archived" from status dropdown (prevents bypassing soft-delete)
- ESLint: added `docs/**` to `globalIgnores`, `varsIgnorePattern: "^_"` for destructured vars
- Prettier: formatted 77 files across entire codebase
- Vitest config: created `vitest.config.ts` with `@/` path alias

### 2D-1 — Authorization CRUD (completed)

> Foundation: list, create, detail, service lines. Follows Providers (2A) and Clients (2B) patterns.

| #   | Task                                                                                                                            | Files                                                                                               | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| 76  | Schema migration: add `previousAuthorizationId` (self-ref FK), `ratePerUnit` (numeric 10,2) on auth_services                    | `drizzle/0004_sprint_2d_auth_enhancements.sql`                                                      | `[x]`  |
| 77  | Authorization constants (status labels, status variants, CPT code options for select)                                           | `src/lib/constants.ts`                                                                              | `[x]`  |
| 78  | Authorization Zod validators (create, update, service line create/update)                                                       | `src/lib/validators/authorizations.ts`                                                              | `[x]`  |
| 79  | Authorization read queries (list with client+payer JOIN, detail with service lines, client-scoped list)                         | `src/server/queries/authorizations.ts`                                                              | `[x]`  |
| 80  | Authorization server actions (create with service lines, update, archive/soft-delete)                                           | `src/server/actions/authorizations.ts`                                                              | `[x]`  |
| 81  | Authorization service line server actions (add, update, remove)                                                                 | `src/server/actions/authorization-services.ts`                                                      | `[x]`  |
| 82  | Authorization list page (DataTable, status filter, client search, payer filter)                                                 | `src/app/(dashboard)/authorizations/page.tsx`                                                       | `[x]`  |
| 83  | Authorization table + columns (status badge, client name, payer, date range, service line count)                                | `src/components/authorizations/auth-table.tsx`, `auth-columns.tsx`                                  | `[x]`  |
| 84  | Authorization create page + form (client selector → auto-populate payer/insurance, date range, diagnosis, service lines inline) | `src/app/(dashboard)/authorizations/new/page.tsx`, `src/components/authorizations/auth-form.tsx`    | `[x]`  |
| 85  | Authorization service line manager component (add/edit/remove CPT lines with approved units, rate per unit)                     | `src/components/authorizations/auth-service-lines.tsx`                                              | `[x]`  |
| 86  | Authorization detail page (header card + service lines table + placeholder tabs for sessions/documents/history)                 | `src/app/(dashboard)/authorizations/[id]/page.tsx`, `src/components/authorizations/auth-detail.tsx` | `[x]`  |
| 87  | Authorization status badge component (reusable, follows CLIENT_STATUS_VARIANT pattern)                                          | `src/components/authorizations/auth-status-badge.tsx`                                               | `[x]`  |
| 88  | Client detail: wire Authorizations tab (filtered auth list for this client)                                                     | `src/components/clients/client-detail.tsx`                                                          | `[x]`  |
| 89  | Unit tests: authorization validators, service line validators                                                                   | `src/lib/validators/authorizations.test.ts`                                                         | `[x]`  |

### 2D-2 — Authorization Intelligence (completed — Phase 1B)

> Utilization tracking and expiry alerts. Built as Phase 1B (4 sub-sprints, 10 commits, 24+ audit findings fixed).

| #   | Task                                                                                                             | Files                                                                                     | Status |
| --- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| 90  | Utilization bar component (role="meter", a11y, over-utilization, compact mode, hours display)                    | `src/components/shared/utilization-bar.tsx`                                               | `[x]`  |
| 91  | Add inline utilization mini-bars to auth list table columns                                                      | `src/components/authorizations/authorization-columns.tsx`                                 | `[x]`  |
| 92  | Auth detail: per-service-line utilization bars on detail page                                                    | `src/components/authorizations/authorization-detail.tsx`                                  | `[x]`  |
| 93  | Auth detail: rich header card (status, dates, payer, client, diagnosis, days remaining, overall utilization bar) | `src/app/(dashboard)/authorizations/[id]/page.tsx`                                        | `[x]`  |
| 94  | Expiry badge column on auth list + sort by days-until-expiry                                                     | `src/components/authorizations/authorization-columns.tsx`                                 | `[x]`  |
| 95  | Expiry alert banner on auth detail page (warning/critical severity, shared getExpiryLevel)                       | `src/app/(dashboard)/authorizations/[id]/page.tsx`                                        | `[x]`  |
| 96  | Client detail: auth expiry badge in header + per-CPT utilization bars + under-utilization detection              | `src/app/(dashboard)/clients/[id]/page.tsx`, `src/components/clients/client-overview.tsx` | `[x]`  |
| +   | Auth list: metric cards (active, expiring 30d, expired, avg utilization) + 5 filter tabs + server-side filters   | `src/app/(dashboard)/authorizations/page.tsx`, `src/server/queries/authorizations.ts`     | `[x]`  |
| +   | Shared ExpiryBadge component (color-coded days, "Today", future auth "Starts {date}", full date mode)            | `src/components/shared/expiry-badge.tsx`                                                  | `[x]`  |
| +   | Shared MetricCard component (extracted from dashboard, accent prop, reused on sessions + auth list pages)        | `src/components/shared/metric-card.tsx`                                                   | `[x]`  |
| +   | Client detail: action buttons row (Log Session, Add Authorization) + Weekly Avg metric card                      | `src/app/(dashboard)/clients/[id]/page.tsx`, `src/components/clients/client-overview.tsx` | `[x]`  |
| +   | New query: getClientAuthUtilization (per-CPT breakdown, daysTotal/Elapsed, startDate filter)                     | `src/server/queries/authorizations.ts`                                                    | `[x]`  |
| +   | Tests: 24 new (16 utilization-bar + 8 expiry-badge)                                                              | `src/components/shared/*.test.tsx`                                                        | `[x]`  |

---

## Sprint 3: Sessions & Dashboard

### 3A — Session Logging (completed — Phase 0 + Phase 1A)

> Built across Phase 0 (stabilize) and Phase 1A (3 sub-sprints, 4 commits, 10 audit findings fixed).

| #   | Task                                                                                                                                | Files                                                                                          | Status |
| --- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| S1  | Session Zod validators (create, update, cancel, with date/time/unit refinements + timesRequiredWhenCompleted)                       | `src/lib/validators/sessions.ts`                                                               | `[x]`  |
| S2  | Session read queries (list with client+provider+auth JOINs, detail, client sessions, auth sessions, paginated, server-side filters) | `src/server/queries/sessions.ts`                                                               | `[x]`  |
| S3  | Session server actions (create with FOR UPDATE + FIFO inside tx, update with ordered locking, cancel with optimistic locking)       | `src/server/actions/sessions.ts`                                                               | `[x]`  |
| S4  | Session log form (provider, client, CPT, units, POS, date/time, auth check card with green/amber/red/gray states)                   | `src/components/sessions/session-form.tsx`                                                     | `[x]`  |
| S5  | Auto-calculate units card (blue info card: Duration, Units, Modifier — real-time as user types)                                     | Built into session form                                                                        | `[x]`  |
| S6  | Auto-populate modifier codes from provider credential type                                                                          | Built into session form                                                                        | `[x]`  |
| S7  | Auth check card with utilization impact (replaces dropdown, "Change" link for manual override)                                      | Built into session form                                                                        | `[x]`  |
| S8  | CPT-credential blocking (RBT/BCaBA hard-blocked from QHP-only codes 97151/97155-97158)                                              | `src/server/actions/sessions.ts`, `src/lib/constants.ts`                                       | `[x]`  |
| S9  | Session list page with metric cards (hours/week, sessions 7d, flagged, unbilled) + filter tabs (All/This Week/Flagged)              | `src/app/(dashboard)/sessions/page.tsx`                                                        | `[x]`  |
| S10 | Session table + columns + detail sheet (row click opens side panel, stopPropagation on actions)                                     | `src/components/sessions/session-table.tsx`, `session-columns.tsx`, `session-detail-sheet.tsx` | `[x]`  |
| S11 | New session page (pre-select via query params)                                                                                      | `src/app/(dashboard)/sessions/new/page.tsx`                                                    | `[x]`  |
| S12 | Client detail: Sessions tab wired                                                                                                   | `src/components/clients/client-sessions-card.tsx`                                              | `[x]`  |
| S13 | Auth detail: Sessions tab wired                                                                                                     | `src/components/authorizations/auth-sessions-card.tsx`                                         | `[x]`  |
| S14 | Unit tests: 42 session validator tests, 82 session helper tests, 30 utility tests                                                   | `src/lib/validators/sessions.test.ts`, `session-helpers.test.ts`, `utils.test.ts`              | `[x]`  |
| +   | Session list metrics query (FILTER WHERE aggregation)                                                                               | `src/server/queries/sessions.ts`                                                               | `[x]`  |
| +   | Status-conditional fields (time/auth hidden for cancelled/no_show, clear values on status change)                                   | `src/components/sessions/session-form.tsx`                                                     | `[x]`  |
| +   | Shared MetricCard + DataTable onRowClick prop                                                                                       | `src/components/shared/metric-card.tsx`, `data-table.tsx`                                      | `[x]`  |

### 3B — Dashboard + Auth Intelligence (completed — Phase 1C)

> Built as Phase 1C (3 sub-sprints, 6 commits, 10+ audit findings fixed). Replaced 462-line client-side dashboard with async server components + Suspense + SQL aggregation.

| #   | Task                                                                                                                         | Files                                               | Status                             |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ---------------------------------- |
| 97  | Schema migration: add `ratePerUnit` (numeric 10,2, nullable) to `authorization_services`                                     | `drizzle/`                                          | `[—]` deferred to Phase 2          |
| 98  | Dashboard overview page (3 Suspense boundaries, ErrorBoundary per section, lightweight hasClients check)                     | `src/app/(dashboard)/overview/page.tsx`             | `[x]`                              |
| 99  | Metrics cards (active clients, avg utilization, hours this week, action items — SQL FILTER aggregation)                      | `src/components/dashboard/dashboard-metrics.tsx`    | `[x]`                              |
| 100 | Priority alerts card (aggregated by type+severity, max 5 visible groups, "everything is fine" state, AHRQ anti-fatigue)      | `src/components/dashboard/dashboard-alerts.tsx`     | `[x]`                              |
| 101 | Client overview table (urgency-scored, needs-attention/on-track split, UtilizationBar compact + ExpiryBadge, clickable rows) | `src/components/dashboard/dashboard-clients.tsx`    | `[x]`                              |
| 102 | Dashboard read queries (getDashboardMetrics, getDashboardAlerts, getClientOverviewForDashboard — Promise.all parallel)       | `src/server/queries/dashboard.ts`                   | `[x]`                              |
| 103 | Getting Started card (extracted to standalone component)                                                                     | `src/components/dashboard/getting-started-card.tsx` | `[x]`                              |
| 104 | Predictive burndown on auth detail ("At current pace, exhausts on [date]")                                                   | `src/components/authorizations/auth-detail.tsx`     | `[—]` Phase 1-Polish               |
| 105 | Under-utilization pacing alert (<50% used with >50% period elapsed)                                                          | `src/components/clients/client-overview.tsx`        | `[x]` built in Phase 1B-3          |
| 106 | Revenue-at-risk calculation ((approved - used) × ratePerUnit for auths expiring within 30d)                                  | `src/server/queries/dashboard.ts`                   | `[—]` Phase 2 (needs fee schedule) |
| 107 | Auth health composite score (utilization pacing + expiry proximity + gap risk)                                               | `src/server/queries/authorization-alerts.ts`        | `[—]` Phase 2+ (needs validation)  |
| +   | SectionErrorBoundary shared component (class component, componentDidCatch logging)                                           | `src/components/shared/section-error-boundary.tsx`  | `[x]`                              |
| +   | Skeleton loaders (metrics, alerts, clients — content-shaped placeholders)                                                    | `src/components/dashboard/*.tsx`                    | `[x]`                              |
| +   | Deleted 462-line monolithic dashboard-view.tsx (replaced by 3 async server components)                                       | —                                                   | `[x]`                              |
| +   | hasClients lightweight query (SELECT 1 LIMIT 1, doesn't block Suspense streaming)                                            | `src/server/queries/clients.ts`                     | `[x]`                              |

---

## AI Infrastructure (non-blocking, parallel track)

> These tasks set up the AI foundation. They can be done at any point and are **not blocking** for Sprints 2–4. The AI infrastructure enables Sprint 4B (auth letter parsing) and all Phase 2 AI features.

### AI-0 — AI Foundation (do anytime before Sprint 4B)

| #   | Task                                                                                    | Files                                                  | Status |
| --- | --------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------ |
| A1  | Install Vercel AI SDK + providers (`ai`, `@ai-sdk/anthropic`, `@ai-sdk/amazon-bedrock`) | `package.json`                                         | `[ ]`  |
| A2  | Create AI provider switcher (`getModel()` — anthropic dev / bedrock prod)               | `src/server/ai/index.ts`, `src/server/ai/providers.ts` | `[ ]`  |
| A3  | Create AI audit logging middleware (wraps every AI call, logs to `audit_logs`)          | `src/server/ai/middleware.ts`                          | `[ ]`  |
| A4  | Create Zod schema for auth letter extraction (confidence scores per field)              | `src/server/ai/schemas/authorization-letter.ts`        | `[ ]`  |
| A5  | Create code-based prompt registry (hash-versioned, immutable)                           | `src/server/ai/prompts/registry.ts`                    | `[ ]`  |
| A6  | Add env vars: `ANTHROPIC_API_KEY`, `AI_PROVIDER`                                        | `.env.local`, `src/lib/env.ts`                         | `[ ]`  |
| A7  | Build golden evaluation set (50+ synthetic auth letters with known-correct extractions) | `src/server/ai/eval/`                                  | `[ ]`  |

### AI-1 — Background Job Infrastructure (do anytime before Sprint 4B)

| #   | Task                                                                        | Files                                                | Status |
| --- | --------------------------------------------------------------------------- | ---------------------------------------------------- | ------ |
| A8  | Install Inngest (`inngest`) for durable background workflows                | `package.json`                                       | `[ ]`  |
| A9  | Create Inngest client + API route                                           | `src/lib/inngest.ts`, `src/app/api/inngest/route.ts` | `[ ]`  |
| A10 | Create auth letter processing workflow (upload → extract → validate → save) | `src/server/ai/pipelines/auth-letter-intake.ts`      | `[ ]`  |

### AI-2 — Phase 2 AI (after claims infrastructure)

> These features depend on Phase 2 billing infrastructure (Stedi). Listed here for visibility only.

| #   | Task                          | Description                                                                                   | Status |
| --- | ----------------------------- | --------------------------------------------------------------------------------------------- | ------ |
| A11 | Session note draft generation | AI drafts notes from structured session data (CPT, duration, goals). Ghost text UX.           | `[ ]`  |
| A12 | Pre-claim error scrubbing     | AI + rules check claims before submission (auth validity, CPT+modifier, NPI, denial patterns) | `[ ]`  |
| A13 | CPT code suggestion           | Pre-fill CPT based on provider type, client auth, past patterns                               | `[ ]`  |
| A14 | Claim denial prediction       | LLM-based risk scoring before submission + suggested fixes                                    | `[ ]`  |
| A15 | AI appeal letter generation   | Draft appeals citing denial reason, CPT codes, clinical documentation                         | `[ ]`  |

### AI-3 — Phase 3 AI (advanced intelligence)

> Future features. Listed for roadmap visibility only.

| #   | Task                              | Description                                                     | Status |
| --- | --------------------------------- | --------------------------------------------------------------- | ------ |
| A16 | Parent progress summaries         | AI-generated plain-language reports from session data           | `[ ]`  |
| A17 | Voice-to-structured session notes | Deepgram/AssemblyAI STT → LLM structuring → review UI           | `[ ]`  |
| A18 | Insurance call automation         | Partner integration with LunaBill/Infinitus for AI phone agents | `[ ]`  |

---

## Sprint 4: AI, Documents & Polish

### 4A — Documents & File Upload

| #   | Task                                                           | Files                                   | Status |
| --- | -------------------------------------------------------------- | --------------------------------------- | ------ |
| 94  | File upload component (Vercel Blob)                            | `src/components/shared/file-upload.tsx` | `[ ]`  |
| 95  | Document management (upload, list, associate with client/auth) | `src/server/actions/documents.ts`       | `[ ]`  |
| 96  | Upload helper (type/size validation)                           | `src/lib/upload.ts`                     | `[ ]`  |

### 4B — AI Auth Letter Parsing (requires AI-0 infrastructure)

| #   | Task                                                                                                                                                                                           | Files                                              | Status |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------ |
| 97  | Auth letter upload component (drag-and-drop, Vercel Blob)                                                                                                                                      | `src/components/authorizations/auth-upload.tsx`    | `[ ]`  |
| 98  | Parse auth letter via Vercel AI SDK (`generateObject` + vision)                                                                                                                                | `src/server/actions/ai-parse-auth.ts`              | `[ ]`  |
| 99  | AI review UI: side-by-side PDF + extracted form, confidence indicators (green/amber/red), field-by-field confirmation (NO "Confirm All"), linked evidence (click field → highlight PDF source) | `src/components/authorizations/auth-ai-review.tsx` | `[ ]`  |
| 100 | Save confirmed extraction → create authorization + services, log AI vs confirmed values separately in audit trail                                                                              | `src/server/actions/authorizations.ts`             | `[ ]`  |

### 4C — Audit & Observability

| #   | Task                                                       | Files                                         | Status |
| --- | ---------------------------------------------------------- | --------------------------------------------- | ------ |
| 101 | Audit logging service (`withAuditLog` wrapper)             | `src/server/services/audit.ts`                | `[ ]`  |
| 102 | Integrate audit logging into `authActionClient` middleware | `src/lib/safe-action.ts`                      | `[ ]`  |
| 103 | Authorization alert detection logic                        | `src/server/services/authorization-alerts.ts` | `[ ]`  |

### 4D — Clerk Webhook

| #   | Task                                              | Files                                 | Status |
| --- | ------------------------------------------------- | ------------------------------------- | ------ |
| 104 | Clerk webhook route (sync user/org changes to DB) | `src/app/api/webhooks/clerk/route.ts` | `[ ]`  |

### 4E — Seed Data & Testing

| #   | Task                                                                | Files                          | Status               |
| --- | ------------------------------------------------------------------- | ------------------------------ | -------------------- |
| 105 | Dev seed script ("Bright Futures ABA" practice with realistic data) | `src/server/db/seed.ts`        | `[ ]`                |
| 106 | Playwright E2E: auth flow (sign in, org select)                     | `tests/e2e/auth.spec.ts`       | `[ ]`                |
| 107 | Playwright E2E: client CRUD flow                                    | `tests/e2e/clients.spec.ts`    | `[ ]`                |
| 108 | Vitest: `calculateUnits()` + `utilizationPercent()`                 | `src/lib/utils.test.ts`        | `[x]` (in Sprint 2C) |
| 109 | Vitest: server action org isolation                                 | `src/server/actions/*.test.ts` | `[ ]`                |

---

## Architecture Notes

### Key Decisions (from deep research)

- **Enums**: `text` columns + TypeScript `as const` arrays + Zod validation. No pgEnum.
- **Money**: `numeric(10,2)` in Postgres + `decimal.js` for arithmetic. Never `parseFloat()`.
- **Multi-tenancy**: Shared schema with `organization_id`. Scoped query builder planned for Sprint 2.
- **Auth utilization**: Atomic SQL increments (`SET used_units = used_units + N`). Never read-modify-write.
- **8-minute rule**: Per-code (AMA) in Phase 1. Phase 2 adds CMS aggregate (Medicaid) and full-unit (strict Medicaid). Formula `floor(m/15) + (m%15 >= 8 ? 1 : 0)` verified against CMS Ch. 15 §220.3.
- **Modifier codes**: HM/HN/HO/HP auto-applied from credential type. Verified against Optum ABA Modifier FAQ. Phase 2 needs payer-specific overrides for state Medicaid U-series modifiers.
- **Care team**: Phase 1 uses `assignedBcbaId` (single BCBA). Phase 2 adds `client_providers` junction table with roles, `is_primary`, time-bounding. Care team is suggestive (drives defaults), not restrictive (any provider can log sessions for any client).
- **Auth overlap**: FIFO (oldest expiration first), allow manual override.
- **Audit logging**: Synchronous, in-transaction, append-only.

### AI Architecture (from deep research)

- **Framework**: Vercel AI SDK 6 (`ai` package) — replaces hand-rolled `lib/ai.ts` wrapper
- **Dev provider**: `@ai-sdk/anthropic` (Claude Sonnet, direct API, synthetic data only)
- **Prod provider**: `@ai-sdk/amazon-bedrock` (HIPAA-eligible, one-line swap from dev)
- **Structured output**: `generateObject` + Zod schemas with confidence scores
- **Background jobs**: Inngest (Vercel-native, durable workflows, `step.ai` for AI calls)
- **Principle**: Deterministic state machines with AI at bounded decision points — AI never controls flow
- **Principle**: Confidence-based routing — >90% auto-fill, 65-90% flagged review, <65% manual entry
- **Principle**: Progressive autonomy — ship in suggestion mode, graduate to automation as accuracy proves out
- **NOT using**: LangChain (overkill), vector DBs (no RAG needed), custom ML models (volume too low), OpenAI Whisper (hallucination risk in medical context)
- **See**: `docs/research/deep-research-ai-native.md` for full strategy

### Billing Research Findings (from 2026-03-26 audit)

Comprehensive verification of unit calculations, modifier codes, and payer-specific rules. All findings verified against CMS manuals, ABA Coding Coalition, Optum/UHC FAQs, and state Medicaid provider manuals.

**Unit Calculations (verified correct):**

- `calculateUnitsFromMinutes` formula verified against CMS Medicare Benefit Policy Manual Ch. 15 §220.3
- AMA per-code method (current default) is correct for commercial payers
- Three methods needed for Phase 2: `ama` (commercial), `cms` (Medicaid aggregate), `full_unit` (strict Medicaid like Arkansas — `floor(minutes/15)`, no rounding)
- CMS aggregate operates at **date-of-service level per patient**, not per session — needs date-level aggregation step in Phase 2
- All ABA CPT codes 97151-97158 are timed at 15-minute units (97151 is NOT untimed)
- January 2027: ABA Coding Coalition announced 6 new CPT codes + revisions to existing codes. Monitor in late 2026.

**Modifier Codes (verified correct):**

- `CREDENTIAL_MODIFIERS` mapping (RBT→HM, BCaBA→HN, BCBA→HO, BCBA-D→HP) confirmed by Optum ABA Modifier FAQ
- Auto-application of telehealth modifier 95 for POS 02/10 is correct
- Priority ordering and CMS 1500 4-modifier limit are correct
- 21 test cases cover all standard scenarios

**Phase 2 Billing Gaps (not blocking Phase 1):**

| Gap                                 | Impact | Details                                                                                                                                                                       |
| ----------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Payer-specific modifier overrides   | High   | Some state Medicaid programs use different modifiers: Nevada=UD, New Mexico=U1-U4, Minnesota=UB, Georgia=U6/U7. Need `payer_modifier_rules` table or JSONB override on payers |
| CMS aggregate unit calc method      | High   | Medicaid payers need date-level cross-code aggregation with remainder distribution. Current code hardcodes `unitCalcMethod: "ama"`                                            |
| `full_unit` calculation method      | Medium | Arkansas Medicaid and some strict programs require `floor(minutes/15)` with no rounding up                                                                                    |
| `supervisingProviderId` on claims   | Medium | CMS-1500 Box 17/17b needs supervising BCBA NPI when RBT is rendering provider. `sessions.supervisorId` exists but `claims` table lacks dedicated field                        |
| Rendering vs supervising NPI rules  | High   | Some payers want RBT NPI as rendering, others want BCBA NPI. Needs payer-level configuration                                                                                  |
| Modifier mutual exclusivity         | Medium | No validation prevents 59 + XE on same line (mutually exclusive). Add during claim generation                                                                                 |
| Credential expiry warning           | Medium | Expired RBT certification + HM modifier = denial. Track `credentialExpiry` and warn/block                                                                                     |
| `maxUnitsPerDay` server enforcement | Medium | Value exists in constants/schema but not enforced during session creation                                                                                                     |

**Recommended payer defaults for Phase 2:**

| Payer Type                           | Unit Calc   | Modifier Source                  |
| ------------------------------------ | ----------- | -------------------------------- |
| Commercial (BCBS, Aetna, Cigna, UHC) | `ama`       | Standard HM/HN/HO/HP             |
| Medicaid (most states)               | `cms`       | Standard, but check state manual |
| Medicare                             | `cms`       | Standard                         |
| TRICARE                              | `ama`       | Rule of Eights (per-code)        |
| Strict Medicaid (AR, etc.)           | `full_unit` | State-specific                   |

### Session Validation Rules (from 2026-03-26 research)

Multi-agent research across CMS documentation, ABA Coding Coalition, Optum/UHC policies, state Medicaid manuals, and ABA billing practitioner forums. Key finding: **most proposed "universal" rules are actually payer-specific or warnings, not hard blocks.**

**Design principle: Session logging captures what actually happened. Never block session creation for billing issues — that hides the problem. Warn at session creation, hard-block at claim generation.**

**Hard Blocks (prevent session save — truly universal, no exceptions):**

| Rule                                                        | Why Universal                                                                                                     |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Same provider, overlapping 1:1 sessions (different clients) | Fraud indicator — physically impossible. "Impossible day" pattern is primary OIG audit target                     |
| RBT billing QHP-only CPT codes (97151, 97155-97158)         | Embedded in CPT code definitions by the AMA. No state/payer exception exists. BACB scope of practice prohibits it |

**Warnings (show alert at session creation, allow save, flag for billing review):**

| Rule                                              | Classification    | Why Not a Block                                                                                                         |
| ------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Session date outside auth date range              | Universal Warning | Retroactive authorizations exist (0-90 days depending on payer). Practice may attach auth later                         |
| Max units/day (MUE) exceeded                      | Universal Warning | All ABA CPT codes have MAI=3 (appealable, not absolute). Pre-authorized amounts override MUEs. MUE values vary by payer |
| Missing supervisor for RBT sessions               | Universal Warning | Depends on billing model (3 models exist — see below). Supervisor can be assigned before claim generation               |
| Expired provider credentials                      | Universal Warning | BACB has 30-day renewal grace period. Practice may be mid-renewal process                                               |
| BCaBA billing QHP codes                           | Payer-Specific    | BCaBAs ARE considered QHPs by some payers/states (e.g., Virginia DMAS, some BCBS). Configurable, not blockable          |
| Concurrent BCBA + RBT same client (97155 + 97153) | Allowed           | CPT 97155 description explicitly includes "simultaneous direction of technician"                                        |
| Group codes (97154, 97157, 97158) overlapping     | Allowed           | Group codes by definition serve 2-8 clients simultaneously                                                              |

**Hard Blocks at Claim Generation (Phase 2 — prevent claim submission, not session logging):**

| Rule                                                        | Why Block at Claim                     |
| ----------------------------------------------------------- | -------------------------------------- |
| Session date outside auth date range (no retro-auth flag)   | Claim will be auto-denied              |
| Missing supervisor for RBT session (when payer requires it) | Claim will be denied — payer-specific  |
| Expired credentials on date of service                      | Recoupment risk if discovered in audit |

**Three RBT Billing Models (payer-specific — affects supervisor requirements):**

| Model           | Rendering Provider (Box 24J) | Supervisor (Box 17)          | Used By                                   |
| --------------- | ---------------------------- | ---------------------------- | ----------------------------------------- |
| A (most common) | BCBA's NPI                   | Empty — BCBA IS the renderer | Most commercial (Aetna, Cigna, many BCBS) |
| B               | RBT's NPI                    | BCBA with DQ qualifier       | TRICARE, some Medicaid, some BCBS         |
| C               | RBT's NPI (group billing)    | Payer-dependent              | Larger practices, some Medicaid           |

**Key insight:** Under Model A (most small practices), the RBT is invisible on the claim. There is no "supervisor" field because the BCBA IS the rendering provider. The supervision relationship is documented in clinical records, not on the claim form. Optum/UHC explicitly states their supervisory services reimbursement policy does NOT apply to ABA services.

**BACB supervision (5% monthly hours) is a CERTIFICATION requirement, NOT a billing/claim requirement.** These are completely separate systems. A practice can be BACB-compliant on supervision while having zero supervisor fields on claims (Model A), and vice versa.

**Correction needed in codebase:** `QHP_ONLY_CPT_CODES` currently hard-blocks BCaBAs. This should be a configurable warning — BCaBAs are QHPs in some jurisdictions. Safe default: warn for BCaBAs, block for RBTs.

**Implementation plan (2-tier validation engine):**

1. **Session creation:** Run all checks, show warnings inline, only hard-block the 2 universal rules
2. **Billing readiness indicator:** Per-session status — green (clean), amber (warnings), red (will be blocked at claim generation)
3. **Claim generation (Phase 2):** Hard-block on all payer-specific rules. Payer configuration drives which warnings become blocks.

### Care Team / Client-Provider Assignment (from 2026-03-26 research)

Multi-agent competitive research across CentralReach, AlohaABA, Raven Health, Motivity, Healthie, SimplePractice, plus BACB supervision requirements and ABA practitioner forums.

**Real-world care team structure per client:**

- 1+ supervising BCBAs (one primary, others for coverage/transition/supervision)
- 0-1 BCaBAs (uncommon, assists BCBA)
- 1-4 RBTs (frontline therapy, high turnover: 77-103% annually)
- Optional: Clinical Director (BCBA-D, oversees BCBAs)

**Critical design principles:**

- **Care team = convenience, not access control.** The team is "who usually works with this client" — it drives smart defaults and caseload views, but never blocks service delivery.
- **Sessions record who actually showed up.** Any active provider in the org can log for any client, whether or not they're on the team. Float RBTs, coverage BCBAs, one-time assessments — all valid without team assignment.
- **Multiple BCBAs per client are valid.** Primary BCBA owns the treatment plan/auth, but coverage BCBAs, transitioning BCBAs, and clinical directors may also be on the team.
- **`is_primary` is a flag, not a role restriction.** One primary BCBA per client for auth/claims defaults, but multiple BCBA-role team members are allowed.
- **Phase 3 optional restriction.** Larger practices may want a "restrict sessions to team members" setting. Off by default.

**Competitor landscape (opportunity):**

| Platform     | Model                                                  | Weakness                            |
| ------------ | ------------------------------------------------------ | ----------------------------------- |
| CentralReach | Manual "Connections" per client-employee pair          | Setup friction, no role distinction |
| AlohaABA     | Implicit through scheduling/permissions                | No visible team anywhere            |
| Raven Health | Scheduling-driven, no formal team                      | Same — emergent, not explicit       |
| Motivity     | Explicit "Learner Team" with permission scoping        | Best in ABA, but no time-bounding   |
| Healthie     | Primary provider + Care Team members + bulk assignment | Best UX, but no roles               |

**No ABA platform does care teams well. This is a differentiator.**

**Phase 1 (current — adequate):**

- `clients.assignedBcbaId` covers the primary BCBA relationship
- 15 locations in codebase assume single BCBA (schema, queries, actions, validators, UI)
- Sessions already allow any org provider via `sessions.providerId`
- Sufficient for MVP — most small practices have 1-2 BCBAs

**Phase 2 (add junction table):**

```
client_providers:
  id              — nanoid PK
  organization_id — FK, multi-tenant isolation
  client_id       — FK to clients
  provider_id     — FK to providers
  role            — text: 'supervising_bcba' | 'bcba' | 'lead_rbt' | 'rbt' | 'bcaba'
  is_primary      — boolean (one primary per client, for auth/claims defaults)
  start_date      — date, when assignment began
  end_date        — date nullable, null = active, date = historical
  notes           — text nullable ("covering for X during leave")
  created_at, updated_at

Indexes:
  (org_id, client_id) WHERE end_date IS NULL  — active team for client
  (org_id, provider_id) WHERE end_date IS NULL — active caseload for provider
  UNIQUE (org_id, client_id, provider_id) WHERE end_date IS NULL — no duplicate active assignments
```

Migration: Seed from existing `assignedBcbaId`. Keep `assignedBcbaId` as denormalized shortcut until fully migrated.

**Phase 2 UI:** Care Team card on client detail (avatar list with roles), team management in client edit, provider dropdown on session form suggests team members first.

**Phase 3 features:**

- BACB supervision ratio tracking (5% of monthly RBT direct hours supervised by BCBA)
- ReBAC data scoping — "If on Team" permission model (Motivity pattern)
- Optional "restrict sessions to team" setting per practice
- Substitution workflow (one-click temp assignment)
- Bulk team assignment from client list (Healthie pattern)
- Historical team assignment records for compliance audits

**BACB supervision requirements (for Phase 3 tracking):**

- RBTs: minimum 5% of monthly direct-service hours supervised by BCBA/BCaBA
- Cannot be averaged across months — must be met every calendar month
- At least 2 face-to-face supervision contacts per month
- At least 1 must be individual (not group)
- At least 1 must include direct observation of RBT with client
- Non-compliance = RBT certification suspension/revocation + retroactive claim denials

### Clinical Documentation — Goals, Session Notes, Treatment Plans (from 2026-03-26 research)

Multi-agent research across CentralReach, Motivity, ABA Matrix, Brellium, Raven Health, Catalyst, SimplePractice, CMS documentation requirements, ABA Coding Coalition, state Medicaid provider manuals, and ABA billing practitioner forums.

**Key insight: Session notes are NOT submitted with claims — they're kept on file and produced during audits. But inadequate notes lead to retroactive denial and recoupment ($56M Indiana, $94M Wisconsin Medicaid improper payments). CentralReach admits 80% of session notes fail at least one payer requirement.**

**Dependency chain:**

```
Treatment Plan / BIP → Goals → Session Notes → Progress Reports → Claims
```

**Design principle: Don't build a treatment plan authoring tool. Build a goals registry that session notes reference. Full plans live wherever the BCBA writes them. Clinivise is a PM tool, not a data collection tool — trial-by-trial data stays in Catalyst/Motivity.**

**ABA goal hierarchy (industry standard):**

```
Domain (Communication, Social, Behavior Reduction, ...)
  └─ Goal/Program ("Client will functionally request preferred items")
       └─ Objective ("Request using 2-word phrases at 80% across 3 sessions")
            └─ Target ("Request 'more juice'") ← NOT built, stays in Catalyst/Motivity
```

Typical client: 8-15 active goals across 3-6 domains, 2-4 objectives per goal.

---

#### Phase CD-1: Client Goals Registry (next to build)

**Schema: `client_goals`**

```
client_goals:
  id                  — nanoid PK
  organization_id     — FK organizations
  client_id           — FK clients
  goal_number         — integer (display order within domain)
  title               — text ("Manding for preferred items")
  description         — text (full SMART goal: "Given [context], client will [behavior] with [criteria] by [date]")
  domain              — text: 'communication' | 'social_skills' | 'adaptive_behavior' |
                               'behavior_reduction' | 'academic' | 'play_leisure' |
                               'self_care' | 'motor' | 'vocational' | 'other'
  goal_type           — text: 'skill_acquisition' | 'behavior_reduction'
  status              — text: 'active' | 'met' | 'on_hold' | 'discontinued'
  baseline_data       — text nullable ("20% accuracy at intake assessment")
  mastery_criteria    — text ("80% accuracy across 3 consecutive sessions")
  target_behavior     — text nullable ("Independent manding using 2+ word phrases")
  start_date          — date
  target_date         — date nullable (expected mastery)
  met_date            — date nullable
  treatment_plan_ref  — text nullable ("ITP v2, Section 3.1" — links to external doc)
  sort_order          — integer (for ordering within domain groups)
  notes               — text nullable
  created_at, updated_at
  deleted_at          — timestamp nullable (soft delete)
```

**Schema: `client_goal_objectives`**

```
client_goal_objectives:
  id                  — nanoid PK
  organization_id     — FK organizations
  goal_id             — FK client_goals
  objective_number    — integer (1a, 1b, 1c display)
  description         — text ("Request 3+ preferred edibles using 2-word phrases with 80% independence across 20 trials")
  status              — text: 'active' | 'met' | 'on_hold' | 'discontinued'
  mastery_criteria    — text nullable
  current_performance — text nullable ("75% accuracy as of 3/20" — updated from session notes)
  met_date            — date nullable
  sort_order          — integer
  notes               — text nullable
  created_at, updated_at
```

**Constants:**

```typescript
GOAL_DOMAINS = ["communication", "social_skills", "adaptive_behavior", "behavior_reduction",
                "academic", "play_leisure", "self_care", "motor", "vocational", "other"]
GOAL_TYPES = ["skill_acquisition", "behavior_reduction"]
GOAL_STATUSES = ["active", "met", "on_hold", "discontinued"]
GOAL_DOMAIN_LABELS = { communication: "Communication", social_skills: "Social Skills", ... }
```

**UI: Goals tab on client detail page**

- Card-based list grouped by domain (not a table — goals are too rich for table rows)
- Each goal card: number, title, status badge, mastery criteria, baseline, dates
- Objectives nested inline under each goal (collapsible)
- Met/discontinued goals collapsed at bottom ("Show 2 met goals")
- Add Goal via Sheet/drawer (domain, type, title, description, criteria, dates)
- Edit/archive via overflow menu
- Permission: BCBAs and admins only (goals = treatment plan responsibility)

**Implementation tasks:**

| #       | Task                                                                                          | Files                                      | Status |
| ------- | --------------------------------------------------------------------------------------------- | ------------------------------------------ | ------ |
| CD-1.1  | Create `client_goals` + `client_goal_objectives` + `client_goal_targets` schema               | `src/server/db/schema/client-goals.ts`     | `[x]`  |
| CD-1.2  | Add goal constants (domains, types, statuses, labels, behavior functions, assessment sources) | `src/lib/constants.ts`                     | `[x]`  |
| CD-1.3  | Create Zod validators for goal/objective/target CRUD                                          | `src/lib/validators/goals.ts`              | `[x]`  |
| CD-1.4  | Generate + run migrations                                                                     | `drizzle/`                                 | `[x]`  |
| CD-1.5  | Goal read queries (list by client, grouped by domain)                                         | `src/server/queries/goals.ts`              | `[x]`  |
| CD-1.6  | Goal server actions (create, update, change status, add objective)                            | `src/server/actions/goals.ts`              | `[x]`  |
| CD-1.7  | Goals tab component (card list grouped by domain)                                             | `src/components/clients/client-goals.tsx`  | `[x]`  |
| CD-1.8  | Add Goal dialog + Add Objective dialog                                                        | `src/components/clients/client-goals.tsx`  | `[x]`  |
| CD-1.9  | Wire Goals tab into client detail page                                                        | `src/components/clients/client-detail.tsx` | `[x]`  |
| CD-1.10 | Update UI for new goal fields (behavior reduction, targets, expanded statuses)                | Multiple                                   | `[ ]`  |
| CD-1.11 | Unit tests: goal validators, status transitions                                               | `src/lib/validators/goals.test.ts`         | `[ ]`  |

---

#### Phase CD-2: Structured Session Notes

**Schema: `session_notes`** (separate from `sessions.notes` quick-entry text field)

```
session_notes:
  id                    — nanoid PK
  organization_id       — FK organizations
  session_id            — FK sessions (unique — one structured note per session)
  cpt_code              — text (copied from session, drives template)

  -- Structured clinical content (all CPT codes)
  goals_addressed       — jsonb [{goalId, objectiveId?, goalTitle, trials?, correct?,
                                   accuracy?, promptLevel?, progress, notes?}]
  interventions_used    — text[] ('DTT', 'NET', 'prompting', 'reinforcement', etc.)
  client_presentation   — text (brief observation at session start)
  behavioral_incidents  — text (ABC data if behaviors occurred)

  -- CPT-specific fields
  caregiver_present     — boolean (required for 97156)
  caregiver_name        — text (required for 97156)
  caregiver_relationship— text (required for 97156)
  training_topics       — text[] (required for 97156 — BST components)
  caregiver_competency  — text (required for 97156 — fidelity assessment)
  protocol_modifications— text (required for 97155 — what changed, clinical rationale)
  data_analysis         — text (required for 97155 — what data prompted the change)
  assessment_tools      — text[] (required for 97151 — VB-MAPP, ABLLS-R, etc.)
  assessment_domains    — text[] (required for 97151 — what domains were assessed)

  -- Narrative
  narrative             — text (free text or AI-generated summary)

  -- AI generation tracking
  ai_generated          — boolean DEFAULT false
  ai_edited             — boolean DEFAULT false

  -- Signature workflow
  author_id             — FK providers (who wrote the note)
  author_signed_at      — timestamp (locks the note)
  supervisor_id         — FK providers (BCBA who reviewed)
  supervisor_signed_at  — timestamp (co-signature)
  caregiver_signed_at   — timestamp

  -- Status
  status                — text: 'draft' | 'signed' | 'pending_review' | 'approved' | 'rejected' | 'amended'
  rejection_reason      — text
  amended_from_id       — FK session_notes (self-ref for amendments)

  created_at, updated_at
```

**CPT-specific templates:**

| CPT                        | Who Writes | Required Fields                                        | Template Focus                                          |
| -------------------------- | ---------- | ------------------------------------------------------ | ------------------------------------------------------- |
| 97153 (RBT therapy)        | RBT        | goals_addressed, interventions_used, narrative         | Goals data, trial scores, prompt levels, progress       |
| 97155 (BCBA modification)  | BCBA       | goals_addressed, protocol_modifications, data_analysis | What data prompted change, what was modified, rationale |
| 97156 (caregiver training) | BCBA       | caregiver\_\*, training_topics, caregiver_competency   | Caregiver name, BST components, competency              |
| 97151 (assessment)         | BCBA       | assessment_tools, assessment_domains, narrative        | Instruments used, domains assessed, findings            |

**Signature workflow (Motivity model):**

```
draft → signed (author signs, note locks)
      → pending_review (auto if BCBA review required for this CPT/payer)
      → approved (BCBA co-signs)
      → OR rejected (BCBA sends back with reason, note unlocks)
      → amended (correction after approval, new version links to original)
```

**Permission model:**

- RBT: create/edit own notes in draft, view own approved notes
- BCBA: create own, view/edit supervised RBT notes, approve/reject, co-sign
- Admin/Billing: view all approved notes (read-only), flag for review

**Minimum audit-proof 97153 note:** "Implemented DTT for manding targets per Goal 2. Client achieved 80% accuracy across 20 trials (up from 65% last session). Reinforcement: token economy. Prompt level: verbal. No maladaptive behaviors observed."

**Implementation tasks:**

| #       | Task                                                                            | Files                                           | Status |
| ------- | ------------------------------------------------------------------------------- | ----------------------------------------------- | ------ |
| CD-2.1  | Create `session_notes` + `session_note_goals` + `session_note_behaviors` schema | `src/server/db/schema/session-notes.ts`         | `[x]`  |
| CD-2.2  | Create note validators (per-CPT required fields)                                | `src/lib/validators/session-notes.ts`           | `[x]`  |
| CD-2.3  | Generate + run migrations (verified against CASP/TRICARE/Optum)                 | `drizzle/`                                      | `[x]`  |
| CD-2.4  | Note read queries (by session, BCBA review queue)                               | `src/server/queries/session-notes.ts`           | `[ ]`  |
| CD-2.5  | Note server actions (create, update, sign, approve/reject)                      | `src/server/actions/session-notes.ts`           | `[ ]`  |
| CD-2.6  | "Complete Note" button on session detail page                                   | `src/app/(dashboard)/sessions/[id]/page.tsx`    | `[ ]`  |
| CD-2.7  | Session note form (CPT-aware template, goals multi-select)                      | `src/components/sessions/session-note-form.tsx` | `[ ]`  |
| CD-2.8  | BCBA review queue page (unsigned notes pending co-signature)                    | `src/app/(dashboard)/notes/page.tsx`            | `[ ]`  |
| CD-2.9  | Dashboard: "Unsigned notes" alert count                                         | `src/server/queries/dashboard.ts`               | `[ ]`  |
| CD-2.10 | Note status badges + signature display on session detail                        | `src/components/sessions/session-detail.tsx`    | `[ ]`  |
| CD-2.11 | "Billing readiness" indicator per session (green/amber/red)                     | `src/components/sessions/`                      | `[ ]`  |

**Current state:** Sessions have a `notes` text field for quick free-text entry. This stays as the "30-second log" quick note. The full structured session note is completed later via the "Complete Note" action on the session detail page.

---

#### Cross-Table Schema Audit (completed 2026-03-26)

28 fields added across 6 tables based on CMS-1500, payer audit, and competitor verification. Schema is applied but **UI forms/displays are not yet updated**.

| #    | Task                                                                                                             | Files                                                | Status |
| ---- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------ |
| SA-1 | Client form: primaryLanguage, interpreterNeeded, secondaryDiagnosisCodes, referringProvider, medicaidId           | `client-form.tsx`, `client-overview.tsx`             | `[x]`  |
| SA-2 | Provider form: email, phone, stateLicenseNumber/Expiry, taxonomyCode, modifierCode                               | `provider-form.tsx`, `provider-detail.tsx`           | `[x]`  |
| SA-3 | Authorization form: authType, requestingProviderId, denialReason, appealDeadline                                  | `authorization-form.tsx`, `authorization-detail.tsx` | `[x]`  |
| SA-4 | Session form: cancellationReason, cancelledBy, serviceAddress                                                     | `session-form.tsx`, `session-detail.tsx`             | `[x]`  |
| SA-5 | Payer form: electronicPayerId, portalUrl, authDepartmentEmail                                                     | `payer-form.tsx`                                     | `[x]`  |
| SA-6 | Org settings: billing entity section (billingName, billingNpi, billingTaxId, billingAddress)                      | `practice-info-form.tsx`                             | `[x]`  |
| SA-7 | Goal UI: behavior reduction fields, assessment source, expanded status lifecycle                                  | `client-goals.tsx`                                   | `[x]`  |
| SA-8 | Validators updated inline with each SA task                                                                       | `validators/*.ts`                                    | `[x]`  |

---

#### Phase CD-3: AI Note Generation

- Structured goal data → AI generates narrative (ABA Matrix model: structured data in, narrative out, human review required)
- "Load previous note" for recurring sessions (SimplePractice pattern — RBTs run the same programs 3-5x/week)
- AI-generated notes flagged with `ai_generated = true`, edits tracked with `ai_edited = true`
- Manual note: 15-30 min. Template-based: 8-12 min. AI-assisted: 2-5 min (60-80% reduction)
- Requires AI infrastructure (Vercel AI SDK + Bedrock — see AI Architecture section)

---

#### Phase CD-4: Note Compliance & Auditing

- Payer-specific compliance checks (Brellium model — 100+ rules per payer)
- Copy-paste / similarity detection (OIG fraud indicator #1 — "cloned notes")
- Timeliness tracking (24-72 hour signing requirement, configurable per practice)
- Note quality scoring (completeness, specificity, data presence)
- "Unsigned notes" dashboard alert with aging (>24h amber, >72h red)
- Audit trail: who edited what, when, amendment chain

---

#### Phase CD-5: Treatment Plan Management (if needed)

- Full BIP authoring with structured sections
- Assessment integration (97151 results → treatment plan → goals auto-populated)
- Progress report generation from aggregated session note data (for re-authorization)
- Treatment plan version history with diff view
- Goal template library (practice-level, reusable across clients)
- Import goals from Motivity/Catalyst API (clinical integration)

### All-in-One Strategy (from 2026-03-26 market research)

**Strategic pivot: Clinivise is an all-in-one ABA platform, not a PM-only tool.**

The market has bifurcated: PM-only tools (AlohaABA) force double-entry with clinical tools (Motivity). All-in-one tools (CentralReach) are powerful but have terrible UX. The opportunity: **be the all-in-one that doesn't suck.**

Research findings:

- ABA practitioners' #1 complaint is using too many software tools
- AlohaABA + Motivity goals do NOT sync — BCBAs manually reference goals by name
- CentralReach users complain about complexity but don't switch because consolidation is valuable
- Goals without data collection is "a skeleton without muscles" — the hierarchy only matters if it powers data collection
- Nobody has nailed both clinical + PM with good UX for small practices

**The build order matters.** PM foundation (complete) → Clinical goals + notes → Data collection → Graphing + mastery → Billing. Each layer unlocks the next.

### Clinical Platform Roadmap

```
Phase 2: Goals + Session Notes (current)
  └─ Goal Domains (custom per org)
  └─ Client Goals (treatment plan goals)
  └─ Goal Objectives (measurable milestones)
  └─ Structured Session Notes (CPT-specific, goal-linked, signature workflow)

Phase 3: Data Collection
  └─ Targets under Objectives (atomic data-collection units)
  └─ Data Collection Types (DTT, frequency, duration, task analysis, interval)
  └─ Mobile/Tablet Data Entry Interface
  └─ Real-time session data (live collection during sessions)

Phase 4: Graphing + Intelligence
  └─ Per-target data graphing + trend lines
  └─ Mastery criteria automation (configurable per target)
  └─ Phase progression (baseline → acquisition → maintenance)
  └─ AI Note Generation (structured data → narrative → human review)
  └─ Progress Reports (aggregated for re-authorization)

Phase 5: Billing
  └─ Claims submission (Stedi EDI 837P)
  └─ ERA processing (835 remittance)
  └─ Eligibility checks (270/271)
  └─ Denial management + appeal workflow

Future:
  └─ Assessment integration (VB-MAPP, ABLLS-R → auto-generate goals)
  └─ Treatment plan authoring (BIP with structured sections)
  └─ Scheduling / Calendar
  └─ Parent portal
  └─ Analytics + reporting dashboards
  └─ Supervision compliance tracking
  └─ Goal template library (practice-level, community-shared)
```

---

### Competitive Gap Analysis (2026-03-26)

Verified against CentralReach, AlohaABA, Motivity, Theralytics, Raven Health, Catalyst/RethinkBH, Artemis, Passage Health, and practitioner reviews/complaints from Capterra, G2, and Reddit.

#### Table Stakes (must build — every competitor has these)

| Feature                        | Status                           | Priority                          | Notes                                                                                                                                                              |
| ------------------------------ | -------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Scheduling / Calendar**      | Not started                      | **P0 — next after session notes** | Auth-aware scheduling (block over-scheduling), recurring templates, conflict detection, drag-and-drop. The #1 gap — without it, practices need a second tool.      |
| **Basic Reports (exportable)** | Minimal (dashboard only)         | P1                                | Auth utilization, session summaries, staff hours, cancellation rates. CSV/PDF export. Enables payroll workflows without building payroll module.                   |
| **Document Management UI**     | Schema exists, no UI             | P1                                | Per-client document library: upload, categorize (consent, assessment, treatment plan, auth letter), retrieve. Payer audits request docs within 5-10 business days. |
| **Claims / Billing (RCM)**     | Schema stubs (Phase 2 via Stedi) | P1                                | Session-to-claim conversion, claims scrubbing, clearinghouse submission (837P), ERA/835 processing, denial management. Monetization engine (2-4% of collections).  |
| **E-Signatures (full UI)**     | Schema + workflow exists         | P1                                | Provider sign, supervisor co-sign, bulk signing for BCBA review queue, timestamped audit trail.                                                                    |
| **Eligibility Verification**   | Schema stub                      | P2                                | Real-time 270/271 checks, batch verification for weekly schedule, coverage lapse alerts. Reduces claim denials 25-30%.                                             |

#### Differentiators (some competitors have, would set us apart)

| Feature                                            | Status               | Priority | Notes                                                                                                                                                                         |
| -------------------------------------------------- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Progress Graphing**                              | Not started          | P1       | We already capture per-goal session data. Auto-generate line graphs from that data. BCBAs need this for treatment decisions + insurance submissions. Low effort / high value. |
| **AI Treatment Plan / Progress Report Generation** | Not started          | P2       | Strongest AI-native play. Goals data + session data → compliant documents. Saves BCBAs 3-5 hours per client per quarter.                                                      |
| **Supervision Tracking**                           | Not started          | P2       | BACB 5% monthly requirement. Track supervision hours per RBT, ensure 2+ contacts/month, exportable logs. Few competitors do well.                                             |
| **Intake Pipeline**                                | Not started          | P2       | Referral → eligibility → assessment → onboarded. Simple status + checklist. Practices lose clients during this funnel.                                                        |
| **Cancellation Analytics**                         | Not started          | P2       | Cancellations = #1 revenue leak. Report on existing session status data by client, provider, reason code.                                                                     |
| **Enhanced Credentialing**                         | Basic (expiry dates) | P3       | Multi-credential tracking per provider, CAQH status, payer panel enrollment, background check tracking, credential-based scheduling blocks.                                   |
| **Goal Template Library**                          | Not started          | P3       | Org-level reusable goal templates (with objectives + targets). Motivity has 30,000+ community templates.                                                                      |
| **Assessment-Linked Goal Generation**              | Not started          | P3       | After VB-MAPP/ABLLS-R assessment, auto-suggest goals for unmastered milestones. CentralReach does this.                                                                       |

#### Nice-to-Have (low priority for Phase 1-2)

| Feature                             | Notes                                                     |
| ----------------------------------- | --------------------------------------------------------- |
| Telehealth                          | Integrate (Zoom/Doxy.me link from calendar), don't build  |
| Payroll integration                 | CSV hours export to QuickBooks/Gusto sufficient           |
| Parent/caregiver portal             | Phase 3. Becomes important when billing is live           |
| Appointment reminders (SMS/email)   | Build with scheduling. Use Twilio/Resend                  |
| EVV (Electronic Visit Verification) | Only mandated for ABA in CO and FL. Monitor for expansion |
| Mobile data collection              | Phase 3+. Lightweight tap-to-record on existing goals     |

#### Not Applicable for Small Practices (1-50 staff)

- LMS / Training content (use Relias, BACB courses)
- Multi-entity / holding company management
- Custom workflow engine / automation builder
- E-prescribing (BCBAs cannot prescribe)
- Built-in clearinghouse (use Stedi)
- Advanced BI dashboards (AI-native insights instead)

#### Top Practitioner Pain Points (why they switch)

1. **Cost** — CentralReach at $50/user/month unsustainable for small practices. Our free PM tier wins.
2. **Data loss** — Crashes losing session notes is the most emotionally charged complaint. We need auto-save.
3. **Complexity** — Enterprise tools require weeks of training. Target: RBT proficiency in minutes.
4. **Multi-tool hell** — 3-5 separate tools with broken integration. Our all-in-one play addresses this.
5. **Vendor lock-in** — CentralReach makes export painful. Guarantee easy data export.

---

_Last updated: 2026-03-27 — Phase 1 PM complete. CD-1 goals done. CD-2 session notes schema done (queries/actions/UI next). SA-1–8 UI sync complete (28 new fields across 6 tables now in all forms + detail views). Each SA audited. QA audit fixed (status transitions, org scope, validation). Competitive gap analysis in roadmap. Target CRUD deferred (needs new server actions)._
