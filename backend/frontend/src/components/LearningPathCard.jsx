// ============================================================================
// COMPONENT: Learning Path Card
// ============================================================================
// File: frontend/src/components/LearningPathCard.jsx
// Purpose: Display individual learning path
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const LearningPathCard = ({
  path,
  onCardClick,
  userProgress,
  isEnrolled,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // ============= GET PROGRESS PERCENTAGE =============
  const getProgressPercentage = () => {
    if (!isEnrolled || !userProgress) return 0;
    const pathProgress = userProgress.find((p) => p.pathId === path.id);
    return pathProgress ? pathProgress.progress : 0;
  };

  // ============= GET DIFFICULTY COLOR =============
  const getDifficultyColor = (level) => {
    const colors = {
      beginner: '#10b981',
      intermediate: '#3b82f6',
      advanced: '#f59e0b',
      expert: '#ef4444',
    };
    return colors[level] || '#6b7280';
  };

  const progress = getProgressPercentage();

  return (
    <div
      className={`learning-path-card ${isHovered ? 'learning-path-card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick?.(path)}
    >
      {/* Image */}
      <div className="learning-path-card-image">
        <div
          className="learning-path-card-image-placeholder"
          style={{
            background: `linear-gradient(135deg, ${getDifficultyColor(path.level)} 0%, #00d9ff 100%)`,
          }}
        >
          <span className="learning-path-card-image-icon">{path.icon}</span>
        </div>

        {/* Enrollment Badge */}
        {isEnrolled && (
          <div className="learning-path-card-enrollment-badge">
            ✓ Enrolled
          </div>
        )}
      </div>

      {/* Content */}
      <div className="learning-path-card-content">
        {/* Header */}
        <div className="learning-path-card-header">
          <div className="learning-path-card-badges">
            <span
              className="learning-path-card-difficulty"
              style={{ backgroundColor: getDifficultyColor(path.level) }}
            >
              {path.level.charAt(0).toUpperCase() + path.level.slice(1)}
            </span>
            <span className="learning-path-card-time">⏱️ {path.duration}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="learning-path-card-title">{path.title}</h3>

        {/* Description */}
        <p className="learning-path-card-description">
          {path.description.length > 100
            ? `${path.description.substring(0, 100)}...`
            : path.description}
        </p>

        {/* Instructor */}
        <div className="learning-path-card-instructor">
          <img
            src={path.instructor.avatar}
            alt={path.instructor.name}
            className="learning-path-card-instructor-avatar"
          />
          <div className="learning-path-card-instructor-info">
            <p className="learning-path-card-instructor-name">
              {path.instructor.name}
            </p>
            <p className="learning-path-card-instructor-role">Instructor</p>
          </div>
        </div>

        {/* Rating & Enrollment */}
        <div className="learning-path-card-stats">
          <div className="learning-path-card-stat">
            <span className="learning-path-card-stat-icon">⭐</span>
            <span className="learning-path-card-stat-text">
              {path.rating.toFixed(1)} ({path.enrollments})
            </span>
          </div>
          <div className="learning-path-card-stat">
            <span className="learning-path-card-stat-icon">📚</span>
            <span className="learning-path-card-stat-text">
              {path.modules.length} modules
            </span>
          </div>
        </div>

        {/* Progress Bar (if enrolled) */}
        {isEnrolled && (
          <div className="learning-path-card-progress-section">
            <div className="learning-path-card-progress-bar">
              <div
                className="learning-path-card-progress-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#10b981',
                }}
              />
            </div>
            <span className="learning-path-card-progress-text">
              {progress}% complete
            </span>
          </div>
        )}

        {/* CTA Button */}
        <button
          className="learning-path-card-action-button"
          onClick={(e) => {
            e.stopPropagation();
            onCardClick?.(path);
          }}
        >
          {isEnrolled ? '→ Continue Learning' : '→ View Path'}
        </button>
      </div>
    </div>
  );
};

export default LearningPathCard;