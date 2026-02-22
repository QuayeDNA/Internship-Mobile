// Normalised error shape — all API errors are mapped to this
export interface AppError {
  code: string; // e.g. "INVALID_CREDENTIALS", "OTP_EXPIRED"
  message: string; // Human-readable, safe to show in UI
  statusCode: number; // HTTP status code
  fieldErrors?: Record<string, string>; // Validation errors keyed by field name
}

// Generic API response wrapper (if API wraps responses)
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
