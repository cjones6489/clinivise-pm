---
description: Testing patterns and priorities for Vitest and Playwright
globs: "**/*.test.*, **/*.spec.*, tests/**, e2e/**"
---

# Testing Rules

## Frameworks

- Unit tests: Vitest + Testing Library (`@testing-library/react`)
- E2E tests: Playwright (`@playwright/test`)
- Assertions: Vitest built-in + `@testing-library/jest-dom` matchers

## Test Priority (highest first)

1. **Auth & org isolation** — verify cross-tenant data cannot leak
2. **Money arithmetic** — numeric precision in billing calculations
3. **Authorization utilization** — used_units vs approved_units math, threshold alerts
4. **Session unit calculations** — CMS 8-minute rule conversion
5. **Server actions** — input validation, org scoping, error handling
6. **CRUD operations** — create, read, update, soft-delete flows
7. **UI components** — rendering, user interactions, form validation

## Test Data

- NEVER use real PHI in test data — use faker or handcrafted fixtures
- Use consistent test org IDs (e.g., `org_test_123`) for multi-tenant tests
- Create factory functions for common test entities (clients, sessions, authorizations)
- Money test cases must include: rounding, zero, negative, max precision

## Patterns

- Test file lives next to the source file: `foo.ts` → `foo.test.ts`
- Group related tests with `describe` blocks
- One assertion concept per test (a test can have multiple `expect` calls if they verify one behavior)
- Mock external services (Clerk, Stedi, Bedrock) at the boundary — not internal functions
- Test server actions with the actual action client (not by calling the handler directly)

## What to Always Test

- Org isolation: action with wrong org context returns error / empty result
- Input validation: malformed input is rejected with clear error
- Auth: unauthenticated requests are rejected
- Boundary values: 0 units, max units, date edge cases
