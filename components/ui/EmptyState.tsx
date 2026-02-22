import React from 'react';

import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const EmptyState: React.FC<Props> = ({ icon: Icon, title, subtitle, children }) => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
      <Icon size={72} color={theme.colors.textSecondary} />
      <Text style={{ ...theme.typography.heading1, textAlign: 'center', marginTop: theme.spacing.md }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{ ...theme.typography.body, textAlign: 'center', marginTop: theme.spacing.sm, color: theme.colors.textSecondary }}>
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
};
