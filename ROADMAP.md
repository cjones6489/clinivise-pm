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

### 2D — Authorizations

| #   | Task                                                        | Files                                                 | Status |
| --- | ----------------------------------------------------------- | ----------------------------------------------------- | ------ |
| 76  | Authorization list page (filterable, expiry alerts)         | `src/app/(dashboard)/authorizations/page.tsx`         | `[ ]`  |
| 77  | Authorization table component                               | `src/components/authorizations/auth-table.tsx`        | `[ ]`  |
| 78  | Authorization create/edit form                              | `src/components/authorizations/auth-form.tsx`         | `[ ]`  |
| 79  | Authorization detail page (services, utilization, docs)     | `src/app/(dashboard)/authorizations/[id]/page.tsx`    | `[ ]`  |
| 80  | Authorization service lines (add CPT code + approved units) | `src/components/authorizations/auth-services.tsx`     | `[ ]`  |
| 81  | Utilization tracker (used vs approved, visual bar)          | `src/components/authorizations/auth-utilization.tsx`  | `[ ]`  |
| 82  | Expiry alert card                                           | `src/components/authorizations/auth-expiry-alert.tsx` | `[ ]`  |
| 83  | Authorization server actions (CRUD + utilization calc)      | `src/server/actions/authorizations.ts`                | `[ ]`  |
| 84  | Authorization Zod validators                                | `src/lib/validators/authorizations.ts`                | `[ ]`  |
| 85  | Authorization read queries                                  | `src/server/queries/authorizations.ts`                | `[ ]`  |

---

## Sprint 3: Sessions & Dashboard

### 3A — Session Logging

| #   | Task                                                               | Files                                        | Status |
| --- | ------------------------------------------------------------------ | -------------------------------------------- | ------ |
| 77  | Session log form (provider, client, CPT, units, POS, date/time)    | `src/components/sessions/session-form.tsx`   | `[ ]`  |
| 78  | Auto-calculate units from start/end time (CMS 8-min rule)          | Built into session form + `calculateUnits()` | `[ ]`  |
| 79  | Auto-populate modifier codes from provider credential type         | Built into session form                      | `[ ]`  |
| 80  | Auth enforcement: warn/block if exceeding authorized units         | Built into session form                      | `[ ]`  |
| 81  | Session list page with filters (date, provider, client, status)    | `src/app/(dashboard)/sessions/page.tsx`      | `[ ]`  |
| 82  | Session table component                                            | `src/components/sessions/session-table.tsx`  | `[ ]`  |
| 83  | New session page                                                   | `src/app/(dashboard)/sessions/new/page.tsx`  | `[ ]`  |
| 84  | Auto-decrement auth utilization on session save (atomic increment) | `src/server/actions/sessions.ts`             | `[ ]`  |
| 85  | Session server actions (CRUD)                                      | `src/server/actions/sessions.ts`             | `[ ]`  |
| 86  | Session Zod validators                                             | `src/lib/validators/sessions.ts`             | `[ ]`  |
| 87  | Session read queries                                               | `src/server/queries/sessions.ts`             | `[ ]`  |

### 3B — Dashboard Overview

| #   | Task                                                     | Files                                                 | Status |
| --- | -------------------------------------------------------- | ----------------------------------------------------- | ------ |
| 88  | Dashboard overview page                                  | `src/app/(dashboard)/overview/page.tsx`               | `[ ]`  |
| 89  | Metrics cards (sessions this week, active clients, etc.) | `src/components/dashboard/metrics-cards.tsx`          | `[ ]`  |
| 90  | Expiring authorizations widget                           | `src/components/dashboard/expiring-auths-widget.tsx`  | `[ ]`  |
| 91  | Utilization warning alerts (80%/95% thresholds)          | `src/components/dashboard/utilization-alerts.tsx`     | `[ ]`  |
| 92  | Recent sessions widget                                   | `src/components/dashboard/recent-sessions-widget.tsx` | `[ ]`  |
| 93  | Dashboard read queries (aggregations)                    | `src/server/queries/dashboard.ts`                     | `[ ]`  |

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
- **8-minute rule**: Per-session in Phase 1, per-day aggregation in Phase 2. Default AMA method.
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

### What's Explicitly Out of Scope (Phase 2+)

- Claims submission / ERA processing / eligibility checks (Stedi)
- Denial management / Billing dashboard
- Analytics & reporting
- Parent portal
- Clinical integrations (Motivity, Hi Rasmus)
- Postgres RLS (defense-in-depth before production PHI)

---

_Last updated: 2026-03-21 — Sprint 2C completed + broader QA pass_
