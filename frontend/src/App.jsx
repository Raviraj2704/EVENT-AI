// ============================================================================
// Main App Component with Routing
// ============================================================================
// File: src/App.jsx
// Purpose: Root component with React Router setup
// Status: Production-Ready ✅

import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Analytics } from "@vercel/analytics/react" // <-- Added Vercel Analytics Import here

// Store
import { useAuthStore } from './store/authStore'

// Pages - Auth
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen'
import VerifyEmailScreen from './pages/VerifyEmailScreen'
import CompleteProfileScreen from './pages/CompleteProfileScreen'

// Pages - Main
import HomeScreen from './pages/main/HomeScreen'
import SessionsScreen from './pages/main/SessionsScreen'
import HubScreen from './pages/main/HubScreen'
import NetworkingScreen from './pages/main/NetworkingScreen'
import ProfileScreen from './pages/main/ProfileScreen'
import PicbotScreen from './pages/main/PicbotScreen'

// Pages - Engagement
import SocialWallScreen from './pages/engagement/SocialWallScreen'
import ActivityHubScreen from './pages/engagement/ActivityHubScreen'
import AIMatchesScreen from './pages/engagement/AIMatchesScreen'
import PartnersScreen from './pages/engagement/PartnersScreen'
import BriefcaseScreen from './pages/engagement/BriefcaseScreen'

// Pages - Gamification & Learning
import RatingsScreen from './pages/gamification/RatingsScreen'
import AnalyticsScreen from './pages/gamification/AnalyticsScreen'
import AnnouncementsScreen from './pages/gamification/AnnouncementsScreen'
import SpeakersScreen from './pages/gamification/SpeakersScreen'
import LearningPathsScreen from './pages/gamification/LearningPathsScreen'

// Pages - Engagement Center & Admin
import EngagementCenterScreen from './pages/engagement-center/EngagementCenterScreen'
import AdminDashboardScreen from './pages/admin/AdminDashboardScreen'

// Components
import PrivateRoute from './components/auth/PrivateRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

const App = () => {
  const { isAuthenticated, token, checkAuth } = useAuthStore()

  useEffect(() => {
    // Check if user is already authenticated
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff'
          }
        }}
      />
      
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/verify-email" element={<VerifyEmailScreen />} />
        <Route path="/auth/complete-profile" element={<CompleteProfileScreen />} />

        {/* Main Routes - Protected */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomeScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/sessions"
          element={
            <PrivateRoute>
              <SessionsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/hub"
          element={
            <PrivateRoute>
              <HubScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/networking"
          element={
            <PrivateRoute>
              <NetworkingScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfileScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/picbot"
          element={
            <PrivateRoute>
              <PicbotScreen />
            </PrivateRoute>
          }
        />

        {/* Engagement Routes - Protected */}
        <Route
          path="/social-wall"
          element={
            <PrivateRoute>
              <SocialWallScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/activity-hub"
          element={
            <PrivateRoute>
              <ActivityHubScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/ai-matches"
          element={
            <PrivateRoute>
              <AIMatchesScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/partners"
          element={
            <PrivateRoute>
              <PartnersScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/briefcase"
          element={
            <PrivateRoute>
              <BriefcaseScreen />
            </PrivateRoute>
          }
        />

        {/* Gamification & Learning Routes - Protected */}
        <Route
          path="/ratings"
          element={
            <PrivateRoute>
              <RatingsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AnalyticsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute>
              <AnnouncementsScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/speakers"
          element={
            <PrivateRoute>
              <SpeakersScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/learning-paths"
          element={
            <PrivateRoute>
              <LearningPathsScreen />
            </PrivateRoute>
          }
        />

        {/* Engagement Center & Admin - Protected */}
        <Route
          path="/engagement-center"
          element={
            <PrivateRoute>
              <EngagementCenterScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute adminOnly={true}>
              <AdminDashboardScreen />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Vercel Analytics Component added here */}
      <Analytics />
    </Router>
  )
}

export default App