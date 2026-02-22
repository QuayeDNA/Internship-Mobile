import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import { ToastProvider } from '../components/ui/Toast';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '../contexts';
import { useAuthContext } from '../contexts/AuthContext';
import { useTheme } from '../theme/useTheme';


export const unstable_settings = {
  anchor: '(tabs)',
};

function InnerApp() {
  const theme = useTheme();
  const { state } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (state.isLoading) return;
    if (!state.isAuthenticated) {
      router.replace('/(auth)/welcome');
    } else if (state.isAuthenticated && !state.session?.hasProfile) {
      router.replace('/(onboarding)/create-profile');
    } else if (state.isAuthenticated && state.session?.hasProfile) {
      router.replace('/(app)/');
    }
  }, [state.isLoading, state.isAuthenticated, state.session]);

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        {/* splash content */}
        <Text style={{ ...theme.typography.displayMedium, color: '#fff' }}>ILO Student Portal</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* global providers for auth/profile/internship + toast */}
      <ToastProvider>
        <AppProvider>
          <InnerApp />
        </AppProvider>
      </ToastProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
