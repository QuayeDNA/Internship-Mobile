import React, { createContext, useContext, useEffect, useReducer } from 'react';
import apiClient from '../services/apiClient';
import { AuthResponse, AuthSession } from '../types';
import {
    deleteAccessToken,
    deleteRefreshToken,
    getAccessToken,
} from '../utils/token.utils';

interface AuthState {
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'RESTORE_TOKEN'; session: AuthSession | null }
  | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
  | { type: 'LOGOUT' }
  | { type: 'PROFILE_CREATED' };

const initialState: AuthState = {
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        session: action.session,
        isAuthenticated: !!action.session,
        isLoading: false,
      };
    case 'LOGIN_SUCCESS': {
      const { user, access_token } = action.payload;
      const session: AuthSession = {
        token: access_token,
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        hasProfile: user.hasProfile,
      };
      return {
        session,
        isAuthenticated: true,
        isLoading: false,
      };
    }
    case 'LOGOUT':
      return {
        session: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'PROFILE_CREATED':
      if (!state.session) return state;
      return {
        ...state,
        session: { ...state.session, hasProfile: true },
      };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    async function restore() {
      const token = await getAccessToken();
      if (!token) {
        dispatch({ type: 'RESTORE_TOKEN', session: null });
        return;
      }
      try {
        const res = await apiClient.get('/auth/me');
        const user = res.data;
        const session: AuthSession = {
          token,
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          hasProfile: user.hasProfile,
        };
        dispatch({ type: 'RESTORE_TOKEN', session });
      } catch (err) {
        await deleteAccessToken();
        await deleteRefreshToken();
        dispatch({ type: 'RESTORE_TOKEN', session: null });
      }
    }
    restore();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
