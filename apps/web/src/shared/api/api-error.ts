export type ApiErrorCode =
  | "PROJECT_CATALOG_UNAVAILABLE"
  | "PROJECT_NOT_FOUND"
  | "UNKNOWN";

export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
  };
};

export function toApiErrorCode(code: string | undefined): ApiErrorCode {
  if (code === "PROJECT_CATALOG_UNAVAILABLE" || code === "PROJECT_NOT_FOUND") {
    return code;
  }

  return "UNKNOWN";
}
