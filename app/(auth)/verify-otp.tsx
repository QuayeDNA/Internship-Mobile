import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { OtpInput } from '../../components/forms/OtpInput';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/useTheme';

export default function VerifyOtpScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp, resendOtp, isSubmitting, error } = useAuth();
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSubmit = async () => {
    try {
      await verifyOtp({ email, otp });
      router.replace('/(auth)/login');
    } catch {}
  };

  const handleResend = async () => {
    if (countdown === 0) {
      await resendOtp(email);
      setCountdown(60);
    }
  };

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>
          ← Back
        </Text>
      </TouchableOpacity>
      <Text style={{ ...theme.typography.heading1, textAlign: 'center' }}>Verify Email</Text>
      <Text style={{ ...theme.typography.body, textAlign: 'center', marginVertical: theme.spacing.sm }}>
        We sent a 6-digit code to
      </Text>
      <Text style={{ ...theme.typography.body, textAlign: 'center', fontWeight: '600', color: theme.colors.primary }}>
        {email}
      </Text>
      {error && <Text style={{ color: theme.colors.error }}>{error.message}</Text>}
      <View style={{ marginVertical: theme.spacing.lg }}>
        <OtpInput onComplete={setOtp} />
      </View>
      <Button title="Verify Email" onPress={handleSubmit} isLoading={isSubmitting} />
      <View style={{ height: theme.spacing.sm }} />
      <Text style={{ textAlign: 'center' }}>
        {countdown > 0 ? `Resend in 0:${countdown < 10 ? '0' : ''}${countdown}` : null}
      </Text>
      {countdown === 0 && (
        <TouchableOpacity
          onPress={handleResend}
          accessibilityRole="button"
          accessibilityLabel="Resend code"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ alignSelf: 'center' }}
        >
          <Text style={{ color: theme.colors.primary, textAlign: 'center' }}>
            Resend Code
          </Text>
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
}
