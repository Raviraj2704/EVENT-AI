import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// THE FIX: This name now perfectly matches what App.jsx is looking for!
export const SessionsPage = () => {
  const navigate = useNavigate();
  
  // ============= STATE MANAGEMENT =============
  const [selectedDay, setSelectedDay] = useState('21st May');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [bookmarkedSessions, setBookmarkedSessions] = useState(new Set());
  
  // ADDED: Track which tab is currently active for the bottom nav
  const [activeTab, setActiveTab] = useState('sessions');

  // ============= SESSIONS DATA =============
  const sessions = [
    {
      id: 1,
      day: '21st May',
      time: '09:00 AM - 09:30 AM',
      title: 'Registration, Expo Interaction & Networking',
      location: 'Jasmine Hall',
      category: 'Upcoming',
      isLive: false,
    },
    {
      id: 2,
      day: '21st May',
      time: '09:30 AM - 10:30 AM',
      title: 'Connected Intelligence & Future Horizons',
      location: 'Jasmine Hall',
      category: 'Conference Opening',
      isLive: true,
    },
    {
      id: 3,
      day: '22nd May',
      time: '04:20 PM - 05:10 PM',
      title: 'SHRMTech26 Big Debate: AI vs Human Leadership',
      location: 'Jasmine Hall',
      category: 'AI-Ready HR Leader',
      isLive: false,
    },
    {
      id: 4,
      day: '22nd May',
      time: '05:15 PM - 06:30 PM',
      title: 'Beyond Conference | Celebrity Session Followed by Gala',
      location: 'Jasmine Hall',
      category: 'Archive',
      isLive: false,
    }
  ];

  // ============= PERFECTED FILTERING LOGIC =============
  const filteredSessions = sessions.filter(session => {
    // 1. Filter by Day
    if (session.day !== selectedDay) return false;
    // 2. Filter by Live Status
    if (filterType === 'live' && !session.isLive) return false;
    // 3. Filter by Search Query
    if (searchQuery && !session.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // ============= WORKING BOOKMARK HANDLER =============
  const toggleBookmark = (id) => {
    setBookmarkedSessions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Remove if already bookmarked
      } else {
        newSet.add(id); // Add if not bookmarked
      }
      return newSet;
    });
  };

  // ADDED: Updated tab change function
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/home');
    if (tab === 'sessions') navigate('/sessions');
    if (tab === 'hub') navigate('/hub');
    if (tab === 'networking') navigate('/networking');
    if (tab === 'profile') navigate('/profile');
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto pb-24 font-sans bg-slate-50 min-h-screen dark:bg-gray-900 relative">
      
      {/* ============= TOP HEADER & BACK BUTTON ============= */}
      <div className="flex justify-between items-center mb-6 pt-2">
        <div className="flex items-center gap-3">
          {/* THE NEW BACK BUTTON */}
          <button 
            onClick={() => navigate('/home')} 
            className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 transition-colors shadow-sm"
            aria-label="Go back to Home"
          >
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessions</h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 shadow-sm'}`}
          >
            🔍
          </button>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:scale-110 transition-transform shadow-sm">
            ⚙️
          </button>
        </div>
      </div>

      {/* ============= SEARCH BAR ============= */}
      {showSearch && (
        <div className="mb-6 animate-fade-in">
          <input
            type="text"
            placeholder="Search sessions by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>
      )}

      {/* ============= DAY FILTER TABS ============= */}
      <div className="flex space-x-3 mb-6">
        {['21st May', '22nd May'].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`flex-1 py-3 px-4 rounded-2xl font-semibold transition-all shadow-sm text-left ${
              selectedDay === day
                ? 'bg-blue-500 text-white shadow-blue-500/30 ring-2 ring-blue-400 ring-offset-2 dark:ring-offset-gray-900'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="text-sm">{day}</div>
            <div className="text-xs opacity-80">{day === '21st May' ? 'Day 1' : 'Day 2'}</div>
          </button>
        ))}
      </div>

      {/* ============= LIVE/ALL TOGGLE ============= */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 hide-scrollbar">
        <button
          onClick={() => setFilterType(filterType === 'live' ? 'all' : 'live')}
          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all flex items-center space-x-2 shrink-0 ${
            filterType === 'live'
              ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:border-red-800'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${filterType === 'live' ? 'bg-red-600 animate-pulse' : 'bg-gray-400'}`}></span>
          <span>Live Sessions</span>
        </button>
        
        <button 
          onClick={() => setFilterType('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all shrink-0 ${
            filterType === 'all' 
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-transparent' 
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700'
          }`}
        >
          All Sessions
        </button>
      </div>

      {/* ============= SESSION CARDS LIST ============= */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <div 
              key={session.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 relative hover:border-blue-400 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {session.category}
                </span>
                
                {/* BOOKMARK BUTTON */}
                <button 
                  onClick={() => toggleBookmark(session.id)}
                  className={`text-2xl transition-transform hover:scale-125 ${
                    bookmarkedSessions.has(session.id) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  {bookmarkedSessions.has(session.id) ? '★' : '☆'}
                </button>
              </div>

              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                 <span>⏱ {session.time}</span>
                 {session.isLive && <span className="text-red-500 animate-pulse font-bold tracking-wide">• LIVE</span>}
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {session.title}
              </h3>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <span className="flex items-center gap-1">📍 {session.location}</span>
                
                <button onClick={() => console.log("Watch Clicked", session.id)} className="px-5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 transition-colors">
                  ▶ Watch
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-3">📭</div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-1">No sessions found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* ADDED: BOTTOM NAVIGATION */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a]/95 backdrop-blur-lg border-t border-[#1e293b] px-6 py-4 flex justify-between items-center z-50">
        <button onClick={() => handleTabChange('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-blue-500' : 'text-slate-400 hover:text-white'} hover:scale-110 transition-all`}>
          <span className="text-xl mb-1">🏠</span><span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => handleTabChange('sessions')} className={`flex flex-col items-center ${activeTab === 'sessions' ? 'text-blue-500' : 'text-slate-400 hover:text-white'} hover:scale-110 transition-all`}>
          <span className="text-xl mb-1">📅</span><span className="text-[10px] font-bold">Agenda</span>
        </button>
        <button onClick={() => handleTabChange('hub')} className={`flex flex-col items-center ${activeTab === 'hub' ? 'text-blue-500' : 'text-slate-400 hover:text-white'} transition-all relative group`}>
          <div className="absolute -top-8 bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#0f172a] shadow-lg text-xl text-white group-hover:scale-110 transition-transform">📸</div>
          <span className="text-[10px] font-bold mt-5">Hub</span>
        </button>
        <button onClick={() => handleTabChange('networking')} className={`flex flex-col items-center ${activeTab === 'networking' ? 'text-blue-500' : 'text-slate-400 hover:text-white'} hover:scale-110 transition-all`}>
          <span className="text-xl mb-1">🤝</span><span className="text-[10px] font-bold">Network</span>
        </button>
        <button onClick={() => handleTabChange('profile')} className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-blue-500' : 'text-slate-400 hover:text-white'} hover:scale-110 transition-all`}>
          <span className="text-xl mb-1">👤</span><span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
   
    </div>
  );
};
    
export default SessionsPage;