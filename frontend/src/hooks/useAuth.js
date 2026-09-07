// ============================================================================
// useAuth Hook
// ============================================================================
// File: src/hooks/useAuth.js
// Purpose: Custom hook for authentication operations
// Status: Production-Ready ✅

import { useCallback } from 'react'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    updateProfile
  } = useAuthStore()

  const handleLogin = useCallback(async (usernameOrEmail, password) => {
    return await login(usernameOrEmail, password)
  }, [login])

  const handleRegister = useCallback(async (username, email, password, firstName, lastName) => {
    return await register(username, email, password, firstName, lastName)
  }, [register])

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  const handleUpdateProfile = useCallback(async (profileData) => {
    return await updateProfile(profileData)
  }, [updateProfile])

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    handleUpdateProfile,
    checkAuth
  }
}