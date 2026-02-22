import axios, { AxiosError } from "axios";
import { AppError } from "../types";

const defaultMessages: Record<number, string> = {
  400: "Please check the information you entered.",
  401: "Your session has expired. Please log in again.",
  403: "You are not allowed to perform this action.",
  404: "The requested resource was not found.",
  409: "This action conflicts with existing data.",
  422: "Some fields contain invalid data.",
  429: "Too many attempts. Please wait and try again.",
  500: "Something went wrong on our end. Please try again later.",
};

export function parseApiError(error: unknown): AppError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 0;
    let message =
      defaultMessages[status] || "Something went wrong. Please try again.";
    let fieldErrors: Record<string, string> | undefined;

    if (axiosError.response?.data) {
      const data: any = axiosError.response.data;
      if (data.message && typeof data.message === "string") {
        message = data.message;
      }
      if (data.errors && typeof data.errors === "object") {
        fieldErrors = {};
        for (const key in data.errors) {
          fieldErrors[key] = data.errors[key];
        }
      }
    }

    return {
      code: axiosError.code || `HTTP_${status}`,
      message,
      statusCode: status,
      fieldErrors,
    };
  }

  // Non-Axios errors
  const message = (error as any)?.message || "An unexpected error occurred.";
  return { code: "UNKNOWN", message, statusCode: 0 };
}
