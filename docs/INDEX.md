# Clinivise Documentation

Central index of all project documentation.

---

## Project

| Document | Location | Description |
|----------|----------|-------------|
| Project Overview | [`CLAUDE.md`](../CLAUDE.md) | Tech stack, architecture, constraints, phase context |
| Agent Instructions | [`AGENTS.md`](../AGENTS.md) | AI coding assistant behavioral rules |
| Working Roadmap | [`ROADMAP.md`](../ROADMAP.md) | Phase 1 task breakdown with status tracking |

## Research

| Document | Location | Description |
|----------|----------|-------------|
| PM/EHR Architecture Research | [`docs/deep-research-pm-ehr.md`](deep-research-pm-ehr.md) | Multi-agent deep dive: multi-tenancy, auth tracking, claims lifecycle, HIPAA, competitor analysis, frontier patterns, 32-item risk matrix |
| UI/UX Design Research | [`docs/deep-research-ui-ux.md`](deep-research-ui-ux.md) | 6-agent deep dive: ABA competitor UX analysis, open source references, healthcare UI standards, architecture patterns, frontier/emerging trends, 48-item risk matrix |

## Specs

| Document | Location | Description |
|----------|----------|-------------|
| Engineering Spec | [`docs/engineering-spec.md`](engineering-spec.md) | Full DB schema (12 tables), config files, file structure, task breakdown |
| Research Spec | [`docs/research-spec.md`](research-spec.md) | Technology decisions, pricing model, ABA billing codes, HIPAA analysis, competitor research |

## Design

| Document | Location | Description |
|----------|----------|-------------|
| UI Wireframes | [`docs/clinivise-wireframes.jsx`](clinivise-wireframes.jsx) | Interactive React wireframes covering all Phase 1 + Phase 2 screens (dashboard, clients, authorizations, sessions, billing, eligibility, settings) |
| Design System | [`.claude/skills/design/references/design-system.md`](../.claude/skills/design/references/design-system.md) | Mira tokens, spacing scale, typography, color tokens, component inventory |

## Rules (AI coding guidelines)

| Document | Location | Scope |
|----------|----------|-------|
| Database | [`.claude/rules/database.md`](../.claude/rules/database.md) | Drizzle patterns, IDs, multi-tenancy, migrations |
| Frontend | [`.claude/rules/frontend.md`](../.claude/rules/frontend.md) | Design system, components, typography, forms, data display |
| Security | [`.claude/rules/security.md`](../.claude/rules/security.md) | PHI handling, multi-tenant isolation, auth, HIPAA hardening checklist |
| Server Actions | [`.claude/rules/server-actions.md`](../.claude/rules/server-actions.md) | next-safe-action patterns, input validation, org scoping |
| Testing | [`.claude/rules/testing.md`](../.claude/rules/testing.md) | Vitest + Playwright, test priority, test data, patterns |

## Config

| File | Purpose |
|------|---------|
| `drizzle.config.ts` | Drizzle Kit — schema path, migration output, Neon connection |
| `next.config.ts` | Next.js — security headers, image config, server actions |
| `components.json` | shadcn/ui — Mira style, import aliases, component paths |
| `tsconfig.json` | TypeScript — strict mode, path aliases |
| `.env.local` | Environment variables (git-ignored) |
| `.env.example` | Environment variable template |
