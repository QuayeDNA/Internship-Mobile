import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FormField } from '../../components/forms/FormField';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/useTheme';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { login, isSubmitting, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const handleSubmit = async () => {
    setFieldErrors({});
    if (!email) setFieldErrors((e:any)=>({...e,email:'Required'}));
    if (!password) setFieldErrors((e:any)=>({...e,password:'Required'}));
    if (Object.keys(fieldErrors).length>0) return;
    try {
      await login({ email, password });
      // navigation handled by auth hook effect
    } catch {}
  };

  return (
    <ScreenWrapper scrollable>
      <Text style={{ ...theme.typography.heading1, marginBottom: theme.spacing.md }}>Welcome back</Text>
      {error && <Text style={{ color: theme.colors.error }}>{error.message}</Text>}
      <FormField
        label="University Email"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={fieldErrors.password}
        secureTextEntry
      />
      <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => router.push('/(auth)/forgot-password')}> 
        <Text style={{ color: theme.colors.primary }}>Forgot Password?</Text>
      </TouchableOpacity>
      <Button title="Sign In" onPress={handleSubmit} isLoading={isSubmitting} />
      <View style={{ height: theme.spacing.sm }} />
      <Text style={{ textAlign: 'center' }}>
        Don't have an account?{' '}
        <Text style={{ color: theme.colors.primary }} onPress={() => router.push('/(auth)/register')}>
          Create Account
        </Text>
      </Text>
    </ScreenWrapper>
  );
}
