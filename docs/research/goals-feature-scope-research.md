# ABA Goals Feature Set: Full Scope Research

> Research date: 2026-03-27
> Scope: Complete goals/programs feature set across 5 platforms (Motivity, Raven Health, Passage Health, CentralReach, Catalyst/RethinkBH). Goal structure, data collection, progress visualization, treatment plans, session-goal connection, role-based views.

## Key Takeaway

Every successful ABA platform has a tight loop: **Goals > Data Collection > Graphs > Reports**. The loop IS the product. Our build order (PM foundation > Goals registry > Session notes > Data collection > Graphing > Billing) matches how successful platforms evolved.

The immediate high-value move: **make existing goals + session notes data visible through progress graphs and a goal detail view.** We already capture per-goal session data. Surfacing it as simple line charts gives BCBAs something they use daily for clinical decisions.

## Table Stakes (every platform has these)

1. Goal hierarchy: Domain > Goal > Objective (minimum)
2. Skill acquisition AND behavior reduction types
3. Goal status lifecycle
4. Baseline data recording
5. Mastery criteria definition
6. Session notes that reference goals
7. Progress graphs per goal (line graphs minimum)
8. Progress report generation from goal data
9. Goal template library
10. Domain-based grouping
11. Protocol/procedure descriptions on goals

## What Differentiates

1. No-code program builder (Motivity) — 30,000+ community templates
2. 20+ dimension graphing engine (Catalyst)
3. AI session narrative generation (Raven Health)
4. Goal Detail Drawer (Passage Health) — session history, mastery, collaboration
5. Payer-approved report templates (Motivity)
6. Assessment-to-goal workflow (CentralReach, RethinkBH)
7. Live session monitoring (Motivity)

## Clinivise Roadmap for Goals

### NOW (Phase 2 — current work)
- Improve Goals tab UI (design refresh — in progress)
- Goal Detail View (click into a goal → description, mastery, status history, session data)
- Progress Graphing (basic line chart — accuracy % over time from session note data)
- "Last session" indicator on goal cards

### NEXT (Phase 3 — Data Collection Foundation)
- Target CRUD under objectives (schema exists)
- Data collection types (DTT, Frequency, Duration, Task Analysis)
- Session data entry interface (mobile-first tap-to-record)
- Mastery criteria automation

### LATER (Phase 4+ — Intelligence Layer)
- Advanced graphing (phase lines, trends, instructor filtering)
- AI note generation from structured data
- Progress report generation for re-authorization
- Goal template library (50+ curated, org-custom)
- Assessment integration (VB-MAPP/ABLLS-R → auto-suggest goals)

## Open Questions

1. Data collection: PM-only or building real data collection? (Answer: Phase 3)
2. Goal Detail: page or drawer? (Recommendation: drawer first, page later)
3. Graph types: minimum = line graph per goal (accuracy over time)
4. Goals-to-auth connection: implicit for now (via treatment plan ref)
5. BIP as separate structure? (No — behavior reduction goals with rich fields suffice)
6. Goal creation restricted to BCBAs? (Yes — already enforced)
7. Met goals: collapse but keep selectable in session notes
8. External tool import: Future (no public APIs exist)

## Sources
See full platform-by-platform analysis in research agent output.
