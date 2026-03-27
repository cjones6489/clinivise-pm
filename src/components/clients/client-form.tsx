"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClientSchema, type CreateClientInput } from "@/lib/validators/clients";
import { createClient, updateClient } from "@/server/actions/clients";
import type { Client } from "@/server/queries/clients";
import type { ClientStatus } from "@/lib/constants";
import {
  CLIENT_STATUSES,
  CLIENT_STATUS_LABELS,
  REFERRAL_SOURCES,
  REFERRAL_SOURCE_LABELS,
  GENDERS,
} from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";

const NONE_VALUE = "__none__";

const GENDER_LABELS: Record<string, string> = {
  M: "Male",
  F: "Female",
  U: "Unknown",
};

export function ClientForm({
  client,
  disabled,
}: {
  client?: Client;
  disabled?: boolean;
}) {
  const router = useRouter();
  const isEdit = !!client;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateClientInput>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      firstName: client?.firstName ?? "",
      lastName: client?.lastName ?? "",
      dateOfBirth: client?.dateOfBirth ?? "",
      gender: client?.gender ?? "",
      phone: client?.phone ?? "",
      email: client?.email ?? "",
      addressLine1: client?.addressLine1 ?? "",
      addressLine2: client?.addressLine2 ?? "",
      city: client?.city ?? "",
      state: client?.state ?? "",
      zipCode: client?.zipCode ?? "",
      diagnosisCode: client?.diagnosisCode ?? "",
      diagnosisDescription: client?.diagnosisDescription ?? "",
      secondaryDiagnosisCodes: client?.secondaryDiagnosisCodes?.join(", ") ?? "",
      primaryLanguage: client?.primaryLanguage ?? "",
      interpreterNeeded: client?.interpreterNeeded ?? false,
      referringProviderName: client?.referringProviderName ?? "",
      referringProviderNpi: client?.referringProviderNpi ?? "",
      medicaidId: client?.medicaidId ?? "",
      intakeDate: client?.intakeDate ?? "",
      status: (client?.status as ClientStatus) ?? "inquiry",
      referralSource: client?.referralSource ?? "",
      holdReason: client?.holdReason ?? "",
      notes: client?.notes ?? "",
    },
  });

  const currentStatus = watch("status");

  const { execute: executeCreate, isPending: isCreating } = useAction(createClient, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Client created");
        router.push("/clients");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to create client");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateClient, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Client updated");
        router.push(`/clients/${client!.id}`);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update client");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  function onSubmit(data: CreateClientInput) {
    if (isEdit) {
      executeUpdate({ ...data, id: client.id, updatedAt: client.updatedAt.toISOString() });
    } else {
      executeCreate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">First Name</Label>
            <Input {...register("firstName")} className="h-8 text-xs" disabled={disabled} />
            <FieldError>{errors.firstName?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Last Name</Label>
            <Input {...register("lastName")} className="h-8 text-xs" disabled={disabled} />
            <FieldError>{errors.lastName?.message}</FieldError>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Date of Birth</Label>
            <Input
              {...register("dateOfBirth")}
              placeholder="YYYY-MM-DD"
              className="h-8 text-xs"
              disabled={disabled}
            />
            <FieldError>{errors.dateOfBirth?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Gender</Label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || NONE_VALUE}
                  onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE} className="text-xs">
                      Not specified
                    </SelectItem>
                    {GENDERS.map((g) => (
                      <SelectItem key={g} value={g} className="text-xs">
                        {GENDER_LABELS[g] ?? g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.gender?.message}</FieldError>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLIENT_STATUSES.filter((s) => s !== "archived").map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {CLIENT_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.status?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Referral Source</Label>
            <Controller
              name="referralSource"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || NONE_VALUE}
                  onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE} className="text-xs">
                      None
                    </SelectItem>
                    {REFERRAL_SOURCES.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {REFERRAL_SOURCE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.referralSource?.message}</FieldError>
          </Field>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Address</h3>
        <Field>
          <Label className="text-xs font-medium">Address Line 1</Label>
          <Input {...register("addressLine1")} className="h-8 text-xs" disabled={disabled} />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Address Line 2</Label>
          <Input
            {...register("addressLine2")}
            placeholder="Apt, Suite, Unit, etc."
            className="h-8 text-xs"
            disabled={disabled}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <Label className="text-xs font-medium">City</Label>
            <Input {...register("city")} className="h-8 text-xs" disabled={disabled} />
          </Field>
          <Field>
            <Label className="text-xs font-medium">State</Label>
            <Input {...register("state")} className="h-8 text-xs" disabled={disabled} />
          </Field>
          <Field>
            <Label className="text-xs font-medium">ZIP Code</Label>
            <Input
              {...register("zipCode")}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      </div>

      {/* Clinical */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Clinical</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Primary Diagnosis Code</Label>
            <Input {...register("diagnosisCode")} className="h-8 text-xs" disabled={disabled} />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Description</Label>
            <Input
              {...register("diagnosisDescription")}
              className="h-8 text-xs"
              disabled={disabled}
            />
          </Field>
        </div>
        <Field>
          <Label className="text-xs font-medium">Secondary Diagnosis Codes</Label>
          <Input
            {...register("secondaryDiagnosisCodes")}
            placeholder="F90.9, F41.1 (comma-separated ICD-10 codes)"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <Label className="text-xs font-medium">Intake Date</Label>
            <Input
              {...register("intakeDate")}
              placeholder="YYYY-MM-DD"
              className="h-8 text-xs"
              disabled={disabled}
            />
            <FieldError>{errors.intakeDate?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Primary Language</Label>
            <Input {...register("primaryLanguage")} placeholder="English" className="h-8 text-xs" disabled={disabled} />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Medicaid ID</Label>
            <Input {...register("medicaidId")} className="h-8 text-xs tabular-nums" disabled={disabled} />
          </Field>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("interpreterNeeded")}
            id="interpreterNeeded"
            className="h-4 w-4 rounded border-border"
            disabled={disabled}
          />
          <Label htmlFor="interpreterNeeded" className="text-xs font-medium">Interpreter needed</Label>
        </div>
      </div>

      {/* Referring Provider */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Referring Provider</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Provider Name</Label>
            <Input {...register("referringProviderName")} placeholder="Dr. Jane Smith" className="h-8 text-xs" disabled={disabled} />
          </Field>
          <Field>
            <Label className="text-xs font-medium">NPI</Label>
            <Input {...register("referringProviderNpi")} placeholder="10-digit NPI" className="h-8 text-xs tabular-nums" disabled={disabled} />
          </Field>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Notes</h3>
        <Field>
          <Label className="text-xs font-medium">Notes</Label>
          <Textarea {...register("notes")} className="text-xs" disabled={disabled} />
        </Field>
        {currentStatus === "on_hold" && (
          <Field>
            <Label className="text-xs font-medium">Hold Reason</Label>
            <Textarea {...register("holdReason")} className="text-xs" disabled={disabled} />
            <FieldError>{errors.holdReason?.message}</FieldError>
          </Field>
        )}
      </div>

      {!disabled && (
        <div className="flex gap-2 pt-2">
          <Button type="submit" size="sm" disabled={isPending} className="text-xs">
            {isPending
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Client"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => router.push(isEdit ? `/clients/${client.id}` : "/clients")}
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
