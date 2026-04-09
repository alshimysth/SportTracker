import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { AuthResponse } from '@/types/auth';

const TOKEN_KEY = 'auth_token';

interface AuthState {
  token: string | null;
  user: Pick<AuthResponse, 'userId' | 'displayName' | 'email'> | null;
  /** true while we are reading the token from SecureStore on startup */
  isHydrating: boolean;
  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
  /** Call once on app start to restore a persisted session */
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrating: true,

  setAuth: (response) => {
    SecureStore.setItemAsync(TOKEN_KEY, response.accessToken);
    set({
      token: response.accessToken,
      user: {
        userId: response.userId,
        displayName: response.displayName,
        email: response.email,
      },
    });
  },

  clearAuth: () => {
    SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, user: null });
  },

  hydrate: async () => {
    try {
      const stored = await SecureStore.getItemAsync(TOKEN_KEY);
      set({ token: stored ?? null, isHydrating: false });
    } catch {
      // SecureStore failed (emulator / permissions) — treat as logged out
      set({ token: null, isHydrating: false });
    }
  },
}));
