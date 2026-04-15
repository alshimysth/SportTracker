import { Stack } from 'expo-router';

export default function TrackingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* gestureEnabled: false — swipe-back disabled during active session (UX spec) */}
      <Stack.Screen name="session" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
