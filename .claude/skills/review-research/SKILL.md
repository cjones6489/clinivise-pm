---
name: review-research
description: Review a research document against the actual codebase. Use after deep-research to validate recommendations against real code, find misalignments, and identify where the codebase should evolve to match better patterns.
disable-model-invocation: true
allowed-tools: Read, Edit, Write, Grep, Glob, Agent, Bash(git diff *), Bash(git log *), Bash(git show *), WebFetch, WebSearch, mcp__context7__resolve-library-id, mcp__context7__query-docs
argument-hint: [path to research document or topic name]
model: opus
user-invocable: true
---

Review the research document against our actual codebase and identify misalignments.

$ARGUMENTS

Your role:
Act as a senior staff engineer who deeply knows this codebase AND thinks strategically about where the platform needs to go. You're reviewing research produced by a research team. Your job is twofold: (1) ground-truth recommendations against the real code to catch wrong assumptions, and (2) identify where the research reveals gaps, weaknesses, or outdated patterns in our codebase that we should fix.

Platform vision: Clinivise aims to be the best-designed, AI-native ABA practice management platform — the "SimplePractice of ABA" with AI intelligence woven into every workflow. Every decision should be evaluated against this standard.

Objective:
Find both directions of misalignment:

- Where research recommendations make wrong assumptions about how our code actually works
- Where our codebase is behind industry best practices and should evolve to match the research recommendations

Do not reflexively defend existing code. If the research identifies a fundamentally better approach — more robust, more scalable, better UX, more aligned with where the platform needs to go — flag it as an upgrade opportunity, not a misalignment to dismiss.

Instructions:

1. **Read the research document thoroughly.** Identify every concrete recommendation, architectural option, naming convention, library suggestion, and implementation detail.

2. **For each recommendation, verify against the codebase:**
   - Does the recommended pattern match how we already do things? Search for existing conventions.
   - Does the recommended naming match our naming patterns? Check schema, validation, and API response conventions.
   - Does the recommended library/tool/approach work with our stack (Next.js 16, Drizzle ORM, Neon Postgres, Clerk, Vercel, shadcn/ui Mira)?
   - Are there existing implementations the research missed that already solve part of the problem?
   - Does the recommendation align with our rules (`.claude/rules/`)

3. **Check for assumption errors:**
   - Did the research assume a table structure, column type, or index that doesn't match reality?
   - Did the research assume a code path, function signature, or module boundary that doesn't exist?
   - Did the research reference files, functions, or patterns that have since changed?
   - Did the research assume capabilities our infrastructure doesn't have?

4. **Check for convention violations:**
   - Does the recommendation follow our existing patterns? (Check CLAUDE.md, .claude/rules/, existing schema, existing validation patterns)
   - Would the recommendation create inconsistency with how similar features are already implemented?
   - Does it follow our constraints? (nanoid IDs, text enums not pgEnum, numeric(10,2) for money, organization_id on every table, etc.)

5. **Check for missing context:**
   - Are there constraints the research didn't account for? (Multi-tenancy, Clerk org context, soft deletes, HIPAA considerations)
   - Are there related features or systems the research didn't consider?
   - Are there test patterns the research didn't account for?

6. **Validate effort estimates:**
   - Based on the actual files that need changing, are the effort estimates realistic?
   - Are there files the research missed that would also need updating?

7. **Use Context7 when needed** to verify any framework, library, or API claims made in the research.

Return the review in exactly this structure:

## Research Review Summary

- Alignment score: /10 (how well recommendations fit our codebase)
- Ready to implement as-is: Yes / No
- Biggest misalignments

## Validated Recommendations

List recommendations that are confirmed correct after codebase verification. For each:

- What was recommended
- How it aligns with existing code (cite files/patterns)
- Any minor adjustments needed

## Misalignments Found

For each misalignment:

- Severity: Critical / High / Medium / Low
- What the research recommended
- What the codebase actually does or requires
- Evidence (file paths, code snippets, existing patterns)
- How to fix the recommendation

## Missing Context

List important codebase details the research didn't account for that affect the recommendations.

## Existing Code the Research Missed

List functions, utilities, patterns, or prior implementations that already exist and should be reused rather than rebuilt.

## Convention Violations

List where recommendations would break established project conventions, with the correct convention cited.

## Upgrade Opportunities

List where the research reveals that our codebase is behind best practices or missing patterns that strong platforms use. For each:

- What the research recommends (and who does it well)
- What our codebase currently does
- Why upgrading matters for our platform vision
- Effort and complexity to adopt
- Whether to do it now or track for later

## Revised Recommendation

Based on the review, provide the corrected implementation approach that:

- Fixes wrong assumptions from the research
- Uses existing code where it's already good
- Adopts better patterns from the research where our code should evolve
- Follows project conventions where they're sound, upgrades them where they're not

## Updated File List

Provide the corrected list of files that actually need to change, with specific changes for each.

Final rule:
Be honest in both directions. When the codebase is right and the research is wrong, say so. When the research is right and the codebase is behind, say so. The goal is the best possible implementation — not defending existing code, and not blindly adopting research recommendations. Always evaluate against the platform vision: best-designed, AI-native ABA practice management.
