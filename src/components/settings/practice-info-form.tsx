"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "@/lib/validators/organizations";
import { updateOrganization } from "@/server/actions/organizations";
import type { Organization } from "@/server/queries/organizations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const ABA_TAXONOMY_CODES = [
  { value: "103K00000X", label: "103K00000X — Behavioral Analyst" },
  { value: "106E00000X", label: "106E00000X — Assistant Behavior Analyst" },
  { value: "106S00000X", label: "106S00000X — Behavior Technician" },
] as const;

const COMMON_TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "America/Puerto_Rico",
  "Pacific/Guam",
] as const;

function KVRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-border/40 flex items-baseline justify-between border-b py-2 last:border-0">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {title}
        </span>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export function PracticeInfoForm({ org }: { org: Organization }) {
  const [editing, setEditing] = useState<"practice" | "billing" | "billing_entity" | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateOrganizationInput>({
    resolver: zodResolver(updateOrganizationSchema),
    defaultValues: {
      name: org.name,
      timezone: org.timezone,
      phone: org.phone ?? "",
      email: org.email ?? "",
      addressLine1: org.addressLine1 ?? "",
      addressLine2: org.addressLine2 ?? "",
      city: org.city ?? "",
      state: org.state ?? "",
      zipCode: org.zipCode ?? "",
      npi: org.npi ?? "",
      taxId: org.taxId ?? "",
      taxonomyCode: org.taxonomyCode ?? "",
      billingName: org.billingName ?? "",
      billingNpi: org.billingNpi ?? "",
      billingTaxId: org.billingTaxId ?? "",
      billingAddressLine1: org.billingAddressLine1 ?? "",
      billingCity: org.billingCity ?? "",
      billingState: org.billingState ?? "",
      billingZipCode: org.billingZipCode ?? "",
    },
  });

  const { execute, isPending } = useAction(updateOrganization, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Settings saved");
        setEditing(null);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to save settings");
    },
  });

  function onSubmit(data: UpdateOrganizationInput) {
    execute(data);
  }

  function cancelEdit() {
    reset();
    setEditing(null);
  }

  // ── Display mode ──────────────────────────────────────────────────────────

  if (!editing) {
    return (
      <div className="space-y-4">
        <SectionCard
          title="Practice Information"
          action={
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => setEditing("practice")}
            >
              Edit
            </Button>
          }
        >
          <KVRow label="Practice Name" value={org.name} />
          <KVRow label="Timezone" value={org.timezone} />
          {org.phone && <KVRow label="Phone" value={org.phone} />}
          {org.email && <KVRow label="Email" value={org.email} />}
          {org.addressLine1 && (
            <KVRow
              label="Address"
              value={
                org.city && org.state
                  ? `${org.addressLine1}, ${org.city}, ${org.state} ${org.zipCode ?? ""}`
                  : org.addressLine1
              }
            />
          )}
        </SectionCard>

        {org.npi || org.taxId ? (
          <SectionCard
            title="Billing Identifiers"
            action={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setEditing("billing")}
              >
                Edit
              </Button>
            }
          >
            <KVRow label="NPI" value={<span className="font-mono tabular-nums">{org.npi}</span>} />
            <KVRow
              label="Tax ID"
              value={<span className="font-mono tabular-nums">{org.taxId}</span>}
            />
            {org.taxonomyCode && (
              <KVRow
                label="Taxonomy Code"
                value={<span className="font-mono">{org.taxonomyCode}</span>}
              />
            )}
          </SectionCard>
        ) : (
          <div
            className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 px-4 py-4 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:hover:bg-blue-950/50"
            onClick={() => setEditing("billing")}
          >
            <div className="text-xs font-medium text-blue-700 dark:text-blue-400">
              Complete your billing profile
            </div>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400/80">
              Add your NPI and Tax ID to prepare for claims submission. These identifiers are
              required on every insurance claim.
            </p>
          </div>
        )}

        {/* Billing Entity — only shown if any billing entity fields are populated */}
        {org.billingName || org.billingNpi || org.billingTaxId || org.billingAddressLine1 ? (
          <SectionCard
            title="Billing Entity"
            action={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setEditing("billing_entity")}
              >
                Edit
              </Button>
            }
          >
            {org.billingName && <KVRow label="Billing Name" value={org.billingName} />}
            {org.billingNpi && (
              <KVRow
                label="Billing NPI"
                value={<span className="font-mono tabular-nums">{org.billingNpi}</span>}
              />
            )}
            {org.billingTaxId && (
              <KVRow
                label="Billing Tax ID"
                value={<span className="font-mono tabular-nums">{org.billingTaxId}</span>}
              />
            )}
            {org.billingAddressLine1 && (
              <KVRow
                label="Billing Address"
                value={
                  org.billingCity && org.billingState
                    ? `${org.billingAddressLine1}, ${org.billingCity}, ${org.billingState} ${org.billingZipCode ?? ""}`
                    : org.billingAddressLine1
                }
              />
            )}
            <p className="text-muted-foreground pt-1 text-[10px]">
              Used on CMS-1500 Box 33 when the billing entity differs from the practice.
            </p>
          </SectionCard>
        ) : (
          <div
            className="border-border/40 bg-muted/20 hover:bg-muted/40 cursor-pointer rounded-lg border px-4 py-3 transition-colors"
            onClick={() => setEditing("billing_entity")}
          >
            <div className="text-muted-foreground text-xs font-medium">
              Billing entity (optional)
            </div>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Set a separate billing name, NPI, and address if your billing entity differs from the
              practice.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Edit mode ─────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {(editing === "practice" || editing === "billing") && (
        <SectionCard title="Practice Information">
          <div className="space-y-3">
            <Field>
              <Label className="text-xs font-medium">Practice Name *</Label>
              <Input {...register("name")} className="h-8 text-xs" />
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field>
              <Label className="text-xs font-medium">Timezone *</Label>
              <Controller
                name="timezone"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_TIMEZONES.map((tz) => (
                        <SelectItem key={tz} value={tz} className="text-xs">
                          {tz.replace("America/", "").replace("Pacific/", "").replace(/_/g, " ")} (
                          {tz})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label className="text-xs font-medium">Phone</Label>
                <Input
                  type="tel"
                  {...register("phone")}
                  className="h-8 text-xs"
                  placeholder="(512) 555-0100"
                />
              </Field>
              <Field>
                <Label className="text-xs font-medium">Email</Label>
                <Input
                  type="email"
                  {...register("email")}
                  className="h-8 text-xs"
                  placeholder="office@clinic.com"
                />
                <FieldError>{errors.email?.message}</FieldError>
              </Field>
            </div>

            <Field>
              <Label className="text-xs font-medium">Address</Label>
              <Input
                {...register("addressLine1")}
                className="h-8 text-xs"
                placeholder="Street address"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field>
                <Input {...register("city")} className="h-8 text-xs" placeholder="City" />
              </Field>
              <Field>
                <Input {...register("state")} className="h-8 text-xs" placeholder="State" />
              </Field>
              <Field>
                <Input {...register("zipCode")} className="h-8 text-xs" placeholder="ZIP" />
              </Field>
            </div>
          </div>
        </SectionCard>
      )}

      {(editing === "billing" || editing === "practice") && (
        <SectionCard title="Billing Identifiers">
          <div className="space-y-3">
            <Field>
              <Label className="text-xs font-medium">NPI</Label>
              <Input
                {...register("npi")}
                className="h-8 font-mono text-xs"
                placeholder="10-digit NPI"
                maxLength={10}
                inputMode="numeric"
              />
              <FieldError>{errors.npi?.message}</FieldError>
            </Field>
            <Field>
              <Label className="text-xs font-medium">Tax ID (EIN)</Label>
              <Input
                {...register("taxId")}
                className="h-8 font-mono text-xs"
                placeholder="XX-XXXXXXX"
              />
              <FieldError>{errors.taxId?.message}</FieldError>
            </Field>
            <Field>
              <Label className="text-xs font-medium">Taxonomy Code</Label>
              <Controller
                name="taxonomyCode"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ""} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select taxonomy code" />
                    </SelectTrigger>
                    <SelectContent>
                      {ABA_TAXONOMY_CODES.map((tc) => (
                        <SelectItem key={tc.value} value={tc.value} className="text-xs">
                          {tc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </SectionCard>
      )}

      {editing === "billing_entity" && (
        <SectionCard title="Billing Entity">
          <div className="space-y-3">
            <p className="text-muted-foreground text-[11px]">
              Only fill this in if your billing entity (CMS-1500 Box 33) differs from the practice.
              Leave blank to use practice info for billing.
            </p>
            <Field>
              <Label className="text-xs font-medium">Billing Entity Name</Label>
              <Input
                {...register("billingName")}
                className="h-8 text-xs"
                placeholder="Legal entity name (e.g., Bright Futures ABA LLC)"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <Label className="text-xs font-medium">Billing NPI</Label>
                <Input
                  {...register("billingNpi")}
                  className="h-8 font-mono text-xs"
                  placeholder="10-digit NPI"
                  maxLength={10}
                  inputMode="numeric"
                />
                <FieldError>{errors.billingNpi?.message}</FieldError>
              </Field>
              <Field>
                <Label className="text-xs font-medium">Billing Tax ID</Label>
                <Input
                  {...register("billingTaxId")}
                  className="h-8 font-mono text-xs"
                  placeholder="XX-XXXXXXX"
                />
                <FieldError>{errors.billingTaxId?.message}</FieldError>
              </Field>
            </div>
            <Field>
              <Label className="text-xs font-medium">Billing Address</Label>
              <Input
                {...register("billingAddressLine1")}
                className="h-8 text-xs"
                placeholder="Street address"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field>
                <Input {...register("billingCity")} className="h-8 text-xs" placeholder="City" />
              </Field>
              <Field>
                <Input {...register("billingState")} className="h-8 text-xs" placeholder="State" />
              </Field>
              <Field>
                <Input {...register("billingZipCode")} className="h-8 text-xs" placeholder="ZIP" />
              </Field>
            </div>
          </div>
        </SectionCard>
      )}

      <div className="flex gap-2">
        <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" size="sm" className="text-xs" onClick={cancelEdit}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
