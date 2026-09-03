import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ProfileSettingsItem from '../components/ProfileSettingsItem';
import '../styles/profile-screen.css';

const API_BASE = 'http://127.0.0.1:8000';

export const ProfilePage = () => {
  const navigate = useNavigate();
  
  // FIX: Safety fallback! If AuthContext is empty/offline, it won't crash the app.
  const authContext = useAuth() || {}; 
  const { user, token } = authContext; 

  // ==========================================
  // 1. EXISTING STATE MANAGEMENT
  // ==========================================
  const [apiProfile, setApiProfile] = useState(null);
  const [localProfile, setLocalProfile] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: '', company: '', job_title: '', phone: '', location: '',
    interests: '', social_twitter: '', social_linkedin: '', is_public: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ==========================================
  // 2. NEW UI STATE MANAGEMENT
  // ==========================================
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // ==========================================
  // 3. EXISTING LOGIC & API
  // ==========================================
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedAvatar = localStorage.getItem('userAvatar');

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setLocalProfile(parsed);
      setFormData(prev => ({
        ...prev,
        bio: parsed.bio || '',
        company: parsed.company || '',
        job_title: parsed.jobTitle || parsed.role || '',
        social_linkedin: parsed.linkedinUrl || '',
        social_twitter: parsed.twitterUrl || ''
      }));
    }
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }

    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.profile) {
        setApiProfile(res.data.profile);
        if (!localStorage.getItem('userProfile')) {
          setFormData(res.data.profile);
        }
      }
    } catch (err) {
      console.error('Error fetching API profile:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (user && token) {
        const res = await axios.put(`${API_BASE}/auth/profile`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApiProfile(res.data.profile);
      }

      const updatedLocal = {
        ...localProfile,
        bio: formData.bio,
        company: formData.company,
        jobTitle: formData.job_title,
        linkedinUrl: formData.social_linkedin,
        twitterUrl: formData.social_twitter,
        fullName: localProfile?.fullName || 'Event Attendee',
        email: localProfile?.email || 'user@example.com'
      };
      localStorage.setItem('userProfile', JSON.stringify(updatedLocal));
      setLocalProfile(updatedLocal);

      setSuccess('✅ Profile updated successfully');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. (Backend might be offline)');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear(); 
    navigate('/auth/login');
  };

  // --- SMART DATA MERGE ---
  const displayData = {
    fullName: localProfile?.fullName || (user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Event Attendee'),
    role: localProfile?.role || localProfile?.jobTitle || apiProfile?.job_title || user?.role || 'Guest',
    company: localProfile?.company || apiProfile?.company || 'No Company',
    bio: localProfile?.bio || apiProfile?.bio || 'No bio provided.',
    linkedIn: localProfile?.linkedinUrl || apiProfile?.social_linkedin || '',
    twitter: localProfile?.twitterUrl || apiProfile?.social_twitter || '',
    avatarUrl: avatar || user?.profile_picture_url || null,
    email: user?.email || localProfile?.email || 'user@example.com'
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans pb-32 overflow-y-auto">
      
      {/* Sleek Minimalist Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <button 
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-lg hover:bg-slate-800 transition-colors"
        >
          ←
        </button>
        <div className="text-center">
          <h1 className="font-bold text-lg tracking-wide">Profile</h1>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        
        {/* Notifications (Error/Success) */}
        {error && <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-4">{error}</div>}
        {success && <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-xl mb-4">{success}</div>}

        {editing ? (
          // ==========================================
          // EDIT PROFILE FORM
          // ==========================================
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-white">✕ Cancel</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows="3" className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Company</label>
                  <input type="text" name="company" value={formData.company || ''} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Job Title</label>
                  <input type="text" name="job_title" value={formData.job_title || ''} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">Twitter</label>
                  <input type="text" name="social_twitter" value={formData.social_twitter || ''} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">LinkedIn</label>
                  <input type="text" name="social_linkedin" value={formData.social_linkedin || ''} onChange={handleChange} className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-white" />
                </div>
              </div>
              <button 
                onClick={handleSave} 
                disabled={loading} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 mt-6 rounded-xl transition-all"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          // ==========================================
          // VIEW MODE (Fixed Email Variable!)
          // ==========================================
          <div className="space-y-6">
            
            {/* Profile Header Card */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold overflow-hidden border-2 border-slate-950">
                  {displayData.avatarUrl ? (
                    <img src={displayData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{displayData.fullName.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">{displayData.fullName}</h2>
                  <p className="text-blue-400 text-xs mt-1">{displayData.role}</p>
                  <p className="text-slate-400 text-xs">{displayData.company}</p>
                </div>
              </div>
              <button 
                className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600/30"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            </div>

            {/* Account Section */}
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 px-2">Account</h3>
              <div className="space-y-2">
                <ProfileSettingsItem icon="👤" label="Edit Profile" description="Update your profile information" onClick={() => setEditing(true)} />
                {/* FIX APPLIED HERE: Changed userProfile.email to displayData.email */}
                <ProfileSettingsItem icon="📧" label="Email Address" value={displayData.email} showArrow={true} onClick={() => alert("Email editing feature coming soon!")} />
              </div>
            </div>

            {/* Notifications Toggle UI */}
            <div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-3 px-2 mt-6">Notifications</h3>
              <div className="bg-slate-900 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🔔</div>
                  <div>
                    <p className="font-medium text-white">All Notifications</p>
                    <p className="text-slate-400 text-xs">Event updates and reminders</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold border border-red-500/20 py-4 mt-8 rounded-xl transition-all"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm">
            <h2 className="text-xl font-bold mb-2 text-white">Confirm Logout</h2>
            <p className="text-slate-400 mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-4">
              <button className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              <button className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-500" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">🏠</span><span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => navigate('/sessions')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">📅</span><span className="text-[10px]">Agenda</span>
        </button>
        <button onClick={() => navigate('/hub')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">⚡</span><span className="text-[10px]">Hub</span>
        </button>
        <button onClick={() => navigate('/networking')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">🤝</span><span className="text-[10px]">Network</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-blue-500">
          <span className="text-xl mb-1">👤</span><span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default ProfilePage;