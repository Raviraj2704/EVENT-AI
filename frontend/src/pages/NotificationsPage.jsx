import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NotificationCard } from '../components/Notifications/NotificationCard';
import { NotificationSettings } from '../components/Notifications/NotificationSettings';

const API_BASE = 'http://127.0.0.1:8000';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, [filterType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/notifications`, {
        params: { user_id: 1, event_id: 1, filter_type: filterType, limit: 50 }
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications/stats`, {
        params: { user_id: 1, event_id: 1 }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleMarkRead = async (notificationId) => {
    try {
      await axios.put(`${API_BASE}/api/notifications/${notificationId}/read`, null, { params: { user_id: 1 } });
      fetchNotifications();
      fetchStats();
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put(`${API_BASE}/api/notifications/read-all`, null, { params: { user_id: 1, event_id: 1 } });
      fetchNotifications();
      fetchStats();
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      // Fixed: Fully explicit URL structure preventing any parameter clipping
      await axios.delete(`${API_BASE}/api/notifications/${notificationId}`, { 
        params: { user_id: 1, event_id: 1 } 
      });
      fetchNotifications();
      fetchStats();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">🔔 Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400">Stay updated with event activities</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
          >
            ⚙️ Settings
          </button>
        </div>

        {showSettings && (
          <div className="mb-8 relative">
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSettings(false)} />
            <div className="relative z-50">
              <NotificationSettings onSave={() => { fetchNotifications(); fetchStats(); }} />
            </div>
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Total</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Unread</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.unread}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Messages</p>
              <p className="text-3xl font-bold text-pink-600 mt-2">{stats.by_type?.message || 0}</p>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex gap-3">
            {['all', 'unread', 'session_reminder'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterType === type ? 'bg-orange-600 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'}`}
              >
                {type === 'all' && '📋 All'}
                {type === 'unread' && '🔴 Unread'}
                {type === 'session_reminder' && '📋 Sessions'}
              </button>
            ))}
          </div>

          {stats && stats.unread > 0 && (
            <button onClick={handleMarkAllRead} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              Mark all as read
            </button>
          )}
        </div>

        <div>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">✨ No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map((notif) => (
                <NotificationCard key={notif.id} notification={notif} onMarkRead={handleMarkRead} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;