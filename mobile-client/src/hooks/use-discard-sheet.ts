/**
 * useDiscardSheet — Story 2.7 (UX-DR12)
 *
 * Shows a destructive confirmation bottom-sheet before discarding a session.
 * - iOS  : native ActionSheet (slides up from the bottom)
 * - Android : Alert dialog (no native bottom-sheet equivalent)
 *
 * Usage:
 *   const showDiscard = useDiscardSheet();
 *   showDiscard({ title: '...', message: '...', confirmLabel: '...', onConfirm: fn });
 */
import { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

interface DiscardOptions {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

export function useDiscardSheet() {
  const { showActionSheetWithOptions } = useActionSheet();

  return useCallback(
    ({ title, message, confirmLabel, onConfirm }: DiscardOptions) => {
      if (Platform.OS === 'ios') {
        showActionSheetWithOptions(
          {
            title,
            message,
            options: [confirmLabel, 'Continuer'],
            destructiveButtonIndex: 0,
            cancelButtonIndex: 1,
          },
          (selectedIndex) => {
            if (selectedIndex === 0) onConfirm();
          },
        );
      } else {
        Alert.alert(title, message, [
          { text: 'Continuer', style: 'cancel' },
          { text: confirmLabel, style: 'destructive', onPress: onConfirm },
        ]);
      }
    },
    [showActionSheetWithOptions],
  );
}
