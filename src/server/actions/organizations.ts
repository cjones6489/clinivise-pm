"use server";

import { authActionClient } from "@/lib/safe-action";
import { updateOrganizationSchema } from "@/lib/validators/organizations";
import { db } from "@/server/db";
import { organizations } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAudit } from "@/server/audit";
import { requirePermission } from "@/lib/permissions";
import { undefinedToNull } from "@/lib/utils";

export const updateOrganization = authActionClient
  .schema(updateOrganizationSchema)
  .action(async ({ parsedInput, ctx }) => {
    requirePermission(ctx.userRole, "settings.write");

    await db
      .update(organizations)
      .set(undefinedToNull(parsedInput))
      .where(eq(organizations.id, ctx.organizationId));

    await logAudit({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      action: "update",
      entityType: "organization",
      entityId: ctx.organizationId,
      metadata: {
        fields: Object.keys(parsedInput).filter(
          (k) => parsedInput[k as keyof typeof parsedInput] !== undefined,
        ),
      },
    });

    revalidatePath("/settings");
    return { success: true as const };
  });
