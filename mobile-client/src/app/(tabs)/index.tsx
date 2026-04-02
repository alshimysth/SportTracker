import { View, Text, Pressable } from 'react-native';
import { useAuthStore } from '@/store/use-auth-store';

export default function HomeScreen() {
  const { user, clearAuth } = useAuthStore();

  return (
    <View className="flex-1 items-center justify-center bg-background px-6 dark:bg-background-dark">
      <Text className="mb-2 font-sans text-2xl font-bold text-header dark:text-white">
        Welcome, {user?.displayName ?? 'Athlete'}!
      </Text>
      <Text className="mb-12 font-sans text-sm text-gray-500 dark:text-gray-400">
        {user?.email}
      </Text>

      <Pressable
        onPress={clearAuth}
        className="min-h-[64px] w-full items-center justify-center rounded-2xl border border-gray-200 bg-surface dark:border-gray-700 dark:bg-surface-dark"
      >
        <Text className="font-sans text-base font-semibold text-red-500">Sign out</Text>
      </Pressable>
    </View>
  );
}
