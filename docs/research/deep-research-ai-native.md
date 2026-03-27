# Deep Technical Research: AI-Native Features for ABA Practice Management

## Topic

**How should Clinivise implement truly AI-native features that automate real workflows — not chatbots, not ChatGPT wrappers — to create structural competitive advantage in ABA practice management?**

This matters because the ABA software market is bifurcating: legacy tools (CentralReach, AlohaABA) are bolting AI onto existing CRUD apps, while new entrants (Raven Health, Alpaca Health) are shipping shallow AI wrappers (mostly note generation). No one has built a platform where AI is the operating system — where intelligence is woven into every workflow, invisible to the user, and genuinely eliminates manual labor. That's the gap Clinivise fills.

The research synthesizes findings from 6 specialized agents analyzing: competitor AI features, architectural patterns, open source tools, frontier startups, risk/failure modes, and product experience design.

---

## Executive Summary

### The Landscape

- **CentralReach** is the AI leader with 5 products trained on 4B+ data points, but their UX is terrible (87% complain about advanced features) and AI feels bolted on.
- **Every ABA competitor** has shallow AI: primarily note generation. No one has AI authorization management, claim scrubbing, denial prediction, or scheduling optimization.
- **Adjacent healthcare AI** is moving fast: Abridge (ambient scribing, #1 Best in KLAS), Waystar (prevented $15B in denials), LunaBill (YC F25, 12x billing team productivity), Infinitus (100M+ AI phone call minutes).
- **Healthcare AI funding** hit $10.7B in 2025 (up 24.4%). Over 50% of YC's Spring 2025 batch was building agentic AI.
- **72% of RBTs report burnout**. 67% of ABA leaders rank admin burden as their top challenge. Only 9% of BCBAs use data-based software for determining ABA hours.

### The Strategy: AI as Operating System, Not Feature

The fundamental insight from this research: **"AI-native" means AI drives routine work and the user supervises exceptions** — the opposite of current tools where the user drives everything and AI assists on request.

Clinivise's AI should be invisible. Users interact with forms, tables, and dashboards. AI powers what those forms suggest, what those tables highlight, and what those dashboards surface. If users are thinking about AI, the UX is wrong.

### The 7 AI Principles

1. **Data-grounded, not generative** — AI outputs from structured session data (not freeform generation)
2. **Linked evidence** — every AI output traceable to its source (Abridge's gold standard)
3. **Clinician-in-the-loop** — the user is always the author; AI produces drafts, not decisions
4. **Zero-config** — AI works without setup, configuration, or training
5. **Inline, not chatbot** — AI surfaces inside existing workflows, never in a separate interface
6. **ABA-specific** — trained on/validated against ABA billing codes, authorization patterns, and clinical terminology
7. **Honest about confidence** — every AI output has a confidence score; no false certainty

### The Architecture

- **Vercel AI SDK 6** as the AI abstraction layer (not hand-rolled `lib/ai.ts`)
- **`generateObject` + Zod schemas** for all structured AI extraction
- **Deterministic state machines with AI at bounded decision points** — AI never controls flow
- **Confidence-based routing**: high confidence auto-processes, medium gets flagged, low routes to humans
- **Progressive autonomy**: start with suggestions, graduate to automation as accuracy proves out
- **Phase 1 AI stack costs ~$30-50/month** (Anthropic Claude direct API)

---

## Research Method

| Agent              | Focus                                                                        | Key Output                          |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------- |
| **Competitive AI** | Every AI feature in 15+ ABA and healthcare platforms                         | `docs/ai-competitive-landscape.md`  |
| **Architecture**   | Document processing, structured output, agent patterns, HIPAA                | Synthesis below                     |
| **Open Source**    | AI SDKs, document processing, STT, agent frameworks, observability           | `docs/ai-libraries-research.md`     |
| **Frontier**       | YC startups, AI-native RCM, production agents, predictive AI                 | `docs/deep-research-frontier-ai.md` |
| **Risk**           | Hallucination, FCA liability, PHI, model drift, state regulation             | `docs/ai-risk-analysis.md`          |
| **DX/Product**     | Native vs bolted-on AI, interaction patterns, autonomy levels, anti-patterns | Synthesis below                     |

---

## Official Documentation Findings

### Vercel AI SDK 6 (Primary AI Framework)

The AI SDK provides the cleanest TypeScript-native approach for our stack. Key capabilities:

- **`generateObject`** with `Output.object()` — structured extraction from documents with automatic Zod schema validation
- **`generateText`** with tool calling — multi-step workflows where AI uses defined tools
- **Provider-agnostic** — swap `anthropic()` for `bedrock()` in one line for HIPAA production
- **`ToolLoopAgent`** — bounded agent execution with `stopWhen` + `stepCountIs`
- **Streaming** — native Next.js integration for real-time AI output
- **2.8M weekly downloads**, maintained by Vercel (same team as our framework)

### Anthropic Claude Structured Output

Claude uses tool-use-based structured output (~99% schema-valid). The pattern: define a Zod schema, pass it to `generateObject`, get typed output with automatic validation and retry on malformed responses.

### AWS Bedrock HIPAA Eligibility

Amazon Bedrock is HIPAA-eligible. Claude models on Bedrock are covered under AWS BAA. Requirements: executed BAA, encryption in transit/at rest (default), data not shared with model providers, CloudTrail for audit logging. The migration from direct Anthropic to Bedrock is a one-line provider swap in AI SDK.

### Key Constraint: PHI Handling

- **Prototyping (Phase 1, no real PHI)**: Use direct Anthropic API. Synthetic data only.
- **Production (real PHI)**: Must use AWS Bedrock with BAA. No PHI to non-BAA-covered services.
- **Never include in ANY LLM call**: SSN, full addresses, financial account numbers.

---

## Modern Platform and Ecosystem Patterns

### What ABA Competitors Actually Ship for AI

| Platform          | AI Features                                                      | Technical Approach                                                       | User Reception                                                                                |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| **CentralReach**  | ScheduleAI, NoteGuardAI, NoteDraftAI, ClaimCheckAI, ClaimAgentAI | Trained on 4B+ data points. Acquired SpectrumAI + AI Measures (Aug 2025) | Enterprise users. "Advanced features have many problems." ScheduleAI "hasn't saved time yet." |
| **RethinkBH**     | AI session notes FROM structured data (not audio)                | Azure OpenAI                                                             | Smart approach — reduces hallucination by grounding in structured input                       |
| **Raven Health**  | AI session notes, "AI insights"                                  | Not disclosed                                                            | Shallow — primarily note generation                                                           |
| **Alpaca Health** | AI note-taking, treatment plan generation, record review         | LLM-based                                                                | For solo BCBAs only. "AI-first" marketing, unclear depth.                                     |
| **Mentalyc**      | AI therapy notes from audio/text                                 | LLM-based                                                                | 30K+ clinicians. Users want more customization.                                               |
| **Motivity**      | AI R&D ($11M SBIR grants, $27M funding 2025)                     | Unknown (in development)                                                 | Nothing shipped yet.                                                                          |
| **Neuromnia**     | ABA-specific AI assistant                                        | Fine-tuned Llama 3.1 on synthetic ABA data                               | Chat-based UI — red flag.                                                                     |

**Critical gap**: No ABA competitor has AI authorization management, AI claim scrubbing, AI denial prediction, or AI scheduling optimization. These are all massive workflow automation opportunities.

### Adjacent Healthcare AI That Actually Works

**Abridge** — #1 Best in KLAS for Ambient AI in RCM (2024 & 2025). Their "Linked Evidence" pattern is the gold standard: every AI-generated note element is clickable and traces back to the exact moment in the conversation that produced it. 27% documentation time reduction at Intermountain Health.

**Waystar** (acquired Olive AI) — Prevented $15B in denials in 2025. ~40% of revenue is AI-driven. Automates: eligibility verification, prior authorization, claim status, denial management. Proves that AI RCM has real, measurable ROI.

**LunaBill** (YC F25) — AI voice agents that call insurance companies for claims follow-up. $764K ARR, 60K+ calls automated, 12x billing team productivity (300 claims/day vs 25 manually). 100% pilot-to-paid conversion. Proves narrow AI tools in healthcare billing find instant PMF.

**Infinitus Health** — 100M+ minutes of AI phone calls to insurance companies. Trusted by 44% of Fortune 50 healthcare companies. Their API could be a Phase 3 integration for Clinivise.

**Freed AI** — 25K+ clinicians. Download-to-first-note in 5 minutes. Proves simplicity wins: zero-config ambient documentation that just works.

### The "AI-Native" Design Philosophy

The research clearly distinguishes two approaches:

| Aspect           | AI-Bolted-On (CentralReach)                  | AI-Native (Clinivise target)                                   |
| ---------------- | -------------------------------------------- | -------------------------------------------------------------- |
| Default behavior | User drives, AI assists on request           | AI drives routine work, user supervises exceptions             |
| AI visibility    | "Click here for AI" buttons, separate AI tab | Invisible — AI is the intelligence behind every screen         |
| Trust model      | User must opt-in to each AI action           | System earns trust through accuracy, user can dial up autonomy |
| Failure mode     | AI broken = feature unavailable              | AI broken = graceful degradation to manual workflow            |
| Architecture     | AI service called by existing features       | AI infrastructure that every feature is built on               |

The **Cursor vs VS Code + Copilot** analogy is instructive: Copilot is an extension bolted onto VS Code through APIs. Cursor is a VS Code fork where AI is built into the core — the text buffer, the terminal, the file explorer. Same underlying models, dramatically different experience.

---

## Relevant Repos, Libraries, and Technical References

### Recommended Phase 1 Stack

| Layer                   | Tool                     | Cost           | Why                                                       |
| ----------------------- | ------------------------ | -------------- | --------------------------------------------------------- |
| **LLM Integration**     | Vercel AI SDK 6 (`ai`)   | Free           | 2.8M downloads, native Next.js, Zod v4, provider-agnostic |
| **LLM Provider (dev)**  | `@ai-sdk/anthropic`      | ~$30-50/mo     | Claude Sonnet for dev/prototyping                         |
| **LLM Provider (prod)** | `@ai-sdk/amazon-bedrock` | Pay-per-use    | HIPAA-eligible, one-line swap from Anthropic              |
| **PDF Processing**      | `pdf-parse`              | Free           | 2.5M+ weekly downloads, works on Vercel                   |
| **OCR Fallback**        | `tesseract.js`           | Free           | 37.5K stars, for scanned documents                        |
| **Background Jobs**     | Inngest                  | Free (100K/mo) | Vercel-native, durable workflows, `step.ai` for AI calls  |
| **LLM Observability**   | Langfuse (self-hosted)   | Free           | 20K+ stars, MIT, PHI-safe (self-hosted)                   |
| **Prompt Testing**      | promptfoo                | Free           | MIT, 300K+ developers, runs locally                       |

### What NOT to Use

| Tool                                  | Why Not                                                                                                |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **LangChain.js / LangGraph**          | Overkill abstraction for defined workflows. AI SDK covers everything.                                  |
| **OpenAI Whisper**                    | Researchers found hallucination of fake medical treatments. OpenAI warns against high-risk domain use. |
| **Vector databases (Pinecone, etc.)** | No RAG needed — documents are processed individually, not searched semantically.                       |
| **Custom ML models**                  | Volume too low for training. LLM APIs handle ABA use cases directly.                                   |
| **Zustand/Redux for AI state**        | TanStack Query handles AI response caching. No additional state library needed.                        |

### Key Open Source References

- **Vercel AI SDK**: https://github.com/vercel/ai — 18K+ stars, v6.0
- **Langfuse**: https://github.com/langfuse/langfuse — 20K+ stars, MIT, self-hostable
- **promptfoo**: https://github.com/promptfoo/promptfoo — 6K+ stars, MIT
- **Inngest**: https://github.com/inngest/inngest — 6K+ stars, Vercel-native
- **pdf-parse**: https://www.npmjs.com/package/pdf-parse — 2.5M weekly downloads

---

## Architecture Options

### Option A: Vercel AI SDK + Deterministic Orchestration (Recommended)

**Overview**: Use Vercel AI SDK 6 as the AI abstraction layer. All AI calls go through `generateObject` (structured extraction) or `generateText` (text generation) with Zod schema validation. Workflows are deterministic state machines (your existing server actions + next-safe-action) that call AI only at bounded decision points.

```
src/server/ai/
├── index.ts              # getModel() — provider switcher
├── providers.ts          # anthropic (dev) / bedrock (prod)
├── middleware.ts          # Audit logging, cost tracking
├── schemas/
│   ├── authorization-letter.ts  # Zod schema for auth extraction
│   ├── session-note.ts          # Zod schema for note generation
│   └── claim-check.ts          # Zod schema for claim scrubbing
├── pipelines/
│   ├── auth-letter-intake.ts    # Upload → extract → validate → create
│   ├── session-note-draft.ts    # Session data → structured note draft
│   └── claim-scrub.ts          # Claim → error check → pass/fail
└── prompts/
    └── registry.ts              # Code-based prompt versioning
```

**Core pattern**: AI never writes to the database directly. It returns structured suggestions that server actions validate and persist. Every AI decision logged to `audit_logs`.

- **Strengths**: Simple, type-safe, provider-agnostic, HIPAA migration is one line. Zod schemas enforce output structure. Server actions enforce org scoping and business rules.
- **Weaknesses**: No built-in agent memory or conversation history (not needed for our use cases). Each AI call is stateless.
- **Complexity**: Low. AI SDK's API is minimal and TypeScript-native.
- **Scaling**: Excellent. AI calls are async, cacheable, and parallelizable.
- **DX**: Excellent. Write a Zod schema, call `generateObject`, get typed output.

### Option B: LangChain.js Agent Framework

**Overview**: Use LangChain's agent abstractions for multi-step workflows with memory, tools, and chain-of-thought reasoning.

- **Strengths**: Rich agent patterns, built-in memory, extensive tool ecosystem.
- **Weaknesses**: Heavy abstraction layer, complex debugging, rapid API changes, overkill for defined workflows. "LangChain is overkill for your use cases" per architecture research.
- **When appropriate**: Open-ended conversational agents, complex multi-turn reasoning. Not our use case.

### Option C: Custom LLM Wrapper (`lib/ai.ts`)

**Overview**: Hand-roll a thin wrapper around the Anthropic/Bedrock SDK with custom retry logic, schema validation, and provider switching.

- **Strengths**: Maximum control, minimal dependencies.
- **Weaknesses**: Reinvents what AI SDK already provides. No streaming support without significant effort. Provider-switching logic is non-trivial. No community maintenance.
- **When appropriate**: When AI SDK doesn't support your use case. Currently no gaps.

**Recommendation: Option A.** Vercel AI SDK 6 replaces the planned `lib/ai.ts` wrapper with a mature, maintained framework that handles structured output, streaming, tool calling, and provider switching out of the box.

---

## Recommended Approach for Our Platform

### The 10 AI Features, Phased and Prioritized

#### Phase 1 — Foundation (Build Now)

**1. AI Authorization Letter Parsing** (Task #100 in roadmap)

The most impactful Phase 1 AI feature. Currently, staff manually transcribe authorization letters into the system — 15-20 minutes per letter, error-prone, tedious.

_How it works:_

1. User drops PDF onto upload zone
2. AI extracts structured fields in 5-15 seconds via `generateObject` with `AuthorizationLetterSchema`
3. Side-by-side view: PDF on left, extracted form on right
4. Each field has confidence indicator (green/amber/red)
5. User reviews, corrects errors, clicks "Confirm"
6. Data saves to `authorizations` + `authorization_services`

_Autonomy level:_ L3 (Automation with approval) — AI drafts, user verifies.

_Key design decisions:_

- Field-by-field confirmation required. **NO "Confirm All" button** (risk agent finding: automation complacency is the highest-likelihood critical risk)
- Clicking any extracted field highlights its source location in the PDF (Abridge's "linked evidence" pattern)
- Store AI extraction results and user's final edits separately for accuracy measurement
- Cost: ~$0.003-$0.03 per document (Claude Sonnet vision)

**2. Data-Grounded Session Note Drafts**

After session timer stops, AI generates a note draft based on structured session data — NOT ambient audio.

_How it works:_

1. RBT taps "Stop" on session timer
2. System auto-calculates units (CMS 8-minute rule — deterministic, not AI)
3. Note field appears with AI-generated draft (ghost text)
4. Draft is grounded in: client's current treatment goals, CPT code, session duration, provider's past note patterns for this client
5. RBT edits details specific to this session, signs
6. Small "AI-assisted" badge, never "AI-generated note"

_Autonomy level:_ L3 → progressive to L4 as accuracy proves out.

_Key design decisions:_

- Generate from structured data, not audio (RethinkBH's smart approach — dramatically reduces hallucination)
- Template varies by CPT code (97153 direct therapy note ≠ 97155 supervision note)
- Never say "AI-generated" — say "Session note draft"
- The clinician is the author; AI helped

**3. Authorization Utilization Intelligence**

Not AI in the LLM sense — deterministic computation that surfaces proactive insights.

_What it surfaces:_

- Units remaining per CPT code per authorization
- Projected exhaustion date (linear projection from usage trend)
- Under-utilization alerts (<50% used with >50% of period elapsed)
- Expiring auth warnings (30/14/7 days)
- Revenue at risk (under-utilized units × typical rate)

_How it appears:_

- Progress bars on client detail, session form, dashboard
- "Attention needed" section on dashboard (max 5-7 items)
- Inline alerts at point of action ("3 units remaining on this auth" when logging a session)

_Autonomy level:_ L5 (Full automation) — pure math, no AI interpretation needed.

**4. Session Documentation Completeness Check**

Post-save quality check that runs automatically.

_What it checks (deterministic rules, not LLM):_

- Required fields present (start time, end time, CPT code, place of service)
- Session duration matches logged units (flag if >8-minute discrepancy)
- Active authorization exists for this CPT code and date
- Sufficient remaining authorized units
- Provider credential matches CPT code requirements
- Supervisor co-signature required for RBT sessions

_How it appears:_

- NEVER blocks the save (runs post-save)
- Toast notification if issues found: "1 item needs attention"
- Clicking shows a checklist

_Autonomy level:_ L4 (Automation with notification)

#### Phase 2 — Billing AI (Build After Claims Infrastructure)

**5. Pre-Claim Error Scrubbing**

AI + rules-based checks before claim submission.

_Checks:_

- Authorization valid for service date
- Units don't exceed remaining authorized
- CPT + modifier combination valid
- Provider NPI active
- Historical denial patterns for this payer + CPT code
- Timely filing deadline approaching (alert within 15 days)

_Autonomy level:_ L3 (Automation with approval)

**6. CPT Code Suggestion**

When logging a session, suggest the most likely CPT code based on provider type, client's authorization, and past session patterns.

_Autonomy level:_ L2 (Suggestion) — pre-fill with option to change.

**7. Claim Denial Prediction**

Before submission, assess risk of denial based on historical patterns.

_Technical approach:_ LLM-based analysis via `generateObject` with a risk assessment schema, feeding historical denial patterns as context. NYU research confirms LLMs outperform supervised ML for insurance claim denial prediction.

_Autonomy level:_ L2 (Suggestion) — risk score + specific risk factors + suggested fixes.

**8. AI Appeal Letter Generation**

When a claim is denied, AI drafts an appeal letter citing the specific denial reason, relevant CPT codes, and supporting clinical documentation.

_Autonomy level:_ L3 (Automation with approval)

#### Phase 3 — Advanced Intelligence

**9. Parent Progress Summaries**

AI generates plain-language progress reports from session data for parent communication.

**10. Insurance Call Automation**

Integration with services like LunaBill or Infinitus for AI-powered insurance phone calls (eligibility verification, claim follow-up, authorization requests).

### Architecture Summary

```
Dependencies to add:
  pnpm add ai @ai-sdk/anthropic @ai-sdk/amazon-bedrock inngest

File structure:
  src/server/ai/
  ├── index.ts              # getModel(): anthropic (dev) / bedrock (prod)
  ├── providers.ts          # Provider configuration
  ├── middleware.ts          # Audit logging, cost tracking wrapper
  ├── schemas/              # Zod schemas for all AI outputs
  ├── pipelines/            # Workflow orchestrators
  └── prompts/registry.ts   # Code-based prompt versioning

State management:
  - AI responses cached in TanStack Query (queryKey includes promptVersion)
  - AI processing status tracked in DB (aiProcessed: pending/complete/failed)
  - No additional state library needed

Env vars to add:
  ANTHROPIC_API_KEY         # Dev/prototyping
  AI_PROVIDER               # 'anthropic' | 'bedrock'
```

### What NOT to Build

- **No chatbot** — all AI is backend workflow automation
- **No "AI tab"** — AI surfaces inline in existing workflows
- **No vector database** — no RAG needed
- **No custom ML models** — volume too low, LLMs handle ABA use cases directly
- **No LangChain** — overkill for defined workflows
- **No voice processing in Phase 1** — complex, requires audio infrastructure

---

## Frontier and Emerging Patterns

### Adopt Now

**Confidence-Based Routing** — Production-proven pattern used by every successful healthcare AI system. High confidence (>90%) auto-processes, medium (65-90%) gets flagged fields, low (<65%) routes to full manual review.

- _Who_: Abridge, Suki, Waystar, every production healthcare AI
- _Maturity_: Production-proven
- _Clinivise action_: Build into auth letter parser (Phase 1)

**Progressive Autonomy** — Start conservative, earn trust with accuracy data, gradually expand automation.

- _Pattern_: Month 1 = AI suggests. Month 3 = auto-process high-confidence. Month 6 = AI handles 80%+.
- _Who_: Linear Triage Intelligence, GitHub Copilot adoption patterns
- _Maturity_: Production-proven
- _Clinivise action_: Ship every AI feature in suggestion mode. Track acceptance rates. Offer autonomy upgrade when acceptance >80%.

**Data-Grounded Generation** — Generate AI outputs from structured data, not freeform. Dramatically reduces hallucination.

- _Who_: RethinkBH (notes from structured session data, not audio)
- _Maturity_: Production-proven
- _Clinivise action_: Session notes generated from CPT code + duration + client goals + provider patterns. Never freeform generation.

### Design For Later

**AI Voice Agents for Insurance** — LunaBill proves this works ($764K ARR, 100% pilot-to-paid). Infinitus has 100M+ minutes. Integration opportunity for Phase 3 billing automation.

- _Maturity_: Production-proven (at those companies)
- _Clinivise action_: Build API integration points. Partner, don't build.

**Ambient Voice Documentation** — Abridge, Suki, Freed proving ambient capture → structured notes. Deepgram Nova-3 Medical has best medical accuracy.

- _Maturity_: Production-proven for general medicine, early-adopter for ABA
- _Clinivise action_: Design session note input to accept multiple formats (typed, audio upload, structured form). When voice is added later, it slots in. Phase 2-3.

**AI Compliance Monitoring** — CentralReach's NoteGuardAI audits documentation quality. This is low-hanging fruit once you have session note data.

- _Maturity_: Early-adopter
- _Clinivise action_: Phase 2 — AI reviews session notes for completeness, clinical appropriateness, payer-specific requirements.

### Watch

**Autonomous Claim Submission** — No one does this safely yet. Too much liability risk.

**AI-Driven Scheduling Optimization** — CentralReach's ScheduleAI "hasn't saved time yet." The problem is harder than it looks (multi-constraint optimization with human preferences).

**Fine-Tuned ABA Models** — Neuromnia fine-tuned Llama 3.1 on synthetic ABA data. Interesting technically but premature — general models (Claude, GPT-4o) handle ABA terminology well enough.

---

## Opportunities to Build Something Better

### 1. The "Cursor vs Copilot" Play

CentralReach is adding AI as extensions to their legacy platform (Copilot approach). Clinivise is building a new platform where AI is the foundation (Cursor approach). Same underlying models, dramatically different experience. Every screen in Clinivise can assume AI exists — forms pre-fill, dashboards surface insights, workflows auto-check for errors. CentralReach can't retrofit this.

### 2. Authorization Intelligence That No One Has

No competitor connects auth data → scheduling → session logging → billing → utilization tracking with AI at every junction. CentralReach tracks auths but doesn't block over-scheduling. AlohaABA doesn't connect auths to scheduling at all. Passage Health has auth-aware scheduling but no AI extraction or utilization forecasting. Clinivise can own the entire auth lifecycle with AI.

### 3. Trust Through Linked Evidence

Abridge's linked evidence pattern (click any AI output to see its source) is the gold standard for healthcare AI trust, but no ABA tool has implemented it. For auth letter parsing: click "120 units" and the PDF highlights where that number was found. For session notes: click any AI-drafted sentence and see the client goal it was derived from.

### 4. Billing AI That Prevents Denials, Not Just Processes Them

Waystar prevented $15B in denials. Most ABA tools help you process denials after they happen. Clinivise can prevent them: AI scrubs every claim before submission, flags risks, suggests fixes. Pre-claim scrubbing with denial prediction = structural advantage.

### 5. Progressive Autonomy as a Product Feature

No ABA competitor lets practices choose their AI autonomy level. Clinivise can: "Your practice's AI accuracy for auth letter parsing: 94% over the last 30 days. Would you like to auto-process high-confidence extractions?" This turns AI quality into a visible product feature.

---

## Risks, Gaps, and Edge Cases

### Critical Risks (from `docs/ai-risk-analysis.md`)

| Risk                                    | Why It Matters                                                                                                                                                                   | Mitigation                                                                                                                                                     |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FCA conflict of interest**            | Our 2-4% of collections model means AI that inflates billing creates False Claims Act exposure. UCHealth settled for $23M.                                                       | AI never generates billing amounts. Unit calculations are deterministic code. AI suggests, code calculates.                                                    |
| **Automation complacency**              | At 95% accuracy, staff rubber-stamp AI outputs. Wrong auth data flows to billing.                                                                                                | Field-by-field confirmation required. NO "Confirm All" button. Track override rates.                                                                           |
| **PHI exposure**                        | PHI sent to non-BAA-covered LLM provider = HIPAA violation.                                                                                                                      | Synthetic data only for dev. Bedrock with BAA for production. Enforce in code.                                                                                 |
| **Model drift**                         | LLM quality degrades silently over 90 days as providers update models.                                                                                                           | Build golden evaluation set of 50+ synthetic auth letters. Run regression tests on every prompt change.                                                        |
| **State regulation fragmentation**      | 47 states introduced 250+ healthcare AI bills in 2025. IL prohibits autonomous therapeutic AI. TX requires written disclosure. FL requires 24-hour consent for AI transcription. | Feature flags per state. Conservative defaults. Legal review before launching voice features.                                                                  |
| **AI hallucination in billing context** | AI extracts "200 units" when the auth letter says "120 units." Flows to billing.                                                                                                 | Confidence scores on every field. Cross-validate against DB (does this payer exist? Is the CPT code valid?). Human review for all fields below 90% confidence. |

### High Risks

| Risk                                       | Mitigation                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| **LLM API cost overruns**                  | Track cost per org per month. Set per-org monthly limits. Alert at 80% of budget.                    |
| **AI feature abandonment**                 | Ship in shadow mode first. Measure accuracy before showing to users. Progressive rollout.            |
| **Over-reliance** (automation complacency) | Show accuracy stats. Require periodic manual review. Never auto-escalate autonomy.                   |
| **Prompt sensitivity**                     | Regression test suite with golden evaluation set. Version every prompt. Log promptId per AI call.    |
| **Multi-provider output inconsistency**    | Test all prompts against both Anthropic and Bedrock before production migration. Pin model versions. |

### The "95% Accuracy" Trap

The risk research identified this as the most dangerous failure pattern: AI is 95% accurate, which sounds great, but:

- Staff stop checking because "it's almost always right"
- The 5% errors flow unchecked into billing
- Over months, systematic errors accumulate
- An audit reveals a pattern of incorrect billing
- The FCA investigation focuses on your revenue-sharing model as motive

**Mitigation**: Never ship AI without per-field confidence scores. Never allow "Confirm All." Track and display accuracy stats. Require human review for any field below 90% confidence. Log AI suggestions separately from confirmed values in audit trail.

---

## Recommended Technical Direction

### Phase 1 (Now)

**Build:**

1. `src/server/ai/` directory structure with Vercel AI SDK
2. Auth letter parsing pipeline (upload → extract → validate → review → save)
3. Session note draft generation (from structured data)
4. Deterministic utilization alerts and documentation checks
5. AI audit logging middleware
6. Golden evaluation set for regression testing (50+ synthetic auth letters)

**Install:**

```bash
pnpm add ai @ai-sdk/anthropic @ai-sdk/amazon-bedrock inngest
```

**Add env vars:**

```
ANTHROPIC_API_KEY=sk-ant-...
AI_PROVIDER=anthropic  # Switch to 'bedrock' for production
```

### Phase 2 (After Claims Infrastructure)

**Build:** Pre-claim error scrubbing, CPT code suggestion, denial prediction, AI appeal letters. Integrate Inngest for background AI processing of claims.

### Phase 3 (Advanced)

**Build/Integrate:** Parent progress summaries, voice documentation (Deepgram Nova-3 Medical), insurance call automation (LunaBill/Infinitus partnership).

### What to Avoid

- Chatbots or conversational AI interfaces
- LangChain, LangGraph, or heavy agent frameworks
- Vector databases or RAG
- Custom ML model training
- AI controlling database writes directly
- "Confirm All" buttons on AI outputs
- Publishing specific AI accuracy metrics (Pieces Technologies TX AG settlement)
- Voice features without state-by-state legal review

---

## Open Questions

1. **Should we use Inngest or Trigger.dev for background AI jobs?** Inngest is Vercel-native with `step.ai` for AI calls. Trigger.dev is self-hostable. Both have generous free tiers. Recommendation: Inngest for simplicity, switch to Trigger.dev if we need self-hosting.

2. **When should we add Langfuse for AI observability?** Self-hosted Langfuse is PHI-safe and free. Worth adding in Phase 1 for development debugging, but audit_logs cover production monitoring for now.

3. **Should session notes use Claude Haiku or Sonnet?** Haiku is 10x cheaper but less capable. For note drafts from structured data (well-defined task), Haiku may suffice. Test both and measure acceptance rate.

4. **How do we handle the Bedrock migration testing?** Before launching with real PHI, we need to verify that every prompt produces equivalent output on Bedrock Claude vs direct Anthropic Claude. The AI SDK makes the provider swap trivial, but output parity needs testing.

5. **What's our shadow mode duration?** Minimum 2-4 weeks of AI running alongside manual workflows before showing any AI output to users. Longer for billing-related features.

6. **Per-state AI feature flags** — Which states require disclosure? Which prohibit certain AI features? This needs legal review before production launch.

7. **Should we partner with LunaBill/Infinitus for insurance calls, or build our own?** Strong recommendation to partner — voice AI for insurance calls is a deep specialty (100M+ minutes of training data at Infinitus). Focus on what we uniquely own (auth lifecycle, session workflow, billing intelligence).

---

## Sources and References

### Detailed Research Documents (in this repo)

- `docs/ai-competitive-landscape.md` — Full competitive AI analysis (15+ platforms)
- `docs/ai-libraries-research.md` — OSS library evaluation (7 categories)
- `docs/deep-research-frontier-ai.md` — Frontier startup and emerging pattern research
- `docs/ai-risk-analysis.md` — 38-item risk matrix with mitigations

### Official Documentation

- [Vercel AI SDK 6 Documentation](https://ai-sdk.dev/docs)
- [Vercel AI SDK 6 Release Blog](https://vercel.com/blog/ai-sdk-6)
- [AI SDK Workflow Patterns](https://ai-sdk.dev/docs/agents/workflows)
- [Claude Structured Outputs — Anthropic Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Amazon Bedrock Security & Compliance](https://aws.amazon.com/bedrock/security-compliance/)
- [HIPAA Compliance for GenAI on AWS](https://aws.amazon.com/blogs/industries/hipaa-compliance-for-generative-ai-solutions-on-aws/)

### Platform and Product References

- [Abridge AI Platform](https://www.abridge.com/ai)
- [Waystar AI for Revenue Cycle](https://www.waystar.com/)
- [LunaBill — YC F25](https://www.ycombinator.com/companies/lunabill)
- [Infinitus Health — AI Phone Agents](https://www.infinitus.ai/)
- [CentralReach AI Products](https://centralreach.com/products/)
- [Raven Health ABA Platform](https://ravenhealth.com/)
- [Freed AI — Medical Documentation](https://www.getfreed.ai/)
- [Cohere Health — AI Prior Authorization](https://www.coherehealth.com/)

### Repositories

- [Vercel AI SDK](https://github.com/vercel/ai) — 18K+ stars
- [Langfuse](https://github.com/langfuse/langfuse) — 20K+ stars, MIT
- [promptfoo](https://github.com/promptfoo/promptfoo) — 6K+ stars, MIT
- [Inngest](https://github.com/inngest/inngest) — 6K+ stars
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) — 2.5M weekly downloads
- [tesseract.js](https://github.com/naptha/tesseract.js) — 37.5K stars

### Research and Analysis

- [NYU: LLMs Outperform Supervised ML for Claim Denial Prediction](https://arxiv.org/abs/2404.04504)
- [Healthcare AI Funding 2025 — $10.7B](https://www.bessemervp.com/roadmap-healthtech/)
- [ECRI Top 10 Health Technology Hazards 2026](https://home.ecri.org/blogs/ecri-thought-leadership-resources/top-10-health-technology-hazards-for-2026-executive-brief)
- [Pieces Technologies TX AG Settlement — AI Accuracy Claims](https://oag.ca.gov/)
- [UCHealth $23M FCA Settlement](https://www.justice.gov/)
- [Linear Triage Intelligence](https://linear.app/docs/triage-intelligence)
- [GitHub Copilot: 30% Acceptance Rate](https://www.itpro.com/technology/artificial-intelligence/github-30-of-copilot-coding-suggestions-are-accepted)

### Internal Codebase References

- `src/lib/env.ts` — Existing Bedrock env vars (AWS_REGION, BEDROCK_MODEL_ID)
- `src/lib/safe-action.ts` — authActionClient pattern for org-scoped mutations
- `src/server/db/schema/` — Authorization and session schemas
- `.claude/rules/security.md` — PHI handling rules, Bedrock migration plan
- `CLAUDE.md` — AI architecture: "Direct API for now; migrate to Bedrock when handling real PHI"
