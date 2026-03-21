# Clinivise Engineering Specification

> **Purpose**: Drop this file into Cursor/Claude Code to scaffold and build the Clinivise ABA practice management platform. Companion to `clinivise-research-spec.md` which contains technology decisions, pricing, and ABA billing reference data.

---

## 1. Package Installation

Run these in order after `pnpm create next-app@latest clinivise --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`.

```bash
# Core framework (should already be installed by create-next-app)
pnpm add next@latest react@latest react-dom@latest

# Database
pnpm add drizzle-orm @neondatabase/serverless
pnpm add -D drizzle-kit

# Authentication
pnpm add @clerk/nextjs

# UI
pnpm add class-variance-authority clsx tailwind-merge lucide-react
pnpm add @radix-ui/react-slot
pnpm add sonner
pnpm add @tanstack/react-table

# Forms & Validation
pnpm add react-hook-form @hookform/resolvers zod

# Data Fetching
pnpm add @tanstack/react-query

# AI (via AWS Bedrock for HIPAA compliance)
pnpm add @aws-sdk/client-bedrock-runtime

# File Upload
pnpm add @vercel/blob

# Server Actions
pnpm add next-safe-action

# Rate Limiting
pnpm add @upstash/ratelimit @upstash/redis

# Security
pnpm add nanoid

# Utilities
pnpm add date-fns

# Error Monitoring
pnpm add @sentry/nextjs

# Dev & Testing
pnpm add -D vitest @playwright/test @testing-library/react @testing-library/jest-dom
pnpm add -D prettier prettier-plugin-tailwindcss
pnpm add -D @types/node @types/react @types/react-dom

# Then install shadcn/ui (interactive — select: New York style, Mira preset)
pnpm dlx shadcn@latest init
```

After shadcn init, install these components:

```bash
pnpm dlx shadcn@latest add button input label select textarea checkbox \
  switch radio-group dialog sheet drawer command combobox popover \
  dropdown-menu table card badge separator skeleton spinner \
  sidebar calendar date-picker chart sonner tooltip tabs \
  form field input-group avatar breadcrumb pagination
```

---

## 2. Project File Structure

