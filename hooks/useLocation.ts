import { useState } from "react";
import * as locationService from "../services/location.service";
import { AppError } from "../types";

export function useLocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "undetermined" | "granted" | "denied"
  >("undetermined");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const requestPermission = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const granted = await locationService.requestLocationPermission();
      setPermissionStatus(granted ? "granted" : "denied");
      return granted;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    setIsLoading(true);
    setError(null);
    try {
      const coords = await locationService.getCurrentCoordinates();
      setLocation(coords);
      return coords;
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    permissionStatus,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
  };
}
