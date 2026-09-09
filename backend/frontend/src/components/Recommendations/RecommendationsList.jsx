import React from 'react';
import axios from 'axios';
import RecommendationCard from './RecommendationCard';

const API_BASE = 'http://127.0.0.1:8000';

export const RecommendationsList = ({ recommendations, onFeedback }) => {
  const handleClickCard = async (recId, type) => {
    try {
      const endpoint = type === 'session' 
        ? `/api/recommendations/sessions/${recId}/viewed`
        : `/api/recommendations/network/${recId}/connected`;
        
      await axios.put(`${API_BASE}${endpoint}`, null, { params: { user_id: 1 } });
      onFeedback?.(); // Refresh stats
    } catch (err) {
      console.error('Error tracking click:', err);
    }
  };

  const handleFeedback = async (recId, score) => {
    console.log(`Feedback ${score} recorded for recommendation ${recId}`);
    onFeedback?.();
  };

  return (
    <div className="space-y-4">
      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No recommendations generated yet.
          </p>
        </div>
      ) : (
        recommendations.map((rec) => (
          <RecommendationCard
            key={rec.id}
            recommendation={rec}
            onClickCard={handleClickCard}
            onFeedback={handleFeedback}
          />
        ))
      )}
    </div>
  );
};

export default RecommendationsList;