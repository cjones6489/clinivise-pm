# ABA Session Note Template Customization: Competitor Research & Strategy

> Research date: 2026-03-27
> Scope: How ABA EHR platforms handle session note templates, customization, payer-specific variants, and the tension between structured data and clinical flexibility. Informs Clinivise's template strategy for Phase 2 and beyond.
> Related: `session-note-requirements-research.md` (clinical requirements & compliance)

---

## Table of Contents

1. [The Problem: Why One Template Doesn't Fit All](#1-the-problem-why-one-template-doesnt-fit-all)
2. [Competitor Analysis](#2-competitor-analysis)
3. [Industry Patterns & Approaches](#3-industry-patterns--approaches)
4. [Payer-Specific Documentation Differences](#4-payer-specific-documentation-differences)
5. [Implications for Clinivise](#5-implications-for-clinivise)
6. [Phased Implementation Plan](#6-phased-implementation-plan)

---

## 1. The Problem: Why One Template Doesn't Fit All

ABA session notes serve two masters: **clinical documentation** (what actually happened) and **billing compliance** (what the payer requires to justify payment). The challenge is that different payers, states, and practices have different documentation requirements:

- **TRICARE** is the most prescriptive — requires specific fields, quarterly progress reports, and Autism Care Demonstration (ACD) documentation
- **Medicaid** varies by state — California, Texas, and Florida all have different audit criteria, timelines, and required fields
- **Commercial payers** (Optum/UHC, Aetna, BCBS, Cigna) each have their own documentation standards and audit rubrics
- **Internal standards** — many practices have documentation policies that exceed payer minimums (e.g., requiring behavior data on every session, even when the payer doesn't mandate it)
- **Multi-funder practices** — a single practice may serve clients funded by Medicaid, TRICARE, Optum, and Aetna simultaneously, each requiring different documentation

**The result**: No single fixed template works for every practice. The industry standard is either (a) customizable templates or (b) structured data collection with auto-generated narratives.

---

## 2. Competitor Analysis

### 2.1 CentralReach (Market Leader — Enterprise ABA)

**Approach: Full drag-and-drop note template builder**

CentralReach offers the most mature template system in ABA. Key features:

- **Template Builder UI**: Sidebar with preset and custom sections. BCBAs/admins create templates by dragging field types into a canvas.
- **Preset sections** with configurable fields:
  - Provider Information (name, credentials, metadata)
  - Learner Information (name, diagnosis, insurance, custom metadata)
  - Appointment Details (date, times, duration, billing code, units, POS, location)
  - Signatures (client, provider, additional — each toggleable as required)
  - Session Summary (title, description, comments toggle)
- **Custom sections**: Users add "Section Header" blocks, then drag in field types:
  - Text Field (short answer)
  - Text Area (long answer)
  - Single Select (radio/dropdown)
  - Multi Select (checkboxes)
  - Each field can be marked required or optional
- **Dynamic fields**: Auto-pull data from other CentralReach modules — client name from Contacts, appointment info from Scheduling, clinical data from Learn module
- **Learn module integration**: Goal Creator option dynamically inserts client goals and data collection placeholders from the treatment plan
- **Multiple templates per org**: Organizations create templates per CPT code, per payer, per service type. A practice might have 8-15 active templates.
- **NoteGuardAI (2024)**: AI-powered note review that scans completed notes for compliance gaps, vague language, missing fields, and clone detection
- **System templates**: Pre-built templates that orgs can copy and modify as a starting point

**Strengths**: Maximum flexibility, mature ecosystem, dynamic data integration
**Weaknesses**: Complex setup, steep learning curve, expensive ($75-125/user/month)

Sources:
- [CentralReach: Notes & Forms Templates](https://help.centralreach.com/notes-forms-templates/)
- [CentralReach: Session Note Templates](https://help.centralreach.com/session-note-templates/)
- [CentralReach: Create a Note & Form Template](https://help.centralreach.com/create-a-note-form-template/)
- [CentralReach Community: How To Create an ABA Session Note Template](https://community.centralreach.com/s/article/how-to-create-an-aba-session-note-template)

### 2.2 Motivity (Clinical-First ABA Platform)

**Approach: Template builder with session type linking and approval workflows**

Motivity is the strongest clinical competitor (data collection, graphing, note templates):

- **Template builder**: `+` button inserts fields and sections. Sections group related content (e.g., "Demographics", "Session Summary", "Goals").
- **Field types**: Text, text area, select, multi-select, checkbox, date, number
- **Required field indicators**: Red indicator on required fields until completed
- **Profile data injection**: Templates auto-import learner, member, and organization profile data — no manual entry for demographics
- **Session type linking**: Templates are associated with billing codes/session types. When a provider creates a note for a 97153 session, the correct template auto-loads.
- **Session Note QA/Approval Workflow**: Configurable multi-step review chain. Notes route through reviewers (e.g., BCBA reviews RBT notes, Clinical Director reviews BCBA notes) before finalization.
- **Custom fields in exports**: Custom fields added to templates are included in session data exports for analysis
- **Report templates**: Separate template system for progress reports, using the same builder paradigm

**Strengths**: Tight integration with data collection, good approval workflow, clinical-first design
**Weaknesses**: Learning curve for template setup, less billing/PM depth than CentralReach

Sources:
- [Motivity: Creating Note and Report Templates](https://help.motivity.net/create-session-note-templates)
- [Motivity: Session Note QA Process Features](https://www.motivity.net/feature/session-note-qa-process)
- [Motivity: Session Types](https://help.motivity.net/session-types)
- [Motivity: Adding Profile Information into Note Templates](https://help.motivity.net/adding-learner-member-and-organization-profile-information-into-a-note-template)

### 2.3 Catalyst / Rethink Behavioral Health (Data Collection Pioneer)

**Approach: Structured data collection with auto-generated session summaries**

Catalyst (now part of Rethink Behavioral Health) takes a fundamentally different approach:

- **Data collection IS the note**: RBTs collect trial-by-trial data, frequency counts, duration, etc. during sessions using tablet/mobile interfaces
- **Auto-generated summaries**: The system generates session note narratives from collected data — goals worked on, trial results, prompt levels, behavior incidents
- **Less template customization**: Because the note is generated from structured data, there's less need for free-text template building
- **Graph-first**: Clinical data drives automatic graphing; the note is a byproduct of the data, not the other way around
- **Protocol/program builder**: BCBAs build treatment protocols (programs) that define what data to collect; this implicitly defines note content

**Strengths**: Fastest note completion, most objective data, eliminates clone risk
**Weaknesses**: Less flexibility for practices that want narrative-heavy notes, less payer-specific customization

### 2.4 Raven Health (AI-Powered All-in-One)

**Approach: AI-powered platform with data collection, billing, and note generation**

Raven Health positions itself as a full ABA software platform with AI at the center. Key findings:

- **AI-powered note generation**: Core feature — AI generates session notes from collected data. The platform markets "AI capabilities" as a primary differentiator alongside data collection and billing.
- **Data collection**: Mobile-friendly data collection during sessions (frequency, duration, trial-by-trial). Data feeds both graphing and AI note generation.
- **Full platform**: Scheduling, data collection, session notes, billing, reporting — all-in-one, not just a notes tool.
- **Target market**: Growing ABA practices. Marketing emphasizes ease of use and modern design vs. legacy platforms like CentralReach.
- **Blog content strategy**: Heavy investment in educational content (8 key components of effective session notes, how to write notes for insurance, BCBA guides) — positions them as thought leaders.
- **Pricing**: Per-learner/month model. Exact pricing requires demo, but third-party sources (GetApp, Capterra, SoftwareAdvice) indicate competitive with mid-market ABA tools.
- **Template approach**: Less emphasis on user-built templates. The AI adapts output based on CPT code and session data. BCBAs review and edit AI-generated notes rather than designing template layouts.

**Strengths**: Modern UX, AI-first approach, all-in-one platform, strong content marketing
**Weaknesses**: Newer platform (less market validation), less customization for practices with rigid template requirements, pricing not transparent

Sources:
- [Raven Health: AI-Powered ABA Platform Features](https://ravenhealth.com/key-features-ai-capabilities/)
- [Raven Health: ABA Billing Software Pricing](https://ravenhealth.com/pricing/)
- [Raven Health: 8 Key Components of an Effective ABA Session Note Template](https://ravenhealth.com/blog/aba-note-template/)
- [Raven Health: How to Write ABA Session Notes for Insurance](https://ravenhealth.com/blog/aba-session-notes-for-insurance/)
- [GetApp: Raven Health 2026 Pricing, Features, Reviews](https://www.getapp.com/healthcare-pharmaceuticals-software/a/raven-health/)

### 2.5 Hipp Health (AI-Native, Mobile-First)

**Approach: AI-native platform with multi-modal note capture and payer-calibrated AI generation**

Hipp Health is the most aggressive AI-native newcomer. Raised $6.2M (October 2025) specifically to automate behavioral health admin. Key findings:

- **Multi-modal note capture**: Providers can **write, record, or photograph** session notes on the go. This is unique — most platforms only support typed input. Hipp accepts voice recordings, handwritten notes (via photo), and typed text, then uses AI to process all formats.
- **LLM-powered notes calibrated to individual payer templates**: This is the standout feature. Hipp's AI doesn't just generate generic notes — it **calibrates output to each payer's specific documentation requirements**. A TRICARE note and a Medicaid note from the same session would be formatted differently.
- **Compliance Agent**: AI-powered compliance scanning that checks clinical notes, authorizations, and verifications in real-time. Identifies risks and auto-generates remediation tasks. Treats addendum notes and attached documents as valid content. Uses whole-word matching to reduce false positives.
- **Session Verification**: Dedicated page that consolidates verification workflow — date range, service line, clinic location, provider filters in one view.
- **Data collection**: Mobile app for in-session data collection. Live-streaming and graphing from multiple sessions simultaneously.
- **Auto-generated claims**: Notes flow directly into claims generation — the AI pipeline goes from session data to note to claim.
- **Live session streaming**: Supervisors can observe sessions remotely in real-time.
- **Smart scheduling**: AI-assisted scheduling with utilization rate tracking.
- **Target market**: ABA practices of all sizes, but messaging emphasizes operational efficiency ("Your Practice on Autopilot").
- **Founded by**: Veterans from behavioral health and tech. HIPAA-compliant by design, not as an afterthought.
- **Pricing**: Not publicly listed. Requires demo.
- **Reported results**: Practices report 90% reduction in claims outstanding.

**Strengths**: Most innovative approach to note capture (voice, photo, text), payer-calibrated AI, compliance agent, modern mobile-first design, strong funding
**Weaknesses**: Early-stage platform, unproven at scale, pricing opaque, heavy AI dependence may concern clinicians who want manual control

**Key insight for Clinivise**: Hipp's payer-calibrated AI notes are the most compelling feature in the market. Rather than asking practices to build templates per payer, the AI automatically adapts. This aligns with the user's observation that funder requirements vary too much for one-size-fits-all templates.

Sources:
- [Hipp Health: Effortless Clinical Notes](https://www.hipp.health/product/aba-session-notes)
- [Hipp Health: Compliance Agent](https://www.hipp.health/product/aba-compliance-agent)
- [Hipp Health: Data Collection and Analytics](https://www.hipp.health/product/aba-data-collection-software)
- [HIT Consultant: Hipp Health Secures $6.2M (Oct 2025)](https://hitconsultant.net/2025/10/06/hipp-health-secures-6-2m-for-ai-native-platform-to-automate-behavioral-health-admin/)
- [Mission Viewpoint: Platform Card — Hipp Health](https://www.missionviewpoint.com/platform-card-hipp-health/)

### 2.6 Passage Health (Content-First PM Platform)

**Approach: Practice management with EHR integration emphasis and content marketing**

Passage Health positions as an all-in-one ABA practice management platform. Notable findings:

- **Blog/content strategy**: Extremely active content marketing — publishes comprehensive comparison articles ("Top 5 ABA Practice Management Software", "7 Best ABA Data Collection Software"). Positions themselves as the definitive buyer's guide.
- **EHR integration emphasis**: Marketing emphasizes how EHR integration improves practice efficiency. This suggests their own EHR features may be developing, with current strength in PM + integration.
- **Session notes guidance**: Published detailed guide on "How to Take Effective ABA Session Notes" with examples — suggests they understand the documentation problem but may not yet have a differentiated solution.
- **Frontera AI (separate entity)**: Frontera Health (fronterahealth.com) is a separate company focused on **ABA assessment report automation** — "Write ABA Assessment Reports 75% Faster." Frontera focuses on initial assessments (97151), not session notes. Has an "Assessment Builder" tool. Frontera and Passage appear to be separate companies despite some marketing overlap.
- **Target market**: Small to mid-size ABA practices. Content targets practice owners and BCBAs making software decisions.
- **Pricing**: Not publicly available.

**Strengths**: Strong content/SEO presence, practice management depth, integration focus
**Weaknesses**: Session note features less differentiated than Raven/Hipp, may be more PM than clinical tool

Sources:
- [Passage Health: How to Take Effective ABA Session Notes](https://www.passagehealth.com/blog/aba-session-notes-examples)
- [Passage Health: Top 5 ABA Practice Management Software](https://www.passagehealth.com/blog/aba-practice-management-software)
- [Passage Health: How EHR Integration Improves ABA Practice Efficiency](https://www.passagehealth.com/blog/ehr-integration)
- [Frontera Health: ABA Clinical Report Automation](https://fronterahealth.com/)

### 2.7 AlohaABA (PM-Focused)

**Approach: Simple, basic note fields**

- **Not a full EHR** — focuses on practice management (billing, scheduling, authorization tracking)
- **Basic session notes**: Simple text fields, no template builder
- **No clinical documentation depth**: Practices using AlohaABA typically pair it with a clinical tool (Motivity, Catalyst) for session notes
- **Strength is in billing workflow**, not documentation

### 2.8 Other Notable Platforms

- **Hi Rasmus**: Emerging platform focused on modern UX and AI. Template customization details limited in public documentation.
- **Artemis ABA**: Blog-heavy with templates and guides but limited platform customization features publicly documented.
- **Theralytics**: Offers configurable note templates with payer-specific variants. Template builder less mature than CentralReach/Motivity.
- **Praxis Notes**: AI-powered note writing specifically for ABA. Not a full EHR — bolt-on tool for note generation.
- **Noteable**: All-in-one ABA and behavioral health PM software. Less AI emphasis, more traditional PM approach.

---

## 3. Industry Patterns & Approaches

### 3.1 Two Dominant Paradigms

The ABA EHR market has converged on two approaches to session notes:

#### Paradigm A: Template Builder (CentralReach, Motivity, Theralytics)

```
Admin/BCBA designs template → Provider fills in template → Reviewer approves → Signed
```

- Organizations build custom templates per CPT code, payer, or service type
- Maximum flexibility — every practice gets exactly the form they want
- Higher setup cost — someone has to design and maintain templates
- Risk of poorly designed templates that miss compliance requirements
- **Best for**: Established practices with specific documentation standards, multi-payer organizations

#### Paradigm B: Structured Data + Auto-Generation (Catalyst, Raven Health, Praxis Notes)

```
Provider enters structured data → System generates narrative → Provider reviews → Signed
```

- Data collection drives note content — not the other way around
- Consistent quality — system ensures required fields are present
- Lower setup cost — templates are implicit in the data model
- Less flexibility for practices that want specific narrative styles
- **Best for**: Practices that prioritize speed and consistency over customization

### 3.2 The Emerging Hybrid (Where the Market is Going)

The most forward-thinking platforms are converging on a hybrid:

1. **Structured data collection** captures objective, measurable information (trials, frequencies, durations, prompt levels, behavior incidents)
2. **Customizable template sections** handle the narrative/clinical judgment portions (session summary, barriers, caregiver communication, plan)
3. **AI fills the gap** — generates narrative drafts from structured data, placed into the template sections
4. **Compliance guardrails** — system validates that payer-required fields are complete before signing

This hybrid gives practices both speed (structured data + AI generation) and flexibility (customizable narrative sections).

### 3.3 What's Table Stakes vs. Differentiating

| Feature | Table Stakes | Differentiating |
|---------|-------------|-----------------|
| CPT-specific default templates | Yes | No |
| Required field validation before signing | Yes | No |
| Digital signature + cosignature workflow | Yes | No |
| Custom note templates (org-level) | Getting there | Still differentiating for small practices |
| AI note generation from structured data | Not yet | Yes — major differentiator |
| Payer-specific template variants | Yes for enterprise | Differentiating for SMB |
| Clone detection / note uniqueness checking | Emerging | Yes |
| Real-time compliance checking during note writing | No | Yes — very few do this |

---

## 4. Payer-Specific Documentation Differences

### 4.1 Why Payer Differences Matter

A practice with 50 clients might serve:
- 20 clients on Medicaid (state-specific requirements)
- 10 clients on TRICARE (federal, most prescriptive)
- 8 clients on Optum/UHC (commercial, consistency audits)
- 5 clients on Aetna (commercial, different audit focus)
- 4 clients on BCBS (varies by state plan)
- 3 clients on Cigna (commercial)

Each payer has different expectations for what a compliant session note looks like.

### 4.2 Key Payer Differences

| Requirement | TRICARE | Medicaid (typical) | Optum/UHC | Aetna |
|-------------|---------|-------------------|-----------|-------|
| Signature timeline | 24 hours | 24-72 hours (varies by state) | 48 hours | 72 hours |
| BCBA cosignature on RBT notes | Required | Varies by state | Recommended | Not required |
| Behavior data required | Always | Usually | If applicable | If applicable |
| Treatment plan goals in note | Must reference specific goals | Must reference goals | Must demonstrate medical necessity | Must demonstrate progress |
| Specific template format | ACD-specific fields required | No specific format | No specific format | No specific format |
| Progress report frequency | Quarterly | Monthly-Quarterly | Quarterly | Every 6 months |
| Clone detection sensitivity | Very high | Moderate | High (AI-based auditing) | Moderate |
| Time documentation | Start/end time required | Start/end or duration | Duration sufficient | Duration sufficient |

### 4.3 TRICARE-Specific Requirements (Most Prescriptive)

TRICARE's Autism Care Demonstration (ACD) requires:
- Specific session note fields (not just free-text)
- Quarterly quality monitoring reports
- Direct linkage between session activities and treatment plan goals
- Behavior reduction data when applicable
- Caregiver involvement documentation
- Supervision documentation for RBT sessions
- Consistent formatting across all notes (facilitates audit)

### 4.4 Implications for Template Design

The payer differences mean:
1. **Default templates must cover the union of all common requirements** — if TRICARE requires it, include it even for Medicaid clients (optional for Medicaid, required for TRICARE)
2. **Per-payer required field rules** — what's required for signing should vary by the client's payer
3. **Template variants** — some practices want entirely different templates per payer, not just different required fields

---

## 5. Implications for Clinivise

### 5.1 What We Built (CD-2.7)

Our current implementation uses **Paradigm B (structured data) with fixed CPT-specific templates**:

- 4 note types mapped from CPT codes: `97153_direct`, `97155_modification`, `97156_caregiver`, `97151_assessment`
- Universal fields: session narrative, plan for next session, subjective notes, client presentation, barriers, caregiver communication
- CPT-specific sections: modification rationale (97155), caregiver training fields (97156), assessment fields (97151)
- Dynamic goals with per-goal measurement data (12 measurement types)
- Dynamic behaviors with ABC tracking
- Sign-readiness validation: CPT-specific minimum required fields
- Dual signature workflow: author signs, BCBA cosigns

**This is a solid foundation.** It matches what Catalyst/Rethink does — structured data collection with CPT-aware templates. It handles 80% of practices out of the box.

### 5.2 What's Missing (The 20%)

Based on competitor analysis, the gaps are:

1. **No template customization** — practices can't add, remove, or reorder fields. A practice that uses SOAP format can't restructure our template to match their clinical style.

2. **No payer-specific variants** — a TRICARE client and a Medicaid client get the same template. The sign-readiness rules don't adapt per payer.

3. **No custom free-text sections** — a practice that wants to add "Environmental Setup", "Transition Notes", or "Reinforcement Schedule Summary" has no way to add these.

4. **No AI generation** — the narrative fields (session narrative, plan) are manual. This is the biggest time sink.

5. **No org-level field configuration** — an org that never does caregiver training (97156) still sees those fields if they happen to bill that code.

### 5.3 Strategic Position

Clinivise targets **small practices (1-50 staff)** that currently use AlohaABA + Motivity (or similar dual-tool setup). Our competitive advantage is **all-in-one**: PM + clinical in one product.

For session notes specifically:
- **CentralReach's template builder** is overkill for small practices — they don't want to spend hours designing templates
- **Motivity's approach** is closer to what small practices need — good defaults with some customization
- **Our opportunity**: Opinionated defaults that work out of the box + lightweight customization for practices that need it + AI generation (Phase 4)

---

## 6. Phased Implementation Plan

### Phase 2 — Current (Ship What We Have)

**Status: Built in CD-2.7**

- CPT-specific default templates with structured fields
- Dynamic goals and behaviors
- Sign/cosign workflow
- Sign-readiness validation

**This is sufficient for launch.** Most small practices will be happy with well-designed defaults.

### Phase 2.5 — Lightweight Customization (Next Iteration)

**Goal: Let orgs configure templates without a full template builder**

Data model addition:
```
note_template_configs table:
  id
  organization_id
  note_type: "97153_direct" | "97155_modification" | etc.
  payer_id: nullable (null = default for this note type)

  -- Field visibility & requirements
  field_overrides: jsonb
    -- e.g., { "barriersToPerformance": { "visible": true, "required": true },
    --         "caregiverCommunication": { "visible": false } }

  -- Custom sections (up to 5 per template)
  custom_sections: jsonb[]
    -- e.g., [{ "title": "Environmental Setup", "fieldType": "textarea", "required": false }]

  -- Sign-readiness overrides (stricter than defaults, never weaker)
  additional_required_fields: text[]

  created_at, updated_at
```

Features:
- **Settings page**: Org admins toggle field visibility and required status per note type
- **Custom sections**: Add up to 5 free-text sections per template (title + textarea)
- **Payer-specific variants**: Clone a template config and assign it to a payer — when creating a note, the system checks the client's primary payer and loads the matching template
- **Sign-readiness adapts**: Custom required fields are checked in addition to CPT-specific minimums

UI approach: **Settings > Note Templates** page with a card per note type, each expandable to show field toggles and custom section editor. NOT a drag-and-drop builder — just toggles and text inputs.

### Phase 3 — AI Note Generation

**Goal: Generate narrative from structured data**

- RBT enters goal data, behavior data, and a few key observations
- AI generates session narrative and plan for next session
- Provider reviews, edits, and signs
- Structured data is source of truth; narrative is the audit document

This is the biggest differentiator and the biggest time savings. It makes the template customization question less urgent — if the AI generates compliant notes, practices care less about template layout.

### Phase 4 — Full Template Builder (If Market Demands)

**Goal: CentralReach-level customization for enterprise practices**

Only build this if:
- Customer feedback explicitly requests it
- Clinivise moves upmarket (50+ staff practices)
- The lightweight customization from Phase 2.5 proves insufficient

Features would include:
- Drag-and-drop section/field editor
- Custom field types (text, textarea, select, multi-select, checkbox, number, date)
- Conditional sections (show section X only if field Y has value Z)
- Template versioning (track changes, rollback)
- Template sharing/marketplace

**Risk assessment**: Building this too early is a trap. CentralReach spent years on their template builder and it's still complex. Small practices don't want to design templates — they want good defaults. Build the builder only when the market demands it.

---

## Sources

### Competitor Platforms
- [CentralReach: Notes & Forms Templates](https://help.centralreach.com/notes-forms-templates/)
- [CentralReach: Session Note Templates](https://help.centralreach.com/session-note-templates/)
- [CentralReach: Create a Note & Form Template](https://help.centralreach.com/create-a-note-form-template/)
- [CentralReach Community: How To Create an ABA Session Note Template](https://community.centralreach.com/s/article/how-to-create-an-aba-session-note-template)
- [CentralReach: NoteGuardAI & ABA Session Note Template (24.8 Release)](https://community.centralreach.com/s/article/24-8-cr-noteguardai-aba-session-note-template-preferred-providers-in-scheduleai-and-new-abi-dashboards)
- [Motivity: Creating Note and Report Templates](https://help.motivity.net/create-session-note-templates)
- [Motivity: Session Note QA Process Features](https://www.motivity.net/feature/session-note-qa-process)
- [Motivity: Session Types](https://help.motivity.net/session-types)
- [Motivity: Adding Profile Information into Note Templates](https://help.motivity.net/adding-learner-member-and-organization-profile-information-into-a-note-template)

### Payer Documentation Requirements
- [TRICARE Autism Care Demonstration Documentation QRG](https://tricare.triwest.com/globalassets/tricare/provider/autism-care-demonstration-documentation-and-quality-monitoring-qrg.pdf)
- [Optum ABA Provider Clinical Audit Preparation](https://public.providerexpress.com/content/dam/ope-provexpr/us/pdfs/clinResourcesMain/autismABA/abaProvidClinAuditPrep.pdf)
- [ABA Billing Guidelines 2026 — MedCloudMD](https://www.medcloudmd.com/post/aba-billing-guideline-2026)

### Industry Analysis
- [Essential Tasks Your ABA Practice Management Software Should Cover — ABA Matrix](https://www.abamatrix.com/aba-practice-management-software-tasks/)
- [ABA Session Notes: Elements, Examples, Templates & Tips — Artemis ABA](https://www.artemisaba.com/blog/aba-session-notes)
