// ============================================================================
// COMPONENT: Profile Settings Item
// ============================================================================
// File: frontend/src/components/ProfileSettingsItem.jsx
// Purpose: Display individual settings or menu item with navigation
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const ProfileSettingsItem = ({
  icon,
  label,
  description,
  value,
  onClick,
  showArrow = true,
  variant = 'default',
}) => {
  return (
    <button
      className={`profile-settings-item profile-settings-item-${variant}`}
      onClick={onClick}
      aria-label={label}
    >
      <div className="profile-settings-item-icon">{icon}</div>
      <div className="profile-settings-item-content">
        <p className="profile-settings-item-label">{label}</p>
        {description && (
          <p className="profile-settings-item-description">{description}</p>
        )}
        {value && <p className="profile-settings-item-value">{value}</p>}
      </div>
      {showArrow && (
        <svg
          className="profile-settings-item-arrow"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      )}
    </button>
  );
};

export default ProfileSettingsItem;