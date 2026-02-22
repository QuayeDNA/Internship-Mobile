import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export const Divider: React.FC = () => {
  const theme = useTheme();
  return <View style={{ height: 1, backgroundColor: theme.colors.border, width: '100%' }} />;
};
