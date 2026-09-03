// ============================================================================
// COMPONENT: Speaker Detail Modal
// ============================================================================
// File: frontend/src/components/SpeakerDetailModal.jsx
// Purpose: Modal for viewing detailed speaker profile
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const SpeakerDetailModal = ({
  speaker,
  isOpen,
  onClose,
  onConnect,
  onFollowUp,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  if (!isOpen || !speaker) return null;

  // ============= GET EXPERIENCE BADGE =============
  const getExperienceBadge = (level) => {
    const badges = {
      expert: { icon: '🌟', label: 'Expert', color: '#fbbf24' },
      advanced: { icon: '⭐', label: 'Advanced', color: '#3b82f6' },
      intermediate: { icon: '📊', label: 'Intermediate', color: '#10b981' },
      beginner: { icon: '🌱', label: 'Beginner', color: '#6b7280' },
    };
    return badges[level] || badges.intermediate;
  };

  const badge = getExperienceBadge(speaker.experienceLevel);

  return (
    <div className="speaker-detail-modal-overlay" onClick={onClose}>
      <div
        className="speaker-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="speaker-detail-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header with Image */}
        <div className="speaker-detail-modal-header">
          <img
            src={speaker.avatar}
            alt={speaker.name}
            className="speaker-detail-modal-avatar"
          />

          <div className="speaker-detail-modal-header-content">
            <div className="speaker-detail-modal-title-section">
              <h2 className="speaker-detail-modal-name">{speaker.name}</h2>
              <span
                className="speaker-detail-modal-experience-badge"
                style={{ backgroundColor: badge.color }}
              >
                {badge.icon} {badge.label}
              </span>
            </div>

            <p className="speaker-detail-modal-title">{speaker.title}</p>
            <p className="speaker-detail-modal-company">{speaker.company}</p>

            {/* Rating */}
            <div className="speaker-detail-modal-rating">
              <div className="speaker-detail-modal-stars">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`speaker-detail-modal-star ${
                      i < Math.floor(speaker.rating)
                        ? 'speaker-detail-modal-star-filled'
                        : ''
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="speaker-detail-modal-rating-text">
                {speaker.rating.toFixed(1)} ({speaker.ratingCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="speaker-detail-modal-body">
          {/* Bio */}
          <div className="speaker-detail-section">
            <h3 className="speaker-detail-section-title">About</h3>
            <p className="speaker-detail-section-content">{speaker.bio}</p>
          </div>

          {/* Expertise Areas */}
          <div className="speaker-detail-section">
            <h3 className="speaker-detail-section-title">Expertise</h3>
            <div className="speaker-detail-tags">
              {speaker.expertise.map((exp, index) => (
                <span key={index} className="speaker-detail-tag">
                  {exp.icon} {exp.name}
                </span>
              ))}
            </div>
          </div>

          {/* Speaking Topics */}
          <div className="speaker-detail-section">
            <h3 className="speaker-detail-section-title">Speaking Topics</h3>
            <ul className="speaker-detail-list">
              {speaker.topics.map((topic, index) => (
                <li key={index} className="speaker-detail-list-item">
                  📌 {topic}
                </li>
              ))}
            </ul>
          </div>

          {/* Upcoming Sessions */}
          {speaker.upcomingSessions && speaker.upcomingSessions.length > 0 && (
            <div className="speaker-detail-section">
              <h3 className="speaker-detail-section-title">Upcoming Sessions</h3>
              <div className="speaker-detail-sessions">
                {speaker.upcomingSessions.map((session, index) => (
                  <div key={index} className="speaker-detail-session">
                    <p className="speaker-detail-session-title">
                      {session.title}
                    </p>
                    <p className="speaker-detail-session-time">
                      📅 {session.time}
                    </p>
                    <p className="speaker-detail-session-location">
                      📍 {session.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="speaker-detail-section">
            <h3 className="speaker-detail-section-title">Connect</h3>
            <div className="speaker-detail-social-links">
              {speaker.socialLinks.linkedin && (
                <a
                  href={speaker.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="speaker-detail-social-link"
                >
                  💼 LinkedIn
                </a>
              )}
              {speaker.socialLinks.twitter && (
                <a
                  href={speaker.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="speaker-detail-social-link"
                >
                  𝕏 Twitter
                </a>
              )}
              {speaker.socialLinks.website && (
                <a
                  href={speaker.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="speaker-detail-social-link"
                >
                  🌐 Website
                </a>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="speaker-detail-stats">
            <div className="speaker-detail-stat">
              <p className="speaker-detail-stat-value">
                {speaker.yearsOfExperience}+
              </p>
              <p className="speaker-detail-stat-label">Years Experience</p>
            </div>
            <div className="speaker-detail-stat">
              <p className="speaker-detail-stat-value">
                {speaker.talkCount}
              </p>
              <p className="speaker-detail-stat-label">Talks Given</p>
            </div>
            <div className="speaker-detail-stat">
              <p className="speaker-detail-stat-value">
                {speaker.attendees}+
              </p>
              <p className="speaker-detail-stat-label">Total Attendees</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="speaker-detail-modal-footer">
          <button
            className="speaker-detail-modal-button speaker-detail-modal-follow"
            onClick={() => {
              setIsFollowing(!isFollowing);
              onFollowUp?.(speaker.id);
            }}
          >
            {isFollowing ? '✓ Following' : '🔔 Follow'}
          </button>
          <button
            className="speaker-detail-modal-button speaker-detail-modal-connect"
            onClick={() => {
              onConnect?.(speaker.id);
              onClose?.();
            }}
          >
            🤝 Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeakerDetailModal;