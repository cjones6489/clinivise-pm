---
name: quick-research
description: Quick preliminary research before planning a feature. Single-pass web search — how competitors do it, key pitfalls, and a recommended direction. Returns findings inline in ~1-2 minutes. Use /research for a thorough 3-agent pass, or /deep-research for full multi-agent investigation.
allowed-tools: Read, Grep, Glob, WebFetch, WebSearch, mcp__context7__resolve-library-id, mcp__context7__query-docs
argument-hint: [feature or topic to research]
user-invocable: true
---

Quick preliminary research on:

$ARGUMENTS

**Context:** Clinivise is an AI-native ABA therapy practice management platform for small practices (1-50 staff). Stack: Next.js 16, shadcn/ui Mira, Drizzle ORM, Clerk, TanStack Query/Table.

## Instructions

Do this yourself in a single pass — do NOT spawn agents. Run 3-5 targeted web searches, scan the results, and synthesize. This should take 1-2 minutes, not 10.

**Search for:**

1. How ABA competitors handle this (CentralReach, AlohaABA, Theralytics, Raven Health)
2. How the best-designed adjacent platform handles this (SimplePractice, Linear, Stripe — pick the most relevant)
3. Any known pitfalls, regulatory constraints, or common complaints

**If the topic involves a library or API**, use Context7 to fetch current docs instead of guessing.

## Output Format

Keep it tight — tables and bullets, not essays.

### How competitors do it

3-5 bullet points. What works, what doesn't.

### Best pattern to steal

The single best implementation you found. Who does it, what makes it good.

### Pitfalls to avoid

2-4 specific gotchas or failure modes.

### Recommended direction

3-5 sentences. What we should do, what to avoid, and one open question if any.

### Decision points

If the research surfaced trade-offs, ambiguities, or forks that need your input before planning, list them as specific questions. Examples:

- "Should we support multiple insurance cards per client, or just primary/secondary?"
- "Is this a standalone page or a tab within the client detail view?"
- "Do RBTs need access to this, or BCBA+ only?"

Only ask questions where the answer materially changes the implementation. Skip this section if the path forward is clear.

### Depth check

End with one of these verdicts:

- **Sufficient for planning** — enough to enter plan mode. No deeper research needed.
- **Recommend `/research`** — this topic has competitive nuance, technical pitfalls, or UX patterns that need the 3-agent pass before planning. Explain what specifically needs deeper investigation.
- **Recommend `/deep-research`** — this is a strategic decision, novel architecture, or high-risk area (billing, HIPAA, multi-tenancy) that needs the full 7-agent investigation with a saved document. Explain why.
