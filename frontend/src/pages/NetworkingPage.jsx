import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BottomNavigation from '../components/BottomNavigation';
import AttendeeCard from '../components/networking/PersonCard'; 
import '../styles/networking.css';

export const NetworkingPage = () => {
  const navigate = useNavigate();

  // ============= STATE MANAGEMENT =============
  const [activeTab, setActiveTab] = useState('networking');
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [showAIMatches, setShowAIMatches] = useState(false);
  
  // Data States
  const [people, setPeople] = useState([]);
  const [connections, setConnections] = useState([]);
  const [filteredAttendees, setFilteredAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============= DESIGNATION OPTIONS =============
  const designations = [
    'HR Manager', 'HR Executive', 'Recruiter', 'Talent Manager',
    'HR Director', 'CHRO', 'Learning & Development', 'Compensation Manager',
  ];

  // ============= MOCK DATA FALLBACK =============
  const mockAttendees = [
    { id: 'attendee-1', name: 'A.K Naik', jobTitle: 'HR Executive', company: 'Asram Medical College', badges: ['Virtual'], avatar: null, initials: 'AN', aiMatch: true, isBookmarked: false, isConnected: false },
    { id: 'attendee-2', name: 'Aachal Jain', jobTitle: 'Recruiter', company: 'CDM Smith', badges: ['Virtual'], avatar: null, initials: 'AJ', aiMatch: false, isBookmarked: false, isConnected: false },
    { id: 'attendee-3', name: 'Aadit Shah', jobTitle: 'AI Manager', company: 'CompiQ', badges: ['Onground'], avatar: null, initials: 'AS', aiMatch: true, isBookmarked: false, isConnected: false },
    { id: 'attendee-4', name: 'Aagam Jhaveri', jobTitle: 'Sr Executive', company: 'Apexon', badges: ['Virtual'], initials: 'AJ', aiMatch: false, isBookmarked: false, isConnected: false },
    { id: 'attendee-5', name: 'Aakanksha Gupta', jobTitle: 'Associate Director, HR', company: 'Mercer', badges: ['Onground'], initials: 'AG', aiMatch: true, isBookmarked: false, isConnected: false },
    { id: 'attendee-6', name: 'Aakanksha Lath', jobTitle: 'VP - HR', company: 'MakeMyTrip', badges: ['Virtual'], initials: 'AL', aiMatch: true, isBookmarked: false, isConnected: false },
  ];

  // ============= GET USER PROFILE =============
  useEffect(() => {
    // [Mock Mode] - Completely disabled backend fetch to eliminate 404 errors
    // axios.get(`${API_BASE}/api/connections...`)
    
    setConnections([
      { id: 1, name: 'Aagam Jhaveri', designation: 'Exec', company: 'Apexon', isAiMatch: true },
      { id: 2, name: 'Aakanksha Gupta', designation: 'Director', company: 'HR', isAiMatch: true }
    ]);
    setLoading(false);
  }, []);

  // ============= AXIOS BACKEND FETCHES =============
  useEffect(() => {
    fetchPeople();
    fetchConnections();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/search/people', {
        params: { q: '', event_id: 1, limit: 50 }
      });
      setPeople(res.data.results || mockAttendees);
    } catch (err) {
      console.error('Backend offline, using fallback data:', err);
      // Failsafe: Use mock data so UI doesn't crash on 404
      setPeople(mockAttendees);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    // [Mock Mode] Backend call disabled
    setLoading(false);
  };

  const handleConnect = async (recipientId, message = '') => {
    try {
      // [Mock Mode] - Silencing backend POST to eliminate 404 errors
      // await axios.post(`${API_BASE}/api/connections/request`, { ... });
      
      alert('Simulated: Connection request sent!');
    } catch (err) {
      alert('Simulated: Connection request sent!');
    }
  };

  // ============= FILTER LOGIC =============
  useEffect(() => {
    let filtered = people;

    if (showAIMatches) {
      filtered = filtered.filter((attendee) => attendee.aiMatch);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (attendee) =>
          (attendee.name && attendee.name.toLowerCase().includes(query)) ||
          (attendee.jobTitle && attendee.jobTitle.toLowerCase().includes(query)) ||
          (attendee.company && attendee.company.toLowerCase().includes(query))
      );
    }
    if (selectedDesignation) {
      filtered = filtered.filter((attendee) =>
        attendee.jobTitle && attendee.jobTitle.toLowerCase().includes(selectedDesignation.toLowerCase())
      );
    }
    setFilteredAttendees(filtered);
  }, [searchQuery, selectedDesignation, showAIMatches, people]);

  // ============= NAVIGATION HANDLER =============
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') navigate('/home');
    if (tab === 'sessions') navigate('/sessions');
    if (tab === 'hub') navigate('/hub');
    if (tab === 'networking') navigate('/networking');
    if (tab === 'profile') navigate('/profile');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
        <div className="border-t-blue-500 border-4 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans pb-32 overflow-y-auto">
      
      {/* Sleek Minimalist Header with Back Button (Replaces Broken TopBar) */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <button 
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-lg hover:bg-slate-800 transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg tracking-wide">Networking</h1>
          <p className="text-xs text-slate-400">Find Connections</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500"
            placeholder="Search attendees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Designation Filter Dropdown */}
        <div className="mb-6">
          <select
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-3 px-4 text-white appearance-none focus:outline-none focus:border-blue-500"
            value={selectedDesignation}
            onChange={(e) => setSelectedDesignation(e.target.value)}
          >
            <option value="">All Designations</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>{designation}</option>
            ))}
          </select>
        </div>

        {/* AI Matches Toggle */}
        <div className="flex justify-between items-center bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <span className="mr-2">⭐</span>
            <span className="font-semibold text-blue-400">AI Matches Only</span>
          </div>
          <button
            className={`w-12 h-6 rounded-full transition-colors relative ${showAIMatches ? 'bg-blue-500' : 'bg-slate-700'}`}
            onClick={() => setShowAIMatches(!showAIMatches)}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${showAIMatches ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>

        {/* Attendees List */}
        <div className="networking-grid grid gap-4">
          {filteredAttendees.length > 0 ? (
            filteredAttendees.map((attendee) => (
              <AttendeeCard
                key={attendee.id}
                attendee={attendee}
                onConnect={() => handleConnect(attendee.id)}
              />
            ))
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p className="text-lg mb-2">No attendees found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Component */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950">
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
      
    </div>
  );
};

export default NetworkingPage;