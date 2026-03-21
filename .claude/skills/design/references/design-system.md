# Clinivise Design System Reference

> This file is loaded by the `/design` skill. It contains concrete tokens, spacing rules, and component patterns. All values come from the project's `globals.css` (shadcn Mira style) and `components.json`.

## Configuration

- **Style**: radix-mira (ultra-compact, data-dense)
- **Icons**: hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`)
- **Base radius**: `0.625rem` (10px), computed variants via `--radius` CSS variable
- **Color space**: OKLCH (perceptually uniform, no pure black/white)
- **Fonts**: Inter (body/sans via `--font-sans`), Geist Mono (code via `--font-geist-mono`)

## Spacing Scale

Use Tailwind's standard scale. Mira is compact — bias toward smaller values.

| Use case | Class | Rem | Px |
|----------|-------|-----|-----|
| Inner padding (inputs, badges) | `p-1.5` or `px-2 py-1` | 0.375–0.5 | 6–8 |
| Card padding | `p-4` | 1 | 16 |
| Card padding (compact) | `p-3` | 0.75 | 12 |
| Section gap | `gap-4` or `gap-6` | 1–1.5 | 16–24 |
| Item gap (within section) | `gap-1` or `gap-2` | 0.25–0.5 | 4–8 |
| Page padding | `p-4 md:p-6` | 1–1.5 | 16–24 |
| Table cell | `px-3 py-2` | — | 12×8 |
| Between page sections | `space-y-6` | 1.5 | 24 |

**Rule**: When in doubt, use smaller spacing. Mira is dense. Whitespace goes between sections, not between every element.

## Typography Scale

Mira uses `text-xs` as its base size. This is intentional for data-dense interfaces.

| Element | Classes | Size |
|---------|---------|------|
| Page title | `text-lg font-semibold tracking-tight` | 18px |
| Section heading | `text-sm font-semibold` | 14px |
| Card title | `text-sm font-medium` | 14px |
| Body / table content | `text-xs` | 12px |
| Labels | `text-xs font-medium` | 12px |
| Metadata / timestamps | `text-xs text-muted-foreground` | 12px |
| Metric values (large) | `text-2xl font-semibold tabular-nums` | 24px |
| Metric values (compact) | `text-lg font-semibold tabular-nums` | 18px |
| Metric labels | `text-xs text-muted-foreground` | 12px |
| Badge text | `text-xs` | 12px |

**Rules**:
- Use `font-semibold` for headings, `font-medium` for labels, default weight for body
- Use `tabular-nums` on any numeric column (prices, units, counts) for alignment
- Use `tracking-tight` on headings `text-lg` and above
- Max line length for prose: `max-w-prose` (65ch)

## Color Tokens

All colors are OKLCH values defined in `globals.css`. Never use raw color values.

### Semantic Mapping

| Token | Light mode | Usage |
|-------|-----------|-------|
| `--background` | `oklch(1 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Primary text |
| `--card` | `oklch(1 0 0)` | Card/surface background |
| `--muted` | `oklch(0.97 0 0)` | Subtle backgrounds |
| `--muted-foreground` | `oklch(0.556 0 0)` | Secondary text |
| `--primary` | `oklch(0.205 0 0)` | Primary buttons, emphasis |
| `--secondary` | `oklch(0.97 0 0)` | Secondary buttons |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red/error/destructive |
| `--border` | `oklch(0.922 0 0)` | All borders |
| `--accent` | `oklch(0.97 0 0)` | Hover/active backgrounds |

### Status Colors (Tailwind utility classes)

These are the ONLY non-token colors allowed, for status indicators:

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Success | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` |
| Warning | `bg-amber-50` | `text-amber-700` | `border-amber-200` |
| Error | `bg-red-50` | `text-red-700` | `border-red-200` |
| Info | `bg-blue-50` | `text-blue-700` | `border-blue-200` |
| Neutral | `bg-muted` | `text-muted-foreground` | `border-border` |

In dark mode, use `/10` opacity variants: `bg-emerald-500/10 text-emerald-400`.

## Component Inventory

These are installed in `src/components/ui/`. Always use these before building custom.

**Layout**: `card`, `separator`, `tabs`, `sidebar`, `sheet`, `drawer`, `dialog`
**Data**: `table`, `badge`, `avatar`, `skeleton`, `spinner`, `chart`, `calendar`, `pagination`
**Forms**: `input`, `textarea`, `select`, `checkbox`, `switch`, `radio-group`, `label`, `field`, `input-group`, `combobox`
**Actions**: `button`, `dropdown-menu`, `popover`, `command`, `tooltip`
**Feedback**: `sonner` (toast)
**Navigation**: `breadcrumb`, `sidebar`

### Components NOT yet installed (add with `pnpm dlx shadcn@latest add <name>`)

`progress`, `slider`, `toggle`, `toggle-group`, `scroll-area`, `collapsible`, `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `hover-card`, `menubar`, `navigation-menu`, `resizable`

## Icons

Use `@hugeicons/react` with `@hugeicons/core-free-icons`. Import pattern:

```tsx
import { UserIcon, CalendarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

<HugeiconsIcon icon={UserIcon} size={16} />
```

Default size: `16` for inline/table icons, `20` for buttons, `24` for page headers, `32`+ for empty states.

## ABA-Specific UI Patterns

### Authorization Utilization Bar
The most important visual in the app. Shows used vs. approved units.

```
Structure: [progress bar] [X / Y units] [Z%]
Colors:
  0-79%  → default track (muted)
  80-94% → amber track + "Nearing limit" label
  95-99% → red track + "Almost exhausted" label
  100%+  → red track + bold "Over-utilized" label
Always show: CPT code, date range, units remaining
```

### Session Log Entry (most frequent interaction)
Optimize for speed. Pre-fill from context.

```
Required: client, provider, CPT code, date, start/end time, units
Auto-calculated: units from time (CMS 8-minute rule)
Pre-filled: provider (from session), date (today), CPT (last used for this client)
Submit: single button, then redirect to session list with success toast
```

### Status Badges (consistent across all tables)
```
Active    → default badge (no color, just border)
Pending   → amber badge
Approved  → emerald badge
Denied    → red badge
Expired   → muted badge with strikethrough
Draft     → muted badge, dashed border
Submitted → blue badge
Paid      → emerald badge
```

## Responsive Breakpoints

| Breakpoint | Target | Layout adjustments |
|-----------|--------|-------------------|
| `< 768px` | Tablet (field use) | Single column, larger touch targets (`min-h-11`), collapsed sidebar |
| `768–1024px` | Small laptop | Two-column forms, compact sidebar |
| `1024–1440px` | Laptop | Full layout, standard density |
| `> 1440px` | Desktop / dual monitor | Optional wider content, side-by-side panels |

**Touch target minimum**: `min-h-11 min-w-11` (44px) for any tappable element on tablet.

## Realistic Test Data

When building UI, use realistic ABA data — never lorem ipsum:

- Client names: "Marcus Thompson", "Aisha Rivera", "Ethan Nguyen"
- Providers: "Dr. Sarah Chen, BCBA" (BCBA), "Jordan Williams, RBT" (RBT)
- CPT codes: 97153 (direct therapy), 97155 (protocol modification), 97151 (assessment)
- Diagnosis: F84.0 (Autism Spectrum Disorder)
- Payers: "Blue Cross Blue Shield", "United Healthcare", "Medicaid (State)"
- Authorization: "Auth #AUT-2026-0034, 120 units of 97153, Jan 1 – Jun 30, 2026"
- Session: "60 min (4 units) of 97153 with Marcus Thompson on 3/18/2026"
