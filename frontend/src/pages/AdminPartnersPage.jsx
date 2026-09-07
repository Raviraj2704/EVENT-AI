import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePartnerModal from '../components/Partners/CreatePartnerModal';

const API_BASE = 'http://127.0.0.1:8000';

export const AdminPartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/partners`, { params: { event_id: 1 } });
      setPartners(res.data.partners);
    } catch (err) {
      console.error('Error fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this sponsor?')) {
      try {
        await axios.delete(`${API_BASE}/api/partners/${id}`);
        fetchPartners(); // Refresh list after deleting
      } catch (err) {
        console.error('Error deleting partner:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-orange-600">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin: Sponsor Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage event partners, tiers, and visibility.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md transition-all"
          >
            ➕ Add New Sponsor
          </button>
        </div>

        {/* Management Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading database...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Company</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Tier</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Booth</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="p-4 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(partner => (
                  <tr key={partner.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-gray-900 dark:text-white">{partner.name}</div>
                      <a href={partner.website_url} className="text-xs text-blue-500 hover:underline">{partner.website_url}</a>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-bold uppercase rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                        {partner.partner_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{partner.booth_number || 'N/A'}</td>
                    <td className="p-4">
                      {partner.is_featured ? (
                        <span className="text-orange-600 font-bold text-xs">⭐ Featured</span>
                      ) : (
                        <span className="text-green-600 font-bold text-xs">✓ Active</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(partner.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-sm px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-md"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <CreatePartnerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onPartnerCreated={fetchPartners} 
        />
        
      </div>
    </div>
  );
};

export default AdminPartnersPage;