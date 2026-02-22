// Supervisor assigned to a student
export interface AssignedSupervisor {
  id: string;
  name: string;
  email: string;
  phone: string;
  staffId: string;
}

// Zone assigned to a student
export interface AssignedZone {
  id: string;
  name: string;
  description?: string;
  region: string;
}

// Combined assignment response
export interface StudentAssignment {
  supervisor: AssignedSupervisor | null; // null = not yet assigned
  zone: AssignedZone | null; // null = not yet assigned
  assignmentStatus: "PENDING" | "ASSIGNED";
}
