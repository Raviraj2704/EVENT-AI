// ============================================================================
// Sessions Screen
// ============================================================================
// File: src/pages/main/SessionsScreen.jsx
// Purpose: Browse and filter sessions
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import SessionCard from '../../components/cards/SessionCard'
import apiClient from '../../config/apiClient'

const SessionsScreen = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])
  const [filteredSessions, setFilteredSessions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = ['Keynote', 'Workshop', 'Panel', 'Networking']
  const difficulties = ['Beginner', 'Intermediate', 'Advanced']

  useEffect(() => {
    loadSessions()
  }, [page, selectedCategory, selectedDifficulty])

  useEffect(() => {
    filterSessions()
  }, [searchQuery, sessions])

  const loadSessions = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 12,
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty })
      }

      const response = await apiClient.get('/sessions', { params })
      setSessions(response.data.data || [])
      setTotalPages(response.data.total_pages || 1)
      setFilteredSessions(response.data.data || [])
    } catch (error) {
      console.error('Error loading sessions:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const filterSessions = () => {
    if (!searchQuery) {
      setFilteredSessions(sessions)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = sessions.filter((session) =>
      session.title.toLowerCase().includes(query) ||
      session.description?.toLowerCase().includes(query)
    )

    setFilteredSessions(filtered)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSelectedDifficulty('')
    setPage(1)
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Sessions</h1>
            <p className="text-white/80">
              Browse and discover {sessions.length} sessions
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Search and Filter Bar */}
          <div className="space-y-4 mb-8">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {(selectedCategory || selectedDifficulty) && (
                <button
                  onClick={resetFilters}
                  className="btn btn-ghost text-sm"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setPage(1)
                    }}
                    className="w-full"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => {
                      setSelectedDifficulty(e.target.value)
                      setPage(1)
                    }}
                    className="w-full"
                  >
                    <option value="">All Levels</option>
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Sessions Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredSessions.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onViewDetails={() => navigate(`/sessions/${session.id}`)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="btn btn-outline btn-sm"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          page === p
                            ? 'bg-primary-600 text-white'
                            : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="btn btn-outline btn-sm"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <p className="text-neutral-600 mb-4">
                {searchQuery ? 'No sessions found matching your search' : 'No sessions available'}
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

export default SessionsScreen