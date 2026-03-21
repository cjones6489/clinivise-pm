"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { createPayerSchema, type CreatePayerInput } from "@/lib/validators/payers";
import { createPayer } from "@/server/actions/payers";
import type { PayerOption } from "@/server/queries/clients";
import { PAYER_TYPES, PAYER_TYPE_LABELS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PayerQuickAddDialog({
  open,
  onOpenChange,
  onPayerCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayerCreated: (payer: PayerOption) => void;
}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePayerInput>({
    resolver: zodResolver(createPayerSchema),
    defaultValues: {
      name: "",
      payerType: "commercial",
      phone: "",
    },
  });

  const { execute, isPending } = useAction(createPayer, {
    onSuccess: ({ data }) => {
      if (data?.success && data.data) {
        setHasSubmitted(true);
        toast.success("Payer added");
        onPayerCreated({
          id: data.data.id,
          name: data.data.name,
          payerType: data.data.payerType,
        });
        reset();
        setHasSubmitted(false);
        onOpenChange(false);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to add payer");
    },
  });

  function onSubmit(data: CreatePayerInput) {
    execute(data);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset();
      setHasSubmitted(false);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Add Payer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <Label className="text-xs font-medium">Payer Name</Label>
            <Input {...register("name")} className="h-8 text-xs" />
            <FieldError>{errors.name?.message}</FieldError>
          </Field>
          <div className="grid grid-cols-2 gap-4">
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
            <Field>
              <Label className="text-xs font-medium">Phone</Label>
              <Input {...register("phone")} className="h-8 text-xs" />
            </Field>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || hasSubmitted}
              className="text-xs"
            >
              {isPending ? "Adding..." : "Add Payer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
