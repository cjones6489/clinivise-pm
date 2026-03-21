"use client";

import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import type { ClientContact } from "@/server/queries/clients";
import { deleteContact } from "@/server/actions/client-contacts";
import { ClientContactForm } from "./client-contact-form";
import { CONTACT_RELATIONSHIP_LABELS, type ContactRelationshipType } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserMultipleIcon, PencilEdit01Icon, Delete01Icon } from "@hugeicons/core-free-icons";

export function ClientContactsCard({
  contacts,
  clientId,
  canEdit,
}: {
  contacts: ClientContact[];
  clientId: string;
  canEdit: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ClientContact | undefined>();

  const { executeAsync } = useAction(deleteContact, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Contact deleted");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to delete contact");
    },
  });

  function openAddDialog() {
    setEditingContact(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(contact: ClientContact) {
    setEditingContact(contact);
    setDialogOpen(true);
  }

  function handleSuccess() {
    setDialogOpen(false);
    setEditingContact(undefined);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          {canEdit && (
            <CardAction>
              <Button size="sm" className="text-xs" onClick={openAddDialog}>
                Add Contact
              </Button>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="bg-muted mb-3 rounded-lg p-3">
                <HugeiconsIcon
                  icon={UserMultipleIcon}
                  size={24}
                  className="text-muted-foreground"
                />
              </div>
              <p className="text-muted-foreground text-xs">
                No contacts yet. Add a parent or guardian.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="border-border flex items-start justify-between rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">
                        {contact.firstName} {contact.lastName}
                      </span>
                      <Badge variant="secondary">
                        {CONTACT_RELATIONSHIP_LABELS[
                          contact.relationship as ContactRelationshipType
                        ] ?? contact.relationship}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                      {contact.phone && <span>{contact.phone}</span>}
                      {contact.email && <span>{contact.email}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {contact.isLegalGuardian && <Badge variant="outline">Guardian</Badge>}
                      {contact.isEmergencyContact && <Badge variant="outline">Emergency</Badge>}
                      {contact.isBillingResponsible && <Badge variant="outline">Billing</Badge>}
                      {contact.canReceivePhi && <Badge variant="outline">PHI</Badge>}
                      {contact.canPickup && <Badge variant="outline">Pickup</Badge>}
                      {contact.livesWithClient && <Badge variant="outline">Lives With</Badge>}
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => openEditDialog(contact)}
                      >
                        <HugeiconsIcon icon={PencilEdit01Icon} size={14} />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <ConfirmDialog
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-7 w-7"
                          >
                            <HugeiconsIcon icon={Delete01Icon} size={14} />
                            <span className="sr-only">Delete</span>
                          </Button>
                        }
                        title="Delete contact"
                        description={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}? This action cannot be undone.`}
                        onConfirm={async () => {
                          await executeAsync({ id: contact.id });
                        }}
                        variant="destructive"
                        confirmLabel="Delete"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingContact ? "Edit Contact" : "Add Contact"}</DialogTitle>
          </DialogHeader>
          <ClientContactForm
            key={editingContact?.id ?? "new"}
            clientId={clientId}
            contact={editingContact}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
