// ============================================================================
// Authentication Store (Zustand)
// ============================================================================
// File: src/store/authStore.js
// Purpose: Global authentication state management
// Status: Production-Ready ✅

import { create } from 'zustand'
import apiClient from '../config/apiClient'

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),

  setTokens: (token, refreshToken) => {
    localStorage.setItem('access_token', token)
    localStorage.setItem('refresh_token', refreshToken)
    set({
      token,
      refreshToken,
      isAuthenticated: true
    })
  },

  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false
    })
  },

  login: async (usernameOrEmail, password) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.post('/auth/login', {
        username_or_email: usernameOrEmail,
        password
      })

      const { access_token, refresh_token, user } = response.data

      set({
        user,
        token: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        loading: false
      })

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      return { success: true, user }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed'
      set({
        error: errorMsg,
        loading: false
      })
      return { success: false, error: errorMsg }
    }
  },

  register: async (username, email, password, firstName, lastName) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })

      const { access_token, refresh_token } = response.data

      set({
        token: access_token,
        refreshToken: refresh_token,
        isAuthenticated: true,
        loading: false
      })

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('refresh_token', refresh_token)

      return { success: true }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed'
      set({
        error: errorMsg,
        loading: false
      })
      return { success: false, error: errorMsg }
    }
  },

  verifyEmail: async (email, verificationCode) => {
    set({ loading: true, error: null })
    try {
      await apiClient.post('/auth/verify-email', {
        email,
        verification_code: verificationCode
      })

      set({ loading: false })
      return { success: true }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Verification failed'
      set({
        error: errorMsg,
        loading: false
      })
      return { success: false, error: errorMsg }
    }
  },

  checkAuth: async () => {
    const { token, isAuthenticated } = get()

    if (!isAuthenticated || !token) {
      set({ isAuthenticated: false })
      return
    }

    set({ loading: true })
    try {
      const response = await apiClient.get('/users/me')
      set({
        user: response.data,
        loading: false
      })
    } catch (error) {
      console.error('Auth check failed:', error)
      get().logout()
      set({ loading: false })
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null })
    try {
      const response = await apiClient.put('/users/me', profileData)
      set({
        user: response.data.user,
        loading: false
      })
      return { success: true, user: response.data.user }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Profile update failed'
      set({
        error: errorMsg,
        loading: false
      })
      return { success: false, error: errorMsg }
    }
  }
}))