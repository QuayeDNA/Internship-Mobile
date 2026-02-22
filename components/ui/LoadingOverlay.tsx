import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export const LoadingOverlay: React.FC = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.6)',
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};
