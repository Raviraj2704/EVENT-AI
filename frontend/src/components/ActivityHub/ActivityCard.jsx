// ============================================================================
// COMPONENT: Activity Card
// ============================================================================
// File: frontend/src/components/ActivityHub/ActivityCard.jsx
// Purpose: Display individual user activity and points earned
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const ActivityCard = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      session_attended: '📋',
      review_posted: '⭐',
      connection_made: '🤝',
      message_sent: '💬',
      favorite_added: '❤️',
      profile_viewed: '👁️'
    };
    return icons[type] || '✓';
  };

  const getActivityColor = (type) => {
    const colors = {
      session_attended: 'from-blue-500 to-blue-600',
      review_posted: 'from-yellow-500 to-yellow-600',
      connection_made: 'from-purple-500 to-purple-600',
      message_sent: 'from-pink-500 to-pink-600',
      favorite_added: 'from-red-500 to-red-600',
      profile_viewed: 'from-green-500 to-green-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`
      bg-gradient-to-r ${getActivityColor(activity.activity_type)}
      text-white rounded-lg p-4 mb-3
      flex items-center justify-between hover:shadow-lg transition-all
    `}>
      <div className="flex items-center gap-3 flex-1">
        <span className="text-3xl">{getActivityIcon(activity.activity_type)}</span>
        <div>
          <p className="font-bold">{activity.activity_title}</p>
          <p className="text-sm opacity-90">
            {new Date(activity.created_at).toLocaleDateString()} {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">+{activity.points_earned}</p>
        <p className="text-xs opacity-75">pts</p>
      </div>
    </div>
  );
};

export default ActivityCard;