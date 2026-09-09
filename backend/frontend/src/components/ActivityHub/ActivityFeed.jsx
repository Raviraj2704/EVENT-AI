import React from 'react';
import ActivityCard from './ActivityCard';

export const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        📰 Activity Feed
      </h2>
      {activities.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No activities yet. Start engaging to earn points!
        </p>
      ) : (
        <div>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;