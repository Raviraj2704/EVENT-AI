import React from 'react';

export const LevelBadges = ({ allBadges = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🏅 Available Badges
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allBadges.map((badge) => (
          <div
            key={badge.id}
            className={`
              border-2 border-${badge.color}-300 dark:border-${badge.color}-700
              rounded-lg p-4 text-center hover:shadow-lg transition-all
              bg-${badge.color}-50 dark:bg-${badge.color}-900/20
            `}
          >
            <p className="text-4xl mb-2">{badge.icon_emoji}</p>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {badge.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {badge.description}
            </p>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              {badge.requirement_type === 'points' && `${badge.requirement_value} Points`}
              {badge.requirement_type === 'activity' && `${badge.requirement_value} Activities`}
              {badge.requirement_type === 'milestone' && 'Milestone'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelBadges;