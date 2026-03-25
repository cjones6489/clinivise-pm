import { eq, and, isNull, type SQL, type Column } from "drizzle-orm";

type SoftDeletable = {
  deletedAt: Column;
  organizationId: Column;
};

type OrgScoped = {
  organizationId: Column;
};

/**
 * WHERE clause that scopes to org + excludes soft-deleted rows.
 * Use for tables with both organizationId and deletedAt.
 */
export function tenantScope<T extends SoftDeletable>(table: T, orgId: string, ...extra: SQL[]) {
  return and(eq(table.organizationId, orgId), isNull(table.deletedAt), ...extra);
}

/**
 * WHERE clause that scopes to org only.
 * Use for tables without deletedAt.
 */
export function orgScope<T extends OrgScoped>(table: T, orgId: string, ...extra: SQL[]) {
  return and(eq(table.organizationId, orgId), ...extra);
}
