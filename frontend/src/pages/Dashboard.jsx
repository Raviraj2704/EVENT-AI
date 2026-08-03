import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch events directly (bypassing the missing /api/users/me route)
    axios
      .get(`${API_URL}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">EVENT AI</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="text-gray-600">No events yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-4">{event.location}</p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <button 
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
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