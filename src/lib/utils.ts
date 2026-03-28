import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInCalendarDays, startOfDay } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatTimeCompact(date: string | Date): string {
  return format(new Date(date), "h:mma").toLowerCase();
}

export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes === undefined) return "—";
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Calendar days remaining until an authorization expires.
 * Uses `differenceInCalendarDays` (counts calendar-day boundaries) instead of
 * `differenceInDays` (compares timestamps) to avoid timezone off-by-one errors.
 */
export function daysUntilExpiry(endDate: string | Date): number {
  return differenceInCalendarDays(startOfDay(new Date(endDate)), startOfDay(new Date()));
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Parse "HH:MM" time string to total minutes since midnight.
 * Pure arithmetic — no Date objects, no timezone involvement.
 */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h! * 60 + m!;
}

/**
 * Calculate 15-minute units from a duration in minutes using the CMS 8-minute rule (AMA method).
 * Each 15-minute unit requires >= 8 minutes to bill.
 * Returns -1 if totalMinutes is negative (invalid input).
 */
export function calculateUnitsFromMinutes(totalMinutes: number): number {
  if (totalMinutes < 0) return -1;
  if (totalMinutes < 8) return 0;
  return Math.floor(totalMinutes / 15) + (totalMinutes % 15 >= 8 ? 1 : 0);
}

/**
 * Calculate 15-minute units from start/end Date objects.
 * Convenience wrapper for client-side form calculation.
 * @deprecated Prefer calculateUnitsFromMinutes with parseTimeToMinutes for timezone safety.
 */
export function calculateUnits(startTime: Date, endTime: Date): number {
  const totalMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  return calculateUnitsFromMinutes(totalMinutes);
}

/** Convert undefined values to null so Drizzle includes them in UPDATE queries. */
export function undefinedToNull<T extends Record<string, unknown>>(obj: T) {
  const result = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value === undefined ? null : value;
  }
  return result as { [K in keyof T]: T[K] extends undefined ? null : T[K] };
}

/** Strip undefined keys so DB defaults are preserved on INSERT. */
export function stripUndefined<T extends Record<string, unknown>>(obj: T) {
  const result = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as { [K in keyof T]: Exclude<T[K], undefined> };
}

/**
 * Calculate utilization percentage for an authorization service.
 */
export function utilizationPercent(used: number, approved: number): number {
  if (approved === 0) return 0;
  return Math.round((used / approved) * 100);
}

/**
 * Validate NPI using the Luhn algorithm with 80840 prefix.
 * NPIs are 10-digit numbers. The check digit (last digit) is validated by:
 * 1. Prepend "80840" to the first 9 digits
 * 2. Run the Luhn algorithm on the resulting 14 digits
 * 3. The result should end in 0
 *
 * @see CMS NPI Standard, ISO/IEC 7812
 */
export function isValidNpi(npi: string): boolean {
  if (!/^\d{10}$/.test(npi)) return false;

  const prefixed = "80840" + npi;
  let sum = 0;
  let alternate = false;

  for (let i = prefixed.length - 1; i >= 0; i--) {
    let n = parseInt(prefixed[i]!, 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }

  return sum % 10 === 0;
}
