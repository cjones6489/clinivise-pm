---
name: hipaa-check
description: HIPAA readiness check — scans for org isolation gaps, sensitive data leaks, and patterns that will need fixing before production
user_invocable: true
---

# /hipaa-check — HIPAA Readiness Check

You are reviewing the Clinivise codebase for HIPAA readiness. We're in prototyping with test data — no real PHI yet. The goal is to catch architectural problems now (especially org isolation) and flag things that will need attention before production.

> **Severity guide:** Org isolation issues are real bugs even in prototyping. Everything else is "fix before production" advisory.

## Process

Run each check category below. For each, search the codebase using Grep/Glob, read suspect files, and classify findings.

### Category 1: Organization Isolation (Critical — even for prototyping)
Search for database queries that might lack `organization_id` filtering:

```
# Search for Drizzle queries:
db.select, db.query, db.insert, db.update, db.delete
.where(, .findFirst, .findMany
```

For each query, verify `organization_id` is in the WHERE clause or comes from `authActionClient` context. This is an architectural requirement, not just compliance.

### Category 2: Sensitive Data in Logs
Search for patterns that might log sensitive fields:

```
console.log, console.error, console.warn
Sentry.captureException, Sentry.setExtra
throw new Error(
```

Flag any that include patient-facing data fields. In prototyping this is advisory — note it for cleanup before production.

### Category 3: Client-Side Data Exposure
Check for patterns that will be problematic in production:
- `localStorage`, `sessionStorage` storing patient data
- Patient data in Clerk metadata (`publicMetadata`, `privateMetadata`)
- Sensitive data in URL parameters

### Category 4: AI Provider Abstraction
Check that AI call sites use a wrapper (e.g., `lib/ai.ts`) rather than directly importing an SDK. This makes the Bedrock migration a one-file change later.

### Category 5: File Upload Validation
Check that file uploads are validated server-side:
- File type verification
- File size limits

### Category 6: Production Readiness Gaps
Note things that will need to be added before real PHI:
- Missing audit logging
- Missing cache headers on sensitive endpoints
- Missing rate limiting
- Missing security headers

## Output Format

```
## HIPAA Readiness Report

### Date: [current date]
### Scope: [files/features checked]

| Category | Status | Notes |
|----------|--------|-------|
| Org Isolation | ✅ / ❌ | [count] gaps |
| Sensitive Data in Logs | ✅ / ⚠️ | [count] to clean up |
| Client-Side Exposure | ✅ / ⚠️ | [count] issues |
| AI Abstraction | ✅ / ⚠️ | Wrapper in place? |
| File Uploads | ✅ / ⚠️ | Validation present? |
| Production Gaps | 📋 | [list of things to add later] |

### Org Isolation Issues (fix now)
[These are real bugs — file:line references and fixes]

### Production TODO (fix before real PHI)
[Advisory items to address before handling real patient data]
```
