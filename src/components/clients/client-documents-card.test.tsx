import { describe, expect, it } from "vitest";
import { formatFileSize } from "@/lib/utils";
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "@/lib/constants";

describe("formatFileSize", () => {
  it("returns dash for null", () => {
    expect(formatFileSize(null)).toBe("—");
  });

  it("returns '0 B' for zero bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  it("formats bytes under 1KB", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(1)).toBe("1 B");
  });

  it("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(5120)).toBe("5 KB");
    expect(formatFileSize(512000)).toBe("500 KB");
  });

  it("formats megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
    expect(formatFileSize(5242880)).toBe("5.0 MB");
    expect(formatFileSize(10485760)).toBe("10.0 MB");
  });

  it("formats fractional megabytes", () => {
    expect(formatFileSize(1572864)).toBe("1.5 MB");
  });
});

describe("DOCUMENT_TYPE_LABELS", () => {
  it("has a label for every document type", () => {
    for (const dt of DOCUMENT_TYPES) {
      expect(DOCUMENT_TYPE_LABELS[dt]).toBeDefined();
      expect(typeof DOCUMENT_TYPE_LABELS[dt]).toBe("string");
      expect(DOCUMENT_TYPE_LABELS[dt].length).toBeGreaterThan(0);
    }
  });

  it("includes all 7 document types", () => {
    expect(DOCUMENT_TYPES).toHaveLength(7);
    expect(DOCUMENT_TYPES).toContain("authorization_letter");
    expect(DOCUMENT_TYPES).toContain("assessment_report");
    expect(DOCUMENT_TYPES).toContain("treatment_plan");
    expect(DOCUMENT_TYPES).toContain("consent_form");
    expect(DOCUMENT_TYPES).toContain("insurance_card");
    expect(DOCUMENT_TYPES).toContain("progress_report");
    expect(DOCUMENT_TYPES).toContain("other");
  });

  it("has human-readable labels", () => {
    expect(DOCUMENT_TYPE_LABELS.authorization_letter).toBe("Auth Letter");
    expect(DOCUMENT_TYPE_LABELS.consent_form).toBe("Consent Form");
    expect(DOCUMENT_TYPE_LABELS.other).toBe("Other");
  });
});
