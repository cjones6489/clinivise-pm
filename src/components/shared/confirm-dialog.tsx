"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogBase {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  variant?: "default" | "destructive";
  confirmLabel?: string;
}

interface TriggerConfirmDialogProps extends ConfirmDialogBase {
  trigger: React.ReactNode;
  open?: never;
  onOpenChange?: never;
}

interface ControlledConfirmDialogProps extends ConfirmDialogBase {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: never;
}

type ConfirmDialogProps = TriggerConfirmDialogProps | ControlledConfirmDialogProps;

export function ConfirmDialog({
  trigger,
  title,
  description,
  onConfirm,
  variant = "default",
  confirmLabel = "Confirm",
  ...controlledProps
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const isControlled = "open" in controlledProps && controlledProps.open !== undefined;
  const open = isControlled ? controlledProps.open : internalOpen;
  const setOpen = isControlled ? controlledProps.onOpenChange! : setInternalOpen;

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={handleConfirm}
            disabled={pending}
          >
            {pending ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
