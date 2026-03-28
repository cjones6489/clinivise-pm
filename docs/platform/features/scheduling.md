# Scheduling & Calendar Feature Spec

> The complete reference for Clinivise's scheduling system. Synthesized from 6 parallel research streams covering 13+ ABA platforms, AI scheduling frontier, clinical domain requirements, technical integration analysis, and calendar UI best practices.

---

## What This Is

Scheduling is the #1 competitive gap in Clinivise. Every ABA competitor — from entry-level TherapyPM to enterprise CentralReach — includes scheduling. Without it, practices need a second tool, which defeats the all-in-one value proposition.

**The problem:** ABA scheduling is uniquely complex. Sessions are 2-4 hours (not 15-min medical appointments), RBTs travel between home-based clients, BCBAs must overlap with RBT sessions for supervision credit, and every session must fit within authorization limits. Most ABA practices spend 10+ hours/week on scheduling administration.

**Our approach:** Ship a clean, auth-aware calendar that matches Raven Health's simplicity (5-field booking) with Theralytics' validation depth (3-step auth/conflict/availability checks). Template-first scheduling for recurring weekly patterns. No AI scheduling for MVP — that's a Phase 7+ differentiator.

---

## Competitive Context (Verified 2026-03-27)

> **Full research:** `docs/research/scheduling-calendar-competitive-research.md` (13 platforms), `docs/research/ai-scheduling-frontier-research.md` (5 platforms + trends)

### Feature Matrix — What Competitors Ship

| Feature | Hipp | Passage | Theralytics | TherapyPM | AlohaABA | CentralReach | Raven | Clinivise |
|---|---|---|---|---|---|---|---|---|
| Day/week/month views | ? | Yes | Yes | Yes | Yes | Yes | Yes | **Planned** |
| Multi-provider view | ? | Yes | Yes | Timeline | Yes | Day Planner | Yes | **Planned** |
| Click-to-book on timeslot | ? | Yes | Yes | Yes | Yes | Yes | Yes | **Planned** |
| Recurring appointments | Yes | Yes | Yes | Yes | Yes | Yes | Yes | **Planned** |
| Drag-and-drop reschedule | ? | Yes | Yes | Yes | Yes | Yes | Yes | **Planned** |
| Auth validation at booking | Yes | Hard block | 3-step check | Warning | Yes | Yes | Yes | **Planned** |
| Conflict detection | Yes | Yes | Yes | Yes | Yes | Yes | Yes | **Planned** |
| Session conversion | ? | Auto | "Rendering" | One-click | One-click | Lightning bolt | One-click | **Planned** |
| Color coding | ? | Yes | Yes | Yes | Yes | Yes | Yes | **Planned** |
| Mobile schedule view | Yes | Yes | Yes (offline) | Yes | Yes | Yes | Yes (offline) | **Planned** |
| Drive time tracking | No | No | Yes | No | Yes | Yes | No | Phase 3 |
| AI auto-scheduling | Yes | No | No | No | No | ScheduleAI | No | Phase 7+ |
| Google Calendar sync | No | No | No | Yes | No | No | No | Phase 3 |
| Room management | No | No | Yes | No | No | Yes | No | Deferred |
| EVV/GPS verification | No | No | Yes | No | Yes | Yes | No | Phase 3 |
| Credential-gated booking | No | No | No | No | No | No | TherapyLake | **Planned** |

### Key Competitive Insights

1. **Scheduling is always included in pricing** — no platform charges separately for it
2. **Auth-aware scheduling is table stakes** — every serious platform validates at booking time
3. **Template-first is the industry pattern** — clients have fixed weekly schedules, exceptions are handled individually
4. **Session conversion must be frictionless** — one click from appointment to billable session
5. **AI scheduling is enterprise-only today** — only CentralReach (ScheduleAI) and Hipp Health have it. TheraDriver is standalone. The market is early (28% adoption in healthcare)
6. **Raven Health proves simplicity works** — just 5 fields to book, mobile-first, $29/user/month

---

## Architecture

### Core Architectural Decision: Appointments ARE Sessions

