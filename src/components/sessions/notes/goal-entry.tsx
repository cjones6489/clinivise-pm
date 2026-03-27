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
  MEASUREMENT_TYPE_LABELS,
  MEASUREMENT_TYPES,
  PROMPT_LEVEL_LABELS,
  PROMPT_LEVELS,
  GOAL_PROGRESS_LABELS,
  GOAL_PROGRESS_STATUSES,
  type MeasurementType,
  type PromptLevel,
  type GoalProgressStatus,
} from "@/lib/constants";

type GoalOption = {
  id: string;
  title: string;
  goalNumber: string | null;
};

/** Measurement-type-specific fields for a single goal */
function MeasurementFields({
  index,
  measurementType,
  register,
  disabled,
}: {
  index: number;
  measurementType: string;
  register: UseFormRegister<SaveSessionNoteInput>;
  disabled?: boolean;
}) {
  const prefix = `goals.${index}` as const;

  switch (measurementType) {
    case "discrete_trial":
      return (
        <div className="grid grid-cols-3 gap-3">
          <Field>
            <Label className="text-xs font-medium">Trials Completed</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.trialsCompleted`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Trials Correct</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.trialsCorrect`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">% Correct</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step={0.1}
              {...register(`${prefix}.percentageCorrect`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "frequency":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Frequency Count</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.frequencyCount`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "duration":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Duration (seconds)</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.durationSeconds`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "rate":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Rate / Minute</Label>
            <Input
              type="number"
              min={0}
              step={0.1}
              {...register(`${prefix}.ratePerMinute`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "latency":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Latency (seconds)</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.latencySeconds`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "task_analysis":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Steps Completed</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.stepsCompleted`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Steps Total</Label>
            <Input
              type="number"
              min={1}
              {...register(`${prefix}.stepsTotal`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "whole_interval":
    case "partial_interval":
    case "momentary_time_sampling":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Intervals Scored</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.intervalsScored`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Intervals Total</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.intervalsTotal`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "probe":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Probe Correct</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.probeCorrect`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Probe Total</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.probeTotal`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    case "rating_scale":
      return (
        <div className="grid grid-cols-2 gap-3">
          <Field>
            <Label className="text-xs font-medium">Rating Value</Label>
            <Input
              type="number"
              min={0}
              {...register(`${prefix}.ratingScaleValue`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Rating Max</Label>
            <Input
              type="number"
              min={1}
              {...register(`${prefix}.ratingScaleMax`, { valueAsNumber: true })}
              className="h-8 text-xs tabular-nums"
              disabled={disabled}
            />
          </Field>
        </div>
      );

    default:
      return null;
  }
}

export function GoalEntry({
  index,
  control,
  register,
  errors,
  watch,
  onRemove,
  clientGoals,
  disabled,
}: {
  index: number;
  control: Control<SaveSessionNoteInput>;
  register: UseFormRegister<SaveSessionNoteInput>;
  errors: FieldErrors<SaveSessionNoteInput>;
  watch: (name: string) => unknown;
  onRemove: () => void;
  clientGoals: GoalOption[];
  disabled?: boolean;
}) {
  const goalErrors = errors.goals?.[index];
  const measurementType = (watch(`goals.${index}.measurementType`) as string) || "discrete_trial";

  return (
    <div className="border-border space-y-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          Goal {index + 1}
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

      {/* Goal name — pick from treatment plan or type custom */}
      <div className="grid grid-cols-2 gap-3">
        <Field>
          <Label className="text-xs font-medium">Goal Name</Label>
          {clientGoals.length > 0 ? (
            <Controller
              name={`goals.${index}.goalName`}
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={(v) => {
                    field.onChange(v);
                    // Also set the goalId if picking from treatment plan
                    const match = clientGoals.find((g) => g.title === v);
                    if (match) {
                      // We need to use the form's setValue — but since we're in Controller,
                      // we can't easily access it. The parent will handle goalId via watch.
                    }
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientGoals.map((g) => (
                      <SelectItem key={g.id} value={g.title} className="text-xs">
                        {g.goalNumber ? `${g.goalNumber}: ` : ""}{g.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Input
              {...register(`goals.${index}.goalName`)}
              placeholder="Enter goal name"
              className="h-8 text-xs"
              disabled={disabled}
            />
          )}
          <FieldError>{goalErrors?.goalName?.message}</FieldError>
        </Field>

        <Field>
          <Label className="text-xs font-medium">Measurement Type</Label>
          <Controller
            name={`goals.${index}.measurementType`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "discrete_trial"}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEASUREMENT_TYPES.map((mt) => (
                    <SelectItem key={mt} value={mt} className="text-xs">
                      {MEASUREMENT_TYPE_LABELS[mt as MeasurementType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      {/* Measurement-specific data fields */}
      <MeasurementFields
        index={index}
        measurementType={measurementType}
        register={register}
        disabled={disabled}
      />

      {/* Prompt level, progress status, procedure */}
      <div className="grid grid-cols-3 gap-3">
        <Field>
          <Label className="text-xs font-medium">Prompt Level</Label>
          <Controller
            name={`goals.${index}.promptLevel`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {PROMPT_LEVELS.map((pl) => (
                    <SelectItem key={pl} value={pl} className="text-xs">
                      {PROMPT_LEVEL_LABELS[pl as PromptLevel]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field>
          <Label className="text-xs font-medium">Progress Status</Label>
          <Controller
            name={`goals.${index}.progressStatus`}
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || "not_assessed"}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger className="h-8 w-full text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOAL_PROGRESS_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {GOAL_PROGRESS_LABELS[s as GoalProgressStatus]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <Field>
          <Label className="text-xs font-medium">Reinforcement</Label>
          <Input
            {...register(`goals.${index}.reinforcement`)}
            placeholder="e.g., token board"
            className="h-8 text-xs"
            disabled={disabled}
          />
        </Field>
      </div>

      {/* Notes */}
      <Field>
        <Label className="text-xs font-medium">Goal Notes</Label>
        <Textarea
          {...register(`goals.${index}.notes`)}
          placeholder="Data collection notes, observations..."
          className="min-h-12 text-xs"
          disabled={disabled}
        />
      </Field>
    </div>
  );
}
