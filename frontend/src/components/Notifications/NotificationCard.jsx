import React from 'react';

export const NotificationCard = ({ notification, onMarkRead, onDelete }) => {
  const getTypeLabel = (type) => {
    const labels = {
      session_reminder: '📋 Session Reminder',
      new_review: '⭐ New Review',
      connection_request: '👥 Connection Request',
      message: '💬 Message',
      announcement: '📢 Announcement'
    };
    return labels[type] || type;
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 border-l-4 transition-all
        ${notification.is_read
          ? 'border-gray-300 dark:border-gray-700 opacity-75'
          : 'border-orange-500 shadow-lg'
        }
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{notification.icon_emoji}</span>
            <div>
              <p className={`font-semibold ${notification.is_read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                {notification.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getTypeLabel(notification.notification_type)}
              </p>
            </div>
          </div>
          <p className={`text-sm leading-relaxed ${notification.is_read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {new Date(notification.created_at).toLocaleString()}
          </p>
        </div>

        <div className="ml-4 flex items-center gap-2">
          {!notification.is_read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400 transition-colors"
              title="Mark as read"
            >
              ✓
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg text-red-600 dark:text-red-400 transition-colors"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;