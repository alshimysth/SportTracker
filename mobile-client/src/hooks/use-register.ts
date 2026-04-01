import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/use-auth-store';
import type { RegisterRequest, AuthResponse } from '@/types/auth';

async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
  return response.data;
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => setAuth(data),
  });
}
