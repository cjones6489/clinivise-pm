# Scheduling & Calendar — Competitive Research

**Date:** 2026-03-27
**Scope:** Primary-tier ABA platforms — scheduling/calendar features
**Platforms:** Hipp Health, Passage Health, Theralytics, TherapyPM, TherapyLake

---

## Executive Summary

All 5 platforms treat scheduling as a core pillar — not an afterthought. The industry has converged on several standard patterns:

1. **Auth-aware scheduling is table stakes.** Every platform validates authorization dates/units at booking time. Most block over-scheduling; at minimum they warn.
2. **Session conversion (scheduled -> completed -> billed) is the critical workflow.** The appointment is just the beginning — it must flow into session notes, then claims. Platforms differ in how frictionless this is.
3. **Mobile access for field RBTs is universal.** Every platform has iOS + Android apps. Offline mode is a differentiator (Theralytics and TherapyLake have it; others are unclear).
4. **AI scheduling is the frontier.** Only Hipp Health has true AI-powered auto-scheduling. Others are still manual with smart validations.
5. **Drag-and-drop and color coding are expected.** Every platform mentions these; they're hygiene features.

---

## Platform-by-Platform Analysis

### 1. Hipp Health (hipp.health)

**Positioning:** AI-native, "practice on autopilot." Scheduling is the flagship differentiator.

#### Calendar Views
- Not publicly documented in detail. The product page emphasizes automation over manual calendar interaction.
- "All Cancellations" day view with badge count for denied/pending cancellations.
- Cancellation requests show with their own status indicator on the calendar.

#### Appointment Creation Flow
- **AI-driven approach**: Hipp collects patient and provider time preferences, then the AI auto-generates an optimized schedule. This inverts the typical manual creation flow.
- Minimal manual scheduling friction — the system suggests/fills the calendar automatically.
- Rescheduling and cancellation requests handled via the system, reviewed in bulk by schedulers.

#### Key Scheduling Features
- **AI auto-optimization**: Intelligently arranges sessions based on preferences and availability to minimize downtime.
- **Utilization analytics**: Tracks technician target hours and utilization rates.
- **Attrition signals**: Statistical analysis on patient satisfaction and attrition risk.
- **Bulk request review**: Schedulers can review all rescheduling/cancellation requests at once.
- **Cancellation status tracking**: Denied cancellations visible on calendar with status indicators.

#### Session Conversion
- Not publicly documented in detail. The platform is relatively new and gated behind demos.

#### Mobile/Tablet Experience
- **Google Play + iOS app** available.
- Mobile-first design for providers — data collection during sessions + AI-powered note generation.
- "Intuitive mobile experience" — but specific scheduling views on mobile not documented.

#### Auth-Aware Scheduling
- Keeps track of utilization rates and suggests optimal session times.
- Specific auth-blocking behavior not publicly documented.

#### Unique Differentiators
- **AI auto-scheduling is the headline feature.** No other primary-tier competitor has this. The system generates the schedule rather than just validating manual entries.
- **Utilization prediction** — analyzes patterns to suggest schedule changes that maximize revenue.
- **Compliance Agent** (separate product) monitors regulatory requirements.

#### Public Documentation Level
**Low.** Heavy demo-gated approach. Feature pages are marketing-oriented with little operational detail. Help docs not publicly accessible.

---

### 2. Passage Health (passagehealth.com)

**Positioning:** Clean PM + Frontera AI. Strong auth-to-scheduling integration.

#### Calendar Views
- **Daily, weekly, and monthly views** — confirmed.
- View by **client** or by **team member** — toggle between perspectives.
- **Color-coded dashboard** — all learner and staff schedules in one view.
- Track team member time across different session and event types over custom time periods.

#### Appointment Creation Flow
- **Intuitive care team and availability matching** — system suggests provider-client pairings.
- Client + staff availability matching during session creation.
- Date overrides for scheduling exceptions.
- Track unassigned and canceled sessions.
- Specific field count not confirmed (the "5 fields" claim in their blog refers to Raven Health, not Passage Health).

#### Key Scheduling Features
- **Color-coded dashboard**: All schedules in one view, instantly spot conflicts.
- **Automated conflict prevention**: Respects client and staff availability blocks and time-off requests.
- **Automated reminders**: Appointment reminders sent automatically.
- **Real-time updates**: Schedule changes propagate instantly across the platform.
- **Session-to-billing automation**: Completed sessions auto-populate billing records with correct details.

#### Session Conversion
- Scheduled sessions -> complete session -> notes auto-populate -> billing records auto-generated.
- **AI Session Notes** (launched Oct 2025): Auto-generates narrative summaries from session data.
- Eliminates manual data entry between session and claim.

#### Mobile/Tablet Experience
- **Mobile app** with real-time sync.
- Therapists see full schedule, start sessions, document notes from device.
- Mobile scheduling improvements noted in recent updates.
- Offline mode status unclear.

#### Auth-Aware Scheduling
- **Hard block**: System monitors insurance-approved hours per learner and **blocks scheduling beyond authorized limits**.
- Shows how many hours used and how many remain in authorization.
- **Authorization Utilization Report** (Oct 2025): Real-time visibility into scheduled, completed, and billed hours vs. authorizations.
- Catches billing problems before sessions happen (preventive, not reactive).

#### Unique Differentiators
- **Auth blocking at schedule time** is a hard stop, not just a warning. This is the strictest among competitors.
- **Session-to-billing automation** — zero re-entry from session to claim.
- **Certification expiration monitoring** — recent addition for credential tracking.
- Passage authored several "best of" blog posts ranking competitors — strong content marketing + self-awareness of market positioning.

#### Public Documentation Level
**Medium.** Feature pages describe capabilities at a functional level. No public help docs/knowledge base found. Blog posts provide comparative context.

---

### 3. Theralytics (theralytics.net)

**Positioning:** BCBA-built, transparent pricing ($15-25/client/mo). Most documented scheduling system among the group.

#### Calendar Views
- Multiple views: **by staff member, by client, by location, by service type**.
- Filter by specific locations (clinics, schools, in-home regions).
- Filter by activity types (assessments, parent training, protocol modifications).
- **Color-coded appointments** by type/status.
- Day/week/month views implied but not explicitly documented by name.

#### Appointment Creation Flow
Fields captured on the Create Appointment screen:
1. **Appointment date and time** — with real-time conflict checking.
2. **Location details** — clinic, school, or in-home (predefined or custom).
3. **Client information** — linked to client records.
4. **Service type** — therapy, supervision, assessments, training.
5. **Drive time calculation** — auto-calculated for travel and billing.
6. **Staff assignment** — searchable by staff member.
7. **Room assignment** — prevents overbooking of physical rooms.

#### Key Scheduling Features
- **Drag-and-drop** appointments on the calendar.
- **Conflict detection**: Built-in validations prevent overlapping appointments unless explicitly allowed (e.g., group sessions).
- **Admin override**: Administrators can see and override conflicts.
- **Drive time & mileage**: Automatic calculation factored into scheduling and billing.
- **Room management**: Prevents overbooking physical spaces.
- **Customizable scheduling permissions**: Role-based access control.
- **Location-based filtering**: For multi-location practices.
- **Bulk operations**: Bulk render + bulk cancel appointments (indirect appointments only, past/current only).

#### Session Conversion
- **"Rendering"** = converting an appointment into a completed session for billing/payroll.
- Two paths:
  1. **Standard**: Appointment -> attach session notes -> render (session notes are completed within the system).
  2. **Manage Appointments module**: Render without session notes (for indirect appointments or external note tracking). Rendered sessions cannot have notes added after.
- **Rendered sessions** are ready to bill and count toward staff payroll hours.
- **Bulk generate notes** for date ranges (template-based).
- **AI narrative generation**: Drafts session note summaries from collected data.
- Rendered appointments show a checkmark; cancelled show greyed out.

