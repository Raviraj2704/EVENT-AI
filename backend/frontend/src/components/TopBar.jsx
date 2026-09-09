// ============================================================================
// COMPONENT: Top Bar Navigation
// ============================================================================
// File: frontend/src/components/TopBar.jsx
// Purpose: Fixed top bar with logo, notifications, and Picbot
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const TopBar = ({ onPicbotClick, notificationCount = 0 }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        {/* Logo Section */}
        <div className="top-bar-logo">
          <svg 
          viewBox="0 0 100 100" 
          className="top-bar-logo-svg w-10 h-10" 
          width="40" 
          height="40"
          xmlns="http://www.w3.org/2000/svg"
        >
            {/* Lines connecting nodes */}
            <line x1="25" y1="15" x2="75" y2="15" stroke="#0066FF" strokeWidth="1" />
            <line x1="75" y1="15" x2="75" y2="85" stroke="#0066FF" strokeWidth="1" />
            <line x1="75" y1="85" x2="25" y2="85" stroke="#0066FF" strokeWidth="1" />
            <line x1="25" y1="85" x2="25" y2="15" stroke="#0066FF" strokeWidth="1" />
            <line x1="25" y1="15" x2="50" y2="50" stroke="#0066FF" strokeWidth="1" />
            <line x1="75" y1="15" x2="50" y2="50" stroke="#0066FF" strokeWidth="1" />
            <line x1="75" y1="85" x2="50" y2="50" stroke="#0066FF" strokeWidth="1" />
            <line x1="25" y1="85" x2="50" y2="50" stroke="#0066FF" strokeWidth="1" />

            {/* Nodes */}
            <circle cx="25" cy="15" r="4" fill="#001F5C" />
            <circle cx="75" cy="15" r="4" fill="#001F5C" />
            <circle cx="75" cy="85" r="4" fill="#001F5C" />
            <circle cx="25" cy="85" r="4" fill="#001F5C" />
            <circle cx="50" cy="50" r="3" fill="#0066FF" />
          </svg>
          <span className="top-bar-logo-text">EVENT AI</span>
        </div>

        {/* Right Icons */}
        <div className="top-bar-icons">
          {/* Notifications Bell */}
          <button
            className="top-bar-icon-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 3.36 6 5.92 6 9v5l-2 2v1h16v-1l-2-2z" />
            </svg>
            {notificationCount > 0 && (
              <span className="top-bar-notification-badge">{notificationCount}</span>
            )}
          </button>

          {/* Picbot Chat Button */}
          <button
            className="top-bar-icon-button top-bar-picbot-button"
            onClick={onPicbotClick}
            aria-label="Picbot AI Assistant"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;