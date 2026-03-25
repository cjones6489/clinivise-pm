import { cn, formatDate, daysUntilExpiry } from "@/lib/utils";
import { startOfDay } from "date-fns";
import { AUTH_ALERT_THRESHOLDS } from "@/lib/constants";

const { EXPIRY_WARNING_DAYS } = AUTH_ALERT_THRESHOLDS;

export type ExpiryLevel = "safe" | "warning" | "critical" | "expired" | "future";

export function getExpiryLevel(daysLeft: number, isFuture: boolean): ExpiryLevel {
  if (isFuture) return "future";
  if (daysLeft < 0) return "expired";
  if (daysLeft <= 7) return "critical";
  if (daysLeft <= EXPIRY_WARNING_DAYS) return "warning";
  return "safe";
}

const LEVEL_STYLES: Record<ExpiryLevel, { badge: string; text: string }> = {
  safe: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    text: "text-amber-600 dark:text-amber-400",
  },
  critical: {
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    text: "text-red-600 dark:text-red-400",
  },
  expired: {
    badge: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
  },
  future: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    text: "text-blue-600 dark:text-blue-400",
  },
};

/**
 * Color-coded badge showing days until authorization expiry.
 *
 * Colors: emerald >30d, amber 7-30d, red <7d, muted "Expired", blue for future start dates.
 * Uses the EXPIRY_WARNING_DAYS threshold from constants.
 *
 * @see Research §3: Auth Utilization — Visualization Standards
 */
export function ExpiryBadge({
  endDate,
  startDate,
  showFullDate = false,
}: {
  /** Authorization end date (ISO string YYYY-MM-DD) */
  endDate: string;
  /** Authorization start date (ISO string YYYY-MM-DD) — if in the future, shows "Starts {date}" */
  startDate?: string;
  /** Show full formatted date alongside days remaining (for detail pages) */
  showFullDate?: boolean;
}) {
  const today = startOfDay(new Date());

  // Check if authorization hasn't started yet
  const isFuture = startDate ? startOfDay(new Date(startDate)) > today : false;
  const daysLeft = daysUntilExpiry(endDate);
  const level = getExpiryLevel(daysLeft, isFuture);
  const styles = LEVEL_STYLES[level];

  if (isFuture && startDate) {
    return (
      <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", styles.badge)}>
        Starts {formatDate(startDate)}
      </span>
    );
  }

  if (level === "expired") {
    return (
      <span className="inline-flex items-center gap-1">
        <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold", styles.badge)}>
          Expired
        </span>
        {showFullDate && (
          <span className="text-[10px] text-muted-foreground">
            {formatDate(endDate)}
          </span>
        )}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums", styles.badge)}>
        {daysLeft}d
      </span>
      {showFullDate && (
        <span className="text-[10px] text-muted-foreground">
          Expires {formatDate(endDate)}
        </span>
      )}
    </span>
  );
}
