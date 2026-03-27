"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import type { GoalWithObjectives, GoalDomain } from "@/server/queries/goals";
import { createGoal, deleteGoal, updateGoal, createObjective } from "@/server/actions/goals";
import { createGoalSchema, createObjectiveSchema } from "@/lib/validators/goals";
import {
  GOAL_TYPES,
  GOAL_TYPE_LABELS,
  GOAL_STATUS_LABELS,
  GOAL_STATUS_VARIANT,
  DATA_COLLECTION_TYPES,
  DATA_COLLECTION_TYPE_LABELS,
  BEHAVIOR_FUNCTIONS,
  BEHAVIOR_FUNCTION_LABELS,
  BEHAVIOR_SEVERITIES,
  BEHAVIOR_SEVERITY_LABELS,
  ASSESSMENT_SOURCES,
  ASSESSMENT_SOURCE_LABELS,
  type GoalType,
  type GoalStatus,
  type BehaviorFunction,
  type BehaviorSeverity,
  type AssessmentSource,
} from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Target01Icon,
  CheckmarkCircle02Icon,
  MoreHorizontalCircle01Icon,
  Delete01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";

const NONE_VALUE = "__none__";

// Goal type accent colors
const GOAL_TYPE_ACCENT = {
  skill_acquisition: "border-l-emerald-500",
  behavior_reduction: "border-l-amber-500",
} as Record<string, string>;

// Objective status icons
function ObjectiveIcon({ status }: { status: string }) {
  if (status === "met") {
    return (
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={16}
        className="mt-0.5 shrink-0 text-emerald-500"
      />
    );
  }
  if (status === "baseline") {
    return (
      <div className="bg-muted-foreground/20 mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-dashed border-muted-foreground/40" />
    );
  }
  // active, on_hold, etc
  return (
    <HugeiconsIcon
      icon={Target01Icon}
      size={16}
      className="text-primary mt-0.5 shrink-0"
    />
  );
}

// ── Goal Card (collapsed + expandable) ───────────────────────────────────────

