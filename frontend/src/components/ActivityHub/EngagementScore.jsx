import React from 'react';

export const EngagementScore = ({ engagement, badges = [] }) => {
  const getLevelColor = (level) => {
    if (level >= 8) return 'from-red-500 to-purple-600';
    if (level >= 6) return 'from-blue-500 to-purple-500';
    if (level >= 4) return 'from-green-500 to-blue-500';
    return 'from-yellow-500 to-green-500';
  };

  const getNextLevelPoints = (level) => {
    const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2250];
    return thresholds[level] || 2250;
  };

  const nextLevelPoints = getNextLevelPoints(engagement.current_level);
  const currentThreshold = getNextLevelPoints(engagement.current_level - 1) || 0;
  const progressPercent = ((engagement.total_points - currentThreshold) / (nextLevelPoints - currentThreshold)) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center">
          <div className={`
            w-32 h-32 rounded-full flex items-center justify-center
            bg-gradient-to-br ${getLevelColor(engagement.current_level)}
            text-white shadow-2xl
          `}>
            <div className="text-center">
              <p className="text-5xl font-bold">Lvl</p>
              <p className="text-3xl font-bold">{engagement.current_level}</p>
            </div>
          </div>
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300 font-semibold">
            {engagement.total_points.toLocaleString()} Points
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <span className="font-semibold text-gray-900 dark:text-white">📊 Sessions Attended</span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{engagement.sessions_attended}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <span className="font-semibold text-gray-900 dark:text-white">⭐ Reviews Posted</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">{engagement.reviews_posted}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <span className="font-semibold text-gray-900 dark:text-white">🤝 Connections</span>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{engagement.connections_made}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
            <span className="font-semibold text-gray-900 dark:text-white">💬 Messages</span>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{engagement.messages_sent}</span>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {engagement.total_points} / {nextLevelPoints} points to Level {engagement.current_level + 1}
            </p>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {badges && badges.length > 0 && (
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">🏆 Achievement Badges</h3>
          <div className="flex gap-3 flex-wrap">
            {badges.map((badge) => (
              <div key={badge.id} className="group relative">
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center
                  bg-${badge.color}-100 dark:bg-${badge.color}-900/30
                  text-2xl cursor-pointer hover:scale-110 transition-transform
                `}>
                  {badge.icon_emoji}
                </div>
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap z-10">
                  {badge.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EngagementScore;