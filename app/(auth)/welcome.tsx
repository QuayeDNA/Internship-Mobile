import { useRouter } from 'expo-router';
import { GraduationCap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme/useTheme';

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const sheetOffset = useSharedValue(60);
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetOffset.value }],
  }));

  const illustrationOpacity = useSharedValue(0);
  const illustrationStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
  }));

  useEffect(() => {
    // animate illustration fade in
    illustrationOpacity.value = withTiming(1, { duration: 400 });
    // slide up sheet
    sheetOffset.value = withTiming(0, { duration: 400 });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View style={illustrationStyle}>
          <GraduationCap size={128} color="#fff" />
        </Animated.View>
      </View>
      <Animated.View
        style={[
          {
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: theme.radius.xl,
            borderTopRightRadius: theme.radius.xl,
            padding: theme.spacing.lg,
          },
          sheetStyle,
        ]}
      >
        <Text style={{ ...theme.typography.heading1, textAlign: 'center' }}>Welcome to ILO Portal</Text>
        <Text
          style={{
            ...theme.typography.body,
            textAlign: 'center',
            color: theme.colors.textSecondary,
            marginVertical: theme.spacing.md,
          }}
        >
          The official internship management platform for TTU students.
        </Text>
        <Button title="Get Started" onPress={() => router.push('/(auth)/register')} />
        <View style={{ height: theme.spacing.sm }} />
        <Button
          title="Sign In"
          variant="outline"
          onPress={() => router.push('/(auth)/login')}
        />
        <Text
          style={{
            ...theme.typography.caption,
            textAlign: 'center',
            marginTop: theme.spacing.lg,
            color: theme.colors.textSecondary,
          }}
        >
          By continuing, you agree to our Terms of Service
        </Text>
      </Animated.View>
    </View>
  );
}
