// ============================================================================
// FEATURE: PAGE 12 - ACTIVITY HUB SCREEN (DARK THEME)
// ============================================================================
// File: src/pages/ActivityPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// INLINE COMPONENTS (Prevents missing file crashes!)
// ============================================================================
const PointsCard = ({ points, nextMilestone, pointsNeeded }) => (
  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg">
    <h3 className="text-lg font-bold opacity-90">Your Total Points</h3>
    <div className="text-4xl font-extrabold my-2">{points}</div>
    <p className="text-sm opacity-80">{pointsNeeded} points needed for Level {nextMilestone}</p>
  </div>
);

const BadgeCard = ({ badge, isUnlocked }) => (
  <div className={`p-4 rounded-xl border ${isUnlocked ? 'bg-orange-500/20 border-orange-500/50' : 'bg-slate-800/80 border-slate-700 opacity-60'} flex flex-col items-center text-center`}>
    <div className="text-3xl mb-2">{badge.icon}</div>
    <h4 className="font-bold text-sm text-slate-200">{badge.name}</h4>
    <p className="text-xs text-slate-400 mt-1">{badge.description}</p>
  </div>
);

const LeaderboardItem = ({ rank, user, isCurrentUser }) => (
  <div className={`flex items-center gap-4 p-3 rounded-lg ${isCurrentUser ? 'bg-orange-500/20 border border-orange-500/50' : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-700/50'}`}>
    <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${rank <= 3 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
      {rank}
    </div>
    <div className="flex-1">
      <h4 className={`font-bold ${isCurrentUser ? 'text-orange-400' : 'text-slate-200'}`}>{user.name}</h4>
      <p className="text-xs text-slate-400">{user.title}</p>
    </div>
    <div className="font-bold text-orange-500">{user.points} pts</div>
  </div>
);

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
const ActivityPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [userPoints, setUserPoints] = useState(245);

  const badges = [
    { id: 'early-bird', icon: '🌅', name: 'Early Bird', description: 'Register before 30 days', progress: 100 },
    { id: 'session-star', icon: '⭐', name: 'Session Star', description: 'Attend 3+ sessions', progress: 100 },
    { id: 'networking-ace', icon: '🤝', name: 'Networking Ace', description: 'Connect with 5+ professionals', progress: 60 },
    { id: 'knowledge-seeker', icon: '🎓', name: 'Knowledge Seeker', description: 'Complete learning path', progress: 40 },
    { id: 'ai-match', icon: '🎯', name: 'AI Match', description: 'Connect with AI recommendation', progress: 100 },
    { id: 'community-star', icon: '💫', name: 'Community Star', description: 'Get 10+ likes on social posts', progress: 70 },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Sarah Johnson', title: 'Chief HR Officer', points: 485, type: 'professional' },
    { rank: 2, name: 'Mike Chen', title: 'HR Director', points: 420, type: 'professional' },
    { rank: 3, name: 'Emily Davis', title: 'Talent Manager', points: 395, type: 'professional' },
    { rank: 4, name: 'You (User)', title: userProfile?.jobTitle || 'HR Professional', points: userPoints, type: 'self' },
    { rank: 5, name: 'David Martinez', title: 'HR Executive', points: 310, type: 'professional' },
  ];

  const activityLog = [
    { id: 1, action: 'Attended Session', description: 'AI-Ready HR Leaders', points: 10, timestamp: new Date(Date.now() - 3600000), icon: '📅' },
    { id: 2, action: 'Connected with Professional', description: 'Sarah Johnson', points: 5, timestamp: new Date(Date.now() - 7200000), icon: '🤝' },
    { id: 3, action: 'Posted on Social Wall', description: 'Got 8 likes', points: 15, timestamp: new Date(Date.now() - 10800000), icon: '💬' },
    { id: 5, action: 'Badge Unlocked', description: 'Early Bird Badge', points: 50, timestamp: new Date(Date.now() - 86400000), icon: '🌅' },
  ];

  useEffect(() => {
    // MOCK LOGIN: Prevents auth redirects from kicking you to splash screen
    const profile = sessionStorage.getItem('userProfile');
    if (!profile) {
      setUserProfile({ firstName: "Ravi", lastName: "Raja", jobTitle: "Developer" });
    } else {
      setUserProfile(JSON.parse(profile));
    }
    
    // Stop loading state immediately
    setLoading(false);
  }, []);

  const getUnlockedBadges = () => badges.filter((b) => b.progress === 100);
  const filteredLeaderboard = leaderboardData.sort((a, b) => b.points - a.points);
  const unlockedBadges = getUnlockedBadges();
  const pointsNeeded = 100 - (userPoints % 100);

  if (loading) return <div className="p-12 text-center font-bold text-slate-200">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header & Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/hub')} 
            className="p-2 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">🎮 Activity Hub</h1>
            <p className="text-slate-400">Track your engagement and earn badges</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-700 overflow-x-auto mb-8">
          {['overview', 'badges', 'leaderboard'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold border-b-2 transition-all capitalize ${
                activeTab === tab 
                ? 'border-orange-500 text-orange-500' 
                : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <PointsCard points={userPoints} nextMilestone={Math.floor(userPoints / 100) + 1} pointsNeeded={pointsNeeded} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-2xl mb-1">📅</div>
                <p className="text-sm text-slate-400">Sessions</p>
                <p className="text-xl font-bold text-white">4</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-2xl mb-1">🤝</div>
                <p className="text-sm text-slate-400">Connections</p>
                <p className="text-xl font-bold text-white">8</p>
              </div>
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                <div className="text-2xl mb-1">🏆</div>
                <p className="text-sm text-slate-400">Badges</p>
                <p className="text-xl font-bold text-white">{unlockedBadges.length}</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-white">Recent Activity</h3>
              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-200">{activity.action}</p>
                      <p className="text-sm text-slate-400">{activity.description}</p>
                    </div>
                    <p className="font-bold text-green-400">+{activity.points}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-white">Unlocked ({unlockedBadges.length}/{badges.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {unlockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} isUnlocked={true} />
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-4 text-white">In Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.filter((b) => b.progress < 100).map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} isUnlocked={false} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-8">
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-xl font-bold mb-6 text-white">Global Leaderboard</h3>
              <div className="space-y-3">
                {filteredLeaderboard.map((user, index) => (
                  <LeaderboardItem key={index} rank={index + 1} user={user} isCurrentUser={user.type === 'self'} />
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ActivityPage;