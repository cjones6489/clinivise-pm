# Clinivise Architecture Review — Pre-Launch Assessment

## Honest Summary

Your codebase is in the top 10% of early-stage SaaS projects I've seen. The multi-tenancy model is correct, the domain modeling (sessions, authorizations, unit accounting) reflects real ABA billing workflows, and the security posture is production-grade. You do not need to rip out and rewrite anything.

That said, there are **seven specific architectural changes** that are worth making now — before you have users — because they'll be painful or impossible to make later. These aren't theoretical; they're the patterns that cause outages, billing errors, or multi-month rewrites in healthcare SaaS companies that skip them early.

I've tiered these by actual impact. Tier 1 items can cause data corruption or billing errors in production. Tier 2 items will slow your team down as you scale features. Tier 3 items are refinements.

---

## Tier 1 — Fix Before Launch (Data Integrity & Correctness)

### 1. Add Optimistic Locking to Mutable Entities

**The problem:** Your `updateSession`, `updateAuthorization`, and `updateClient` actions have no concurrency protection. If two BCBAs open the same session, edit different fields, and save 10 seconds apart, the second save silently overwrites the first. In a billing system, this means lost session data, incorrect unit counts, and claims filed with stale information.

**The fix:** Use the `updatedAt` column you already have as a version check.

```typescript
// In your update schemas, require the client to send back updatedAt
export const updateSessionSchema = z.object({
  id: idSchema,
  updatedAt: z.string().datetime(), // Client sends the value it loaded
  // ... other fields
});

// In the action, add a WHERE clause
const [updated] = await tx
  .update(sessions)
  .set({
    /* ... */
  })
  .where(
    and(
      eq(sessions.id, id),
      eq(sessions.organizationId, ctx.organizationId),
      eq(sessions.updatedAt, new Date(parsedInput.updatedAt)), // Version check
    ),
  )
  .returning();

if (!updated) {
  throw new Error("Record was modified by another user. Please refresh and try again.");
}
```

Add `"Record was modified by another user. Please refresh and try again."` to your `USER_FACING_ERRORS` set. Apply this to `sessions`, `authorizations`, `clients`, and `clientInsurance` — any entity where concurrent edits are plausible.

**Why now:** Adding this after launch means every existing form needs to be updated to pass `updatedAt` through, and you need a migration to ensure all `updatedAt` values are accurate. Doing it now means you just wire it into your forms once.

---

### 2. Fix the Timezone Bug in Session Time Handling

**The problem:** `computeActualMinutes` constructs timestamps via `new Date(\`${sessionDate}T${startTime}:00\`)`. This parses as **local time of the server**, which on Vercel is UTC. If a BCBA in California logs a session at 2:00 PM PST, it's stored as 2:00 PM UTC — a 8-hour discrepancy. The same bug exists in the session form's `calculateUnits` effect.

Your `organizations` table already has a `timezone` column (defaulting to `America/New_York`). Use it.

**The fix:**

```typescript
// session-helpers.ts
export function computeActualMinutes(
  sessionDate: string,
  startTime?: string,
  endTime?: string,
  timezone?: string, // Pass org timezone
): { startTimestamp: Date | null; endTimestamp: Date | null; actualMinutes: number | null } {
  if (!startTime || !endTime) {
    return { startTimestamp: null, endTimestamp: null, actualMinutes: null };
  }

  // For unit calculation, we only need the duration — timezone doesn't matter
  const startMinutes = parseTimeToMinutes(startTime); // "14:30" → 870
  const endMinutes = parseTimeToMinutes(endTime);
  const actualMinutes = endMinutes - startMinutes;

  // For storage, anchor to the org timezone
  // Use date-fns-tz or store as time-only (see recommendation below)
  const startTimestamp = new Date(`${sessionDate}T${startTime}:00`);
  const endTimestamp = new Date(`${sessionDate}T${endTime}:00`);

  return { startTimestamp, endTimestamp, actualMinutes };
}
```

