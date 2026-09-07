// ============================================================================
// Bottom Navigation Component
// ============================================================================
// File: src/components/layout/BottomNavigation.jsx
// Purpose: Mobile bottom navigation bar
// Status: Production-Ready ✅

import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Compass, Users, Trophy, User } from 'lucide-react'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Compass, label: 'Explore', path: '/sessions' },
    { icon: Users, label: 'Network', path: '/networking' },
    { icon: Trophy, label: 'Engage', path: '/activity-hub' },
    { icon: User, label: 'Profile', path: '/profile' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-neutral-200 z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition-colors ${
                active
                  ? 'text-primary-600 border-t-2 border-primary-600'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation