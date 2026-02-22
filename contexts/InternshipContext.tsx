import React, { createContext, useContext, useEffect, useReducer } from 'react';
import * as assignmentService from '../services/assignment.service';
import * as internshipService from '../services/internship.service';
import {
    AppError,
    AssumptionOfDutyRecord,
    InternshipPeriod,
    InternshipStatus,
    StudentAssignment,
} from '../types';
import { useAuthContext } from './AuthContext';

interface InternshipState {
  status: InternshipStatus;
  record: AssumptionOfDutyRecord | null;
  assignment: StudentAssignment | null;
  activePeriod: InternshipPeriod | null;
  isLoading: boolean;
  error: AppError | null;
}

interface InternshipAction {
  type:
    | 'LOAD_STATUS_START'
    | 'LOAD_STATUS_SUCCESS'
    | 'LOAD_STATUS_ERROR'
    | 'REGISTRATION_SUCCESS'
    | 'ASSIGNMENT_LOADED'
    | 'SET_ACTIVE_PERIOD';
  record?: AssumptionOfDutyRecord;
  assignment?: StudentAssignment;
  activePeriod?: InternshipPeriod;
  error?: AppError;
}

const initialState: InternshipState = {
  status: 'NOT_REGISTERED',
  record: null,
  assignment: null,
  activePeriod: null,
  isLoading: false,
  error: null,
};

function deriveStatus(
  record: AssumptionOfDutyRecord | null,
  assignment: StudentAssignment | null,
): InternshipStatus {
  if (!record) return 'NOT_REGISTERED';
  if (record && (!assignment || !assignment.supervisor))
    return 'REGISTERED_PENDING_ASSIGNMENT';
  return 'ASSIGNED';
}

function internshipReducer(
  state: InternshipState,
  action: InternshipAction,
): InternshipState {
  switch (action.type) {
    case 'LOAD_STATUS_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_STATUS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        record: action.record || null,
        assignment: action.assignment || null,
        status: deriveStatus(action.record || null, action.assignment || null),
      };
    case 'LOAD_STATUS_ERROR':
      return { ...state, isLoading: false, error: action.error || null };
    case 'REGISTRATION_SUCCESS':
      return {
        ...state,
        record: action.record || null,
        status: 'REGISTERED_PENDING_ASSIGNMENT',
      };
    case 'ASSIGNMENT_LOADED':
      const newAssignment = action.assignment || null;
      return {
        ...state,
        assignment: newAssignment,
        status: deriveStatus(state.record, newAssignment),
      };
    case 'SET_ACTIVE_PERIOD':
      return { ...state, activePeriod: action.activePeriod || null };
    default:
      return state;
  }
}

const InternshipContext = createContext<{
  state: InternshipState;
  dispatch: React.Dispatch<InternshipAction>;
} | null>(null);

export const InternshipProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(internshipReducer, initialState);
  const { state: authState } = useAuthContext();

  useEffect(() => {
    async function load() {
      if (authState.isAuthenticated && authState.session?.hasProfile) {
        dispatch({ type: 'LOAD_STATUS_START' });
        try {
          const [record, assignment] = await Promise.all([
            internshipService.getMyAssumptionOfDuty(),
            assignmentService.getMyAssignment(),
          ]);
          dispatch({ type: 'LOAD_STATUS_SUCCESS', record: record || undefined, assignment });
        } catch (err) {
          dispatch({ type: 'LOAD_STATUS_ERROR', error: err as AppError });
        }
      }
    }
    load();
  }, [authState.isAuthenticated, authState.session?.hasProfile]);

  return (
    <InternshipContext.Provider value={{ state, dispatch }}>
      {children}
    </InternshipContext.Provider>
  );
};

export function useInternshipContext() {
  const context = useContext(InternshipContext);
  if (!context) {
    throw new Error('useInternshipContext must be used within InternshipProvider');
  }
  return context;
}
