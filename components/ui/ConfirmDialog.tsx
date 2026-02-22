import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  confirmVariant?: 'primary' | 'accent' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<Props> = ({
  visible,
  title,
  body,
  confirmLabel,
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) => {
  const theme = useTheme();
  const sheetRef = React.useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    if (visible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [visible]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={[250]}
      backgroundStyle={{ borderRadius: theme.radius.xl }}
      enablePanDownToClose
      onDismiss={onCancel}
    >
      <View style={{ padding: theme.spacing.lg }}>
        <Text style={{ ...theme.typography.heading1, textAlign: 'center' }}>{title}</Text>
        <Text style={{ ...theme.typography.body, textAlign: 'center', marginTop: theme.spacing.md }}>{body}</Text>
        <View style={{ marginTop: theme.spacing.lg }}>
          <TouchableOpacity
            onPress={onConfirm}
            style={{
              backgroundColor:
                confirmVariant === 'accent'
                  ? theme.colors.accent
                  : confirmVariant === 'danger'
                  ? theme.colors.error
                  : theme.colors.primary,
              padding: theme.spacing.md,
              borderRadius: theme.radius.md,
            }}
          >
            <Text style={{ ...theme.typography.button, color: '#fff', textAlign: 'center' }}>{confirmLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} style={{ marginTop: theme.spacing.sm }}>
            <Text style={{ ...theme.typography.button, textAlign: 'center', color: theme.colors.primary }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
};
