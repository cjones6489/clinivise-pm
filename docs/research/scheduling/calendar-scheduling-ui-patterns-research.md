# Calendar & Scheduling UI Patterns Research

> Research scope: Design patterns, React library comparison, accessibility, and performance strategies for building a healthcare scheduling calendar. ABA-specific clinical features are covered by other research agents.

---

## 1. Healthcare/Therapy Calendar UI Analysis

### SimplePractice (Gold Standard for Therapy Scheduling UX)

SimplePractice is widely praised as the best scheduling UX in the therapy practice management space. Key patterns:

**Color Coding System (3 dimensions):**
- **By appointment status** (default): Confirmed = solid block color, unconfirmed = striped/shaded, cancelled = grey with strikethrough, no-show = grey crossed out
- **By clinician**: Each provider gets a distinct color (available on Plus plan)
- **By service code**: CPT/service type gets a color (available on Plus plan)
- Users can toggle between these color modes via a filter dropdown

**Appointment Creation:**
- Click any empty time slot on the calendar to open a flyout panel
- Flyout pre-fills the date/time from where you clicked
- Can configure availability blocks the same way (click slot, select "Availability" at top of flyout)
- Irregular hours supported without committing to recurring schedules

**Calendar Features:**
- Day/week/month view toggles
- Advanced calendar filters: filter by clinician, location, or service type
- Two-way Google Calendar sync (blocks from Google show in SimplePractice and vice versa)
- Automated text + email reminders (significant no-show reduction)
- Mobile-optimized responsive design

**Key Takeaway:** SimplePractice proves that therapy calendar UX should be _fast to read_ (color coding) and _fast to create_ (click-to-book on time slots). No separate booking form page.

### Jane App (Canadian Health Practice Management)

Jane was built by people who operate multiple clinics, which shows in the scheduling UX:

**Multi-Provider Day View:**
- Calendar is the platform's homepage (scheduling is the central workflow)
- View 1, 2, or 3 provider schedules side-by-side
- Available booking slots highlighted in orange for quick identification
- Automatic gap prevention -- Jane schedules to avoid awkward gaps between appointments

**Booking Flow:**
- Click an available slot to create an appointment
- Real-time availability updates across all views
- Self-booking portal for patients (custom-branded, syncs in real time)

**Operational Features:**
- View services, rooms, resources, waitlists, and payment statuses all from the calendar
- Email + text reminders to reduce no-shows
- Multiple locations supported with location-based filtering

**Key Takeaway:** Jane's key innovation is making the calendar the _hub_ of the entire application. The calendar shows not just appointments but also availability, rooms, and payment status. It reduces context switching.

### Healthie (Modern Health Practice Platform)

Healthie provides the most detailed color coding documentation of any competitor:

**Color Scheme Architecture:**
- Multiple named color schemes can be created (e.g., "By Type", "By Provider", "By Status")
- Users toggle between schemes via a filter on the calendar
- Each scheme uses hex code customization
- Administrator changes apply organization-wide; individual provider changes are private

**Status Visualization:**
- Confirmed sessions: solid block color based on active color scheme
- Unconfirmed sessions: striped/shaded pattern
- Cancelled sessions: grey with strikethrough text
- No-show sessions: grey with crossed-out text

**Organization Calendar:**
- Day view shows all organization providers side-by-side
- Each provider column shows their appointments and availability
- Color coding persists across individual and org views

**Key Takeaway:** Healthie's multi-scheme color coding with toggling is the most flexible approach. The visual language for appointment status (solid/striped/grey+strikethrough) is an industry standard pattern worth following.

### Elation Health (Clean EHR Scheduling)

Elation emphasizes simplicity over feature density:

- Straightforward appointment management with color scheme personalization
- Different visit types (sick, follow-up) with type-based color coding
- Automated reminders integrated
- HIPAA-compliant self-scheduling for patients
- Focus on minimizing the learning curve

**Key Takeaway:** Elation proves that a clean, simple calendar beats a feature-dense one. Practitioners value ease of use over configurability.

