import { z } from "zod/v4";
import { idSchema, contactRelationshipSchema } from "./index";

export const createContactSchema = z.object({
  clientId: idSchema,
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
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
  relationship: contactRelationshipSchema,
  isLegalGuardian: z.boolean().default(false),
  isEmergencyContact: z.boolean().default(false),
  isBillingResponsible: z.boolean().default(false),
  canReceivePhi: z.boolean().default(false),
  canPickup: z.boolean().default(false),
  livesWithClient: z.boolean().default(false),
  priority: z.coerce.number().int().min(1).default(1),
  notes: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

export const updateContactSchema = createContactSchema
  .partial()
  .extend({ id: idSchema });

export type CreateContactInput = z.input<typeof createContactSchema>;
export type UpdateContactInput = z.input<typeof updateContactSchema>;
