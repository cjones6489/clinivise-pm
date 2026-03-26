import "server-only";

import { db } from "@/server/db";
import { organizations } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export type Organization = {
  id: string;
  name: string;
  npi: string | null;
  taxId: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  taxonomyCode: string | null;
  timezone: string;
};

/** Fetch org settings for display. Excludes sensitive fields (stediApiKey). */
export async function getOrganization(orgId: string): Promise<Organization | null> {
  const [org] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      npi: organizations.npi,
      taxId: organizations.taxId,
      phone: organizations.phone,
      email: organizations.email,
      addressLine1: organizations.addressLine1,
      addressLine2: organizations.addressLine2,
      city: organizations.city,
      state: organizations.state,
      zipCode: organizations.zipCode,
      taxonomyCode: organizations.taxonomyCode,
      timezone: organizations.timezone,
    })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);

  return org ?? null;
}
