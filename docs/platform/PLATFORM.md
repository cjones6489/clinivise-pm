# Clinivise Platform Architecture

> The master document for what this platform is, what pages it has, and what each page does.
> Individual page design docs live in `pages/` and are created when we're about to build or redesign a page.

---

## Product Positioning

Entry-level all-in-one ABA EHR/PM — same tier as Raven Health, Hipp Health, Passage Health, TherapyPM, TherapyLake. **Not** CentralReach (enterprise). Target: small practices (1-50 staff). Free PM tier, monetized via 2-4% of collected revenue on billing.

**Decision rules:**
1. Simple first — if a simpler approach exists in our competitor tier, use it
2. Follow established patterns — don't invent workflows, follow what Raven/Passage/Aloha do
3. Lightweight clinical features — session notes, goals, basic data visualization. Not Motivity-level data collection.
4. No premature complexity — build the simple version, validate with domain expert, then iterate
5. Validate with domain experts — the founder has BCBA input. Ask before assuming clinical requirements.

---

## Navigation Structure

### Current Sidebar (8 items, 3 groups)

```
CORE (daily use, all roles)
├── Overview          /overview        — Dashboard with metrics + alerts
├── Clients           /clients         — Client list + detail pages
├── Sessions          /sessions        — Session list + detail + notes
└── Authorizations    /authorizations  — Auth list + detail + utilization

MANAGEMENT (setup, admin/bcba/billing)
├── Providers         /providers       — Provider list + detail
└── Payers            /payers          — Insurance payer management

ADMIN (owner/admin only)
├── Team              /team            — Staff invite + role management
└── Settings          /settings        — Practice info + billing identifiers
```

### Planned Additions

| Nav Item | Group | Phase | Notes |
|----------|-------|-------|-------|
| Calendar | Core | Phase 2 | Scheduling — table stakes, every competitor has it |
| Claims | Billing (new group) | Phase 2 | Claim submission + tracking via Stedi |
| Reports | Billing | Phase 3 | Auth utilization, session summaries, staff hours |

### Phase 2 Target Nav (10 items)

```
CORE
├── Overview
├── Clients
├── Calendar          ← NEW
├── Sessions
└── Authorizations

BILLING               ← NEW GROUP
├── Claims            ← NEW
└── Payers            (moved from Management)

MANAGEMENT
├── Providers
└── Team

ADMIN
└── Settings
```

### Role Visibility

| Nav Item | Owner | Admin | BCBA | BCaBA | RBT | Billing |
|----------|-------|-------|------|-------|-----|---------|
| Overview | Yes | Yes | Yes | Yes | Yes | Yes |
| Clients | Yes | Yes | Yes | Yes | Yes | Yes |
| Calendar | Yes | Yes | Yes | Yes | Yes | Yes |
| Sessions | Yes | Yes | Yes | Yes | Yes | Yes |
| Authorizations | Yes | Yes | Yes | Yes | — | Yes |
| Claims | Yes | Yes | — | — | — | Yes |
| Payers | Yes | Yes | — | — | — | Yes |
| Providers | Yes | Yes | — | — | — | — |
| Team | Yes | Yes | — | — | — | — |
| Settings | Yes | Yes | — | — | — | — |

---

## Page Inventory

### Overview (Dashboard)

| Route | Status | Description |
|-------|--------|-------------|
| `/overview` | **Built** | Dashboard with metric cards, auth alerts, client overview |

**Current features:**
- Metric cards: hours this week, sessions this month, flagged sessions, active clients
- Authorization alerts: expiring, over-utilized, under-utilized
- Client overview table with utilization bars
- Role-based content (BCBA sees caseload, admin sees practice-wide)

**Planned:**
- [ ] Unsigned/missing notes alert count
- [ ] Revenue metrics (Phase 2, requires billing)
- [ ] Cancellation rate trend
- [ ] Staff utilization (Phase 2, requires scheduling)

**Page design doc:** [pages/overview.md](pages/overview.md) *(create when redesigning)*

---

### Clients

| Route | Status | Description |
|-------|--------|-------------|
| `/clients` | **Built** | Client list with search, filters, utilization columns |
| `/clients/new` | **Built** | Create client form |
| `/clients/[id]` | **Built** | Client detail with tabbed layout |

**Client detail tabs:**

| Tab | Status | Description |
|-----|--------|-------------|
| Overview | **Built** | Clinical info, insurance, care team, auth utilization, recent sessions |
| Care Team | **Built** | Search-to-add modal, primary toggle, role groups |
| Goals | **Built** | Domain-grouped cards, objectives, behavior reduction, add/edit/archive |
| Contacts | **Built** | Emergency, guardian, billing responsible, PHI permissions |
| Insurance | **Built** | Multi-policy, priority, subscriber info, card images |
| Authorizations | **Built** | Client's auths with utilization bars |
| Sessions | **Built** | Client's session history |
| Edit | **Built** | Client form (inline tab) |

**Planned additions:**
- [ ] Note status column on Sessions tab (see notes from session list)
- [ ] Documents tab (upload/categorize consent forms, assessments, treatment plans)
- [ ] Treatment Plan tab (Phase 3 — BIP, ITP document management)

**Page design doc:** [pages/clients.md](pages/clients.md) *(create when redesigning)*

---

### Sessions

| Route | Status | Description |
|-------|--------|-------------|
| `/sessions` | **Built** | Session list with filters (status, date range, client, provider) |
| `/sessions/new` | **Built** | Log session form (CPT, times, units, auth matching, modifiers) |
| `/sessions/[id]` | **Built** | Session detail with cards (session info, provider, auth utilization) |
| `/sessions/[id]/edit` | **Built** | Edit session form |
| `/sessions/[id]/note/new` | **Built** | Create session note (CPT-specific template) |
| `/sessions/[id]/note` | **Built** | View/edit existing session note |

**Session note form features:**
- CPT-specific templates (97153 direct, 97155 modification, 97156 caregiver, 97151 assessment)
- Dynamic goal cards with measurement-type-specific fields
- Behavior incident cards with ABC tracking
- Sign workflow (draft → signed)
- Auto-populated session context (client, date, CPT, provider)

**Planned additions:**
- [ ] Note status column on session list page
- [ ] "Missing notes" filter tab on session list
- [ ] Cancellation analytics (reason breakdown)
- [ ] AI narrative generation (Phase 3 — "Generate with AI" button on note form)

**Page design doc:** [pages/sessions.md](pages/sessions.md) *(create when redesigning)*

---

### Authorizations

| Route | Status | Description |
|-------|--------|-------------|
| `/authorizations` | **Built** | Auth list with status filters, expiry badges, utilization bars |
| `/authorizations/new` | **Built** | Create auth with service lines, insurance auto-linking |
| `/authorizations/[id]` | **Built** | Auth detail (overview, service lines, sessions, documents tabs) |
| `/authorizations/[id]/edit` | **Built** | Edit auth form |

**Authorization detail tabs:**

| Tab | Status | Description |
|-----|--------|-------------|
| Overview | **Built** | Auth details, type, status, dates, requesting provider, denial info |
| Service Lines | **Built** | Per-CPT utilization bars with frequency/max units |
| Sessions | **Built** | Sessions linked to this auth |
| Documents | **Planned** | Auth letter PDFs, supporting docs |
| Edit | **Built** | Auth form (inline tab) |

**Planned additions:**
- [ ] AI auth letter parsing (upload PDF → extract auth details) — schema exists, UI not wired
- [ ] Re-auth workflow checklist (upcoming expirations → guided re-auth)

**Page design doc:** [pages/authorizations.md](pages/authorizations.md) *(create when redesigning)*

---

### Calendar / Scheduling

| Route | Status | Description |
|-------|--------|-------------|
| `/calendar` | **Not built** | Scheduling — table stakes gap |

**Required features (from competitive research):**
- Day/week/month views with drag-and-drop
- Recurring appointment templates
- Client + provider availability management
- Authorization-aware scheduling (block over-scheduling)
- Credential-aware scheduling (block expired credentials)
- Conflict detection (double-booking prevention)
- Drive time between appointments
- Cancellation/no-show tracking with reason codes
- Session-to-billing flow (appointments convert to sessions)

**This is the #1 competitive gap.** Every competitor has scheduling. Without it, practices need a second tool.

**Page design doc:** [pages/calendar.md](pages/calendar.md) *(REQUIRED before building — full research + wireframe)*

---

### Claims / Billing

| Route | Status | Description |
|-------|--------|-------------|
| `/claims` | **Not built** | Phase 2 — billing submission + tracking |

**Required features (from competitive research):**
- Session-to-claim conversion (one click from completed session)
- Claims scrubbing (missing modifiers, credential mismatches, auth expiry)
- Clearinghouse submission via Stedi (837P electronic claims)
- Claim status tracking
- ERA/835 processing with payment posting
- Denial dashboard with reason codes
- Aging reports (30/60/90/120 day buckets)

**Schema stubs exist:** `claims`, `claim_lines`, `claim_responses` tables are defined.

**Page design doc:** [pages/claims.md](pages/claims.md) *(REQUIRED before building — full research + wireframe)*

---

### Reports

| Route | Status | Description |
|-------|--------|-------------|
| `/reports` | **Not built** | Phase 3 — exportable reports |

**Required reports (from competitive research):**
- Authorization utilization (by client, provider, payer)
- Session/billing summary (billable hours by date range, provider, client)
- Cancellation/no-show report
- Staff productivity (scheduled vs completed)
- Accounts receivable aging (Phase 2, requires billing)
- Payroll hours export (CSV for QuickBooks/Gusto)

**Page design doc:** [pages/reports.md](pages/reports.md) *(create when building)*

---

### Providers

| Route | Status | Description |
|-------|--------|-------------|
| `/providers` | **Built** | Provider list with credential info |
| `/providers/new` | **Built** | Create provider form |
| `/providers/[id]` | **Built** | Provider detail with tabbed layout |
| `/providers/[id]/edit` | **Built** | Edit provider form |

**Provider detail tabs:**

| Tab | Status | Description |
|-----|--------|-------------|
| Overview | **Built** | Credentials, state license, taxonomy, NPI, supervisor, contact |
| Performance | **Built** | Session breakdown, completion/cancel/no-show rates, CPT distribution |
| Caseload | **Built** | Assigned clients with session stats, manage caseload modal |
| Recent Sessions | **Built** | Last 10 sessions |
| Supervision | **Built** | Supervisees list (for BCBAs) or supervisor info |
| Edit | **Built** | Provider form (inline tab) |

**Planned additions:**
- [ ] Credential expiry alerts on dashboard
- [ ] Credential-based scheduling blocks (Phase 2)
- [ ] CAQH tracking (Phase 3)

**Page design doc:** [pages/providers.md](pages/providers.md) *(create when redesigning)*

---

### Payers

| Route | Status | Description |
|-------|--------|-------------|
| `/payers` | **Built** | Payer list + add/edit in settings page |

**Current features:**
- Payer CRUD with name, type, phone, auth phone, auth email, portal URL
- Electronic payer ID, Stedi payer ID
- Timely filing days, unit calc method (CMS vs AMA)
- Claims address

**Planned additions:**
- [ ] Fee schedule management (Phase 2 — contracted rates per CPT per payer)
- [ ] Payer-specific billing rules (concurrent billing, modifier requirements)

**Page design doc:** [pages/payers.md](pages/payers.md) *(create when redesigning)*

---

### Team

| Route | Status | Description |
|-------|--------|-------------|
| `/team` | **Built** | Staff list + invite via Clerk |

**Current features:**
- Invite members via email (sends Clerk invite)
- Role assignment (owner, admin, bcba, bcaba, rbt, billing_staff)
- Deactivate members (revokes Clerk access)
- Webhook sync (Clerk → DB for org/user events)

**Page design doc:** [pages/team.md](pages/team.md) *(create when redesigning)*

---

### Settings

| Route | Status | Description |
|-------|--------|-------------|
| `/settings` | **Built** | Practice info + billing identifiers + billing entity + payer management |

**Current features:**
- Practice information (name, timezone, phone, email, address)
- Billing identifiers (NPI, Tax ID, taxonomy code)
- Billing entity (separate billing name/NPI/address for CMS-1500 Box 33)
- Payer management (list + add/edit forms)

**Planned additions:**
- [ ] Goal domain customization (add/rename/reorder domains)
- [ ] Session note template customization (per-org field requirements)
- [ ] Notification preferences

**Page design doc:** [pages/settings.md](pages/settings.md) *(create when redesigning)*

---

## Feature Matrix — Build Status

### Phase 1: Practice Management (COMPLETE)

| Feature | Status | Notes |
|---------|--------|-------|
| Multi-tenant auth (Clerk) | Done | Orgs, RBAC, webhooks, contract-first flow |
| Client CRUD | Done | Demographics, contacts, insurance, care team |
| Provider CRUD | Done | Credentials, state license, NPI, supervisor chain |
| Authorization tracking | Done | Per-CPT service lines, utilization alerts, AI parsing schema |
| Session logging | Done | CMS 8-minute rule, modifiers, overlap detection, auth matching |
| Dashboard | Done | Metrics, alerts, client overview |
| Audit logging | Done | All mutations logged |

### Phase 1B: Clinical Foundation (COMPLETE)

| Feature | Status | Notes |
|---------|--------|-------|
| Client goals registry | Done | Domains, goals, objectives, targets. Behavior reduction fields. |
| Session notes | Done | CPT-specific forms, goal data, behavior incidents, sign workflow |
| Goal lifecycle | Done | baseline → active → mastered → maintenance → generalization → met |
| Schema audit | Done | 28 fields added across 6 tables, verified against CMS-1500/CASP/TRICARE |

### Phase 2: Scheduling + Billing (NOT STARTED)

| Feature | Status | Notes |
|---------|--------|-------|
| Calendar/Scheduling | Not started | #1 competitive gap. Research needed. |
| Claims submission (Stedi) | Not started | Schema stubs exist. Monetization engine. |
| ERA/payment posting | Not started | |
| Eligibility verification | Not started | Schema stub exists. |
| Basic reports (CSV export) | Not started | Auth utilization, session summaries, staff hours |

### Phase 3: Clinical Intelligence (NOT STARTED)

| Feature | Status | Notes |
|---------|--------|-------|
| AI session note generation | Not started | Research done. Placeholder in note form. |
| Progress graphing | Not started | Data exists in session_note_goals. Low effort. |
| Treatment plan generation | Not started | |
| Supervision tracking | Not started | BACB 5% requirement. |
| Intake pipeline | Not started | Client status field exists but no structured workflow |

### Out of Scope

- Payroll (CSV export sufficient)
- Telehealth (integrate Zoom/Doxy.me, don't build)
- Real-time data collection (Motivity-level, Phase 4+)
- LMS / Training content
- Parent/caregiver portal (Phase 4+)
- E-prescribing (BCBAs can't prescribe)

---

## How to Use This Document

1. **Before building a new page:** Check if it's listed here. Read the status and planned additions.
2. **Before building a new feature:** Check if it's in the feature matrix. If it's in a later phase, don't build it.
3. **When starting a page redesign:** Create a page design doc in `pages/` using the template below.
4. **After building:** Update the status in this doc.

### Page Design Doc Template

```markdown
# [Page Name]

## Purpose
One sentence: who uses this page and why.

## User Stories
- Story 1: "As a [role], I [action] so that [outcome]."
- Story 2: ...

## Wireframe
(ASCII layout or detailed description)

## Feature Checklist
- [x] Feature that exists
- [ ] Feature to build
- [ ] Feature deferred to Phase X

## Data Requirements
- Tables: ...
- Queries: ...
- Actions: ...

## Implementation Status
What exists in code today vs. what's missing.
```
