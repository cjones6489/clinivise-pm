import { z } from "zod/v4";
import { idSchema, dateStringSchema, authStatusSchema, updatedAtSchema } from "./index";
import { ABA_CPT_CODES, SERVICE_FREQUENCIES, AUTH_TYPES } from "@/lib/constants";

const cptCodes = Object.keys(ABA_CPT_CODES) as [string, ...string[]];

const NONE_VALUE = "__none__";

const serviceLineSchema = z.object({
  id: z.string().optional(),
  cptCode: z.enum(cptCodes, { message: "Select a CPT code" }),
  approvedUnits: z.coerce.number().int().min(1, "At least 1 unit required"),
  frequency: z
    .string()
    .optional()
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v))
    .pipe(z.enum(SERVICE_FREQUENCIES).optional()),
  maxUnitsPerDay: z
    .union([z.literal(""), z.coerce.number().int().min(0)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  maxUnitsPerWeek: z
    .union([z.literal(""), z.coerce.number().int().min(0)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  notes: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

const optionalText = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

const authorizationFieldsSchema = z.object({
  clientId: idSchema,
  payerId: idSchema,
  clientInsuranceId: idSchema,
  previousAuthorizationId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v)),
  authorizationNumber: optionalText,
  authType: z
    .string()
    .optional()
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v))
    .pipe(z.enum(AUTH_TYPES).optional()),
  requestingProviderId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v)),
  status: authStatusSchema.default("pending"),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  diagnosisCode: optionalText,
  denialReason: optionalText,
  appealDeadline: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  notes: optionalText,
  services: z
    .array(serviceLineSchema)
    .min(1, "At least one service line is required")
    .max(10, "Maximum 10 service lines allowed"),
});

function noDuplicateCptCodes(data: { services: { cptCode: string }[] }) {
  const codes = data.services.map((s) => s.cptCode);
  return new Set(codes).size === codes.length;
}

function endDateAfterStartDate(data: { startDate: string; endDate: string }) {
  return data.endDate >= data.startDate;
}

export const createAuthorizationSchema = authorizationFieldsSchema
  .refine(endDateAfterStartDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine(noDuplicateCptCodes, {
    message: "Duplicate CPT codes are not allowed",
    path: ["services"],
  });

export const updateAuthorizationSchema = authorizationFieldsSchema
  .extend({ id: idSchema, updatedAt: updatedAtSchema })
  .refine(endDateAfterStartDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine(noDuplicateCptCodes, {
    message: "Duplicate CPT codes are not allowed",
    path: ["services"],
  });

export type CreateAuthorizationInput = z.input<typeof createAuthorizationSchema>;
export type UpdateAuthorizationInput = z.input<typeof updateAuthorizationSchema>;
export type ServiceLineInput = z.input<typeof serviceLineSchema>;
