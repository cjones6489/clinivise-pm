"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import {
  createInsuranceSchema,
  type CreateInsuranceInput,
} from "@/lib/validators/client-insurance";
import { createInsurance, updateInsurance } from "@/server/actions/client-insurance";
import type { ClientInsuranceWithPayer, PayerOption } from "@/server/queries/clients";
import type { ClientContact } from "@/server/queries/clients";
import {
  SUBSCRIBER_RELATIONSHIPS,
  SUBSCRIBER_RELATIONSHIP_LABELS,
  GENDERS,
  PAYER_TYPE_LABELS,
  type PayerType,
} from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError } from "@/components/ui/field";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import { PayerQuickAddDialog } from "./payer-quick-add-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

export function ClientInsuranceForm({
  clientId,
  contacts,
  payerOptions,
  insurance,
  onSuccess,
  onPayerCreated,
  canManagePayers,
}: {
  clientId: string;
  contacts: ClientContact[];
  payerOptions: PayerOption[];
  insurance?: ClientInsuranceWithPayer;
  onSuccess: () => void;
  onPayerCreated: (payer: PayerOption) => void;
  canManagePayers: boolean;
}) {
  const isEdit = !!insurance;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [payerInputValue, setPayerInputValue] = useState("");
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const guardian = contacts.find((c) => c.isLegalGuardian);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateInsuranceInput>({
    resolver: zodResolver(createInsuranceSchema),
    defaultValues: {
      clientId,
      payerId: insurance?.payerId ?? "",
      memberId: insurance?.memberId ?? "",
      groupNumber: insurance?.groupNumber ?? "",
      planName: insurance?.planName ?? "",
      relationshipToSubscriber:
        (insurance?.relationshipToSubscriber as CreateInsuranceInput["relationshipToSubscriber"]) ??
        "child",
      subscriberFirstName: insurance?.subscriberFirstName ?? "",
      subscriberLastName: insurance?.subscriberLastName ?? "",
      subscriberDateOfBirth: insurance?.subscriberDateOfBirth ?? "",
      subscriberGender: insurance?.subscriberGender as CreateInsuranceInput["subscriberGender"],
      subscriberAddressLine1: insurance?.subscriberAddressLine1 ?? "",
      subscriberCity: insurance?.subscriberCity ?? "",
      subscriberState: insurance?.subscriberState ?? "",
      subscriberZipCode: insurance?.subscriberZipCode ?? "",
      priority: insurance?.priority ?? 1,
      effectiveDate: insurance?.effectiveDate ?? "",
      terminationDate: insurance?.terminationDate ?? "",
    },
  });

  const relationship = watch("relationshipToSubscriber");
  const showSubscriber = relationship !== "self";

  const filteredPayers = useMemo(() => {
    if (!payerInputValue) return payerOptions;
    const lower = payerInputValue.toLowerCase();
    return payerOptions.filter((p) => p.name.toLowerCase().includes(lower));
  }, [payerInputValue, payerOptions]);

  const { execute: executeCreate, isPending: isCreating } = useAction(createInsurance, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Insurance policy added");
        onSuccess();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to add insurance policy");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateInsurance, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Insurance policy updated");
        onSuccess();
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update insurance policy");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  function onSubmit(data: CreateInsuranceInput) {
    if (isEdit) {
      executeUpdate({ ...data, id: insurance.id, updatedAt: insurance.updatedAt.toISOString() });
    } else {
      executeCreate(data);
    }
  }

  function autoFillFromGuardian() {
    if (!guardian) return;
    setValue("subscriberFirstName", guardian.firstName);
    setValue("subscriberLastName", guardian.lastName);
  }

  if (payerOptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground text-xs">
          {canManagePayers ? (
            <>
              No payers configured.{" "}
              <a href="/settings" className="text-primary underline">
                Add payers in Settings
              </a>{" "}
              first.
            </>
          ) : (
            "No payers configured. Contact your admin to add payers."
          )}
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Payer Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Payer</h3>
          <Field>
            <Label className="text-xs font-medium">Insurance Payer</Label>
            <Controller
              name="payerId"
              control={control}
              render={({ field }) => (
                <Combobox
                  value={field.value || null}
                  onValueChange={(val) => {
                    field.onChange(val);
                  }}
                  onInputValueChange={(val) => setPayerInputValue(val)}
                  filter={null}
                  itemToStringLabel={(id: string) =>
                    payerOptions.find((p) => p.id === id)?.name ?? ""
                  }
                >
                  <ComboboxInput placeholder="Search payers..." className="h-8 text-xs" />
                  <ComboboxContent>
                    <ComboboxList>
                      {filteredPayers.map((p) => (
                        <ComboboxItem key={p.id} value={p.id}>
                          <span>{p.name}</span>
                          {p.payerType && (
                            <Badge variant="outline" className="ml-auto text-[10px]">
                              {PAYER_TYPE_LABELS[p.payerType as PayerType] ?? p.payerType}
                            </Badge>
                          )}
                        </ComboboxItem>
                      ))}
                      <ComboboxEmpty>No payers found.</ComboboxEmpty>
                      {canManagePayers && (
                        <>
                          <ComboboxSeparator />
                          <button
                            type="button"
                            className="text-primary hover:bg-accent flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setQuickAddOpen(true);
                            }}
                          >
                            <HugeiconsIcon icon={Add01Icon} size={14} />
                            Add New Payer
                          </button>
                        </>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            <FieldError>{errors.payerId?.message}</FieldError>
          </Field>
        </div>

        {/* Policy Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Policy Details</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field>
              <Label className="text-xs font-medium">Member ID</Label>
              <Input {...register("memberId")} className="h-8 text-xs" />
              <FieldError>{errors.memberId?.message}</FieldError>
            </Field>
            <Field>
              <Label className="text-xs font-medium">Group #</Label>
              <Input {...register("groupNumber")} className="h-8 text-xs" />
            </Field>
            <Field>
              <Label className="text-xs font-medium">Plan Name</Label>
              <Input {...register("planName")} className="h-8 text-xs" />
            </Field>
          </div>
        </div>

        {/* Subscriber */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Subscriber</h3>
            {showSubscriber && guardian && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={autoFillFromGuardian}
              >
                Auto-fill from {guardian.firstName} {guardian.lastName}
              </Button>
            )}
          </div>
          <Field>
            <Label className="text-xs font-medium">Relationship to Subscriber</Label>
            <Controller
              name="relationshipToSubscriber"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBSCRIBER_RELATIONSHIPS.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {SUBSCRIBER_RELATIONSHIP_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          {showSubscriber && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-xs font-medium">First Name</Label>
                  <Input {...register("subscriberFirstName")} className="h-8 text-xs" />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">Last Name</Label>
                  <Input {...register("subscriberLastName")} className="h-8 text-xs" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="text-xs font-medium">Date of Birth</Label>
                  <Input
                    type="date"
                    {...register("subscriberDateOfBirth")}
                    className="h-8 text-xs"
                  />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">Gender</Label>
                  <Controller
                    name="subscriberGender"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange}>
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {GENDERS.map((g) => (
                            <SelectItem key={g} value={g} className="text-xs">
                              {g === "M" ? "Male" : g === "F" ? "Female" : "Unknown"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <Label className="text-xs font-medium">Address</Label>
                <Input
                  {...register("subscriberAddressLine1")}
                  placeholder="Street address"
                  className="h-8 text-xs"
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <Label className="text-xs font-medium">City</Label>
                  <Input {...register("subscriberCity")} className="h-8 text-xs" />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">State</Label>
                  <Input {...register("subscriberState")} className="h-8 text-xs" />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">ZIP</Label>
                  <Input {...register("subscriberZipCode")} className="h-8 text-xs" />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* Coverage Dates */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Coverage</h3>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label className="text-xs font-medium">Effective Date</Label>
              <Input type="date" {...register("effectiveDate")} className="h-8 text-xs" />
            </Field>
            <Field>
              <Label className="text-xs font-medium">Termination Date</Label>
              <Input type="date" {...register("terminationDate")} className="h-8 text-xs" />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" size="sm" disabled={isPending} className="text-xs">
            {isPending
              ? isEdit
                ? "Saving..."
                : "Adding..."
              : isEdit
                ? "Save Policy"
                : "Add Policy"}
          </Button>
        </div>
      </form>

      <PayerQuickAddDialog
        open={quickAddOpen}
        onOpenChange={setQuickAddOpen}
        onPayerCreated={(payer) => {
          onPayerCreated(payer);
          setValue("payerId", payer.id);
        }}
      />
    </>
  );
}
