// ============================================================================
// COMPONENT: Badge Card
// ============================================================================
// File: frontend/src/components/BadgeCard.jsx
// Purpose: Display individual badge with unlock status
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const BadgeCard = ({ badge, isUnlocked }) => {
  return (
    <div className={`badge-card ${isUnlocked ? 'badge-card-unlocked' : 'badge-card-locked'}`}>
      <div className="badge-card-icon-container">
        <div
          className="badge-card-icon"
          style={{
            opacity: isUnlocked ? 1 : 0.4,
            filter: isUnlocked ? 'none' : 'grayscale(100%)',
          }}
        >
          {badge.icon}
        </div>
        {isUnlocked && <div className="badge-card-checkmark">✓</div>}
      </div>

      <h4 className="badge-card-name">{badge.name}</h4>
      <p className="badge-card-description">{badge.description}</p>

      {!isUnlocked && (
        <div className="badge-card-progress">
          <div className="badge-card-progress-bar">
            <div
              className="badge-card-progress-fill"
              style={{ width: `${badge.progress}%` }}
            />
          </div>
          <p className="badge-card-progress-text">{badge.progress}%</p>
        </div>
      )}

      {isUnlocked && (
        <p className="badge-card-unlocked-text">🎉 Unlocked!</p>
      )}
    </div>
  );
};

export default BadgeCard;