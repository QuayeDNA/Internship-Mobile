import { useState } from "react";
import { Alert } from "react-native";
import { useAuthContext } from "../contexts/AuthContext";
import { useProfileContext } from "../contexts/ProfileContext";
import * as profileService from "../services/profile.service";
import { AppError, CreateProfileRequest } from "../types";

export function useProfile() {
  const { state, dispatch } = useProfileContext();
  const { dispatch: authDispatch } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const createProfile = async (data: CreateProfileRequest) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        "Confirm",
        "Profile cannot be edited after submission. Are you sure?",
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          { text: "Submit", onPress: () => resolve(true) },
        ],
        { cancelable: false },
      );
    });
    if (!confirmed) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const profile = await profileService.createProfile(data);
      dispatch({ type: "LOAD_PROFILE_SUCCESS", profile });
      authDispatch({ type: "PROFILE_CREATED" });
    } catch (err) {
      const e = err as AppError;
      setError(e);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProfileImage = async (uri: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const profile = await profileService.updateProfileImage({
        imageUri: uri,
      });
      dispatch({ type: "UPDATE_PROFILE_IMAGE_SUCCESS", profile });
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const refetch = async () => {
    dispatch({ type: "LOAD_PROFILE_START" });
    try {
      const profile = await profileService.getMyProfile();
      dispatch({ type: "LOAD_PROFILE_SUCCESS", profile });
    } catch (err) {
      dispatch({ type: "LOAD_PROFILE_ERROR", error: err as AppError });
    }
  };

  return {
    profile: state.profile,
    isLoading: state.isLoading,
    error: state.error ?? error,
    createProfile,
    updateProfileImage,
    refetch,
    isSubmitting,
  };
}
