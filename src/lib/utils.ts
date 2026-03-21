import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function daysUntilExpiry(endDate: string | Date): number {
  return differenceInDays(new Date(endDate), new Date());
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Calculate 15-minute units from duration using the CMS 8-minute rule (AMA method).
 * Each 15-minute unit requires >= 8 minutes to bill.
 * Returns -1 if endTime is before startTime (invalid input).
 */
export function calculateUnits(startTime: Date, endTime: Date): number {
  const totalMinutes = Math.round(
    (endTime.getTime() - startTime.getTime()) / 60000,
  );
  if (totalMinutes < 0) return -1;
  if (totalMinutes < 8) return 0;
  return Math.floor(totalMinutes / 15) + (totalMinutes % 15 >= 8 ? 1 : 0);
}

/**
 * Calculate utilization percentage for an authorization service.
 */
export function utilizationPercent(used: number, approved: number): number {
  if (approved === 0) return 0;
  return Math.round((used / approved) * 100);
}
