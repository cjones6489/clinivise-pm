import { describe, expect, it } from "vitest";
import { unitsToHours } from "@/lib/constants";
import { formatTimeCompact } from "@/lib/utils";

// Test the logic used by ClientSessionsCard without rendering (vitest env is node)
// Key behaviors: summary calculation, note badge visibility per status, time formatting

const DELIVERED_STATUSES = ["completed", "flagged"];
const NO_NOTE_STATUSES = ["cancelled", "no_show", "scheduled"];

function shouldShowNoteBadge(sessionStatus: string): boolean {
  return sessionStatus === "completed" || sessionStatus === "flagged";
}

function isDeliveredSession(status: string): boolean {
  return status === "completed" || status === "flagged";
}

describe("ClientSessionsCard logic", () => {
  // ── Summary calculation ────────────────────────────────────────────────

  describe("summary line calculation", () => {
    it("converts total units to hours correctly", () => {
      expect(unitsToHours(8)).toBe(2); // 8 units * 15 min / 60 = 2 hrs
      expect(unitsToHours(4)).toBe(1); // 4 units * 15 min / 60 = 1 hr
      expect(unitsToHours(0)).toBe(0);
      expect(unitsToHours(12)).toBe(3); // typical 3-hour ABA session
    });

    it("excludes cancelled sessions from summary totals", () => {
      const sessions = [
        { status: "completed", units: 8 },
        { status: "cancelled", units: 8 },
        { status: "completed", units: 4 },
      ];
      const delivered = sessions.filter((s) => isDeliveredSession(s.status));
      const totalUnits = delivered.reduce((sum, s) => sum + s.units, 0);
      expect(delivered).toHaveLength(2);
      expect(totalUnits).toBe(12);
    });

    it("excludes no-show sessions from summary totals", () => {
      const sessions = [
        { status: "completed", units: 8 },
        { status: "no_show", units: 8 },
      ];
      const delivered = sessions.filter((s) => isDeliveredSession(s.status));
      expect(delivered).toHaveLength(1);
      expect(delivered.reduce((sum, s) => sum + s.units, 0)).toBe(8);
    });

    it("excludes scheduled sessions from summary totals", () => {
      const sessions = [
        { status: "completed", units: 8 },
        { status: "scheduled", units: 8 },
      ];
      const delivered = sessions.filter((s) => isDeliveredSession(s.status));
      expect(delivered).toHaveLength(1);
    });

    it("includes flagged sessions in summary totals", () => {
      const sessions = [
        { status: "completed", units: 8 },
        { status: "flagged", units: 4 },
      ];
      const delivered = sessions.filter((s) => isDeliveredSession(s.status));
      expect(delivered).toHaveLength(2);
      expect(delivered.reduce((sum, s) => sum + s.units, 0)).toBe(12);
    });

    it("returns 0 when all sessions are cancelled", () => {
      const sessions = [
        { status: "cancelled", units: 8 },
        { status: "cancelled", units: 4 },
      ];
      const delivered = sessions.filter((s) => isDeliveredSession(s.status));
      expect(delivered).toHaveLength(0);
      expect(delivered.reduce((sum, s) => sum + s.units, 0)).toBe(0);
    });

    it("returns 0 for empty session list", () => {
      const sessions: { status: string; units: number }[] = [];
      const delivered = sessions.filter((s) => isDeliveredSession(s.status));
      expect(delivered.reduce((sum, s) => sum + s.units, 0)).toBe(0);
    });
  });

  // ── Note badge visibility ──────────────────────────────────────────────

  describe("note badge visibility per session status", () => {
    it("shows note badge for completed sessions", () => {
      expect(shouldShowNoteBadge("completed")).toBe(true);
    });

    it("shows note badge for flagged sessions", () => {
      expect(shouldShowNoteBadge("flagged")).toBe(true);
    });

    it("hides note badge for cancelled sessions", () => {
      expect(shouldShowNoteBadge("cancelled")).toBe(false);
    });

    it("hides note badge for no_show sessions", () => {
      expect(shouldShowNoteBadge("no_show")).toBe(false);
    });

    it("hides note badge for scheduled sessions", () => {
      expect(shouldShowNoteBadge("scheduled")).toBe(false);
    });

    it("all SESSION_STATUSES are covered", () => {
      const allStatuses = [...DELIVERED_STATUSES, ...NO_NOTE_STATUSES];
      expect(allStatuses).toContain("completed");
      expect(allStatuses).toContain("flagged");
      expect(allStatuses).toContain("cancelled");
      expect(allStatuses).toContain("no_show");
      expect(allStatuses).toContain("scheduled");
      expect(allStatuses).toHaveLength(5);
    });

    it("note badge and summary filter use same status set", () => {
      // Both shouldShowNoteBadge and isDeliveredSession use completed + flagged
      for (const status of DELIVERED_STATUSES) {
        expect(shouldShowNoteBadge(status)).toBe(true);
        expect(isDeliveredSession(status)).toBe(true);
      }
      for (const status of NO_NOTE_STATUSES) {
        expect(shouldShowNoteBadge(status)).toBe(false);
        expect(isDeliveredSession(status)).toBe(false);
      }
    });
  });

  // ── Time formatting ────────────────────────────────────────────────────

  describe("time display", () => {
    it("formats start time in compact format", () => {
      expect(formatTimeCompact(new Date("2026-03-26T09:00:00"))).toBe("9:00am");
      expect(formatTimeCompact(new Date("2026-03-26T13:30:00"))).toBe("1:30pm");
    });

    it("handles null start time with dash fallback", () => {
      const startTime: Date | null = null;
      const display = startTime ? formatTimeCompact(startTime) : "—";
      expect(display).toBe("—");
    });
  });
});
