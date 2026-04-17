import '../../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/use-auth-store';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { token, isHydrating, hydrate } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  // Restore JWT from SecureStore once on startup
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Hide splash when fonts + hydration are both ready
  useEffect(() => {
    if ((fontsLoaded || fontError) && !isHydrating) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isHydrating]);

  // Auth guard — redirect only after both the navigator AND hydration are ready
  useEffect(() => {
    if (isHydrating) return;
    if (!fontsLoaded && !fontError) return; // Stack not rendered yet

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login' as any);
    } else if (token && inAuthGroup) {
      router.replace('/(tabs)/' as any);
    }
  }, [token, isHydrating, fontsLoaded, fontError, segments, router]);

  // Always render the Stack so the navigator exists when the auth guard redirects.
  // The native splash screen stays visible until SplashScreen.hideAsync() is called.
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          {/* Full-screen tracking flow — tab bar hidden, swipe-back disabled (UX-DR7) */}
          <Stack.Screen
            name="tracking"
            options={{ headerShown: false, presentation: 'fullScreenModal' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
