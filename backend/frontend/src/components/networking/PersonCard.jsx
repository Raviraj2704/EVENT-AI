import React, { useState } from 'react';

// ============================================================================
// 1. YOUR EXISTING PERSON CARD (Fixed: No missing StarButton error!)
// ============================================================================
export const PersonCard = ({ person, onConnect, isConnected, isPending }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [isStarred, setIsStarred] = useState(false); // Replaces missing StarButton
  
  const getStatusColor = () => {
    if (isConnected) return 'bg-green-100 text-green-700';
    if (isPending) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };
  
  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isPending) return 'Pending';
    return 'Connect';
  };

  if (!person) return null;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 mb-4 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={person.profile_photo_url || 'https://via.placeholder.com/60'}
            alt={person.full_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg text-gray-900">{person.full_name}</h3>
              {/* Built-in Star Icon to fix the crash */}
              <button onClick={() => setIsStarred(!isStarred)} className="text-gray-400 hover:text-yellow-400">
                <svg fill={isStarred ? "#FBBF24" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600">{person.headline}</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-500">📍 {person.location}</span>
            </div>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{person.bio}</p>

      <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase">Company</p>
          <p className="font-semibold text-gray-900">{person.company}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Role</p>
          <p className="font-semibold text-gray-900">{person.job_title}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills & Interests</p>
        <div className="flex flex-wrap gap-2">
          {(person.interests || []).map((interest, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setShowMessage(!showMessage)}
          className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          💬 Message
        </button>
        
        {!isConnected && (
          <button
            onClick={() => onConnect(person.id)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            🤝 {isPending ? 'Pending' : 'Connect'}
          </button>
        )}
        
        {isConnected && (
          <button className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg cursor-default">
            ✓ Connected
          </button>
        )}
      </div>

      {showMessage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Send a personalized message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
            rows={3}
          />
          <button
            onClick={() => {
              onConnect(person.id, customMessage);
              setShowMessage(false);
            }}
            className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. CLAUDE'S ATTENDEE CARD (For your Networking Page to use seamlessly)
// ============================================================================
export const AttendeeCard = ({ attendee, onConnect, onBookmark }) => {
  const [isBookmarked, setIsBookmarked] = useState(attendee?.isBookmarked || false);
  const [isConnected, setIsConnected] = useState(attendee?.isConnected || false);

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    onBookmark?.(attendee.id, !isBookmarked);
  };

  const handleConnect = () => {
    setIsConnected(!isConnected);
    onConnect?.(attendee.id, !isConnected);
  };

  const getBadgeColor = (badge) => {
    if (badge.includes('Virtual')) return '#3B82F6';
    if (badge.includes('Onground')) return '#F97316';
    if (badge.includes('Speaker')) return '#10B981';
    return '#6B7280';
  };

  if (!attendee) return null;

  return (
    <div className="attendee-card">
      <div className="attendee-card-header">
        <div className="attendee-card-avatar">
          {attendee.avatar ? (
            <img src={attendee.avatar} alt={attendee.name} />
          ) : (
            <div className="attendee-card-avatar-placeholder">
              {attendee.initials}
            </div>
          )}
        </div>
        <button
          className={`attendee-card-bookmark ${isBookmarked ? 'attendee-card-bookmark-active' : ''}`}
          onClick={handleBookmark}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M17 3H5c-1.11 0-2 .9-2 2v16l7-3 7 3V5c0-1.1.89-2 2-2h-2zm0 15l-5-2.18L7 18V5h10v13z" />
          </svg>
        </button>
      </div>

      <h3 className="attendee-card-name">{attendee.name}</h3>
      <p className="attendee-card-title">{attendee.jobTitle}</p>
      <p className="attendee-card-company">{attendee.company}</p>

      <div className="attendee-card-badges">
        {attendee.badges.map((badge, index) => (
          <span key={index} className="attendee-card-badge" style={{ backgroundColor: getBadgeColor(badge) }}>
            {badge}
          </span>
        ))}
      </div>

      {attendee.aiMatch && (
        <div className="attendee-card-ai-match">
          <svg className="attendee-card-ai-icon" viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          <span style={{marginLeft: '4px', fontSize: '12px', fontWeight: 'bold'}}>AI Match</span>
        </div>
      )}

      <button className={`attendee-card-button ${isConnected ? 'attendee-card-button-connected' : ''}`} onClick={handleConnect}>
        {isConnected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
};
export default AttendeeCard;