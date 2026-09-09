// FEATURE 15: EMAIL NOTIFICATIONS SYSTEM
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const API_BASE = 'http://127.0.0.1:8000';

// ============= EMAIL PREFERENCES COMPONENT =============
export const EmailPreferences = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${API_BASE}/emails/preferences`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreferences(res.data.preferences);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key) => {
    try {
      const token = localStorage.getItem('access_token');
      const updates = {
        [key]: !preferences[key]
      };
      
      const res = await axios.put(`${API_BASE}/emails/preferences`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPreferences(res.data.preferences);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!preferences) return <div className="text-center py-12">Unable to load preferences</div>;

  const emailTypes = [
    { key: 'email_session_reminders', label: '🎯 Session Reminders', description: 'Get notified 24 hours before sessions' },
    { key: 'email_follow_up', label: '📝 Follow-up Emails', description: 'Feedback requests after events' },
    { key: 'email_recommendations', label: '✨ Personalized Recommendations', description: 'Sessions based on your interests' },
    { key: 'email_partner_alerts', label: '🤝 Partner Offers', description: 'Special offers from partners' },
    { key: 'email_networking_suggestions', label: '🌐 Networking Suggestions', description: 'Connect with people at events' },
    { key: 'email_announcements', label: '📢 Announcements', description: 'Important event updates' },
    { key: 'email_weekly_digest', label: '📬 Weekly Digest', description: 'Summary of upcoming events' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">📧 Email Preferences</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Choose which emails you want to receive</p>

      {saved && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 rounded-lg">
          ✅ Preferences saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {emailTypes.map((type) => (
          <div
            key={type.key}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{type.label}</h3>
              <button
                onClick={() => handleToggle(type.key)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  preferences[type.key]
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    preferences[type.key] ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
            <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {preferences[type.key] ? '✅ Enabled' : '❌ Disabled'}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl">
        <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">💡 Tip</h3>
        <p className="text-blue-800 dark:text-blue-300">
          You can unsubscribe from any email at any time by using the unsubscribe link in the email footer.
        </p>
      </div>
    </div>
  );
};

// ============= ADMIN: EMAIL TEMPLATES MANAGER =============
export const EmailTemplatesManager = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    variables: '',
    is_active: true
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(`${API_BASE}/emails/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(res.data.templates || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_BASE}/emails/templates/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Template created!');
      setShowForm(false);
      setFormData({ name: '', subject: '', body: '', variables: '', is_active: true });
      fetchTemplates();
    } catch (err) {
      alert('❌ Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📧 Email Templates</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
        >
          + Create Template
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border-2 border-blue-300 dark:border-blue-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Create Email Template</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Template Name (e.g., welcome_email)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono"
            />
            <input
              type="text"
              placeholder="Subject (use {{variable}} syntax)"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <textarea
              placeholder="HTML Body (use {{variable}} for dynamic content)"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows="8"
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono text-sm"
            />
            <input
              type="text"
              placeholder="Variables (comma-separated, e.g., user_name, event_title)"
              value={formData.variables}
              onChange={(e) => setFormData({ ...formData, variables: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
            <div className="flex gap-4">
              <button
                onClick={handleCreate}
                className="flex-1 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                ✅ Create Template
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{template.subject}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                template.is_active
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {template.is_active ? '✅ Active' : '❌ Inactive'}
              </span>
            </div>
            {template.variables && (
              <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                <strong>Variables:</strong> {template.variables}
              </div>
            )}
            <div className="flex gap-2">
              <button className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm">Edit</button>
              <button className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">Delete</button>
              <button className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm">Test Send</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============= ADMIN: EMAIL LOGS & STATS =============
export const EmailLogsAndStats = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const logsRes = await axios.get(`${API_BASE}/emails/logs?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const statsRes = await axios.get(`${API_BASE}/emails/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLogs(logsRes.data.logs || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">📊 Email Statistics & Logs</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-100 dark:bg-green-900/30 rounded-xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Emails Sent</p>
            <p className="text-4xl font-bold text-green-600 dark:text-green-300">{stats.total_sent}</p>
          </div>
          <div className="bg-red-100 dark:bg-red-900/30 rounded-xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Failed</p>
            <p className="text-4xl font-bold text-red-600 dark:text-red-300">{stats.total_failed}</p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Pending</p>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-300">{stats.pending_count}</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Success Rate</p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-300">{stats.success_rate}%</p>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Email Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Sent', value: stats?.total_sent || 0 },
                { name: 'Failed', value: stats?.total_failed || 0 },
                { name: 'Pending', value: stats?.pending_count || 0 }
              ]}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              <Cell fill="#10b981" />
              <Cell fill="#ef4444" />
              <Cell fill="#f59e0b" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📋 Email Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">To</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Template</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-3 text-gray-900 dark:text-white text-sm">{log.recipient_email}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white text-sm font-mono">{log.template_name}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-white text-sm">{log.subject.substring(0, 40)}...</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      log.status === 'sent'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {log.status === 'sent' ? '✅ Sent' : '❌ Failed'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600 dark:text-gray-400 text-sm">
                    {log.sent_at ? new Date(log.sent_at).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============= EMAIL PAGE WRAPPER =============
export const EmailManagementPage = () => {
  const [activeTab, setActiveTab] = useState('preferences');

  const renderTab = () => {
    switch (activeTab) {
      case 'preferences':
        return <EmailPreferences />;
      case 'templates':
        return <EmailTemplatesManager />;
      case 'logs':
        return <EmailLogsAndStats />;
      default:
        return <EmailPreferences />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === 'preferences'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📧 Preferences
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📝 Templates
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-4 px-1 border-b-2 font-semibold text-sm transition-colors ${
                activeTab === 'logs'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📊 Logs & Stats
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>{renderTab()}</div>
    </div>
  );
};

// REQUIRED: Vite expects a default export for routed components
export default EmailManagementPage;