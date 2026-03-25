import { z } from "zod/v4";
import { idSchema, payerTypeSchema, unitCalcMethodSchema, updatedAtSchema } from "./index";

const optionalString = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

export const createPayerSchema = z.object({
  name: z.string().trim().min(1, "Payer name is required"),
  stediPayerId: optionalString,
  payerType: payerTypeSchema.default("commercial"),
  phone: optionalString,
  authPhone: optionalString,
  claimsAddress: optionalString,
  timelyFilingDays: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(365)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  unitCalcMethod: unitCalcMethodSchema.default("ama"),
  notes: optionalString,
  isActive: z.boolean().default(true),
});

export const updatePayerSchema = createPayerSchema
  .omit({ payerType: true, unitCalcMethod: true, isActive: true })
  .partial()
  .extend({
    id: idSchema,
    updatedAt: updatedAtSchema,
    payerType: payerTypeSchema.optional(),
    unitCalcMethod: unitCalcMethodSchema.optional(),
    isActive: z.boolean().optional(),
  });

export type CreatePayerInput = z.input<typeof createPayerSchema>;
export type UpdatePayerInput = z.input<typeof updatePayerSchema>;
