import React from 'react';
import { Linking, Text, View } from 'react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../theme/useTheme';

export default function HelpScreen() {
  const theme = useTheme();
  return (
    <ScreenWrapper>
      <Text style={theme.typography.heading1}>Help & Contact</Text>
      <Text style={theme.typography.body}>If you need assistance, please reach out:</Text>
      <View style={{ marginTop: theme.spacing.lg }}>
        <Button title="Email Support" onPress={() => Linking.openURL('mailto:support@ttu.edu.gh')} />
        <View style={{ height: theme.spacing.sm }} />
        <Button title="Call Support" onPress={() => Linking.openURL('tel:+233123456789')} />
      </View>
    </ScreenWrapper>
  );
}
