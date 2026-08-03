import { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

export default function SessionCard({ session, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API_URL}/api/schedule/add`,
        { session_id: session.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdded(true);
      if (onAdd) onAdd();
    } catch (err) {
      alert('Failed to add to schedule');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <h4 className="text-lg font-bold">{session.title}</h4>
      <p className="text-gray-600 text-sm mb-2">by {session.speaker_name}</p>
      <p className="text-sm text-gray-500 mb-3">
        {new Date(session.start_time).toLocaleTimeString()} -
        {new Date(session.end_time).toLocaleTimeString()}
      </p>
      <button
        onClick={handleAdd}
        className={`px-4 py-2 rounded text-white text-sm ${
          added ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {added ? '✓ Added' : 'Add to Schedule'}
      </button>
    </div>
  );
}


