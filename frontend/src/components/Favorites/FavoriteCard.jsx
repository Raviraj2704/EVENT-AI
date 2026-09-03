// ==============================================================================
// frontend/src/components/Favorites/FavoriteCard.jsx (Complete File with Title Fix)
// ==============================================================================

import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = "http://127.0.0.1:8000";

export const FavoriteCard = ({ favorite, onUpdate }) => {
  const [noteText, setNoteText] = useState(favorite.note || '');
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Safely extract the title from various possible backend field names
  const title = favorite.title || favorite.item_title || favorite.session_title || favorite.name || "Untitled Item";
  const itemType = favorite.item_type || favorite.type || favorite.favorite_type || "session";
  const uniqueKey = favorite.id || favorite.session_id || favorite.item_id;

  const handlePin = async () => {
    try {
      await axios.put(`${API_BASE}/api/favorites/${uniqueKey}`, {
        is_pinned: !favorite.is_pinned,
        note: favorite.note || ""
      });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error pinning favorite:", err);
    }
  };

  const handleSaveNotes = async () => {
    try {
      await axios.put(`${API_BASE}/api/favorites/${uniqueKey}`, {
        is_pinned: favorite.is_pinned || false,
        note: noteText
      });
      setIsEditingNote(false);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error saving notes:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/api/favorites/${uniqueKey}`);
      if (onUpdate) onUpdate();
    } catch (err1) {
      try {
        await axios.delete(`${API_BASE}/api/favorites/item/${uniqueKey}`);
        if (onUpdate) onUpdate();
      } catch (err2) {
        try {
          await axios.delete(`${API_BASE}/api/favorites/${uniqueKey}/delete`, {
            params: { user_id: 1, event_id: 1 }
          });
          if (onUpdate) onUpdate();
        } catch (err3) {
          console.error("Error deleting favorite:", err3);
        }
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 mb-4 flex justify-between items-start text-white">
      <div>
        <span className="text-xs uppercase px-2 py-1 bg-blue-900 text-blue-300 rounded-full font-semibold">
          {itemType}
        </span>
        <h3 className="font-bold text-lg text-white mt-2">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">Added to Favorites</p>
        
        {favorite.note && !isEditingNote && (
          <div className="mt-2 p-2 bg-yellow-900/40 border-l-4 border-yellow-500 text-sm text-yellow-200">
            "{favorite.note}"
          </div>
        )}

        {isEditingNote && (
          <div className="mt-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-2 border border-gray-600 bg-gray-900 rounded text-sm text-white"
              placeholder="Type personal note..."
            />
            <button
              onClick={handleSaveNotes}
              className="mt-1 px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700"
            >
              Save Notes
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handlePin}
          title="Pin Favorite"
          className={`p-2 rounded-full border ${favorite.is_pinned ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-gray-700 border-gray-600 text-gray-300'} hover:bg-gray-600`}
        >
          📌
        </button>

        {!isEditingNote && !favorite.note && (
          <button
            onClick={() => setIsEditingNote(true)}
            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600"
          >
            Add Notes
          </button>
        )}

        <button
          onClick={handleDelete}
          title="Delete Favorite"
          className="p-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-full hover:bg-red-900/50 hover:text-red-400"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};