import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SessionCard }from '../components/SessionCard';

const API_BASE = "http://localhost:8000";

export default function Events() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE}/api/sessions`)
            .then(res => {
                const fetchedData = Array.isArray(res.data) ? res.data : (res.data.sessions || []);
                setEvents(fetchedData);
            })
            .catch(err => console.log("Error fetching sessions:", err));
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">All Events & Sessions</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 shadow"
                >
                    Back to Dashboard
                </button>
            </div>
            
            <div className="space-y-4">
                {events.map((session) => (
                    <SessionCard key={session.id} session={session} />
                ))}
            </div>
        </div>
    );
}