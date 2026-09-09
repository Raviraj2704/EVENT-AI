// ============================================================================
// COMPONENT: Admin Stat Card
// ============================================================================
// File: frontend/src/components/AdminStatCard.jsx
// Purpose: Display admin dashboard statistics
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const AdminStatCard = ({
  title,
  value,
  icon,
  trend,
  trendDirection, // 'up', 'down', 'neutral'
  color,
  onClick,
}) => {
  const getTrendColor = () => {
    if (trendDirection === 'up') return '#10b981';
    if (trendDirection === 'down') return '#ef4444';
    return '#6b7280';
  };

  const getTrendIcon = () => {
    if (trendDirection === 'up') return '📈';
    if (trendDirection === 'down') return '📉';
    return '➡️';
  };

  return (
    <div
      className="admin-stat-card"
      onClick={onClick}
      style={{
        borderLeftColor: color,
      }}
    >
      <div className="admin-stat-card-header">
        <h3 className="admin-stat-card-title">{title}</h3>
        <span className="admin-stat-card-icon">{icon}</span>
      </div>

      <div className="admin-stat-card-body">
        <p className="admin-stat-card-value">{value}</p>
        {trend && (
          <p
            className="admin-stat-card-trend"
            style={{ color: getTrendColor() }}
          >
            {getTrendIcon()} {trend}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;