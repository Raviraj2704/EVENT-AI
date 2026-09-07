import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PicbotPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Initial welcome message
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hey there! 🤖 I'm Picbot, your EventAI assistant. Try asking me about your name, the agenda, or use the microphone button to speak your query!", 
      isUser: false, 
      timestamp: new Date() 
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ============= VOICE-TO-TEXT (SPEECH RECOGNITION) =============
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Try using Google Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputMessage(speechToText);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // ============= MESSAGE ACTIONS (COPY & SHARE) =============
  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    alert("Message copied to clipboard!");
  };

  const shareMessage = (text) => {
    if (navigator.share) {
      navigator.share({ title: 'EventAI Picbot', text: text }).catch(() => {});
    } else {
      copyMessage(text);
      alert("Sharing not supported on this browser. Message copied instead!");
    }
  };

  // ============= GENERATE AI RESPONSE (CUSTOM KEYWORDS) =============
  const handleSendMessage = () => {
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage;
    const lowerText = userText.toLowerCase();
    const newUserMsg = { id: Date.now(), text: userText, isUser: true, timestamp: new Date() };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      let botReply = "That's a great question! Once the live backend is connected, I'll fetch the exact data for you.";

      // Custom Keyword Responses (Add yours here!)
      if (lowerText.includes('my name') || lowerText.includes('who am i')) {
        botReply = "You are Ravi Raja, an Agentic AI Engineer attending EventAI 2026!";
      } else if (lowerText.includes('agenda') || lowerText.includes('session')) {
        botReply = "You can view all keynotes and panel schedules under the Agenda tab.";
      } else if (lowerText.includes('networking') || lowerText.includes('connect')) {
        botReply = "Check out the Network tab to discover matched attendees and build professional connections.";
      } else if (lowerText.includes('your-keyword')) {
        botReply = "Your custom AI response here!";
      }

      const botResponse = { 
        id: Date.now() + 1, 
        text: botReply, 
        isUser: false, 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white font-sans flex flex-col">
      
      {/* Header with Custom Gradient */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 backdrop-blur-md px-6 py-4 border-b border-white/10 flex justify-between items-center shadow-lg">
        <button 
          onClick={() => navigate('/hub')}
          className="w-10 h-10 rounded-full bg-slate-900/80 border border-white/10 flex items-center justify-center text-lg hover:bg-slate-800 transition-colors"
        >
          ←
        </button>
        <div className="text-center flex flex-col items-center">
          <h1 className="font-bold text-lg tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Picbot AI
          </h1>
          <p className="text-xs text-slate-400">Online Assistant</p>
        </div>
        <div className="w-10"></div>
      </div>

      {/* Messages History Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-md mx-auto w-full pb-36 whitespace-pre-line">
        {messages.map(msg => (
          <div key={msg.id} className={`flex flex-col w-full mb-4 ${msg.isUser ? 'items-end' : 'items-start'}`}>
            <div className={`flex w-full ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              {!msg.isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-lg border border-slate-700">
                  <span className="text-white text-[10px] font-bold">AI</span>
                </div>
              )}
              {/* Custom Bubble Colors */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                msg.isUser 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-900 text-slate-100 border border-white/10 rounded-tl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>

            {/* Copy / Share Action Buttons for Assistant Messages */}
            {!msg.isUser && (
              <div className="flex items-center gap-3 ml-10 mt-1 text-[11px] text-slate-400">
                <button onClick={() => copyMessage(msg.text)} className="hover:text-blue-400 transition-colors">
                  📋 Copy
                </button>
                <button onClick={() => shareMessage(msg.text)} className="hover:text-blue-400 transition-colors">
                  🔗 Share
                </button>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm p-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Voice Recognition Button */}
      <div className="fixed bottom-[64px] left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center gap-2 bg-slate-900 rounded-full pr-1 pl-4 py-1 border border-white/10">
          
          {/* Voice-to-Text Microphone Button */}
          <button
            onClick={handleVoiceInput}
            title="Speak to Picbot"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            🎤
          </button>

          <input
            type="text"
            className="flex-1 bg-transparent text-white focus:outline-none text-sm py-2 placeholder-slate-500"
            placeholder={isListening ? "Listening..." : "Ask Picbot anything..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
              inputMessage.trim() ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-500'
            }`}
          >
            ➤
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">🏠</span><span className="text-[10px]">Home</span>
        </button>
        <button onClick={() => navigate('/sessions')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">📅</span><span className="text-[10px]">Agenda</span>
        </button>
        <button onClick={() => navigate('/hub')} className="flex flex-col items-center text-blue-500">
          <span className="text-xl mb-1">⚡</span><span className="text-[10px] font-bold">Hub</span>
        </button>
        <button onClick={() => navigate('/networking')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">🤝</span><span className="text-[10px]">Network</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-slate-400 hover:text-white">
          <span className="text-xl mb-1">👤</span><span className="text-[10px]">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default PicbotPage;