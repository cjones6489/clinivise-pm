# Clinivise AI Feature Brainstorm

> Living document. Add ideas freely — rank and prioritize periodically. Not everything here gets built. The goal is to capture every idea worth considering, then ruthlessly filter.
>
> **Last updated:** 2026-03-21

---

## Scoring Criteria

| Dimension | Scale | What It Means |
|-----------|-------|---------------|
| **Opportunity** | 1-5 | Market impact. How much revenue, retention, or differentiation does this create? |
| **Novelty** | 1-5 | How unique is this? 1 = every competitor has it. 5 = nobody in ABA/healthcare does this. |
| **Priority** | 1-5 | Should we build this soon? Factors: data availability, dependency chain, effort, risk. |
| **Effort** | S/M/L/XL | Engineering effort. S = days, M = 1-2 weeks, L = 3-4 weeks, XL = months. |
| **AI Type** | Label | `deterministic` = rules/math, `LLM` = needs language model, `hybrid` = both, `partner` = integrate, don't build |
| **Data Ready?** | Yes/No/Partial | Do we have the data needed today, or does it require features/time to collect? |

---

## Phase 1 — Buildable Now or With Current Sprints

### 1. AI Authorization Letter Parsing
Upload PDF → AI extracts structured auth data → confidence-scored review UI → save to authorization + services.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Saves 15-20 min per letter. BCBAs/billing staff (decision-makers) feel it immediately. |
| Novelty | ★★★★★ | No ABA competitor has this. CentralReach doesn't parse auth letters. |
| Priority | ★★★★★ | Phase 1 capstone AI feature (Sprint 4B). Validates the entire AI-native thesis. |
| Effort | L | AI pipeline + review UI + linked evidence + confidence scoring |
| AI Type | LLM | `generateObject` + vision model on PDF |
| Data Ready? | Yes | Auth letters are the input — no historical data needed. |

**Status:** In roadmap (Tasks A1-A10 + 97-100)

---

### 2. Authorization Utilization Intelligence
Progress bars, projected exhaustion dates, under-utilization alerts, revenue-at-risk calculations. Surfaces inline at point of action.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Prevents denied claims (over-utilized) and lost revenue (under-utilized). Directly impacts our 2-4% take. |
| Novelty | ★★★★☆ | CentralReach has basic tracking. Nobody does predictive pacing or inline point-of-action alerts. |
| Priority | ★★★★★ | Ships with authorizations (Sprint 2D). Zero AI cost — pure math. |
| Effort | M | Queries + dashboard widgets + inline alerts |
| AI Type | Deterministic | `used_units / approved_units`, linear projection, threshold alerts |
| Data Ready? | Yes | Comes from `authorization_services` table. |

**Status:** In roadmap (Sprint 2D tasks 72-73, Sprint 3B task 91)

---

### 3. Smart Authorization Matching (FIFO + Override)
When logging a session, auto-select the correct authorization. Show which auth will be used, handle overlapping auths, allow manual override with audit trail.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Prevents billing errors from selecting wrong auth. Common during re-authorization periods. |
| Novelty | ★★★☆☆ | Some competitors do basic auto-selection. Nobody shows the logic visibly or handles splits across auths. |
| Priority | ★★★★★ | Ships with session logging (Sprint 3A). Critical for billing accuracy. |
| Effort | M | FIFO logic + split-across-auths UI + audit logging |
| AI Type | Deterministic | FIFO sort by expiration date, unit availability check |
| Data Ready? | Yes | `authorizations` + `authorization_services` tables. |

**Status:** Partially in roadmap (Task 80 — auth enforcement). Needs explicit FIFO + split + override UI.

---

### 4. Supervision Compliance Tracker
Auto-calculate BACB supervision ratios per RBT per month. Alert BCBAs before deadlines are missed. Dashboard widget showing compliance status.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | BCBAs live in fear of compliance gaps. BACB can revoke RBT certification. Huge emotional value. |
| Novelty | ★★★★★ | No ABA competitor provides a dedicated supervision compliance view with auto-calculation and proactive alerts. |
| Priority | ★★★★☆ | Ships after sessions exist (Sprint 3A/3B). Needs session type tagging (direct vs supervision). |
| Effort | M | Queries (supervision hours / service hours), alert thresholds (30/45/60 days), dashboard widget |
| AI Type | Deterministic | Ratio math + date-based alerting |
| Data Ready? | Partial | Need session `type` field distinguishing direct service from supervision. Schema supports this via CPT codes (97155 = supervision). |