```
clinivise/
├── .cursorrules                        # AI coding assistant rules
├── .env.example                        # Environment variable template
├── .env.local                          # Local env (git-ignored)
├── .prettierrc                         # Prettier config
├── drizzle.config.ts                   # Drizzle Kit config
├── next.config.ts                      # Next.js config with HIPAA headers
├── tsconfig.json                       # TypeScript config (strict)
├── components.json                     # shadcn/ui config
├── package.json
├── pnpm-lock.yaml
│
├── drizzle/                            # Generated migrations (by drizzle-kit)
│   └── ...
│
├── public/
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout (ClerkProvider, QueryProvider, Sonner)
│   │   ├── global-error.tsx            # Sentry error boundary
│   │   │
│   │   ├── (auth)/                     # Public auth routes (no sidebar)
│   │   │   ├── layout.tsx              # Centered auth layout
│   │   │   ├── sign-in/[[...sign-in]]/
│   │   │   │   └── page.tsx
│   │   │   └── sign-up/[[...sign-up]]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/                # Authenticated dashboard routes
│   │   │   ├── layout.tsx              # Sidebar + main content layout
│   │   │   ├── overview/
│   │   │   │   └── page.tsx            # Dashboard home — alerts, metrics, expiring auths
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx            # Client list with data table
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # New client form
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx        # Client detail — info, insurance, auths, sessions
│   │   │   │       ├── insurance/
│   │   │   │       │   └── page.tsx    # Manage client insurance policies
│   │   │   │       └── sessions/
│   │   │   │           └── page.tsx    # Client session history
│   │   │   ├── authorizations/
│   │   │   │   ├── page.tsx            # Auth list — filterable, with expiry alerts
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Auth detail — services, utilization, documents
│   │   │   ├── eligibility/
│   │   │   │   └── page.tsx            # Eligibility check interface (Phase 2)
│   │   │   ├── sessions/
│   │   │   │   ├── page.tsx            # Session log list — all sessions across clients
│   │   │   │   └── new/
│   │   │   │       └── page.tsx        # Log new session form
│   │   │   ├── providers/
│   │   │   │   ├── page.tsx            # Provider/staff list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Provider detail — credentials, NPI, caseload
│   │   │   └── settings/
│   │   │       ├── page.tsx            # Org settings — practice info, payer config
│   │   │       ├── team/
│   │   │       │   └── page.tsx        # Team management (Clerk OrganizationProfile)
│   │   │       └── billing/
│   │   │           └── page.tsx        # Clinivise billing settings (Stripe, Phase 3)
│   │   │
│   │   ├── (billing)/                  # Billing-specific routes (Phase 2)
│   │   │   ├── layout.tsx              # Same sidebar, billing context
│   │   │   ├── claims/
│   │   │   │   ├── page.tsx            # Claims dashboard — queue, submitted, paid, denied
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx        # Create claim from session
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Claim detail — lines, status, ERA, remit
│   │   │   ├── remittance/
│   │   │   │   └── page.tsx            # ERA/835 processing and reconciliation
│   │   │   └── denials/
│   │   │       └── page.tsx            # Denial management queue with AI assist
│   │   │
│   │   └── api/
│   │       ├── webhooks/
│   │       │   ├── clerk/
│   │       │   │   └── route.ts        # Clerk webhook — sync user/org changes
│   │       │   └── stedi/
│   │       │       └── route.ts        # Stedi webhook — 277CA, 835 ERA (Phase 2)
│   │       │                           # TODO: Verify webhook origin (Stedi doesn't sign
│   │       │                           # webhooks with HMAC — use IP allowlisting or
│   │       │                           # credential set verification to prevent spoofing)
│   │       ├── ai/
│   │       │   ├── parse-auth-letter/
│   │       │   │   └── route.ts        # Parse uploaded auth letter PDF
│   │       │   └── pre-claim-check/
│   │       │       └── route.ts        # Pre-claim validation (Phase 2)
│   │       └── stedi/                  # Stedi proxy endpoints (Phase 2)
│   │           ├── eligibility/
│   │           │   └── route.ts
│   │           └── claims/
│   │               └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                         # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── ...
│   │   │   └── spinner.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── app-sidebar.tsx         # Main sidebar navigation
│   │   │   ├── sidebar-nav.tsx         # Nav items with role-based visibility
│   │   │   ├── header.tsx              # Top bar — org switcher, user button
│   │   │   └── page-header.tsx         # Page title + breadcrumbs + actions
│   │   │
│   │   ├── clients/
│   │   │   ├── client-table.tsx        # Data table with search, filters
│   │   │   ├── client-form.tsx         # Create/edit client form
│   │   │   ├── client-info-card.tsx    # Client overview card
│   │   │   └── insurance-form.tsx      # Add/edit insurance policy
│   │   │
│   │   ├── authorizations/
│   │   │   ├── auth-table.tsx          # Authorization list table
│   │   │   ├── auth-form.tsx           # Create/edit authorization
│   │   │   ├── auth-upload.tsx         # Upload auth letter + AI parse
│   │   │   ├── auth-utilization.tsx    # Visual utilization tracker (used/approved)
│   │   │   └── auth-expiry-alert.tsx   # Expiring authorization alert card
│   │   │
│   │   ├── sessions/
│   │   │   ├── session-table.tsx       # Session log table
│   │   │   ├── session-form.tsx        # Log session form (provider, client, CPT, units)
│   │   │   └── session-timer.tsx       # Optional timer for live sessions
│   │   │
│   │   ├── billing/                    # Phase 2
│   │   │   ├── claim-table.tsx
│   │   │   ├── claim-builder.tsx       # Session → claim conversion
│   │   │   ├── claim-detail.tsx
│   │   │   ├── era-viewer.tsx          # 835 ERA display
│   │   │   └── denial-card.tsx         # Denial with AI-suggested action
│   │   │
│   │   ├── providers/
│   │   │   ├── provider-table.tsx
│   │   │   └── provider-form.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── metrics-cards.tsx       # KPI cards (sessions this week, etc.)
│   │   │   ├── expiring-auths-widget.tsx
│   │   │   ├── recent-sessions-widget.tsx
│   │   │   └── billing-summary-widget.tsx  # Phase 2
│   │   │
│   │   └── shared/
│   │       ├── data-table.tsx          # Reusable TanStack data table wrapper
│   │       ├── data-table-toolbar.tsx  # Search, filters, view options
│   │       ├── data-table-pagination.tsx
│   │       ├── confirm-dialog.tsx      # Reusable confirm action dialog
│   │       ├── empty-state.tsx         # Empty table/list state
│   │       ├── file-upload.tsx         # Generic file upload with Vercel Blob
│   │       └── loading-skeleton.tsx    # Page-level loading skeleton
│   │
│   ├── server/
│   │   ├── actions/
│   │   │   ├── clients.ts             # Client CRUD actions
│   │   │   ├── authorizations.ts      # Auth CRUD + utilization calc
│   │   │   ├── sessions.ts            # Session logging actions
│   │   │   ├── providers.ts           # Provider CRUD actions
│   │   │   ├── eligibility.ts         # Eligibility check actions (Phase 2)
│   │   │   ├── claims.ts              # Claim submission actions (Phase 2)
│   │   │   └── documents.ts           # Document upload/management
│   │   │
│   │   └── services/
│   │       ├── stedi.ts               # Stedi API client (Phase 2 stubs)
│   │       ├── ai.ts                  # Bedrock/Claude AI service
│   │       ├── audit.ts               # Audit logging service
│   │       └── authorization-alerts.ts # Expiring auth detection logic
│   │
│   ├── db/
│   │   ├── schema/
│   │   │   ├── index.ts               # Re-exports all schema modules
│   │   │   ├── organizations.ts       # organizations table
│   │   │   ├── users.ts               # users table
│   │   │   ├── providers.ts           # providers table
│   │   │   ├── clients.ts             # clients + client_insurance tables
│   │   │   ├── payers.ts              # payers table
│   │   │   ├── authorizations.ts      # authorizations + authorization_services
│   │   │   ├── sessions.ts            # sessions table
│   │   │   ├── claims.ts              # claims + claim_lines + claim_responses
│   │   │   ├── eligibility.ts         # eligibility_checks table
│   │   │   ├── documents.ts           # documents table
│   │   │   ├── audit-logs.ts          # audit_logs table
│   │   │   └── enums.ts               # Shared PG enums (roles, statuses, CPT codes)
│   │   │
│   │   ├── relations.ts               # Drizzle relations (all cross-table)
│   │   ├── migrate.ts                 # Migration runner script
│   │   └── seed.ts                    # Development seed data
│   │
│   ├── lib/
│   │   ├── db.ts                      # Drizzle client singleton
│   │   ├── auth.ts                    # Auth helpers (getCurrentUser, requireAuth, requireRole)
│   │   ├── tenant.ts                  # Tenant context (getOrgId, withTenantScope)
│   │   ├── stedi.ts                   # Stedi API types + client config (Phase 2)
│   │   ├── ai.ts                      # Bedrock client + prompt builder
│   │   ├── upload.ts                  # Vercel Blob upload helpers
│   │   ├── utils.ts                   # cn(), formatCurrency, formatDate, etc.
│   │   ├── constants.ts               # CPT codes, modifiers, POS codes, payer IDs
│   │   ├── validators.ts              # Shared Zod schemas (reused in forms + actions)
│   │   └── safe-action.ts             # next-safe-action client with auth middleware
│   │
│   ├── hooks/
│   │   ├── use-data-table.ts          # TanStack table config hook
│   │   └── use-debounce.ts            # Search debounce hook
│   │
│   ├── types/
│   │   ├── index.ts                   # Shared app types
│   │   ├── stedi.ts                   # Stedi API request/response types (Phase 2)
│   │   └── ai.ts                      # AI prompt/response types
│   │
│   └── styles/
│       └── globals.css                # Tailwind v4 imports + shadcn theme
│
└── tests/
    ├── unit/                          # Vitest unit tests
    │   ├── lib/
    │   └── server/
    └── e2e/                           # Playwright e2e tests
        ├── auth.spec.ts
        └── clients.spec.ts
```

