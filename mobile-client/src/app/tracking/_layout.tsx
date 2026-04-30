import { Stack } from 'expo-router';

export default function TrackingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* gestureEnabled: false — swipe-back disabled during active sessions (UX spec) */}
      <Stack.Screen name="session" options={{ gestureEnabled: false }} />
      <Stack.Screen name="running" options={{ gestureEnabled: false }} />
      <Stack.Screen name="climbing" options={{ gestureEnabled: false }} />
      <Stack.Screen name="weightlifting" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
