import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email()
    .refine((val) => val.endsWith("@ttu.edu.gh"), {
      message: "Email must be a TTU address",
    }),
  password: z.string().min(8), // adjust strength as needed
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});
