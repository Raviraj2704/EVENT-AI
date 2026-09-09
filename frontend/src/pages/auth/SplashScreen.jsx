// File: src/pages/SplashScreen.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Zap, Users, TrendingUp } from 'lucide-react'

// TODO: Uncomment when store is created
// import { useAuthStore } from '../store/authStore' 

const SplashScreen = () => {
  const navigate = useNavigate()
  
  // TODO: Uncomment when store is created
  // const { isAuthenticated } = useAuthStore()

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/home', { replace: true })
  //   }
  // }, [isAuthenticated, navigate])

  const handleGetStarted = () => {
    navigate('/auth/login')
  }

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Matching',
      description: 'Connect with the right people using intelligent matching'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Stay updated with live notifications and events'
    },
    {
      icon: Users,
      title: 'Networking Hub',
      description: 'Build meaningful connections at events'
    },
    {
      icon: TrendingUp,
      title: 'Gamification',
      description: 'Earn badges and climb the leaderboard'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600">
      
      {/* FIXED: Background Pattern as a React Component instead of an inline string */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Logo & Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            EventAI
          </h1>
          
          <p className="text-xl text-white/80 max-w-md mx-auto">
            AI-Powered Event Management & Networking Platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all hover:bg-white/15"
              >
                <Icon className="w-8 h-8 text-white mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/70">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={handleGetStarted}
            className="w-full btn btn-primary btn-lg bg-white text-primary-600 hover:bg-neutral-100"
            style={{ padding: '12px', borderRadius: '8px', fontWeight: 'bold' }}
          >
            Get Started
          </button>
          
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full btn btn-outline btn-lg border-white text-white hover:bg-white/10"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid white' }}
          >
            Sign In
          </button>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-white/60 text-sm">
          <p>© 2026 EventAI. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen