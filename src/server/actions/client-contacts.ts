"use server";

import { authActionClient } from "@/lib/safe-action";
import {
  createContactSchema,
  updateContactSchema,
} from "@/lib/validators/client-contacts";
import { idSchema } from "@/lib/validators";
import { db } from "@/server/db";
import { clients, clientContacts } from "@/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { undefinedToNull } from "@/lib/utils";
import { z } from "zod/v4";

const WRITE_ROLES = ["owner", "admin", "bcba"];

export const createContact = authActionClient
  .schema(createContactSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    // Verify client exists in org
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          eq(clients.id, parsedInput.clientId),
          eq(clients.organizationId, ctx.organizationId),
          isNull(clients.deletedAt),
        ),
      )
      .limit(1);

    if (!client) {
      throw new Error("Client not found");
    }

    const [contact] = await db
      .insert(clientContacts)
      .values({
        ...undefinedToNull(parsedInput),
        organizationId: ctx.organizationId,
      })
      .returning();

    revalidatePath(`/clients/${parsedInput.clientId}`);
    return { success: true as const, data: contact };
  });

export const updateContact = authActionClient
  .schema(updateContactSchema)
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    // Strip clientId — contacts must not change parent client
    const { id, clientId: _clientId, ...updates } = parsedInput;

    // Verify ownership
    const [existing] = await db
      .select({ id: clientContacts.id, clientId: clientContacts.clientId })
      .from(clientContacts)
      .where(
        and(
          eq(clientContacts.id, id),
          eq(clientContacts.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Contact not found");
    }

    const [contact] = await db
      .update(clientContacts)
      .set(undefinedToNull(updates) as Partial<typeof clientContacts.$inferInsert>)
      .where(eq(clientContacts.id, id))
      .returning();

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const, data: contact };
  });

export const deleteContact = authActionClient
  .schema(z.object({ id: idSchema }))
  .action(async ({ parsedInput, ctx }) => {
    if (!WRITE_ROLES.includes(ctx.userRole)) {
      throw new Error("Forbidden: insufficient role");
    }

    // Read contact for ownership check + clientId for revalidation
    const [existing] = await db
      .select({ id: clientContacts.id, clientId: clientContacts.clientId })
      .from(clientContacts)
      .where(
        and(
          eq(clientContacts.id, parsedInput.id),
          eq(clientContacts.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new Error("Contact not found");
    }

    await db
      .delete(clientContacts)
      .where(eq(clientContacts.id, parsedInput.id));

    revalidatePath(`/clients/${existing.clientId}`);
    return { success: true as const };
  });
