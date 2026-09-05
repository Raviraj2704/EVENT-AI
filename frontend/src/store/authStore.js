import { create } from 'zustand';
import apiClient from '../config/apiClient';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

  // Actions
  setUser: (user) => set({ user }),
  
  setTokens: (token, refreshToken) => {
    if (token) localStorage.setItem('access_token', token);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken, isAuthenticated: !!token });
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      // Sends data to your Render backend
      const response = await apiClient.post('/auth/register', { 
        name, 
        email, 
        password 
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Registration failed', 
        loading: false 
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      // Backend expects JSON body with username_or_email and password
      const response = await apiClient.post('/auth/login', {
        username_or_email: email,
        password: password
      });
      
      const { access_token, refresh_token } = response.data;
      get().setTokens(access_token, refresh_token);
      set({ loading: false });
      
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Login failed. Check your credentials.', 
        loading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
  }
}));