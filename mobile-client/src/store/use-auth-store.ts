import { create } from 'zustand';
import type { AuthResponse } from '@/types/auth';

interface AuthState {
  token: string | null;
  user: Pick<AuthResponse, 'userId' | 'displayName' | 'email'> | null;
  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  setAuth: (response) =>
    set({
      token: response.accessToken,
      user: {
        userId: response.userId,
        displayName: response.displayName,
        email: response.email,
      },
    }),

  clearAuth: () => set({ token: null, user: null }),
}));
