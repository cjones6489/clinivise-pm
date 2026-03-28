import "server-only";

import { db } from "@/server/db";
import { documents, users } from "@/server/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type DocumentListItem = {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  fileSizeBytes: number | null;
  mimeType: string | null;
  uploadedByFirstName: string | null;
  uploadedByLastName: string | null;
  createdAt: Date;
};

export async function getClientDocuments(
  orgId: string,
  clientId: string,
): Promise<DocumentListItem[]> {
  return db
    .select({
      id: documents.id,
      documentType: documents.documentType,
      fileName: documents.fileName,
      fileUrl: documents.fileUrl,
      fileSizeBytes: documents.fileSizeBytes,
      mimeType: documents.mimeType,
      uploadedByFirstName: users.firstName,
      uploadedByLastName: users.lastName,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .leftJoin(users, eq(documents.uploadedByUserId, users.id))
    .where(
      and(
        eq(documents.organizationId, orgId),
        eq(documents.clientId, clientId),
      ),
    )
    .orderBy(desc(documents.createdAt));
}
