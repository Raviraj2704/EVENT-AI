// ============================================================================
// COMPONENT: Engagement Card
// ============================================================================
// File: frontend/src/components/EngagementCard.jsx
// Purpose: Display individual engagement activity or challenge
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const EngagementCard = ({
  item,
  type, // 'activity', 'challenge', 'poll', 'quiz'
  onCardClick,
  onAction,
}) => {
  const isCompleted = item.completed || item.status === 'completed';

  // ============= GET DIFFICULTY COLOR =============
  const getDifficultyColor = (level) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
    };
    return colors[level] || '#6b7280';
  };

  // ============= GET PRIORITY COLOR =============
  const getPriorityColor = (priority) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#10b981',
    };
    return colors[priority] || '#6b7280';
  };

  if (type === 'challenge') {
    return (
      <div
        className={`engagement-card engagement-card-challenge ${
          isCompleted ? 'engagement-card-completed' : ''
        }`}
        onClick={() => onCardClick?.(item)}
      >
        {/* Header */}
        <div className="engagement-card-header">
          <span className="engagement-card-icon">{item.icon}</span>
          <div className="engagement-card-title-section">
            <h3 className="engagement-card-title">{item.title}</h3>
            <p className="engagement-card-subtitle">
              {item.participants} participants
            </p>
          </div>
          {isCompleted && (
            <span className="engagement-card-badge">✓</span>
          )}
        </div>

        {/* Content */}
        <p className="engagement-card-description">{item.description}</p>

        {/* Meta */}
        <div className="engagement-card-meta">
          <span
            className="engagement-card-difficulty"
            style={{
              backgroundColor: getDifficultyColor(item.difficulty),
            }}
          >
            {item.difficulty}
          </span>
          <span className="engagement-card-duration">⏱️ {item.duration}</span>
        </div>

        {/* Rewards */}
        <div className="engagement-card-rewards">
          <span className="engagement-card-reward-item">
            ⭐ {item.points} pts
          </span>
          <span className="engagement-card-reward-item">
            🏆 {item.badge}
          </span>
        </div>

        {/* Footer */}
        <div className="engagement-card-footer">
          <span className="engagement-card-date">{item.endDate}</span>
          <button
            className="engagement-card-action-button"
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(item.id);
            }}
          >
            {isCompleted ? 'View Results' : 'Join'}
          </button>
        </div>
      </div>
    );
  }

  if (type === 'poll') {
    return (
      <div
        className="engagement-card engagement-card-poll"
        onClick={() => onCardClick?.(item)}
      >
        {/* Header */}
        <div className="engagement-card-header">
          <span className="engagement-card-icon">📊</span>
          <div className="engagement-card-title-section">
            <h3 className="engagement-card-title">{item.question}</h3>
            <p className="engagement-card-subtitle">
              {item.votes} votes
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="engagement-card-poll-options">
          {item.options.map((option, index) => (
            <div key={index} className="engagement-card-poll-option">
              <p className="engagement-card-poll-option-text">
                {option.text}
              </p>
              <div className="engagement-card-poll-progress">
                <div
                  className="engagement-card-poll-progress-fill"
                  style={{ width: `${option.percentage}%` }}
                />
              </div>
              <span className="engagement-card-poll-percentage">
                {option.percentage}%
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="engagement-card-footer">
          <span className="engagement-card-date">{item.expiresIn}</span>
          <button
            className="engagement-card-action-button"
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(item.id);
            }}
          >
            Vote
          </button>
        </div>
      </div>
    );
  }

  if (type === 'quiz') {
    return (
      <div
        className={`engagement-card engagement-card-quiz ${
          isCompleted ? 'engagement-card-completed' : ''
        }`}
        onClick={() => onCardClick?.(item)}
      >
        {/* Header */}
        <div className="engagement-card-header">
          <span className="engagement-card-icon">❓</span>
          <div className="engagement-card-title-section">
            <h3 className="engagement-card-title">{item.title}</h3>
            <p className="engagement-card-subtitle">
              {item.questions} questions
            </p>
          </div>
          {isCompleted && (
            <span className="engagement-card-badge">✓</span>
          )}
        </div>

        {/* Content */}
        <p className="engagement-card-description">{item.description}</p>

        {/* Score (if completed) */}
        {isCompleted && (
          <div className="engagement-card-score">
            <p className="engagement-card-score-label">Your Score</p>
            <p className="engagement-card-score-value">{item.score}%</p>
          </div>
        )}

        {/* Meta */}
        <div className="engagement-card-meta">
          <span className="engagement-card-duration">⏱️ {item.duration}</span>
          <span
            className="engagement-card-difficulty"
            style={{
              backgroundColor: getDifficultyColor(item.difficulty),
            }}
          >
            {item.difficulty}
          </span>
        </div>

        {/* Footer */}
        <div className="engagement-card-footer">
          <span className="engagement-card-date">{item.deadline}</span>
          <button
            className="engagement-card-action-button"
            onClick={(e) => {
              e.stopPropagation();
              onAction?.(item.id);
            }}
          >
            {isCompleted ? 'Retake' : 'Take Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // Default: Activity
  return (
    <div
      className={`engagement-card engagement-card-activity ${
        isCompleted ? 'engagement-card-completed' : ''
      }`}
      onClick={() => onCardClick?.(item)}
    >
      {/* Header */}
      <div className="engagement-card-header">
        <span className="engagement-card-icon">{item.icon}</span>
        <div className="engagement-card-title-section">
          <h3 className="engagement-card-title">{item.title}</h3>
          <p className="engagement-card-subtitle">{item.category}</p>
        </div>
        {isCompleted && (
          <span className="engagement-card-badge">✓</span>
        )}
      </div>

      {/* Content */}
      <p className="engagement-card-description">{item.description}</p>

      {/* Meta */}
      <div className="engagement-card-meta">
        <span
          className="engagement-card-priority"
          style={{
            backgroundColor: getPriorityColor(item.priority),
          }}
        >
          {item.priority}
        </span>
        <span className="engagement-card-points">⭐ {item.points} pts</span>
      </div>

      {/* Footer */}
      <div className="engagement-card-footer">
        <span className="engagement-card-date">{item.dueDate}</span>
        <button
          className="engagement-card-action-button"
          onClick={(e) => {
            e.stopPropagation();
            onAction?.(item.id);
          }}
        >
          {isCompleted ? 'View' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default EngagementCard;