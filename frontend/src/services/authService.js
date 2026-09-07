// ============================================================================
// Authentication Service
// ============================================================================
// File: src/services/authService.js
// Purpose: Handle authentication API calls
// Status: Production-Ready ✅

import apiClient from '../config/apiClient'

export const authService = {
  // Register new user
  register: async (username, email, password, firstName, lastName) => {
    const response = await apiClient.post('/auth/register', {
      username,
      email,
      password,
      first_name: firstName,
      last_name: lastName
    })
    return response.data
  },

  // Login user
  login: async (usernameOrEmail, password) => {
    const response = await apiClient.post('/auth/login', {
      username_or_email: usernameOrEmail,
      password
    })
    return response.data
  },

  // Verify email
  verifyEmail: async (email, verificationCode) => {
    const response = await apiClient.post('/auth/verify-email', {
      email,
      verification_code: verificationCode
    })
    return response.data
  },

  // Resend verification code
  resendVerificationCode: async (email) => {
    const response = await apiClient.post('/auth/resend-verification-code', {
      email
    })
    return response.data
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh-token', {
      refresh_token: refreshToken
    })
    return response.data
  },

  // Request password reset
  forgotPassword: async (email) => {
    const response = await apiClient.post('/auth/forgot-password', {
      email
    })
    return response.data
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      new_password: newPassword
    })
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/me')
    return response.data
  }
}

export default authService