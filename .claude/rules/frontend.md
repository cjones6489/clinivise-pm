---
description: Component patterns, styling, and client-side conventions — enforces design system quality
globs: src/components/**, src/app/**
---

# Frontend Rules

> Clinivise's UI is a core competitive advantage. ABA practitioners hate their current tools (CentralReach, AlohaABA) — we win by being fast, clean, and consistent. For full design guidance, see `/design` skill and `.claude/skills/design/references/design-system.md`.

## Design System Enforcement

- ONLY use semantic color tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.) — never hardcode `text-white`, `bg-black`, `text-gray-500`
- ONLY use status colors from the design system: emerald (success), amber (warning), red (error), blue (info)
- ONLY use shadcn/ui Mira components from `src/components/ui/` — never build custom primitives
- Use `cn()` from `@/lib/utils` for all conditional class merging
- Use Tailwind's standard spacing scale — no arbitrary values (`p-[7px]`, `text-[13px]`)
- Icons: `@hugeicons/react` with `@hugeicons/core-free-icons` (not Lucide, not raw SVGs)

## Component Architecture

- Server Components by default — only add `'use client'` when the component needs interactivity, hooks, or browser APIs
- Small, focused components (< 200 lines) — split if growing larger
- Colocate component-specific types in the same file
- Client-side data fetching via TanStack Query — never `useEffect` + `fetch`

## Typography (Mira compact scale)

- Body/table content: `text-xs` (12px) — this is the Mira base, not `text-sm`
- Section headings: `text-sm font-semibold`
- Page titles: `text-lg font-semibold tracking-tight`
- Labels: `text-xs font-medium`
- Metric values: `text-2xl font-semibold tabular-nums`
- Always use `tabular-nums` on numeric columns for alignment

## Every Component Must Handle

- **Loading**: Skeleton matching content shape (never a centered spinner)
- **Empty**: Helpful message with icon + CTA
- **Error**: Inline message with retry action
- **Overflow**: Works with long names, 1000 rows, narrow viewports

## Forms

- React Hook Form + Zod v4 for all forms
- Import Zod from `zod/v4` (not `zod`)
- Define schemas in `src/lib/validators/` for shared schemas, or colocate with the form component
- Use `@hookform/resolvers` for form-schema integration
- Display validation errors inline using shadcn `<Field>` component
- Labels above inputs (never floating labels)
- Pre-fill from context wherever possible (today's date, current provider, last-used CPT code)

## Data Display

- `@tanstack/react-table` for all data tables — compact rows (`py-2 px-3 text-xs`)
- Skeleton components for loading states
- Toast notifications via Sonner — success, error, and info variants
- Empty states with clear CTAs and relevant icons
- `tabular-nums` on all numeric columns

## Navigation & Layout

- Sidebar navigation via shadcn `<Sidebar>` component
- Breadcrumbs on detail pages
- Role-based nav item visibility (Admin sees settings, RBT sees limited menu)

## Patterns

- Optimistic updates via TanStack Query `onMutate` callbacks
- Debounce search inputs (300ms)
- Paginate data tables server-side for large datasets
- Prefetch adjacent pages when pagination is visible
- Touch targets: `min-h-11 min-w-11` (44px) for tablet-friendly interactions