---

## 3. Complete Drizzle Database Schema

### 3.1 Shared Enums

```typescript
// src/db/schema/enums.ts
import { pgEnum } from "drizzle-orm/pg-core";

// ── User & Org ──────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "admin",
  "bcba",
  "bcaba",
  "rbt",
  "billing_staff",
]);

// ── Provider ────────────────────────────────────────────
export const credentialTypeEnum = pgEnum("credential_type", [
  "bcba",
  "bcba_d",
  "bcaba",
  "rbt",
  "other",
]);

// ── Authorization ───────────────────────────────────────
export const authStatusEnum = pgEnum("auth_status", [
  "pending",
  "approved",
  "denied",
  "expired",
  "exhausted",
]);

// ── Session ─────────────────────────────────────────────
export const sessionStatusEnum = pgEnum("session_status", [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
  "flagged",      // Auto-set when session logged while client insurance is inactive
]);

// ── Claim ───────────────────────────────────────────────
export const claimStatusEnum = pgEnum("claim_status", [
  "draft",
  "ready",
  "submitted",
  "accepted",
  "rejected",
  "paid",
  "partially_paid",
  "denied",
  "appealed",
  "void",
]);

// ── Document ────────────────────────────────────────────
export const documentTypeEnum = pgEnum("document_type", [
  "authorization_letter",
  "assessment_report",
  "treatment_plan",
  "insurance_card",
  "other",
]);

// ── Place of Service ────────────────────────────────────
export const placeOfServiceEnum = pgEnum("place_of_service", [
  "02", // Telehealth (not patient home)
  "03", // School
  "10", // Telehealth (patient home)
  "11", // Office/Clinic
  "12", // Home
  "99", // Other/Community
]);
```

### 3.2 Organizations

```typescript
// src/db/schema/organizations.ts
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const organizations = pgTable("organizations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  clerkOrgId: text("clerk_org_id").notNull().unique(),
  name: text("name").notNull(),
  npi: text("npi"),                          // Practice NPI (Type 2)
  taxId: text("tax_id"),                     // EIN for billing
  phone: text("phone"),
  email: text("email"),
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),                      // 2-letter code
  zipCode: text("zip_code"),
  taxonomyCode: text("taxonomy_code"),       // e.g., "103K00000X" for behavior analyst
  stediApiKey: text("stedi_api_key"),        // Encrypted, per-org Stedi key (Phase 2)
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
```

### 3.3 Users

```typescript
// src/db/schema/users.ts
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { userRoleEnum } from "./enums";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  organizationId: text("organization_id").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: userRoleEnum("role").notNull().default("rbt"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("users_org_idx").on(table.organizationId),
  index("users_clerk_idx").on(table.clerkUserId),
]);
```

### 3.4 Providers

```typescript
// src/db/schema/providers.ts
import { pgTable, text, timestamp, boolean, index, date } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { credentialTypeEnum } from "./enums";

export const providers = pgTable("providers", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  userId: text("user_id"),                           // Links to users table (nullable for external providers)
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  npi: text("npi"),                                  // Individual NPI (Type 1)
  credentialType: credentialTypeEnum("credential_type").notNull(),
  credentialNumber: text("credential_number"),        // e.g., BACB cert number
  credentialExpiry: date("credential_expiry"),
  supervisorId: text("supervisor_id"),               // Self-referencing — RBT's supervising BCBA
  modifierCode: text("modifier_code"),               // HM, HN, HO, HP — derived from credential
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("providers_org_idx").on(table.organizationId),
  index("providers_user_idx").on(table.userId),
  index("providers_supervisor_idx").on(table.supervisorId),
]);
```

### 3.5 Clients & Client Insurance

```typescript
// src/db/schema/clients.ts
import { pgTable, text, timestamp, boolean, index, date } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const clients = pgTable("clients", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: text("gender"),                            // M, F, U — required for claims
  phone: text("phone"),
  email: text("email"),
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  diagnosisCode: text("diagnosis_code").default("F84.0"), // Primary dx — almost always ASD
  diagnosisDescription: text("diagnosis_description").default("Autism Spectrum Disorder"),
  assignedBcbaId: text("assigned_bcba_id"),          // FK to providers
  intakeDate: date("intake_date"),
  dischargeDate: date("discharge_date"),
  isActive: boolean("is_active").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("clients_org_idx").on(table.organizationId),
  index("clients_bcba_idx").on(table.assignedBcbaId),
  index("clients_name_idx").on(table.organizationId, table.lastName, table.firstName),
]);

export const clientInsurance = pgTable("client_insurance", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id").notNull(),
  payerId: text("payer_id").notNull(),
  memberId: text("member_id").notNull(),             // Insurance member/subscriber ID
  groupNumber: text("group_number"),
  subscriberFirstName: text("subscriber_first_name"),
  subscriberLastName: text("subscriber_last_name"),
  subscriberDateOfBirth: date("subscriber_date_of_birth"),
  relationshipToSubscriber: text("relationship_to_subscriber").default("self"), // self, spouse, child, other
  isPrimary: boolean("is_primary").default(true).notNull(),
  effectiveDate: date("effective_date"),
  terminationDate: date("termination_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("client_insurance_org_idx").on(table.organizationId),
  index("client_insurance_client_idx").on(table.clientId),
  index("client_insurance_payer_idx").on(table.payerId),
]);
```

### 3.6 Payers

