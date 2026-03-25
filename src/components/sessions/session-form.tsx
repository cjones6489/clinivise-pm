"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { nanoid } from "nanoid";

import { createSessionSchema, type CreateSessionInput } from "@/lib/validators/sessions";
import {
  createSession,
  updateSession,
  fetchMatchingAuthorizations,
} from "@/server/actions/sessions";
import type { SessionDetail, ProviderOption } from "@/server/queries/sessions";
import type { ClientOption } from "@/server/queries/authorizations";
import type { AuthServiceMatch } from "@/server/queries/sessions";
import {
  SESSION_STATUSES,
  SESSION_STATUS_LABELS,
  VALID_SESSION_TRANSITIONS,
  CPT_CODE_OPTIONS,
  PLACE_OF_SERVICE_CODES,
  PLACE_OF_SERVICE_LABELS,
  CREDENTIAL_LABELS,
  RBT_SUPERVISED_CPT_CODES,
  type CredentialType,
  type PlaceOfServiceCode,
  type SessionStatus,
} from "@/lib/constants";
import { parseTimeToMinutes, calculateUnitsFromMinutes } from "@/lib/utils";

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

const NONE_VALUE = "__none__";

function formatTimeFromTimestamp(ts: Date | null): string {
  if (!ts) return "";
  return format(new Date(ts), "HH:mm");
}

