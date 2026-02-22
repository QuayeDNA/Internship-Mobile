import { Clock } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Button } from './Button';

interface Props {
  onRefresh: () => void;
}

export const PendingAssignmentState: React.FC<Props> = ({ onRefresh }) => {
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
      <Clock size={72} color={theme.colors.warning} />
      <Text style={{ ...theme.typography.heading1, textAlign: 'center', marginTop: theme.spacing.md }}>
        Assignment in Progress
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          textAlign: 'center',
          marginTop: theme.spacing.sm,
          color: theme.colors.textSecondary,
        }}
      >
        Your supervisor and zone are being assigned. Please check back later.
      </Text>
      <View style={{ height: theme.spacing.lg }} />
      <Button title="Refresh" variant="outline" onPress={onRefresh} />
    </View>
  );
};
