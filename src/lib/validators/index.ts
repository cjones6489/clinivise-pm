import { z } from "zod/v4";
import {
  USER_ROLES,
  CREDENTIAL_TYPES,
  AUTH_STATUSES,
  SESSION_STATUSES,
  CLAIM_STATUSES,
  DOCUMENT_TYPES,
  PLACE_OF_SERVICE_CODES,
  PAYER_TYPES,
  GENDERS,
  SUBSCRIBER_RELATIONSHIPS,
  UNIT_CALC_METHODS,
  CLIENT_STATUSES,
  CONTACT_RELATIONSHIP_TYPES,
  REFERRAL_SOURCES,
  VERIFICATION_STATUSES,
} from "@/lib/constants";

// ── Enum Schemas ────────────────────────────────────────────────────────────

export const userRoleSchema = z.enum(USER_ROLES);
export const credentialTypeSchema = z.enum(CREDENTIAL_TYPES);
export const authStatusSchema = z.enum(AUTH_STATUSES);
export const sessionStatusSchema = z.enum(SESSION_STATUSES);
export const claimStatusSchema = z.enum(CLAIM_STATUSES);
export const documentTypeSchema = z.enum(DOCUMENT_TYPES);
export const placeOfServiceSchema = z.enum(PLACE_OF_SERVICE_CODES);
export const payerTypeSchema = z.enum(PAYER_TYPES);
export const genderSchema = z.enum(GENDERS);
export const subscriberRelationshipSchema = z.enum(SUBSCRIBER_RELATIONSHIPS);
export const unitCalcMethodSchema = z.enum(UNIT_CALC_METHODS);
export const clientStatusSchema = z.enum(CLIENT_STATUSES);
export const contactRelationshipSchema = z.enum(CONTACT_RELATIONSHIP_TYPES);
export const referralSourceSchema = z.enum(REFERRAL_SOURCES);
export const verificationStatusSchema = z.enum(VERIFICATION_STATUSES);

// ── Common Field Schemas ────────────────────────────────────────────────────

export const idSchema = z.string().min(1);
export const dateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format")
  .refine(
    (d) => {
      const parsed = new Date(d);
      return !isNaN(parsed.getTime()) && parsed.toISOString().startsWith(d);
    },
    { message: "Invalid date" },
  );
export const moneySchema = z.string().regex(/^-?\d+(\.\d{1,2})?$/);
export const phoneSchema = z.string().min(1).optional();
export const emailSchema = z.email().optional();
export const npiSchema = z.string().length(10).regex(/^\d+$/).optional();

// ── Pagination Schema ───────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.number().int().min(0).default(0),
  pageSize: z.number().int().min(1).max(100).default(20),
});
