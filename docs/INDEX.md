# Clinivise Documentation

Central index of all project documentation.

---

## Project

| Document           | Location                      | Description                                          |
| ------------------ | ----------------------------- | ---------------------------------------------------- |
| Project Overview   | [`CLAUDE.md`](../CLAUDE.md)   | Tech stack, architecture, constraints, phase context |
| Agent Instructions | [`AGENTS.md`](../AGENTS.md)   | AI coding assistant behavioral rules                 |
| Working Roadmap    | [`ROADMAP.md`](../ROADMAP.md) | Phase 1 task breakdown with status tracking          |

## Specs

| Document                 | Location                                                         | Description                                                                                                                                                            |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Engineering Spec         | [`specs/engineering-spec.md`](specs/engineering-spec.md)         | Full DB schema (12 tables), config files, file structure, task breakdown                                                                                               |
| Research Spec            | [`specs/research-spec.md`](specs/research-spec.md)               | Technology decisions, pricing model, ABA billing codes, HIPAA analysis, competitor research                                                                            |
| **Competitive Strategy** | [`specs/competitive-strategy.md`](specs/competitive-strategy.md) | 7 strategic moves, competitor exploit map (CentralReach/AlohaABA/Theralytics/Raven Health), positioning by persona, success metrics by phase, what we don't compete on |

## Research

| Document                                     | Location                                                                                                             | Description                                                                                                                                                                                                                                                                                        |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PM/EHR Architecture                          | [`research/deep-research-pm-ehr.md`](research/deep-research-pm-ehr.md)                                               | Multi-agent deep dive: multi-tenancy, auth tracking, claims lifecycle, HIPAA, competitor analysis, frontier patterns, 32-item risk matrix                                                                                                                                                          |
| UI/UX Design                                 | [`research/deep-research-ui-ux.md`](research/deep-research-ui-ux.md)                                                 | 6-agent deep dive: ABA competitor UX analysis, open source references, healthcare UI standards, architecture patterns, frontier/emerging trends, 48-item risk matrix                                                                                                                               |
| **AI-Native Strategy (Master)**              | [`research/deep-research-ai-native.md`](research/deep-research-ai-native.md)                                         | **6-agent synthesis**: AI architecture, 10 phased AI features, Vercel AI SDK + Bedrock stack, confidence-based routing, progressive autonomy, competitive positioning, risk mitigations                                                                                                            |
| Client Management UX                         | [`research/client-management-ux-research.md`](research/client-management-ux-research.md)                             | Detail page patterns (Linear, Stripe, Notion, EHR), AI-native features (OCR, duplicate detection, NLP search), multi-insurance UX, tablet/field-use patterns, form design, CentralReach competitive gaps                                                                                           |
| Authorization Tracking (Competitive)         | [`research/authorization-tracking-competitive-research.md`](research/authorization-tracking-competitive-research.md) | 8 ABA competitors + 3 adjacent platforms, auth UX patterns, utilization visualization, user complaints, billing error taxonomy, differentiation opportunities                                                                                                                                      |
| Authorization Tracking (UX & AI)             | [`research/authorization-tracking-ux-research.md`](research/authorization-tracking-ux-research.md)                   | Utilization visualization (Stripe/Linear/Mercury patterns), alert fatigue prevention, AI letter parsing, predictive burndown, mobile/tablet UX, authorization lifecycle workflow, component architecture                                                                                           |
| **Authorization Lifecycle Risks**            | [`research/authorization-lifecycle-risk-analysis.md`](research/authorization-lifecycle-risk-analysis.md)             | 22-item risk matrix: OIG audit findings ($198M+ improper payments), race conditions, auth gaps, retroactive auth, split sessions, dual insurance COB, fraud patterns, data integrity, claim validation, architectural mitigations                                                                  |
| **Authorization Lifecycle (Frontier)**       | [`research/authorization-lifecycle-frontier-research.md`](research/authorization-lifecycle-frontier-research.md)     | AI-native auth (Cohere/Waystar/Infinx/Rhyme), auth as platform wedge ($60-170K cost of poor auth), proactive management, value-based care trends, single-pane-of-glass dashboard, workflow automation, stickiness factors, phased build recommendations                                            |
| **Authorization Lifecycle (System-Wide UX)** | [`research/authorization-lifecycle-ux-research.md`](research/authorization-lifecycle-ux-research.md)                 | Auth as infrastructure not a page, 4-tier progressive disclosure model, integration touchpoints (scheduling/session/client/dashboard/claims), auth health score (weighted composite), re-auth workflow checklist, timeline visualization, mobile/tablet patterns, data flow + component reuse maps |

## AI

| Document                     | Location                                                             | Description                                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Competitive Landscape        | [`ai/ai-competitive-landscape.md`](ai/ai-competitive-landscape.md)   | AI features across 15+ ABA competitors, adjacent healthcare AI platforms, insurance/auth automation, billing AI, practitioner sentiment, gap analysis  |
| Libraries & Tools            | [`ai/ai-libraries-research.md`](ai/ai-libraries-research.md)         | 7-category evaluation of AI/LLM SDKs, document processing, STT, agent frameworks, ML, observability, and healthcare-specific tools                     |
| Frontier & Emerging Patterns | [`ai/deep-research-frontier-ai.md`](ai/deep-research-frontier-ai.md) | AI-native healthcare startups, RCM automation, production agent architectures, predictive AI, compliance AI, AI-native design philosophy               |
| Risk & Failure Modes         | [`ai/ai-risk-analysis.md`](ai/ai-risk-analysis.md)                   | 38-item risk matrix: hallucination, FCA liability, PHI exposure, model drift, automation complacency, ABA-specific billing risks                       |
| **Feature Brainstorm**       | [`ai/ai-feature-brainstorm.md`](ai/ai-feature-brainstorm.md)         | **Living doc**: 20 scored AI features + parking lot, ranked by opportunity/novelty/priority, tiered by phase, with data readiness and effort estimates |

## Design

| Document      | Location                                                                                                    | Description                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| UI Wireframes | [`design/clinivise-wireframes.jsx`](design/clinivise-wireframes.jsx)                                        | Interactive React wireframes covering all Phase 1 + Phase 2 screens       |
| Design System | [`.claude/skills/design/references/design-system.md`](../.claude/skills/design/references/design-system.md) | Mira tokens, spacing scale, typography, color tokens, component inventory |

## Rules (AI coding guidelines)

| Document       | Location                                                                | Scope                                                                 |
| -------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Database       | [`.claude/rules/database.md`](../.claude/rules/database.md)             | Drizzle patterns, IDs, multi-tenancy, migrations                      |
| Frontend       | [`.claude/rules/frontend.md`](../.claude/rules/frontend.md)             | Design system, components, typography, forms, data display            |
| Security       | [`.claude/rules/security.md`](../.claude/rules/security.md)             | PHI handling, multi-tenant isolation, auth, HIPAA hardening checklist |
| Server Actions | [`.claude/rules/server-actions.md`](../.claude/rules/server-actions.md) | next-safe-action patterns, input validation, org scoping              |
| Testing        | [`.claude/rules/testing.md`](../.claude/rules/testing.md)               | Vitest + Playwright, test priority, test data, patterns               |

## Config

| File                | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `drizzle.config.ts` | Drizzle Kit — schema path, migration output, Neon connection |
| `next.config.ts`    | Next.js — security headers, image config, server actions     |
| `components.json`   | shadcn/ui — Mira style, import aliases, component paths      |
| `tsconfig.json`     | TypeScript — strict mode, path aliases                       |
| `.env.local`        | Environment variables (git-ignored)                          |
| `.env.example`      | Environment variable template                                |
