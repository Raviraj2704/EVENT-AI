import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const CommentSection = ({ post, comments = [], onCommentAdded }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/posts/${post.id}/comments`, {
        post_id: post.id,
        user_id: 1,
        content: newComment
      });

      setNewComment('');
      onCommentAdded?.();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 font-semibold"
      >
        <span className="text-lg">💬</span>
        <span>{post.comments_count}</span>
      </button>

      {showComments && (
        <div className="mt-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg font-semibold"
            >
              {loading ? '⏳' : '📤'}
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    <span className="font-semibold">User {comment.user_id}</span> • {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;