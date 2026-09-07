import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

// ============= COLOR SCHEME & DESIGN TOKENS =============
const colors = {
  primary: '#2563eb',      // Professional blue
  secondary: '#f97316',    // Modern orange
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  dark: '#1f2937',
  light: '#f9fafb',
  border: '#e5e7eb',
  text: '#374151',
  textLight: '#6b7280'
};

// ============= NETWORKING COMPONENTS =============

// 1. PEOPLE DISCOVERY CARD (LinkedIn-style)
export const PersonCard = ({ person, onConnect, isConnected, isPending }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  const getStatusColor = () => {
    if (isConnected) return 'bg-green-100 text-green-700';
    if (isPending) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };
  
  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isPending) return 'Pending';
    return 'Connect';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 mb-4 border border-gray-100">
      {/* Header with profile image and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={person.profile_photo_url || 'https://via.placeholder.com/60'}
            alt={person.full_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{person.full_name}</h3>
            <p className="text-sm text-gray-600">{person.headline}</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-500">📍 {person.location}</span>
            </div>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Bio */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{person.bio}</p>

      {/* Company info */}
      <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase">Company</p>
          <p className="font-semibold text-gray-900">{person.company}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Role</p>
          <p className="font-semibold text-gray-900">{person.job_title}</p>
        </div>
      </div>

      {/* Skills & Interests */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills & Interests</p>
        <div className="flex flex-wrap gap-2">
          {(person.interests || []).map((interest, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setShowMessage(!showMessage)}
          className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          💬 Message
        </button>
        
        {!isConnected && (
          <button
            onClick={() => onConnect(person.id)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            🤝 {isPending ? 'Pending' : 'Connect'}
          </button>
        )}
        
        {isConnected && (
          <button className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg cursor-default">
            ✓ Connected
          </button>
        )}
      </div>

      {/* Message Input (Collapsible) */}
      {showMessage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Send a personalized message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
            rows={3}
          />
          <button
            onClick={() => {
              onConnect(person.id, customMessage);
              setShowMessage(false);
            }}
            className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
};

// 2. NETWORKING GRID LAYOUT
export const NetworkingGrid = ({ people, onConnect, connections }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(people);

  useEffect(() => {
    const filtered = people.filter(person =>
      person.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.headline.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPeople(filtered);
  }, [searchQuery, people]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🤝 Network & Connect
          </h1>
          <p className="text-gray-600">
            Discover professionals, build relationships, and expand your network at the event
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, company, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg focus:outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">Total Professionals</p>
            <p className="text-3xl font-bold">{people.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">Your Connections</p>
            <p className="text-3xl font-bold">{connections?.filter(c => c.status === 'accepted').length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">Pending Requests</p>
            <p className="text-3xl font-bold">{connections?.filter(c => c.status === 'pending').length || 0}</p>
          </div>
        </div>
      </div>

      {/* People Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onConnect={onConnect}
              isConnected={connections?.some(c => (c.requester_id === person.id || c.recipient_id === person.id) && c.status === 'accepted')}
              isPending={connections?.some(c => (c.requester_id === person.id || c.recipient_id === person.id) && c.status === 'pending')}
            />
          ))}
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✨ AI Suggestions</h2>
            <p className="text-sm text-gray-600 mb-4">
              Based on your profile, here are people you should connect with
            </p>
            <div className="space-y-3">
              {people.slice(0, 5).map((person) => (
                <div
                  key={person.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-sm text-gray-900">{person.full_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{person.headline}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-600">85% Match</span>
                    <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MESSAGING COMPONENTS =============

// 3. MESSAGE BUBBLE
const MessageBubble = ({ message, isOwn, sender }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md xl:max-w-lg`}>
        {!isOwn && (
          <img
            src={sender?.profile_photo_url || 'https://via.placeholder.com/32'}
            alt={sender?.full_name}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        
        <div>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            } shadow-md`}
          >
            <p className="text-sm break-words">{message.content}</p>
          </div>
          <p className={`text-xs ${isOwn ? 'text-right' : 'text-left'} text-gray-500 mt-1`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

// 4. CHAT INTERFACE
export const ChatInterface = ({ conversation, messages, currentUserId, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const otherParticipant = conversation.participant_1_id === currentUserId
    ? conversation.participant_2_id
    : conversation.participant_1_id;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
            <div>
              <h2 className="font-bold text-lg">Chat Conversation</h2>
              <p className="text-blue-100 text-sm">User #{otherParticipant}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-blue-500 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.sender_id === currentUserId}
            sender={{ full_name: 'Other User', profile_photo_url: null }}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center space-x-2 mb-4">
            <img
              src="https://via.placeholder.com/32"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex space-x-1 p-3 bg-gray-200 rounded-2xl">
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16070636 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99721575 L3.03521743,10.4382088 C3.03521743,10.5953061 3.19218622,10.7524035 3.50612381,10.7524035 L16.6915026,11.5378905 C16.6915026,11.5378905 17.1624089,11.5378905 17.1624089,12.0091827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. CONVERSATIONS LIST
export const ConversationsList = ({ conversations, onSelectConversation, selectedId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-blue-100 text-sm mt-1">{conversations.length} conversations</p>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
              selectedId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/48"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">User #{conv.participant_2_id}</h3>
                  <span className="text-xs text-gray-500">
                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString() : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
              </div>
              
              {conv.unread_count > 0 && (
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {conv.unread_count}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============= MAIN MESSAGING PAGE =============

export const MessagingPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch conversations
    axios.get(`${API_BASE}/api/conversations?user_id=1&event_id=1`)
      .then(res => setConversations(res.data.conversations))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      // Fetch messages for selected conversation
      axios.get(`${API_BASE}/api/conversations/${selectedConversationId}/messages`)
        .then(res => setMessages(res.data.messages))
        .catch(err => console.error(err));
    }
  }, [selectedConversationId]);

  const handleSendMessage = (content) => {
    axios.post(`${API_BASE}/api/conversations/${selectedConversationId}/messages`, {
      conversation_id: selectedConversationId,
      content,
      message_type: 'text'
    })
      .then(res => {
        setMessages([...messages, res.data]);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Conversations */}
      <div className="w-80 border-r border-gray-200">
        <ConversationsList
          conversations={conversations}
          onSelectConversation={setSelectedConversationId}
          selectedId={selectedConversationId}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-6">
        {selectedConversationId ? (
          <ChatInterface
            conversation={conversations.find(c => c.id === selectedConversationId)}
            messages={messages}
            currentUserId={1}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-2xl font-bold text-gray-900">Select a conversation</h2>
              <p className="text-gray-600 mt-2">Choose from your messages to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  PersonCard,
  NetworkingGrid,
  ChatInterface,
  ConversationsList,
  MessagingPage
};