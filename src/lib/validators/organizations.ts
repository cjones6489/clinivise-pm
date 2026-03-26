import { z } from "zod/v4";
import { isValidNpi } from "@/lib/utils";

export const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Practice name is required").max(200),
  timezone: z.string().min(1, "Timezone is required"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  email: z
    .string()
    .email("Invalid email")
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
  npi: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined)
    .refine((v) => !v || isValidNpi(v), {
      message: "Invalid NPI — check digit does not match",
    }),
  taxId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined)
    .refine((v) => !v || /^\d{2}-?\d{7}$/.test(v), {
      message: "Tax ID must be in XX-XXXXXXX format",
    }),
  taxonomyCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

export type UpdateOrganizationInput = z.input<typeof updateOrganizationSchema>;
