"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createAuthorizationSchema,
  type CreateAuthorizationInput,
} from "@/lib/validators/authorizations";
import {
  createAuthorization,
  updateAuthorization,
  fetchClientInsuranceOptions,
  fetchAuthorizationOptions,
} from "@/server/actions/authorizations";
import type { AuthorizationWithServices, ClientOption } from "@/server/queries/authorizations";
import type { ClientInsuranceOption, AuthorizationOption } from "@/server/queries/authorizations";
import {
  AUTH_STATUSES,
  AUTH_STATUS_LABELS,
  CPT_CODE_OPTIONS,
  ABA_CPT_CODES,
  SERVICE_FREQUENCIES,
  SERVICE_FREQUENCY_LABELS,
  type CptCode,
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
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete01Icon } from "@hugeicons/core-free-icons";

const NONE_VALUE = "__none__";

export function AuthorizationForm({
  authorization,
  clientOptions,
  insuranceOptions: initialInsuranceOptions,
  authorizationOptions: initialAuthOptions,
  disabled,
  preselectedClientId,
}: {
  authorization?: AuthorizationWithServices;
  clientOptions: ClientOption[];
  insuranceOptions?: ClientInsuranceOption[];
  authorizationOptions?: AuthorizationOption[];
  disabled?: boolean;
  preselectedClientId?: string;
}) {
  const router = useRouter();
  const isEdit = !!authorization;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [insuranceOptions, setInsuranceOptions] = useState<ClientInsuranceOption[]>(
    initialInsuranceOptions ?? [],
  );
  const [authOptions, setAuthOptions] = useState<AuthorizationOption[]>(initialAuthOptions ?? []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateAuthorizationInput>({
    resolver: zodResolver(createAuthorizationSchema),
    defaultValues: {
      clientId: authorization?.clientId ?? preselectedClientId ?? "",
      payerId: authorization?.payerId ?? "",
      clientInsuranceId: authorization?.clientInsuranceId ?? "",
      previousAuthorizationId: authorization?.previousAuthorizationId ?? "",
      authorizationNumber: authorization?.authorizationNumber ?? "",
      authType: authorization?.authType ?? "",
      requestingProviderId: authorization?.requestingProviderId ?? "",
      status: (authorization?.status as CreateAuthorizationInput["status"]) ?? "pending",
      startDate: authorization?.startDate ?? "",
      endDate: authorization?.endDate ?? "",
      diagnosisCode: authorization?.diagnosisCode ?? "",
      denialReason: authorization?.denialReason ?? "",
      appealDeadline: authorization?.appealDeadline ?? "",
      notes: authorization?.notes ?? "",
      services: authorization?.services.map((s) => ({
        id: s.id,
        cptCode: s.cptCode,
        approvedUnits: s.approvedUnits,
        frequency: s.frequency ?? "",
        maxUnitsPerDay: s.maxUnitsPerDay ?? ("" as unknown as undefined),
        maxUnitsPerWeek: s.maxUnitsPerWeek ?? ("" as unknown as undefined),
        notes: s.notes ?? "",
      })) ?? [
        {
          cptCode: "" as "97153",
          approvedUnits: "" as unknown as number,
          frequency: "",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  const selectedClientId = watch("clientId");
  const currentStatus = watch("status");

  // Cascade: fetch insurance + authorization options when client changes
  const { executeAsync: loadInsurance } = useAction(fetchClientInsuranceOptions);
  const { executeAsync: loadAuthOptions } = useAction(fetchAuthorizationOptions);

  useEffect(() => {
    if (!selectedClientId || disabled) return;
    // Don't refetch if client hasn't changed during edit
    if (isEdit && selectedClientId === authorization?.clientId && initialInsuranceOptions) return;

    let cancelled = false;

    Promise.all([
      loadInsurance({ clientId: selectedClientId }),
      loadAuthOptions({ clientId: selectedClientId }),
    ])
      .then(([insResult, authResult]) => {
        if (cancelled) return;
        // Insurance options
        if (insResult?.data?.data) {
          const opts = insResult.data.data;
          setInsuranceOptions(opts);
          // Auto-select primary insurance (priority=1)
          const primary = opts.find((o) => o.priority === 1);
          if (primary) {
            setValue("clientInsuranceId", primary.id);
            setValue("payerId", primary.payerId);
          } else if (opts.length === 1) {
            setValue("clientInsuranceId", opts[0]!.id);
            setValue("payerId", opts[0]!.payerId);
          } else {
            setValue("clientInsuranceId", "");
            setValue("payerId", "");
          }
        }
        // Authorization options (for previous auth selector)
        if (authResult?.data?.data) {
          setAuthOptions(authResult.data.data);
        } else {
          setAuthOptions([]);
        }
        setValue("previousAuthorizationId", "");
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load options for this client");
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);

  const { execute: executeCreate, isPending: isCreating } = useAction(createAuthorization, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Authorization created");
        router.push("/authorizations");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to create authorization");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateAuthorization, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Authorization updated");
        router.push(`/authorizations/${authorization!.id}`);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update authorization");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  // RHF types the handler with the input type; zodResolver guarantees validated output
  // and the server action re-validates — so passing input type is safe
  function onSubmit(data: CreateAuthorizationInput) {
    if (isEdit) {
      executeUpdate({
        ...data,
        id: authorization.id,
        updatedAt: authorization.updatedAt.toISOString(),
      });
    } else {
      executeCreate(data);
    }
  }

  function handleInsuranceChange(insuranceId: string) {
    setValue("clientInsuranceId", insuranceId);
    const ins = insuranceOptions.find((o) => o.id === insuranceId);
    if (ins) {
      setValue("payerId", ins.payerId);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Client & Insurance */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Client & Insurance</h3>
        <Field>
          <Label className="text-xs font-medium">Client</Label>
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <Combobox
                value={field.value || null}
                onValueChange={(val) => field.onChange(val)}
                filter={(value, inputValue) => {
                  if (!inputValue) return true;
                  const c = clientOptions.find((o) => o.id === value);
                  const name = c ? `${c.lastName} ${c.firstName}` : "";
                  return name.toLowerCase().includes(inputValue.toLowerCase());
                }}
                itemToStringLabel={(id: string) => {
                  const c = clientOptions.find((o) => o.id === id);
                  return c ? `${c.lastName}, ${c.firstName}` : "";
                }}
                disabled={disabled || isEdit}
              >
                <ComboboxInput placeholder="Search clients..." className="h-8 text-xs" />
                <ComboboxContent>
                  <ComboboxList>
                    {clientOptions.map((c) => (
                      <ComboboxItem key={c.id} value={c.id}>
                        {c.lastName}, {c.firstName}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>No clients found.</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            )}
          />
          <FieldError>{errors.clientId?.message}</FieldError>
        </Field>

        {selectedClientId && insuranceOptions.length === 0 && !disabled && (
          <p className="text-xs text-amber-600">
            This client has no active insurance. Add insurance on the client detail page first.
          </p>
        )}

        {insuranceOptions.length > 0 && (
          <Field>
            <Label className="text-xs font-medium">Insurance Policy</Label>
            <Controller
              name="clientInsuranceId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(v) => handleInsuranceChange(v)}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="Select insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceOptions.map((ins) => (
                      <SelectItem key={ins.id} value={ins.id} className="text-xs">
                        {ins.payerName} — {ins.memberId} (Priority {ins.priority})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.clientInsuranceId?.message}</FieldError>
          </Field>
        )}

        {/* Hidden payerId — auto-set from insurance selection */}
        <input type="hidden" {...register("payerId")} />
      </div>

      {/* Authorization Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Authorization Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Auth Number</Label>
            <Input
              {...register("authorizationNumber")}
              className="h-8 text-xs"
              disabled={disabled}
            />
          </Field>
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
                    {AUTH_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {AUTH_STATUS_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.status?.message}</FieldError>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Auth Type</Label>
            <Controller
              name="authType"
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
                    <SelectItem value={NONE_VALUE} className="text-xs">Not specified</SelectItem>
                    <SelectItem value="initial" className="text-xs">Initial</SelectItem>
                    <SelectItem value="recertification" className="text-xs">Recertification</SelectItem>
                    <SelectItem value="concurrent_review" className="text-xs">Concurrent Review</SelectItem>
                    <SelectItem value="peer_to_peer" className="text-xs">Peer-to-Peer</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Requesting Provider Name</Label>
            <Input
              {...register("requestingProviderId")}
              placeholder="Dr. Sarah Chen, BCBA"
              className="h-8 text-xs"
              disabled={disabled}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Start Date</Label>
            <Input
              type="date"
              {...register("startDate")}
              className="h-8 text-xs"
              disabled={disabled}
            />
            <FieldError>{errors.startDate?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">End Date</Label>
            <Input
              type="date"
              {...register("endDate")}
              className="h-8 text-xs"
              disabled={disabled}
            />
            <FieldError>{errors.endDate?.message}</FieldError>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Diagnosis Code</Label>
            <Input
              {...register("diagnosisCode")}
              placeholder="F84.0"
              className="h-8 text-xs"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Previous Authorization</Label>
            <Controller
              name="previousAuthorizationId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || NONE_VALUE}
                  onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  disabled={disabled || authOptions.length === 0}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE} className="text-xs">
                      None
                    </SelectItem>
                    {authOptions
                      .filter((a) => a.id !== authorization?.id)
                      .map((a) => (
                        <SelectItem key={a.id} value={a.id} className="text-xs">
                          {a.authorizationNumber ?? a.id.slice(0, 8)} ({a.startDate} — {a.endDate})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>
        {currentStatus === "denied" && (
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label className="text-xs font-medium">Denial Reason</Label>
              <Input
                {...register("denialReason")}
                placeholder="Reason for denial"
                className="h-8 text-xs"
                disabled={disabled}
              />
            </Field>
            <Field>
              <Label className="text-xs font-medium">Appeal Deadline</Label>
              <Input
                type="date"
                {...register("appealDeadline")}
                className="h-8 text-xs"
                disabled={disabled}
              />
            </Field>
          </div>
        )}
      </div>

      {/* Service Lines */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Service Lines</h3>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() =>
                append({
                  cptCode: "" as "97153",
                  approvedUnits: "" as unknown as number,
                  frequency: "",
                  notes: "",
                })
              }
            >
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1" />
              Add Service
            </Button>
          )}
        </div>
        {typeof errors.services?.message === "string" && (
          <p className="text-destructive text-xs">{errors.services.message}</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="border-border space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Service {index + 1}</span>
              {!disabled && fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-7 w-7"
                  onClick={() => remove(index)}
                >
                  <HugeiconsIcon icon={Delete01Icon} size={14} />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label className="text-xs font-medium">CPT Code</Label>
                <Controller
                  name={`services.${index}.cptCode`}
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      value={f.value || ""}
                      onValueChange={(v) => {
                        f.onChange(v);
                        // Auto-fill maxUnitsPerDay from CPT metadata
                        const meta = ABA_CPT_CODES[v as CptCode];
                        if (meta) {
                          setValue(`services.${index}.maxUnitsPerDay`, meta.maxUnitsPerDay);
                        }
                      }}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue placeholder="Select CPT code" />
                      </SelectTrigger>
                      <SelectContent>
                        {CPT_CODE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value} className="text-xs">
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.services?.[index]?.cptCode?.message}</FieldError>
              </Field>
              <Field>
                <Label className="text-xs font-medium">Approved Units</Label>
                <Input
                  type="number"
                  min={1}
                  {...register(`services.${index}.approvedUnits`)}
                  className="h-8 text-xs tabular-nums"
                  disabled={disabled}
                />
                <FieldError>{errors.services?.[index]?.approvedUnits?.message}</FieldError>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <Label className="text-xs font-medium">Frequency</Label>
                <Controller
                  name={`services.${index}.frequency`}
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      value={f.value || NONE_VALUE}
                      onValueChange={(v) => f.onChange(v === NONE_VALUE ? "" : v)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE_VALUE} className="text-xs">
                          Not specified
                        </SelectItem>
                        {SERVICE_FREQUENCIES.map((freq) => (
                          <SelectItem key={freq} value={freq} className="text-xs">
                            {SERVICE_FREQUENCY_LABELS[freq]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field>
                <Label className="text-xs font-medium">Max Units/Day</Label>
                <Input
                  type="number"
                  min={0}
                  {...register(`services.${index}.maxUnitsPerDay`)}
                  className="h-8 text-xs tabular-nums"
                  disabled={disabled}
                />
              </Field>
              <Field>
                <Label className="text-xs font-medium">Max Units/Week</Label>
                <Input
                  type="number"
                  min={0}
                  {...register(`services.${index}.maxUnitsPerWeek`)}
                  className="h-8 text-xs tabular-nums"
                  disabled={disabled}
                />
              </Field>
            </div>
            <Field>
              <Label className="text-xs font-medium">Notes</Label>
              <Input
                {...register(`services.${index}.notes`)}
                className="h-8 text-xs"
                disabled={disabled}
              />
            </Field>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Notes</h3>
        <Field>
          <Textarea {...register("notes")} className="text-xs" disabled={disabled} />
        </Field>
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
                : "Create Authorization"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() =>
              router.push(isEdit ? `/authorizations/${authorization.id}` : "/authorizations")
            }
            disabled={isPending}
          >
            Cancel
          </Button>
        </div>
      )}
    </form>
  );
}
