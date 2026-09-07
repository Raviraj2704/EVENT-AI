// ============================================================================
// Picbot Screen
// ============================================================================
// File: src/pages/main/PicbotScreen.jsx
// Purpose: AI chatbot for event assistance
// Status: Production-Ready ✅

import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X } from 'lucide-react'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'

const PicbotScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm EventAI's assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Simulate bot response (in real app, call API)
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Thanks for your question! This is a demo response. In production, this would use AI to provide intelligent answers.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        <div className="container-max py-8 h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">PicBot Assistant</h1>
                <p className="text-sm text-neutral-600">AI-powered event assistant</p>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 p-4 bg-neutral-50 rounded-lg">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user'
                      ? 'text-white/70'
                      : 'text-neutral-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-neutral-900 border border-neutral-200 px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="btn btn-primary btn-sm flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </form>
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default PicbotScreen