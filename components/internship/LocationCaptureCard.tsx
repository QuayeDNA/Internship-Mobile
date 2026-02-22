import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useLocation } from '../../hooks/useLocation';
import { useTheme } from '../../theme/useTheme';

interface Props {
  onLocationCaptured: (coords: { latitude: number; longitude: number }) => void;
}

export const LocationCaptureCard: React.FC<Props> = ({ onLocationCaptured }) => {
  const theme = useTheme();
  const { location, permissionStatus, isLoading, error, requestPermission, getCurrentLocation } =
    useLocation();

  const handleCapture = async () => {
    import('expo-haptics').then(({ ImpactFeedbackStyle, impactAsync }) => {
      impactAsync(ImpactFeedbackStyle.Light);
    });
    if (permissionStatus !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return;
    }
    try {
      const coords = await getCurrentLocation();
      onLocationCaptured(coords);
    } catch {}
  };

  let content;
  if (isLoading) {
    content = <ActivityIndicator color={theme.colors.primary} />;
  } else if (location) {
    content = (
      <>
        <Text style={theme.typography.body}>Location captured</Text>
        <Text style={theme.typography.caption}>
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </Text>
        <TouchableOpacity
          onPress={handleCapture}
          accessibilityRole="button"
          accessibilityLabel="Recapture location"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={{ color: theme.colors.primary }}>Recapture</Text>
        </TouchableOpacity>
      </>
    );
  } else if (error) {
    content = (
      <TouchableOpacity
        onPress={handleCapture}
        accessibilityRole="button"
        accessibilityLabel="Retry location capture"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={{ color: theme.colors.error }}>{error.message}</Text>
      </TouchableOpacity>
    );
  } else {
    content = (
      <TouchableOpacity
        onPress={handleCapture}
        accessibilityRole="button"
        accessibilityLabel="Capture Location"
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={{ color: theme.colors.primary }}>Capture Location</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={{
        padding: theme.spacing.md,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
        alignItems: 'center',
      }}
    >
      {content}
    </View>
  );
};
