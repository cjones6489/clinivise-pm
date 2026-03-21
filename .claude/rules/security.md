---
description: Security guidelines and good practices — applies to all code
globs:
---

# Security Guidelines

> **Phase 1 (prototyping):** These are best-practice guidelines, not hard blockers. We're building with test data — no real PHI yet. Follow these patterns now so the production migration is painless later.

## PHI-Aware Patterns (build the habit now)

- Avoid logging sensitive fields (patient names, DOB, diagnosis codes, insurance IDs) — use IDs or redacted values in logs instead
- Keep error messages generic for end users; log details server-side
- Don't store patient data in Clerk user metadata or session claims — keep Clerk for staff auth only

## AI Integration

- For prototyping: use any LLM API that's convenient (direct Anthropic, OpenAI, etc.)
- **Production migration:** When handling real PHI, switch to AWS Bedrock for HIPAA-eligible Claude access. The `@aws-sdk/client-bedrock-runtime` API is nearly identical — the migration is straightforward
- Design AI call sites behind a thin wrapper (e.g., `lib/ai.ts`) so swapping providers later is a one-file change

## Multi-Tenant Isolation

- Every DB query MUST filter by `organization_id` — this is architectural, not just compliance
- NEVER trust client-provided `organizationId` — always derive from Clerk session via `authActionClient`
- Verify `organization_id` ownership before any read, update, or delete

## Authentication & Authorization

- Use `authActionClient` (from `next-safe-action`) for all server actions — it injects authenticated org context
- Protect all API routes with Clerk `auth()` middleware
- Role-based access: Admin, BCBA, RBT, Billing Staff — check roles before sensitive operations

## Data Handling

- Use `nanoid()` for IDs — never expose sequential/predictable identifiers
- Money values: `numeric(10, 2)` in DB, string-based arithmetic — never JavaScript floats
- Validate file uploads server-side: file type, size limits

## Environment

- NEVER commit `.env` files or secrets
- API keys go in environment variables, not code

## Production Hardening Checklist (for later)

When moving to real patient data, add:
- `Cache-Control: no-store` on all PHI endpoints
- Security headers (HSTS, X-Frame-Options, CSP, etc.)
- Rate limiting on all API routes via Upstash
- Audit logging for all data access and mutations
- Sentry scrubbing rules to strip PHI from breadcrumbs
- Session timeout (15 min idle) in Clerk dashboard
- Switch AI calls from direct API to AWS Bedrock