**Better long-term approach:** Consider storing `startTime` and `endTime` as plain `text` columns (`"14:30"` format) alongside the `sessionDate` date column, rather than full `timestamp with time zone`. For ABA billing, you never need to do cross-timezone time math — you need "this session happened on March 15 from 2:00–4:00 PM in the practice's local time." Storing timestamps with timezone creates complexity that ABA billing doesn't require. The `actualMinutes` integer column you already have is what actually matters for unit calculation.

**Why now:** Every session logged before you fix this will have incorrect timestamps. If you ever need to reconstruct billing records from stored times (common during audits), the data is wrong.

---

### 3. Add Idempotency Keys to Session Creation

**The problem:** If a user double-clicks "Log Session" or their network retries the request, you'll create two identical sessions and double-count authorization units. Your UI disables the button during submission (`isPending`), but network-level retries (which Next.js server actions can trigger) bypass this.

**The fix:** Add an `idempotencyKey` column to sessions and use it as a unique constraint.

```sql
-- Migration
ALTER TABLE sessions ADD COLUMN idempotency_key text;
CREATE UNIQUE INDEX sessions_idempotency_idx
  ON sessions (organization_id, idempotency_key)
  WHERE idempotency_key IS NOT NULL;
```

```typescript
// In the form, generate a key on mount
const idempotencyKey = useMemo(() => nanoid(), []);

// In createSessionSchema
idempotencyKey: z.string().min(1),

// In the action, use INSERT ... ON CONFLICT DO NOTHING
const [session] = await tx
  .insert(sessions)
  .values({ ...values, idempotencyKey: parsedInput.idempotencyKey })
  .onConflictDoNothing({
    target: [sessions.organizationId, sessions.idempotencyKey]
  })
  .returning();

if (!session) {
  // Duplicate request — return the existing session
  const [existing] = await tx
    .select()
    .from(sessions)
    .where(and(
      eq(sessions.organizationId, ctx.organizationId),
      eq(sessions.idempotencyKey, parsedInput.idempotencyKey)
    ))
    .limit(1);
  return existing;
}
```

Apply this to any mutation that has financial side effects: `createSession`, `createAuthorization`, and eventually claim submission.

**Why now:** This requires a schema change and form changes. Easy to add now, painful to retrofit after you have data.

---

## Tier 2 — Implement Pre-Launch (Maintainability & Developer Velocity)

### 4. Centralize Authorization and Cache Invalidation with a Permissions Map and Revalidation Registry

**The problem:** You have two patterns that are duplicated across every action file and will become error-prone as you grow:

**a) Role checking:** `WRITE_ROLES` is defined independently in 7 files with different values. When you add a role (which you will — `scheduler`, `office_manager`, etc.), you need to update every file, and missing one creates a silent authorization bug.

**b) Cache invalidation:** You have 44 `revalidatePath` calls scattered across your actions. Every new page you add means going back to every action that touches related data and adding another `revalidatePath`. Miss one and users see stale data.

**The fix:**

```typescript
// lib/permissions.ts
export const PERMISSIONS = {
  "clients.write": ["owner", "admin", "bcba"] as const,
  "clients.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"] as const,
  "sessions.write": ["owner", "admin", "bcba", "bcaba", "rbt"] as const,
  "authorizations.write": ["owner", "admin", "bcba"] as const,
  "billing.write": ["owner", "admin", "billing_staff"] as const,
  "settings.write": ["owner", "admin"] as const,
} as const;

export type Permission = keyof typeof PERMISSIONS;

// In safe-action.ts, add a permission-checking middleware
export const protectedAction = (permission: Permission) =>
  authActionClient.use(async ({ ctx, next }) => {
    if (!PERMISSIONS[permission].includes(ctx.userRole as any)) {
      throw new Error("Forbidden: insufficient role");
    }
    return next({ ctx });
  });

// Usage in actions:
export const createClient = protectedAction("clients.write")
  .schema(createClientSchema)
  .action(async ({ parsedInput, ctx }) => {
    // No manual role check needed
  });
```

For cache invalidation:

