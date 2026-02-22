import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  label: string;
  value?: string;
  onChange: (iso: string) => void;
  error?: string;
}

export const DatePickerField: React.FC<Props> = ({ label, value, onChange, error }) => {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date());

  const handle = (_: any, selected?: Date) => {
    setShow(false);
    if (selected) {
      setDate(selected);
      onChange(selected.toISOString().split('T')[0]);
    }
  };

  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={{ ...theme.typography.label, color: theme.colors.textPrimary }}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.sm,
          marginTop: theme.spacing.xs,
        }}
      >
        <Text>{value || 'Select date'}</Text>
      </TouchableOpacity>
      {error ? <Text style={{ color: theme.colors.error, marginTop: theme.spacing.xs }}>{error}</Text> : null}
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handle}
        />
      )}
    </View>
  );
};