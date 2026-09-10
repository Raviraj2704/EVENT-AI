// ============================================================================
// Complete Profile Screen
// ============================================================================
// File: src/pages/auth/CompleteProfileScreen.jsx
// Purpose: Optional profile completion after login
// Status: Production-Ready ✅

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Briefcase, MapPin, FileText, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../config/apiClient'
import { useAuthStore } from '../../store/authStore'

const CompleteProfileScreen = () => {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    designation: user?.designation || '',
    company: user?.company || '',
    location: user?.location || '',
    bio: user?.bio || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiClient.post('/auth/complete-profile', formData)
      
      if (response.data) {
        // ✅ Update auth store
        updateProfile(formData)
        
        toast.success('Profile updated successfully!')
        
        // ✅ Navigate to home (not back to login)
        setTimeout(() => {
          navigate('/home')
        }, 500)
      }
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error(error.response?.data?.detail || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    // ✅ Allow skipping - go directly to home
    console.log('⏭️ Skipping profile completion')
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full mb-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-neutral-600">
              Help us personalize your experience (optional)
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Designation
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 hover:border-primary-300 focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Company
              </label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g., Tech Company Inc"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 hover:border-primary-300 focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 hover:border-primary-300 focus:border-primary-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Bio
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-neutral-400" />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="3"
                  maxLength="500"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-neutral-200 hover:border-primary-300 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                />
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 py-3 rounded-lg bg-neutral-100 text-neutral-700 font-semibold hover:bg-neutral-200 transition-colors"
              >
                Skip for Now
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfileScreen