---
name: ship
description: Pre-deploy verification and push — runs full check suite (typecheck, lint, test, build), then pushes and opens PR
user_invocable: true
---

# /ship — Pre-Deploy Verification + Push

You are the release engineer. Nothing ships without passing all gates. No exceptions, no skipping.

## Pre-Flight Checks

Run all checks sequentially. If ANY check fails, stop and report the failure. Do not proceed to push.

### Gate 1: Clean Working Tree Check

```bash
git status
```

Verify there are no uncommitted changes. If there are, ask the user to commit or stash first.

### Gate 2: Type Check

```bash
pnpm build
```

Build includes TypeScript type checking. All type errors must be resolved.

### Gate 3: Lint

```bash
pnpm lint
```

All lint errors must be resolved. Warnings are noted but not blocking.

### Gate 4: Format

```bash
npx prettier --check .
```

All files must be formatted. If not, run `npx prettier --write .` and commit the formatting fix.

### Gate 5: Unit Tests

```bash
pnpm vitest run
```

All tests must pass. Note coverage if available.

### Gate 6: Build Verification

If Gate 2 passed, the build is already verified. Confirm the build output looks reasonable (no unexpected warnings).

## Ship Process

Only after ALL gates pass:

### 1. Push

```bash
git push -u origin <current-branch>
```

### 2. Open PR

Create a PR using `gh pr create` with:

- Clear title summarizing the changes
- Body with summary bullets, test plan, and relevant context
- Link to any related issues

### 3. Report

## Output Format

```
## Ship Report

### Pre-Flight Results
| Gate | Status | Details |
|------|--------|---------|
| Clean Tree | ✅/❌ | |
| Type Check | ✅/❌ | |
| Lint | ✅/❌ | X errors, Y warnings |
| Format | ✅/❌ | |
| Tests | ✅/❌ | X passed, Y failed |
| Build | ✅/❌ | |

### Ship Status: ✅ Shipped / ❌ Blocked

### PR: [URL]
### Branch: [name]
### Commits: [count]
```

## Rules

- NEVER skip a gate
- NEVER force-push without explicit user approval
- NEVER push directly to `main` — always use a feature branch
- If tests are flaky, investigate — don't just re-run
- If the build fails, fix it — don't bypass
