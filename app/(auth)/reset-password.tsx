import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FormField } from '../../components/forms/FormField';

import { OtpInput } from '../../components/forms/OtpInput';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/useTheme';

export default function ResetPasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { resetPassword, isSubmitting, error } = useAuth();

  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const handleSubmit = async () => {
    setFieldErrors({});
    if (!otp) setFieldErrors((e:any)=>({...e,otp:'Required'}));
    if (!password) setFieldErrors((e:any)=>({...e,password:'Required'}));
    if (password !== confirm) setFieldErrors((e:any)=>({...e,confirm:'Passwords must match'}));
    try {
      await resetPassword({ email, otp, newPassword: password });
      router.replace('/(auth)/login');
    } catch {}
  };

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>← Back</Text>
      </TouchableOpacity>
      <Text style={{ ...theme.typography.heading1, textAlign: 'center' }}>Reset Password</Text>
      <Text style={{ ...theme.typography.body, textAlign: 'center', marginVertical: theme.spacing.sm }}>
        Enter the code sent to {email}
      </Text>
      {error && <Text style={{ color: theme.colors.error }}>{error.message}</Text>}
      <View style={{ marginVertical: theme.spacing.lg }}>
        <OtpInput onComplete={setOtp} />
      </View>
      <FormField
        label="New Password"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        secureTextEntry
      />
      <FormField
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        error={fieldErrors.confirm}
        secureTextEntry
      />
      <Button title="Reset Password" onPress={handleSubmit} isLoading={isSubmitting} />
    </ScreenWrapper>
  );
}
