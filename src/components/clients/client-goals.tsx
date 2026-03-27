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
  type DataCollectionType,
  type BehaviorFunction,
  type BehaviorSeverity,
  type AssessmentSource,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
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
} from "@hugeicons/core-free-icons";

const NONE_VALUE = "__none__";

// ── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({
  goal,
  canEdit,
  onAddObjective,
  onDelete,
  onStatusChange,
}: {
  goal: GoalWithObjectives;
  canEdit: boolean;
  onAddObjective: (goalId: string, nextNumber: number) => void;
  onDelete: (goal: GoalWithObjectives) => void;
  onStatusChange: (goalId: string, status: string) => void;
}) {
  return (
    <div className="border-border/30 border-b px-4 py-3 last:border-b-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-bold tabular-nums">
              {goal.goalNumber}.
            </span>
            <span className="text-xs font-semibold">{goal.title}</span>
            <Badge variant={GOAL_STATUS_VARIANT[goal.status as GoalStatus]} className="text-[9px]">
              {GOAL_STATUS_LABELS[goal.status as GoalStatus] ?? goal.status}
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              {GOAL_TYPE_LABELS[goal.goalType as GoalType] ?? goal.goalType}
            </Badge>
          </div>
          {goal.description && (
            <p className="text-muted-foreground mt-1 text-[11px] leading-relaxed">
              {goal.description}
            </p>
          )}
        </div>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                <HugeiconsIcon icon={MoreHorizontalCircle01Icon} size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAddObjective(goal.id, goal.objectives.length + 1)}>
                <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
                Add Objective
              </DropdownMenuItem>
              {/* Status transitions based on current status */}
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
        )}
      </div>

      {/* Metadata */}
      <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
        {goal.masteryCriteria && <span>Mastery: {goal.masteryCriteria}</span>}
        {goal.baselineData && <span>Baseline: {goal.baselineData}</span>}
        {goal.startDate && <span>Started {formatDate(goal.startDate)}</span>}
        {goal.targetDate && <span>Target: {formatDate(goal.targetDate)}</span>}
        {goal.metDate && <span>Met {formatDate(goal.metDate)}</span>}
        {goal.treatmentPlanRef && <span>Ref: {goal.treatmentPlanRef}</span>}
        {goal.assessmentSource && (
          <span>Source: {ASSESSMENT_SOURCE_LABELS[goal.assessmentSource as AssessmentSource] ?? goal.assessmentSource}{goal.assessmentItemRef ? ` (${goal.assessmentItemRef})` : ""}</span>
        )}
      </div>

      {/* Behavior reduction details */}
      {goal.goalType === "behavior_reduction" && (goal.functionOfBehavior || goal.replacementBehavior || goal.operationalDefinition) && (
        <div className="bg-muted/20 mt-2 rounded-md px-3 py-2 text-[11px]">
          {goal.functionOfBehavior && (
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0">Function:</span>
              <span>{BEHAVIOR_FUNCTION_LABELS[goal.functionOfBehavior as BehaviorFunction] ?? goal.functionOfBehavior}</span>
            </div>
          )}
          {goal.operationalDefinition && (
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0">Definition:</span>
              <span>{goal.operationalDefinition}</span>
            </div>
          )}
          {goal.replacementBehavior && (
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0">Replacement:</span>
              <span>{goal.replacementBehavior}</span>
            </div>
          )}
          {goal.severityLevel && (
            <div className="flex gap-1">
              <span className="text-muted-foreground shrink-0">Severity:</span>
              <span>{BEHAVIOR_SEVERITY_LABELS[goal.severityLevel as BehaviorSeverity] ?? goal.severityLevel}</span>
            </div>
          )}
        </div>
      )}

      {/* Objectives */}
      {goal.objectives.length > 0 && (
        <div className="mt-2.5 space-y-1">
          {goal.objectives.map((obj) => (
            <div
              key={obj.id}
              className="bg-muted/30 flex items-start gap-2 rounded-md px-2.5 py-1.5"
            >
              {obj.status === "met" ? (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={14}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
              ) : (
                <HugeiconsIcon
                  icon={Target01Icon}
                  size={14}
                  className="text-muted-foreground mt-0.5 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px] font-medium tabular-nums">
                    {goal.goalNumber}.{obj.objectiveNumber}
                  </span>
                  <span className="text-[11px]">{obj.description}</span>
                </div>
                <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
                  {obj.masteryCriteria && <span>Mastery: {obj.masteryCriteria}</span>}
                  {obj.currentPerformance && (
                    <span className="text-foreground font-medium">{obj.currentPerformance}</span>
                  )}
                  {obj.dataCollectionType && (
                    <span>
                      {DATA_COLLECTION_TYPE_LABELS[obj.dataCollectionType as DataCollectionType] ??
                        obj.dataCollectionType}
                    </span>
                  )}
                  {obj.status !== "active" && (
                    <Badge
                      variant={GOAL_STATUS_VARIANT[obj.status as GoalStatus]}
                      className="px-1 py-0 text-[8px]"
                    >
                      {GOAL_STATUS_LABELS[obj.status as GoalStatus] ?? obj.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
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
          <DialogTitle className="text-sm font-semibold">Add Treatment Goal</DialogTitle>
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

          {/* Behavior reduction fields — only shown when goalType is behavior_reduction */}
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
                        <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE_VALUE} className="text-xs">Not specified</SelectItem>
                          {BEHAVIOR_FUNCTIONS.map((f) => (
                            <SelectItem key={f} value={f} className="text-xs">{BEHAVIOR_FUNCTION_LABELS[f]}</SelectItem>
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
                        <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE_VALUE} className="text-xs">Not specified</SelectItem>
                          {BEHAVIOR_SEVERITIES.map((s) => (
                            <SelectItem key={s} value={s} className="text-xs">{BEHAVIOR_SEVERITY_LABELS[s]}</SelectItem>
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
                  <Textarea {...register("antecedentStrategies")} placeholder="Prevention strategies" className="text-xs" rows={2} />
                </Field>
                <Field>
                  <Label className="text-xs font-medium">Consequence Strategies</Label>
                  <Textarea {...register("consequenceStrategies")} placeholder="Response strategies" className="text-xs" rows={2} />
                </Field>
              </div>
              <Field>
                <Label className="text-xs font-medium">Crisis Protocol</Label>
                <Textarea {...register("crisisProtocol")} placeholder="Steps if behavior escalates to dangerous levels" className="text-xs" rows={2} />
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

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Label className="text-xs font-medium">Treatment Plan Reference</Label>
              <Input
                {...register("treatmentPlanRef")}
                placeholder="ITP v2, Section 3.1"
                className="h-8 text-xs"
              />
            </Field>
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
                    <SelectTrigger className="h-8 w-full text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE_VALUE} className="text-xs">Not specified</SelectItem>
                      {ASSESSMENT_SOURCES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">{ASSESSMENT_SOURCE_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

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
  const [addObjective, setAddObjective] = useState<{ goalId: string; nextNumber: number } | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<GoalWithObjectives | null>(null);

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

  const domainGroups = new Map<string, GoalWithObjectives[]>();
  for (const goal of activeGoals) {
    const domain = goal.domainName ?? "Uncategorized";
    const list = domainGroups.get(domain) ?? [];
    list.push(goal);
    domainGroups.set(domain, list);
  }

  const nextGoalNumber = goals.length > 0 ? Math.max(...goals.map((g) => g.goalNumber)) + 1 : 1;

  const totalObjectives = goals.reduce((sum, g) => sum + g.objectives.length, 0);
  const metObjectives = goals.reduce(
    (sum, g) => sum + g.objectives.filter((o) => o.status === "met").length,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          {goals.length > 0
            ? `${activeGoals.length} active · ${totalObjectives} objective${totalObjectives !== 1 ? "s" : ""}${metObjectives > 0 ? ` · ${metObjectives} met` : ""}`
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
        <div className="border-border/40 bg-card flex flex-col items-center justify-center rounded-lg border py-8 text-center shadow-sm">
          <div className="bg-muted mb-3 rounded-lg p-3">
            <HugeiconsIcon icon={Target01Icon} size={24} className="text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">No treatment goals yet</p>
          <p className="text-muted-foreground mt-1 text-[11px]">
            Add goals from the treatment plan so session notes can reference them.
          </p>
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs"
              onClick={() => setAddGoalOpen(true)}
            >
              <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1.5" />
              Add Goal
            </Button>
          )}
        </div>
      ) : (
        <>
          {[...domainGroups.entries()].map(([domain, domainGoals]) => (
            <div
              key={domain}
              className="border-border/40 bg-card overflow-hidden rounded-lg border shadow-sm"
            >
              <div className="border-border/40 bg-muted/20 border-b px-4 py-2">
                <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  {domain}
                </span>
                <span className="text-muted-foreground ml-2 text-[11px] font-normal tracking-normal normal-case">
                  ({domainGoals.length})
                </span>
              </div>
              {domainGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  canEdit={canEdit}
                  onAddObjective={(goalId, nextNum) =>
                    setAddObjective({ goalId, nextNumber: nextNum })
                  }
                  onDelete={(g) => setDeleteTarget(g)}
                  onStatusChange={(id, status) =>
                    executeUpdate({
                      id,
                      status: status as
                        | "baseline"
                        | "active"
                        | "mastered"
                        | "maintenance"
                        | "generalization"
                        | "met"
                        | "on_hold"
                        | "discontinued",
                    })
                  }
                />
              ))}
            </div>
          ))}

          {inactiveGoals.length > 0 && (
            <div className="border-border/40 bg-card overflow-hidden rounded-lg border shadow-sm">
              <div className="border-border/40 bg-muted/20 border-b px-4 py-2">
                <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                  Met & Discontinued
                </span>
                <span className="text-muted-foreground ml-2 text-[11px] font-normal tracking-normal normal-case">
                  ({inactiveGoals.length})
                </span>
              </div>
              {inactiveGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  canEdit={canEdit}
                  onAddObjective={(goalId, nextNum) =>
                    setAddObjective({ goalId, nextNumber: nextNum })
                  }
                  onDelete={(g) => setDeleteTarget(g)}
                  onStatusChange={(id, status) =>
                    executeUpdate({
                      id,
                      status: status as
                        | "baseline"
                        | "active"
                        | "mastered"
                        | "maintenance"
                        | "generalization"
                        | "met"
                        | "on_hold"
                        | "discontinued",
                    })
                  }
                />
              ))}
            </div>
          )}
        </>
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
