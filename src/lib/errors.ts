/**
 * Domain error classes for Clinivise.
 *
 * All subclasses of AppError are user-safe — their messages are surfaced
 * directly to the client via handleServerError in safe-action.ts.
 *
 * Non-AppError exceptions return a generic "Something went wrong" message.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** 401 — user is not authenticated */
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED");
  }
}

/** 403 — user lacks the required role/permission */
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden: insufficient role") {
    super(message, "FORBIDDEN");
  }
}

/** 404 — entity not found (or not visible to this org) */
export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} not found`, "NOT_FOUND");
  }
}

/** 409 — optimistic locking failure */
export class StaleDataError extends AppError {
  constructor() {
    super("Record was modified by another user. Please refresh and try again.", "STALE_DATA");
  }
}

/** 409 — business rule violation */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "CONFLICT");
  }
}
