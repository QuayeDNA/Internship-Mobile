import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Button } from './Button';

interface Props {
  onRegisterPress: () => void;
}

export const AlreadyRegisteredState: React.FC<Props> = ({ onRegisterPress }) => {
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
      <Text style={{ fontSize: 72 }}>✅</Text>
      <Text style={{ ...theme.typography.heading1, textAlign: 'center', marginTop: theme.spacing.md }}>
        Already Registered
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          textAlign: 'center',
          marginTop: theme.spacing.sm,
          color: theme.colors.textSecondary,
        }}
      >
        You have successfully registered for the current internship period.
      </Text>
      <View style={{ height: theme.spacing.lg }} />
      <Button title="View My Registration" onPress={onRegisterPress} />
    </View>
  );
};
