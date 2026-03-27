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
| Reports | Billing | Phase 2 | Basic CSV exports (hours, sessions, auth utilization) — data already exists |

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
| Overview | **Built** | Clinical info, insurance, contacts, care team, auth utilization, recent sessions |
| Care Team | **Built** | Search-to-add modal, primary toggle, role groups |
| Goals | **Built** | Domain-grouped cards, objectives, behavior reduction, add/edit/archive |
| Authorizations | **Built** | Client's auths with utilization bars |
| Sessions | **Built** | Client's session history |
| Documents | **Planned** | Upload/categorize consent forms, assessments, treatment plans, auth letters |
| Edit | **Built** | Client form (inline tab) |

> **Design decision (2026-03-27):** Consolidate from 8 tabs to 7. Merge Contacts and Insurance into the Overview tab as section cards (they're small data sets that don't warrant standalone tabs). Competitors at our tier have 3-5 client sections, not 8 tabs. Add Documents as a dedicated tab (every competitor has document management per client).

**Planned additions:**
- [ ] Note status column on Sessions tab
- [ ] Contacts + Insurance merged into Overview as section cards
- [ ] Documents tab (consent forms, assessments, treatment plans, auth letters)
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

**This is the #1 competitive gap.** Every competitor has scheduling. Without it, practices need a second tool.

**MVP (ship first — matches Raven/Passage/TherapyLake tier):**
- Calendar view (week + day views)
- Create/edit/cancel appointments
- Recurring appointment templates (e.g., Mon/Wed/Fri 3-5pm)
- Auth-aware display (show remaining units when booking)
- Conflict detection (double-booking prevention for same provider)
- Appointment → Session conversion (booked appointment creates a session record)

**Phase 2 enhancements (after MVP is validated):**
- [ ] Month view
- [ ] Drag-and-drop rescheduling
- [ ] Client + provider availability management
- [ ] Credential-aware blocking (prevent scheduling with expired license)
- [ ] Drive time calculation between appointments
- [ ] Automated appointment reminders (SMS/email via Twilio/Resend)
- [ ] Cancellation/no-show reason tracking (already in session schema)
- [ ] Session-to-billing flow (appointments auto-generate claim drafts)

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
| `/reports` | **Not built** | Phase 2 — basic exportable reports |

> AlohaABA has Reports as a core nav item from day one. Even the simplest platforms ship basic reports. These are CSV exports of data we already have — low effort, high value for practices that need payroll hours and auth utilization summaries.

**Phase 2 (basic CSV exports — data already exists):**
- [ ] Hours worked by provider (for payroll — practices need this weekly)
- [ ] Session summary by date range (filterable by client, provider, CPT)
- [ ] Authorization utilization (by client, by payer — already on dashboard, just needs export)
- [ ] Cancellation/no-show report (by client, by provider, with reasons)

**Phase 3 (requires billing + scheduling data):**
- [ ] Staff productivity (scheduled vs completed hours)
- [ ] Accounts receivable aging (30/60/90/120 days)
- [ ] Revenue by payer / by provider
- [ ] Clinical outcomes (goal mastery rates over time)

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
| `/payers` | **Built** | Payer list + add/edit (currently embedded in Settings page) |

> **Design decision (2026-03-27):** Payers currently exists as both a standalone nav item AND a section within Settings. This is redundant. Consider removing Payers from the sidebar and keeping it only in Settings until the Billing nav group exists in Phase 2. This would drop nav from 8 to 7 items (cleaner). When Billing ships, Payers moves to the Billing group as its own nav item.

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
| Calendar/Scheduling | Not started | #1 competitive gap. Research needed. MVP scoped. |
| Claims submission (Stedi) | Not started | Schema stubs exist. Monetization engine. |
| ERA/payment posting | Not started | |
| Eligibility verification | Not started | Schema stub exists. |
| Basic reports (CSV export) | Not started | Moved from Phase 3. Hours, sessions, auth utilization. Data exists. |
| Client document management | Not started | Documents tab on client detail. Schema + Vercel Blob exist. |

### Phase 3: Clinical Intelligence (NOT STARTED)

| Feature | Status | Notes |
|---------|--------|-------|
| AI session note generation | Not started | Research done. Placeholder in note form. |
| Progress graphing | Not started | Data exists in session_note_goals. Low effort. |
| Treatment plan generation | Not started | |
| Supervision tracking | Not started | BACB 5% requirement. |
| Intake pipeline | Not started | Client status field exists but no structured workflow |

### Out of Scope

| Feature | Why |
|---------|-----|
| Payroll | CSV hours export is sufficient for small practices. They use QuickBooks/Gusto/ADP. Only 2/7 competitors (Aloha, TherapyPM) build this in. |
| Telehealth | Commodity feature. Practices already use Zoom/Doxy.me. Integrate (launch link from calendar), don't build a video platform. |
| Real-time data collection | This is Motivity/Catalyst's core feature — 130+ data collection features, offline mobile apps, tap-to-record. We're PM-first. Our session notes capture data after-the-fact. Real-time collection is Phase 4+ if ever. |
| LMS / Training content | Enterprise feature (CentralReach). Small practices use Relias or BACB courses. No competitor at our tier builds this. |
| Parent/caregiver portal | Phase 4+. Becomes valuable when billing is live (invoice payment). Not a switching factor for practices evaluating PM tools. |
| E-prescribing | BCBAs cannot prescribe medication. Not applicable to ABA therapy. |

---

## Design Decisions Log

Decisions made during platform architecture review (2026-03-27).

| # | Decision | Status | Rationale |
|---|----------|--------|-----------|
| D1 | Consolidate client tabs from 8 → 7 (merge Contacts + Insurance into Overview) | **Decided** | Competitors have 3-5 sections. Contacts and Insurance are small data sets. |
| D2 | Add Documents as a dedicated client tab | **Decided** | Every competitor has per-client document management. We have the schema. |
| D3 | Tier scheduling features (MVP vs enhancements) | **Decided** | MVP = calendar + appointments + recurring + auth-aware + conflicts. Drive time, credential blocking, reminders = Phase 2+. |
| D4 | Move Reports from Phase 3 to Phase 2 | **Decided** | Basic CSV exports (hours, sessions, auth utilization) use existing data. AlohaABA ships reports from day one. |
| D5 | Keep Payers and Authorizations as standalone nav items | **Decided** | PM-first positioning. Auth tracking is our #1 differentiator — keeping it top-level reinforces this. Payers is a daily-use item (calling payers, checking portal URLs, verifying timely filing). Both reinforce our practice management focus. |
| D6 | Design the RBT experience | **Open** | See below. |

---

## Role-Based Experiences

The nav and pages look different per role. This needs design work before we ship to real practices.

### RBT Experience (needs design)

RBTs are the highest-volume users — they log 20-30 hours of sessions per week and write notes for each one. Their experience must be fast and focused.

**What an RBT needs:**
- See their caseload (assigned clients only, not all clients)
- See today's schedule (when scheduling exists)
- Log sessions quickly (pre-filled provider, CPT, client from schedule)
- Write session notes with goal data
- Sign notes

**What an RBT does NOT need:**
- All clients in the practice (only their assigned caseload)
- Authorization management (BCBA/admin responsibility)
- Billing, claims, payers, reports
- Provider management, team management, settings

**Current state:** RBTs see Overview, Clients (all), Sessions (all), which is too much. The Overview dashboard should be caseload-focused for RBTs (my clients, my sessions today, my unsigned notes). The Clients list should filter to their caseload by default.

**Competitor reference:** AlohaABA's "My Dashboard" concept — personal data scoped to the logged-in user, not org-wide.

### BCBA Experience

BCBAs are the clinical leads. They need everything RBTs see plus:
- All clients (not just their caseload — they supervise across RBTs)
- Authorization tracking (managing auth renewals)
- Goal management (writing treatment plans)
- Session note review (reviewing RBT notes — even though co-sign is removed, BCBAs still review notes for quality)
- Provider oversight (seeing supervisee caseloads)

### Admin/Owner Experience

Full platform access. Billing, reports, team management, settings.

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
