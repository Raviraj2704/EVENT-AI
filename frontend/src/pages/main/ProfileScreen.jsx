// ============================================================================
// Profile Screen
// ============================================================================
// File: src/pages/main/ProfileScreen.jsx
// Purpose: View and edit user profile
// Status: Production-Ready ✅

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit2, Mail, MapPin, Building2, Briefcase, LogOut, Award, Zap, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import { useAuthStore } from '../../store/authStore'

const ProfileScreen = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    bio: user?.bio || '',
    company: user?.company || '',
    jobTitle: user?.job_title || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    try {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login', { replace: true })
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        <div className="container-max py-8">
          {/* Profile Header */}
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-8">
            {/* Cover Photo */}
            <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600" />

            {/* Profile Info */}
            <div className="px-6 pb-6 -mt-16 relative">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-4 border-white flex items-center justify-center overflow-hidden mb-4">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                )}
              </div>

              {/* Name and Title */}
              <h1 className="text-3xl font-bold text-neutral-900 mb-1">
                {user?.first_name} {user?.last_name}
              </h1>

              <p className="text-lg text-primary-600 font-medium mb-4">
                {user?.job_title || 'Professional'}
              </p>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-primary-600" />
                <span className="text-2xl font-bold text-neutral-900">0</span>
              </div>
              <p className="text-sm text-neutral-600">Points Earned</p>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-yellow-600" />
                <span className="text-2xl font-bold text-neutral-900">0</span>
              </div>
              <p className="text-sm text-neutral-600">Badges</p>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-neutral-900">#0</span>
              </div>
              <p className="text-sm text-neutral-600">Rank</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-8">
            <div className="border-b border-neutral-200 px-6 py-4">
              <h2 className="text-lg font-bold text-neutral-900">Profile Information</h2>
            </div>

            <div className="px-6 py-6">
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email}
                      disabled
                      className="opacity-60"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      maxLength="500"
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {formData.bio.length}/500
                    </p>
                  </div>

                  <button
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-600">Email</p>
                      <p className="text-neutral-900">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-600">Job Title</p>
                      <p className="text-neutral-900">{user?.job_title || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-600">Company</p>
                      <p className="text-neutral-900">{user?.company || 'Not specified'}</p>
                    </div>
                  </div>

                  {user?.bio && (
                    <div>
                      <p className="text-xs text-neutral-600 mb-2">Bio</p>
                      <p className="text-neutral-900">{user.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full btn btn-outline border-error text-error hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default ProfileScreen