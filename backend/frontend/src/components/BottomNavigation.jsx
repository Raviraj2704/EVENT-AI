// ============================================================================
// COMPONENT: Bottom Navigation Bar (5 Tabs)
// ============================================================================
// File: frontend/src/components/BottomNavigation.jsx
// Purpose: Fixed bottom navigation with 5 main tabs
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'sessions', label: 'Sessions', icon: '📅' },
    { id: 'hub', label: 'Hub', icon: '🎛️' },
    { id: 'networking', label: 'Networking', icon: '👥' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-content">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`bottom-nav-tab ${activeTab === tab.id ? 'bottom-nav-tab-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="bottom-nav-icon">{tab.icon}</span>
            <span className="bottom-nav-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;