```typescript
// lib/revalidation.ts
const ENTITY_PATHS: Record<string, (id?: string, meta?: Record<string, string>) => string[]> = {
  session: (id, meta) => [
    "/sessions",
    ...(id ? [`/sessions/${id}`] : []),
    ...(meta?.clientId ? [`/clients/${meta.clientId}`] : []),
    ...(meta?.authorizationId ? [`/authorizations/${meta.authorizationId}`] : []),
    "/overview",
  ],
  client: (id) => ["/clients", ...(id ? [`/clients/${id}`] : []), "/overview"],
  authorization: (id, meta) => [
    "/authorizations",
    ...(id ? [`/authorizations/${id}`] : []),
    ...(meta?.clientId ? [`/clients/${meta.clientId}`] : []),
    "/overview",
  ],
};

export function revalidateEntity(
  entityType: string,
  entityId?: string,
  meta?: Record<string, string>,
) {
  const pathFn = ENTITY_PATHS[entityType];
  if (!pathFn) return;
  for (const path of pathFn(entityId, meta)) {
    revalidatePath(path);
  }
}

// Usage:
revalidateEntity("session", result.id, {
  clientId: parsedInput.clientId,
  authorizationId: resolvedAuthId ?? undefined,
});
```

**Why now:** Every new feature you build multiplies the number of places these patterns are repeated. Centralizing now means every future action is ~10 lines shorter and you never forget a permission or a cache path.

---

### 5. Add a Scoped Query Builder to Eliminate Org-Filtering Bugs

**The problem:** Every query manually adds `eq(table.organizationId, orgId)` and `isNull(table.deletedAt)`. You have a `scopedWhere` helper in two files, but it's inconsistent and only covers part of the pattern. If a developer ever forgets the org filter on a new query, data leaks between tenants. In healthcare, that's a HIPAA breach.

**The fix:** Create a typed query helper that makes it impossible to forget:

```typescript
// server/db/scoped.ts
import { db } from "./index";
import { eq, and, isNull, type SQL } from "drizzle-orm";

type SoftDeletable = { deletedAt: any; organizationId: any };

/**
 * Returns a WHERE clause that scopes to the org and excludes soft-deleted rows.
 * Use for any table that has organizationId + deletedAt.
 */
export function tenantScope<T extends SoftDeletable>(table: T, orgId: string, ...extra: SQL[]) {
  return and(eq(table.organizationId, orgId), isNull(table.deletedAt), ...extra);
}

/**
 * For tables without deletedAt (e.g., sessions, audit_logs)
 */
export function orgScope<T extends { organizationId: any }>(
  table: T,
  orgId: string,
  ...extra: SQL[]
) {
  return and(eq(table.organizationId, orgId), ...extra);
}
```

This is intentionally simple — not an ORM wrapper, just a function that makes the right thing the easy thing:

```typescript
// Before:
.where(and(eq(clients.organizationId, orgId), isNull(clients.deletedAt), eq(clients.id, id)))

// After:
.where(tenantScope(clients, orgId, eq(clients.id, id)))
```

**Why now:** You have ~40 queries. That number will triple by Phase 2. Each new query is a chance to forget the org filter.

---

### 6. Introduce Domain Error Classes

**The problem:** Your error handling relies on string matching — `USER_FACING_ERRORS` is a `Set` of exact strings, and your `handleServerError` does a set lookup. This is fragile: a typo in an error message silently falls through to the generic "Something went wrong" message, and you can't attach metadata (like HTTP status codes or error codes for the frontend).

**The fix:**

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} not found`, "NOT_FOUND", 404);
  }
}

export class ForbiddenError extends AppError {
  constructor() {
    super("Forbidden: insufficient role", "FORBIDDEN", 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT", 409);
  }
}

export class StaleDataError extends AppError {
  constructor() {
    super("Record was modified by another user. Please refresh and try again.", "STALE_DATA", 409);
  }
}
```

Then simplify your safe-action error handler:

```typescript
handleServerError(e) {
  console.error("Action error:", e.message);

  if (e instanceof AppError) {
    return e.message; // All AppErrors are user-safe by definition
  }

  return DEFAULT_SERVER_ERROR_MESSAGE;
}
```

**Why now:** You currently have 22 strings in `USER_FACING_ERRORS`. By Phase 2 you'll have 40+. This pattern composes cleanly and eliminates an entire class of "error message typo" bugs.

---

## Tier 3 — Strong Recommendations (Quality & Robustness)

### 7. Add Audit Logging to Client and Insurance Mutations

Your sessions and authorizations have thorough audit logging, but `createClient`, `updateClient`, `deleteClient`, and all insurance mutations skip it entirely. For a platform handling PHI in ABA practices, every mutation to client records should be auditable. This is straightforward — just add `logAudit` calls matching the pattern you already have in sessions. Do this for all client, insurance, contact, and payer actions.

---

## Things to NOT Change

Equally important — here's what I'd tell you to leave alone:

**Don't add a service layer.** Your current pattern of `action → validate → query → mutate → revalidate` in a single function is appropriate for your scope. A service layer adds indirection without benefit until you have multiple consumers of the same business logic (e.g., both a UI action and a webhook calling the same session-creation logic). You're not there yet. When you build the Stedi webhook handlers in Phase 2, that's the natural time to extract shared logic.

**Don't add Postgres Row-Level Security.** Your application-level org filtering is correct and consistent. RLS adds operational complexity (policy debugging, migration complexity, connection pooling gotchas with Neon) that isn't worth it when your app layer is already disciplined. The scoped query builder from recommendation #5 gives you the same safety net with less complexity.

**Don't switch to a different ORM or query builder.** Drizzle is the right choice for your stack. Your queries are well-typed and readable. The only alternative worth considering would be raw SQL via Neon's serverless driver, but you'd lose type inference on results.

**Don't over-abstract your components.** Your UI components are purpose-built for specific pages. That's correct for a Phase 1 product. Premature component abstraction creates worse outcomes than duplication.

**Don't add GraphQL.** Your data access patterns are well-served by server components doing direct DB calls and server actions for mutations. GraphQL would add a layer of complexity with no benefit for your architecture.

**Don't add event sourcing or CQRS.** Your domain is fundamentally CRUD with some accounting invariants. The `computeAccountingOps` pattern you have is the right level of abstraction. Event sourcing would be massive over-engineering.

---

## Minor Fixes (Do When Convenient)

These aren't architectural but are worth addressing:

1. **Dashboard age calculation is off by one.** `new Date().getFullYear() - new Date(dob).getFullYear()` doesn't account for whether the birthday has passed. Use `differenceInYears(new Date(), new Date(dob))` from date-fns.

2. **Dashboard fetches all rows.** `getClients(orgId)` and `getAuthorizations(orgId)` return everything. For your target market (1–50 staff, maybe 100-300 clients), this is fine for now. When you hit ~500 clients, push the metric aggregation into SQL with a dedicated `getDashboardMetrics(orgId)` query that returns counts and sums directly.

3. **Batch authorization service inserts.** `createAuthorization` loops `INSERT` per service line. Use `tx.insert(authorizationServices).values(services.map(...))` for a single round-trip.

4. **The `register("units")` in the session form** uses React Hook Form's `register` which returns string values for number inputs. Verify that your Zod schema coerces this correctly, otherwise units might be validated as strings.

5. **Rate limiting.** You have `@upstash/ratelimit` and `@upstash/redis` in your dependencies but I don't see them applied anywhere. Before launch, add rate limiting to your server actions (especially session creation and any AI endpoints) and to the Clerk webhook endpoint.

---

## Bottom Line

Your architecture is sound. The seven recommendations above are refinements to a solid foundation, not indications of structural problems. The Tier 1 items (optimistic locking, timezone fix, idempotency) are the ones I'd prioritize — they prevent data integrity issues that are painful to fix after launch. The Tier 2 items (centralized permissions, scoped queries, domain errors) are about developer velocity as you grow the codebase. None of this requires a rewrite.

You're in a good position to launch.
