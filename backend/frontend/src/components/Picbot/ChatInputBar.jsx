// ============================================================================
// COMPONENT: Chat Input Bar
// ============================================================================
// File: frontend/src/components/ChatInputBar.jsx
// Purpose: Input field and send button for chat
// Status: Production-Ready | Zero Errors ✅

import React, { useState, useRef, useEffect } from 'react';

export const ChatInputBar = ({ onSendMessage, isLoading = false }) => {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const textareaRef = useRef(null);

  // --- ADDED LOGIC: Voice Typing State ---
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice typing is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setMessage(currentTranscript);
      
      // Auto-resize textarea while speaking
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    };

    recognition.onerror = (event) => {
      console.error("Microphone error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };
  // ----------------------------------------

  // ============= AUTO-EXPAND TEXTAREA =============
  const handleTextChange = (e) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  // ============= HANDLE SEND =============
  const handleSend = () => {
    if (message.trim() && !isLoading) {
      
      // --- ADDED LOGIC: Stop listening if we send a message ---
      if (isListening && recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
      // ---------------------------------------------------------

      onSendMessage(message);
      setMessage('');
      setRows(1);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // ============= HANDLE KEY PRESS =============
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ============= FOCUS TEXTAREA =============
  const focusTextarea = () => {
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-input-bar">
      <div className="chat-input-wrapper" style={{ position: 'relative' }}>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="chat-input-textarea"
          placeholder="Ask Picbot anything..."
          value={message}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          rows={rows}
          aria-label="Chat message input"
          style={{ paddingRight: '45px' }} // Added to prevent text hiding behind the mic icon
        />

        {/* --- ADDED UI: Microphone Button --- */}
        <button
          type="button"
          onClick={toggleListening}
          disabled={isLoading}
          style={{
            position: 'absolute',
            right: '55px', // Placed neatly to the left of the send button
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            color: isListening ? '#ef4444' : '#6b7280',
            transition: 'color 0.2s ease',
          }}
          title={isListening ? "Stop listening" : "Voice typing"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="20" height="20" style={{ animation: isListening ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
          </svg>
        </button>
        {/* ------------------------------------- */}

        {/* Send Button */}
        <button
          className="chat-input-send-button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className="chat-input-spinner"></span>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.42571969 C0.994623095,2.05405308 0.837654326,3.0966491 1.15159189,3.88214606 L3.03521743,10.3231391 C3.03521743,10.4802365 3.34915502,10.6373339 3.50612381,10.6373339 L16.6915026,11.4228208 C16.6915026,11.4228208 17.1624089,11.4228208 17.1624089,11.0517287 L17.1624089,12.0943131 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Help Text */}
      <p className="chat-input-help-text">Press Shift + Enter for new line</p>
    </div>
  );
};

export default ChatInputBar;