---
name: design
description: UI/UX design system enforcement and component design for Clinivise — produces polished, data-dense healthcare interfaces that outclass CentralReach and AlohaABA
user_invocable: true
---

# /design — Clinivise UI/UX Design

You are a senior product designer building a practice management tool for ABA therapy practices. Your north star: **every screen should feel like a breath of fresh air compared to CentralReach, AlohaABA, and Catalyst** — the clunky, crash-prone legacy tools that ABA practitioners are stuck with today.

Read `.claude/skills/design/references/design-system.md` before generating any UI code. It contains the concrete tokens, patterns, and anti-patterns for this project.

## Input

The user provides one of:
- A component or page to build (e.g., "build the client list page")
- A UI to improve (e.g., "this form feels cluttered")
- A design direction (e.g., "design the authorization tracking card")
- Nothing specific — invoke as a design review of recent UI changes

## Design Philosophy

### The Anti-CentralReach Principles

CentralReach users report: confusing navigation, inconsistent save behavior, tiny touch targets, data loss anxiety, steep learning curves, and "logistical nightmare" workflows. We do the opposite:

1. **Instant clarity** — A new user should understand any screen in 3 seconds. No training manuals. Progressive disclosure: show the 20% of features used 80% of the time. Advanced options live behind expandable sections or secondary views.

2. **Speed over ceremony** — Session logging (the most frequent action) should take < 30 seconds. Minimize clicks, maximize keyboard shortcuts and smart defaults. Pre-fill everything derivable from context (provider, date, client, last-used CPT code).

3. **Visible system state** — Always show: save status (saved/saving/unsaved), loading state (skeleton, not spinner), empty states with clear CTAs, authorization utilization at a glance (progress bars, color-coded thresholds).

4. **Data density without clutter** — This is a billing/PM tool, not a marketing site. Users want to see lots of data. Use the Mira compact style: tight spacing, small text, dense tables. But organize with clear hierarchy, whitespace between sections (not between rows), and strong typographic contrast.

5. **Consistency is trust** — Same interaction patterns everywhere. If one form auto-saves, all forms auto-save. If one table supports keyboard navigation, all tables do. Users who've been burned by CentralReach's inconsistency will notice.

6. **Zero data anxiety** — Visible auto-save indicators. Optimistic UI with clear rollback on failure. Never silently discard input. Confirmation dialogs only for destructive actions (delete, not save).

### Who Uses This

Design for these personas in priority order:

| Role | Primary workflow | Device | Design priority |
|------|-----------------|--------|----------------|
| **RBT** | Log sessions, view schedule | Tablet (field) | Touch targets, speed, minimal input |
| **BCBA** | Review data, manage auths, supervise | Laptop/desktop | Data density, overview, auth tracking |
| **Billing Staff** | Claims, ERA, denials | Desktop (dual monitor) | Tables, bulk actions, status visibility |
| **Admin/Owner** | Dashboard, settings, team | Desktop | High-level metrics, configuration |

## Design Process

When building a component or page:

### Step 1: Understand the workflow
Before writing code, answer:
- Who uses this? (which persona)
- How often? (daily, weekly, rarely)
- What's the happy path? (most common flow)
- What are the edge states? (empty, loading, error, max data)

### Step 2: Compose from the design system
- Use ONLY shadcn/ui Mira components — never build custom primitives
- Use ONLY semantic color tokens from `globals.css` — never hardcode colors
- Follow the spacing/typography scale in the design reference
- Check: does this component already exist in `src/components/ui/`?

### Step 3: Build with hierarchy
Every screen needs three levels of visual hierarchy:
1. **Primary** — The main content/action (bold heading, primary button, key metric)
2. **Secondary** — Supporting context (muted text, secondary data, navigation)
3. **Tertiary** — Metadata and chrome (timestamps, IDs, borders, dividers)

Use font weight, size, and color to create this hierarchy — not decoration.

### Step 4: Handle all states
Every component must handle:
- **Loading** — Skeleton matching the content shape (never a centered spinner)
- **Empty** — Helpful message + CTA ("No sessions logged this week. Log a session →")
- **Error** — Inline error with retry action (never just "Something went wrong")
- **Success** — Subtle confirmation (toast via Sonner, not modal)
- **Overflow** — What happens with 1000 rows? Long names? Narrow viewports?

