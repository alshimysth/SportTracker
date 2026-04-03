import { View, Text } from 'react-native';
import { useAuthStore } from '@/store/use-auth-store';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);

  return (
    <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
      <Text className="mb-2 font-sans text-2xl font-bold text-header dark:text-white">
        Welcome, {user?.displayName ?? 'Athlete'}!
      </Text>
      <Text className="font-sans text-sm text-gray-500 dark:text-gray-400">
        Your dashboard is coming soon.
      </Text>
    </View>
  );
}
