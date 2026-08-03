import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SessionCard from '../components/SessionCard';

const API_URL = 'http://localhost:8000';

export default function EventDetail() {
  const { eventId } = useParams();
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

    Promise.all([
      axios.get(`${API_URL}/api/events/${eventId}`),
      axios.get(`${API_URL}/api/events/${eventId}/sessions`)
    ])
      .then(([eventRes, sessionsRes]) => {
        setEvent(eventRes.data);
        setSessions(sessionsRes.data);
      })
      .finally(() => setLoading(false));
  }, [eventId, navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!event) return <div className="text-center mt-10">Event not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:underline mb-4"
          >
            ← Back to Events
          </button>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-gray-600 mt-2">{event.location}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <p className="text-gray-700 mb-8">{event.description}</p>

        <h2 className="text-2xl font-bold mb-6">Sessions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </main>
    </div>
  );
}