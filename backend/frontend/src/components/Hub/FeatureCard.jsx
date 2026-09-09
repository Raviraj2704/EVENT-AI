import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FeatureCard = ({ feature, onClick }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    console.log(`🚀 Navigating to: ${feature?.id || feature?.title}`);

    if (feature?.id === 'social' || feature?.title?.includes('Social')) {
      navigate('/social-wall');
    } else if (feature?.id === 'picbot' || feature?.title?.includes('Picbot')) {
      navigate('/picbot');
    } else if (feature?.id === 'activity' || feature?.title?.includes('Activity')) {
      navigate('/activity');
    } 
    // ADD THIS NEW BLOCK FOR AI MATCHES:
    else if (feature?.id === 'ai-matches' || feature?.title?.includes('Match') || feature?.title?.includes('AI')) {
      navigate('/networking'); // Or change to '/recommendations' if you prefer that page!
    }
    else if (feature?.id === 'partners' || feature?.title?.toLowerCase().includes('partner')) {
      navigate('/partners');
    }
    else if (feature?.id === 'briefcase' || feature?.title?.toLowerCase().includes('briefcase')) {
      navigate('/briefcase'); 
    }
    else if (feature?.id === 'ratings' || feature?.title?.toLowerCase().includes('ratings')) {
      navigate('/ratings');
    }
    else if (feature?.id === 'analytics' || feature?.title?.toLowerCase().includes('analytics')) {
      navigate('/analytics');
    }
    else if (feature?.id === 'announcements' || feature?.title?.toLowerCase().includes('announcement')) {
      navigate('/announcements');
    }
    else if (feature?.id === 'speakers' || feature?.title?.toLowerCase().includes('speaker')) {
      navigate('/speakers');
    }
    else if (feature?.id === 'learning' || feature?.title?.toLowerCase().includes('learning')) {
      navigate('/learning');
    }
    else if (feature?.id === 'engagement' || feature?.title?.toLowerCase().includes('engagement')) {
      navigate('/engagement');
    }
    else if (feature?.id === 'admin-dashboard' || feature?.title?.toLowerCase().includes('admin')) {
      navigate('/admin-dashboard');
    }
    else if (onClick) {
      onClick(feature); 
    }
  };

  return (
    <button 
      onClick={handleCardClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-lg transition-transform hover:scale-105 w-full aspect-square ${feature?.color || 'bg-slate-800'}`}
    >
      <div className="text-3xl mb-2">{feature?.icon || '✨'}</div>
      <span className="text-xs font-bold text-white text-center leading-tight">
        {feature?.label || feature?.title || 'Feature'}
      </span>
    </button>
  );
};

export default FeatureCard;  