export function SessionForm({
  session,
  clientOptions,
  providerOptions,
  initialAuthMatches,
  preselectedClientId,
  preselectedProviderId,
}: {
  session?: SessionDetail;
  clientOptions: ClientOption[];
  providerOptions: ProviderOption[];
  initialAuthMatches?: AuthServiceMatch[];
  preselectedClientId?: string;
  preselectedProviderId?: string;
}) {
  const router = useRouter();
  const isEdit = !!session;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [clientInputValue, setClientInputValue] = useState("");
  const [authMatches, setAuthMatches] = useState<AuthServiceMatch[]>(initialAuthMatches ?? []);
  const [authLoading, setAuthLoading] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  const idempotencyKey = useMemo(() => nanoid(), []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
    defaultValues: {
      clientId: session?.clientId ?? preselectedClientId ?? "",
      providerId: session?.providerId ?? preselectedProviderId ?? "",
      supervisorId: session?.supervisorId ?? "",
      authorizationServiceId: session?.authorizationServiceId ?? "",
      sessionDate: session?.sessionDate ?? today,
      startTime: session ? formatTimeFromTimestamp(session.startTime) : "",
      endTime: session ? formatTimeFromTimestamp(session.endTime) : "",
      cptCode: (session?.cptCode ?? "") as CreateSessionInput["cptCode"],
      units: session?.units ?? 0,
      placeOfService: (session?.placeOfService ?? "12") as CreateSessionInput["placeOfService"],
      status: (session?.status ?? "completed") as CreateSessionInput["status"],
      notes: session?.notes ?? "",
      idempotencyKey: "",
    },
  });

  const selectedClientId = watch("clientId");
  const selectedProviderId = watch("providerId");
  const selectedCptCode = watch("cptCode");
  const selectedSessionDate = watch("sessionDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Get selected provider info
  const selectedProvider = useMemo(
    () => providerOptions.find((p) => p.id === selectedProviderId),
    [providerOptions, selectedProviderId],
  );

  // Supervisor options (BCBAs only)
  const supervisorOptions = useMemo(
    () =>
      providerOptions.filter((p) => p.credentialType === "bcba" || p.credentialType === "bcba_d"),
    [providerOptions],
  );

  // Cascade 1: Provider change → auto-set supervisorId
  useEffect(() => {
    if (!selectedProvider || isEdit) return;
    if (
      (selectedProvider.credentialType === "rbt" || selectedProvider.credentialType === "bcaba") &&
      selectedProvider.supervisorId
    ) {
      setValue("supervisorId", selectedProvider.supervisorId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProviderId]);

  // Cascade 2: Client + CPT + Date → fetch matching authorizations
  const { executeAsync: loadAuthMatches } = useAction(fetchMatchingAuthorizations);

  useEffect(() => {
    if (!selectedClientId || !selectedCptCode || !selectedSessionDate) return;
    // Don't refetch for initial edit load
    if (isEdit && selectedClientId === session?.clientId && initialAuthMatches) return;

    let cancelled = false;
    setAuthLoading(true);

    loadAuthMatches({
      clientId: selectedClientId,
      cptCode: selectedCptCode,
      sessionDate: selectedSessionDate,
    })
      .then((result) => {
        if (cancelled) return;
        if (result?.data?.data) {
          const matches = result.data.data;
          setAuthMatches(matches);
          // FIFO auto-select first match (only for new sessions)
          if (!isEdit && matches.length > 0) {
            setValue("authorizationServiceId", matches[0]!.authServiceId);
          }
        } else {
          setAuthMatches([]);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load matching authorizations");
        }
      })
      .finally(() => {
        if (!cancelled) setAuthLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId, selectedCptCode, selectedSessionDate]);

  // Cascade 3: StartTime + EndTime → calculate units (timezone-safe string arithmetic)
  useEffect(() => {
    if (!startTime || !endTime) return;
    const minutes = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
    const units = calculateUnitsFromMinutes(minutes);
    if (units >= 0) {
      setValue("units", units);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  const filteredClients = useMemo(() => {
    if (!clientInputValue) return clientOptions;
    const lower = clientInputValue.toLowerCase();
    return clientOptions.filter(
      (c) => c.lastName.toLowerCase().includes(lower) || c.firstName.toLowerCase().includes(lower),
    );
  }, [clientInputValue, clientOptions]);

  const { execute: executeCreate, isPending: isCreating } = useAction(createSession, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Session logged");
        router.push("/sessions");
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to create session");
    },
  });

  const { execute: executeUpdate, isPending: isUpdating } = useAction(updateSession, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Session updated");
        router.push(`/sessions/${session!.id}`);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to update session");
    },
  });

  const isPending = isCreating || isUpdating || hasSubmitted;

  function onSubmit(data: CreateSessionInput) {
    if (isEdit) {
      executeUpdate({ ...data, id: session.id, updatedAt: session.updatedAt.toISOString() });
    } else {
      executeCreate({ ...data, idempotencyKey });
    }
  }

  // Check if RBT + supervised CPT code + no supervisor
  const showSupervisorWarning =
    selectedProvider &&
    (selectedProvider.credentialType === "rbt" || selectedProvider.credentialType === "bcaba") &&
    RBT_SUPERVISED_CPT_CODES.includes(
      selectedCptCode as (typeof RBT_SUPERVISED_CPT_CODES)[number],
    ) &&
    !watch("supervisorId");

  // In edit mode, only show current status + valid transitions
  const availableStatuses = useMemo(() => {
    if (!isEdit || !session) return SESSION_STATUSES;
    const currentStatus = session.status as SessionStatus;
    const validTargets = VALID_SESSION_TRANSITIONS[currentStatus] ?? [];
    return [currentStatus, ...validTargets] as readonly SessionStatus[];
  }, [isEdit, session]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Section 1: Client & Provider */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Client & Provider</h3>
        <Field>
          <Label className="text-xs font-medium">Client</Label>
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <Combobox
                value={field.value || null}
                onValueChange={(val) => field.onChange(val)}
                onInputValueChange={(val) => setClientInputValue(val)}
                filter={null}
                itemToStringLabel={(id: string) => {
                  const c = clientOptions.find((o) => o.id === id);
                  return c ? `${c.lastName}, ${c.firstName}` : "";
                }}
                disabled={isEdit}
              >
                <ComboboxInput placeholder="Search clients..." className="h-8 text-xs" />
                <ComboboxContent>
                  <ComboboxList>
                    {filteredClients.map((c) => (
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

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Provider</Label>
            <Controller
              name="providerId"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions.map((p) => {
                      const label =
                        CREDENTIAL_LABELS[p.credentialType as CredentialType] ?? p.credentialType;
                      return (
                        <SelectItem key={p.id} value={p.id} className="text-xs">
                          {p.lastName}, {p.firstName} ({label})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.providerId?.message}</FieldError>
          </Field>

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
                        {s.lastName}, {s.firstName} (
                        {CREDENTIAL_LABELS[s.credentialType as CredentialType]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        {showSupervisorWarning && (
          <p className="text-xs text-amber-600">
            This provider requires a supervising BCBA for CPT {selectedCptCode}. Add a supervisor or
            ensure one is assigned on the provider record.
          </p>
        )}
      </div>

      {/* Section 2: Session Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Session Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field>
            <Label className="text-xs font-medium">Date</Label>
            <Input type="date" {...register("sessionDate")} className="h-8 text-xs" />
            <FieldError>{errors.sessionDate?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">CPT Code</Label>
            <Controller
              name="cptCode"
              control={control}
              render={({ field }) => (
                <Select value={field.value || ""} onValueChange={field.onChange}>
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
            <FieldError>{errors.cptCode?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Place of Service</Label>
            <Controller
              name="placeOfService"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLACE_OF_SERVICE_CODES.map((code) => (
                      <SelectItem key={code} value={code} className="text-xs">
                        {code} — {PLACE_OF_SERVICE_LABELS[code as PlaceOfServiceCode]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field>
            <Label className="text-xs font-medium">Start Time</Label>
            <Input type="time" {...register("startTime")} className="h-8 text-xs" />
            <FieldError>{errors.startTime?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">End Time</Label>
            <Input type="time" {...register("endTime")} className="h-8 text-xs" />
            <FieldError>{errors.endTime?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Units</Label>
            <Input
              type="number"
              min={0}
              {...register("units")}
              className="h-8 text-xs tabular-nums"
            />
            <FieldError>{errors.units?.message}</FieldError>
          </Field>
        </div>

        <Field>
          <Label className="text-xs font-medium">Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-8 w-48 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableStatuses.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {SESSION_STATUS_LABELS[s as SessionStatus]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError>{errors.status?.message}</FieldError>
        </Field>
      </div>

      {/* Section 3: Authorization */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Authorization</h3>
        {selectedClientId && selectedCptCode && selectedSessionDate ? (
          authLoading ? (
            <p className="text-muted-foreground text-xs">Loading matching authorizations...</p>
          ) : authMatches.length > 0 ? (
            <Field>
              <Label className="text-xs font-medium">Matching Authorization</Label>
              <Controller
                name="authorizationServiceId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || NONE_VALUE}
                    onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue placeholder="Select authorization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE} className="text-xs">
                        No authorization
                      </SelectItem>
                      {authMatches.map((m) => (
                        <SelectItem
                          key={m.authServiceId}
                          value={m.authServiceId}
                          className="text-xs"
                        >
                          Auth #{m.authorizationNumber ?? m.authorizationId.slice(0, 8)} —{" "}
                          {m.remainingUnits} units remaining
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          ) : (
            <p className="text-xs text-amber-600">
              No matching authorization found for this client, CPT code, and date. The session will
              be created without an authorization link.
            </p>
          )
        ) : (
          <p className="text-muted-foreground text-xs">
            Select a client, CPT code, and date to find matching authorizations.
          </p>
        )}
      </div>

      {/* Section 4: Notes */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold">Notes</h3>
        <Field>
          <Textarea {...register("notes")} className="text-xs" />
        </Field>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" disabled={isPending} className="text-xs">
          {isPending
            ? isEdit
              ? "Saving..."
              : "Logging..."
            : isEdit
              ? "Save Changes"
              : "Log Session"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => router.push(isEdit ? `/sessions/${session.id}` : "/sessions")}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
