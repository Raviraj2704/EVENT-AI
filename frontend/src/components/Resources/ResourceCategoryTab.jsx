// ============================================================================
// COMPONENT: Resource Category Tab
// ============================================================================
// File: frontend/src/components/ResourceCategoryTab.jsx
// Purpose: Tab navigation for resource categories
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const ResourceCategoryTab = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="resource-category-tab">
      <div className="resource-category-scroll">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`resource-category-button ${
              activeCategory === category.id ? 'resource-category-button-active' : ''
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="resource-category-icon">{category.icon}</span>
            <span className="resource-category-label">{category.label}</span>
            {category.count > 0 && (
              <span className="resource-category-count">{category.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResourceCategoryTab;