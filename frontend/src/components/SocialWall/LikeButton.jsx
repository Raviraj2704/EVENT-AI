import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const LikeButton = ({ post, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_BASE}/api/posts/${post.id}/like`,
        null,
        { params: { user_id: 1 } }
      );
      
      setIsLiked(res.data.is_liked);
      setLikesCount(res.data.likes_count);
      onLike?.();
    } catch (err) {
      console.error('Error liking post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg font-semibold
        transition-all ${isLiked
          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100'
        }
      `}
    >
      <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;