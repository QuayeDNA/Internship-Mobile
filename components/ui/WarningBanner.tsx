import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  message: string;
  onDismiss?: () => void;
}

export const WarningBanner: React.FC<Props> = ({ message, onDismiss }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.warningLight,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.warning,
        padding: theme.spacing.md,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 20, marginRight: theme.spacing.sm, color: theme.colors.warning }}>
        ⚠️
      </Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.warning, flex: 1 }}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={{ marginLeft: theme.spacing.sm }}>
          <Text style={{ color: theme.colors.warning }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