The existing `sessions` table already supports `status = "scheduled"`. An appointment is a session with `status = "scheduled"` that transitions to `completed`, `cancelled`, or `no_show`. This eliminates the need for a separate `appointments` table and leverages all existing session infrastructure (overlap detection, auth matching, unit accounting).

**Evidence this works:**
- `SESSION_STATUSES` includes `"scheduled"` as the first status
- `VALID_SESSION_TRANSITIONS` defines: `scheduled → [completed, cancelled, no_show]`
- Unit accounting already correctly ignores non-completed sessions (units consumed only on completion)
- Existing `checkSessionOverlap` already prevents double-booking
- Session form already collects all appointment fields (client, provider, date, times, CPT, POS)

**What's new:** Three supporting tables for concepts that don't exist in the current schema:

```
1. appointment_templates     — Recurring weekly patterns (the "ground truth" schedule)
2. provider_availability     — Weekly working hours per provider
3. provider_time_off         — PTO, sick days, exceptions
```

### How Scheduling Connects to Existing Features

```
Scheduling touches 6 existing systems:

Sessions ←→ Appointments ARE sessions with status="scheduled"
             Transition: scheduled → completed (triggers unit accounting)
             Existing overlap detection applies to scheduled sessions too

Auth     ←→ At booking: check remaining authorized hours for CPT code
             Projected utilization = approved - used - future_scheduled
             Warn (not block for MVP) when exceeding auth limits

Clients  ←→ Only active clients are schedulable
             Client address drives POS and future drive-time features
             Client status pipeline gates scheduling eligibility

Providers ←→ Care team (client_providers) drives default provider suggestions
              Credential type gates CPT code eligibility (QHP-only codes)
              Supervisor relationships drive supervision overlap scheduling

Care Team ←→ Primary provider pre-fills when scheduling for a client
              Role-based suggestions (BCBA for 97155, RBT for 97153)

Dashboard ←→ New metrics: sessions today, hours scheduled this week
              Auth pacing alerts (scheduled hours vs auth remaining)
              Supervision compliance tracking
```

---

## Data Model

### New Table: `appointment_templates`

Recurring weekly schedule patterns. Most ABA clients have fixed weekly schedules (e.g., Mon/Wed/Fri 9am-12pm with RBT, Thursday 2pm-3pm BCBA supervision). Templates are the "ground truth" that generate scheduled sessions.

```
appointment_templates:
  id                  text PK (nanoid)
  organization_id     text NOT NULL FK → organizations
  client_id           text NOT NULL FK → clients
  provider_id         text NOT NULL FK → providers
  supervisor_id       text FK → providers (nullable — only for RBT sessions)
  cpt_code            text NOT NULL
  place_of_service    text NOT NULL DEFAULT '12'
  day_of_week         integer NOT NULL (0=Sunday..6=Saturday)
  start_time          text NOT NULL (HH:MM, 24-hour)
  end_time            text NOT NULL (HH:MM, 24-hour)
  units               integer NOT NULL
  effective_from      date NOT NULL
  effective_until     date (NULL = ongoing)
  is_active           boolean NOT NULL DEFAULT true
  notes               text
  created_at          timestamp with tz
  updated_at          timestamp with tz

Indexes:
  (organization_id)
  (organization_id, client_id)
  (organization_id, provider_id)
  (organization_id, provider_id, day_of_week)
```

**Batch generation:** A "Generate Schedule" action creates `status="scheduled"` sessions from active templates for a date range (e.g., next 2 weeks). Skips dates that already have a session for that template. Respects `effective_from` / `effective_until` bounds.

### New Table: `provider_availability`

Weekly working hours. Defines when a provider is available for scheduling.

```
provider_availability:
  id                  text PK (nanoid)
  organization_id     text NOT NULL FK → organizations
  provider_id         text NOT NULL FK → providers
  day_of_week         integer NOT NULL (0-6)
  start_time          text NOT NULL (HH:MM)
  end_time            text NOT NULL (HH:MM)
  location            text (nullable — office, telehealth, community)
  effective_from      date NOT NULL
  effective_until     date (NULL = ongoing)
  created_at          timestamp with tz
  updated_at          timestamp with tz

Indexes:
  (organization_id, provider_id)
  (organization_id, provider_id, day_of_week)
```

### New Table: `provider_time_off`

