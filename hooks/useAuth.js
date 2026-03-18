import { useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.logout);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = res.data;
    setAuth(user, accessToken, refreshToken);
    return res.data;
  }, [setAuth]);

  const register = useCallback(async ({ name, username, email, password }) => {
    const res = await api.post('/auth/register', { name, username, email, password });
    const { user, accessToken, refreshToken } = res.data;
    setAuth(user, accessToken, refreshToken);
    return res.data;
  }, [setAuth]);

  const logout = useCallback(() => { clearAuth(); }, [clearAuth]);

  return { user, isAuthenticated, login, register, logout };
}
