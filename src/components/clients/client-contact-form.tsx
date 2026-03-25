"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createContactSchema, type CreateContactInput } from "@/lib/validators/client-contacts";
import { createContact, updateContact } from "@/server/actions/client-contacts";
import type { ClientContact } from "@/server/queries/clients";
import { CONTACT_RELATIONSHIP_TYPES, CONTACT_RELATIONSHIP_LABELS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";

export function ClientContactForm({
  clientId,
  contact,
  onSuccess,
}: {
  clientId: string;
  contact?: ClientContact;
  onSuccess: () => void;
}) {
  const isEdit = !!contact;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      clientId,
      firstName: contact?.firstName ?? "",
      lastName: contact?.lastName ?? "",
      phone: contact?.phone ?? "",
      email: contact?.email ?? "",
      relationship: (contact?.relationship as CreateContactInput["relationship"]) ?? "mother",
      isLegalGuardian: contact?.isLegalGuardian ?? false,
      isEmergencyContact: contact?.isEmergencyContact ?? false,
      isBillingResponsible: contact?.isBillingResponsible ?? false,
      canReceivePhi: contact?.canReceivePhi ?? false,
      canPickup: contact?.canPickup ?? false,
      livesWithClient: contact?.livesWithClient ?? false,
      priority: contact?.priority ?? 1,
      notes: contact?.notes ?? "",
    },
  });

  const { execute: executeCreate, isPending: isCreating } = useAction(createContact, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Contact added");
        onSuccess();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to add contact");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateContact, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Contact updated");
        onSuccess();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update contact");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  function onSubmit(data: CreateContactInput) {
    if (isEdit) {
      executeUpdate({ ...data, id: contact.id, updatedAt: contact.updatedAt.toISOString() });
    } else {
      executeCreate(data);
    }
  }

  const BOOLEAN_FIELDS = [
    { name: "isLegalGuardian" as const, label: "Legal Guardian" },
    { name: "isEmergencyContact" as const, label: "Emergency Contact" },
    { name: "isBillingResponsible" as const, label: "Billing Responsible" },
    { name: "canReceivePhi" as const, label: "Can Receive PHI" },
    { name: "canPickup" as const, label: "Can Pick Up" },
    { name: "livesWithClient" as const, label: "Lives With Client" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">First Name</Label>
          <Input {...register("firstName")} className="h-8 text-xs" />
          <FieldError>{errors.firstName?.message}</FieldError>
        </Field>
        <Field>
          <Label className="text-xs font-medium">Last Name</Label>
          <Input {...register("lastName")} className="h-8 text-xs" />
          <FieldError>{errors.lastName?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Phone</Label>
          <Input {...register("phone")} className="h-8 text-xs" />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Email</Label>
          <Input {...register("email")} className="h-8 text-xs" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Relationship</Label>
          <Controller
            name="relationship"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_RELATIONSHIP_TYPES.map((r) => (
                    <SelectItem key={r} value={r} className="text-xs">
                      {CONTACT_RELATIONSHIP_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.relationship?.message}</FieldError>
        </Field>
        <Field>
          <Label className="text-xs font-medium">Priority</Label>
          <Input
            {...register("priority", { valueAsNumber: true })}
            type="number"
            min={1}
            className="h-8 text-xs tabular-nums"
          />
          <FieldError>{errors.priority?.message}</FieldError>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BOOLEAN_FIELDS.map(({ name, label }) => (
          <Field key={name} orientation="horizontal">
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label className="text-xs font-medium">{label}</Label>
          </Field>
        ))}
      </div>

      <Field>
        <Label className="text-xs font-medium">Notes</Label>
        <Textarea {...register("notes")} className="text-xs" />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="sm" disabled={isPending} className="text-xs">
          {isPending
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save Contact"
              : "Add Contact"}
        </Button>
      </div>
    </form>
  );
}
