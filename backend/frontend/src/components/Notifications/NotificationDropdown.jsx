import React from 'react';
import { useNavigate } from 'react-router-dom';

export const NotificationDropdown = ({ notifications, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <h3 className="font-bold text-gray-900 dark:text-white">Recent Notifications</h3>
      </div>
      <div className="max-h-64 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-4">No new notifications</p>
        ) : (
          notifications.slice(0, 3).map((notif) => (
            <div key={notif.id} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
              <p className="text-sm font-semibold dark:text-white truncate">{notif.icon_emoji} {notif.title}</p>
              <p className="text-xs text-gray-500 truncate">{notif.message}</p>
            </div>
          ))
        )}
      </div>
      <div 
        onClick={() => { onClose(); navigate('/notifications'); }}
        className="p-3 text-center text-sm font-semibold text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer border-t border-gray-100 dark:border-gray-700"
      >
        View All Notifications
      </div>
    </div>
  );
};

export default NotificationDropdown;