**Status:** Not in roadmap. **Add to Sprint 3B dashboard.**

---

### 5. Session Documentation Completeness Check
Post-save validation: required fields present, duration matches units, active auth exists, provider credential matches CPT, supervisor co-signature needed.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Catches errors before they become denied claims. Reduces billing rework. |
| Novelty | ★★★☆☆ | CentralReach NoteGuardAI does similar. But their UX is clunky. We can do it as a non-blocking post-save checklist. |
| Priority | ★★★★★ | Ships with session logging (Sprint 3A). Never blocks save — runs post-save. |
| Effort | S | Validation rules against existing schema data |
| AI Type | Deterministic | Rules-based checklist |
| Data Ready? | Yes | All data comes from the session + related tables. |

**Status:** Implied in Sprint 3A but not an explicit task. **Add as task.**

---

### 6. Insurance Eligibility Pre-Check Reminders
Before a session, remind the provider if the client's insurance hasn't been verified recently. Flag stale eligibility.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Lapsed eligibility = denied claim = lost revenue. Very common in small practices. |
| Novelty | ★★★☆☆ | Some competitors have eligibility checking. Nobody does proactive reminders before sessions. |
| Priority | ★★★☆☆ | Needs `client_insurance.lastVerifiedAt` field. Useful once sessions exist. Auto-verify is Phase 2 (Stedi). |
| Effort | S | Date comparison + notification |
| AI Type | Deterministic | Date math: days since last verification |
| Data Ready? | Partial | Need `lastVerifiedAt` on `client_insurance`. Manual update in Phase 1, auto via Stedi in Phase 2. |

**Status:** Not in roadmap. **Add to Phase 1 or early Phase 2.**

---

### 7. Payer-Specific Billing Rules Engine
Surface payer-specific rules contextually: "UHC caps 97153 at 6 units/day," "BCBS requires modifier 95 for telehealth," "Medicaid requires prior auth for 97151."

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Billing staff currently memorize these rules or learn from denials. Prevents systematic errors. |
| Novelty | ★★★★★ | No ABA competitor surfaces payer-specific rules inline during data entry. This is tribal knowledge made visible. |
| Priority | ★★★☆☆ | Needs a `payer_rules` table and manual data entry for top payers initially. High value but manual setup cost. |
| Effort | M | New table + admin UI + inline rule surfacing in session/claim forms |
| AI Type | Deterministic | Lookup table with contextual display |
| Data Ready? | No | Need to build `payer_rules` table and populate for top 5-10 payers manually. |

**Status:** Not in roadmap. **Add to Phase 2 pre-billing prep.**

---

### 8. Billing Anomaly Detection
Flag unusual billing patterns: sudden unit increases, unusual hours, same provider billing 12+ hours/day, duplicate session dates.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Protects practices from audits AND protects Clinivise from FCA liability (aligned incentives). |
| Novelty | ★★★★★ | No ABA competitor has this. Enterprise EHRs have audit tools but they're post-hoc, not proactive. |
| Priority | ★★★☆☆ | Needs 3-6 months of session data for meaningful baselines. Rules-based initially. |
| Effort | M | Statistical baselines + outlier detection + alert dashboard |
| AI Type | Hybrid | Rules for obvious patterns (>12 hrs/day), LLM for subtle pattern analysis later |
| Data Ready? | No | Needs accumulated session/claim history. Cold-start: use industry benchmarks for initial thresholds. |

**Status:** Not in roadmap. **Add to Phase 2.**

---

## Phase 2 — Needs Billing Infrastructure or Accumulated Data

### 9. Session Note Draft Generation
After session timer stops, AI drafts a note from structured session data (goals, trials, behavior incidents, CPT code, duration). Ghost text UX.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | #1 practitioner request. RBTs do this 6-8x/day. 5-10 min savings per session = 30-80 min/day. |
| Novelty | ★★★☆☆ | CentralReach NoteDraftAI, Mentalyc, Raven Health all have versions. Ours would be data-grounded (not ambient audio). |
| Priority | ★★★★☆ | Needs structured clinical data fields (goals, trials, behaviors) that don't exist in schema yet. |
| Effort | L | New schema (treatment goals, session clinical data) + AI pipeline + ghost text UI |
| AI Type | LLM | `generateObject` / `generateText` from structured session data |
| Data Ready? | No | Need `treatment_goals` table + structured session data fields (goal_id, trials, prompt_level, behavior_incidents). |

