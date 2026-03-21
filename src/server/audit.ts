import { db } from "@/server/db";
import { auditLogs } from "@/server/db/schema";

/** Log an auditable mutation. Awaited to ensure completion before serverless freeze. */
export async function logAudit(params: {
  organizationId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(auditLogs).values({
      organizationId: params.organizationId,
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId ?? null,
      metadata: params.metadata ?? null,
    });
  } catch (err) {
    // Audit failure should never block the mutation — log and continue
    console.error("Audit log failed:", err);
  }
}
