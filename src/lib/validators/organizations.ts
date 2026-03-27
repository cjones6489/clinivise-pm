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
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined)
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Invalid email address",
    }),
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
      message: "Tax ID must be 9 digits (XX-XXXXXXX or XXXXXXXXX)",
    }),
  taxonomyCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  // Billing entity (may differ from practice)
  billingName: z
    .string()
    .max(200)
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  billingNpi: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined)
    .refine((v) => !v || isValidNpi(v), {
      message: "Invalid billing NPI — check digit does not match",
    }),
  billingTaxId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined)
    .refine((v) => !v || /^\d{2}-?\d{7}$/.test(v), {
      message: "Tax ID must be 9 digits (XX-XXXXXXX or XXXXXXXXX)",
    }),
  billingAddressLine1: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  billingCity: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  billingState: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  billingZipCode: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

export type UpdateOrganizationInput = z.input<typeof updateOrganizationSchema>;
