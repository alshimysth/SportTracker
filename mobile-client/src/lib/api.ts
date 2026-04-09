import axios from 'axios';
import Constants from 'expo-constants';
import { useAuthStore } from '@/store/use-auth-store';

/**
 * Resolve the backend base URL with the following priority:
 *
 * 1. EXPO_PUBLIC_API_URL env var  →  use as-is (prod / staging / CI)
 * 2. DEV mode                     →  extract the host IP from the Expo Metro
 *                                     dev server URI so the physical device
 *                                     always reaches the right machine without
 *                                     ever hard-coding an IP address.
 * 3. Fallback                     →  localhost (web or simulator only)
 */
function resolveBaseUrl(): string {
  // 1. Explicit override (e.g. production API)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Derive host from Metro dev server (works on any network automatically)
  if (__DEV__) {
    const debuggerHost =
      Constants.expoConfig?.hostUri ??
      (Constants as any).manifest?.debuggerHost ??  // SDK < 46 fallback
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost; // Expo Go SDK 47+

    if (debuggerHost) {
      // debuggerHost is like "192.168.x.x:8082" — keep only the host part
      const host = debuggerHost.split(':')[0];
      return `http://${host}:8080`;
    }
  }

  // 3. Simulator / web fallback
  return 'http://localhost:8080';
}

const BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000, // 10 s — avoids hanging forever on network errors
});

// Attach JWT to every request when available
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
