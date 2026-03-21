# Clinivise

ABA therapy practice management & AI-native billing platform. HIPAA-compliant, multi-tenant SaaS for small practices (1–50 staff). Free PM tool, monetized via 2–4% of collected revenue on billing.

@AGENTS.md

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16.2 | App Router, Server Components default |
| Language | TypeScript 5.9 | Strict mode |
| Styling | Tailwind CSS v4 | CSS-first config (`globals.css`), no `tailwind.config.js` |
| Components | shadcn/ui (Mira style) | `radix-ui` unified package, `cn()` from `@/lib/utils` |
| Database | Neon Postgres + Drizzle ORM 0.45 | Serverless driver, `@neondatabase/serverless` |
| Auth | Clerk Pro | Organizations, RBAC, MFA. No BAA needed (staff-only) |
| Server Actions | next-safe-action v8 | `authActionClient` injects org context |
| Data Fetching | TanStack Query v5 | Client-side. Server components use direct DB calls |
| Forms | React Hook Form + Zod v4 | `zod/v4` import path, `@hookform/resolvers` |
| AI | Any LLM (prototype) → Bedrock (prod) | Direct API for now; migrate to Bedrock when handling real PHI |
| File Storage | Vercel Blob | Auth letter PDFs. Covered under Vercel BAA |
| Rate Limiting | Upstash Redis | HTTP-based, serverless-native |
| Monitoring | Sentry v10 | Add PHI scrubbing before production |
| Billing API | Stedi (Phase 2) | JSON-first EDI. Basic plan for dev, Developer for prod |
| Testing | Vitest 4 + Playwright 1.58 | Unit + E2E |

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
- **Multi-tenancy**: Every table has `organization_id`. Every query filters by it. `authActionClient` injects it from Clerk session
- **IDs**: `nanoid()` for all primary keys (not UUID)
- **Money**: `numeric(10, 2)` in Postgres (never float/decimal JS)
- **Sessions**: Measured in 15-minute units per CMS 8-minute rule
- **Auth tracking**: `used_units` vs `approved_units` per CPT code per authorization

## Phase Context

**Phase 1 (current):** Auth, multi-tenant foundation, client/provider/authorization CRUD, session logging, dashboard overview, AI auth letter parsing, audit logging.

**Out of scope now:** Claims submission, ERA processing, eligibility checks, denial management, analytics, parent portal.

## Spec Files

For deep domain context, reference these files (don't read unless needed):
- `clinivise-engineering-spec.md` — Full DB schema, config files, 33-task breakdown
- `clinivise-research-spec.md` — Technology decisions, pricing, ABA billing codes, HIPAA analysis

## MCP Servers

- **Context7** — Fetch current library docs before writing code. Always resolve library ID first
- **Next DevTools** — Next.js debugging and docs
- **shadcn** — Component registry, examples, audit checklist
- **Clerk** — Auth SDK snippets and patterns
