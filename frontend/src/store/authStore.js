// ============================================================================
// Auth Store (Zustand)
// ============================================================================
// File: src/store/authStore.js
// Purpose: Persistent authentication state management
// Status: Production-Ready ✅

import create from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ============================================================================
      // STATE
      // ============================================================================
      
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      
      // ============================================================================
      // ACTIONS
      // ============================================================================
      
      // Check if user is already authenticated
      checkAuth: () => {
        try {
          const token = localStorage.getItem('access_token')
          const user = localStorage.getItem('user_data')
          
          if (token && user) {
            set({
              token: token,
              user: JSON.parse(user),
              isAuthenticated: true
            })
            console.log('✅ User restored from localStorage')
          }
        } catch (error) {
          console.error('❌ Auth check error:', error)
          set({ isAuthenticated: false })
        }
      },
      
      // Login user
      login: (accessToken, refreshToken, userData) => {
        console.log('🔐 Logging in user:', userData?.email)
        
        // Save to localStorage (PERMANENT)
        localStorage.setItem('access_token', accessToken)
        localStorage.setItem('refresh_token', refreshToken || '')
        localStorage.setItem('user_data', JSON.stringify(userData))
        
        // Update state
        set({
          token: accessToken,
          refreshToken: refreshToken || null,
          user: userData,
          isAuthenticated: true,
          loading: false
        })
      },
      
      // Logout user
      logout: () => {
        console.log('👋 Logging out user')
        
        // Clear localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user_data')
        
        // Clear state
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          loading: false
        })
      },
      
      // Update user profile
      updateProfile: (userData) => {
        console.log('📝 Updating profile')
        
        const updatedUser = { ...get().user, ...userData }
        
        // Update localStorage
        localStorage.setItem('user_data', JSON.stringify(updatedUser))
        
        // Update state
        set({ user: updatedUser })
      },
      
      // Set loading state
      setLoading: (loading) => {
        set({ loading })
      },
      
      // Set token (for token refresh)
      setToken: (token) => {
        localStorage.setItem('access_token', token)
        set({ token })
      }
    }),
    
    // ============================================================================
    // PERSIST CONFIG
    // ============================================================================
    {
      name: 'eventai-auth-store', // localStorage key name
      
      // Only persist these fields
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      
      // Auto-load from localStorage on init
      onRehydrateStorage: () => (state) => {
        console.log('💾 Rehydrating auth store from localStorage')
      }
    }
  )
)