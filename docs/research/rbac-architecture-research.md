# RBAC Architecture Research: Clerk + Next.js Integration Patterns

**Date:** 2026-03-25
**Focus:** Practical architecture patterns for role-based access control in a multi-tenant ABA practice management tool using Clerk Organizations + Next.js 16.

---

## 1. Clerk's Built-In RBAC: What You Get Out of the Box

### 1.1 Default Organization Roles

Clerk provides two built-in roles with every Organizations setup:

| Role | Key | System Permissions |
|---|---|---|
| **Admin** | `org:admin` | Full management: create/read/update/delete members, manage org settings, manage domains, manage billing |
| **Member** | `org:member` | Read-only on members + billing. Cannot manage org or invite. |

These roles are available on all plans, including Free.

### 1.2 Custom Roles & Permissions (Paid Feature)

**What's available:**
- Up to 10 custom roles per application instance (contact support for more)
- Custom permissions follow the naming convention `org:<feature>:<action>` (e.g., `org:sessions:create`, `org:clients:read`)
- Permissions are grouped under "Features" in the Clerk Dashboard
- Roles are assigned permissions; users are assigned roles per-organization
- Custom roles and permissions are defined once at the application level, applying across all organizations

**Pricing reality (as of March 2026):**
- **Free/Pro base ($0-$25/mo):** Admin + Member roles only. Custom permissions are available, but custom roles are NOT. You get exactly 2 roles.
- **Enhanced B2B add-on ($85-$100/mo):** Unlocks custom roles, role sets, unlimited org members (vs 20 on Free), verified domains, and automatic invitations.
- **Role Sets** (Jan 2026 feature): Collections of roles scoped to different organizations. One role set free; additional sets require Enhanced B2B. This is designed for platforms where different customer tiers get different role options.

**Critical limitation:** System Permissions (the 8 built-in ones that power Clerk's own components like `<OrganizationProfile>`) are NOT included in session token claims. Only Custom Permissions appear in the JWT. To check System Permissions server-side, you must check the user's role string directly.

### 1.3 Session Token Claims (How Roles Get to Your App)

When a user has an active organization, the session token includes an `o` claim:

```json
{
  "o": {
    "id": "org_abc123",
    "slg": "bright-futures-aba",
    "rol": "admin",
    "per": ["clients:read", "clients:write", "sessions:create"],
    "fpm": "..."
  }
}
```

**Key facts:**
- `rol` contains the role WITHOUT the `org:` prefix
- `per` contains Custom Permission names (without `org:` prefix)
- Total custom claims must stay under 1.2KB (cookie size budget after Clerk's defaults)
- You can add custom claims from `user.public_metadata`, `organization.public_metadata`, or `organization_membership.public_metadata` — but do NOT dump entire objects. Add individual fields only.
- Organization membership metadata can be updated per-user-per-org via `PATCH /organizations/{org_id}/memberships/{user_id}/metadata`

### 1.4 Authorization Checking Methods

Clerk provides `has()` for checking roles and permissions:

**Server Component:**
```typescript
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { has } = await auth()
  const canManage = has({ permission: 'org:clients:write' })
  if (!canManage) return null
  return <h1>Client Management</h1>
}
```

**Client Component:**
```typescript
'use client'
import { useAuth } from '@clerk/nextjs'

export default function Page() {
  const { has } = useAuth()
  const canManage = has({ permission: 'org:clients:write' })
  // ...
}
```

**Declarative (Render-based):**
```tsx
import { Show } from '@clerk/nextjs'

<Show when={{ permission: 'org:sessions:create' }} fallback={<p>No access</p>}>
  <LogSessionButton />
</Show>
```

**Middleware (proxy.ts):**
```typescript
export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth()
    if (sessionClaims?.o?.rol !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})
```

**Important:** `has()` only works with Custom Permissions (not System Permissions) on the server side. For checking System Permissions, verify the role string directly.

### 1.5 TypeScript Integration

Custom roles and permissions can be typed via `globals.d.ts`:

```typescript
export {}
declare global {
  interface ClerkAuthorization {
    permission: 'org:clients:read' | 'org:clients:write' | 'org:sessions:create' | ...
    role: 'org:admin' | 'org:bcba' | 'org:rbt' | ...
  }
}
```

---

## 2. Three Architecture Options Compared

### Option A: Preset Roles in Our DB Only (Current Approach)

**How it works:** Roles are stored as a `text` column on `users` table in our database. Clerk knows nothing about our roles — it just authenticates. A `PERMISSIONS` map in `src/lib/permissions.ts` maps role -> allowed actions. Every server action calls `requirePermission(ctx.userRole, "feature.action")`.

**What we already have:**
- `users.role` column: `owner | admin | bcba | bcaba | rbt | billing_staff`
- `PERMISSIONS` map with 7 permission keys
- `requirePermission()` and `hasPermission()` utility functions
- `requireRole()` in `src/lib/auth.ts` for page-level checks
- Role-based sidebar filtering in `app-sidebar.tsx`
- `authActionClient` middleware injects `userRole` into every action context

**Pros:**
- Already built and working
- Zero Clerk cost impact (no need for Enhanced B2B add-on)
- Full control over role definitions — can have 6+ roles without paying for Clerk custom roles
- Role changes are instant (update DB row, no Clerk API call)
- No dependency on Clerk's role system — portable if we ever switch auth providers
- Simple mental model: one `PERMISSIONS` constant is the source of truth
- Roles are already ABA-specific (bcba, bcaba, rbt, billing_staff) — Clerk's generic system has no awareness of these

**Cons:**
- Clerk's `<OrganizationProfile>` component shows only Clerk roles (admin/member), not our DB roles — confusing in the Team tab
- `has()` from Clerk won't work — our auth checks are always `requirePermission()` / `requireRole()`
- No middleware-level role checks (our roles aren't in the JWT) — role checks happen after the page starts loading
- Inviting a new team member via Clerk's invite flow doesn't set their Clinivise role — requires a separate step
- Two sources of truth: Clerk org membership (who's in the org) vs our DB (what role they have)

**Complexity:** Low. Already built. No new code needed for RBAC itself.

**Maintenance:** Low. Add a row to `PERMISSIONS` when adding new features.

### Option B: Preset Roles + Per-Feature Toggles (Recommended Extension)

**How it works:** Keep Option A's DB-stored roles as the foundation. Add an optional `permission_overrides` JSON column (or a separate `user_permission_overrides` table) for per-user exceptions. The `hasPermission()` function checks overrides first, then falls back to the role's default permissions.

**Implementation sketch:**
```typescript
// Enhanced permission check
export function hasPermission(
  role: string,
  permission: Permission,
  overrides?: Record<string, boolean>
): boolean {
  // Override takes priority if present
  if (overrides && permission in overrides) {
    return overrides[permission];
  }
  // Fall back to role default
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}
```

**Use case:** A BCBA who also handles billing gets `{ "billing.read": true }` added to their overrides. An RBT who should NOT see certain client data gets `{ "clients.read": false }`.

**Pros:**
- Everything from Option A, plus flexibility for the "BCBA who also does billing" edge case
- Covers 95% of small-practice needs without a permission management UI
- Admin can grant/revoke specific permissions without creating new roles
- Aligns with competitor research: SimplePractice (preset roles) dominates small practices; CentralReach (full custom) is cited as overly complex

**Cons:**
- Need to build a minimal UI for managing overrides (on the user detail page, not a full permissions console)
- Overrides can drift — need audit trail for who changed what
- Slightly more complex permission checks (one extra lookup)
- Still no middleware-level enforcement

**Complexity:** Low-medium. 1-2 days of work on top of what exists.

**Maintenance:** Low. Overrides are optional — most users will never have any.

### Option C: Full Clerk RBAC Integration (Clerk Manages Everything)

**How it works:** Define all 6 roles as custom Clerk roles. Define all permissions as Clerk custom permissions. Assign roles to users through Clerk's APIs. Use `has()` everywhere. Remove our DB role column entirely (or keep it as a cache).

**What it requires:**
1. Enhanced B2B add-on: $100/month (on top of Pro $25/month)
2. Define 6 custom roles in Clerk Dashboard: `org:owner`, `org:admin`, `org:bcba`, `org:bcaba`, `org:rbt`, `org:billing_staff`
3. Define ~15-20 custom permissions: `org:clients:read`, `org:clients:write`, `org:sessions:create`, etc.
4. Migrate existing user roles from our DB to Clerk org memberships
5. Replace all `requirePermission()` calls with Clerk's `has()`
6. Replace `requireRole()` with `has({ role: 'org:bcba' })`
7. Add custom session claims for any app-specific data
8. Handle the Clerk invite flow to set the correct custom role

**Pros:**
- `has()` works everywhere — middleware, server components, client components
- Clerk's `<OrganizationProfile>` component shows actual roles (not just admin/member)
- Middleware-level enforcement: block unauthorized users before the page even loads
- Clerk handles role assignment during invite flow
- Single source of truth for who has what role
- TypeScript integration with `ClerkAuthorization` interface

**Cons:**
- **$100/month additional cost** for Enhanced B2B add-on (total ~$125/month before MAU charges)
- 10 custom role limit — we already have 6, leaves little room for future roles
- Vendor lock-in: roles are now tied to Clerk's system. Switching auth providers means rebuilding RBAC
- Migration effort: need to move all existing role data from our DB to Clerk
- Clerk's permission system is designed for generic SaaS, not ABA-specific workflows. We'd be mapping ABA concepts (BCBA supervision requirements, RBT scope-of-practice limits) onto a generic permission system
- Permission changes require Clerk Dashboard or API calls — can't just edit a constant
- If Clerk has downtime, permission checks may fail (though cached in JWT)
- The 1.2KB session token limit becomes real with 15-20 permissions per user
- Clerk's role management UI is generic — it won't understand that "BCaBA" is a clinical credential

**Complexity:** High. 3-5 days of migration work, plus ongoing Clerk Dashboard management.

**Maintenance:** Medium-high. Every new feature requires: add permission in Clerk Dashboard, assign to relevant roles, update TypeScript types, test.

### Comparison Matrix

| Factor | A: DB Roles Only | B: DB Roles + Overrides | C: Full Clerk RBAC |
|---|---|---|---|
| **Monthly cost** | $0 | $0 | +$100/mo |
| **Implementation effort** | Done | 1-2 days | 3-5 days |
| **Middleware enforcement** | No | No | Yes |
| **Role flexibility** | 6 preset | 6 preset + overrides | Up to 10 custom |
| **Clerk UI integration** | Poor (shows admin/member) | Poor (shows admin/member) | Good (shows actual roles) |
| **Invite flow** | Manual role step | Manual role step | Integrated |
| **Vendor lock-in** | None | None | High |
| **ABA-specific** | Yes (our constants) | Yes (our constants) | Generic |
| **Source of truth** | Our DB | Our DB | Clerk |
| **Token size impact** | None | None | Medium (permissions in JWT) |
| **Portability** | High | High | Low |

---

## 3. Permission Checking Patterns

### 3.1 Layer-by-Layer Analysis

Permission enforcement should happen at multiple levels. Here's where each layer fits and its trade-offs:

#### Layer 1: Middleware/Proxy (Route-Level)

**What it protects:** Blocks entire route patterns before the page loads.

**Current state:** Our `proxy.ts` only checks authentication (is the user logged in?), not authorization (does the user have the right role?).

**Pattern with DB roles (Options A/B):**
```typescript
// proxy.ts — can't do role checks because our roles aren't in the JWT
// We'd need to add our DB role to custom session claims, which adds complexity
// RECOMMENDATION: Don't do role checks in middleware with DB-stored roles
```

**Pattern with Clerk roles (Option C):**
```typescript
const isAdminRoute = createRouteMatcher(['/settings(.*)', '/providers(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect()
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth()
    if (!['admin', 'owner'].includes(sessionClaims?.o?.rol)) {
      return NextResponse.redirect(new URL('/overview', req.url))
    }
  }
})
```

**Verdict:** Middleware role checks are a nice-to-have, not a must-have. The real security boundary is the server action, not the page load. Middleware is a UX optimization (faster redirect), not a security boundary.

**CVE-2025-29927 note:** A critical vulnerability in Next.js allowed middleware bypass via `x-middleware-subrequest` header. This was patched, but it reinforces that middleware should never be your ONLY authorization check.

#### Layer 2: Server Component (Page-Level)

**What it protects:** Prevents rendering of pages the user shouldn't see.

**Current state:** Already implemented via `requireRole()`:
```typescript
// src/app/(dashboard)/providers/page.tsx
const user = await requireRole(["owner", "admin"]);
```

**This is the right pattern.** Server components run on the server, so they can query our DB for the role. The user never sees the page content if they lack access. The redirect/error happens during SSR.

**Recommendation:** Keep this pattern. It works with all three architecture options.

#### Layer 3: Server Action (Mutation-Level) — THE CRITICAL LAYER

**What it protects:** Prevents unauthorized data mutations regardless of how they're triggered.

**Current state:** Already implemented via `requirePermission()`:
```typescript
// src/server/actions/clients.ts
requirePermission(ctx.userRole, "clients.write");
```

**This is the security boundary.** Even if someone bypasses the UI, the server action still checks permissions. This is where HIPAA's "minimum necessary" principle is enforced.

**Recommendation:** This layer is non-negotiable. Keep `requirePermission()` in every mutation.

#### Layer 4: Component (UI-Level)

**What it protects:** Hides buttons, links, and sections the user can't use.

**Current state:** Partially implemented via sidebar filtering:
```typescript
// app-sidebar.tsx
const filteredItems = userRole
  ? navItems.filter((item) => item.roles.includes(userRole))
  : navItems;
```

**Recommendation:** Extend this pattern with a `<Can>` component:
```tsx
// Proposed: src/components/auth/can.tsx
function Can({ permission, children, fallback = null }: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { userRole } = useCurrentUser(); // from context
  if (!hasPermission(userRole, permission)) return fallback;
  return children;
}

// Usage
<Can permission="clients.write">
  <Button>Add Client</Button>
</Can>
```

**Important:** UI-level checks are NEVER sufficient alone. They're a UX convenience (don't show buttons users can't use), not a security measure.

### 3.2 Recommended Checking Strategy (All Options)

```
Request Flow:
  proxy.ts (auth only) → Server Component (role check) → Render page
  User clicks → Server Action (permission check) → Mutation

Check hierarchy:
  1. proxy.ts: Is user authenticated? (yes for all routes except public)
  2. Server Component: Does user have the required role for this page?
  3. Server Action: Does user have the required permission for this mutation?
  4. Component: Should this button/link be visible? (UX only)
```

---

## 4. Team Page UI Patterns

### 4.1 What Top SaaS Products Do

Research across 50+ SaaS products reveals consistent patterns for team management pages:

**Common layout:**
1. **Header area:** "Team" or "Members" title + invite button (primary action)
2. **Member table:** Avatar/initials + Name + Email + Role (dropdown or badge) + Status + Actions (menu with Remove, Change Role)
3. **Pending invitations section:** Separate section or tab for outstanding invites, with Resend/Revoke actions
4. **Role descriptions:** Either inline tooltips or a separate "Roles" tab explaining what each role can do

**Invitation flow (most common):**
1. Click "Invite Member"
2. Modal/dialog with: Email input + Role selector (dropdown with descriptions)
3. Send invitation email via auth provider
4. Invitee appears in "Pending" section until they accept

**Role management patterns:**
- **Simple (Linear, Notion, Slack):** Dropdown on each member row to change role. 3-5 roles. No permissions UI.
- **Medium (Vercel, GitHub):** Roles tab showing role definitions. Can't customize roles. Role assignment via member table.
- **Complex (CentralReach, Healthie):** Full permissions matrix. Custom role builder. 50-70 individual permission toggles. Requires documentation to set up.

**What small practices need (from competitor research):**
- Invite by email with role pre-selected
- See who's on the team, what role they have, and when they joined
- Change someone's role with a dropdown (not a separate page)
- Remove a team member
- See pending invitations and resend them
- That's it. No permission matrix. No custom role builder.

### 4.2 Current State: Clerk's `<OrganizationProfile>` Component

The product spec says the Team tab should "embed Clerk's `<OrganizationProfile>` component for team/invite management. No custom UI needed."

**What `<OrganizationProfile>` provides:**
- Member list with name, email, role, and join date
- Invite members by email with role selection
- Change member roles (admin/member only, unless custom roles are configured)
- Remove members
- Pending invitations with revoke action
- Organization settings (name, slug, logo)

**Limitation with Option A/B (DB roles):** The component shows Clerk's roles (admin/member), not our app roles (BCBA/RBT/etc.). This creates confusion: a user sees "Member" in the Team tab but "BCBA" everywhere else.

**Workaround options:**
1. **Hybrid approach:** Use `<OrganizationProfile>` for invite/remove, but show our custom role in an adjacent column or overlay. After Clerk invite, redirect to a "Set Practice Role" step.
2. **Custom Team UI:** Build our own team management page that reads from both Clerk (membership status, invite management) and our DB (app role). More work, but no confusion.
3. **Clerk custom roles (Option C):** If using Enhanced B2B, configure Clerk with our actual roles. The component then shows "BCBA" instead of "Member."

### 4.3 Recommended Team Page Design (Option A/B)

Since we're not paying for Clerk's Enhanced B2B, the Team tab needs a custom UI:

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Settings                                                │
│ ┌──────────┬────────┬────────┬─────────┐               │
│ │ Practice │ Team   │ Payers │ Billing │               │
│ └──────────┴────────┴────────┴─────────┘               │
│                                                         │
│ Team Members                          [Invite Member]   │
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Name          Email              Role     Actions   │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ JS Jane Smith  jane@bf.com       BCBA     [···]    │ │
│ │ MB Mike Brown  mike@bf.com       RBT      [···]    │ │
│ │ AL Amy Lee     amy@bf.com        Admin    [···]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
│ Pending Invitations                                     │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Email              Role     Sent       Actions      │ │
│ │ ─────────────────────────────────────────────────── │ │
│ │ new@bf.com         RBT     2 days ago  Resend | X  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

**How it works:**
1. Invite button opens a dialog: email + role selector (our 6 roles, with descriptions)
2. Clerk API sends the invite email (via `organization.inviteMember()`)
3. When invitee signs up and joins, a Clerk webhook creates their `users` row with the selected role
4. The table pulls from our `users` table (for role, name) joined with Clerk membership data (for status, join date)
5. Role dropdown on each row lets admins change the role (updates our DB)
6. Remove button removes from both Clerk org and our DB

---

## 5. Healthcare-Specific RBAC Considerations

### 5.1 HIPAA Minimum Necessary Standard

HIPAA requires that staff access "only the minimum amount of PHI necessary to accomplish the intended purpose." For an ABA practice:

- **RBTs** should see only their assigned clients' names, DOB, and session data
- **BCBAs** need clinical + authorization data for their caseload
- **Billing staff** need insurance/billing data but not clinical notes
- **Admins/Owners** see everything

**Implementation:** Our current `PERMISSIONS` map handles this at the feature level. Phase 2 should add data-level scoping (RBT sees only assigned clients' sessions).

### 5.2 Break-Glass Access

Healthcare systems sometimes need "break-glass" access — emergency override of normal permissions. For a small ABA practice this is extremely rare, but the pattern is:

- Owner/Admin can always access everything (they already can)
- Log the access with extra scrutiny in audit trail
- No need for a formal break-glass UI in Phase 1

### 5.3 Least Privilege by Default

New users should default to the most restrictive role. Our current default is `rbt` (most restrictive clinical role), which is correct. The invite flow should make admins explicitly choose a role — never auto-assign `admin`.

---

## 6. Recommendation

### For Clinivise Phase 1: Option A (Current) with planned migration to Option B

**Rationale:**

1. **Cost:** We save $100/month by not needing Clerk's Enhanced B2B add-on. For a pre-revenue startup, this matters. That's $1,200/year for a feature we can build ourselves in 1-2 days.

2. **Already built:** The permissions system works. Seven permission keys cover all Phase 1 features. `requirePermission()` is used in every server action. Role-based sidebar filtering is implemented. This is not theoretical — it's in production.

3. **ABA-specific roles:** Our roles (BCBA, BCaBA, RBT, billing_staff) are domain-specific. Clerk's generic role system adds no value here — it would just be a mirror of our DB with extra API calls.

4. **Small practice reality:** A 5-person ABA practice does not need custom role builders, permission matrices, or role sets. They need 6 preset roles that match their team's job functions. This is what SimplePractice and TherapyNotes do, and they dominate the small-practice market.

5. **Middleware trade-off is acceptable:** Yes, we can't do role checks in middleware with DB-stored roles. But middleware is a UX optimization, not a security boundary (especially post-CVE-2025-29927). Our server components and server actions enforce authorization. The practical difference is that an unauthorized user sees a "forbidden" message after the page starts loading instead of before — a <100ms difference.

6. **Portability:** If we ever need to switch from Clerk (pricing changes, HIPAA BAA requirements, feature gaps), our RBAC is completely independent. Zero migration needed.

### What to Build Next (Phase 1 Polish)

1. **Custom Team Management UI** for the Settings > Team tab
   - Replace `<OrganizationProfile>` with a custom team table showing our roles
   - Invite flow: email + role selector → Clerk invite API + store pending role
   - Webhook handler: on member join, create `users` row with stored role
   - Role change: dropdown on member row → update our DB

2. **`<Can>` component** for declarative UI permission checks
   - Wraps `hasPermission()` in a React component
   - Use it to conditionally render action buttons, form fields, and nav items

3. **Permission context provider** to avoid prop-drilling `userRole`
   - Server component fetches role, passes to client context
   - All client components can check permissions without re-fetching

### When to Reconsider Option C (Full Clerk RBAC)

Move to Clerk-managed roles IF:
- We need 10+ organizations on different role configurations (role sets)
- Enterprise customers demand SAML/OIDC with role mapping from their IdP
- Clerk drops the Enhanced B2B add-on price significantly
- We need middleware-level role enforcement for regulatory reasons

None of these apply to a 1-50 staff ABA practice in Phase 1-2.

### When to Add Option B (Per-Feature Overrides)

Add overrides IF:
- Multiple customers request "BCBA who also does billing" flexibility
- We need to support hybrid roles that don't fit our 6 presets
- A practice needs to restrict a specific user below their role's defaults

This is a ~1 day addition when needed. Don't build it until a real user asks for it.

---

## Sources

### Clerk Documentation
- [Clerk Organizations Overview](https://clerk.com/docs/guides/organizations/overview)
- [Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions)
- [Check Access (has())](https://clerk.com/docs/guides/organizations/control-access/check-access)
- [Basic RBAC with Metadata](https://clerk.com/docs/guides/secure/basic-rbac)
- [Session Tokens](https://clerk.com/docs/guides/sessions/session-tokens)
- [Organization Metadata](https://clerk.com/docs/guides/organizations/metadata)
- [Manage Roles Custom Flow](https://clerk.com/docs/guides/development/custom-flows/organizations/manage-roles)
- [Clerk Pricing](https://clerk.com/pricing)
- [Role Sets Changelog](https://clerk.com/changelog/2026-01-12-organization-role-sets)

### SaaS RBAC Design
- [How to Design Effective SaaS Roles and Permissions — Perpetual](https://www.perpetualny.com/blog/how-to-design-effective-saas-roles-and-permissions)
- [Enterprise Ready RBAC Guide](https://www.enterpriseready.io/features/role-based-access-control/)
- [3 Most Common Authorization Designs for SaaS — Cerbos](https://www.cerbos.dev/blog/3-most-common-authorization-designs-for-saas-products)
- [How to Structure Permissions — Contentsquare](https://contentsquare.com/blog/structure-permissions-saas-app/)
- [Roles & Permissions Case Study — Gurpreet Singh](https://medium.com/design-bootcamp/roles-permissions-9c3319583150)
- [Managing Roles and Permissions User Flows — Nicelydone](https://nicelydone.club/flows/manage-roles-and-permissions)

### Healthcare RBAC
- [RBAC in Healthcare RCM — Enter Health](https://www.enter.health/post/role-based-access-control-healthcare-rcm)
- [RBAC in Healthcare: Benefits and Best Practices — AccountableHQ](https://www.accountablehq.com/post/role-based-access-control-rbac-in-healthcare-benefits-examples-and-best-practices)
- [How Role-Based Controls Protect Patient Data — Censinet](https://www.censinet.com/perspectives/how-role-based-controls-protect-patient-data)
- [RBAC Best Practices — Valant](https://www.valant.io/resources/blog/how-to-get-the-most-out-of-role-based-access/)

### Next.js Authorization
- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [RBAC in Next.js 15 — Clerk Blog](https://clerk.com/blog/nextjs-role-based-access-control)
- [Middleware RBAC in Next.js 15 — Jigz](https://www.jigz.dev/blogs/how-to-use-middleware-for-role-based-access-control-in-next-js-15-app-router)
