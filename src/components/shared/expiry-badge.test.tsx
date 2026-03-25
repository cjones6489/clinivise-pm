import { describe, expect, it } from "vitest";
import { getExpiryLevel } from "./expiry-badge";

describe("getExpiryLevel", () => {
  // ── Standard thresholds ─────────────────────────────────────────────────

  it("returns 'safe' for >30 days remaining", () => {
    expect(getExpiryLevel(60, false)).toBe("safe");
    expect(getExpiryLevel(31, false)).toBe("safe");
  });

  it("returns 'warning' for 7-30 days remaining", () => {
    expect(getExpiryLevel(30, false)).toBe("warning");
    expect(getExpiryLevel(14, false)).toBe("warning");
    expect(getExpiryLevel(8, false)).toBe("warning");
  });

  it("returns 'critical' for <7 days remaining", () => {
    expect(getExpiryLevel(7, false)).toBe("critical");
    expect(getExpiryLevel(3, false)).toBe("critical");
    expect(getExpiryLevel(1, false)).toBe("critical");
    expect(getExpiryLevel(0, false)).toBe("critical");
  });

  it("returns 'expired' for negative days", () => {
    expect(getExpiryLevel(-1, false)).toBe("expired");
    expect(getExpiryLevel(-30, false)).toBe("expired");
  });

  // ── Future auths ────────────────────────────────────────────────────────

  it("returns 'future' when isFuture is true regardless of days", () => {
    expect(getExpiryLevel(90, true)).toBe("future");
    expect(getExpiryLevel(5, true)).toBe("future");
  });

  // ── Boundary values ─────────────────────────────────────────────────────

  it("boundary: exactly 30 days is 'warning' (not safe)", () => {
    expect(getExpiryLevel(30, false)).toBe("warning");
  });

  it("boundary: exactly 7 days is 'critical' (not warning)", () => {
    expect(getExpiryLevel(7, false)).toBe("critical");
  });

  it("boundary: exactly 0 days is 'critical' (not expired)", () => {
    expect(getExpiryLevel(0, false)).toBe("critical");
  });
});
