"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { inviteMember } from "@/server/actions/team";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const ASSIGNABLE_ROLES = USER_ROLES.filter((r) => r !== "owner") as [string, ...string[]];

const inviteSchema = z.object({
  email: z.email("Enter a valid email address"),
  role: z.enum(ASSIGNABLE_ROLES),
});

type InviteInput = z.infer<typeof inviteSchema>;

export function InviteMemberDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteInput>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "", role: "rbt" },
  });

  const { execute, isPending } = useAction(inviteMember, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Invitation sent");
        reset();
        setOpen(false);
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "Failed to send invitation");
    },
  });

  function onSubmit(data: InviteInput) {
    execute(data);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs">
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Invite Team Member</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Send an invitation to join your practice. They&apos;ll receive an email to set up their
            account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <Label className="text-xs font-medium">Email address</Label>
            <Input
              type="email"
              placeholder="name@clinic.com"
              {...register("email")}
              className="h-8 text-xs"
            />
            <FieldError>{errors.email?.message}</FieldError>
          </Field>

          <Field>
            <Label className="text-xs font-medium">Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSIGNABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role} className="text-xs">
                        {ROLE_LABELS[role as UserRole]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.role?.message}</FieldError>
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" className="text-xs" disabled={isPending}>
              {isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