```typescript
// src/db/schema/payers.ts
import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const payers = pgTable("payers", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  name: text("name").notNull(),                      // e.g., "Aetna", "Blue Cross CA"
  stediPayerId: text("stedi_payer_id"),              // Stedi's payer identifier
  payerType: text("payer_type").default("commercial"), // commercial, medicaid, medicare, tricare
  phone: text("phone"),
  authPhone: text("auth_phone"),                     // Auth department phone
  claimsAddress: text("claims_address"),
  timely_filing_days: text("timely_filing_days"),    // e.g., "90", "180"
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("payers_org_idx").on(table.organizationId),
  index("payers_stedi_idx").on(table.stediPayerId),
]);
```

### 3.7 Authorizations & Authorization Services

```typescript
// src/db/schema/authorizations.ts
import {
  pgTable, text, timestamp, boolean, index, date, integer, numeric,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { authStatusEnum } from "./enums";

export const authorizations = pgTable("authorizations", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id").notNull(),
  payerId: text("payer_id").notNull(),
  clientInsuranceId: text("client_insurance_id").notNull(),
  authorizationNumber: text("authorization_number"),  // Payer-assigned auth number
  status: authStatusEnum("status").notNull().default("pending"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  diagnosisCode: text("diagnosis_code").default("F84.0"),
  notes: text("notes"),
  // AI-parsed fields (populated by auth letter parser)
  aiParsedData: text("ai_parsed_data"),              // JSON blob of parsed auth letter data
  aiConfidenceScore: numeric("ai_confidence_score", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("auths_org_idx").on(table.organizationId),
  index("auths_client_idx").on(table.clientId),
  index("auths_status_idx").on(table.organizationId, table.status),
  index("auths_end_date_idx").on(table.organizationId, table.endDate),
]);

export const authorizationServices = pgTable("authorization_services", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  authorizationId: text("authorization_id").notNull(),
  cptCode: text("cpt_code").notNull(),               // e.g., "97153"
  approvedUnits: integer("approved_units").notNull(), // Total approved 15-min units
  usedUnits: integer("used_units").default(0).notNull(),
  frequency: text("frequency"),                       // e.g., "per week", "per auth period"
  maxUnitsPerDay: integer("max_units_per_day"),
  maxUnitsPerWeek: integer("max_units_per_week"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("auth_services_org_idx").on(table.organizationId),
  index("auth_services_auth_idx").on(table.authorizationId),
  index("auth_services_cpt_idx").on(table.authorizationId, table.cptCode),
]);
```

### 3.8 Sessions

```typescript
// src/db/schema/sessions.ts
import {
  pgTable, text, timestamp, index, date, integer, numeric,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { sessionStatusEnum, placeOfServiceEnum } from "./enums";

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id").notNull(),
  providerId: text("provider_id").notNull(),         // Who delivered the session
  supervisorId: text("supervisor_id"),               // Supervising BCBA (if provider is RBT)
  authorizationId: text("authorization_id"),         // Which auth this session draws from
  authorizationServiceId: text("authorization_service_id"), // Specific service line
  sessionDate: date("session_date").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  cptCode: text("cpt_code").notNull(),               // e.g., "97153"
  modifierCodes: text("modifier_codes").array(),      // e.g., ["HM", "95"]
  units: integer("units").notNull(),                  // 15-min units (calculated from duration)
  placeOfService: placeOfServiceEnum("place_of_service").notNull().default("12"),
  status: sessionStatusEnum("status").notNull().default("completed"),
  notes: text("notes"),
  // Billing linkage
  claimId: text("claim_id"),                         // Linked when session is billed
  billedAmount: numeric("billed_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("sessions_org_idx").on(table.organizationId),
  index("sessions_client_idx").on(table.clientId),
  index("sessions_provider_idx").on(table.providerId),
  index("sessions_auth_idx").on(table.authorizationId),
  index("sessions_date_idx").on(table.organizationId, table.sessionDate),
  index("sessions_claim_idx").on(table.claimId),
  index("sessions_unbilled_idx").on(table.organizationId, table.status).where(
    // Partial index: only completed sessions without a claim
    // Note: actual SQL expression needed in migration
  ),
]);
```

### 3.9 Claims, Claim Lines & Claim Responses (Phase 2)

```typescript
// src/db/schema/claims.ts
import {
  pgTable, text, timestamp, index, date, integer, numeric, jsonb,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { claimStatusEnum } from "./enums";

export const claims = pgTable("claims", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id").notNull(),
  clientInsuranceId: text("client_insurance_id").notNull(),
  payerId: text("payer_id").notNull(),
  renderingProviderId: text("rendering_provider_id").notNull(),
  billingProviderId: text("billing_provider_id"),     // Usually the org/group NPI
  authorizationId: text("authorization_id"),
  claimNumber: text("claim_number"),                  // Internal claim number
  stediTransactionId: text("stedi_transaction_id"),   // Stedi's tracking ID
  status: claimStatusEnum("status").notNull().default("draft"),
  serviceDate: date("service_date").notNull(),        // Date of service
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  totalBilledAmount: numeric("total_billed_amount", { precision: 10, scale: 2 }),
  totalAllowedAmount: numeric("total_allowed_amount", { precision: 10, scale: 2 }),
  totalPaidAmount: numeric("total_paid_amount", { precision: 10, scale: 2 }),
  patientResponsibility: numeric("patient_responsibility", { precision: 10, scale: 2 }),
  diagnosisCode: text("diagnosis_code").default("F84.0"),
  placeOfService: text("place_of_service"),
  // AI pre-claim check results
  aiPreCheckResult: jsonb("ai_pre_check_result"),     // JSON: { score, issues, suggestions }
  aiPreCheckAt: timestamp("ai_pre_check_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("claims_org_idx").on(table.organizationId),
  index("claims_client_idx").on(table.clientId),
  index("claims_status_idx").on(table.organizationId, table.status),
  index("claims_stedi_idx").on(table.stediTransactionId),
  index("claims_payer_idx").on(table.payerId),
]);

export const claimLines = pgTable("claim_lines", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  claimId: text("claim_id").notNull(),
  sessionId: text("session_id"),                     // Source session
  lineNumber: integer("line_number").notNull(),
  cptCode: text("cpt_code").notNull(),
  modifierCodes: text("modifier_codes").array(),
  units: integer("units").notNull(),
  chargeAmount: numeric("charge_amount", { precision: 10, scale: 2 }).notNull(),
  allowedAmount: numeric("allowed_amount", { precision: 10, scale: 2 }),
  paidAmount: numeric("paid_amount", { precision: 10, scale: 2 }),
  adjustmentReasonCode: text("adjustment_reason_code"),  // CARC code
  adjustmentAmount: numeric("adjustment_amount", { precision: 10, scale: 2 }),
  remarkCode: text("remark_code"),                       // RARC code
  serviceDateFrom: date("service_date_from").notNull(),
  serviceDateTo: date("service_date_to"),
  renderingProviderNpi: text("rendering_provider_npi"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("claim_lines_org_idx").on(table.organizationId),
  index("claim_lines_claim_idx").on(table.claimId),
  index("claim_lines_session_idx").on(table.sessionId),
]);

export const claimResponses = pgTable("claim_responses", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  claimId: text("claim_id").notNull(),
  responseType: text("response_type").notNull(),     // "277ca" or "835"
  stediTransactionId: text("stedi_transaction_id"),
  rawResponse: jsonb("raw_response"),                // Full Stedi response payload
  statusCode: text("status_code"),                   // e.g., "A1" accepted, "R3" rejected
  statusDescription: text("status_description"),
  effectiveDate: date("effective_date"),
  checkNumber: text("check_number"),                 // For 835 ERA
  checkAmount: numeric("check_amount", { precision: 10, scale: 2 }),
  receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("claim_responses_org_idx").on(table.organizationId),
  index("claim_responses_claim_idx").on(table.claimId),
  index("claim_responses_type_idx").on(table.responseType),
]);
```

### 3.10 Eligibility Checks (Phase 2)

```typescript
// src/db/schema/eligibility.ts
import { pgTable, text, timestamp, index, jsonb } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const eligibilityChecks = pgTable("eligibility_checks", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id").notNull(),
  clientInsuranceId: text("client_insurance_id").notNull(),
  payerId: text("payer_id").notNull(),
  stediTransactionId: text("stedi_transaction_id"),
  requestPayload: jsonb("request_payload"),          // What we sent to Stedi
  responsePayload: jsonb("response_payload"),        // Raw 271 response
  // Parsed/interpreted fields
  isEligible: text("is_eligible"),                   // "active", "inactive", "unknown"
  planName: text("plan_name"),
  planType: text("plan_type"),
  copay: text("copay"),
  coinsurance: text("coinsurance"),
  deductible: text("deductible"),
  deductibleRemaining: text("deductible_remaining"),
  outOfPocketMax: text("out_of_pocket_max"),
  outOfPocketRemaining: text("out_of_pocket_remaining"),
  abaSpecificBenefits: jsonb("aba_specific_benefits"), // Parsed ABA coverage details
  aiInterpretation: text("ai_interpretation"),        // Claude's plain-English summary
  checkedAt: timestamp("checked_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("eligibility_org_idx").on(table.organizationId),
  index("eligibility_client_idx").on(table.clientId),
  index("eligibility_date_idx").on(table.organizationId, table.checkedAt),
]);
```

### 3.11 Documents

```typescript
// src/db/schema/documents.ts
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";
import { documentTypeEnum } from "./enums";

export const documents = pgTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  clientId: text("client_id"),
  authorizationId: text("authorization_id"),
  claimId: text("claim_id"),
  documentType: documentTypeEnum("document_type").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),               // Vercel Blob URL
  fileSizeBytes: integer("file_size_bytes"),
  mimeType: text("mime_type"),
  uploadedByUserId: text("uploaded_by_user_id"),
  aiProcessed: text("ai_processed").default("pending"), // pending, processing, completed, failed
  aiExtractedData: text("ai_extracted_data"),         // JSON of parsed content
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("documents_org_idx").on(table.organizationId),
  index("documents_client_idx").on(table.clientId),
  index("documents_auth_idx").on(table.authorizationId),
]);
```

### 3.12 Audit Logs

```typescript
// src/db/schema/audit-logs.ts
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  organizationId: text("organization_id").notNull(),
  userId: text("user_id"),                           // Who performed the action
  action: text("action").notNull(),                  // e.g., "client.create", "session.update", "claim.submit"
  entityType: text("entity_type").notNull(),         // e.g., "client", "session", "claim"
  entityId: text("entity_id"),                       // ID of affected record
  metadata: jsonb("metadata"),                       // Additional context (old values, new values, IP, etc.)
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index("audit_org_idx").on(table.organizationId),
  index("audit_user_idx").on(table.userId),
  index("audit_entity_idx").on(table.entityType, table.entityId),
  index("audit_date_idx").on(table.organizationId, table.createdAt),
]);
```

#### Audit Logging Triggers (HIPAA Requirement)

Every server action that creates, updates, or deletes a record MUST auto-log via the `authActionClient` middleware. Implement this as a `withAuditLog` wrapper in `src/server/services/audit.ts` that the safe-action middleware calls after successful mutations. The following events MUST generate audit entries:

| Action Pattern | Entity Type | When |
|---------------|-------------|------|
| `client.create`, `client.update`, `client.delete` | client | Any client record mutation |
| `client_insurance.create`, `client_insurance.update` | client_insurance | Insurance policy changes |
| `authorization.create`, `authorization.update` | authorization | Auth record mutations |
| `session.create`, `session.update`, `session.delete` | session | Session logging/editing |
| `claim.create`, `claim.submit`, `claim.void` | claim | Any claim lifecycle event |
| `claim_response.received` | claim_response | 277CA or 835 ERA received via webhook |
| `eligibility.check` | eligibility_check | Every eligibility verification (Stedi) |
| `document.upload`, `document.delete` | document | File uploads/removals |
| `user.invite`, `user.role_change`, `user.deactivate` | user | Team membership changes |
| `ai.parse_auth_letter` | document | AI processing of auth letter PDFs |