### Synthesis: Healthcare Calendar Design Patterns

| Pattern | SimplePractice | Jane App | Healthie | Elation |
|---------|---------------|----------|----------|---------|
| Color by status | Default | Yes | Yes (w/ visual variants) | Yes |
| Color by provider | Plus plan | Side-by-side columns | Switchable scheme | Personalized |
| Color by service type | Plus plan | Yes | Switchable scheme | Yes |
| Multi-provider view | Filtered | 1-3 side-by-side | Day view side-by-side | Basic |
| Appointment creation | Click time slot + flyout | Click available slot | Click to create | Standard |
| Calendar as homepage | No (dashboard first) | Yes | No | No |
| Gap prevention | No | Yes (auto-fill) | No | No |

**Consensus patterns for Clinivise:**
1. Click-on-timeslot to create appointments (not a separate form page)
2. Color coding by status as default, with toggle to color by provider or service type
3. Visual status language: solid = confirmed, striped = unconfirmed, grey+strikethrough = cancelled
4. Multi-provider side-by-side day view for office managers / clinical directors
5. Week view as the default landing view (most useful for practitioners)

---

## 2. Top-Tier SaaS Calendar Patterns

### Cal.com (Open Source Scheduling Infrastructure)

Cal.com is the leading open-source scheduling platform (38K+ GitHub stars). Architectural lessons:

**Modular Architecture:**
- Monorepo with a microservices-oriented structure
- Event creation, user management, notifications, and timezone handling are separate modules
- App Store model: modular plugins for integrations (Google Calendar, Zoom, etc.)
- Each service can scale independently

**Booking Flow Patterns:**
- Multi-step booking: select date -> select time -> enter details -> confirm
- Availability shown as clickable time slots (not a full calendar grid)
- Round-robin and collective scheduling for team booking
- Recurring booking support

**Key Takeaway for Clinivise:** Cal.com's approach is _booking-focused_ (external facing) rather than _schedule-management-focused_ (internal facing). For a practice management tool, we need the internal calendar view, not a booking page. But Cal.com's modular approach to timezone handling and availability calculation is worth studying.

### Calendly (Booking Flow Patterns)

Calendly pioneered the modern booking flow:

- Clean date picker -> available time slots -> booking form
- Shows availability in the booker's local timezone
- Duration-based slots (15/30/60 min) with buffer time
- Integration with external calendars for conflict detection

**Key Takeaway:** Calendly's pattern is for _external booking_. For Clinivise's internal scheduling, the relevant lesson is: always show availability context when creating an appointment.

### Google Calendar (The Gold Standard)

Google Calendar defines the patterns users expect from any calendar:

**Views:** Day, week (default for work), month, year, schedule (list), 4-day custom view
**Color Coding:** 11 preset event colors (Tomato, Flamingo, Tangerine, Banana, Sage, Basil, Peacock, Blueberry, Lavender, Grape, Graphite) + custom hex at calendar level
**Event Creation:**
- Click on time slot opens a quick-create popup (title + time only)
- "More options" expands to full form
- Two-tier creation: fast path (popup) and detailed path (full form)
**Responsive Design:**
- Desktop: full week grid with time axis
- Mobile: agenda/list view as default (week grid is too dense for mobile)
- Tablet: 3-day view as a middle ground
**Key Innovations:**
- Events AND tasks unified in the same view
- Side-by-side "other calendars" for shared scheduling
- Natural language event creation ("Coffee with John tomorrow at 3pm")
- Drag-and-drop rescheduling + edge-resize for duration changes

**Key Takeaway:** Google Calendar's two-tier creation (quick popup + full form) is the pattern to follow. Most appointments need minimal info to create; details can be added after. The mobile agenda view pattern is also critical for RBTs using tablets.

### Linear (Timeline/Schedule Views)

Linear's timeline view offers lessons for resource planning:

- Projects displayed as horizontal bars on a time axis
- Draggable bars to adjust start date, duration, and priority
- Zoom levels: week, month, quarter, year
- Progress indicators overlaid on timeline bars
- Dependencies visible between related items
- Real-time collaborative editing

