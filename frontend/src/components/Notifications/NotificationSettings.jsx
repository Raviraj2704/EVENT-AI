import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const NotificationSettings = ({ onSave }) => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/notifications/preferences`, {
        params: { user_id: 1, event_id: 1 }
      });
      setPreferences(res.data);
    } catch (err) {
      console.error('Error fetching preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (field) => {
    if (!preferences) return;
    const updated = { ...preferences, [field]: !preferences[field] };
    setSaving(true);

    try {
      // FIXED: Changed from axios.post to axios.put to match backend @router.put
      await axios.put(
        `${API_BASE}/api/notifications/preferences`,
        updated,
        { params: { user_id: 1, event_id: 1 } }
      );
      setPreferences(updated);
      onSave?.();
    } catch (err) {
      console.error('Error saving preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading settings...</div>;
  if (!preferences) return <div className="text-center py-8 text-red-600">Error loading settings</div>;

  const preferences_list = [
    { key: 'enable_session_reminders', label: '📅 Session Reminders', description: 'Get reminded about upcoming sessions' },
    { key: 'enable_review_notifications', label: '⭐ Review Notifications', description: 'Notified when someone reviews your sessions' },
    { key: 'enable_connection_requests', label: '👥 Connection Requests', description: 'Get notified of new connection requests' },
    { key: 'enable_messages', label: '💬 Messages', description: 'Notified when you receive messages' },
    { key: 'enable_push', label: '🔔 Push Notifications', description: 'Browser push notifications' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Notification Settings</h2>
      <div className="space-y-4">
        {preferences_list.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200">{item.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!preferences[item.key]} 
                onChange={() => handleToggle(item.key)}
                disabled={saving}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;