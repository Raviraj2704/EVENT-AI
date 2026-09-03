// ============================================================================
// API Client Configuration
// ============================================================================
// File: src/config/apiClient.js
// Purpose: Axios setup with interceptors for authentication
// Status: Production-Ready ✅

import axios from 'axios'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { token, refreshToken, logout, setTokens } = useAuthStore.getState()

    // Handle 401 - Try to refresh token
    if (error.response?.status === 401 && token && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refresh_token: refreshToken }
        )

        const { access_token, refresh_token } = response.data

        // Update tokens
        setTokens(access_token, refresh_token)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout user
        logout()
        toast.error('Session expired. Please login again.')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      toast.error('Access denied')
    }

    // Handle 404 - Not found
    if (error.response?.status === 404) {
      toast.error('Resource not found')
    }

    // Handle 500 - Server error
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.')
    }

    return Promise.reject(error)
  }
)

export default apiClient