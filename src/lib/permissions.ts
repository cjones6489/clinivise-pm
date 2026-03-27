import type { UserRole } from "./constants";
import { ForbiddenError } from "./errors";

/**
 * Permission matrix — defines what each role can do.
 * Based on BACB scope of practice, HIPAA minimum necessary, and competitor research.
 * See: docs/research/rbac-role-design-research.md (Section 4: Permission Matrix)
 */
export const PERMISSIONS = {
  // Clients
  "clients.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "clients.write": ["owner", "admin", "bcba"],

  // Sessions
  "sessions.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "sessions.write": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "sessions.cancel": ["owner", "admin", "bcba"],

  // Session Notes
  "notes.read": ["owner", "admin", "bcba", "bcaba", "rbt", "billing_staff"],
  "notes.write": ["owner", "admin", "bcba", "bcaba", "rbt"],
  "notes.sign": ["owner", "admin", "bcba", "bcaba", "rbt"],
  // Authorizations
  "authorizations.read": ["owner", "admin", "bcba", "bcaba", "billing_staff"],
  "authorizations.write": ["owner", "admin", "bcba", "billing_staff"],

  // Providers
  "providers.read": ["owner", "admin", "bcba", "bcaba", "billing_staff"],
  "providers.write": ["owner", "admin"],

  // Payers
  "payers.read": ["owner", "admin", "bcba", "billing_staff"],
  "payers.write": ["owner", "admin", "billing_staff"],

  // Team
  "team.read": ["owner", "admin"],
  "team.manage": ["owner", "admin"],

  // Settings
  "settings.read": ["owner", "admin"],
  "settings.write": ["owner", "admin"],

  // Billing (Phase 2)
  "billing.read": ["owner", "admin", "billing_staff"],
  "billing.write": ["owner", "admin", "billing_staff"],

  // Reports (Phase 2)
  "reports.read": ["owner", "admin", "bcba", "billing_staff"],
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
