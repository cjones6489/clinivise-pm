# Goals Feature Spec

> The complete reference for everything goals-related in Clinivise. Architecture, data model, lifecycle, UI specifications, competitor findings, roadmap, and open questions.

---

## What Goals Are in ABA

In ABA therapy, goals are the clinical backbone. Everything flows through them:

1. **BCBA writes goals** as part of the Treatment Plan (ITP) — each goal describes a behavior to acquire or reduce
2. **Goals have objectives** — measurable milestones under each goal
3. **Objectives have targets** — specific discrete items to master (e.g., "request cookie," "request ball")
4. **RBTs work on targets** during sessions — collecting trial data, frequency counts, duration measures
5. **BCBAs review data** — graphs, trends, mastery criteria — and modify programs accordingly
6. **Progress reports** aggregate goal data for insurance re-authorization

The goal hierarchy: **Domain > Goal > Objective > Target**

---

## Architecture — Three Layers

Goals aren't one feature. They're a system with layers that build on each other:

```
Layer 1: Goals Tab (client page)
  └── Goal list grouped by domain
  └── Goal cards with status, type, objectives
  └── Add/edit/archive goals
  └── Status lifecycle management

Layer 2: Goal Detail Drawer
  └── Click a goal → drawer slides out
  └── Full description, mastery criteria, baseline
  └── Objectives with individual progress
  └── Mini progress chart (from session note data)
  └── Recent sessions that addressed this goal
  └── Behavior reduction details (function, BIP info)
  └── Protocol/procedure (RBT instructions)

Layer 3: Clinical Workspace (Phase 3-4)
  └── /clients/[id]/programs (separate page)
  └── Program builder (configure targets, protocols)
  └── Full graphing suite (phase lines, trends, dimensions)
  └── Session-by-session data table with per-trial detail
  └── Mastery automation
  └── Report generation for re-authorization
```

**Why three layers:** This is how every competitor evolved. Passage Health has a Goal Detail Drawer (Layer 2). Motivity has a full Programs workspace (Layer 3). CentralReach has Learning Trees (Layer 3). The drawer is the bridge — it gives BCBAs quick access without building the full workspace.

---

## Data Model

### Current Schema

**`client_goals`** (30 columns)
- id, organizationId, clientId, domainId
- goalNumber, title, description
- goalType: `skill_acquisition` | `behavior_reduction`
- status: `baseline` | `active` | `mastered` | `maintenance` | `generalization` | `met` | `on_hold` | `discontinued`
- baselineData, masteryCriteria, targetBehavior
- Behavior reduction: functionOfBehavior, replacementBehavior, operationalDefinition, severityLevel, crisisProtocol, antecedentStrategies, consequenceStrategies
- Assessment: assessmentSource, assessmentItemRef
- startDate, targetDate, metDate, treatmentPlanRef
- sortOrder, notes, deletedAt, createdAt, updatedAt

**`client_goal_objectives`** (15 columns)
- id, organizationId, goalId
- objectiveNumber, description, status, masteryCriteria
- currentPerformance, dataCollectionType, metDate
- sortOrder, notes, deletedAt, createdAt, updatedAt

**`client_goal_targets`** (14 columns)
- id, organizationId, objectiveId
- targetNumber, targetName, description, status
- masteryCriteria, metDate
- sortOrder, notes, deletedAt, createdAt, updatedAt

**`goal_domains`** (7 columns)
- id, organizationId, name, sortOrder, isDefault, createdAt, updatedAt
- Default domains: communication, social_skills, adaptive_behavior, behavior_reduction, academic, play_leisure, self_care, motor, vocational, other

### Schema Addition Needed

**`protocol` field on `client_goals`** — RBT instructions for how to run this program during a session. 4 of 5 competitors have this. Different from `description` (SMART goal statement for treatment plans). Example: "Use NET during play. Present 3-second time delay. Reinforce with preferred edible on VR3 schedule."

**`protocol` field on `client_goal_objectives`** — Some platforms (Motivity) have protocol at both the goal and objective level. Optional but matches competitor depth.

### Session-Goal Data Connection

