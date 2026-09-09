import React from 'react';

const AnnouncementBanner = ({ announcement, onClose, onDelete, onTogglePin }) => {
  // Safety check: if announcement is undefined, don't crash
  if (!announcement) return null;

  const getCategoryColor = (category) => {
    const colors = {
      urgent: 'from-red-500 to-red-600',
      update: 'from-blue-500 to-blue-600',
      schedule: 'from-purple-500 to-purple-600',
      general: 'from-gray-500 to-gray-600',
      event: 'from-green-500 to-green-600'
    };
    return colors[category?.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  const getPriorityBorder = (priority) => {
    // Handle both string priorities (mock data) and number priorities (API data)
    if (priority === 'urgent' || priority >= 4) return 'border-red-500';
    if (priority === 'high' || priority >= 3) return 'border-orange-500';
    return 'border-gray-300';
  };

  // Safely map data regardless of whether it comes from the API or Mock array
  const safeCategory = announcement.category || 'general';
  const safeIcon = announcement.icon_emoji || '📢';
  const safeViewCount = announcement.view_count || announcement.views || 0;
  const safeDateString = announcement.created_at || announcement.createdAt;

  // Safe date formatter to prevent "Invalid Date" crashes
  const formatDate = (dateValue) => {
    if (!dateValue) return 'Just now';
    try {
      const d = new Date(dateValue);
      return isNaN(d.getTime()) ? 'Just now' : d.toLocaleString();
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className={`
      bg-gradient-to-r ${getCategoryColor(safeCategory)}
      text-white rounded-xl shadow-xl p-6 mb-8 border-l-4 ${getPriorityBorder(announcement.priority)}
      relative overflow-hidden
    `}>
      <div className="absolute top-0 right-0 opacity-10 text-9xl">
        {safeIcon}
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{safeIcon}</span>
            <div>
              <h2 className="text-2xl font-bold">{announcement.title || 'Announcement'}</h2>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded">
                  {safeCategory.toUpperCase()}
                </span>
                {announcement.is_pinned && (
                  <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded font-bold">
                    📌 PINNED
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Admin Actions & Close Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePin && onTogglePin(announcement.id, false)}
              className="text-xs px-2.5 py-1.5 bg-black bg-opacity-20 hover:bg-opacity-40 rounded-lg transition-all font-medium text-white"
              title="Unpin announcement"
            >
              📌 Unpin
            </button>
            <button
              onClick={() => onDelete && onDelete(announcement.id)}
              className="text-xs px-2.5 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition-all font-medium text-white"
              title="Delete announcement"
            >
              🗑️ Delete
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <p className="text-white text-opacity-95 leading-relaxed mb-4">
          {announcement.content}
        </p>

        <div className="flex items-center justify-between text-sm text-white text-opacity-75">
          <span>👁️ {safeViewCount.toLocaleString()} views</span>
          <span>{formatDate(safeDateString)}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;