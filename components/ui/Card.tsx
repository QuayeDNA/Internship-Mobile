import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  shadow?: 'card' | 'elevated' | 'none';
}

export const Card: React.FC<Props> = ({ children, style, shadow = 'card' }) => {
  const theme = useTheme();
  const shadowStyle =
    shadow === 'card'
      ? theme.shadows.card
      : shadow === 'elevated'
      ? theme.shadows.elevated
      : {};
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
        },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
};
