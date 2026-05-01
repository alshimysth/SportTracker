import { renderHook, act } from '@testing-library/react-native';
import { Alert, Platform } from 'react-native';
import { useDiscardSheet } from '@/hooks/use-discard-sheet';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockShowActionSheet = jest.fn();

jest.mock('@expo/react-native-action-sheet', () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheet }),
}));

jest.spyOn(Alert, 'alert');

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useDiscardSheet', () => {
  const OPTIONS = {
    title: 'Abandonner la session ?',
    message: 'Ta progression sera perdue.',
    confirmLabel: 'Abandonner',
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('iOS', () => {
    beforeAll(() => {
      (Platform as any).OS = 'ios';
    });

    it('calls showActionSheetWithOptions with destructive index 0 and cancel index 1', () => {
      const { result } = renderHook(() => useDiscardSheet());
      act(() => result.current(OPTIONS));

      expect(mockShowActionSheet).toHaveBeenCalledWith(
        expect.objectContaining({
          options: ['Abandonner', 'Continuer'],
          destructiveButtonIndex: 0,
          cancelButtonIndex: 1,
        }),
        expect.any(Function),
      );
    });

    it('fires onConfirm when destructive index (0) is selected', () => {
      const { result } = renderHook(() => useDiscardSheet());
      act(() => result.current(OPTIONS));

      const callback = mockShowActionSheet.mock.calls[0][1] as (i: number) => void;
      act(() => callback(0));

      expect(OPTIONS.onConfirm).toHaveBeenCalledTimes(1);
    });

    it('does NOT fire onConfirm when cancel index (1) is selected', () => {
      const { result } = renderHook(() => useDiscardSheet());
      act(() => result.current(OPTIONS));

      const callback = mockShowActionSheet.mock.calls[0][1] as (i: number) => void;
      act(() => callback(1));

      expect(OPTIONS.onConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Android', () => {
    beforeAll(() => {
      (Platform as any).OS = 'android';
    });

    it('falls back to Alert.alert with a destructive button', () => {
      const { result } = renderHook(() => useDiscardSheet());
      act(() => result.current(OPTIONS));

      expect(Alert.alert).toHaveBeenCalledWith(
        OPTIONS.title,
        OPTIONS.message,
        expect.arrayContaining([
          expect.objectContaining({ style: 'destructive', text: 'Abandonner' }),
          expect.objectContaining({ style: 'cancel' }),
        ]),
      );
    });
  });
});
