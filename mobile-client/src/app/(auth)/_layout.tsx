import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="sport-selection" />
      <Stack.Screen name="level-selection" />
      <Stack.Screen name="onboarding-complete" />
    </Stack>
  );
}
