import {
    AssumptionOfDutyRecord,
    AssumptionOfDutyRequest,
    InternshipPeriod,
} from "../types";
import apiClient from "./apiClient";

export async function getActivePeriod(): Promise<InternshipPeriod> {
  const res = await apiClient.get("/internship-periods/active");
  return res.data;
}

export async function submitAssumptionOfDuty(
  data: AssumptionOfDutyRequest,
): Promise<AssumptionOfDutyRecord> {
  const res = await apiClient.post("/assumption-of-duty", data);
  return res.data;
}

export async function getMyAssumptionOfDuty(): Promise<AssumptionOfDutyRecord | null> {
  try {
    const res = await apiClient.get("/assumption-of-duty/me");
    return res.data;
  } catch (err) {
    // treat 404 as null
    if ((err as any)?.statusCode === 404) {
      return null;
    }
    throw err;
  }
}
