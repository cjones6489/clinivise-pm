import { describe, expect, it } from "vitest";
import {
  getUtilizationLevel,
  LEVEL_COLORS,
  unitsToHours,
} from "./utilization-bar";

describe("getUtilizationLevel", () => {
  it("returns 'on-track' for utilization below 80%", () => {
    expect(getUtilizationLevel(0)).toBe("on-track");
    expect(getUtilizationLevel(50)).toBe("on-track");
    expect(getUtilizationLevel(79)).toBe("on-track");
  });

  it("returns 'warning' at exactly 80%", () => {
    expect(getUtilizationLevel(80)).toBe("warning");
  });

  it("returns 'warning' between 80% and 94%", () => {
    expect(getUtilizationLevel(85)).toBe("warning");
    expect(getUtilizationLevel(94)).toBe("warning");
  });

  it("returns 'critical' at exactly 95%", () => {
    expect(getUtilizationLevel(95)).toBe("critical");
  });

  it("returns 'critical' between 95% and 100%", () => {
    expect(getUtilizationLevel(99)).toBe("critical");
    expect(getUtilizationLevel(100)).toBe("critical");
  });

  it("returns 'over-utilized' above 100%", () => {
    expect(getUtilizationLevel(101)).toBe("over-utilized");
    expect(getUtilizationLevel(110)).toBe("over-utilized");
    expect(getUtilizationLevel(200)).toBe("over-utilized");
  });
});

describe("LEVEL_COLORS", () => {
  it("has distinct labels for each level (color-blind accessibility)", () => {
    const labels = Object.values(LEVEL_COLORS).map((c) => c.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("on-track label is 'On track'", () => {
    expect(LEVEL_COLORS["on-track"].label).toBe("On track");
  });

  it("warning label is 'Nearing limit'", () => {
    expect(LEVEL_COLORS["warning"].label).toBe("Nearing limit");
  });

  it("critical label is 'At limit'", () => {
    expect(LEVEL_COLORS["critical"].label).toBe("At limit");
  });

  it("over-utilized label is 'Over-utilized'", () => {
    expect(LEVEL_COLORS["over-utilized"].label).toBe("Over-utilized");
  });
});

describe("unitsToHours", () => {
  it("converts 0 units to 0.0 hours", () => {
    expect(unitsToHours(0)).toBe("0.0");
  });

  it("converts 4 units to 1.0 hours (4 × 15 / 60)", () => {
    expect(unitsToHours(4)).toBe("1.0");
  });

  it("converts 32 units to 8.0 hours", () => {
    expect(unitsToHours(32)).toBe("8.0");
  });

  it("converts 1 unit to 0.3 hours (15 min, rounded to 1 decimal)", () => {
    // 1 × 15 / 60 = 0.25, toFixed(1) rounds to "0.3"
    expect(unitsToHours(1)).toBe("0.3");
  });

  it("converts 10 units to 2.5 hours", () => {
    expect(unitsToHours(10)).toBe("2.5");
  });
});
