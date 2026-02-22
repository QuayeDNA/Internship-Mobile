import { StudentAssignment } from "../types";
import apiClient from "./apiClient";

export async function getMyAssignment(): Promise<StudentAssignment> {
  try {
    const res = await apiClient.get("/assignments/me");
    return res.data;
  } catch (err) {
    if ((err as any)?.statusCode === 404) {
      return {
        supervisor: null,
        zone: null,
        assignmentStatus: "PENDING",
      };
    }
    throw err;
  }
}
