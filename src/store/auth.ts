'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

// Store global untuk save token login
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,

      // Set token setelah login berhasil supaya request berikutnya punya token
      setToken: (token) => set({ token }),

      // Hapus akses user dari aplikasi
      logout: () => set({ token: null }),
    }),
    {
      // persist save token ke localStorage dengan key auth-storage
      name: 'auth-storage',
    }
  )
);