function GoalCard({
  goal,
  canEdit,
  isExpanded,
  onToggle,
  onAddObjective,
  onDelete,
  onStatusChange,
}: {
  goal: GoalWithObjectives;
  canEdit: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onAddObjective: (goalId: string, nextNumber: number) => void;
  onDelete: (goal: GoalWithObjectives) => void;
  onStatusChange: (goalId: string, status: string) => void;
}) {
  const accentClass = GOAL_TYPE_ACCENT[goal.goalType] ?? "border-l-muted-foreground";

  return (
    <div className={cn("border-l-[3px] transition-colors", accentClass)}>
      {/* Collapsed card — always visible */}
      <div
        className="hover:bg-accent/30 flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors"
        onClick={onToggle}
      >
        {/* Expand/collapse chevron */}
        <div className="mt-0.5 shrink-0">
          <HugeiconsIcon
            icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
            size={14}
            className="text-muted-foreground"
          />
        </div>

        {/* Goal info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight">{goal.title}</span>
            <Badge
              variant={GOAL_STATUS_VARIANT[goal.status as GoalStatus]}
              className="text-[10px]"
            >
              {GOAL_STATUS_LABELS[goal.status as GoalStatus] ?? goal.status}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {GOAL_TYPE_LABELS[goal.goalType as GoalType] ?? goal.goalType}
            </Badge>
          </div>

          {/* Objectives — always visible */}
          {goal.objectives.length > 0 && (
            <div className="mt-2 space-y-1">
              {goal.objectives.map((obj) => (
                <div key={obj.id} className="flex items-start gap-2">
                  <ObjectiveIcon status={obj.status} />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs">
                      <span className="text-muted-foreground tabular-nums">
                        {goal.goalNumber}.{obj.objectiveNumber}
                      </span>{" "}
                      {obj.description}
                    </span>
                    {obj.status !== "active" && obj.status !== "baseline" && (
                      <Badge
                        variant={GOAL_STATUS_VARIANT[obj.status as GoalStatus]}
                        className="ml-1.5 px-1 py-0 text-[8px]"
                      >
                        {GOAL_STATUS_LABELS[obj.status as GoalStatus] ?? obj.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Overflow menu — stop propagation so it doesn't toggle expand */}
        {canEdit && (
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 opacity-40 transition-opacity hover:opacity-100 data-[state=open]:opacity-100"
                >
                  <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onAddObjective(goal.id, goal.objectives.length + 1)}
                >
                  <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
                  Add Objective
                </DropdownMenuItem>
                {goal.status === "baseline" && (
                  <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                    Start Teaching
                  </DropdownMenuItem>
                )}
                {goal.status === "active" && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "mastered")}>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="mr-2" />
                      Mark Mastered
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "on_hold")}>
                      Put on Hold
                    </DropdownMenuItem>
                  </>
                )}
                {goal.status === "mastered" && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "maintenance")}>
                      Move to Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                      Return to Active
                    </DropdownMenuItem>
                  </>
                )}
                {goal.status === "maintenance" && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "generalization")}>
                      Move to Generalization
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                      Return to Active
                    </DropdownMenuItem>
                  </>
                )}
                {goal.status === "generalization" && (
                  <>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "met")}>
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="mr-2" />
                      Mark as Met
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                      Return to Active
                    </DropdownMenuItem>
                  </>
                )}
                {goal.status === "on_hold" && (
                  <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                    Reactivate
                  </DropdownMenuItem>
                )}
                {(goal.status === "met" || goal.status === "discontinued") && (
                  <DropdownMenuItem onClick={() => onStatusChange(goal.id, "active")}>
                    Reactivate
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(goal)}
                  className="text-destructive focus:text-destructive"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={14} className="mr-2" />
                  Archive Goal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Expanded detail — inline below the card */}
      {isExpanded && (
        <div className="bg-muted/10 border-border/30 border-t px-4 py-4 pl-11">
          <div className="space-y-4">
            {/* Description + Protocol */}
            {(goal.description || goal.protocol) && (
              <div className="space-y-2">
                {goal.description && (
                  <div>
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      Description
                    </span>
                    <p className="mt-0.5 text-xs leading-relaxed">{goal.description}</p>
                  </div>
                )}
                {goal.protocol && (
                  <div>
                    <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                      Protocol
                    </span>
                    <p className="bg-muted/50 mt-0.5 rounded-md px-2.5 py-2 text-xs leading-relaxed">
                      {goal.protocol}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mastery & Progress */}
            {(goal.masteryCriteria || goal.baselineData) && (
              <div>
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Mastery & Progress
                </span>
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {goal.masteryCriteria && <span>Mastery: {goal.masteryCriteria}</span>}
                  {goal.baselineData && <span>Baseline: {goal.baselineData}</span>}
                </div>
              </div>
            )}

            {/* Behavior reduction details */}
            {goal.goalType === "behavior_reduction" &&
              (goal.functionOfBehavior ||
                goal.replacementBehavior ||
                goal.operationalDefinition) && (
                <div>
                  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    Behavior Details
                  </span>
                  <div className="mt-1 space-y-1 text-xs">
                    {goal.functionOfBehavior && (
                      <div className="flex gap-1.5">
                        <span className="text-muted-foreground shrink-0">Function:</span>
                        <span>
                          {BEHAVIOR_FUNCTION_LABELS[
                            goal.functionOfBehavior as BehaviorFunction
                          ] ?? goal.functionOfBehavior}
                        </span>
                      </div>
                    )}
                    {goal.severityLevel && (
                      <div className="flex gap-1.5">
                        <span className="text-muted-foreground shrink-0">Severity:</span>
                        <span>
                          {BEHAVIOR_SEVERITY_LABELS[goal.severityLevel as BehaviorSeverity] ??
                            goal.severityLevel}
                        </span>
                      </div>
                    )}
                    {goal.operationalDefinition && (
                      <div className="flex gap-1.5">
                        <span className="text-muted-foreground shrink-0">Definition:</span>
                        <span>{goal.operationalDefinition}</span>
                      </div>
                    )}
                    {goal.replacementBehavior && (
                      <div className="flex gap-1.5">
                        <span className="text-muted-foreground shrink-0">Replacement:</span>
                        <span>{goal.replacementBehavior}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Details — only show if any detail fields are populated */}
            {(goal.startDate || goal.targetDate || goal.metDate || goal.assessmentSource) && (
              <div>
                <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                  Details
                </span>
                <div className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {goal.startDate && <span>Started {formatDate(goal.startDate)}</span>}
                  {goal.targetDate && <span>Target: {formatDate(goal.targetDate)}</span>}
                  {goal.metDate && <span>Met {formatDate(goal.metDate)}</span>}
                  {goal.assessmentSource && (
                    <span>
                      {ASSESSMENT_SOURCE_LABELS[goal.assessmentSource as AssessmentSource] ??
                        goal.assessmentSource}
                      {goal.assessmentItemRef ? ` (${goal.assessmentItemRef})` : ""}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Goal Dialog ──────────────────────────────────────────────────────────

function AddGoalDialog({
  open,
  onOpenChange,
  clientId,
  goalDomains,
  nextGoalNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  goalDomains: GoalDomain[];
  nextGoalNumber: number;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      clientId,
      goalNumber: nextGoalNumber,
      goalType: "skill_acquisition",
    },
  });

  const watchedGoalType = watch("goalType");

  const { execute, isPending } = useAction(createGoal, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        reset({ clientId, goalNumber: nextGoalNumber + 1, goalType: "skill_acquisition" });
        onOpenChange(false);
      }
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to add goal"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">Add Treatment Goal</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Add a goal from the client&apos;s treatment plan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => execute(data))} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label className="text-xs font-medium">Goal #</Label>
              <Input type="number" min={1} {...register("goalNumber")} className="h-8 text-xs" />
              <FieldError>{errors.goalNumber?.message}</FieldError>
            </Field>
            <Field>
              <Label className="text-xs font-medium">Type</Label>
              <Controller
                name="goalType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_TYPES.map((t) => (
                        <SelectItem key={t} value={t} className="text-xs">
                          {GOAL_TYPE_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          {goalDomains.length > 0 && (
            <Field>
              <Label className="text-xs font-medium">Domain</Label>
              <Controller
                name="domainId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || NONE_VALUE}
                    onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                  >
                    <SelectTrigger className="h-8 w-full text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE} className="text-xs">
                        No domain
                      </SelectItem>
                      {goalDomains.map((d) => (
                        <SelectItem key={d.id} value={d.id} className="text-xs">
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          )}

          <Field>
            <Label className="text-xs font-medium">Title</Label>
            <Input
              {...register("title")}
              placeholder="e.g., Manding for preferred items"
              className="h-8 text-xs"
            />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field>
            <Label className="text-xs font-medium">Description (SMART goal statement)</Label>
            <Textarea
              {...register("description")}
              placeholder="Given [context], client will [behavior] with [criteria] by [date]"
              className="text-xs"
              rows={3}
            />
          </Field>

          <Field>
            <Label className="text-xs font-medium">Protocol (RBT instructions)</Label>
            <Textarea
              {...register("protocol")}
              placeholder="How to run this program during sessions (e.g., Use NET during play. Present 3-second time delay.)"
              className="text-xs"
              rows={3}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label className="text-xs font-medium">Mastery Criteria</Label>
              <Input
                {...register("masteryCriteria")}
                placeholder="80% across 3 sessions"
                className="h-8 text-xs"
              />
            </Field>
            <Field>
              <Label className="text-xs font-medium">Baseline Data</Label>
              <Input
                {...register("baselineData")}
                placeholder="20% at intake"
                className="h-8 text-xs"
              />
            </Field>
          </div>

          <Field>
            <Label className="text-xs font-medium">Target Behavior</Label>
            <Input
              {...register("targetBehavior")}
              placeholder="Independent manding using 2+ word phrases"
              className="h-8 text-xs"
            />
          </Field>

          {/* Behavior reduction fields */}
          {watchedGoalType === "behavior_reduction" && (
            <div className="border-border/40 space-y-3 rounded-lg border p-3">
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                Behavior Details
              </span>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <Label className="text-xs font-medium">Function of Behavior</Label>
                  <Controller
                    name="functionOfBehavior"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || NONE_VALUE}
                        onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE_VALUE} className="text-xs">
                            Not specified
                          </SelectItem>
                          {BEHAVIOR_FUNCTIONS.map((f) => (
                            <SelectItem key={f} value={f} className="text-xs">
                              {BEHAVIOR_FUNCTION_LABELS[f]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">Severity</Label>
                  <Controller
                    name="severityLevel"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || NONE_VALUE}
                        onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE_VALUE} className="text-xs">
                            Not specified
                          </SelectItem>
                          {BEHAVIOR_SEVERITIES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">
                              {BEHAVIOR_SEVERITY_LABELS[s]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
              <Field>
                <Label className="text-xs font-medium">Operational Definition</Label>
                <Textarea
                  {...register("operationalDefinition")}
                  placeholder="Observable, measurable description of the target behavior"
                  className="text-xs"
                  rows={2}
                />
              </Field>
              <Field>
                <Label className="text-xs font-medium">Replacement Behavior</Label>
                <Input
                  {...register("replacementBehavior")}
                  placeholder="Functionally equivalent alternative behavior"
                  className="h-8 text-xs"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <Label className="text-xs font-medium">Antecedent Strategies</Label>
                  <Textarea
                    {...register("antecedentStrategies")}
                    placeholder="Prevention strategies"
                    className="text-xs"
                    rows={2}
                  />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">Consequence Strategies</Label>
                  <Textarea
                    {...register("consequenceStrategies")}
                    placeholder="Response strategies"
                    className="text-xs"
                    rows={2}
                  />
                </Field>
              </div>
              <Field>
                <Label className="text-xs font-medium">Crisis Protocol</Label>
                <Textarea
                  {...register("crisisProtocol")}
                  placeholder="Steps if behavior escalates to dangerous levels"
                  className="text-xs"
                  rows={2}
                />
              </Field>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label className="text-xs font-medium">Start Date</Label>
              <Input type="date" {...register("startDate")} className="h-8 text-xs" />
            </Field>
            <Field>
              <Label className="text-xs font-medium">Target Date</Label>
              <Input type="date" {...register("targetDate")} className="h-8 text-xs" />
            </Field>
          </div>

          <Field>
            <Label className="text-xs font-medium">Assessment Source</Label>
            <Controller
              name="assessmentSource"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || NONE_VALUE}
                  onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE} className="text-xs">
                      Not specified
                    </SelectItem>
                    {ASSESSMENT_SOURCES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {ASSESSMENT_SOURCE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <Field>
            <Label className="text-xs font-medium">Assessment Item Reference</Label>
            <Input
              {...register("assessmentItemRef")}
              placeholder="e.g., VB-MAPP Mand Level 2, M8"
              className="h-8 text-xs"
            />
          </Field>

          <Field>
            <Label className="text-xs font-medium">Notes</Label>
            <Textarea {...register("notes")} className="text-xs" rows={2} />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
              {isPending ? "Adding..." : "Add Goal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Objective Dialog ─────────────────────────────────────────────────────

function AddObjectiveDialog({
  open,
  onOpenChange,
  goalId,
  nextObjectiveNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  nextObjectiveNumber: number;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createObjectiveSchema),
    defaultValues: {
      goalId,
      objectiveNumber: nextObjectiveNumber,
    },
  });

  const { execute, isPending } = useAction(createObjective, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        reset({ goalId, objectiveNumber: nextObjectiveNumber + 1 });
        onOpenChange(false);
      }
    },
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to add objective"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Add Objective</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => execute(data))} className="space-y-3">
          <Field>
            <Label className="text-xs font-medium">Objective #</Label>
            <Input
              type="number"
              min={1}
              {...register("objectiveNumber")}
              className="h-8 w-24 text-xs"
            />
            <FieldError>{errors.objectiveNumber?.message}</FieldError>
          </Field>

          <Field>
            <Label className="text-xs font-medium">Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Request 3+ preferred items using 2-word phrases with 80% independence across 20 trials"
              className="text-xs"
              rows={3}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          <Field>
            <Label className="text-xs font-medium">Mastery Criteria</Label>
            <Input
              {...register("masteryCriteria")}
              placeholder="80% across 3 sessions"
              className="h-8 text-xs"
            />
          </Field>

          <Field>
            <Label className="text-xs font-medium">Data Collection Type</Label>
            <Controller
              name="dataCollectionType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || NONE_VALUE}
                  onValueChange={(v) => field.onChange(v === NONE_VALUE ? "" : v)}
                >
                  <SelectTrigger className="h-8 w-full text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE_VALUE} className="text-xs">
                      Not specified
                    </SelectItem>
                    {DATA_COLLECTION_TYPES.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {DATA_COLLECTION_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
              {isPending ? "Adding..." : "Add Objective"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Goals Component ─────────────────────────────────────────────────────

export function ClientGoals({
  clientId,
  goals,
  goalDomains,
  canEdit,
}: {
  clientId: string;
  goals: GoalWithObjectives[];
  goalDomains: GoalDomain[];
  canEdit: boolean;
}) {
  const [addGoalOpen, setAddGoalOpen] = useState(false);
  const [addObjective, setAddObjective] = useState<{
    goalId: string;
    nextNumber: number;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GoalWithObjectives | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  const { execute: executeUpdate } = useAction(updateGoal, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to update goal"),
  });

  const { executeAsync: executeDelete } = useAction(deleteGoal, {
    onError: ({ error }) => toast.error(error.serverError ?? "Failed to archive goal"),
  });

  const ACTIVE_STATUSES = [
    "baseline",
    "active",
    "mastered",
    "maintenance",
    "generalization",
    "on_hold",
  ];
  const INACTIVE_STATUSES = ["met", "discontinued"];
  const activeGoals = goals.filter((g) => ACTIVE_STATUSES.includes(g.status));
  const inactiveGoals = goals.filter((g) => INACTIVE_STATUSES.includes(g.status));

  // Group active goals by domain
  const domainGroups = new Map<string, GoalWithObjectives[]>();
  for (const goal of activeGoals) {
    const domain = goal.domainName ?? "Uncategorized";
    const list = domainGroups.get(domain) ?? [];
    list.push(goal);
    domainGroups.set(domain, list);
  }

  const nextGoalNumber =
    goals.length > 0 ? Math.max(...goals.map((g) => g.goalNumber)) + 1 : 1;

  function toggleGoal(goalId: string) {
    setExpandedGoalId((prev) => (prev === goalId ? null : goalId));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          {goals.length > 0
            ? `${activeGoals.length} active${inactiveGoals.length > 0 ? ` · ${inactiveGoals.length} met/discontinued` : ""}`
            : null}
        </div>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setAddGoalOpen(true)}
          >
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
            Add Goal
          </Button>
        )}
      </div>

      {/* Empty state */}
      {goals.length === 0 ? (
        <div className="border-border bg-card flex flex-col items-center justify-center rounded-xl border py-12 text-center shadow-sm">
          <div className="mb-4 flex -space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              SA
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-amber-100 text-xs font-bold text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
              BR
            </div>
          </div>
          <p className="text-sm font-semibold">No treatment goals yet</p>
          <p className="text-muted-foreground mt-1 max-w-xs text-xs">
            Add goals from the treatment plan so session notes can reference them.
          </p>
          {canEdit && (
            <Button
              size="sm"
              className="mt-4 text-xs"
              onClick={() => setAddGoalOpen(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
              Add Goal
            </Button>
          )}
        </div>
      ) : (
        /* Single card containing all domain groups */
        <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
          {[...domainGroups.entries()].map(([domain, domainGoals], groupIdx) => {
            const domainActive = domainGoals.filter((g) => g.status === "active").length;
            const domainMastered = domainGoals.filter((g) =>
              ["mastered", "maintenance", "generalization"].includes(g.status),
            ).length;

            return (
              <div key={domain}>
                {/* Domain header */}
                <div
                  className={cn(
                    "flex items-center gap-2 border-b px-4 py-2",
                    groupIdx > 0 && "border-t",
                  )}
                >
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      domainGoals.some((g) => g.goalType === "behavior_reduction")
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                    )}
                  />
                  <span className="text-xs font-semibold">{domain}</span>
                  <span className="text-muted-foreground text-xs">
                    {domainActive > 0 && `${domainActive} active`}
                    {domainActive > 0 && domainMastered > 0 && " · "}
                    {domainMastered > 0 && `${domainMastered} mastered`}
                    {domainActive === 0 && domainMastered === 0 &&
                      `${domainGoals.length} goal${domainGoals.length !== 1 ? "s" : ""}`}
                  </span>
                </div>

                {/* Goals in this domain */}
                <div className="divide-border/20 divide-y">
                  {domainGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      canEdit={canEdit}
                      isExpanded={expandedGoalId === goal.id}
                      onToggle={() => toggleGoal(goal.id)}
                      onAddObjective={(goalId, nextNum) =>
                        setAddObjective({ goalId, nextNumber: nextNum })
                      }
                      onDelete={(g) => setDeleteTarget(g)}
                      onStatusChange={(id, status) =>
                        executeUpdate({
                          id,
                          status: status as GoalStatus,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {/* Met & Discontinued — collapsible at bottom of same card */}
          {inactiveGoals.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowInactive(!showInactive)}
                className="bg-muted/20 hover:bg-muted/40 flex w-full items-center justify-between border-t px-4 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-muted-foreground/30 h-1.5 w-1.5 rounded-full" />
                  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    Met & Discontinued
                  </span>
                  <span className="text-muted-foreground/50 text-[10px]">
                    ({inactiveGoals.length})
                  </span>
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {showInactive ? "Hide" : "Show"}
                </span>
              </button>
              {showInactive && (
                <div className="divide-border/20 divide-y opacity-60">
                  {inactiveGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      canEdit={canEdit}
                      isExpanded={expandedGoalId === goal.id}
                      onToggle={() => toggleGoal(goal.id)}
                      onAddObjective={(goalId, nextNum) =>
                        setAddObjective({ goalId, nextNumber: nextNum })
                      }
                      onDelete={(g) => setDeleteTarget(g)}
                      onStatusChange={(id, status) =>
                        executeUpdate({
                          id,
                          status: status as GoalStatus,
                        })
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add Goal Dialog */}
      {canEdit && (
        <AddGoalDialog
          open={addGoalOpen}
          onOpenChange={setAddGoalOpen}
          clientId={clientId}
          goalDomains={goalDomains}
          nextGoalNumber={nextGoalNumber}
        />
      )}

      {/* Add Objective Dialog */}
      {addObjective && (
        <AddObjectiveDialog
          open={!!addObjective}
          onOpenChange={(open) => {
            if (!open) setAddObjective(null);
          }}
          goalId={addObjective.goalId}
          nextObjectiveNumber={addObjective.nextNumber}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Archive goal"
        description={
          deleteTarget
            ? `Archive "${deleteTarget.title}" and all its objectives? This can be undone.`
            : ""
        }
        onConfirm={async () => {
          if (deleteTarget) await executeDelete({ id: deleteTarget.id });
        }}
        variant="destructive"
        confirmLabel="Archive"
      />
    </div>
  );
}
