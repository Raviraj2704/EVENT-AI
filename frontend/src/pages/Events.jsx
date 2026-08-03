import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get(`${API_URL}/api/events`)
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Error fetching events:', err))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="text-center mt-10">Loading events...</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">All Events</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Dashboard
          </button>
        </div>

        {events.length === 0 ? (
          <p className="text-gray-600">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                <p className="text-gray-600 mb-2">{event.location}</p>
                <p className="text-sm text-gray-500 mb-4">{new Date(event.date).toLocaleDateString()}</p>
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
      </div>
    </div>
  );
}