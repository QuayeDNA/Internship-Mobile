import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { InfoRow } from '../../components/profile/InfoRow';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../hooks/useAuth';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../theme/useTheme';

export default function ProfileScreen() {
  const theme = useTheme();
  const { profile, updateProfileImage, isLoading } = useProfile();
  const { logout } = useAuth();
  const [confirmVisible, setConfirmVisible] = React.useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setIsUploading(true);
      try {
        await updateProfileImage(result.assets[0].uri);
      } catch {
        Alert.alert('Error', 'Unable to upload image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <ScreenWrapper scrollable>
      <View style={{ alignItems: 'center', marginTop: theme.spacing.lg }}>
        {isLoading ? (
          <Skeleton width={96} height={96} borderRadius={48} />
        ) : (
          <TouchableOpacity
            onPress={pickImage}
            disabled={isUploading}
            accessibilityRole="button"
            accessibilityLabel="Edit profile image"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Avatar
              uri={profile?.profileImageUrl}
              name={`${profile?.firstName} ${profile?.lastName}`}
              size={96}
            />
          </TouchableOpacity>
        )}
        {isUploading && <Text style={{ ...theme.typography.caption }}>Uploading...</Text>}
        {isLoading ? (
          <Skeleton width={140} height={24} style={{ marginTop: theme.spacing.md }} />
        ) : (
          <Text style={{ ...theme.typography.heading2, marginTop: theme.spacing.md }}>{`${profile?.firstName} ${profile?.lastName}`}</Text>
        )}
        {isLoading ? (
          <Skeleton width={120} height={16} />
        ) : (
          <Text style={{ ...theme.typography.caption }}>{profile?.email}</Text>
        )}
        {isLoading ? (
          <Skeleton width={100} height={16} />
        ) : (
          <Text style={{ ...theme.typography.caption }}>{profile?.indexNumber}</Text>
        )}
      </View>
      <View style={{ marginTop: theme.spacing.lg }}>
        <InfoRow label="Gender" value={profile?.gender || ''} />
        <InfoRow label="Date of Birth" value={profile?.dateOfBirth || ''} />
        <InfoRow label="Phone" value={profile?.phoneNumber || ''} />
        <InfoRow label="Faculty" value={profile?.faculty || ''} />
        <InfoRow label="Department" value={profile?.department || ''} />
        <InfoRow label="Programme" value={profile?.programme || ''} />
        <InfoRow label="Level" value={profile?.level || ''} />
        <InfoRow label="Session" value={profile?.session || ''} />
        <InfoRow label="Certificate" value={profile?.certificateType || ''} last />
      </View>
      <View style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.infoLight,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.info,
        padding: theme.spacing.md,
        alignItems: 'center',
        marginTop: theme.spacing.lg,
      }}>
        <Text style={{ fontSize: 20, marginRight: theme.spacing.sm, color: theme.colors.info }}>ℹ️</Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.info, flex: 1 }}>
          To update your profile data, contact the ILO office
        </Text>
      </View>
      <Button title="Sign Out" variant="danger" onPress={() => setConfirmVisible(true)} />
      <ConfirmDialog
        visible={confirmVisible}
        title="Sign Out?"
        body="Are you sure you want to sign out?"
        confirmLabel="Yes, Sign Out"
        confirmVariant="danger"
        onConfirm={() => {
          logout();
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </ScreenWrapper>
  );
}
