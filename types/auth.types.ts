// Registration request body
export interface RegisterRequest {
  email: string; // Must match pattern: *@ttu.edu.gh
  password: string; // Backend-enforced strength rules
  firstName: string;
  lastName: string;
}

// OTP verification request body
export interface VerifyOtpRequest {
  email: string;
  otp: string; // 6-digit string
}

// Login request body
export interface LoginRequest {
  email: string;
  password: string;
}

// Password reset — step 1: request OTP
export interface ForgotPasswordRequest {
  email: string;
}

// Password reset — step 2: submit new password with OTP
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

// Auth API success response
export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    hasProfile: boolean; // Drives onboarding gate
  };
}

// Minimal session state stored in AuthContext
export interface AuthSession {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  hasProfile: boolean;
}
