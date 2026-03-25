import { CREDENTIAL_MODIFIERS, VALID_SESSION_TRANSITIONS, type SessionStatus } from "./constants";
import { parseTimeToMinutes } from "./utils";

/**
 * Auto-compute billing modifier codes from provider credential and place of service.
 * - Credential modifier: BCBA→HO, RBT→HM, BCaBA→HN, BCBA-D→HP
 * - Telehealth modifier "95" for POS 02 or 10
 */
export function computeModifierCodes(
  credentialType: string,
  placeOfService: string,
  existingModifiers?: string[],
): string[] {
  const modifiers = new Set(existingModifiers ?? []);

  const credMod = CREDENTIAL_MODIFIERS[credentialType];
  if (credMod) modifiers.add(credMod);

  if (placeOfService === "02" || placeOfService === "10") {
    modifiers.add("95");
  }

  return [...modifiers];
}

/**
 * Compute session duration from time strings and build storage timestamps.
 *
 * Duration uses pure string arithmetic (parseTimeToMinutes) — no timezone involvement.
 * Timestamps are constructed for storage only; the actualMinutes value is the
 * authoritative duration for billing, regardless of server timezone.
 *
 * Time strings are "HH:MM" format from `<input type="time">`.
 * Returns nulls if either time is missing.
 */
export function computeActualMinutes(
  sessionDate: string,
  startTime?: string,
  endTime?: string,
): { startTimestamp: Date | null; endTimestamp: Date | null; actualMinutes: number | null } {
  if (!startTime || !endTime) {
    return { startTimestamp: null, endTimestamp: null, actualMinutes: null };
  }

  // Duration via pure arithmetic — timezone-safe
  const actualMinutes = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);

  // Timestamps for storage (display only, not used for billing math)
  const startTimestamp = new Date(`${sessionDate}T${startTime}:00`);
  const endTimestamp = new Date(`${sessionDate}T${endTime}:00`);

  return { startTimestamp, endTimestamp, actualMinutes };
}

/**
 * Check if a status transition is valid per VALID_SESSION_TRANSITIONS.
 * Returns true if oldStatus === newStatus (no transition) or if the transition is allowed.
 */
export function isValidStatusTransition(oldStatus: string, newStatus: string): boolean {
  if (oldStatus === newStatus) return true;
  const allowed = VALID_SESSION_TRANSITIONS[oldStatus as SessionStatus];
  return !!allowed && allowed.includes(newStatus as SessionStatus);
}

// ── Unit Accounting Decision Logic ──────────────────────────────────────────

export type UnitAccountingOp =
  | { type: "none" }
  | { type: "increment"; authServiceId: string; units: number }
  | { type: "decrement"; authServiceId: string; units: number };

/**
 * Determine what unit accounting operations are needed for a CREATE.
 * Only completed sessions with an auth service trigger an increment.
 */
export function computeCreateAccountingOps(
  status: string,
  authServiceId: string | null,
  units: number,
): UnitAccountingOp {
  if (status === "completed" && authServiceId && units > 0) {
    return { type: "increment", authServiceId, units };
  }
  return { type: "none" };
}

/**
 * Determine what unit accounting operations are needed for a CANCEL.
 * Only cancelling a completed session with an auth service triggers a decrement.
 */
export function computeCancelAccountingOps(
  previousStatus: string,
  authServiceId: string | null,
  units: number,
): UnitAccountingOp {
  if (previousStatus === "completed" && authServiceId && units > 0) {
    return { type: "decrement", authServiceId, units };
  }
  return { type: "none" };
}

/**
 * Determine what unit accounting operations are needed for an UPDATE.
 * Two-step: reverse old (if applicable), then apply new (if applicable).
 * Covers all combinations of status × auth × unit changes.
 */
export function computeUpdateAccountingOps(
  oldStatus: string,
  oldAuthServiceId: string | null,
  oldUnits: number,
  newStatus: string,
  newAuthServiceId: string | null,
  newUnits: number,
): { reverse: UnitAccountingOp; apply: UnitAccountingOp } {
  const reverse: UnitAccountingOp =
    oldStatus === "completed" && oldAuthServiceId && oldUnits > 0
      ? { type: "decrement", authServiceId: oldAuthServiceId, units: oldUnits }
      : { type: "none" };

  const apply: UnitAccountingOp =
    newStatus === "completed" && newAuthServiceId && newUnits > 0
      ? { type: "increment", authServiceId: newAuthServiceId, units: newUnits }
      : { type: "none" };

  return { reverse, apply };
}
