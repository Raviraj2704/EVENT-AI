import React, { useState } from 'react';

export const StarRating = ({ rating, onRatingChange, interactive = false, size = 'md' }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className="flex items-center">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => interactive && onRatingChange?.(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`
              inline-block transition-all duration-200 select-none
              ${sizeClasses[size]}
              ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              ${star <= (hoveredRating || rating) ? '' : 'opacity-50 grayscale'}
            `}
          >
            {star <= (hoveredRating || rating) ? '⭐' : '☆'}
          </span>
        ))}
      </div>
      <span className="ml-3 text-sm font-semibold text-gray-600 dark:text-gray-400">
        {rating}/5
      </span>
    </div>
  );
};

export default StarRating;