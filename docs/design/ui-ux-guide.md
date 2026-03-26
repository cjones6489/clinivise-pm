# Clinivise UI/UX Design Guide

> **Purpose**: Comprehensive guide for designing every page in Clinivise. Based on competitive research across 11+ ABA/PM/EHR platforms. Use this as the reference when designing in v0.dev or implementing pages.
>
> **Research sources**: See `docs/research/` for the full competitive analysis:
> - `dashboard-design-research.md` — 11 platforms analyzed
> - `client-detail-page-patterns.md` — 7 platforms analyzed
> - `session-auth-form-patterns-research.md` — 7+ platforms analyzed
> - `navigation-design-settings-research.md` — 8+ platforms analyzed

---

## Design Principles (from research)

1. **Action-first, not data-first** — Every element should answer "what do I need to do right now?" or flag something wrong. Green/normal metrics take minimal space; abnormal metrics expand and demand attention.
2. **Role-adaptive content** — RBTs need their schedule and session logging. BCBAs need caseload overview and auth tracking. Admins need practice health metrics. Same layout structure, different data scope.
3. **Teal as primary brand color** — Research across healthcare platforms strongly supports teal — reads as both clinical (blue-leaning) and warm (green-leaning). Carries from logo gradient into buttons, active states, and chart colors.
4. **Schedule context everywhere** — Even without a dedicated calendar feature, "today's sessions" should be visible on the dashboard. Practitioners live in their schedule.
5. **Exception-based alerting** — Only surface problems, not happy paths. 12 healthy auths don't need cards. 2 expiring auths do.

---

## Page-by-Page Design Specs

### 1. Dashboard (`/overview`)

**Role-adaptive layouts — same structure, different data:**

#### BCBA / Default View
```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: "Dashboard" + Today's Date + [+ Log Session] [+ Add Client]
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ROW 1: 4 Metric Cards (equal width, horizontal)                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐│
│  │Sessions Today│ │Pending Notes │ │Auth Alerts   │ │Util Rate││
│  │ 6 scheduled  │ │ 3 unsigned   │ │ 2 expiring   │ │ 78%     ││
│  │ 1 completed  │ │ [red if >0]  │ │ 1 over 90%   │ │ avg     ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘│
│                                                                 │
│  ROW 2: Two-column layout                                       │
│  ┌──────────────────────────┐ ┌────────────────────────────────┐│
│  │ TODAY'S SCHEDULE         │ │ ACTION ITEMS                   ││
│  │ (timeline/agenda)        │ │ (prioritized alerts)           ││
│  │                          │ │                                ││
│  │ 8:00 Client A (97153)   │ │ ⚠ Auth expiring 7 days        ││
│  │      RBT: Sarah M.      │ │   Client D - Aetna [Renew]    ││
│  │      [In Progress]       │ │                                ││
│  │                          │ │ ⚠ 3 notes unsigned            ││
│  │ 10:00 Client B (97155)  │ │   Mar 18 (2), Mar 19 (1)      ││
│  │       [Upcoming]         │ │   [Review Notes]              ││
│  │                          │ │                                ││
│  │ 1:00 Client C (97151)   │ │ ⚠ Under-utilization           ││
│  │      [Upcoming]          │ │   Client E - 38% used         ││
│  └──────────────────────────┘ └────────────────────────────────┘│
│                                                                 │
│  ROW 3: Authorization Health (full width table)                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ AUTH OVERVIEW                              [View All →]     ││
│  │ Client  │ Payer │ CPT   │ Used/Appr │ Util% │ Expires      ││
│  │ ────────┼───────┼───────┼───────────┼───────┼──────────     ││
│  │ ClientA │ BCBS  │ 97153 │ 28/40     │ 70%   │ Apr 30       ││
│  │ ClientB │ Aetna │ 97153 │ 38/40     │ 95% ▲ │ May 15       ││
│  │ [Only showing auths needing attention. 12 total healthy.]   ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### RBT View (simplified)
```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: "My Day" + Today's Date + [+ Log Session]              │
├─────────────────────────────────────────────────────────────────┤
│  ROW 1: 3 Metric Cards                                         │
│  ┌────────────────┐ ┌─────────────────┐ ┌─────────────────────┐│
│  │Sessions Today  │ │Hours Logged     │ │Quick Log            ││
│  │ 4 remaining    │ │ 3.5 hrs / 8 hrs │ │[Log Session →]      ││
│  └────────────────┘ └─────────────────┘ └─────────────────────┘│
│                                                                 │
│  FULL WIDTH: Today's Schedule                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 8:00-11:00  Marcus T. │ 97153 │ Home │ [Log Session]       ││
│  │ 12:00-3:00  Aisha R.  │ 97153 │ Clinic │ [Log Session]     ││
│  │ 3:30-4:30   Ethan N.  │ 97155 │ Home │ [Log Session]       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  RECENT SESSIONS (last 5 logged)                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Today    Marcus T. │ 97153 │ 12 units │ ✓ Completed        ││
│  │ Yesterday Aisha R. │ 97153 │ 16 units │ ✓ Completed        ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

