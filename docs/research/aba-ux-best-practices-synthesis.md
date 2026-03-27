# ABA Therapy EHR/PM UX Best Practices: Comprehensive Synthesis

> **Research date**: 2026-03-25
> **Scope**: UX best practices and design standards for ABA therapy practice management software, synthesizing competitive analysis, healthcare UX standards, practitioner workflow research, and best-in-class SaaS design patterns.
> **Sources**: 20+ web sources, 15+ existing Clinivise research documents, review sites (Capterra, Software Advice, GetApp), healthcare UX publications, SaaS design pattern libraries.

---

## Table of Contents

1. [ABA-Specific UX Patterns: What Practitioners Actually Need](#1-aba-specific-ux-patterns)
2. [Healthcare/EHR Design Standards](#2-healthcareehr-design-standards)
3. [Data-Dense Dashboard Design](#3-data-dense-dashboard-design)
4. [Session Logging UX](#4-session-logging-ux)
5. [Authorization Tracking UX](#5-authorization-tracking-ux)
6. [Accessibility in Healthcare Software](#6-accessibility-in-healthcare-software)
7. [Common UX Failures in ABA Software](#7-common-ux-failures-in-aba-software)
8. [Best-in-Class PM Software UX Outside ABA](#8-best-in-class-pm-software-ux-outside-aba)
9. [Actionable Design Principles for Clinivise](#9-actionable-design-principles-for-clinivise)
10. [Sources](#10-sources)

---

## 1. ABA-Specific UX Patterns

### 1A. What BCBAs Need From Their Software Daily

BCBAs (Board Certified Behavior Analysts) are the primary power users of ABA PM software. Their typical day involves:

**Morning (7:30-9:00 AM)**

- Check authorization utilization across caseload — which clients are nearing exhaustion?
- Review today's schedule — are all sessions covered? Any cancellations?
- Check supervision compliance — am I meeting the 5% minimum for each RBT?
- Review unsigned notes from yesterday — any pending my co-signature?

**During sessions (9:00 AM-4:00 PM)**

- Conduct 2-4 direct sessions (97155, 97156, 97157, 97158)
- Observe 1-2 RBT sessions for supervision credit
- Log each session: client, CPT code, start/end time, notes
- Between sessions: 30-minute blocks for treatment plan updates, parent communication

**End of day (4:00-6:00 PM)**

- Complete session notes (must be signed within 24 hours, ideally same day)
- Review and co-sign RBT notes
- Check next day's schedule and authorization availability
- Update treatment plans and progress reports

**Key workflow insight**: BCBAs spend 72% or more of their time on direct care and supervision. Documentation competes for the remaining 28%. Every unnecessary click in the PM software steals time from patient care or pushes documentation into unpaid "pajama time" — a pattern linked to the 72% burnout rate among ABA clinicians.

**What BCBAs need from the software**:

- **Caseload-at-a-glance dashboard**: Authorization status, session counts, supervision percentages for ALL clients, not one at a time
- **Batch note review**: Review and co-sign 5-10 RBT notes in sequence without navigating back to a list each time
- **Authorization awareness everywhere**: Remaining units visible on every screen where they might schedule or log a session
- **Supervision tracking**: Auto-calculated 5% minimum per RBT, with alerts at 30/45/60 day timeouts
- **Quick session logging**: Pre-filled forms that take < 30 seconds. BCBAs log 4-8 sessions daily.

### 1B. What RBTs Need From Their Software Daily

RBTs (Registered Behavior Technicians) are high-frequency, low-complexity users. They log the most sessions but need the simplest interface.

**Typical day**:

- Arrive at client's home/school/clinic
- Open app on tablet or phone
- Start session timer
- Collect data during session (trial counts, frequency, duration measures)
- Stop timer, complete session note (structured questions or brief narrative)
- Drive to next client, repeat 4-6 times

**What RBTs need**:

- **Today's schedule front and center**: "Who am I seeing? Where? When?"
- **One-tap session start**: Select client from today's schedule, tap "Start Session"
- **Remaining auth units visible**: Before starting, see "24 units remaining" so they know the session is billable
- **Auto-populated fields**: Date, provider, CPT code (97153 for most RBT sessions), location, modifier (HM/HN based on credential)
- **Fast note completion**: Structured questions with dropdowns > free text. AI narrative generation from structured data.
- **Offline support**: Field workers often lose connectivity in homes and schools. Data must persist locally and sync when reconnected.
- **Large touch targets**: Minimum 44px for all interactive elements. Hands may be gloved or wet.

### 1C. What Clinic Admins / Billing Staff Need

**Key workflows**:

- Authorization entry and tracking (uploading auth letters, entering approved units)
- Scheduling across multiple providers and clients
- Claims generation and submission (Phase 2)
- Monitoring unbilled sessions ("revenue leakage detection")
- Denial management and resubmission (Phase 2)
- Payroll calculations based on session hours

**What they need**:

- **Unbilled session tracking**: "12 sessions from last week have not been converted to claims" — a revenue-loss prevention feature that AlohaABA and CentralReach both surface prominently
- **Authorization expiry calendar**: All auths expiring in next 30 days, sorted by urgency
- **Batch operations**: Select 20 sessions, generate claims in bulk
- **Data export**: CSV/Excel exports for accountants and external billing services
- **Audit trail**: Who changed what, when, for compliance and dispute resolution

### 1D. Most Common Workflows (Frequency-Ordered)

| Workflow                | Frequency             | Primary User | Speed Target                                  |
| ----------------------- | --------------------- | ------------ | --------------------------------------------- |
| Log a session           | 30-50x/day (practice) | RBT, BCBA    | < 30 seconds                                  |
| Check today's schedule  | 5-10x/day             | All roles    | < 3 seconds                                   |
| Review/co-sign notes    | 10-20x/day            | BCBA         | < 15 seconds per note                         |
| Check auth utilization  | 5-15x/day             | BCBA, Admin  | < 3 seconds                                   |
| Schedule a session      | 5-10x/day             | Admin, BCBA  | < 60 seconds                                  |
| Enter new authorization | 2-5x/week             | Admin        | < 3 minutes (manual), < 30 seconds (AI parse) |
| Generate claims         | 1-2x/week             | Billing      | < 5 minutes (batch)                           |
| Run reports             | 1-5x/week             | Admin, BCBA  | < 10 seconds load time                        |

---

## 2. Healthcare/EHR Design Standards

### 2A. HIMSS Usability Principles

HIMSS (Healthcare Information and Management Systems Society) defines EHR usability criteria that are non-negotiable for healthcare software:

1. **Simplicity**: Display only necessary information at any given time. Use visual cues (icons, color, typography weight) to guide attention. Avoid cluttered layouts.

2. **Naturalness**: Map the software workflow to the real-world clinical workflow. If a BCBA's mental model is "select client, start session, collect data, write note, sign," the software should follow that exact sequence.

3. **Consistency**: Maintain industry-accepted look and feel. Consistent terminology across all screens. If "authorization" is the term on one page, do not use "prior auth" or "approval" on another.

4. **Forgiveness and Feedback**: Protect data if mistakes occur. Allow undo. Show clear confirmation of actions. Never silently fail — the VA EHR disaster involved 11,000+ clinical orders that disappeared into an unknown queue while displaying "success" messages.

5. **Effective Use of Language**: Familiar, unambiguous terminology. Never use internal system jargon. Date formats must be explicit (never "3/4/26" which is ambiguous — always "Mar 4, 2026" or "2026-03-04").

### 2B. The Three-Second Rule

NIST GCR 15-996 research (559 participants, 86 observations) established that a usable EHR is a safe EHR. The critical finding: **clinicians should be able to identify who needs attention within 3 seconds of seeing the dashboard.**

This is achieved through:

- Rigorous visual hierarchy using color for urgency
- Grouping related clinical data logically
- Exception-based display (show problems, not happy paths)
- Top-left quadrant reserved for the most critical information (F-pattern scanning)

### 2C. ONC Health IT Usability Mandates

The Office of the National Coordinator for Health IT requires:

- **User-centered design processes**: Map actual workflows before building. Never automate paper-based processes as-is.
- **Contextual defaults**: Display contextually appropriate defaults to reduce data entry. Pre-fill from previous encounters.
- **Explicit temporal references**: Never "last Tuesday" or "recently" — always explicit dates with time zones.
- **Sticky context headers**: Every detail page must show patient name, key identifiers, and current context in a persistent header. NIST found users reviewed up to 20 screens to verify medication context, and 72% were uncertain due to navigation. **Never force navigation to verify context.**

### 2D. Clinical Decision Support (CDS) Integration

Modern healthcare UX embeds decision support at the point of action, not in a separate report:

- When logging a session: "3 units remaining on this authorization" (not discovered after claim denial)
- When scheduling: "This provider's credential does not match the CPT code" (not discovered during billing review)
- When reviewing notes: "This note is 90% identical to the previous session — verify clinical specificity" (fraud prevention)

The AHRQ "Five Rights" framework for clinical alerts:

| Right             | Application to ABA PM                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| Right information | Only alert on actionable items (not "5 auths are healthy")                    |
| Right person      | RBTs see session alerts. BCBAs see caseload. Admins see practice-level.       |
| Right format      | Critical = inline banner. Warning = badge/pill. Info = dashboard widget only. |
| Right channel     | Dashboard for aggregates. Session form for point-of-action.                   |
| Right time        | Escalating: 30d (info) -> 14d (warning) -> 7d (critical)                      |

---

## 3. Data-Dense Dashboard Design

### 3A. Information Hierarchy: The F-Pattern

Research from eye-tracking studies and SaaS dashboard analysis confirms users scan dashboards in an F-pattern:

1. **Top-left**: The "North Star Metric" — the single most important number (for ABA: total billable sessions this period or auth utilization rate)
2. **Top row**: 3-4 supporting metric cards, scanned left to right
3. **Second row**: Alert/action area — what needs attention NOW
4. **Below the fold**: Detail tables and charts for drill-down

**Anti-pattern: "Data Vomit"**. Organizations have more data than ever but make slower decisions because they can't find what matters. This happens when design teams confuse comprehensiveness with usefulness. The best dashboards do not show everything — they show what matters right now and make it effortless to dig deeper.

### 3B. Metric Card Design

The anatomy of a well-designed metric card:

```
┌─────────────────────────────┐
│ Sessions This Week          │  <- Label (text-xs, muted)
│ 47                          │  <- Value (text-2xl, semibold, tabular-nums)
│ ↑ 12% vs last week          │  <- Trend (text-xs, emerald if up, red if down)
│ ━━━━━━━━━━▓░░░░░            │  <- Optional sparkline/progress bar
└─────────────────────────────┘
```

Key rules:

- **4 metric cards maximum** in the primary row. 4 is scannable in one eye sweep. 5+ causes cognitive overload.
- **tabular-nums** on all numeric values for column alignment
- **Trend indicators** using color + direction arrow (never color alone)
- **Each metric is clickable** — links to the detail view (Jane App pattern)
- **Traffic light logic**: Green = good, amber = warning, red = critical. Never use red unless something is actually broken.

### 3C. Alert Fatigue Prevention

Healthcare alert fatigue causes 49-96% of alerts to be overridden (AHRQ PSNet). A 2025 study found alert fatigue led to a 14%+ increase in medical errors. A clinician's likelihood of responding to an alarm drops 30% for every reminder alert.

**Prevention strategies for ABA PM dashboards:**

1. **Exception-based only**: Show problems, not happy paths. "3 auths expiring" is useful. "47 auths are healthy" is noise.

2. **Maximum 3-5 visible alerts** before "View all (N)" link. Displaying 10+ alerts causes users to miss critical information.

3. **Aggregate similar alerts**: "3 authorizations expiring within 14 days" as one row, not 3 separate alerts.

4. **Escalating severity**: Same alert changes from info (30 days out) to warning (14 days) to critical (7 days). This is NOT 3 alerts — it's 1 alert that escalates.

5. **Threshold-crossing fires once**: The 80% utilization alert fires once when the threshold is crossed, not on every subsequent session.

6. **Dismissible with memory**: If a BCBA acknowledges an 80% warning, suppress until 95%. Track acknowledgment per authorization per user.

7. **Role-filtered**: RBTs see only their session-relevant alerts. BCBAs see caseload alerts. Billing sees financial alerts. Never show every alert to every role.

### 3D. Progressive Disclosure for Clinical Dashboards

Three-tier disclosure model:

| Tier                 | What                  | Where                         | Example                                                         |
| -------------------- | --------------------- | ----------------------------- | --------------------------------------------------------------- |
| **Glance** (1-3 sec) | Status indicator only | Metric cards, badges          | "87%" with amber dot                                            |
| **Scan** (5-15 sec)  | Summary with context  | Dashboard widgets, table rows | "Auth 97153: 35 of 40 units used. Expires Apr 15."              |
| **Drill** (30+ sec)  | Full detail + history | Detail pages, sheets          | Complete auth detail with service lines, session list, timeline |

The modern healthcare dashboard uses data visualization to tell a story rather than the "everything-at-once spreadsheet look" of legacy EHR systems. Trend lines of metrics overlaid with key events (auth renewal, schedule change) help clinicians understand patterns.

### 3E. ABA-Specific Dashboard KPIs

| KPI                            | Target           | Warning      | Critical      |
| ------------------------------ | ---------------- | ------------ | ------------- |
| Authorization utilization      | 85-95%           | <50% or >95% | <30% or >100% |
| Cancellation/no-show rate      | <10%             | 10-15%       | >15%          |
| Staff utilization (billable %) | 75-85%           | <70% or >90% | <60%          |
| Unsigned notes (overdue)       | 0                | 1-3          | >3            |
| Billing lag (service to claim) | <2 days          | 2-5 days     | >5 days       |
| Supervision compliance (BCBA)  | >5% of RBT hours | 5-6%         | <5%           |

---

## 4. Session Logging UX

### 4A. The Speed Imperative

Session logging is the highest-frequency workflow in ABA PM software: 30-50 sessions per day across a typical practice. RBTs log 4-8 sessions each. Every second of friction multiplies across thousands of interactions.

**Documentation time benchmarks:**

| Method            | Time per note (45-min session) | Daily burden (5 sessions) |
| ----------------- | ------------------------------ | ------------------------- |
| Manual free-text  | 15-30 minutes                  | 1.5-2.5 hours             |
| Template-based PM | 8-12 minutes                   | 40-60 minutes             |
| AI-assisted       | 2-5 minutes                    | 10-25 minutes             |

AI note generation is the single biggest documentation time reduction, with platforms reporting 60-80% reduction. AI Scribe technology reduces charting time by up to 70%, with 98% accuracy for general medical terms and 95% for specialty terminology.

### 4B. Pre-Fill Everything

The principle: **never make the user enter information the system already knows.**

| Field            | Pre-fill source                                         | Override behavior              |
| ---------------- | ------------------------------------------------------- | ------------------------------ |
| Date             | Today (or yesterday if before 10 AM with prompt)        | Date picker                    |
| Provider         | Current logged-in user                                  | Dropdown                       |
| Client           | Selected from schedule or search                        | Search/select                  |
| CPT code         | Last-used for this client+provider pair                 | Searchable select with recents |
| Modifier         | Auto-calculated from provider credential                | Override with audit trail      |
| Location         | Last-used for this client                               | Dropdown                       |
| Authorization    | FIFO auto-select (oldest expiring with remaining units) | Card picker with utilization   |
| Start time       | Timer start time or current time                        | Time picker                    |
| Supervising BCBA | Assigned BCBA for this client                           | Dropdown                       |

Pre-filled values MUST have visual distinction (subtle background tint or left-border accent) so users can verify and override. Pre-fill errors creating incorrect billing submissions is a documented risk.

### 4C. Timer vs. Manual Entry

**Timer-based** (recommended as primary):

- RBT taps "Start Session" when therapy begins
- Timer runs in a Web Worker (critical: Chrome throttles `setInterval` to 1-minute resolution in background tabs — calculate from `Date.now() - startTime`, reconcile on `visibilitychange`)
- Timer shows: elapsed time, current billable units, next-unit threshold ("3 more min for next unit")
- Color-code the 8-minute boundary within each unit
- Session timer persists across page navigation (global context) — RBTs may check auth status or client info mid-session
- "Stop" calculates final minutes and units automatically

**Manual entry** (available as fallback):

- Start time + end time inputs, auto-calculate duration and units
- Essential for retroactive session entry (common in ABA — RBTs in the field may log sessions hours later)
- Flag sessions where entry date is >7 days after session date

**Hybrid recommendation**: Timer as default with manual override. Show both the timer display AND editable start/end time fields. If the user manually edits times, the timer adjusts. Best of both worlds.

### 4D. Mobile/Tablet Considerations for In-Home Providers

87% of doctors and 85% of clinical educators use smartphones/tablets during patient care. For ABA RBTs working in homes and schools, the tablet IS the primary device.

**Critical mobile patterns:**

1. **Touch targets**: Minimum 44px (min-h-11 min-w-11) on ALL interactive elements. `pointer: coarse` media query for tablet-specific adjustments. Hands may be occupied, gloved, or wet.

2. **Thumb-friendly layout**: Primary actions in the bottom half of the screen within thumb reach. Action buttons at top are unreachable on tablets held in one hand.

3. **Virtual keyboard management**: `scrollIntoView({ block: 'center' })` on focus. Form inputs should never be hidden behind the virtual keyboard. Action buttons should not move when the keyboard appears.

4. **Orientation handling**: Support both portrait and landscape. Pin scroll position on orientation change. Most RBTs use landscape on tablets, portrait on phones.

5. **Offline-first (Phase 2)**: Field workers often lose connectivity. Persist form state to localStorage immediately on field change. Show "Last synced: 2 min ago" indicator. Allow complete session logging offline with sync on reconnect. Background Sync API achieves 99.8% sync success across 500K+ healthcare users.

6. **Simplified view**: RBTs on mobile do not need billing details, auth numbers, or payer IDs. Show only: client name, remaining units for relevant CPT codes, session timer, and note fields.

### 4E. Session Form Layout

Research consensus (Baymard Institute, NNGroup, CXL): **single-column forms outperform multi-column** in completion rates and error reduction. Users complete single-column forms approximately 15 seconds faster.

**Exceptions — paired fields are acceptable on one line:**

- Start time + End time (temporal pair)
- CPT code + Modifier (billing pair)
- City + State + Zip (address convention)

**Recommended layout pattern for ABA session forms:**

```
┌──────────────────────────────────────────┐
│ SESSION HEADER (always visible)          │
│ Client: Jordan M.  │  Auth: 24 of 40    │
│ Provider: Jane D., RBT  │  97153-HM     │
├──────────────────────────────────────────┤
│ ⏱ 00:42:18  │  2 units  │  +3min = 3u   │
├──────────────────────────────────────────┤
│ SESSION INFO                    [card]   │
│ Date: [Mar 25, 2026]                     │
│ Start: [9:00 AM]  End: [__:__ __]        │
│ Location: [Home - 123 Main St]           │
│ Place of Service: [Home (12)]            │
├──────────────────────────────────────────┤
│ CLINICAL NOTES                  [card]   │
│ Goals targeted: [Select goals...]        │
│ Interventions: [Select...]               │
│ Session narrative: [_______________]     │
│                    Draft saved 10s ago    │
├──────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ │
│ │  [Stop Timer & Save]  [Save Draft]  │ │
│ └──────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

Key features:

- **Sticky session header** with client name, auth utilization, CPT code always visible
- **Timer bar** with unit calculation and next-unit threshold
- **Card-based sections** that can collapse/expand
- **Sticky action bar** at the bottom
- **Auto-save draft** with visible timestamp for session narrative text (2-second debounce)
- **Explicit save** for structured data (times, CPT, location)

### 4F. Save Strategy

| Data type                          | Save behavior                                      | Rationale                                                                                             |
| ---------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Session narrative text             | Auto-save (2s debounce) + localStorage persistence | Never lose clinical text. CentralReach's inconsistent save behavior is their most-cited UX failure.   |
| Session metadata (date, time, CPT) | Explicit save button                               | Structured data needs intentional submission. Accidental auto-save of wrong CPT code = billing error. |
| Session status (complete/draft)    | Explicit submit                                    | State transition should be deliberate. Submit -> "Pending Signature" -> Signed.                       |
| Data collection (trial counts)     | Auto-save per entry                                | Collected during active therapy. Cannot stop to click "Save" between trials.                          |

---

## 5. Authorization Tracking UX

### 5A. Utilization Visualization

Authorization utilization is the signature UX element that differentiates a great ABA PM tool. No competitor does this exceptionally well — it is the biggest whitespace opportunity.

**Visualization patterns:**

**Single-service utilization bar:**

```
97153 Adaptive Behavior
████████████████░░░░░░░░░░░░░░  32 of 40 units (80%)
```

- Emerald fill: 0-79%
- Amber fill: 80-94%
- Red fill: 95-100%
- Red fill with overflow indicator: >100%

**Multi-service authorization overview (segmented bar):**

```
┌──────────────────────────────────────────────────┐
│ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ 97153 (12/40)    97155 (4/8)    97156 (2/4)      │
│ ═══════30%═══    ═══50%═══      ═══50%═══         │
└──────────────────────────────────────────────────┘
  Overall: 18/52 units used (34.6%)
```

**Burndown projection (Clinivise differentiator — no competitor has this):**

```
"At current pace, units exhaust on May 15 — 23 days before auth expires June 7"
Recommendation: Schedule 6 units/week (currently averaging 8 units/week) to pace evenly
```

Calculation:

```
burn_rate = used_units / days_elapsed
remaining_units = approved_units - used_units
days_until_exhaustion = remaining_units / burn_rate
projected_exhaustion_date = today + days_until_exhaustion
```

**Dual format labeling**: Show both units and hours — BCBAs think in hours, billing staff think in units.
"12 units used (3.0 hours) of 40 approved (10.0 hours)"

### 5B. Where Authorization Info Must Appear

The key insight from competitive analysis: CentralReach buries authorization data in the Billing module, forcing clinical staff to navigate away from their workflow. AlohaABA surfaces it in the client profile AND the schedule view. Passage Health blocks over-scheduling at booking time.

**Clinivise should show auth utilization at every decision point:**

| Context              | Display                                                            | User need                                  |
| -------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| Dashboard            | Metric card + alert widget (3-5 expiring/critical auths)           | "What needs attention across my caseload?" |
| Client detail page   | Utilization bars in Overview tab hero section                      | "How is this client's auth looking?"       |
| Session logging form | Auth card with remaining units + color indicator                   | "Can I bill this session?"                 |
| Scheduling view      | Inline remaining hours when booking                                | "Will this appointment be covered?"        |
| Authorization list   | Table with sortable utilization %, status badges, expiry countdown | "Which auths need action?"                 |
| Sidebar nav          | Badge count on "Authorizations" item                               | "How many alerts are pending?"             |

### 5C. Alert Tiers for Authorization Events

| Alert Type                 | Severity        | Trigger                               | Display                                             | Action                                                                  |
| -------------------------- | --------------- | ------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Over-utilized (>100%)      | Critical (red)  | Session exceeds approved units        | Blocking dialog on session form + dashboard alert   | "Stop — auth exhausted. Override with reason or select different auth." |
| Near-exhaustion (95-100%)  | Critical (red)  | Threshold crossed                     | Inline banner on auth detail + session form warning | "3 units remaining. Consider re-authorization."                         |
| High utilization (80-94%)  | Warning (amber) | Threshold crossed                     | Badge on auth list + dashboard widget               | "Approaching limit — review scheduling pace."                           |
| Expiring 7 days            | Critical (red)  | Calendar countdown                    | Dashboard alert + auth list badge                   | "Expires Mar 31. Re-authorize now."                                     |
| Expiring 14 days           | Warning (amber) | Calendar countdown                    | Dashboard widget                                    | "Expires Apr 8."                                                        |
| Expiring 30 days           | Info (blue)     | Calendar countdown                    | Dashboard widget only                               | "Plan re-authorization."                                                |
| Under-utilized             | Warning (amber) | <50% used with >50% of period elapsed | Dashboard widget + auth detail callout              | "Only 30% used at 60% of period. Increase scheduling."                  |
| Projected early exhaustion | Warning (amber) | Burn rate exceeds sustainable pace    | Auth detail callout                                 | "At current pace, units exhaust 3 weeks early."                         |

### 5D. Re-Authorization Workflow

Best-in-class systems identify expiring authorizations 30-45 days in advance and automatically trigger renewal processes.

Recommended workflow:

1. **30 days out**: Info-level alert on dashboard. "Authorization expires in 30 days."
2. **Re-authorize button**: Creates new auth pre-filled from current (same client, payer, CPT codes, adjusted dates). Linked via `previousAuthorizationId`.
3. **14 days out**: Escalated warning. "Re-authorization not yet created. 8 sessions scheduled past expiry."
4. **7 days out**: Critical alert with count of at-risk sessions.
5. **Expired**: Status change. If replacement auth exists, show "Replaced by AUTH-2024-002."

---

## 6. Accessibility in Healthcare Software

### 6A. Regulatory Requirements (Effective May 2026)

As of May 2026, healthcare organizations accepting federal funding or federal insurance programs (Medicare/Medicaid) are legally required to comply with WCAG 2.1 Level AA accessibility standards. This is not optional for ABA practices billing Medicaid.

### 6B. Color Contrast Requirements

| Element                             |        Minimum Ratio        | Standard    |
| ----------------------------------- | :-------------------------: | ----------- |
| Normal text (<18px)                 |            4.5:1            | WCAG AA     |
| Large text (>=18px bold or >=24px)  |             3:1             | WCAG AA     |
| UI components and graphical objects |             3:1             | WCAG 2.1 AA |
| Focus indicators                    | 3:1 against adjacent colors | WCAG 2.2    |

**Status indicator rule (WCAG SC 1.4.1, Level A)**: Color MUST NOT be the only means of conveying information. Every status indicator must combine at least 2 of: color, shape/icon, text label.

For ABA software this is critical: 8% of males have color vision deficiency. Authorization utilization bars that rely on green/amber/red without text labels or icons are inaccessible.

**Clinivise status encoding (triple redundancy):**

| Status                | Color         | Icon           | Text              |
| --------------------- | ------------- | -------------- | ----------------- |
| Healthy (<80%)        | Emerald       | Check circle   | "On track"        |
| Warning (80-94%)      | Amber         | Alert triangle | "Nearing limit"   |
| Critical (95-100%)    | Red           | Alert octagon  | "Near exhaustion" |
| Over-utilized (>100%) | Red (pulsing) | X circle       | "Over limit"      |
| Expired               | Muted red     | X circle       | "Expired"         |

### 6C. Keyboard Navigation

Full keyboard navigation is a WCAG requirement and a power-user accelerator:

- **Tab**: Move between interactive elements in logical order
- **Enter**: Activate buttons and links
- **Escape**: Close modals, sheets, popovers
- **Arrow keys**: Navigate within tables, select lists, date pickers
- **Visible focus ring**: Minimum 2px solid, 3:1 contrast ratio against adjacent colors

**EHR-specific requirements:**

- All form fields must have persistent visible labels (not placeholder-only)
- Focus must be managed on modal/sheet open and close (trap focus inside, return to trigger on close)
- Data tables must use semantic `<table>` markup with `aria-sort` on sortable headers and `aria-live` for filter results
- Screen reader compatibility: all interactive elements have accessible names

### 6D. Command Palette as Accessibility Feature

The Cmd+K command palette is both a power-user accelerator AND an accessibility feature. It provides keyboard-only access to all application functionality without requiring mouse navigation through menus:

- Search clients, providers, authorizations by typing
- Execute actions ("New session for Jordan", "Check auth 97153")
- Navigate to any page by name
- Recent actions shown first for quick repeat
- No ABA competitor has this feature

---

## 7. Common UX Failures in ABA Software

### 7A. CentralReach — The Cautionary Tale

CentralReach is the market leader (4.3/5 rating) but has documented, persistent UX failures that create switching opportunities:

**Data loss and save behavior (most-cited complaint):**

- Inconsistent save behavior — some forms auto-save, others require manual save, with no clear indication which mode is active
- System crashes and auto-logouts delete unsaved data. Users report "the system crashed and not saving data" and "glitches that kicked them and coworkers out of notes before saving"
- Navigation during unsaved edits loses work silently

**Complexity and learning curve:**

- 87% of users report that advanced features have problems and slow processes down
- "Complex features have a steep learning curve"
- UI elements are too small, causing click errors
- Mobile/desktop experiences are inconsistent — "the mobile app looks and works differently than desktop, confusing staff who use both"

**Performance and reliability:**

- "Near 100% of users report frequent downtime during updates, with data inaccessible during update windows"
- Entire week of downtime reported where no one could log in
- Support is slow — 60% of users report time-consuming support

**Cost:**

- "Very expensive" with high add-on costs
- Users charged per employee even when only certain staff use a feature
- "Charged for a full month even if the software was only used for a short time"

**Authorization UX:**

- Auth data buried in the Billing module, not visible where clinicians work
- Reports are data-dense but require significant training to interpret
- Deleted authorizations still appear on reports (known bug)

### 7B. AlohaABA — Simple But Limited

AlohaABA scores well on UX (4.9/5) but has growth ceiling issues:

- **No unique client identifier** — causes confusion in multi-sibling families
- **Non-customizable dashboards** — one-size-fits-all doesn't work for different roles
- **Cumbersome note navigation** — switching between notes requires too many steps
- **Synchronization issues** when paired with separate clinical tools — "missing session notes and payroll errors"
- **Slow performance** under load
- Clinical data collection still "new to their platform and still developing"

### 7C. RethinkBH — Rigidity Problem

- **Cannot edit data after entry** — the most extreme "no undo" problem in the market
- **Non-existent customer service** — users report unresponsive support
- **Complex mobile app experience** — performance issues disrupt daily workflows
- **Does not scale** for growing practices

### 7D. Cross-Platform Pain Points

These frustrations appear across multiple ABA platforms:

1. **Double data entry**: Practices using separate clinical + PM tools must enter session data twice. Integration creates synchronization issues.

2. **Rigid workflows**: Software designed around the database schema rather than the clinical workflow. Forms feel like database admin panels, not clinical tools.

3. **Poor mobile experience**: Most ABA platforms were designed desktop-first. Mobile apps are afterthoughts with limited functionality and frequent crashes.

4. **Documentation burden**: RBTs face "unclear or inconsistent documentation expectations that can create confusion." Each funding source has different requirements, and software rarely adapts templates per payer.

5. **No contextual intelligence**: Auth utilization, credential matching, and scheduling conflicts are caught AFTER the error (during billing review), not BEFORE (at the point of action).

6. **Training overhead**: New RBTs require hours of training on the PM software before they can do their job. High turnover in ABA means constant retraining.

7. **Cost opacity**: Pricing is unclear, with hidden fees for add-ons, per-user charges that scale unpredictably, and long-term contracts that lock practices in.

### 7E. Key Quotes from the Field

- "A platform can demo well and still fail if RBTs hate using it"
- "Fast data collection, streamlined notes, and fewer duplicate fields are now table stakes"
- "Documentation takes more than 5 clicks, it's creating burnout"
- Up to 72% of ABA clinicians experience medium to high levels of burnout, often from administrative overload
- A 30-second workflow reduction across 100 daily uses = 50 hours saved annually per clinician

---

## 8. Best-in-Class PM Software UX Outside ABA

### 8A. Linear — Information Density Without Overwhelm

Linear is the gold standard for data-dense SaaS interfaces. Key patterns to adopt:

**Visual weight hierarchy**: Not every element carries equal visual weight. Parts central to the user's task stay in focus while navigation elements recede. Authorization status (active/expiring/expired) gets maximum visual weight. Metadata (auth number, payer, dates) recedes.

**Warm neutral palette**: Linear's 2025 refresh shifted from cool blue-gray to warmer gray — "crisp but less saturated." Warmer grays are calmer for all-day use, critical for clinicians spending 6-8 hours in the software.

**Minimal accent color**: Monochrome + meaningful status colors only. Color should convey information (status), not decoration. This directly maps to the WCAG requirement of meaningful color usage.

**Keyboard-first**: C to create, Cmd+K command palette, x to select. Tab-based navigation through all interface elements. This is the single biggest differentiator that no ABA competitor offers.

**Redesigned filter system**: Include/exclude logic, compound filters with AND/OR. Saved filter presets ("Expiring Soon", "Over-Utilized", "My Caseload"). Filter state persisted in URL via nuqs.

**Compact tables**: Dense rows with `py-2 px-3 text-xs`. Sortable, filterable columns. Inline status badges. This is the Mira compact typography standard — 12px base, not 14px.

### 8B. Stripe — Billing Dashboard Blueprint

Stripe Dashboard demonstrates how to present complex financial data clearly:

**Business-at-a-glance**: Overview page with key charts that link to deeper areas. Every number is clickable — it drills down to the detail view.

**Constrained component system**: Stripe maintains consistency through a tight component library. This prevents the "every page looks different" problem that plagues CentralReach.

**Inline usage metrics**: API usage, credit balance, and quota are shown inline at the point of billing — not in a separate analytics page. Map this to: show auth utilization inline at the point of session logging.

**Ledger-style tracking**: Every transaction creates a ledger entry. Map this to: every session logged is a "debit" against authorized units, displayed as a running balance.

### 8C. Mercury — Financial Data Density

Mercury handles complex financial data for startups. Relevant patterns:

**Single-snapshot dashboard**: All funds visible at a glance. No tab-switching to find the number you need. The ABA equivalent: all critical auth statuses visible on the dashboard without clicking into individual clients.

**Color used sparingly**: Red only for alerts, green only for positive indicators. Top-left placement for highest-priority metrics. This aligns with the healthcare "traffic light" color system.

**Burndown/budget visualization**: Mercury shows budget-to-spend ratio with progress bars. Direct parallel to auth utilization tracking — show a projection line: "At current pace, units exhaust on [date]."

**Left-to-right scanning priority**: Place utilization percentage and status on the LEFT of authorization cards. Place metadata (dates, auth number) on the RIGHT. Most important data scanned first.

### 8D. SimplePractice — Healthcare PM Gold Standard

SimplePractice serves 225,000+ practitioners and proves that consumer-grade UX is a competitive moat in healthcare:

**Calendar as home page**: Therapists think "who am I seeing today", not "what's my dashboard". For ABA, the equivalent is "Today's Schedule" as the default RBT view.

**Consumer-grade design**: "An interface designed with the same UX sensibility you would expect from a modern fintech or productivity app, not a health IT system from 2005." This is the benchmark.

**Mobile-first, not mobile-adapted**: The SimplePractice mobile app is rated 4.7+ stars and supports nearly all core functions. This is a major competitive advantage over desktop-first ABA tools with mobile afterthoughts.

**Zero-training dashboard**: The dashboard requires no training to use. If a new RBT cannot figure out how to log a session within 30 seconds of their first login, the design has failed.

### 8E. Jane App — Calming Interface Philosophy

Jane App demonstrates that healthcare software should feel trustworthy, not overwhelming:

**Clickable metric dashboard**: Each metric in the header row is a shortcut to the relevant tab/filter. Click "3 unsigned notes" and go directly to the filtered notes list. This eliminates navigation steps.

**Color-coded scheduling**: Visually scannable at a glance — different colors for different session types, providers, or statuses. The schedule communicates information before you read text.

**Family profiles**: Link sibling client records together, share guardian contacts, view family billing summary. Critical for ABA where many families have 2-3 children in services.

**"Calming" design**: Clean layouts, consistent typography, soft color contrasts, generous whitespace. Healthcare should feel safe, not overwhelming.

### 8F. Vercel Dashboard — Performance as Design

**Optimistic UI**: Show expected states immediately. When a session is saved, the UI updates before the server confirms. If the server rejects, roll back with a clear error message. This makes the app feel instant.

**Empty states as actionable commands**: Instead of blank screens, show contextual CTAs explaining what the user should do next. "No sessions logged today. Start a session?" with a single-click action button.

**Information density over decoration**: Geist design system prioritizes clarity, speed, and density. No gratuitous animations, no decorative elements. Every pixel serves a purpose. This philosophy directly opposes the "enterprise bloat" of CentralReach.

---

## 9. Actionable Design Principles for Clinivise

Synthesizing all research into a prioritized set of design principles:

### Principle 1: Authorization-Aware Everything

This is our signature differentiator. No competitor does it well.

- Show remaining authorized units at EVERY point where a user might schedule, log, or review a session
- Block over-utilization at the point of action (session form), not after claim denial
- Predictive burndown projections ("units exhaust 3 weeks before auth expires") — no competitor has this
- Tiered alerts that escalate severity as deadlines approach

### Principle 2: Speed Is the Feature

Target: session logging in < 30 seconds. This single metric should drive all form design decisions.

- Pre-fill everything from context (provider, date, CPT, location, modifier, authorization)
- Cmd+K command palette for keyboard-first navigation
- Batch operations for note review and co-signing
- Optimistic UI for status updates
- Skeleton loaders (never spinners) — 30% faster perceived performance

### Principle 3: Never Lose Work

CentralReach's data loss is our competitive wedge.

- Auto-save all text inputs (2-second debounce) with visible "Saved" indicator
- Persist dirty form state to localStorage on every field change
- `beforeunload` warning for unsaved structured data
- Persistent (non-dismissible) error banner on save failure — never use toasts for errors
- Retry queue on network reconnection

### Principle 4: Three Tiers of Visual Hierarchy

Every page must have clear primary/secondary/tertiary information levels:

- **Primary**: Hero moment (utilization bar, key metric, action button)
- **Secondary**: Supporting context (date ranges, status badges, provider info)
- **Tertiary**: Metadata (auth numbers, payer IDs, audit timestamps)

Use typography weight, size, and color to create hierarchy — not spacing or decoration.

### Principle 5: Role-Based Simplicity

Different users need different levels of complexity:

- **RBT view**: Simplified. Today's schedule, session timer, quick notes. 4 nav items.
- **BCBA view**: Rich. Caseload overview, auth status, supervision compliance. 8 nav items.
- **Admin view**: Dense. Financial metrics, unbilled sessions, staff utilization. Full nav.
- **Billing view**: Focused. Claims queue, denials, aging reports. Billing section only.

### Principle 6: Passive First, Interruptive Only When Necessary

Replace pop-ups with inline alerts. Reserve blocking dialogs ONLY for:

- Destructive actions (delete, void)
- Actions that would exceed authorization limits (over-utilization is a hard business rule)
- Session submission without required fields

Everything else: inline banners, badges, dashboard widgets. The user chooses when to attend to them.

### Principle 7: Triple-Encode Status

Every status indicator uses color + icon + text. Never color alone. This serves:

- Colorblind users (8% of males)
- WCAG 2.1 Level AA compliance (legally required by May 2026 for Medicaid-billing practices)
- Scanability (text labels visible even on low-resolution displays)

### Principle 8: Mobile Is Primary for Field Workers

RBTs are the highest-frequency users and they work on tablets in the field.

- 44px minimum touch targets on all interactive elements
- Single-column form layout on mobile
- Offline-capable session logging (Phase 2)
- Simplified view that hides billing/admin details for clinical users
- Virtual keyboard awareness — inputs never hidden behind keyboard

### Principle 9: Design for the Workflow, Not the Schema

Every page answers a user story, not a database table:

- Client detail page is "What do I need to know about Jordan before today's session?" not "Here is the clients table row."
- Dashboard is "What needs my attention right now?" not "Here are 15 metrics."
- Session form is "Document what just happened" not "Fill in all required fields."

### Principle 10: Calm, Trustworthy Aesthetic

Healthcare software should reduce anxiety, not create it:

- Warm neutral palette (shifted from cool blue-gray to warmer gray)
- Whitespace used intentionally — dense data with breathing room between sections
- Consistent typography with clear visual hierarchy
- No gratuitous animations. No decorative elements. Every pixel serves a purpose.
- The overall feeling should be "modern, professional, calm" — SimplePractice and Jane App as reference, not CentralReach.

---

## 10. Sources

### ABA Software Reviews & Competitor Analysis

- [AlohaABA Reviews 2025 - Capterra](https://www.capterra.com/p/192774/AlohaABA/reviews/)
- [Top 5 ABA Practice Management Software 2026 - Passage Health](https://www.passagehealth.com/blog/aba-practice-management-software)
- [6 Best ABA Software 2025 - Software Advice](https://www.softwareadvice.com/mental-health/aba-comparison/)
- [Best ABA Practice Management Software 2026 - Motivity](https://www.motivity.net/blog/best-aba-practice-management-software)
- [CentralReach Software Reviews 2026 - Software Advice](https://www.softwareadvice.com/medical/centralreach-profile/)
- [CentralReach Software Pricing & Reviews - Capterra](https://www.capterra.com/p/140743/CentralReach/)
- [CentralReach Reviews 2025 - SelectHub](https://www.selecthub.com/p/medical-software/centralreach/)
- [CentralReach vs AlohaABA Comparison - GetApp](https://www.getapp.com/healthcare-pharmaceuticals-software/a/centralreach/compare/alohaaba/)
- [Top 6 ABA Practice Management Software 2025 - Raven Health](https://ravenhealth.com/blog/top-aba-practice-management-softwares/)
- [7 Best ABA Data Collection Software 2026 - Passage Health](https://www.passagehealth.com/blog/aba-data-collection-software)

### Healthcare UX & EHR Design

- [Healthcare UI Design 2026: Best Practices - Eleken](https://www.eleken.co/blog-posts/user-interface-design-for-healthcare-applications)
- [Healthcare UX Design Guide 2026 - Fuselab Creative](https://fuselabcreative.com/healthcare-ux-design-best-practices-guide/)
- [EHR Usability: Main Aspects & Strategies - iTransition](https://www.itransition.com/healthcare/ehr/usability)
- [Healthcare UX Checklist: Clinician-Centered Design - Digicorp Health](https://www.digicorphealth.com/blog/healthcare-ux-checklist-designing-digital-tools-clinicians-actually-use/)
- [Healthcare UX and WCAG: Accessibility Playbook - KoruUX](https://www.koruux.com/ux-wcag-accessibility/)
- [Healthcare Tech Innovation: HIMSS 2026 - Healthcare Dive](https://www.healthcaredive.com/spons/healthcare-tech-innovation-lessons-from-himss-2026/814592/)
- [WCAG 2.1 AA Healthcare Website Compliance 2026 - EHS](https://www.edreamz.com/blog/healthcare-website-accessibility-in-2026-what-wcag-21-aa-means-and-how-to-prepare)
- [Healthcare App Accessibility & WCAG Compliance - Boundev](https://www.boundev.com/blog/healthcare-app-accessibility-wcag-compliance)

### Alert Fatigue & Clinical Dashboard Design

- [How to Prevent Alarm Fatigue 2026 - Nextech](https://www.nextech.com/blog/alert-fatigue)
- [Understanding Alert Fatigue in Primary Care - JMIR 2025](https://www.jmir.org/2025/1/e62763)
- [Top 5 UX Trends Driving Digital Healthcare 2026 - Onething Design](https://www.onething.design/post/top-healthcare-ux-trends)
- [Progressive Disclosure in SaaS UX Design - Lollypop](https://lollypop.design/blog/2025/may/progressive-disclosure/)

### SaaS Dashboard Design Patterns

- [Anatomy of High-Performance SaaS Dashboard Design 2026 - SaaSFrame](https://www.saasframe.io/blog/the-anatomy-of-high-performance-saas-dashboard-design-2026-trends-patterns)
- [Top 7 SaaS Design Trends 2026 - Lollypop](https://lollypop.design/blog/2025/april/saas-design-trends/)
- [B2B SaaS UX Design 2026 - Onething Design](https://www.onething.design/post/b2b-saas-ux-design)
- [Smart SaaS Dashboard Design Guide 2026 - F1Studioz](https://f1studioz.com/blog/smart-saas-dashboard-design/)

### AI Documentation & Session Logging

- [AI Notes for Therapists 2026 - Twofold](https://www.trytwofold.com/blog/ai-notes-for-therapists)
- [Best AI for Therapy Notes 2026 - Supanote](https://www.supanote.ai/blog/best-ai-for-therapy-notes)
- [Ambient AI Tools for Reducing Physician Burnout - Advisory Board](https://www.advisory.com/daily-briefing/2026/02/04/ambient-ai-oi-ec)
- [AI-Native EHR Speech as Core Infrastructure 2026 - Speechmatics](https://www.speechmatics.com/company/articles-and-news/ai-native-ehr-speech-core-infrastructure-2026)

### Authorization & Prior Auth

- [Prior Authorization Automation 2026 Guide - Innovaccer](https://innovaccer.com/blogs/the-definitive-guide-to-streamlining-prior-authorization-workflows-for-providers)
- [Payers Prior Auth Commitment 2026 - MedCity News](https://medcitynews.com/2025/12/prior-authorization-commitment-2026/)
- [Prior Authorization API - CMS](https://www.cms.gov/priorities/burden-reduction/overview/interoperability/frequently-asked-questions/prior-authorization-api)

### BCBA Workflow & Documentation

- [BCBA Documentation Time Hacks - Praxis Notes](https://www.praxisnotes.com/resources/bcba-documentation-time-hacks)
- [BCBA Caseload Management & Burnout Prevention - Bright Pathways ABA](https://brightpathwaysaba.com/effective-strategies-for-bcba-therapists-to-manage-caseloads-and-prevent-burnout/)
- [Workforce Operational Efficiency for ABA - Theralytics](https://www.theralytics.net/blogs/improve-workforce-operational-efficiency-aba-clinic)

### SimplePractice & Adjacent PM Software

- [SimplePractice Review 2025 - CarePaths](https://carepaths.com/simplepractice-review/)
- [SimplePractice: Why Therapists Love It - Practice Copilot](https://practicecopilot.com/simple-practice/)
- [SimplePractice EHR Review 2026 - EHR Source](https://www.ehrsource.com/vendors/simplepractice/)

### Command Palette & Keyboard Shortcuts

- [Command Palette UX Patterns - Medium (Bootcamp)](https://medium.com/design-bootcamp/command-palette-ux-patterns-1-d6b6e68f30c1)
- [How to Build a Remarkable Command Palette - Superhuman](https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/)
- [Command Palette UI Design Best Practices - Mobbin](https://mobbin.com/glossary/command-palette)
