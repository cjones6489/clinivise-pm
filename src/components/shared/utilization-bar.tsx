import { cn } from "@/lib/utils";
import { AUTH_ALERT_THRESHOLDS } from "@/lib/constants";

const { UTILIZATION_WARNING_PCT, UTILIZATION_CRITICAL_PCT } = AUTH_ALERT_THRESHOLDS;

export type UtilizationLevel = "on-track" | "warning" | "critical" | "over-utilized";

export function getUtilizationLevel(pct: number): UtilizationLevel {
  if (pct > 100) return "over-utilized";
  if (pct >= UTILIZATION_CRITICAL_PCT) return "critical";
  if (pct >= UTILIZATION_WARNING_PCT) return "warning";
  return "on-track";
}

export const LEVEL_COLORS: Record<UtilizationLevel, { bar: string; text: string; track: string; label: string }> = {
  "on-track": {
    bar: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    track: "bg-emerald-100 dark:bg-emerald-900/30",
    label: "On track",
  },
  warning: {
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    track: "bg-amber-100 dark:bg-amber-900/30",
    label: "Nearing limit",
  },
  critical: {
    bar: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    track: "bg-red-100 dark:bg-red-900/30",
    label: "At limit",
  },
  "over-utilized": {
    bar: "bg-red-600",
    text: "text-red-700 dark:text-red-400",
    track: "bg-red-200 dark:bg-red-900/40",
    label: "Over-utilized",
  },
};

export function unitsToHours(units: number): string {
  return ((units * 15) / 60).toFixed(1);
}

/**
 * Utilization progress bar for authorization services.
 *
 * Uses `role="meter"` (W3C ARIA APG — static value range, not task completion).
 * Color-coded: emerald <80%, amber 80-95%, red >95%.
 * Never relies on color alone — each threshold has a text label for accessibility.
 *
 * @see Research §3: Auth Utilization — Visualization Standards
 */
export function UtilizationBar({
  usedUnits,
  approvedUnits,
  label,
  showHours = true,
  compact = false,
}: {
  usedUnits: number;
  approvedUnits: number;
  /** Optional label (e.g., CPT code) displayed above the bar */
  label?: string;
  /** Show hours instead of raw units (default: true, BCBAs think in hours) */
  showHours?: boolean;
  /** Compact mode for table cells — colored percentage text only, no full bar */
  compact?: boolean;
}) {
  const pct = approvedUnits > 0 ? Math.round((usedUnits / approvedUnits) * 100) : 0;
  const level = getUtilizationLevel(pct);
  const colors = LEVEL_COLORS[level];
  const remaining = Math.max(0, approvedUnits - usedUnits);
  const fillWidth = Math.min(pct, 100);

  const usedDisplay = showHours ? `${unitsToHours(usedUnits)} hrs` : `${usedUnits} units`;
  const approvedDisplay = showHours ? `${unitsToHours(approvedUnits)} hrs` : `${approvedUnits} units`;
  const remainingDisplay = showHours ? `${unitsToHours(remaining)} hrs` : `${remaining} units`;
  const valueText = `${pct}% utilized — ${remainingDisplay} remaining`;

  // Compact mode: just colored percentage text with status label for table cells
  if (compact) {
    return (
      <span
        role="meter"
        aria-valuemin={0}
        aria-valuemax={approvedUnits}
        aria-valuenow={usedUnits}
        aria-valuetext={valueText}
        className={cn("text-xs font-semibold tabular-nums", colors.text)}
      >
        {pct}%
        <span className="ml-1 font-normal text-muted-foreground">
          ({usedDisplay})
        </span>
      </span>
    );
  }

  return (
    <div
      role="meter"
      aria-valuemin={0}
      aria-valuemax={approvedUnits}
      aria-valuenow={usedUnits}
      aria-valuetext={valueText}
      aria-label={label ? `${label} utilization` : "Authorization utilization"}
    >
      {/* Header: label + remaining */}
      <div className="mb-1 flex items-baseline justify-between">
        {label && (
          <span className="font-mono text-xs font-semibold text-foreground">{label}</span>
        )}
        <span className="text-[11px] text-muted-foreground">
          {remainingDisplay} remaining
        </span>
      </div>

      {/* Bar + percentage */}
      <div className="flex items-center gap-2">
        <div
          className={cn("relative h-1.5 flex-1 overflow-hidden rounded-full", colors.track)}
          style={{ minWidth: 120 }}
        >
          <div
            className={cn("absolute inset-y-0 left-0 rounded-full transition-all", colors.bar)}
            style={{ width: `${fillWidth}%` }}
          />
        </div>
        <span className={cn("text-[11px] font-semibold tabular-nums", colors.text)}>
          {pct}%
        </span>
      </div>

      {/* Footer: used/approved + status label */}
      <div className="mt-0.5 flex items-baseline justify-between">
        <span className="text-[11px] text-muted-foreground">
          {usedDisplay} / {approvedDisplay}
        </span>
        <span className={cn("text-[10px] font-medium", colors.text)}>
          {colors.label}
        </span>
      </div>
    </div>
  );
}
