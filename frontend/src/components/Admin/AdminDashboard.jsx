import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const AdminDashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/admin/analytics/overview`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="text-center py-12">Loading Dashboard Data...</div>;
  }

  const statCards = [
    { label: 'Total Events', value: stats.total_events, color: 'bg-blue-100 dark:bg-blue-900/30', textColor: 'text-blue-600' },
    { label: 'Live Events', value: stats.live_events, color: 'bg-green-100 dark:bg-green-900/30', textColor: 'text-green-600' },
    { label: 'Total Speakers', value: stats.total_speakers, color: 'bg-purple-100 dark:bg-purple-900/30', textColor: 'text-purple-600' },
    { label: 'Total Sessions', value: stats.total_sessions, color: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-600' },
    { label: 'Total Attendees', value: stats.total_attendees, color: 'bg-pink-100 dark:bg-pink-900/30', textColor: 'text-pink-600' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-xl p-6 text-center`}>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⚡ Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <button onClick={() => setActiveTab('events')} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">+ Create Event</button>
          <button onClick={() => setActiveTab('speakers')} className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold">+ Add Speaker</button>
          <button onClick={() => setActiveTab('sessions')} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold">+ Create Session</button>
          <button onClick={() => setActiveTab('announcements')} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">+ Send Announcement</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;