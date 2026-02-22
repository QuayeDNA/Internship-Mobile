// Internship status values — used for UI status indicator
export type InternshipStatus =
  | "NOT_REGISTERED"
  | "REGISTERED_PENDING_ASSIGNMENT"
  | "ASSIGNED";

// Assumption of Duty registration request body
export interface AssumptionOfDutyRequest {
  periodId: string; // UUID of the active internship period
  companyName: string;
  companyPhone: string; // E.164 format
  companyEmail: string;
  companyAddress: string;
  companySupervisor: string;
  supervisorPhone: string; // E.164 format
  companyCity: string;
  commencementDate: string; // ISO 8601 datetime: YYYY-MM-DDTHH:mm:ssZ
  longitude: number; // GPS — captured at submission time
  latitude: number; // GPS — captured at submission time
}

// Assumption of Duty record as returned by API
export interface AssumptionOfDutyRecord extends AssumptionOfDutyRequest {
  id: string;
  studentId: string;
  status: InternshipStatus;
  createdAt: string;
  updatedAt: string;
}

// Active internship period (fetched to populate periodId)
export interface InternshipPeriod {
  id: string; // UUID — use as periodId in registration
  name: string; // e.g. "2026 Industrial Training Period"
  startDate: string;
  endDate: string;
  isActive: boolean;
}
