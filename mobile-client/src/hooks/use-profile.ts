import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { UserProfile, UpdateProfileRequest } from '@/types/user';

export const PROFILE_QUERY_KEY = ['profile', 'me'] as const;

async function fetchProfile(): Promise<UserProfile> {
  const response = await api.get<UserProfile>('/api/v1/users/me');
  return response.data;
}

async function patchProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  const response = await api.patch<UserProfile>('/api/v1/users/me', data);
  return response.data;
}

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, updated);
    },
  });
}
