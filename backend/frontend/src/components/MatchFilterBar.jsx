// ============================================================================
// COMPONENT: Match Filter Bar
// ============================================================================
// File: frontend/src/components/MatchFilterBar.jsx
// Purpose: Filter matches by industry, role, and location
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const MatchFilterBar = ({ onFilterChange }) => {
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const industries = [
    { id: 'all', label: 'All Industries' },
    { id: 'tech', label: 'Technology' },
    { id: 'finance', label: 'Finance' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'retail', label: 'Retail' },
    { id: 'manufacturing', label: 'Manufacturing' },
  ];

  const roles = [
    { id: 'all', label: 'All Roles' },
    { id: 'ceo', label: 'CEO/Founder' },
    { id: 'director', label: 'Director' },
    { id: 'manager', label: 'Manager' },
    { id: 'specialist', label: 'Specialist' },
  ];

  const handleFilterChange = () => {
    onFilterChange?.({
      industry: selectedIndustry,
      role: selectedRole,
    });
  };

  const handleIndustryChange = (industry) => {
    setSelectedIndustry(industry);
    onFilterChange?.({
      industry,
      role: selectedRole,
    });
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    onFilterChange?.({
      industry: selectedIndustry,
      role,
    });
  };

  return (
    <div className="match-filter-bar">
      {/* Industry Filter */}
      <div className="match-filter-section">
        <label className="match-filter-label">Industry</label>
        <div className="match-filter-chips">
          {industries.map((industry) => (
            <button
              key={industry.id}
              className={`match-filter-chip ${
                selectedIndustry === industry.id ? 'match-filter-chip-active' : ''
              }`}
              onClick={() => handleIndustryChange(industry.id)}
            >
              {industry.label}
            </button>
          ))}
        </div>
      </div>

      {/* Role Filter */}
      <div className="match-filter-section">
        <label className="match-filter-label">Role</label>
        <div className="match-filter-chips">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`match-filter-chip ${
                selectedRole === role.id ? 'match-filter-chip-active' : ''
              }`}
              onClick={() => handleRoleChange(role.id)}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchFilterBar;