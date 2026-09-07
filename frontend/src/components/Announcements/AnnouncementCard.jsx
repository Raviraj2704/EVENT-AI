// ============================================================================
// COMPONENT: Announcement Card
// ============================================================================
// File: frontend/src/components/Announcements/AnnouncementCard.jsx
// Purpose: Display individual announcement with Admin controls & User features
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const AnnouncementCard = ({
  announcement,
  isAdmin,
  onDelete,
  onTogglePin,
  isRead,
  onCardClick,
  onMarkAsRead,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // ============= HELPERS FROM CODE 1 (Tailwind & Admin) =============
  const getCategoryColor = (category) => {
    const colors = {
      urgent: 'border-red-500 bg-red-50 dark:bg-red-900/20',
      update: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      schedule: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      general: 'border-gray-500 bg-gray-50 dark:bg-gray-900/20',
      event: 'border-green-500 bg-green-50 dark:bg-green-900/20'
    };
    return colors[category?.toLowerCase()] || 'border-gray-300';
  };

  const getPriorityStars = (priority) => {
    if (typeof priority === 'number') return '⭐'.repeat(priority);
    return null; 
  };

  // ============= HELPERS FROM CODE 2 (Badges & Time Ago) =============
  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: { icon: '🔴', label: 'Urgent', color: '#ef4444' },
      high: { icon: '🟠', label: 'High', color: '#f59e0b' },
      medium: { icon: '🔵', label: 'Medium', color: '#3b82f6' },
      low: { icon: '🟢', label: 'Low', color: '#10b981' },
    };
    // 1. Handle if priority is a number from the slider (1-5)
if (typeof priority === 'number') {
  if (priority >= 4) return badges.urgent;
  if (priority === 3) return badges.medium;
  return badges.low;
}

// 2. Safely handle strings to prevent the .toLowerCase() crash
const safePriority = typeof priority === 'string' ? priority.toLowerCase() : '';
return badges[safePriority] || badges.low;
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  };

  const priorityBadge = getPriorityBadge(announcement.priority);

  return (
    <div
      className={`
        border-l-4 ${getCategoryColor(announcement.category)}
        rounded-lg p-4 mb-3 hover:shadow-lg transition-all dark:bg-gray-800 cursor-pointer
        announcement-card ${isRead ? 'announcement-card-read' : 'announcement-card-unread'} 
        ${isHovered ? 'announcement-card-hovered' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick?.(announcement)}
    >
      {/* Unread Indicator */}
      {!isRead && <div className="announcement-card-unread-indicator" />}

      {/* Image Container */}
      {announcement.image && (
        <div className="announcement-card-image mb-4 rounded overflow-hidden relative h-32 w-full">
          <img
            src={announcement.image}
            alt={announcement.title}
            className="announcement-card-image-content object-cover w-full h-full"
          />
          <div className="announcement-card-image-overlay absolute inset-0 bg-black/10" />
        </div>
      )}

      {/* Content Wrapper */}
      <div className="announcement-card-content">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-2 announcement-card-header">
          <div className="flex items-center gap-2">
            {announcement.icon_emoji && (
              <span className="text-2xl">{announcement.icon_emoji}</span>
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 announcement-card-title">
                {announcement.title}
                
                {announcement.is_pinned && (
                  <span className="text-[10px] bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded font-bold">
                    PINNED
                  </span>
                )}
                
                {!isRead && (
                  <div className="announcement-card-new-badge text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-bold">
                    NEW
                  </div>
                )}
              </h3>
              
              <div className="flex items-center gap-2 mt-1 announcement-card-badges">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {announcement.category?.toUpperCase()}
                </span>
                <span
                  className="announcement-card-priority px-2 py-0.5 rounded-full text-[10px] text-white flex items-center gap-1"
                  style={{ backgroundColor: priorityBadge.color }}
                  title={priorityBadge.label}
                >
                  <span>{priorityBadge.icon}</span> {priorityBadge.label}
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end gap-1">
            <span className="text-xs text-orange-600 dark:text-orange-400">
              {getPriorityStars(announcement.priority)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2 announcement-card-description">
          {announcement.content?.length > 100
            ? `${announcement.content.substring(0, 100)}...`
            : announcement.content}
        </p>

        {/* Footer Area */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 announcement-card-footer">
          
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {announcement.view_count !== undefined && (
              <span>👁️ {announcement.view_count}</span>
            )}
            <span className="announcement-card-time font-medium">
              {announcement.createdAt 
                ? getTimeAgo(announcement.createdAt) 
                : (announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : '')}
            </span>
            {announcement.ctaText && (
              <span className="announcement-card-action text-blue-500 hover:text-blue-600 transition-colors font-medium">
                {announcement.ctaText} →
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Read Checkbox */}
            {!isRead && (
              <button
                className="announcement-card-read-button text-xs px-2 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition-colors font-medium"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents opening the modal when clicking Mark as Read
                  onMarkAsRead?.(announcement.id);
                }}
                title="Mark as read"
              >
                ✓ Read
              </button>
            )}

            {/* Admin Action Buttons */}
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents opening the modal
                    onTogglePin(announcement.id, !announcement.is_pinned);
                  }}
                  className="text-xs px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  {announcement.is_pinned ? '📌 Unpin' : '📌 Pin'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents opening the modal
                    onDelete(announcement.id);
                  }}
                  className="text-xs px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;