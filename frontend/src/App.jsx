// ============================================================================
// Main App Component with Routing - CRASH FREE VERSION
// ============================================================================
// Uses your EXISTING file structure - No missing imports!
// File: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// ============================================================================
// CORRECTED IMPORTS (Exactly matching your current file names)
// ============================================================================

// Auth Pages
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import VerifyEmailScreen from './pages/VerifyEmailScreen';
import CompleteProfileScreen from './pages/CompleteProfileScreen';

// Main Pages
import HomePage from './pages/HomePage';
import SessionsPage from './pages/SessionsPage';
import HubPage from './pages/HubPage';
import NetworkingPage from './pages/NetworkingPage';
import ProfilePage from './pages/ProfilePage';
import PicbotPage from './pages/PicbotPage';

// Engagement Pages
import SocialWallPage from './pages/SocialWallPage';
import ActivityPage from './pages/ActivityPage';
import AIMatchesPage from './pages/AIMatchesPage';
import PartnersPage from './pages/PartnersPage';
import BriefcasePage from './pages/BriefcasePage';

// Gamification & Learning Pages (FIXED PATHS HERE)
import RatingsPage from './pages/SessionReviewsPage';
import AnalyticsPage from './Components/Analytics/AnalyticsPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import SpeakersPage from './pages/SpeakersPage';
import LearningPage from './pages/LearningPathsPage';

// Engagement Center & Admin (FIXED PATHS HERE)
import EngagementPage from './pages/EngagementCenterScreen';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      
      {/* Toast Notifications */}
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
        {/* ===== Auth Routes (Public) ===== */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/verify-email" element={<VerifyEmailScreen />} />
        <Route path="/auth/complete-profile" element={<CompleteProfileScreen />} />

        {/* ===== Main Routes ===== */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/hub" element={<HubPage />} />
        <Route path="/networking" element={<NetworkingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/picbot" element={<PicbotPage />} />

        {/* ===== Engagement Routes ===== */}
        <Route path="/social-wall" element={<SocialWallPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/ai-matches" element={<AIMatchesPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/briefcase" element={<BriefcasePage />} />

        {/* ===== Gamification & Learning Routes ===== */}
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/speakers" element={<SpeakersPage />} />
        <Route path="/learning" element={<LearningPage />} />

        {/* ===== Engagement Center & Admin ===== */}
        <Route path="/engagement" element={<EngagementPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        {/* Catch-all Fallback - Modified to show the exact broken URL */}
        <Route 
          path="*" 
          element={
            <div className="p-10 mt-20 text-2xl font-bold text-red-600 text-center">
              404 Error: The app tried to load "<span className="text-black">{window.location.pathname}</span>" but there is no Route matching that exact name in App.jsx.
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;