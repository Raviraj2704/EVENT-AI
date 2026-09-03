import React from 'react';

export const CalendarFilters = ({ 
  sessionType, 
  setSessionType, 
  difficulty,
  setDifficulty,
  searchTerm,
  setSearchTerm
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        🔍 Filters
      </h3>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events..."
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Session Type */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Session Type
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { id: 'all', label: 'All', icon: '📋' },
            { id: 'workshop', label: 'Workshop', icon: '🔧' },
            { id: 'keynote', label: 'Keynote', icon: '🎤' },
            { id: 'breakout', label: 'Breakout', icon: '💬' },
            { id: 'networking', label: 'Networking', icon: '🤝' },
            { id: 'lunch', label: 'Lunch', icon: '🍽️' }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSessionType(type.id)}
              className={`
                px-3 py-2 rounded-lg font-semibold text-sm transition-all
                ${sessionType === type.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200'
                }
              `}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Difficulty Level
        </p>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'all', label: 'All Levels' },
            { id: 'beginner', label: 'Beginner' },
            { id: 'intermediate', label: 'Intermediate' },
            { id: 'advanced', label: 'Advanced' }
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setDifficulty(level.id)}
              className={`
                px-4 py-2 rounded-lg font-semibold text-sm transition-all
                ${difficulty === level.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200'
                }
              `}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;