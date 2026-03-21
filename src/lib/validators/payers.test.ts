import { describe, it, expect } from "vitest";
import { createPayerSchema, updatePayerSchema } from "./payers";

describe("createPayerSchema", () => {
  it("accepts minimal valid input with defaults", () => {
    const result = createPayerSchema.safeParse({ name: "Aetna" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Aetna");
      expect(result.data.payerType).toBe("commercial");
      expect(result.data.unitCalcMethod).toBe("ama");
      expect(result.data.isActive).toBe(true);
    }
  });

  it("rejects empty name", () => {
    const result = createPayerSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing name", () => {
    const result = createPayerSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("trims name whitespace", () => {
    const result = createPayerSchema.safeParse({ name: "  Blue Cross  " });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Blue Cross");
    }
  });

  it("accepts all valid payer types", () => {
    for (const type of ["commercial", "medicaid", "medicare", "tricare"] as const) {
      const result = createPayerSchema.safeParse({ name: "Test", payerType: type });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid payer type", () => {
    const result = createPayerSchema.safeParse({
      name: "Test",
      payerType: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid timely filing days", () => {
    const result = createPayerSchema.safeParse({
      name: "Test",
      timelyFilingDays: 90,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timelyFilingDays).toBe(90);
    }
  });

  it("rejects timely filing days > 365", () => {
    const result = createPayerSchema.safeParse({
      name: "Test",
      timelyFilingDays: 400,
    });
    expect(result.success).toBe(false);
  });

  it("rejects timely filing days < 1", () => {
    const result = createPayerSchema.safeParse({
      name: "Test",
      timelyFilingDays: 0,
    });
    expect(result.success).toBe(false);
  });

  it("transforms empty string timelyFilingDays to undefined", () => {
    const result = createPayerSchema.safeParse({
      name: "Test",
      timelyFilingDays: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timelyFilingDays).toBeUndefined();
    }
  });

  it("transforms empty optional strings to undefined", () => {
    const result = createPayerSchema.safeParse({
      name: "Test",
      phone: "",
      authPhone: "",
      notes: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
      expect(result.data.authPhone).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
    }
  });

  it("accepts both unit calc methods", () => {
    for (const method of ["cms", "ama"] as const) {
      const result = createPayerSchema.safeParse({
        name: "Test",
        unitCalcMethod: method,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("updatePayerSchema", () => {
  it("requires id", () => {
    const result = updatePayerSchema.safeParse({ name: "Updated" });
    expect(result.success).toBe(false);
  });

  it("accepts partial update with only id", () => {
    const result = updatePayerSchema.safeParse({ id: "payer_123" });
    expect(result.success).toBe(true);
  });

  it("does not silently reset payerType when omitted", () => {
    const result = updatePayerSchema.safeParse({
      id: "payer_123",
      name: "Updated",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.payerType).toBeUndefined();
    }
  });

  it("does not silently reset unitCalcMethod when omitted", () => {
    const result = updatePayerSchema.safeParse({
      id: "payer_123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.unitCalcMethod).toBeUndefined();
    }
  });

  it("does not silently reset isActive when omitted", () => {
    const result = updatePayerSchema.safeParse({
      id: "payer_123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBeUndefined();
    }
  });

  it("accepts isActive toggle", () => {
    const result = updatePayerSchema.safeParse({
      id: "payer_123",
      isActive: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(false);
    }
  });
});
