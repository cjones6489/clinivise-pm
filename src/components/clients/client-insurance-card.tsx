"use client";

import { useState, useEffect } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import type { ClientInsuranceWithPayer, PayerOption } from "@/server/queries/clients";
import type { ClientContact } from "@/server/queries/clients";
import { deleteInsurance, verifyInsurance } from "@/server/actions/client-insurance";
import { ClientInsuranceForm } from "./client-insurance-form";
import {
  PRIORITY_LABELS,
  PAYER_TYPE_LABELS,
  SUBSCRIBER_RELATIONSHIP_LABELS,
  type VerificationStatus,
  type PayerType,
  type SubscriberRelationship,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalCircle01Icon,
  SecurityCheckIcon,
  PencilEdit01Icon,
  Delete01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";

function getVerificationBadge(insurance: ClientInsuranceWithPayer) {
  const isExpired = insurance.terminationDate && new Date(insurance.terminationDate) < new Date();

  if (isExpired) {
    return <Badge variant="destructive">Expired</Badge>;
  }

  const status = insurance.verificationStatus as VerificationStatus;
  switch (status) {
    case "verified":
      return (
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
          Verified
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return (
        <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
          Unverified
        </Badge>
      );
  }
}

export function ClientInsuranceCard({
  insurance,
  contacts,
  clientId,
  payerOptions: initialPayerOptions,
  canEdit,
  canManagePayers,
}: {
  insurance: ClientInsuranceWithPayer[];
  contacts: ClientContact[];
  clientId: string;
  payerOptions: PayerOption[];
  canEdit: boolean;
  canManagePayers: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<ClientInsuranceWithPayer | undefined>();
  const [archiveTarget, setArchiveTarget] = useState<ClientInsuranceWithPayer | null>(null);
  const [payerOptions, setPayerOptions] = useState<PayerOption[]>(initialPayerOptions);

  // Sync payer options when server props update (e.g. after revalidation)
  useEffect(() => {
    setPayerOptions(initialPayerOptions);
  }, [initialPayerOptions]);

  const { executeAsync: executeDelete } = useAction(deleteInsurance, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Insurance policy archived");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to archive insurance policy");
    },
  });

  const { executeAsync: executeVerify } = useAction(verifyInsurance, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Verification status updated");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update verification");
    },
  });

  function openAddDialog() {
    setEditingInsurance(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(ins: ClientInsuranceWithPayer) {
    setEditingInsurance(ins);
    setDialogOpen(true);
  }

  function handleSuccess() {
    setDialogOpen(false);
    setEditingInsurance(undefined);
  }

  function handlePayerCreated(payer: PayerOption) {
    setPayerOptions((prev) => [...prev, payer].sort((a, b) => a.name.localeCompare(b.name)));
  }

  return (
    <>
      <div className="fade-in border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Insurance
          </span>
          {canEdit && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={openAddDialog}>
              Add Policy
            </Button>
          )}
        </div>
        <div className="p-4">
          {insurance.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-3 rounded-lg p-3">
                <HugeiconsIcon icon={CreditCardIcon} size={24} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-xs">
                No insurance policies yet.
                {canEdit && " Add one to get started."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {insurance.map((ins) => (
                <div key={ins.id} className="border-border space-y-3 rounded-lg border p-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold">{ins.payerName}</span>
                      <Badge variant="secondary">
                        {PRIORITY_LABELS[ins.priority] ?? `Priority ${ins.priority}`}
                      </Badge>
                      {ins.payerType && (
                        <Badge variant="outline">
                          {PAYER_TYPE_LABELS[ins.payerType as PayerType] ?? ins.payerType}
                        </Badge>
                      )}
                      {getVerificationBadge(ins)}
                    </div>
                    {canEdit && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(ins)}>
                            <HugeiconsIcon icon={PencilEdit01Icon} size={14} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {ins.verificationStatus !== "verified" && (
                            <DropdownMenuItem
                              onClick={() =>
                                executeVerify({
                                  id: ins.id,
                                  verificationStatus: "verified",
                                })
                              }
                            >
                              <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="mr-2" />
                              Mark Verified
                            </DropdownMenuItem>
                          )}
                          {ins.verificationStatus !== "unverified" && (
                            <DropdownMenuItem
                              onClick={() =>
                                executeVerify({
                                  id: ins.id,
                                  verificationStatus: "unverified",
                                })
                              }
                            >
                              <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="mr-2" />
                              Mark Unverified
                            </DropdownMenuItem>
                          )}
                          {ins.verificationStatus !== "failed" && (
                            <DropdownMenuItem
                              onClick={() =>
                                executeVerify({
                                  id: ins.id,
                                  verificationStatus: "failed",
                                })
                              }
                            >
                              <HugeiconsIcon icon={SecurityCheckIcon} size={14} className="mr-2" />
                              Mark Failed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setArchiveTarget(ins)}
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={14} className="mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                    <div>
                      <span className="text-muted-foreground">Member ID</span>
                      <p className="font-medium tabular-nums">{ins.memberId}</p>
                    </div>
                    {ins.groupNumber && (
                      <div>
                        <span className="text-muted-foreground">Group #</span>
                        <p className="font-medium">{ins.groupNumber}</p>
                      </div>
                    )}
                    {ins.planName && (
                      <div>
                        <span className="text-muted-foreground">Plan</span>
                        <p className="font-medium">{ins.planName}</p>
                      </div>
                    )}
                    {ins.payerPhone && (
                      <div>
                        <span className="text-muted-foreground">Payer Phone</span>
                        <p className="font-medium">{ins.payerPhone}</p>
                      </div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex gap-4 text-xs">
                    {ins.effectiveDate && (
                      <div>
                        <span className="text-muted-foreground">Effective: </span>
                        <span className="font-medium">{formatDate(ins.effectiveDate)}</span>
                      </div>
                    )}
                    {ins.terminationDate && (
                      <div>
                        <span className="text-muted-foreground">Terminates: </span>
                        <span className="font-medium">{formatDate(ins.terminationDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Subscriber info (hidden when self) */}
                  {ins.relationshipToSubscriber && ins.relationshipToSubscriber !== "self" && (
                    <div className="border-border border-t pt-2 text-xs">
                      <span className="text-muted-foreground">Subscriber: </span>
                      <span className="font-medium">
                        {ins.subscriberFirstName} {ins.subscriberLastName}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        (
                        {SUBSCRIBER_RELATIONSHIP_LABELS[
                          ins.relationshipToSubscriber as SubscriberRelationship
                        ] ?? ins.relationshipToSubscriber}
                        )
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingInsurance ? "Edit Insurance Policy" : "Add Insurance Policy"}
            </DialogTitle>
          </DialogHeader>
          <ClientInsuranceForm
            key={editingInsurance?.id ?? "new"}
            clientId={clientId}
            contacts={contacts}
            payerOptions={payerOptions}
            insurance={editingInsurance}
            onSuccess={handleSuccess}
            onPayerCreated={handlePayerCreated}
            canManagePayers={canManagePayers}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) setArchiveTarget(null);
        }}
        title="Archive insurance policy"
        description={
          archiveTarget
            ? `Are you sure you want to archive the ${archiveTarget.payerName} policy? Existing authorizations will be preserved.`
            : ""
        }
        onConfirm={async () => {
          if (archiveTarget) {
            await executeDelete({ id: archiveTarget.id });
          }
        }}
        variant="destructive"
        confirmLabel="Archive"
      />
    </>
  );
}
