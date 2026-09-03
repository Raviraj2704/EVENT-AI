// ============================================================================
// Session Card Component
// ============================================================================
// File: src/components/cards/SessionCard.jsx
// Purpose: Display session information in card format
// Status: Production-Ready ✅

import React from 'react'
import { Clock, MapPin, Users, Star, Tag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const SessionCard = ({ session, onViewDetails }) => {
  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return dateString
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'keynote':
        return 'bg-primary-100 text-primary-800'
      case 'workshop':
        return 'bg-secondary-100 text-secondary-800'
      case 'panel':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  return (
    <button
      onClick={onViewDetails}
      className="card hover:shadow-lg transition-all text-left hover:scale-105 active:scale-100"
    >
      {/* Header with Image */}
      <div className="relative h-40 bg-gradient-to-br from-primary-400 to-secondary-600">
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(session?.session_type)}`}>
          {session?.session_type}
        </div>

        {/* Rating Badge */}
        {session?.average_rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-neutral-900">
              {session.average_rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="card-body p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-neutral-900 line-clamp-2 mb-2">
          {session?.title}
        </h3>

        {/* Speaker */}
        <p className="text-sm text-neutral-600 mb-3">
          By {session?.speaker_name || 'Speaker'}
        </p>

        {/* Description */}
        <p className="text-sm text-neutral-600 line-clamp-2 mb-4">
          {session?.description}
        </p>

        {/* Difficulty */}
        <div className="mb-4">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(session?.difficulty)}`}>
            {session?.difficulty}
          </span>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 pt-4 border-t border-neutral-200">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>{session?.start_time ? formatTime(session.start_time) : 'TBA'}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <MapPin className="w-4 h-4" />
            <span>{session?.location || 'Virtual'}</span>
          </div>

          {/* Attendees */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Users className="w-4 h-4" />
            <span>{session?.attendees || 0} attending</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default SessionCard