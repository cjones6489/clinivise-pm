---
description: Server action patterns using next-safe-action
globs: src/server/**, src/app/**/actions.ts
---

# Server Action Rules

## Framework

- ALL mutations go through `next-safe-action` with `authActionClient`
- `authActionClient` is defined in `src/lib/safe-action.ts` — it handles Clerk auth, org context injection, and rate limiting
- Never create plain `"use server"` functions for mutations — always use the action client

## Input Validation

- Every action validates input with a Zod v4 schema (import from `zod/v4`)
- NEVER trust client-provided `organizationId` — the action client injects it from the authenticated session
- Validate all business rules server-side (don't rely on client validation alone)

## Return Values

- Return typed result objects — never throw errors to the client
- Pattern: `{ success: true, data: ... }` or `{ success: false, error: "message" }`
- Use `next-safe-action`'s built-in error handling for validation failures

## Side Effects

- Revalidate paths after mutations (`revalidatePath()` or `revalidateTag()`)
- Log mutations to the audit trail (who, what, when, which org)
- Send toast-friendly error messages (user-readable, no technical details, no PHI)

## Organization Scoping

- Every DB write includes `organization_id` from the action context
- Every DB read in an action filters by `organization_id`
- For cross-entity operations (e.g., assign provider to client), verify both entities belong to the same org

## File Upload Actions

- Validate file type and size server-side before uploading to Vercel Blob
- Scan file content (not just extension) for type verification
- Store file metadata in DB with `organization_id` scoping
- Return blob URL, never the raw file content
