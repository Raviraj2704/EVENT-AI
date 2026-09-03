import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import our new Notification components
import { NotificationBell } from '../components/Notifications/NotificationBell';
import { NotificationDropdown } from '../components/Notifications/NotificationDropdown';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch both Events and Notifications at the same time
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch Events
        const eventsRes = await axios.get(`${API_URL}/api/events`);
        setEvents(eventsRes.data);

        // 2. Fetch Notifications (Using default IDs 1 for now)
        const userId = localStorage.getItem('user_id') || 1;
        const notifRes = await axios.get(`${API_URL}/api/notifications`, {
          params: { user_id: userId, event_id: 1, limit: 5 }
        });
        setNotifications(notifRes.data.notifications);
        setUnreadCount(notifRes.data.unread_count);
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-10 font-semibold">Loading Dashboard...</div>;

  return (
    <div className="bg-gray-50 min-h-screen dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow relative z-20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EVENT AI</h1>
          
          <div className="flex items-center gap-6">
            
            {/* --- NOTIFICATIONS BELL & DROPDOWN --- */}
            <div className="relative">
              <NotificationBell 
                count={unreadCount} 
                onClick={() => setShowDropdown(!showDropdown)} 
              />
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <NotificationDropdown 
                  notifications={notifications} 
                  onClose={() => setShowDropdown(false)} 
                />
              )}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors font-semibold shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Upcoming Events</h2>

        {events.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No events yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{event.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                  📍 {event.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <button 
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}