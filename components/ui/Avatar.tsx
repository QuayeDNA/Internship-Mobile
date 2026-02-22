import React from 'react';
import { Image, Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  uri?: string;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<Props> = ({ uri, name, size = 56 }) => {
  const theme = useTheme();
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <Text style={{ color: '#fff', ...theme.typography.heading2 }}>{initials}</Text>
      )}
    </View>
  );
};
