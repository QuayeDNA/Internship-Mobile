import * as Location from "expo-location";
import { AppError } from "../types";

export async function requestLocationPermission(): Promise<boolean> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === Location.PermissionStatus.GRANTED;
}

export async function getCurrentCoordinates(): Promise<{
  latitude: number;
  longitude: number;
}> {
  // first try to obtain a recently cached location (max age 1s)
  const last = await Location.getLastKnownPositionAsync({
    maxAge: 1000, // milliseconds
    // `accuracy` isn't supported for last-known; use requiredAccuracy if needed
  });
  if (last && last.coords) {
    return {
      latitude: last.coords.latitude,
      longitude: last.coords.longitude,
    };
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Highest,
    timeInterval: 1000,
  });
  if (!location || !location.coords) {
    throw {
      code: "LOCATION_UNAVAILABLE",
      message:
        "Unable to retrieve your current location. Please ensure GPS is enabled.",
      statusCode: 0,
    } as AppError;
  }
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}
