---
name: debug
description: Systematic five-phase root-cause debugging — validates expectations, investigates, analyzes patterns, hypothesizes, and fixes
user_invocable: true
---

# /debug — Systematic Root-Cause Debugging

You are a senior debugger who never guesses. You follow a systematic process to find root causes, not symptoms.

## Input

The user provides:
- An error message, stack trace, or unexpected behavior description
- Optionally: steps to reproduce, relevant files, recent changes

## Five-Phase Process

### Phase 1: Validate Expectations
Before investigating the bug, confirm what "correct" looks like:
1. What should happen? (expected behavior)
2. What actually happens? (observed behavior)
3. When did it start? (recent changes via `git log --oneline -10`)
4. Is it reproducible? (always, sometimes, only in certain conditions)

### Phase 2: Investigate
Gather evidence systematically:
1. Read the error message carefully — what does it actually say?
2. Read the stack trace — identify the exact file and line
3. Read the relevant source code
4. Check recent changes to involved files (`git log --oneline -5 <file>`)
5. Check related configuration (env vars, DB schema, Clerk config)

### Phase 3: Pattern Analysis
Look for common Clinivise-specific failure patterns:

**Clerk Auth Issues:**
- Missing `auth()` call in server component/action
- Org context not available (user not in an organization)
- Middleware not protecting the route
- Session expired / token refresh failure

**Drizzle Query Errors:**
- Missing `organization_id` in WHERE clause
- Wrong column name (schema vs query mismatch)
- Migration not applied (`pnpm drizzle-kit migrate`)
- Connection pool exhaustion (Pool created outside handler)

**Neon Connection Problems:**
- WebSocket vs HTTP mode mismatch
- Connection string missing `-pooler` suffix
- Cold start timeout on serverless

**Multi-Tenant Data Leakage:**
- Query missing org filter
- Client-provided org ID trusted over session
- Join query crossing org boundary

**Money/Unit Arithmetic:**
- Float used instead of numeric/string
- Rounding error in unit calculations
- 8-minute rule applied incorrectly

### Phase 4: Hypothesize
Based on evidence, form 1-3 ranked hypotheses:
1. Most likely cause (with supporting evidence)
2. Second most likely (if evidence is ambiguous)
3. Long-shot (if patterns suggest something unusual)

Test each hypothesis with minimal, targeted checks.

### Phase 5: Fix
1. Implement the fix for the confirmed root cause
2. Verify the fix resolves the original issue
3. Check for similar patterns elsewhere in the codebase (same bug in other files)
4. Add a test if the bug class is important

## Output Format

```
## Debug Report

### Problem
[Clear description of the bug]

### Root Cause
[What actually went wrong and why]

### Fix
[What was changed, with file:line references]

### Verification
[How the fix was confirmed]

### Related Risks
[Other places this pattern might exist]
```
