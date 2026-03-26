import { z } from "zod/v4";
import { CARE_TEAM_ROLES } from "@/lib/constants";

export const addToTeamSchema = z.object({
  clientId: z.string().min(1),
  providerId: z.string().min(1),
  role: z.enum(CARE_TEAM_ROLES),
  isPrimary: z.boolean().default(false),
});

export const updateTeamMemberSchema = z.object({
  id: z.string().min(1),
  role: z.enum(CARE_TEAM_ROLES).optional(),
  isPrimary: z.boolean().optional(),
});

export const removeFromTeamSchema = z.object({
  id: z.string().min(1),
});

export type AddToTeamInput = z.infer<typeof addToTeamSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
