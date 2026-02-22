import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  name: string;
  region?: string;
  description?: string;
}

export const ZoneCard: React.FC<Props> = ({ name, region, description }) => {
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
      }}
    >
      <Text style={{ ...theme.typography.heading2 }}>{name}</Text>
      {region && <Text style={{ ...theme.typography.body, marginTop: theme.spacing.xs }}>{region}</Text>}
      {description && <Text style={{ ...theme.typography.bodySmall, marginTop: theme.spacing.sm }}>{description}</Text>}
    </View>
  );
};
