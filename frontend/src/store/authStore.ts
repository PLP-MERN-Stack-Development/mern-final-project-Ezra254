import { create } from 'zustand';
import { api } from '../lib/api';
import type { AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrating: boolean;
  hasHydrated: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isHydrating: false,
  hasHydrated: false,
  error: null,
  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<AuthResponse>('/auth/login', payload);
      set({ user: data.user, isLoading: false, hasHydrated: true });
    } catch (error) {
      set({ error: 'Unable to log in, please try again.', isLoading: false });
      throw error;
    }
  },
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', payload);
      set({ user: data.user, isLoading: false, hasHydrated: true });
    } catch (error) {
      set({ error: 'Registration failed.', isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors, still clear local state
    }
    set({ user: null, hasHydrated: true });
  },
  fetchMe: async () => {
    const { hasHydrated } = get();
    if (!hasHydrated) {
      set({ isHydrating: true });
    }
    try {
      const { data } = await api.get<{ user: User }>('/auth/me');
      set({ user: data.user });
    } catch {
      set({ user: null });
    } finally {
      if (!hasHydrated) {
        set({ isHydrating: false, hasHydrated: true });
      }
    }
  },
  initialize: async () => {
    const { hasHydrated, isHydrating } = get();
    if (hasHydrated || isHydrating) {
      return;
    }
    await get().fetchMe();
  },
}));