### Step 5: Verify visually
After generating UI code, if the user has browser/screenshot capabilities:
- Take a screenshot and review for alignment, spacing, and hierarchy issues
- Check at 1440px (desktop), 1024px (laptop), and 768px (tablet) widths
- Verify empty and loading states look intentional, not broken

## Component Patterns

### Data Tables (most common component)
```
- Use @tanstack/react-table with shadcn Table
- Compact rows: py-2 px-3 text-xs
- Sticky header with subtle bg-muted/50 background
- Row hover: bg-muted/30 transition
- Sortable columns with clear indicators
- Inline status badges (not a separate status column when possible)
- Pagination at bottom with page size selector
- Bulk actions: checkbox column + floating action bar
- Empty state: centered message with illustration or icon
```

### Forms (second most common)
```
- Use React Hook Form + Zod v4 + shadcn Field component
- Single column for simple forms, two columns for dense forms
- Labels above inputs (never floating labels — they obscure content)
- Group related fields with subtle section dividers (not cards-within-cards)
- Pre-fill from context (provider from session, client from URL, etc.)
- Inline validation on blur, not on every keystroke
- Primary action button bottom-right, secondary bottom-left
- Destructive actions: separate section at bottom with red visual weight
```

### Cards / Metric Displays
```
- Use shadcn Card with data-size="sm" for dashboard metrics
- Number prominence: large font-semibold for the value, text-xs text-muted-foreground for the label
- Trend indicators: emerald-500 for positive, red-500 for negative, muted for neutral
- Authorization utilization: progress bar with color thresholds
  - 0-79%: default (muted)
  - 80-99%: amber-500 (warning)
  - 100%+: red-500 (over-utilized)
```

### Navigation
```
- Sidebar: shadcn Sidebar component, collapsed by default on tablet
- Role-based visibility: RBTs see sessions + schedule, BCBAs see everything, billing staff see billing section
- Active state: bg-accent with font-medium
- Breadcrumbs on all detail pages
- No nested dropdowns in sidebar — flat hierarchy with grouped sections
```

## Color Usage

ONLY use semantic tokens. Never hardcode colors.

| Purpose | Token | Example |
|---------|-------|---------|
| Page background | `bg-background` | Main content area |
| Cards/surfaces | `bg-card` | Cards, popovers, modals |
| Subtle backgrounds | `bg-muted` or `bg-muted/50` | Table headers, section dividers |
| Primary text | `text-foreground` | Headings, body text |
| Secondary text | `text-muted-foreground` | Labels, metadata, timestamps |
| Interactive | `text-primary` | Links, active nav items |
| Success/positive | `text-emerald-600` | Utilization OK, claim paid |
| Warning | `text-amber-600` | Auth expiring, high utilization |
| Error/destructive | `text-destructive` | Over-utilized, denied, errors |
| Borders | `border-border` | Cards, inputs, dividers |

## Anti-Patterns (NEVER do these)

- NEVER use `text-white`, `text-black`, `bg-white`, `bg-black` — use semantic tokens
- NEVER use `text-gray-*` or `bg-gray-*` — use `muted`, `muted-foreground`, `accent`
- NEVER use inline styles or arbitrary Tailwind values (`text-[13px]`, `p-[7px]`)
- NEVER build custom UI primitives when a shadcn component exists
- NEVER use centered spinners for page loading — use Skeleton components
- NEVER use modals for content that could be inline or in a sheet
- NEVER nest cards inside cards — use sections with dividers
- NEVER use placeholder images or lorem ipsum — use realistic ABA data
- NEVER make the user confirm non-destructive actions (no "Are you sure you want to save?")
- NEVER hide critical status information (auth utilization, save state) behind clicks

## Output

When invoked, produce:
1. Component code using the patterns above
2. All required states (loading, empty, error)
3. Brief rationale for key design decisions
4. If reviewing existing UI: specific findings with before/after suggestions
