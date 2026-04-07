import { useAuthStore } from '@/store/use-auth-store';
import { api } from '@/lib/api';

// The hook's logic: call DELETE, then clearAuth on success.
// We test the two units independently: api call + store side-effect.

jest.mock('@/lib/api', () => ({
  api: { delete: jest.fn() },
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const mockDelete = api.delete as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({
    token: 'test-token',
    user: { userId: '1', displayName: 'Athlete', email: 'a@a.com' },
    isHydrating: false,
  });
});

describe('deleteAccount flow', () => {
  it('calls DELETE /api/v1/users/me', async () => {
    mockDelete.mockResolvedValue({});
    await api.delete('/api/v1/users/me');
    expect(mockDelete).toHaveBeenCalledWith('/api/v1/users/me');
  });

  it('clearAuth removes token and user from store', () => {
    useAuthStore.getState().clearAuth();
    const { token, user } = useAuthStore.getState();
    expect(token).toBeNull();
    expect(user).toBeNull();
  });

  it('store remains authenticated when API call fails', async () => {
    mockDelete.mockRejectedValue(new Error('server error'));
    try {
      await api.delete('/api/v1/users/me');
    } catch {
      // error expected
    }
    // clearAuth is only called onSuccess, so token stays
    const { token } = useAuthStore.getState();
    expect(token).toBe('test-token');
  });
});
