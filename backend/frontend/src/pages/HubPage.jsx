import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FeatureCard } from '../components/Hub/FeatureCard';
import '../styles/hub.css';

export const HubPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hub');

  // Clean local feature list with custom gradients
  const hubFeatures = [
    { id: 'picbot', icon: '🤖', label: 'Picbot', description: 'AI Assistant', gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', badge: null, route: '/picbot' },
    { id: 'social', icon: '💬', label: 'Social Wall', description: 'Community Feed', gradient: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)', badge: null, route: '/social' },
    { id: 'activity', icon: '⚡', label: 'Activity Hub', description: 'Gamification', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)', badge: '5', route: '/activity' },
    { id: 'ai-matches', icon: '🎯', label: 'AI Matches', description: 'Smart Connections', gradient: 'linear-gradient(135deg, #3B82F6 0%, #10B981 100%)', badge: '3', route: '/networking' },
    { id: 'partners', icon: '🤝', label: 'Partners', description: 'Sponsors & Brands', gradient: 'linear-gradient(135deg, #EF4444 0%, #F97316 100%)', badge: null, route: '/partners' },
    { id: 'briefcase', icon: '💼', label: 'Briefcase', description: 'Resources & Files', gradient: 'linear-gradient(135deg, #FBBF24 100%, #EF4444 100%)', badge: null, route: '/briefcase' },
    { id: 'ratings', icon: '⭐', label: 'Ratings', description: 'Session Reviews', gradient: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)', badge: null, route: '/ratings' },
    { id: 'analytics', icon: '📊', label: 'Analytics', description: 'Your Progress', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', badge: null, route: '/analytics' },
    { id: 'announcements', icon: '📢', label: 'Announcements', description: 'Event Updates', gradient: 'linear-gradient(135deg, #1F2937 0%, #6B7280 100%)', badge: '2', route: '/announcements' },
    { id: 'speakers', icon: '🎤', label: 'Speakers', description: 'Directory', gradient: 'linear-gradient(135deg, #3B82F6 0%, #00D9FF 100%)', badge: null, route: '/speakers' },
    { id: 'learning', icon: '🎓', label: 'Learning', description: 'Skill Paths', gradient: 'linear-gradient(135deg, #F97316 0%, #3B82F6 100%)', badge: null, route: '/learning' },
    { id: 'engagement', icon: '👥', label: 'Engagement', description: 'Connect & Share', gradient: 'linear-gradient(135deg, #EC4899 0%, #FBBF24 100%)', badge: null, route: '/engagement' },
    {
      id: 'admin-dashboard',
      icon: '⚙️',
      label: 'Admin Dashboard',
      description: 'Manage users, content, and system settings',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
      badge: null,
      route: '/admin-dashboard'
    }
  ];

  // ============================================================================
// In HubScreen.jsx, update the handleFeatureClick function:
// ============================================================================

const handleFeatureClick = (featureId) => {
  const feature = hubFeatures.find((f) => f.id === featureId);
  if (feature) {
    console.log('Feature clicked:', feature.label);
    switch (feature.id) {
      case 'picbot':
        navigate('/picbot');
        break;
      case 'social':
        navigate('/social-wall');
        break;
      case 'activity':
        navigate('/activity-hub');
        break;
      case 'ai-matches':
        navigate('/ai-matches');
        break;
      case 'partners':
        navigate('/partners');
        break;
      case 'briefcase':
        navigate('/briefcase');
        break;
      case 'ratings':
        navigate('/ratings');
        break;
      case 'analytics':
        navigate('/analytics');
        break;
      case 'announcements':
        navigate('/announcements');
        break;
      case 'speakers':
        navigate('/speakers');
        break;
      case 'learning':
        navigate('/learning');
        break;
      case 'engagement':
        navigate('/engagement');
        break;
      case 'admin-dashboard':
        navigate('/admin-dashboard');
        break;
      // Add more cases for other features
      default:
        alert(`${feature.label} feature coming soon!`);
    }
  }
};

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans pb-32 overflow-y-auto">
      
      {/* Sleek Minimalist Header (No Giant Logo!) */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <button 
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-lg hover:bg-slate-800 transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg tracking-wide">Event Hub</h1>
          <p className="text-xs text-slate-400">NextGen AI Expo 2026</p>
        </div>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-white/10 rounded-2xl p-5 shadow-xl">
          <h2 className="text-xl font-bold mb-1">Explore Features</h2>
          <p className="text-xs text-blue-200">Access all interactive tools, AI matches, and event schedules in one place.</p>
        </div>

        {/* Feature Grid */}
        <div className="hub-grid grid grid-cols-2 gap-3.5">
          {hubFeatures.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              onClick={() => handleFeatureClick(feature)}
            />
          ))}
        </div>

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">🏠</span><span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => navigate('/sessions')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">📅</span><span className="text-[10px]">Agenda</span>
        </button>
        <button onClick={() => navigate('/hub')} className="flex flex-col items-center text-blue-500">
          <span className="text-xl mb-1">⚡</span><span className="text-[10px] font-bold">Hub</span>
        </button>
        <button onClick={() => navigate('/networking')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">🤝</span><span className="text-[10px]">Network</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">👤</span><span className="text-[10px]">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default HubPage;