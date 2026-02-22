import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  score: number; // 0 to 4
}

export const PasswordStrength: React.FC<Props> = ({ score }) => {
  const theme = useTheme();
  const segments = [0,1,2,3];
  return (
    <View style={{ flexDirection: 'row', marginTop: theme.spacing.xs }}>
      {segments.map((i) => {
        const filled = i < score;
        const color = filled
          ? score <= 1
            ? theme.colors.error
            : score === 2
            ? theme.colors.warning
            : theme.colors.success
          : theme.colors.border;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              backgroundColor: color,
              marginRight: i < segments.length - 1 ? theme.spacing.xs : 0,
            }}
          />
        );
      })}
    </View>
  );
};