**Key Takeaway:** Linear's timeline pattern is more relevant for authorization period visualization (showing auth periods as horizontal bars) than for daily scheduling. Worth referencing for the "schedule overview" or "provider utilization" view.

---

## 3. React Calendar Library Comparison

### Library Overview

| Feature | FullCalendar | react-big-calendar | Schedule-X |
|---------|-------------|-------------------|------------|
| **License** | MIT (core) + Commercial (premium) | MIT | MIT (core) + Commercial (premium) |
| **Pricing** | Free core; $480/dev/yr for premium | Free | Free core; premium plugins paid |
| **npm Weekly Downloads** | ~1M+ | ~350K+ | ~37K |
| **GitHub Stars** | 19K+ | 7.5K+ | 3K+ |
| **Bundle Size (gzipped)** | ~14KB core | ~2.6MB total | ~997KB total |
| **TypeScript** | Yes | Yes | Yes |
| **React Support** | Official `@fullcalendar/react` | Native React | Official `@schedule-x/react` |
| **Next.js Support** | Yes (client component) | Yes (client component) | Yes (`useNextCalendarApp` hook) |
| **Views** | Day, week, month, list, timeline, resource | Month, week, work week, day, agenda | Day, week, month grid, month agenda |
| **Drag & Drop** | Built-in + external dragging | `withDragAndDrop` HOC | Plugin-based |
| **Resource/Provider View** | Premium (timeline + vertical resource) | Basic via `resourceId` | Premium plugin |
| **Custom Event Rendering** | Yes (via render hooks) | Yes (via `components` prop) | Yes (framework component injection) |
| **Tailwind CSS** | Manual CSS override (no native Tailwind) | Manual CSS override | Theme system (CSS variables) |
| **Date Library** | Built-in (no dependency) | moment / luxon / date-fns / dayjs | Temporal API (with polyfill) |
| **Maturity** | 15+ years, very stable | 8+ years, stable | 2+ years, rapidly growing |
| **Documentation** | Excellent (1000+ code snippets) | Good (164 snippets) | Good (347 snippets) |
| **Accessibility** | Keyboard nav, ARIA labels | Basic keyboard support | Focus on accessibility |

### Detailed Analysis

#### FullCalendar

**Strengths:**
- Most comprehensive feature set in the ecosystem
- Plugin architecture: only load what you use (keeps bundle small)
- Resource/timeline views for multi-provider scheduling (premium)
- 300+ configuration options for deep customization
- Battle-tested in thousands of production apps
- External event dragging (drag from a sidebar list onto the calendar)
- Print optimization plugin

**Weaknesses:**
- Premium features (resource views, timeline) cost $480/dev/year
- Tailwind integration requires manual CSS overrides -- no native theme system for Tailwind
- Open GitHub issue (#5868) requesting Tailwind CSS theme system, still unresolved
- Heavy configuration object can be complex to manage
- Styling customization requires understanding their CSS class hierarchy
- React wrapper is a thin bridge over the vanilla JS core

**Next.js Integration:**
```jsx
// Must be a client component
'use client'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
```

**Verdict:** Best choice if you need resource/timeline views and don't mind the premium license cost. The Tailwind styling friction is a real concern for a Tailwind-first codebase.

#### react-big-calendar

**Strengths:**
- Completely free and open source (MIT)
- Highly customizable via `components` prop (replace any internal component)
- `eventPropGetter` and `slotPropGetter` for dynamic styling per event/slot
- Flexible localizer system (moment, luxon, date-fns, dayjs)
- Event virtualization in month view (only renders visible weeks, maintains 60fps)
- Large community, many examples and tutorials
- `withDragAndDrop` HOC for drag-and-drop support
- Per-event `isDraggable` and `isResizable` flags

**Weaknesses:**
- No built-in resource/timeline view (must build custom)
- Relies on external date library (adds dependency)
- Bundle size is larger than FullCalendar core
- Less polished default styling than FullCalendar
- Fewer built-in features (no recurring events, no external drag)
- Moment.js dependency in many examples (outdated, large bundle)

**Custom Styling:**
```jsx
<Calendar
  eventPropGetter={(event) => ({
    style: {
      backgroundColor: event.type === 'assessment' ? '#dc3545' : '#3174ad',
      borderRadius: '5px',
      opacity: 0.8,
    },
    className: `event-${event.type}`
  })}
  slotPropGetter={(date) => ({
    style: {
      backgroundColor: date.getHours() < 9 ? '#f0f0f0' : undefined
    }
  })}
/>
```

**Verdict:** Best choice for a fully free, highly customizable calendar where you're willing to build resource views yourself. Good for teams that want total styling control.

#### Schedule-X

**Strengths:**
- Modern architecture designed for current frameworks (React, Vue, Svelte)
- First-class Next.js support with `useNextCalendarApp` hook
- Built on Temporal API (modern date handling, future-proof)
- Plugin system for modular features (drag-and-drop, event modal, etc.)
- Built-in dark mode support
- Responsive design built-in (not bolted on)
- CSS variable-based theming (closest to Tailwind integration)
- `onBeforeEventUpdate` callback for validation before drag operations
- Configurable drag interval (15/30/60 min) -- perfect for ABA session units

**Weaknesses:**
- Youngest library (2+ years) -- smallest community
- Lowest npm download count (~37K/week)
- Resource views are premium/paid
- Fewer real-world production references
- Premium plugins (interactive event modal, resource scheduling) are paid
- Less battle-tested at enterprise scale

**Next.js Integration (first-class):**
```jsx
'use client'
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay, createViewWeek, createViewMonthGrid } from '@schedule-x/calendar'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventsServicePlugin } from '@schedule-x/events-service'

function CalendarApp() {
  const eventsService = useState(() => createEventsServicePlugin())[0]
  const calendar = useNextCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid()],
    events: [...],
    plugins: [createDragAndDropPlugin(15), eventsService], // 15-min intervals
  })
  return <ScheduleXCalendar calendarApp={calendar} />
}
```

**Verdict:** Best choice for a modern, Next.js-first stack with Tailwind. The 15-minute drag interval is a natural fit for ABA session scheduling. The smaller community is a risk, but the architecture is the cleanest.

### Recommendation Matrix

| Priority | Best Choice | Why |
|----------|-------------|-----|
| **Fastest to ship, most features** | FullCalendar + premium | Resource views, timeline, external drag all built-in |
| **Free, maximum customization** | react-big-calendar | MIT license, total component control, build resource view |
| **Modern stack alignment (Next.js + Tailwind)** | Schedule-X | `useNextCalendarApp`, CSS variables, Temporal API, responsive |
| **Best long-term bet** | FullCalendar or Schedule-X | FullCalendar is proven; Schedule-X is architecturally superior |

### Recommendation for Clinivise

**Primary recommendation: Schedule-X** for the following reasons:

1. **Next.js-first**: The `useNextCalendarApp` hook is designed for our stack, not bolted on
2. **Tailwind alignment**: CSS variable theming can be bridged to our design tokens
3. **15-minute drag intervals**: Maps directly to ABA session unit calculations (CMS 8-minute rule)
4. **Modern date handling**: Temporal API is the future, avoids moment.js baggage
5. **Plugin architecture**: Start with free core (day/week/month views + drag-and-drop), add premium resource view only when multi-provider scheduling is needed
6. **Responsive by default**: RBTs on tablets get a good experience without extra work
7. **Dark mode**: Already built in, aligns with our theming direction

**Fallback: FullCalendar** if Schedule-X proves too immature or if resource/timeline views are needed immediately. The $480/dev/year premium cost is trivial for a funded product.

**Avoid: react-big-calendar** -- the moment.js dependency culture, lack of built-in resource views, and less polished defaults make it the weakest fit for a modern stack.

---

## 4. Calendar UI Best Practices

### Timezone Handling

**Storage Strategy ("Store Globally, View Locally"):**
- Store all appointment times as UTC in the database
- Store the IANA timezone identifier alongside the appointment (e.g., `America/New_York`)
- Never store UTC offsets (they break during DST transitions)
- Convert to user's local timezone only at the presentation layer

**Display Strategy:**
- Show the user's timezone clearly in the calendar header (e.g., "Eastern Time (ET)")
- For Clinivise MVP: single-timezone assumption (practice's timezone) is sufficient
- If multi-timezone is needed later: show dual labels ("9:00 AM ET / 6:00 AM PT")
- Use IANA timezone database identifiers, never abbreviations alone

**Implementation:**
- Use `Temporal.ZonedDateTime` (if using Schedule-X with Temporal API) or `date-fns-tz` for timezone conversion
- Store practice timezone in org settings
- Apply timezone conversion in the query layer, not the component layer

### Responsive Calendar Patterns

| Viewport | Default View | Interaction Pattern |
|----------|-------------|-------------------|
| **Desktop (1024px+)** | Week view (5 or 7 day) | Click time slot to create, drag to reschedule, hover for details |
| **Tablet (768-1023px)** | 3-day view | Tap time slot to create, swipe to navigate days, tap event for details |
| **Mobile (<768px)** | Agenda/list view | Tap to create, scroll for navigation, tap event for details panel |

**Mobile-specific patterns:**
- Replace the grid-based week view with a vertical agenda list (events as cards)
- Stack events vertically instead of overlapping columns
- Use swipe gestures for day-to-day navigation
- Bottom sheet (not sidebar) for appointment details
- Floating action button for "New Appointment" on mobile

### Drag-and-Drop Rescheduling

**Best Practices:**
- Visual feedback during drag: ghost element at original position + semi-transparent drag preview
- Snap-to-grid: 15-minute intervals for ABA (matches session unit boundaries)
- Invalid drop zones: grey out unavailable times, show a red indicator on conflict
- Undo: Show a toast with "Undo" action after any drag-reschedule (5-second window)
- Validation callback: Use `onBeforeEventUpdate` to check for conflicts before allowing the drop
- Disabled events: Some appointments should not be draggable (e.g., completed sessions)

**Conflict Visualization:**
- Overlapping events: show side-by-side in the same time slot (narrowed width)
- Conflict badge: small warning icon on events that overlap
- Drop-time validation: When dragging, highlight the target slot red if it would create a conflict
- Show a confirmation dialog for conflict overrides: "This overlaps with [event]. Schedule anyway?"

### Appointment Creation Patterns

**Two-tier creation (recommended, follows Google Calendar pattern):**

1. **Quick Create (click on time slot):**
   - Popover/mini-dialog anchored to the clicked slot
   - Fields: Client (searchable dropdown), Service type (dropdown), Provider (pre-filled if viewing a provider's calendar)
   - Time pre-filled from the clicked slot
   - "Create" button and "More Details" link
   - ~3 clicks to create an appointment

2. **Full Create (from "More Details" or "New Appointment" button):**
   - Dialog modal (not a separate page, not a Sheet/sliding panel per Clinivise convention)
   - All fields: Client, Provider, Service type, CPT code, Authorization, Location, Recurrence, Notes
   - Authorization context: show remaining units for selected client + service
   - Conflict warnings displayed inline

**Why NOT a sidebar:** Clinivise convention explicitly prohibits Sheet/sliding panels for forms. Dialog modals or inline patterns only. The Google Calendar sidebar approach is elegant but violates the project's design decision.

### Color Coding Strategy

**Recommended approach for Clinivise (follows Healthie's multi-scheme model):**

| Mode | Color Mapping | Use Case |
|------|--------------|----------|
| **By Status** (default) | Confirmed = solid emerald, Pending = solid amber, Cancelled = solid muted + strikethrough, No-show = solid red + strikethrough, Completed = solid blue | Daily operations, at-a-glance status |
| **By Provider** | Each provider gets a distinct color from a preset palette | Office manager viewing all schedules |
| **By Service Type** | Assessment = purple, Direct therapy (97153) = blue, Supervision (97155) = teal, Parent training (97156) = green | Clinical director reviewing service mix |

**Visual language for status (industry standard):**
- Solid fill = active/confirmed
- Striped/hatched pattern = pending/unconfirmed
- Grey + strikethrough text = cancelled/no-show
- Opacity reduction = past events

**Color palette constraints:**
- Must work in both light and dark mode
- Must have sufficient contrast for accessibility (WCAG AA: 4.5:1 for text)
- Limit to 8-10 distinct provider colors (beyond that, colors become indistinguishable)
- Use the Clinivise design system's status colors as the foundation (emerald, amber, red, blue)

### Loading/Skeleton States

**Calendar-specific skeleton patterns:**

1. **Week View Skeleton:**
   - Grid structure visible immediately (time axis labels + day column headers)
   - Event blocks replaced with animated skeleton bars of varying heights/widths
   - Randomize skeleton bar positions to avoid looking uniform
   - Animate with pulse (not wave) for a subtle loading indication

2. **Month View Skeleton:**
   - Day grid visible immediately
   - 2-3 small skeleton pills per day cell
   - Day numbers visible (they're static), only events are skeletonized

3. **Agenda/List View Skeleton:**
   - Stack of skeleton cards with two-line text placeholders
   - Left color bar placeholder

**Implementation:**
```tsx
// Calendar week view skeleton
<div className="grid grid-cols-7 gap-px">
  {Array.from({ length: 7 }).map((_, day) => (
    <div key={day} className="space-y-1 p-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-8 w-full rounded"
          style={{ marginTop: `${Math.random() * 40}px` }}
        />
      ))}
    </div>
  ))}
</div>
```

### Performance: Handling 100+ Appointments Per Week

**Data Strategy:**
- Fetch only the visible date range (current week +/- 1 day buffer for smooth navigation)
- Use TanStack Query with `queryKey: ['appointments', startDate, endDate, orgId]`
- Prefetch adjacent date ranges on navigation (fetch next/prev week in background)
- Cache previously viewed date ranges (staleTime: 5 minutes)

**Rendering Strategy:**
- Virtualize only if rendering 200+ events simultaneously (unlikely for weekly view)
- For month view with many events: use "show more" pattern ("+3 more" link per day cell)
- Memoize event components (`React.memo`) to prevent re-renders on drag
- Use CSS transforms for drag animations (GPU-accelerated, no layout thrashing)

**Query Pattern:**
```tsx
const { data: appointments } = useQuery({
  queryKey: ['appointments', weekStart, weekEnd, orgId],
  queryFn: () => fetchAppointments({ start: weekStart, end: weekEnd }),
  staleTime: 5 * 60 * 1000, // 5 minutes
  placeholderData: keepPreviousData, // Show old data while fetching new range
})

// Prefetch next week
queryClient.prefetchQuery({
  queryKey: ['appointments', nextWeekStart, nextWeekEnd, orgId],
  queryFn: () => fetchAppointments({ start: nextWeekStart, end: nextWeekEnd }),
})
```

**Optimization checklist:**
- [ ] Fetch only visible date range (not all appointments)
- [ ] Prefetch adjacent ranges on navigation
- [ ] Memoize event rendering components
- [ ] Use `keepPreviousData` for smooth transitions between date ranges
- [ ] Limit month view to 3-4 visible events per day + "+N more" overflow
- [ ] Debounce drag operations (don't update state on every pixel)
- [ ] Use CSS transforms for drag animations

---

## 5. Accessibility Requirements

### WCAG Compliance for Calendar Interfaces

Calendar interfaces are complex widgets that require careful accessibility implementation. The relevant WCAG criteria:

**WCAG 2.1.1 - Keyboard (Level A):**
- All calendar functionality must be operable via keyboard alone
- No keyboard traps (user can always tab away)
- Focus order must be logical (follows visual flow)

**WCAG 2.4.7 - Focus Visible (Level AA):**
- Keyboard focus indicator must be visible on all interactive elements
- Focus ring on the current time slot, event, and navigation controls

**WCAG 1.3.1 - Info and Relationships (Level A):**
- Calendar grid must use ARIA `role="grid"` with `role="row"` and `role="gridcell"`
- Day headers must be associated with their columns
- Time axis labels must be associated with their rows

**WCAG 4.1.2 - Name, Role, Value (Level A):**
- Events must have accessible names (title + time + status)
- Interactive elements must have appropriate ARIA roles
- State changes (drag, select, expand) must be announced

### Keyboard Navigation Pattern (APG Grid Pattern)

Following the W3C ARIA Authoring Practices Guide (APG) grid pattern:

| Key | Action |
|-----|--------|
| `Tab` | Move focus into the calendar grid, then to next focusable region |
| `Arrow Up/Down` | Move between time slots (same day) |
| `Arrow Left/Right` | Move between days (same time) |
| `Enter` / `Space` | Select time slot (opens appointment creation) or select event (opens details) |
| `Escape` | Close any open popover/dialog, cancel drag operation |
| `Home` | Move to first time slot of the day |
| `End` | Move to last time slot of the day |
| `Page Up` | Previous week/month (depending on view) |
| `Page Down` | Next week/month (depending on view) |

### Screen Reader Support

**ARIA Attributes for Calendar Grid:**
```html
<div role="grid" aria-label="Weekly schedule, March 23-29, 2026">
  <div role="row">
    <div role="columnheader">Monday, March 23</div>
    <!-- ... other days ... -->
  </div>
  <div role="row" aria-label="9:00 AM">
    <div role="gridcell" aria-label="Monday March 23, 9:00 AM to 9:15 AM, empty">
      <!-- empty slot -->
    </div>
    <div role="gridcell" aria-label="Tuesday March 24, 9:00 AM to 10:00 AM, Direct Therapy with Ethan Miller, confirmed">
      <!-- event -->
    </div>
  </div>
</div>
```

**Live Regions for Dynamic Updates:**
- Calendar heading (month/year) should be `aria-live="polite"` so screen readers announce view changes
- Toast notifications for drag-and-drop results should use `role="status"`
- Conflict warnings should use `role="alert"`

**Event Announcements:**
- Each event must announce: title, client name, time, duration, and status
- Cancelled/no-show events should include status in the announcement
- Overlapping events should note the conflict

### Color-Independent Information

- Never use color alone to convey status (WCAG 1.4.1)
- Add text labels, icons, or patterns alongside color coding
- Confirmed: solid fill + checkmark icon
- Pending: striped pattern + clock icon
- Cancelled: grey fill + strikethrough text + "Cancelled" label
- Provide a high-contrast mode option or ensure all colors meet WCAG AA contrast ratios

---

## 6. Implementation Recommendations for Clinivise

### Phase 1: Core Calendar (MVP)

**Scope:**
- Week view (default) + Day view + Month view
- Click-to-create appointment (quick create popover)
- Color coding by status (default)
- Basic drag-and-drop rescheduling
- Responsive: agenda list view on mobile
- Skeleton loading states

**Library:** Schedule-X with free plugins (day/week/month views, drag-and-drop, events service)

**Data Model Additions Needed:**
- `appointments` table (or extend `session_logs` with scheduling fields)
- `appointment_status` enum: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`
- `provider_availability` table for availability blocks
- Recurrence support (optional for MVP)

### Phase 2: Multi-Provider Scheduling

**Scope:**
- Side-by-side provider day view (resource view)
- Color coding toggle (by status / by provider / by service type)
- Conflict detection and warnings
- Authorization context in appointment creation (remaining units)

**Library Upgrade:** Schedule-X premium resource view plugin (or build custom if cost is prohibitive)

### Phase 3: Advanced Features

**Scope:**
- Google Calendar two-way sync
- Automated reminders (text + email)
- Recurring appointment patterns
- Waitlist management
- Provider availability management UI
- Self-scheduling portal (future, patient-facing)

### Architecture Notes

- Calendar component is a `'use client'` component (interactive, needs hooks)
- Wrap in a Server Component that fetches initial data
- Use TanStack Query for client-side cache and optimistic updates on drag
- All appointment mutations go through `authActionClient` (org-scoped)
- Event data shape should match the calendar library's expected format -- transform in the query layer, not in the component

---

## Sources

### Healthcare Platform References
- [SimplePractice Scheduling Calendar](https://www.simplepractice.com/features/scheduling-calendar/)
- [SimplePractice Support: Calendar and Scheduling](https://support.simplepractice.com/hc/en-us/sections/360010505112-Calendar-and-Scheduling)
- [Jane App Scheduling](https://jane.app/features/scheduling)
- [Jane App: Working With the Schedule](https://jane.app/guide/working-with-the-schedule)
- [Healthie: Calendar Colors and Appointment Visuals](https://help.gethealthie.com/article/135-setting-up-color-schemes-on-your-healthie-calendar)
- [Healthie: Organization Calendar](https://help.gethealthie.com/article/167-using-healthies-organizational-calendar)
- [Elation Health EHR](https://www.elationhealth.com/solutions/ehr/)

### SaaS Calendar References
- [Cal.com Open Source Scheduling](https://cal.com/)
- [Cal.com GitHub](https://github.com/calcom/cal.com)
- [Google Calendar Color Scheme](https://fireflies.ai/blog/google-calendar-color-scheme/)
- [Linear Timeline Docs](https://linear.app/docs/timeline)

### React Library Documentation
- [FullCalendar Docs](https://fullcalendar.io/docs)
- [FullCalendar Pricing](https://fullcalendar.io/pricing)
- [react-big-calendar GitHub](https://github.com/jquense/react-big-calendar)
- [Schedule-X Documentation](https://schedule-x.dev/docs/frameworks/react)
- [Schedule-X GitHub](https://github.com/schedule-x/schedule-x)
- [FullCalendar vs Schedule-X Comparison](https://onschedule.substack.com/p/fullcalendar-vs-schedule-x)

### Library Comparison Articles
- [Builder.io: React Calendar Components - 6 Best Libraries 2025](https://www.builder.io/blog/best-react-calendar-component-ai)
- [Bryntum: React FullCalendar vs Big Calendar](https://bryntum.com/blog/react-fullcalendar-vs-big-calendar/)
- [LogRocket: Best React Scheduler Component Libraries](https://blog.logrocket.com/best-react-scheduler-component-libraries/)
- [DHTMLX: Compare Best React Scheduler Components 2025-2026](https://dhtmlx.com/blog/best-react-scheduler-components-dhtmlx-bryntum-syncfusion-daypilot-fullcalendar/)

### Design Patterns
- [Page Flows: Calendar Design UX/UI Tips](https://pageflows.com/resources/exploring-calendar-design/)
- [Eleken: Calendar UI Examples - 33 Inspiring Designs](https://www.eleken.co/blog-posts/calendar-ui)
- [BricxLabs: 10 Calendar UI Examples](https://bricxlabs.com/blogs/calendar-ui-examples)
- [Subframe: 25 Calendar View Design Examples](https://www.subframe.com/tips/calendar-view-design-examples)

### Accessibility
- [W3C WCAG 2.1.1: Keyboard](https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html)
- [W3C APG: Date Picker Dialog Example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)
- [WebAIM: Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [UXPin: WCAG 2.1.1 Keyboard Accessibility Explained](https://www.uxpin.com/studio/blog/wcag-211-keyboard-accessibility-explained/)

### Performance
- [FullCalendar Virtual Rendering Issue #5673](https://github.com/fullcalendar/fullcalendar/issues/5673)
- [FullCalendar Virtual Rendering Issue #6478](https://github.com/fullcalendar/fullcalendar/issues/6478)

### Timezone Handling
- [W3C: Working with Time and Timezones](https://www.w3.org/TR/timezone/)
- [Dev.to: 3 Simple Rules for Handling Dates and Timezones](https://dev.to/corykeane/3-simple-rules-for-effectively-handling-dates-and-timezones-1pe0)
