"use client";

import { Controller, type Control, type UseFormRegister, type FieldErrors } from "react-hook-form";
import type { SaveSessionNoteInput } from "@/lib/validators/session-notes";

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
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import {
  BEHAVIOR_INTENSITIES,
  BEHAVIOR_INTENSITY_LABELS,
  type BehaviorIntensity,
} from "@/lib/constants";

export function BehaviorEntry({
  index,
  control,
  register,
  errors,
  onRemove,
  disabled,
}: {
  index: number;
  control: Control<SaveSessionNoteInput>;
  register: UseFormRegister<SaveSessionNoteInput>;
  errors: FieldErrors<SaveSessionNoteInput>;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const behaviorErrors = errors.behaviors?.[index];

  return (
    <div className="border-border space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Behavior {index + 1}
        </span>
        {!disabled && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive -mr-2 -mt-1 h-7 w-7 p-0"
          >
            <HugeiconsIcon icon={Delete01Icon} size={14} />
          </Button>
        )}
      </div>

      {/* Behavior name + time + intensity */}
      <div className="grid grid-cols-3 gap-3">
        <Field>
          <Label className="text-xs font-medium">Behavior Name</Label>
          <Input
            {...register(`behaviors.${index}.behaviorName`)}
            placeholder="e.g., Self-injurious behavior"
            className="h-8 text-xs"
            disabled={disabled}
          />
          <FieldError>{behaviorErrors?.behaviorName?.message}</FieldError>
        </Field>
        <Field>
          <Label className="text-xs font-medium">Time of Occurrence</Label>
          <Input
            {...register(`behaviors.${index}.occurrenceTime`)}
            placeholder="e.g., 10:30 AM"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Intensity</Label>
          <Controller
            name={`behaviors.${index}.intensity`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {BEHAVIOR_INTENSITIES.map((i) => (
                    <SelectItem key={i} value={i} className="text-xs">
                      {BEHAVIOR_INTENSITY_LABELS[i as BehaviorIntensity]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      {/* ABC: Antecedent → Behavior → Consequence */}
      <div className="grid grid-cols-3 gap-3">
        <Field>
          <Label className="text-xs font-medium">Antecedent</Label>
          <Textarea
            {...register(`behaviors.${index}.antecedent`)}
            placeholder="What happened before?"
            className="min-h-12 text-xs"
            disabled={disabled}
          />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Behavior Description</Label>
          <Textarea
            {...register(`behaviors.${index}.behaviorDescription`)}
            placeholder="What did the behavior look like?"
            className="min-h-12 text-xs"
            disabled={disabled}
          />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Consequence</Label>
          <Textarea
            {...register(`behaviors.${index}.consequence`)}
            placeholder="What happened after?"
            className="min-h-12 text-xs"
            disabled={disabled}
          />
        </Field>
      </div>

      {/* Duration + Notes */}
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label className="text-xs font-medium">Duration (seconds)</Label>
          <Input
            type="number"
            min={0}
            {...register(`behaviors.${index}.durationSeconds`, { valueAsNumber: true })}
            className="h-8 text-xs tabular-nums"
            disabled={disabled}
          />
        </Field>
        <Field>
          <Label className="text-xs font-medium">Notes</Label>
          <Input
            {...register(`behaviors.${index}.notes`)}
            placeholder="Additional observations"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </Field>
      </div>
    </div>
  );
}
