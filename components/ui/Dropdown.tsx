import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Button } from './Button';

interface Props {
  label: string;
  options: string[];
  value?: string;
  onChange: (val: string) => void;
  error?: string;
}

export const Dropdown: React.FC<Props> = ({ label, options, value, onChange, error }) => {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  return (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={{ ...theme.typography.label, color: theme.colors.textPrimary }}>{label}</Text>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.sm,
          marginTop: theme.spacing.xs,
        }}
      >
        <Text>{value || 'Select'}</Text>
      </TouchableOpacity>
      {error ? <Text style={{ color: theme.colors.error, marginTop: theme.spacing.xs }}>{error}</Text> : null}
      <Modal visible={visible} transparent animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: theme.colors.surface, margin: theme.spacing.lg, borderRadius: theme.radius.md }}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                  style={{ padding: theme.spacing.md }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button title="Cancel" variant="ghost" onPress={() => setVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};