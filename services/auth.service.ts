import {
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
} from "../types";
import apiClient from "./apiClient";

export async function registerStudent(
  data: RegisterRequest,
): Promise<{ message: string }> {
  const res = await apiClient.post("/auth/register", data);
  return res.data;
}

export async function verifyOtp(
  data: VerifyOtpRequest,
): Promise<{ message: string }> {
  const res = await apiClient.post("/auth/verify-otp", data);
  return res.data;
}

export async function resendOtp(email: string): Promise<{ message: string }> {
  const res = await apiClient.post("/auth/resend-otp", { email });
  return res.data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await apiClient.post("/auth/login", data);
  return res.data;
}

export async function forgotPassword(
  data: ForgotPasswordRequest,
): Promise<{ message: string }> {
  const res = await apiClient.post("/auth/forgot-password", data);
  return res.data;
}

export async function resetPassword(
  data: ResetPasswordRequest,
): Promise<{ message: string }> {
  const res = await apiClient.post("/auth/reset-password", data);
  return res.data;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post("/auth/logout");
  } catch {
    // ignore failure
  }
}
