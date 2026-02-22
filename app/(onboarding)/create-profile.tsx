import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { FormField } from '../../components/forms/FormField';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { InfoRow } from '../../components/profile/InfoRow';
import { Button } from '../../components/ui/Button';
import { DatePickerField } from '../../components/ui/DatePickerField';
import { Dropdown } from '../../components/ui/Dropdown';
import { InfoCard } from '../../components/ui/InfoCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../theme/useTheme';

export default function CreateProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { createProfile, isSubmitting } = useProfile();

  const [step, setStep] = useState(1);
  const offset = useSharedValue(0);
  const width = Dimensions.get('window').width;
  const [form, setForm] = useState<any>({});
  // filter departments
  const allDepartments: Record<string, string[]> = {
    Engineering: ['Computer Science','Electrical','Mechanical'],
    Business: ['Marketing','Accounting'],
    Science: ['Biology','Chemistry'],
  };
  React.useEffect(() => {
    if (form.faculty) {
      setForm((f:any) => ({ ...f, department: '' }));
    }
  }, [form.faculty]);
  const [errors, setErrors] = useState<any>({});

  const handleNext = () => {
    import('expo-haptics').then(({ ImpactFeedbackStyle, impactAsync }) => {
      impactAsync(ImpactFeedbackStyle.Medium);
    });
    // basic validation per step
    const newErrors: any = {};
    if (step === 1) {
      if (!form.gender) newErrors.gender = 'Required';
      if (!form.dateOfBirth) newErrors.dateOfBirth = 'Required';
      if (!form.phoneNumber) newErrors.phoneNumber = 'Required';
    } else if (step === 2) {
      if (!form.indexNumber) newErrors.indexNumber = 'Required';
      if (!form.faculty) newErrors.faculty = 'Required';
      if (form.faculty && !form.department) newErrors.department = 'Required';
      if (!form.programme) newErrors.programme = 'Required';
      if (!form.level) newErrors.level = 'Required';
      if (!form.session) newErrors.session = 'Required';
      if (!form.certificateType) newErrors.certificateType = 'Required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };
  const handleBack = () => {
    import('expo-haptics').then(({ ImpactFeedbackStyle, impactAsync }) => {
      impactAsync(ImpactFeedbackStyle.Light);
    });
    setStep((s) => s - 1);
  };

  useEffect(() => {
    offset.value = withTiming(-(step - 1) * width, { duration: 300 });
  }, [step, offset, width]);

  const handleSubmit = async () => {
    try {
      await createProfile(form);
      router.replace({ pathname: '/(app)' });
    } catch {}
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <SectionHeader title="Personal Information" />
            <Text style={{ marginBottom: theme.spacing.sm }}>Gender</Text>
            <SegmentedControl
              options={["MALE","FEMALE","OTHER"]}
              value={form.gender || 'MALE'}
              onChange={(v) => setForm({ ...form, gender: v })}
            />
            <DatePickerField
              label="Date of Birth"
              value={form.dateOfBirth}
              onChange={(v) => setForm({ ...form, dateOfBirth: v })}
              error={errors.dateOfBirth}
            />
            <FormField
              label="Phone Number"
              value={form.phoneNumber}
              onChangeText={(v) => setForm({ ...form, phoneNumber: v })}
              keyboardType="phone-pad"
              error={errors.phoneNumber}
            />
          </>
        );
      case 2:
        return (
          <>
            <SectionHeader title="Academic Information" />
            <FormField
              label="Index Number"
              value={form.indexNumber}
              onChangeText={(v) => setForm({ ...form, indexNumber: v })}
              error={errors.indexNumber}
            />
            <Dropdown
              label="Faculty"
              options={["Engineering","Business","Science"]}
              value={form.faculty}
              error={errors.faculty}
              onChange={(v) => setForm({ ...form, faculty: v })}
            />
            <Dropdown
              label="Department"
              options={
                form.faculty ? (allDepartments as any)[form.faculty] || [] : []
              }
              value={form.department}
              error={errors.department}
              onChange={(v) => setForm({ ...form, department: v })}
            />
            <FormField
              label="Programme"
              value={form.programme}
              onChangeText={(v) => setForm({ ...form, programme: v })}
              error={errors.programme}
            />
            <SegmentedControl
              options={["100","200","300","400"]}
              value={form.level || '100'}
              onChange={(v) => setForm({ ...form, level: v })}
            />
            <SegmentedControl
              options={["Regular","Weekend","Evening"]}
              value={form.session || 'Regular'}
              onChange={(v) => setForm({ ...form, session: v })}
            />
            <Dropdown
              label="Certificate Type"
              options={["BACHELOR of TECHNOLOGY","HND","DIPLOMA","CERTIFICATE"]}
              value={form.certificateType}
              onChange={(v) => setForm({ ...form, certificateType: v })}
              error={errors.certificateType}
            />
          </>
        );
      case 3:
        return (
          <>
            <Text style={{ ...theme.typography.heading1 }}>Review your information</Text>
            <Text style={{ ...theme.typography.body, marginVertical: theme.spacing.sm }}>
              This cannot be changed after submission.
            </Text>
            <InfoCard title="Personal Details">
              <InfoRow label="Gender" value={form.gender || ''} />
              <InfoRow label="DOB" value={form.dateOfBirth || ''} />
              <InfoRow label="Phone" value={form.phoneNumber || ''} last />
            </InfoCard>
            <InfoCard title="Academic Details">
              <InfoRow label="Index" value={form.indexNumber || ''} />
              <InfoRow label="Faculty" value={form.faculty || ''} />
              <InfoRow label="Department" value={form.department || ''} />
              <InfoRow label="Programme" value={form.programme || ''} />
              <InfoRow label="Level" value={form.level || ''} />
              <InfoRow label="Session" value={form.session || ''} />
              <InfoRow label="Certificate" value={form.certificateType || ''} last />
            </InfoCard>
          </>
        );
      default:
        return null;
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
    width,
  }));

  return (
    <ScreenWrapper scrollable>
      {step > 1 && (
        <TouchableOpacity onPress={handleBack}>
          <Text style={{ color: theme.colors.primary }}>← Back</Text>
        </TouchableOpacity>
      )}
      <Text style={{ ...theme.typography.heading1, marginVertical: theme.spacing.md }}>
        Complete Your Profile
      </Text>
      <Text style={{ ...theme.typography.bodySmall, color: theme.colors.textSecondary }}>
        Step {step} of 3
      </Text>
      <View style={{ height: theme.spacing.sm, backgroundColor: theme.colors.border, width: `${(step / 3) * 100}%` }} />
      <Animated.View style={animatedStyle}>{renderStep()}</Animated.View>
      <View style={{ flexDirection: 'row', marginTop: theme.spacing.lg }}>
        {step < 3 && (
          <Button title="Next" onPress={handleNext} />
        )}
        {step === 3 && (
          <Button title="Submit Profile" onPress={handleSubmit} isLoading={isSubmitting} />
        )}
      </View>
    </ScreenWrapper>
  );
}
