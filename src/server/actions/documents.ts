"use server";

import { authActionClient } from "@/lib/safe-action";
import { db } from "@/server/db";
import { documents } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NotFoundError } from "@/lib/errors";
import { requirePermission } from "@/lib/permissions";
import { logAudit } from "@/server/audit";
import { del } from "@vercel/blob";
import { z } from "zod/v4";

const deleteDocumentSchema = z.object({
  id: z.string().min(1),
  clientId: z.string().min(1),
});

export const deleteDocument = authActionClient
  .schema(deleteDocumentSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "clients.write");

    const { id, clientId } = parsedInput;

    // Find the document (verify org ownership)
    const [doc] = await db
      .select({ id: documents.id, fileUrl: documents.fileUrl, fileName: documents.fileName })
      .from(documents)
      .where(
        and(
          eq(documents.id, id),
          eq(documents.organizationId, ctx.organizationId),
        ),
      )
      .limit(1);

    if (!doc) throw new NotFoundError("Document");

    // Delete from Vercel Blob
    try {
      await del(doc.fileUrl);
    } catch {
      // Blob deletion failure is non-critical — still delete the DB record
      console.error(`Failed to delete blob: ${doc.fileUrl}`);
    }

    // Delete from DB
    await db
      .delete(documents)
      .where(
        and(
          eq(documents.id, id),
          eq(documents.organizationId, ctx.organizationId),
        ),
      );

    await logAudit({
      userId: ctx.userId,
      organizationId: ctx.organizationId,
      action: "document.delete",
      entityType: "document",
      entityId: id,
      metadata: { clientId, fileName: doc.fileName },
    });

    revalidatePath(`/clients/${clientId}`);
    return { success: true };
  });
