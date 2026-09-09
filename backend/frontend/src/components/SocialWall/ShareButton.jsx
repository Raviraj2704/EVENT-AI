import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const ShareButton = ({ post, onShare }) => {
  const [showPlatforms, setShowPlatforms] = useState(false);

  const platforms = [
    { name: 'WhatsApp', icon: '💬', platform: 'whatsapp' },
    { name: 'LinkedIn', icon: '🔗', platform: 'linkedin' },
    { name: 'Twitter', icon: '𝕏', platform: 'twitter' },
    { name: 'Copy Link', icon: '🔗', platform: 'internal' }
  ];

  const handleShare = async (platform) => {
    try {
      await axios.put(
        `${API_BASE}/api/posts/${post.id}/share`,
        null,
        { params: { share_platform: platform, user_id: 1 } }
      );
      setShowPlatforms(false);
      onShare?.();
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPlatforms(!showPlatforms)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 font-semibold transition-all"
      >
        <span className="text-lg">📤</span>
        <span>{post.shares_count}</span>
      </button>

      {showPlatforms && (
        <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 z-10 flex gap-2 border border-gray-200 dark:border-gray-700">
          {platforms.map((p) => (
            <button
              key={p.platform}
              onClick={() => handleShare(p.platform)}
              className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center gap-1 text-sm"
              title={p.name}
            >
              <span>{p.icon}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShareButton;