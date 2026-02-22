import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  length?: number;
  onComplete: (otp: string) => void;
}

export const OtpInput: React.FC<Props> = ({ length = 6, onComplete }) => {
  const theme = useTheme();
  const refs = useRef<(TextInput | null)[]>([]);
  const values = useRef<string[]>(Array(length).fill(''));

  const handleChange = (text: string, idx: number) => {
    if (!/^[0-9]*$/.test(text)) return;
    values.current[idx] = text;
    if (text && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
    if (!text && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
    const assembled = values.current.join('');
    if (assembled.length === length) {
      onComplete(assembled);
    }
  };

  const inputs = [];
  for (let i = 0; i < length; i++) {
    inputs.push(
      <TextInput
        key={i}
        ref={(r) => (refs.current[i] = r)}
        value={values.current[i]}
        onChangeText={(t) => handleChange(t, i)}
        keyboardType="number-pad"
        maxLength={1}
        style={{
          width: 48,
          height: 56,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          textAlign: 'center',
          marginRight: i !== length - 1 ? theme.spacing.sm : 0,
          ...theme.typography.displayMedium,
        }}
        accessibilityLabel={`OTP digit ${i + 1}`}
        accessibilityRole="keyboardkey"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      />,
    );
  }

  return <View style={{ flexDirection: 'row' }}>{inputs}</View>;
};
