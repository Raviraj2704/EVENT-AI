// ============================================================================
// COMPONENT: Quick Action Card (2x2 Grid)
// ============================================================================
// File: frontend/src/components/QuickActionCard.jsx
// Purpose: Display quick action buttons in grid
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const QuickActionCard = ({ icon, label, onClick, variant = 'gradient1' }) => {
  const variants = {
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  };

  return (
    <button
      className="quick-action-card"
      onClick={onClick}
      style={{ background: variants[variant] || variants.gradient1 }}
    >
      <span className="quick-action-icon">{icon}</span>
      <span className="quick-action-label">{label}</span>
    </button>
  );
};

export default QuickActionCard;