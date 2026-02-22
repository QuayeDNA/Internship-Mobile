import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { FormField } from '../../components/forms/FormField';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { PasswordStrength } from '../../components/ui/PasswordStrength';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../theme/useTheme';

export default function RegisterScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { register, isSubmitting, error } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [strength, setStrength] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<any>({});

  const computeStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setStrength(score);
  };

  const handleSubmit = async () => {
    setFieldErrors({});
    // basic client validation
    if (!firstName) setFieldErrors((e:any)=>({...e, firstName:'Required'}));
    if (!lastName) setFieldErrors((e:any)=>({...e, lastName:'Required'}));
    if (!email) setFieldErrors((e:any)=>({...e, email:'Required'}));
    if (!password) setFieldErrors((e:any)=>({...e, password:'Required'}));
    if (password !== confirm) setFieldErrors((e:any)=>({...e, confirm:'Passwords must match'}));
    if (Object.keys(fieldErrors).length>0) return;
    try {
      await register({ firstName, lastName, email, password });
      router.replace({ pathname: '/(auth)/verify-otp', params: { email } });
    } catch {
      // error captured by hook
    }
  };

  return (
    <ScreenWrapper scrollable>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>← Back</Text>
      </TouchableOpacity>
      <Text style={{ ...theme.typography.heading1, marginBottom: theme.spacing.sm }}>Create Account</Text>
      {error && <Text style={{ color: theme.colors.error }}>{error.message}</Text>}
      <FormField
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        error={fieldErrors.firstName}
        required
      />
      <FormField
        label="Last Name"
        value={lastName}
        onChangeText={setLastName}
        error={fieldErrors.lastName}
        required
      />
      <FormField
        label="University Email"
        value={email}
        onChangeText={setEmail}
        error={fieldErrors.email}
        required
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <FormField
        label="Password"
        value={password}
        onChangeText={(v) => {
          setPassword(v);
          computeStrength(v);
        }}
        error={fieldErrors.password}
        required
        secureTextEntry
      />
      <PasswordStrength score={strength} />
      <FormField
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        error={fieldErrors.confirm}
        required
        secureTextEntry
      />
      <Button title="Create Account" onPress={handleSubmit} isLoading={isSubmitting} />
      <View style={{ height: theme.spacing.sm }} />
      <Text style={{ textAlign: 'center' }}>
        Already have an account?{' '}
        <Text style={{ color: theme.colors.primary }} onPress={() => router.push('/(auth)/login')}>
          Sign In
        </Text>
      </Text>
    </ScreenWrapper>
  );
}
