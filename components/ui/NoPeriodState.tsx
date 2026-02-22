import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Button } from './Button';

interface Props {
  onRefresh: () => void;
}

export const NoPeriodState: React.FC<Props> = ({ onRefresh }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
      }}
    >
      <Text style={{ fontSize: 72, color: theme.colors.textSecondary }}>📅</Text>
      <Text style={{ ...theme.typography.heading1, textAlign: 'center', marginTop: theme.spacing.md }}>
        No Open Period
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          textAlign: 'center',
          marginTop: theme.spacing.sm,
          color: theme.colors.textSecondary,
        }}
      >
        There is no active internship period at this time. Check back later.
      </Text>
      <View style={{ height: theme.spacing.lg }} />
      <Button title="Refresh" variant="ghost" onPress={onRefresh} />
    </View>
  );
};
