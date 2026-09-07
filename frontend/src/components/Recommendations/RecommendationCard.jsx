import React, { useState } from 'react';
import MatchScore from './MatchScore';

export const RecommendationCard = ({ recommendation, onClickCard, onFeedback }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null);

  // Note: Adjusting slightly to match your backend schema
  const type = recommendation.session_id ? 'session' : 'network';
  
  const getTypeIcon = (type) => {
    return type === 'session' ? '💡' : '🤝';
  };

  const getTypeLabel = (type) => {
    return type === 'session' ? 'Session Match' : 'Networking';
  };

  const handleFeedback = async (score) => {
    setFeedbackGiven(score);
    setShowFeedback(false);
    onFeedback?.(recommendation.id, score);
  };

  return (
    <div
      onClick={() => onClickCard?.(recommendation.id, type)}
      className="
        bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6
        border-l-4 border-orange-500 hover:shadow-xl
        transition-all cursor-pointer hover:scale-105
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex justify-center md:justify-start">
          <MatchScore score={recommendation.match_score} size="lg" />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getTypeIcon(type)}</span>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
              {getTypeLabel(type)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {recommendation.session_title || recommendation.recommended_user_name}
          </h3>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
            {recommendation.reason}
          </p>

          {recommendation.is_viewed && (
            <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
              ✓ You viewed this recommendation
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {feedbackGiven === null ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFeedback(!showFeedback);
                }}
                className="px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-200 transition-colors"
              >
                Rate This
              </button>
              {showFeedback && (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFeedback(score);
                      }}
                      className="text-2xl hover:scale-125 transition-transform"
                    >
                      {score <= 2 ? '😞' : score === 3 ? '😐' : score === 4 ? '😊' : '🤩'}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-2xl mb-1">{feedbackGiven <= 2 ? '😞' : feedbackGiven === 3 ? '😐' : feedbackGiven === 4 ? '😊' : '🤩'}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {feedbackGiven}/5
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;