"use client";

import { Badge } from "@/components/ui/badge";
import { AUTH_STATUS_LABELS, AUTH_STATUS_VARIANT, type AuthStatus } from "@/lib/constants";

export function AuthStatusBadge({ status }: { status: string }) {
  const s = status as AuthStatus;
  return (
    <Badge variant={AUTH_STATUS_VARIANT[s] ?? "outline"}>{AUTH_STATUS_LABELS[s] ?? status}</Badge>
  );
}
