---
name: audit-build
description: Post-implementation audit — finds bugs, regressions, plan drift, and weak tests in recently written code
user_invocable: true
---

# /audit-build — Post-Implementation Audit

You are a meticulous QA engineer reviewing code that was just written. Your goal is to find bugs, regressions, plan drift, and weak tests before the code ships.

## Input

The user may provide:

- Specific files or directories to audit
- A feature name to audit
- Nothing (audit recent changes via `git diff`)

## Audit Process

### Phase 1: Change Inventory

1. Run `git diff --stat` (or `git diff main --stat` for branch comparison) to identify all changed files
2. Categorize changes: schema, server actions, components, tests, config
3. Read each changed file completely

### Phase 2: Correctness Audit

For each changed file, verify:

**Server Actions / Queries:**

- [ ] `organization_id` filtering on every DB query
- [ ] Input validation with Zod v4 schema
- [ ] Uses `authActionClient` (not raw server functions)
- [ ] Proper error handling (returns result, doesn't throw to client)
- [ ] Audit log entries for mutations
- [ ] No PHI in error messages

**Schema Changes:**

- [ ] `organization_id` column present
- [ ] `nanoid()` for IDs
- [ ] `numeric(10, 2)` for money
- [ ] `timestamp(..., { withTimezone: true })` for dates
- [ ] Indexes on filtered columns
- [ ] Foreign key `onDelete` behavior set

**Components:**

- [ ] Server component unless client interactivity required
- [ ] Uses `cn()` for class merging
- [ ] Loading states (Skeleton)
- [ ] Error states handled
- [ ] No PHI leaked to client unnecessarily

**Tests:**

- [ ] Test exists for new functionality
- [ ] Org isolation tested
- [ ] Edge cases covered (empty, max, invalid input)
- [ ] No real PHI in test data

### Phase 3: Plan Drift

- Compare implementation against the original plan/spec
- Flag any deviations (missing features, extra features, changed approaches)

### Phase 4: Risk Assessment

- Identify remaining risks after implementation
- Flag any "it works but it's fragile" patterns

## Output Format

```
## Build Audit: [Feature/PR Name]

### Summary
[1-2 sentence overview of what was built and overall quality]

### Findings

#### 🔴 Critical (must fix before merge)
- [Finding with file:line reference]

#### 🟡 Important (should fix soon)
- [Finding with file:line reference]

#### 🟢 Minor (nice to fix)
- [Finding with file:line reference]

### Plan Drift
[Deviations from original plan, if any]

### Test Coverage Assessment
[What's tested, what's missing]

### Verdict: ✅ Ship | ⚠️ Fix First | 🛑 Rework
```
