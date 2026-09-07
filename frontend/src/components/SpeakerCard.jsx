// ============================================================================
// COMPONENT: Speaker Card
// ============================================================================
// File: frontend/src/components/SpeakerCard.jsx
// Purpose: Display featured speaker info
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const SpeakerCard = ({ speaker }) => {
  return (
    <div className="speaker-card">
      <div className="speaker-card-image">
        {speaker.avatar ? (
          <img src={speaker.avatar} alt={speaker.name} />
        ) : (
          <div className="speaker-card-placeholder">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="speaker-card-content">
        <h3 className="speaker-card-name">{speaker.name}</h3>
        <p className="speaker-card-title">{speaker.title}</p>
      </div>
    </div>
  );
};

export default SpeakerCard;