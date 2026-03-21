"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createProviderSchema, type CreateProviderInput } from "@/lib/validators/providers";
import { createProvider, updateProvider } from "@/server/actions/providers";
import type { Provider } from "@/server/queries/providers";
import type { SupervisorOption } from "@/server/queries/providers";
import type { CredentialType } from "@/lib/constants";
import { CREDENTIAL_TYPES, CREDENTIAL_LABELS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";

const NONE_VALUE = "__none__";

export function ProviderForm({
  provider,
  supervisorOptions,
}: {
  provider?: Provider;
  supervisorOptions: SupervisorOption[];
}) {
  const router = useRouter();
  const isEdit = !!provider;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateProviderInput>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      firstName: provider?.firstName ?? "",
      lastName: provider?.lastName ?? "",
      credentialType: (provider?.credentialType as CredentialType) ?? "rbt",
      npi: provider?.npi ?? "",
      credentialNumber: provider?.credentialNumber ?? "",
      credentialExpiry: provider?.credentialExpiry ?? "",
      supervisorId: provider?.supervisorId ?? "",
      isActive: provider?.isActive ?? true,
    },
  });

  const { execute: executeCreate, isPending: isCreating } = useAction(createProvider, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Provider created");
        router.push("/providers");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to create provider");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateProvider, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Provider updated");
        router.push("/providers");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update provider");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  function onSubmit(data: CreateProviderInput) {
    if (isEdit) {
      executeUpdate({ ...data, id: provider.id });
    } else {
      executeCreate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-4">
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

      <Field>
        <Label className="text-xs font-medium">Credential Type</Label>
        <Controller
          name="credentialType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CREDENTIAL_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-xs">
                    {CREDENTIAL_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.credentialType?.message}</FieldError>
      </Field>

      <Field>
        <Label className="text-xs font-medium">NPI</Label>
        <Input
          {...register("npi")}
          placeholder="10-digit NPI"
          className="h-8 text-xs tabular-nums"
        />
        <FieldError>{errors.npi?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Credential Number</Label>
          <Input {...register("credentialNumber")} className="h-8 text-xs" />
          <FieldError>{errors.credentialNumber?.message}</FieldError>
        </Field>
        <Field>
          <Label className="text-xs font-medium">Credential Expiry</Label>
          <Input
            {...register("credentialExpiry")}
            placeholder="YYYY-MM-DD"
            className="h-8 text-xs"
          />
          <FieldError>{errors.credentialExpiry?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <Label className="text-xs font-medium">Supervisor</Label>
        <Controller
          name="supervisorId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value || NONE_VALUE}
              onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
            >
              <SelectTrigger className="h-8 w-full text-xs">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_VALUE} className="text-xs">
                  None
                </SelectItem>
                {supervisorOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id} className="text-xs">
                    {s.lastName}, {s.firstName} ({CREDENTIAL_LABELS[s.credentialType as CredentialType] ?? s.credentialType})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors.supervisorId?.message}</FieldError>
      </Field>

      {isEdit && (
        <Field orientation="horizontal">
          <Label className="text-xs font-medium">Active</Label>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                size="sm"
              />
            )}
          />
        </Field>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" disabled={isPending} className="text-xs">
          {isPending
            ? isEdit
              ? "Saving..."
              : "Creating..."
            : isEdit
              ? "Save Changes"
              : "Create Provider"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => router.push("/providers")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
