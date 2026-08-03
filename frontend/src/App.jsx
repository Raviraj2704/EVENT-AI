import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import { NetworkingPage } from './pages/NetworkingPage';
import { MessagingPage } from './pages/MessagingPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/networking" element={<NetworkingPage />} />
        <Route path="/messages" element={<MessagingPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;