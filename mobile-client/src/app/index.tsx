import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to the auth flow; _layout.tsx handles the auth guard
  return <Redirect href={'/(auth)/login' as any} />;
}
