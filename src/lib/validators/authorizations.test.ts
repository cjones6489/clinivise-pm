import { describe, it, expect } from "vitest";
import { createAuthorizationSchema, updateAuthorizationSchema } from "./authorizations";
import { undefinedToNull, stripUndefined } from "@/lib/utils";

const validService = {
  cptCode: "97153",
  approvedUnits: 100,
};

const validInput = {
  clientId: "client_123",
  payerId: "payer_123",
  clientInsuranceId: "ins_123",
  startDate: "2026-01-01",
  endDate: "2026-06-30",
  services: [validService],
};

describe("createAuthorizationSchema", () => {
  it("accepts valid minimal input", () => {
    const result = createAuthorizationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts valid full input", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      authorizationNumber: "AUTH-001",
      status: "approved",
      diagnosisCode: "F84.0",
      notes: "Some notes",
      previousAuthorizationId: "prev_123",
      services: [
        {
          cptCode: "97153",
          approvedUnits: 100,
          frequency: "weekly",
          maxUnitsPerDay: 8,
          maxUnitsPerWeek: 40,
          notes: "Direct therapy",
        },
        {
          cptCode: "97155",
          approvedUnits: 24,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to pending", () => {
    const result = createAuthorizationSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("pending");
    }
  });

  it("rejects missing clientId", () => {
    const { clientId: _, ...without } = validInput;
    const result = createAuthorizationSchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  it("rejects missing payerId", () => {
    const { payerId: _, ...without } = validInput;
    const result = createAuthorizationSchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  it("rejects missing clientInsuranceId", () => {
    const { clientInsuranceId: _, ...without } = validInput;
    const result = createAuthorizationSchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  it("rejects missing startDate", () => {
    const { startDate: _, ...without } = validInput;
    const result = createAuthorizationSchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  it("rejects missing endDate", () => {
    const { endDate: _, ...without } = validInput;
    const result = createAuthorizationSchema.safeParse(without);
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      startDate: "01/01/2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects endDate before startDate", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      startDate: "2026-06-01",
      endDate: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("accepts same startDate and endDate", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      startDate: "2026-06-01",
      endDate: "2026-06-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty services array", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 service lines", () => {
    const services = Array.from({ length: 11 }, (_, i) => ({
      cptCode: "97153",
      approvedUnits: 10 + i,
    }));
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services,
    });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 10 service lines", () => {
    const cptCodes = [
      "97151",
      "97152",
      "97153",
      "97154",
      "97155",
      "97156",
      "97157",
      "97158",
      "0362T",
      "0373T",
    ];
    const services = cptCodes.map((code) => ({
      cptCode: code,
      approvedUnits: 10,
    }));
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services,
    });
    expect(result.success).toBe(true);
  });

  it("rejects duplicate CPT codes", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [
        { cptCode: "97153", approvedUnits: 100 },
        { cptCode: "97153", approvedUnits: 50 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("accepts different CPT codes", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [
        { cptCode: "97153", approvedUnits: 100 },
        { cptCode: "97155", approvedUnits: 24 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid CPT code", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "99999", approvedUnits: 100 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects zero approved units", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "97153", approvedUnits: 0 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative approved units", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "97153", approvedUnits: -5 }],
    });
    expect(result.success).toBe(false);
  });

  it("coerces string approvedUnits to number", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "97153", approvedUnits: "100" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services[0]!.approvedUnits).toBe(100);
    }
  });

  it("transforms empty optional strings to undefined", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      authorizationNumber: "",
      diagnosisCode: "",
      notes: "",
      previousAuthorizationId: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.authorizationNumber).toBeUndefined();
      expect(result.data.diagnosisCode).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
      expect(result.data.previousAuthorizationId).toBeUndefined();
    }
  });

  it("rejects invalid auth status", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      status: "invalid_status",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid service frequency", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ ...validService, frequency: "weekly" }],
    });
    expect(result.success).toBe(true);
  });

  it("transforms NONE_VALUE previousAuthorizationId to undefined", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      previousAuthorizationId: "__none__",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.previousAuthorizationId).toBeUndefined();
    }
  });

  it("coerces string maxUnitsPerDay to number", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ ...validService, maxUnitsPerDay: "8" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services[0]!.maxUnitsPerDay).toBe(8);
    }
  });

  it("transforms empty string maxUnitsPerDay to undefined", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ ...validService, maxUnitsPerDay: "" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services[0]!.maxUnitsPerDay).toBeUndefined();
    }
  });

  it("accepts dates crossing year boundary", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      startDate: "2025-12-01",
      endDate: "2026-03-31",
    });
    expect(result.success).toBe(true);
  });

  it("rejects endDate in previous year", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      startDate: "2026-01-01",
      endDate: "2025-12-31",
    });
    expect(result.success).toBe(false);
  });

  it("accepts very large approved units", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "97153", approvedUnits: 99999 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects NaN approved units from non-numeric string", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "97153", approvedUnits: "abc" }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects float approved units", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ cptCode: "97153", approvedUnits: 10.5 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid service frequency", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      services: [{ ...validService, frequency: "quarterly" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("updateAuthorizationSchema", () => {
  const validUpdate = { ...validInput, id: "auth_123" };

  it("accepts valid update input", () => {
    const result = updateAuthorizationSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateAuthorizationSchema.safeParse(validInput);
    expect(result.success).toBe(false);
  });

  it("preserves existing service line ids", () => {
    const result = updateAuthorizationSchema.safeParse({
      ...validUpdate,
      services: [{ ...validService, id: "svc_existing" }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services[0]!.id).toBe("svc_existing");
    }
  });

  it("allows mix of new and existing service lines", () => {
    const result = updateAuthorizationSchema.safeParse({
      ...validUpdate,
      services: [
        { ...validService, id: "svc_existing" },
        { cptCode: "97155", approvedUnits: 24 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("always includes clientId in output (required for FK validation)", () => {
    const result = updateAuthorizationSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.clientId).toBe("client_123");
    }
  });

  it("always includes status in output (never undefined)", () => {
    const result = updateAuthorizationSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("pending");
    }
  });

  it("clearing optional fields produces undefined (for undefinedToNull)", () => {
    const result = updateAuthorizationSchema.safeParse({
      ...validUpdate,
      authorizationNumber: "",
      diagnosisCode: "",
      notes: "",
      previousAuthorizationId: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.authorizationNumber).toBeUndefined();
      expect(result.data.diagnosisCode).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
      expect(result.data.previousAuthorizationId).toBeUndefined();
    }
  });

  it("service lines without id are treated as new (no id in output)", () => {
    const result = updateAuthorizationSchema.safeParse({
      ...validUpdate,
      services: [{ cptCode: "97153", approvedUnits: 50 }],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.services[0]!.id).toBeUndefined();
    }
  });

  it("rejects more than 10 service lines on update", () => {
    const services = Array.from({ length: 11 }, (_, i) => ({
      cptCode: "97153",
      approvedUnits: 10 + i,
    }));
    const result = updateAuthorizationSchema.safeParse({
      ...validUpdate,
      services,
    });
    expect(result.success).toBe(false);
  });
});

describe("undefinedToNull interaction (action layer contract)", () => {
  it("cleared optional fields become null via undefinedToNull", () => {
    const result = updateAuthorizationSchema.safeParse({
      ...{ ...validInput, id: "auth_123" },
      authorizationNumber: "",
      notes: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      const { id, services, ...authFields } = result.data;
      const nulled = undefinedToNull(authFields);
      expect(nulled.authorizationNumber).toBeNull();
      expect(nulled.notes).toBeNull();
      // Required fields remain their values, not null
      expect(nulled.clientId).toBe("client_123");
      expect(nulled.payerId).toBe("payer_123");
      expect(nulled.status).toBe("pending");
    }
  });

  it("stripUndefined on create preserves only set fields", () => {
    const result = createAuthorizationSchema.safeParse({
      ...validInput,
      authorizationNumber: "",
      diagnosisCode: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      const { services, ...authFields } = result.data;
      const stripped = stripUndefined(authFields);
      expect("authorizationNumber" in stripped).toBe(false);
      expect("diagnosisCode" in stripped).toBe(false);
      expect(stripped.clientId).toBe("client_123");
    }
  });

  it("service line reconciliation: existingIds extraction", () => {
    const result = updateAuthorizationSchema.safeParse({
      ...{ ...validInput, id: "auth_123" },
      services: [
        { ...validService, id: "svc_1" },
        { ...validService, id: "svc_2", cptCode: "97155" },
        { cptCode: "97156", approvedUnits: 10 },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      const existingIds = result.data.services.filter((s) => s.id).map((s) => s.id!);
      expect(existingIds).toEqual(["svc_1", "svc_2"]);

      const newServices = result.data.services.filter((s) => !s.id);
      expect(newServices).toHaveLength(1);
      expect(newServices[0]!.cptCode).toBe("97156");
    }
  });
});
