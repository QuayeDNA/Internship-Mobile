import { z } from "zod";

export const profileSchema = z.object({
  indexNumber: z.string().min(1),
  faculty: z.string().min(1),
  department: z.string().min(1),
  programme: z.string().min(1),
  level: z.string().min(1),
  session: z.enum(["Regular", "Weekend", "Evening"]),
  certificateType: z.enum([
    "BACHELOR of TECHNOLOGY",
    "HND",
    "DIPLOMA",
    "CERTIFICATE",
  ]),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.string().regex(/\d{4}-\d{2}-\d{2}/, "Invalid date"),
  phoneNumber: z.string().regex(/^\+\d{8,15}$/, "Invalid phone number"),
});
