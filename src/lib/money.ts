import { Decimal } from "decimal.js";

/**
 * All money functions operate on string inputs and return string outputs.
 * This matches Postgres numeric -> Drizzle string behavior and Stedi's API format.
 * NEVER use parseFloat() or Number() on monetary values.
 */

const ZERO = "0.00";

function toDecimal(value: string | null | undefined): Decimal {
  if (value === null || value === undefined || value === "") {
    return new Decimal(0);
  }
  try {
    return new Decimal(value);
  } catch {
    console.error(`Invalid money value: "${value}", defaulting to 0`);
    return new Decimal(0);
  }
}

export function addMoney(a: string | null | undefined, b: string | null | undefined): string {
  return toDecimal(a).plus(toDecimal(b)).toFixed(2);
}

export function subtractMoney(a: string | null | undefined, b: string | null | undefined): string {
  return toDecimal(a).minus(toDecimal(b)).toFixed(2);
}

export function multiplyMoney(
  amount: string | null | undefined,
  multiplier: number | string,
): string {
  return toDecimal(amount).times(new Decimal(multiplier)).toFixed(2);
}

export function isPositive(amount: string | null | undefined): boolean {
  return toDecimal(amount).greaterThan(0);
}

export function isZero(amount: string | null | undefined): boolean {
  return toDecimal(amount).isZero();
}

export function compareMoney(a: string | null | undefined, b: string | null | undefined): number {
  return toDecimal(a).comparedTo(toDecimal(b));
}

export function formatMoney(amount: string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "$0.00";
  const num = toDecimal(amount).toNumber();
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
}

export function toMoneyString(amount: string | number): string {
  return toDecimal(String(amount)).toFixed(2);
}

export { ZERO as ZERO_MONEY };
