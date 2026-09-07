import React from 'react';

export const MatchScore = ({ score, size = "md" }) => {
  const getColor = (score) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-blue-500 to-blue-600';
    if (score >= 40) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const getLabel = (score) => {
    if (score >= 80) return 'Perfect Match';
    if (score >= 60) return 'Great Match';
    if (score >= 40) return 'Good Match';
    return 'Possible Match';
  };

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-lg'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        ${sizeClasses[size]}
        rounded-full flex items-center justify-center
        bg-gradient-to-br ${getColor(score)}
        text-white font-bold shadow-lg
      `}>
        {score}%
      </div>
      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
        {getLabel(score)}
      </p>
    </div>
  );
};

export default MatchScore;