#### Mobile/Tablet Experience
- **iOS + Android app** available.
- Access schedule, enter session notes, cancel sessions, capture signatures with GPS coordinates, complete/render sessions.
- **Full offline mode**: Data collection, session notes, signatures, and session completion all work offline. Auto-syncs when reconnected.
- **EVV (Electronic Visit Verification)** built into mobile app — clock in/out with GPS.

#### Auth-Aware Scheduling
- **Authorization validation at booking**: "Not authorized for this date/time" error if authorization is missing or exhausted.
- Tracks **approved units, completed units, scheduled units, and remaining units** per authorization.
- Uses rounding rules to prevent overutilization.
- Authorization breakdown shows modifiers, approved units, remaining units in units and hours.
- **Three sequential validation checks** at appointment creation:
  1. Authorization hours verification
  2. Schedule conflict detection
  3. Staff availability confirmation

#### Unique Differentiators
- **Most transparent scheduling documentation** — public help docs with step-by-step guides.
- **Rendering concept** — explicit workflow for converting appointments to billable sessions. This is industry-standard ABA terminology but Theralytics surfaces it clearly.
- **Offline mode with EVV and GPS signatures** — strongest mobile compliance story.
- **Drive time/mileage** integrated into scheduling + billing.
- **Room management** for clinic-based practices.
- **RBT supervision compliance tracking** — color-coded reports showing BACB supervision percentages.
- **Cancellation analytics**: Graphs showing cancellation patterns by location, payer, appointment type, staff, and client.

#### Public Documentation Level
**High.** Public Freshdesk knowledge base with detailed help articles. Feature pages are specific. Most transparent of all platforms researched.

---

### 4. TherapyPM (therapypms.com)

**Positioning:** Simplified multi-therapy PM, ultra-affordable (from $8/mo). 500+ clinics.

#### Calendar Views
- **Three view types**:
  1. **List View** — appointments with details (text-based).
  2. **Calendar View** — standard calendar grid.
  3. **Timeline View** — time-block visualization.
- Each supports **day, week, and month** views.
- **"Time Grid Rendered View"** — same as Time Grid but color-coded by appointment status.
- **New Calendar View** with customizable filters.
- Toggle: show/hide weekends, include/exclude non-billable sessions.

#### Appointment Creation Flow
- Click time slot to create appointment.
- Set recurring appointments with desired frequency.
- Support for both **individual and group sessions** under a single entry.
- "No-Auth Appointment" option for scheduling without authorization.
- Hover over appointments for quick details (time, type, client alert).

#### Key Scheduling Features
- **Drag-and-drop** appointment management.
- **Color-coded** sessions by status/type.
- **Customizable filters**: Date range, treatment type, patient, provider, place of service, appointment status.
- **Google Calendar sync** — bidirectional with Google, Yahoo, and Outlook.
- **Automated email + text reminders** to reduce no-shows.
- **Real-time availability** management.
- **Show Availability toggle** — displays open slots for quick booking.
- **PDF export** — download calendar as PDF.
- **Recurring appointments** with configurable frequency.

#### Session Conversion
- Click appointment to open edit screen where you can **change details, add/save/edit session notes** directly.
- Appointment -> session notes workflow happens in-place.
- Specific rendering/billing conversion flow not publicly documented in detail.

#### Mobile/Tablet Experience
- **iOS + Android apps** available (Google Play and App Store confirmed).
- Providers can check schedules on the go.
- Mobile-specific capabilities beyond schedule viewing not well documented.
- Offline mode not confirmed.

#### Auth-Aware Scheduling
- **Authorization tracking** with real-time alerts for visit limits and unit usage.
- Prevents claim denials through proactive monitoring.
- "No-Auth Appointment" option — can schedule without auth when needed.
- Specific blocking vs. warning behavior not documented.

#### Unique Differentiators
- **Three calendar view types** (List + Calendar + Timeline) — most view options of any competitor.
- **Google/Yahoo/Outlook calendar sync** — only platform with external calendar integration.
- **Multi-therapy support** — not ABA-specific, also handles PT, OT, Speech, Mental Health.
- **Ultra-affordable entry point** ($8/mo).
- **PDF calendar export** for offline reference.
- **"No-Auth Appointment"** — practical escape hatch that other platforms don't surface.

#### Public Documentation Level
**Medium-High.** Freshdesk help center with specific articles. Feature pages have functional detail. Blog content is practical (how-to oriented).

---

### 5. TherapyLake (therapylake.com)

**Positioning:** Entry-level all-in-one for growing ABA practices. Compliance-first approach.

#### Calendar Views
- Calendar with **color-coded time blocks** for staff/client availability overlap.
- **Expired authorizations flagged in red** on calendar and appointment details.
- Smart suggestions for provider-client pairing based on credentials and service types.
- Specific day/week/month view options not explicitly documented.

#### Appointment Creation Flow
- **Credential-gated**: System automatically blocks staff who don't meet credential requirements (TB test, DOJ clearance, licenses, CPR).
- **Authorization-bounded**: Appointments must fall within valid authorization timeframes and unit limits.
- Smart suggestions for staff pairing based on credentials + service types.
- Input staff and client availability with color-coded overlap visualization.
- Recurring appointments auto-aligned with valid authorization windows.

#### Key Scheduling Features
- **Credential-aware scheduling**: Real-time document checks — expired TB tests, DOJ clearances, licenses block scheduling automatically.
- **Visual availability overlap**: Color-coded time blocks showing when staff and clients are both available.
- **Recurring session auto-alignment**: Recurring appointments automatically stay within valid auth windows.
- **Real-time availability tracking** with automated staff assignments.
- **Compliance flagging**: Missing notes, signatures, or documentation flagged before session is saved/billed.

#### Session Conversion
- Claims generated from completed sessions with all required data — submitted through clearinghouses with one click.
- Session-level compliance support: flags missing notes, signatures, documentation before billing.
- Specific rendering workflow not publicly documented.

#### Mobile/Tablet Experience
- **iOS + Android apps** available (App Store confirmed, requires iOS 15.1+).
- **Offline mode** — mobile app works offline, auto-syncs when connectivity restored.
- Access client information, manage appointments, update session notes from mobile.

#### Auth-Aware Scheduling
- **Real-time authorization enforcement**: Alerts when units are exhausted, start/end dates exceeded, or CPT codes don't match payer plan.
- **Unit-level breakdowns**: Used, reserved, and remaining units — broken down by service code (e.g., 97153, 97155).
- **Recurring session alignment**: Auto-suggests dates within valid authorization range.
- **Expired auth flagging**: Red visual indicator on calendar for expired authorizations.
- Sessions limited to start/end dates and unit caps defined by payers.

#### Unique Differentiators
- **Credential-first scheduling** — strongest credential enforcement of any platform. Scheduling is impossible for staff with expired documents. Other platforms may warn; TherapyLake blocks.
- **Pre-billing compliance checks** — flags missing documentation before the session is finalized, preventing revenue leakage.
- **Authorization + credential dual-gate** — both must pass before an appointment is created.
- **40% efficiency improvement** reported by users (Capterra review).

#### Public Documentation Level
**Low-Medium.** Heavy blog content (SEO-focused) but actual product documentation is sparse. Website is a JS SPA that doesn't render for crawlers. Feature specifics come primarily from blog posts and review sites.

---

## Comparison Table

