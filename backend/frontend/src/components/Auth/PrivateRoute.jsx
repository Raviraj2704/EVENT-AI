// ============================================================================
// Private Route Component
// ============================================================================
// File: src/components/auth/PrivateRoute.jsx
// Purpose: Protect routes that require authentication
// Status: Production-Ready ✅

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import LoadingSpinner from '../common/LoadingSpinner'

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, loading } = useAuthStore()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (adminOnly && !user?.is_admin) {
    return <Navigate to="/home" replace />
  }

  return children
}

export default PrivateRoute