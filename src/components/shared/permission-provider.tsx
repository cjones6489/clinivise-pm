"use client";

import { createContext, useContext, type ReactNode } from "react";
import { hasPermission, type Permission } from "@/lib/permissions";

type PermissionContextValue = {
  role: string;
  can: (permission: Permission) => boolean;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);

/**
 * Provides the current user's role to all child components.
 * Set once in the dashboard layout from the server-side auth context.
 */
export function PermissionProvider({ role, children }: { role: string; children: ReactNode }) {
  const value: PermissionContextValue = {
    role,
    can: (permission) => hasPermission(role, permission),
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

/**
 * Hook to check permissions in client components.
 *
 * @example
 * const { can } = usePermissions();
 * if (can("sessions.write")) { ... }
 */
export function usePermissions() {
  const ctx = useContext(PermissionContext);
  if (!ctx) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return ctx;
}

/**
 * Declarative permission gate — shows children only if the user has the permission.
 *
 * @example
 * <Can permission="sessions.write">
 *   <Button>Log Session</Button>
 * </Can>
 */
export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  /** Optional fallback to show when permission is denied */
  fallback?: ReactNode;
}) {
  const { can } = usePermissions();
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}
