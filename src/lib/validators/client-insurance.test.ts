import { describe, it, expect } from "vitest";
import {
  createInsuranceSchema,
  updateInsuranceSchema,
  verifyInsuranceSchema,
} from "./client-insurance";

describe("createInsuranceSchema", () => {
  const validInput = {
    clientId: "client_123",
    payerId: "payer_456",
    memberId: "MEM001",
  };

  it("accepts minimal valid input with defaults", () => {
    const result = createInsuranceSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.relationshipToSubscriber).toBe("child");
      expect(result.data.priority).toBe(1);
    }
  });

  it("rejects missing memberId", () => {
    const result = createInsuranceSchema.safeParse({
      clientId: "client_123",
      payerId: "payer_456",
      memberId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing clientId", () => {
    const result = createInsuranceSchema.safeParse({
      payerId: "payer_456",
      memberId: "MEM001",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing payerId", () => {
    const result = createInsuranceSchema.safeParse({
      clientId: "client_123",
      memberId: "MEM001",
    });
    expect(result.success).toBe(false);
  });

  it("trims memberId whitespace", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      memberId: "  MEM001  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.memberId).toBe("MEM001");
    }
  });

  it("transforms empty optional strings to undefined", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      groupNumber: "",
      planName: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.groupNumber).toBeUndefined();
      expect(result.data.planName).toBeUndefined();
    }
  });

  it("accepts valid effectiveDate", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      effectiveDate: "2025-01-01",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.effectiveDate).toBe("2025-01-01");
    }
  });

  it("rejects invalid date format", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      effectiveDate: "01/01/2025",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date value (Feb 29 non-leap year)", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      effectiveDate: "2025-02-29",
    });
    expect(result.success).toBe(false);
  });

  it("transforms empty date to undefined", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      effectiveDate: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.effectiveDate).toBeUndefined();
    }
  });

  it("accepts all valid subscriber relationships", () => {
    for (const rel of ["self", "spouse", "child", "other"] as const) {
      const result = createInsuranceSchema.safeParse({
        ...validInput,
        relationshipToSubscriber: rel,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid subscriber relationship", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      relationshipToSubscriber: "parent",
    });
    expect(result.success).toBe(false);
  });

  it("rejects priority > 3", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      priority: 4,
    });
    expect(result.success).toBe(false);
  });

  it("rejects priority < 1", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      priority: 0,
    });
    expect(result.success).toBe(false);
  });

  it("coerces string priority to number", () => {
    const result = createInsuranceSchema.safeParse({
      ...validInput,
      priority: "2",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priority).toBe(2);
    }
  });

  it("accepts valid subscriber gender", () => {
    for (const g of ["M", "F", "U"] as const) {
      const result = createInsuranceSchema.safeParse({
        ...validInput,
        subscriberGender: g,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("updateInsuranceSchema", () => {
  it("requires id", () => {
    const result = updateInsuranceSchema.safeParse({
      memberId: "NEW001",
    });
    expect(result.success).toBe(false);
  });

  it("accepts partial update with only id", () => {
    const result = updateInsuranceSchema.safeParse({
      id: "ins_123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts partial memberId update", () => {
    const result = updateInsuranceSchema.safeParse({
      id: "ins_123",
      memberId: "NEW001",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.memberId).toBe("NEW001");
    }
  });

  it("does not silently reset relationshipToSubscriber when omitted", () => {
    const result = updateInsuranceSchema.safeParse({
      id: "ins_123",
      memberId: "NEW001",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // Should be undefined, not "child" (the create default)
      expect(result.data.relationshipToSubscriber).toBeUndefined();
    }
  });

  it("does not silently reset priority when omitted", () => {
    const result = updateInsuranceSchema.safeParse({
      id: "ins_123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // Should be undefined, not 1 (the create default)
      expect(result.data.priority).toBeUndefined();
    }
  });
});

describe("verifyInsuranceSchema", () => {
  it("accepts valid verification statuses", () => {
    for (const status of ["unverified", "verified", "failed"] as const) {
      const result = verifyInsuranceSchema.safeParse({
        id: "ins_123",
        verificationStatus: status,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid verification status", () => {
    const result = verifyInsuranceSchema.safeParse({
      id: "ins_123",
      verificationStatus: "pending",
    });
    expect(result.success).toBe(false);
  });

  it("requires both id and verificationStatus", () => {
    expect(verifyInsuranceSchema.safeParse({ id: "ins_123" }).success).toBe(false);
    expect(verifyInsuranceSchema.safeParse({ verificationStatus: "verified" }).success).toBe(false);
  });
});
