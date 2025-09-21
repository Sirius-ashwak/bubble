import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Heart, BookOpen, Sparkles, Moon, Sun, Settings, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import Dock from './Dock'
import './Dock.css'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  
  const dockItems = [
    { 
      icon: <Home />, 
      label: 'Sanctuary',
      onClick: () => navigate('/dashboard'),
      className: location.pathname === '/dashboard' ? 'active' : ''
    },
    { 
      icon: <Heart />, 
      label: 'Feelings',
      onClick: () => navigate('/mood'),
      className: location.pathname === '/mood' ? 'active' : ''
    },
    { 
      icon: <BookOpen />, 
      label: 'Streams',
      onClick: () => navigate('/journal'),
      className: location.pathname === '/journal' ? 'active' : ''
    },
    { 
      icon: <Sparkles />, 
      label: 'Currents',
      onClick: () => navigate('/coping'),
      className: location.pathname === '/coping' ? 'active' : ''
    },
    { 
      icon: <User />, 
      label: 'Bubble',
      onClick: () => navigate('/profile'),
      className: location.pathname === '/profile' ? 'active' : ''
    },
    { 
      icon: <Settings />, 
      label: 'Settings',
      onClick: () => navigate('/settings'),
      className: location.pathname === '/settings' ? 'active' : ''
    },
    { 
      icon: isDark ? <Sun /> : <Moon />, 
      label: isDark ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme,
      className: 'theme-toggle'
    }
  ]

  return (
    <>
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-semibold text-primary">
              Bubble
            </h1>
            <span className="text-sm text-secondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </header>
      
      {/* Spacer for fixed header */}
      <div className="h-14" />
      
      {/* Dock Navigation */}
      <Dock
        items={dockItems}
        className="hidden md:flex"
        baseItemSize={48}
        magnification={60}
        distance={140}
        panelHeight={56}
      />
      
      {/* Mobile Bottom Navigation (fallback for mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-40">
        <div className="flex justify-around py-2">
          {dockItems.slice(0, 4).map((item, index) => {
            const isActive = item.className === 'active'
            return (
              <button
                key={index}
                onClick={item.onClick}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive ? 'text-accent' : 'text-secondary'
                }`}
              >
                <div className="w-5 h-5">{item.icon}</div>
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Navigation