PTO, sick days, one-off blocks. Overrides availability for specific dates.

```
provider_time_off:
  id                  text PK (nanoid)
  organization_id     text NOT NULL FK → organizations
  provider_id         text NOT NULL FK → providers
  date                date NOT NULL
  all_day             boolean NOT NULL DEFAULT true
  start_time          text (nullable — for partial-day blocks)
  end_time            text (nullable — for partial-day blocks)
  reason              text
  created_at          timestamp with tz
  updated_at          timestamp with tz

Indexes:
  (organization_id, provider_id, date)
```

### New Indexes on Existing `sessions` Table

Calendar queries need date-range + provider/client lookups:

```
sessions_provider_date_idx  ON (organization_id, provider_id, session_date)
sessions_client_date_idx    ON (organization_id, client_id, session_date)
```

### New Constants

```typescript
export const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6] as const;
export const DAY_OF_WEEK_LABELS: Record<number, string> = {
  0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
  4: "Thursday", 5: "Friday", 6: "Saturday",
};
```

---

## UI Specification

### Calendar Library: Schedule-X

**Why Schedule-X over alternatives:**
- First-class Next.js support (`useNextCalendarApp` hook)
- CSS variable theming → maps to our Tailwind design tokens
- 15-minute configurable drag intervals → matches ABA billing units
- Plugin architecture → incremental feature additions
- Dark mode + responsive built in
- Lighter than FullCalendar, more modern than react-big-calendar

**Fallback:** FullCalendar if resource/multi-provider timeline views are needed ($480/dev/year premium license).

### Page: `/calendar`

**Route:** `/calendar` (new sidebar nav item in Core group, between Sessions and Authorizations)

**Default view:** Week view (industry consensus — most useful for daily operations)

**Views available:**
- **Day view** — Single day, one provider or multi-provider columns side-by-side
- **Week view** — Default. 7-day grid with time slots. Toggle between single-provider and all-providers
- **Month view** — Overview with event counts per day. Click day to drill into day view
- **Agenda view** — Mobile-optimized list of upcoming appointments (responsive fallback)

### Appointment Creation Flow (Two-Tier, Google Calendar Pattern)

**Tier 1 — Quick Create (click on timeslot):**
```
+------------------------------------------+
| Quick Create Appointment                  |
|------------------------------------------|
| Client:    [Search / Select      v]      |
| Provider:  [Pre-filled from care team v] |
| CPT Code:  [97153 v]                     |
| Date/Time: Pre-filled from click         |
|                                           |
| [Auth: 142/200 units remaining]          |
|                                           |
|        [Cancel]  [Create]  [More ▸]      |
+------------------------------------------+
```

Pre-fills: date/time from timeslot click, provider from current calendar view, CPT defaults to 97153 (most common). Shows auth remaining inline.

**Tier 2 — Full Dialog (click "More ▸"):**
Expands to full form with: supervisor, place of service, units (auto-calculated from time), authorization selection, notes. Same fields as existing session form but with `status` defaulting to `"scheduled"`.

**No Sheet/sidebar** — per project convention, use Dialog modals.

### Color Coding

**Default scheme — By status:**
| Status | Color | Visual |
|--------|-------|--------|
| Scheduled | Blue (primary) | Solid block |
| Confirmed | Emerald | Solid block |
| Completed | Emerald (muted) | Solid with checkmark |
| Cancelled | Muted/grey | Strikethrough text |
| No Show | Red (muted) | Grey with X |

**Toggle schemes (future):**
- By provider — each provider gets a distinct accent color
- By CPT code — color per service type (97153=blue, 97155=purple, 97156=teal)

### Session Conversion

One-click flow from scheduled → completed:

```
Scheduled Appointment Card:
+--------------------------------------------------+
| Marcus T. — 97153 Direct Therapy                  |
| 9:00 AM – 12:00 PM · Home · 12 units             |
| RBT: Sarah Johnson · BCBA: Dr. Chen (supervisor)  |
|                                                    |
| [Complete Session] [Cancel] [Reschedule] [⋯]      |
+--------------------------------------------------+
```

"Complete Session" → opens session detail with times pre-filled → provider writes note → marks complete → units consumed from auth.

