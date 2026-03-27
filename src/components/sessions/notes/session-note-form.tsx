"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  saveSessionNoteSchema,
  type SaveSessionNoteInput,
} from "@/lib/validators/session-notes";
import { saveSessionNote, signSessionNote } from "@/server/actions/session-notes";
import type { SessionNoteDetail } from "@/server/queries/session-notes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError } from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import {
  NOTE_TYPE_LABELS,
  type NoteType,
  type MeasurementType,
  type PromptLevel,
  type GoalProgressStatus,
} from "@/lib/constants";

import { GoalEntry } from "./goal-entry";
import { BehaviorEntry } from "./behavior-entry";

// ── Types ──────────────────────────────────────────────────────────────────

type SessionContext = {
  id: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  sessionDate: string;
  cptCode: string;
  providerFirstName: string;
  providerLastName: string;
  providerCredentialType: string;
};

type ClientGoalOption = {
  id: string;
  title: string;
  goalNumber: string | null;
};

// ── Section Card Helper ────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="border-border/60 bg-muted/20 border-b px-4 py-2.5">
        <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
          {title}
        </span>
      </div>
      <div className="space-y-4 p-4">{children}</div>
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────

export function SessionNoteForm({
  session,
  noteType,
  existingNote,
  clientGoals,
  canSign,
}: {
  session: SessionContext;
  noteType: NoteType;
  existingNote?: SessionNoteDetail | null;
  clientGoals: ClientGoalOption[];
  canSign: boolean;
}) {
  const router = useRouter();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const isReadOnly = !!existingNote && existingNote.status !== "draft";

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SaveSessionNoteInput>({
    resolver: zodResolver(saveSessionNoteSchema),
    defaultValues: {
      sessionId: session.id,
      // Universal
      othersPresent: existingNote?.othersPresent ?? "",
      subjectiveNotes: existingNote?.subjectiveNotes ?? "",
      clientPresentation: existingNote?.clientPresentation ?? "",
      sessionNarrative: existingNote?.sessionNarrative ?? "",
      barriersToPerformance: existingNote?.barriersToPerformance ?? "",
      caregiverCommunication: existingNote?.caregiverCommunication ?? "",
      planNextSession: existingNote?.planNextSession ?? "",
      // Modification (97155)
      modificationRationale: existingNote?.modificationRationale ?? "",
      modificationDescription: existingNote?.modificationDescription ?? "",
      clientResponseToModification: existingNote?.clientResponseToModification ?? "",
      updatedProtocol: existingNote?.updatedProtocol ?? "",
      // Caregiver (97156)
      caregiverName: existingNote?.caregiverName ?? "",
      caregiverRelationship: existingNote?.caregiverRelationship ?? "",
      clientPresent: existingNote?.clientPresent ?? false,
      trainingObjectives: existingNote?.trainingObjectives ?? "",
      teachingMethod: existingNote?.teachingMethod ?? "",
      caregiverCompetency: existingNote?.caregiverCompetency ?? "",
      generalizationPlan: existingNote?.generalizationPlan ?? "",
      homeworkAssigned: existingNote?.homeworkAssigned ?? "",
      // Assessment (97151)
      assessmentToolsUsed: existingNote?.assessmentToolsUsed ?? [],
      faceToFaceMinutes: existingNote?.faceToFaceMinutes ?? undefined,
      nonFaceToFaceMinutes: existingNote?.nonFaceToFaceMinutes ?? undefined,
      caregiverParticipated: existingNote?.caregiverParticipated ?? false,
      findingsSummary: existingNote?.findingsSummary ?? "",
      recommendations: existingNote?.recommendations ?? "",
      // Goals & behaviors
      goals: existingNote?.goals.map((g) => ({
        id: g.id,
        goalId: g.goalId ?? "",
        goalName: g.goalName,
        procedure: g.procedure ?? "",
        measurementType: g.measurementType as MeasurementType,
        trialsCompleted: g.trialsCompleted ?? undefined,
        trialsCorrect: g.trialsCorrect ?? undefined,
        percentageCorrect: g.percentageCorrect != null ? Number(g.percentageCorrect) : undefined,
        frequencyCount: g.frequencyCount ?? undefined,
        durationSeconds: g.durationSeconds ?? undefined,
        ratePerMinute: g.ratePerMinute != null ? Number(g.ratePerMinute) : undefined,
        latencySeconds: g.latencySeconds ?? undefined,
        stepsCompleted: g.stepsCompleted ?? undefined,
        stepsTotal: g.stepsTotal ?? undefined,
        probeCorrect: g.probeCorrect ?? undefined,
        probeTotal: g.probeTotal ?? undefined,
        ratingScaleValue: g.ratingScaleValue ?? undefined,
        ratingScaleMax: g.ratingScaleMax ?? undefined,
        intervalsScored: g.intervalsScored ?? undefined,
        intervalsTotal: g.intervalsTotal ?? undefined,
        promptLevel: (g.promptLevel ?? "") as PromptLevel | "",
        reinforcement: g.reinforcement ?? "",
        progressStatus: g.progressStatus as GoalProgressStatus,
        notes: g.notes ?? "",
      })) ?? [],
      behaviors: existingNote?.behaviors.map((b) => ({
        id: b.id,
        behaviorName: b.behaviorName,
        occurrenceTime: b.occurrenceTime ?? "",
        antecedent: b.antecedent ?? "",
        behaviorDescription: b.behaviorDescription ?? "",
        consequence: b.consequence ?? "",
        durationSeconds: b.durationSeconds ?? undefined,
        intensity: (b.intensity ?? "") as "" | "mild" | "moderate" | "severe",
        notes: b.notes ?? "",
      })) ?? [],
    },
  });

  const {
    fields: goalFields,
    append: appendGoal,
    remove: removeGoal,
  } = useFieldArray({ control, name: "goals" });

  const {
    fields: behaviorFields,
    append: appendBehavior,
    remove: removeBehavior,
  } = useFieldArray({ control, name: "behaviors" });

  // ── Server actions ─────────────────────────────────────────────────────
  // "Save & Sign" uses a two-step flow: saveSessionNote → signSessionNote.
  // We track intent via signAfterSave state so we can chain them in onSuccess.

  const [signAfterSave, setSignAfterSave] = useState(false);

  const { execute: executeSave, isPending: isSaving } = useAction(saveSessionNote, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        if (signAfterSave && data.data?.noteId) {
          // Chain: now sign the note we just saved
          executeSign({ id: data.data.noteId });
        } else {
          toast.success("Note saved");
          router.push(`/sessions/${session.id}`);
          router.refresh();
        }
      }
    },
    onError: ({ error }) => {
      setSignAfterSave(false);
      toast.error(error.serverError ?? "Failed to save note");
    },
  });

  const { execute: executeSign, isPending: isSigning } = useAction(signSessionNote, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setHasSubmitted(true);
        toast.success("Note saved and signed");
        router.push(`/sessions/${session.id}`);
        router.refresh();
      }
    },
    onError: ({ error }) => {
      setSignAfterSave(false);
      toast.error(error.serverError ?? "Failed to sign note");
    },
  });

  const isPending = isSaving || isSigning || hasSubmitted;

  function onSave(data: SaveSessionNoteInput) {
    setSignAfterSave(false);
    executeSave(data);
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSave as Parameters<typeof handleSubmit>[0])} className="space-y-6">
      {/* Session Context (read-only) */}
      <SectionCard title="Session Context">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">Client</dt>
            <dd className="font-medium">{session.clientLastName}, {session.clientFirstName}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-medium tabular-nums">{session.sessionDate}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">CPT Code</dt>
            <dd className="font-medium tabular-nums">{session.cptCode}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Provider</dt>
            <dd className="font-medium">{session.providerLastName}, {session.providerFirstName}</dd>
          </div>
        </dl>
        <div className="text-muted-foreground text-xs">
          Note type: <span className="font-medium text-foreground">{NOTE_TYPE_LABELS[noteType]}</span>
        </div>
      </SectionCard>

      {/* Universal Fields */}
      <SectionCard title="Session Documentation">
        <Field>
          <Label className="text-xs font-medium">Others Present</Label>
          <Input
            {...register("othersPresent")}
            placeholder="e.g., Parent, sibling, classroom aide"
            className="h-8 text-xs"
            disabled={isReadOnly}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <Label className="text-xs font-medium">Subjective Notes</Label>
            <Textarea
              {...register("subjectiveNotes")}
              placeholder="Client/caregiver report, mood, recent events..."
              className="min-h-16 text-xs"
              disabled={isReadOnly}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Client Presentation</Label>
            <Textarea
              {...register("clientPresentation")}
              placeholder="Affect, engagement, energy level..."
              className="min-h-16 text-xs"
              disabled={isReadOnly}
            />
          </Field>
        </div>

        <Field>
          <Label className="text-xs font-medium">
            Session Narrative <span className="text-destructive">*</span>
          </Label>
          <Textarea
            {...register("sessionNarrative")}
            placeholder="Describe what occurred during the session, interventions used, client responses..."
            className="min-h-24 text-xs"
            disabled={isReadOnly}
          />
          <FieldError>{errors.sessionNarrative?.message}</FieldError>
        </Field>

        <Field>
          <Label className="text-xs font-medium">Barriers to Performance</Label>
          <Textarea
            {...register("barriersToPerformance")}
            placeholder="Environmental factors, client state, schedule disruptions..."
            className="min-h-12 text-xs"
            disabled={isReadOnly}
          />
        </Field>

        <Field>
          <Label className="text-xs font-medium">Caregiver Communication</Label>
          <Textarea
            {...register("caregiverCommunication")}
            placeholder="Summary of discussion with caregiver, recommendations shared..."
            className="min-h-12 text-xs"
            disabled={isReadOnly}
          />
        </Field>

        <Field>
          <Label className="text-xs font-medium">
            Plan for Next Session <span className="text-destructive">*</span>
          </Label>
          <Textarea
            {...register("planNextSession")}
            placeholder="Goals to prioritize, adjustments to interventions, materials needed..."
            className="min-h-16 text-xs"
            disabled={isReadOnly}
          />
          <FieldError>{errors.planNextSession?.message}</FieldError>
        </Field>
      </SectionCard>

      {/* CPT-Specific: 97155 Modification */}
      {noteType === "97155_modification" && (
        <SectionCard title="Protocol Modification">
          <Field>
            <Label className="text-xs font-medium">
              Modification Rationale <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("modificationRationale")}
              placeholder="Why is the protocol being modified?"
              className="min-h-16 text-xs"
              disabled={isReadOnly}
            />
            <FieldError>{errors.modificationRationale?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">
              Modification Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("modificationDescription")}
              placeholder="Describe the specific changes made to the protocol..."
              className="min-h-16 text-xs"
              disabled={isReadOnly}
            />
            <FieldError>{errors.modificationDescription?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Client Response to Modification</Label>
            <Textarea
              {...register("clientResponseToModification")}
              placeholder="How did the client respond to the protocol changes?"
              className="min-h-12 text-xs"
              disabled={isReadOnly}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Updated Protocol</Label>
            <Textarea
              {...register("updatedProtocol")}
              placeholder="Document the updated protocol/procedure..."
              className="min-h-12 text-xs"
              disabled={isReadOnly}
            />
          </Field>
        </SectionCard>
      )}

      {/* CPT-Specific: 97156 Caregiver Training */}
      {noteType === "97156_caregiver" && (
        <SectionCard title="Caregiver Training">
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label className="text-xs font-medium">
                Caregiver Name <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("caregiverName")}
                placeholder="Full name of caregiver"
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
              <FieldError>{errors.caregiverName?.message}</FieldError>
            </Field>
            <Field>
              <Label className="text-xs font-medium">Relationship to Client</Label>
              <Input
                {...register("caregiverRelationship")}
                placeholder="e.g., Mother, Father, Guardian"
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
            </Field>
          </div>
          <Controller
            name="clientPresent"
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
                <Label className="text-xs font-medium">Client was present during training</Label>
              </Field>
            )}
          />
          <Field>
            <Label className="text-xs font-medium">
              Training Objectives <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("trainingObjectives")}
              placeholder="What skills/strategies were taught to the caregiver?"
              className="min-h-16 text-xs"
              disabled={isReadOnly}
            />
            <FieldError>{errors.trainingObjectives?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Teaching Method</Label>
            <Textarea
              {...register("teachingMethod")}
              placeholder="e.g., BST (behavioral skills training), role play, modeling..."
              className="min-h-12 text-xs"
              disabled={isReadOnly}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Caregiver Competency</Label>
            <Textarea
              {...register("caregiverCompetency")}
              placeholder="How did the caregiver demonstrate competency with the trained skill?"
              className="min-h-12 text-xs"
              disabled={isReadOnly}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Generalization Plan</Label>
            <Textarea
              {...register("generalizationPlan")}
              placeholder="How will the skill generalize across settings/people?"
              className="min-h-12 text-xs"
              disabled={isReadOnly}
            />
          </Field>
          <Field>
            <Label className="text-xs font-medium">Homework Assigned</Label>
            <Textarea
              {...register("homeworkAssigned")}
              placeholder="Practice activities for caregiver before next session..."
              className="min-h-12 text-xs"
              disabled={isReadOnly}
            />
          </Field>
        </SectionCard>
      )}

      {/* CPT-Specific: 97151 Assessment */}
      {noteType === "97151_assessment" && (
        <SectionCard title="Assessment">
          <Field>
            <Label className="text-xs font-medium">
              Assessment Tools Used <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("assessmentToolsUsed.0")}
              placeholder="e.g., VB-MAPP, ABLLS-R, AFLS, Vineland-3"
              className="h-8 text-xs"
              disabled={isReadOnly}
            />
            <FieldError>{errors.assessmentToolsUsed?.message}</FieldError>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label className="text-xs font-medium">Face-to-Face Minutes</Label>
              <Input
                type="number"
                min={0}
                {...register("faceToFaceMinutes", { valueAsNumber: true })}
                className="h-8 text-xs tabular-nums"
                disabled={isReadOnly}
              />
            </Field>
            <Field>
              <Label className="text-xs font-medium">Non-Face-to-Face Minutes</Label>
              <Input
                type="number"
                min={0}
                {...register("nonFaceToFaceMinutes", { valueAsNumber: true })}
                className="h-8 text-xs tabular-nums"
                disabled={isReadOnly}
              />
            </Field>
          </div>
          <Controller
            name="caregiverParticipated"
            control={control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadOnly}
                />
                <Label className="text-xs font-medium">Caregiver participated in assessment</Label>
              </Field>
            )}
          />
          <Field>
            <Label className="text-xs font-medium">
              Findings Summary <span className="text-destructive">*</span>
            </Label>
            <Textarea
              {...register("findingsSummary")}
              placeholder="Summary of assessment findings, skill levels, areas of need..."
              className="min-h-24 text-xs"
              disabled={isReadOnly}
            />
            <FieldError>{errors.findingsSummary?.message}</FieldError>
          </Field>
          <Field>
            <Label className="text-xs font-medium">Recommendations</Label>
            <Textarea
              {...register("recommendations")}
              placeholder="Treatment recommendations based on assessment results..."
              className="min-h-16 text-xs"
              disabled={isReadOnly}
            />
          </Field>
        </SectionCard>
      )}

      {/* Goals Section */}
      <SectionCard title={`Goals${noteType === "97153_direct" ? " *" : ""}`}>
        {goalFields.length === 0 && (
          <p className="text-muted-foreground text-xs">
            No goals added yet.
            {noteType === "97153_direct" && " At least one goal is required for direct therapy notes."}
          </p>
        )}

        <div className="space-y-4">
          {goalFields.map((field, index) => (
            <GoalEntry
              key={field.id}
              index={index}
              control={control}
              register={register}
              errors={errors}
              watch={watch}
              onRemove={() => removeGoal(index)}
              clientGoals={clientGoals}
              disabled={isReadOnly}
            />
          ))}
        </div>

        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() =>
              appendGoal({
                goalName: "",
                goalId: "",
                procedure: "",
                measurementType: "discrete_trial",
                progressStatus: "not_assessed",
                promptLevel: "",
                reinforcement: "",
                notes: "",
              })
            }
          >
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1" />
            Add Goal
          </Button>
        )}
      </SectionCard>

      {/* Behaviors Section */}
      <SectionCard title="Behavior Incidents">
        {behaviorFields.length === 0 && (
          <p className="text-muted-foreground text-xs">
            No behavior incidents recorded.
          </p>
        )}

        <div className="space-y-4">
          {behaviorFields.map((field, index) => (
            <BehaviorEntry
              key={field.id}
              index={index}
              control={control}
              register={register}
              errors={errors}
              onRemove={() => removeBehavior(index)}
              disabled={isReadOnly}
            />
          ))}
        </div>

        {!isReadOnly && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() =>
              appendBehavior({
                behaviorName: "",
                occurrenceTime: "",
                antecedent: "",
                behaviorDescription: "",
                consequence: "",
                intensity: "",
                notes: "",
              })
            }
          >
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-1" />
            Add Behavior Incident
          </Button>
        )}
      </SectionCard>

      {/* Actions */}
      {!isReadOnly && (
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={isPending}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          {canSign && (
            <Button
              type="button"
              size="sm"
              className="text-xs"
              disabled={isPending}
              onClick={handleSubmit((data) => {
                setSignAfterSave(true);
                executeSave(data);
              })}
            >
              {isSigning ? "Signing..." : "Save & Sign"}
            </Button>
          )}
        </div>
      )}

      {/* Read-only back button */}
      {isReadOnly && (
        <div className="flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => router.back()}
          >
            Back
          </Button>
        </div>
      )}
    </form>
  );
}
