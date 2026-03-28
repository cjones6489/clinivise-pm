import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { documents, clients, users, organizations } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { put } from "@vercel/blob";
import { logAudit } from "@/server/audit";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { DOCUMENT_TYPES, type DocumentType } from "@/lib/constants";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(request: Request) {
  // Authenticate
  const { userId: clerkUserId, orgId: clerkOrgId } = await auth();
  if (!clerkUserId || !clerkOrgId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Resolve to internal IDs
  const [org] = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.clerkOrgId, clerkOrgId))
    .limit(1);

  if (!org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(and(eq(users.clerkUserId, clerkUserId), eq(users.organizationId, org.id)))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Parse FormData
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const clientId = formData.get("clientId") as string | null;
  const documentType = formData.get("documentType") as string | null;

  if (!file || !clientId || !documentType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Validate document type
  if (!DOCUMENT_TYPES.includes(documentType as DocumentType)) {
    return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
  }

  // Validate mime type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "File type not supported. Upload PDF, images, or Word documents." },
      { status: 400 },
    );
  }

  // Verify client belongs to org
  const [client] = await db
    .select({ id: clients.id })
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.organizationId, org.id)))
    .limit(1);

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Upload to Vercel Blob with unique suffix to prevent collisions
  const uniqueSuffix = nanoid(8);
  const blobPath = `documents/${org.id}/${clientId}/${uniqueSuffix}-${file.name}`;
  const blob = await put(blobPath, file, {
    access: "public", // TODO: Switch to private/signed URLs for production PHI
    contentType: file.type,
  });

  // Save record
  const [doc] = await db
    .insert(documents)
    .values({
      organizationId: org.id,
      clientId,
      documentType,
      fileName: file.name,
      fileUrl: blob.url,
      fileSizeBytes: file.size,
      mimeType: file.type,
      uploadedByUserId: user.id,
    })
    .returning({ id: documents.id });

  await logAudit({
    userId: user.id,
    organizationId: org.id,
    action: "document.upload",
    entityType: "document",
    entityId: doc!.id,
    metadata: { clientId, documentType, fileName: file.name },
  });

  revalidatePath(`/clients/${clientId}`);

  return NextResponse.json({ success: true, id: doc!.id });
}
