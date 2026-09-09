// ============================================================================
// Complete Profile Screen - CRASH FREE VERSION
// ============================================================================
// File: src/pages/CompleteProfileScreen.jsx

import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Building2, Briefcase, Camera, ArrowRight, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

// TODO: Uncomment these when you create the store and config folders later!
// import { useAuthStore } from '../store/authStore'
// import apiClient from '../config/apiClient'

const CompleteProfileScreen = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // TODO: Uncomment this when you create the authStore later!
  // const { user, updateProfile, loading } = useAuthStore()

  // TEMPORARY VARIABLES (To prevent app crash until store is built)
  const user = null
  const loading = false

  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    company: user?.company || '',
    jobTitle: user?.job_title || '',
    bio: user?.bio || ''
  })
  const [avatar, setAvatar] = useState(user?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required'
    }

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatar(reader.result)
      setAvatarFile(file)
    }
    reader.readAsDataURL(file)
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return null

    try {
      // TEMPORARY: Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return avatar // return local preview URL for now

      // TODO: When apiClient is ready, replace mock above with:
      /*
      const formDataForUpload = new FormData()
      formDataForUpload.append('file', avatarFile)
      const response = await apiClient.post('/users/me/avatar', formDataForUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data.avatar_url
      */
    } catch (err) {
      console.error('Avatar upload failed:', err)
      toast.error('Failed to upload avatar')
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload avatar if changed
      if (avatarFile) {
        await uploadAvatar()
      }

      // TEMPORARY: Simulate API update profile
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Profile completed successfully!')
      navigate('/home', { replace: true })

      // TODO: When authStore is ready, replace the mock code above with this:
      /*
      const result = await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        job_title: formData.jobTitle,
        bio: formData.bio
      })

      if (result.success) {
        toast.success('Profile completed successfully!')
        navigate('/home', { replace: true })
      } else {
        toast.error(result.error || 'Profile update failed')
      }
      */
    } catch (err) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = () => {
    navigate('/home', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg mb-4">
            <User className="w-6 h-6 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Complete Your Profile
          </h1>
          
          <p className="text-neutral-600">
            Help us get to know you better
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mb-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <button
              type="button"
              onClick={handleAvatarClick}
              className="relative group"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </button>
            
            <p className="text-sm text-neutral-600 mt-3">
              Click to upload avatar
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                formErrors.firstName ? 'border-error' : 'border-neutral-300'
              }`}
              disabled={isSubmitting}
            />
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-error" style={{color: 'red'}}>{formErrors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                formErrors.lastName ? 'border-error' : 'border-neutral-300'
              }`}
              disabled={isSubmitting}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-error" style={{color: 'red'}}>{formErrors.lastName}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Company
            </label>
            <div className="relative">
              <Building2 className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="pl-12 w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Job Title *
            </label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter your job title"
                className={`pl-12 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  formErrors.jobTitle ? 'border-error' : 'border-neutral-300'
                }`}
                disabled={isSubmitting}
              />
            </div>
            {formErrors.jobTitle && (
              <p className="mt-1 text-sm text-error" style={{color: 'red'}}>{formErrors.jobTitle}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              rows="4"
              maxLength="500"
              className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-neutral-500 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-200 mt-8 flex items-center justify-center gap-2"
          >
            {isSubmitting || loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                Complete Profile
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Skip Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompleteProfileScreen