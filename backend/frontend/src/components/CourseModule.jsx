// ============================================================================
// COMPONENT: Course Module
// ============================================================================
// File: frontend/src/components/CourseModule.jsx
// Purpose: Display individual course module with progress
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const CourseModule = ({
  module,
  isCompleted,
  onModuleClick,
  userProgress,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // ============= CALCULATE PROGRESS PERCENTAGE =============
  const getProgressPercentage = () => {
    if (!userProgress) return 0;
    const progressData = userProgress.find((p) => p.moduleId === module.id);
    if (!progressData) return 0;
    return progressData.progress;
  };

  // ============= GET STATUS COLOR =============
  const getStatusColor = () => {
    const progress = getProgressPercentage();
    if (progress === 100) return '#10b981'; // Green
    if (progress >= 50) return '#3b82f6'; // Blue
    if (progress > 0) return '#f59e0b'; // Orange
    return '#e5e7eb'; // Gray
  };

  const progress = getProgressPercentage();

  return (
    <div className={`course-module ${isCompleted ? 'course-module-completed' : ''}`}>
      {/* Header */}
      <div
        className="course-module-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="course-module-title-section">
          <span className="course-module-icon">{module.icon}</span>
          <div className="course-module-title-content">
            <h4 className="course-module-title">{module.title}</h4>
            <p className="course-module-subtitle">
              {module.duration} • {module.lessons} lessons
            </p>
          </div>
        </div>

        <div className="course-module-controls">
          {isCompleted && (
            <span className="course-module-badge">✓ Complete</span>
          )}
          <button
            className="course-module-expand-button"
            aria-label="Expand module"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="course-module-progress-container">
        <div className="course-module-progress-bar">
          <div
            className="course-module-progress-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: getStatusColor(),
            }}
          />
        </div>
        <span className="course-module-progress-text">{progress}%</span>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="course-module-content">
          {/* Description */}
          <p className="course-module-description">{module.description}</p>

          {/* Lessons */}
          <div className="course-module-lessons">
            <h5 className="course-module-lessons-title">Lessons</h5>
            <ul className="course-module-lessons-list">
              {module.lessons_list.map((lesson, index) => (
                <li key={index} className="course-module-lesson-item">
                  <span className="course-module-lesson-icon">
                    {lesson.completed ? '✓' : '○'}
                  </span>
                  <span className="course-module-lesson-title">
                    {lesson.title}
                  </span>
                  <span className="course-module-lesson-time">
                    {lesson.duration}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skills Covered */}
          <div className="course-module-skills">
            <h5 className="course-module-skills-title">Skills Covered</h5>
            <div className="course-module-skills-list">
              {module.skills.map((skill, index) => (
                <span key={index} className="course-module-skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            className="course-module-action-button"
            onClick={() => onModuleClick?.(module.id)}
          >
            {isCompleted ? '✓ Review' : '▶ Start Learning'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseModule;