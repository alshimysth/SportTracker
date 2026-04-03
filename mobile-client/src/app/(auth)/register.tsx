import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useRegister } from '@/hooks/use-register';
import type { ProblemDetail } from '@/types/auth';
import { isAxiosError } from 'axios';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate: register, isPending } = useRegister();

  function handleSubmit() {
    setFieldError(null);
    register(
      { email, password, displayName },
      {
        onSuccess: () => router.replace('/(tabs)/'),
        onError: (error) => {
          if (isAxiosError(error) && error.response) {
            const problem = error.response.data as ProblemDetail;
            setFieldError(problem.detail ?? problem.title);
          } else {
            setFieldError('An unexpected error occurred. Please try again.');
          }
        },
      },
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <View className="flex-1 justify-center px-6">
        {/* Header */}
        <Text className="mb-2 font-sans text-3xl font-bold text-header dark:text-white">
          Create account
        </Text>
        <Text className="mb-8 font-sans text-base text-gray-500 dark:text-gray-400">
          Start tracking all your sports in one place.
        </Text>

        {/* Display Name */}
        <Text className="mb-1 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
          Display name
        </Text>
        <TextInput
          className="mb-4 rounded-xl border border-gray-200 bg-surface px-4 py-3 font-sans text-base text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
          placeholder="Your athlete name"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          value={displayName}
          onChangeText={setDisplayName}
        />

        {/* Email */}
        <Text className="mb-1 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </Text>
        <TextInput
          className="mb-4 rounded-xl border border-gray-200 bg-surface px-4 py-3 font-sans text-base text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
          placeholder="you@example.com"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Password */}
        <Text className="mb-1 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
          Password
        </Text>
        <TextInput
          className="mb-6 rounded-xl border border-gray-200 bg-surface px-4 py-3 font-sans text-base text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
          placeholder="Minimum 8 characters"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
        />

        {/* Error message */}
        {fieldError && (
          <Text className="mb-4 font-sans text-sm text-red-500">{fieldError}</Text>
        )}

        {/* Submit — 64×64px min touch target per UX-DR10 */}
        <Pressable
          onPress={handleSubmit}
          disabled={isPending}
          className="min-h-[64px] items-center justify-center rounded-2xl bg-primary active:bg-primary-dark disabled:opacity-50"
        >
          {isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-sans text-lg font-semibold text-white">
              Create account
            </Text>
          )}
        </Pressable>

        {/* Navigate to login */}
        <Pressable
          onPress={() => router.push('/(auth)/login')}
          className="mt-4 min-h-[48px] items-center justify-center"
        >
          <Text className="font-sans text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Text className="font-semibold text-primary">Sign in</Text>
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