**Never log PHI content** in the audit metadata — log resource IDs only (e.g., "User X viewed Client #123" not "User X viewed John Doe's insurance card"). Store old/new values for field-level changes ONLY for non-PHI fields (status changes, role changes, etc.).

### 3.13 Schema Index (Re-exports)

```typescript
// src/db/schema/index.ts
export * from "./enums";
export * from "./organizations";
export * from "./users";
export * from "./providers";
export * from "./clients";
export * from "./payers";
export * from "./authorizations";
export * from "./sessions";
export * from "./claims";
export * from "./eligibility";
export * from "./documents";
export * from "./audit-logs";
```

---

## 4. Configuration Files

### 4.1 next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // HIPAA security headers
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.clinivise.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' https://img.clerk.com data: blob:",
            "font-src 'self'",
            "connect-src 'self' https://api.clerk.com https://clerk.clinivise.com https://*.vercel-blob.com",
            "frame-src 'self' https://clerk.clinivise.com",
          ].join("; "),
        },
      ],
    },
  ],

  // Disable image optimization for HIPAA (avoid Vercel CDN caching PHI-adjacent images)
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },

  // Server actions config
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // For auth letter PDF uploads
    },
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
```

### 4.2 drizzle.config.ts

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### 4.3 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4.4 .env.example

```bash
# ── Database (Neon) ──────────────────────────────────────
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/clinivise?sslmode=require"
# Use the pooler endpoint for serverless (append -pooler to hostname)
DATABASE_URL_POOLED="postgresql://user:password@ep-xxx-pooler.us-east-1.aws.neon.tech/clinivise?sslmode=require"

# ── Authentication (Clerk) ───────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/overview"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/overview"

# ── AI (AWS Bedrock) ────────────────────────────────────
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="AKIA..."
AWS_SECRET_ACCESS_KEY="..."
BEDROCK_MODEL_ID="anthropic.claude-sonnet-4-20250514-v1:0"

# ── File Storage (Vercel Blob) ──────────────────────────
BLOB_READ_WRITE_TOKEN="vercel_blob_..."

# ── Stedi (Phase 2) ─────────────────────────────────────
STEDI_API_KEY="test_..."
# Use "test_..." prefix for development, production key for live
STEDI_BASE_URL="https://healthcare.us.stedi.com/2024-04-01"

# ── Rate Limiting (Upstash) ─────────────────────────────
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

# ── Error Monitoring (Sentry) ───────────────────────────
SENTRY_DSN="https://..."
NEXT_PUBLIC_SENTRY_DSN="https://..."
SENTRY_AUTH_TOKEN="sntrys_..."

# ── App Config ──────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4.5 .prettierrc

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindFunctions": ["cn", "clsx"]
}
```

### 4.6 eslint.config.mjs

```javascript
// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];

export default eslintConfig;
```

### 4.7 Database Client

```typescript
// src/lib/db.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

### 4.8 Auth Helpers

```typescript
// src/lib/auth.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { userRoleEnum } from "@/db/schema/enums";

type UserRole = (typeof userRoleEnum.enumValues)[number];

export async function getCurrentUser() {
  const { userId, orgId } = await auth();
  if (!userId || !orgId) return null;

  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, userId), eq(users.organizationId, orgId)))
    .limit(1);

  return user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}

export async function getOrgId(): Promise<string> {
  const { orgId } = await auth();
  if (!orgId) throw new Error("No organization selected");
  // Resolve Clerk orgId to our internal org ID
  // In practice, middleware should have already resolved this
  return orgId;
}
```

### 4.9 Safe Action Client

```typescript
// src/lib/safe-action.ts
import { createSafeActionClient } from "next-safe-action";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);
    return e.message;
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Look up internal user and org
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.clerkUserId, userId)))
    .limit(1);

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.clerkOrgId, orgId))
    .limit(1);

  if (!user || !org) {
    throw new Error("User or organization not found");
  }

  return next({
    ctx: {
      userId: user.id,
      organizationId: org.id,
      userRole: user.role,
      clerkUserId: userId,
      clerkOrgId: orgId,
    },
  });
});
```

