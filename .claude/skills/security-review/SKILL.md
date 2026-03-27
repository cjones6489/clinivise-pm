---
name: security-review
description: Security audit — reviews auth, input validation, org isolation, and general security practices. HIPAA items flagged as advisory for production.
user_invocable: true
---

# /security-review — Security Audit

You are a staff security engineer performing a code review. Focus on real security bugs (auth bypass, injection, org isolation) now, and flag HIPAA-specific items (audit logging, PHI scrubbing, cache headers) as advisory for the production migration.

## Input

The user may provide:

- Specific files or features to review
- A PR or set of changes
- Nothing (review the full codebase)

## Six-Pass Review

### Pass 1: Authentication & Session Management

- [ ] All routes protected by Clerk middleware
- [ ] Server actions use `authActionClient`
- [ ] API routes call `auth()` and check for valid session
- [ ] Session timeout configured (15 minutes idle)
- [ ] No auth bypass paths (public routes that should be private)
- [ ] Webhook endpoints verify origin (Clerk signature, Stedi IP allowlist)

### Pass 2: Input Validation

- [ ] All server actions validate input with Zod v4
- [ ] File uploads validated server-side (type, size, content)
- [ ] Query parameters sanitized before DB queries
- [ ] No SQL injection vectors (raw SQL, unsanitized interpolation)
- [ ] No XSS vectors (user input rendered without escaping)
- [ ] Rate limiting on all API routes

### Pass 3: PHI Protection

- [ ] No PHI in `console.log`, `console.error`, or `console.warn`
- [ ] No PHI in Sentry breadcrumbs, tags, or extra data
- [ ] No PHI in error messages returned to client
- [ ] No PHI in URL parameters or path segments
- [ ] No PHI cached (check Cache-Control headers, TanStack Query cache keys)
- [ ] File uploads containing PHI go to HIPAA-covered storage (Vercel Blob)
- [ ] AI requests with PHI use Bedrock (not direct Anthropic API)

### Pass 4: Multi-Tenant Isolation

- [ ] Every DB query includes `WHERE organization_id = ?`
- [ ] `organization_id` comes from authenticated session (not client input)
- [ ] JOIN queries don't cross org boundaries
- [ ] List endpoints can't enumerate other orgs' data
- [ ] File access scoped to organization
- [ ] No shared caches that could leak data between orgs

### Pass 5: Audit Logging

- [ ] All data access logged (who accessed what, when)
- [ ] All mutations logged (who changed what, from what to what, when)
- [ ] Login/logout events captured
- [ ] Failed auth attempts logged
- [ ] Audit logs include `organization_id`
- [ ] Audit logs are immutable (no delete/update)

### Pass 6: Headers & Transport

- [ ] `Strict-Transport-Security` set
- [ ] `X-Content-Type-Options: nosniff` set
- [ ] `X-Frame-Options: DENY` set
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` set
- [ ] `Permissions-Policy` restricts camera/mic/geolocation
- [ ] CORS restricted to known origins
- [ ] No sensitive data in `Referer` headers

## Output Format

```
## Security Review

### Scope
[What was reviewed]

### Findings

#### 🔴 Critical (HIPAA violation risk)
- [Finding] — [file:line] — [remediation]

#### 🟡 Important (security weakness)
- [Finding] — [file:line] — [remediation]

#### 🟢 Advisory (hardening opportunity)
- [Finding] — [file:line] — [remediation]

### Compliance Summary
| Area | Status |
|------|--------|
| Authentication | ✅/⚠️/❌ |
| Input Validation | ✅/⚠️/❌ |
| PHI Protection | ✅/⚠️/❌ |
| Org Isolation | ✅/⚠️/❌ |
| Audit Logging | ✅/⚠️/❌ |
| Headers/Transport | ✅/⚠️/❌ |

### Remediation Priority
[Ordered list of fixes, most critical first]
```
