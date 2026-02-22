import { useState } from "react";
import { useInternshipContext } from "../contexts/InternshipContext";
import * as assignmentService from "../services/assignment.service";
import * as internshipService from "../services/internship.service";
import * as locationService from "../services/location.service";
import { AppError, AssumptionOfDutyRequest } from "../types";

export function useInternship() {
  const { state, dispatch } = useInternshipContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);

  const fetchActivePeriod = async () => {
    try {
      const period = await internshipService.getActivePeriod();
      dispatch({ type: "SET_ACTIVE_PERIOD", activePeriod: period });
    } catch (err) {
      setError(err as AppError);
      throw err;
    }
  };

  const submitRegistration = async (
    data: Omit<AssumptionOfDutyRequest, "longitude" | "latitude" | "periodId">,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (!state.activePeriod) {
        await fetchActivePeriod();
      }
      const coords = await locationService.getCurrentCoordinates();
      const request: AssumptionOfDutyRequest = {
        ...data,
        longitude: coords.longitude,
        latitude: coords.latitude,
        periodId: state.activePeriod?.id || "",
      };
      const record = await internshipService.submitAssumptionOfDuty(request);
      dispatch({ type: "REGISTRATION_SUCCESS", record });
    } catch (err) {
      setError(err as AppError);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshAssignment = async () => {
    try {
      const assignment = await assignmentService.getMyAssignment();
      dispatch({ type: "ASSIGNMENT_LOADED", assignment });
    } catch (err) {
      setError(err as AppError);
      throw err;
    }
  };

  return {
    status: state.status,
    record: state.record,
    assignment: state.assignment,
    activePeriod: state.activePeriod,
    isLoading: state.isLoading,
    error: state.error ?? error,
    fetchActivePeriod,
    submitRegistration,
    refreshAssignment,
    isSubmitting,
  };
}
