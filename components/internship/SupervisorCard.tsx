import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Avatar } from '../ui/Avatar';

interface Props {
  name: string;
  staffId?: string;
  email?: string;
  phone?: string;
  onEmailPress?: () => void;
  onPhonePress?: () => void;
}

export const SupervisorCard: React.FC<Props> = ({
  name,
  staffId,
  email,
  phone,
  onEmailPress,
  onPhonePress,
}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
        alignItems: 'center',
      }}
    >
      <Avatar name={name} size={56} />
      <Text style={{ ...theme.typography.heading2, marginTop: theme.spacing.sm }}>{name}</Text>
      {staffId && <Text style={{ ...theme.typography.caption, color: theme.colors.textSecondary }}>{staffId}</Text>}
      {email && (
        <TouchableOpacity onPress={onEmailPress} style={{ marginTop: theme.spacing.sm }}>
          <Text style={{ ...theme.typography.body, color: theme.colors.primary }}>{email}</Text>
        </TouchableOpacity>
      )}
      {phone && (
        <TouchableOpacity onPress={onPhonePress} style={{ marginTop: theme.spacing.xs }}>
          <Text style={{ ...theme.typography.body, color: theme.colors.primary }}>{phone}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
