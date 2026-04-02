import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useProfile, useUpdateProfile } from '@/hooks/use-profile';
import { useAuthStore } from '@/store/use-auth-store';
import type { ProblemDetail } from '@/types/auth';
import axios from 'axios';

export default function ProfileScreen() {
  const { data: profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function startEditing() {
    setDisplayName(profile?.displayName ?? '');
    setBio(profile?.bio ?? '');
    setError(null);
    setSuccess(false);
    setIsEditing(true);
  }

  function handleSave() {
    setError(null);
    setSuccess(false);

    const payload: Record<string, string> = {};
    if (displayName !== profile?.displayName) payload.displayName = displayName;
    if (bio !== (profile?.bio ?? '')) payload.bio = bio;

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    updateProfile(payload, {
      onSuccess: () => {
        setSuccess(true);
        setIsEditing(false);
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.response) {
          const problem = err.response.data as ProblemDetail;
          setError(problem.detail ?? problem.title);
        } else {
          setError('An unexpected error occurred. Please try again.');
        }
      },
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color="#FF6B4A" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark"
    >
      <ScrollView contentContainerClassName="px-6 pt-12 pb-8">
        {/* Avatar placeholder */}
        <View className="mb-6 items-center">
          <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
            <Text className="font-sans text-3xl font-bold text-white">
              {(profile?.displayName ?? '?')[0].toUpperCase()}
            </Text>
          </View>
          <Text className="mt-3 font-sans text-xl font-bold text-header dark:text-white">
            {profile?.displayName}
          </Text>
          <Text className="font-sans text-sm text-gray-500 dark:text-gray-400">
            {profile?.email}
          </Text>
        </View>

        {isEditing ? (
          <>
            {/* Display name */}
            <Text className="mb-1 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
              Display name
            </Text>
            <TextInput
              className="mb-4 rounded-xl border border-gray-200 bg-surface px-4 py-3 font-sans text-base text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />

            {/* Bio */}
            <Text className="mb-1 font-sans text-sm font-medium text-gray-700 dark:text-gray-300">
              Bio
            </Text>
            <TextInput
              className="mb-6 rounded-xl border border-gray-200 bg-surface px-4 py-3 font-sans text-base text-gray-900 dark:border-gray-700 dark:bg-surface-dark dark:text-white"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
              placeholder="Tell others about your sports..."
              placeholderTextColor="#9CA3AF"
            />

            {error && (
              <Text className="mb-4 font-sans text-sm text-red-500">{error}</Text>
            )}

            {/* Save */}
            <Pressable
              onPress={handleSave}
              disabled={isPending}
              className="mb-3 min-h-[64px] items-center justify-center rounded-2xl bg-primary active:bg-primary-dark disabled:opacity-50"
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-sans text-lg font-semibold text-white">Save changes</Text>
              )}
            </Pressable>

            {/* Cancel */}
            <Pressable
              onPress={() => setIsEditing(false)}
              className="min-h-[48px] items-center justify-center"
            >
              <Text className="font-sans text-sm font-semibold text-gray-500">Cancel</Text>
            </Pressable>
          </>
        ) : (
          <>
            {/* Bio display */}
            {profile?.bio ? (
              <Text className="mb-6 text-center font-sans text-sm text-gray-600 dark:text-gray-400">
                {profile.bio}
              </Text>
            ) : null}

            {success && (
              <Text className="mb-4 text-center font-sans text-sm text-green-500">
                Profile updated!
              </Text>
            )}

            {/* Edit profile */}
            <Pressable
              onPress={startEditing}
              className="mb-3 min-h-[64px] items-center justify-center rounded-2xl bg-primary active:bg-primary-dark"
            >
              <Text className="font-sans text-lg font-semibold text-white">Edit profile</Text>
            </Pressable>

            {/* Sign out */}
            <Pressable
              onPress={clearAuth}
              className="min-h-[48px] items-center justify-center rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <Text className="font-sans text-base font-semibold text-red-500">Sign out</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
