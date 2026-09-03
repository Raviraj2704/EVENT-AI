import React from 'react';

export const HubStats = ({ totalFeatures, popularFeatures }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-semibold uppercase">Total Features</p>
            <p className="text-4xl font-bold mt-2">{totalFeatures}</p>
          </div>
          <div className="text-6xl opacity-30">📊</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-semibold uppercase">Most Popular</p>
            <p className="text-4xl font-bold mt-2">{popularFeatures[0]?.name || 'N/A'}</p>
            <p className="text-purple-200 text-sm mt-1">{popularFeatures[0]?.click_count?.toLocaleString() || 0} clicks</p>
          </div>
          <div className="text-6xl opacity-30">🔥</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100 text-sm font-semibold uppercase">Your Stats</p>
            <p className="text-4xl font-bold mt-2">12</p>
            <p className="text-orange-200 text-sm mt-1">Features visited</p>
          </div>
          <div className="text-6xl opacity-30">⭐</div>
        </div>
      </div>
    </div>
  );
};