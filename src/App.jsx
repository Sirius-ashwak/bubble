import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navigation from './components/Navigation'
import MoodCheckIn from './pages/MoodCheckIn'
import JournalPage from './pages/JournalPage'
import CopingToolkit from './pages/CopingToolkit'
import Dashboard from './pages/Dashboard'
import LandingPage from './pages/LandingPage'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  const [showLanding, setShowLanding] = useState(true)

  const handleEnterApp = () => {
    setShowLanding(false)
  }

  if (showLanding) {
    return (
      <ThemeProvider>
        <LandingPage onEnter={handleEnterApp} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container pb-24 md:pb-32">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/mood" element={<MoodCheckIn />} />
                  <Route path="/journal" element={<JournalPage />} />
                  <Route path="/coping" element={<CopingToolkit />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </Router>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App
