import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Button } from './Button';

interface Props {
  message: string;
  onRetry: () => void;
}

export const GenericErrorState: React.FC<Props> = ({ message, onRetry }) => {
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
      <Text style={{ fontSize: 64, color: theme.colors.textSecondary }}>⚠️</Text>
      <Text style={{ ...theme.typography.heading1, textAlign: 'center', marginTop: theme.spacing.md }}>
        Something went wrong
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          textAlign: 'center',
          marginTop: theme.spacing.sm,
          color: theme.colors.textSecondary,
        }}
      >
        {message}
      </Text>
      <View style={{ height: theme.spacing.lg }} />
      <Button title="Try Again" onPress={onRetry} />
    </View>
  );
};