| Feature | Hipp Health | Passage Health | Theralytics | TherapyPM | TherapyLake |
|---|---|---|---|---|---|
| **Calendar Views** | Undocumented (AI-managed) | Day/Week/Month, by client or team | By staff/client/location/service | List + Calendar + Timeline; Day/Week/Month | Color-coded availability overlap |
| **Drag & Drop** | Not documented | Implied (blog) | Yes (confirmed) | Yes (confirmed) | Not documented |
| **Color Coding** | Status indicators for cancellations | Color-coded dashboard | Color-coded by type/status | By status + customizable | By availability overlap + auth status (red = expired) |
| **Conflict Detection** | AI handles automatically | Automated conflict prevention | 3-step validation (auth, overlap, availability) | Real-time checks | Credential + auth dual-gate |
| **Recurring Appointments** | AI auto-generates | Confirmed but details sparse | Confirmed, with conflict checking | Confirmed, configurable frequency | Auto-aligned with auth windows |
| **Appointment Fields** | AI-driven (minimal manual input) | Care team + availability matching | Date, time, location, client, service, staff, room, drive time | Time slot, type, patient, provider, location | Staff, client, service type, credential-gated |
| **Auth-Aware** | Utilization tracking | **Hard block** at schedule time | Validation error at booking + unit tracking | Real-time alerts + "No-Auth" escape | Real-time enforcement + red flagging |
| **Session Conversion** | Not documented | Auto-populates billing | "Rendering" workflow (standard or bulk) | In-place edit -> notes | Claims from completed sessions |
| **Mobile App** | iOS + Android | iOS + Android, real-time sync | iOS + Android, **full offline + EVV + GPS** | iOS + Android | iOS + Android, offline mode |
| **Offline Mode** | Not documented | Not confirmed | **Yes** (full offline with auto-sync) | Not confirmed | **Yes** (auto-sync) |
| **External Cal Sync** | No | No | No | **Google/Yahoo/Outlook** | No |
| **AI Features** | **AI auto-scheduling** + utilization prediction | AI session notes | AI narrative generation for notes | None documented | None documented |
| **Drive Time** | No | No | **Yes** (auto-calculated for billing) | No | No |
| **Room Management** | No | No | **Yes** | No | No |
| **Credential Checks** | No | Certification expiration monitoring | RBT supervision tracking | No | **Yes** (blocks scheduling) |
| **Bulk Operations** | Bulk request review | No | Bulk render + bulk cancel | No | No |
| **Session Note Integration** | AI-powered note generation | AI session notes | Bulk note generation + AI narratives | In-place note editing | Pre-billing compliance flags |
| **Unique Strength** | AI auto-scheduling | Auth hard-blocking | Most documented + offline EVV | 3 view types + external cal sync | Credential-first scheduling |

---

## Key Patterns for Clinivise

### Must-Have (every competitor has these)
1. **Multiple calendar views** — at minimum day/week/month. View by provider and by client.
2. **Color-coded appointments** — by status, type, or provider.
3. **Authorization validation at booking** — warn or block when exceeding approved units/dates.
4. **Recurring appointments** — with configurable frequency.
5. **Conflict detection** — prevent double-booking providers (with group session override).
6. **Mobile schedule access** — iOS + Android, RBTs see their daily schedule.
7. **Appointment reminders** — automated email/text.
8. **Session-to-notes flow** — clicking a scheduled appointment should lead directly to session note creation.

### Should-Have (most competitors offer these)
1. **Drag-and-drop** rescheduling on calendar.
2. **Filtering** by provider, client, location, service type.
3. **Auth unit tracking visible from scheduling** — show remaining units when booking.
4. **Real-time sync** across all users.
5. **Session-to-billing automation** — completed sessions auto-populate claim data.
6. **Cancellation tracking** with reason codes and analytics.

### Differentiator Opportunities
1. **AI-assisted scheduling** (only Hipp has this today) — suggest optimal times based on provider/client availability + auth utilization.
2. **Offline mode** (only Theralytics and TherapyLake) — critical for in-home RBTs with poor connectivity.
3. **Drive time calculation** (only Theralytics) — huge value for in-home practices.
4. **External calendar sync** (only TherapyPM) — Google Calendar integration reduces tool-switching for providers.
5. **Credential-gated scheduling** (only TherapyLake) — prevent scheduling staff with expired documents.
6. **Pre-billing compliance checks** — flag missing notes/signatures before session finalization.

### Anti-Patterns to Avoid
1. **Don't make scheduling a separate product.** It must be deeply integrated with auth tracking, session notes, and billing.
2. **Don't hard-block all scheduling issues.** Follow our existing session validation philosophy: warnings at schedule time, hard blocks at claim generation. Only block true impossibilities (double-booked provider, no authorization at all).
3. **Don't over-automate on day 1.** AI scheduling is impressive but complex. Start with smart validations and suggestions, add AI optimization later.
4. **Don't forget the scheduler role.** Many features are provider-facing, but the office scheduler/admin is the primary calendar user in most practices.

---

## Appointment Creation — Field Consensus

Based on all platforms, the standard appointment creation form includes:

| Field | Required? | Notes |
|---|---|---|
| Client | Yes | Linked to client record |
| Provider/Staff | Yes | With availability check |
| Date | Yes | With auth date validation |
| Start Time | Yes | With conflict checking |
| End Time / Duration | Yes | Often auto-calculated from service type |
| Service Type / CPT Code | Yes | Drives auth matching, billing, and unit calculation |
| Location | Yes | Clinic, in-home, school, telehealth |
| Authorization | Auto-linked | System matches based on client + service type + date |
| Recurrence | Optional | Frequency + end date |
| Room | Optional | For clinic-based appointments (Theralytics only) |
| Drive Time | Optional | Auto-calculated for in-home (Theralytics only) |
| Notes/Comments | Optional | Internal scheduling notes |

---

## Session Conversion Workflow — Industry Pattern

The universal flow is:

```
Scheduled Appointment
    |
    v
Provider starts session (clock in, open notes)
    |
    v
Session in progress (data collection, notes entry)
    |
    v
Session completed ("rendered" in Theralytics terminology)
    - Session notes finalized
    - Signatures captured (provider + client/guardian)
    - GPS/EVV data logged (if applicable)
    |
    v
Ready for billing
    - Session auto-populates claim fields
    - Units calculated from actual time
    - Authorization usage updated
```

**Key insight:** The appointment is NOT the session. The appointment is a plan; the session is what actually happened. They may differ in time, duration, or even service type. The system must handle this gracefully.

---

## Sources

