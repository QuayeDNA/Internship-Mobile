import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

export const SegmentedControl: React.FC<Props> = ({ options, value, onChange }) => {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', borderRadius: theme.radius.sm, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.border }}>
      {options.map((opt, idx) => {
        const selected = opt === value;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            style={{
              flex: 1,
              padding: theme.spacing.sm,
              backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: selected ? '#fff' : theme.colors.textPrimary, ...theme.typography.body }}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};