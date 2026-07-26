import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  isNewUser: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setIsNewUser: (val: boolean) => void;
  setUser: (user: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isNewUser: false,
      isLoading: true,

      setAuth: (token, user) => {
        set({
          isAuthenticated: true,
          token,
          user,
          isLoading: false,
        });
        // توکن را در localStorage ذخیره می‌کنیم (از طریق persist)
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          token: null,
          user: null,
          isLoading: false,
        });
        // توکن از localStorage توسط persist حذف می‌شود
      },

      setIsNewUser: (val) => {
        set({ isNewUser: val });
      },

      setUser: (partialUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...partialUser } : null,
        }));
      },
    }),
    {
      name: 'petshop-auth', // نام کلید در localStorage
      getStorage: () => localStorage,
    }
  )
);