**Blocker:** Requires schema additions — `treatment_goals` table and clinical fields on sessions. Design alongside Sprint 3A.

---

### 10. Pre-Claim Error Scrubbing
Check claims before submission: auth validity, unit limits, CPT+modifier combos, NPI, timely filing, denial pattern matching.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Directly prevents denials. 20-30% denial reduction in first 60-90 days (industry benchmark). |
| Novelty | ★★★★☆ | CentralReach ClaimCheckAI exists. But no small-practice tool has this. |
| Priority | ★★★★☆ | 7 of 8 checks are deterministic rules. Only denial pattern matching needs historical data. |
| Effort | L | Rules engine + payer rules table + claim review UI + Phase 2 Stedi integration |
| AI Type | Hybrid | 85% rules-based, 15% LLM for pattern matching once data exists |
| Data Ready? | Partial | Rules-based checks work immediately. Pattern matching needs 6+ months of claim outcome data. |

**Status:** In roadmap (Task A12)

---

### 11. CPT Code Suggestion
Pre-fill CPT code based on provider type, client authorization, and historical session patterns.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★☆☆ | Saves a few seconds per session. Nice-to-have, not transformative. |
| Novelty | ★★☆☆☆ | Low novelty — it's smart defaults, not AI magic. |
| Priority | ★★★☆☆ | Easy to implement once session history exists. |
| Effort | S | Query last CPT for this client+provider pair, pre-fill |
| AI Type | Deterministic | Most recent CPT for client+provider combo |
| Data Ready? | No | Needs session history. Works after a few weeks of usage. |

**Status:** In roadmap (Task A13). Could ship as a simple smart default without AI branding.

---

### 12. Claim Denial Prediction
Before submission, assess denial risk from historical patterns. Risk score + factors + fixes.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Preventing a denial is worth $50-200 in rework per claim. Massive ROI. |
| Novelty | ★★★★★ | Nobody in ABA has this. Waystar has it for enterprise healthcare. |
| Priority | ★★★☆☆ | Needs 6+ months of claim outcome data. Cold-start with payer rules engine. |
| Effort | L | Data collection schema + LLM risk analysis + risk UI |
| AI Type | LLM | Feed historical patterns + claim details to `generateObject` with risk schema |
| Data Ready? | No | Need `claim_responses` with denial reason codes. Minimum 500+ claims for meaningful patterns. |

**Status:** In roadmap (Task A14)

---

### 13. AI Appeal Letter Generation
When a claim is denied, draft an appeal letter citing denial reason, CPT codes, and supporting clinical documentation.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Saves 30-60 min per appeal. But appeal volume is lower than other workflows. |
| Novelty | ★★★★★ | No ABA competitor has this. Manual process everywhere. |
| Priority | ★★★☆☆ | Needs denial data + clinical documentation to reference. |
| Effort | M | LLM template + denial reason routing + document references |
| AI Type | LLM | Generate appeal text from denial reason + session data + auth details |
| Data Ready? | No | Needs claim denials with reason codes + client clinical data. |

**Status:** In roadmap (Task A15)

---

### 14. Authorization Request Drafting
Help BCBAs *write* authorization requests (the other side of auth parsing). AI drafts clinical justification using session data and treatment progress.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Auth requests take 30-60 min. BCBAs do 5-20/month. Massive time savings. |
| Novelty | ★★★★★ | Nobody in ABA helps with the request side. Everyone focuses on reading auth letters, not writing auth requests. |
| Priority | ★★★☆☆ | Needs clinical data (treatment goals, progress metrics, session summaries) to draft from. |
| Effort | L | Clinical data schema + LLM drafting + payer-specific template library |
| AI Type | LLM | Generate clinical justification from session data + goals + progress |
| Data Ready? | No | Needs `treatment_goals` + session clinical data + progress tracking. |

