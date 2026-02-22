import React from 'react';
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface Props {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<Props> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
}) => {
  const theme = useTheme();
  const bgColor = {
    primary: theme.colors.primary,
    accent: theme.colors.accent,
    outline: 'transparent',
    ghost: 'transparent',
    danger: 'transparent',
  }[variant];
  const textColor = {
    primary: '#fff',
    accent: '#fff',
    outline: theme.colors.primary,
    ghost: theme.colors.primary,
    danger: theme.colors.error,
  }[variant];
  const borderColor = {
    outline: theme.colors.primary,
    danger: theme.colors.error,
    primary: 'transparent',
    accent: 'transparent',
    ghost: 'transparent',
  }[variant];

  const containerStyle: ViewStyle = {
    backgroundColor: bgColor,
    borderColor,
    borderWidth: borderColor === 'transparent' ? 0 : 1.5,
    opacity: disabled || isLoading ? 0.6 : 1,
    paddingVertical: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: fullWidth ? '100%' : undefined,
  };

  const textStyle: TextStyle = {
    color: textColor,
    ...theme.typography.button,
  };

  return (
    <TouchableOpacity
      onPress={() => {
        import('expo-haptics').then(({ ImpactFeedbackStyle, impactAsync }) => {
          impactAsync(ImpactFeedbackStyle.Medium);
        });
        onPress();
      }}
      disabled={disabled || isLoading}
      style={containerStyle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {leftIcon}
          <Text style={textStyle}>{title}</Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};
