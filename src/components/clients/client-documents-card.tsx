"use client";

import { useState, useTransition } from "react";
import type { DocumentListItem } from "@/server/queries/documents";
import { deleteDocument } from "@/server/actions/documents";
import { formatDate, formatFileSize } from "@/lib/utils";
import {
  DOCUMENT_TYPES,
  DOCUMENT_TYPE_LABELS,
  type DocumentType,
} from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  File01Icon,
  MoreHorizontalCircle01Icon,
  Delete01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

function UploadDialog({ clientId }: { clientId: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("other");
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit() {
    if (!file) return;
    setIsPending(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("clientId", clientId);
      formData.append("documentType", documentType);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || "Upload failed");
        return;
      }

      setFile(null);
      setDocumentType("other");
      setOpen(false);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs">
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="doc-type" className="text-xs">
              Document Type
            </Label>
            <Select
              value={documentType}
              onValueChange={(v) => setDocumentType(v as DocumentType)}
            >
              <SelectTrigger id="doc-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((dt) => (
                  <SelectItem key={dt} value={dt}>
                    {DOCUMENT_TYPE_LABELS[dt]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-file" className="text-xs">
              File
            </Label>
            <Input
              id="doc-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-xs"
            />
            <p className="text-muted-foreground text-[11px]">
              PDF, images, or Word documents. Max 10MB.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="text-xs"
              onClick={handleSubmit}
              disabled={!file || isPending}
            >
              {isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ClientDocumentsCard({
  documents: docs,
  clientId,
  canEdit,
}: {
  documents: DocumentListItem[];
  clientId: string;
  canEdit: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    fileName: string;
  } | null>(null);

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteDocument({ id: deleteTarget.id, clientId });
      if (result?.serverError) {
        toast.error(result.serverError);
      }
      setDeleteTarget(null);
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            Documents
            {docs.length > 0 && (
              <span className="text-muted-foreground ml-2 text-xs font-normal">
                {docs.length} files
              </span>
            )}
          </CardTitle>
          {canEdit && (
            <CardAction>
              <UploadDialog clientId={clientId} />
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-3 rounded-lg p-3">
                <HugeiconsIcon icon={File01Icon} size={24} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No documents uploaded</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Upload consent forms, assessment reports, and auth letters to keep the chart
                complete.
              </p>
              {canEdit && (
                <div className="mt-3">
                  <UploadDialog clientId={clientId} />
                </div>
              )}
            </div>
          ) : (
            <div className="-mx-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Size</TableHead>
                    <TableHead className="text-xs">Uploaded</TableHead>
                    <TableHead className="text-xs">By</TableHead>
                    <TableHead className="w-10 text-xs" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {DOCUMENT_TYPE_LABELS[doc.documentType as DocumentType] ??
                            doc.documentType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-medium">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {doc.fileName}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs tabular-nums">
                        {formatFileSize(doc.fileSizeBytes)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs tabular-nums">
                        {formatDate(doc.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {doc.uploadedByFirstName && doc.uploadedByLastName
                          ? `${doc.uploadedByLastName}, ${doc.uploadedByFirstName[0]}.`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {canEdit && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <HugeiconsIcon
                                    icon={Download01Icon}
                                    size={14}
                                    className="mr-2"
                                  />
                                  Download
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  setDeleteTarget({ id: doc.id, fileName: doc.fileName })
                                }
                                className="text-destructive focus:text-destructive"
                              >
                                <HugeiconsIcon
                                  icon={Delete01Icon}
                                  size={14}
                                  className="mr-2"
                                />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.fileName}&rdquo; will be permanently deleted. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
