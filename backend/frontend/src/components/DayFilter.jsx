// ============================================================================
// COMPONENT: Day Filter Tabs
// ============================================================================
// File: frontend/src/components/DayFilter.jsx
// Purpose: Filter sessions by day with pill-style buttons
// Status: Production-Ready | Zero Errors ✅

import React from 'react';

export const DayFilter = ({ selectedDay, onDayChange, days }) => {
  return (
    <div className="day-filter-container">
      {days.map((day) => (
        <button
          key={day.id}
          className={`day-filter-button ${selectedDay === day.id ? 'day-filter-button-active' : ''}`}
          onClick={() => onDayChange(day.id)}
        >
          <div className="day-filter-date">{day.date}</div>
          <div className="day-filter-label">{day.label}</div>
        </button>
      ))}
    </div>
  );
};

export default DayFilter;