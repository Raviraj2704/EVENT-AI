import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const CreateAnnouncement = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState(2);
  const [icon, setIcon] = useState('📢');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/api/announcements/create`, {
        event_id: 1,
        admin_id: 1,
        title: title,
        content: content,
        category: category,
        priority: priority,
        icon_emoji: icon,
        is_pinned: false
      });

      setTitle('');
      setContent('');
      setCategory('general');
      setPriority(2);
      setIcon('📢');
      onSuccess?.(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error creating announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const icons = ['📢', '📋', '⚠️', '✅', '🔔', '📅', '🎉', '🚨'];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        ✏️ Create Announcement
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Important announcement..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell attendees important information..."
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            rows="6"
            required
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="urgent">🚨 Urgent</option>
              <option value="update">📋 Update</option>
              <option value="schedule">📅 Schedule</option>
              <option value="general">💬 General</option>
              <option value="event">🎉 Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Priority
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              className="w-full cursor-pointer"
            />
            <p className="text-xs text-slate-300 mt-1">
              {priority <= 2 ? 'Low' : priority === 3 ? 'Medium' : 'High'} priority
            </p>
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            Icon
          </label>
          <div className="flex gap-2 flex-wrap">
            {icons.map((ico) => (
              <button
                key={ico}
                type="button"
                onClick={() => setIcon(ico)}
                className={`
                  text-3xl p-2 rounded-lg transition-all
                  ${icon === ico
                    ? 'bg-orange-600 scale-110 border-transparent text-white shadow-lg'
                    : 'bg-slate-900 border border-slate-700 text-white hover:bg-slate-800'
                  }
                `}
              >
                {ico}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !title || !content}
          className="w-full px-6 py-3 mt-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 disabled:text-slate-400 text-white rounded-lg font-semibold transition-colors"
        >
          {isLoading ? '⏳ Creating...' : '📢 Create Announcement'}
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;