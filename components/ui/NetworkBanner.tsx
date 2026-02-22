import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';
import { useTheme } from '../../theme/useTheme';

export const NetworkBanner: React.FC = () => {
  const theme = useTheme();
  const [isConnected, setIsConnected] = useState(true);
  const translateY = new Animated.Value(-50);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setIsConnected(false);
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: -50,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setIsConnected(true));
      }
    });
    return unsubscribe;
  }, []);

  if (isConnected) return null;
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.error,
        padding: theme.spacing.sm,
        transform: [{ translateY }],
        zIndex: 1000,
      }}
    >
      <Text style={{ color: '#fff', ...theme.typography.bodySmall, textAlign: 'center' }}>
        No internet connection. Please check your network.
      </Text>
    </Animated.View>
  );
};
