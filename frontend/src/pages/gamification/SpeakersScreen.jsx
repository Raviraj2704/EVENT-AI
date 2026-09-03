// ============================================================================
// Speakers Screen
// ============================================================================
// File: src/pages/gamification/SpeakersScreen.jsx
// Purpose: Browse event speakers
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Briefcase, Star, MessageCircle, Share2, Calendar, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const SpeakersScreen = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [speakers, setSpeakers] = useState([])
  const [filteredSpeakers, setFilteredSpeakers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedSpeaker, setExpandedSpeaker] = useState(null)

  useEffect(() => {
    loadSpeakers()
  }, [])

  useEffect(() => {
    filterSpeakers()
  }, [searchQuery, speakers])

  const loadSpeakers = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/speakers', {
        params: { limit: 50 }
      })
      setSpeakers(response.data.data || [])
      setFilteredSpeakers(response.data.data || [])
    } catch (error) {
      console.error('Error loading speakers:', error)
      toast.error('Failed to load speakers')
    } finally {
      setLoading(false)
    }
  }

  const filterSpeakers = () => {
    if (!searchQuery) {
      setFilteredSpeakers(speakers)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = speakers.filter((speaker) =>
      `${speaker.first_name} ${speaker.last_name}`.toLowerCase().includes(query) ||
      speaker.bio?.toLowerCase().includes(query) ||
      speaker.expertise?.some(e => e.toLowerCase().includes(query))
    )

    setFilteredSpeakers(filtered)
  }

  const handleRate = (speakerId) => {
    navigate('/ratings')
  }

  const handleFollow = async (speakerId) => {
    try {
      await apiClient.post(`/speakers/${speakerId}/follow`)
      toast.success('Speaker followed!')
      // Update local state
      setSpeakers(prev => prev.map(s =>
        s.id === speakerId ? { ...s, user_following: !s.user_following } : s
      ))
    } catch (error) {
      console.error('Error following speaker:', error)
      toast.error('Failed to follow speaker')
    }
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Speakers</h1>
            <p className="text-white/80">
              Meet the industry experts sharing their knowledge
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Search */}
          <div className="mb-8 relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search speakers by name, expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white"
            />
          </div>

          {/* Speakers Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredSpeakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpeakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Header Background */}
                  <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-500" />

                  {/* Content */}
                  <div className="px-6 pb-6 -mt-16 relative">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-4 border-white flex items-center justify-center mb-4 overflow-hidden">
                      {speaker.avatar_url ? (
                        <img
                          src={speaker.avatar_url}
                          alt={speaker.first_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-white">
                          {speaker.first_name?.[0]}{speaker.last_name?.[0]}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">
                      {speaker.first_name} {speaker.last_name}
                    </h3>

                    {/* Title */}
                    <p className="text-sm text-primary-600 font-medium mb-2">
                      {speaker.designation}
                    </p>

                    {/* Company */}
                    {speaker.company && (
                      <p className="text-xs text-neutral-600 mb-3">
                        {speaker.company}
                      </p>
                    )}

                    {/* Bio */}
                    <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
                      {speaker.bio}
                    </p>

                    {/* Rating */}
                    {speaker.average_rating > 0 && (
                      <div className="flex items-center gap-1 mb-4">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-neutral-900">
                          {speaker.average_rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-neutral-600">
                          ({speaker.rating_count} ratings)
                        </span>
                      </div>
                    )}

                    {/* Expertise Tags */}
                    {speaker.expertise && speaker.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {speaker.expertise.slice(0, 2).map((exp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium"
                          >
                            {exp}
                          </span>
                        ))}
                        {speaker.expertise.length > 2 && (
                          <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded text-xs font-medium">
                            +{speaker.expertise.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Sessions Count */}
                    {speaker.session_count > 0 && (
                      <div className="flex items-center gap-2 text-xs text-neutral-600 mb-4 pb-4 border-b border-neutral-200">
                        <Calendar className="w-4 h-4" />
                        <span>{speaker.session_count} session{speaker.session_count !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFollow(speaker.id)}
                        className={`w-full btn btn-sm ${
                          speaker.user_following
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                      >
                        {speaker.user_following ? '✓ Following' : 'Follow'}
                      </button>

                      <button
                        onClick={() => handleRate(speaker.id)}
                        className="w-full btn btn-sm btn-ghost flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Rate
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
                {searchQuery ? 'No speakers found' : 'No speakers available'}
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

export default SpeakersScreen