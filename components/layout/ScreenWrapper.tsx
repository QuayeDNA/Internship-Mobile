import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../theme/useTheme';
import { NetworkBanner } from '../ui/NetworkBanner';

interface Props {
  children: React.ReactNode;
  scrollable?: boolean;
  header?: React.ReactNode;
}

export const ScreenWrapper: React.FC<Props> = ({ children, scrollable = false, header }) => {
  const theme = useTheme();
  const content = (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.md }}>
      {header}
      {children}
    </View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NetworkBanner />
      {scrollable ? <KeyboardAwareScrollView>{content}</KeyboardAwareScrollView> : content}
    </SafeAreaView>
  );
};
