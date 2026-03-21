import { z } from "zod/v4";
import { credentialTypeSchema, idSchema, npiSchema, dateStringSchema } from "./index";

export const createProviderSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  credentialType: credentialTypeSchema,
  npi: npiSchema.or(z.literal("")).transform((v) => v || undefined),
  credentialNumber: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  credentialExpiry: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  supervisorId: z.string().optional().or(z.literal("")).transform((v) => v || undefined),
  isActive: z.boolean().default(true),
});

export const updateProviderSchema = createProviderSchema
  .partial()
  .extend({ id: idSchema })
  .refine((d) => !d.supervisorId || d.supervisorId !== d.id, {
    message: "Cannot be own supervisor",
    path: ["supervisorId"],
  });

export type CreateProviderInput = z.input<typeof createProviderSchema>;
export type UpdateProviderInput = z.input<typeof updateProviderSchema>;
