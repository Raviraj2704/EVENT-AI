import React from 'react';

export const EventBlock = ({ event, isRegistered, onRegister, onUnregister }) => {
  const getTypeColor = (type) => {
    const colors = {
      workshop: 'from-blue-500 to-blue-600',
      keynote: 'from-red-500 to-red-600',
      breakout: 'from-purple-500 to-purple-600',
      networking: 'from-green-500 to-green-600',
      break: 'from-yellow-500 to-yellow-600',
      lunch: 'from-orange-500 to-orange-600'
    };
    return colors[event.session_type] || colors.breakout;
  };

  const getTypeIcon = (type) => {
    const icons = {
      workshop: '🔧',
      keynote: '🎤',
      breakout: '💬',
      networking: '🤝',
      break: '☕',
      lunch: '🍽️'
    };
    return icons[type] || '📌';
  };

  const duration = Math.floor(
    (new Date(event.end_time) - new Date(event.start_time)) / 60000
  );

  const startTime = new Date(event.start_time).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`
      bg-gradient-to-br ${getTypeColor(event.session_type)}
      text-white rounded-lg p-4 mb-3 hover:shadow-lg transition-all cursor-pointer
    `}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getTypeIcon(event.session_type)}</span>
          <div>
            <p className="font-bold text-lg">{event.title}</p>
            <p className="text-sm opacity-90">{startTime} • {duration} min</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded">
          {event.session_type.toUpperCase()}
        </span>
      </div>

      {event.speaker_name && (
        <p className="text-sm opacity-90 mb-2">🎤 {event.speaker_name}</p>
      )}

      {event.location && (
        <p className="text-sm opacity-90 mb-3">📍 {event.location}</p>
      )}

      <div className="flex items-center justify-between text-sm opacity-90 mb-3">
        <span>👥 {event.registered_count}/{event.capacity || '∞'}</span>
        <span className="text-xs">{event.difficulty_level || 'All levels'}</span>
      </div>

      {event.tags && (
        <div className="flex gap-1 flex-wrap mb-3">
          {event.tags.split(',').slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-xs bg-white/20 px-2 py-1 rounded">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {isRegistered ? (
          <button
            onClick={onUnregister}
            className="flex-1 px-3 py-2 bg-white/30 hover:bg-white/40 rounded font-semibold text-sm transition-all"
          >
            ✓ Registered
          </button>
        ) : (
          <button
            onClick={onRegister}
            className="flex-1 px-3 py-2 bg-white text-blue-600 hover:bg-white/90 rounded font-semibold text-sm transition-all"
          >
            + Register
          </button>
        )}
      </div>
    </div>
  );
};

export default EventBlock;