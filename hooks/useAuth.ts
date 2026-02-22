import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import * as authService from "../services/auth.service";
import {
    AppError,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
} from "../types";
import { saveAccessToken, saveRefreshToken } from "../utils/token.utils";

export function useAuth() {
  const { state, dispatch } = useAuthContext();
  const [error, setError] = useState<AppError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (data: LoginRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res: AuthResponse = await authService.login(data);
      await saveAccessToken(res.access_token);
      if (res.refresh_token) {
        await saveRefreshToken(res.refresh_token);
      }
      dispatch({ type: "LOGIN_SUCCESS", payload: res });
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authService.registerStudent(data);
      return res;
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async (data: VerifyOtpRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authService.verifyOtp(data);
      return res;
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async (email: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authService.resendOtp(email);
      return res;
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authService.forgotPassword({ email });
      return res;
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await authService.resetPassword(data);
      return res;
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await authService.logout();
    } catch (err) {
      // ignore
    } finally {
      // clear local state/token via dispatch
      dispatch({ type: "LOGOUT" });
      setIsSubmitting(false);
    }
  };

  return {
    session: state.session,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    logout,
    error,
    isSubmitting,
  };
}
