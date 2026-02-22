import { CheckCircle, Clock, XCircle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { InternshipStatus } from '../../types';

interface Props {
  status: InternshipStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const theme = useTheme();
  let bg, text, Icon;
  if (status === 'NOT_REGISTERED') {
    bg = theme.colors.errorLight;
    text = theme.colors.error;
    Icon = XCircle;
  } else if (status === 'REGISTERED_PENDING_ASSIGNMENT') {
    bg = theme.colors.warningLight;
    text = theme.colors.warning;
    Icon = Clock;
  } else {
    bg = theme.colors.successLight;
    text = theme.colors.success;
    Icon = CheckCircle;
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: bg,
        borderRadius: theme.radius.full,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
      }}
    >
      <Icon size={16} color={text} />
      <Text style={{ color: text, marginLeft: theme.spacing.xs, ...theme.typography.label }}>
        {status.replace(/_/g, ' ')}
      </Text>
    </View>
  );
};
