# AI Libraries & Tools Research

> Research date: 2026-03-21
> Context: Clinivise ABA therapy PM platform. Stack: Next.js 16, React 19, TypeScript, Vercel. AI approach: direct LLM calls now, AWS Bedrock for production.

---

## Table of Contents

1. [AI/LLM SDKs and Frameworks](#1-aillm-sdks-and-frameworks)
2. [Document Processing Libraries](#2-document-processing-libraries)
3. [Speech-to-Text Libraries](#3-speech-to-text-libraries)
4. [AI Agent & Background Job Frameworks](#4-ai-agent--background-job-frameworks)
5. [Prediction/ML Libraries](#5-predictionml-libraries)
6. [AI Infrastructure & Observability](#6-ai-infrastructure--observability)
7. [Healthcare-Specific AI](#7-healthcare-specific-ai)
8. [Recommendations for Clinivise](#8-recommendations-for-clinivise)

---

## 1. AI/LLM SDKs and Frameworks

### Vercel AI SDK (ai) -- RECOMMENDED

| Metric               | Value                        |
| -------------------- | ---------------------------- |
| GitHub               | https://github.com/vercel/ai |
| Stars                | ~38K                         |
| NPM Weekly Downloads | ~2.8M                        |
| License              | Apache-2.0                   |
| Latest Version       | AI SDK 6 (current major)     |
| Pricing              | Free, open source            |

**What it does:** The leading TypeScript toolkit for building AI-powered apps. Provides unified API across 25+ LLM providers, streaming-first primitives, React Server Component integration, and structured output with Zod schemas.

**AI SDK 6 key features:**

- `generateObject` + `generateText` unified for multi-step tool calling loops ending in structured output
- `Agent` abstraction: define once with model, instructions, tools; reuse across the app. `ToolLoopAgent` handles automated loops (configurable up to 20 steps)
- `toModelOutput` separates tool results from what gets sent to the model (solves large output / binary data issues)
- DevTools for inspecting agent flows, prompts, outputs, and metrics
- Standard JSON Schema V1 support (any schema library works, not just Zod)
- Native Zod 4 integration
- Reranking for search result relevance
- Image editing capabilities

**AI SDK 5 changes (July 2025):**

- SSE replaces WebSockets for streaming
- Dynamic tooling with `inputSchema` and `outputSchema`
- Experimental text-to-speech and transcription support (OpenAI, ElevenLabs, Deepgram)

**AWS Bedrock provider:** `@ai-sdk/amazon-bedrock` (v4.0.77). Uses native InvokeModel API, supports all Anthropic API features except Files API and MCP Connector. Supports both Bearer token auth and AWS SigV4. Switching from direct Anthropic to Bedrock is a provider swap, not a rewrite.

**Fit for Clinivise:** Perfect. Native Next.js integration, streaming for real-time UI, structured output for auth letter parsing, Bedrock provider for production migration. This is the foundation layer.

**Complexity cost vs. DIY:** Massive time savings. Handles streaming, structured output, tool calling, and provider abstraction. Building this yourself would take weeks.

---

### Anthropic SDK (@anthropic-ai/sdk)

| Metric  | Value                                                  |
| ------- | ------------------------------------------------------ |
| GitHub  | https://github.com/anthropics/anthropic-sdk-typescript |
| License | MIT                                                    |
| Pricing | Free SDK; pay per API call                             |

**What it does:** Official TypeScript SDK for Claude API. Supports structured outputs (JSON matching a schema), tool use, streaming, and multi-turn conversations.

**Structured outputs:** `output_config.format` parameter (moved from `output_format`). Beta headers no longer required. Works with all Claude models.

**Fit for Clinivise:** Useful during prototyping if you want direct Claude calls without the AI SDK abstraction. But since AI SDK wraps this with a better DX and provider portability, use AI SDK instead for most cases. Keep this as a fallback for edge cases where AI SDK doesn't expose a Claude-specific feature.

---

### Instructor JS (@instructor-ai/instructor)

| Metric               | Value                                          |
| -------------------- | ---------------------------------------------- |
| GitHub               | https://github.com/instructor-ai/instructor-js |
| Stars                | ~726                                           |
| NPM Weekly Downloads | ~14,769                                        |
| License              | MIT                                            |
| Pricing              | Free, open source                              |

**What it does:** Structured extraction from LLMs using Zod schemas. Wraps OpenAI function calling. Supports Anthropic, Azure, Cohere via `llm-polyglot`. Patching approach: wraps your SDK client to add schema enforcement.

**Fit for Clinivise:** Largely unnecessary if using AI SDK 6. The AI SDK's `generateObject` with Zod schemas provides the same structured extraction natively, with better streaming support. Instructor adds value if you're using raw provider SDKs without AI SDK.

**Verdict:** Skip. AI SDK 6 covers this use case natively.

---

### LangChain.js (langchain)

| Metric               | Value                                       |
| -------------------- | ------------------------------------------- |
| GitHub               | https://github.com/langchain-ai/langchainjs |
| Stars                | ~17.3K                                      |
| NPM Weekly Downloads | ~1M                                         |
| License              | MIT                                         |
| Bundle Size          | ~101.2 kB gzipped                           |
| Pricing              | Free, open source                           |

**What it does:** Port of the Python LangChain framework. Chains, agents, tools, memory, RAG, document loaders, vector stores. Comprehensive but heavy.

**Pros:**

- Most comprehensive framework for complex agent workflows and RAG
- Runnable interface with built-in batch parallelism for LLM calls
- Huge ecosystem of integrations

**Cons:**

- Heavy bundle size (101.2 kB gzipped), blocks edge runtime deployment
- "Powerful but sometimes overly complex" for straightforward use cases
- Multiple abstractions for simple workflows feel excessive
- TypeScript types lag behind Python version

**Fit for Clinivise:** Overkill. We're not building RAG pipelines or multi-agent systems in Phase 1. Our AI use cases (auth letter parsing, session note generation) are single-step structured extraction and generation. AI SDK handles these better with lower complexity.

**Verdict:** Skip for Phase 1. Revisit only if Phase 2 billing requires complex multi-step AI workflows.

---

### Mastra (mastra)

| Metric               | Value                               |
| -------------------- | ----------------------------------- |
| GitHub               | https://github.com/mastra-ai/mastra |
| Stars                | ~22K                                |
| NPM Weekly Downloads | ~300K+                              |
| License              | Elastic License 2.0                 |
| Latest Version       | 1.0 (Jan 2026)                      |
| Pricing              | Free, open source (EL2.0)           |

**What it does:** TypeScript-native AI agent framework from the Gatsby team. YC-backed. Includes agents, RAG pipelines, workflows, built-in observability. Builds on top of Vercel AI SDK for model interaction.

**Key features:**

- `requestContextSchema` (Zod) for runtime validation of agent context
- Clean agent abstraction with model routing
- Integrates with Inngest for workflow orchestration
- Studio UX for debugging

**Fit for Clinivise:** Interesting but premature. It layers on top of AI SDK, so it adds complexity without proportional benefit for our current use cases. Worth watching for Phase 2+ when we might need more sophisticated agent workflows (e.g., automated denial management).

**Verdict:** Watch. Don't adopt yet.

---

## 2. Document Processing Libraries

### pdf-parse

| Metric           | Value                                   |
| ---------------- | --------------------------------------- |
| NPM              | https://www.npmjs.com/package/pdf-parse |
| Weekly Downloads | ~2.5M+                                  |
| Latest Version   | 2.4.5                                   |
| Last Updated     | ~4 months ago                           |
| License          | MIT                                     |
| Pricing          | Free, open source                       |

**What it does:** Pure TypeScript, cross-platform PDF text extraction. Works in Node.js, browsers, serverless (Vercel, AWS Lambda, Cloudflare Workers). Extracts text content from PDFs.

**Fit for Clinivise:** Good for simple authorization letter text extraction. For clean, typed PDFs, this is all you need before sending text to an LLM for structured parsing.

**Limitations:** No OCR. Scanned PDFs return empty text. No table structure preservation.

**Verdict:** Use for Phase 1 auth letter parsing (most auth letters are typed PDFs).

---

### Tesseract.js

| Metric               | Value                                  |
| -------------------- | -------------------------------------- |
| GitHub               | https://github.com/naptha/tesseract.js |
| Stars                | ~37.5K                                 |
| NPM Weekly Downloads | ~431K                                  |
| License              | Apache-2.0                             |
| Pricing              | Free, open source                      |

**What it does:** Pure JavaScript OCR engine. Runs in browser and Node.js. Supports 100+ languages. Wraps the Tesseract OCR engine via WebAssembly.

**Pros:** Free, no API costs, runs locally, no data leaves the server
**Cons:** Struggles with complex layouts and handwritten text. No table extraction. Accuracy depends heavily on image quality and preprocessing. Not as accurate as cloud OCR services.

**Fit for Clinivise:** Fallback for scanned auth letters that pdf-parse can't handle. Acceptable for Phase 1 prototyping where accuracy doesn't need to be production-grade.

**Verdict:** Add as a fallback for scanned documents. Consider upgrading to Amazon Textract for production.

---

### Amazon Textract

| Metric  | Value                                                               |
| ------- | ------------------------------------------------------------------- |
| Service | AWS Textract API                                                    |
| SDK     | @aws-sdk/client-textract                                            |
| Pricing | Pay-per-page ($1.50/1000 pages for text, $50/1000 for forms/tables) |
| HIPAA   | Yes (BAA available)                                                 |

**What it does:** Cloud OCR with structured data extraction. Handles forms, tables, handwriting. 95-99% accuracy on printed documents. Marginally better than Tesseract on handwritten text.

**Pros:** High accuracy, table/form extraction, HIPAA-eligible, integrates with AWS (we'll be on Bedrock anyway)
**Cons:** Pay-per-page, requires AWS infrastructure, adds network latency

**Fit for Clinivise:** Ideal for production Phase 2 when processing real insurance documents at scale. Since we're already planning Bedrock for AI, adding Textract is natural.

**Verdict:** Plan for Phase 2 production. Use pdf-parse + Tesseract.js for Phase 1.

---

### Reducto

| Metric  | Value                              |
| ------- | ---------------------------------- |
| Website | https://reducto.ai                 |
| Pricing | $0.015/page starting, credit-based |
| HIPAA   | Yes (SOC2, HIPAA, BAA available)   |
| YC      | Yes                                |

**What it does:** AI-powered document parsing API. 99.24% extraction accuracy on clinical documents. FHIR/HL7 mapping. Prior authorization document processing.

**Fit for Clinivise:** Extremely relevant for healthcare document processing. HIPAA-compliant, high accuracy on clinical docs, prior auth parsing is literally our use case. But adds a vendor dependency and per-page cost.

**Verdict:** Strong candidate for Phase 2 production document processing, especially for prior auth workflows. Evaluate against Textract + LLM approach.

---

### LlamaParse / Unstructured / Docling

| Tool         | Stars          | License                 | Best For                                |
| ------------ | -------------- | ----------------------- | --------------------------------------- |
| LlamaParse   | N/A (API)      | Freemium                | Speed (~6s/doc), structure preservation |
| Unstructured | N/A (Platform) | Apache-2.0 / Enterprise | Enterprise pipelines, SOC2/HIPAA        |
| Docling      | ~37K           | MIT                     | Free, multi-format, IBM-backed          |

**LlamaParse:** Fast, good at maintaining document structure. Best for financial reports and contracts. API-based.

**Unstructured:** Enterprise-grade, SOC 2 Type II and HIPAA-compliant, in-VPC deployment options. Strong OCR but only 75% accuracy on complex table structures. Heavy infrastructure.

**Docling (IBM):** Open source under MIT. Parses PDF, DOCX, PPTX, XLSX, HTML, images, LaTeX, and more. Python-based (not native JS/TS). Over 37K GitHub stars. Good quality but requires running a Python service.

**Fit for Clinivise:** These are all heavier than we need for Phase 1. Our auth letters are relatively simple documents. pdf-parse + LLM structured extraction handles this.

**Verdict:** Skip for now. Revisit if document complexity exceeds what pdf-parse + LLM can handle.

---

## 3. Speech-to-Text Libraries

### AssemblyAI -- RECOMMENDED for Healthcare

| Metric        | Value                                              |
| ------------- | -------------------------------------------------- |
| NPM Package   | assemblyai                                         |
| SDK Language  | TypeScript (native)                                |
| HIPAA         | Yes (BAA available, SOC2 Type 2, ISO 27001)        |
| Pricing       | $0.15/hr (Universal-2), $0.21/hr (Universal-3-Pro) |
| PII Redaction | Built-in, 30+ entity types                         |

**What it does:** Speech-to-text API with speaker diarization, PII redaction, sentiment analysis, and AI-powered analysis features. TypeScript SDK for Node.js.

**Key healthcare features:**

- HIPAA-compliant with BAA
- PII redaction for medical record numbers, SSNs, PHI
- Speaker diarization (therapist vs client)
- Slam-1 speech-language model (released Oct 2025)
- Safety guardrails
- Multilingual streaming (6 languages)

**Fit for Clinivise:** Best overall fit for session note transcription. HIPAA-compliant, TypeScript native, affordable. PII redaction is critical for ABA sessions with children.

**Verdict:** Primary STT provider for Phase 2 session transcription feature.

---

### Deepgram

| Metric        | Value                                 |
| ------------- | ------------------------------------- |
| Website       | https://deepgram.com                  |
| Medical Model | Nova-3 Medical                        |
| HIPAA         | Yes (BAA, VPC deployment options)     |
| Pricing       | ~$0.0077/min pay-as-you-go ($0.46/hr) |
| Latency       | Sub-300ms streaming                   |

**What it does:** AI speech-to-text with medical-specific model. Nova-3 Medical has 63.7% better WER than next-best competitor on clinical audio. Pretrained on millions of medical conversations.

**Key advantages:**

- Nova-3 Medical: understands pharmaceutical names, clinical shorthand, regulatory language
- 40% better on medical keyterm error rate vs competitors
- Sub-300ms latency for real-time streaming
- VPC and on-prem deployment options
- HIPAA-compliant

**Fit for Clinivise:** Best for medical vocabulary accuracy. More expensive than AssemblyAI but better at clinical terminology. Real-time streaming is excellent for live session transcription.

**Verdict:** Strong alternative to AssemblyAI. Consider if medical term accuracy proves critical in testing.

---

### OpenAI Whisper API

| Metric   | Value                  |
| -------- | ---------------------- |
| Provider | OpenAI                 |
| Pricing  | $0.006/min (~$0.36/hr) |
| HIPAA    | No BAA available       |

**What it does:** General-purpose speech recognition. Good accuracy on clean audio.

**CRITICAL WARNING:** Researchers found Whisper is "prone to hallucinations" -- fabricating sentences with racial/violent rhetoric and imagined medical treatments. OpenAI explicitly warns against use in "high-risk domains" and "decision-making contexts."

**Fit for Clinivise:** NOT suitable for healthcare. No BAA, hallucination risk with clinical audio, OpenAI's own warning against high-risk use. Despite being cheap, the liability exposure is too high.

**Verdict:** Do not use for clinical transcription.

---

### Speechmatics

| Metric        | Value                                               |
| ------------- | --------------------------------------------------- |
| Medical Model | Medical Speech-to-Text (Sep 2025)                   |
| Accuracy      | 93% general, 4% Keyword Error Rate on medical terms |
| Languages     | 55 languages, 7 with medical models                 |
| HIPAA         | Enterprise plans                                    |

**What it does:** Medical-grade STT with 93% accuracy and 50% fewer errors on medical terms vs peers. Real-time speaker diarization for clinicians/patients/family. Supports telehealth, EHR scribes, bedside tools.

**Fit for Clinivise:** Premium medical STT option. Higher accuracy on medical terminology than AssemblyAI or Deepgram on general benchmarks. Worth evaluating if session transcription accuracy is a differentiator.

**Verdict:** Evaluate alongside AssemblyAI and Deepgram when building Phase 2 transcription.

---

### Web Speech API (Browser Native)

| Metric   | Value                                    |
| -------- | ---------------------------------------- |
| Cost     | Free                                     |
| Accuracy | Low-moderate                             |
| HIPAA    | No (sends audio to Google/Apple servers) |

**What it does:** Browser-native speech recognition. Free, zero dependencies, works offline in some browsers.

**Fit for Clinivise:** Not suitable. Audio gets sent to third-party servers (no HIPAA compliance), inconsistent across browsers, no medical vocabulary, no speaker diarization, no PII redaction.

**Verdict:** Do not use.

---

## 4. AI Agent & Background Job Frameworks

### Inngest -- RECOMMENDED

| Metric             | Value                                |
| ------------------ | ------------------------------------ |
| GitHub             | https://github.com/inngest/inngest   |
| Stars              | ~4.8K                                |
| License            | Source-available (not self-hostable) |
| Vercel Integration | First-class (Marketplace)            |
| Free Tier          | 100K executions/month (via Vercel)   |
| Paid               | $75/mo Pro (1M executions)           |

**What it does:** Event-driven, durable workflow engine. Runs on your existing serverless platform. Deploy Inngest functions alongside your Next.js app on Vercel. Handles retries, recovery, concurrency, throttling, rate limiting, debouncing, and batching.

**AI-specific features:**

- AgentKit for agentic orchestration (early access)
- `step.ai` for AI model calls with production-ready infrastructure
- `useAgent` React hook for streaming real-time updates from durable AI workflows
- Built-in observability for AI calls
- 100M+ daily executions at scale

**Key architecture:** Runs ON your Vercel serverless functions. No separate worker to deploy. Inngest calls your HTTP endpoints when events occur. Vercel integration handles registration automatically on deploy.

**Fit for Clinivise:** Excellent. Auth letter processing, session note generation, and future billing workflows all need durable background execution with retries. Inngest's serverless-native model fits perfectly with our Vercel deployment. The free tier (100K/month) is generous for Phase 1.

**Limitations:** Not self-hostable. The orchestration engine is cloud-only.

**Verdict:** Primary background job infrastructure. Use for all async AI processing.

---

### Trigger.dev

| Metric    | Value                                        |
| --------- | -------------------------------------------- |
| GitHub    | https://github.com/triggerdotdev/trigger.dev |
| Stars     | ~13.7K                                       |
| License   | Apache-2.0 (self-hostable)                   |
| Free Tier | $5/month free usage                          |
| Pricing   | Usage-based compute ($0.0000169/sec micro)   |

**What it does:** Background jobs platform with dedicated compute (not serverless). No timeout limits. Tasks can run minutes to hours. Built for AI agent workloads with retries, scheduling, and observability.

**Key difference from Inngest:** Trigger.dev runs on dedicated compute (separate from your app). Inngest runs on your existing serverless platform. Trigger.dev's approach means no timeout limits but requires managing a separate deployment.

**Fit for Clinivise:** Good alternative to Inngest, especially for long-running AI tasks (document processing, batch transcription). Self-hostable is a plus for healthcare. But adds deployment complexity vs Inngest's seamless Vercel integration.

**Verdict:** Strong Plan B if Inngest's limitations (not self-hostable, dependent on their cloud) become blockers. Better for compute-intensive tasks that exceed Vercel function timeouts.

---

### Claude Agent SDK (@anthropic-ai/claude-agent-sdk)

| Metric  | Value                                                     |
| ------- | --------------------------------------------------------- |
| GitHub  | https://github.com/anthropics/claude-agent-sdk-typescript |
| NPM     | @anthropic-ai/claude-agent-sdk                            |
| Latest  | v0.2.81                                                   |
| License | MIT                                                       |
| Pricing | Free SDK; pay per Claude API call                         |

**What it does:** Programmatic access to Claude Code's capabilities. Agents can understand codebases, edit files, run commands, execute complex workflows. V2 interface (preview) simplifies multi-turn conversations.

**Features:** Bash, Read, Edit tools; session forking; task progress events; 1M context window (beta).

**Fit for Clinivise:** This is for building coding agents, not healthcare workflows. Not relevant to our use case.

**Verdict:** Not applicable.

---

## 5. Prediction/ML Libraries

### LLM-Based Prediction vs Traditional ML

**Research finding:** For healthcare claim denial prediction, LLMs are increasingly preferred over traditional ML:

- NYUTron (NYU research) demonstrated that sufficiently scaled, self-supervised LLMs outperform strongly supervised approaches on insurance claim denial prediction
- LLMs handle unstructured inputs (clinical notes, denial reasons) better than feature-engineered ML models
- No need to maintain separate ML training pipelines

**JavaScript ML libraries (TensorFlow.js, Brain.js, ml5.js):**

- TensorFlow.js: powerful but heavy, requires ML expertise, training data pipelines
- Brain.js: simple neural networks, not suited for complex healthcare prediction
- ml5.js: educational, not production-ready

**Recommendation for Clinivise:** Use LLM-based approaches for predictions (denial risk scoring, auth utilization forecasting). Feed structured data to Claude/GPT via AI SDK's `generateObject` and get back typed predictions. This avoids the complexity of training/maintaining ML models and leverages the LLM's understanding of healthcare context.

**Verdict:** Skip traditional ML libraries. Use LLM-based prediction via AI SDK.

---

## 6. AI Infrastructure & Observability

### Langfuse -- RECOMMENDED (Self-Hostable)

| Metric        | Value                                      |
| ------------- | ------------------------------------------ |
| GitHub        | https://github.com/langfuse/langfuse       |
| Stars         | ~20K+                                      |
| License       | MIT                                        |
| Self-Hostable | Yes (Docker Compose, Helm, VM)             |
| Free Tier     | Self-hosted unlimited; Cloud 50K events/mo |
| Pricing       | Self-hosted free; Cloud from $50/mo        |

**What it does:** Open source LLM engineering platform. Tracing, prompt management, evaluations, datasets, playground. OpenTelemetry compatible.

**Key advantages:**

- Fully MIT-licensed, self-hostable (critical for HIPAA)
- All features available in self-hosted version (no feature gating)
- PostgreSQL + ClickHouse backend
- Integrates with Vercel AI SDK, LangChain, OpenAI SDK
- Prompt versioning and management
- Series A-backed, actively maintained

**Fit for Clinivise:** Best option for us. Self-hosting means PHI never leaves our infrastructure. MIT license means no vendor lock-in. Can self-host on our AWS account (where Bedrock runs) for a cohesive HIPAA-compliant setup.

---

### Helicone

| Metric    | Value                                    |
| --------- | ---------------------------------------- |
| GitHub    | https://github.com/Helicone/helicone     |
| License   | Apache-2.0                               |
| Free Tier | 10K requests/mo (or 100K via some plans) |
| Pricing   | From $20/seat/mo                         |

**What it does:** LLM observability platform. One-line proxy integration (change base URL). Cloudflare Workers + ClickHouse architecture. Built-in caching (20-30% cost reduction), analytics, cost tracking.

**Pros:** Easiest setup (one line change), great caching, low latency (50-80ms overhead)
**Cons:** Lacks deep evaluation features, not self-hostable for full stack

**Fit for Clinivise:** Good for cost tracking and caching during development. But for production with PHI, self-hosted Langfuse is safer.

**Verdict:** Consider for development/staging. Not for production with PHI.

---

### Portkey AI Gateway

| Metric   | Value                                 |
| -------- | ------------------------------------- |
| GitHub   | https://github.com/Portkey-AI/gateway |
| License  | MIT                                   |
| Built In | TypeScript                            |
| Pricing  | Dev free; Pro paid                    |

**What it does:** AI gateway for routing to 1600+ models. Caching (simple and semantic), fallbacks, retries, load balancing, timeouts. Written in TypeScript.

**Key features:**

- Automatic fallbacks between providers (e.g., Claude -> GPT if Claude is down)
- Semantic caching for repeated queries
- Request routing and load balancing
- Edge-deployable

**Fit for Clinivise:** Useful when we have multiple LLM providers and need reliability. For Phase 1 with a single provider, it's overkill. For production with Bedrock + fallback providers, it adds real value.

**Verdict:** Plan for Phase 2 production. Not needed yet.

---

### Promptfoo

| Metric        | Value                                           |
| ------------- | ----------------------------------------------- |
| GitHub        | https://github.com/promptfoo/promptfoo          |
| Stars         | High (300K+ developers, 127 Fortune 500)        |
| License       | MIT                                             |
| NPM Downloads | 1.6M+                                           |
| Pricing       | Free, open source (acquired by OpenAI Mar 2026) |
| Language      | TypeScript (96.6%)                              |

**What it does:** CLI and library for evaluating and red-teaming LLM apps. Compare model outputs, test prompt quality, scan for 50+ vulnerability types. Runs locally.

**Key features:**

- Prompt evaluation (side-by-side comparison across models)
- Red teaming (50+ attack plugins)
- LLM-as-a-judge scoring
- Custom TypeScript evaluators
- CI/CD integration
- Runs entirely locally (privacy)

**Fit for Clinivise:** Excellent for testing auth letter parsing prompts, session note generation quality, and ensuring AI outputs are safe. Run locally so no PHI exposure.

**Verdict:** Adopt for AI quality assurance. Use to test prompts before deployment.

---

### Braintrust

| Metric       | Value                                    |
| ------------ | ---------------------------------------- |
| Website      | https://www.braintrust.dev               |
| License      | Proprietary (cloud platform)             |
| Integrations | Vercel AI SDK, OpenAI, Mastra, LangChain |

**What it does:** AI observability platform with evals, prompt management, monitoring. AutoEvals library for automated quality scoring. "Loop" AI agent auto-generates eval datasets.

**Fit for Clinivise:** Good features but cloud-based (PHI concern). Promptfoo + Langfuse cover the same ground with self-hosted options.

**Verdict:** Skip in favor of Langfuse + Promptfoo.

---

## 7. Healthcare-Specific AI

### Medplum (FHIR Platform)

| Metric  | Value                                  |
| ------- | -------------------------------------- |
| GitHub  | https://github.com/medplum/medplum     |
| License | Apache-2.0                             |
| Latest  | v5                                     |
| Pricing | Open source; managed hosting available |

**What it does:** Open-source, FHIR-compliant healthcare platform. API for clinical data, React components, Bot framework for workflows. v5 added AI capabilities with MCP server support and custom FHIR operations.

**AI features:**

- `$ai` FHIR operation for LLM integration
- MCP server for AI model access to healthcare data
- AuditEvent logging for all AI agent actions
- Same RBAC policies for AI agents as human users

**Fit for Clinivise:** We're not building on FHIR for Phase 1 (custom schema is simpler for ABA). But Medplum's patterns for AI + healthcare (audit logging, RBAC for AI agents) are worth studying. If we ever need FHIR interoperability (insurance integrations, health system connections), Medplum becomes relevant.

**Verdict:** Reference architecture. Don't adopt the platform, but study their AI governance patterns.

---

### Healthcare NLP (Clinical NER, CPT Extraction)

**Key finding:** There are NO mature JavaScript/TypeScript libraries for clinical NLP. The dominant solutions are:

- **John Snow Labs / Spark NLP Healthcare:** 2,500+ pretrained models for ICD-10, CPT, SNOMED, RxNorm extraction. Python/Scala only. Enterprise licensed.
- **Commercial AI coding platforms:** Combine Health, Sully AI, etc. Full platforms, not libraries. 95%+ accuracy on code extraction.

**JavaScript gap:** Clinical NER and CPT code extraction do not have viable JS/TS libraries. The ecosystem is Python-dominated.

**Practical approach for Clinivise:**

1. Use LLMs (Claude) for CPT code extraction from session notes. Claude already understands ABA billing codes (97151-97158, 0362T-0374T).
2. Validate LLM-extracted codes against a local lookup table of valid ABA CPT codes.
3. Use structured output (AI SDK `generateObject`) to get typed, validated code suggestions.
4. Keep a `cpt_codes` reference table in the database for validation.

This approach avoids Python dependencies and leverages tools already in our stack.

**Verdict:** Use LLM-based extraction via AI SDK. No additional library needed.

---

### Reducto (Healthcare Document Processing)

Already covered in Document Processing section. Key healthcare facts:

- 99.24% accuracy on clinical documents
- HIPAA/SOC2/BAA compliant
- FHIR/HL7 mapping, Epic/Cerner interop
- Prior authorization document processing is a core use case
- $0.015/page starting

**Verdict:** Strong Phase 2 candidate for production auth document processing.

---

## 8. Recommendations for Clinivise

### Phase 1 (Now) -- Core AI Stack

| Layer                 | Library                          | Why                                                                                                              |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **LLM Integration**   | Vercel AI SDK 6 (`ai`)           | Unified API, structured output with Zod, streaming, Agent abstraction, Bedrock provider for production migration |
| **Structured Output** | AI SDK `generateObject` + Zod v4 | Native in AI SDK 6, no extra library needed. Type-safe extraction for auth letters, session notes                |
| **PDF Extraction**    | `pdf-parse`                      | 2.5M weekly downloads, works on Vercel, handles typed PDFs                                                       |
| **OCR Fallback**      | `tesseract.js`                   | Free, no API costs, handles scanned auth letters                                                                 |
| **Background Jobs**   | Inngest                          | Durable workflows, Vercel-native, 100K free executions/month, retries and observability built-in                 |
| **Prompt Testing**    | `promptfoo`                      | Test auth letter prompts, compare models, runs locally (no PHI exposure)                                         |
| **LLM Observability** | Langfuse (self-hosted)           | MIT, full self-hosting, prompt management, tracing. Deploy on AWS alongside Bedrock                              |

### Phase 2 (Production) -- Additions

| Layer                   | Library                                  | Why                                                                                                           |
| ----------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **LLM Provider**        | AWS Bedrock via `@ai-sdk/amazon-bedrock` | HIPAA-eligible Claude access. One-line provider swap from direct Anthropic                                    |
| **Document Processing** | Amazon Textract OR Reducto               | Production OCR + form extraction. Textract if staying AWS-native, Reducto if prior auth accuracy is paramount |
| **Speech-to-Text**      | AssemblyAI                               | HIPAA/BAA, TypeScript SDK, PII redaction, speaker diarization, $0.15-0.21/hr                                  |
| **AI Gateway**          | Portkey                                  | Provider fallbacks, caching, load balancing when running multiple AI services                                 |
| **Denial Prediction**   | LLM-based via AI SDK                     | No traditional ML needed. Use Claude with structured output for risk scoring                                  |

### What to Avoid

| Library                  | Reason                                                                                          |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| LangChain.js             | Overkill for our use cases. Heavy bundle, excessive abstraction for single-step AI tasks        |
| Instructor JS            | AI SDK 6 provides native structured output. Redundant                                           |
| OpenAI Whisper           | Hallucination risk in medical contexts. No BAA. OpenAI warns against healthcare use             |
| Web Speech API           | Audio sent to Google/Apple. No HIPAA compliance                                                 |
| TensorFlow.js / Brain.js | Traditional ML is unnecessary when LLMs handle prediction tasks better with less infrastructure |
| Mastra                   | Adds abstraction on top of AI SDK without proportional benefit for Phase 1                      |
| Claude Agent SDK         | Built for coding agents, not healthcare workflows                                               |

### Architecture Pattern

```
User Action (e.g., upload auth letter)
  -> Next.js API route / Server Action
  -> Inngest event (durable background job)
    -> pdf-parse (extract text)
    -> AI SDK generateObject + Zod schema (structured extraction)
    -> Langfuse trace (observability)
    -> Save to Neon DB
  -> Revalidate UI
```

### Cost Estimate (Phase 1, ~100 AI calls/day)

| Service                       | Monthly Cost                    |
| ----------------------------- | ------------------------------- |
| Anthropic Claude API (direct) | ~$30-50                         |
| Inngest                       | Free (100K executions/mo)       |
| Langfuse (self-hosted)        | Free (infrastructure cost only) |
| pdf-parse + Tesseract.js      | Free                            |
| Promptfoo                     | Free                            |
| **Total**                     | **~$30-50/mo**                  |

---

## Sources

- [AI SDK 6 - Vercel Blog](https://vercel.com/blog/ai-sdk-6)
- [AI SDK Documentation](https://ai-sdk.dev/docs/introduction)
- [Anthropic SDK TypeScript - GitHub](https://github.com/anthropics/anthropic-sdk-typescript)
- [Claude Structured Outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Instructor JS - GitHub](https://github.com/567-labs/instructor-js)
- [Top 5 Structured Output Libraries for LLMs in 2026](https://dev.to/nebulagg/top-5-structured-output-libraries-for-llms-in-2026-48g0)
- [LangChain vs Vercel AI SDK vs OpenAI SDK: 2026 Guide](https://strapi.io/blog/langchain-vs-vercel-ai-sdk-vs-openai-sdk-comparison-guide)
- [Mastra - GitHub](https://github.com/mastra-ai/mastra)
- [Top 5 TypeScript AI Agent Frameworks 2026](https://dev.to/ialijr/top-5-typescript-ai-agent-frameworks-you-should-know-in-2026-139c)
- [pdf-parse - npm](https://www.npmjs.com/package/pdf-parse)
- [7 PDF Parsing Libraries for Node.js](https://strapi.io/blog/7-best-javascript-pdf-parsing-libraries-nodejs-2025)
- [Tesseract.js - GitHub](https://github.com/naptha/tesseract.js/)
- [Amazon Textract vs Tesseract OCR](https://towardsdatascience.com/compare-amazon-textract-with-tesseract-ocr-ocr-nlp-use-case-43ad7cd48748/)
- [LlamaParse vs Unstructured Comparison](https://llms.reducto.ai/document-parser-comparison)
- [Docling - GitHub](https://github.com/docling-project/docling)
- [Reducto](https://reducto.ai/)
- [AssemblyAI Medical](https://www.assemblyai.com/solutions/medical)
- [AssemblyAI BAA](https://www.assemblyai.com/docs/faq/can-you-sign-a-baa)
- [Deepgram Nova-3 Medical](https://deepgram.com/learn/introducing-nova-3-medical-speech-to-text-api)
- [Deepgram Pricing](https://deepgram.com/pricing)
- [OpenAI Whisper Healthcare Concerns](https://www.healthcareitnews.com/news/openais-general-purpose-speech-recognition-model-flawed-researchers-say)
- [Speechmatics Medical Model](https://www.speechmatics.com/company/articles-and-news/speechmatics-sets-record-in-medical-speech-to-text-with-93-percent-accuracy)
- [Inngest - GitHub](https://github.com/inngest/inngest)
- [Inngest for Vercel](https://vercel.com/marketplace/inngest)
- [Trigger.dev - GitHub](https://github.com/triggerdotdev/trigger.dev)
- [Claude Agent SDK - GitHub](https://github.com/anthropics/claude-agent-sdk-typescript)
- [Langfuse - GitHub](https://github.com/langfuse/langfuse)
- [Helicone - GitHub](https://github.com/Helicone/helicone)
- [Portkey AI Gateway - GitHub](https://github.com/Portkey-AI/gateway)
- [Promptfoo - GitHub](https://github.com/promptfoo/promptfoo)
- [Braintrust](https://www.braintrust.dev)
- [Medplum AI Docs](https://www.medplum.com/docs/ai)
- [Medplum - GitHub](https://github.com/medplum/medplum)
- [NYUTron: LLM for Insurance Claim Denial Prediction](https://pmc.ncbi.nlm.nih.gov/articles/PMC10338337/)
- [AI in Medical Billing & Coding 2026](https://swiftcarebilling.com/ai-in-medical-billing-and-coding/)
- [AI SDK Amazon Bedrock Provider](https://ai-sdk.dev/providers/ai-sdk-providers/amazon-bedrock)
- [Inngest vs Trigger.dev Comparison](https://www.hashbuilds.com/articles/next-js-background-jobs-inngest-vs-trigger-dev-vs-vercel-cron)
- [Helicone vs Langfuse Comparison](https://www.helicone.ai/blog/the-complete-guide-to-LLM-observability-platforms)
- [Best LLM Observability Tools 2026](https://www.firecrawl.dev/blog/best-llm-observability-tools)
