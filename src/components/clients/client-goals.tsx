"use client";

import type { GoalWithObjectives } from "@/server/queries/goals";
import {
  GOAL_TYPE_LABELS,
  GOAL_STATUS_LABELS,
  GOAL_STATUS_VARIANT,
  DATA_COLLECTION_TYPE_LABELS,
  type GoalType,
  type GoalStatus,
  type DataCollectionType,
} from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Target01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";

// ── Goal Card ────────────────────────────────────────────────────────────────

function GoalCard({ goal }: { goal: GoalWithObjectives }) {
  const activeObjectives = goal.objectives.filter((o) => o.status === "active");
  const metObjectives = goal.objectives.filter((o) => o.status === "met");

  return (
    <div className="border-b border-border/30 px-4 py-3 last:border-b-0">
      {/* Goal header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tabular-nums text-muted-foreground">
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
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              {goal.description}
            </p>
          )}
        </div>
      </div>

      {/* Goal metadata */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {goal.masteryCriteria && (
          <span>Mastery: {goal.masteryCriteria}</span>
        )}
        {goal.baselineData && (
          <span>Baseline: {goal.baselineData}</span>
        )}
        {goal.startDate && (
          <span>Started {formatDate(goal.startDate)}</span>
        )}
        {goal.targetDate && (
          <span>Target: {formatDate(goal.targetDate)}</span>
        )}
        {goal.metDate && (
          <span>Met {formatDate(goal.metDate)}</span>
        )}
        {goal.treatmentPlanRef && (
          <span>Ref: {goal.treatmentPlanRef}</span>
        )}
      </div>

      {/* Objectives */}
      {goal.objectives.length > 0 && (
        <div className="mt-2.5 space-y-1">
          {goal.objectives.map((obj) => (
            <div
              key={obj.id}
              className="flex items-start gap-2 rounded-md bg-muted/30 px-2.5 py-1.5"
            >
              {obj.status === "met" ? (
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} className="mt-0.5 shrink-0 text-emerald-500" />
              ) : (
                <HugeiconsIcon icon={Target01Icon} size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                    {goal.goalNumber}.{obj.objectiveNumber}
                  </span>
                  <span className="text-[11px]">{obj.description}</span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                  {obj.masteryCriteria && <span>Mastery: {obj.masteryCriteria}</span>}
                  {obj.currentPerformance && (
                    <span className="font-medium text-foreground">{obj.currentPerformance}</span>
                  )}
                  {obj.dataCollectionType && (
                    <span>{DATA_COLLECTION_TYPE_LABELS[obj.dataCollectionType as DataCollectionType] ?? obj.dataCollectionType}</span>
                  )}
                  {obj.status !== "active" && (
                    <Badge variant={GOAL_STATUS_VARIANT[obj.status as GoalStatus]} className="text-[8px] px-1 py-0">
                      {GOAL_STATUS_LABELS[obj.status as GoalStatus] ?? obj.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          {metObjectives.length > 0 && activeObjectives.length > 0 && (
            <div className="text-[10px] text-muted-foreground pl-6">
              {metObjectives.length} of {goal.objectives.length} objectives met
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Goals Component ─────────────────────────────────────────────────────

export function ClientGoals({
  goals,
  canEdit: _canEdit,
}: {
  goals: GoalWithObjectives[];
  canEdit: boolean;
}) {
  // Separate active vs inactive goals
  const activeGoals = goals.filter((g) => g.status === "active" || g.status === "on_hold");
  const inactiveGoals = goals.filter((g) => g.status === "met" || g.status === "discontinued");

  // Group active goals by domain
  const domainGroups = new Map<string, GoalWithObjectives[]>();
  for (const goal of activeGoals) {
    const domain = goal.domainName ?? "Uncategorized";
    const list = domainGroups.get(domain) ?? [];
    list.push(goal);
    domainGroups.set(domain, list);
  }

  const totalObjectives = goals.reduce((sum, g) => sum + g.objectives.length, 0);
  const metObjectives = goals.reduce(
    (sum, g) => sum + g.objectives.filter((o) => o.status === "met").length,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {goals.length > 0
            ? `${activeGoals.length} active goal${activeGoals.length !== 1 ? "s" : ""} · ${totalObjectives} objective${totalObjectives !== 1 ? "s" : ""}${metObjectives > 0 ? ` · ${metObjectives} met` : ""}`
            : null}
        </div>
        {/* Add Goal button will be added in CD-1B-2 */}
      </div>

      {/* Empty state */}
      {goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border/40 bg-card py-8 text-center shadow-sm">
          <div className="mb-3 rounded-lg bg-muted p-3">
            <HugeiconsIcon icon={Target01Icon} size={24} className="text-muted-foreground" />
          </div>
          <p className="text-xs font-medium">No treatment goals yet</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Add goals from the treatment plan so session notes can reference them.
          </p>
        </div>
      ) : (
        <>
          {/* Active goals grouped by domain */}
          {[...domainGroups.entries()].map(([domain, domainGoals]) => (
            <div key={domain} className="overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
              <div className="border-b border-border/40 bg-muted/20 px-4 py-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  {domain}
                </span>
                <span className="ml-2 text-[11px] font-normal normal-case tracking-normal text-muted-foreground">
                  ({domainGoals.length})
                </span>
              </div>
              {domainGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          ))}

          {/* Inactive goals collapsed */}
          {inactiveGoals.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm">
              <div className="border-b border-border/40 bg-muted/20 px-4 py-2">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
                  Met & Discontinued
                </span>
                <span className="ml-2 text-[11px] font-normal normal-case tracking-normal text-muted-foreground">
                  ({inactiveGoals.length})
                </span>
              </div>
              {inactiveGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
