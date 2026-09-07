import React from 'react';

const AdminLayout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">⚙️ Admin</h2>
        
        <nav className="space-y-2">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'events', label: '📅 Events', icon: '📅' },
            { id: 'speakers', label: '🎤 Speakers', icon: '🎤' },
            { id: 'sessions', label: '🎯 Sessions', icon: '🎯' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' },
            { id: 'announcements', label: '📢 Announcements', icon: '📢' },
            { id: 'audit', label: '📋 Audit Log', icon: '📋' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
};

export default AdminLayout;