### Validation Rules at Booking

**Hard blocks (prevent creation):**
1. Same provider overlapping 1:1 sessions (existing check)
2. Provider scheduling outside their availability hours

**Warnings (allow creation with notice):**
1. No active authorization for this client + CPT + date range
2. Scheduled units would exceed remaining authorized units
3. MUE exceeded for this CPT code on this date
4. Provider credential doesn't match CPT code requirements (e.g., RBT billing QHP-only code)
5. No supervisor assigned for RBT session
6. Provider has time off on this date

### Recurring Template Management

**Accessed from:** Client detail page (new "Schedule" section on Overview tab) or Calendar sidebar

```
Client Weekly Template:
+------------------------------------------------------------------+
| WEEKLY SCHEDULE                                    [+ Add Block]  |
|------------------------------------------------------------------|
| Mon  9:00–12:00  97153  Sarah Johnson (RBT)  Home       [Edit][×]|
| Wed  9:00–12:00  97153  Sarah Johnson (RBT)  Home       [Edit][×]|
| Fri  9:00–12:00  97153  Sarah Johnson (RBT)  Home       [Edit][×]|
| Thu  2:00–3:00   97155  Dr. Chen (BCBA)      Home       [Edit][×]|
|                                                                    |
| 39 units/week · Auth: 200 remaining · ~5 weeks at this pace      |
|                                                                    |
| [Generate Next 2 Weeks]                                           |
+------------------------------------------------------------------+
```

### Provider Availability Management

**Accessed from:** Provider detail page (new "Availability" tab or section)

```
Provider Availability:
+------------------------------------------+
| WEEKLY HOURS                 [+ Add Block]|
|------------------------------------------|
| Mon  8:00 AM – 4:00 PM  Office          |
| Tue  8:00 AM – 4:00 PM  Community       |
| Wed  8:00 AM – 4:00 PM  Office          |
| Thu  8:00 AM – 6:00 PM  Office          |
| Fri  8:00 AM – 12:00 PM Office          |
+------------------------------------------+
| TIME OFF                                  |
|------------------------------------------|
| Apr 14–18, 2026  Vacation                |
| May 26, 2026     Memorial Day            |
+------------------------------------------+
```

### Mobile / Responsive

- **Desktop (≥1024px):** Full week view with time grid
- **Tablet (768–1023px):** 3-day view with time grid
- **Mobile (<768px):** Agenda list view (upcoming appointments as cards)

---

## Key Queries

The calendar page needs these data access patterns:

1. **getProviderSchedule(orgId, providerId, startDate, endDate)** — All sessions for a provider in a date range. Powers the provider calendar view.

2. **getOrgSchedule(orgId, startDate, endDate)** — All sessions for the org in a date range, with provider info. Powers the multi-provider calendar view.

3. **getClientSchedule(orgId, clientId, startDate, endDate)** — Sessions for a client in a date range. Powers the client schedule section.

4. **getProviderAvailability(orgId, providerId)** — Weekly hours + time-off exceptions. Renders open/blocked slots on calendar.

5. **getProjectedAuthUtilization(orgId, clientId, cptCode)** — `approved - used - future_scheduled_units`. Shows remaining schedulable hours at booking time.

6. **getAppointmentTemplates(orgId, clientId)** — Active recurring templates for a client. Powers the template management UI.

7. **generateSessionsFromTemplates(orgId, startDate, endDate)** — Batch creates `status="scheduled"` sessions from active templates. Skips dates with existing sessions.

---

## ABA Domain Constraints (from Research)

These clinical/business rules must be respected by the scheduling system:

### Supervision Requirements (BACB 2026)
- RBT supervision: minimum 5% of monthly service hours, minimum 2 hours/month
- At least 2 face-to-face contacts per month
- At least 1 contact must include direct observation (BCBA present during RBT session)
- 50% of supervision must be individual (not group)
- Only BCBA/BCBA-D/BCaBA can supervise (as of Jan 2026 — non-certified supervisors eliminated)

### Authorization Pacing
- Schedule 100% of authorized hours at auth start
- Overschedule by 10-20% to account for cancellations (20-30% cancellation rate is normal in ABA)
- Track pacing weekly: actual delivered vs expected based on linear interpolation
- Alert on under-utilization: <50% used with >50% of period elapsed

