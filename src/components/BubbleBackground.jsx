import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([])
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    // Generate premium floating orbs
    const generateBubbles = () => {
      const newBubbles = []
      for (let i = 0; i < 8; i++) {
        newBubbles.push({
          id: i,
          size: Math.random() * 150 + 50,
          left: Math.random() * 100,
          delay: Math.random() * 10,
          duration: Math.random() * 20 + 30,
          color: ['#667eea', '#764ba2', '#f093fb', '#23a6d5'][Math.floor(Math.random() * 4)]
        })
      }
      setBubbles(newBubbles)
    }
    
    // Generate small particles
    const generateParticles = () => {
      const newParticles = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          size: Math.random() * 4 + 2,
          left: Math.random() * 100,
          delay: Math.random() * 15,
          duration: Math.random() * 15 + 10
        })
      }
      setParticles(newParticles)
    }
    
    generateBubbles()
    generateParticles()
  }, [])
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large floating orbs with gradient */}
      {bubbles.map(bubble => (
        <motion.div
          key={`bubble-${bubble.id}`}
          className="absolute rounded-full opacity-10"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            background: `radial-gradient(circle at 30% 30%, ${bubble.color}40, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          initial={{ y: '110vh', x: 0, scale: 0 }}
          animate={{ 
            y: '-110vh',
            x: [0, 50, -30, 0],
            scale: [0, 1, 1, 0.5],
            opacity: [0, 0.15, 0.15, 0]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Small glowing particles */}
      {particles.map(particle => (
        <motion.div
          key={`particle-${particle.id}`}
          className="absolute rounded-full bg-white"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.8)`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{ 
            y: '-100vh',
            opacity: [0, 1, 1, 0],
            x: [0, Math.random() * 100 - 50]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  )
}

export default BubbleBackground