#### Admin/Owner View
```
Same structure as BCBA but with financial metrics:
- Revenue This Month, Outstanding Claims, Collection Rate, Staff Utilization
- Practice-wide data instead of personal caseload
```

**Key design decisions:**
- Metric cards: large number (24px+), uppercase label (11px), subtitle with context
- Action items card: colored left border (red=critical, amber=warning), each row has an action button
- Auth table: progress bar inline, color-coded by utilization threshold
- "Only showing items needing attention" — exception-based, not exhaustive

---

### 2. Client Detail (`/clients/[id]`)

**Header banner (sticky, always visible):**
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Clients                                               │
│                                                                 │
│ Marcus Thompson                    [Active] [Insured] [Auth:62d]│
│ DOB: Mar 15, 2018 · Age 8 · F84.0: Autism Spectrum Disorder    │
│ Guardian: Rebecca Thompson · (512) 555-0142 · r.thompson@email  │
│                                                                 │
│ [+ Log Session]  [Upload Auth Letter]                           │
├─────────────────────────────────────────────────────────────────┤
│ [Overview] [Care Team] [Insurance] [Authorizations] [Sessions] [Contacts] [Edit] │
└─────────────────────────────────────────────────────────────────┘
```

**Overview tab layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ROW 1: 4 Clickable Metric Cards                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────┐│
│  │TOTAL APPROVED│ │USED          │ │WEEKLY AVG    │ │DAYS LEFT││
│  │ 120 hrs      │ │ 73 hrs       │ │ 12.3 hrs     │ │ 62      ││
│  │ 2 services   │ │ 61% utilized │ │ target: 15   │ │ Jun 18  ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └─────────┘│
│  (clicking a card navigates to relevant tab)                    │
│                                                                 │
│  ROW 2: Two-column grid                                         │
│  ┌───────────────────────┐ ┌───────────────────────────────────┐│
│  │ INSURANCE             │ │ CARE TEAM            [Manage →]   ││
│  │ Payer: BCBS           │ │ [SC][DP][MJ][AR] 2 BCBAs · 2 RBTs││
│  │ Member: BCB998877     │ │ Primary: Dr. Sarah Chen, BCBA     ││
│  │ Group: GRP-44521      │ │                                   ││
│  │ Type: Commercial      │ │ (compact summary — full team on   ││
│  │ Effective: Jan 1 2025 │ │  Care Team tab)                   ││
│  └───────────────────────┘ └───────────────────────────────────┘│
│                                                                 │
│  ROW 3: Authorized Services (full width)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ AUTHORIZED SERVICES                                         ││
│  │                                                             ││
│  │ 97153 Adaptive behavior treatment     38 hrs remaining      ││
│  │ ████████████████░░░░░░░░░░ 62%       62/100 hrs             ││
│  │                                                             ││
│  │ 97155 Protocol modification           9 hrs remaining       ││
│  │ ███████████░░░░░░░░░░░░░░░ 55%       11/20 hrs              ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ROW 4: Recent Sessions (last 5)                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ RECENT SESSIONS                            [View All →]     ││
│  │ Mar 20 │ 9:00a-12:00p │ David Park │ 97153 │ 12u │ ✓ Done  ││
│  │ Mar 19 │ 9:00a-12:00p │ David Park │ 97153 │ 12u │ ✓ Done  ││
│  │ Mar 18 │ 1:00p-3:00p  │ Dr. Chen   │ 97155 │ 8u  │ ✓ Done  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Key differentiators from competitors:**
- Guardian info in the sticky header (ABA clients are children — most competitors bury this)
- Clickable metric cards that navigate to detail tabs (from Jane App pattern)
- Auth utilization progress bars with color thresholds on the Overview tab (CentralReach buries this in billing)
- Inline alerts for expiring auths, missing data (no competitor does this on the client page)
- Recent sessions feed on overview (SimplePractice-inspired)

**Care Team tab layout (Phase 2):**
```
┌─────────────────────────────────────────────────────────────────┐
│  CARE TEAM                              2 BCBAs · 3 RBTs       │
│                                                                 │
│  ┌─ Supervising ──────────────────────────────────────────────┐ │
│  │ [SC] Sarah Chen        BCBA    ★ Primary             [⋯]  │ │
│  │ [DP] David Park        BCBA    (coverage)             [⋯]  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Direct Service ───────────────────────────────────────────┐ │
│  │ [MJ] Marcus Johnson    RBT                            [⋯]  │ │
│  │ [AR] Amy Rodriguez     RBT     ★ Lead RBT             [⋯]  │ │
│  │ [CL] Chris Lee         RBT                            [⋯]  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [+ Add Provider to Care Team]                                  │
│                                                                 │
│  ── Add Provider (popover, not modal) ──────────────────────    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 🔍 Search providers...                                   │   │
│  │                                                          │   │
│  │ Jordan Williams    RBT     4 clients    [Add →]          │   │
│  │ Lisa Park          BCBA    8 clients    [Add →]          │   │
│  │ Mike Chen          RBT     3 clients    [Add →]          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  On click "Add": role auto-selects from credential              │
│  (RBT → Direct Service, BCBA → Supervising). Override via       │
│  inline dropdown. Provider appears in grouped list.              │
│                                                                 │
│  [⋯] menu per member: Change Role, Set as Primary,             │
│       View Provider Profile, Remove from Team                   │
│                                                                 │
│  ★ = primary toggle (one per role group, single-click)          │
└─────────────────────────────────────────────────────────────────┘
```

**Key UX decisions (from research — Linear, GitHub, Healthie convergent pattern):**
- **No drag-and-drop** — combobox-search-and-add is faster (3 clicks vs 5+), works on tablets, accessible
- **Popover not modal** — keep existing team visible while adding
- **Auto-role from credential** — reduces clicks; override available
- **Grouped by role** — ABA teams have clear hierarchy; scannable at a glance
- **Primary = star toggle** — separate from role, most common edit, single click
- **No team membership restriction on sessions** — any org provider can log sessions for any client. Care team drives defaults, not access control.

---

### 3. Session Log Form (`/sessions/new`)

**The most-used page. Optimize for speed (<30 seconds).**

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Sessions                                              │
│ Log Session                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ QUICK LOG (if returning user with recent sessions)              │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Marcus T. · 97153 · 12 units · Home — Mar 20  [Log Again]  │ │
│ │ Aisha R.  · 97153 · 16 units · Clinic — Mar 20 [Log Again] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ─── OR FILL OUT FORM ──────────────────────────────────────── │
│                                                                 │
│ SECTION 1: Who & When                                           │
│ ┌────────────────────────┐ ┌────────────────────────┐           │
│ │ Client *               │ │ Provider *             │           │
│ │ [Search clients...  ▼] │ │ [Pre-filled if RBT  ▼] │           │
│ └────────────────────────┘ └────────────────────────┘           │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐                         │
│ │ Date *   │ │ Start *  │ │ End *    │                         │
│ │ [Today]  │ │ [9:00 AM]│ │ [12:00PM]│                         │
│ └──────────┘ └──────────┘ └──────────┘                         │
│                                                                 │
│ SECTION 2: Service                                              │
│ ┌────────────────────────┐ ┌────────────────────────┐           │
│ │ CPT Code *             │ │ Place of Service *     │           │
│ │ [97153 — Adaptive  ▼]  │ │ [12 — Home         ▼]  │           │
│ └────────────────────────┘ └────────────────────────┘           │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✓ AUTO-CALCULATED                                          │ │
│ │ Duration: 3h 0m  ·  Units: 12  ·  Modifier: HM (RBT)      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ ✓ AUTHORIZATION CHECK                                      │ │
│ │ Auth AUTH-0891 has 38 units remaining for 97153.            │ │
│ │ This session uses 12 units → 26 remaining after.           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ SECTION 3: Notes (optional)                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Session notes...                                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                    [Cancel]  [Save Session]     │
└─────────────────────────────────────────────────────────────────┘
```

