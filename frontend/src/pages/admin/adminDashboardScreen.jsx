// ============================================================================
// Admin Dashboard Screen
// ============================================================================
// File: src/pages/admin/AdminDashboardScreen.jsx
// Purpose: Admin user management and content moderation
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Users, MessageSquare, Trash2, Check, X, Search, Filter, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const AdminDashboardScreen = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [contentToModerate, setContentToModerate] = useState([])
  const [adminLogs, setAdminLogs] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [moderatingContent, setModeratingContent] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    loadAdminData()
  }, [activeTab])

  const loadAdminData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const response = await apiClient.get('/admin/users', {
          params: { limit: 50 }
        })
        setUsers(response.data.data || [])
      } else if (activeTab === 'moderation') {
        const response = await apiClient.get('/admin/moderation/content')
        setContentToModerate(response.data.data || [])
      } else if (activeTab === 'logs') {
        const response = await apiClient.get('/admin/logs', {
          params: { limit: 50 }
        })
        setAdminLogs(response.data.data || [])
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // USER MANAGEMENT
  // ============================================================================

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await apiClient.put(`/admin/users/${userId}`, {
        is_active: !isActive
      })
      toast.success('User status updated!')
      loadAdminData()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiClient.delete(`/admin/users/${userId}`)
        toast.success('User deleted!')
        loadAdminData()
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  // ============================================================================
  // CONTENT MODERATION
  // ============================================================================

  const handleApproveContent = async (contentId, contentType) => {
    try {
      await apiClient.post(`/admin/moderation/content/${contentId}/approve`, null, {
        params: { content_type: contentType }
      })
      toast.success('Content approved!')
      loadAdminData()
    } catch (error) {
      console.error('Error approving content:', error)
      toast.error('Failed to approve content')
    }
  }

  const handleRejectContent = async (contentId, contentType) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      await apiClient.post(`/admin/moderation/content/${contentId}/reject`, {
        reason: rejectionReason
      }, {
        params: { content_type: contentType }
      })
      toast.success('Content rejected!')
      setModeratingContent(null)
      setRejectionReason('')
      loadAdminData()
    } catch (error) {
      console.error('Error rejecting content:', error)
      toast.error('Failed to reject content')
    }
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-red-100">
              Manage users, moderate content, and review system logs
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-neutral-200 mb-8 overflow-x-auto">
            {[
              { value: 'users', label: '👥 Users', icon: Users },
              { value: 'moderation', label: '🛡️ Moderation', icon: MessageSquare },
              { value: 'logs', label: '📋 Logs', icon: Settings }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.value
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Users Management */}
          {activeTab === 'users' && (
            <div>
              {/* Search */}
              <div className="mb-6 relative">
                <Search className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 bg-white"
                />
              </div>

              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            User
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-center font-semibold text-neutral-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users
                          .filter(u =>
                            `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(user => (
                            <tr key={user.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-medium text-neutral-900">
                                    {user.first_name} {user.last_name}
                                  </p>
                                  <p className="text-xs text-neutral-500">
                                    {user.is_admin ? '👑 Admin' : 'User'}
                                  </p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-neutral-600">
                                {user.email}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  user.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.status === 'active' ? '✓ Active' : '✗ Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-neutral-600 text-xs">
                                {new Date(user.joined_date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleToggleUserStatus(user.id, user.status === 'active')}
                                    className="p-1 hover:bg-neutral-100 rounded transition-colors"
                                    title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                                  >
                                    {user.status === 'active' ? (
                                      <X className="w-4 h-4 text-red-600" />
                                    ) : (
                                      <Check className="w-4 h-4 text-green-600" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                    title="Delete user"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {users.length === 0 && (
                    <div className="p-12 text-center text-neutral-600">
                      No users found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content Moderation */}
          {activeTab === 'moderation' && (
            <div className="space-y-6">
              {loading ? (
                <LoadingSpinner />
              ) : contentToModerate.length > 0 ? (
                contentToModerate.map(content => (
                  <div
                    key={content.id}
                    className="bg-white rounded-lg border border-neutral-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-neutral-600 mb-1">
                          By {content.author} • {content.type}
                        </p>
                        <h3 className="text-lg font-bold text-neutral-900">
                          {content.content}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(content.created_at).toLocaleString()}
                        </p>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>

                    {/* Actions */}
                    {moderatingContent === content.id ? (
                      // Rejection Form
                      <div className="space-y-4 bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-semibold text-red-900">Reason for Rejection</h4>

                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Explain why this content is being rejected..."
                          rows="3"
                          className="w-full"
                        />

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRejectContent(content.id, content.type)}
                            className="flex-1 btn btn-sm bg-red-600 text-white hover:bg-red-700"
                          >
                            Confirm Rejection
                          </button>

                          <button
                            onClick={() => {
                              setModeratingContent(null)
                              setRejectionReason('')
                            }}
                            className="flex-1 btn btn-sm btn-outline"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveContent(content.id, content.type)}
                          className="flex-1 btn btn-sm btn-primary flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>

                        <button
                          onClick={() => setModeratingContent(content.id)}
                          className="flex-1 btn btn-sm btn-outline text-red-600 hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-4 opacity-50" />
                  <p className="text-neutral-600">No content pending moderation</p>
                </div>
              )}
            </div>
          )}

          {/* Admin Logs */}
          {activeTab === 'logs' && (
            <div>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Admin
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Entity
                          </th>
                          <th className="px-6 py-3 text-left font-semibold text-neutral-700">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminLogs.map(log => (
                          <tr key={log.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                            <td className="px-6 py-4 font-medium text-neutral-900">
                              {log.admin_name}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                {log.action}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-neutral-600 text-xs">
                              {log.entity_type} #{log.entity_id}
                            </td>
                            <td className="px-6 py-4 text-neutral-600 text-xs">
                              {new Date(log.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {adminLogs.length === 0 && (
                    <div className="p-12 text-center text-neutral-600">
                      No logs found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default AdminDashboardScreen