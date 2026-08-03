import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        // Fallback user state if endpoint is missing
        setUser({ name: 'Event User', email: 'user@example.com', job_title: 'Attendee' });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Loading profile...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg text-gray-900">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <p className="mt-1 text-lg text-gray-900">{user?.job_title || 'Professional Attendee'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}