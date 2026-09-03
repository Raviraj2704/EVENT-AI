import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SessionCard } from '../components/SessionCard';

const API_BASE = "http://localhost:8000";

export default function Schedule() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/api/sessions?event_id=1`)
            .then(res => {
                const fetchedData = res.data.sessions || res.data;
                if (Array.isArray(fetchedData)) {
                    setSessions(fetchedData);
                }
            })
            .catch(err => console.log("Error fetching schedule sessions:", err));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">My Schedule</h1>
                <button
                    onClick={() => navigate('/favorites')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow"
                >
                    View Favorites ⭐
                </button>
            </div>
            
            <div className="space-y-4">
                {sessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
}