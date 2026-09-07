// ============================================================================
// Loading Spinner Component
// ============================================================================
// File: src/components/common/LoadingSpinner.jsx
// Purpose: Display loading state
// Status: Production-Ready ✅

import React from 'react'

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const spinner = (
    <div className={`spinner border-4 border-neutral-200 border-t-primary-600 rounded-full ${sizeClasses[size]}`} />
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex-center bg-white/50 backdrop-blur-sm z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex-center p-8">
      {spinner}
    </div>
  )
}

export default LoadingSpinner