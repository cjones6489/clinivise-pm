import { describe, expect, it } from "vitest";
import { NOTE_STATUSES, NOTE_STATUS_LABELS } from "@/lib/constants";

describe("NoteStatusBadge display logic", () => {
  it("missing is a derived status (not in DB NOTE_STATUSES)", () => {
    expect(NOTE_STATUSES).not.toContain("missing");
    expect(NOTE_STATUSES).toContain("draft");
    expect(NOTE_STATUSES).toContain("signed");
  });

  it("NOTE_STATUS_LABELS has entries for draft and signed", () => {
    expect(NOTE_STATUS_LABELS.draft).toBe("Draft");
    expect(NOTE_STATUS_LABELS.signed).toBe("Signed");
  });

  it("DB note statuses are exactly draft and signed", () => {
    expect([...NOTE_STATUSES]).toEqual(["draft", "signed"]);
  });
});
