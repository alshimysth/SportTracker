import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/store/use-auth-store';
import type { AuthResponse } from '@/types/auth';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

const mockAuthResponse: AuthResponse = {
  accessToken: 'test-jwt-token',
  tokenType: 'Bearer',
  userId: 'user-123',
  displayName: 'Test Athlete',
  email: 'athlete@example.com',
};

beforeEach(() => {
  jest.clearAllMocks();
  // Reset store to initial state between tests
  useAuthStore.setState({ token: null, user: null, isHydrating: true });
});

describe('useAuthStore', () => {
  describe('setAuth', () => {
    it('stores the token and user in state', () => {
      useAuthStore.getState().setAuth(mockAuthResponse);

      const { token, user } = useAuthStore.getState();
      expect(token).toBe('test-jwt-token');
      expect(user?.email).toBe('athlete@example.com');
      expect(user?.displayName).toBe('Test Athlete');
      expect(user?.userId).toBe('user-123');
    });

    it('persists the token to SecureStore', () => {
      useAuthStore.getState().setAuth(mockAuthResponse);

      expect(mockSecureStore.setItemAsync).toHaveBeenCalledWith(
        'auth_token',
        'test-jwt-token',
      );
    });
  });

  describe('clearAuth', () => {
    it('clears token and user from state', () => {
      useAuthStore.setState({ token: 'old-token', user: { userId: '1', displayName: 'A', email: 'a@a.com' } });

      useAuthStore.getState().clearAuth();

      const { token, user } = useAuthStore.getState();
      expect(token).toBeNull();
      expect(user).toBeNull();
    });

    it('removes the token from SecureStore', () => {
      useAuthStore.getState().clearAuth();

      expect(mockSecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('hydrate', () => {
    it('restores token from SecureStore and sets isHydrating to false', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue('persisted-token');

      await useAuthStore.getState().hydrate();

      const { token, isHydrating } = useAuthStore.getState();
      expect(token).toBe('persisted-token');
      expect(isHydrating).toBe(false);
    });

    it('sets token to null when SecureStore has no value', async () => {
      mockSecureStore.getItemAsync.mockResolvedValue(null);

      await useAuthStore.getState().hydrate();

      const { token, isHydrating } = useAuthStore.getState();
      expect(token).toBeNull();
      expect(isHydrating).toBe(false);
    });
  });
});
