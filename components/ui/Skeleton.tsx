import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../theme/useTheme';

interface Props {
  width?: number | string;
  height?: number | string;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
}

export const Skeleton: React.FC<Props> = ({ width = '100%', height = 20, style, borderRadius = 4 }) => {
  const theme = useTheme();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          backgroundColor: theme.colors.surfaceAlt,
          borderRadius,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};
