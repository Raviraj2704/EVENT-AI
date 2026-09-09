import React from 'react';

export const BotAvatar = ({ avatar = "🤖", size = "md" }) => {
  const sizeClasses = {
    sm: 'text-2xl w-8 h-8',
    md: 'text-4xl w-12 h-12',
    lg: 'text-6xl w-16 h-16'
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      flex items-center justify-center rounded-full
      bg-gradient-to-br from-blue-500 to-blue-600
      flex-shrink-0
    `}>
      {avatar}
    </div>
  );
};

export default BotAvatar;