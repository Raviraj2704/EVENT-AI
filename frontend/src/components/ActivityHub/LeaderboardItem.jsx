// ============================================================================
// COMPONENT: Leaderboard Item
// ============================================================================
// File: frontend/src/components/LeaderboardItem.jsx
// Purpose: Display individual user in leaderboard
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const LeaderboardItem = ({ rank, user, isCurrentUser }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <div className={`leaderboard-item ${isCurrentUser ? 'leaderboard-item-current' : ''}`}>
      <div className="leaderboard-rank" style={{ color: getMedalColor(rank) }}>
        {getRankIcon(rank)}
      </div>

      <div className="leaderboard-user-info">
        <div className="leaderboard-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <div className="leaderboard-avatar-placeholder">{user.initials}</div>
          )}
        </div>

        <div className="leaderboard-details">
          <p className="leaderboard-name">
            {user.name}
            {isCurrentUser && <span className="leaderboard-you"> (You)</span>}
          </p>
          <p className="leaderboard-title">{user.title}</p>
        </div>
      </div>

      <div className="leaderboard-points">
        <p className="leaderboard-points-number">{user.points}</p>
        <p className="leaderboard-points-label">pts</p>
      </div>
    </div>
  );
};

export default LeaderboardItem;