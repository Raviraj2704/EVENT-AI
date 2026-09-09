import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch event details and sessions safely
    axios
      .get(`${API_URL}/api/events/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => console.error('Error fetching event:', err));

    axios
      .get(`${API_URL}/api/events/${id}/sessions`)
      .then((res) => setSessions(res.data))
      .catch((err) => console.error('Error fetching sessions:', err))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="text-center mt-10">Loading event details...</div>;
  if (!event) return <div className="text-center mt-10 text-red-600">Event not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-600 mb-4">{event.location}</p>
        <p className="text-sm text-gray-500 mb-6">{new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-8">{event.description}</p>

        <h2 className="text-2xl font-bold mb-4">Event Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-600">No sessions available for this event.</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="border p-4 rounded shadow-sm">
                <h3 className="text-xl font-semibold">{session.title}</h3>
                <p className="text-gray-600">{session.description}</p>
                <span className="text-sm text-blue-600">Speaker: {session.speaker_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}