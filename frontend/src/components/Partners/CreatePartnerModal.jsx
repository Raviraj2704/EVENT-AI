import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const CreatePartnerModal = ({ isOpen, onClose, onPartnerCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    contact_email: '',
    partner_type: 'gold',
    booth_number: '',
    is_featured: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Add default placeholder if logo URL is empty
      const finalLogo = formData.logo_url || `https://via.placeholder.com/300x150?text=${formData.name.replace(/\s+/g, '+')}`;

      const payload = {
        event_id: 1,
        ...formData,
        logo_url: finalLogo
      };

      await axios.post(`${API_BASE}/api/partners/create`, payload);
      onPartnerCreated();
      onClose();
    } catch (err) {
      console.error('Error creating partner:', err);
      setError(err.response?.data?.detail || 'Failed to create partner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">➕ Add New Sponsor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">✕</button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., Tech Innovators" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="What do they do?" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Sponsorship Tier</label>
              <select name="partner_type" value={formData.partner_type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option value="platinum">Platinum</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
                <option value="community">Community</option>
                <option value="media">Media</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Booth Number</label>
              <input type="text" name="booth_number" value={formData.booth_number} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g., A12" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Website URL</label>
              <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
              <input type="email" name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="hello@company.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Logo Image URL</label>
            <input type="url" name="logo_url" value={formData.logo_url} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" placeholder="Leave empty for auto-generated placeholder" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" name="is_featured" id="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-4 h-4 text-orange-600 rounded" />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Highlight as Featured Sponsor</label>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-lg font-semibold dark:text-white">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700">
              {loading ? 'Saving...' : 'Publish Sponsor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePartnerModal;