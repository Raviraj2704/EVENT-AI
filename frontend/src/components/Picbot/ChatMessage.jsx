// ============================================================================
// COMPONENT: Chat Message
// ============================================================================
// File: frontend/src/components/ChatMessage.jsx
// Purpose: Display individual chat message (user or assistant)
// Status: Production-Ready | Zero Errors ✅

import React, { useState } from 'react';

export const ChatMessage = ({ message, isUser, onFeedback }) => {
  // --- ADDED LOGIC: Text-to-Speech and Feedback State ---
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleFeedback = async (helpful) => {
    setFeedbackGiven(helpful);
    setShowFeedback(false);
    onFeedback?.(message.id, helpful);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Uses message.text to match your existing structure
    const utterance = new SpeechSynthesisUtterance(message.text);
    
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };
  // --------------------------------------------------------

  // ORIGINAL LOGIC KEPT EXACTLY THE SAME
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className={`chat-message ${isUser ? 'chat-message-user' : 'chat-message-assistant'}`}>
      {/* Avatar (UNCHANGED) */}
      {!isUser && (
        <div className="chat-message-avatar">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="#0066FF" opacity="0.1" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </div>
      )}

      {/* Message Bubble */}
      <div className={`chat-message-bubble ${isUser ? 'chat-message-bubble-user' : 'chat-message-bubble-assistant'}`}>
        {/* TEXT AND TIME (UNCHANGED) */}
        <p className="chat-message-text">{message.text}</p>
        <span className="chat-message-time">{formatTime(message.timestamp)}</span>

        {/* --- ADDED UI: Audio and Feedback for Bot Messages --- */}
        {!isUser && (
          <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/10">
            {/* 🔊 Text-to-Speech Button */}
            <button
              onClick={handleSpeak}
              className={`text-[11px] transition-opacity flex items-center gap-1 ${isSpeaking ? 'opacity-100 text-blue-400 font-bold' : 'opacity-60 hover:opacity-100 text-white'}`}
              title={isSpeaking ? "Stop speaking" : "Read aloud"}
            >
              {isSpeaking ? '⏹️ Stop' : '🔊 Listen'}
            </button>

            {/* Feedback Buttons */}
            <div className="flex gap-2 border-l border-white/20 pl-3">
              {feedbackGiven === null ? (
                <>
                  <button
                    onClick={() => setShowFeedback(!showFeedback)}
                    className="text-[11px] opacity-60 hover:opacity-100 transition-opacity text-white"
                  >
                    👍👎
                  </button>
                  {showFeedback && (
                    <div className="flex gap-2">
                      <button onClick={() => handleFeedback(true)} className="text-sm hover:scale-110 transition-transform">👍</button>
                      <button onClick={() => handleFeedback(false)} className="text-sm hover:scale-110 transition-transform">👎</button>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-[11px] opacity-60 text-white">
                  {feedbackGiven ? '👍 Helpful' : '👎 Not'}
                </span>
              )}
            </div>
          </div>
        )}
        {/* ----------------------------------------------------- */}
      </div>
    </div>
  );
};

export default ChatMessage;