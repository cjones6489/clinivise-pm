# ABA Session Note UI/UX Patterns Research

> Research date: 2026-03-27
> Scope: Session note form UI, BCBA review queue, signature workflow, note timeliness, AI generation UX. Synthesized from CentralReach, Motivity, Raven Health, RethinkBH/Catalyst, Theralytics, ABA Matrix, Hi Rasmus, Artemis ABA help docs, feature pages, and press releases.

---

## Key Findings

### Where the Note Lives
- Every competitor attaches the note to the session/appointment — it is a child entity, not standalone
- CentralReach: note attached to timesheet entry, accessed from timesheet
- Motivity: note created per learner per session
- ABA Matrix: note opened from calendar event
- **Recommendation:** Note tab on the session detail page (not a separate page, not a side panel)

### Note Form Layout
- Single scroll with sections (not multi-step wizard) is the dominant pattern
- CPT-specific sections show/hide based on note type
- Section cards with title bars (matches our design system)
- Auto-populated header (session metadata) is read-only at the top
- Goal data is the densest section — uses compact cards or table rows

### Goal Data Entry
- CentralReach: goal selector from library, data type dropdown per goal
- Motivity: data auto-imports from real-time data collection (no re-entry)
- Our approach (no real-time data collection yet): pre-populate from client's active goals, per-goal cards with measurement-type-specific fields

### BCBA Review Queue
- Motivity: "Awaiting Approval" category in session notes view
- ABA Matrix: "Review" menu showing all "In Review" sessions from assigned RBTs
- CentralReach: filtered timesheets
- **Recommendation:** filter tabs on sessions list page, not a separate page

### Signature Workflow
- Button click + auto-timestamp is dominant (not drawn signature)
- Signing locks the note (read-only after)
- Supervisor co-sign is asynchronous (from review queue)
- CentralReach + Artemis support bulk co-sign
- ABA Matrix has the best status workflow: In Progress → In Review → Incomplete → Completed → Locked → Rejected

### Note Timeliness
- Best practice: <24h. Acceptable: <72h. Red flag: >72h
- CentralReach blocks claims for unsigned sessions
- No competitor does hard time-based locks — just visibility/alerts

### AI Note Generation
- Raven Health: one-click from structured data → SOAP narrative
- RethinkBH: auto-generates from real-time session data, saves ~10 min/session
- Pattern: structured data in → AI narrative out → human reviews/edits → submit
- AI never auto-submits

---

## Recommended Clinivise Approach

### Note Form: Tab on Session Detail Page
- Add "Note" tab to session detail page (alongside existing Overview)
- Session metadata stays in page header — RBT never loses context
- Empty state with prominent "Complete Session Note" CTA

### Form Layout: Single Scroll with Conditional Sections
1. Session Information (read-only card, auto-populated)
2. Subjective (caregiver reports, setting events)
3. Client Presentation (observable behavior)
4. Others Present
5. **CPT-specific sections:**
   - 97153: Goals Targeted (compact card grid) + Behavior Incidents
   - 97155: Modification rationale/description/response/protocol
   - 97156: Caregiver info, training objectives, teaching method, competency, homework
   - 97151: Assessment tools, F2F/non-F2F time, findings, recommendations
6. Session Narrative (+ AI generate button in Phase 2)
7. Barriers to Performance
8. Caregiver Communication
9. Plan for Next Session
10. Sign & Submit

### Goal Data: Compact Cards
- Pre-populate from client's active goals
- Each card: goal name, measurement type selector, dynamic data fields, prompt level, reinforcement, progress status, notes
- "Add Goal" for ad-hoc goals not in treatment plan
- Removable (RBT unchecks goals not addressed)

### Behavior Incidents: Inline Add
- "Add Behavior Incident" appends a card
- Each card: behavior name, time, ABC fields, duration, intensity, notes
- Multiple incidents per session

### Review Queue: Filtered Sessions List
- Sessions page tabs: All | Needs Review | Missing Notes | Overdue
- "Needs Review" = sessions where note status is 'signed' and current user is supervisor
- At-a-glance: client, date, RBT, CPT, units, time since signed
- Click → session detail → Note tab with Co-sign / Return for Revision buttons

### Signature: Button Click + Timestamp
- RBT: "Sign & Submit" → status: draft → signed (note becomes read-only)
- BCBA: "Co-sign" → status: signed → cosigned. Or "Return for Revision" with comment → back to draft
- Visual badges: Draft (gray), Signed (blue), Co-signed (green), Locked (dark)
- Phase 1: individual co-sign. Phase 2: bulk co-sign

### Timeliness: Visual Indicators
- Sessions list "Note" column with status badge
- Color dot: green <24h, amber 24-48h, red >48h
- Dashboard alert: "X sessions missing notes"
- No hard lock in Phase 1

---

## UX Decisions Made

1. **Tab on session detail** (not separate page or embedded section)
2. **Single scroll form** (not multi-step wizard)
3. **Pre-populate all active goals** (removable, default to "not_assessed")
4. **Button click signature** (not drawn/typed)
5. **Review queue as filter on sessions list** (not separate page)
6. **General comments on rejection** (not field-level annotations — Phase 2)
7. **Defer caregiver signature** to Phase 2
8. **Defer bulk co-sign** to Phase 2
9. **AI generation placeholder** in form layout (button visible but Phase 2)

---

## Sources

- CentralReach: CR Mobile RBT Workflow, Session Note Templates, Bulk Sign Timesheets, Goal Creator
- Motivity: Session Note Approval Workflow, Note Types, Note Templates, Data Collection
- Raven Health: AI Capabilities, ABA Note Template
- RethinkBH: Session Note AI (March 2026 launch)
- Theralytics: ABA Session Notes Examples
- ABA Matrix: Symbology/Statuses, Analyst Review, Quality Assurance
- Hi Rasmus: AI Session Notes, Signature Auditing
- Artemis ABA: Data Collection, RBT/BCBA Tools
