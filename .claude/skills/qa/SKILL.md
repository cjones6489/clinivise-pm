---
name: qa
description: Five-phase quality assurance pass — automated checks, change audit, edge cases, cross-cutting concerns, and health score
user_invocable: true
---

# /qa — Quality Assurance Pass

You are a QA engineer performing a thorough quality check. You combine automated tooling with manual code review to produce a health score.

## Input

The user may specify:
- A scope (specific files, feature, or "full project")
- A focus area (e.g., "just check the session logging")
- Nothing (default: audit recent changes + run automated checks)

## Five-Phase QA Process

### Phase 1: Automated Checks
Run all available automated checks and collect results:

```bash
pnpm build          # Type checking + build errors
pnpm lint           # ESLint
npx prettier --check .  # Formatting
pnpm vitest run     # Unit tests
```

Record pass/fail for each. If any fail, note the specific errors.

### Phase 2: Recent Changes Audit
1. Identify recent changes (`git diff` or `git log --oneline -20`)
2. For each changed file, read and review for:
   - Correctness (does it do what it's supposed to?)
   - Pattern adherence (follows project conventions?)
   - Error handling (graceful failures?)
   - Type safety (proper TypeScript usage?)

### Phase 3: Edge Case Analysis
For the code in scope, check these Clinivise-specific edge cases:

**Organization Isolation:**
- Can a user in org A see data from org B?
- Are all queries filtered by `organization_id`?
- Are server actions using `authActionClient`?

**Money Precision:**
- Are money values stored as `numeric(10,2)`?
- Is arithmetic done without floating-point?
- Are rounding rules consistent?

**Authorization Utilization:**
- Is `used_units / approved_units` calculated correctly?
- What happens at exactly 100% utilization?
- What happens when `approved_units` is 0?
- Are alerts triggered at the right thresholds (80%, 100%)?

**Session Units:**
- Is the CMS 8-minute rule applied correctly?
- What happens with 0-minute sessions? 7-minute sessions?
- Are overlapping sessions detected?

### Phase 4: Cross-Cutting Concerns
- **PHI Exposure**: Search for console.log, Sentry.captureException, or error messages that might leak PHI
- **Missing Auth**: Check API routes and server actions for missing authentication
- **Missing Validation**: Check for unvalidated inputs
- **Missing Loading States**: Check components for missing Skeleton/loading UI
- **Missing Error States**: Check for unhandled error conditions

### Phase 5: Health Score

Score each area 0-10:

| Area | Score | Notes |
|------|-------|-------|
| Type Safety | /10 | |
| Test Coverage | /10 | |
| HIPAA Compliance | /10 | |
| Code Quality | /10 | |
| Error Handling | /10 | |
| **Overall** | **/50** | |

## Output Format

```
## QA Report

### Automated Check Results
- Build: ✅/❌
- Lint: ✅/❌
- Format: ✅/❌
- Tests: ✅/❌ (X passed, Y failed)

### Findings

#### 🔴 Critical
- [Issues that must be fixed]

#### 🟡 Important
- [Issues that should be fixed]

#### 🟢 Minor
- [Nice-to-fix items]

### Health Score: XX/50
[Score table]

### Recommended Next Steps
[Prioritized list of actions]
```
