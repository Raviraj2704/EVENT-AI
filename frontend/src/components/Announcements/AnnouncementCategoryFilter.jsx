// ============================================================================
// COMPONENT: Announcement Category Filter
// ============================================================================
// File: frontend/src/components/AnnouncementCategoryFilter.jsx
// Purpose: Filter announcements by category and priority
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const AnnouncementCategoryFilter = ({
  categories,
  activeCategory,
  onCategoryChange,
  priorities,
  activePriority,
  onPriorityChange,
}) => {
  return (
    <div className="announcement-filters">
      {/* Category Filter */}
      <div className="announcement-filter-group">
        <h3 className="announcement-filter-title">Category</h3>
        <div className="announcement-filter-buttons">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`announcement-filter-button ${
                activeCategory === category.id ? 'announcement-filter-button-active' : ''
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className="announcement-filter-icon">{category.icon}</span>
              <span className="announcement-filter-label">{category.label}</span>
              {category.count > 0 && (
                <span className="announcement-filter-badge">{category.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="announcement-filter-group">
        <h3 className="announcement-filter-title">Priority</h3>
        <div className="announcement-filter-buttons">
          {priorities.map((priority) => (
            <button
              key={priority.id}
              className={`announcement-filter-button ${
                activePriority === priority.id ? 'announcement-filter-button-active' : ''
              }`}
              onClick={() => onPriorityChange(priority.id)}
              style={{
                borderLeftColor: priority.color,
              }}
            >
              <span className="announcement-filter-icon">{priority.icon}</span>
              <span className="announcement-filter-label">{priority.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCategoryFilter;