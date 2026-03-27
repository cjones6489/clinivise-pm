---
name: research
description: Focused 3-agent research for a feature or topic. Competitor patterns, technical docs + pitfalls, and frontier UX. Returns findings inline, no document created. Use /quick-research for a 1-2 minute scan, or /deep-research for full 7-agent investigation with saved document.
allowed-tools: Read, Grep, Glob, Agent, WebFetch, WebSearch, mcp__context7__resolve-library-id, mcp__context7__query-docs
argument-hint: [feature or topic to research]
model: opus
user-invocable: true
---

Perform a focused research pass on the following topic:

$ARGUMENTS

You are researching this topic to inform a design decision for Clinivise — an AI-native ABA therapy practice management platform targeting small practices (1-50 staff). Free PM tool, monetized via 2-4% of collected revenue on billing. The goal is to understand the landscape deeply enough to build something that outclasses CentralReach on UX and outpaces competitors on AI-native capabilities.

## Research approach

Launch 3 agents in parallel with clearly separated responsibilities:

### Agent 1: Competitor & Platform Patterns

Research how competitors and adjacent platforms implement this feature or solve this problem.

Focus on:

- **ABA competitors**: CentralReach, AlohaABA, Theralytics, RethinkBH, Motivity, Raven Health, Alpaca Health, Catalyst, Hi Rasmus
- **Adjacent healthcare PM**: SimplePractice, Jane App, Healthie, Elation Health, Tebra/Kareo
- **Adjacent AI healthcare**: Abridge, Suki, Freed AI, Waystar, Notable Health, Cohere Health
- **Design-leading SaaS**: Linear, Mercury, Stripe, Vercel, Ramp, Notion (for UX patterns)
- **Recent YC companies** building in healthcare/ABA/billing spaces

For each relevant implementation found:

- What's their data model and workflow for this feature?
- What's the user experience like (UX)? Which persona does it serve?
- What works well? What's broken, confusing, or over-engineered?
- Are there known bugs, user complaints, or community frustrations?
- What would we do differently?

Use WebSearch extensively. Prioritize 2025-2026 sources.

### Agent 2: Technical Docs, Open Source & Known Pitfalls

Research the technical foundations — libraries, protocols, standards, open-source implementations, and constraints that affect implementation.

Focus on:

- Official docs for any libraries/frameworks/APIs involved
- Use Context7 for current documentation on relevant packages
- **Open-source repos** that implement this feature or solve similar problems well
- Known bugs, breaking changes, version-specific gotchas
- ABA-specific regulations (CPT codes, CMS rules, BACB requirements, payer policies)
- HIPAA considerations if the feature touches PHI

For each relevant open-source repo found:

- Repo name, URL, stars, last activity
- What design pattern they use
- What they got right vs wrong

For each pitfall/constraint found:

- What's the constraint or pitfall?
- How should we design around it?

### Agent 3: Frontier Patterns & Best UX

Research bleeding-edge approaches and the best user experiences for this feature.

Focus on:

- Novel approaches from recent startups or open-source projects
- The cleanest user experiences for this feature — who has the best UX and why?
- AI-native approaches that automate or simplify the workflow
- Accessibility patterns for healthcare workers (tablet field use, touch targets, offline)

For each pattern:

- Who's doing it and since when?
- Maturity: production-proven / early-adopter / experimental
- Whether to adopt now, design for later, or just watch

## What to deliver

After all agents return, synthesize findings into a structured response with these sections:

### How others do it

Concise comparison table of the most relevant implementations. Include data model, UX approach, and notable design choices.

### Open-source references

Table of the most relevant repos with: name, URL, stars, what pattern to study.

### Known pitfalls and regulatory constraints

Specific issues, gotchas, compliance requirements, and failure modes. For each: what goes wrong and how to avoid it.

### Best UX patterns

The cleanest user experiences found. What makes them good and what we should steal. Consider all personas (RBT on tablet, BCBA on laptop, billing staff on desktop).

### Frontier approaches

Emerging patterns worth considering. Clearly separate production-proven from experimental.

### Recommended design direction

Concrete recommendation for Clinivise specifically:

- Suggested data model / architecture
- UX design / interaction pattern
- AI integration opportunity (if applicable)
- What to build now vs. defer
- What to explicitly avoid

### Open questions

Anything uncertain that needs validation before implementation.

### Decision points

If the research surfaced trade-offs, ambiguities, or forks that need your input before planning, list them as specific questions. Examples:

- "Competitors split on X vs Y — which fits our Phase 1 scope?"
- "This feature has a simpler version (A) and a richer version (B) — which do we want?"
- "The regulatory landscape is unclear on X — do we take the conservative or aggressive approach?"
- "Which personas need access to this? That changes the UI complexity significantly."

Only ask questions where the answer materially changes the architecture or scope. Skip this section if the path forward is clear.

### Depth check

End with one of these verdicts:

- **Sufficient for planning** — enough context to enter plan mode and `/plan-review`. No deeper research needed.
- **Recommend `/deep-research`** — this topic has strategic implications, novel architecture, high regulatory risk, or enough complexity that the full 7-agent investigation with a saved document would materially improve the implementation. Explain what specifically remains uncertain and why the extra depth matters.

## Research standards

- Prefer 2025-2026 sources. Flag anything older than 2024 as potentially stale.
- Every claim should be traceable to a source. Include URLs inline.
- Distinguish between established best practice, emerging patterns, and hype.
- Be skeptical of unnecessary complexity. Simpler is better unless complexity is clearly justified.
- Do NOT produce a separate research document. Return findings directly in the conversation.
- Keep it concise — tables over paragraphs, bullets over prose.
