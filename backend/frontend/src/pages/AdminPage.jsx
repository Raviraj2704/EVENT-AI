import React, { useState } from 'react';

// Import Layout and Tabs
import AdminLayout from '../components/Admin/AdminLayout';
import AdminDashboard from '../components/Admin/AdminDashboard';
import EventsManager from '../components/Admin/EventsManager';
import SpeakersManager from '../components/Admin/SpeakersManager';
import SessionsManager from '../components/Admin/SessionsManager'; // <-- Added Session Manager Import
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard';
import AnnouncementsManager from '../components/Admin/AnnouncementsManager';
import AuditLog from '../components/Admin/AuditLog';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminDashboard setActiveTab={setActiveTab} />;
      case 'events':
        return <EventsManager />;
      case 'speakers':
        return <SpeakersManager />;
      case 'sessions':
        return <SessionsManager />; // <-- Added Sessions Tab Case
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'announcements':
        return <AnnouncementsManager />;
      case 'audit':
        return <AuditLog />;
      default:
        return <AdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="w-full">
        {renderTab()}
      </div>
    </AdminLayout>
  );
};

export default AdminPage;