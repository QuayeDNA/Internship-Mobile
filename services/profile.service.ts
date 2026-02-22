import {
    CreateProfileRequest,
    StudentProfile,
    UpdateProfileImageRequest,
} from "../types";
import apiClient from "./apiClient";

export async function createProfile(
  data: CreateProfileRequest,
): Promise<StudentProfile> {
  const res = await apiClient.post("/profile", data);
  return res.data;
}

export async function getMyProfile(): Promise<StudentProfile> {
  const res = await apiClient.get("/profile/me");
  return res.data;
}

export async function updateProfileImage(
  data: UpdateProfileImageRequest,
): Promise<StudentProfile> {
  const form = new FormData();
  form.append("image", {
    uri: data.imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  const res = await apiClient.patch("/profile/me/image", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
