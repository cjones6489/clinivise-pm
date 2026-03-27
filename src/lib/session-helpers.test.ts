import { describe, expect, it } from "vitest";
import {
  computeModifierCodes,
  computeActualMinutes,
  isValidStatusTransition,
  computeCreateAccountingOps,
  computeCancelAccountingOps,
  computeUpdateAccountingOps,
} from "./session-helpers";
import { calculateUnits } from "./utils";

// ── computeModifierCodes ────────────────────────────────────────────────────

describe("computeModifierCodes", () => {
  it("adds HM modifier for RBT", () => {
    expect(computeModifierCodes("rbt", "12")).toEqual(["HM"]);
  });

  it("adds HO modifier for BCBA", () => {
    expect(computeModifierCodes("bcba", "12")).toEqual(["HO"]);
  });

  it("adds HP modifier for BCBA-D", () => {
    expect(computeModifierCodes("bcba_d", "12")).toEqual(["HP"]);
  });

  it("adds HN modifier for BCaBA", () => {
    expect(computeModifierCodes("bcaba", "12")).toEqual(["HN"]);
  });

  it("adds no credential modifier for unknown type", () => {
    expect(computeModifierCodes("other", "12")).toEqual([]);
  });

  it("adds telehealth modifier 95 for POS 02, credential first", () => {
    expect(computeModifierCodes("bcba", "02")).toEqual(["HO", "95"]);
  });

  it("adds telehealth modifier 95 for POS 10, credential first", () => {
    expect(computeModifierCodes("rbt", "10")).toEqual(["HM", "95"]);
  });

  it("does not add telehealth modifier for non-telehealth POS", () => {
    expect(computeModifierCodes("bcba", "12")).toEqual(["HO"]);
  });

  it("preserves existing modifiers in CMS priority order", () => {
    const result = computeModifierCodes("rbt", "12", ["GT", "XE"]);
    expect(result).toEqual(["HM", "GT", "XE"]);
  });

  it("sorts credential first, telehealth second, distinct service third", () => {
    const result = computeModifierCodes("rbt", "02", ["59"]);
    expect(result).toEqual(["HM", "95", "59"]);
  });

  it("sorts existing modifiers by priority", () => {
    const result = computeModifierCodes("bcba", "12", ["76", "XP"]);
    expect(result).toEqual(["HO", "XP", "76"]);
  });

  it("unknown modifiers sort last", () => {
    const result = computeModifierCodes("rbt", "12", ["ZZ"]);
    expect(result).toEqual(["HM", "ZZ"]);
  });

  it("deduplicates existing + auto modifiers", () => {
    const result = computeModifierCodes("rbt", "12", ["HM"]);
    expect(result).toEqual(["HM"]);
  });

  it("returns empty array for unknown credential + non-telehealth POS", () => {
    expect(computeModifierCodes("other", "11")).toEqual([]);
  });

  it("handles undefined existingModifiers", () => {
    expect(computeModifierCodes("rbt", "12", undefined)).toEqual(["HM"]);
  });

  it("handles empty array existingModifiers", () => {
    expect(computeModifierCodes("rbt", "12", [])).toEqual(["HM"]);
  });

  it("throws ConflictError when total modifiers exceed 4", () => {
    expect(() => computeModifierCodes("rbt", "02", ["59", "XP", "76"])).toThrow(
      "Too many modifiers (5)",
    );
  });

  it("allows exactly 4 modifiers", () => {
    const result = computeModifierCodes("rbt", "02", ["59", "XP"]);
    expect(result).toEqual(["HM", "95", "59", "XP"]);
    expect(result).toHaveLength(4);
  });

  it("deduplicates when user passes auto-computed modifier", () => {
    // User passes "HM" and "95" which are also auto-computed
    const result = computeModifierCodes("rbt", "02", ["HM", "95"]);
    expect(result).toEqual(["HM", "95"]);
  });

  it("allows GT and 95 together (both tier 2)", () => {
    const result = computeModifierCodes("rbt", "02", ["GT"]);
    expect(result).toEqual(["HM", "GT", "95"]);
  });

  it("does not add 95 for non-telehealth POS codes", () => {
    for (const pos of ["03", "11", "12", "99"]) {
      const result = computeModifierCodes("bcba", pos);
      expect(result).not.toContain("95");
    }
  });
});

// ── computeActualMinutes ────────────────────────────────────────────────────

describe("computeActualMinutes", () => {
  it("returns nulls when startTime is missing", () => {
    const result = computeActualMinutes("2026-03-21", undefined, "10:00");
    expect(result.startTimestamp).toBeNull();
    expect(result.endTimestamp).toBeNull();
    expect(result.actualMinutes).toBeNull();
  });

  it("returns nulls when endTime is missing", () => {
    const result = computeActualMinutes("2026-03-21", "09:00", undefined);
    expect(result.startTimestamp).toBeNull();
    expect(result.endTimestamp).toBeNull();
    expect(result.actualMinutes).toBeNull();
  });

  it("returns nulls when both times missing", () => {
    const result = computeActualMinutes("2026-03-21");
    expect(result.actualMinutes).toBeNull();
  });

  it("calculates 60 minutes for a 1-hour session", () => {
    const result = computeActualMinutes("2026-03-21", "09:00", "10:00");
    expect(result.actualMinutes).toBe(60);
  });

  it("calculates 30 minutes for a half-hour session", () => {
    const result = computeActualMinutes("2026-03-21", "14:00", "14:30");
    expect(result.actualMinutes).toBe(30);
  });

  it("calculates 120 minutes for a 2-hour session", () => {
    const result = computeActualMinutes("2026-03-21", "08:00", "10:00");
    expect(result.actualMinutes).toBe(120);
  });

  it("calculates 15 minutes for a single-unit session", () => {
    const result = computeActualMinutes("2026-03-21", "09:00", "09:15");
    expect(result.actualMinutes).toBe(15);
  });

  it("returns valid Date timestamps", () => {
    const result = computeActualMinutes("2026-03-21", "09:00", "10:00");
    expect(result.startTimestamp).toBeInstanceOf(Date);
    expect(result.endTimestamp).toBeInstanceOf(Date);
    expect(result.startTimestamp!.getTime()).toBeLessThan(result.endTimestamp!.getTime());
  });

  it("handles sessions crossing noon correctly", () => {
    const result = computeActualMinutes("2026-03-21", "11:30", "12:30");
    expect(result.actualMinutes).toBe(60);
  });

  it("returns negative minutes if endTime before startTime", () => {
    const result = computeActualMinutes("2026-03-21", "14:00", "13:00");
    expect(result.actualMinutes).toBe(-60);
  });

  it("returns 0 minutes for equal start and end times", () => {
    const result = computeActualMinutes("2026-03-21", "09:00", "09:00");
    expect(result.actualMinutes).toBe(0);
  });
});

// ── isValidStatusTransition ─────────────────────────────────────────────────

describe("isValidStatusTransition", () => {
  // Same status = always valid
  it("allows same-status (no transition)", () => {
    expect(isValidStatusTransition("completed", "completed")).toBe(true);
    expect(isValidStatusTransition("scheduled", "scheduled")).toBe(true);
    expect(isValidStatusTransition("cancelled", "cancelled")).toBe(true);
  });

  // Valid transitions
  it("allows scheduled → completed", () => {
    expect(isValidStatusTransition("scheduled", "completed")).toBe(true);
  });

  it("allows scheduled → cancelled", () => {
    expect(isValidStatusTransition("scheduled", "cancelled")).toBe(true);
  });

  it("allows scheduled → no_show", () => {
    expect(isValidStatusTransition("scheduled", "no_show")).toBe(true);
  });

  it("allows completed → cancelled", () => {
    expect(isValidStatusTransition("completed", "cancelled")).toBe(true);
  });

  it("allows completed → flagged", () => {
    expect(isValidStatusTransition("completed", "flagged")).toBe(true);
  });

  it("allows flagged → completed", () => {
    expect(isValidStatusTransition("flagged", "completed")).toBe(true);
  });

  it("allows flagged → cancelled", () => {
    expect(isValidStatusTransition("flagged", "cancelled")).toBe(true);
  });

  // Invalid transitions
  it("rejects cancelled → completed", () => {
    expect(isValidStatusTransition("cancelled", "completed")).toBe(false);
  });

  it("rejects cancelled → scheduled", () => {
    expect(isValidStatusTransition("cancelled", "scheduled")).toBe(false);
  });

  it("rejects no_show → completed", () => {
    expect(isValidStatusTransition("no_show", "completed")).toBe(false);
  });

  it("rejects no_show → scheduled", () => {
    expect(isValidStatusTransition("no_show", "scheduled")).toBe(false);
  });

  it("rejects completed → scheduled", () => {
    expect(isValidStatusTransition("completed", "scheduled")).toBe(false);
  });

  it("rejects completed → no_show", () => {
    expect(isValidStatusTransition("completed", "no_show")).toBe(false);
  });

  it("rejects scheduled → flagged", () => {
    expect(isValidStatusTransition("scheduled", "flagged")).toBe(false);
  });

  // Edge: unknown status
  it("rejects unknown status", () => {
    expect(isValidStatusTransition("invalid", "completed")).toBe(false);
  });
});

// ── calculateUnits (CMS 8-minute rule) ──────────────────────────────────────

describe("calculateUnits (CMS 8-minute rule)", () => {
  function makeDate(minutes: number): [Date, Date] {
    const start = new Date("2026-01-01T09:00:00");
    const end = new Date(start.getTime() + minutes * 60000);
    return [start, end];
  }

  it("returns 0 for 0 minutes", () => {
    const [s, e] = makeDate(0);
    expect(calculateUnits(s, e)).toBe(0);
  });

  it("returns 0 for 7 minutes (below 8-minute threshold)", () => {
    const [s, e] = makeDate(7);
    expect(calculateUnits(s, e)).toBe(0);
  });

  it("returns 1 for 8 minutes (exactly at threshold)", () => {
    const [s, e] = makeDate(8);
    expect(calculateUnits(s, e)).toBe(1);
  });

  it("returns 1 for 15 minutes (exactly 1 unit)", () => {
    const [s, e] = makeDate(15);
    expect(calculateUnits(s, e)).toBe(1);
  });

  it("returns 1 for 22 minutes (15 + 7, remainder < 8)", () => {
    const [s, e] = makeDate(22);
    expect(calculateUnits(s, e)).toBe(1);
  });

  it("returns 2 for 23 minutes (15 + 8, remainder = 8)", () => {
    const [s, e] = makeDate(23);
    expect(calculateUnits(s, e)).toBe(2);
  });

  it("returns 2 for 30 minutes (exactly 2 units)", () => {
    const [s, e] = makeDate(30);
    expect(calculateUnits(s, e)).toBe(2);
  });

  it("returns 4 for 60 minutes (exactly 4 units)", () => {
    const [s, e] = makeDate(60);
    expect(calculateUnits(s, e)).toBe(4);
  });

  it("returns 4 for 67 minutes (60 + 7, remainder < 8)", () => {
    const [s, e] = makeDate(67);
    expect(calculateUnits(s, e)).toBe(4);
  });

  it("returns 5 for 68 minutes (60 + 8, remainder = 8)", () => {
    const [s, e] = makeDate(68);
    expect(calculateUnits(s, e)).toBe(5);
  });

  it("returns 8 for 120 minutes (2-hour session)", () => {
    const [s, e] = makeDate(120);
    expect(calculateUnits(s, e)).toBe(8);
  });

  it("returns -1 for negative duration (endTime before startTime)", () => {
    const start = new Date("2026-01-01T10:00:00");
    const end = new Date("2026-01-01T09:00:00");
    expect(calculateUnits(start, end)).toBe(-1);
  });

  it("returns 1 for exactly 14 minutes (14 < 15, remainder 14 >= 8)", () => {
    const [s, e] = makeDate(14);
    expect(calculateUnits(s, e)).toBe(1);
  });

  it("returns 2 for 28 minutes (1 full unit + 13 remainder >= 8)", () => {
    const [s, e] = makeDate(28);
    expect(calculateUnits(s, e)).toBe(2);
  });

  // ABA typical session lengths
  it("handles typical 2.5-hour ABA session (150 min = 10 units)", () => {
    const [s, e] = makeDate(150);
    expect(calculateUnits(s, e)).toBe(10);
  });

  it("handles typical 3-hour ABA session (180 min = 12 units)", () => {
    const [s, e] = makeDate(180);
    expect(calculateUnits(s, e)).toBe(12);
  });
});

// ── computeCreateAccountingOps ──────────────────────────────────────────────

