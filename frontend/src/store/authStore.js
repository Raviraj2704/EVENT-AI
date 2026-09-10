import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../config/apiClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
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

      register: async (first_name, last_name, username, email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await apiClient.post('/auth/register', { 
            first_name,
            last_name,
            username,
            email, 
            password 
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
          // Throws a safe string to prevent the React #31 White Screen Crash
          throw new Error(errorMessage); 
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          // Fixed 422 Error: Sending standard JSON instead of Form Data
          const response = await apiClient.post('/auth/login', {
            username: email, 
            password: password
          });

          const { access_token, refresh_token } = response.data;
          get().setTokens(access_token, refresh_token);
          set({ loading: false });
          return response.data;
        } catch (error) {
          const detail = error.response?.data?.detail;
          const errorMessage = typeof detail === 'string' ? detail : 'Login failed. Please check your credentials.';
          set({ error: errorMessage, loading: false });
          // Throws a safe string to prevent the React #31 White Screen Crash
          throw new Error(errorMessage); 
        }
      },

      updateUser: (newUserData) => set((state) => ({ 
        user: { ...state.user, ...newUserData } 
      })),

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      }
    }),
    {
      name: 'eventai-auth-storage',
    }
  )
);