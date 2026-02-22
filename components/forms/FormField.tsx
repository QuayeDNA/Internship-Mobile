import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormField: React.FC<Props> = ({
  label,
  error,
  hint,
  required,
  leftIcon,
  rightIcon,
  style,
  ...inputProps
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.colors.error
    : focused
    ? theme.colors.borderFocus
    : theme.colors.border;

  return (
    <View style={{ marginBottom: theme.spacing.md }}> 
      <Text style={{ ...theme.typography.label, color: theme.colors.textPrimary }}>
        {label} {required && <Text style={{ color: theme.colors.error }}>*</Text>}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderColor,
          borderWidth: 1,
          borderRadius: theme.radius.md,
          paddingHorizontal: theme.spacing.sm,
          backgroundColor: theme.colors.surface,
        }}
      >
        {leftIcon}
        <TextInput
          style={[{ flex: 1, padding: theme.spacing.sm }, style]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityHint={hint}
          {...inputProps}
        />
        {rightIcon}
      </View>
      {error ? (
        <Text style={{ color: theme.colors.error, ...theme.typography.bodySmall }}>
          {error}
        </Text>
      ) : hint ? (
        <Text style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
};
