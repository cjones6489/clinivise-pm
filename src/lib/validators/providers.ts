import { z } from "zod/v4";
import {
  credentialTypeSchema,
  idSchema,
  npiSchema,
  dateStringSchema,
  updatedAtSchema,
} from "./index";

const optionalText = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

export const createProviderSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  credentialType: credentialTypeSchema,
  npi: npiSchema.or(z.literal("")).transform((v) => v || undefined),
  credentialNumber: optionalText,
  credentialExpiry: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  stateLicenseNumber: optionalText,
  stateLicenseExpiry: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  taxonomyCode: optionalText,
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v.toLowerCase() : undefined)),
  phone: optionalText,
  modifierCode: optionalText,
  supervisorId: optionalText,
  isActive: z.boolean().default(true),
});

export const updateProviderSchema = createProviderSchema
  .omit({ isActive: true })
  .partial()
  .extend({ id: idSchema, updatedAt: updatedAtSchema, isActive: z.boolean().optional() })
  .refine((d) => !d.supervisorId || d.supervisorId !== d.id, {
    message: "Cannot be own supervisor",
    path: ["supervisorId"],
  });

export type CreateProviderInput = z.input<typeof createProviderSchema>;
export type UpdateProviderInput = z.input<typeof updateProviderSchema>;
