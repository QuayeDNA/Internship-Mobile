import React, { createContext, useContext, useEffect, useReducer } from 'react';
import * as profileService from '../services/profile.service';
import { AppError, StudentProfile } from '../types';
import { useAuthContext } from './AuthContext';

interface ProfileState {
  profile: StudentProfile | null;
  isLoading: boolean;
  error: AppError | null;
}

type ProfileAction =
  | { type: 'LOAD_PROFILE_START' }
  | { type: 'LOAD_PROFILE_SUCCESS'; profile: StudentProfile }
  | { type: 'LOAD_PROFILE_ERROR'; error: AppError }
  | { type: 'UPDATE_PROFILE_IMAGE_SUCCESS'; profile: StudentProfile };

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

function profileReducer(state: ProfileState, action: ProfileAction): ProfileState {
  switch (action.type) {
    case 'LOAD_PROFILE_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_PROFILE_SUCCESS':
      return { ...state, isLoading: false, profile: action.profile };
    case 'LOAD_PROFILE_ERROR':
      return { ...state, isLoading: false, error: action.error };
    case 'UPDATE_PROFILE_IMAGE_SUCCESS':
      return { ...state, profile: action.profile };
    default:
      return state;
  }
}

const ProfileContext = createContext<{
  state: ProfileState;
  dispatch: React.Dispatch<ProfileAction>;
} | null>(null);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const { state: authState } = useAuthContext();

  useEffect(() => {
    async function load() {
      if (authState.isAuthenticated && authState.session?.hasProfile) {
        dispatch({ type: 'LOAD_PROFILE_START' });
        try {
          const profile = await profileService.getMyProfile();
          dispatch({ type: 'LOAD_PROFILE_SUCCESS', profile });
        } catch (err) {
          dispatch({ type: 'LOAD_PROFILE_ERROR', error: err as AppError });
        }
      }
    }
    load();
  }, [authState.isAuthenticated, authState.session?.hasProfile]);

  return (
    <ProfileContext.Provider value={{ state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within ProfileProvider');
  }
  return context;
}
