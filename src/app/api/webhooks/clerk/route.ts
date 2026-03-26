import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { db } from "@/server/db";
import { organizations, users } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    // ── Organization Events ──────────────────────────────────────────────

    if (eventType === "organization.created") {
      const { id, name, slug } = evt.data;

      // Check if org already exists (auto-provision may have created it)
      const [existing] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.clerkOrgId, id))
        .limit(1);

      if (!existing) {
        await db.insert(organizations).values({
          clerkOrgId: id,
          name: name ?? slug ?? "New Practice",
        });
      } else {
        // Update name if it changed from the default
        await db
          .update(organizations)
          .set({ name: name ?? slug ?? "New Practice" })
          .where(eq(organizations.clerkOrgId, id));
      }
    }

    if (eventType === "organization.updated") {
      const { id, name } = evt.data;

      if (name && id) {
        await db
          .update(organizations)
          .set({ name })
          .where(eq(organizations.clerkOrgId, id));
      }
    }

    if (eventType === "organization.deleted") {
      const { id } = evt.data;
      if (id) {
        await db
          .update(organizations)
          .set({ isActive: false })
          .where(eq(organizations.clerkOrgId, id));
      }
    }

    // ── Membership Events ────────────────────────────────────────────────

    if (eventType === "organizationMembership.created") {
      const { organization, public_user_data } = evt.data;
      const clerkOrgId = organization.id;
      const clerkUserId = public_user_data.user_id;
      const email = (public_user_data.identifier ?? "").toLowerCase();

      // Find the internal org
      const [org] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.clerkOrgId, clerkOrgId))
        .limit(1);

      if (!org) return new Response("Org not found — will retry", { status: 500 });

      // Check if user already exists in this org (may have been pre-created via invite)
      const [existing] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email), eq(users.organizationId, org.id)))
        .limit(1);

      if (existing) {
        // Link their Clerk account if not already linked — but don't re-activate deactivated users
        if (!existing.clerkUserId && existing.status !== "deactivated") {
          await db
            .update(users)
            .set({
              clerkUserId,
              status: "active",
              isActive: true,
              firstName: public_user_data.first_name ?? existing.firstName,
              lastName: public_user_data.last_name ?? existing.lastName,
            })
            .where(eq(users.id, existing.id));
        }
      }
      // If no pre-created user, autoProvision in getCurrentUser() will handle it
      // on the user's first page load
    }

    if (eventType === "organizationMembership.deleted") {
      const { organization, public_user_data } = evt.data;
      const clerkOrgId = organization.id;
      const clerkUserId = public_user_data.user_id;

      const [org] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.clerkOrgId, clerkOrgId))
        .limit(1);

      if (org) {
        await db
          .update(users)
          .set({ status: "deactivated", isActive: false })
          .where(
            and(
              eq(users.clerkUserId, clerkUserId),
              eq(users.organizationId, org.id),
            ),
          );
      }
    }

    // ── User Events ──────────────────────────────────────────────────────

    if (eventType === "user.updated") {
      const { id, first_name, last_name, email_addresses, primary_email_address_id } = evt.data;
      const primaryEmail = email_addresses?.find(
        (e: { id: string }) => e.id === primary_email_address_id,
      );

      // Update name/email across all orgs this user belongs to
      if (id) {
        const updates: Record<string, unknown> = {};
        if (first_name !== undefined) updates.firstName = first_name;
        if (last_name !== undefined) updates.lastName = last_name;
        if (primaryEmail) updates.email = primaryEmail.email_address.toLowerCase();

        if (Object.keys(updates).length > 0) {
          await db
            .update(users)
            .set(updates)
            .where(eq(users.clerkUserId, id));
        }
      }
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;
      if (id) {
        await db
          .update(users)
          .set({ status: "deactivated", isActive: false })
          .where(eq(users.clerkUserId, id));
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err: unknown) {
    console.error("Clerk webhook error:", err);
    // Verification errors → 400 (don't retry). Processing errors → 500 (retry).
    const isVerificationError =
      err instanceof Error && (err.message.includes("verification") || err.message.includes("signature"));
    return new Response(
      isVerificationError ? "Webhook verification failed" : "Internal error",
      { status: isVerificationError ? 400 : 500 },
    );
  }
}
