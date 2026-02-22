import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { FormField } from '../../components/forms/FormField';
import { LocationCaptureCard } from '../../components/internship/LocationCaptureCard';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { AlreadyRegisteredState } from '../../components/ui/AlreadyRegisteredState';
import { Button } from '../../components/ui/Button';
import { DatePickerField } from '../../components/ui/DatePickerField';
import { NoPeriodState } from '../../components/ui/NoPeriodState';
import { PeriodBanner } from '../../components/ui/PeriodBanner';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SuccessSheet } from '../../components/ui/SuccessSheet';
import { useToast } from '../../components/ui/Toast';
import { WarningBanner } from '../../components/ui/WarningBanner';
import { useInternship } from '../../hooks/useInternship';
import { useTheme } from '../../theme/useTheme';

export default function RegisterInternshipScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { status, activePeriod, submitRegistration, isSubmitting, fetchActivePeriod } = useInternship();
  const toast = useToast();

  const [form, setForm] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        router.replace({ pathname: '/(app)' });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  if (status !== 'NOT_REGISTERED') {
    return (
      <ScreenWrapper>
        <AlreadyRegisteredState onRegisterPress={() => router.push('/(app)/assignment')} />
      </ScreenWrapper>
    );
  }

  if (!activePeriod) {
    return (
      <ScreenWrapper>
        <NoPeriodState onRefresh={fetchActivePeriod} />
      </ScreenWrapper>
    );
  }

  // we have activePeriod at this point

  const handleSubmit = async () => {
    const required = [
      'companyName',
      'companyEmail',
      'companyPhone',
      'companyAddress',
      'companyCity',
      'companySupervisor',
      'supervisorPhone',
      'commencementDate',
    ];
    const errs: any = {};
    required.forEach((k) => {
      if (!form[k]) errs[k] = 'Required';
    });
    if (!coords) {
      toast.showToast('Location required', 'error');
      return;
    }
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    try {
      await submitRegistration({ ...form, longitude: coords.longitude, latitude: coords.latitude, periodId: activePeriod.id });
      setShowSuccess(true);
    } catch (err) {
      toast.showToast((err as any).message || 'Failed to register', 'error');
    }
  };

  return (
    <ScreenWrapper scrollable>
      <Text style={theme.typography.heading1}>Internship Registration</Text>
      {activePeriod && (
        <View style={{ marginVertical: theme.spacing.md }}>
          <PeriodBanner period={activePeriod} />
        </View>
      )}
      <SectionHeader title="Company Information" />
      <FormField
        label="Company Name"
        value={form.companyName}
        onChangeText={(v) => setForm({ ...form, companyName: v })}
        error={errors.companyName}
        required
      />
      <FormField
        label="Company Email"
        value={form.companyEmail}
        onChangeText={(v) => setForm({ ...form, companyEmail: v })}
        error={errors.companyEmail}
        keyboardType="email-address"
        required
      />
      <FormField
        label="Company Phone"
        value={form.companyPhone}
        onChangeText={(v) => setForm({ ...form, companyPhone: v })}
        error={errors.companyPhone}
        keyboardType="phone-pad"
        required
      />
      <FormField
        label="Company Address"
        value={form.companyAddress}
        onChangeText={(v) => setForm({ ...form, companyAddress: v })}
        error={errors.companyAddress}
        required
      />
      <FormField
        label="Company City"
        value={form.companyCity}
        onChangeText={(v) => setForm({ ...form, companyCity: v })}
        error={errors.companyCity}
        required
      />
      <SectionHeader title="Supervisor Information" />
      <FormField
        label="Supervisor Name"
        value={form.companySupervisor}
        onChangeText={(v) => setForm({ ...form, companySupervisor: v })}
        error={errors.companySupervisor}
        required
      />
      <FormField
        label="Supervisor Phone"
        value={form.supervisorPhone}
        onChangeText={(v) => setForm({ ...form, supervisorPhone: v })}
        error={errors.supervisorPhone}
        keyboardType="phone-pad"
        required
      />
      <SectionHeader title="Internship Dates" />
      <DatePickerField
        label="Commencement Date"
        value={form.commencementDate}
        onChange={(v: string) => setForm({ ...form, commencementDate: v })}
        error={errors.commencementDate}
      />
      <SectionHeader title="Your Location" />
      <LocationCaptureCard onLocationCaptured={setCoords} />
      <View style={{ height: theme.spacing.lg }} />
      <WarningBanner message="You must be physically present at your workplace during registration." />
      <View style={{ height: theme.spacing.lg }} />
      <Button title="Submit Registration" onPress={handleSubmit} isLoading={isSubmitting} />
      <SuccessSheet
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
        onGoHome={() => {
          setShowSuccess(false);
          router.replace({ pathname: '/(app)' });
        }}
      />
    </ScreenWrapper>
  );
}

