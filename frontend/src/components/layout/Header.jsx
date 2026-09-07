// ============================================================================
// Header Component
// ============================================================================
// File: src/components/layout/Header.jsx
// Purpose: Top navigation bar with logo and user menu
// Status: Production-Ready ✅

import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Settings, User, Bell, Search } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/auth/login', { replace: true })
    setIsUserMenuOpen(false)
  }

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'Sessions', path: '/sessions' },
    { label: 'Hub', path: '/hub' },
    { label: 'Networking', path: '/networking' }
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="font-bold text-lg text-neutral-900 hidden sm:inline">
              EventAI
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-neutral-600" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-neutral-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center overflow-hidden">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-neutral-200 shadow-lg overflow-hidden">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs text-neutral-600">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-3 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </button>

                    {user?.is_admin && (
                      <button
                        onClick={() => {
                          navigate('/admin')
                          setIsUserMenuOpen(false)
                        }}
                        className="w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-3 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        navigate('/profile')
                        setIsUserMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-neutral-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-error hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-neutral-600" />
              ) : (
                <Menu className="w-5 h-5 text-neutral-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-neutral-200 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsMenuOpen(false)
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header