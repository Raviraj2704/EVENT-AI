// ============================================================================
// Application Constants
// ============================================================================
// File: src/utils/constants.js
// Purpose: Global application constants
// Status: Production-Ready ✅

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  HEADERS: {
    'Content-Type': 'application/json'
  }
}

// Session Types
export const SESSION_TYPES = {
  KEYNOTE: 'Keynote',
  WORKSHOP: 'Workshop',
  PANEL: 'Panel',
  NETWORKING: 'Networking',
  BREAKOUT: 'Breakout',
  TRAINING: 'Training'
}

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
}

// Experience Levels
export const EXPERIENCE_LEVELS = {
  ENTRY: 'Entry Level',
  MID: 'Mid Level',
  SENIOR: 'Senior',
  EXECUTIVE: 'Executive'
}

// Resource Types
export const RESOURCE_TYPES = {
  PDF: 'pdf',
  VIDEO: 'video',
  DOCUMENT: 'document',
  PRESENTATION: 'presentation',
  IMAGE: 'image'
}

// Rating Types
export const RATING_TYPES = {
  SESSION: 'session',
  SPEAKER: 'speaker',
  RESOURCE: 'resource'
}

// Announcement Categories
export const ANNOUNCEMENT_CATEGORIES = {
  URGENT: 'urgent',
  EVENT: 'event',
  SCHEDULE: 'schedule',
  GENERAL: 'general',
  SUCCESS: 'success'
}

// Priority Levels
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

// Badge Rarity
export const BADGE_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
}

// Challenge Difficulty
export const CHALLENGE_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
}

// Partner Categories
export const PARTNER_CATEGORIES = {
  TECHNOLOGY: 'Technology',
  FINANCE: 'Finance',
  CONSULTING: 'Consulting',
  EDUCATION: 'Education',
  MEDIA: 'Media'
}

// Partner Tiers
export const PARTNER_TIERS = {
  PLATINUM: 'platinum',
  GOLD: 'gold',
  SILVER: 'silver',
  BRONZE: 'bronze'
}

// Leaderboard Tiers
export const LEADERBOARD_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
}

// Points System
export const POINTS = {
  SESSION_CHECKIN: 10,
  SESSION_RATING: 5,
  RESOURCE_DOWNLOAD: 2,
  RESOURCE_RATING: 3,
  SOCIAL_POST: 5,
  SOCIAL_COMMENT: 2,
  SOCIAL_LIKE: 1,
  POLL_VOTE: 2,
  CHALLENGE_COMPLETE: 20, // Plus challenge.points_reward
  LEARNING_PATH_COMPLETE: 50,
  BADGE_EARNED: 10 // Plus badge.points_reward
}

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay',
  TRUE_FALSE: 'true_false'
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully!',
  UPDATED: 'Updated successfully!',
  DELETED: 'Deleted successfully!',
  SAVED: 'Saved successfully!',
  LOGIN_SUCCESS: 'Logged in successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  EMAIL_VERIFIED: 'Email verified successfully!'
}

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
}

// Feature Flags
export const FEATURES = {
  POLLS_ENABLED: true,
  QUIZZES_ENABLED: true,
  ACTIVITIES_ENABLED: true,
  SOCIAL_ENABLED: true,
  GAMIFICATION_ENABLED: true,
  ADMIN_ENABLED: true,
  LEARNING_PATHS_ENABLED: true,
  AI_MATCHES_ENABLED: true
}

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd',
  ISO_DATETIME: 'yyyy-MM-dd HH:mm:ss'
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  PREFERENCES: 'user_preferences',
  THEME: 'theme_preference'
}

export default {
  API_CONFIG,
  SESSION_TYPES,
  DIFFICULTY_LEVELS,
  EXPERIENCE_LEVELS,
  RESOURCE_TYPES,
  RATING_TYPES,
  ANNOUNCEMENT_CATEGORIES,
  PRIORITY_LEVELS,
  BADGE_RARITY,
  CHALLENGE_DIFFICULTY,
  PARTNER_CATEGORIES,
  PARTNER_TIERS,
  LEADERBOARD_TIERS,
  POINTS,
  QUESTION_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  FEATURES,
  DATE_FORMATS,
  STORAGE_KEYS
}