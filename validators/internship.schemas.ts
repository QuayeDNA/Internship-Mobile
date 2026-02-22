import { z } from "zod";

export const assumptionOfDutySchema = z.object({
  companyName: z.string().min(1),
  companyPhone: z.string().regex(/^\+\d{8,15}$/, "Invalid phone number"),
  companyEmail: z.string().email(),
  companyAddress: z.string().min(1),
  companySupervisor: z.string().min(1),
  supervisorPhone: z.string().regex(/^\+\d{8,15}$/, "Invalid phone number"),
  companyCity: z.string().min(1),
  commencementDate: z.string().regex(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/, // simple iso datetime
    "Invalid date-time",
  ),
});
