# TODOS

Deferred work items tracked from plan reviews and implementation. Each item includes context so it's actionable months later.

---

## High Priority (Fast-Follow After Calendar Ships)

### Provider Availability + Time-Off Tables
**What:** Add `provider_availability` (weekly working hours) and `provider_time_off` (PTO, sick days) tables. Schema already designed in `docs/platform/features/scheduling.md`.
**Why:** Enables booking-time validation ("provider not available on Fridays") and visual blocked/available slots on the calendar. Without this, the calendar can't show when providers are free.
**Pros:** Completes the scheduling story. Prevents double-booking outside hours. Visual feedback for schedulers.
**Cons:** Two new tables + CRUD actions + calendar integration. ~1hr with CC.
**Context:** Explicitly deferred in CEO plan (2026-03-27) as "validation polish, not core workflow." Calendar ships first, availability is the first fast-follow.
**Depends on:** Calendar/scheduling feature must ship first.

### Bulk Reassign / Bulk Cancel for Provider Callouts
**What:** Multi-select sessions on the calendar + "Cancel selected" or "Reassign to [provider]" actions.
**Why:** When an RBT calls out sick, an admin needs to cancel or reassign 5-10 sessions. One-at-a-time drag-drop is unusable for this. Provider callout is the #1 scheduling emergency in ABA (80-100% annual RBT turnover).
**Pros:** Eliminates the biggest admin workflow gap in MVP scheduling.
**Cons:** Multi-select on a calendar is non-trivial UI. May need a list-based "Provider's sessions today" dialog rather than calendar multi-select.
**Context:** Flagged by design review outside voice (2026-03-27). Drag-and-drop covers 1-2 session moves but not bulk operations.
**Depends on:** Calendar/scheduling feature must ship first.

### Print-Friendly Calendar View
**What:** CSS `@media print` styling for the calendar page + optional PDF export.
**Why:** BCBAs and admins frequently print weekly schedules to hand to RBTs or post in clinic.
**Cons:** Low priority. Most users screenshot or share URLs.
**Context:** Flagged by design review (2026-03-27). Explicitly deferred.
**Depends on:** Calendar feature.

### Temporal API Polyfill for Calendar
**What:** Add `@js-temporal/polyfill` for Safari and Firefox browser support of the Schedule-X calendar.
**Why:** Schedule-X resource scheduler uses the Temporal API. Chrome 128+ supports it natively, but Safari and Firefox do not (as of March 2026). Without a polyfill, the calendar won't render in those browsers.
**Pros:** Cross-browser support for all users.
**Cons:** ~40KB bundle size increase. Check if Schedule-X bundles its own polyfill first.
**Context:** Flagged during eng review (2026-03-27). Not blocking for development (Chrome works). Blocking for production with real users. Check Schedule-X docs for recommended polyfill approach.
**Depends on:** Calendar feature implementation.

---

## Deferred Features (from CEO Plan 2026-03-27)

### Google/Outlook Calendar Sync
**What:** Two-way sync with Google Calendar and Outlook. TherapyPM pattern.
**Why:** Providers use personal calendars. Sync prevents double-booking across systems.
**Context:** Requires OAuth integration + webhook infrastructure. Phase 3.

### Drive Time Tracking
**What:** Calculate travel time between home-based client appointments. Theralytics/AlohaABA pattern.
**Why:** RBTs travel between clients. Buffer time prevents late arrivals.
**Context:** Requires geocoding API (Google Maps/Mapbox). Phase 3.

### EVV/GPS Clock-In/Clock-Out
**What:** Electronic Visit Verification for Medicaid compliance.
**Why:** Required by 21st Century Cures Act for Medicaid-funded services in many states.
**Context:** Phase 3. Requires mobile GPS integration.

### Automated Appointment Reminders
**What:** SMS/email reminders to clients/caregivers before appointments.
**Why:** Reduces no-show rate (20-30% in ABA). Standard feature in competitors.
**Context:** Requires SMS provider (Twilio) and email service (Resend). Phase 3.

### Parent/Caregiver Schedule View
**What:** Read-only schedule view for parents with cancel-request capability.
**Why:** Parents need to see upcoming sessions and request cancellations.
**Context:** Phase 4+. Becomes valuable when billing is live (invoice payment).

### Waitlist Auto-Fill
**What:** Automatically offer cancelled slots to waitlisted clients.
**Why:** Maximizes auth utilization by filling gaps from cancellations.
**Context:** Advanced feature. No competitor at our tier has this.

### Supervision Compliance Tracker
**What:** Track BACB 5% monthly supervision requirement per RBT.
**Why:** Certification compliance. BCBAs need to verify supervision hours are met.
**Context:** Separate feature from scheduling. Uses session data.

### Cancellation Analytics
**What:** Dashboard for cancellation reasons, rates by client/provider, trend analysis.
**Why:** Cancellation data already captured in session schema. Analytics is a reports feature.
**Context:** Ship with Reports page (Phase 2B).

### Credential-Gated Booking
**What:** Block scheduling when provider credentials are expired. TherapyLake pattern.
**Why:** Prevents billing with expired licenses/certifications.
**Context:** Deferred. Credential expiry tracking exists but not wired to scheduling.

### AI Scheduling Suggestions
**What:** AI-generated optimal schedules based on auth remaining, provider availability, geography.
**Why:** 10x scheduling efficiency. Only CentralReach (ScheduleAI) and Hipp Health have this.
**Context:** Phase 7+. Enterprise differentiator. Requires availability + drive time data first.

### Room Management
**What:** Track clinic rooms for in-office sessions. Prevent room double-booking.
**Why:** Only relevant for clinic-based practices (not home-based).
**Context:** Deferred indefinitely. Low priority for target market (small practices, mostly home-based).
