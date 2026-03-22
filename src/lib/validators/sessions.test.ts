import { describe, expect, it } from "vitest";
import { createSessionSchema, updateSessionSchema, cancelSessionSchema } from "./sessions";

describe("createSessionSchema", () => {
  const validBase = {
    clientId: "client_abc",
    providerId: "provider_abc",
    sessionDate: "2026-03-21",
    cptCode: "97153",
    units: 4,
    placeOfService: "12",
    status: "completed",
  };

  it("accepts valid minimal input", () => {
    const result = createSessionSchema.safeParse(validBase);
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      supervisorId: "sup_abc",
      authorizationServiceId: "as_abc",
      startTime: "09:00",
      endTime: "10:00",
      modifierCodes: ["HM"],
      notes: "Good session",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing clientId", () => {
    const { clientId: _, ...rest } = validBase;
    const result = createSessionSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing providerId", () => {
    const { providerId: _, ...rest } = validBase;
    const result = createSessionSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects missing sessionDate", () => {
    const { sessionDate: _, ...rest } = validBase;
    const result = createSessionSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      sessionDate: "03-21-2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing cptCode", () => {
    const { cptCode: _, ...rest } = validBase;
    const result = createSessionSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects invalid cptCode", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      cptCode: "99999",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid placeOfService", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      placeOfService: "ZZ",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });

  // Time pairing
  it("rejects startTime without endTime", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      startTime: "09:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects endTime without startTime", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      endTime: "10:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects endTime before startTime", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      startTime: "14:00",
      endTime: "13:00",
    });
    expect(result.success).toBe(false);
  });

  it("accepts equal start and end times (refinement only checks >)", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      startTime: "09:00",
      endTime: "09:00",
    });
    // equal times fail endTime > startTime
    expect(result.success).toBe(false);
  });

  it("rejects invalid time format", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      startTime: "9:00",
      endTime: "10:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects time with invalid hours", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      startTime: "25:00",
      endTime: "26:00",
    });
    expect(result.success).toBe(false);
  });

  // Unit constraints by status
  it("requires units >= 1 for completed status", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      status: "completed",
      units: 0,
    });
    expect(result.success).toBe(false);
  });

  it("allows units = 0 for scheduled status", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      status: "scheduled",
      units: 0,
    });
    expect(result.success).toBe(true);
  });

  it("allows units = 0 for no_show status", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      status: "no_show",
      units: 0,
    });
    expect(result.success).toBe(true);
  });

  it("allows units = 0 for cancelled status", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      status: "cancelled",
      units: 0,
    });
    expect(result.success).toBe(true);
  });

  // Coercion
  it("coerces string units to number", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      units: "4",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.units).toBe(4);
    }
  });

  it("rejects negative units", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      units: -1,
    });
    expect(result.success).toBe(false);
  });

  // Empty string transforms
  it("transforms empty supervisorId to undefined", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      supervisorId: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.supervisorId).toBeUndefined();
    }
  });

  it("transforms empty notes to undefined", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      notes: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.notes).toBeUndefined();
    }
  });

  it("transforms empty authorizationServiceId to undefined", () => {
    const result = createSessionSchema.safeParse({
      ...validBase,
      authorizationServiceId: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.authorizationServiceId).toBeUndefined();
    }
  });

  // Defaults
  it("defaults status to completed", () => {
    const { status: _, ...rest } = validBase;
    const result = createSessionSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("completed");
    }
  });

  it("defaults placeOfService to 12", () => {
    const { placeOfService: _, ...rest } = validBase;
    const result = createSessionSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.placeOfService).toBe("12");
    }
  });
});

describe("updateSessionSchema", () => {
  const validUpdate = {
    id: "session_abc",
    clientId: "client_abc",
    providerId: "provider_abc",
    sessionDate: "2026-03-21",
    cptCode: "97153",
    units: 4,
    placeOfService: "12",
    status: "completed",
  };

  it("accepts valid update input", () => {
    const result = updateSessionSchema.safeParse(validUpdate);
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const { id: _, ...rest } = validUpdate;
    const result = updateSessionSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });

  it("rejects empty id", () => {
    const result = updateSessionSchema.safeParse({ ...validUpdate, id: "" });
    expect(result.success).toBe(false);
  });
});

describe("cancelSessionSchema", () => {
  it("accepts valid cancel with reason", () => {
    const result = cancelSessionSchema.safeParse({
      id: "session_abc",
      reason: "Client no-show",
    });
    expect(result.success).toBe(true);
  });

  it("accepts cancel without reason", () => {
    const result = cancelSessionSchema.safeParse({ id: "session_abc" });
    expect(result.success).toBe(true);
  });

  it("transforms empty reason to undefined", () => {
    const result = cancelSessionSchema.safeParse({
      id: "session_abc",
      reason: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.reason).toBeUndefined();
    }
  });

  it("rejects missing id", () => {
    const result = cancelSessionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects empty id", () => {
    const result = cancelSessionSchema.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });
});
