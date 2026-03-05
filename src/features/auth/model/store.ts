import { create } from 'zustand'
import type { User } from '@/entities/user'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
  setAuth: (user: User, accessToken: string) => void
  logout: () => void
  isLoggedIn: () => boolean
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  isLoading: false,

  setAuth: (user, accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    set({ user, accessToken })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    set({ user: null, accessToken: null })
  },

  isLoggedIn: () => get().accessToken !== null,

  isAdmin: () => get().user?.role === 'ADMIN',
}))
