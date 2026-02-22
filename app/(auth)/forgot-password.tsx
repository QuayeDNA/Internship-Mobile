import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { FormField } from '../../components/forms/FormField';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/useTheme';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { forgotPassword, isSubmitting, error } = useAuth();
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const handleSubmit = async () => {
    setFieldErrors({});
    if (!email) setFieldErrors((e:any)=>({...e,email:'Required'}));
    try {
      await forgotPassword(email);
      router.replace({ pathname: '/(auth)/reset-password', params: { email } });
    } catch {}
  };

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>← Back</Text>
      </TouchableOpacity>
      <Text style={{ ...theme.typography.heading1, marginBottom: theme.spacing.sm }}>Reset your password</Text>
      <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
        {`Enter your university email and we'll send you a reset code.`}
      </Text>
      {error && <Text style={{ color: theme.colors.error }}>{error.message}</Text>}
      <FormField
        label="University Email"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button title="Send Reset Code" onPress={handleSubmit} isLoading={isSubmitting} />
      <TouchableOpacity style={{ marginTop: theme.spacing.md }} onPress={() => router.push('/(auth)/login')}>
        <Text style={{ textAlign: 'center', color: theme.colors.primary }}>Back to Sign In</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
