# AI Competitive Landscape: ABA Therapy & Healthcare Platforms

> Researched March 2026. Focused on actual functionality, not marketing claims.

---

## Table of Contents

1. [ABA-Specific AI Features (Competitor Breakdown)](#1-aba-specific-ai-features)
2. [What ABA Practitioners Actually Want from AI](#2-what-aba-practitioners-actually-want)
3. [Adjacent Healthcare AI That Actually Works](#3-adjacent-healthcare-ai-that-actually-works)
4. [AI for Insurance/Authorization](#4-ai-for-insuranceauthorization)
5. [AI for Billing/Claims](#5-ai-for-billingclaims)
6. [What Users Hate About AI in Healthcare](#6-what-users-hate-about-ai-in-healthcare)
7. [Gap Analysis & Clinivise Opportunities](#7-gap-analysis--clinivise-opportunities)

---

## 1. ABA-Specific AI Features

### CentralReach (Market Leader, PE-backed)

**AI Platform:** cari -- proprietary generative AI trained on 4B+ care data points, 50+ clinical/billing experts, 437+ years of ABA experience.

**Specific AI Products:**
- **CR ScheduleAI** -- Analyzes hundreds of data points to match providers to clients and optimize schedules. Behavioral Innovations (3,000 employees, 86 clinics) reported 75% time savings -- schedules that took 8-10 hours now done in minutes. New 2025 features include embedded cancellation reoptimization and bulk editing.
- **CR NoteGuardAI** -- Audits 100% of clinical notes for payer compliance and audit-readiness. Auto-corrects fixable errors, quarantines unfixable ones for manual review. 12+ providers serving 5,000+ learners purchased within first 30 days.
- **CR NoteDraftAI** -- Generates first-draft session notes from session details in real time.
- **CR ClaimCheckAI** -- Audits 100% of claims before submission, quarantines errors.
- **CR ClaimAgentAI** -- End-to-end claims automation.

**Integration:** Fully embedded in the CentralReach platform (not bolt-on).

**Technical Approach:** Proprietary models built on their massive ABA dataset. Not a generic LLM wrapper.

**User Reception:** CentralReach overall has 81% user satisfaction (229 reviews). 87% complain about advanced feature problems. System stability issues (crashes, unsaved data). Very expensive add-on pricing -- small practices can't afford individual feature costs per employee. Goal management is clunky.

**Pricing:** Not publicly disclosed. Add-on model per AI product. Known to be expensive for small practices.

**Acquisitions (2025):** Bought SpectrumAi and AI.Measures to add video data capture, predictive analytics, and outcomes-based care capabilities.

**Assessment:** The most comprehensive AI offering in ABA. But it's enterprise-focused, expensive, and the UX is frustrating. Small practices are priced out. This is our biggest competitor but also the biggest opportunity -- their users hate the experience.

---

### Raven Health (Small Practice Focus)

**AI Features:**
- AI-generated session notes that auto-pull session details and compare to previous sessions for progress tracking
- AI-generated session summaries for progress analysis
- AI-driven data integration into visual dashboards and reports

**Integration:** Mobile-first app (works offline). AI is embedded in the documentation workflow.

**Technical Approach:** Unclear. Marketing says "AI-driven" but no technical details disclosed. Likely an LLM wrapper with structured prompts.

**User Reception:** Limited reviews available. Positioned as simple and fast to set up.

**Pricing:** Data Collection Essentials: $29/user/month. Self-Billing: 2% of claims submitted. Managed Billing: 5% of claims paid. $300-$500 implementation fee.

**Gaps:** No AI scheduling. No AI claims auditing. No AI authorization tracking. Limited AI depth -- primarily note generation.

**Assessment:** Good positioning for small practices but AI is shallow. They're a PM tool with AI note generation bolted on, not an AI-native platform.

---

### Alpaca Health (BCBA-Focused, Solo/Small Practice)

**AI Features:**
- AI notetaking during parent interviews, caregiver trainings, RBT supervision sessions
- AI treatment plan generation (medical history section, goals, interventions)
- AI client record review and information extraction
- One-click document audit against organizational templates

**Integration:** Designed specifically for BCBAs running independent practices. AI is embedded in clinical workflows.

**Technical Approach:** Not disclosed. Appears to be LLM-based document generation with template matching.

**User Reception:** 100% satisfaction from 1 review (too small a sample to be meaningful). Users praise time savings on admin. Some note a learning curve.

**Pricing:** Fee-for-service model (percentage of billable revenue). Specific rates not publicly disclosed.

**Gaps:** Very narrow focus on BCBAs. Not a full PM platform. No billing AI. No scheduling AI. No claims/authorization automation.

**Assessment:** Interesting AI-first approach for BCBAs but extremely narrow. More of a "virtual admin assistant" than a practice management platform.

---

### Mentalyc (AI Therapy Notes, 25K+ Clinicians)

**AI Features:**
- Ambient audio capture during therapy sessions
- AI-generated progress notes from audio/text
- Multiple note formats (SOAP, DAP, etc.)
- Learns therapist preferences over time

**Integration:** Standalone documentation tool. Not ABA-specific -- general therapy.

**Technical Approach:** Speech-to-text + LLM note generation. HIPAA compliant, SOC 2 Type II certified. Does not use clinician data for AI training.

**User Reception (4.5/5 Capterra, 4.4/5 Trustpilot, ~125 reviews total):**
- **Positive:** "Cut charting time by two-thirds." Accurately captures therapeutic interventions. Pulls supporting quotes.
- **Negative:** "The AI makes things up that are not said in the session, and the notes rarely reflect what actually did happen." System crashes. Extended downtime. Slow uploads. AI hallucination is a real and documented problem.

**Pricing:** Not specified in research. Subscription-based per clinician.

**Gaps:** General therapy, not ABA-specific. No ABA data collection. No billing. No practice management. Hallucination problem is critical for clinical documentation.

**Assessment:** Proves the market for AI documentation. Also proves the hallucination problem is real and users notice it. Any AI note generation we build MUST have linked evidence (like Abridge) to build trust.

---

### RethinkBH (Enterprise ABA)

**AI Features:**
- **Session Note AI (launched 2025):** Generates structured, data-driven session summaries directly from collected session data. Built on Azure OpenAI.
- Real-time alerts when session data changes after note completion
- Full clinician editorial control over generated notes

**Integration:** Fully embedded in RethinkBH platform. Notes are grounded in actual session data (not ambient audio).

**Technical Approach:** Azure OpenAI (enterprise-grade). Key differentiator: notes are generated FROM session data, not FROM audio. This means less hallucination risk because the AI is summarizing structured data, not interpreting speech.

**User Reception:** Positioned for mid-market to enterprise. Claims up to 40% reduction in documentation time.

**Pricing:** Not publicly disclosed. Enterprise sales model.

**Assessment:** The data-grounded approach is smart and reduces hallucination risk. This is closer to what we should build -- AI that summarizes structured session data rather than transcribing ambient audio.

---

### Neuromnia (Nia Chat -- AI Copilot for ABA)

**AI Features:**
- AI-driven SOAP notes
- Interdisciplinary treatment planning (ABA, Speech, OT)
- VB-MAPP, ABLLS-R, AFLS skill goal generation
- Medical necessity report generation
- Compliance audit trail
- AI assessment creation

**Integration:** Chat-based interface (Nia Chat). HIPAA compliant with bank-level encryption.

**Technical Approach:** Built on Meta Llama 3.1. Trained on clinician-created synthetic data. Not a generic LLM wrapper -- they fine-tuned on ABA-specific content.

**User Reception:** Claims 8x speedup on therapy notes. No significant user review data found.

**Pricing:** Not publicly disclosed.

**Assessment:** Technically interesting (fine-tuned Llama on ABA data). But chat-based UI is a red flag -- clinicians want inline, embedded automation, not chatbots. The interdisciplinary angle (ABA + Speech + OT) is novel.

---

### Hi Rasmus (Clinical Platform for ABA)

**AI Features:**
- AI session note generation from session data
- Guided prompts and review for note creation
- HiQ Impact Score for measuring clinical effectiveness

**Integration:** Fully embedded in their PM platform. Session data flows into AI notes.

**Technical Approach:** Not disclosed.

**Pricing:** Not publicly disclosed.

**Assessment:** Similar data-grounded approach to RethinkBH. The HiQ Impact Score for measuring clinical effectiveness is interesting -- quantifying outcomes beyond documentation.

---

### Artemis ABA (Salesforce-Built)

**AI Features:**
- AI-powered session notes (3x faster)
- AI-generated session summaries with guided prompts
- AI assessment creation
- Offline data collection with auto-sync

**Integration:** Built on Salesforce. AI embedded in documentation workflow.

**Technical Approach:** Not disclosed. Salesforce infrastructure.

**Pricing:** Not publicly disclosed.

**Assessment:** First NADR (National Autism Data Registry) compatible platform. The Salesforce base gives them enterprise capabilities but may limit flexibility.

---

### Motivity ($27M Raised in 2025)

**AI Features:**
- AI scheduling for patient/provider matching
- AI-driven analytics for clinical decision support
- Caregiver engagement tools
- $11M in SBIR grants funding AI R&D

**Integration:** All-in-one platform (expanded to full PM in April 2025).

**Technical Approach:** Significant R&D investment. AI/ML for predictions and optimization.

**Pricing:** Not publicly disclosed.

**Assessment:** Well-funded and expanding aggressively. Their SBIR grants suggest government/research-grade AI development, not just LLM wrappers. Worth watching as a serious competitor.

---

## 2. What ABA Practitioners Actually Want

### The Burnout Crisis

- **72% of RBTs report medium-to-high burnout** (study of 800+ ABA practitioners)
- **67% of ABA leaders rank administrative burden as top challenge**
- Therapists spend nearly as much time on notes, scheduling, and billing as delivering therapy
- Practices with disconnected workflows waste **up to 10 hours per staff member per week**

### Specific Automation Demands

1. **Session documentation** -- #1 request. Practitioners want notes generated from data, not written manually
2. **Scheduling optimization** -- Matching providers to clients across locations, credentials, and preferences
3. **Authorization tracking** -- Automated utilization monitoring, expiration alerts, pacing recommendations
4. **Billing accuracy** -- Catch errors before submission, auto-match CPT codes to sessions
5. **Predictive tools** -- Caseload balancing, burnout prediction
6. **Compliance checks** -- Automated audit of notes against payer requirements
7. **Parent communication** -- Progress summaries in plain language

### Technology Adoption Reality

- **Only 9% of BCBAs use data-based software for determining ABA hours** -- massive gap
- Practitioners want AI that is **inline and ambient**, not chatbots or separate tools
- HIPAA/PHI concerns are the #1 barrier -- practitioners know general ChatGPT is not safe
- Many are skeptical of "AI-washed" tools that are just LLM wrappers

### The LLM Wrapper Problem (Per The Behavior Academy)

The ABA field has a documented problem with AI tools that:
- Pass data directly to commercial LLMs (GPT, Claude, Gemini) with no real modification
- Don't understand clinical risk or data privacy
- Can't align outputs with behavior analytic principles
- Don't understand funding source requirements
- Are "great at smoothing grammar" but "not good at knowing what actually happened in session"

**Key insight for Clinivise:** Our AI must be grounded in actual session data and ABA-specific rules, not generic text generation. The field is increasingly aware of and hostile to LLM wrappers.

---

## 3. Adjacent Healthcare AI That Actually Works

### Abridge (Ambient Clinical Documentation -- Market Leader)

**What it actually does:**
- Ambient listening captures doctor-patient conversation
- NLP creates transcript, separating chitchat from clinical content
- LLM converts transcript to narrative clinical notes
- **Linked evidence** -- clinicians highlight any AI text to see supporting transcript/audio
- Real-time note generation (during visit, not after)
- Post-visit: billing code suggestions, patient summaries
- Jan 2026: Real-time prior authorization via Availity partnership

**Integration:** Epic Haiku (iOS), standalone app. Copy/paste to EHR if no direct integration.

**Why it works:** The linked evidence layer builds trust. Clinicians can verify any claim the AI makes.

**Limitations:** No pre-visit capabilities. No AI receptionist. No automated intake.

**Relevance to Clinivise:** The "linked evidence" pattern is critical. Any AI-generated content should be traceable to source data.

---

### Suki AI ($70M Series D, 400+ Health Systems)

**What it actually does:**
- Ambient mode captures entire patient-clinician conversation
- Bi-directional EHR integration (Epic, Cerner, athenahealth, MEDITECH)
- Auto-suggests ICD-10 and E/M codes from documentation
- Stages prescription orders for approval in EHR
- Voice commands for navigation and data entry

**Pricing:** Compose: $299/month/user. Assistant: $399/month/user.

**Target:** Enterprise (100+ clinicians). Requires IT support for setup.

**Relevance to Clinivise:** The automatic coding suggestion pattern is directly applicable to ABA CPT code assignment.

---

### Freed AI (25K+ Clinicians, Simplicity-First)

**What it actually does:**
- Ambient conversation capture (live or file upload)
- SOAP notes generated in ~40 seconds
- Templates that learn clinician preferences over time
- One-click EHR push (browser-based EHRs)
- Auto-generates ICD-10 codes, clinical letters, patient instructions

**Pricing:** $90-99/clinician/month. Premier ($119/month) adds EHR push and billing codes. Unlimited notes.

**Why it works:** Download to first note in under 5 minutes. No IT, no complex onboarding. Simple.

**Limitations:** Built for primary care. Specialty terminology gaps. No deep EHR integration.

**Relevance to Clinivise:** The simplicity model is what small ABA practices want. Fast setup, immediate value, no IT overhead.

---

### DeepScribe (Specialty-Focused, 98.8 KLAS Score)

**What it actually does:**
- Ambient scribing tuned for complex specialties (oncology, cardiology, etc.)
- Pulls relevant history, labs, diagnostics into coherent longitudinal notes
- HCC, CPT, and ICD-10 suggestions embedded in notes
- Highest KLAS spotlight score in category (98.8)

**Relevance to Clinivise:** Proves that specialty-tuned AI dramatically outperforms generic solutions. ABA-specific tuning is a competitive moat.

---

### Nabla (AI Copilot for Consultations)

**What it actually does:**
- Ambient AI using Microsoft speech-to-text + fine-tuned Whisper + GPT series
- Real-time SOAP note generation
- **Magic Edit** -- clinicians give natural language directions to modify notes
- AI medical coding identification
- 2025: Partnership with Navina to combine ambient documentation with historical patient records

**Relevance to Clinivise:** The "Magic Edit" pattern is excellent UX -- let clinicians direct the AI with plain language instead of manual editing.

---

### Regard (AI Clinical Reasoning, 150+ Hospitals)

**What it actually does:**
- Reviews 100% of patient data
- Recommends diagnoses with clinical evidence
- Generates care plans and draft notes BEFORE encounters
- Combines chart data with patient-physician conversations

**Relevance to Clinivise:** The "proactive documentation" pattern (generating drafts before encounters) could apply to ABA session prep -- pre-populate session notes with client history, last session data, authorization status, and suggested focus areas.

---

### Notable Health (Healthcare Admin Automation)

**What it actually does:**
- AI + RPA to automate back-office workflows
- Digitizes patient intake (questionnaires, consent forms)
- Automates scheduling, reminders, referral intake
- Insurance eligibility checks and prior authorization paperwork
- Reads EHR data, updates fields, sends communications

**Integration:** HIPAA compliant. Deep integration with Epic, Cerner, Meditech.

**Relevance to Clinivise:** The RPA approach (reading data, filling forms, sending communications) is applicable to ABA intake automation, credential verification, and payer communication.

---

### Viz.ai (Clinical AI Workflows, 1,700+ Hospitals)

**What it actually does:**
- 50+ FDA-cleared algorithms analyzing medical imaging
- Real-time alerts to specialists (90% reviewed within 5 minutes)
- Closed-loop care coordination communication
- 44% reduction in time-to-diagnosis for stroke

**Relevance to Clinivise:** The alert-driven workflow pattern is applicable to authorization utilization alerts, session compliance flags, and billing anomaly detection.

---

## 4. AI for Insurance/Authorization

### Cohere Health (AI Prior Authorization Platform)

**What it actually does:**
- Integrates with EHRs for inline authorization management
- **Cohere Align** (2025): Analyzes provider historical behavior to identify trusted clinicians. ~80% of PA submissions streamlined for pre-approved providers. 55% reduction in provider submission time.
- **Cohere Review Assist** (2025): For acute inpatient care. 50% faster authorization completion.
- **Cohere Policy Studio** (2025): AI-powered insurance policy management.
- Can automate decisioning for up to 90% of care needs.

**Assessment:** This is a payer-side platform. Not directly applicable as a competitor, but their approach to analyzing historical patterns for auto-approval is worth emulating on the provider side (predicting which auths will be approved vs. need extra documentation).

---

### Waystar (Olive AI Assets Acquired)

**What it actually does:**
- $1B+ annual revenue (2025). 24% YoY growth.
- **Altitude AI** prevented $15B+ in denials for clients in 2025
- Reduced appeal time by 90%
- Double-digit increases in denial overturn rates
- ~50% of solutions leverage AI, ~40% of revenue AI-driven
- New agentic capabilities cut documentation analysis by 40%
- Data from 1 in 3 US hospital discharges, 7B+ annual transactions

**Pricing:** Enterprise. Not applicable to small ABA practices.

**Assessment:** Proves that AI-driven RCM works at scale and generates massive revenue. The denial prevention model ($15B saved) is the most compelling AI value proposition in healthcare.

---

### Infinx (AI Authorization Management)

**What it actually does:**
- Automated prior authorization initiation, checks, submissions, updates
- Real-time eligibility and benefits verification
- Service-level benefit granularity (not just general plan status)
- ML-based discovery of undisclosed/missing insurance coverage
- Bi-directional EHR integration
- Listed in Epic's Connection Hub (2025)

**Assessment:** Enterprise-focused. The "discovery of undisclosed insurance" feature is interesting for ABA where families may have secondary coverage.

---

### Infinitus Health (AI Phone Agents)

**What it actually does:**
- Voice AI agents that make phone calls to insurance companies
- Navigates IVR menus, engages in real-time conversations with payer reps
- Uses proprietary knowledge graph to push back against incorrect payer information
- 100M+ minutes of healthcare conversations
- Automates: benefit verifications, PA status checks, claims inquiries, appeals follow-up
- Trusted by 44% of Fortune 50 healthcare companies
- Partnered with Salesforce (June 2025)

**Assessment:** This is genuinely impressive automation -- not text, but actual phone calls. ABA practices spend enormous time on hold with insurers. This is a potential integration partner, not something to build ourselves.

---

### CMS 2026 Prior Authorization Mandate

**Critical context:** The CMS Interoperability and Prior Authorization Final Rule (CMS-0057-F) takes effect in 2026. Insurers covering 250M+ Americans must streamline/remove PA burdens. This will reshape the entire PA landscape and create opportunities for tools that help practices navigate the new electronic PA requirements.

---

## 5. AI for Billing/Claims

### Current State of AI in Medical Billing

- 67% of providers believe AI can improve claims process
- Only 14% have implemented AI tools (massive adoption gap)
- 41% of providers report denial rates at or above 10%
- Medicare Advantage denials spiked 4.8% from 2023-2024
- ~20% of ABA claims denied on first submission, 80% preventable

### AI Claim Scrubbing

- AI checks claims against hundreds of payer-specific rules before submission
- Catches coding errors, missing modifiers, ICD-10/CPT mismatches
- Platforms like ENTER Health achieve 99.6% of contract value

### AI Denial Prediction & Management

- ML models predict which claims will be denied and suggest corrections
- AI auto-generates appeal letters with clinical evidence aligned to payer policies
- 83% of orgs using AI report 10%+ drop in denials within 6 months
- Up to 54% of denied claims can be recovered
- Mayo Clinic has bots writing appeal letters
- Waystar's AI prevented $15B in denials in 2025

### AI Payment Posting

- AI posts payer payments in seconds (ERAs and EOBs)
- Auto-reconciles against contract values to detect underpayments
- Up to 99.99% accuracy vs. 80% error rate in manual billing
- Could save healthcare industry $20B annually

### LunaBill (YC F25 -- AI Voice Agents for Insurance Calls)

**What it actually does:**
- AI voice agents fine-tuned on 1.2M+ call transcripts
- Automates: claim status inquiries, A/R recovery, appeals follow-up
- Results: 12x productivity (300+ claim follow-ups/day vs. 25/day manual)
- $764K contracted ARR since July launch
- 100% pilot-to-paid conversion rate
- 60,000+ automated calls, 20,000+ hours saved, $30M+ recovered

**Co-founders:** One built Taiwan's biggest healthcare AI scribe (120K+ users).

**Assessment:** Extremely impressive traction for an early startup. Validates the voice-agent-for-insurance-calls model. Potential integration partner for Clinivise Phase 2 billing.

---

### ENTER Health (AI-First RCM Platform)

**What it actually does:**
- **ContractAI** -- Manages all payer contracts (fee-for-service, value-based, workers comp, etc.)
- **ClaimAI** -- AI reads clinical notes, applies CPT/ICD codes, learns from payer feedback
- **DenialAI** -- Automated denial management
- **PaymentAI** -- Payment posting and reconciliation
- Results: 40% less manual work, 30% faster reimbursements, 21% increase in clean claims rate
- Go-live in under 40 days with any EHR

**Assessment:** This is what a truly AI-native RCM platform looks like. Every step of the revenue cycle has dedicated AI. Worth studying their product architecture.

---

## 6. What Users Hate About AI in Healthcare

### Hallucination (The #1 Problem)

- GPT-4o: 21/50 medical summaries had incorrect information; 50/50 had generalized information
- Llama-3: 19/50 incorrect, 47/50 generalized
- Mentalyc users report: "The AI makes things up that are not said in the session"
- Once incorrect info enters a medical record, it propagates across systems and providers
- Healthcare providers face False Claims Act liability for hallucinated documentation

### The LLM Wrapper Epidemic

- Many ABA tools "just take input and pass it to GPT/Claude/Gemini with a branded interface"
- No data privacy infrastructure
- No clinical risk understanding
- No alignment with behavior analytic principles
- "Great at smoothing grammar but not good at knowing what actually happened in session"

### Trust Gap

- 70%+ of doctors cite accuracy/reliability as top barrier to AI adoption
- 47% want increased oversight as the #1 regulatory action needed
- Doctors using AI for clinical decisions are viewed negatively by peers
- Patients and clinicians can't see how AI conclusions are generated (opacity problem)

### Specific Complaints Users Voice

1. **Accuracy issues** -- AI misinterprets, fabricates, or generalizes
2. **System reliability** -- Crashes, downtime, slow uploads, unsaved data
3. **Cost** -- AI add-ons are expensive, especially per-user pricing for small practices
4. **Integration friction** -- Copy-paste workflows, lack of EHR integration
5. **Learning curve** -- Despite "simple" marketing, tools require adaptation time
6. **Specialty gaps** -- Tools built for primary care fail on specialized terminology
7. **No transparency** -- Can't trace AI output back to source data

---

## 7. Gap Analysis & Clinivise Opportunities

### Where the Market is WEAK (Our Opportunities)

| Gap | Details | Clinivise Opportunity |
|-----|---------|----------------------|
| **Small practice pricing** | CentralReach is too expensive. AI features are per-add-on. | Free PM + AI-native features included. Monetize on billing (2-4% rev share). |
| **Data-grounded AI notes** | Most tools use ambient audio (hallucination-prone) or generic LLM wrappers. | Generate notes FROM structured session data (like RethinkBH) with linked evidence (like Abridge). |
| **Authorization intelligence** | No platform proactively manages auth utilization with AI. Basic tracking exists but no predictive pacing, no auto-renewal prompts, no optimization. | AI that predicts auth exhaustion, recommends session pacing, auto-alerts on expiring auths, suggests re-auth timing, drafts re-auth requests. |
| **ABA-specific claim scrubbing** | Generic claim scrubbers don't know ABA billing rules (CMS 8-min rule, modifier requirements, auth-to-session matching). | Pre-submission validation against ABA-specific rules, payer-specific requirements, and authorization limits. |
| **Denial prediction for ABA** | No ABA-specific denial prediction. Generic RCM tools don't understand ABA claim patterns. | ML model trained on ABA denial patterns to flag high-risk claims before submission. |
| **AI auth letter parsing** | Only Alpaca does basic document review. No one does intelligent extraction from authorization letters. | OCR + LLM extraction of approved units, CPT codes, date ranges, conditions from auth letters. Auto-populate auth records. |
| **Session prep automation** | No one pre-populates session context. | Before each session: show last session summary, auth utilization %, goals in progress, parent communication notes, suggested focus areas. |
| **Parent-facing summaries** | Minimal AI for parent communication. | Auto-generate plain-language progress summaries for parents from session data. |
| **Billing code validation** | RBTs frequently miscoded. BCBAs must review. | AI suggests CPT codes based on session activities, flags mismatches between documented activities and selected codes. |
| **Integrated voice-to-insurance** | No ABA platform has built-in voice agents for insurance calls. | Partner with LunaBill or Infinitus for Phase 2 insurance call automation. |

### What We Should NOT Build

1. **Chatbots** -- Practitioners hate them. They want inline, ambient automation.
2. **Generic LLM wrappers** -- The field is increasingly hostile to these. We need data-grounded AI.
3. **Ambient audio transcription** -- Too many hallucination issues. Stick to structured data summarization for now.
4. **AI that replaces clinical judgment** -- Always position AI as a copilot. BCBAs must review and approve.
5. **Complex onboarding** -- Freed AI wins because it takes 5 minutes. Our AI must be zero-config.

### Recommended AI Feature Priority for Phase 1

1. **AI Auth Letter Parsing** (already planned) -- OCR + LLM extraction from authorization PDFs. Immediate time savings, low risk, high trust (user verifies extracted data).

2. **Data-Grounded Session Note Drafts** -- Generate note drafts from collected session data (not audio). Include linked evidence showing which data points produced which statements.

3. **Authorization Utilization Intelligence** -- Predictive pacing alerts. "At current rate, Client X will exhaust auth by April 15 -- 3 weeks before expiration." Suggest session frequency adjustments.

4. **Smart Session Prep** -- Before each session, auto-assemble: last session summary, auth utilization %, active goals with recent data trends, any parent notes or concerns.

### Recommended AI Feature Priority for Phase 2

5. **ABA Claim Scrubbing** -- Pre-submission validation against ABA-specific rules, payer requirements, and authorization limits.

6. **CPT Code Suggestion** -- Based on session activities and duration, suggest appropriate billing codes and flag mismatches.

7. **Denial Prediction** -- Flag claims likely to be denied based on historical patterns, payer behavior, and documentation completeness.

8. **AI Appeal Letter Generation** -- Auto-draft appeal letters with clinical evidence from session data aligned to payer denial reasons.

9. **Parent Progress Summaries** -- Plain-language, auto-generated progress reports from session data.

10. **Insurance Call Automation** -- Partner integration (LunaBill/Infinitus) for benefit verification, auth status checks, and claims follow-up.

### Design Principles for All AI Features

1. **Data-grounded, not generative** -- AI should summarize and structure existing data, not create new content from nothing.
2. **Linked evidence** -- Every AI output should be traceable to source data (Abridge pattern).
3. **Clinician-in-the-loop** -- AI drafts, humans approve. Never auto-submit anything.
4. **Zero-config** -- AI features work immediately, no training period needed. Learn preferences over time.
5. **Inline, not chatbot** -- AI appears where the work happens (in the note editor, on the auth card, in the claims queue), not in a separate chat interface.
6. **ABA-specific** -- Our AI must understand CMS 8-minute rule, ABA CPT codes, modifier requirements, payer-specific auth rules. Generic healthcare AI is not enough.
7. **Honest about confidence** -- Show confidence levels. Flag uncertain outputs explicitly. Never pretend to be certain.

---

## Sources

### ABA Competitors
- [Raven Health AI Features](https://ravenhealth.com/key-features-ai-capabilities/)
- [Raven Health Pricing](https://ravenhealth.com/pricing/)
- [Alpaca Health for Providers](https://www.alpacahealth.io/for-providers)
- [Alpaca Health Reviews (SelectHub)](https://www.selecthub.com/p/aba-software/alpaca-health/)
- [Mentalyc Reviews (Capterra)](https://www.capterra.com/p/265098/Mentalyc/reviews/)
- [Mentalyc Reviews (Trustpilot)](https://uk.trustpilot.com/review/mentalyc.com)
- [Mentalyc Review (DeepCura)](https://www.deepcura.com/resources/mentalyc-review)
- [CentralReach AI Philosophy](https://centralreach.com/about/our-ai-philosophy/)
- [CentralReach NoteGuardAI Launch](https://www.globenewswire.com/news-release/2024/07/17/2914803/0/en/CentralReach-Unveils-CR-NoteGuardAI.html)
- [CentralReach ClaimCheckAI & ClaimAgentAI](https://centralreach.com/blog/centralreach-announces-two-new-claims-maximizer-solutions-cr-claimcheckai-and-cr-claimagentai/)
- [CentralReach SpectrumAi/AI.Measures Acquisition](https://hitconsultant.net/2025/08/18/ma-centralreach-acquires-spectrumai-and-ai-measures/)
- [CentralReach Reviews (Software Advice)](https://www.softwareadvice.com/medical/centralreach-profile/reviews/)
- [CentralReach Reviews (Capterra)](https://www.capterra.com/p/140743/CentralReach/reviews/)
- [CentralReach ScheduleAI (Behavioral Innovations)](https://www.globenewswire.com/news-release/2025/01/28/3016591/0/en/Behavioral-Innovations-Transforms-ABA-Scheduling.html)
- [Catalyst/DataFinch ABA Data Collection](https://datafinch.com/aba-automation-data/)
- [Motivity $27M Funding](https://hitconsultant.net/2025/03/12/motivity-secures-27m-to-advance-ai-driven-aba-therapy-solutions/)
- [Motivity All-in-One Expansion](https://www.prnewswire.com/news-releases/motivity-expands-into-practice-management-302422708.html)
- [RethinkBH Session Note AI Launch](https://www.prnewswire.com/news-releases/rethinkbh-session-note-ai-sets-the-pace-for-aba-clinician-workflow-302705126.html)
- [Neuromnia + Llama 3.1 (Meta Blog)](https://ai.meta.com/blog/neuromnia-autism-aba-therapy-built-with-llama/)
- [Neuromnia Nia Chat](https://neuromnia.com/)
- [Hi Rasmus AI Session Notes](https://hirasmus.com/2024/12/17/ai-powered-session-notes/)
- [Hi Rasmus 2025 Features](https://hirasmus.com/2025/12/24/hi-rasmus-year-end-wrapped/)
- [Artemis ABA AI Features](https://www.artemisaba.com/products-and-services/data-and-collections)
- [Artemis ABA NADR Compatibility](https://www.artemisaba.com/press-release/artemis-aba-becomes-the-first-nadr-compatible-platform)
- [Passage Health ABA PM](https://www.passagehealth.com/blog/aba-practice-management-software)
- [AlohaABA Features](https://alohaaba.com/)

### Practitioner Insights
- [LLM Wrappers in ABA (The Behavior Academy)](https://www.thebehavioracademy.com/blog/llm-wrappers-in-aba)
- [AI in Today's ABA: Safe Automation (The Behavior Academy)](https://www.thebehavioracademy.com/newsletters/chiron-the-ai-literacy-series-for-aba-professionals/posts/ai-in-todays-aba-is-it-safe-to-automate)
- [AI in ABA: What Behavior Analysts Need to Know](https://www.appliedbehavioranalysisedu.org/2024/01/integration-of-aba-with-artificial-intelligence-ai/)
- [ABA Trends 2026 (ABA Matrix)](https://www.abamatrix.com/aba-trends-2026/)
- [AI in Behavior Analysis (ABA Matrix)](https://www.abamatrix.com/ai-in-behavior-analysis/)

### Adjacent Healthcare AI
- [Abridge AI Review (DeepCura)](https://www.deepcura.com/resources/abridge-ai-review)
- [Abridge Business Breakdown (Contrary Research)](https://research.contrary.com/company/abridge)
- [Abridge AI at Johns Hopkins](https://it.johnshopkins.edu/ai/abridge-ai-scribe/)
- [Suki AI Review (AI Chief)](https://aichief.com/ai-healthcare-tools/suki-ai/)
- [Suki AI Pricing (Healos)](https://www.healos.ai/blog/suki-pricing-features-cost-and-the-best-alternatives-in-2025)
- [Freed AI Review (DeepCura)](https://www.deepcura.com/resources/freed-ai-review)
- [Freed AI Review (Twofold)](https://www.trytwofold.com/compare/freed-ai-scribe-review)
- [DeepScribe Features](https://www.deepscribe.ai/)
- [Nabla AI Copilot](https://www.nabla.com/)
- [Nabla + Navina Partnership](https://www.fiercehealthcare.com/health-tech/navina-and-nabla-unveil-partnership)
- [Regard AI Platform](https://regard.com/)
- [Notable Health](https://www.notablehealth.com/)
- [Viz.ai Platform](https://www.viz.ai/)
- [Viz.ai Stroke Studies (ISC 2025)](https://www.viz.ai/news/new-studies-demonstrate-impact-of-vizais-stroke-solution)

### Insurance/Authorization AI
- [Cohere Health AI Prior Auth](https://www.coherehealth.com/)
- [Cohere Health Compliance AI](https://www.coherehealth.com/news/cohere-health-prior-authorization-compliance-ai)
- [Top 5 AI Vendors for Prior Authorization (Innovaccer)](https://innovaccer.com/blogs/top-5-ai-vendors-for-prior-authorization-2025)
- [Waystar Auth Accelerate](https://www.waystar.com/news/waystar-expands-authorization-automation/)
- [Waystar Q4 2025 Results](https://www.investing.com/news/company-news/waystar-q4-2025-slides-24-revenue-growth-driven-by-ai-solutions-stock-surges-93CH-4509201)
- [Infinx AI Authorization](https://www.infinx.com/prior-authorization-solution-ai-and-automation/)
- [Infinitus AI Phone Agents](https://www.infinitus.ai/)
- [Infinitus Prior Authorization](https://www.infinitus.ai/solutions/prior-authorization/)
- [CMS 2026 PA Mandate (PharmiWeb)](https://www.pharmiweb.com/press-release/2025-07-26/major-health-insurers-slash-prior-authorization-requirements)

### Billing/Claims AI
- [AI Claim Denial Management (Aspirion)](https://www.aspirion.com/turning-the-denial-tables-ai-tools-that-actually-help-hospitals-win/)
- [AI Denial Management Impact (Invensis)](https://www.invensis.net/blog/impact-of-ai-on-denial-management)
- [AI Appeal Letters (NYX Health)](https://nyxhealth.com/nyx-health-ai/)
- [Battle of the Bots: Payers vs. Providers (HFMA)](https://www.hfma.org/revenue-cycle/denials-management/health-systems-start-to-fight-back-against-ai-powered-robots-driving-denial-rates-higher/)
- [LunaBill (YC F25)](https://www.ycombinator.com/companies/lunabill)
- [LunaBill Launch](https://www.ycombinator.com/launches/Ooq-lunabill-ai-voice-callers-for-healthcare-billing-teams)
- [ENTER Health AI-First RCM](https://www.enter.health/)
- [AI Payment Posting (Jorie AI)](https://www.jorie.ai/post/automating-payment-posting-a-key-to-efficient-healthcare-revenue-cycle-management)
- [AI ERA Processing (HOMRCM)](https://www.homrcm.com/blogs/electronic-remittance-advice-how-ai-powered-era-is-reshaping-medical-billing)
- [Stedi Healthcare API](https://www.stedi.com/docs/healthcare)

### AI Trust & Complaints
- [AI Hallucination in Healthcare (CIO)](https://www.cio.com/article/3593403/patients-may-suffer-from-hallucinations-of-ai-medical-transcription-tools.html)
- [Hallucinations in AI Medical Summaries (Clinical Trials Arena)](https://www.clinicaltrialsarena.com/news/hallucinations-in-ai-generated-medical-summaries-remain-a-grave-concern/)
- [Physician AI Trust Survey (Healthcare Dive)](https://www.healthcaredive.com/news/physician-ai-adoption-doximity-accuracy-reliability/814960/)
- [Doctors Using AI Viewed Negatively (Healthcare Brew)](https://www.healthcare-brew.com/stories/2025/10/01/doctors-ai-clinical-decision-making-viewed-negatively)
- [AI Healthcare Compliance Risks (Morgan Lewis)](https://www.morganlewis.com/pubs/2025/07/ai-in-healthcare-opportunities-enforcement-risks-and-false-claims)
- [AI Trust Gap (WEF)](https://www.weforum.org/stories/2025/12/trust-gap-ai-healthcare-asia/)
- [Physicians Using AI Charts (Advisory Board)](https://www.advisory.com/daily-briefing/2025/02/17/ai-use)
