import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CalendarView from '../components/Calendar/CalendarView';
import CreateEventModal from '../components/Calendar/CreateEventModal';

const API_BASE = 'http://127.0.0.1:8000';

export const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [userCalendar, setUserCalendar] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const eventsRes = await axios.get(`${API_BASE}/api/calendar/events`, {
        params: { event_id: 1 }
      });
      setEvents(eventsRes.data.events);

      const userRes = await axios.get(`${API_BASE}/api/calendar/user`, {
        params: { user_id: 1, event_id: 1, include_past: false }
      });
      setUserCalendar(userRes.data.calendars);

      const statsRes = await axios.get(`${API_BASE}/api/calendar/stats`, {
        params: { event_id: 1 }
      });
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await axios.post(`${API_BASE}/api/calendar/register`, null, {
        params: { user_id: 1, calendar_event_id: eventId, event_id: 1, reminder_minutes: 15 }
      });
      fetchAllData();
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await axios.delete(`${API_BASE}/api/calendar/unregister`, {
        params: { user_id: 1, calendar_event_id: eventId }
      });
      fetchAllData();
    } catch (err) {
      console.error('Error unregistering:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center py-20">
          <p className="text-gray-600 dark:text-gray-400">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header with Create Event Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              📅 Event Calendar
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and register for sessions
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            ➕ Create Event
          </button>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total_events}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Total Events</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.total_registrations}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Registrations</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.total_attended}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Attended</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.attendance_rate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Attendance Rate</p>
            </div>
          </div>
        )}

        {/* Calendar View */}
        <CalendarView
          events={events}
          userCalendar={userCalendar}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
        />

        {/* Create Event Modal */}
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchAllData}
        />

      </div>
    </div>
  );
};

export default CalendarPage;