### 4.10 Utility Functions

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string | null): string {
  if (amount === null) return "$0.00";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function daysUntilExpiry(endDate: string | Date): number {
  return differenceInDays(new Date(endDate), new Date());
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Calculate 15-minute units from duration using the CMS 8-minute rule.
 * ≥8 minutes of a unit = 1 unit. <8 minutes = 0 units.
 */
export function calculateUnits(startTime: Date, endTime: Date): number {
  const totalMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  if (totalMinutes < 8) return 0;
  // CMS 8-minute rule: each 15-min unit requires ≥8 min
  return Math.floor((totalMinutes + 7) / 15);
}

/**
 * Calculate utilization percentage for an authorization service.
 */
export function utilizationPercent(used: number, approved: number): number {
  if (approved === 0) return 0;
  return Math.round((used / approved) * 100);
}
```

### 4.11 Constants

```typescript
// src/lib/constants.ts

// ── ABA CPT Codes ───────────────────────────────────────
export const ABA_CPT_CODES = {
  "97151": {
    description: "Behavior identification assessment",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 32,
    isAssessment: true,
  },
  "97152": {
    description: "Behavior identification supporting assessment",
    provider: "RBT under QHP",
    maxUnitsPerDay: 16,
    isAssessment: true,
  },
  "97153": {
    description: "Adaptive behavior treatment by protocol (1:1 direct therapy)",
    provider: "RBT under QHP",
    maxUnitsPerDay: 32,
    isAssessment: false,
  },
  "97154": {
    description: "Group adaptive behavior treatment by protocol (2–8 patients)",
    provider: "RBT under QHP",
    maxUnitsPerDay: 18,
    isAssessment: false,
  },
  "97155": {
    description: "Adaptive behavior treatment with protocol modification",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 24,
    isAssessment: false,
  },
  "97156": {
    description: "Family adaptive behavior treatment guidance (caregiver training)",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 16,
    isAssessment: false,
  },
  "97157": {
    description: "Multiple-family group treatment guidance",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 16,
    isAssessment: false,
  },
  "97158": {
    description: "Group treatment with protocol modification (2–8 patients)",
    provider: "BCBA/QHP",
    maxUnitsPerDay: 16,
    isAssessment: false,
  },
  // Category III (active until Jan 1, 2027)
  "0362T": {
    description: "Multi-technician behavior assessment for destructive behavior",
    provider: "QHP on-site",
    maxUnitsPerDay: 16,
    isAssessment: true,
    retirementDate: "2027-01-01",
  },
  "0373T": {
    description: "Multi-technician adaptive behavior treatment for destructive behavior",
    provider: "QHP on-site",
    maxUnitsPerDay: 32,
    isAssessment: false,
    retirementDate: "2027-01-01",
  },
} as const;

export type CptCode = keyof typeof ABA_CPT_CODES;

// ── Provider Modifier Codes ─────────────────────────────
export const CREDENTIAL_MODIFIERS = {
  rbt: "HM",
  bcaba: "HN",
  bcba: "HO",
  bcba_d: "HP",
} as const;

// ── Place of Service ────────────────────────────────────
export const PLACE_OF_SERVICE = {
  "02": "Telehealth (not patient home)",
  "03": "School",
  "10": "Telehealth (patient home)",
  "11": "Office/Clinic",
  "12": "Home",
  "99": "Other/Community",
} as const;

// ── Authorization Alert Thresholds ──────────────────────
export const AUTH_ALERT_THRESHOLDS = {
  EXPIRY_WARNING_DAYS: 30,       // Alert when auth expires within 30 days
  UTILIZATION_WARNING_PCT: 80,   // Alert when utilization hits 80%
  UTILIZATION_CRITICAL_PCT: 95,  // Critical alert at 95%
} as const;

// ── User Roles ──────────────────────────────────────────
export const ROLE_LABELS = {
  owner: "Owner",
  admin: "Admin",
  bcba: "BCBA",
  bcaba: "BCaBA",
  rbt: "RBT",
  billing_staff: "Billing Staff",
} as const;

export const ROLE_HIERARCHY = ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"] as const;
```

---

## 5. Middleware (Auth + Tenant Resolution)

> **Note**: Security headers are configured in `next.config.ts` for global coverage. For route-specific headers (e.g., stricter CSP on API routes that handle PHI, or cache-control headers that prevent PHI caching), add them directly in the middleware or individual route handlers via `NextResponse.headers`. This gives more granular control than the global config alone.

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/clerk(.*)",
  "/api/webhooks/stedi(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

---

## 6. Cursor AI Rules

```
// .cursorrules

# Clinivise — ABA Practice Management & AI-Native Billing Platform

## Project Context
Clinivise is a free ABA (Applied Behavior Analysis) therapy practice management tool
monetized through 2-4% of collected revenue on billing services. It's an operations
and back-office platform — NOT clinical. Target users are small to mid-size ABA
practices (1-50 staff) that are price-sensitive and currently using spreadsheets or
overpriced legacy software.

## Tech Stack
- Framework: Next.js 16 (App Router) with TypeScript 5.9 (strict mode)
- Database: Neon Postgres (Scale plan, HIPAA) with Drizzle ORM
- Hosting: Vercel with HIPAA BAA
- Auth: Clerk (Pro plan, organizations, RBAC, MFA)
- UI: Tailwind CSS v4 + shadcn/ui (Mira style preset)
- AI: AWS Bedrock (Claude Sonnet) — NOT direct Anthropic API (HIPAA)
- Billing EDI: Stedi API (Phase 2) — JSON-first clearinghouse
- Forms: React Hook Form + Zod v4
- Data Fetching: Server Components for reads, Server Actions (next-safe-action) for mutations
- File Storage: Vercel Blob (HIPAA under Vercel BAA)
- Rate Limiting: Upstash Redis + Ratelimit

## Architecture Rules

### Multi-Tenancy
- Every table has `organization_id` column — NO EXCEPTIONS
- Every query MUST filter by `organization_id`
- Use `authActionClient` for all server actions — it injects `ctx.organizationId`
- Never trust client-provided org IDs — always derive from Clerk session
- Phase 2: Add Postgres RLS as defense-in-depth on sensitive tables

### Server vs Client
- Default to Server Components — use "use client" only when needed (interactivity, hooks)
- Data fetching: Server Components call db directly with Drizzle
- Mutations: Server Actions via next-safe-action with `authActionClient`
- Client-side optimistic updates: TanStack Query for mutation-heavy pages (sessions, billing)
- Never import `db` or server code in client components

### Database Patterns
- Use Drizzle query builder, not raw SQL
- Always use parameterized queries (Drizzle handles this)
- Use `nanoid()` for IDs, not UUIDs (shorter, URL-safe, 21 chars = 149 bits of entropy)
  - If sortable/time-ordered IDs become needed (e.g., for cursor-based pagination), evaluate migrating to cuid2 or ulid — but nanoid is fine for MVP scale
- Timestamps always with timezone: `timestamp("col", { withTimezone: true })`
- Monetary values: `numeric(10, 2)` — never floating point
- All dates as `date()` type (ISO string, no time component)
- Create indexes for every column used in WHERE clauses

### Naming Conventions
- Files: kebab-case (auth-form.tsx, use-debounce.ts)
- Components: PascalCase (AuthForm, SessionTable)
- Variables/functions: camelCase
- Database columns: snake_case (organization_id, created_at)
- Route segments: kebab-case (/clients/[id]/sessions)
- Server actions: verb-noun (createClient, updateSession, deleteAuthorization)
- Types: PascalCase with descriptive suffixes (ClientFormValues, SessionWithProvider)

### UI Patterns
- Use shadcn/ui components — never build custom when shadcn has it
- Toast notifications via Sonner for all action feedback
- Data tables via shared DataTable component wrapping TanStack Table
- Forms: React Hook Form + Zod schema + shadcn Form component
- Loading states: Skeleton components, never spinners for page loads
- Empty states: Always provide helpful empty state with CTA
- Modals: Dialog for confirm actions, Sheet for forms, Drawer for detail panels
- Sidebar navigation with role-based item visibility

### Error Handling
- Server Actions: Return `{ success: boolean, error?: string, data?: T }`
- Never throw from server actions — return error objects
- Use Sentry for error tracking (auto-configured via @sentry/nextjs)
- Show user-friendly errors via toast, log technical details to Sentry
- Wrap async operations in try-catch

### Security (HIPAA)
- Never log PHI (patient names, DOBs, insurance IDs) to console or Sentry
- Audit log all data access and mutations via audit service
- 15-minute session timeout (configure in Clerk)
- Rate limit all API routes via Upstash
- Validate all inputs with Zod on both client and server
- Clerk handles CSRF protection for Server Actions
- File uploads: validate file type and size server-side

### AI (Bedrock/Claude) Patterns
- All AI calls go through src/server/services/ai.ts
- Never send PHI to any service without a BAA (Bedrock has one)
- Structure prompts as system + user messages
- Parse AI responses with Zod schemas — never trust raw output
- Include confidence scores in AI-parsed data
- Always offer manual override for AI-extracted fields

### ABA-Specific Business Logic
- All session durations in 15-minute units using CMS 8-minute rule
- Authorization utilization: track used vs approved units per service line
- Alert on authorizations expiring within 30 days
- Alert on utilization >80% and >95%
- Validate CPT code + provider credential compatibility
- Support concurrent billing (97153 + 97155 by different providers)
- Default diagnosis code: F84.0 (Autism Spectrum Disorder)
- Auto-flag sessions as "flagged" when logged for a client with inactive insurance
- Alert on low utilization (<50% used with >50% of auth period elapsed) — money left on table

## Phase Roadmap
- Phase 1 (NOW): Auth, multi-tenant setup, client CRUD, provider management,
  authorization tracking with AI letter parsing, session logging, dashboard with
  alerts and metrics
- Phase 2 (2 weeks): Stedi eligibility integration, claims submission, ERA
  processing, payment reconciliation, billing dashboard, denial management, pre-claim AI
- Phase 3 (future): Analytics, payer benchmarking, clinical integrations
  (Motivity/Hi Rasmus), parent portal

## File Organization
- Page components in /src/app/(group)/route/page.tsx — keep thin, delegate to components
- Feature components in /src/components/[feature]/
- Shared/reusable components in /src/components/shared/
- Server actions in /src/server/actions/[entity].ts
- Business logic services in /src/server/services/
- Database schema split by entity in /src/db/schema/
- Shared validators in /src/lib/validators.ts
- Constants (CPT codes, modifiers) in /src/lib/constants.ts
```

---

## 7. Phase 1 Task Breakdown

### Sprint 1: Foundation (Days 1-3)
1. Initialize Next.js project with all packages
2. Configure Clerk (org, roles, sign-in/sign-up pages)
3. Set up Neon database + run initial Drizzle migration
4. Build root layout (ClerkProvider, QueryProvider, Sonner)
5. Build dashboard layout (sidebar + header + main content area)
6. Implement auth middleware + tenant resolution
7. Create safe-action client with auth context
8. Set up Sentry error monitoring
9. Build shared DataTable component
10. Build shared form patterns (FormField wrappers)

### Sprint 2: Core CRUD (Days 4-7)
11. Provider management (list, create, edit)
12. Client management (list, create, edit, detail page)
13. Client insurance (add/edit policies per client)
14. Payer management (list, create, edit)
15. Authorization management (list, create, edit, detail)
16. Authorization services (add service lines with CPT/units)
17. Authorization utilization tracking (used vs approved)

### Sprint 3: Sessions & Alerts (Days 8-10)
18. Session logging form (provider, client, CPT, units, POS)
    - Include auth enforcement: warn/block if logging would exceed authorized units (replicate VGPM's best feature)
    - Auto-populate modifier codes based on provider credential type (RBT→HM, BCBA→HO, etc.)
19. Session list with filters (date range, provider, client, status)
20. Auto-calculate units from start/end time (8-minute rule)
21. Auto-decrement authorization utilization on session save
22. Dashboard overview page (metrics cards)
23. Expiring authorization alerts widget
24. Utilization warning alerts (80%/95% thresholds)
25. Recent sessions widget

### Sprint 4: AI & Documents (Days 11-14)
26. File upload component (Vercel Blob integration)
27. Document management (upload, list, associate with client/auth)
28. AWS Bedrock client setup + prompt builder
29. Auth letter PDF parsing pipeline (upload → extract text → Claude → parse)
30. AI-extracted auth data review UI (editable fields with confidence scores)
31. Audit logging service + middleware
32. Seed data script for development — create a realistic ABA practice ("Bright Futures ABA") with:
    - 1 organization with NPI, address, tax ID
    - 5 providers (2 BCBAs, 1 BCaBA, 2 RBTs) with NPIs and credential types
    - 8 clients across different ages (5-10), with guardians, addresses, diagnosis F84.0
    - 6 payers (BCBS, Aetna, UHC, Cigna, Medicaid, Tricare) with Stedi payer IDs
    - Client insurance records linking clients to payers with member IDs
    - Authorizations in various states: 3 active, 2 expiring (within 14 days), 1 expired, 1 pending, 1 with low utilization (<50%)
    - Authorization services with realistic approved units (100-150 for 97153, 20-30 for 97155)
    - 30-40 sessions spread across last 30 days, some flagged (insurance inactive), most completed
    - At least 1 client with inactive eligibility to trigger alerts
    - This data should mirror the scenarios from the MVP prototype we built
33. Basic Playwright e2e tests (auth flow, client CRUD)
