import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  title: string;
}

export const SectionHeader: React.FC<Props> = ({ title }) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: theme.spacing.md }}>
      <Text style={{ ...theme.typography.heading2, color: theme.colors.textPrimary }}>{title}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: theme.colors.border, marginLeft: theme.spacing.sm }} />
    </View>
  );
};
