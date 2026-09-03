import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FavoriteCard } from '../components/Favorites/FavoriteCard';

const API_BASE = "http://127.0.0.1:8000";

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  const userId = 1;
  const eventId = 1;

  const fetchFavoritesAndStats = async () => {
    try {
      setLoading(true);
      const favRes = await axios.get(`${API_BASE}/api/favorites`, {
        params: {
          user_id: userId,
          event_id: eventId,
          ...(filterType !== 'all' && { favorite_type: filterType }),
          sort_by: sortBy,
          limit: 50
        }
      });
      setFavorites(Array.isArray(favRes.data) ? favRes.data : favRes.data.favorites || []);

      const statsRes = await axios.get(`${API_BASE}/api/favorites/stats`, {
        params: { user_id: userId, event_id: eventId }
      });
      setStats(statsRes.data);
    } catch (err) {
      console.error("Error fetching favorites or stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritesAndStats();
  }, [filterType, sortBy]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">My Bookmarks & Favorites</h1>
        <p className="text-gray-400 mb-6">Access your saved sessions, speakers, and event highlights in one place.</p>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">Total Saved</p>
              <p className="text-2xl font-bold">{stats.total_favorites}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">Pinned Items</p>
              <p className="text-2xl font-bold text-red-400">{stats.pinned_count}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">Sessions</p>
              <p className="text-2xl font-bold text-blue-400">{stats.by_type?.session || 0}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm">People / Speakers</p>
              <p className="text-2xl font-bold text-green-400">{stats.by_type?.person || stats.by_type?.speaker || 0}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded text-sm font-semibold ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              All Favorites
            </button>
            <button
              onClick={() => setFilterType('session')}
              className={`px-4 py-2 rounded text-sm font-semibold ${filterType === 'session' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Sessions
            </button>
            <button
              onClick={() => setFilterType('person')}
              className={`px-4 py-2 rounded text-sm font-semibold ${filterType === 'person' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              Persons
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="recent">Recent First</option>
              <option value="pinned">Pinned First</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-center py-10">Loading favorites...</p>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-lg mb-2">No favorites found.</p>
            <p className="text-sm text-gray-500">Click the star icon (⭐) on any session or speaker to save them here!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => (
              <FavoriteCard
                key={fav.id || fav.session_id || fav.item_id}
                favorite={fav}
                onUpdate={fetchFavoritesAndStats}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};