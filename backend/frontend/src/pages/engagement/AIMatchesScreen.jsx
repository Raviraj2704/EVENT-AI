// ============================================================================
// AI Matches Screen
// ============================================================================
// File: src/pages/engagement/AIMatchesScreen.jsx
// Purpose: AI-powered user matching and recommendations
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Users, Zap, MessageCircle, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const AIMatchesScreen = () => {
  const [loading, setLoading] = useState(true)
  const [matches, setMatches] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [processedMatches, setProcessedMatches] = useState(new Set())

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/ai-matches')
      setMatches(response.data.data || [])
    } catch (error) {
      console.error('Error loading matches:', error)
      toast.error('Failed to load AI matches')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (matchId) => {
    try {
      // Call API to accept match
      await apiClient.post(`/networking/accept-match/${matchId}`)
      
      setProcessedMatches(prev => new Set([...prev, matchId]))
      moveToNextMatch()
      toast.success('Match accepted! You can now connect.')
    } catch (error) {
      console.error('Error accepting match:', error)
      toast.error('Failed to accept match')
    }
  }

  const handleSkip = () => {
    setProcessedMatches(prev => new Set([...prev, matches[currentIndex].id]))
    moveToNextMatch()
  }

  const moveToNextMatch = () => {
    setCurrentIndex(prev => prev + 1)
  }

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullScreen />
        <BottomNavigation />
      </>
    )
  }

  if (matches.length === 0 || currentIndex >= matches.length) {
    return (
      <>
        <Header />

        <main className="pb-20 md:pb-0">
          <div className="container-max py-12 flex flex-col items-center justify-center min-h-screen text-center">
            <Zap className="w-16 h-16 text-primary-600 mb-4 opacity-50" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              No More Matches
            </h1>
            <p className="text-neutral-600 mb-6">
              Come back tomorrow for more AI-powered recommendations
            </p>
            <button
              onClick={loadMatches}
              className="btn btn-primary"
            >
              Refresh
            </button>
          </div>
        </main>

        <BottomNavigation />
      </>
    )
  }

  const currentMatch = matches[currentIndex]
  const matchPercentage = currentMatch.match_percentage || 0

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">AI Matches</h1>
            <p className="text-white/80">
              AI-powered recommendations based on your profile and interests
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Match Progress */}
          <div className="mb-8">
            <p className="text-sm text-neutral-600 mb-2">
              Match {currentIndex + 1} of {matches.length}
            </p>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / matches.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Match Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xl">
              {/* Header Background */}
              <div className="h-40 bg-gradient-to-r from-primary-500 to-secondary-500" />

              {/* Content */}
              <div className="px-8 py-8 -mt-20 relative text-center">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 border-4 border-white flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  {currentMatch.avatar_url ? (
                    <img
                      src={currentMatch.avatar_url}
                      alt={currentMatch.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-16 h-16 text-white" />
                  )}
                </div>

                {/* Match Percentage Badge */}
                <div className="inline-block mb-4">
                  <div className="bg-primary-100 text-primary-900 px-4 py-2 rounded-full font-bold text-lg">
                    {matchPercentage}% Match
                  </div>
                </div>

                {/* Name and Title */}
                <h1 className="text-3xl font-bold text-neutral-900 mb-1">
                  {currentMatch.first_name} {currentMatch.last_name}
                </h1>

                <p className="text-lg text-primary-600 font-medium mb-4">
                  {currentMatch.job_title}
                </p>

                <p className="text-neutral-600 mb-2">
                  {currentMatch.company}
                </p>

                {/* Bio */}
                <p className="text-neutral-700 max-w-lg mx-auto mb-8 leading-relaxed">
                  {currentMatch.bio || 'No bio provided'}
                </p>

                {/* Match Reasons */}
                {currentMatch.match_reasons && currentMatch.match_reasons.length > 0 && (
                  <div className="mb-8 text-left bg-neutral-50 rounded-lg p-6">
                    <h3 className="font-semibold text-neutral-900 mb-3">
                      Why This Match?
                    </h3>
                    <ul className="space-y-2">
                      {currentMatch.match_reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-neutral-700 text-sm">
                          <Zap className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8 bg-neutral-50 rounded-lg p-6 text-center">
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Experience</p>
                    <p className="font-semibold text-neutral-900">
                      {currentMatch.experience_level || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Location</p>
                    <p className="font-semibold text-neutral-900">
                      {currentMatch.location || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-600 mb-1">Events</p>
                    <p className="font-semibold text-neutral-900">
                      {currentMatch.events_attended || 0}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <button
                    onClick={handleSkip}
                    className="flex-1 btn btn-outline py-3 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Pass
                  </button>

                  <button
                    onClick={() => handleAccept(currentMatch.id)}
                    className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Connect
                  </button>
                </div>

                {/* Message Option */}
                <button className="w-full mt-3 btn btn-ghost flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>
          </div>

          {/* Card Counter */}
          <div className="text-center mt-8 text-neutral-600">
            Swipe to discover more amazing people
          </div>
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default AIMatchesScreen