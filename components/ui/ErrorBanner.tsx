import { AlertCircle, X } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  message: string;
  onDismiss?: () => void;
}

export const ErrorBanner: React.FC<Props> = ({ message, onDismiss }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.errorLight,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.error,
        padding: theme.spacing.sm,
      }}
    >
      <AlertCircle size={20} color={theme.colors.error} />
      <Text style={{ marginLeft: theme.spacing.sm, color: theme.colors.error, flex: 1 }}>{message}</Text>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <X size={16} color={theme.colors.error} />
        </TouchableOpacity>
      )}
    </View>
  );
};
