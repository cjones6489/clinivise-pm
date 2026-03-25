import { describe, it, expect } from "vitest";
import { undefinedToNull, stripUndefined, parseTimeToMinutes, calculateUnitsFromMinutes } from "./utils";

describe("undefinedToNull", () => {
  it("converts undefined values to null", () => {
    const result = undefinedToNull({ a: "hello", b: undefined, c: 42 });
    expect(result).toEqual({ a: "hello", b: null, c: 42 });
  });

  it("preserves null values", () => {
    const result = undefinedToNull({ a: null });
    expect(result).toEqual({ a: null });
  });

  it("preserves empty strings", () => {
    const result = undefinedToNull({ a: "" });
    expect(result).toEqual({ a: "" });
  });

  it("preserves zero", () => {
    const result = undefinedToNull({ a: 0 });
    expect(result).toEqual({ a: 0 });
  });

  it("preserves false", () => {
    const result = undefinedToNull({ a: false });
    expect(result).toEqual({ a: false });
  });

  it("handles empty object", () => {
    const result = undefinedToNull({});
    expect(result).toEqual({});
  });

  it("converts all-undefined object to all-null", () => {
    const result = undefinedToNull({ a: undefined, b: undefined });
    expect(result).toEqual({ a: null, b: null });
  });
});

describe("stripUndefined", () => {
  it("removes undefined keys", () => {
    const result = stripUndefined({ a: "hello", b: undefined, c: 42 });
    expect(result).toEqual({ a: "hello", c: 42 });
    expect("b" in result).toBe(false);
  });

  it("preserves null values", () => {
    const result = stripUndefined({ a: null, b: undefined });
    expect(result).toEqual({ a: null });
    expect("a" in result).toBe(true);
  });

  it("preserves empty strings", () => {
    const result = stripUndefined({ a: "", b: undefined });
    expect(result).toEqual({ a: "" });
  });

  it("preserves zero and false", () => {
    const result = stripUndefined({ a: 0, b: false, c: undefined });
    expect(result).toEqual({ a: 0, b: false });
  });

  it("handles empty object", () => {
    const result = stripUndefined({});
    expect(result).toEqual({});
  });

  it("returns empty object when all values are undefined", () => {
    const result = stripUndefined({ a: undefined, b: undefined });
    expect(result).toEqual({});
  });
});

// ── parseTimeToMinutes ──────────────────────────────────────────────────────

describe("parseTimeToMinutes", () => {
  it("parses midnight", () => {
    expect(parseTimeToMinutes("00:00")).toBe(0);
  });

  it("parses morning time", () => {
    expect(parseTimeToMinutes("09:30")).toBe(570);
  });

  it("parses noon", () => {
    expect(parseTimeToMinutes("12:00")).toBe(720);
  });

  it("parses afternoon time", () => {
    expect(parseTimeToMinutes("14:30")).toBe(870);
  });

  it("parses end of day", () => {
    expect(parseTimeToMinutes("23:59")).toBe(1439);
  });

  it("parses single-digit minutes", () => {
    expect(parseTimeToMinutes("08:05")).toBe(485);
  });
});

// ── calculateUnitsFromMinutes (CMS 8-minute rule) ───────────────────────────

describe("calculateUnitsFromMinutes", () => {
  it("0 minutes = 0 units", () => {
    expect(calculateUnitsFromMinutes(0)).toBe(0);
  });

  it("7 minutes = 0 units (below 8-minute threshold)", () => {
    expect(calculateUnitsFromMinutes(7)).toBe(0);
  });

  it("8 minutes = 1 unit (meets threshold)", () => {
    expect(calculateUnitsFromMinutes(8)).toBe(1);
  });

  it("15 minutes = 1 unit (exact unit)", () => {
    expect(calculateUnitsFromMinutes(15)).toBe(1);
  });

  it("22 minutes = 1 unit (15 + 7 remainder below threshold)", () => {
    expect(calculateUnitsFromMinutes(22)).toBe(1);
  });

  it("23 minutes = 2 units (15 + 8 remainder meets threshold)", () => {
    expect(calculateUnitsFromMinutes(23)).toBe(2);
  });

  it("30 minutes = 2 units", () => {
    expect(calculateUnitsFromMinutes(30)).toBe(2);
  });

  it("60 minutes = 4 units", () => {
    expect(calculateUnitsFromMinutes(60)).toBe(4);
  });

  it("120 minutes = 8 units", () => {
    expect(calculateUnitsFromMinutes(120)).toBe(8);
  });

  it("180 minutes = 12 units (typical 3-hour ABA session)", () => {
    expect(calculateUnitsFromMinutes(180)).toBe(12);
  });

  it("negative minutes = -1 (invalid)", () => {
    expect(calculateUnitsFromMinutes(-30)).toBe(-1);
  });
});
