// ============================================================================
// Ratings Screen
// ============================================================================
// File: src/pages/gamification/RatingsScreen.jsx
// Purpose: Rate sessions, speakers, and resources
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Star, MessageCircle, ThumbsUp, TrendingUp, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const RatingsScreen = () => {
  const [loading, setLoading] = useState(true)
  const [ratingTab, setRatingTab] = useState('sessions') // sessions, speakers, resources
  const [ratings, setRatings] = useState([])
  const [ratingOverview, setRatingOverview] = useState(null)
  const [expandedRating, setExpandedRating] = useState(null)
  const [ratingForms, setRatingForms] = useState({})

  useEffect(() => {
    loadRatingsData()
  }, [ratingTab])

  const loadRatingsData = async () => {
    setLoading(true)
    try {
      // Load ratings dashboard
      const overviewResponse = await apiClient.get('/ratings/dashboard/overview')
      setRatingOverview(overviewResponse.data.data)

      // Load entity-specific ratings
      const ratingsResponse = await apiClient.get(`/ratings/entity/${ratingTab}`, {
        params: { limit: 20 }
      })
      setRatings(ratingsResponse.data.data || [])
    } catch (error) {
      console.error('Error loading ratings:', error)
      toast.error('Failed to load ratings')
    } finally {
      setLoading(false)
    }
  }

  const handleRateItem = async (itemId, score, comment) => {
    try {
      const endpoint = ratingTab === 'sessions' 
        ? `/sessions/${itemId}/rate`
        : ratingTab === 'speakers'
        ? `/speakers/${itemId}/rate`
        : `/resources/${itemId}/rate`

      await apiClient.post(endpoint, {
        score,
        comment
      })

      toast.success('Rating submitted! +5 points earned')
      setExpandedRating(null)
      setRatingForms(prev => ({
        ...prev,
        [itemId]: { score: 0, comment: '' }
      }))
      loadRatingsData()
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error('Failed to submit rating')
    }
  }

  const getRatingColor = (score) => {
    if (score >= 4.5) return 'text-green-600'
    if (score >= 3.5) return 'text-blue-600'
    if (score >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const StarRating = ({ value, onChange, readonly = false }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => !readonly && onChange(star)}
          disabled={readonly}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-neutral-300'
            } ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Ratings & Reviews</h1>
            <p className="text-white/80">
              Share your feedback and help the community
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Overview Stats */}
          {ratingOverview && !loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-bold text-neutral-900">
                    {ratingOverview.average_rating?.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Average Rating</p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <MessageCircle className="w-6 h-6 text-primary-600" />
                  <span className="text-2xl font-bold text-neutral-900">
                    {ratingOverview.total_ratings || 0}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Total Ratings</p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <span className="text-2xl font-bold text-neutral-900">
                    +5
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Points per Rating</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-neutral-200 mb-8">
            {[
              { value: 'sessions', label: 'Sessions' },
              { value: 'speakers', label: 'Speakers' },
              { value: 'resources', label: 'Resources' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setRatingTab(tab.value)}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  ratingTab === tab.value
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ratings List */}
          {loading ? (
            <LoadingSpinner />
          ) : ratings.length > 0 ? (
            <div className="space-y-4">
              {ratings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Item Header */}
                  <div
                    onClick={() => setExpandedRating(expandedRating === item.id ? null : item.id)}
                    className="px-6 py-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-neutral-600">
                          {ratingTab === 'sessions' && item.speaker_name && `By ${item.speaker_name}`}
                          {ratingTab === 'speakers' && item.company && `${item.company}`}
                          {ratingTab === 'resources' && item.resource_type && `${item.resource_type.toUpperCase()}`}
                        </p>
                      </div>

                      {item.average_rating > 0 && (
                        <div className="flex items-center gap-2 ml-4">
                          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                          <span className={`text-lg font-bold ${getRatingColor(item.average_rating)}`}>
                            {item.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-neutral-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Expanded Rating Form */}
                  {expandedRating === item.id && (
                    <div className="bg-neutral-50 border-t border-neutral-200 p-6">
                      <h4 className="font-semibold text-neutral-900 mb-4">
                        Rate this {ratingTab.slice(0, -1)}
                      </h4>

                      <div className="space-y-4">
                        {/* Star Rating */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Your Rating
                          </label>
                          <StarRating
                            value={ratingForms[item.id]?.score || 0}
                            onChange={(score) => setRatingForms(prev => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], score }
                            }))}
                          />
                        </div>

                        {/* Comment */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Your Comment (Optional)
                          </label>
                          <textarea
                            value={ratingForms[item.id]?.comment || ''}
                            onChange={(e) => setRatingForms(prev => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], comment: e.target.value }
                            }))}
                            placeholder="Share your thoughts..."
                            maxLength="500"
                            rows="3"
                            className="w-full resize-none"
                          />
                          <p className="text-xs text-neutral-500 mt-1">
                            {(ratingForms[item.id]?.comment || '').length}/500
                          </p>
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={() => handleRateItem(
                            item.id,
                            ratingForms[item.id]?.score || 0,
                            ratingForms[item.id]?.comment || ''
                          )}
                          disabled={!ratingForms[item.id]?.score}
                          className="btn btn-primary w-full flex items-center justify-center gap-2"
                        >
                          <Star className="w-4 h-4 fill-current" />
                          Submit Rating
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Reviews Preview */}
                  {item.recent_reviews && item.recent_reviews.length > 0 && expandedRating !== item.id && (
                    <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 text-sm">
                      <p className="text-neutral-600 mb-2">
                        {item.rating_count} reviews
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <Star className="w-12 h-12 text-neutral-400 mx-auto mb-4 opacity-50" />
              <p className="text-neutral-600 mb-4">
                No {ratingTab} to rate yet
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default RatingsScreen