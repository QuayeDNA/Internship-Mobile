import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  title?: string;
  children: React.ReactNode;
}

export const InfoCard: React.FC<Props> = ({ title, children }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
      }}
    >
      {title && <Text style={{ ...theme.typography.heading2, marginBottom: theme.spacing.sm }}>{title}</Text>}
      {children}
    </View>
  );
};