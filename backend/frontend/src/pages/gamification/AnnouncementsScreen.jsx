// ============================================================================
// Announcements Screen
// ============================================================================
// File: src/pages/gamification/AnnouncementsScreen.jsx
// Purpose: Browse event announcements
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Megaphone, AlertCircle, Info, CheckCircle, Bell, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const AnnouncementsScreen = () => {
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadAnnouncements()
  }, [selectedCategory])

  useEffect(() => {
    filterAnnouncements()
  }, [searchQuery, announcements])

  const loadAnnouncements = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 50,
        ...(selectedCategory && { category: selectedCategory })
      }

      const response = await apiClient.get('/announcements', { params })
      const data = response.data.data || []
      
      setAnnouncements(data)
      setFilteredAnnouncements(data)

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(a => a.category))]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error loading announcements:', error)
      toast.error('Failed to load announcements')
    } finally {
      setLoading(false)
    }
  }

  const filterAnnouncements = () => {
    if (!searchQuery) {
      setFilteredAnnouncements(announcements)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = announcements.filter((announcement) =>
      announcement.title.toLowerCase().includes(query) ||
      announcement.content.toLowerCase().includes(query)
    )

    setFilteredAnnouncements(filtered)
  }

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'event':
        return <Megaphone className="w-5 h-5 text-primary-600" />
      case 'schedule':
        return <Info className="w-5 h-5 text-blue-600" />
      case 'general':
        return <Bell className="w-5 h-5 text-neutral-600" />
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-900 border-red-300'
      case 'event':
        return 'bg-primary-100 text-primary-900 border-primary-300'
      case 'schedule':
        return 'bg-blue-100 text-blue-900 border-blue-300'
      case 'general':
        return 'bg-neutral-100 text-neutral-900 border-neutral-300'
      default:
        return 'bg-green-100 text-green-900 border-green-300'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'border-l-4 border-l-red-600'
      case 'medium':
        return 'border-l-4 border-l-yellow-600'
      default:
        return 'border-l-4 border-l-green-600'
    }
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Announcements</h1>
            <p className="text-white/80">
              Stay updated with the latest event news
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Controls */}
          <div className="space-y-4 mb-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white w-full border-neutral-300 rounded-md shadow-sm"
              />
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === ''
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Announcements List */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow ${getPriorityColor(announcement.priority)}`}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                    className="w-full px-6 py-4 hover:bg-neutral-50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getCategoryIcon(announcement.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 gap-4">
                          <h3 className="text-lg font-bold text-neutral-900">
                            {announcement.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border flex-shrink-0 ${getCategoryColor(announcement.category)}`}>
                            {announcement.category}
                          </span>
                        </div>

                        <p className="text-neutral-600 text-sm mb-2 line-clamp-2">
                          {announcement.content}
                        </p>

                        <p className="text-xs text-neutral-500">
                          {new Date(announcement.created_at).toLocaleDateString()} at {new Date(announcement.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Chevron */}
                      <div className="flex-shrink-0 text-neutral-400">
                        <svg
                          className={`w-5 h-5 transition-transform ${expandedId === announcement.id ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {expandedId === announcement.id && (
                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                      <p className="text-neutral-700 whitespace-pre-wrap mb-4">
                        {announcement.content}
                      </p>

                      {announcement.action_url && (
                        <a
                          href={announcement.action_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                        >
                          Learn More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <Megaphone className="w-12 h-12 text-neutral-400 mx-auto mb-4 opacity-50" />
              <p className="text-neutral-600 mb-4">
                {searchQuery ? 'No announcements match your search' : 'No announcements yet'}
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

export default AnnouncementsScreen