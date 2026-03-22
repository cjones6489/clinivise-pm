"use client";

import { Badge } from "@/components/ui/badge";
import { SESSION_STATUS_LABELS, SESSION_STATUS_VARIANT, type SessionStatus } from "@/lib/constants";

export function SessionStatusBadge({ status }: { status: string }) {
  const s = status as SessionStatus;
  return (
    <Badge variant={SESSION_STATUS_VARIANT[s] ?? "outline"}>
      {SESSION_STATUS_LABELS[s] ?? status}
    </Badge>
  );
}
