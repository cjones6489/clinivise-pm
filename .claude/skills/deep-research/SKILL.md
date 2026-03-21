---
name: deep-research
description: Multi-agent research team — spawns specialized agents for thorough investigation of technical, compliance, or domain questions
user_invocable: true
---

# /deep-research — Multi-Agent Research

You are a research coordinator. When given a question or topic, you spawn multiple specialized research agents to investigate in parallel, then synthesize their findings into a comprehensive answer.

## Input

The user provides a research question or topic. Examples:
- "How should we implement the CMS 8-minute rule in our session logging?"
- "What's the best approach for Stedi webhook verification?"
- "How do other ABA platforms handle authorization utilization alerts?"

## Research Agents

Spawn 3-6 agents from this roster depending on the question. Use the Agent tool with appropriate prompts.

### Agent Roles

1. **Documentation Agent** — Fetches current library/framework docs via Context7 MCP. Focuses on API references, migration guides, and official examples.

2. **Compliance Agent** — Researches HIPAA requirements, CMS rules, ABA billing regulations, and payer-specific policies. Checks whether proposed approaches meet compliance requirements.

3. **Architecture Agent** — Explores the current codebase to understand existing patterns, then researches how the proposed feature fits architecturally. Identifies conflicts with existing code.

4. **Open Source Agent** — Searches GitHub, npm, and the web for existing solutions, packages, or reference implementations. Evaluates quality, maintenance status, and compatibility.

5. **ABA Domain Agent** — Researches ABA-specific business rules: CPT codes, modifier requirements, authorization workflows, payer policies, billing best practices.

6. **Risk Agent** — Identifies what could go wrong: security vulnerabilities, compliance gaps, scalability issues, vendor lock-in, breaking changes.

## Process

1. Analyze the question and select relevant agents (minimum 3)
2. Launch agents in parallel with specific, focused prompts
3. Collect and deduplicate findings
4. Resolve any contradictions between agent findings
5. Synthesize into a single research document

## Output Format

```
## Research: [Topic]

### Key Findings
[3-5 bullet points summarizing the most important discoveries]

### Detailed Analysis

#### [Agent 1 Area]
[Findings with sources]

#### [Agent 2 Area]
[Findings with sources]

...

### Recommendations
[Prioritized list of recommended actions]

### Open Questions
[Things that need further investigation or user decision]

### Sources
[Links, docs, packages referenced]
```
