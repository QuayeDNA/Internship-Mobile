import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  label: string;
  value: string;
  last?: boolean;
}

export const InfoRow: React.FC<Props> = ({ label, value, last = false }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text style={{ ...theme.typography.bodySmall, color: theme.colors.textSecondary }}>
        {label}
      </Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.textPrimary }}>{value}</Text>
    </View>
  );
};
