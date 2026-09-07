import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { NotificationBell } from '../components/Notifications/NotificationBell';
import { NotificationDropdown } from '../components/Notifications/NotificationDropdown';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://127.0.0.1:8000';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Original State from your code
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifs, setRecentNotifs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Original Notification logic from your code
  useEffect(() => {
    fetchNotificationData();
  }, []);

  const fetchNotificationData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/notifications`, {
        params: { user_id: 1, event_id: 1, limit: 5 }
      });
      setUnreadCount(res.data.unread_count);
      setRecentNotifs(res.data.notifications);
    } catch (err) {
      console.error('Error fetching notification badge data:', err);
    }
  };

  // Upgraded Logout logic
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4 flex justify-between items-center relative z-50">
      
      {/* Left Side: Logo / Brand (Upgraded to use Link) */}
      <div className="flex items-center">
        <Link to={user?.role === 'admin' ? "/admin" : "/dashboard"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🎯</span>
          <span className="font-bold text-xl text-orange-600 tracking-tight">EventAI</span>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        
        {user ? (
          <>
            {/* NEW Feature 16: Analytics Link */}
            <Link 
              to="/analytics" 
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>📊</span> Analytics
            </Link>

            {/* NEW Feature 15: Standard User Link */}
            <Link 
              to="/email-preferences" 
              className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>📧</span> Email Settings
            </Link>

            {/* NEW Feature 15: Admin Only Link */}
            {user.role === 'admin' && (
              <Link 
                to="/admin/emails" 
                className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <span>⚙️</span> Email Management
              </Link>
            )}

            {/* ORIGINAL Notification Bell with Dropdown Container */}
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6">
              <NotificationBell
                count={unreadCount}
                onClick={() => setShowDropdown(!showDropdown)}
              />

              {showDropdown && (
                <NotificationDropdown
                  notifications={recentNotifs}
                  onClose={() => setShowDropdown(false)}
                />
              )}
            </div>

            {/* ORIGINAL User Authentication Status / Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-3 focus:outline-none"
              >
                <span className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
                  Welcome, {user.first_name || user.name || 'User'}
                </span>
                <img
                  src={user.profile_picture_url || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                />
              </button>

              {/* ORIGINAL User Dropdown Menu (Upgraded to Link tags) */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-600">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    ⚙️ Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 font-semibold"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ORIGINAL Logged Out State (Upgraded to Link tags to prevent page refresh) */
          <div className="flex gap-3">
            <Link
              to="/auth/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;