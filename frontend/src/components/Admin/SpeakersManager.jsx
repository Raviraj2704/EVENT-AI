import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const SpeakersManager = () => {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    event_id: 1,
    user_id: 1,
    bio: '',
    company: '',
    expertise: '',
    social_twitter: '',
    social_linkedin: '',
    profile_image_url: 'https://via.placeholder.com/150',
    is_featured: true,
  });

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/admin/speakers?event_id=1`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpeakers(res.data.speakers || []);
    } catch (err) {
      console.error('Error fetching speakers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE}/admin/speakers/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowForm(false);
      setFormData({
        event_id: 1,
        user_id: 1,
        bio: '',
        company: '',
        expertise: '',
        social_twitter: '',
        social_linkedin: '',
        profile_image_url: 'https://via.placeholder.com/150',
        is_featured: true,
      });
      fetchSpeakers();
    } catch (err) {
      alert('Error creating speaker: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div>Loading Speakers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🎤 Speakers Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
        >
          + Add Speaker
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Add New Speaker</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Expertise (e.g., AI, Cloud Computing)"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Twitter Handle"
              value={formData.social_twitter}
              onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="LinkedIn Profile URL"
              value={formData.social_linkedin}
              onChange={(e) => setFormData({ ...formData, social_linkedin: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={handleCreate}
                className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                ✅ Save Speaker
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
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Expertise</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Rating</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => (
                <tr key={speaker.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-3 text-gray-900 dark:text-white font-semibold">{speaker.company}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white">{speaker.expertise}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white">⭐ {speaker.rating}</td>
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

export default SpeakersManager;