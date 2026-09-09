// ============================================================================
// COMPONENT: Partner Filters (Combined Search, Types, and Categories)
// ============================================================================
// File: frontend/src/components/Partners/PartnerFilters.jsx
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const PartnerFilters = ({ 
  // Props from Existing Code
  partnerType, 
  setPartnerType, 
  searchTerm, 
  setSearchTerm,
  
  // Props from Updated Code
  categories = [], 
  activeCategory, 
  onCategoryChange 
}) => {
  
  // EXISTING CODE LOGIC
  const types = [
    { id: 'all', label: 'All Partners' },
    { id: 'platinum', label: 'Platinum' },
    { id: 'gold', label: 'Gold' },
    { id: 'silver', label: 'Silver' },
    { id: 'bronze', label: 'Bronze' },
    { id: 'community', label: 'Community' },
    { id: 'media', label: 'Media' }
  ];

  return (
    <div className="combined-partner-filters">
      
      {/* ========================================== */}
      {/* EXISTING CODE UI (Search & Type Buttons)   */}
      {/* ========================================== */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search input */}
          <div className="w-full md:w-1/3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search partners..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex gap-2 flex-wrap w-full md:w-auto justify-end">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setPartnerType(t.id)}
                className={`
                  px-3 py-1.5 rounded-lg font-semibold text-xs transition-all capitalize
                  ${partnerType === t.id
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                {t.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* UPDATED CODE UI (Category Filter Scroll)     */}
      {/* ========================================== */}
      {categories && categories.length > 0 && (
        <div className="partner-category-filter">
          <div className="partner-category-scroll">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`partner-category-button ${
                  activeCategory === category.id ? 'partner-category-button-active' : ''
                }`}
                onClick={() => onCategoryChange(category.id)}
              >
                <span className="partner-category-icon">{category.icon}</span>
                <span className="partner-category-label">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PartnerFilters;