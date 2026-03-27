# RBAC Frontier Patterns & Risk Analysis for ABA Practice Management

> **Context**: Clinivise targets 1–50 staff ABA practices. Current role model: `owner`, `admin`, `bcba`, `bcaba`, `rbt`, `billing_staff` (defined in `src/lib/constants.ts`). Auth via Clerk Organizations with session-embedded roles. This research informs Phase 2+ role/permission design.
>
> **Date**: 2026-03-25

---

## Part 1: Frontier Patterns

### 1.1 AI-Assisted Role Suggestions

**The pattern**: Instead of requiring an admin to manually assign roles at invite time, the system observes user behavior and suggests appropriate roles or flags mismatches.

**How it works in practice**:

- A new staff member is invited with a generic "member" role
- After they log 3 sessions against clients, the system surfaces: _"This user is logging sessions — assign RBT role for proper credential validation?"_
- A user with BCBA role who never logs sessions but frequently accesses billing screens gets flagged: _"This BCBA primarily uses billing features — consider adding Billing Staff permissions"_
- When a user's behavior pattern diverges from their role's typical usage (e.g., an RBT attempting to access auth management screens), the system alerts the admin rather than silently denying

**Why this matters for ABA practices**: Small practices (5-15 staff) often have the practice owner doing initial setup. They may not fully understand the permission implications of each role. AI suggestions reduce the chance of over- or under-provisioning. Sully.ai and athenahealth are pioneering "AI team" approaches where the system actively assists with administrative workflow — role suggestion is a natural extension.

**Clinivise implementation path**:

- Phase 1: Static roles assigned at invite (current model)
- Phase 2: Track feature usage per user (which pages visited, which actions taken)
- Phase 3: Surface role suggestions in Settings > Team page based on usage patterns
- Phase 4: Proactive alerts when behavior diverges from role expectations

**Practical signals to track**:

| Signal                                                   | Suggested Action                    |
| -------------------------------------------------------- | ----------------------------------- |
| User logs sessions but has no clinical role              | Suggest RBT or BCBA                 |
| User accesses billing screens but has clinical role only | Suggest adding billing_staff        |
| User has BCBA role but no sessions logged in 60 days     | Flag for admin review               |
| User manages authorizations but has RBT role             | Suggest BCBA or BCaBA               |
| User invites team members but is not admin/owner         | Flag potential role escalation need |

---

### 1.2 Contextual / Dynamic Permissions

**The pattern**: Access changes based on runtime context — not just "who you are" but "what you're doing, when, where, and with whom."

**Healthcare-specific contexts that should modify access**:

| Context                      | Permission Change                                    | ABA Example                                            |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------ |
| **Client assignment**        | Provider can only see clients they're assigned to    | RBT sees only their caseload, not all practice clients |
| **Supervision relationship** | Supervisor sees supervisee's sessions                | BCBA reviews their RBTs' session notes                 |
| **Time-of-day**              | Session logging locked outside business hours        | Prevent backdated sessions (fraud risk)                |
| **Credential status**        | Active credential required for clinical actions      | Lapsed RBT certification blocks session logging        |
| **Authorization status**     | No logging against expired authorizations            | System prevents sessions after auth end date           |
| **Device/location**          | Tablet-optimized session logging vs. desktop billing | Not access restriction, but UX context adaptation      |

**Emerging approach — "Break-the-glass"**: In healthcare, strict access control must coexist with clinical urgency. The pattern: normally an RBT can't see another provider's client, but in an emergency (cover session, client crisis), they can request elevated access with mandatory audit logging. The access is granted immediately but every action is flagged for supervisor review.

**Clinivise implementation path**:

- Phase 1: Role-based only (current model — role checked server-side via `authActionClient`)
- Phase 2: Add client-provider assignment filtering (RBT sees only their clients)
- Phase 3: Credential-aware gating (lapsed cert = read-only mode for clinical features)
- Phase 4: Break-the-glass for emergency coverage with audit trail

---

### 1.3 ABAC vs. RBAC vs. ReBAC for Healthcare

Three access control models are relevant to ABA practice management:

#### RBAC (Role-Based Access Control)

- **How it works**: User -> Role -> Permissions. A BCBA gets `sessions:write`, `authorizations:manage`, `clients:read`.
- **Strengths**: Simple to implement, easy to audit, maps cleanly to ABA credential types (BCBA, RBT, BCaBA).
- **Weakness**: Can't express "this BCBA can only see clients assigned to them" — that's a relationship, not a role.
- **Best for**: Coarse-grained baseline permissions (what actions a role CAN do).

#### ABAC (Attribute-Based Access Control)

- **How it works**: Policies evaluate attributes of user, resource, and environment. Example: `user.credential_status == "active" AND resource.auth.end_date > today AND user.organization_id == resource.organization_id`.
- **Strengths**: Extremely flexible. Can express time-based, credential-based, and context-based rules.
- **Weakness**: Complex policy management. Hard to audit ("why was this denied?"). Overkill for a 10-person practice.
- **Best for**: Fine-grained conditional checks (credential status, authorization validity, time constraints).

#### ReBAC (Relationship-Based Access Control)

- **How it works**: Access depends on relationships between entities. "Dr. Smith can see Patient Jones because Dr. Smith is assigned to Patient Jones."
- **Strengths**: Perfect for patient-provider assignment. Natural fit for ABA's supervision hierarchy (BCBA supervises RBT, RBT is assigned to client).
- **Weakness**: Requires a relationship graph. More complex than RBAC. Libraries like Permit.io and Oso support it, but it's additional infrastructure.
- **Best for**: Scoping data access to assigned clients/providers.

#### Recommendation for Clinivise: Hybrid RBAC + ReBAC

| Layer                                                     | Model     | Implementation                                                                       |
| --------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------ |
| **Coarse-grained** (what actions a role can do)           | RBAC      | Clerk custom roles: `owner`, `admin`, `bcba`, `bcaba`, `rbt`, `billing_staff`        |
| **Data scoping** (which clients/sessions a user sees)     | ReBAC     | `client_providers` join table: provider sees only assigned clients + their sessions  |
| **Conditional checks** (credential status, auth validity) | ABAC-lite | Application-level checks in server actions: `if (!provider.credentialActive) deny()` |

This avoids the complexity of a full ABAC policy engine while handling the three dimensions that matter: role capabilities, relationship-scoped data, and credential-conditional access.

---

### 1.4 YC Startups Innovating on Healthcare Team/Permission Management

The YC healthcare ecosystem (2024-2026) shows several relevant patterns:

**Decoda Health** — AI plug-in for practice management systems that automates patient workflows. Relevant because it works across existing PM systems, suggesting that permissions/access need to be interoperable, not siloed.

**Patientdesk** — AI bookings system for healthcare practices. Focuses on provider availability and scheduling optimization, which implies role-aware scheduling (who can see which appointments).

**LunaBill** — AI voice callers for healthcare billing teams. Their focus on billing-specific workflows reinforces that billing staff need a distinct permission set separate from clinical staff — exactly what Clinivise models with the `billing_staff` role.

**Permit.io** (not YC, but relevant infrastructure) — Full-stack authorization platform with healthcare-specific focus. Supports RBAC/ABAC/ReBAC with AI-aware authorization profiles. Their OPAL (Open Policy Administration Layer) provides real-time policy updates. Worth evaluating if Clinivise's permission model outgrows Clerk's built-in RBAC.

**Broader trend**: No YC startup is specifically innovating on "healthcare team permission management" as a standalone product. Instead, the pattern is: permissions are a feature embedded in vertical SaaS, not a product category. This validates Clinivise's approach of building role management into the PM tool rather than adopting an external authorization platform (at least at 1-50 staff scale).

---

## Part 2: Risk Analysis

### Risk 1: Role Escalation — User Gets More Access Than Intended

**Scenario**: Practice admin invites a new RBT and accidentally assigns the `admin` role (mis-click, misunderstanding of role labels). The RBT now has access to billing data, team management, and can modify other users' roles. Or: an RBT discovers they can access API endpoints that aren't properly gated by role.

**Impact**:

- **HIPAA**: RBT accesses billing/insurance data they shouldn't see (PHI exposure beyond minimum necessary)
- **Financial**: Unauthorized user modifies billing rates or authorization data
- **Operational**: Accidental deletion of clients, sessions, or authorizations
- **Compliance**: Payer audit reveals clinical actions taken by users without appropriate credentials

**Mitigation**:

1. **Server-side enforcement only**: Never rely on UI hiding alone. Every server action and query must check `user.role` via `authActionClient`. Clinivise already does this — maintain the pattern.
2. **Role confirmation on invite**: Show a clear description of what each role can do when assigning. "Admin: Can manage team members, view billing data, modify all client records."
3. **Dangerous role escalation warning**: If anyone assigns `owner` or `admin`, require a confirmation step: "This will give [Name] full access to manage your practice, including team and billing. Continue?"
4. **Audit trail**: Log all role changes with who, when, old role, new role. Surface in admin audit log.
5. **API route protection**: Middleware that checks role on every API route, not just server actions. Use Clerk's `auth()` with org membership verification.

**Severity**: HIGH — this is the most common RBAC failure mode. The OIG has repeatedly cited healthcare organizations for failure to enforce least-privilege access.

---

### Risk 2: Multi-Role Users — BCBA Who Also Does Billing

**Scenario**: In a small practice (5-10 staff), the lead BCBA also handles billing and insurance verification. They need clinical permissions (session logging, authorization management, client management) AND billing permissions (claims review, payment posting, insurance verification). Assigning two separate roles creates complexity. Assigning them an `admin` role over-provisions.

**Impact**:

- **Over-provisioning**: If you default to giving multi-role users `admin`, they get team management and settings access they don't need
- **Separation of duties violation**: The same person creating sessions AND approving billing creates a fraud risk (in larger practices, this is an audit finding)
- **Role confusion**: User sees UI elements from both contexts, increasing cognitive load

**Mitigation**:

1. **Additive permissions model**: Allow users to have a primary role (e.g., `bcba`) with additional permission grants (e.g., `+billing:read`, `+billing:write`). Clerk supports custom permissions on roles — use this rather than assigning multiple roles.
2. **Composite roles**: Define a `bcba_billing` composite role for the common scenario. This is more practical for small practices than a full permission matrix.
3. **For Clinivise Phase 1**: Since the team is small, the `admin` role effectively covers this. The separation of duties concern is minimal at 5-10 staff. Document it as a known simplification.
4. **Phase 2+**: Implement Clerk custom permissions: `billing:manage`, `claims:submit`, `sessions:log`, `authorizations:manage`, `team:manage`. Roles become bundles of permissions, and custom bundles handle multi-role users.
5. **Toxic combination detection**: In Phase 3+, flag when a single user has both `sessions:create` and `claims:approve` — this is a separation-of-duties concern for payer audits.

**Severity**: MEDIUM — ubiquitous in small practices, low risk at small scale, but becomes an audit concern as the practice grows past 20 staff.

---

### Risk 3: Credential Expiry — RBT Certification Lapses, Should Access Change?

**Scenario**: An RBT's BACB certification expires (they forgot to complete their 12 Professional Development Units or missed the renewal deadline). Per BACB rules, they cannot provide services, bill for services, or represent themselves as an RBT until certification is reactivated. If the RBT has a 60-day supervision gap, BACB may suspend certification entirely.

**Impact**:

- **Billing fraud**: Sessions logged under a lapsed credential will be denied by payers. If claims are submitted anyway, it's potential False Claims Act liability.
- **Client safety**: BACB requires active certification + active supervision for consumer protection
- **Practice liability**: The practice is responsible for verifying credentials before scheduling staff
- **Revenue loss**: Retroactive denial of all sessions logged during the lapse period — potentially weeks of revenue

**Mitigation**:

1. **Credential tracking in the system**: Store credential expiration dates in the providers table (Clinivise already has this in the schema via `credentials` fields on the providers table). Surface expiration warnings at 90/60/30/14/7 days.
2. **Soft-lock on credential expiry**: When a provider's credential expires, automatically:
   - Block new session logging for that provider (server-side, not just UI)
   - Show a banner on their profile: "Credential expired — session logging disabled"
   - Notify the admin/owner
   - Do NOT delete historical sessions or revoke read access — they still need to see past work
3. **Supervision tracking**: Track RBT-BCBA supervision relationships. If an RBT's supervising BCBA leaves or their supervision hours drop below 5% threshold, flag it.
4. **Do NOT revoke system access entirely**: A lapsed credential means the user can't provide clinical services. They should still be able to:
   - Log in and view their schedule/history
   - Complete administrative tasks
   - Upload renewal documentation
   - View (not create) session records
5. **Automatic credential status sync**: In Phase 3+, consider BACB API integration (if available) or manual admin verification workflow with audit trail.

**Severity**: HIGH — BACB is explicit that lapsed RBTs "cannot provide or bill for services." This is a hard regulatory requirement, not a suggestion. CentralReach handles this with automated compliance enforcement and credential expiration alerts.

---

### Risk 4: Staff Departure — BCBA Leaves, Clients Need Reassignment

**Scenario**: A BCBA with 15 active clients gives two weeks' notice. Their clients need to be reassigned to other BCBAs, their active authorizations need to be reviewed, pending sessions need to be cancelled or reassigned, and their system access needs to be revoked on their last day. The BACB requires that RBTs supervised by the departing BCBA must have a new supervisor on record — they cannot provide services without one.

**Impact**:

- **Service disruption**: Clients without an assigned BCBA can't receive supervised ABA services
- **Authorization gaps**: If the departing BCBA was the authorized provider on insurance authorizations, a new auth request may be needed
- **PHI exposure**: If access isn't revoked promptly, the former employee retains access to patient data (Memorial Healthcare System was fined after a former employee accessed 80,000 patient records for nearly a year post-departure)
- **Supervision chain break**: RBTs supervised by the departing BCBA are in violation of BACB requirements until a new supervisor is assigned
- **Billing impact**: Sessions logged after the BCBA's departure but before reassignment may be denied

**Mitigation**:

1. **Departure checklist workflow**: When an admin marks a user as departing, the system generates a task list:
   - [ ] Reassign all active clients to another provider
   - [ ] Review active authorizations (do any name the departing provider specifically?)
   - [ ] Reassign RBT supervision relationships
   - [ ] Cancel/reassign scheduled sessions
   - [ ] Set departure date (access auto-revoked on that date)
   - [ ] Export any required records
2. **Immediate access revocation**: On the departure date, automatically:
   - Set `isActive = false` in the users table
   - Clerk: remove from organization (this revokes all access)
   - Log the deactivation with timestamp and who initiated it
   - Do NOT delete the user record — keep for audit trail and historical session attribution
3. **Client reassignment UI**: Bulk reassignment tool: select departing provider, see all their assigned clients, reassign to available BCBAs. System validates that receiving BCBA has capacity (based on caseload and authorization limits).
4. **Pre-departure audit**: In the two weeks before departure, flag any unusual access patterns (bulk data export, accessing records outside their caseload).
5. **HIPAA requirement**: Terminated employee access must be disabled within hours of termination, not days. Automate this via Clerk webhook on org membership removal.

**Severity**: HIGH — combines HIPAA compliance (access revocation), BACB compliance (supervision continuity), and operational continuity (client care). This is the most operationally complex risk.

---

### Risk 5: Supervisor Chain — RBT's Supervisor Changes

**Scenario**: An RBT is supervised by BCBA-A. BCBA-A goes on maternity leave, and BCBA-B takes over supervision. Does BCBA-B automatically see the RBT's session history? Can BCBA-B approve sessions that BCBA-A started supervising? What about the 5% supervision hour tracking — does it reset?

**Impact**:

- **Data access ambiguity**: New supervisor may not have access to historical sessions they didn't supervise
- **Supervision compliance gap**: During the transition, the RBT may have a period without an assigned supervisor (BACB: 60 consecutive days without supervision = certification suspension risk)
- **Session approval continuity**: Sessions logged under the old supervisor's oversight need to be reviewable by the new supervisor
- **Billing**: The supervising BCBA's NPI may be on submitted claims. Supervisor change may require claim resubmission for some payers.

**Mitigation**:

1. **Explicit supervision relationship table**: Track supervisor-supervisee relationships with date ranges (`supervisor_assignments` table with `start_date`, `end_date`, `bcba_id`, `rbt_id`).
2. **Supervisor sees all assigned RBT data**: When BCBA-B becomes the supervisor, they inherit read access to the RBT's full session history (not just sessions from their supervision period). Supervision is about clinical oversight — the new supervisor needs context.
3. **Transition workflow**: Admin changes supervision assignment. System:
   - Sets `end_date` on the old assignment
   - Creates new assignment with `start_date`
   - Notifies both BCBAs and the RBT
   - Logs the change in audit trail
4. **Supervision gap detection**: If an RBT has no active supervisor assignment for > 7 days, alert the admin. At 30 days, escalate to critical. At 60 days, soft-lock the RBT's session logging (BACB suspension risk).
5. **For Clinivise Phase 1**: Supervision is tracked as a simple field on the provider record (`supervisorId`). This is sufficient for small practices. Phase 2 can add the `supervisor_assignments` table with date ranges for proper history.

**Severity**: MEDIUM — important for BACB compliance, but in small practices the owner/admin is usually aware of supervision changes. The risk increases as the practice grows.

---

### Risk 6: Audit Trail — What Access Events Need Logging

**Scenario**: A payer audit requests proof that only credentialed staff accessed client records and that billing actions were performed by authorized personnel. HIPAA requires audit controls (45 CFR § 164.312(b)): "Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information."

**Impact**:

- **HIPAA non-compliance**: Failure to maintain audit logs is a Security Rule violation (Memorial Healthcare System: $5.5M settlement partly due to inadequate audit logging)
- **Payer audit failure**: Unable to prove that sessions were logged by credentialed providers, that billing was performed by authorized staff, or that access was appropriately scoped
- **Fraud investigation difficulty**: Without audit trails, you can't determine if data was accessed inappropriately

**What MUST be logged for HIPAA/payer compliance**:

| Event Category            | Specific Events                                  | Data to Capture                                |
| ------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Authentication**        | Login, logout, failed login, session timeout     | User ID, timestamp, IP, device                 |
| **Role changes**          | Role assigned, role changed, role revoked        | Who changed, old role, new role, timestamp     |
| **Client data access**    | Client record viewed, session record viewed      | User ID, client ID, timestamp, access type     |
| **Clinical actions**      | Session created, session edited, session deleted | User ID, session ID, old/new values, timestamp |
| **Authorization actions** | Auth created, auth modified, utilization updated | User ID, auth ID, old/new values, timestamp    |
| **Billing actions**       | Claim created, claim submitted, payment posted   | User ID, claim ID, amounts, timestamp          |
| **Admin actions**         | User invited, user deactivated, settings changed | Admin user ID, target user ID, change details  |
| **Export/download**       | Data exported, report generated, PDF downloaded  | User ID, data scope, format, timestamp         |

**Mitigation**:

1. **Clinivise already has audit logging**: The `audit_logs` table exists in the schema. Ensure every server action writes to it.
2. **Immutable audit log**: Audit records must never be updated or deleted. Use a separate connection/role if needed. Consider append-only table design.
3. **Retention**: HIPAA requires 6 years minimum for policies/procedures documentation. Payer audit lookback is typically 3-7 years. Design for 7-year retention.
4. **Periodic review**: Surface audit log in admin settings. Monthly review of unusual patterns (access outside business hours, bulk record access, role changes).
5. **PHI in audit logs**: Be careful — the audit log itself contains PHI (which user accessed which client). Apply the same access controls to audit logs as to client data. Only `owner` and `admin` should see audit logs.

**Severity**: HIGH — non-negotiable for HIPAA compliance. Audit logging is already in Phase 1 scope for Clinivise.

---

### Risk 7: Organization Switching — User in Multiple Clerk Orgs

**Scenario**: A BCBA works part-time at two practices, both using Clinivise. They have a single Clerk account with membership in two organizations. They're viewing Client A in Practice 1, then switch to Practice 2 without refreshing. The session state still holds Practice 1's org context. They accidentally log a session against the wrong practice.

**Impact**:

- **Data cross-contamination**: Client data from Org A visible in Org B context (most severe HIPAA violation possible in multi-tenant software)
- **Billing errors**: Session logged under wrong practice's NPI/tax ID
- **Authorization mismatch**: Session attributed to wrong practice's authorization

**Mitigation**:

1. **Clerk handles this well**: Clerk automatically tracks the active organization in the session and updates it when users switch. The `authActionClient` in Clinivise already derives `organizationId` from the Clerk session — never from client input.
2. **Server-side enforcement is the real protection**: Every query filters by `organization_id`. Even if the client somehow sends wrong org context, the server derives it from the authenticated session. Clinivise's architecture already enforces this.
3. **UI indicator**: Always show the active organization name in the sidebar header. Make it visually prominent so the user knows which practice they're in.
4. **Full page reload on org switch**: When a user switches organizations via `<OrganizationSwitcher />`, force a full navigation to the dashboard (not just a state update). This clears any stale data from the previous org context.
5. **Cross-org query prevention**: Never allow a query that joins data across organizations. The `organization_id` filter should be applied at the query builder level (Clinivise uses scoped queries), not per-query.
6. **Test this explicitly**: Multi-org scenarios must be part of E2E tests. Create test users with dual org membership and verify data isolation.

**Severity**: CRITICAL if not handled, but LOW with Clerk's architecture + server-side org filtering. Clinivise's current architecture already mitigates this well. The main risk is a developer accidentally writing a query that doesn't filter by org — enforce this via code review and testing.

---

### Risk 8: Permission Drift — Ad-Hoc Overrides Accumulate

**Scenario**: Over 18 months of operation:

- Three RBTs were temporarily given billing access to help with end-of-month processing. The access was never revoked.
- A BCaBA was promoted to BCBA but their old `bcaba` role was never updated (they just got `admin` added instead).
- The practice owner created a "temp_admin" user for their IT consultant and forgot about it.
- Two former employees were deactivated in the app but never removed from the Clerk organization.

Healthcare organizations typically achieve 40-60% reduction in permission sprawl after their first audit — meaning pre-audit, roughly half of all permissions are unnecessary.

**Impact**:

- **HIPAA minimum necessary violation**: Users have access to PHI beyond what's needed for their job function
- **Audit failure**: Payer or HIPAA audit reveals excessive permissions, indicating poor access governance
- **Insider threat surface**: Over-provisioned accounts are higher-value targets for social engineering or credential theft

**Mitigation**:

1. **Quarterly access review**: Surface a "Team Access Review" prompt in the admin dashboard every 90 days. Show each user, their role, their last login date, and their activity level. One-click to deactivate dormant users.
2. **Dormant user detection**: If a user hasn't logged in for 90 days, flag them for review. If 180 days, auto-deactivate with admin notification.
3. **Role change log**: Show the history of role changes for each user on their profile. "BCBA -> Admin (changed by Owner on 2025-06-15) — Review needed?"
4. **Temporary elevation with expiry**: When granting temporary access (e.g., billing access for month-end), set an expiration date. System automatically revokes after the period.
5. **Clerk org sync**: Periodically verify that users in the Clinivise database match actual Clerk org membership. Flag mismatches.
6. **Annual permission audit report**: Generate a downloadable report showing all users, roles, last activity, and any permission anomalies. This satisfies HIPAA documentation requirements.

**Severity**: MEDIUM at small scale (owner knows everyone), HIGH as practice grows past 20 staff. This is the #1 cited finding in healthcare IT security audits — "failure to regularly review and modify user access rights."

---

## Part 3: Edge Cases

### Edge Case 1: Practice Owner Who Is Also the Sole BCBA

**Scenario**: A solo BCBA starts their practice. They are the owner (business management), the only BCBA (clinical work), and handle their own billing. They need all permissions.

**What could go wrong**:

- The `owner` role should implicitly include all permissions — no need to also assign `bcba` and `billing_staff`
- If the owner hires their first RBT, the system needs to handle supervision (owner is the supervisor)
- If the owner's BCBA credential expires, should they lose access to their own practice? No — they lose clinical logging ability, but retain owner/admin access
- Separation of duties is meaningless with one person — the system should not enforce it at this scale

**Recommendation**:

- `owner` role = superset of all permissions. Always.
- Credential expiry for an owner blocks clinical actions only, not administrative access
- When the practice hires its first employee, prompt the owner: "Assign yourself as supervisor for [new RBT]?"
- Track the owner's BCBA credential separately from their system role — they are conceptually different

---

### Edge Case 2: BCaBA Working Under Remote Supervision

**Scenario**: A BCaBA provides ABA services but requires ongoing supervision by a BCBA. The supervising BCBA works remotely and is not a direct employee of the practice — they are a contracted supervisor. Per BACB, no more than 50% of supervision hours can be via video/group format, and the supervisor must observe the BCaBA with a client at least once per monthly supervisory period.

**What could go wrong**:

- The external supervisor needs read access to the BCaBA's session notes and client records, but should NOT have access to billing data, other providers' clients, or practice-level settings
- If the external supervisor's own BCBA credential lapses, the BCaBA's supervision is invalid
- The external supervisor may supervise BCaBAs across multiple practices (each using Clinivise)

**Recommendation**:

- Create a `supervisor_external` role or permission scope: read-only access to assigned supervisee's sessions and clients, no access to billing/admin/other providers
- Track the external supervisor's credential status — alert the practice if it lapses
- This is a Phase 3+ concern. For Phase 1, external supervisors don't need system access — supervision can be tracked via session notes and manual documentation
- If implementing: use Clerk's org invitation with a custom `external_supervisor` role that has minimal permissions

---

### Edge Case 3: Billing Staff Who Also Manages Insurance Verification

**Scenario**: In a small practice, the billing coordinator also handles insurance eligibility verification, which requires accessing client insurance details, contacting payers, and updating authorization information. This crosses the boundary between "billing" (claims, payments) and "clinical admin" (authorizations, insurance records).

**What could go wrong**:

- If `billing_staff` role only grants billing access, the user can't verify insurance or manage authorizations
- If you grant `admin` to compensate, the user gets team management and settings they don't need
- Insurance verification requires accessing client demographics and insurance details — this is PHI that billing-only access might not include

**Recommendation**:

- For Clinivise Phase 1: `billing_staff` should include read access to client insurance information and authorization data. This is the practical reality of small-practice billing.
- Phase 2+: Decompose into granular permissions: `insurance:read`, `insurance:write`, `authorizations:read`, `authorizations:manage`, `claims:manage`, `payments:post`. The `billing_staff` role bundles these. Admin can customize per user.
- The insurance verification + billing combination is so common in small practices that it should be the default `billing_staff` permission set, not an exception

---

### Edge Case 4: RBT Promoted to BCaBA — Role Transition Workflow

**Scenario**: An RBT completes their BCaBA coursework and certification. They are now a BCaBA with expanded scope of practice. Their system role needs to change from `rbt` to `bcaba`. But:

- Their historical sessions were logged as an RBT — this attribution must not change
- They may have been supervised by a BCBA — that supervision relationship changes (BCaBAs still need supervision, but the requirements differ)
- Their billing modifiers change (BCaBA services use different CPT code modifiers than RBT services)
- The practice's payer credentialing for this person needs to be updated

**What could go wrong**:

- If role change is retroactive, historical sessions look like they were performed by a BCaBA (incorrect for audit purposes)
- If the system doesn't re-validate the supervision relationship, the new BCaBA may be incorrectly tracked as still needing RBT-level supervision
- Payer credentialing typically takes 60-90 days. During this window, the BCaBA may have the credential but the practice can't bill under it yet.

**Recommendation**:

1. **Role change is point-in-time**: `role` on the user record changes, but `provider_role` on historical session records does not. Sessions logged as RBT stay attributed as RBT.
2. **Credential update workflow**:
   - Admin changes role from `rbt` to `bcaba`
   - System prompts: "Update credential information for [Name]?"
   - New credential type, expiration date, and certification number entered
   - System prompts: "Update supervision assignment? BCaBAs require BCBA supervision but have different supervision requirements than RBTs."
3. **Billing transition period**: Flag the provider as "credentialing in progress" — they can log sessions under their new credential type, but claims should be held until payer credentialing is confirmed.
4. **Audit trail**: Log the role transition with effective date. "User [X] role changed from RBT to BCaBA on [date] by [admin]. Previous sessions retain RBT attribution."
5. **Privilege creep check**: Ensure the old RBT-specific permissions are removed when the new BCaBA permissions are granted. Don't accumulate.

---

## Part 4: Recommendations for Clinivise Implementation

### Phase 1 (Current) — Keep It Simple

The current model is appropriate for Phase 1:

- 6 static roles: `owner`, `admin`, `bcba`, `bcaba`, `rbt`, `billing_staff`
- Server-side role checks via `authActionClient`
- Organization-scoped data isolation via Clerk
- Audit logging on all mutations

**Do not add**: client-provider assignment filtering, credential-based access gating, or dynamic permissions. These add complexity before there are enough users to justify it.

### Phase 2 — Add Relationship-Based Scoping

When practices grow past 10 staff:

- Add `client_providers` assignment table (already in schema planning)
- RBTs see only assigned clients by default
- BCBAs see their supervisees' clients + their own
- Admin/owner sees everything

### Phase 3 — Credential-Aware Access + Permission Granularity

When billing features launch:

- Credential expiry blocks clinical actions (soft-lock, not revocation)
- Granular Clerk permissions: decompose roles into specific capabilities
- Quarterly access review workflow in admin dashboard
- Temporary permission elevation with expiry dates

### Phase 4 — AI-Assisted Role Management

When usage data is available:

- Role suggestion engine based on feature usage patterns
- Anomaly detection for unusual access patterns
- Automated dormant user deactivation
- Supervision gap detection and alerting

---

## Sources

- [Sully.ai — Top 7 AI Healthcare Platforms 2026](https://www.sully.ai/blog/top-7-ai-healthcare-platforms-in-2025)
- [athenahealth — AI-Native Healthcare Software](https://www.athenahealth.com/solutions/athenaone)
- [Permit.io — Permissions for the AI Era](https://www.permit.io/)
- [Permit.io — Authorization for Healthcare](https://www.permit.io/healthcare)
- [Oso — RBAC vs ABAC](https://www.osohq.com/learn/rbac-vs-abac)
- [Splunk — RBAC vs ABAC Compared](https://www.splunk.com/en_us/blog/learn/rbac-vs-abac.html)
- [Kodjin — RBAC vs ABAC in FHIR Projects](https://kodjin.com/blog/a-service-based-rbac-vs-abac-approach-in-fhir-projects-5/)
- [Permit.io — What is ReBAC?](https://www.permit.io/blog/what-is-rebac)
- [Oso — Relationship-Based Access Control](https://www.osohq.com/academy/relationship-based-access-control-rebac)
- [Auth0 — ReBAC Explained](https://auth0.com/blog/relationship-based-access-control-rebac/)
- [PMC — Health Information System RBAC Trends and Challenges](https://ncbi.nlm.nih.gov/pmc/articles/PMC5836325)
- [Censinet — Common Challenges in RBAC Implementation](https://censinet.com/perspectives/common-challenges-role-based-access-control-implementation)
- [Censinet — HIPAA Access Control Requirements](https://censinet.com/perspectives/hipaa-access-control-requirements-explained)
- [Azzly — Role-Based Access in Behavioral Health EHRs](https://azzly.com/blog/the-power-of-role-based-access-in-behavioral-health-ehrs/)
- [Enter Health — Role-Based Access Control in Healthcare RCM](https://www.enter.health/post/role-based-access-control-healthcare-rcm)
- [BACB — Supervision and Training](https://www.bacb.com/supervision-and-training/)
- [BACB — When Supervising RBTs Doesn't Go as Planned](https://www.bacb.com/when-supervising-rbts-doesnt-go-as-planned/)
- [BACB — RBT Ongoing Supervision Fact Sheet](https://www.bacb.com/rbt-ongoing-supervision-fact-sheet/)
- [Connect n Care ABA — RBT Supervision Requirements](https://www.connectncareaba.com/rbt-supervision-requirements)
- [MedSole RCM — ABA Credentialing Services Guide](https://medsolercm.com/blog/aba-credentialing-services)
- [CentralReach — ABA Practice Management Software](https://centralreach.com/products/aba-practice-management-software/)
- [CentralReach Essentials](https://essentials.centralreach.com/)
- [Passage Health — Top ABA Practice Management Software](https://www.passagehealth.com/blog/aba-practice-management-software)
- [Clerk — Organizations and RBAC](https://clerk.com/docs/organizations/roles-permissions)
- [Clerk — Multi-Tenant Authentication](https://clerk.com/blog/multi-tenant-authentication-what-you-need-to-know)
- [Clerk — Organization Switching](https://clerk.com/docs/components/organization/organization-switcher)
- [SVMIC — When PHI Walks Out the Door with a Departing Employee](https://www.svmic.com/articles/384/when-phi-walks-out-the-door-with-a-departing-employee)
- [Physicians Practice — Covering a Physician's Departure](https://www.physicianspractice.com/view/5-ways-cover-physicians-departure-your-practice)
- [SecurEnds — Financial Impact of Access Violations](https://www.securends.com/blog/financial-impact-access-violations/)
- [SecurEnds — Employee Lifecycle Access Management](https://www.securends.com/blog/employee-lifecycle-access-management/)
- [Secureframe — HIPAA Violation Examples 2025](https://secureframe.com/hub/hipaa/violations)
- [HHS — HIPAA Security Rule Summary](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- [HealthIT.gov — Authentication, Access Control, Authorization (45 CFR 170.315(d)(1))](https://healthit.gov/test-method/authentication-access-control-authorization/)
- [45 CFR 170.315 — ONC Certification Criteria](https://www.law.cornell.edu/cfr/text/45/170.315)
- [Y Combinator — Healthcare IT Startups](https://www.ycombinator.com/companies/industry/Healthcare%20IT)
- [BetterCloud — User Lifecycle Management Best Practices](https://www.bettercloud.com/monitor/top-5-best-practices-for-user-lifecycle-management/)
- [TechPrescient — RBAC Best Practices 2026](https://www.techprescient.com/blogs/role-based-access-control-best-practices/)