**This is the potential 10x feature hiding in our auth lifecycle story.** Nobody else connects reading auths → tracking utilization → drafting re-auth requests.

---

### 15. Revenue Forecasting
Dashboard widget: "Projected collections next month" based on scheduled sessions × authorized units × payer rates × historical collection rates.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Practice owners check this weekly. Currently done in spreadsheets or not at all. |
| Novelty | ★★★★☆ | No ABA competitor provides forward-looking revenue projections. |
| Priority | ★★☆☆☆ | Needs session scheduling + payer rates + collection history. |
| Effort | M | Aggregation queries + projection logic + dashboard widget |
| AI Type | Deterministic → Hybrid | Start with simple math (sessions × rate). Add ML refinement with 6+ months data. |
| Data Ready? | No | Needs scheduled sessions, payer rate table, and claim payment history. |

**Status:** Not in roadmap. **Add to Phase 2 dashboard.**

---

### 16. Optimal Re-Authorization Timing
Alert when to request a new authorization — not when the old one expires, but with enough lead time based on the payer's typical processing time.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Gaps in authorization = unbillable sessions = lost revenue. |
| Novelty | ★★★★☆ | Some tools alert on expiry. Nobody accounts for payer processing time. |
| Priority | ★★★☆☆ | Start with configurable lead times per payer (30/45/60 days). Learn actual times from data. |
| Effort | S | Expiry date - lead time = alert trigger. Payer config field. |
| AI Type | Deterministic | Date math with per-payer offset |
| Data Ready? | Partial | Auth expiry dates exist. Payer processing times need manual config initially. |

**Status:** Not in roadmap. **Add to Sprint 2D (authorizations) or Phase 2.**

---

## Phase 3 — Advanced / Future

### 17. Parent Progress Summaries
AI generates plain-language reports from session data for parent communication.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★☆☆ | Nice-to-have. Parents appreciate it but it doesn't drive billing revenue. |
| Novelty | ★★★★☆ | Some competitors (Hi Rasmus) do basic versions. AI-generated plain-language is novel. |
| Priority | ★★☆☆☆ | Needs rich clinical session data. Nice Phase 3 feature. |
| Effort | M | LLM summarization + template + parent-facing view |
| AI Type | LLM | Summarize session data into parent-friendly language |
| Data Ready? | No | Needs treatment goals + session clinical data + progress tracking. |

**Status:** In roadmap (Task A16)

---

### 18. Voice-to-Structured Session Notes
RBT records voice memo → STT → LLM structures into note → review UI.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Would be transformative for field RBTs. Hands-free documentation. |
| Novelty | ★★★☆☆ | Mentalyc and Raven Health have versions. Ours would be ABA-specific structuring. |
| Priority | ★★☆☆☆ | Complex: audio storage, STT API, state consent laws (FL: 24hr advance consent for AI transcription). |
| Effort | XL | Audio capture + STT integration + LLM structuring + consent management + state feature flags |
| AI Type | LLM + Partner | Deepgram/AssemblyAI for STT, Claude for structuring |
| Data Ready? | N/A | Input is audio, not existing data. |

**Status:** In roadmap (Task A17). Recommend deferring to Phase 3.

---

### 19. Insurance Call Automation
AI voice agents call insurance companies for eligibility verification, claim follow-up, authorization requests.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | LunaBill proved 12x productivity. Infinitus has 100M+ call minutes. Massive time savings. |
| Novelty | ★★★★★ | No ABA competitor has this. Would be industry-first. |
| Priority | ★★☆☆☆ | Partner, don't build. Integrate with LunaBill or Infinitus API. |
| Effort | M (integration) | API integration + call status tracking + result parsing |
| AI Type | Partner | LunaBill or Infinitus handles the AI. We integrate results. |
| Data Ready? | Partial | Need client insurance details + claim data to feed to the call agent. |

**Status:** In roadmap (Task A18). Recommend partnership approach.

---

### 20. Caseload Balancing Intelligence
Help practice owners optimize: which RBT sees which clients. Factors: drive time, credentials, auth availability, client preferences, RBT session volume.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Practice owners spend hours on scheduling. Would reduce RBT burnout and improve utilization. |
| Novelty | ★★★★★ | CentralReach ScheduleAI exists but "hasn't saved time yet." Multi-constraint optimization is genuinely hard. |
| Priority | ★★☆☆☆ | Needs scheduling infrastructure, provider locations, client addresses. |
| Effort | XL | Multi-constraint optimization + visualization + drag-and-drop scheduling |
| AI Type | Hybrid | Rules for constraints, LLM for soft preferences and trade-off explanation |
| Data Ready? | No | Needs location data, scheduling infrastructure, provider availability. |

**Status:** Not in roadmap. **Phase 3+ feature.**

---

### 21. Native Chart Review / Clinical Quality Auditing (Brellium-style)
Automatically audit 100% of session notes for documentation quality, cloned/copy-paste detection, payer-specific compliance, billing-documentation alignment, and clinical quality scoring — before claims are submitted.

**Context:** Brellium ($6.4M revenue, 250K+ providers, $16.7M Series A) validates the market. CentralReach NoteGuardAI is locked into their ecosystem. OIG is actively auditing ABA Medicaid payments state by state — Indiana ($56M improper), Colorado ($77.8M), Wisconsin ($18.5M). 95 of 100 sampled Indiana enrollee-months didn't meet documentation requirements.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | OIG enforcement priority. Prevents revenue clawbacks ($42.6M in CO). Protects Clinivise's FCA exposure. Practices are terrified of audits. |
| Novelty | ★★★★☆ | Brellium exists, CentralReach NoteGuardAI exists. But no free PM tool has this built in. Small practices can't afford Brellium separately. |
| Priority | ★★★★☆ | Deterministic checks can ship with session logging. AI quality scoring needs data accumulation. |
| Effort | S → M → XL (staged) | Phase 1: deterministic checks (S). Phase 2: Brellium API integration (M). Phase 3: native AI (XL). |
| AI Type | Hybrid + Partner | Deterministic rules for structural checks, Brellium API or native LLM for quality/cloning detection |
| Data Ready? | Partial | Structural checks work with session data. Quality scoring needs session note content. |

**Recommended approach — build our own, staged:**

**Stage 1 — Deterministic checks (ship with Sessions, Sprint 3A):**
These catch what OIG auditors actually flag most — no AI needed:
- Missing signatures (therapist, supervisor, caregiver)
- Missing dates or timestamps
- Session time vs billed units mismatch (CMS 8-minute rule math)
- Provider credential doesn't match CPT code
- Duplicate sessions (same client, date, time, provider)
- Supervision ratio non-compliance
- Missing consent forms
- Session note filed >72 hours after service date

**Stage 2 — LLM-powered quality checks (Phase 2, once we have session note content):**
Build our own AI quality layer using Vercel AI SDK + Claude:
- Cloned/copy-paste note detection (text similarity via embeddings or LLM comparison)
- Clinical quality scoring (is the note individualized or templated?)
- Payer-specific compliance rules (from our `payer_rules` table)
- Flag vague behavioral descriptions ("behavioral issues" → needs operational definition)
- Check that session note content aligns with billed CPT code

**Stage 3 — Advanced quality models (Phase 3+, once we have audit outcome data):**
As we accumulate data from practices' actual audit results:
- Refine quality scoring based on which note patterns survive audits vs get flagged
- Payer-specific models from our claims response data
- Predictive audit risk scoring ("this practice's documentation pattern has a 40% audit risk")

