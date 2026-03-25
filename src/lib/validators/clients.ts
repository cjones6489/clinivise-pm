import { z } from "zod/v4";
import {
  idSchema,
  dateStringSchema,
  clientStatusSchema,
  referralSourceSchema,
  genderSchema,
  updatedAtSchema,
} from "./index";

const NONE_VALUE = "__none__";

const clientFieldsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  dateOfBirth: dateStringSchema,
  gender: z
    .string()
    .optional()
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v))
    .pipe(genderSchema.optional()),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  email: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  addressLine1: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  addressLine2: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  city: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  state: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  zipCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  diagnosisCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  diagnosisDescription: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  assignedBcbaId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v)),
  intakeDate: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  status: clientStatusSchema.default("inquiry"),
  referralSource: z
    .string()
    .optional()
    .transform((v) => (v === NONE_VALUE || !v ? undefined : v))
    .pipe(referralSourceSchema.optional()),
  holdReason: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  notes: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

const holdReasonRefinement = (d: { status?: string; holdReason?: string }) =>
  d.status !== "on_hold" || (!!d.holdReason && d.holdReason.trim().length > 0);

const holdReasonRefinementConfig = {
  message: "Hold reason is required when status is On Hold",
  path: ["holdReason"] as PropertyKey[],
};

export const createClientSchema = clientFieldsSchema.refine(
  holdReasonRefinement,
  holdReasonRefinementConfig,
);

export const updateClientSchema = clientFieldsSchema
  .omit({ status: true })
  .partial()
  .extend({ id: idSchema, updatedAt: updatedAtSchema, status: clientStatusSchema.optional() })
  .refine(holdReasonRefinement, holdReasonRefinementConfig);

export type CreateClientInput = z.input<typeof createClientSchema>;
export type UpdateClientInput = z.input<typeof updateClientSchema>;
