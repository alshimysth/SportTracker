import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/use-auth-store';

async function deleteAccount(): Promise<void> {
  await api.delete('/api/v1/users/me');
}

export function useDeleteAccount() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => clearAuth(),
  });
}
