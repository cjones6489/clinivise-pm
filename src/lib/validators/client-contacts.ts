import { z } from "zod/v4";
import { idSchema, contactRelationshipSchema, updatedAtSchema } from "./index";

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
  .omit({
    isLegalGuardian: true,
    isEmergencyContact: true,
    isBillingResponsible: true,
    canReceivePhi: true,
    canPickup: true,
    livesWithClient: true,
    priority: true,
  })
  .partial()
  .extend({
    id: idSchema,
    updatedAt: updatedAtSchema,
    isLegalGuardian: z.boolean().optional(),
    isEmergencyContact: z.boolean().optional(),
    isBillingResponsible: z.boolean().optional(),
    canReceivePhi: z.boolean().optional(),
    canPickup: z.boolean().optional(),
    livesWithClient: z.boolean().optional(),
    priority: z.coerce.number().int().min(1).optional(),
  });

export type CreateContactInput = z.input<typeof createContactSchema>;
export type UpdateContactInput = z.input<typeof updateContactSchema>;
