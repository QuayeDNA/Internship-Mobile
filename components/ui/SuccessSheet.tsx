import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { Button } from './Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  onGoHome: () => void;
}

export const SuccessSheet: React.FC<Props> = ({ visible, onClose, onGoHome }) => {
  const theme = useTheme();
  const sheetRef = React.useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={[300]}
      backgroundStyle={{ borderRadius: theme.radius.xl }}
      onDismiss={onClose}
    >
      <View style={{ padding: theme.spacing.lg, alignItems: 'center' }}>
        <Text style={{ fontSize: 72, color: theme.colors.success }}>✅</Text>
        <Text style={{ ...theme.typography.displayMedium, textAlign: 'center', marginTop: theme.spacing.md }}>
          Registration Successful!
        </Text>
        <Text
          style={{
            ...theme.typography.body,
            textAlign: 'center',
            marginTop: theme.spacing.sm,
            color: theme.colors.textSecondary,
          }}
        >
          Your internship has been registered. A supervisor will be assigned shortly.
        </Text>
        <View style={{ height: theme.spacing.lg }} />
        <Button title="Go to Dashboard" onPress={onGoHome} />
      </View>
    </BottomSheetModal>
  );
};
