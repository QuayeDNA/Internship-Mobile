import { useRouter } from 'expo-router';
import { ClipboardList } from 'lucide-react-native';
import React from 'react';
import { SupervisorCard } from '../../components/internship/SupervisorCard';
import { ZoneCard } from '../../components/internship/ZoneCard';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { PendingAssignmentState } from '../../components/ui/PendingAssignmentState';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Skeleton } from '../../components/ui/Skeleton';
import { useInternship } from '../../hooks/useInternship';
import { useTheme } from '../../theme/useTheme';

export default function AssignmentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { status, assignment, refreshAssignment, isLoading } = useInternship();

  if (isLoading) {
    return (
      <ScreenWrapper>
        <Skeleton width="100%" height={200} />
      </ScreenWrapper>
    );
  }

  if (status === 'NOT_REGISTERED') {
    return (
      <ScreenWrapper>
        <EmptyState
          icon={() => <ClipboardList size={72} color={theme.colors.textSecondary} />}
          title="No Registration Found"
          subtitle="Register for the current internship period first."
        >
          <Button title="Register Now" onPress={() => router.push('/(app)/register-internship')} />
        </EmptyState>
      </ScreenWrapper>
    );
  }

  if (status === 'REGISTERED_PENDING_ASSIGNMENT') {
    return (
      <ScreenWrapper>
        <PendingAssignmentState onRefresh={refreshAssignment} />
      </ScreenWrapper>
    );
  }

  // assigned
  return (
    <ScreenWrapper scrollable>
      <SectionHeader title="Your Supervisor" />
      {assignment?.supervisor && (
        <SupervisorCard
          name={assignment.supervisor.name}
          staffId={assignment.supervisor.staffId}
          email={assignment.supervisor.email}
          phone={assignment.supervisor.phone}
          onEmailPress={() => {
            // open mail
          }}
          onPhonePress={() => {
            // dial
          }}
        />
      )}
      <SectionHeader title="Zone" />
      {assignment?.zone && (
        <ZoneCard
          name={assignment.zone.name}
          region={assignment.zone.region}
          description={assignment.zone.description || undefined}
        />
      )}
    </ScreenWrapper>
  );
}
