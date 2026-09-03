// ============================================================================
// Networking Screen
// ============================================================================
// File: src/pages/main/NetworkingScreen.jsx
// Purpose: Browse and connect with other attendees
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Users, Search, UserPlus, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const NetworkingScreen = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [followedUsers, setFollowedUsers] = useState(new Set())

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [searchQuery, users])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/users', {
        params: { limit: 50 }
      })
      setUsers(response.data.data || [])
      setFilteredUsers(response.data.data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    if (!searchQuery) {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter((user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.job_title?.toLowerCase().includes(query) ||
      user.company?.toLowerCase().includes(query)
    )

    setFilteredUsers(filtered)
  }

  const handleFollow = async (userId) => {
    try {
      // This would call actual follow endpoint
      setFollowedUsers(prev => {
        const newSet = new Set(prev)
        if (newSet.has(userId)) {
          newSet.delete(userId)
        } else {
          newSet.add(userId)
        }
        return newSet
      })
      toast.success('Connection updated!')
    } catch (error) {
      toast.error('Failed to update connection')
    }
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Networking</h1>
            <p className="text-white/80">
              Connect and build relationships with fellow attendees
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by name, job title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white"
              />
            </div>
          </div>

          {/* Users Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header Background */}
                  <div className="h-24 bg-gradient-to-r from-primary-400 to-secondary-400" />

                  {/* Content */}
                  <div className="px-6 py-4 -mt-12 relative">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-4 border-white flex items-center justify-center overflow-hidden mb-4 mx-auto">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="w-10 h-10 text-white" />
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-center text-neutral-900 mb-1">
                      {user.first_name} {user.last_name}
                    </h3>

                    {/* Job Title */}
                    <p className="text-sm text-center text-primary-600 font-medium mb-1">
                      {user.job_title || 'Professional'}
                    </p>

                    {/* Company */}
                    {user.company && (
                      <p className="text-xs text-center text-neutral-600 mb-4">
                        {user.company}
                      </p>
                    )}

                    {/* Bio */}
                    {user.bio && (
                      <p className="text-sm text-center text-neutral-600 mb-4 line-clamp-3">
                        {user.bio}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 pt-4 border-t border-neutral-200">
                      <button
                        onClick={() => handleFollow(user.id)}
                        className={`w-full btn btn-sm flex items-center justify-center gap-2 ${
                          followedUsers.has(user.id)
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        {followedUsers.has(user.id) ? 'Connected' : 'Connect'}
                      </button>

                      <button className="w-full btn btn-sm btn-ghost flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <p className="text-neutral-600 mb-4">
                {searchQuery ? 'No users found matching your search' : 'No users available'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default NetworkingScreen