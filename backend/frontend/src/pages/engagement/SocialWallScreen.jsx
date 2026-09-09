// ============================================================================
// Social Wall Screen
// ============================================================================
// File: src/pages/engagement/SocialWallScreen.jsx
// Purpose: Social wall with posts, comments, and likes
// Status: Production-Ready ✅

import React, { useEffect, useState, useRef } from 'react'
import { Heart, MessageCircle, Share2, MoreVertical, Loader, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuthStore } from '../../store/authStore'
import apiClient from '../../config/apiClient'

const SocialWallScreen = () => {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [expandedComments, setExpandedComments] = useState(new Set())
  const [comments, setComments] = useState({})
  const [newComments, setNewComments] = useState({})
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef(null)

  useEffect(() => {
    loadPosts()
  }, [page])

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get('/social/posts', {
        params: { page, limit: 10 }
      })
      
      setPosts(prev => page === 1 ? response.data.data : [...prev, ...response.data.data])
      setHasMore(response.data.has_next || false)
    } catch (error) {
      console.error('Error loading posts:', error)
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()

    if (!newPost.trim()) {
      toast.error('Post cannot be empty')
      return
    }

    setIsCreating(true)

    try {
      const response = await apiClient.post('/social/posts', {
        content: newPost
      })

      setPosts(prev => [response.data, ...prev])
      setNewPost('')
      toast.success('Post created successfully!')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setIsCreating(false)
    }
  }

  const handleLike = async (postId, isLiked) => {
    try {
      if (isLiked) {
        await apiClient.post(`/social/posts/${postId}/unlike`)
      } else {
        await apiClient.post(`/social/posts/${postId}/like`)
      }

      setPosts(prev => prev.map(post => 
        post.id === postId
          ? {
              ...post,
              likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
              user_liked: !isLiked
            }
          : post
      ))
    } catch (error) {
      console.error('Error updating like:', error)
      toast.error('Failed to update like')
    }
  }

  const loadComments = async (postId) => {
    try {
      const response = await apiClient.get(`/social/posts/${postId}/comments`)
      setComments(prev => ({
        ...prev,
        [postId]: response.data.data || []
      }))
    } catch (error) {
      console.error('Error loading comments:', error)
      toast.error('Failed to load comments')
    }
  }

  const handleToggleComments = (postId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
        if (!comments[postId]) {
          loadComments(postId)
        }
      }
      return newSet
    })
  }

  const handleAddComment = async (postId) => {
    const commentText = newComments[postId]

    if (!commentText?.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      const response = await apiClient.post(`/social/posts/${postId}/comments`, {
        content: commentText
      })

      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), response.data]
      }))

      setNewComments(prev => ({
        ...prev,
        [postId]: ''
      }))

      toast.success('Comment added!')
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error('Failed to add comment')
    }
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiClient.delete(`/social/posts/${postId}`)
        setPosts(prev => prev.filter(p => p.id !== postId))
        toast.success('Post deleted!')
      } catch (error) {
        console.error('Error deleting post:', error)
        toast.error('Failed to delete post')
      }
    }
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Social Wall</h1>
            <p className="text-white/80">
              Connect and engage with the community
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Create Post */}
          <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
            <div className="flex gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex-shrink-0" />
              
              <form onSubmit={handleCreatePost} className="flex-1 space-y-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  rows="3"
                  maxLength="500"
                  className="w-full resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    {newPost.length}/500
                  </span>
                  
                  <button
                    type="submit"
                    disabled={isCreating || !newPost.trim()}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      'Post'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
                {/* Post Header */}
                <div className="px-6 py-4 border-b border-neutral-200 flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900">
                        {post.author?.first_name} {post.author?.last_name}
                      </p>
                      <p className="text-xs text-neutral-600">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {user?.id === post.author?.id && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-neutral-600" />
                    </button>
                  )}
                </div>

                {/* Post Content */}
                <div className="px-6 py-4">
                  <p className="text-neutral-900 whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post Stats */}
                <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200 flex gap-6 text-xs text-neutral-600">
                  <span>{post.likes_count} likes</span>
                  <span>{post.comments_count} comments</span>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-3 border-t border-neutral-200 flex gap-3">
                  <button
                    onClick={() => handleLike(post.id, post.user_liked)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                      post.user_liked
                        ? 'text-error bg-red-50 hover:bg-red-100'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.user_liked ? 'fill-current' : ''}`} />
                    Like
                  </button>

                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Comment
                  </button>

                  <button className="flex-1 flex items-center justify-center gap-2 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 space-y-4">
                    {/* Existing Comments */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {comments[post.id]?.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 flex-shrink-0" />
                          
                          <div className="flex-1 bg-white rounded-lg px-3 py-2">
                            <p className="text-sm font-medium text-neutral-900">
                              {comment.author?.first_name}
                            </p>
                            <p className="text-sm text-neutral-700">
                              {comment.content}
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="flex gap-3 pt-3 border-t border-neutral-200">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex-shrink-0" />
                      
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments(prev => ({
                            ...prev,
                            [post.id]: e.target.value
                          }))}
                          placeholder="Write a comment..."
                          maxLength="200"
                          className="flex-1 text-sm px-3 py-2 rounded-lg"
                        />
                        
                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="py-4 text-center">
              {loading && hasMore && <LoadingSpinner />}
              {!hasMore && posts.length > 0 && (
                <p className="text-neutral-600 text-sm">No more posts</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default SocialWallScreen