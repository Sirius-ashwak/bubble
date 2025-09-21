import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Brain, Sparkles, Star, Zap, Shield } from 'lucide-react'
import Orb from '../components/Orb'

const LandingPage = ({ onEnter }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 dark:bg-gray-950 relative overflow-hidden">
      {/* Simple background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950 dark:from-gray-950 dark:to-black"></div>
      
      {/* Central orb - simplified */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <div className="w-[600px] h-[600px]">
          <Orb
            hoverIntensity={0.3}
            rotateOnHover={true}
            hue={260}
            forceHoverState={false}
          />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Hero Section - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Simple Logo/Brand */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              Bubble
            </h1>
            
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Heart className="w-6 h-6 text-purple-400" />
              <span className="text-xl text-gray-300">Your Mental Wellness Sanctuary</span>
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
          </motion.div>

          {/* Simple Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <p className="text-2xl md:text-3xl text-gray-300 mb-6 leading-relaxed font-light italic">
              "A fragile bubble, born at the world's depths, floating gently into light"
            </p>
            <p className="text-xl text-gray-400 mb-4 leading-relaxed">
              Step into your safe space where emotions flow freely.
            </p>
            <p className="text-lg text-gray-500">
              Track your feelings, capture thoughts, and discover inner peace.
            </p>
          </motion.div>

          {/* Simple Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
          >
            {/* Feature 1 - Simple */}
            <div className="bg-gray-800 dark:bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
              <Heart className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-3 text-lg">Feeling Bubbles</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Track your emotions and watch patterns emerge over time.
              </p>
            </div>

            {/* Feature 2 - Simple */}
            <div className="bg-gray-800 dark:bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
              <Brain className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-3 text-lg">Thought Streams</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Journal your thoughts with AI-powered insights and guidance.
              </p>
            </div>

            {/* Feature 3 - Simple */}
            <div className="bg-gray-800 dark:bg-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-indigo-500 transition-all duration-300">
              <Sparkles className="w-8 h-8 text-indigo-400 mb-4 mx-auto" />
              <h3 className="text-white font-semibold mb-3 text-lg">Calm Currents</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Find peace with personalized coping tools and techniques.
              </p>
            </div>
          </motion.div>

          {/* Simple CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-center"
          >
            <button
              onClick={onEnter}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto"
            >
              <span className="text-lg">Enter Your Bubble</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-gray-500 text-sm mt-6">
              Your safe space for mental wellness
            </p>
          </motion.div>
        </motion.div>

        {/* Simple floating elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-indigo-500 rounded-full opacity-25 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
      </div>
    </div>
  )
}

export default LandingPage
