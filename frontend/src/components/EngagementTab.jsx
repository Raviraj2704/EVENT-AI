// ============================================================================
// COMPONENT: Engagement Tab
// ============================================================================
// File: frontend/src/components/EngagementTab.jsx
// Purpose: Tab navigation for engagement categories
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const EngagementTab = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="engagement-tabs">
      <div className="engagement-tabs-scroll">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`engagement-tab ${
              activeTab === tab.id ? 'engagement-tab-active' : ''
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="engagement-tab-icon">{tab.icon}</span>
            <span className="engagement-tab-label">{tab.label}</span>
            {tab.count > 0 && (
              <span className="engagement-tab-badge">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EngagementTab;