import React from 'react';

export const PopularFeaturesSidebar = ({ features }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 h-fit sticky top-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
        <span className="text-2xl mr-3">🔥</span>
        Popular This Week
      </h2>

      <div className="space-y-3">
        {features.slice(0, 5).map((feature, idx) => (
          <div
            key={feature.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-lg border-l-4 border-blue-500 hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">{feature.icon_emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    #{idx + 1} {feature.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {feature.click_count?.toLocaleString()} clicks
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-orange-500">
                  {Math.round((feature.click_count / (features[0]?.click_count || 1)) * 100)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="my-6 border-t border-gray-200 dark:border-gray-700" />

      <div className="bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          💡 <strong>Tip:</strong> Click features to help us personalize your experience!
        </p>
      </div>
    </div>
  );
};