**Key UX patterns from research:**
- **Quick Log** at the top — repeat previous sessions with one tap (no competitor has this)
- **Two-column** layout for field pairs (client+provider, date+start+end, CPT+POS)
- **Auto-calculated card** with blue/info background — real-time feedback as user types
- **Auth check card** — green (OK), amber (low), red (exceeded), gray (no auth)
- **Pre-fill**: date=today, provider=current user, CPT=last used for client, POS=last used
- **Draft persistence** to localStorage — if browser closes, form recovers on return
- **Session validation warnings** inline (CPT-credential mismatch, max units/day, overlap)

---

### 4. Client List (`/clients`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Clients                                     [+ Add Client]      │
│ 28 clients in your practice                                     │
├─────────────────────────────────────────────────────────────────┤
│ [Search clients...]  [Filters ▼]  [Status: All ▼]              │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ CLIENT          │ GUARDIAN    │ PAYER │ BCBA    │AUTH │DAYS │ │
│ │ ────────────────┼────────────┼───────┼─────────┼─────┼─────│ │
│ │ Ethan Miller    │ Rebecca M. │ BCBS  │ Dr.Chen │ ██▓ │ 90d │ │
│ │ DOB: 3/15/18·F84│            │       │         │ 61% │     │ │
│ │                 │            │       │         │     │     │ │
│ │ Sophia Garcia   │ Maria G.   │ Aetna │ Marcus W│ ██░ │120d │ │
│ │ DOB: 7/22/19·F84│            │       │         │ 35% │     │ │
│ │                 │            │       │         │     │     │ │
│ │ Liam Johnson    │ Tanya J.   │ UHC   │ Jessica │ ██▓ │ 60d │ │
│ │ DOB: 11/3/17·F84│            │       │         │ 64% │     │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Page 1 of 3  [Previous] [Next]                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key patterns:**
- Rich table rows: name (bold) + DOB + diagnosis on second line (muted)
- Guardian column (ABA-specific — most EHRs don't have this in the list)
- Auth utilization mini-bar inline in the table
- Days remaining badge (color-coded: green >30d, amber 7-30d, red <7d or expired)
- Clickable rows navigate to client detail

---

### 5. Authorizations List (`/authorizations`)

```
┌─────────────────────────────────────────────────────────────────┐
│ Authorizations                          [Upload Auth Letter]    │
│ Track all client authorizations and renewals                    │
├─────────────────────────────────────────────────────────────────┤
│ [All] [Active] [Expiring Soon] [Expired] [Pending]             │
│                                                                 │
│ ROW 1: 4 Metric Cards                                          │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │Active: 18│ │Expiring:3│ │Expired: 2│ │Avg: 68%  │           │
│ │  (green) │ │  (amber) │ │  (red)   │ │util rate │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │Client     │Auth ID  │Period      │Days│Utilization│Status  │ │
│ │───────────┼─────────┼────────────┼────┼───────────┼────────│ │
│ │Ethan M.   │AUTH-0891│Dec20-Jun18│ 90 │ ██▓░ 61% │ Active │ │
│ │Sophia G.  │AUTH-1102│Jan19-Jul18│120 │ ██░░ 35% │ Active │ │
│ │Olivia T.  │AUTH-0443│Oct21-Mar30│ 10 │ ████ 90% │Expiring│ │
│ │Emma R.    │AUTH-0220│Sep1-Mar17 │ -3 │ ████ 97% │Expired │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

**Key differentiator**: No competitor offers predictive burndown projections (projected utilization at current rate). This is whitespace for Clinivise.

---

### 6. Settings (`/settings`)

**Tab structure (from SimplePractice's 3-category model adapted for ABA):**

```
[Practice] [Billing] [Clinical]

Practice tab:
  - Practice info (name, NPI, tax ID, taxonomy, address, phone, email, timezone)
  - Team management (embed Clerk's OrganizationProfile)
  - Audit log (Phase 2)

Billing tab:
  - Payers (CRUD table — built)
  - Service codes (CPT code defaults)
  - Fee schedules (Phase 2)

Clinical tab:
  - Session defaults (default POS, note template)
  - Authorization alert thresholds (80%/95% warnings)
  - Unit calculation method (CMS vs AMA)
```

---

### 7. Provider List & Detail

**List:** Name (bold) + credential underneath, Credential badge, NPI, Supervisor, Status badge, caseload count

**Detail:** Key-value pairs for credentials, NPI, credential expiry, supervisor. Caseload list (clients assigned). Session history.

---

## Navigation Structure

**Left sidebar with icon + text labels (dominant pattern across PM platforms):**

```
┌──────────────────┐
│ [C] Clinivise    │  ← gradient logo (teal→blue→indigo)
│  Practice Mgmt   │
├──────────────────┤
│ CORE             │  ← section label
│ ◫ Overview       │
│ ◉ Clients        │
│ ◈ Authorizations │
│ ▤ Sessions       │
│ ⚕ Providers      │
├──────────────────┤
│ ⚙ Settings       │  ← pinned to bottom of group
├──────────────────┤
│ [Org Switcher]   │  ← Clerk component
└──────────────────┘
```

**Active state:** Blue/teal left border or tinted background + bold text + heavier icon stroke
**Hover state:** Subtle background tint with smooth transition

---

## Visual Design Language

### Color Palette (from research)

| Role | Token | Value | Usage |
|---|---|---|---|
| Primary | `--primary` | Teal-blue (oklch ~0.55 0.15 250) | Buttons, links, active nav, focus rings |
| Background | `--background` | Light cool gray | Page background (cards float above) |
| Card | `--card` | Pure/near white | Cards, dialogs, table containers |
| Success | emerald-500/600 | Green | Utilization OK, active status |
| Warning | amber-500/600 | Amber/gold | Expiring auth, high utilization |
| Destructive | red-500/600 | Red | Expired, over-utilized, denied |
| Info | blue-500/600 | Blue | Auto-calculated values, info cards |

### Typography
- Page titles: `text-xl font-bold tracking-tight`
- Section card headers: `text-xs font-semibold uppercase tracking-wider`
- Metric values: `text-2xl font-bold tabular-nums`
- Metric labels: `text-[11px] font-semibold uppercase tracking-wider text-muted-foreground`
- Body/table: `text-xs` (12px)
- Table headers: `text-[11px] font-semibold uppercase tracking-wide`

### Elevation
- Background (recessed): `bg-background`
- Cards (floating): `bg-card shadow-sm rounded-xl border`
- Cards on hover: `hover:shadow-md hover:-translate-y-0.5 transition-all`
- Elevated (modals/popovers): `shadow-lg`

### Micro-interactions
- Button press: `active:scale-[0.97] transition-transform`
- Card hover lift: `hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`
- Content entrance: `fade-in` animation (0.3s ease-out, translateY 4px→0)
- Table row hover: `hover:bg-accent/50 transition-colors`

---

## v0.dev Prompt Templates

### Dashboard Prompt
```
Design a practice management dashboard for "Clinivise" — an ABA therapy PM tool. Use Next.js, shadcn/ui, Tailwind CSS. The primary users are BCBAs and RBTs (85% women).

Layout:
- Left sidebar: gradient teal-blue logo, nav items (Overview, Clients, Authorizations, Sessions, Providers, Settings), org switcher at bottom
- Top header: sidebar toggle, search bar with ⌘K hint, user avatar
- Main content:
  - 4 metric cards: Sessions Today, Pending Notes, Auth Alerts, Utilization Rate
  - Two-column: Today's Schedule (left) + Action Items (right, colored alert rows)
  - Full-width Auth Overview table with progress bars

Style: clean light background, white cards with subtle shadows, teal primary color, rounded-xl corners. Approachable and professional, not corporate. Hover effects on cards (lift + shadow).
```

### Client Detail Prompt
```
Design a client detail page for an ABA therapy PM tool. Use shadcn/ui, Tailwind.

Layout:
- Back link "← Back to Clients"
- Sticky header: large client name, DOB/Age/Diagnosis subtitle, Guardian name+phone, status badges on right, action buttons [Log Session] [Upload Auth Letter]
- Tabs: Overview, Insurance, Authorizations, Sessions, Contacts, Edit
- Overview tab contains:
  - 4 metric cards (Total Approved hrs, Used hrs with %, Weekly Avg, Days Left)
  - 2x2 grid: Insurance snapshot (key-value pairs), Care Team (avatar initials + name + role), Primary Guardian (key-value), Client Details (key-value)
  - Full-width Authorized Services with per-CPT progress bars (color-coded)
  - Recent Sessions table (last 5)

Style: teal primary, white cards with shadow-sm, section cards have subtle muted header bars with uppercase labels. Warm but professional.
```

### Session Log Form Prompt
```
Design a session logging form for an ABA therapy PM tool. This is the MOST used page — speed matters.

Layout:
- Quick Log section at top: last 3 sessions as compact rows with [Log Again] buttons
- Divider: "OR FILL OUT FORM"
- Two-column form: Client + Provider (row 1), Date + Start + End (row 2), CPT Code + Place of Service (row 3)
- Auto-calculated info card (blue background): Duration, Units, Modifier
- Authorization check card (green/amber/red): which auth is used, remaining units
- Notes textarea (optional)
- Footer: Cancel + Save Session buttons

Style: clean, fast, minimal visual noise. Pre-filled fields should look different from empty ones. The auto-calculated card should feel like helpful feedback, not a form field.
```

---

*Last updated: 2026-03-21*
*Based on competitive research across CentralReach, AlohaABA, Theralytics, Raven Health, Motivity, SimplePractice, Jane App, Healthie, and 3+ other platforms.*
