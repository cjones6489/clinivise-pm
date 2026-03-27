"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createPayerSchema, type CreatePayerInput } from "@/lib/validators/payers";
import { createPayer, updatePayer } from "@/server/actions/payers";
import type { Payer } from "@/server/queries/payers";
import {
  PAYER_TYPES,
  PAYER_TYPE_LABELS,
  UNIT_CALC_METHODS,
  UNIT_CALC_METHOD_LABELS,
} from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";

export function PayerForm({ payer, onSuccess }: { payer?: Payer; onSuccess: () => void }) {
  const isEdit = !!payer;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreatePayerInput>({
    resolver: zodResolver(createPayerSchema),
    defaultValues: {
      name: payer?.name ?? "",
      stediPayerId: payer?.stediPayerId ?? "",
      electronicPayerId: payer?.electronicPayerId ?? "",
      payerType: (payer?.payerType as CreatePayerInput["payerType"]) ?? "commercial",
      phone: payer?.phone ?? "",
      authPhone: payer?.authPhone ?? "",
      authDepartmentEmail: payer?.authDepartmentEmail ?? "",
      portalUrl: payer?.portalUrl ?? "",
      claimsAddress: payer?.claimsAddress ?? "",
      timelyFilingDays: payer?.timelyFilingDays ?? undefined,
      unitCalcMethod: (payer?.unitCalcMethod as CreatePayerInput["unitCalcMethod"]) ?? "ama",
      notes: payer?.notes ?? "",
      isActive: payer?.isActive ?? true,
    },
  });

  const { execute: executeCreate, isPending: isCreating } = useAction(createPayer, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Payer added");
        onSuccess();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to add payer");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updatePayer, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Payer updated");
        onSuccess();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update payer");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  function onSubmit(data: CreatePayerInput) {
    if (isEdit) {
      executeUpdate({ ...data, id: payer.id, updatedAt: payer.updatedAt.toISOString() });
    } else {
      executeCreate(data);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field>
        <Label className="text-xs font-medium">Payer Name</Label>
        <Input {...register("name")} className="h-8 text-xs" />
        <FieldError>{errors.name?.message}</FieldError>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Electronic Payer ID</Label>
          <Input
            {...register("electronicPayerId")}
            placeholder="5-digit EDI payer ID"
            className="h-8 text-xs tabular-nums"
          />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Type</Label>
          <Controller
            name="payerType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYER_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {PAYER_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Phone</Label>
          <Input {...register("phone")} className="h-8 text-xs" />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Auth Phone</Label>
          <Input {...register("authPhone")} className="h-8 text-xs" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Auth Department Email</Label>
          <Input
            {...register("authDepartmentEmail")}
            type="email"
            placeholder="auth@payer.com"
            className="h-8 text-xs"
          />
          <FieldError>{errors.authDepartmentEmail?.message}</FieldError>
        </Field>
        <Field>
          <Label className="text-xs font-medium">Provider Portal URL</Label>
          <Input
            {...register("portalUrl")}
            placeholder="https://provider.payer.com"
            className="h-8 text-xs"
          />
          <FieldError>{errors.portalUrl?.message}</FieldError>
        </Field>
      </div>

      <Field>
        <Label className="text-xs font-medium">Stedi Payer ID</Label>
        <Input {...register("stediPayerId")} placeholder="Stedi internal ID" className="h-8 text-xs" />
      </Field>

      <Field>
        <Label className="text-xs font-medium">Claims Address</Label>
        <Textarea {...register("claimsAddress")} className="text-xs" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <Label className="text-xs font-medium">Timely Filing Days</Label>
          <Input
            {...register("timelyFilingDays")}
            type="number"
            min={1}
            max={365}
            className="h-8 text-xs tabular-nums"
          />
          <FieldError>{errors.timelyFilingDays?.message}</FieldError>
        </Field>
        <Field>
          <Label className="text-xs font-medium">Unit Calculation</Label>
          <Controller
            name="unitCalcMethod"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_CALC_METHODS.map((m) => (
                    <SelectItem key={m} value={m} className="text-xs">
                      {UNIT_CALC_METHOD_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field>
        <Label className="text-xs font-medium">Notes</Label>
        <Textarea {...register("notes")} className="text-xs" />
      </Field>

      {isEdit && (
        <Field orientation="horizontal">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label className="text-xs font-medium">Active</Label>
        </Field>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" size="sm" disabled={isPending} className="text-xs">
          {isPending ? (isEdit ? "Saving..." : "Adding...") : isEdit ? "Save Payer" : "Add Payer"}
        </Button>
      </div>
    </form>
  );
}
