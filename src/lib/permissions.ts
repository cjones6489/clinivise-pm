import type { UserRole } from "./constants";
import { ForbiddenError } from "./errors";

export const PERMISSIONS = {
  "clients.write": ["owner", "admin", "bcba"],
  "clients.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "sessions.write": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "authorizations.write": ["owner", "admin", "bcba"],
  "providers.write": ["owner", "admin"],
  "payers.write": ["owner", "admin"],
  "settings.write": ["owner", "admin"],
} as const satisfies Record<string, readonly UserRole[]>;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(role);
}

/**
 * Throw if role lacks the required permission.
 */
export function requirePermission(role: string, permission: Permission): void {
  if (!hasPermission(role, permission)) {
    throw new ForbiddenError();
  }
}
