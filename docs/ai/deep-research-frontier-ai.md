# Frontier AI & Emerging Patterns Research

> Research conducted March 2026. Focus: AI-native patterns, healthcare AI startups, and production-ready architectures relevant to Clinivise (ABA therapy practice management).

---

## Table of Contents

1. [AI-Native Healthcare Startups (2024-2026)](#1-ai-native-healthcare-startups-2024-2026)
2. [AI-Native Revenue Cycle Management](#2-ai-native-revenue-cycle-management)
3. [AI That Replaces Entire Workflows](#3-ai-that-replaces-entire-workflows)
4. [AI-Native Product Design Lessons](#4-ai-native-product-design-lessons)
5. [AI Agent Architectures in Production](#5-ai-agent-architectures-in-production)
6. [Predictive AI in Healthcare Operations](#6-predictive-ai-in-healthcare-operations)
7. [AI for Compliance and Quality Assurance](#7-ai-for-compliance-and-quality-assurance)
8. [The "AI-Native" Design Philosophy](#8-the-ai-native-design-philosophy)
9. [ABA-Specific AI Landscape](#9-aba-specific-ai-landscape)
10. [Synthesis: What Clinivise Should Build](#10-synthesis-what-clinivise-should-build)

---

## 1. AI-Native Healthcare Startups (2024-2026)

### YC Batch Trends

By Spring 2025, over 50% of YC's 144-company batch was building agentic AI solutions, with 70+ AI companies spanning 18 categories. The Fall 2025 (F25) batch leaned heavily into healthcare AI, with 10+ healthcare startups.

#### Notable Companies

| Company               | YC Batch | What It Does                                                                          | Maturity                                       | Clinivise Relevance                                                                                                                              |
| --------------------- | -------- | ------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **LunaBill**          | F25      | AI voice agents for insurance claim follow-up calls                                   | Early-adopter, $764K ARR, 60K+ calls automated | **Direct competitor/partner for Phase 2.** Their 12x productivity improvement on claims follow-up is the benchmark to beat                       |
| **Saffron Health**    | S25      | AI agents automating specialist referrals for primary care                            | Early-stage                                    | Low direct relevance, but their workflow automation pattern (find provider, complete auth, book appointment) maps to ABA authorization workflows |
| **Beacon Health**     | W26      | AI agents for primary care, starting with value-based care                            | Pre-traction                                   | Watch — value-based care AI patterns may apply to ABA outcomes tracking                                                                          |
| **Scheduling Wizard** | Recent   | Logistics infrastructure for physician scheduling; 20 departments across 16 hospitals | Early-adopter                                  | **High relevance.** ABA scheduling is a top pain point; their multi-constraint optimization approach is directly applicable                      |
| **Mango Medical**     | Recent   | Agentic surgical planning AI                                                          | Early-adopter                                  | Low direct relevance, but demonstrates that AI can generate complex clinical plans in minutes vs. days                                           |

### Bessemer "State of Health AI 2026" Key Findings

- New health tech stocks rose 18% in 2025, matching NASDAQ/S&P 500
- Six health tech IPOs in 2024-2025: Waystar, Tempus, Hinge Health, Omada, Caris Life Sciences, HeartFlow
- Global health tech M&A reached 400 deals in 2025 (up from 350 in 2024)
- **Provider-side AI in RCM is the hottest category:** Providers have aggressively adopted AI for administrative workflows, using it to capture more revenue through better coding, cleaner claims, and faster appeals
- Clinical AI is shifting from concept to scale in triage and risk assessment use cases that keep clinicians in the loop
- Healthcare AI funding in 2025: $10.7B (24.4% higher than $8.6B in all of 2024)

### Takeaway for Clinivise

The market is moving fast. Healthcare AI is no longer speculative — it's the dominant investment thesis. The winning companies are those automating specific, painful workflows end-to-end (not building general-purpose chatbots). LunaBill's traction ($764K ARR, 100% pilot conversion) proves that even small, focused AI tools in billing can find immediate product-market fit.

**Decision:** Design every feature with an "AI automation layer" from day one. Don't build CRUD first and add AI later.

---

## 2. AI-Native Revenue Cycle Management

### Major Players and What They Actually Do

#### Infinitus Health — AI Phone Agents for Insurance Calls

- **What:** Voice AI that makes phone calls to insurance companies (benefit verification, prior auth status, claims follow-up)
- **Scale:** Saves hundreds of thousands of hours annually across the US healthcare system. Named to Fast Company's Most Innovative Companies 2025
- **Recent:** Launched Agentic AI Member Services Suite (Feb 2026) for health plan member inbound/outbound calls. Over 90% of members rate the AI call positively
- **Capabilities:** Navigates IVR menus, verifies eligibility, checks prior auth status, follows up on claims, handles formulary exceptions
- **Maturity:** Production-proven at scale
- **Clinivise relevance:** **Critical for Phase 2.** ABA billing teams spend enormous time calling insurance companies. Infinitus (or building on Retell/Vapi) could automate this entirely
- **Decision:** Design for integration in Phase 2. Consider building our own voice agent on Retell/Vapi for ABA-specific insurance calls (more control, lower cost for small practices)

#### LunaBill (YC F25) — AI Voice Agents for Claims Follow-Up

- **What:** AI voice callers fine-tuned on 1.2M+ call transcripts that handle claim-status inquiries, A/R recovery, and appeals follow-up
- **Results:** 60,000+ calls automated, 20,000+ hours saved, $30M+ recovered. Billers complete 300+ claim follow-ups/day (up from ~25/day) — a 12x improvement. 100% pilot-to-paid conversion
- **Technical:** Agents navigate IVR menus, ask follow-up questions, capture claim status and denial reasons, trigger reprocessing or escalate appeals during the same call. HIPAA-certified
- **Maturity:** Early-adopter with strong traction ($764K contracted ARR)
- **Clinivise relevance:** **Direct integration candidate for Phase 2.** Could partner or compete. Their economics prove the model works for healthcare billing
- **Decision:** Watch closely. If we build billing in Phase 2, either integrate LunaBill or build a competing voice agent using Vapi/Retell for ABA-specific needs

#### Candid Health — Autonomous Revenue Cycle Automation

- **What:** Rules engine that automates end-to-end claims processing. Revenue grew ~250% in 2024
- **Scale:** 200+ healthcare organizations, $99.5M total funding (Series C Feb 2025)
- **Technical:** Sophisticated rules engine for submitting accurate claims on first try. Has not yet leaned heavily into generative AI — focused on deterministic automation with ML for denial prediction
- **Maturity:** Production-proven, scaling rapidly
- **Clinivise relevance:** Their approach (deterministic rules + ML, not pure GenAI) is instructive. For billing, deterministic correctness matters more than generative creativity
- **Decision:** Study their rules-engine architecture. For Phase 2 billing, combine deterministic claim validation with AI for edge cases

#### Cohere Health — AI Prior Authorization

- **What:** AI-powered prior authorization platform processing 12M+ auth requests/year, auto-approving up to 90%
- **Scale:** Works with 660,000+ providers. Acquired ZignaAI (payment integrity) in Sept 2025
- **Technical:** Analyzes unstructured clinical attachments to find criteria satisfying payer policy. Achieves 80%+ real-time approvals. 50% faster auth completion with Review Assist
- **Partnership:** Microsoft Dragon Copilot integration for ambient listening + PA
- **Maturity:** Production-proven at massive scale
- **Clinivise relevance:** **High for Phase 2 auth tracking.** Their pattern of analyzing clinical documentation against payer policies is exactly what ABA practices need for authorization requests
- **Decision:** Design our auth tracking to eventually support AI-assisted auth submission. Store clinical data structured enough for future AI policy-matching

#### AKASA — AI Revenue Cycle for Health Systems

- **What:** GenAI and ML for revenue cycle automation
- **Results:** 13% decrease in A/R days, 86% efficiency increase, 300+ hours/month saved, $30M gross yield increase. Methodist Health System: 71% of accounts removed from staff queues
- **Scale:** Ranked #1 Most Promising Healthcare RCM Startup 2025 by Black Book. $200M+ in funding (a16z, BOND)
- **Maturity:** Production-proven at hospital scale
- **Clinivise relevance:** Their scale is for large health systems, not small ABA practices. But their automation metrics (71% of accounts handled without humans) set the benchmark
- **Decision:** Watch for patterns. Their "autonomous rules engine" approach validates building deterministic automation first

#### Waystar — Post-Olive AI Claims & Authorization

- **What:** Acquired Olive AI's clearinghouse and patient access assets. Built Auth Accelerate for end-to-end prior auth automation, AltitudeAI for denial prevention/recovery
- **Scale:** Public company, enterprise-grade
- **Maturity:** Production-proven
- **Clinivise relevance:** Too large/expensive for small ABA practices, but their product categories (auth automation, denial prevention, eligibility verification) define what we should eventually build

#### AI Voice Agent Platforms (for building your own)

| Platform      | Best For                                           | Scale                      | Pricing Model |
| ------------- | -------------------------------------------------- | -------------------------- | ------------- |
| **Retell AI** | Production-ready voice agents with LLM flexibility | Enterprise-grade           | Per-minute    |
| **Vapi**      | Developer-first, open-source SDK, custom logic     | Dev teams wanting control  | Per-minute    |
| **Bland AI**  | Massive concurrent calls (up to 1M)                | High-throughput enterprise | Per-minute    |

The voice AI market is projected to grow from $2.4B (2024) to $47.5B by 2034 (34.8% CAGR).

**Decision:** For Phase 2, build ABA-specific voice agents on Vapi or Retell rather than using Infinitus/LunaBill (more control over ABA-specific flows, lower cost for small practices, differentiated product).

---

## 3. AI That Replaces Entire Workflows

### Document Processing: From Manual to Autonomous

The intelligent document processing market reached $2.8B in 2025 (35% CAGR). Key shifts:

- **67% of enterprise document processing initiatives** are now evaluating agentic AI over traditional OCR-plus-rules
- Modern AI achieves **95-99% accuracy** on well-defined fields (vs. 90-95% human accuracy)
- Accounts payable teams previously reviewing 40% of invoices manually are now reviewing **4%**
- ROI within 6-12 months is standard

#### Direct Application to Clinivise

Authorization letters are semi-structured documents with predictable fields (approved units, CPT codes, date ranges, provider info). This is exactly the kind of document AI excels at processing.

**Current plan (Phase 1):** AI auth letter parsing — upload PDF, extract fields, populate authorization record.

**Enhanced approach:** Build a confidence-based pipeline:

1. AI extracts all fields with confidence scores
2. High-confidence fields (>95%) auto-populate
3. Low-confidence fields highlight for human review
4. User confirms/corrects, system learns from corrections

### Workflow Replacement Patterns

The most successful AI workflow replacements share these characteristics:

1. **Well-defined inputs and outputs** (document in, structured data out)
2. **Repetitive but currently requiring human judgment** (reading auth letters, coding sessions)
3. **Clear correctness criteria** (the extracted CPT code is either right or wrong)
4. **High volume** (dozens per day per practice)
5. **Cost of errors is manageable** (can be caught in review before submission)

### The Multi-Step Autonomous Agent Pattern

In healthcare specifically, the emerging pattern is: "After a patient visit, the agent won't just write the note; it will autonomously create the referral orders, draft the insurance prior-authorization letter, and, pending physician approval, submit it to the payer portal."

For ABA, the equivalent is: "After a session, the AI won't just log the time; it will calculate units per CMS/AMA rules, check authorization utilization, flag if approaching limits, draft the session note, validate against payer requirements, and queue the claim for submission."

**Decision:** Design the session-to-claim pipeline as a multi-step agent workflow from day one, even if Phase 1 only implements the first few steps manually.

---

## 4. AI-Native Product Design Lessons

### What Makes Cursor Different from VS Code + Copilot

This is the single most instructive analogy for Clinivise.

| Aspect        | VS Code + Copilot (AI bolted on)                      | Cursor (AI native)                                          |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| Architecture  | Plugin added to existing IDE                          | Fork rebuilt around AI from the ground up                   |
| Context       | Limited file context, gets sluggish on large projects | Semantic understanding of entire project                    |
| Interaction   | Inline autocomplete (reactive)                        | Multi-file Composer, persistent chat, proactive suggestions |
| Model support | Primarily OpenAI                                      | OpenAI, Claude, Gemini, Grok, DeepSeek                      |
| Philosophy    | "IDE with AI features"                                | "AI-powered development environment"                        |

**The key insight:** Cursor didn't add AI to an editor. It rebuilt the editor around AI. The AI understands your entire codebase, not just the current file. It can make changes across multiple files. It proactively suggests improvements.

### Application to Clinivise

**Bolted-on approach (what competitors do):**

- Build a CRUD practice management tool
- Add an "AI Assistant" chatbot in the corner
- Let users ask it questions about their data

**AI-native approach (what we should do):**

- Every screen surfaces AI insights proactively (not on request)
- Authorization tracking doesn't just show numbers — it predicts when you'll run out and suggests actions
- Session logging doesn't just record — it validates documentation completeness in real-time
- The dashboard doesn't just display metrics — it highlights anomalies and recommends next actions
- Data entry is minimized because AI pre-fills from context (last session, provider defaults, payer requirements)

---

## 5. AI Agent Architectures in Production

### What Actually Works in 2026

The leading production frameworks are **LangGraph** (graph-based workflows with maximum control) and **CrewAI** (multi-agent coordination). But the key lesson isn't about frameworks — it's about patterns.

### Critical Production Patterns

#### 1. Confidence-Based Routing (Most Important for Clinivise)

```
IF confidence >= 95% → auto-process (no human review)
IF confidence 60-95% → process with flagged review
IF confidence < 60%  → route to human with full context
```

This is the foundational pattern for every AI feature in Clinivise. Examples:

- **Auth letter parsing:** High-confidence field extraction auto-populates; low-confidence fields get highlighted
- **Session unit calculation:** Deterministic (no AI needed), but AI validates the documentation supports the billed units
- **Claim validation:** High-confidence clean claims auto-queue; flagged claims route to billing staff

#### 2. Progressive Autonomy

Start with more human involvement, then gradually reduce as the system proves itself. In practice:

- **Month 1:** AI suggests, human approves everything
- **Month 3:** AI auto-processes high-confidence items, human reviews the rest
- **Month 6:** AI handles 80%+ autonomously, human handles exceptions
- **Month 12:** AI handles 95%+, human reviews anomalies and edge cases

This maps directly to how Clinivise should roll out AI features. Start conservative, build trust, expand autonomy.

#### 3. Three Production Reliability Challenges

1. **Integration Resilience:** Moving beyond "read-only" to executing actions in legacy systems (payer portals, clearinghouses)
2. **Context Continuity:** Maintaining business logic over long-running, multi-day processes (auth approvals can take days)
3. **Autonomous Recovery:** Identifying and fixing errors without triggering system-wide failures

#### 4. Observability from Day One

Production agents need logging, audit trails, and human override mechanisms from day one. This aligns perfectly with Clinivise's audit logging requirement (Phase 1).

Every AI action should be logged:

- What the AI decided
- What confidence level it had
- Whether a human reviewed it
- Whether the human agreed or corrected it
- The outcome (was the claim accepted? was the auth approved?)

This data becomes the training signal for improving the AI over time.

#### 5. LLM Calls with Fallbacks

Ensure reliability by providing backup options when models fail. For Clinivise:

- Primary: Claude via AWS Bedrock (HIPAA-eligible)
- Fallback: OpenAI via Azure (HIPAA-eligible)
- Ultimate fallback: Deterministic rules (no AI)

### Why Most AI Pilots Fail

The 2025 AI Agent Report found that AI pilots fail in production due to:

1. **Brittle integrations** with real-world systems
2. **Lack of observability** into agent decisions
3. **No graceful degradation** when AI fails
4. **No human override** for edge cases

**Decision:** Build every AI feature with: (a) confidence scoring, (b) human-in-the-loop fallback, (c) audit logging, (d) graceful degradation to manual workflow. Never let an AI failure block the user from completing their work.

---

## 6. Predictive AI in Healthcare Operations

### Claim Denial Prediction

**The opportunity is massive:** 69% of providers using AI report reduced denials, but only 14% have implemented AI tools. Denied claims are growing (12% increase in denied inpatient, 14% in denied outpatient claims in 2025).

**How it works:**

- Train ML models on historical claims data
- Identify patterns that lead to denials (missing documentation, coding errors, payer-specific rules)
- Flag high-risk claims before submission
- AI models trained on practice-specific data can identify >90% of common coding errors pre-submission

**Clinivise application (Phase 2):**

- Before claim submission, run AI validation
- Check: Is the documentation complete? Do the units match the session time? Is the CPT code supported by the auth? Does this payer typically deny this code pattern?
- Route flagged claims for human review before submission
- Track denial patterns per payer to continuously improve predictions

**Maturity:** Production-proven across multiple vendors. Adoption is still low (14%), creating a greenfield opportunity.

### No-Show Prediction

**The problem:** Outpatient no-show rates average 28%. For a 40-appointment ABA clinic at $180/visit, that's $2,016/day in missed revenue.

**What works:**

- Best ML models achieve AUC 0.75-0.95 for no-show prediction
- Key features: patient history, appointment type, time of day, travel distance, weather, days since booking
- One implementation achieved 70% reduction in predicted appointment cancellations
- AI can predict no-shows with sufficient accuracy to plan staffing 3 days to 1 week in advance

**Clinivise application (Phase 1/2):**

- Track no-show patterns per client
- Predict high-risk sessions and send targeted reminders
- Suggest overbooking for high-no-show slots
- Flag chronic no-shows for provider/parent discussion

**Maturity:** Well-validated in research, early production deployments. Relatively straightforward to implement with historical scheduling data.

**Decision:** Collect the data now (session attendance, cancellations, timing) even if we don't build prediction until Phase 2. The model needs historical data to be useful.

### Scheduling Optimization

**Results from production deployments:**

- 37.5% reduction in patient waiting times
- 29% improvement in bed occupancy efficiency
- CentralReach's ScheduleAI already does this for ABA (matching provider credentials, client needs, authorization hours)

**Clinivise application:**

- Multi-constraint scheduling: provider credentials, client availability, authorization hours remaining, travel time, session frequency requirements
- AI suggests optimal schedules that maximize authorization utilization
- Predict scheduling conflicts before they happen

**Decision:** Design the scheduling data model to support AI optimization later. Store enough context (constraints, preferences, outcomes) for future ML.

### Revenue Forecasting

**What's emerging:**

- AI analyzing historical claims, payer behavior, and patient profiles to forecast cash flow
- Predicting which claims are at risk of delay
- Organizations report 20-30% efficiency gains
- McKinsey estimates AI could generate $200-360B in annual net savings (5-10% of US healthcare spending)

**Clinivise application:**

- Predict monthly revenue based on scheduled sessions, auth utilization, and historical payer payment patterns
- Flag revenue risks (expiring auths, under-utilized auths, high-denial payers)
- Show practices their financial trajectory, not just their current balance

**Decision:** Design for later. Revenue forecasting needs sufficient historical data. Focus Phase 1 on collecting clean data that enables this.

---

## 7. AI for Compliance and Quality Assurance

### Documentation Audit

**The landscape:**

- 46% of US healthcare organizations are implementing generative AI
- A major hospital network saw 60% fewer documentation errors and 40% fewer compliance incidents after implementing AI-assisted compliance monitoring
- AI-driven systems cross-check records against standards, flagging inconsistencies and streamlining audits

**Clinivise application:**

- **Real-time session note validation:** As providers write notes, AI checks for completeness against payer requirements (specific to each insurance company)
- **Pre-submission compliance check:** Before claims go out, AI validates that documentation supports the billed codes
- **Authorization utilization monitoring:** AI alerts when approaching 80%, 95%, 100% thresholds (already in Phase 1 spec)

### Billing Anomaly Detection

**Production results:**

- 52% increase in fraud detection accuracy
- 40% reduction in manual audits needed
- Detection of: upcoding, unbundling, phantom billing, repeated charges
- 3x increase in fraud detection rates for health payers

**Clinivise application:**

- Monitor billing patterns across the practice for anomalies
- Flag unusual session durations, code usage patterns, or authorization utilization rates
- Not just fraud prevention — also quality assurance (catching honest mistakes before they become audit risks)

### Regulatory Context

**Important:** The Colorado AI Act takes effect June 30, 2026 — the first comprehensive AI law in the US. Healthcare organizations deploying clinical AI face hard legal obligations: impact assessments, consumer disclosures, and ongoing monitoring.

**Decision:** Build AI features with transparency and auditability from day one. Every AI decision should be explainable and logged. This isn't just good practice — it's becoming law.

---

## 8. The "AI-Native" Design Philosophy

### What Distinguishes AI-Native from AI-Bolted-On

Based on extensive research, here's the definitive framework:

#### Architecture Level

| Dimension     | AI Bolted On                                                              | AI Native                                                              |
| ------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Data**      | Bridge existing sources to AI; manual data engineering                    | Unified, real-time data ingestion built into core; continuous learning |
| **Decisions** | Isolated AI calls for specific features                                   | Intelligence embedded in every operation; persistent context           |
| **Learning**  | Manual model updates, periodic vendor updates                             | Continuous feedback loops; system improves from every interaction      |
| **Compute**   | Traditional CPU-first, AI as an API call                                  | GPU-aware infrastructure, AI as core compute pattern                   |
| **Cost**      | Lower initial investment, but 70% require complete rebuild within 3 years | Higher initial investment, but 5-20x performance improvement at scale  |

#### Product Level

| Dimension         | AI Bolted On                                | AI Native                                                      |
| ----------------- | ------------------------------------------- | -------------------------------------------------------------- |
| **UX**            | AI features in a separate tab/panel/chatbot | AI woven into every interaction seamlessly                     |
| **User role**     | User drives, AI assists on request          | AI drives routine work, user supervises and handles exceptions |
| **Default state** | Manual until user invokes AI                | Automated until user overrides                                 |
| **Data entry**    | User fills forms                            | AI pre-fills, user confirms                                    |
| **Errors**        | User catches errors manually                | AI catches errors proactively, alerts user                     |
| **Insights**      | User queries for reports                    | AI surfaces insights proactively                               |

#### The Three-Stage Evolution

1. **AI-Assisted (2024):** AI improves individual productivity, but delivery systems remain unchanged
2. **AI-Augmented (2025):** Teams embed AI into workflows
3. **AI-Native (2026):** Human-AI collaboration is an intentional part of how teams work

### Lessons from Notion, Linear, and Figma

**Notion 3.0 (Sept 2025):**

- Launched autonomous AI Agents that execute multi-step workflows for up to 20 minutes
- Agents build project plans, compile feedback, draft reports, update database entries at scale
- Native integrations with 70+ tools (Figma, Linear, GitHub, etc.)
- Key lesson: AI agents don't just answer questions — they do work

**Figma Make (late 2025/early 2026):**

- Turns prompts or designs into interactive prototypes or functional web apps
- 60% of Figma files created by non-designers in the last year
- Key lesson: AI democratizes complex tasks; non-experts can produce expert-level output

**Linear:**

- AI triage automatically categorizes and routes issues
- AI-generated project updates from activity data
- Key lesson: AI works best when it's invisible — automating the tedious parts users don't even think about

### Design Systems Built for AI

A critical 2026 insight: **design systems are no longer built for designers — they're built for AI.** If tokens aren't machine-readable and component logic isn't documented for LLM parsing, the system underperforms.

**Clinivise application:** Our design system (Mira tokens, shadcn/ui components) should be documented in a way that AI can generate consistent UI. This enables:

- AI-generated form layouts based on data requirements
- AI-suggested dashboard configurations based on user role
- Consistent UI generation as features expand

### The Core AI-Native UX Principles

1. **Adjustable autonomy:** Start with full automation, offer manual refinement
2. **Transparency:** Show what AI did and why (confidence scores, reasoning)
3. **Progressive disclosure:** Simple by default, detailed on demand
4. **Graceful degradation:** If AI fails, the manual workflow is always available
5. **Ambient intelligence:** AI surfaces insights proactively, not just when asked

---

## 9. ABA-Specific AI Landscape

### Current ABA Practice Management Competitors

| Platform         | AI Features                                                                                                                        | Maturity                  | Weakness                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| **CentralReach** | cari AI (trained on 1B+ data points): ScheduleAI, NoteDraftAI, ClaimAcceleratorAI. Acquired SpectrumAI and AI Measures in Aug 2025 | Production, market leader | Enterprise-priced, clunky UX, slow to innovate on frontend. Bolt-on AI to legacy platform |
| **Theralytics**  | GenAI narrative summaries for session notes                                                                                        | Early AI adoption         | Limited AI scope — notes only                                                             |
| **Raven Health** | AI across documentation, RCM, and analytics                                                                                        | Growing                   | Newer, less established                                                                   |
| **Artemis ABA**  | AI-driven scheduling, real-time eligibility/auth checks                                                                            | Production                | Built on Salesforce (heavyweight, expensive)                                              |
| **Aloha ABA**    | Basic automation                                                                                                                   | Minimal AI                | No meaningful AI capabilities                                                             |

### What CentralReach's "cari" Does (Competitive Benchmark)

CentralReach is the most AI-advanced ABA platform. Their cari system:

- **ScheduleAI:** Analyzes hundreds of data points to match providers with clients, maximize auth hours, reduce scheduling staff burden
- **NoteDraftAI:** Generates real-time first drafts of session notes from session details
- **ClaimAcceleratorAI:** Automates checks and routes clean claims for faster payment
- Trained on 1B+ data points in partnership with 40+ BCBAs

**Critical weakness:** CentralReach bolted AI onto a legacy platform. Their UX is widely hated by practitioners. The AI features are powerful but poorly integrated.

### Clinivise's AI Differentiation Opportunity

CentralReach proves the feature set works. But their execution is "AI bolted on" to a legacy tool. Clinivise can be the "Cursor vs. VS Code" of ABA practice management:

1. **AI-native from birth:** Every feature designed with AI at the core, not added later
2. **Modern UX:** Fast, clean, intuitive (the Cursor advantage)
3. **Small practice focus:** CentralReach targets enterprise ($$$). Clinivise targets 1-50 staff practices with a free PM tier
4. **Open model architecture:** Not locked to one AI provider. Start with any LLM, migrate to Bedrock for PHI compliance

---

## 10. Synthesis: What Clinivise Should Build

### Phase 1 AI Features (Build Now)

These features should be AI-native from the start, not added later:

#### 1. Authorization Letter Parsing (Already Planned)

- Upload PDF → AI extracts all fields with confidence scores
- High-confidence fields auto-populate, low-confidence fields highlighted for review
- System learns from corrections over time
- **Benchmark:** Reduce auth entry from 20-30 minutes to 2-3 minutes

#### 2. Proactive Authorization Alerts (Enhanced Beyond Spec)

- Beyond 80%/95%/100% thresholds: predict when utilization will hit limits based on session frequency
- "At current pace, Client X's authorization runs out March 15 — 2 weeks before expiration. Recommended action: request reauthorization now"
- Flag under-utilized authorizations before it's too late

#### 3. Session Note Validation (New — AI-Native Feature)

- As providers log sessions, AI validates:
  - Duration supports billed units (CMS 8-minute rule)
  - Documentation completeness for payer requirements
  - CPT code matches the service described
- Real-time, inline — not a separate validation step

#### 4. Smart Defaults and Pre-Fill (New — UX Pattern)

- Pre-fill session forms: today's date, current provider, client's most common CPT code, last session's format
- Pre-fill authorization fields from payer history
- Reduce keystrokes to the minimum possible

#### 5. Dashboard Intelligence (New — Ambient AI)

- Don't just show metrics — surface actionable insights:
  - "3 authorizations expiring in the next 14 days — 2 are under-utilized"
  - "Provider X has 4 sessions this week without notes"
  - "Client Y's attendance dropped 40% this month"
- Prioritized by urgency, not just recency

### Phase 2 AI Features (Design For Now, Build Later)

#### 6. AI Claim Validation Before Submission

- Pre-submission check: documentation complete, codes match auth, payer-specific rules satisfied
- Confidence-based routing: clean claims auto-submit, flagged claims route to billing
- Train on practice-specific denial patterns

#### 7. AI Voice Agents for Insurance Calls

- Build on Vapi or Retell for ABA-specific insurance calls
- Auth status checks, claim follow-up, eligibility verification
- Start with outbound calls (practice → payer), expand to inbound (parent inquiries)
- **Benchmark:** LunaBill's 12x productivity improvement

#### 8. Denial Prediction and Prevention

- ML model trained on historical claims data
- Flag high-risk claims before submission
- Suggest corrections based on denial patterns
- Track denial rates per payer, per code, per provider

#### 9. AI Scheduling Optimization

- Multi-constraint optimization: provider credentials, client availability, auth hours, travel time
- Predict no-shows and suggest overbooking
- Maximize auth utilization through schedule optimization

#### 10. Revenue Forecasting

- Predict monthly revenue from scheduled sessions + auth utilization + payer payment patterns
- Flag revenue risks (expiring auths, high-denial payers, under-utilized auths)
- Cash flow projection based on historical payment timing per payer

### Architecture Decisions (Implement Now)

Based on this research, these architectural patterns should be built into the foundation:

1. **AI Wrapper Pattern (Already Planned):** `lib/ai.ts` for easy provider swap. Start with any LLM, migrate to Bedrock for PHI compliance
2. **Confidence Scoring on All AI Outputs:** Every AI result includes a confidence score. This enables progressive autonomy and human-in-the-loop routing
3. **AI Audit Trail:** Log every AI decision: what it decided, confidence level, whether human reviewed, whether human agreed/corrected, outcome. This is training data for the future
4. **Graceful Degradation:** Every AI feature has a manual fallback. If AI fails or is slow, the user can always complete the workflow manually. AI enhances but never blocks
5. **Event-Driven Architecture for AI:** User actions trigger AI workflows asynchronously. Don't block the UI waiting for AI processing. Show results when ready, with skeleton states during processing
6. **Data Collection for Future ML:** Even before building prediction features, collect the data they'll need: session attendance patterns, denial reasons, payer payment timings, auth utilization curves. The model needs history to be useful

### What NOT to Build

Based on this research, these are traps to avoid:

1. **A chatbot.** Users don't want to chat with AI. They want AI to do their work invisibly
2. **AI that requires a separate workflow.** If users have to go to a special "AI page," adoption will be low. AI should be embedded in every existing workflow
3. **AI without confidence scores.** Unscored AI output forces users to verify everything, defeating the purpose. Scored output lets them focus verification on low-confidence items
4. **AI without fallback.** In healthcare, blocking users because AI is down or wrong is unacceptable
5. **Premature AI autonomy.** Start with AI-suggests-human-approves. Build trust. Then expand autonomy based on accuracy data
6. **Over-investing in AI before product-market fit.** Phase 1 is about proving the PM tool is useful. AI enhances it but shouldn't delay core features

---

## Key Metrics to Track

| Metric                                    | Why                         | Target                                                         |
| ----------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| Auth letter parsing accuracy              | Core AI feature quality     | >95% field extraction accuracy                                 |
| Time saved per auth entry                 | User value proposition      | 80% reduction (20min → 4min)                                   |
| AI suggestion acceptance rate             | Trust calibration           | >85% (if lower, AI isn't good enough)                          |
| AI confidence calibration                 | Reliability                 | When AI says 95% confident, it should be right 95% of the time |
| Manual override rate                      | Progressive autonomy signal | Should decrease over time                                      |
| Claims denial rate (Phase 2)              | AI validation effectiveness | 50% reduction from baseline                                    |
| Hours saved per biller per week (Phase 2) | Core value proposition      | 20+ hours                                                      |

---

## Sources

### YC Healthcare AI Startups

- [YC Healthcare Companies Directory](https://www.ycombinator.com/companies/industry/healthcare)
- [10 Healthtech Startups in YC F25 Batch](https://allhealthtech.com/y-combinators-fall-2025-yc-f25/)
- [Navigating Healthcare Contenders of YC's Latest Batch](https://www.onhealthcare.tech/p/navigating-the-healthcare-contenders)
- [Beacon Health (YC W26)](https://www.ycombinator.com/companies/beacon-health)

### AI Revenue Cycle Management

- [AI and Automation in RCM: Trends for 2025 (Notable Health)](https://www.notablehealth.com/blog/ai-and-automation-in-revenue-cycle-management-must-know-trends-for-2025)
- [FinThrive Agentic AI at HFMA 2025](https://finthrive.com/news/finthrive-introduces-agentic-ai-at-hfma-2025-to-help-customers-transform-healthcare-revenue-cycle-management-performance)
- [Agentic AI Paving Way for Autonomous Revenue Cycle (TechTarget)](https://www.techtarget.com/revcyclemanagement/feature/Agentic-AI-evolution-begins-to-pave-way-for-autonomous-revenue-cycle)
- [AI in Healthcare RCM: 2026 Opportunities (Experian)](https://www.experian.com/blogs/healthcare/revenue-cycle-management-and-ai/)

### Infinitus Health

- [Infinitus AI — Product](https://www.infinitus.ai/product/ai-agents/)
- [Infinitus Agentic AI Suite Launch (Feb 2026)](https://www.prnewswire.com/news-releases/infinitus-launches-agentic-ai-suite-for-health-plan-member-services-302675410.html)
- [Infinitus Hallucination-Free AI Voice Agent (Fierce Healthcare)](https://www.fiercehealthcare.com/ai-and-machine-learning/infinitus-adds-ai-voice-agent-patients)

### LunaBill

- [LunaBill on YC](https://www.ycombinator.com/companies/lunabill)
- [LunaBill Launch YC](https://www.ycombinator.com/launches/Ooq-lunabill-ai-voice-callers-for-healthcare-billing-teams)
- [How LunaBill is Transforming Healthcare Billing (Reforgers)](https://reforgers.com/startups/lunabill)

### Candid Health

- [Candid Health — Revenue Cycle Automation](https://candidhealth.com/)
- [Candid Health $52.5M Series C (TechCrunch)](https://techcrunch.com/2025/02/12/six-months-after-raising-29m-candid-health-nabs-another-52-5m-to-ease-medical-billing/)
- [Oak HC/FT on Candid Health](https://www.oakhcft.com/blog-post/the-next-wave-of-rcm-innovation-candid-health)

### Cohere Health

- [Cohere Health — AI Prior Authorization](https://www.coherehealth.com/)
- [Cohere Health + Microsoft Dragon Copilot (MedCity News)](https://medcitynews.com/2025/10/cohere-microsoft-prior-authorization-ambient/)
- [National Survey: Providers Trust AI for PA](https://www.coherehealth.com/news/national-survey-ai-prior-authorization)

### AKASA

- [AKASA — Generative AI for Healthcare RCM](https://akasa.com/)
- [80% of Health Systems Moving on AI for Rev Cycle (Fierce Healthcare)](https://www.fiercehealthcare.com/ai-and-machine-learning/adoption-ai-hospital-rcm-surges-even-health-systems-navigate-cost)

### Waystar

- [Waystar Auth Accelerate Launch](https://www.waystar.com/news/waystar-expands-authorization-automation-to-address-healthcare-providers-top-2025-investment-priority/)
- [Olive AI Sale to Waystar (Lincoln International)](https://www.lincolninternational.com/transactions/olive-ai-has-sold-substantially-all-of-its-assets-to-waystar-and-humata-health/)

### AI Voice Agent Platforms

- [Retell AI — Agent Platforms for Business](https://www.retellai.com/blog/ai-agent-platforms-every-business-should-know-in-2025)
- [AI Voice Market: $45B Shift (AgentVoice)](https://www.agentvoice.com/ai-voice-in-2025-mapping-a-45-billion-market-shift/)

### AI Agent Production Architecture

- [2026 Guide to Agentic Workflow Architectures (Stack AI)](https://www.stackai.com/blog/the-2026-guide-to-agentic-workflow-architectures)
- [AI Agents in Production: What Works in 2026 (47Billion)](https://47billion.com/blog/ai-agents-in-production-frameworks-protocols-and-what-actually-works-in-2026/)
- [Practical Guide for Production-Grade Agentic AI Workflows (arXiv)](https://arxiv.org/html/2512.08769v1)
- [Agentic Workflows: Emerging Architectures (Vellum AI)](https://vellum.ai/blog/agentic-workflows-emerging-architectures-and-design-patterns)
- [Measuring AI Agent Autonomy (Anthropic)](https://www.anthropic.com/research/measuring-agent-autonomy)

### Predictive AI in Healthcare

- [State of Claims 2025: The Denial Problem (Experian)](https://www.experian.com/blogs/healthcare/state-of-claims-2025/)
- [AI Predicting & Preventing Claim Denials (Enter Health)](https://www.enter.health/post/how-ai-can-predict-prevent-insurance-claim-denials)
- [Denial AI: Predicting & Preventing Claim Rejections 2026 (RapidClaims)](https://www.rapidclaims.ai/blogs/denial-ai-claim-management-prevention)
- [AI Patient Flow Prediction: What Clinics Can Do in 2026 (ClinIQ)](https://www.cliniqhealthcare.com/post/ai-driven-patient-flow-prediction-what-clinics-can-actually-do-in-2026)
- [Can AI Predict No-Shows? (Medical Economics)](https://www.medicaleconomics.com/view/can-ai-predict-no-shows-before-they-happen-this-new-model-says-yes)
- [AI Scheduling in Healthcare 2025 (Sprypt)](https://www.sprypt.com/blog/ai-at-the-front-desk)

### AI Compliance & Documentation

- [AI in Medical Auditing: Managing Compliance Risk 2026 (NAMAS)](https://namas.co/ai-compliance-risk-medical-auditing-2026/)
- [AI Healthcare Compliance (Intellias)](https://intellias.com/ai-in-healthcare-compliance/)
- [AI Billing Fraud Detection (Oracle)](https://blogs.oracle.com/cloud-infrastructure/leveraging-ai-help-detect-fraud-in-medical-claims)

### AI-Native Design Philosophy

- [AI-Native vs AI-Bolted On Architectures (Dr. Jeff Nagy)](https://medium.com/@the_AI_doctor/ai-native-vs-ai-bolted-on-architectures-a-technical-white-paper-for-enterprise-decision-makers-bf081efdc648)
- [AI-Native Architectures: Building Smarter Systems (Sidetool)](https://www.sidetool.co/post/ai-native-architectures-building-smarter-systems/)
- [AI-Native UX: Why Next Great Products Won't Look Like Apps (Synergy Labs)](https://www.synergylabs.co/blog/ai-native-ux-why-the-next-great-products-wont-look-like-apps)
- [7 SaaS Predictions for 2026: AI-Native Platforms Go Mainstream (Cyclr)](https://cyclr.com/resources/ai/7-saas-predictions-for-2026-the-year-ai-native-platforms-go-mainstream)
- [How to Architect an AI-Native Business (HBS Online)](https://online.hbs.edu/blog/post/ai-native)
- [What UX for AI Products Must Solve in 2025 (Think Design)](https://think.design/blog/what-ux-for-ai-products-must-solve-in-2025/)

### Human-in-the-Loop

- [Human-in-the-Loop Agentic AI for High-Stakes Oversight 2026 (OneReach)](https://onereach.ai/blog/human-in-the-loop-agentic-ai-systems/)
- [HITL in AI Data Management (TDWI)](https://tdwi.org/articles/2025/09/03/adv-all-role-of-human-in-the-loop-in-ai-data-management.aspx)
- [Human-in-the-Loop AI in Healthcare (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S1386505626001024)

### Bessemer State of Health AI

- [State of Health AI 2026 (Bessemer Venture Partners)](https://www.bvp.com/atlas/state-of-health-ai-2026)
- [10 Key Takeaways from Bessemer Report](https://www.healthcare.digital/single-post/10-key-takeaways-from-bessemer-venture-partners-state-of-health-ai-2026-report)

### ABA-Specific AI

- [CentralReach ScheduleAI + Behavioral Innovations Case Study](https://www.globenewswire.com/news-release/2025/01/28/3016591/0/en/Behavioral-Innovations-Transforms-Applied-Behavior-Analysis-Scheduling-Operations-with-CentralReach-s-AI-Powered-Scheduling-Solution-CR-ScheduleAI.html)
- [CentralReach Acquires SpectrumAI, AI Measures](https://bhbusiness.com/2025/08/19/aba-software-company-centralreach-buys-spectrumai-ai-measures/)
- [Top 5 ABA Practice Management Software 2026 (Passage Health)](https://www.passagehealth.com/blog/aba-practice-management-software)
- [AI Powering Personalized ABA Therapy 2026 (BehavioralProz)](https://behavioralproz.com/blog/ai-in-aba-therapy/)

### Document Processing

- [2026 State of Document AI (Artificio)](https://artificio.ai/blog/document-ai-trends-2026-from-ocr-to-agentic-processing)
- [AI Document Processing: Making Manual Entry Obsolete (Lleverage)](https://www.lleverage.ai/blog/ai-document-processing-how-ai-is-making-manual-data-entry-obsolete)

### Cursor vs Copilot (AI-Native IDE Analogy)

- [Cursor vs Copilot: AI Code Editor Review 2026 (DigitalOcean)](https://www.digitalocean.com/resources/articles/github-copilot-vs-cursor)
- [Is Cursor Better Than VS Code with Copilot? (Medium)](https://medium.com/realworld-ai-use-cases/is-cursor-better-than-vs-code-with-copilot-absolutely-and-its-not-close-180b08d163f8)

### Revenue Forecasting

- [AI Turning Healthcare Revenue into Strategic FP&A Asset (FP&A Trends)](https://fpa-trends.com/article/how-ai-turning-healthcare-revenue-strategic-fpa-asset)
- [AI in RCM Market Growth (Market.us)](https://media.market.us/global-ai-in-revenue-cycle-management-market-news/)
