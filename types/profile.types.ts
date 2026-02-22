// Allowed enum values — derive these from the PDF; extend if API returns more
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Session = "Regular" | "Weekend" | "Evening";
export type CertificateType =
  | "BACHELOR of TECHNOLOGY"
  | "HND"
  | "DIPLOMA"
  | "CERTIFICATE";

// Profile creation request body (one-time, immutable after submit)
export interface CreateProfileRequest {
  indexNumber: string; // Format: TTU/YYYY/XXXXXX
  faculty: string;
  department: string;
  programme: string;
  level: string; // e.g. "100", "200", "300", "400"
  session: Session;
  certificateType: CertificateType;
  gender: Gender;
  dateOfBirth: string; // ISO 8601: YYYY-MM-DD
  phoneNumber: string; // E.164 format: +233XXXXXXXXX
}

// Full profile as returned by GET /profile/me
export interface StudentProfile extends CreateProfileRequest {
  id: string;
  userId: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;

  // additional fields returned by the API
  firstName: string;
  lastName: string;
  email: string;
}

// Profile image update — only editable field post-onboarding
export interface UpdateProfileImageRequest {
  imageUri: string; // Local file URI; service handles multipart/form-data upload
}
