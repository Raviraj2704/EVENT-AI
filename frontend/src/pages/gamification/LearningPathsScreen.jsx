// ============================================================================
// Learning Paths Screen
// ============================================================================
// File: src/pages/gamification/LearningPathsScreen.jsx
// Purpose: Browse and enroll in learning paths
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { BookOpen, Clock, Users, Target, Check, Lock, Play, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const LearningPathsScreen = () => {
  const [loading, setLoading] = useState(true)
  const [paths, setPaths] = useState([])
  const [filteredPaths, setFilteredPaths] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [expandedPath, setExpandedPath] = useState(null)
  const [enrollingPath, setEnrollingPath] = useState(null)

  useEffect(() => {
    loadLearningPaths()
  }, [selectedLevel])

  useEffect(() => {
    filterPaths()
  }, [searchQuery, paths])

  const loadLearningPaths = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 50,
        ...(selectedLevel && { level: selectedLevel })
      }

      const response = await apiClient.get('/learning-paths', { params })
      setPaths(response.data.data || [])
      setFilteredPaths(response.data.data || [])
    } catch (error) {
      console.error('Error loading learning paths:', error)
      toast.error('Failed to load learning paths')
    } finally {
      setLoading(false)
    }
  }

  const filterPaths = () => {
    if (!searchQuery) {
      setFilteredPaths(paths)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = paths.filter((path) =>
      path.title.toLowerCase().includes(query) ||
      path.description?.toLowerCase().includes(query)
    )

    setFilteredPaths(filtered)
  }

  const handleEnroll = async (pathId) => {
    setEnrollingPath(pathId)
    try {
      await apiClient.post(`/learning-paths/${pathId}/enroll`)
      toast.success('Enrolled in learning path!')
      setPaths(prev => prev.map(p =>
        p.id === pathId ? { ...p, user_enrolled: true } : p
      ))
    } catch (error) {
      console.error('Error enrolling:', error)
      toast.error('Failed to enroll in learning path')
    } finally {
      setEnrollingPath(null)
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

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Learning Paths</h1>
            <p className="text-white/80">
              Structured learning to boost your skills
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
                placeholder="Search learning paths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white"
              />
            </div>

            {/* Level Filter */}
            <div className="flex gap-2 flex-wrap">
              {['', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedLevel === level
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {level || 'All Levels'}
                </button>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredPaths.length > 0 ? (
            <div className="space-y-6">
              {filteredPaths.map((path) => (
                <div
                  key={path.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div
                    onClick={() => setExpandedPath(expandedPath === path.id ? null : path.id)}
                    className="px-6 py-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-neutral-900 mb-1">
                          {path.title}
                        </h3>
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {path.description}
                        </p>
                      </div>

                      {path.user_enrolled && (
                        <div className="flex-shrink-0 bg-green-100 px-3 py-1 rounded-full">
                          <span className="text-xs font-semibold text-green-800 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Enrolled
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        <span className={`px-2 py-1 rounded ${getDifficultyColor(path.difficulty)}`}>
                          {path.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{path.duration_weeks} weeks</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{path.enrolled_count || 0} enrolled</span>
                      </div>

                      <div>
                        <span className="font-semibold text-primary-600">+{path.points_reward} pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedPath === path.id && (
                    <div className="border-t border-neutral-200 p-6 bg-neutral-50">
                      {/* Full Description */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-neutral-900 mb-2">About</h4>
                        <p className="text-neutral-700 text-sm">
                          {path.description}
                        </p>
                      </div>

                      {/* Modules */}
                      {path.modules && path.modules.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-neutral-900 mb-3">
                            Modules ({path.modules.length})
                          </h4>
                          <div className="space-y-2">
                            {path.modules.map((module, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3 bg-white rounded-lg border border-neutral-200"
                              >
                                {module.completed ? (
                                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Play className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-medium text-neutral-900 text-sm">
                                    {module.title}
                                  </h5>
                                  <p className="text-xs text-neutral-600">
                                    {module.duration} min
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Outcomes */}
                      {path.learning_outcomes && path.learning_outcomes.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-neutral-900 mb-3">
                            What You'll Learn
                          </h4>
                          <ul className="space-y-2">
                            {path.learning_outcomes.slice(0, 3).map((outcome, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                            {path.learning_outcomes.length > 3 && (
                              <li className="text-sm text-primary-600 font-medium">
                                +{path.learning_outcomes.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Enroll Button */}
                      {!path.user_enrolled && (
                        <button
                          onClick={() => handleEnroll(path.id)}
                          disabled={enrollingPath === path.id}
                          className="w-full btn btn-primary flex items-center justify-center gap-2"
                        >
                          {enrollingPath === path.id ? (
                            <>
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4" />
                              Start Learning
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4 opacity-50" />
              <p className="text-neutral-600 mb-4">
                {searchQuery ? 'No learning paths found' : 'No learning paths available'}
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

export default LearningPathsScreen