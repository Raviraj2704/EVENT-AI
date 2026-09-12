// ============================================
// API CLIENT FIX (frontend/src/api/client.js)
// ============================================

import axios from 'axios';

// ✅ Uses Vite environment variables with your Render URL as the bulletproof fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://event-ai-backend-o2f3.onrender.com/api/v1';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

console.log('🔗 API Base URL:', API_BASE_URL);

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for CORS
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add token to every request if it exists
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ ${error.response.status}:`, error.response.data);
      
      // Auto-logout if token is expired or unauthorized
      if (error.response.status === 401) {
        console.warn('⚠️ Unauthorized - clearing token');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
    } else {
      console.error('❌ Error setup:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// API METHODS
// ============================================

export const checkHealth = async () => {
  try {
    // Uses the base URL, but calls the health endpoint
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const response = await apiClient.get('/events'); // Removed /api prefix since baseURL includes /api/v1
    return response.data;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw error;
  }
};

export default apiClient;