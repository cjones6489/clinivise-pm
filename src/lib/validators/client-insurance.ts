import { z } from "zod/v4";
import {
  idSchema,
  dateStringSchema,
  subscriberRelationshipSchema,
  genderSchema,
  verificationStatusSchema,
} from "./index";

const optionalString = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((v) => v || undefined);

const insuranceFieldsSchema = z.object({
  clientId: idSchema,
  payerId: idSchema,
  memberId: z.string().trim().min(1, "Member ID is required"),
  groupNumber: optionalString,
  planName: optionalString,
  relationshipToSubscriber: subscriberRelationshipSchema.default("child"),
  subscriberFirstName: optionalString,
  subscriberLastName: optionalString,
  subscriberDateOfBirth: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  subscriberGender: genderSchema.optional(),
  subscriberAddressLine1: optionalString,
  subscriberCity: optionalString,
  subscriberState: optionalString,
  subscriberZipCode: optionalString,
  priority: z.coerce.number().int().min(1).max(3).default(1),
  effectiveDate: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
  terminationDate: dateStringSchema
    .optional()
    .or(z.literal(""))
    .transform((v) => v || undefined),
});

export const createInsuranceSchema = insuranceFieldsSchema;

export const updateInsuranceSchema = insuranceFieldsSchema
  .omit({ relationshipToSubscriber: true, priority: true })
  .partial()
  .extend({
    id: idSchema,
    relationshipToSubscriber: subscriberRelationshipSchema.optional(),
    priority: z.coerce.number().int().min(1).max(3).optional(),
  });

export const verifyInsuranceSchema = z.object({
  id: idSchema,
  verificationStatus: verificationStatusSchema,
});

export type CreateInsuranceInput = z.input<typeof createInsuranceSchema>;
export type UpdateInsuranceInput = z.input<typeof updateInsuranceSchema>;
