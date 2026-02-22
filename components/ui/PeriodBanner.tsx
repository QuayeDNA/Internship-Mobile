import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface Props {
  period: Period;
}

export const PeriodBanner: React.FC<Props> = ({ period }) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.infoLight,
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
      }}
    >
      <Text style={{ ...theme.typography.body, color: theme.colors.info }}>
        📅 {period.name} is open. Deadline: {period.endDate.slice(0, 10)}
      </Text>
    </View>
  );
};
