import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Schedule() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    // Placeholder for personal saved schedule items
    setSchedule([
      { id: 1, title: 'Opening Keynote: Future of AI', time: '10:00 AM - 11:30 AM', location: 'Main Hall' }
    ]);
  }, [navigate]);

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-blue-600 hover:underline"
        >
          &larr; Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-6">My Schedule</h1>

        {schedule.length === 0 ? (
          <p className="text-gray-600">Your schedule is currently empty. Browse events to add sessions!</p>
        ) : (
          <div className="space-y-4">
            {schedule.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.time} | {item.location}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}