Session notes capture per-goal data via `session_note_goals`:
- goalId (FK to client_goals), goalName (snapshot)
- measurementType, trialsCompleted, trialsCorrect, percentageCorrect
- frequencyCount, durationSeconds, ratePerMinute, latencySeconds
- stepsCompleted, stepsTotal, probeCorrect/Total, ratingScaleValue/Max
- intervalsScored/Total, promptLevel, reinforcement, progressStatus

This data powers the mini progress chart in the Goal Detail Drawer.

---

## Goal Status Lifecycle

```
baseline → active → mastered → maintenance → generalization → met
                  ↘ on_hold ↗
                  ↘ discontinued
```

**Valid transitions (server-enforced):**
- baseline → active, on_hold, discontinued
- active → mastered, on_hold, discontinued
- mastered → maintenance, active, on_hold, discontinued
- maintenance → generalization, mastered, active, on_hold, discontinued
- generalization → met, maintenance, active, on_hold, discontinued
- met → active (reactivate)
- on_hold → baseline, active, discontinued
- discontinued → active (reactivate)

**Auto-behaviors:**
- Setting status to "met" auto-sets `metDate` and cascades status to child objectives
- Reactivating from "met" clears `metDate`

---

## Goal Types

### Skill Acquisition
- Color: Emerald accent
- Data: trials, frequency, duration, task analysis steps
- Focus: teaching new behaviors/skills
- Progress: measured by accuracy, independence, generalization

### Behavior Reduction
- Color: Amber accent
- Additional fields: functionOfBehavior, replacementBehavior, operationalDefinition, severityLevel, crisisProtocol, antecedentStrategies, consequenceStrategies
- Data: frequency counts, duration, intensity, ABC incidents
- Focus: reducing problematic behaviors while teaching replacements
- Progress: measured by decreasing frequency/duration/intensity

---

## Competitor Field Analysis (Verified 2026-03-27)

### What Competitors Show on Goal List View

| Field | Shown? | Platforms |
|---|---|---|
| Goal name | Yes | All 5 |
| Status/phase | Yes | All 5 |
| Goal type (SA/BR) | Yes | 4 of 5 (ABA Matrix color-codes) |
| Domain group | Yes | All 5 |
| Objectives/targets | Nested | 4 of 5 |
| Goal number | No | 0 of 5 — goals identified by name |
| Mastery criteria | No | 0 of 5 — detail view only |
| Last session data | No | 0 of 5 — graphs only |
| Baseline data | No | 0 of 5 — detail view |
| Description | No | 0 of 5 — detail view |
| Assessment source | No | 0 of 5 — detail view |
| Treatment plan ref | No | 0 of 5 — no platform does this at all |
| Dates | No | Only CentralReach (filterable) |
| Inline graph | No | 0 of 5 (CentralReach has graph link) |

**Takeaway:** The list view is deliberately sparse. Name, status, type, objectives. Everything else lives in the detail view.

### What Competitors Show on Goal Detail View

| Field | Shown? | Platforms |
|---|---|---|
| Full description | Yes | All 5 |
| Mastery criteria | Yes | All 5 |
| Baseline data | Yes | All 5 |
| Status + history | Yes | All 5 |
| Protocol/procedure | Yes | 4 of 5 (not Passage) |
| Objectives with progress | Yes | 4 of 5 |
| Session data | Yes | All 5 |
| Progress graph | Yes | All 5 |
| Phase/condition info | Yes | 4 of 5 |
| Prompting hierarchy | Yes | All 5 (Phase 3 for us) |
| Data collection config | Yes | All 5 (Phase 3 for us) |
| Notes/comments | Only Passage | We have notes field |
| File attachments | Passage + CentralReach | Phase 2+ |
| Assessment source | Only ABA Matrix | We show it |
| Function of behavior | Only ABA Matrix | We show it |
| Treatment plan ref | 0 of 5 | Remove from UI (keep in schema) |

### What NO Platform Shows

- Treatment plan reference on goals (0 of 5)
- Goal creation author/modifier (only Catalyst)
- Version history on goals (0 of 5)
- Approval workflows on goals (0 of 5)
- Insurance/payer linkage on goals (0 of 5)
- Cost/billing data on goals (0 of 5)

---

## Goal List Card — Final Design

Based on competitor verification, the goal card shows only:

```
┃ Manding for preferred items
┃ [Active]  Skill Acquisition                              [→]
┃
┃ ● 1.1 Request preferred edibles — partially met
┃ ✓ 1.2 Request preferred toys — met
┃ ○ 1.3 Request during transitions — baseline
```

- **Name** — text-sm font-semibold (primary)
- **Status badge** — color-coded per lifecycle status
- **Type badge** — "Skill Acquisition" or "Behavior Reduction"
- **Colored left accent** — emerald (SA) or amber (BR)
- **Objectives** — always visible, with progress icons (● active, ✓ met, ○ baseline)
- **Click affordance** — hover state + chevron → opens Goal Detail Drawer
- **Overflow menu** [···] — on hover, for status changes and archive

**Not on the card:** mastery criteria, baseline, dates, assessment source, description, treatment plan ref, protocol. All in the drawer.

---

## Goal Detail Drawer — Final Design

When you click a goal card, a drawer (~480px) slides out from the right.

### Sections:

**1. Header**
- Goal name (large)
- Status badge + type badge
- Overflow menu (edit, status change, archive)

**2. Description**
- Full SMART goal statement
- Protocol/procedure (RBT instructions) — if populated

**3. Mastery & Progress**
- Mastery criteria
- Baseline data
- Current performance (from most recent session)
- Mini line chart (accuracy/frequency over time)

**4. Objectives**
- Each objective with: number, description, status icon, current performance, data collection type
- Expandable to show targets (Phase 3)

**5. Recent Sessions**
- Last 3-5 sessions that referenced this goal
- Date, accuracy/data, provider, CPT code

**6. Behavior Details (behavior_reduction only)**
- Function of behavior
- Severity
- Operational definition
- Replacement behavior
- Antecedent/consequence strategies
- Crisis protocol

**7. Details (collapsed by default)**
- Started date
- Target date
- Met date (if applicable)
- Assessment source + item ref
- Notes

**8. Footer**
- "Open in Programs →" (placeholder for Phase 3 clinical workspace)

---

## Phased Roadmap

### Phase 2A — NOW
- [ ] Add `protocol` field to `client_goals` schema
- [ ] Goals tab visual redesign (colored accents, sparse cards, domain summaries)
- [ ] Goal Detail Drawer (description, mastery, mini chart, sessions, behavior details)
- [ ] Basic progress chart from session_note_goals data

### Phase 3 — Data Collection Foundation
- [ ] Target CRUD under objectives
- [ ] Protocol field on objectives
- [ ] Data collection interface (DTT, frequency, duration, task analysis)
- [ ] Clinical Workspace page at `/clients/[id]/programs`
- [ ] Mastery automation
- [ ] Advanced graphing (phase lines, trends, instructor filtering)

### Phase 4 — Intelligence
- [ ] AI-generated progress summaries
- [ ] Progress report generation for re-authorization
- [ ] Goal template library (50+ curated, org-custom)
- [ ] Assessment integration (VB-MAPP/ABLLS-R → auto-suggest goals)
- [ ] Payer-approved report templates

---

## Open Questions

1. **Protocol field scope:** Add to goals only, or goals + objectives? (Recommendation: goals only for Phase 2, add to objectives in Phase 3)
2. **Goal number display:** No competitor uses numbered IDs. Keep goalNumber for sort order but don't display prominently? (Recommendation: show as subtle prefix "1." but not as a badge)
3. **Treatment plan reference:** No competitor links goals to treatment plans. Keep field in schema but remove from all UI? (Recommendation: yes, remove from UI)
4. **Graph library:** What charting library for the mini progress chart? (Options: recharts, visx, chart.js. Recommendation: recharts — lightest, good React integration)
5. **Drawer vs Sheet:** Use shadcn Sheet component (slide-in panel) or build custom drawer? (Recommendation: shadcn Sheet, right-aligned, ~480px width)

---

## Sources

- `docs/research/goals-feature-scope-research.md` — full competitive analysis
- `docs/research/session-note-requirements-research.md` — session-goal data connection
- Motivity help docs, Passage Health design case study, CentralReach help center, Catalyst/Ensora product pages, ABA Matrix documentation
