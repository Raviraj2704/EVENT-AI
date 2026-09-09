import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import BotAvatar from './BotAvatar';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const API_BASE = 'http://127.0.0.1:8000';

export const ChatWindow = ({ conversationId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE}/api/messages/${conversationId}`,
        { params: { user_id: 1, limit: 100 } }
      );
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      setSending(true);
      const res = await axios.post(`${API_BASE}/api/messages/send`, {
        conversation_id: conversationId,
        user_id: 1,
        event_id: 1,
        content: content
      });

      setMessages([
        ...messages,
        {
          id: res.data.user_message.id,
          conversation_id: conversationId,
          user_id: 1,
          message_type: 'user',
          content: res.data.user_message.content,
          is_helpful: null,
          created_at: res.data.user_message.created_at
        },
        {
          id: res.data.bot_message.id,
          conversation_id: conversationId,
          user_id: 1,
          message_type: 'assistant',
          content: res.data.bot_message.content,
          is_helpful: null,
          created_at: res.data.bot_message.created_at
        }
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleFeedback = async (messageId, isHelpful) => {
    try {
      await axios.put(
        `${API_BASE}/api/messages/${messageId}/feedback`,
        null,
        { params: { is_helpful: isHelpful, user_id: 1 } }
      );

      setMessages(
        messages.map((msg) =>
          msg.id === messageId ? { ...msg, is_helpful: isHelpful } : msg
        )
      );
    } catch (err) {
      console.error('Error recording feedback:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BotAvatar avatar="🤖" size="sm" />
          <div>
            <h3 className="font-bold">Picbot</h3>
            <p className="text-xs text-blue-200">Always here to help</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Loading chat...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-2xl mb-2">👋</p>
            <p className="font-semibold">Hi! I'm Picbot</p>
            <p className="text-sm mt-2">Ask me anything about the event!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isUser={msg.message_type === 'user'}
                onFeedback={handleFeedback}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 rounded-b-xl">
        <ChatInput onSend={handleSendMessage} disabled={sending || loading} />
      </div>
    </div>
  );
};

export default ChatWindow;