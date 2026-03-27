"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  fetchClientSessionDefaults,
} from "@/server/actions/sessions";
import type { SessionDetail, ProviderOption } from "@/server/queries/sessions";
import type { ClientOption } from "@/server/queries/authorizations";
import type { AuthServiceMatch } from "@/server/queries/sessions";
import {
  CPT_CODE_OPTIONS,
  PLACE_OF_SERVICE_CODES,
  PLACE_OF_SERVICE_LABELS,
  CREDENTIAL_LABELS,
  CREDENTIAL_MODIFIERS,
  RBT_SUPERVISED_CPT_CODES,
  QHP_ONLY_CPT_CODES,
  ADDITIONAL_MODIFIER_OPTIONS,
  MAX_MODIFIERS_PER_LINE,
  type CredentialType,
  type PlaceOfServiceCode,
} from "@/lib/constants";
import { parseTimeToMinutes, calculateUnitsFromMinutes, cn } from "@/lib/utils";

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
import { Badge } from "@/components/ui/badge";
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
  prefilledCptCode,
  prefilledPlaceOfService,
}: {
  session?: SessionDetail;
  clientOptions: ClientOption[];
  providerOptions: ProviderOption[];
  initialAuthMatches?: AuthServiceMatch[];
  preselectedClientId?: string;
  preselectedProviderId?: string;
  /** Pre-fill from client's last completed session */
  prefilledCptCode?: string;
  /** Pre-fill from client's last completed session */
  prefilledPlaceOfService?: string;
}) {
  const router = useRouter();
  const isEdit = !!session;
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [authMatches, setAuthMatches] = useState<AuthServiceMatch[]>(initialAuthMatches ?? []);
  const [authLoading, setAuthLoading] = useState(false);

  const today = format(new Date(), "yyyy-MM-dd");
  // Generate fresh key per submission attempt (not per mount) to prevent
  // stale keys after browser back/forward navigation
  const idempotencyKeyRef = useRef("");

  // Compute initial user-added modifiers for edit mode by subtracting auto-computed ones
  const initialUserModifiers = useMemo(() => {
    if (!session?.modifierCodes) return [];
    const autoSet = new Set<string>();
    if (session.providerId) {
      const provider = providerOptions.find((p) => p.id === session.providerId);
      if (provider) {
        const cred = CREDENTIAL_MODIFIERS[provider.credentialType];
        if (cred) autoSet.add(cred);
      }
    }
    if (session.placeOfService === "02" || session.placeOfService === "10") {
      autoSet.add("95");
    }
    return session.modifierCodes.filter((m) => !autoSet.has(m));
  }, [session, providerOptions]);

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
      cptCode: (session?.cptCode ?? prefilledCptCode ?? "") as CreateSessionInput["cptCode"],
      units: session?.units ?? 0,
      placeOfService: (session?.placeOfService ??
        prefilledPlaceOfService ??
        "12") as CreateSessionInput["placeOfService"],
      status: (session?.status ?? "completed") as CreateSessionInput["status"],
      modifierCodes: initialUserModifiers,
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
  const watchedPlaceOfService = watch("placeOfService");

  // Get selected provider info
  const selectedProvider = useMemo(
    () => providerOptions.find((p) => p.id === selectedProviderId),
    [providerOptions, selectedProviderId],
  );

  // Auto-assigned modifiers (credential + telehealth) — read-only in UI
  const selectedCredentialType = selectedProvider?.credentialType;
  const autoModifiers = useMemo(() => {
    const mods: string[] = [];
    if (selectedCredentialType) {
      const cred = CREDENTIAL_MODIFIERS[selectedCredentialType];
      if (cred) mods.push(cred);
    }
    if (watchedPlaceOfService === "02" || watchedPlaceOfService === "10") {
      mods.push("95");
    }
    return mods;
  }, [selectedCredentialType, watchedPlaceOfService]);

  // Cascade: when auto modifiers change, strip conflicts & trim overflow from user modifiers
  useEffect(() => {
    const current = watch("modifierCodes") ?? [];
    if (current.length === 0) return;
    const autoSet = new Set(autoModifiers);
    // Remove user modifiers that are now auto-assigned (e.g., user added "95" then POS changed to telehealth)
    let cleaned = current.filter((m) => !autoSet.has(m));
    // Trim if total would exceed max
    const maxUserSlots = MAX_MODIFIERS_PER_LINE - autoModifiers.length;
    if (cleaned.length > maxUserSlots) {
      cleaned = cleaned.slice(0, maxUserSlots);
    }
    if (cleaned.length !== current.length) {
      setValue("modifierCodes", cleaned);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoModifiers]);

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

  // Cascade 1.5: Client change → pre-fill CPT + POS from last session
  const { executeAsync: loadDefaults } = useAction(fetchClientSessionDefaults);
  // Track whether user has manually touched CPT or POS — never overwrite manual selections
  const userTouchedCpt = useRef(false);
  const userTouchedPos = useRef(false);

  useEffect(() => {
    if (!selectedClientId || isEdit) return;
    // Skip if user has already manually selected CPT or POS
    if (userTouchedCpt.current) return;

    loadDefaults({ clientId: selectedClientId })
      .then((result) => {
        if (result?.data?.data) {
          const { cptCode, placeOfService } = result.data.data;
          // Only set if user hasn't manually touched the field since the fetch started
          if (cptCode && !userTouchedCpt.current) {
            setValue("cptCode", cptCode as CreateSessionInput["cptCode"]);
          }
          if (placeOfService && !userTouchedPos.current) {
            setValue("placeOfService", placeOfService as CreateSessionInput["placeOfService"]);
          }
        }
      })
      .catch(() => {
        // Silently ignore — pre-fill is optional
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId]);

  // Cascade 2: Client + CPT + Date → fetch matching authorizations
  const { executeAsync: loadAuthMatches } = useAction(fetchMatchingAuthorizations);

  // Track initial edit values to skip only the very first load
  const [editInitialFetched, setEditInitialFetched] = useState(false);

  useEffect(() => {
    if (!selectedClientId || !selectedCptCode || !selectedSessionDate) return;
    // Skip only the initial mount in edit mode when we already have matches
    if (
      isEdit &&
      !editInitialFetched &&
      selectedClientId === session?.clientId &&
      selectedCptCode === session?.cptCode &&
      selectedSessionDate === session?.sessionDate &&
      initialAuthMatches
    ) {
      setEditInitialFetched(true);
      return;
    }

    let cancelled = false;
    setAuthLoading(true);
    setShowAuthPicker(false);

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
          // FIFO auto-select first match
          if (matches.length > 0) {
            setValue("authorizationServiceId", matches[0]!.authServiceId);
          } else {
            setValue("authorizationServiceId", "");
          }
        } else {
          setAuthMatches([]);
          setValue("authorizationServiceId", "");
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

  // Cascade 4: Status change → clear times/units for non-billable statuses
  const watchedStatusForClear = watch("status");
  useEffect(() => {
    if (watchedStatusForClear === "cancelled" || watchedStatusForClear === "no_show") {
      setValue("startTime", "");
      setValue("endTime", "");
      setValue("units", 0);
      setValue("authorizationServiceId", "");
      setValue("modifierCodes", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedStatusForClear]);

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
      // Generate fresh idempotency key per submit attempt
      idempotencyKeyRef.current = nanoid();
      executeCreate({ ...data, idempotencyKey: idempotencyKeyRef.current });
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

  // Logged sessions are always "completed" — status changes (cancel) happen via dedicated action
  const watchedStatus = watch("status");
  const watchedUnits = watch("units");
  const isNonBillableStatus = watchedStatus === "cancelled" || watchedStatus === "no_show";

  // Auto-calculated values for info card
  const autoCalc = useMemo(() => {
    if (!startTime || !endTime || isNonBillableStatus) return null;
    const minutes = parseTimeToMinutes(endTime) - parseTimeToMinutes(startTime);
    if (minutes <= 0) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const units = calculateUnitsFromMinutes(minutes);
    return { hours, mins, units };
  }, [startTime, endTime, isNonBillableStatus]);

  // Auth check card state
  const selectedAuthServiceId = watch("authorizationServiceId");
  const selectedAuth = useMemo(
    () => authMatches.find((m) => m.authServiceId === selectedAuthServiceId) ?? null,
    [authMatches, selectedAuthServiceId],
  );
  const [showAuthPicker, setShowAuthPicker] = useState(false);

  // QHP-only CPT checks: hard block for RBT, soft warning for BCaBA
  const isQhpCode = (QHP_ONLY_CPT_CODES as readonly string[]).includes(selectedCptCode);
  const showQhpBlock = selectedProvider && selectedProvider.credentialType === "rbt" && isQhpCode;
  const showQhpWarning =
    selectedProvider && selectedProvider.credentialType === "bcaba" && isQhpCode;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Section 1: Client & Provider */}
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border/60 bg-muted/20 border-b px-4 py-2.5">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Client & Provider
          </span>
        </div>
        <div className="space-y-4 p-4">
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
                  disabled={isEdit}
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
            <p className="text-xs text-amber-600 dark:text-amber-400">
              This provider requires a supervising BCBA for CPT {selectedCptCode}. Add a supervisor
              or ensure one is assigned on the provider record.
            </p>
          )}
        </div>
      </div>

      {/* Section 2: Session Details */}
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border/60 bg-muted/20 border-b px-4 py-2.5">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Session Details
          </span>
        </div>
        <div className="space-y-4 p-4">
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
                  <Select
                    value={field.value || ""}
                    onValueChange={(v) => {
                      userTouchedCpt.current = true;
                      field.onChange(v);
                    }}
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
              <FieldError>{errors.cptCode?.message}</FieldError>
            </Field>
            <Field>
              <Label className="text-xs font-medium">Place of Service</Label>
              <Controller
                name="placeOfService"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      userTouchedPos.current = true;
                      field.onChange(v);
                    }}
                  >
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

          {showQhpBlock && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              CPT {selectedCptCode} requires a qualified healthcare professional (BCBA/BCBA-D). RBT
              providers cannot bill this code. This session will be blocked.
            </p>
          )}

          {showQhpWarning && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              CPT {selectedCptCode} typically requires a BCBA/BCBA-D. BCaBA eligibility varies by
              payer — verify with the client&apos;s insurance before billing.
            </p>
          )}

          {/* Status is always "completed" for logged sessions.
            Cancellation happens via the dedicated "Cancel Session" action on the detail page. */}
          <input type="hidden" {...register("status")} />

          {/* Time fields — hidden for cancelled/no_show */}
          {!isNonBillableStatus && (
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
          )}

          {/* Auto-calculated card */}
          {autoCalc && (
            <div className="flex items-center gap-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/30">
              <div>
                <div className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                  Duration
                </div>
                <div className="text-sm font-semibold tabular-nums">
                  {autoCalc.hours}h {autoCalc.mins}m
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                  Units
                </div>
                <div className="text-sm font-semibold tabular-nums">{autoCalc.units}</div>
              </div>
            </div>
          )}

          {/* Modifiers */}
          {!isNonBillableStatus && (
            <Controller
              name="modifierCodes"
              control={control}
              render={({ field }) => {
                const userMods = field.value ?? [];
                const totalCount = autoModifiers.length + userMods.length;
                const canAddMore = totalCount < MAX_MODIFIERS_PER_LINE;
                return (
                  <Field>
                    <Label className="text-xs font-medium">
                      Modifiers
                      <span className="text-muted-foreground ml-1 font-normal">
                        ({totalCount} of {MAX_MODIFIERS_PER_LINE})
                      </span>
                    </Label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Auto-assigned modifiers (read-only) */}
                      {autoModifiers.map((mod) => (
                        <Badge key={mod} variant="secondary" className="text-[10px]">
                          {mod}
                          <span className="text-muted-foreground ml-1">auto</span>
                        </Badge>
                      ))}
                      {/* User-added modifiers (removable) */}
                      {userMods.map((mod) => (
                        <Badge
                          key={mod}
                          variant="outline"
                          className="hover:bg-destructive/10 hover:text-destructive cursor-pointer text-[10px]"
                          onClick={() => field.onChange(userMods.filter((m) => m !== mod))}
                        >
                          {mod} ✕
                        </Badge>
                      ))}
                      {canAddMore && (
                        <Select
                          value=""
                          onValueChange={(val) => {
                            if (val && !userMods.includes(val)) {
                              field.onChange([...userMods, val]);
                            }
                          }}
                        >
                          <SelectTrigger className="text-muted-foreground h-6 w-auto min-w-24 gap-1 border-dashed px-2 text-[10px]">
                            <SelectValue placeholder="+ Add" />
                          </SelectTrigger>
                          <SelectContent>
                            {ADDITIONAL_MODIFIER_OPTIONS.filter(
                              (opt) =>
                                !autoModifiers.includes(opt.value) && !userMods.includes(opt.value),
                            ).map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <FieldError>{errors.modifierCodes?.message}</FieldError>
                  </Field>
                );
              }}
            />
          )}
        </div>
      </div>

      {/* Section 3: Authorization Check */}
      {!isNonBillableStatus && (
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
              Authorization
            </span>
            {selectedAuth && authMatches.length > 1 && !showAuthPicker && (
              <button
                type="button"
                onClick={() => setShowAuthPicker(true)}
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Change
              </button>
            )}
          </div>
          <div className="space-y-3 p-4">
            {selectedClientId && selectedCptCode && selectedSessionDate ? (
              authLoading ? (
                <div className="border-border bg-muted/30 rounded-lg border px-4 py-3">
                  <p className="text-muted-foreground text-xs">
                    Loading matching authorizations...
                  </p>
                </div>
              ) : selectedAuth && !showAuthPicker ? (
                // Visual auth check card
                (() => {
                  const remaining = selectedAuth.remainingUnits;
                  const units = Number(watchedUnits) || 0;
                  const afterSession = remaining - units;
                  const pctRemaining =
                    selectedAuth.approvedUnits > 0
                      ? (remaining / selectedAuth.approvedUnits) * 100
                      : 0;
                  const isLow = pctRemaining <= 20;
                  const isExceeded = units > 0 && afterSession < 0;
                  const isAtLimit = units > 0 && afterSession === 0;

                  const borderColor = isExceeded
                    ? "border-red-200 dark:border-red-800"
                    : isLow || isAtLimit
                      ? "border-amber-200 dark:border-amber-800"
                      : "border-emerald-200 dark:border-emerald-800";
                  const bgColor = isExceeded
                    ? "bg-red-50 dark:bg-red-950/30"
                    : isLow || isAtLimit
                      ? "bg-amber-50 dark:bg-amber-950/30"
                      : "bg-emerald-50 dark:bg-emerald-950/30";
                  const textColor = isExceeded
                    ? "text-red-700 dark:text-red-400"
                    : isLow || isAtLimit
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-emerald-700 dark:text-emerald-400";

                  return (
                    <div className={cn("rounded-lg border px-4 py-3", borderColor, bgColor)}>
                      <div className={cn("text-xs font-medium", textColor)}>
                        {isExceeded ? (
                          <>This session exceeds remaining authorized units</>
                        ) : isAtLimit ? (
                          <>This session will use all remaining units</>
                        ) : isLow ? (
                          <>Low remaining units</>
                        ) : (
                          <>Authorization linked</>
                        )}
                      </div>
                      <p className="mt-1 text-xs">
                        Auth #
                        {selectedAuth.authorizationNumber ??
                          selectedAuth.authorizationId.slice(0, 8)}{" "}
                        has <span className="font-semibold tabular-nums">{remaining}</span> units
                        remaining.
                        {units > 0 && (
                          <>
                            {" "}
                            This session uses{" "}
                            <span className="font-semibold tabular-nums">{units}</span> units
                            {" → "}
                            <span
                              className={cn(
                                "font-semibold tabular-nums",
                                isExceeded && "text-red-700 dark:text-red-400",
                              )}
                            >
                              {afterSession}
                            </span>{" "}
                            remaining.
                          </>
                        )}
                      </p>
                    </div>
                  );
                })()
              ) : authMatches.length > 0 ? (
                // Auth picker (FIFO auto-select, or user clicked "Change")
                <Field>
                  <Label className="text-xs font-medium">Select Authorization</Label>
                  <Controller
                    name="authorizationServiceId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || NONE_VALUE}
                        onValueChange={(v) => {
                          field.onChange(v === NONE_VALUE ? "" : v);
                          setShowAuthPicker(false);
                        }}
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
                // No matching auth — gray state
                <div className="border-border bg-muted/30 rounded-lg border px-4 py-3">
                  <div className="text-muted-foreground text-xs font-medium">
                    No active authorization for this CPT code
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    No matching authorization found for this client, CPT code, and date. The session
                    will be flagged for review.
                  </p>
                </div>
              )
            ) : (
              <div className="border-border bg-muted/30 rounded-lg border px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  Select a client, CPT code, and date to find matching authorizations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 4: Notes */}
      <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="border-border/60 bg-muted/20 border-b px-4 py-2.5">
          <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
            Notes
          </span>
        </div>
        <div className="p-4">
          <Field>
            <Textarea {...register("notes")} className="text-xs" />
          </Field>
        </div>
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
