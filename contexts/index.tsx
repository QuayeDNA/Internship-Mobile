import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProfileProvider } from './ProfileContext';
import { InternshipProvider } from './InternshipContext';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AuthProvider>
    <ProfileProvider>
      <InternshipProvider>{children}</InternshipProvider>
    </ProfileProvider>
  </AuthProvider>
);
