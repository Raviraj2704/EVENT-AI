import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const SessionsManager = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_id: 1,
    speaker_id: 1,
    title: '',
    description: '',
    session_type: 'keynote',
    start_time: '',
    end_time: '',
    room_location: '',
    capacity: 100,
    difficulty_level: 'intermediate',
    tags: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/admin/sessions?event_id=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(res.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/admin/sessions/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({
        event_id: 1,
        speaker_id: 1,
        title: '',
        description: '',
        session_type: 'keynote',
        start_time: '',
        end_time: '',
        room_location: '',
        capacity: 100,
        difficulty_level: 'intermediate',
        tags: ''
      });
      fetchSessions();
    } catch (err) {
      alert('Error creating session: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🎯 Sessions Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold"
        >
          + Create Session
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create New Session</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Session Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Room Location (e.g., Hall A)"
              value={formData.room_location}
              onChange={(e) => setFormData({ ...formData, room_location: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={handleCreate}
                className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                ✅ Save Session
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Capacity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-3 text-gray-900 dark:text-white font-semibold">{session.title}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white">{session.room_location}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white">{session.registered_count}/{session.capacity}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Edit</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SessionsManager;