**Competitive positioning:** CentralReach NoteGuardAI is locked into their ecosystem. Brellium is a separate paid tool ($6.4M revenue — small practices can't justify the cost). Clinivise offering chart review as a free, built-in feature would be a significant differentiator for small practices who are most vulnerable to OIG audits and least able to afford separate compliance tools.

**Key market stats for reference:** Brellium case studies show 70-80% QA cost reductions and providers scoring 90-100% going from 43% → 71%. This is the benchmark we're building toward — but as a native feature, not a third-party dependency.

**Status:** Not in roadmap. **Add deterministic checks to Sprint 3A. Build LLM quality layer in Phase 2.**

---

### 22. Treatment Plan Quality & Completeness Auditing
Audit treatment plans for: measurable goals with operational definitions, baseline data, mastery criteria, discharge/fade criteria, parent training objectives, medical necessity justification. Flag plans that wouldn't survive a payer audit.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Treatment plan deficiencies are the #1 finding in OIG ABA audits. Weak plans = denied auths = lost revenue. |
| Novelty | ★★★★★ | Nobody in ABA auto-audits treatment plans. BCBAs check manually (if at all). |
| Priority | ★★★☆☆ | Needs `treatment_goals` schema with structured fields (operational definitions, baselines, criteria). |
| Effort | M-L | Schema for structured treatment plans + rules-based completeness checks + LLM quality scoring |
| AI Type | Hybrid | Deterministic for presence checks (does goal have baseline data?), LLM for quality (is the operational definition measurable?) |
| Data Ready? | No | Need `treatment_goals` + `treatment_plans` tables with structured clinical fields. |

**Why this matters:** Indiana OIG found that initial assessments lacked "operational definitions of target behaviors" (e.g., "head-banging at least 5 times per hour" vs vague "behavioral issues"). Plans without measurable goals and discharge criteria are audit failures. An AI that flags "Goal 2 has no baseline data" or "Discharge criteria is vague — payers require specific measurable thresholds" would save BCBAs from audit nightmares.

**Status:** Not in roadmap. **Depends on treatment plan schema. Phase 2-3.**

---

### 23. Client Intake Pipeline Automation
Multi-step workflow for onboarding new clients: referral received → eligibility check → assessment scheduled → assessment completed → auth requested → auth received → services begin. Visualize as a Kanban board with automated task triggering at each stage.

Inspired by ABA Engine's workflow boards — but AI-native (auto-extract referral data, AI eligibility pre-check, auto-populate auth request from assessment).

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★★ | Client onboarding takes days/weeks of manual coordination. Practice owners cite this as a top pain point. ABA Engine claims ~2 hrs/week/client saved. |
| Novelty | ★★★★☆ | ABA Engine has a version (Kanban boards + forms). CentralReach has basic onboarding. Nobody has AI-powered intake that auto-extracts from referral documents. |
| Priority | ★★★☆☆ | Needs clients + insurance + authorizations to be built first. Pipeline visualization is Phase 2. |
| Effort | L | Pipeline schema (stages, tasks, triggers) + Kanban UI + notification system + optional AI doc extraction |
| AI Type | Hybrid | Deterministic for workflow logic/triggers, LLM for document extraction (referral letters, insurance cards) |
| Data Ready? | Partial | Pipeline stages are defined by the business process, not data. AI extraction needs document upload infrastructure (Sprint 4A). |

**Workflow stages:**
1. **Referral received** — log source, client demographics, diagnosis. AI could extract from referral letter PDF.
2. **Insurance verification** — check eligibility (manual in Phase 1, Stedi API in Phase 2). Surface last-verified date.
3. **Assessment scheduling** — match available BCBA to client location/availability.
4. **Assessment completed** — BCBA conducts 97151. Results inform treatment plan and auth request.
5. **Authorization requested** — submit to payer. AI could draft clinical justification (Feature #14).
6. **Authorization received** — AI parses auth letter (Feature #1). Create auth + services.
7. **Services scheduled** — match RBTs to client, auth-aware scheduling.
8. **Active treatment** — ongoing sessions, utilization tracking.

**Each stage transition can trigger:** task assignments, notification to next responsible person, deadline reminders, automatic status updates on the dashboard.

**Status:** Not in roadmap. **Phase 2 feature. Design pipeline schema alongside Sprint 2B (Clients).**

---

### 24. Geographic Scheduling Awareness
When assigning providers to clients, show drive time and distance. Optimize RBT-client matching to reduce travel between home visits. Map visualization of client locations and provider coverage areas.

Inspired by ABA Engine's map-based scheduling — but integrated into our auth-aware scheduling rather than as a standalone tool.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | RBTs spend significant unpaid time driving between clients. Reducing drive time = more billable hours = more revenue (directly impacts our 2-4% take). Practice owners cite this as a scheduling pain point. |
| Novelty | ★★★☆☆ | ABA Engine has map-based proximity matching. CentralReach ScheduleAI claims to handle this. Not novel, but not common in small-practice tools. |
| Priority | ★★☆☆☆ | Needs client addresses + provider home base/coverage area + scheduling infrastructure. Phase 2-3. |
| Effort | M-L | Geocoding API (Google Maps or Mapbox) + distance matrix calculation + map UI component + scheduling integration |
| AI Type | Deterministic | Geocoding + distance calculation. No LLM needed. Optimization algorithm for multi-stop routes is optional Phase 3. |
| Data Ready? | No | Need `address` fields on clients (home visit location) and providers (home base). Need scheduling feature. |

**Implementation approach:**
- Phase 1: Store client service location address and provider home base address (schema only)
- Phase 2: When scheduling, show distance between provider and client. Sort provider suggestions by proximity.
- Phase 3: Multi-client route optimization ("Provider Jordan has 3 home visits today — optimal order is Client A → B → C, total drive time: 47 min")

**Status:** Not in roadmap. **Add address fields to client/provider schema in Sprint 2B/2D. Map UI in Phase 2-3.**

---

### 25. Parent/Caregiver Portal
Parent-facing portal where caregivers can: complete intake forms, upload insurance cards and documents, view upcoming session schedules, receive session summaries, sign consent forms, and communicate with the practice.

Inspired by ABA Engine's parent portal (parent.abaengine.com) — but AI-enhanced (AI extracts insurance card data from uploaded photos, auto-generates parent-friendly session summaries).

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Reduces admin phone/email overhead significantly. Parents appreciate transparency. Industry-standard feature for mature platforms. |
| Novelty | ★★☆☆☆ | ABA Engine, CentralReach, and several competitors have parent portals. Not novel — but expected. |
| Priority | ★★☆☆☆ | Table stakes for a mature platform but not critical for Phase 1 practitioner adoption. Phase 2-3. |
| Effort | L-XL | Separate auth flow (parent accounts vs staff accounts), portal UI, permissions model, document upload, messaging |
| AI Type | Hybrid | Deterministic for scheduling/forms display. LLM for insurance card OCR and parent-friendly session summaries (Feature #17). |
| Data Ready? | Partial | Session data and schedules exist once core PM is built. Parent accounts require separate Clerk setup. |

**AI-native differentiator vs plain portals:**
- Parent uploads insurance card photo → AI extracts member ID, group number, payer name → auto-populates `client_insurance`
- After each session, parent sees a plain-language summary (not clinical jargon) — "Marcus had a great session today. He independently requested 12 of 20 items (60%, up from 45% last week)."
- Intake forms pre-fill from referral documents if available

**Status:** Not in roadmap. **Phase 2-3 feature. Not blocking for practitioner adoption.**

---

### 26. Client Intake Document AI Extraction
When onboarding a new client, extract structured data from uploaded documents: referral letters (client demographics, diagnosis, referring physician), insurance cards (member ID, group #, payer, plan type), and prior assessment reports.

| Dimension | Score | Notes |
|-----------|-------|-------|
| Opportunity | ★★★★☆ | Manual data entry from intake documents takes 15-30 min per client. Practices onboard 5-20 clients/month. |
| Novelty | ★★★★★ | No ABA competitor auto-extracts from intake documents. They all require manual entry. Extends our auth letter parsing AI to other document types. |
| Priority | ★★★☆☆ | Reuses the same AI pipeline as auth letter parsing (Feature #1) — `generateObject` + vision + confidence scores. Low marginal effort once the pipeline exists. |
| Effort | M | New Zod schemas per document type + extraction prompts + review UI (reuse auth review pattern) |
| AI Type | LLM | Same `generateObject` + vision model pattern as auth letter parsing |
| Data Ready? | Yes | Documents are the input — same as auth letters. No historical data needed. |

**Document types to support:**
1. **Insurance card** (photo) → member ID, group number, payer name, plan type, copay, effective date
2. **Referral letter** (PDF) → client name, DOB, diagnosis code, referring physician, reason for referral
3. **Prior assessment report** (PDF) → diagnosis, assessment scores, recommended service hours, previous provider

**Shares infrastructure with Feature #1 (auth letter parsing).** Same AI pipeline, different Zod schemas. Once the auth letter parser is built, adding new document types is mostly prompt + schema work.

**Status:** Not in roadmap. **Phase 2 feature. Low marginal effort after auth letter parsing ships.**

---

## Idea Parking Lot

> Raw ideas that need more thinking. Not scored yet.

- **Auto-detect duplicate clients** — fuzzy name matching + DOB when creating a new client. Prevent data entry errors.
- **Smart search across all entities** — Cmd+K searches clients, providers, auths, sessions with NLP understanding ("Jordan's auth for 97153")
- **Auto-generate superbills** — from session data, formatted per payer requirements
- **Treatment plan template library** — AI-assisted treatment plan creation from assessment data
- **Credential expiration tracking** — alert when provider credentials (RBT, BCBA, NPI) are approaching renewal deadlines
- **Client intake form automation** — AI extracts data from intake paperwork (demographics, insurance, diagnosis)
- **Session timer with contextual prompts** — during a session, surface reminders: "10 minutes remaining," "3 more min for next unit," "supervisor observation due this week"
- **Cross-practice benchmarking** — anonymized aggregate data: "Your denial rate is 8% vs industry average 12%"
- **Payer contract analysis** — AI reads payer contracts and extracts rate tables, requirements, exclusions
- **Waitlist management** — when an auth is approved, auto-notify staff to schedule. Track time-to-first-session.

---

## Priority Tiers (Summary)

### Tier 1 — Build in Phase 1 (high impact, data ready, low/no AI cost)
| # | Feature | Opp | Nov | Pri | AI Type |
|---|---------|-----|-----|-----|---------|
| 1 | Auth letter parsing | ★5 | ★5 | ★5 | LLM |
| 2 | Utilization intelligence | ★5 | ★4 | ★5 | Deterministic |
| 3 | Smart auth matching (FIFO) | ★4 | ★3 | ★5 | Deterministic |
| 4 | Supervision compliance tracker | ★5 | ★5 | ★4 | Deterministic |
| 5 | Documentation completeness check | ★4 | ★3 | ★5 | Deterministic |
| 6 | Eligibility pre-check reminders | ★4 | ★3 | ★3 | Deterministic |
| 21a | Chart review — deterministic checks (Stage 1) | ★5 | ★4 | ★4 | Deterministic |

### Tier 2 — Build in Phase 2 (needs billing infra or data accumulation)
| # | Feature | Opp | Nov | Pri | AI Type |
|---|---------|-----|-----|-----|---------|
| 7 | Payer billing rules engine | ★5 | ★5 | ★3 | Deterministic |
| 8 | Billing anomaly detection | ★5 | ★5 | ★3 | Hybrid |
| 9 | Session note drafts | ★5 | ★3 | ★4 | LLM |
| 10 | Pre-claim error scrubbing | ★5 | ★4 | ★4 | Hybrid |
| 14 | Auth request drafting | ★5 | ★5 | ★3 | LLM |
| 15 | Revenue forecasting | ★4 | ★4 | ★2 | Deterministic |
| 16 | Re-auth timing optimization | ★4 | ★4 | ★3 | Deterministic |
| 21 | Chart review — LLM quality checks (Stage 2) | ★5 | ★4 | ★4 | Hybrid |
| 22 | Treatment plan quality auditing | ★5 | ★5 | ★3 | Hybrid |
| 23 | Client intake pipeline (Kanban + automation) | ★5 | ★4 | ★3 | Hybrid |
| 26 | Client intake document AI extraction | ★4 | ★5 | ★3 | LLM |

### Tier 3 — Build in Phase 3 (complex, needs mature platform)
| # | Feature | Opp | Nov | Pri | AI Type |
|---|---------|-----|-----|-----|---------|
| 11 | CPT code suggestion | ★3 | ★2 | ★3 | Deterministic |
| 12 | Denial prediction | ★5 | ★5 | ★3 | LLM |
| 13 | Appeal letter generation | ★4 | ★5 | ★3 | LLM |
| 17 | Parent progress summaries | ★3 | ★4 | ★2 | LLM |
| 18 | Voice-to-structured notes | ★4 | ★3 | ★2 | LLM+Partner |
| 19 | Insurance call automation | ★5 | ★5 | ★2 | Partner |
| 20 | Caseload balancing | ★4 | ★5 | ★2 | Hybrid |
| 24 | Geographic scheduling awareness | ★4 | ★3 | ★2 | Deterministic |
| 25 | Parent/caregiver portal | ★4 | ★2 | ★2 | Hybrid |

---

*Add new ideas above the parking lot. Re-score quarterly as data availability and platform maturity change.*