- [Hipp Health — Smart Scheduling](https://www.hipp.health/product/smart-aba-scheduling-software)
- [Hipp Health — For Admins](https://www.hipp.health/use-cases/admins)
- [Hipp Health — For Mobile Providers](https://www.hipp.health/use-cases/providers)
- [Hipp Health — Google Play](https://play.google.com/store/apps/details?id=com.HippHealth&hl=en_US)
- [Passage Health — Practice Management](https://www.passagehealth.com/practice-management)
- [Passage Health — ABA Scheduler Software (blog)](https://www.passagehealth.com/blog/aba-scheduler-software)
- [Passage Health — Mission Viewpoint Profile](https://www.missionviewpoint.com/platform-card-passage-health/)
- [Theralytics — Scheduling Software](https://www.theralytics.net/aba-therapy-scheduling-software)
- [Theralytics — Creating Recurring Appointments](https://theralytics.freshdesk.com/support/solutions/articles/44002221515-creating-recurring-appointments)
- [Theralytics — Scheduling Validation Errors](https://theralytics.freshdesk.com/support/solutions/articles/44001899102-i-m-getting-an-error-message-when-scheduling-my-appointment-)
- [Theralytics — Viewing Authorizations & Tracking Units](https://theralytics.freshdesk.com/support/solutions/articles/44002603441-how-to-view-authorizations-track-units-in-theralytics)
- [Theralytics — Bulk Rendering & Canceling](https://theralytics.freshdesk.com/support/solutions/articles/44002573621-managing-appointments-efficiently-a-guide-to-bulk-rendering-and-cancelling-appointments-in-theralyti)
- [Theralytics — Manage Appointments Module](https://theralytics.freshdesk.com/support/solutions/articles/44002674895-using-the-manage-appointments-module)
- [Theralytics — Mobile App](https://www.theralytics.net/mobile-app)
- [TherapyPM — Scheduling](https://therapypms.com/scheduling/)
- [TherapyPM — Calendar View in Provider Portal](https://therapypms.freshdesk.com/support/solutions/articles/82000904153-manage-appointment-calendar-view-in-provider-portal)
- [TherapyPM — Google Calendar Sync](https://therapypms.com/therapypm-google-calendar-sync/)
- [TherapyPM — Recurring Appointments](https://therapypms.com/save-time-and-stay-organized-with-recurring-appointments-in-aba-therapy/)
- [TherapyPM — Authorization Management](https://therapypms.com/authorization/)
- [TherapyLake — Homepage](https://therapylake.com/)
- [TherapyLake — ABA Scheduling Software (blog)](https://blog.therapylake.com/aba-scheduling-software/)
- [TherapyLake — Scheduling for Growing Practices (blog)](https://blog.therapylake.com/aba-scheduling-software-for-growing-practices-what-to-prioritize/)
- [TherapyLake — Capterra](https://www.capterra.com/p/10028745/TherapyLake/)
- [TherapyLake — GetApp](https://www.getapp.com/all-software/a/therapylake/)
- [TherapyLake — App Store](https://apps.apple.com/us/app/therapylake/id6450555754)

---

# Part 2: Secondary Tier & Specialized Platforms

**Date:** 2026-03-27
**Scope:** Secondary-tier and specialized ABA platforms — scheduling/calendar features
**Platforms:** CentralReach, AlohaABA, Raven Health, Motivity, ABA Matrix, Noteable, Artemis ABA, PortiaPro

---

## Executive Summary (Secondary Tier)

These 8 platforms span from enterprise (CentralReach) to clinical-first (Motivity) to niche-specialized (PortiaPro for Canadian support). Key findings that complement the primary-tier research:

1. **CentralReach ScheduleAI sets the enterprise ceiling.** Full AI schedule generation, route optimization, bulk conversion — but it's complex, expensive, and enterprise-only. This is what NOT to build for small practices.
2. **AlohaABA is the closest comp to Clinivise's target market.** Simple, affordable ($29.99/staff), 5 calendar views, EVV/geotag built-in. The scheduling UX benchmark for small practices.
3. **Motivity brings the smartest auth-awareness.** Pre-booking authorization checks, AI conflict detection, travel time automation, billing time freeze. Clinical intelligence applied to scheduling.
4. **ABA Matrix has the richest event type system.** 8 built-in event types (BT, supervision variants, family training, assessments), per-client color customization, and multi-step supervision signature workflows.
5. **Artemis ABA has the best appointment creation UX.** Pre-filled fields from client/provider records, multi-provider per session, drag-and-drop Day Planner.
6. **PortiaPro has the most granular permissions.** Role-based scheduling access down to individual billing codes per user. 4-level schedule hierarchy (Master/Team/User/Client).
7. **Noteable is the multi-discipline play.** One calendar for ABA + OT + Speech + CMH. Notes-to-claims automation.
8. **Raven Health wins on simplicity.** 5-field appointment creation, mobile-first, 30-day free trial, fastest onboarding.

---

## Platform-by-Platform Analysis

### 6. CentralReach (centralreach.com)

**Positioning:** Enterprise ABA, 4,000+ practices. The incumbent with the most comprehensive (and complex) scheduling system.

#### Calendar Views
- **View My Calendar** — 5 sub-views: Day, Week, Month, List, and Planner.
- **View Day Planner** — Side-by-side multi-provider hourly view; designed for comparing multiple employee calendars and finding availability across providers. Ideal for schedulers managing large teams.
- **View As Grid** — Table/spreadsheet format showing all appointments with full detail columns. Used for auditing unconverted appointments, identifying unauthorized appointments, and reviewing cancelled/deleted appointments across date ranges.
- Calendar is **color-coded by provider** (each provider gets a unique color). Dotted lines = proposed/draft events; solid lines = confirmed events.
- **Custom labels** (e.g., "Assessment," "Parent Training") add additional color coding beyond provider colors.

#### Appointment Creation Flow
- **Required fields:** Primary Provider, Client ("Appointment with"), Date/Time, Location/Address (pulled from client profile dropdown), Service Codes (CPT codes from client's authorization).
- **Authorization linking:** Under an "Authorizations & Billing" section in the appointment form, add individual service codes from the client's authorization. Adjust code time lengths to match appointment duration. Multiple CPT codes per appointment are supported.
- **Additional participants:** Can add beyond the primary provider (e.g., supervisor, observer).
- **Recurring series:** Creating a recurring appointment creates an "Event" within a "Course" (series). All appointments in a recurring series share the same Course ID for tracking.
- **Location/address dropdown:** Includes client's home address from profile, plus any previously-used addresses.

#### Key Scheduling Features
- **CR ScheduleAI (add-on module):** AI agent (cari) drafts, modifies, and optimizes entire weekly schedules in minutes. One-click publish from draft to live calendar. Reported 50% reduction in scheduling time (one org went from 8-10 hours to 2-2.5 hours weekly).
- **Drag-and-drop:** Reschedule by dragging in My Calendar or Day Planner. Adjustable down to the minute.
- **Labels system:** Custom labels with colors for tracking appointment types. Labels can be filtered across all three views.
- **Scheduling Filters Panel:** Filter by label, provider, client, appointment type, status across any view.
- **Route optimization (ScheduleAI):** Minimizes drive time between in-home appointments for providers.
- **Conflict detection:** Built-in compliance safeguards checking credentialing, authorization limits, and labor law rules.
- **Schedule validation:** Shows specific authorization error details when booking outside authorized date ranges or exceeding units.
- **Print schedules:** Export calendar view as printable document.

#### Session Conversion
- **Appointment → Timesheet (billing entry):** Click the lightning bolt icon on a completed appointment to convert it to a timesheet. The timesheet contains all billing-required information.
- **Bulk conversion:** Convert multiple appointments at once from Day Planner view.
- **Permissions for conversion:** Organization account, employees with billing permissions, the primary provider, or any participant can convert.
- **Grid auditing:** Grid view highlights unconverted appointments, making it easy for billing staff to identify missed conversions.
- **Enable others to convert:** Permission setting allows schedulers to convert other employees' appointments.

#### Auth-Aware Scheduling
- Authorization codes are directly linked during appointment creation via the "Authorizations & Billing" section.
- Schedule validation displays specific authorization error details when appointments violate auth constraints.
- ScheduleAI optimizes across authorization hour limits and payor requirements automatically.

#### Unique Differentiators
- **AI schedule generation (ScheduleAI):** The only platform that can generate entire optimized schedules from scratch. Considers therapist expertise, client needs, location logistics, auth hours, and payor rules simultaneously.
- **Three distinct calendar interfaces:** My Calendar (personal), Day Planner (multi-provider comparison), Grid (audit/table view). More views than any other platform.
- **Appointment → Timesheet conversion with lightning bolt icon:** Explicit, auditable conversion step.
- **Course/Event model for recurring:** Sophisticated tracking of recurring appointment series.
- **Upcoming features:** Embedded Cancellations (auto-reoptimize around absences), Interactive Drafts (real-time bulk editing before publishing).

#### Pricing
- Starts ~$50-59/user/month (Essential plan).
- Three tiers: Essential (scheduling + billing), Professional (+ RCM, telehealth), Enterprise (custom).
- ScheduleAI is a separate add-on module — enterprise pricing, not publicly listed.
- Users frequently note that add-on costs are a significant concern.

#### Public Documentation Level
**High.** Extensive help center (help.centralreach.com) with step-by-step guides. Community forum (community.centralreach.com) with knowledge articles. Most well-documented scheduling system of all platforms researched.

---

### 7. AlohaABA (alohaaba.com)

**Positioning:** Popular small-practice PM. Known for simplicity and ease of onboarding.

#### Calendar Views
- **Five views:** Day, Week, Month, List, and Timeline.
- **Dual perspective:** Toggle between Staff view and Client view.
- **Multi-schedule viewing:** View multiple provider/client schedules simultaneously to compare availability.

#### Appointment Creation Flow
- **Appointment types:** Billable sessions, non-billable activities, drive time, mileage tracking, and breaks — all as distinct appointment types.
- **Data captured:** Staff/client signatures, timestamps, dates, geolocation (geotag for EVV).
- **Recurring:** One-click recurring appointment creation.
- **Authorization verification:** Check authorization utilization directly during scheduling.

#### Key Scheduling Features
- **Scheduling validations:** Built-in checks that minimize billing errors at booking time.
- **Unavailability tracking:** Monitor staff and client blockers.
- **Geotag/GPS capture:** Location data recorded with every appointment for Medicaid EVV compliance.
- **Signature capture:** Staff and client signatures tied to appointments.
- **Conflict detection:** Advanced algorithms considering therapist availability, location, and client needs.
- **Automated reminders:** Email/text to reduce no-shows.

#### Session Conversion
- Sessions created directly from scheduled appointments. Platform links scheduling to billing natively.
- Simple workflow for adding authorizations and logging sessions.

#### Auth-Aware Scheduling
- Verify authorization utilization directly during scheduling.
- Scheduling validations flag potential billing errors before appointment is confirmed.

#### Unique Differentiators
- **Geolocation/EVV built-in:** GPS geotag on every appointment. Critical for Medicaid EVV compliance states.
- **Drive time & mileage as appointment types:** Scheduled alongside sessions, not just tracked after the fact.
- **Timeline view:** Horizontal timeline visualization unique among competitors.
- **Staff learn scheduling in 30-45 minutes:** Users report clinical staff complete scheduling training during orientation.
- **Five views (Day/Week/Month/List/Timeline):** Tied for most standard views with CentralReach's My Calendar.

#### Pricing
- **Practice Management:** $29.99/staff/month (includes scheduling, billing, payroll, auth management, client portal, AR, reporting).
- **One Simple Solution:** $39.99/client/month (PM + data collection).
- **Data Collection add-on:** $12/client/month.
- Scheduling is included in the base PM plan — no separate charge.

#### Public Documentation Level
**Medium.** Zoho Desk help portal for support. Feature pages describe capabilities at a functional level. Help docs are behind authentication.

---

### 8. Raven Health (ravenhealth.com)

**Positioning:** Mobile-first, BCBA-founded. Targeting growing practices. Fastest onboarding.

#### Calendar Views
- **Multi-view color-coded calendars** — specific view types (day/week/month) available but not individually enumerated in public docs.
- **Shared calendars** for team-wide visibility of all appointments.
- **Multi-location view:** See appointments across all practice locations in real time.

#### Appointment Creation Flow
- **5-field quick setup:** Date, Time, Client, Staff member, Billing code. The simplest booking flow of any platform studied.
- **Recurring:** Set sessions to recur automatically with one setup.
- **Group sessions:** Support for multi-client sessions.
- **Multi-therapist:** Coordinate multiple providers on a single session.

#### Key Scheduling Features
- **Drag-and-drop:** User-friendly interface for scheduling and rescheduling appointments.
- **Color coding:** Appointment statuses, types, and locations are visually differentiated with colors.
- **Automated reminders:** For both clients and staff.
- **Multi-location scheduling:** Coordinate across all practice locations in real time.
- **Offline capability:** Data collection and appointment management continue offline with auto-sync when reconnected.
- **Conflict prevention:** Shared calendars + automated tools prevent double-booking and last-minute conflicts.

#### Session Conversion
- Appointments flow into data collection and session documentation.
- Offline data syncing keeps sessions connected even without internet access.

#### Auth-Aware Scheduling
- Authorization limits are referenced during scheduling (supervision ratios, authorization limits mentioned).
- Not explicitly documented as a hard block at booking time.

#### Unique Differentiators
- **Simplest appointment creation:** 5 fields is the minimum in the industry. Removes friction for busy RBTs.
- **Mobile-first design:** Scheduling designed primarily for phone/tablet use. RBTs schedule on the go.
- **Offline functionality:** Critical for in-home providers with unreliable internet.
- **30-day free trial** with no credit card required.
- **Fastest onboarding:** Multiple sources report Raven Health as quickest to get started.

#### Pricing
- **Data Collection Essentials:** $29/user/month.
- **Managed Billing Bundle:** 5% of monthly claims paid.
- **Self-Billing Package:** 2% of monthly claims submitted.
- **Implementation fee:** $300 (up to 25 clients).
- 30-day free trial.

#### Public Documentation Level
**Low.** Feature pages are marketing-oriented. Help docs not publicly accessible. The website is JS-rendered, limiting scraping.

---

### 9. Motivity (motivity.net)

**Positioning:** Clinical-first, research-grant funded. Expanding from data collection into PM. Strong AI scheduling capabilities.

#### Calendar Views
- **All Providers Scheduling View:** Side-by-side comparison of staff and client schedules. See gaps and ensure coverage at a glance.
- Day/week/month views exist for clinical data tracking (targets mastered over periods).
- Specific calendar view breakdown (day/week/month/list) not individually documented for scheduling.

#### Appointment Creation Flow
- **Rule-based automation:** Set scheduling rules once; Motivity auto-populates appointments based on those rules.
- **Compliance checks at creation:** Automatically applies compliance, capacity, and commitment checks.
- **Provider matching:** AI matches clients with best-fit providers based on credentials and availability.
- **Drive time auto-calculation:** Automatically calculates and adds travel time for in-home sessions between appointments.

#### Key Scheduling Features
- **AI Scheduler:** Catches conflicts, balances hours across providers, keeps sessions aligned with eligibility and authorizations.
- **Smart overlap detection:** Automatically identifies and alerts on patient and provider scheduling conflicts.
- **Cancellation management:** Automated waitlist tool handles outreach when cancellations occur.
- **Cancellation trend insights:** Analytics on cancellation patterns — understand patterns to optimize scheduling.
- **Drive time automation:** Eliminates scheduling overlaps for in-home providers by auto-building travel time into the schedule.
- **Billing time freeze:** Locks session times after billing to prevent accidental retroactive edits.
- **Role-based billing optimization:** Auto-bills at the highest compliant role for maximum reimbursement.

#### Session Conversion
- Sessions created from scheduled appointments with compliance checks throughout.
- Billing integration: optimized role-based billing from scheduled sessions.
- Billing time freeze prevents post-billing modifications.

#### Auth-Aware Scheduling
- **Pre-booking validation:** System double-checks provider eligibility and authorization limits BEFORE a session goes on the calendar.
- **Proactive alerts:** Surfaces warnings when scheduled hours fall outside approved limits.
- **Work pattern detection:** Identifies scheduling patterns that might cause end-of-month authorization surprises.

#### Unique Differentiators
- **AI scheduling rules:** "Set rules once and let Motivity organize" — second-most automated scheduling after CentralReach ScheduleAI, but more accessible and included in base pricing.
- **Travel time auto-calculation:** Unique automatic drive time scheduling. Only Motivity and Theralytics offer this.
- **Cancellation trend analytics:** Data-driven insights on when and why cancellations happen.
- **Billing time freeze:** Unique feature preventing retroactive schedule edits after billing.
- **Clinical-first approach:** Scheduling designed around clinical requirements (auth compliance, supervision ratios) rather than just administrative convenience.

#### Pricing
- **Data Collection:** $24/learner/month.
- **Practice Management:** $24/learner/month (includes scheduling, billing, auth tracking).
- **All-in-One:** $48/learner/month.
- **Enterprise:** Custom pricing (BI tools, custom dashboards, intake portal).
- Contract terms: 12-month standard; 24/36-month with savings; month-to-month available.
- Bulk discounts available.

#### Public Documentation Level
**Medium.** Feature pages describe capabilities well. Help docs (help.motivity.net) have some public content. Instagram demos referenced but not transcribed.

---

### 10. ABA Matrix (abamatrix.com)

**Positioning:** All-in-one with AI narratives, strong graphing tools. Research-oriented.

#### Calendar Views
- **Four views:** Daily, Weekly, Monthly, and List.
- **Per-client color customization:** Personalize each client's calendar color via a settings icon. Unique feature.
- **"Display My Visits Only" toggle:** Switch between personal schedule and all-provider view for selected clients.
- **Filters:** By client (select/deselect all or specific), event type (8 categories), and status (In Progress, Reviewing, Incomplete, Completed).
- **Color coding by status:** Locked sessions (pink), cancelled (distinctive color), in-review (green), completed (separate color). Plus per-client custom colors.

#### Appointment Creation Flow
- **Required fields (asterisk-marked):** Event type, Client, Session date, Start time, End time, Location, Procedure.
- **Eight event types:** Behavior Treatment Session, Individual Supervision, Group Supervision, RBT Competency Check, Family Training, Medical Visit, Assessment, Reassessment. Plus customizable "Other" events for non-billable activities (trainings, documentation work).
- **Auto-fill:** Therapist name auto-populated based on logged-in account.
- **Recurring:** Set events to repeat weekly for N consecutive weeks (e.g., 4 weeks for a monthly schedule).
- **Signature requirement:** If a caregiver signature has been obtained and you reschedule, the signature must be recollected.

#### Key Scheduling Features
- **Real-time validation:** Checks therapist availability, insurance rules, and service limits in real time during scheduling.
- **Conflict/overlap alerts:** Automatic alerts for conflicts, overlaps, cancellations, or no-shows.
- **Scheduling restrictions:** Block individual therapists from scheduling on specific dates/times (days off, blocked hours, other commitments).
- **Symbol/icon system:** Each event type has a distinctive symbol AND color on the calendar for quick visual scanning.
- **"Other" custom events:** Fully customizable non-billable events for internal activities.

#### Session Conversion
- Events progress through a **status workflow:** In Progress → Reviewing → Completed.
- Session notes accessed directly from calendar event via "GO TO REPORT" button.
- **Multi-step supervision signature workflow:** Analyst creates and signs supervision → supervised RBT/BCaBA reviews and counter-signs → session status moves to completed.
- Notes include a Daily Log (structured narrative) and Data Collection sections.
- Events can be deleted from the edit interface.

#### Auth-Aware Scheduling
- Insurance rules and service limits checked **in real time** during scheduling.
- Prevents scheduling beyond authorized limits.
- Authorization errors surfaced at booking time.

#### Unique Differentiators
- **Per-client calendar colors:** Only platform that lets you customize colors per individual client — big UX win for visual scanning of dense schedules.
- **8 built-in event types:** Most comprehensive event type system. Covers the full spectrum of ABA activities (BT, both supervision types, competency checks, family training, medical visits, assessments).
- **Scheduling restrictions for providers:** Dedicated feature to proactively block scheduling during unavailable periods.
- **Multi-step supervision signature workflow:** Built into the calendar/session flow — supervision isn't just scheduled, it's tracked through review and counter-signature.
- **Symbol + color dual coding:** Both icon shapes and colors differentiate event types — supports colorblind users better than color-only systems.

#### Pricing
- Custom pricing (not publicly listed).
- No free plan available.
- Billed per unit (not per client or per therapist) — unique pricing model.
- Contact sales for quotes.

#### Public Documentation Level
**High.** ABA Matrix Knowledge Desk (docs.abamatrix.com) with detailed step-by-step guides for every calendar operation. Most comprehensive help docs after CentralReach.

---

### 11. Noteable (mynoteable.com)

**Positioning:** Multi-disciplinary (ABA + OT + Speech + CMH). 98% clean claim rate. 4.7 stars on Capterra (44 reviews).

#### Calendar Views
- Calendar-based scheduling interface (specific day/week/month view options not publicly documented in detail).
- **Unified calendar:** Internal meetings and clinical sessions from ALL disciplines (ABA, OT, Speech, CMH) in one calendar.
- Pre-schedule appointments directly on the calendar.

#### Appointment Creation Flow
- Configurable appointment types for both clinical sessions and internal meetings.
- **One-time and recurring sessions** supported.
- **Multi-discipline:** Schedule ABA, OT, Speech, and CMH sessions from the same calendar — no switching between systems.

#### Key Scheduling Features
- **Drag-and-drop:** Track appointments, clinician availability, and cancellations with drag-and-drop ease.
- **Configurable reminders:** Automated text and email reminders for no-show reduction.
- **Cancellation tracking:** Built-in cancellation monitoring.
- **Client portal scheduling:** Secure space for clients/families to view and manage appointments.
- **Customizable scheduling tools:** Tailored to agency-specific needs and workflows.
- **Multi-discipline calendar:** Single calendar handles all service types without duplicate systems.

#### Session Conversion
- **Notes-to-claims pipeline:** Approved session notes automatically generate clean 837 claims. No duplicate data entry between scheduling → documentation → billing.
- Standard plan: export claims for in-house billing. Elite plan: full end-to-end RCM through Noteable's team.
- Supervision workflows with e-signatures and approval trails.

#### Auth-Aware Scheduling
- **Authorization burn-down tracking:** Alerts before authorization limits are hit.
- Not explicitly documented as a blocking mechanism at scheduling time.

#### Unique Differentiators
- **Multi-discipline support in one calendar:** The only platform in either tier that natively supports ABA + OT + Speech + CMH scheduling in a single interface. Practices running multiple disciplines don't need a second system.
- **Notes-to-claims automation:** The cleanest documented path from approved session notes to 837 claim generation.
- **Client/family portal:** Families can manage appointments through a secure portal — rare in ABA-specific tools.
- **Single-tier support:** Every customer gets the same support quality — no premium support tiers.
- **"Learned in a day":** Users report full staff onboarding in one day.

#### Pricing
- **Standard:** $300/month base (includes first 5 users). Additional users: tiered pricing ($50/user for 6-10, scaling down to $10/user for 51+).
- **Elite:** 3.9% of monthly claims paid (no platform fee stacked on top). Full-service RCM with dedicated specialist.
- **Pro:** Coming soon (automated claims for in-house billing teams).
- **Add-ons:** Telehealth $25/mo, Faxing $25/mo (both free with Elite).
- Scheduling included in all plans.

#### Public Documentation Level
**Low.** Marketing-oriented feature pages. Help docs behind authentication (account.mynoteable.com). Limited public operational detail.

---

### 12. Artemis ABA (artemisaba.com)

**Positioning:** Salesforce-built, AI session notes/treatment plans. Sophisticated scheduling with enterprise backbone.

#### Calendar Views
- **Four views:** Month, Week, Day, and List.
- **Day Planner:** Dedicated view designed to prevent appointment overlaps. Detailed hourly view with drag-and-drop.
- **Real-time dashboard:** See scheduled, completed, or canceled sessions in real time.
- **Filters:** Date of service, location, provider, and more.
- **Color coding by status:** Open slots, conflicts, and assignments are visually distinguished.

#### Appointment Creation Flow
- **Pre-filled fields:** Client, provider, and insurance details auto-populated from existing records — minimal manual data entry.
- **Multi-provider per session:** Schedule multiple providers (including supervising staff) to each session.
- **Recurring:** Daily, weekly, or monthly recurring with single-click setup.
- **Predefined cancellation reasons:** Quick cancellation processing with structured reason codes.
- **Compliance checks at creation:** Built-in validation during appointment creation.

#### Key Scheduling Features
- **Drag-and-drop Day Planner:** Drag providers and clients into sessions instantly. Reschedule cancellations in seconds with real-time system-wide updates.
- **Smart matching:** AI-powered therapist-client matching based on needs, availability, location, and qualifications.
- **Proactive conflict detection:** Identifies overlapping sessions before they disrupt services. Dedicated conflict reporting tools.
- **Real-time availability tracking:** View available vs. booked hours before scheduling.
- **Automated reminders:** Reduce no-shows.
- **Auto-complete sessions:** Based on practice signature preferences — sessions auto-close when conditions are met.

#### Session Conversion
- Authorization checking occurs before session confirmation.
- **Billable vs. non-billable time management** during scheduling prevents billing errors.
- Session flows: scheduling → AI-assisted session notes → billing/claims.
- **EVV (Electronic Visit Verification)** supported for Medicaid compliance.

#### Auth-Aware Scheduling
- **Available vs. booked hours displayed** before scheduling new appointments.
- **Insurance authorization caps tracked** in real time during scheduling.
- **Conflict resolution** considers both provider availability AND authorized units/hours.

#### Unique Differentiators
- **Salesforce platform backbone:** Built on Salesforce Cloud — enterprise security, extreme customization capability, API access for third-party integrations.
- **Pre-filled appointment fields:** Best appointment creation UX. Auto-populating client, provider, and insurance details eliminates repetitive data entry.
- **AI session notes + treatment plans:** AI assists with documentation generated from scheduled/completed sessions. Unique among scheduling-focused features.
- **Day Planner drag-and-drop:** Most polished drag-and-drop implementation described across all platforms.
- **Multi-provider per session:** Schedule supervisor + RBT on the same session from the scheduler itself — important for supervision tracking.
- **Auto-complete sessions:** Novel feature that auto-closes sessions based on practice signature preferences.

#### Pricing
- **Emerging:** $39.99/user/month (includes basic scheduling, client management, session notes, data collection, basic billing, onboarding support).
- **Enterprise:** Custom pricing (includes advanced scheduling, advanced data collection with mobile app, Trizetto clearinghouse, dedicated success manager, API access, custom portal).
- 30-day free trial with guided setup and daily Zoom support.
- No long-term commitment required — cancel anytime.

#### Public Documentation Level
**Medium.** Feature pages have good functional detail. Blog content is practical. Help docs not publicly accessible. Product summary page provides feature matrix.

---

### 13. PortiaPro (portiapro.com)

**Positioning:** All-in-one with Canadian support. "Therapy-first" software. Strong role-based access control.

#### Calendar Views
- **Four hierarchical views:**
  1. **Master Schedule** — Organization-wide view across all staff and clients.
  2. **Team Schedule** — Department/team-level view.
  3. **User Schedule** — Individual provider calendar.
  4. **Client Schedule** — Per-client appointment view.
- All presented in "familiar calendar format."
- Role-specific view access — different roles see different schedule levels.

#### Appointment Creation Flow
- **Role-based code access:** Scheduling access customized down to individual billing code level. Only authorized CPT codes appear for each user based on their role.
- **Per-learner billing codes:** When scheduling, therapists select from billing codes that are specifically authorized for each individual learner.
- **Mobile scheduling:** Therapists schedule their own sessions on the go.
- **Centralized + ad-hoc:** Supports both admin-managed central scheduling and therapist-initiated ad-hoc scheduling.

#### Key Scheduling Features
- **Granular role-based permissions:** Control who can schedule what codes, for which clients, at what times. Most granular scheduling permissions of any platform.
- **Scheduling limits:** Set caps at clinic level, staff level, and learner level.
- **Authorization safeguards:** Built-in controls for over- and under-billing within authorization limits.
- **High-visibility reporting:** Scheduling compliance reports.
- **Mobile scheduling:** Therapists can schedule from anywhere on any device.
- **FIPA + HIPAA + HITECH compliant:** Country-specific data storage (US data in US, Canadian data in Canada).

#### Session Conversion
- **Pre-loaded claims:** All rendered sessions are pre-loaded with correct billing codes and all required claim data. No manual data re-entry.
- **Claims scrubbing:** All claims are scrubbed and verified prior to submission to insurance companies.
- Workflow: Scheduling → Session rendering → Pre-loaded claim → Scrubbing → Submission.

#### Auth-Aware Scheduling
- **Authorization safeguards:** Over- and under-billing controlled with built-in safeguards and high-visibility reports.
- **Per-learner code filtering:** Only authorized billing codes for each learner appear during scheduling — prevents unauthorized service booking at the UI level.
- **Scheduling limits:** Caps set at clinic, staff, and learner levels to prevent over-scheduling.

#### Unique Differentiators
- **Canadian compliance:** Only platform in either tier with native Canadian province support (FIPA compliance, provincial billing rules, BABA involvement).
- **Country-specific data residency:** US data stays in US data centers, Canadian data in Canadian data centers.
- **Role-based scheduling to billing code level:** Most granular permissions. Not just "can this user schedule" but "can this user schedule THIS CPT CODE for THIS CLIENT."
- **4-level schedule hierarchy (Master → Team → User → Client):** Unique organizational structure. Most platforms offer 2-3 views max.
- **Scheduling as "nexus":** PortiaPro explicitly positions scheduling as the center of the ABA clinic operating system — not an add-on feature.

#### Pricing
- **Base fee:** $30/month USD (includes 1 free training learner).
- **Per learner:** $30/month USD.
- **No setup fees.**
- **Free training and support included.**
- **Full-service billing:** Available with discount on per-client software fees.
- **Volume discount:** Clinics billing >$500K/month get reduced per-client PM fees.
- Self-serve billing: clearing house fees paid directly ($0.40/claim, $0.40/eligibility check).

#### Public Documentation Level
**Medium.** Feature pages describe capabilities at a functional level. Release notes are public. Help docs not extensively published. Blog content is practical.

---

## Cross-Platform Comparison Matrix (All 13 Platforms)

### Calendar Views

| Platform | Views Available | Multi-Provider Comparison |
|---|---|---|
| **CentralReach** | Day/Week/Month/List/Planner + Day Planner + Grid | Day Planner (side-by-side) |
| **AlohaABA** | Day/Week/Month/List/Timeline | Multi-schedule simultaneous |
| **Raven Health** | Multi-view (color-coded) | Shared calendars |
| **Motivity** | All Providers View + data views | Side-by-side provider/client |
| **ABA Matrix** | Day/Week/Month/List | "Display My Visits" toggle |
| **Noteable** | Calendar (views unspecified) | Unified multi-discipline |
| **Artemis ABA** | Month/Week/Day/List + Day Planner | Day Planner |
| **PortiaPro** | Master/Team/User/Client (4-level hierarchy) | Master + Team views |

### Scheduling Intelligence

| Platform | AI Scheduling | Auth Validation | Conflict Detection | Travel Time |
|---|---|---|---|---|
| **CentralReach** | ScheduleAI (full gen) | Auth codes linked at booking | Compliance safeguards | Route optimization |
| **AlohaABA** | No | Utilization check at booking | Algorithm-based | Drive time as appt type |
| **Raven Health** | No | Referenced, not blocking | Shared calendar prevention | No |
| **Motivity** | AI rules + matching | Pre-booking auth check | Smart overlap detection | Auto-calculated |
| **ABA Matrix** | No | Real-time insurance rules | Real-time alerts | No |
| **Noteable** | No | Burn-down alerts | Not confirmed | No |
| **Artemis ABA** | AI matching | Available vs. booked hours | Proactive + reporting | No |
| **PortiaPro** | No | Per-learner code filtering | Not confirmed | No |

### Session Conversion & Billing Flow

| Platform | Conversion Method | Bulk Convert | Auto-Populate Claims |
|---|---|---|---|
| **CentralReach** | Lightning bolt → Timesheet | Yes (Day Planner) | Yes |
| **AlohaABA** | Native linking | Not confirmed | Yes |
| **Raven Health** | Flows to data collection | Not confirmed | Not confirmed |
| **Motivity** | Compliance-checked + billing freeze | Not confirmed | Yes |
| **ABA Matrix** | Status workflow (In Progress → Completed) | Not confirmed | Via notes |
| **Noteable** | Approved notes → 837 claims | Not confirmed | Yes (best documented) |
| **Artemis ABA** | Auth check → session → AI notes | Not confirmed | Yes |
| **PortiaPro** | Pre-loaded claims + scrubbing | Not confirmed | Yes |

### Unique Strengths Per Platform

| Platform | Primary Differentiator |
|---|---|
| **CentralReach** | AI schedule generation (ScheduleAI) |
| **AlohaABA** | EVV/geotag + drive time as appointment type |
| **Raven Health** | 5-field simplest booking + mobile-first + offline |
| **Motivity** | AI auth validation + travel time automation + billing freeze |
| **ABA Matrix** | 8 event types + per-client colors + supervision workflow |
| **Noteable** | Multi-discipline calendar (ABA + OT + Speech + CMH) |
| **Artemis ABA** | Pre-filled fields + Salesforce backbone + AI notes |
| **PortiaPro** | Role-based code-level permissions + Canadian compliance |

---

## Updated Key Patterns for Clinivise (Combined Primary + Secondary Research)

### Table Stakes (every platform has these)
1. **Multiple calendar views** — Day/Week/Month minimum. Most have 4+ views.
2. **Color-coded appointments** — by status, type, or provider. ABA Matrix adds per-client colors.
3. **Authorization validation at booking** — warn or block when exceeding approved units/dates.
4. **Recurring appointments** — weekly is the most common ABA recurrence pattern.
5. **Conflict detection** — prevent double-booking providers.
6. **Session-to-billing connection** — scheduled appointments must flow into billable sessions.
7. **Automated reminders** — email and/or text for no-show reduction.
8. **Filtering** — by provider, client, status, type at minimum.

### Strong Differentiator Opportunities
1. **Multi-provider comparison view** — CentralReach Day Planner, AlohaABA multi-schedule, Motivity All Providers View. Schedulers need to see multiple providers at once.
2. **Pre-filled appointment creation** — Artemis's auto-populate from client/provider records. Reduces clicks.
3. **Auth units visible during booking** — Motivity's pre-booking auth check, Artemis's available vs. booked display. Show remaining auth hours RIGHT on the booking form.
4. **One-click session conversion** — CentralReach's lightning bolt, Noteable's notes-to-claims flow.
5. **Per-client color customization** — ABA Matrix feature. Simple to implement, big visual payoff.
6. **Role-based scheduling permissions** — PortiaPro's code-level access control. Important as practices grow.

### What to Build for MVP (Clinivise Phase)
Based on competitive positioning against AlohaABA, Raven Health, TherapyPM tier:

1. **Calendar views:** Day + Week + Month. Plus a "Provider Day" view showing multiple providers side-by-side (similar to CentralReach Day Planner but simplified).
2. **Appointment creation:** 5-7 fields max (Client, Provider, Date, Start/End time, CPT code, Location). Auto-link authorization. Show remaining auth units in the form.
3. **Recurring:** Weekly recurring with end date. One-click setup.
4. **Conflict detection:** Warn on provider double-booking. Warn when exceeding auth units. Don't block (consistent with existing session validation philosophy).
5. **Color coding:** Status-based (scheduled/in-progress/completed/cancelled). Consider per-client as a v2 enhancement.
6. **Drag-and-drop:** For rescheduling. Essential from day one.
7. **Session conversion:** One-click "Start Session" from scheduled appointment, pre-filling the session log form.
8. **Filtering:** By provider, client, status, date range.

### What to Skip for MVP
- AI schedule generation (CentralReach/Motivity level)
- Route optimization / travel time calculation
- External calendar sync (Google/Outlook)
- EVV/geotag (Phase 3+ with mobile)
- Room management
- Billing time freeze
- Client portal scheduling

---

## Sources (Secondary Tier)

- [CentralReach ScheduleAI Product Page](https://centralreach.com/products/scheduleai/)
- [CentralReach Help: Calendar Views and Icons](https://help.centralreach.com/calendar-views-and-icons/)
- [CentralReach Help: View As Grid](https://help.centralreach.com/view-as-grid/)
- [CentralReach Help: View My Calendar](https://help.centralreach.com/view-my-calendar/)
- [CentralReach Help: Day Planner](https://community.centralreach.com/s/article/How-to-View-the-Day-Planner)
- [CentralReach Help: Drag and Drop](https://help.centralreach.com/reschedule-appointments-drag-and-drop-feature/)
- [CentralReach Help: Converting Appointments to Timesheet](https://help.centralreach.com/converting-appointments-to-a-timesheet-from-my-calendar/)
- [CentralReach Help: Bulk Convert Appointments](https://help.centralreach.com/how-to-bulk-convert-appointments/)
- [CentralReach Help: Scheduling Labels](https://community.centralreach.com/s/article/How-To-Create-and-Apply-Scheduling-Labels)
- [CentralReach Help: Appointment Types](https://help.centralreach.com/appointment-types/)
- [CentralReach Help: Schedule Validation Authorization Errors](https://help.centralreach.com/schedule-validation-authorization-error-details/)
- [CentralReach Help: Edit Client Appointment Authorization Codes](https://help.centralreach.com/edit-client-appointment-authorization-codes/)
- [CentralReach Help: Scheduling Module Guide](https://help.centralreach.com/scheduling-module-guide-to-schedule-client-appointments/)
- [CentralReach Blog: Simplifying ABA Scheduling](https://centralreach.com/blog/simplifying-aba-scheduling-reduce-stress-fill-gaps-and-boost-utilization/)
- [CentralReach on Capterra](https://www.capterra.com/p/140743/CentralReach/)
- [AlohaABA Scheduling Features](https://alohaaba.com/features/scheduling)
- [AlohaABA Pricing](https://alohaaba.com/pages/pricing)
- [AlohaABA Blog: Managing Your Schedule](https://alohaaba.com/blogs/managing-your-aba-therapy-schedule-like-a-pro-tips-for-success)
- [Raven Health Scheduling](https://ravenhealth.com/key-features-scheduling/)
- [Raven Health Pricing](https://ravenhealth.com/pricing/)
- [Raven Health on GetApp](https://www.getapp.com/healthcare-pharmaceuticals-software/a/raven-health/)
- [Raven Health on SoftwareAdvice](https://www.softwareadvice.com/product/517989-Raven-Health/)
- [Motivity Scheduling](https://www.motivity.net/solutions/aba-scheduling)
- [Motivity All Providers View](https://www.motivity.net/features-pm/all-providers-scheduling-view)
- [Motivity Practice Management](https://www.motivity.net/solutions/aba-practice-management-all-in-one)
- [Motivity Pricing](https://www.motivity.net/pricing)
- [ABA Matrix Knowledge Desk: Calendar & Sessions](https://docs.abamatrix.com/category/189-calendar-therapy-session)
- [ABA Matrix: Therapist Calendar Guide](https://docs.abamatrix.com/article/449-how-to-use-the-calendar-from-a-therapist-account)
- [ABA Matrix: Create and Edit Events](https://docs.abamatrix.com/article/445-how-to-create-and-edit-events-in-the-system)
- [ABA Matrix: Interface and Workflow Icons](https://docs.abamatrix.com/article/434-symbology-in-aba-matrix)
- [ABA Matrix: Staff Quick Guide](https://docs.abamatrix.com/article/626-quick-guide-for-staff-members)
- [ABA Matrix: Scheduling Restrictions](https://docs.abamatrix.com/article/593-how-to-add-a-restriction-for-assistants-and-analysts)
- [ABA Matrix Blog: Scheduling for Better Outcomes](https://www.abamatrix.com/aba-scheduling-made-simple-for-better-outcomes/)
- [Noteable ABA](https://mynoteable.com/aba)
- [Noteable Your ABA Practice](https://mynoteable.com/your-aba-practice)
- [Noteable Pricing](https://mynoteable.com/pricing)
- [Noteable on Capterra](https://www.capterra.com/p/203725/Noteable/)
- [Noteable on GetApp](https://www.getapp.com/healthcare-pharmaceuticals-software/a/noteable/)
- [Artemis ABA Scheduler](https://www.artemisaba.com/products-and-services/aba-scheduler)
- [Artemis ABA Scheduler (alt page)](https://www.artemisaba.com/scheduler)
- [Artemis ABA Product Summary](https://www.artemisaba.com/artemis-product-summary)
- [Artemis ABA Pricing](https://www.artemisaba.com/pricing)
- [PortiaPro Features](https://www.portiapro.com/product/features/)
- [PortiaPro ABA Practice Management](https://www.portiapro.com/aba-practice-management/)
- [PortiaPro Pricing](https://www.portiapro.com/pricing/)
- [Passage Health: ABA Scheduler Software Comparison](https://www.passagehealth.com/blog/aba-scheduler-software)
