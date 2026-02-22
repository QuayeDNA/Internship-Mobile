import { useRouter } from 'expo-router';
import { ClipboardList, LayoutDashboard, UserCheck, UserCircle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { PeriodBanner } from '../../components/ui/PeriodBanner';
import { QuickActionCard } from '../../components/ui/QuickActionCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { useInternship } from '../../hooks/useInternship';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../theme/useTheme';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { session } = useAuth();
  const { profile } = useProfile();
  const { status, activePeriod } = useInternship();

  const greeting = profile
    ? `Good morning, ${profile.firstName} 👋`
    : 'Good morning';

  return (
    <ScreenWrapper scrollable>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          {profile ? (
            <Text style={theme.typography.displayMedium}>{greeting}</Text>
          ) : (
            <Skeleton width={200} height={32} style={{ marginBottom: theme.spacing.xs }} />
          )}
          {profile ? (
            <Text style={theme.typography.caption}>{profile.indexNumber}</Text>
          ) : (
            <Skeleton width={120} height={16} />
          )}
        </View>
      </View>
      <View style={{ marginTop: theme.spacing.lg }}>
        {status ? <StatusBadge status={status} /> : <Skeleton width={120} height={24} />}
        <Text style={{ ...theme.typography.heading2, marginTop: theme.spacing.md }}>Your internship status</Text>
      </View>
      {/* Quick actions grid */}
      <Text style={{ ...theme.typography.heading2, marginTop: theme.spacing.xl }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <QuickActionCard
          icon={<ClipboardList color={theme.colors.primary} />}
          label="Register"
          onPress={() => router.push('/(app)/register-internship')}
        />
        <QuickActionCard
          icon={<UserCheck color={theme.colors.primary} />}
          label="Assignment"
          onPress={() => router.push('/(app)/assignment')}
        />
        <QuickActionCard
          icon={<UserCircle color={theme.colors.primary} />}
          label="Profile"
          onPress={() => router.push('/(app)/profile')}
        />
        <QuickActionCard
          icon={<LayoutDashboard color={theme.colors.primary} />}
          label="Help"
          onPress={() => router.push('/(app)/help')}
        />
      </View>
      {/* Period banner if exists */}
      {activePeriod ? (
        <View style={{ marginTop: theme.spacing.xl }}>
          <PeriodBanner period={activePeriod} />
        </View>
      ) : (
        <View style={{ marginTop: theme.spacing.xl }}>
          <Skeleton width="100%" height={40} />
        </View>
      )}
    </ScreenWrapper>
  );
}
