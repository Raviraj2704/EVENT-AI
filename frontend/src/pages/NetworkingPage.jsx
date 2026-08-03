import React, { useState, useEffect } from 'react';
import { NetworkingGrid } from '../components/networking/NetworkingGrid';
import axios from 'axios';

export const NetworkingPage = () => {
  const [people, setPeople] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeople();
    fetchConnections();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/search/people', {
        params: { q: '', event_id: 1, limit: 50 }
      });
      setPeople(res.data.results);
    } catch (err) {
      console.error('Error fetching people:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/connections', {
        params: { user_id: 1, event_id: 1 }
      });
      setConnections(res.data.connections);
    } catch (err) {
      console.error('Error fetching connections:', err);
    }
  };

  const handleConnect = async (recipientId, message = '') => {
    try {
      await axios.post('http://127.0.0.1:8000/api/connections/request', {
        recipient_id: recipientId,
        event_id: 1,
        custom_message: message
      });
      fetchConnections();
      alert('Connection request sent!');
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <NetworkingGrid
      people={people}
      onConnect={handleConnect}
      connections={connections}
    />
  );
};