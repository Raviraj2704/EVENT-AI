// ============================================================================
// COMPONENT: Speaker Search Filter
// ============================================================================
// File: frontend/src/components/SpeakerSearchFilter.jsx
// Purpose: Filter and search speakers by expertise and experience
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const SpeakerSearchFilter = ({
  expertise,
  activeExpertise,
  onExpertiseChange,
  experienceLevels,
  activeExperience,
  onExperienceChange,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="speaker-filters">
      {/* Search Bar */}
      <div className="speaker-filter-search">
        <svg className="speaker-filter-search-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="speaker-filter-search-input"
          placeholder="Search by name, company, or topic..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Expertise Filter */}
      <div className="speaker-filter-group">
        <h3 className="speaker-filter-title">Expertise</h3>
        <div className="speaker-filter-options">
          {expertise.map((exp) => (
            <button
              key={exp.id}
              className={`speaker-filter-option ${
                activeExpertise === exp.id ? 'speaker-filter-option-active' : ''
              }`}
              onClick={() => onExpertiseChange(exp.id)}
            >
              <span className="speaker-filter-icon">{exp.icon}</span>
              <span className="speaker-filter-label">{exp.label}</span>
              {exp.count > 0 && (
                <span className="speaker-filter-count">{exp.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level Filter */}
      <div className="speaker-filter-group">
        <h3 className="speaker-filter-title">Experience</h3>
        <div className="speaker-filter-options">
          {experienceLevels.map((level) => (
            <button
              key={level.id}
              className={`speaker-filter-option ${
                activeExperience === level.id ? 'speaker-filter-option-active' : ''
              }`}
              onClick={() => onExperienceChange(level.id)}
            >
              <span className="speaker-filter-icon">{level.icon}</span>
              <span className="speaker-filter-label">{level.label}</span>
              {level.count > 0 && (
                <span className="speaker-filter-count">{level.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeakerSearchFilter;