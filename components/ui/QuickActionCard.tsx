import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export const QuickActionCard: React.FC<Props> = ({ icon, label, onPress }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginVertical: theme.spacing.sm,
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {icon}
      <Text style={{ ...theme.typography.body, marginTop: theme.spacing.sm }}>{label}</Text>
    </TouchableOpacity>
  );
};