### Scheduling Patterns
- **Template-first:** Most clients have fixed weekly schedules. The system should generate from templates.
- **Block scheduling:** RBTs see 3-5 clients/day, 2-4 hours each. Travel buffers between home-based clients.
- **Supervision overlap:** BCBA sessions overlap with RBT sessions for part of the time. Both bill simultaneously (different CPT codes).
- **Seasonal shifts:** School-year schedules differ from summer (earlier start times, longer sessions in summer).

### Common Pain Points (from Practitioner Forums)
1. Auth-scheduling mismatch → #1 cause of claim denials
2. RBT turnover (80-100% annual) → constant schedule reassignment
3. Cancellation cascades → one cancellation disrupts the whole day
4. 10+ hours/week spent on scheduling admin
5. Poor visibility into auth pacing → running out of units unexpectedly

---

## Phased Roadmap

### NOW — MVP Calendar (matches Raven Health simplicity + Theralytics validation)

- [ ] Schema: `appointment_templates`, `provider_availability`, `provider_time_off` tables
- [ ] Schema: New indexes on `sessions` for calendar queries
- [ ] Constants: Days of week, appointment-related constants
- [ ] Queries: Provider schedule, org schedule, client schedule, projected auth utilization
- [ ] Actions: Create/update/delete templates, manage availability, manage time off
- [ ] Actions: Generate sessions from templates (batch)
- [ ] Calendar page: Week/day/month views using Schedule-X
- [ ] Appointment quick-create: Click timeslot → 5-field popover → create
- [ ] Appointment full dialog: All session fields with status="scheduled"
- [ ] Session conversion: One-click "Complete Session" from calendar
- [ ] Validation: Auth remaining shown at booking, conflict detection, availability check
- [ ] Color coding: By status (default scheme)
- [ ] Template management: Client weekly schedule CRUD
- [ ] Provider availability: Weekly hours CRUD + time off
- [ ] Navigation: Add Calendar to sidebar (Core group)
- [ ] Responsive: Agenda list on mobile, 3-day on tablet, full week on desktop

### NEXT — Polish & Integrations

- [ ] Drag-and-drop rescheduling on calendar
- [ ] Color coding toggle: by provider, by CPT code
- [ ] Multi-provider side-by-side day view (for schedulers/admins)
- [ ] Supervision compliance tracker (5% monthly, 2 contacts minimum)
- [ ] Dashboard integration: sessions today, hours this week, auth pacing alerts
- [ ] Bulk operations: generate schedule for all active clients, bulk cancel
- [ ] Cancellation reason tracking + analytics

### LATER — Advanced Features

- [ ] Google/Outlook calendar sync (TherapyPM pattern)
- [ ] Drive time tracking between appointments (Theralytics/AlohaABA pattern)
- [ ] EVV/GPS clock-in/clock-out for Medicaid compliance
- [ ] Automated appointment reminders (SMS/email)
- [ ] Credential-gated booking (TherapyLake pattern — block expired credentials)
- [ ] Waitlist auto-fill for cancelled slots
- [ ] Parent/caregiver schedule view (view-only + cancel request)

### FUTURE — AI Scheduling (Phase 7+)

- [ ] AI schedule suggestions based on auth remaining, provider availability, geographic proximity
- [ ] Cancellation prediction + proactive rebooking
- [ ] Optimal caseload balancing across providers
- [ ] Auth pacing optimization (spread hours evenly, maximize utilization)

---

## Sources

- `docs/research/scheduling-calendar-competitive-research.md` — 13 platform competitive analysis
- `docs/research/scheduling-domain-research.md` — ABA clinical requirements, payer rules, practitioner pain points
- `docs/research/calendar-scheduling-ui-patterns-research.md` — Healthcare + SaaS UI patterns, library comparison
- `docs/research/ai-scheduling-frontier-research.md` — TheraDriver, ABA Engine, AI scheduling trends
- Technical integration analysis of existing Clinivise schema (sessions, authorizations, providers, care team)
- BACB Ethics Code and Supervision Standards (2026)
- ABA Coding Coalition CPT-credential matching rules
