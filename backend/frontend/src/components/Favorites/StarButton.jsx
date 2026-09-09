import React, { useState, useEffect } from 'react';

import axios from 'axios';



const API_BASE = 'http://127.0.0.1:8000';



export const StarButton = ({

  itemType,

  itemId,

  itemTitle,

  onToggle,

  size = "medium"

}) => {

  const [isFavorited, setIsFavorited] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isHovered, setIsHovered] = useState(false);



  useEffect(() => {

    checkFavorite();

  }, [itemId, itemType]);



  const checkFavorite = async () => {

    try {

      const res = await axios.get(

        `${API_BASE}/api/favorites/check/${itemType}/${itemId}`,

        { params: { user_id: 1, event_id: 1 } }

      );

      setIsFavorited(res.data.is_favorited);

    } catch (err) {

      console.error('Error checking favorite:', err);

    }

  };



  const handleToggle = async (e) => {

    e.stopPropagation();

    setIsLoading(true);



    try {

      if (isFavorited) {

        await axios.delete(

          `${API_BASE}/api/favorites/${itemId}`,

          { params: { user_id: 1 } }

        );

        setIsFavorited(false);

      } else {

        await axios.post(`${API_BASE}/api/favorites/add`, {

          user_id: 1,

          event_id: 1,

          favorite_type: itemType,

          favorite_id: itemId,

          favorite_title: itemTitle,

          favorite_description: `${itemType} - ${itemTitle}`,

          favorite_icon_emoji: getEmoji(itemType),

          favorite_image_url: null,

          notes: ''

        });

        setIsFavorited(true);

      }

      if (onToggle) onToggle(isFavorited);

    } catch (err) {

      console.error('Error toggling favorite:', err);

    } finally {

      setIsLoading(false);

    }

  };



  const getEmoji = (type) => {

    const emojis = { session: '📋', person: '👤', speaker: '🎤', partner: '🏢' };

    return emojis[type] || '⭐';

  };



  const sizeClasses = { small: 'text-lg', medium: 'text-2xl', large: 'text-4xl' };



  return (

    <button

      onClick={handleToggle}

      disabled={isLoading}

      onMouseEnter={() => setIsHovered(true)}

      onMouseLeave={() => setIsHovered(false)}

      className={`

        transition-all duration-200 cursor-pointer

        ${sizeClasses[size]}

        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}

        ${isHovered && !isFavorited ? 'scale-110' : 'scale-100'}

        ${isFavorited ? 'text-orange-400' : 'text-gray-400'}

      `}

      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}

    >

      {isFavorited ? '⭐' : '☆'}

    </button>

  );

}; 