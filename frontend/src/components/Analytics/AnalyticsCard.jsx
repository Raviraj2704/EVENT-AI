// ============================================================================
// COMPONENT: Analytics Card
// ============================================================================
// File: frontend/src/components/AnalyticsCard.jsx
// Purpose: Card for displaying analytics insights
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const AnalyticsCard = ({ title, icon, value, description, insights = [] }) => {
  return (
    <div className="analytics-card">
      {/* Header */}
      <div className="analytics-card-header">
        <div className="analytics-card-icon">{icon}</div>
        <h3 className="analytics-card-title">{title}</h3>
      </div>

      {/* Value */}
      <div className="analytics-card-value-section">
        <p className="analytics-card-value">{value}</p>
        {description && (
          <p className="analytics-card-description">{description}</p>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="analytics-card-insights">
          {insights.map((insight, index) => (
            <div key={index} className="analytics-card-insight-item">
              <span className="analytics-card-insight-icon">•</span>
              <span className="analytics-card-insight-text">{insight}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;