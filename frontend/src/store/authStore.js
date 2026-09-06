import { create } from 'zustand';
import apiClient from '../config/apiClient';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('access_token') || null,
  refreshToken: localStorage.getItem('refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  setTokens: (token, refreshToken) => {
    if (token) localStorage.setItem('access_token', token);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    set({ token, refreshToken, isAuthenticated: !!token });
  },

  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    set({ isAuthenticated: !!token, token });
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', { 
        username: name,  
        email: email, 
        password: password 
      });
      set({ loading: false });
      return response.data;
    } catch (error) {
      const detail = error.response?.data?.detail;
      let errorMessage = 'Registration failed';

      if (Array.isArray(detail) && detail.length > 0) {
        errorMessage = detail
          .map((err) => `${err.loc?.slice(-1)[0] || 'field'}: ${err.msg}`)
          .join(', ');
      } else if (typeof detail === 'string') {
        errorMessage = detail;
      }

      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const { access_token, refresh_token } = response.data;
      get().setTokens(access_token, refresh_token);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.detail || 'Login failed', 
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