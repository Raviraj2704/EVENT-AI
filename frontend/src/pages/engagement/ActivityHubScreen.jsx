// ============================================================================
// Activity Hub Screen
// ============================================================================
// File: src/pages/engagement/ActivityHubScreen.jsx
// Purpose: Challenges, leaderboard, and activities
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Trophy, Target, Zap, Users, Medal, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const ActivityHubScreen = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('challenges')
  const [challenges, setChallenges] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [activities, setActivities] = useState([])
  const [userStats, setUserStats] = useState(null)
  const [joiningChallenge, setJoiningChallenge] = useState(null)

  useEffect(() => {
    loadActivityData()
  }, [])

  const loadActivityData = async () => {
    setLoading(true)
    try {
      // Load challenges
      const challengesResponse = await apiClient.get('/challenges', {
        params: { limit: 12 }
      })
      setChallenges(challengesResponse.data.data || [])

      // Load leaderboard
      const leaderboardResponse = await apiClient.get('/leaderboard', {
        params: { limit: 10 }
      })
      setLeaderboard(leaderboardResponse.data.data || [])

      // Load activities
      const activitiesResponse = await apiClient.get('/engagement/activities', {
        params: { limit: 8 }
      })
      setActivities(activitiesResponse.data.data || [])

      // Load user stats
      const statsResponse = await apiClient.get('/leaderboard/me')
      setUserStats(statsResponse.data.data)
    } catch (error) {
      console.error('Error loading activity data:', error)
      toast.error('Failed to load activity data')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinChallenge = async (challengeId) => {
    setJoiningChallenge(challengeId)
    try {
      await apiClient.post(`/challenges/${challengeId}/join`)
      toast.success('Joined challenge successfully!')
      loadActivityData()
    } catch (error) {
      console.error('Error joining challenge:', error)
      toast.error('Failed to join challenge')
    } finally {
      setJoiningChallenge(null)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
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

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Activity Hub</h1>
            <p className="text-white/80">
              Join challenges, participate in activities, and climb the leaderboard
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* User Stats */}
          {userStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Zap className="w-6 h-6 text-primary-600" />
                  <span className="text-2xl font-bold text-neutral-900">
                    {userStats.total_points}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Your Points</p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Medal className="w-6 h-6 text-yellow-600" />
                  <span className="text-2xl font-bold text-neutral-900">
                    #{userStats.rank}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Your Rank</p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Trophy className="w-6 h-6 text-blue-600" />
                  <span className="text-2xl font-bold text-neutral-900">
                    {userStats.badges_earned}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Badges Earned</p>
              </div>

              <div className="bg-white rounded-lg border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-3">
                  <Target className="w-6 h-6 text-secondary-600" />
                  <span className="text-2xl font-bold text-neutral-900">
                    {userStats.challenges_completed}
                  </span>
                </div>
                <p className="text-sm text-neutral-600">Challenges Done</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-neutral-200 mb-8">
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'challenges'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Challenges
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'activities'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Activities
            </button>

            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'leaderboard'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Leaderboard
            </button>
          </div>

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
                    <h3 className="text-lg font-bold mb-2">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-neutral-600 text-sm mb-4">
                      {challenge.description}
                    </p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Participants:</span>
                        <span className="font-semibold text-neutral-900">
                          {challenge.participant_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Reward:</span>
                        <span className="font-semibold text-primary-600">
                          +{challenge.points_reward} pts
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-600">Duration:</span>
                        <span className="font-semibold text-neutral-900">
                          {challenge.duration_days} days
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleJoinChallenge(challenge.id)}
                      disabled={joiningChallenge === challenge.id || challenge.user_joined}
                      className={`w-full btn btn-sm ${
                        challenge.user_joined
                          ? 'btn-outline opacity-50 cursor-not-allowed'
                          : 'btn-primary'
                      } flex items-center justify-center gap-2`}
                    >
                      {joiningChallenge === challenge.id ? (
                        <>
                          <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Joining...
                        </>
                      ) : challenge.user_joined ? (
                        'Joined'
                      ) : (
                        <>
                          <Trophy className="w-4 h-4" />
                          Join Challenge
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-neutral-600 text-sm">
                        {activity.description}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : activity.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {activity.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">
                      Reward: <span className="font-semibold text-primary-600">+{activity.points_reward} pts</span>
                    </span>
                    <button className="btn btn-primary btn-sm flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700">
                        User
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-700">
                        Points
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-700">
                        Tier
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-700">
                        Badges
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry.user_id}
                        className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {index < 3 ? (
                              <Medal className={`w-5 h-5 ${
                                index === 0 ? 'text-yellow-500' :
                                index === 1 ? 'text-gray-400' :
                                'text-orange-400'
                              }`} />
                            ) : (
                              <span className="font-semibold text-neutral-900">
                                #{index + 1}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-neutral-900">
                            {entry.user?.first_name} {entry.user?.last_name}
                          </p>
                          <p className="text-xs text-neutral-600">
                            {entry.user?.job_title}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-primary-600">
                            {entry.total_points}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            entry.tier === 'gold'
                              ? 'bg-yellow-100 text-yellow-800'
                              : entry.tier === 'silver'
                              ? 'bg-gray-100 text-gray-800'
                              : entry.tier === 'bronze'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}>
                            {entry.tier}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-semibold text-neutral-900">
                            {entry.badges_earned}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default ActivityHubScreen