---
description: Drizzle ORM, Neon Postgres, and multi-tenancy patterns
globs: src/server/**, src/lib/db*, drizzle/**
---

# Database Rules

## Drizzle ORM

- Use Drizzle query builder only — no raw SQL (`sql` template tag only for computed expressions)
- All table definitions in `src/server/db/schema/`
- Export all tables from a central `src/server/db/schema/index.ts` barrel file

## IDs & Types

- `nanoid()` for all primary keys — never UUID, never auto-increment
- `numeric(10, 2)` for money columns — never `real`, `float`, or `doublePrecision`
- `timestamp('column_name', { withTimezone: true })` for all date/time columns
- Use `text` for enums with Drizzle's type inference (not Postgres native enums — they're hard to migrate)

## Multi-Tenancy

- Every table MUST have an `organization_id` column (except pure lookup/reference tables)
- Index `organization_id` on every table
- Index all columns used in WHERE clauses
- Create composite indexes for common query patterns (e.g., `[organizationId, clientId]`)

## ABA-Specific Schema Patterns

- Sessions measured in 15-minute units following CMS 8-minute rule
- Authorization services track: `approved_units`, `used_units`, `cpt_code`, date ranges
- Utilization = `used_units / approved_units` — surface alerts at 80% and 100%
- CPT codes stored as `text` (e.g., '97153'), not integers

## Conventions

- Table names: `snake_case`, plural (e.g., `clients`, `session_logs`, `authorization_services`)
- Column names: `snake_case` (e.g., `organization_id`, `created_at`)
- Every table gets `created_at` and `updated_at` timestamps
- Soft delete via `deleted_at` timestamp where appropriate (clients, authorizations)
- Foreign keys with `onDelete` behavior explicitly set

## Migrations

- Generate with `pnpm drizzle-kit generate`
- Review generated SQL before applying
- Never manually edit migration files after they've been applied
- Test migrations against a copy of production data structure