describe("computeCreateAccountingOps", () => {
  it("increments when completed with auth service", () => {
    const op = computeCreateAccountingOps("completed", "auth_svc_1", 4);
    expect(op).toEqual({ type: "increment", authServiceId: "auth_svc_1", units: 4 });
  });

  it("returns none for scheduled status", () => {
    const op = computeCreateAccountingOps("scheduled", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none for no_show status", () => {
    const op = computeCreateAccountingOps("no_show", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none for cancelled status", () => {
    const op = computeCreateAccountingOps("cancelled", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none when no auth service (private pay)", () => {
    const op = computeCreateAccountingOps("completed", null, 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none when units is 0", () => {
    const op = computeCreateAccountingOps("completed", "auth_svc_1", 0);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none for flagged status", () => {
    const op = computeCreateAccountingOps("flagged", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });
});

// ── computeCancelAccountingOps ──────────────────────────────────────────────

describe("computeCancelAccountingOps", () => {
  it("decrements when cancelling a completed session with auth", () => {
    const op = computeCancelAccountingOps("completed", "auth_svc_1", 4);
    expect(op).toEqual({ type: "decrement", authServiceId: "auth_svc_1", units: 4 });
  });

  it("returns none when cancelling a scheduled session", () => {
    const op = computeCancelAccountingOps("scheduled", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none when cancelling a no_show", () => {
    const op = computeCancelAccountingOps("no_show", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none when completed but no auth service", () => {
    const op = computeCancelAccountingOps("completed", null, 4);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none when completed with auth but 0 units", () => {
    const op = computeCancelAccountingOps("completed", "auth_svc_1", 0);
    expect(op).toEqual({ type: "none" });
  });

  it("returns none when cancelling a flagged session", () => {
    const op = computeCancelAccountingOps("flagged", "auth_svc_1", 4);
    expect(op).toEqual({ type: "none" });
  });
});

// ── computeUpdateAccountingOps ──────────────────────────────────────────────

describe("computeUpdateAccountingOps", () => {
  // No change scenarios
  it("no-op when status stays scheduled", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "scheduled",
      null,
      0,
      "scheduled",
      null,
      0,
    );
    expect(reverse).toEqual({ type: "none" });
    expect(apply).toEqual({ type: "none" });
  });

  it("no-op when completed stays completed, same auth, same units", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "completed",
      "auth_1",
      4,
    );
    // Still reverse + apply (this ensures DB stays consistent)
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_1", units: 4 });
  });

  // Status change: scheduled → completed (new units applied)
  it("only applies when changing from scheduled to completed", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "scheduled",
      null,
      0,
      "completed",
      "auth_1",
      4,
    );
    expect(reverse).toEqual({ type: "none" });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_1", units: 4 });
  });

  // Status change: completed → cancelled (old units reversed)
  it("only reverses when changing from completed to cancelled", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "cancelled",
      "auth_1",
      4,
    );
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "none" });
  });

  // Unit change: completed with same auth, different units
  it("reverse old + apply new when units change on same auth", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "completed",
      "auth_1",
      6,
    );
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_1", units: 6 });
  });

  // Auth change: completed, moved to different auth service
  it("reverse old auth + apply new auth when auth service changes", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "completed",
      "auth_2",
      4,
    );
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_2", units: 4 });
  });

  // Auth removed: completed → completed but auth removed
  it("reverse only when auth service removed from completed session", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "completed",
      null,
      4,
    );
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "none" });
  });

  // Auth added: completed without auth → completed with auth
  it("apply only when auth service added to completed session", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      null,
      4,
      "completed",
      "auth_1",
      4,
    );
    expect(reverse).toEqual({ type: "none" });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_1", units: 4 });
  });

  // Status + auth change: completed w/ auth → flagged (units reversed)
  it("reverses when status changes from completed to flagged", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "flagged",
      "auth_1",
      4,
    );
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "none" });
  });

  // Status + auth change: flagged → completed (units applied)
  it("applies when status changes from flagged to completed", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "flagged",
      "auth_1",
      4,
      "completed",
      "auth_1",
      4,
    );
    expect(reverse).toEqual({ type: "none" });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_1", units: 4 });
  });

  // Edge: everything changes at once (status + auth + units)
  it("handles simultaneous status + auth + unit change", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "completed",
      "auth_1",
      4,
      "completed",
      "auth_2",
      8,
    );
    expect(reverse).toEqual({ type: "decrement", authServiceId: "auth_1", units: 4 });
    expect(apply).toEqual({ type: "increment", authServiceId: "auth_2", units: 8 });
  });

  // Edge: no_show with auth (shouldn't happen, but if it does)
  it("no-op for no_show → no_show", () => {
    const { reverse, apply } = computeUpdateAccountingOps(
      "no_show",
      "auth_1",
      0,
      "no_show",
      "auth_1",
      0,
    );
    expect(reverse).toEqual({ type: "none" });
    expect(apply).toEqual({ type: "none" });
  });
});
