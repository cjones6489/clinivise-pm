import { z } from "zod/v4";
import {
  idSchema,
  dateStringSchema,
  sessionStatusSchema,
  placeOfServiceSchema,
  updatedAtSchema,
} from "./index";
import { ABA_CPT_CODES } from "@/lib/constants";

const cptCodes = Object.keys(ABA_CPT_CODES) as [string, ...string[]];

const timeStringSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Time must be HH:MM format")
  .refine(
    (t) => {
      const [h, m] = t.split(":").map(Number);
      return h! >= 0 && h! <= 23 && m! >= 0 && m! <= 59;
    },
    { message: "Invalid time" },
  );

const sessionFieldsSchema = z.object({
  clientId: idSchema,
  providerId: idSchema,
  supervisorId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  authorizationServiceId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  sessionDate: dateStringSchema,
  startTime: z
    .union([z.literal(""), timeStringSchema])
    .optional()
    .transform((v) => v || undefined),
  endTime: z
    .union([z.literal(""), timeStringSchema])
    .optional()
    .transform((v) => v || undefined),
  cptCode: z.enum(cptCodes, { message: "Select a CPT code" }),
  modifierCodes: z
    .array(z.string())
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  units: z.coerce.number().int().min(0, "Units must be 0 or more"),
  placeOfService: placeOfServiceSchema.default("12"),
  status: sessionStatusSchema.default("completed"),
  notes: z
    .string()
    .max(5000, "Notes must be 5,000 characters or fewer")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  idempotencyKey: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

function timePairingValid(data: { startTime?: string; endTime?: string }) {
  // Both provided or both missing
  if (data.startTime && !data.endTime) return false;
  if (!data.startTime && data.endTime) return false;
  return true;
}

function endTimeAfterStartTime(data: { startTime?: string; endTime?: string }) {
  if (!data.startTime || !data.endTime) return true;
  return data.endTime > data.startTime;
}

function timesRequiredWhenCompleted(data: {
  status: string;
  startTime?: string;
  endTime?: string;
}) {
  if (data.status === "completed" && (!data.startTime || !data.endTime)) return false;
  return true;
}

function unitsRequiredWhenCompleted(data: { status: string; units: number }) {
  if (data.status === "completed" && data.units < 1) return false;
  return true;
}

export const createSessionSchema = sessionFieldsSchema
  .refine(timePairingValid, {
    message: "Both start time and end time must be provided together",
    path: ["endTime"],
  })
  .refine(endTimeAfterStartTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine(timesRequiredWhenCompleted, {
    message: "Start and end times are required for completed sessions",
    path: ["startTime"],
  })
  .refine(unitsRequiredWhenCompleted, {
    message: "At least 1 unit required for completed sessions",
    path: ["units"],
  });

export const updateSessionSchema = sessionFieldsSchema
  .extend({ id: idSchema, updatedAt: updatedAtSchema })
  .refine(timePairingValid, {
    message: "Both start time and end time must be provided together",
    path: ["endTime"],
  })
  .refine(endTimeAfterStartTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  })
  .refine(timesRequiredWhenCompleted, {
    message: "Start and end times are required for completed sessions",
    path: ["startTime"],
  })
  .refine(unitsRequiredWhenCompleted, {
    message: "At least 1 unit required for completed sessions",
    path: ["units"],
  });

export const cancelSessionSchema = z.object({
  id: idSchema,
  reason: z
    .string()
    .max(2000, "Reason must be 2,000 characters or fewer")
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

export type CreateSessionInput = z.input<typeof createSessionSchema>;
export type UpdateSessionInput = z.input<typeof updateSessionSchema>;
export type CancelSessionInput = z.input<typeof cancelSessionSchema>;
